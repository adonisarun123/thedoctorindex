import { config } from "dotenv";
import { and, eq, isNull, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as s from "../lib/db/schema";

config({ path: ".env.local" });
config();

/**
 * Geocode facilities that have no coordinates (or whose address changed, which
 * clears them). Provider from GEOCODING_PROVIDER:
 *
 *   nominatim  OpenStreetMap, no key, ≤1 request/second, usage policy requires a
 *              contact in the User-Agent (GEOCODING_CONTACT_EMAIL). Fine for a
 *              few hundred rows a day; not for bulk.
 *   google     Geocoding API with GEOCODING_API_KEY; region bias GEOCODING_REGION_BIAS.
 *
 * Results below GEOCODING_MIN_CONFIDENCE are not written. Every write records
 * source + confidence so staff can see, and override, where a pin came from.
 *
 *   npm run db:geocode            # geocode everything missing
 *   npm run db:geocode -- --dry   # print what would happen
 *   npm run db:geocode -- --limit 20
 */
type Hit = { lat: number; lng: number; confidence: number; label: string };

async function nominatim(q: string): Promise<Hit | null> {
  const contact = process.env.GEOCODING_CONTACT_EMAIL ?? process.env.EMAIL_REPLY_TO ?? "ops@example.com";
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=${process.env.GEOCODING_REGION_BIAS ?? "in"}&q=${encodeURIComponent(q)}`;
  const r = await fetch(url, { headers: { "User-Agent": `TheDoctorIndex/1.0 (${contact})`, Accept: "application/json" } });
  if (!r.ok) throw new Error(`nominatim ${r.status}`);
  const j = (await r.json()) as Array<{ lat: string; lon: string; importance?: number; display_name: string; type: string }>;
  if (!j.length) return null;
  const h = j[0];
  // Nominatim's "importance" is not a confidence; treat a building/amenity hit as strong, a street/locality as weak.
  const strong = ["hospital", "clinic", "doctors", "building", "house", "commercial", "office", "yes"].includes(h.type);
  return { lat: Number(h.lat), lng: Number(h.lon), confidence: strong ? 0.85 : 0.55, label: h.display_name };
}

async function google(q: string): Promise<Hit | null> {
  const key = process.env.GEOCODING_API_KEY;
  if (!key) throw new Error("GEOCODING_API_KEY is required for the google provider");
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&region=${process.env.GEOCODING_REGION_BIAS ?? "in"}&key=${key}`;
  const r = await fetch(url);
  const j = (await r.json()) as { status: string; results: Array<{ geometry: { location: { lat: number; lng: number }; location_type: string }; formatted_address: string; partial_match?: boolean }> };
  if (j.status !== "OK" || !j.results.length) return null;
  const h = j.results[0];
  const conf = h.geometry.location_type === "ROOFTOP" ? 0.95 : h.geometry.location_type === "RANGE_INTERPOLATED" ? 0.8 : h.geometry.location_type === "GEOMETRIC_CENTER" ? 0.7 : 0.5;
  return { lat: h.geometry.location.lat, lng: h.geometry.location.lng, confidence: h.partial_match ? Math.min(conf, 0.6) : conf, label: h.formatted_address };
}

async function main() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const dry = process.argv.includes("--dry");
  const limitIdx = process.argv.indexOf("--limit");
  const limit = limitIdx > -1 ? Number(process.argv[limitIdx + 1]) : 500;
  const provider = (process.env.GEOCODING_PROVIDER ?? "nominatim").toLowerCase();
  const minConf = Number(process.env.GEOCODING_MIN_CONFIDENCE ?? 0.7);
  const geocode = provider === "google" ? google : nominatim;

  const client = postgres(url, { ssl: process.env.DATABASE_SSL === "disable" ? false : "require", max: 1, onnotice: () => {} });
  const db = drizzle(client, { schema: s });
  const rows = await db
    .select({ id: s.facilities.id, name: s.facilities.name, address: s.facilities.address, postalCode: s.facilities.postalCode, locality: s.localities.name, city: s.localities.city, state: s.localities.state })
    .from(s.facilities)
    .innerJoin(s.localities, eq(s.localities.key, s.facilities.localityKey))
    .where(and(or(isNull(s.facilities.lat), isNull(s.facilities.lng)), sql`coalesce(${s.facilities.geocodeSource}, '') <> 'manual'`))
    .limit(limit);
  console.log(`${rows.length} facilities to geocode via ${provider}${dry ? " (dry run)" : ""}`);

  let written = 0, weak = 0, missed = 0;
  for (const f of rows) {
    const q = [f.name, f.address, f.locality, f.city, f.postalCode, f.state, "India"].filter(Boolean).join(", ");
    let hit: Hit | null = null;
    try {
      hit = await geocode(q);
      if (!hit && provider === "nominatim") hit = await geocode([f.address, f.locality, f.city, f.postalCode].filter(Boolean).join(", "));
    } catch (e) {
      console.error(`  ! ${f.name}: ${e instanceof Error ? e.message : e}`);
    }
    if (!hit) {
      missed++;
      console.log(`  - ${f.name}: no result`);
    } else if (hit.confidence < minConf) {
      weak++;
      console.log(`  ~ ${f.name}: ${hit.lat},${hit.lng} conf ${hit.confidence} < ${minConf} — not written (${hit.label})`);
    } else {
      written++;
      console.log(`  + ${f.name}: ${hit.lat},${hit.lng} conf ${hit.confidence}`);
      if (!dry) {
        await db.update(s.facilities).set({ lat: String(hit.lat), lng: String(hit.lng), geocodeSource: provider, geocodeConfidence: String(hit.confidence) }).where(eq(s.facilities.id, f.id));
        await db.insert(s.auditLogs).values({ actorRole: "system", action: "facility.geocoded", entityType: "facility", entityId: f.id, after: { lat: hit.lat, lng: hit.lng, provider, confidence: hit.confidence, label: hit.label } });
      }
    }
    if (provider === "nominatim") await new Promise((r) => setTimeout(r, 1100));
  }
  console.log(`written ${written}, below confidence ${weak}, no result ${missed}`);
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
