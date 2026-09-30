import { readFileSync } from "node:fs";

import { config } from "dotenv";
import { and, eq, inArray, sql as raw } from "drizzle-orm";

import { getDb } from "../../lib/db/client";
import { todayIso } from "../../lib/db/dates";
import * as s from "../../lib/db/schema";
import { coreTokens, nameCovers, nameTight } from "../../lib/enrich/names";
import { COUNCILS_BY_STATE } from "../../lib/enrich/nmc";
import { cleanName } from "../../lib/nmc/classify";
import { createDoctor, normalizeKey } from "../../lib/services/doctors";
import { revalidateSite } from "../revalidate-site";
import { resolveSpecialty } from "./harvest-specialty";
import { Placer, publishFromPlacement, type Placement } from "./publish-listing";

config({ path: ".env.local" });
config();

/**
 * Hospital roster → register → profile.
 *
 *   npm run nmc:harvest -- --in data/private/harvest/manipal-in.json [--in …] [--dry] [--limit N]
 *
 * For every doctor a hospital's own site lists (data/private/harvest/*.json,
 * records with name, department, degrees, unit, city, state, page URL):
 *
 *   1. Find the doctor on the offline register: by the registration number
 *      when the hospital prints one, else by name — exactly one person in
 *      the hospital state's council(s) or the MCI whose name covers the
 *      roster name tightly, and whose recorded speciality does not
 *      contradict the department (a register "general surgery" may be a
 *      hospital "urology"; a register "dermatology" may not).
 *   2. Then, by what the register row already links to:
 *      - a register-built DRAFT → published with the hospital as practice
 *        (scripts/nmc/publish-listing.ts), plus the hospital's bio, services,
 *        languages and sub-speciality;
 *      - nothing (an MBBS-only or branch-less entry) → a new profile,
 *        published, source import:hospital:<id>, speciality from the
 *        department, registration verified against the register;
 *      - an existing published profile → left alone (counted).
 *   3. Roster doctors the register cannot place uniquely are counted and
 *      written to <in>.unmatched.json — never imported on a name alone.
 */

const args = process.argv.slice(2);
const INS = args.flatMap((a, i) => (a === "--in" && args[i + 1] ? [args[i + 1]] : []));
const DRY = args.includes("--dry");
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : Infinity;
if (!INS.length) {
  console.error("usage: npm run nmc:harvest -- --in <harvest.json> [--in …] [--dry] [--limit N]");
  process.exit(2);
}
const REG_SOURCE = "nmc-imr-export-2026-09-29";
const NMC_SOURCE = "import:nmc-register (nmc.org.in IMR export 2026-09-29)";

type Roster = { name: string; specialty?: string; subspecialties?: string[]; qualifications?: string[]; experience_years?: number | null; about?: string; services?: string[]; languages?: string[]; hospital: string; branch?: string; address?: string; locality_hint?: string; postal_code?: string; phone?: string; days?: string; hours?: string; photo_url?: string | null; source_url: string; registration_number?: string | null; city?: string; state?: string };

/** A register speciality that a hospital department may legitimately specialise from. */
const PARENT: Record<string, string[]> = {
  cardiology: ["internal-medicine"], neurology: ["internal-medicine"], nephrology: ["internal-medicine"], gastroenterology: ["internal-medicine"], endocrinology: ["internal-medicine"], pulmonology: ["internal-medicine"], rheumatology: ["internal-medicine"], haematology: ["internal-medicine", "pathology"], "medical-oncology": ["internal-medicine", "radiation-oncology"], "critical-care": ["internal-medicine", "anaesthesiology"], "infectious-diseases": ["internal-medicine"], geriatrics: ["internal-medicine"], diabetology: ["internal-medicine"], "general-practice": ["internal-medicine"], "emergency-medicine": ["internal-medicine", "anaesthesiology", "general-surgery"],
  urology: ["general-surgery"], neurosurgery: ["general-surgery"], "plastic-surgery": ["general-surgery"], "paediatric-surgery": ["general-surgery"], "surgical-oncology": ["general-surgery", "gynaecology", "ent"], "gi-surgery": ["general-surgery"], "cardiothoracic-surgery": ["general-surgery"], "transplant-surgery": ["general-surgery", "urology", "gi-surgery"],
  "radiation-oncology": ["radiology"], "nuclear-medicine": ["radiology"], "physical-medicine-rehabilitation": ["orthopaedics"], "sexual-medicine": ["psychiatry", "dermatology", "urology"], cosmetology: ["dermatology", "plastic-surgery"],
};
const specialtyFits = (register: string | null, hospital: string) => !register || register === hospital || (PARENT[hospital] ?? []).includes(register);

const NON_MEDICAL = new Set(["dentistry", "ayush", "physiotherapy", "clinical-psychology", "dietetics", "audiology", "occupational-therapy", "acupuncture"]);
const digits = (v: string) => v.replace(/\D/g, "");

async function main() {
  const db = getDb();
  const today = todayIso();
  const placer = new Placer();
  await placer.load();
  const counts = new Map<string, number>();
  const bump = (k: string) => counts.set(k, (counts.get(k) ?? 0) + 1);
  let published = 0, created = 0;

  for (const IN of INS) {
    const id = IN.split("/").pop()!.replace(/\.json$/, "");
    const host = (() => { try { return new URL((JSON.parse(readFileSync(IN, "utf8")) as Roster[])[0]?.source_url ?? "").host.replace(/^www\./, ""); } catch { return ""; } })();
    const SOURCE = `import:hospital:${id.replace(/-in$/, "")} (${host})`;
    const rows = (JSON.parse(readFileSync(IN, "utf8")) as Roster[]).slice(0, LIMIT);
    console.log(`\n${IN}: ${rows.length} roster records${DRY ? " · DRY RUN" : ""}`);
    const unmatched: Array<Roster & { reason: string }> = [];
    const seenRegister = new Set<number>();

    for (const r of rows) {
      const stateSlug = r.state ?? "karnataka";
      const city = r.city ?? "Bengaluru";
      const councils = [...(COUNCILS_BY_STATE[stateSlug] ?? []), "MCI"];
      const specialtyKey = resolveSpecialty(r);
      if (!specialtyKey) { bump("department unmapped"); unmatched.push({ ...r, reason: `department "${r.specialty}"` }); continue; }
      if (NON_MEDICAL.has(specialtyKey)) { bump("non-medical role (not on the medical register)"); continue; }
      // "SAKET MITTAL" → "Saket Mittal"; an institution string in the name field is not a doctor.
      const displayName = cleanName(r.name);
      if (!displayName || /\b(doctors?|best|top|our|refer|awards?|filter|specialists?|team|department|clinic|centre|center|hospital|patient|book|appointment)\b/i.test(displayName)) { bump("name unusable"); continue; }
      r.name = displayName;
      const core = coreTokens(r.name);
      if (core.length < 2) { bump("name too short"); unmatched.push({ ...r, reason: "name too short" }); continue; }

      // 1. Register entry.
      type Entry = { sourceRecordId: number; name: string; nameClean: string | null; council: string; councilCode: string | null; number: string; numberNormalized: string; qualification: string | null; qualificationYear: number | null; university: string | null; specialtyKey: string | null; category: string; eraYear: number | null; doctorId: string | null; removed: boolean; nameSorted: string | null };
      const cols = { sourceRecordId: s.nmcRegister.sourceRecordId, name: s.nmcRegister.name, nameClean: s.nmcRegister.nameClean, council: s.nmcRegister.council, councilCode: s.nmcRegister.councilCode, number: s.nmcRegister.number, numberNormalized: s.nmcRegister.numberNormalized, qualification: s.nmcRegister.qualification, qualificationYear: s.nmcRegister.qualificationYear, university: s.nmcRegister.university, specialtyKey: s.nmcRegister.specialtyKey, category: s.nmcRegister.category, eraYear: s.nmcRegister.eraYear, doctorId: s.nmcRegister.doctorId, removed: s.nmcRegister.removed, nameSorted: s.nmcRegister.nameSorted };
      let entry: Entry | null = null;
      let how = "";
      if (r.registration_number) {
        const num = normalizeKey(r.registration_number);
        const keys = [...new Set([num, digits(r.registration_number)].filter((k) => k.length >= 3))];
        const hits = (await db.select(cols).from(s.nmcRegister).where(and(inArray(s.nmcRegister.numberNormalized, keys), inArray(s.nmcRegister.councilCode, councils)))) as Entry[];
        const named = hits.filter((h) => nameCovers(h.nameClean ?? h.name, r.name) || nameCovers(r.name, h.nameClean ?? h.name));
        if (named.length === 1) { entry = named[0]; how = "number"; }
      }
      if (!entry) {
        const cands = (await db
          .select(cols)
          .from(s.nmcRegister)
          .where(and(raw`${s.nmcRegister.nameTokens} @> ${raw.raw(`'{${core.map((t) => `"${t}"`).join(",")}}'::text[]`)}`, inArray(s.nmcRegister.councilCode, councils), raw`${s.nmcRegister.category} not in ('no-number','name-unusable')`, raw`coalesce(${s.nmcRegister.eraYear}, 2000) >= 1965`, eq(s.nmcRegister.removed, false)))
          .limit(40)) as Entry[];
        const tight = cands.filter((c) => nameTight(c.nameClean ?? c.name, r.name) && specialtyFits(c.specialtyKey, specialtyKey));
        const people = new Map<string, Entry[]>();
        for (const c of tight) people.set(`${c.nameSorted ?? c.name}|${c.qualificationYear ?? ""}`, [...(people.get(`${c.nameSorted ?? c.name}|${c.qualificationYear ?? ""}`) ?? []), c]);
        if (people.size === 1) {
          const group = [...people.values()][0];
          entry = group.find((c) => c.councilCode !== "MCI") ?? group[0];
          how = "unique name";
        } else if (people.size > 1) {
          bump("ambiguous on the register");
          unmatched.push({ ...r, reason: `${people.size} register entries fit` });
          continue;
        } else {
          bump(cands.length ? "no register entry fits (name/speciality)" : "not on the register");
          unmatched.push({ ...r, reason: cands.length ? "no tight name + speciality fit" : "not found" });
          continue;
        }
      }
      if (entry.removed) { bump("struck off"); continue; }
      if (seenRegister.has(entry.sourceRecordId)) { bump("same doctor twice in this roster"); continue; }
      seenRegister.add(entry.sourceRecordId);

      // 2. The placement the hospital gives.
      const address = [r.address, r.locality_hint && !(r.address ?? "").toLowerCase().includes(r.locality_hint.toLowerCase()) ? r.locality_hint : null].filter(Boolean).join(", ") || `${r.hospital}, ${city}`;
      const placement: Placement = { evidence: "hospital-roster", query: r.source_url, facilityName: r.branch && !r.hospital.toLowerCase().includes(r.branch.toLowerCase()) && !/^[A-Z][a-z]+$/.test(r.branch) ? `${r.hospital}, ${r.branch}` : r.hospital, address, postalCode: r.postal_code?.match(/\d{6}/)?.[0] ?? null, lat: null, lng: null, phone: r.phone || null, website: null, city, locality: r.locality_hint || null, placeId: null, mapsUri: null, urls: [r.source_url], reasons: [`${r.hospital} lists the doctor (${how} match to register entry ${entry.sourceRecordId})`], confidence: "0.9" };

      if (entry.doctorId) {
        const [doc] = await db.select({ id: s.doctors.id, status: s.doctors.status, source: s.doctors.source, slug: s.doctors.slug, about: s.doctors.about }).from(s.doctors).where(eq(s.doctors.id, entry.doctorId));
        if (!doc) { bump("register link to a missing profile"); continue; }
        if (doc.status !== "draft" || !doc.source.startsWith("import:nmc-register")) { bump(`already on the site (${doc.status})`); continue; }
        bump("draft → published");
        console.log(`  ✓ ${r.name} (${specialtyKey}) → ${placement.facilityName}, ${city} · draft /doctor/${doc.slug}`);
        if (DRY) continue;
        const res = await publishFromPlacement({ id: doc.id, name: r.name, slug: doc.slug, state_slug: stateSlug, source_record_id: entry.sourceRecordId }, placement, placer);
        if (!res.ok) { bump(res.reason!); continue; }
        await db.update(s.doctors).set({
          specialtyKey: specialtyFits(entry.specialtyKey, specialtyKey) && entry.specialtyKey !== specialtyKey ? specialtyKey : undefined,
          subspecialties: (r.subspecialties ?? []).filter((x) => x && x.length < 80).slice(0, 5),
          about: doc.about || (r.about ?? "").slice(0, 1200),
          services: (r.services ?? []).slice(0, 25),
          languages: (r.languages ?? []).slice(0, 10),
          sourceUrl: r.source_url,
          updatedAt: new Date(),
        }).where(eq(s.doctors.id, doc.id));
        await db.update(s.nmcRegister).set({ matchKind: `harvest:${id}` }).where(eq(s.nmcRegister.sourceRecordId, entry.sourceRecordId));
        published++;
        continue;
      }

      // 3. No profile yet (MBBS-only / branch-less register entry): create one, published, from the hospital's page + the register.
      bump("new profile from roster + register");
      console.log(`  + ${r.name} (${specialtyKey}) → ${placement.facilityName}, ${city} · register ${entry.council} ${entry.number} (${entry.category})`);
      if (DRY) continue;
      const localityKey = await placer.localityFor(placement, stateSlug);
      if (!localityKey) { bump("unplaceable (no city)"); continue; }
      const regQuals = await db.select().from(s.nmcRegisterQualifications).where(eq(s.nmcRegisterQualifications.sourceRecordId, entry.sourceRecordId));
      const known = new Set<string>();
      const quals: Array<{ degree: string; institution: string; year: number | null; verified: boolean }> = [];
      for (const q of [{ degree: entry.qualification, year: entry.qualificationYear, university: entry.university }, ...regQuals.map((q) => ({ degree: q.degree, year: q.year, university: q.university }))]) {
        if (!q.degree || /^(-+|#N\/A|NULL|NA)$/i.test(q.degree.trim())) continue;
        const k = q.degree.toUpperCase().replace(/[^A-Z]/g, "");
        if (known.has(k)) continue;
        known.add(k);
        quals.push({ degree: q.degree.trim(), institution: q.university || `${entry.council} record`, year: q.year ?? null, verified: true });
      }
      for (const d of r.qualifications ?? []) {
        const k = d.toUpperCase().replace(/[^A-Z]/g, "");
        if (!k || known.has(k)) continue;
        known.add(k);
        quals.push({ degree: d, institution: "Not stated", year: null, verified: false });
      }
      try {
        const res = await createDoctor(
          {
            name: r.name,
            specialtyKey,
            subspecialties: (r.subspecialties ?? []).filter((x) => x && x.length < 80).slice(0, 5),
            languages: (r.languages ?? []).slice(0, 10),
            modes: ["In person"],
            about: (r.about ?? "").slice(0, 1200),
            services: (r.services ?? []).slice(0, 25),
            registration: { number: entry.number.trim(), council: entry.council, registeredYear: null, verified: true },
            qualifications: quals,
            practices: [{ facilityName: placement.facilityName, localityKey, address: placement.address, postalCode: placement.postalCode ?? undefined, phone: placement.phone ?? undefined, days: r.days ?? "", hours: r.hours ?? "", feeInr: null, confirmed: false }],
            status: "published",
            source: SOURCE,
            sourceUrl: r.source_url,
            sourceRef: String(entry.sourceRecordId),
          },
          null,
          "system",
        );
        await db.transaction(async (tx) => {
          await tx.update(s.medicalRegistrations).set({ source: REG_SOURCE, checkedOn: today }).where(eq(s.medicalRegistrations.doctorId, res.id));
          await tx.insert(s.doctorEnrichment).values({ doctorId: res.id, nmcStatus: "confirmed", nmcQuery: REG_SOURCE, nmcCheckedAt: new Date(), googleStatus: "pending" }).onConflictDoNothing();
          await tx.update(s.nmcRegister).set({ doctorId: res.id, matchKind: `harvest:${id}`, researchStatus: "matched", researchNote: `${r.hospital}, ${city} — ${r.source_url}`, researchedAt: new Date() }).where(eq(s.nmcRegister.sourceRecordId, entry.sourceRecordId));
          await tx.insert(s.auditLogs).values({ actorRole: "system", action: "doctor.imported_published", entityType: "doctor", entityId: res.id, after: { source: SOURCE, sourceUrl: r.source_url, registerEntry: entry.sourceRecordId, council: entry.council, number: entry.number, match: how, hospital: r.hospital, city }, reason: "Hospital's own roster page names the doctor; registration placed on the NMC register export (scripts/nmc/harvest-publish.ts). Photo not imported; practice unconfirmed by the doctor." });
        });
        created++;
      } catch (e) {
        bump("create failed");
        console.log(`  ✗ ${r.name}: ${e instanceof Error ? e.message.split("\n")[0] : String(e)}`);
      }
    }
    if (unmatched.length && !DRY) {
      const { writeFileSync } = await import("node:fs");
      writeFileSync(IN.replace(/\.json$/, ".unmatched.json"), JSON.stringify(unmatched, null, 1));
    }
    console.log(`${id}:`, Object.fromEntries([...counts.entries()].sort((a, b) => b[1] - a[1])));
    counts.clear();
  }
  console.log(`published ${published} drafts · created ${created} new profiles`);
  if ((published || created) && !DRY) await revalidateSite();
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
