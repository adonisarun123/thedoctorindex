import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { config } from "dotenv";
import { sql as raw } from "drizzle-orm";

import { getDb } from "../../lib/db/client";
import { nameTokens } from "../../lib/enrich/names";
import { REGISTER_COUNCILS } from "../../lib/nmc/classify";
import { osmNamesDoctor } from "../../lib/nmc/osm-match";
import { revalidateSite } from "../revalidate-site";
import { Placer, publishFromPlacement, type Draft, type Placement } from "./publish-listing";

config({ path: ".env.local" });
config();

/**
 * Offline research against OpenStreetMap: named health places (amenity =
 * doctors / clinic / hospital / dentist, healthcare = *) pulled once per
 * state with Overpass (.claude-tmp/osm/fetch.sh) and matched to every
 * register-built draft in that state. No per-doctor requests, no cost.
 *
 *   npm run nmc:research:osm -- [--dir .claude-tmp/osm] [--state karnataka] [--dry]
 *
 * Rule: exactly one OSM place in the state whose name carries the doctor's
 * name (lib/nmc/research-match.ts › listingNamesDoctor); a dental place
 * never matches a medical speciality. The place becomes the practice with
 * OSM's street, pincode, coordinates, phone and website; the locality is
 * the nearest known neighbourhood within 3 km, else the nearest known city
 * within 25 km, else addr:city. Coverage is small by nature — most clinics
 * in OSM India carry no doctor name.
 */

const args = process.argv.slice(2);
const arg = (k: string, d: string) => {
  const i = args.indexOf(k);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const DIR = arg("--dir", ".claude-tmp/osm");
const STATE = arg("--state", "");
const DRY = args.includes("--dry");
const SOURCE = "import:nmc-register (nmc.org.in IMR export 2026-09-29)";

type Poi = { id: string; name: string; lat: number; lng: number; tags: Record<string, string>; stateSlug: string };

function loadPois(): Map<string, Poi[]> {
  const byState = new Map<string, Poi[]>();
  const known = new Set(Object.values(REGISTER_COUNCILS).map((c) => c.stateSlug).filter(Boolean));
  for (const f of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
    const stateSlug = f.replace(/\.json$/, "");
    if (!known.has(stateSlug)) continue;
    const els = (JSON.parse(readFileSync(join(DIR, f), "utf8")) as { elements?: Array<{ type: string; id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }> }).elements ?? [];
    const pois: Poi[] = [];
    for (const e of els) {
      const lat = e.lat ?? e.center?.lat;
      const lng = e.lon ?? e.center?.lon;
      const name = e.tags?.name?.trim();
      if (!name || lat === undefined || lng === undefined) continue;
      pois.push({ id: `osm:${e.type}/${e.id}`, name, lat, lng, tags: e.tags ?? {}, stateSlug });
    }
    byState.set(stateSlug, pois);
  }
  return byState;
}

let lastNominatim = 0;
async function reverseCity(lat: number, lng: number): Promise<string | null> {
  const wait = 1100 - (Date.now() - lastNominatim);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastNominatim = Date.now();
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&lat=${lat}&lon=${lng}`, { headers: { "User-Agent": "TheDoctorIndex/1.0 (contact: abenteuer.india@gmail.com)" } });
    if (!res.ok) return null;
    const a = ((await res.json()) as { address?: Record<string, string> }).address ?? {};
    const raw = a.city ?? a.town ?? a.municipality ?? a.village ?? a.county ?? a.state_district ?? null;
    // "Khanpur Tehsil", "Medininagar(Daltonganj)", "Rewari district" → the place name alone.
    return raw ? raw.replace(/\s*\(.*?\)\s*/g, " ").replace(/\b(tehsil|taluk|taluka|mandal|block|district|sub-district|subdistrict|tahsil|circle)\b/gi, "").replace(/\s+/g, " ").trim() || null : null;
  } catch {
    return null;
  }
}

async function main() {
  const db = getDb();
  const pois = loadPois();
  console.log(`OSM places: ${[...pois.entries()].map(([s, p]) => `${s} ${p.length}`).join(" · ")}`);
  // Token index per state: only places whose name carries "Dr" or a person-like token are worth indexing, but indexing all is cheap.
  const index = new Map<string, Map<string, Poi[]>>();
  const poiById = new Map<string, Map<string, Poi>>();
  for (const [st, list] of pois) {
    poiById.set(st, new Map(list.map((p) => [p.id, p])));
    const m = new Map<string, Poi[]>();
    for (const p of list) for (const t of new Set(nameTokens(p.name).filter((t) => t.length >= 3))) m.set(t, [...(m.get(t) ?? []), p]);
    index.set(st, m);
  }

  const rows = (await db.execute<Record<string, unknown>>(raw`
    select d.id, d.name, d.slug, d.specialty_key, sp.name as specialty_name, r.state_slug, r.source_record_id
    from doctors d
    join nmc_register r on r.doctor_id = d.id
    join specialties sp on sp.key = d.specialty_key
    where d.source = ${SOURCE} and d.status = 'draft' and r.state_slug is not null
      and coalesce(r.research_status, 'pending') in ('pending', 'no_match', 'ambiguous', 'unplaceable')
      ${STATE ? raw`and r.state_slug = ${STATE}` : raw``}`)) as unknown as Array<Draft & { specialty_key: string; specialty_name: string }>;
  for (const r of rows) r.source_record_id = Number(r.source_record_id);
  console.log(`${rows.length} drafts to match${DRY ? " · DRY RUN" : ""}`);

  // Two drafts in one state with the same name cannot both be "Dr. Vijay Kumar": neither is matched.
  const sameName = new Map<string, number>();
  for (const d of rows) {
    const k = `${d.state_slug}|${nameTokens(d.name).filter((t) => t.length >= 3).sort().join(" ")}`;
    sameName.set(k, (sameName.get(k) ?? 0) + 1);
  }
  const placer = new Placer();
  await placer.load();
  const counts = new Map<string, number>();
  const bump = (k: string) => counts.set(k, (counts.get(k) ?? 0) + 1);
  let published = 0;
  for (const d of rows) {
    const idx = index.get(d.state_slug);
    if (!idx) {
      bump("no OSM data for state");
      continue;
    }
    const core = nameTokens(d.name).filter((t) => t.length >= 3);
    if (core.length < 2) {
      bump("name too short");
      continue;
    }
    if ((sameName.get(`${d.state_slug}|${[...core].sort().join(" ")}`) ?? 0) > 1) {
      bump("namesakes in the register");
      continue;
    }
    // Candidates: places sharing at least two core tokens with the name.
    const seen = new Map<string, number>();
    for (const t of new Set(core)) for (const p of idx.get(t) ?? []) seen.set(p.id, (seen.get(p.id) ?? 0) + 1);
    const byId = poiById.get(d.state_slug)!;
    const cands = [...seen.entries()].filter(([, n]) => n >= core.length).map(([id]) => byId.get(id)!);
    const passing = cands.filter((p) => osmNamesDoctor(p.name, d.name, d.specialty_key).ok && (d.specialty_key === "dentistry" || !/dent/i.test(`${p.tags.amenity ?? ""} ${p.tags.healthcare ?? ""}`)));
    if (passing.length === 0) {
      bump("no_match");
      continue;
    }
    if (passing.length > 1) {
      bump("ambiguous");
      continue;
    }
    const p = passing[0];
    const near = placer.nearestCity(p.lat, p.lng, d.state_slug);
    let city: string | null = p.tags["addr:city"] ?? near?.city ?? null;
    // No known city nearby: one paced Nominatim reverse lookup (city-level zoom) — OSM's own geocoder for OSM's own place.
    if (!city && !DRY) city = await reverseCity(p.lat, p.lng);
    const street = [p.tags["addr:housenumber"], p.tags["addr:street"], p.tags["addr:suburb"] ?? p.tags["addr:neighbourhood"]].filter(Boolean).join(", ");
    const placement: Placement = {
      evidence: "openstreetmap",
      query: `OSM ${p.id}`,
      facilityName: p.name,
      address: street || [near?.locality, city].filter(Boolean).join(", ") || p.name,
      postalCode: p.tags["addr:postcode"]?.match(/\d{6}/)?.[0] ?? null,
      lat: p.lat,
      lng: p.lng,
      phone: p.tags.phone ?? p.tags["contact:phone"] ?? null,
      website: p.tags.website ?? p.tags["contact:website"] ?? null,
      city,
      locality: p.tags["addr:suburb"] ?? near?.locality ?? null,
      placeId: p.id,
      mapsUri: `https://www.openstreetmap.org/${p.id.replace("osm:", "")}`,
      urls: [`https://www.openstreetmap.org/${p.id.replace("osm:", "")}`],
      reasons: ["OSM place named after the doctor", `${p.tags.amenity ?? p.tags.healthcare ?? "health"} place in ${d.state_slug}`],
      confidence: "0.7",
    };
    bump("matched");
    console.log(`  ${DRY ? "?" : "✓"} ${d.name} (${d.specialty_name}) → "${p.name}" ${city ?? "?"} · ${placement.address}`);
    if (DRY) continue;
    const res = await publishFromPlacement(d, placement, placer);
    if (res.ok) published++;
    else bump(res.reason!);
  }
  console.log("outcomes:", Object.fromEntries([...counts.entries()].sort((a, b) => b[1] - a[1])), `· published ${published}`);
  if (published && !DRY) await revalidateSite();
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
