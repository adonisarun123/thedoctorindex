import { readFileSync } from "node:fs";

import { config } from "dotenv";

config({ path: ".env.local" });
config();

/**
 * Bulk import of doctor records from a CSV, with provenance on every row.
 *
 *   npm run db:import -- --file data/import.csv --source "Karnataka Medical Council register" --dry
 *   npm run db:import -- --file data/import.csv --source "..." --publish
 *
 * Rules the importer enforces, because the site promises them on every page:
 *
 *  - Every row names where the record came from: --source (the dataset) and a
 *    per-row `source_url` (the page or register entry it was taken from). Rows
 *    without a source URL are rejected. The source is written to
 *    doctors.source as "import:<name>" and the URL into the audit log.
 *  - Records import as DRAFT (unclaimed, not indexable, not visible) unless
 *    --publish is given. Nothing imported is marked verified: registration and
 *    qualification stay "submitted" until staff check them against the council
 *    register in the admin console, exactly as for a doctor's own submission.
 *  - Duplicates are detected by council + registration number; a duplicate row
 *    is skipped and reported, never merged silently.
 *  - Only sources you are permitted to use. Practo, Justdial, Lybrate and the
 *    like forbid scraping in their terms and their data carries no verification
 *    you can stand behind. Permitted inputs: State Medical Council / NMC IMR
 *    register lookups, hospital and clinic sites with permission, and doctor
 *    self-submissions (which have their own flow at /add-doctor).
 *
 * CSV columns (header row required; order free; unknown columns ignored):
 *
 *   name*             "Anita Sharma" (no "Dr")
 *   gender            F | M | X
 *   specialty*        key, slug or alias: cardiology | cardiologists | heart specialist
 *   subspecialties    "Interventional cardiology|Heart failure"
 *   registration_number*, council*, registered_year
 *   qualifications    "MBBS@Bangalore Medical College@2004|MD (General Medicine)@AIIMS@2008"
 *   practice_start_year, languages ("English|Kannada|Hindi"), modes ("In person|Online")
 *   about, services ("ECG|Echo")
 *   facility_name, locality (key or slug, e.g. indiranagar), address, postal_code, days, hours, fee_inr, phone
 *   source_url*       where this row's data was read from
 *   source_ref        register entry id / page reference (optional)
 *
 * Phone numbers are stored but never rendered publicly; they feed the
 * sign-in-gated Call button only.
 */

type Row = Record<string, string>;

function parseCsv(text: string): Row[] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      cur.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      cur.push(field);
      field = "";
      if (cur.some((v) => v.trim() !== "")) rows.push(cur);
      cur = [];
    } else field += c;
  }
  if (field !== "" || cur.length) {
    cur.push(field);
    if (cur.some((v) => v.trim() !== "")) rows.push(cur);
  }
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return rows.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

const list = (v: string | undefined) => (v ?? "").split("|").map((x) => x.trim()).filter(Boolean);
const int = (v: string | undefined) => (v && /^\d{4}$/.test(v.trim()) ? Number(v) : null);
const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const has = (name: string) => process.argv.includes(`--${name}`);

async function main() {
  const file = arg("file");
  const sourceName = arg("source");
  if (!file || !sourceName) {
    console.error("usage: npm run db:import -- --file <csv> --source <dataset name> [--dry] [--publish] [--limit N]");
    process.exit(2);
  }
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const dry = has("dry");
  const publish = has("publish");
  const limit = Number(arg("limit") ?? Infinity);

  const [{ createDoctor }, taxonomy] = await Promise.all([import("../lib/services/doctors"), import("../lib/data/taxonomy")]);
  const { resolveSpecialtyQuery, specialtyBySlug, specialtyByKey, localityBySlug, LOCALITIES } = taxonomy;

  const rows = parseCsv(readFileSync(file, "utf8")).slice(0, limit);
  console.log(`${rows.length} rows from ${file} · source "${sourceName}"${dry ? " · DRY RUN" : ""}${publish ? " · publishing" : " · as drafts"}`);

  let created = 0, skipped = 0, failed = 0;
  const seen = new Set<string>();
  for (const [n, r] of rows.entries()) {
    const line = n + 2;
    const problems: string[] = [];
    const name = (r.name ?? "").replace(/^dr\.?\s+/i, "").trim();
    if (!name || !/^[\p{L}][\p{L} .'-]{1,79}$/u.test(name)) problems.push("name missing or not a plain personal name");
    const specialty = r.specialty ? specialtyByKey(r.specialty) ?? specialtyBySlug(r.specialty) ?? resolveSpecialtyQuery(r.specialty) : null;
    if (!specialty) problems.push(`specialty "${r.specialty}" not one of the open specialities`);
    if (!r.registration_number) problems.push("registration_number missing");
    if (!r.council) problems.push("council missing");
    if (!r.source_url || !/^https?:\/\//.test(r.source_url)) problems.push("source_url missing (provenance is mandatory)");
    const gender = r.gender && ["F", "M", "X"].includes(r.gender.toUpperCase()) ? (r.gender.toUpperCase() as "F" | "M" | "X") : null;
    let locality = r.locality ? (LOCALITIES as Record<string, { key: string }>)[r.locality] ?? localityBySlug(r.locality) : null;
    if (r.facility_name && !locality) problems.push(`locality "${r.locality}" is not an open locality (${Object.keys(LOCALITIES).join(", ")})`);
    if (r.facility_name && !r.address) problems.push("address required with facility_name");
    const dupKey = `${(r.council ?? "").toLowerCase()}|${(r.registration_number ?? "").replace(/\W+/g, "").toLowerCase()}`;
    if (seen.has(dupKey)) problems.push("duplicate registration within this file");
    seen.add(dupKey);

    if (problems.length) {
      failed++;
      console.log(`  ✗ line ${line} ${name || "(no name)"}: ${problems.join("; ")}`);
      continue;
    }
    if (!locality && r.facility_name) locality = null;

    const input = {
      name,
      gender,
      specialtyKey: specialty!.key,
      subspecialties: list(r.subspecialties),
      practiceStartYear: int(r.practice_start_year),
      languages: list(r.languages),
      modes: list(r.modes).length ? list(r.modes) : ["In person"],
      about: r.about ?? "",
      services: list(r.services),
      registration: { number: r.registration_number, council: r.council, registeredYear: int(r.registered_year), verified: false },
      qualifications: list(r.qualifications).map((q) => {
        const [degree, institution, year] = q.split("@").map((x) => x.trim());
        return { degree, institution: institution ?? "", year: int(year), verified: false };
      }),
      practices: r.facility_name && locality
        ? [{ facilityName: r.facility_name, localityKey: locality.key, address: r.address, postalCode: r.postal_code || undefined, days: r.days || "", hours: r.hours || "", feeInr: r.fee_inr && /^\d+$/.test(r.fee_inr) ? Number(r.fee_inr) : null, phone: r.phone || undefined, confirmed: false }]
        : [],
      status: publish ? ("published" as const) : ("draft" as const),
      source: `import:${sourceName}`,
    };

    if (dry) {
      created++;
      console.log(`  + line ${line} Dr ${name} · ${specialty!.name} · ${r.council} ${r.registration_number}${locality ? ` · ${locality.key}` : ""} ← ${r.source_url}`);
      continue;
    }
    try {
      const res = await createDoctor(input, null, "system");
      const { audit } = await import("../lib/services/audit");
      await audit({ actorRole: "system", action: "doctor.imported", entityType: "doctor", entityId: res.id, after: { source: sourceName, sourceUrl: r.source_url, sourceRef: r.source_ref || null, file, line } });
      created++;
      console.log(`  + line ${line} Dr ${name} → /doctor/${res.slug}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/already exists/.test(msg)) {
        skipped++;
        console.log(`  = line ${line} Dr ${name}: ${msg} (skipped)`);
      } else {
        failed++;
        console.log(`  ✗ line ${line} Dr ${name}: ${msg}`);
      }
    }
  }
  console.log(`\n${dry ? "would create" : "created"} ${created}, duplicates skipped ${skipped}, rejected ${failed}`);
  if (!dry && created) console.log("Imported records are drafts: verify registration and qualifications in /admin/doctors before publishing.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
