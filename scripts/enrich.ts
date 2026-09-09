import { config } from "dotenv";
import { and, asc, desc, eq, gte, inArray, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { specialtyByKey } from "../lib/data/taxonomy";
import * as s from "../lib/db/schema";
import { GoogleClient, type ProfileForGoogle } from "../lib/enrich/google";
import { NmcClient, matchOnRegister, type Candidate } from "../lib/enrich/nmc";
import { recomputeQuality } from "../lib/services/doctors";

config({ path: ".env.local" });
config();

/**
 * `npm run db:enrich -- [--batch 800] [--minutes 40] [--dry] [--only nmc|google] [--slug x]`
 *
 * The background enrichment worker. Each run takes a batch of published
 * doctors that still have work pending and, for each:
 *
 *   1. NMC register — confirms a registration number already on file, or
 *      fills one in when exactly one register entry matches the name and
 *      council. Anything less certain goes to the admin queue with its
 *      candidates. Confirmed/matched registrations become "checked" today,
 *      with a verification_checks row and an audit entry, and the profile's
 *      quality score is recomputed.
 *   2. Google Places — finds the doctor's or clinic's listing, records the
 *      place ID and whether the listing agrees with the address on file.
 *      Skipped when GOOGLE_PLACES_API_KEY is unset; capped per UTC day by
 *      GOOGLE_PLACES_DAILY_CAP (default 1500) so spend is bounded.
 *
 * Idempotent: rerunning only touches rows still pending. Runs from GitHub
 * Actions on a schedule (.github/workflows/enrich.yml) or from a laptop.
 */

const args = process.argv.slice(2);
const arg = (k: string, d: string) => {
  const i = args.indexOf(k);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const BATCH = Number(arg("--batch", "800"));
const MINUTES = Number(arg("--minutes", "40"));
const DRY = args.includes("--dry");
const ONLY = arg("--only", "") as "" | "nmc" | "google";
const SLUG = arg("--slug", "");
const DAILY_CAP = Number(process.env.GOOGLE_PLACES_DAILY_CAP ?? "1500");
/**
 * Doctors processed in parallel. Each worker gets its OWN NmcClient, because
 * pacing lives on the client: N workers means N requests per pauseMs window
 * against the register, not N at once through one paced queue.
 *
 * Default 1 — the scheduled workflow must stay at the pace the register has
 * been served at all along. Raise it only for a deliberate catch-up run, and
 * not far: this is a public government register with no published rate limit,
 * and the polite reading of "no limit" is not "any limit we like". 3 has been
 * the tested ceiling.
 */
const CONCURRENCY = Math.max(1, Math.min(6, Number(arg("--concurrency", "1"))));
/** Consecutive NMC failures before the register is treated as down for this run. */
const NMC_GIVE_UP = Number(arg("--give-up-after", "8"));

async function main() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL or DATABASE_URL");
  // One spare connection per worker: each holds one while it reads the doctor
  // and writes the outcome, and a pool of 2 would serialise what we just
  // parallelised.
  const client = postgres(url, { max: CONCURRENCY + 2, ssl: process.env.DATABASE_SSL === "disable" ? false : "require", onnotice: () => {} });
  const db = drizzle(client, { schema: s });
  // recomputeQuality reads through the app's pooled client; point it at the same database.
  process.env.DATABASE_URL = url;

  const deadline = Date.now() + MINUTES * 60_000;
  const googleKey = process.env.GOOGLE_PLACES_API_KEY;
  const google = googleKey ? new GoogleClient(googleKey) : null;

  // Google budget for today (UTC).
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  const usedToday = google ? Number((await db.select({ n: sql<number>`count(*)::int` }).from(s.doctorEnrichment).where(and(gte(s.doctorEnrichment.googleCheckedAt, dayStart), inArray(s.doctorEnrichment.googleStatus, ["matched", "no_match", "error"]))))[0]?.n ?? 0) : 0;
  let googleBudget = google ? Math.max(0, DAILY_CAP - usedToday) : 0;

  // Ensure every published doctor has an enrichment row.
  if (!DRY) {
    await db.execute(sql`insert into doctor_enrichment (doctor_id) select id from doctors where status = 'published' on conflict (doctor_id) do nothing`);
  }

  // Batch: doctors with pending work, registered ones first (cheap confirmations), then by quality.
  const wantNmc = ONLY !== "google";
  const wantGoogle = ONLY !== "nmc" && googleBudget > 0;
  const pendingClause = or(
    wantNmc ? sql`coalesce(${s.doctorEnrichment.nmcStatus}, 'pending') = 'pending'` : sql`false`,
    wantGoogle ? sql`coalesce(${s.doctorEnrichment.googleStatus}, 'pending') = 'pending'` : sql`false`,
  );
  const rows = await db
    .select({ id: s.doctors.id, slug: s.doctors.slug })
    .from(s.doctors)
    .leftJoin(s.doctorEnrichment, eq(s.doctorEnrichment.doctorId, s.doctors.id))
    .where(and(eq(s.doctors.status, "published"), SLUG ? eq(s.doctors.slug, SLUG) : pendingClause, sql`coalesce(${s.doctorEnrichment.attempts}, 0) < 5`))
    .orderBy(desc(sql`exists (select 1 from medical_registrations r where r.doctor_id = ${s.doctors.id})`), desc(s.doctors.qualityScore), asc(s.doctors.name))
    .limit(BATCH);

  console.log(`enrich: ${rows.length} doctors in batch · nmc=${wantNmc} google=${wantGoogle} (budget ${googleBudget} of ${DAILY_CAP} today) · ${DRY ? "DRY RUN" : "writing"} · ${MINUTES} min limit · concurrency ${CONCURRENCY}`);
  const tally: Record<string, number> = {};
  const bump = (k: string) => (tally[k] = (tally[k] ?? 0) + 1);
  let nmcFailures = 0;
  // Shared across workers. Single-threaded event loop, so ++ and -- on these
  // are atomic with respect to each other; no lock is needed or wanted.
  let cursor = 0;
  let stopAll = false;
  let done = 0;

  async function processDoctors(nmc: NmcClient) {
   for (;;) {
    if (stopAll) return;
    const row = rows[cursor++];
    if (!row) return;
    if (Date.now() > deadline) {
      console.log("time limit reached; stopping cleanly");
      stopAll = true;
      return;
    }
    const d = await db.query.doctors.findFirst({
      where: eq(s.doctors.id, row.id),
      with: { registrations: true, enrichment: true, practices: { where: (p, { eq }) => eq(p.active, true), with: { facility: { with: { locality: true } } } } },
    });
    if (!d) continue;
    const enr = d.enrichment;
    const sp = specialtyByKey(d.specialtyKey);
    const practice = d.practices[0];
    const loc = practice?.facility.locality ?? null;
    const primaryReg = d.registrations.find((r) => r.isPrimary) ?? d.registrations[0] ?? null;
    console.log(`• ${d.name} (${d.slug}) · ${sp?.name ?? d.specialtyKey} · ${loc ? `${loc.city}, ${loc.state}` : "no place"}`);

    /* ---- NMC ---- */
    if (wantNmc && (!enr || enr.nmcStatus === "pending" || SLUG)) {
      if (!sp || sp.system !== "modern") {
        bump("nmc:not_applicable");
        if (!DRY) await db.update(s.doctorEnrichment).set({ nmcStatus: "not_applicable", nmcCheckedAt: new Date(), updatedAt: new Date() }).where(eq(s.doctorEnrichment.doctorId, d.id));
      } else if (primaryReg?.checkedOn && !SLUG) {
        bump("nmc:already_verified");
        if (!DRY) await db.update(s.doctorEnrichment).set({ nmcStatus: "confirmed", nmcCheckedAt: new Date(), updatedAt: new Date() }).where(eq(s.doctorEnrichment.doctorId, d.id));
      } else {
        try {
          const out = await matchOnRegister(nmc, { name: d.name, stateSlug: loc?.stateSlug ?? null, registration: primaryReg ? { number: primaryReg.number, council: primaryReg.council } : null }, { log: (m) => process.env.ENRICH_VERBOSE && console.log(m) });
          // The give-up counter measures a register that is down *now*, so any
          // answer at all clears it. Without this reset, eight unrelated blips
          // spread over a twenty-hour run would stop it just as surely as an
          // outage.
          nmcFailures = 0;
          bump(`nmc:${out.status}`);
          console.log(`  nmc → ${out.status}${"match" in out ? ` ${out.match.council} ${out.match.registrationNo} (${out.match.name})` : ""}${"candidates" in out ? ` ${out.candidates.length} candidates` : ""}`);
          if (!DRY) {
            const today = new Date().toISOString().slice(0, 10);
            const stamp = { nmcCheckedAt: new Date(), nmcQuery: out.query, updatedAt: new Date(), lastError: null as string | null };
            if (out.status === "confirmed" || out.status === "matched") {
              const m = out.match;
              await db.transaction(async (tx) => {
                if (out.status === "confirmed" && primaryReg) {
                  await tx.update(s.medicalRegistrations).set({ checkedOn: today, source: "nmc-imr", registeredYear: primaryReg.registeredYear ?? m.year, council: primaryReg.council === "Council not stated" ? m.council : primaryReg.council, councilNormalized: (primaryReg.council === "Council not stated" ? m.council : primaryReg.council).toUpperCase().replace(/[^A-Z0-9]/g, "") }).where(eq(s.medicalRegistrations.id, primaryReg.id));
                } else {
                  if (out.status === "matched" && out.replaces?.length) {
                    // The number on file belongs to someone else on the register: keep it for the audit trail, but it is no longer primary or active.
                    await tx.update(s.medicalRegistrations).set({ isPrimary: false, status: "unverified", checkedOn: null }).where(eq(s.medicalRegistrations.doctorId, d.id));
                  }
                  await tx.insert(s.medicalRegistrations).values({ doctorId: d.id, number: m.registrationNo, numberNormalized: m.registrationNo.toUpperCase().replace(/[^A-Z0-9]/g, ""), council: m.council, councilNormalized: m.council.toUpperCase().replace(/[^A-Z0-9]/g, ""), registeredYear: m.year, checkedOn: today, source: "nmc-imr", isPrimary: d.registrations.length === 0 || Boolean(out.status === "matched" && out.replaces?.length) }).onConflictDoNothing();
                }
                await tx.insert(s.verificationChecks).values({ doctorId: d.id, kind: "registration", result: "verified", source: "nmc-imr", note: `${m.council} · ${m.registrationNo} · ${m.name}${m.detail?.degree ? ` · ${m.detail.degree}${m.detail.university ? `, ${m.detail.university}` : ""}` : ""}` });
                // The council records the primary qualification it registered the doctor on; that is a verified degree.
                if (m.detail?.degree) {
                  const normDeg = (v: string) => v.toUpperCase().replace(/[^A-Z]/g, "");
                  const quals = await tx.query.doctorQualifications.findMany({ where: eq(s.doctorQualifications.doctorId, d.id) });
                  const same = quals.find((q) => normDeg(q.degree) === normDeg(m.detail!.degree!));
                  const institution = m.detail.university ?? `${m.council} record`;
                  if (same) {
                    await tx.update(s.doctorQualifications).set({ state: "verified", checkedOn: today, institution: /not stated/i.test(same.institution) ? institution : same.institution, university: same.university ?? m.detail.university ?? null, year: same.year ?? m.detail.yearOfPassing ?? null }).where(eq(s.doctorQualifications.id, same.id));
                  } else {
                    await tx.insert(s.doctorQualifications).values({ doctorId: d.id, degree: m.detail.degree, institution, university: m.detail.university ?? null, year: m.detail.yearOfPassing ?? null, state: "verified", checkedOn: today, sort: quals.length });
                  }
                  await tx.insert(s.verificationChecks).values({ doctorId: d.id, kind: "qualification", result: "verified", source: "nmc-imr", note: `${m.detail.degree}${m.detail.university ? ` · ${m.detail.university}` : ""}${m.detail.yearOfPassing ? ` · ${m.detail.yearOfPassing}` : ""} as recorded by ${m.council}` });
                }
                await tx.insert(s.auditLogs).values({ actorRole: "system", action: out.status === "confirmed" ? "registration.confirmed" : "registration.matched", entityType: "doctor", entityId: d.id, before: out.status === "matched" && out.replaces?.length ? { numberOnFile: primaryReg?.number ?? null, belongsTo: out.replaces.map((c) => `${c.council} ${c.registrationNo} ${c.name}`) } : null, after: { council: m.council, number: m.registrationNo, year: m.year, degree: m.detail?.degree ?? null, university: m.detail?.university ?? null, source: "nmc-imr", query: out.query }, reason: "NMC Indian Medical Register match (scripts/enrich.ts)" });
                await tx.update(s.doctorEnrichment).set({ ...stamp, nmcStatus: out.status, nmcCandidates: null }).where(eq(s.doctorEnrichment.doctorId, d.id));
                await tx.update(s.doctors).set({ lastVerifiedOn: today, updatedAt: new Date() }).where(eq(s.doctors.id, d.id));
              });
              await recomputeQuality(d.id);
            } else if (out.status === "ambiguous" || out.status === "number_mismatch" || out.status === "removed") {
              const candidates: Candidate[] = "candidates" in out ? out.candidates : [out.match];
              await db.update(s.doctorEnrichment).set({ ...stamp, nmcStatus: out.status, nmcCandidates: candidates.map((c) => ({ doctorId: c.doctorId, registrationNo: c.registrationNo, council: c.council, name: c.name, year: c.year, degree: c.detail?.degree ?? null, university: c.detail?.university ?? null, place: c.detail?.place ?? null, removed: c.detail?.removed ?? false })) }).where(eq(s.doctorEnrichment.doctorId, d.id));
            } else {
              await db.update(s.doctorEnrichment).set({ ...stamp, nmcStatus: "not_found", nmcCandidates: null }).where(eq(s.doctorEnrichment.doctorId, d.id));
            }
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          bump("nmc:error");
          console.log(`  nmc → error ${msg}`);
          if (!DRY) await db.update(s.doctorEnrichment).set({ attempts: sql`${s.doctorEnrichment.attempts} + 1`, lastError: `nmc: ${msg}`.slice(0, 500), updatedAt: new Date() }).where(eq(s.doctorEnrichment.doctorId, d.id));
          // A transient network blip is not a reason to abandon the run. Back
          // off and keep going; only a register that stays unreachable across
          // several consecutive doctors is treated as down. (This guard used
          // to stop on the first "fetch failed", which is survivable for a
          // 40-minute scheduled run that retries within the hour, but throws
          // away a long catch-up run on one dropped packet.)
          nmcFailures++;
          if (nmcFailures >= NMC_GIVE_UP) {
            console.log(`register unreachable for ${nmcFailures} doctors in a row; stopping the NMC step for this run`);
            stopAll = true;
            return;
          }
          if (/fetch failed|ECONN|ETIMEDOUT|certificate|socket|network/i.test(msg)) {
            const wait = Math.min(60_000, 5_000 * nmcFailures);
            console.log(`  register unreachable (${nmcFailures}/${NMC_GIVE_UP}); waiting ${wait / 1000}s`);
            await new Promise((r) => setTimeout(r, wait));
          }
        }
      }
    }

    /* ---- Google ---- */
    if (wantGoogle && google && googleBudget > 0 && (!enr || enr.googleStatus === "pending" || SLUG)) {
      if (!practice || !loc) {
        bump("google:skipped");
        if (!DRY) await db.update(s.doctorEnrichment).set({ googleStatus: "skipped", googleCheckedAt: new Date(), updatedAt: new Date() }).where(eq(s.doctorEnrichment.doctorId, d.id));
      } else {
        const p: ProfileForGoogle = {
          doctorName: d.name,
          facilityName: practice.facility.name,
          address: practice.facility.address,
          postalCode: practice.facility.postalCode,
          phone: practice.facility.phone ?? practice.phone ?? null,
          localityName: loc.name,
          cityName: loc.city,
          stateName: loc.state,
          lat: practice.facility.lat ? Number(practice.facility.lat) : loc.lat ? Number(loc.lat) : null,
          lng: practice.facility.lng ? Number(practice.facility.lng) : loc.lng ? Number(loc.lng) : null,
        };
        try {
          googleBudget--;
          const out = await google.match(p);
          bump(`google:${out.status}`);
          console.log(`  google → ${out.status} ${out.score}${out.best ? ` "${out.best.name}" — ${out.reasons.join(", ")}` : ""}`);
          if (!DRY) {
            await db.update(s.doctorEnrichment).set({
              googleStatus: out.status,
              googlePlaceId: out.status === "matched" ? out.best!.id : null,
              googleMapsUri: out.status === "matched" ? out.best!.mapsUri : null,
              googleName: out.best?.name ?? null,
              googleAddress: out.best?.address ?? null,
              googlePhone: out.best?.phone ?? null,
              googleWebsite: out.best?.website ?? null,
              googleAddressMatch: out.status === "matched" ? out.addressMatch : null,
              googleScore: out.score,
              googleCheckedAt: new Date(),
              updatedAt: new Date(),
            }).where(eq(s.doctorEnrichment.doctorId, d.id));
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          bump("google:error");
          console.log(`  google → error ${msg}`);
          if (!DRY) await db.update(s.doctorEnrichment).set({ googleStatus: /403|PERMISSION|API key|quota|RESOURCE_EXHAUSTED/i.test(msg) ? "pending" : "error", attempts: sql`${s.doctorEnrichment.attempts} + 1`, lastError: `google: ${msg}`.slice(0, 500), googleCheckedAt: new Date(), updatedAt: new Date() }).where(eq(s.doctorEnrichment.doctorId, d.id));
          if (/403|PERMISSION|API key|quota|RESOURCE_EXHAUSTED|429/i.test(msg)) {
            console.log("Google refused the key or quota; stopping the Google step for this run");
            googleBudget = 0;
          }
        }
      }
    }

    if (++done % 100 === 0) console.log(`— ${done}/${rows.length} processed`);
   }
  }

  const clients = Array.from({ length: CONCURRENCY }, () => new NmcClient({ log: (m) => process.env.ENRICH_VERBOSE && console.log(m) }));
  await Promise.all(clients.map((c) => processDoctors(c)));
  const nmcRequests = clients.reduce((n, c) => n + c.requests, 0);

  const remaining = await db.execute(sql`select
      count(*) filter (where nmc_status = 'pending')::int as nmc_pending,
      count(*) filter (where nmc_status in ('confirmed','matched'))::int as nmc_done,
      count(*) filter (where nmc_status in ('ambiguous','number_mismatch','removed'))::int as nmc_queue,
      count(*) filter (where google_status = 'pending')::int as google_pending,
      count(*) filter (where google_status = 'matched')::int as google_matched
    from doctor_enrichment`);
  console.log("tally:", JSON.stringify(tally));
  console.log("state:", JSON.stringify(remaining[0]));
  console.log(`requests: nmc=${nmcRequests} google=${google?.requests ?? 0}`);
  await client.end();
  const g = (globalThis as { __tdi_db?: { sql: { end: (o?: { timeout: number }) => Promise<void> } } }).__tdi_db;
  if (g) await g.sql.end({ timeout: 5 });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

