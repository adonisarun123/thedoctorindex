import { config } from "dotenv";
import { and, eq, inArray, sql as raw } from "drizzle-orm";

import { getDb } from "../../lib/db/client";
import * as s from "../../lib/db/schema";
import { coreTokens, nameCovers, nameTight } from "../../lib/enrich/names";
import { ANY_COUNCIL, COUNCILS_BY_STATE, councilId } from "../../lib/enrich/nmc";
import { REGISTER_COUNCILS } from "../../lib/nmc/classify";
import { recomputeQuality } from "../../lib/services/doctors";
import { todayIso } from "../../lib/db/dates";

config({ path: ".env.local" });
config();

/**
 * Register-check the directory against the offline NMC register.
 *
 *   npm run nmc:match -- [--dry] [--only number|name] [--limit N]
 *
 * Pass 1 — number: every medical_registrations row whose (council, number)
 * is found in nmc_register with a name that covers the profile's name is
 * marked checked today (source nmc-imr-export-2026-09-29), with a
 * verification_checks row, the council-recorded degree(s) verified, an audit
 * entry and a quality recompute — the same writes scripts/enrich.ts makes for
 * a live confirmation. A struck-off entry marks the registration `removed`
 * and the check `failed`. A number that is on the register under a different
 * name is left alone and reported (never "confirmed" by number only).
 *
 * Pass 2 — name: published modern-medicine profiles with NO registration row
 * get one only when exactly one register entry in the profile state's
 * council(s) matches the name tightly (lib/enrich/names.ts). Two or more
 * matches go to the admin queue as candidates; none = not_found. This is the
 * standing rule the live worker applies; only the lookup is offline here.
 */

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const ONLY = args[args.indexOf("--only") + 1] as "number" | "name" | undefined;
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : Infinity;
const SOURCE = "nmc-imr-export-2026-09-29";
const REASON = "NMC Indian Medical Register, 29 Sep 2026 export (scripts/nmc/match-existing.ts)";
const NON_MEDICAL = new Set(["dentistry", "ayush", "physiotherapy", "clinical-psychology", "dietetics", "audiology", "occupational-therapy", "acupuncture", "cosmetology"]);

type Entry = { sourceRecordId: number; name: string; nameClean: string | null; council: string; councilCode: string | null; number: string; qualification: string | null; qualificationYear: number | null; university: string | null; removed: boolean; category: string; doctorId: string | null };
type RegQual = { degree: string; year: number | null; university: string | null };

const normDeg = (v: string) => v.toUpperCase().replace(/[^A-Z]/g, "");
const digits = (v: string) => v.replace(/\D/g, "");

async function main() {
  const db = getDb();
  const today = todayIso();
  const counts = new Map<string, number>();
  const bump = (k: string) => counts.set(k, (counts.get(k) ?? 0) + 1);
  const quals = new Map<number, RegQual[]>();
  const qualsFor = async (ids: number[]) => {
    const missing = ids.filter((id) => !quals.has(id));
    if (missing.length) {
      const rows = await db.select({ id: s.nmcRegisterQualifications.sourceRecordId, degree: s.nmcRegisterQualifications.degree, year: s.nmcRegisterQualifications.year, university: s.nmcRegisterQualifications.university }).from(s.nmcRegisterQualifications).where(inArray(s.nmcRegisterQualifications.sourceRecordId, missing));
      for (const id of missing) quals.set(id, []);
      for (const r of rows) quals.get(r.id)!.push({ degree: r.degree, year: r.year, university: r.university });
    }
  };

  /** Verify the council-recorded degrees on a profile, inserting the ones it lacks (same rule as scripts/enrich.ts). */
  async function verifyDegrees(tx: Parameters<Parameters<typeof db.transaction>[0]>[0], doctorId: string, e: Entry) {
    const recorded: RegQual[] = [...(e.qualification ? [{ degree: e.qualification, year: e.qualificationYear, university: e.university }] : []), ...(quals.get(e.sourceRecordId) ?? [])].filter((q) => q.degree && !/^(-+|#N\/A|NULL|NA)$/i.test(q.degree.trim()));
    if (!recorded.length) return;
    const have = await tx.query.doctorQualifications.findMany({ where: eq(s.doctorQualifications.doctorId, doctorId) });
    let sort = have.length;
    for (const q of recorded) {
      const institution = q.university || `${e.council} record`;
      const same = have.find((h) => normDeg(h.degree) === normDeg(q.degree));
      if (same) {
        await tx.update(s.doctorQualifications).set({ state: "verified", checkedOn: today, institution: /not stated|record$/i.test(same.institution) && q.university ? q.university : same.institution, university: same.university ?? q.university ?? null, year: same.year ?? q.year ?? null }).where(eq(s.doctorQualifications.id, same.id));
      } else {
        await tx.insert(s.doctorQualifications).values({ doctorId, degree: q.degree.trim(), institution, university: q.university ?? null, year: q.year ?? null, state: "verified", checkedOn: today, sort: sort++ });
      }
      await tx.insert(s.verificationChecks).values({ doctorId, kind: "qualification", result: "verified", source: SOURCE, note: `${q.degree}${q.university ? ` · ${q.university}` : ""}${q.year ? ` · ${q.year}` : ""} as recorded by ${e.council}` });
    }
  }

  async function upsertEnrichment(tx: Parameters<Parameters<typeof db.transaction>[0]>[0], doctorId: string, nmcStatus: string, candidates: unknown = null) {
    await tx
      .insert(s.doctorEnrichment)
      .values({ doctorId, nmcStatus, nmcCandidates: candidates as never, nmcCheckedAt: new Date(), nmcQuery: SOURCE, updatedAt: new Date() })
      .onConflictDoUpdate({ target: s.doctorEnrichment.doctorId, set: { nmcStatus, nmcCandidates: candidates as never, nmcCheckedAt: new Date(), nmcQuery: SOURCE, updatedAt: new Date() } });
  }

  /* ---------------------------------------------------------------- */
  /* Pass 1 — by number                                                */
  /* ---------------------------------------------------------------- */
  if (ONLY !== "name") {
    const regs = await db
      .select({ id: s.medicalRegistrations.id, doctorId: s.medicalRegistrations.doctorId, number: s.medicalRegistrations.number, numberNormalized: s.medicalRegistrations.numberNormalized, council: s.medicalRegistrations.council, checkedOn: s.medicalRegistrations.checkedOn, status: s.medicalRegistrations.status, name: s.doctors.name, doctorStatus: s.doctors.status })
      .from(s.medicalRegistrations)
      .innerJoin(s.doctors, eq(s.doctors.id, s.medicalRegistrations.doctorId))
      .where(raw`${s.doctors.status} in ('published','draft','in_review')`);
    console.log(`pass 1: ${regs.length} registrations on file${DRY ? " · DRY RUN" : ""}`);
    let done = 0;
    for (let i = 0; i < regs.length && done < LIMIT; i += 500) {
      const chunk = regs.slice(i, i + 500);
      const keys = new Set<string>();
      for (const r of chunk) {
        keys.add(r.numberNormalized);
        const d = digits(r.number);
        if (d.length >= 3) keys.add(d);
      }
      const entries = await db
        .select({ sourceRecordId: s.nmcRegister.sourceRecordId, name: s.nmcRegister.name, nameClean: s.nmcRegister.nameClean, council: s.nmcRegister.council, councilCode: s.nmcRegister.councilCode, number: s.nmcRegister.number, numberNormalized: s.nmcRegister.numberNormalized, qualification: s.nmcRegister.qualification, qualificationYear: s.nmcRegister.qualificationYear, university: s.nmcRegister.university, removed: s.nmcRegister.removed, category: s.nmcRegister.category, doctorId: s.nmcRegister.doctorId })
        .from(s.nmcRegister)
        .where(inArray(s.nmcRegister.numberNormalized, [...keys]));
      const byNumber = new Map<string, typeof entries>();
      for (const e of entries) {
        const list = byNumber.get(e.numberNormalized) ?? [];
        list.push(e);
        byNumber.set(e.numberNormalized, list);
      }
      for (const r of chunk) {
        if (done >= LIMIT) break;
        // "Council not stated" (aggregator imports) is searched across every council; a name match is still required.
        const code = /not stated|unknown|^\s*$/i.test(r.council) ? ANY_COUNCIL : councilId(r.council);
        if (code === null) {
          bump("not_applicable (non-medical council)");
          continue;
        }
        const exact = byNumber.get(r.numberNormalized) ?? [];
        const loose = exact.length ? [] : byNumber.get(digits(r.number)) ?? [];
        const pool = (exact.length ? exact : loose).filter((e) => code === ANY_COUNCIL || e.councilCode === code);
        if (!pool.length) {
          bump(exact.length || loose.length ? "number found in another council" : "number not on register");
          continue;
        }
        const named = pool.filter((e) => nameCovers(e.nameClean ?? e.name, r.name));
        if (named.length === 0) {
          bump("number on register under another name");
          console.log(`  ≠ ${r.council} ${r.number} · profile "${r.name}" · register ${pool.map((e) => `"${e.nameClean ?? e.name}"`).join(", ")}`);
          continue;
        }
        if (named.length > 1) {
          bump("ambiguous (same number, several entries)");
          continue;
        }
        const e = named[0];
        if (e.doctorId && e.doctorId !== r.doctorId) {
          bump("register entry already linked to another profile");
          continue;
        }
        done++;
        if (e.removed) {
          bump("struck off");
          console.log(`  ✗ struck off: ${r.council} ${r.number} "${r.name}"`);
          if (DRY) continue;
          await db.transaction(async (tx) => {
            await tx.update(s.medicalRegistrations).set({ status: "removed", checkedOn: today, source: SOURCE }).where(eq(s.medicalRegistrations.id, r.id));
            await tx.insert(s.verificationChecks).values({ doctorId: r.doctorId, kind: "registration", subjectId: r.id, result: "failed", source: SOURCE, note: `${e.council} · ${e.number} · ${e.name} — marked removed on the register` });
            await upsertEnrichment(tx, r.doctorId, "removed");
            await tx.update(s.nmcRegister).set({ doctorId: r.doctorId, matchKind: "existing:number" }).where(eq(s.nmcRegister.sourceRecordId, e.sourceRecordId));
            await tx.insert(s.auditLogs).values({ actorRole: "system", action: "registration.removed", entityType: "doctor", entityId: r.doctorId, after: { council: e.council, number: e.number, registerName: e.name, source: SOURCE }, reason: REASON });
          });
          await recomputeQuality(r.doctorId);
          continue;
        }
        bump(r.checkedOn ? "confirmed (was already checked)" : "confirmed");
        if (DRY) continue;
        await qualsFor([e.sourceRecordId]);
        await db.transaction(async (tx) => {
          await tx.update(s.medicalRegistrations).set({ checkedOn: today, source: SOURCE, status: "active", council: e.council, councilNormalized: e.council.toUpperCase().replace(/[^A-Z0-9]/g, "") }).where(eq(s.medicalRegistrations.id, r.id));
          await tx.insert(s.verificationChecks).values({ doctorId: r.doctorId, kind: "registration", subjectId: r.id, result: "verified", source: SOURCE, note: `${e.council} · ${e.number} · ${e.name}${e.qualification ? ` · ${e.qualification}${e.university ? `, ${e.university}` : ""}` : ""} (register entry ${e.sourceRecordId})` });
          await verifyDegrees(tx, r.doctorId, e);
          await upsertEnrichment(tx, r.doctorId, "confirmed");
          await tx.update(s.nmcRegister).set({ doctorId: r.doctorId, matchKind: "existing:number" }).where(eq(s.nmcRegister.sourceRecordId, e.sourceRecordId));
          await tx.insert(s.auditLogs).values({ actorRole: "system", action: "registration.confirmed", entityType: "doctor", entityId: r.doctorId, after: { council: e.council, number: e.number, registerName: e.name, degree: e.qualification, university: e.university, source: SOURCE, registerEntry: e.sourceRecordId }, reason: REASON });
          await tx.update(s.doctors).set({ lastVerifiedOn: today, updatedAt: new Date() }).where(eq(s.doctors.id, r.doctorId));
        });
        await recomputeQuality(r.doctorId);
      }
      console.log(`  … ${Math.min(i + 500, regs.length)} / ${regs.length}`);
    }
    console.log("pass 1:", Object.fromEntries([...counts.entries()].sort((a, b) => b[1] - a[1])));
    counts.clear();
  }

  /* ---------------------------------------------------------------- */
  /* Pass 2 — by name, for profiles with no registration at all         */
  /* ---------------------------------------------------------------- */
  if (ONLY !== "number") {
    const docs = await db.execute<{ id: string; name: string; specialty_key: string; state_slug: string | null; nmc_status: string | null }>(raw`
      select d.id, d.name, d.specialty_key,
        (select l.state_slug from doctor_practices p join facilities f on f.id = p.facility_id join localities l on l.key = f.locality_key where p.doctor_id = d.id and p.active order by p.sort limit 1) as state_slug,
        e.nmc_status
      from doctors d
      left join doctor_enrichment e on e.doctor_id = d.id
      where d.status = 'published'
        and not exists (select 1 from medical_registrations r where r.doctor_id = d.id)
        and coalesce(e.nmc_status, 'pending') in ('pending', 'not_found', 'not_applicable')
      order by d.created_at`);
    console.log(`pass 2: ${docs.length} published profiles without a registration${DRY ? " · DRY RUN" : ""}`);
    let n = 0;
    for (const d of docs) {
      if (n >= LIMIT) break;
      if (NON_MEDICAL.has(d.specialty_key)) {
        bump("not_applicable (non-medical speciality)");
        continue;
      }
      const core = coreTokens(d.name);
      if (core.length < 2) {
        bump("name too short to match");
        continue;
      }
      const codes = d.state_slug ? COUNCILS_BY_STATE[d.state_slug] ?? [] : [];
      if (!codes.length) {
        bump("no state on profile");
        continue;
      }
      n++;
      const cands = await db
        .select({ sourceRecordId: s.nmcRegister.sourceRecordId, name: s.nmcRegister.name, nameClean: s.nmcRegister.nameClean, council: s.nmcRegister.council, councilCode: s.nmcRegister.councilCode, number: s.nmcRegister.number, qualification: s.nmcRegister.qualification, qualificationYear: s.nmcRegister.qualificationYear, university: s.nmcRegister.university, removed: s.nmcRegister.removed, category: s.nmcRegister.category, doctorId: s.nmcRegister.doctorId, eraYear: s.nmcRegister.eraYear })
        .from(s.nmcRegister)
        .where(and(raw`${s.nmcRegister.nameTokens} @> ${raw.raw(`'{${core.map((t) => `"${t}"`).join(",")}}'::text[]`)}`, inArray(s.nmcRegister.councilCode, [...codes, "MCI"]), raw`${s.nmcRegister.category} not in ('no-number','name-unusable')`, raw`${s.nmcRegister.doctorId} is null`))
        .limit(25);
      const tight = cands.filter((c) => nameTight(c.nameClean ?? c.name, d.name));
      // The same person often holds a state number and an MCI number: one person, not two candidates.
      const people = new Map<string, typeof tight>();
      for (const c of tight) {
        const k = `${(c.nameClean ?? c.name).toLowerCase()}|${c.qualificationYear ?? ""}`;
        people.set(k, [...(people.get(k) ?? []), c]);
      }
      if (people.size === 1) {
        const group = [...people.values()][0];
        const e = group.find((c) => c.councilCode !== "MCI") ?? group[0];
        if (e.removed) {
          bump("unique match but struck off — left for review");
          continue;
        }
        bump(`matched (${e.category})`);
        console.log(`  + "${d.name}" ← ${e.council} ${e.number} "${e.nameClean ?? e.name}" · ${e.qualification ?? ""} ${e.qualificationYear ?? ""}`);
        if (DRY) continue;
        await qualsFor([e.sourceRecordId]);
        await db.transaction(async (tx) => {
          const [reg] = await tx
            .insert(s.medicalRegistrations)
            .values({ doctorId: d.id, number: e.number.trim(), numberNormalized: e.number.toUpperCase().replace(/[^A-Z0-9]/g, ""), council: e.council, councilNormalized: e.council.toUpperCase().replace(/[^A-Z0-9]/g, ""), registeredYear: null, checkedOn: today, source: SOURCE, isPrimary: true })
            .onConflictDoNothing()
            .returning({ id: s.medicalRegistrations.id });
          if (!reg) return; // number already on another profile — leave both for review
          await tx.insert(s.verificationChecks).values({ doctorId: d.id, kind: "registration", subjectId: reg.id, result: "verified", source: SOURCE, note: `${e.council} · ${e.number} · ${e.name} — unique name match in the profile's state council(s) (register entry ${e.sourceRecordId})` });
          await verifyDegrees(tx, d.id, e as Entry);
          await upsertEnrichment(tx, d.id, "matched");
          for (const c of group) await tx.update(s.nmcRegister).set({ doctorId: d.id, matchKind: c === e ? "existing:name" : `duplicate:${e.sourceRecordId}` }).where(eq(s.nmcRegister.sourceRecordId, c.sourceRecordId));
          await tx.insert(s.auditLogs).values({ actorRole: "system", action: "registration.matched", entityType: "doctor", entityId: d.id, after: { council: e.council, number: e.number, registerName: e.name, degree: e.qualification, university: e.university, source: SOURCE, registerEntry: e.sourceRecordId, rule: "unique tight name match within state councils" }, reason: REASON });
          await tx.update(s.doctors).set({ lastVerifiedOn: today, updatedAt: new Date() }).where(eq(s.doctors.id, d.id));
        });
        await recomputeQuality(d.id);
      } else if (people.size > 1) {
        bump(cands.length >= 25 ? "ambiguous (25+ candidates)" : "ambiguous");
        if (DRY) continue;
        const candidates = tight.slice(0, 20).map((c) => ({ doctorId: String(c.sourceRecordId), registrationNo: c.number, council: c.council, name: c.nameClean ?? c.name, year: c.eraYear, degree: c.qualification, university: c.university, place: null, removed: c.removed }));
        await db.transaction(async (tx) => upsertEnrichment(tx, d.id, "ambiguous", candidates));
      } else {
        bump("not_found");
        if (DRY) continue;
        await db.transaction(async (tx) => upsertEnrichment(tx, d.id, "not_found"));
      }
      if (n % 500 === 0) console.log(`  … ${n}`);
    }
    console.log("pass 2:", Object.fromEntries([...counts.entries()].sort((a, b) => b[1] - a[1])));
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
