import { config } from "dotenv";
import { and, eq, gte, inArray, sql as raw } from "drizzle-orm";

import { getDb } from "../../lib/db/client";
import { todayIso } from "../../lib/db/dates";
import * as s from "../../lib/db/schema";
import { GoogleClient } from "../../lib/enrich/google";
import { STATE_NAMES } from "../../lib/nmc/classify";
import { buildRegisterQuery, parseIndianAddress, pickRegisterMatch } from "../../lib/nmc/research-match";
import { recomputeQuality } from "../../lib/services/doctors";
import { ensureLocality } from "../../lib/services/places";
import { revalidateSite } from "../revalidate-site";

config({ path: ".env.local" });
config();

/**
 * Research register-built drafts and publish the ones that can be placed.
 *
 *   npm run nmc:research -- [--batch 5000] [--minutes 50] [--concurrency 4] [--daily-cap 150000] [--state karnataka] [--dry] [--slug x]
 *
 * For each draft from the NMC register import (google_status pending): one
 * Places text search — "Dr <name> <speciality>, <state>, India" — and the
 * strict matcher in lib/nmc/research-match.ts. On a match the listing becomes
 * the doctor's practice (facility with Google's address, pincode,
 * coordinates, phone and website; locality = the nearest known one within
 * 3 km, else the city), the profile is PUBLISHED, its quality is recomputed
 * and an audit row records the evidence. No match, or more than one, leaves
 * the draft as it is with the outcome recorded on doctor_enrichment and
 * nmc_register.
 *
 * Spend: one Text Search (Pro SKU) per doctor. --daily-cap (default
 * GOOGLE_PLACES_DAILY_CAP, 1500) bounds a UTC day across every run, counting
 * the live worker's searches too.
 */

const args = process.argv.slice(2);
const arg = (k: string, d: string) => {
  const i = args.indexOf(k);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const BATCH = Number(arg("--batch", "5000"));
const MINUTES = Number(arg("--minutes", "50"));
const CONCURRENCY = Math.max(1, Math.min(16, Number(arg("--concurrency", "4"))));
const DAILY_CAP = Number(arg("--daily-cap", process.env.GOOGLE_PLACES_DAILY_CAP ?? "1500"));
const STATE = arg("--state", "");
const SLUG = arg("--slug", "");
const DRY = args.includes("--dry");
/** Anatomy, pharmacology, community medicine…: rarely a clinic in the doctor's name, so not worth a search unless asked. */
const NON_CLINICAL = args.includes("--include-non-clinical") ? "" : "non-clinical-medicine";
const SOURCE = "import:nmc-register (nmc.org.in IMR export 2026-09-29)";
const EVIDENCE = "google-places-text-search";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function main() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key && !DRY) throw new Error("GOOGLE_PLACES_API_KEY is not set");
  const db = getDb();
  const today = todayIso();
  const deadline = Date.now() + MINUTES * 60_000;
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  const [{ used }] = await db.select({ used: raw<number>`count(*)::int` }).from(s.doctorEnrichment).where(and(gte(s.doctorEnrichment.googleCheckedAt, dayStart), inArray(s.doctorEnrichment.googleStatus, ["matched", "no_match", "error"])));
  let budget = Math.max(0, DAILY_CAP - used);
  if (budget === 0) {
    console.log(`daily cap ${DAILY_CAP} reached (${used} searches today)`);
    return;
  }

  const rows = await db.execute<{ id: string; name: string; slug: string; specialty_name: string; state_slug: string; source_record_id: number; specialty_basis: string | null }>(raw`
    select d.id, d.name, d.slug, sp.name as specialty_name, r.state_slug, r.source_record_id, r.specialty_basis
    from doctors d
    join nmc_register r on r.doctor_id = d.id
    join specialties sp on sp.key = d.specialty_key
    left join doctor_enrichment e on e.doctor_id = d.id
    where d.source = ${SOURCE} and d.status = 'draft' and r.state_slug is not null and d.specialty_key <> ${NON_CLINICAL}
      and coalesce(e.google_status, 'pending') = 'pending' and coalesce(e.attempts, 0) < 3
      ${STATE ? raw`and r.state_slug = ${STATE}` : raw``}
      ${SLUG ? raw`and d.slug = ${SLUG}` : raw``}
    order by r.specialty_rank desc, r.era_year desc nulls last, d.created_at
    limit ${Math.min(BATCH, budget)}`);
  console.log(`research: ${rows.length} drafts · budget ${budget} of ${DAILY_CAP} today · concurrency ${CONCURRENCY} · ${MINUTES} min · ${DRY ? "DRY RUN" : "writing"}`);

  // Localities with coordinates, by state, for nearest-neighbourhood placement.
  const locs = await db.select({ key: s.localities.key, name: s.localities.name, city: s.localities.city, citySlug: s.localities.citySlug, stateSlug: s.localities.stateSlug, lat: s.localities.lat, lng: s.localities.lng }).from(s.localities).where(eq(s.localities.active, true));
  const byState = new Map<string, typeof locs>();
  for (const l of locs) byState.set(l.stateSlug, [...(byState.get(l.stateSlug) ?? []), l]);

  const counts = new Map<string, number>();
  const bump = (k: string) => counts.set(k, (counts.get(k) ?? 0) + 1);
  const clients = Array.from({ length: CONCURRENCY }, () => new GoogleClient(key ?? "dry"));
  let cursor = 0;
  let published = 0;

  async function worker(client: GoogleClient) {
    while (cursor < rows.length && Date.now() < deadline && budget > 0) {
      const d = rows[cursor++];
      budget--;
      const stateName = STATE_NAMES[d.state_slug] ?? d.state_slug;
      const profile = { name: d.name, specialtyName: d.specialty_name, stateName };
      const query = buildRegisterQuery(profile);
      if (DRY) {
        console.log(`  ? ${query}`);
        bump("dry");
        continue;
      }
      try {
        const hits = await client.searchText(query);
        const out = pickRegisterMatch(hits, profile, query);
        bump(out.status);
        const stamp = { googleCheckedAt: new Date(), updatedAt: new Date() };
        if (out.status !== "matched" || !out.best) {
          await db.transaction(async (tx) => {
            await tx
              .insert(s.doctorEnrichment)
              .values({ doctorId: d.id, nmcStatus: "confirmed", googleStatus: "no_match", googleScore: out.passing, ...stamp })
              .onConflictDoUpdate({ target: s.doctorEnrichment.doctorId, set: { googleStatus: "no_match", googleScore: out.passing, googleName: null, googleAddress: null, ...stamp } });
            await tx.update(s.nmcRegister).set({ researchStatus: out.status, researchNote: `${query} → ${out.reasons.join("; ")}`, researchedAt: new Date() }).where(eq(s.nmcRegister.sourceRecordId, d.source_record_id));
          });
          continue;
        }
        const hit = out.best;
        const parsed = parseIndianAddress(hit.address, stateName);
        // Locality: nearest known neighbourhood within 3 km, else the city (created when new).
        let localityKey: string | null = null;
        const cands = byState.get(d.state_slug) ?? [];
        if (hit.lat !== null && hit.lng !== null) {
          let best: { key: string; km: number } | null = null;
          for (const l of cands) {
            if (!l.lat || !l.lng || l.key === l.citySlug) continue;
            const km = haversineKm(hit.lat, hit.lng, Number(l.lat), Number(l.lng));
            if (km <= 3 && (!best || km < best.km)) best = { key: l.key, km };
          }
          if (best) localityKey = best.key;
        }
        if (!localityKey && parsed.city) {
          const loc = await ensureLocality({ state: stateName, city: parsed.city });
          localityKey = loc.key;
          if (!cands.some((l) => l.key === loc.key)) byState.set(d.state_slug, [...cands, { key: loc.key, name: loc.name, city: loc.city, citySlug: loc.citySlug, stateSlug: loc.stateSlug, lat: null, lng: null }]);
        }
        if (!localityKey) {
          bump("matched but unplaceable (no city in address)");
          await db.transaction(async (tx) => {
            await tx.insert(s.doctorEnrichment).values({ doctorId: d.id, nmcStatus: "confirmed", googleStatus: "no_match", googlePlaceId: hit.id, googleName: hit.name, googleAddress: hit.address, ...stamp }).onConflictDoUpdate({ target: s.doctorEnrichment.doctorId, set: { googleStatus: "no_match", googlePlaceId: hit.id, googleName: hit.name, googleAddress: hit.address, ...stamp } });
            await tx.update(s.nmcRegister).set({ researchStatus: "unplaceable", researchNote: `${query} → "${hit.name}", ${hit.address}: no city`, researchPlaceId: hit.id, researchedAt: new Date() }).where(eq(s.nmcRegister.sourceRecordId, d.source_record_id));
          });
          continue;
        }
        await db.transaction(async (tx) => {
          const [f] = await tx
            .insert(s.facilities)
            .values({ name: hit.name, localityKey: localityKey!, address: parsed.street, postalCode: parsed.postalCode, lat: hit.lat !== null ? String(hit.lat) : null, lng: hit.lng !== null ? String(hit.lng) : null, geocodeSource: EVIDENCE, geocodeConfidence: hit.lat !== null ? "0.8" : null, phone: hit.phone, website: hit.website, confirmedOn: null })
            .returning({ id: s.facilities.id });
          await tx.insert(s.doctorPractices).values({ doctorId: d.id, facilityId: f.id, days: "", hours: "", feeInr: null, phone: hit.phone, sort: 0 });
          await tx
            .insert(s.doctorEnrichment)
            .values({ doctorId: d.id, nmcStatus: "confirmed", googleStatus: "matched", googlePlaceId: hit.id, googleMapsUri: hit.mapsUri, googleName: hit.name, googleAddress: hit.address, googlePhone: hit.phone, googleWebsite: hit.website, googleAddressMatch: true, googleScore: 100, ...stamp })
            .onConflictDoUpdate({ target: s.doctorEnrichment.doctorId, set: { googleStatus: "matched", googlePlaceId: hit.id, googleMapsUri: hit.mapsUri, googleName: hit.name, googleAddress: hit.address, googlePhone: hit.phone, googleWebsite: hit.website, googleAddressMatch: true, googleScore: 100, ...stamp } });
          await tx.update(s.doctors).set({ status: "published", publishedAt: new Date(), updatedAt: new Date(), lastVerifiedOn: today }).where(eq(s.doctors.id, d.id));
          await tx.insert(s.auditLogs).values({
            actorRole: "system",
            action: "doctor.imported_published",
            entityType: "doctor",
            entityId: d.id,
            after: { query, placeId: hit.id, listing: hit.name, address: hit.address, phone: hit.phone, website: hit.website, localityKey, reasons: out.reasons, evidence: EVIDENCE },
            reason: "Published from the NMC register import after a Google Places listing in the doctor's name, in the council's state, was found and no other listing competed (scripts/nmc/research.ts). Practice and fee remain unconfirmed by the doctor.",
          });
          await tx.update(s.nmcRegister).set({ researchStatus: "matched", researchNote: `${query} → "${hit.name}", ${hit.address}`, researchPlaceId: hit.id, researchedAt: new Date() }).where(eq(s.nmcRegister.sourceRecordId, d.source_record_id));
        });
        await recomputeQuality(d.id);
        published++;
        console.log(`  ✓ ${d.name} → "${hit.name}", ${parsed.city ?? "?"} · /doctor/${d.slug}`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        bump("error");
        console.log(`  ✗ ${d.name}: ${msg.slice(0, 160)}`);
        await db
          .insert(s.doctorEnrichment)
          .values({ doctorId: d.id, nmcStatus: "confirmed", googleStatus: "pending", attempts: 1, lastError: msg.slice(0, 500), updatedAt: new Date() })
          .onConflictDoUpdate({ target: s.doctorEnrichment.doctorId, set: { attempts: raw`${s.doctorEnrichment.attempts} + 1`, lastError: msg.slice(0, 500), updatedAt: new Date() } });
        if (/403|API key|PERMISSION_DENIED|quota|RESOURCE_EXHAUSTED/i.test(msg)) {
          console.log("  stopping: the Places API is refusing requests");
          cursor = rows.length;
        }
      }
      const n = [...counts.values()].reduce((a, b) => a + b, 0);
      if (n % 200 === 0) console.log(`  … ${n} / ${rows.length} · published ${published}`);
    }
  }

  await Promise.all(clients.map(worker));
  console.log("outcomes:", Object.fromEntries([...counts.entries()].sort((a, b) => b[1] - a[1])), `· published ${published}`);
  if (published && !DRY) await revalidateSite();
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
