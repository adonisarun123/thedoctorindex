import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { config } from "dotenv";

config({ path: ".env.local" });
config();

/**
 * Turn register-matched harvest records into CSVs the importer accepts.
 *
 *   npm run db:build-import -- [--in data/private/harvest/matched.json] [--out data/private/import]
 *
 * Three jobs, in order:
 *
 *  1. Identity. Records are grouped by registration number, because that is the
 *     only thing that says two hospital pages are the same doctor. Records with
 *     no number are never merged with anything — two unmatched "Suresh Kumar"
 *     rows stay two drafts rather than becoming one wrong profile.
 *  2. Speciality. The hospital's own department name is mapped to the site's
 *     taxonomy, via the taxonomy's resolver plus the alias table below for the
 *     department names hospitals actually use. A record whose speciality cannot
 *     be established honestly is dropped, not guessed at.
 *  3. Shape. One CSV per hospital source, split into a `-publish` file (has a
 *     registration number) and a `-draft` file (does not). Photo URLs go to a
 *     sidecar, never into the CSV: nothing in the import pipeline can publish a
 *     portrait we have no consent for.
 */

const args = process.argv.slice(2);
const arg = (k: string, d: string) => {
  const i = args.indexOf(k);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const IN = arg("--in", "data/private/harvest/matched.json");
const OUT = arg("--out", "data/private/import");

/** Hospital department names → taxonomy keys. Only mappings that are true, not convenient. */
const SPECIALTY_ALIASES: Record<string, string> = {
  "paediatric and child care": "paediatrics",
  "paediatric care": "paediatrics",
  "pediatric care": "paediatrics",
  neonatology: "paediatrics",
  "neonatology & nicu": "paediatrics",
  "paediatric critical care medicine": "paediatrics",
  "child development": "paediatrics",
  "cardiac sciences": "cardiology",
  "adult cardiac surgery": "cardiothoracic-surgery",
  "cardiac surgery": "cardiothoracic-surgery",
  "cardiothoracic and vascular surgery": "cardiothoracic-surgery",
  "vascular and endovascular surgery": "cardiothoracic-surgery",
  "vascular & endovascular surgery": "cardiothoracic-surgery",
  "thoracic surgery": "cardiothoracic-surgery",
  "gastrointestinal science": "gastroenterology",
  "gastro science": "gastroenterology",
  "integrated liver care": "gastroenterology",
  "liver transplantation surgery": "gi-surgery",
  "liver transplantation and hepatobiliary surgery": "gi-surgery",
  "hepatobiliary surgery": "gi-surgery",
  "cancer care": "medical-oncology",
  "cancer care/oncology": "medical-oncology",
  "comprehensive cancer care": "medical-oncology",
  "adult haemato-oncology & bmt": "haematology",
  "head & neck oncology": "surgical-oncology",
  "gynaecologic oncology": "surgical-oncology",
  fertility: "gynaecology",
  "fertility/ ivf": "gynaecology",
  "fetal medicine": "gynaecology",
  maternity: "gynaecology",
  "pregnancy care/ obstetrics": "gynaecology",
  "obstetrics & gynecology & reproductive medicine": "gynaecology",
  "reproductive medicine": "gynaecology",
  "e.n.t": "ent",
  "ear nose throat": "ent",
  "dental medicine": "dentistry",
  "dental sciences & maxillofacial surgery": "dentistry",
  "cranio-maxillo facial surgery": "plastic-surgery",
  "plastic, reconstructive and cosmetic surgery": "plastic-surgery",
  "cosmetology & plastic surgery": "plastic-surgery",
  "institute of cosmetology and cosmetic surgery": "cosmetology",
  neuroscience: "neurology",
  neurosciences: "neurology",
  "laboratory medicine": "pathology",
  "lab medicine": "pathology",
  "nuclear medicine": "radiology",
  "family medicine": "general-practice",
  "community health": "general-practice",
  "nutrition and diet science": "dietetics",
  "kidney transplant": "nephrology",
  "organ transplant": "general-surgery",
};

/** Departments that name no single speciality. The doctor's degrees decide instead. */
const AMBIGUOUS = new Set(["allied services", "support specialties", "other", "others", "general", "medical services", "clinical services"]);

/** Degrees → speciality, used only when the department is ambiguous or absent. */
const DEGREE_HINTS: Array<[RegExp, string]> = [
  [/\bMDS\b|\bBDS\b/i, "dentistry"],
  [/\bDNB\s*\(?\s*(paed|ped)|\bMD\s*\(?\s*(paed|ped)|\bDCH\b/i, "paediatrics"],
  [/\bMS\s*\(?\s*ortho|\bD\.?Ortho\b/i, "orthopaedics"],
  [/\bMS\s*\(?\s*(obg|obst)|\bDGO\b|\bMRCOG\b/i, "gynaecology"],
  [/\bMS\s*\(?\s*ent|\bDLO\b/i, "ent"],
  [/\bMS\s*\(?\s*oph|\bDO\b\s*\(?\s*oph|\bDNB\s*\(?\s*oph/i, "ophthalmology"],
  [/\bMD\s*\(?\s*derm|\bDDVL\b|\bDVD\b/i, "dermatology"],
  [/\bMD\s*\(?\s*(psych)|\bDPM\b/i, "psychiatry"],
  [/\bMD\s*\(?\s*(radio|radiodiag)|\bDMRD\b/i, "radiology"],
  [/\bMD\s*\(?\s*anaes|\bDA\b/i, "anaesthesiology"],
  [/\bMD\s*\(?\s*path|\bDCP\b/i, "pathology"],
  [/\bDM\s*\(?\s*cardio/i, "cardiology"],
  // MCh Neuro is a neurosurgeon; DM Neuro is a neurologist. Order matters.
  [/\bMCh\s*\(?\s*neuro|\bM\.?Ch\b.*neurosurg/i, "neurosurgery"],
  [/\bDM\s*\(?\s*neuro/i, "neurology"],
  [/\bDM\s*\(?\s*nephro/i, "nephrology"],
  [/\bDM\s*\(?\s*gastro/i, "gastroenterology"],
  [/\bMCh\s*\(?\s*uro|\bDNB\s*\(?\s*uro/i, "urology"],
  [/\bMPT\b|\bBPT\b/i, "physiotherapy"],
  // Only an explicit general-surgery degree. A bare "MS" says nothing: it is the
  // degree an orthopaedic, ENT, eye and general surgeon all hold.
  [/\bMS\s*\(?\s*(gen|general)\s*surg/i, "general-surgery"],
  [/\bMD\s*\(?\s*(gen|general)\s*med|\bMD\s*\(?\s*medicine/i, "internal-medicine"],
];

type Matched = {
  name: string;
  gender?: string | null;
  specialty?: string;
  subspecialties?: string[];
  qualifications?: string[];
  experience_years?: number | null;
  about?: string;
  services?: string[];
  languages?: string[];
  hospital?: string;
  branch?: string;
  address?: string;
  locality_hint?: string;
  postal_code?: string;
  phone?: string;
  days?: string;
  hours?: string;
  photo_url?: string | null;
  source_url: string;
  _file?: string;
  nmc: { status: string; number: string | null; council: string | null; registered_year: number | null; degree: string | null; university: string | null };
};

const csvCell = (v: unknown) => {
  const s = String(v ?? "").replace(/\r?\n/g, " ").trim();
  return /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const FOLD: Record<string, string> = {
  "rr nagar": "bengaluru-raja-rajeshwari-nagar",
  sahakarnagar: "bengaluru-sahakara-nagar",
  nagarabhavi: "nagarbhavi",
  varthur: "bangalore-urban-vartur",
  "varthur road": "bangalore-urban-vartur",
  "hsr layout 2nd sector": "hsr-layout",
  "aurobindo marg - jayanagar": "jayanagar",
  sarjapur: "sarjapur-road",
};

/**
 * Reject anything that is not one person's name, and tidy what is.
 *
 * Hospital listings occasionally yield a section heading ("Best Gynecologists in
 * Malleshwaram") or one card covering a team ("Dr A / Dr B"). A heading imported
 * as a doctor is a fabricated person; a team card cannot be attributed to anyone.
 * Both are dropped. Military ranks and trailing job descriptions are stripped.
 */
function sanitiseName(raw: string, cleanPersonName: (s: string) => string): string | null {
  let n = (raw ?? "").replace(/\s+/g, " ").trim();
  if (!n) return null;
  // More than one doctor on one card.
  if (/[/|]|\band\s+dr\b|\s&\s*dr\b/i.test(n)) return null;
  // A listing heading, not a person.
  if (/^(best|top|our|find|book|meet|the|all)\b/i.test(n)) return null;
  if (/\b(doctors?|specialists?|surgeons?|physicians?|consultants?)\b/i.test(n)) return null;
  // Military and academic ranks the shared honorific rule does not cover.
  n = n.replace(/^((sqn|wg)\s*ldr|group\s*capt|gp\s*capt|col|lt\s*col|maj|capt|brig|air\s*cmde|surg)\.?\s*/i, "");
  // "Dr"/"Prof" stripping is the codebase's single rule; don't grow a second one here.
  n = cleanPersonName(n);
  // "Sandeep Gonam - Pediatrician & Neonatologist"
  n = n.replace(/\s+[-–—]\s+.*$/, "").trim();
  if (!/^[\p{L}][\p{L} .'-]{1,79}$/u.test(n)) return null;
  const words = n.split(/\s+/).filter((w) => w.replace(/[^\p{L}]/gu, "").length > 0);
  if (words.length < 2 || words.length > 5) return null;
  return n;
}

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const bare = (key: string) => key.replace(/^(bengaluru|bangalore|bangalore-urban)-/, "").replace(/[^a-z0-9]/g, "");

/**
 * Does this record's name agree with the page it claims to come from?
 *
 * Every profile cites a source URL, so a name paired with someone else's URL
 * attributes one doctor's credentials to another. A handful of listings pair a
 * card's name with the next card's link; those are dropped rather than
 * published with a citation that does not check out. Spelling differences
 * between a listing and its slug are tolerated — "Venkata Narasimhan N. S." at
 * /dr-venkatanarasimhan-n-s is the same person.
 */
function provenanceAgrees(name: string, sourceUrl: string): boolean {
  const seg = sourceUrl.replace(/[?#].*$/, "").replace(/\/$/, "").split("/").pop() ?? "";
  const slug = seg.toLowerCase().replace(/[^a-z]+/g, " ").replace(/^\s*dr\s+/, "").trim();
  if (!slug) return true; // some sites use numeric ids; nothing to check against
  const slugWords = slug.split(/\s+/);
  const tokens = name.toLowerCase().split(/[^a-z]+/).filter((t) => t.length > 2);
  if (tokens.some((t) => slugWords.includes(t))) return true;
  const a = name.toLowerCase().replace(/[^a-z]/g, "");
  const b = slug.replace(/[^a-z]/g, "");
  return Boolean(a && b && (a.includes(b) || b.includes(a)));
}

async function main() {
  if (!existsSync(IN)) throw new Error(`${IN} not found — run npm run db:match first`);
  const [{ resolveSpecialtyQuery, specialtyByKey, specialtyBySlug }, { getGeo }, { cleanPersonName }] = await Promise.all([
    import("../lib/data/taxonomy"),
    import("../lib/data/geo"),
    import("../lib/services/doctors"),
  ]);
  const geo = await getGeo();
  const localityByBare = new Map<string, string>();
  for (const l of geo.localities) {
    localityByBare.set(bare(l.key), l.key);
    if (l.slug) localityByBare.set(bare(l.slug), l.key);
  }

  const rows = JSON.parse(readFileSync(IN, "utf8")) as Matched[];
  console.log(`${rows.length} matched records`);

  const resolveSpecialty = (r: Matched): string | null => {
    const raw = (r.specialty ?? "").trim().toLowerCase();
    if (raw && !AMBIGUOUS.has(raw)) {
      const alias = SPECIALTY_ALIASES[raw];
      if (alias) return alias;
      const hit = specialtyByKey(raw) ?? specialtyBySlug(raw) ?? resolveSpecialtyQuery(raw);
      if (hit) return hit.key;
    }
    const quals = (r.qualifications ?? []).join(" ");
    for (const [re, key] of DEGREE_HINTS) if (re.test(quals)) return key;
    if (raw) {
      // Last chance: a department like "Institute of Renal Sciences" often still
      // contains the speciality word the resolver knows.
      for (const word of raw.split(/[^a-z]+/).filter((w) => w.length > 4)) {
        const hit = resolveSpecialtyQuery(word);
        if (hit) return hit.key;
      }
    }
    return null;
  };

  const resolveLocality = (hint: string | undefined): string | null => {
    const h = (hint ?? "").replace(/\s*clinic\s*$/i, "").trim();
    if (!h) return null;
    const folded = FOLD[h.toLowerCase()];
    return localityByBare.get(bare(folded ?? slugify(h))) ?? null;
  };

  /** Group by registration number; unmatched records each stand alone. */
  const groups = new Map<string, Matched[]>();
  for (const [i, r] of rows.entries()) {
    const key = r.nmc?.number ? `reg|${r.nmc.council ?? ""}|${r.nmc.number}`.toLowerCase() : `solo|${i}`;
    const g = groups.get(key);
    if (g) g.push(r);
    else groups.set(key, [r]);
  }
  console.log(`${groups.size} distinct doctors (${rows.length - groups.size} cross-hospital duplicates merged on registration)`);

  const weight = (r: Matched) => (r.qualifications?.length ?? 0) * 2 + (r.about ? 3 : 0) + (r.address ? 2 : 0) + (r.photo_url ? 1 : 0) + (r.languages?.length ?? 0);

  const bySource = new Map<string, string[][]>();
  const photos: Array<{ source_url: string; photo_url: string; source: string }> = [];
  const extraPractices: Array<{ registration: string; hospital: string; branch: string; address: string; locality: string; phone: string; source_url: string }> = [];
  const dropped: Record<string, number> = {};

  for (const group of groups.values()) {
    const usable = group.filter((r) => {
      const clean = sanitiseName(r.name, cleanPersonName);
      if (!clean) {
        dropped.name = (dropped.name ?? 0) + 1;
        return false;
      }
      r.name = clean;
      if (!provenanceAgrees(clean, r.source_url)) {
        dropped.provenance = (dropped.provenance ?? 0) + 1;
        return false;
      }
      return true;
    });
    if (!usable.length) continue;
    const sorted = [...usable].sort((a, b) => weight(b) - weight(a));
    const primary = sorted[0];

    const specialtyKey = resolveSpecialty(primary) ?? sorted.map(resolveSpecialty).find(Boolean) ?? null;
    if (!specialtyKey) {
      dropped.specialty = (dropped.specialty ?? 0) + group.length;
      continue;
    }
    const localityKey = resolveLocality(primary.locality_hint) ?? sorted.map((r) => resolveLocality(r.locality_hint)).find(Boolean) ?? null;
    if (primary.address && !localityKey) {
      dropped.locality = (dropped.locality ?? 0) + group.length;
      continue;
    }

    const source = (primary._file ?? "unknown.json").replace(/\.json$/, "");
    const reg = primary.nmc?.number ?? "";
    const council = primary.nmc?.council ?? "";

    // The register's own degree line is a fact from the register; keep it first.
    const quals = new Set<string>();
    if (primary.nmc?.degree) quals.add(`${primary.nmc.degree}@${primary.nmc.university ?? ""}@`);
    for (const r of sorted) for (const q of r.qualifications ?? []) quals.add(`${q}@@`);

    const subs = new Set<string>();
    for (const r of sorted) for (const x of r.subspecialties ?? []) if (x && x.length < 60) subs.add(x);

    const practiceStart = primary.experience_years && primary.experience_years > 0 ? new Date().getFullYear() - primary.experience_years : "";

    const row: string[] = [
      primary.name,
      (primary.gender ?? "").toUpperCase().slice(0, 1),
      specialtyKey,
      [...subs].slice(0, 6).join("|"),
      reg,
      reg ? council || "Karnataka Medical Council" : "",
      String(primary.nmc?.registered_year ?? ""),
      // Only a unique tight match or a number the register itself confirmed.
      reg && (primary.nmc?.status === "confirmed" || primary.nmc?.status === "matched") ? "true" : "",
      [...quals].slice(0, 10).join("|"),
      String(practiceStart),
      (primary.languages ?? []).join("|"),
      "In person",
      (primary.about ?? "").slice(0, 1500),
      (primary.services ?? []).slice(0, 12).join("|"),
      primary.hospital ?? "",
      localityKey ?? "",
      primary.address ?? "",
      primary.postal_code ?? "",
      primary.days ?? "",
      primary.hours ?? "",
      "",
      primary.phone ?? "",
      primary.source_url,
      // source_ref is UNIQUE per (source, source_ref) — it identifies THIS record on
      // the source, not the branch it belongs to. The branch lives on the facility.
      "",
    ];
    const bucket = `${source}-${reg ? "publish" : "draft"}`;
    if (!bySource.has(bucket)) bySource.set(bucket, []);
    bySource.get(bucket)!.push(row);

    for (const r of sorted) {
      if (r.photo_url) photos.push({ source_url: primary.source_url, photo_url: r.photo_url, source: `hospital:${source}` });
    }
    for (const r of sorted.slice(1)) {
      if (!reg) continue;
      const lk = resolveLocality(r.locality_hint);
      if (lk && r.address && (r.hospital !== primary.hospital || lk !== localityKey)) {
        extraPractices.push({ registration: `${council} ${reg}`, hospital: r.hospital ?? "", branch: r.branch ?? "", address: r.address, locality: lk, phone: r.phone ?? "", source_url: r.source_url });
      }
    }
  }

  mkdirSync(OUT, { recursive: true });
  const header = ["name", "gender", "specialty", "subspecialties", "registration_number", "council", "registered_year", "registration_verified", "qualifications", "practice_start_year", "languages", "modes", "about", "services", "facility_name", "locality", "address", "postal_code", "days", "hours", "fee_inr", "phone", "source_url", "source_ref"];

  let publishTotal = 0;
  let draftTotal = 0;
  for (const [bucket, rows] of [...bySource].sort()) {
    const csv = [header.join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\n");
    writeFileSync(join(OUT, `${bucket}.csv`), csv + "\n");
    if (bucket.endsWith("-publish")) publishTotal += rows.length;
    else draftTotal += rows.length;
    console.log(`  ${bucket}.csv — ${rows.length}`);
  }
  writeFileSync(join(OUT, "photo-candidates.json"), JSON.stringify(photos, null, 1));
  writeFileSync(join(OUT, "extra-practices.json"), JSON.stringify(extraPractices, null, 1));

  console.log(`\npublishable ${publishTotal} · drafts ${draftTotal} · photo candidates ${photos.length} · extra practices ${extraPractices.length}`);
  if (Object.keys(dropped).length) console.log(`dropped: ${Object.entries(dropped).map(([k, v]) => `${k} ${v}`).join(", ")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
