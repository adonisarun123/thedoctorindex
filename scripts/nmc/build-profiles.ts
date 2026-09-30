import { config } from "dotenv";
import { eq, inArray, sql as raw } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import { getDb } from "../../lib/db/client";
import * as s from "../../lib/db/schema";
import { PROFILE_CATEGORIES, REGISTER_COUNCILS } from "../../lib/nmc/classify";
import { slugify } from "../../lib/services/doctors";
import { todayIso } from "../../lib/db/dates";

config({ path: ".env.local" });
config();

/**
 * Build DRAFT profiles from register entries that carry a postgraduate
 * qualification the site can read as a speciality.
 *
 *   npm run nmc:build -- [--dry] [--state karnataka] [--limit N]
 *
 * Who gets a profile: category superspecialist / specialist /
 * diploma-specialist (lib/nmc/classify.ts), qualified 1980 or later, not
 * struck off, not already linked to a profile, and whose (council, number)
 * is not already on file. A person listed under both a state council and the
 * MCI gets one profile, on the state entry; the MCI entry is marked
 * `duplicate:<state entry>`.
 *
 * What a profile carries: the register name (tidied, token order as the
 * register has it), the speciality read from the degree — the profile says
 * it is inferred — every degree the register records (verified: the council
 * recorded them), the registration (checked today against this export), a
 * verification_checks row, an audit entry, and an enrichment row with
 * nmc_status confirmed and google_status pending.
 *
 * What it does not carry: a city, a clinic, a phone, a photo, a bio. The
 * register has none of these. scripts/nmc/research.ts looks each doctor up
 * and publishes only those it can place at a practice; until then the
 * profile is a draft — not served, not indexed, not counted.
 */

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const STATE = args.includes("--state") ? args[args.indexOf("--state") + 1] : null;
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : Infinity;
const SOURCE = "import:nmc-register (nmc.org.in IMR export 2026-09-29)";
const REG_SOURCE = "nmc-imr-export-2026-09-29";
const publicIdGen = customAlphabet("0123456789abcdef", 6);
const CHUNK = 500;

type Entry = { sourceRecordId: number; name: string; nameClean: string; nameSorted: string | null; council: string; councilCode: string | null; number: string; numberNormalized: string; qualification: string | null; qualificationYear: number | null; university: string | null; specialtyKey: string; specialtyBasis: string | null; category: string; eraYear: number | null; sourceUrl: string | null };

async function main() {
  const db = getDb();
  const today = todayIso();

  // 1. Candidates, deduplicated across councils.
  const rows = (await db.execute<Entry & { dup_of: number | null; on_file: boolean }>(raw`
    with c as (
      select r.source_record_id, r.name, r.name_clean, r.name_sorted, r.council, r.council_code, r.number, r.number_normalized, r.council_normalized,
             r.qualification, r.qualification_year, r.university, r.specialty_key, r.specialty_basis, r.category, r.era_year, r.source_url,
             exists (select 1 from medical_registrations m where m.council_normalized = r.council_normalized and m.number_normalized = r.number_normalized) as on_file,
             first_value(r.source_record_id) over (partition by r.name_sorted, r.qualification_year order by (r.council_code = 'MCI'), r.source_record_id) as keep
      from nmc_register r
      where r.category = any(${PROFILE_CATEGORIES})
        and r.doctor_id is null and r.match_kind is null and not r.removed
        and r.specialty_key is not null and r.name_clean is not null
        ${STATE ? raw`and r.state_slug = ${STATE}` : raw``}
    )
    select source_record_id as "sourceRecordId", name, name_clean as "nameClean", name_sorted as "nameSorted", council, council_code as "councilCode", number, number_normalized as "numberNormalized",
           qualification, qualification_year as "qualificationYear", university, specialty_key as "specialtyKey", specialty_basis as "specialtyBasis", category, era_year as "eraYear", source_url as "sourceUrl",
           case when keep <> source_record_id then keep end as dup_of, on_file
    from c
    order by source_record_id`)) as unknown as Array<Entry & { dup_of: number | null; on_file: boolean }>;

  const dups = rows.filter((r) => r.dup_of !== null);
  const onFile = rows.filter((r) => r.dup_of === null && r.on_file);
  // Two register entries can share a (council, number) — a transcription slip at the source; the second would trip the unique index and fail its whole chunk.
  const seenNumbers = new Set<string>();
  const build = rows
    .filter((r) => r.dup_of === null && !r.on_file)
    .filter((r) => {
      const k = `${r.council}|${r.numberNormalized}`;
      if (seenNumbers.has(k)) return false;
      seenNumbers.add(k);
      return true;
    })
    .slice(0, LIMIT);
  console.log(`${rows.length} register entries qualify${STATE ? ` in ${STATE}` : ""} · ${dups.length} are the same person under another council · ${onFile.length} numbers already on file · building ${build.length}${DRY ? " · DRY RUN" : ""}`);
  const byCat = new Map<string, number>();
  for (const r of build) byCat.set(`${r.category}/${r.specialtyKey}`, (byCat.get(`${r.category}/${r.specialtyKey}`) ?? 0) + 1);
  console.log([...byCat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, n]) => `  ${n}\t${k}`).join("\n"));
  if (DRY) {
    for (const r of build.slice(0, 15)) console.log(`  + ${r.nameClean} · ${r.specialtyKey} ← ${r.specialtyBasis} · ${r.council} ${r.number}`);
    return;
  }

  if (dups.length) {
    for (let i = 0; i < dups.length; i += 2000) {
      const chunk = dups.slice(i, i + 2000);
      await db.execute(raw`update nmc_register r set match_kind = 'duplicate:' || v.keep from (values ${raw.join(chunk.map((d) => raw`(${d.sourceRecordId}::bigint, ${d.dup_of}::bigint)`), raw`, `)}) as v(id, keep) where r.source_record_id = v.id`);
    }
    console.log(`marked ${dups.length} cross-council duplicates`);
  }
  if (onFile.length) {
    console.log(`  (${onFile.length} entries whose number is already on a profile are left for nmc:match to link)`);
  }

  // 2. Additional qualifications for the batch.
  const quals = new Map<number, Array<{ degree: string; year: number | null; university: string | null }>>();
  for (let i = 0; i < build.length; i += 5000) {
    const ids = build.slice(i, i + 5000).map((r) => r.sourceRecordId);
    const qs = await db.select().from(s.nmcRegisterQualifications).where(inArray(s.nmcRegisterQualifications.sourceRecordId, ids)).orderBy(s.nmcRegisterQualifications.seq);
    for (const q of qs) {
      if (!q.degree || /^(-+|#N\/A|NULL|NA)$/i.test(q.degree.trim())) continue;
      quals.set(q.sourceRecordId, [...(quals.get(q.sourceRecordId) ?? []), { degree: q.degree.trim(), year: q.year, university: q.university }]);
    }
  }

  // 3. Insert in chunks.
  const usedIds = new Set((await db.select({ id: s.doctors.publicId }).from(s.doctors)).map((r) => r.id));
  const newId = () => {
    let id = publicIdGen();
    while (usedIds.has(id)) id = publicIdGen();
    usedIds.add(id);
    return id;
  };
  let created = 0, failed = 0;
  const t0 = Date.now();
  for (let i = 0; i < build.length; i += CHUNK) {
    const chunk = build.slice(i, i + CHUNK);
    try {
      await db.transaction(async (tx) => {
        const docs = await tx
          .insert(s.doctors)
          .values(
            chunk.map((r) => {
              const publicId = newId();
              return {
                publicId,
                slug: slugify(r.nameClean, publicId),
                name: r.nameClean,
                specialtyKey: r.specialtyKey,
                subspecialties: [],
                practiceStartYear: null,
                languages: [],
                modes: ["In person"],
                about: "",
                services: [],
                status: "draft" as const,
                // Registration verified (22) + every qualification verified (15); recomputeQuality() runs at publish.
                qualityScore: 37,
                lastVerifiedOn: today,
                source: SOURCE,
                sourceRef: String(r.sourceRecordId),
                sourceUrl: r.sourceUrl ?? "https://www.nmc.org.in/information-desk/indian-medical-register/",
                phoneConsent: false,
              };
            }),
          )
          .returning({ id: s.doctors.id, sourceRef: s.doctors.sourceRef });
        const idByRef = new Map(docs.map((d) => [Number(d.sourceRef), d.id]));
        const regs = await tx
          .insert(s.medicalRegistrations)
          .values(chunk.map((r) => ({ doctorId: idByRef.get(r.sourceRecordId)!, number: r.number.trim(), numberNormalized: r.numberNormalized, council: r.council, councilNormalized: r.council.toUpperCase().replace(/[^A-Z0-9]/g, ""), registeredYear: null, status: "active", checkedOn: today, source: REG_SOURCE, isPrimary: true })))
          .returning({ id: s.medicalRegistrations.id, doctorId: s.medicalRegistrations.doctorId });
        const regByDoctor = new Map(regs.map((r) => [r.doctorId, r.id]));
        const qualRows = chunk.flatMap((r) => {
          const doctorId = idByRef.get(r.sourceRecordId)!;
          const all = [...(r.qualification && !/^(-+|#N\/A|NULL|NA)$/i.test(r.qualification.trim()) ? [{ degree: r.qualification.trim(), year: r.qualificationYear, university: r.university }] : []), ...(quals.get(r.sourceRecordId) ?? [])];
          return all.map((q, k) => ({ doctorId, degree: q.degree, institution: q.university || `${r.council} record`, university: q.university ?? null, year: q.year ?? null, state: "verified" as const, checkedOn: today, sort: k }));
        });
        for (let j = 0; j < qualRows.length; j += 1000) await tx.insert(s.doctorQualifications).values(qualRows.slice(j, j + 1000));
        await tx.insert(s.verificationChecks).values(
          chunk.map((r) => {
            const doctorId = idByRef.get(r.sourceRecordId)!;
            return { doctorId, kind: "registration" as const, subjectId: regByDoctor.get(doctorId) ?? null, result: "verified" as const, source: REG_SOURCE, note: `${r.council} · ${r.number} · ${r.name}${r.qualification ? ` · ${r.qualification}${r.university ? `, ${r.university}` : ""}` : ""} (register entry ${r.sourceRecordId})` };
          }),
        );
        await tx.insert(s.doctorEnrichment).values(chunk.map((r) => ({ doctorId: idByRef.get(r.sourceRecordId)!, nmcStatus: "confirmed", nmcQuery: REG_SOURCE, nmcCheckedAt: new Date(), googleStatus: "pending" })));
        await tx.insert(s.auditLogs).values(
          chunk.map((r) => ({
            actorRole: "system",
            action: "doctor.imported_draft",
            entityType: "doctor",
            entityId: idByRef.get(r.sourceRecordId)!,
            after: { source: SOURCE, registerEntry: r.sourceRecordId, council: r.council, number: r.number, registerName: r.name, specialty: r.specialtyKey, specialtyBasis: r.specialtyBasis, category: r.category, eraYear: r.eraYear },
            reason: "Built from the NMC Indian Medical Register (public statutory register). Speciality inferred from the recorded postgraduate degree; no location, contact, photo or free text imported; doctor has not been contacted. Draft until research places the doctor at a practice (scripts/nmc/research.ts).",
          })),
        );
        await tx.execute(raw`update nmc_register r set doctor_id = v.doctor_id::uuid, match_kind = 'created', research_status = 'pending' from (values ${raw.join(chunk.map((r) => raw`(${r.sourceRecordId}::bigint, ${idByRef.get(r.sourceRecordId)!})`), raw`, `)}) as v(id, doctor_id) where r.source_record_id = v.id`);
      });
      created += chunk.length;
    } catch (e) {
      failed += chunk.length;
      console.log(`  ✗ chunk at ${i}: ${e instanceof Error ? e.message : String(e)}`);
    }
    if ((i / CHUNK) % 20 === 0) console.log(`  … ${Math.min(i + CHUNK, build.length)} / ${build.length} · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  console.log(`created ${created} drafts, ${failed} failed`);
  const [{ n }] = await db.select({ n: raw<number>`count(*)::int` }).from(s.doctors).where(eq(s.doctors.source, SOURCE));
  console.log(`${SOURCE}: ${n} profiles in the database`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
