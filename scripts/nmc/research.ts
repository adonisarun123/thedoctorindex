import { config } from "dotenv";
import { and, gte, inArray, sql as raw } from "drizzle-orm";

import { getDb } from "../../lib/db/client";
import * as s from "../../lib/db/schema";
import { GoogleClient } from "../../lib/enrich/google";
import { STATE_NAMES } from "../../lib/nmc/classify";
import { buildRegisterQuery, pickRegisterMatch } from "../../lib/nmc/research-match";
import { buildCityIndex, readSerp } from "../../lib/nmc/serp-match";
import { SerperClient } from "../../lib/nmc/serper";
import { revalidateSite } from "../revalidate-site";
import { Placer, placementFromHit, publishFromPlacement, recordOutcome, type Draft } from "./publish-listing";

config({ path: ".env.local" });
config();

/**
 * Research register-built drafts and publish the ones that can be placed.
 *
 *   npm run nmc:research -- --provider serper|places [--batch 5000] [--minutes 50] [--concurrency 4] [--daily-cap N] [--state karnataka] [--dry] [--slug x] [--include-non-clinical]
 *
 * One query per draft — "Dr <name> <speciality>, <state>, India" — then:
 *
 *   places  Google Places Text Search (Pro SKU, GOOGLE_PLACES_API_KEY). The
 *           listing rule in lib/nmc/research-match.ts.
 *   serper  A Google results page (SERPER_API_KEY, ~40x cheaper). The local
 *           pack / knowledge panel go through the same listing rule; failing
 *           that, organic titles and snippets under the stricter rule in
 *           lib/nmc/serp-match.ts (two results agreeing on one city and a
 *           named practice). The profile then gets a city-level practice —
 *           no coordinates, no street address — which the doctor confirms
 *           on claiming.
 *
 * Every publish goes through scripts/nmc/publish-listing.ts. --daily-cap
 * bounds a UTC day across every run and the live worker.
 */

const args = process.argv.slice(2);
const arg = (k: string, d: string) => {
  const i = args.indexOf(k);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const PROVIDER = arg("--provider", "serper") as "serper" | "places";
const BATCH = Number(arg("--batch", "5000"));
const MINUTES = Number(arg("--minutes", "50"));
const CONCURRENCY = Math.max(1, Math.min(16, Number(arg("--concurrency", "4"))));
const DAILY_CAP = Number(arg("--daily-cap", PROVIDER === "places" ? process.env.GOOGLE_PLACES_DAILY_CAP ?? "1500" : process.env.SERPER_DAILY_CAP ?? "20000"));
const STATE = arg("--state", "");
const SLUG = arg("--slug", "");
const DRY = args.includes("--dry");
/** Anatomy, pharmacology, community medicine…: rarely a clinic in the doctor's name, so not worth a search unless asked. */
const NON_CLINICAL = args.includes("--include-non-clinical") ? "" : "non-clinical-medicine";
const SOURCE = "import:nmc-register (nmc.org.in IMR export 2026-09-29)";

async function main() {
  const placesKey = process.env.GOOGLE_PLACES_API_KEY;
  const serperKey = process.env.SERPER_API_KEY;
  if (!DRY && PROVIDER === "places" && !placesKey) throw new Error("GOOGLE_PLACES_API_KEY is not set");
  if (!DRY && PROVIDER === "serper" && !serperKey) throw new Error("SERPER_API_KEY is not set");
  const db = getDb();
  const deadline = Date.now() + MINUTES * 60_000;
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  const [{ used }] = await db.select({ used: raw<number>`count(*)::int` }).from(s.doctorEnrichment).where(and(gte(s.doctorEnrichment.googleCheckedAt, dayStart), inArray(s.doctorEnrichment.googleStatus, ["matched", "no_match", "error"])));
  let budget = Math.max(0, DAILY_CAP - used);
  if (budget === 0) {
    console.log(`daily cap ${DAILY_CAP} reached (${used} lookups today)`);
    return;
  }

  const rows = (await db.execute<Record<string, unknown>>(raw`
    select d.id, d.name, d.slug, sp.name as specialty_name, r.state_slug, r.source_record_id, r.specialty_basis, r.era_year
    from doctors d
    join nmc_register r on r.doctor_id = d.id
    join specialties sp on sp.key = d.specialty_key
    left join doctor_enrichment e on e.doctor_id = d.id
    where d.source = ${SOURCE} and d.status = 'draft' and r.state_slug is not null and d.specialty_key <> ${NON_CLINICAL}
      and coalesce(e.google_status, 'pending') = 'pending' and coalesce(e.attempts, 0) < 3
      ${STATE ? raw`and r.state_slug = ${STATE}` : raw``}
      ${SLUG ? raw`and d.slug = ${SLUG}` : raw``}
    order by r.specialty_rank desc, r.era_year desc nulls last, d.created_at
    limit ${Math.min(BATCH, budget)}`)) as unknown as Array<Draft & { specialty_name: string; specialty_basis: string | null; era_year: number | null }>;
  for (const r of rows) r.source_record_id = Number(r.source_record_id);
  console.log(`research (${PROVIDER}): ${rows.length} drafts · budget ${budget} of ${DAILY_CAP} today · concurrency ${CONCURRENCY} · ${MINUTES} min · ${DRY ? "DRY RUN" : "writing"}`);

  const placer = new Placer();
  await placer.load();
  const cityIdx = new Map<string, ReturnType<typeof buildCityIndex>>();
  const idxFor = (stateSlug: string) => {
    if (!cityIdx.has(stateSlug)) cityIdx.set(stateSlug, buildCityIndex(placer.cities(stateSlug)));
    return cityIdx.get(stateSlug)!;
  };

  const counts = new Map<string, number>();
  const bump = (k: string) => counts.set(k, (counts.get(k) ?? 0) + 1);
  let cursor = 0;
  let published = 0;
  let requests = 0;

  async function worker() {
    const google = PROVIDER === "places" ? new GoogleClient(placesKey ?? "dry") : null;
    const serper = PROVIDER === "serper" ? new SerperClient(serperKey ?? "dry") : null;
    while (cursor < rows.length && Date.now() < deadline && budget > 0) {
      const d = rows[cursor++];
      budget--;
      const stateName = STATE_NAMES[d.state_slug] ?? d.state_slug;
      const profile = { name: d.name, specialtyName: d.specialty_name, stateName, eraYear: d.era_year };
      const query = buildRegisterQuery(profile);
      if (DRY) {
        console.log(`  ? ${query}`);
        bump("dry");
        continue;
      }
      try {
        requests++;
        if (google) {
          const hits = await google.searchText(query);
          const out = pickRegisterMatch(hits, profile, query);
          bump(`listing:${out.status}`);
          if (out.status === "matched" && out.best) {
            const p = placementFromHit(out.best, stateName, query, "google-places-text-search");
            p.reasons = out.reasons;
            const res = await publishFromPlacement(d, p, placer);
            if (res.ok) {
              published++;
              console.log(`  ✓ ${d.name} → "${p.facilityName}", ${p.city ?? "?"} · /doctor/${d.slug}`);
            } else bump(res.reason!);
          } else await recordOutcome(d, out.status, `${query} → ${out.reasons.join("; ")}`);
        } else if (serper) {
          // Local pack first (the Places rule, highest precision); the results page only when it gives nothing.
          const local = await serper.places(query);
          let out = readSerp({ places: local.places ?? [], organic: [] }, profile, query, idxFor(d.state_slug));
          if (out.listing.status !== "matched") {
            requests++;
            const r = await serper.search(query);
            out = readSerp({ ...r, places: local.places ?? [] }, profile, query, idxFor(d.state_slug));
          }
          if (out.listing.status === "matched" && out.listing.best) {
            bump("listing:matched");
            const p = placementFromHit(out.listing.best, stateName, query, "serper-local-pack");
            p.reasons = out.listing.reasons;
            const res = await publishFromPlacement(d, p, placer);
            if (res.ok) {
              published++;
              console.log(`  ✓ ${d.name} → "${p.facilityName}", ${p.city ?? "?"} [local pack] · /doctor/${d.slug}`);
            } else bump(res.reason!);
          } else if (out.organic.status === "matched" && out.organic.city && out.organic.practice) {
            bump("organic:matched");
            const p = { evidence: "serper-organic" as const, query, facilityName: out.organic.practice, address: [out.organic.locality, out.organic.city].filter(Boolean).join(", "), postalCode: null, lat: null, lng: null, phone: null, website: null, city: out.organic.city, locality: out.organic.locality, placeId: null, mapsUri: null, urls: out.organic.urls, reasons: out.organic.reasons, confidence: "0.5" };
            const res = await publishFromPlacement(d, p, placer);
            if (res.ok) {
              published++;
              console.log(`  ✓ ${d.name} → "${p.facilityName}", ${p.city} [organic: ${out.organic.urls[0]}] · /doctor/${d.slug}`);
            } else bump(res.reason!);
          } else {
            const status = out.listing.status === "ambiguous" || out.organic.status === "ambiguous" ? "ambiguous" : "no_match";
            bump(`${status}${out.organic.city ? " (city only)" : ""}`);
            await recordOutcome(d, status, `${query} → listing: ${out.listing.reasons.join("; ")} · organic: ${out.organic.reasons.join("; ")}${out.organic.city ? ` · city ${out.organic.city}` : ""}`);
          }
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        bump("error");
        console.log(`  ✗ ${d.name}: ${msg.slice(0, 160)}`);
        await db
          .insert(s.doctorEnrichment)
          .values({ doctorId: d.id, nmcStatus: "confirmed", googleStatus: "pending", attempts: 1, lastError: msg.slice(0, 500), updatedAt: new Date() })
          .onConflictDoUpdate({ target: s.doctorEnrichment.doctorId, set: { attempts: raw`${s.doctorEnrichment.attempts} + 1`, lastError: msg.slice(0, 500), updatedAt: new Date() } });
        if (/40[13]|API key|PERMISSION_DENIED|quota|RESOURCE_EXHAUSTED|429|credits/i.test(msg)) {
          console.log("  stopping: the provider is refusing requests");
          cursor = rows.length;
        }
      }
      const n = [...counts.values()].reduce((a, b) => a + b, 0);
      if (n % 100 === 0) console.log(`  … ${n} / ${rows.length} · published ${published}`);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log("outcomes:", Object.fromEntries([...counts.entries()].sort((a, b) => b[1] - a[1])), `· published ${published} · ${requests} requests`);
  if (published && !DRY) await revalidateSite();
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
