import "server-only";

import { unstable_cache } from "next/cache";

import { DATA_CACHE_TAG } from "@/lib/data/cache-tag";
import { LOCALITIES } from "@/lib/data/taxonomy";
import { databaseReadyForBuild, isBuildPhase } from "@/lib/db/readiness";
export { placeName, placeSlug } from "@/lib/geo-names";
import { normalize, rank } from "@/lib/search/fuzzy";
import type { City, Locality, State } from "@/lib/types";

/**
 * Geography registry: country > state > city > locality.
 *
 * Localities are rows in the `localities` table (or the static Bengaluru set
 * in seed mode); states and cities are derived from them, so opening a city
 * is a data change, never a code change.
 *
 * Almost every request reads this registry, and the table is the whole
 * country — a few thousand rows. It is cached twice: in-process for a minute
 * (the hot path, free), and under the shared `doctors` tag in Next's data
 * cache (the cold path, so a new serverless instance does not go to Postgres
 * for the same rows). `invalidateGeo()` drops the local memo; `revalidateTag`
 * drops the shared one, and the admin taxonomy actions and the importer call
 * both through revalidateDoctors().
 */

export interface Geo {
  localities: Locality[];
  cities: City[];
  states: State[];
  locality(key: string): Locality | null;
  /** Locality by its URL segment within a city. */
  localityBySlug(stateSlug: string, citySlug: string, slug: string): Locality | null;
  city(stateSlug: string, citySlug: string): City | null;
  state(stateSlug: string): State | null;
  localitiesIn(citySlug: string): Locality[];
  citiesIn(stateSlug: string): City[];
}

function build(localities: Locality[]): Geo {
  const byKey = new Map(localities.map((l) => [l.key, l]));
  const bySlug = new Map(localities.map((l) => [`${l.stateSlug}/${l.citySlug}/${l.slug}`, l]));
  const cityMap = new Map<string, City>();
  const stateMap = new Map<string, State>();
  for (const l of localities) {
    if (!cityMap.has(`${l.stateSlug}/${l.citySlug}`)) cityMap.set(`${l.stateSlug}/${l.citySlug}`, { slug: l.citySlug, name: l.city, state: l.state, stateSlug: l.stateSlug });
    if (!stateMap.has(l.stateSlug)) stateMap.set(l.stateSlug, { slug: l.stateSlug, name: l.state });
  }
  const cities = [...cityMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  const states = [...stateMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  return {
    localities,
    cities,
    states,
    locality: (key) => byKey.get(key) ?? null,
    localityBySlug: (st, ci, sl) => bySlug.get(`${st}/${ci}/${sl}`) ?? null,
    city: (st, ci) => cityMap.get(`${st}/${ci}`) ?? null,
    state: (st) => stateMap.get(st) ?? null,
    localitiesIn: (ci) => localities.filter((l) => l.citySlug === ci),
    citiesIn: (st) => cities.filter((c) => c.stateSlug === st),
  };
}

const SEED_GEO = build(Object.values(LOCALITIES));
/** Stands in during `next build` when the database is unreachable or unmigrated (lib/db/readiness.ts). */
const EMPTY_GEO = build([]);

let cache: { geo: Geo; at: number } | null = null;
const TTL_MS = 60_000;

function useDb(): boolean {
  if (process.env.DATA_SOURCE === "seed") return false;
  if (process.env.DATA_SOURCE === "db") return true;
  return Boolean(process.env.DATABASE_URL);
}

export async function getGeo(): Promise<Geo> {
  if (!useDb()) return SEED_GEO;
  if (cache && Date.now() - cache.at < TTL_MS) return cache.geo;
  if (isBuildPhase() && !(await databaseReadyForBuild())) return EMPTY_GEO;
  const localities = await loadLocalities();
  cache = { geo: build(localities), at: Date.now() };
  return cache.geo;
}

async function readLocalities(): Promise<Locality[]> {
  const { getDb } = await import("@/lib/db/client");
  const s = await import("@/lib/db/schema");
  const rows = await getDb().select().from(s.localities).where((await import("drizzle-orm")).eq(s.localities.active, true)).orderBy(s.localities.sort, s.localities.name);
  return rows.map((r) => ({
    key: r.key,
    slug: r.slug ?? r.key,
    name: r.name,
    city: r.city,
    citySlug: r.citySlug,
    state: r.state,
    stateSlug: r.stateSlug,
    lat: r.lat !== null && Number.isFinite(Number(r.lat)) ? Number(r.lat) : null,
    lng: r.lng !== null && Number.isFinite(Number(r.lng)) ? Number(r.lng) : null,
  }));
}

/** Outside a Next server runtime (scripts, tests) unstable_cache has no store to write to. */
async function loadLocalities(): Promise<Locality[]> {
  if (!process.env.NEXT_RUNTIME || isBuildPhase()) return readLocalities();
  return unstable_cache(readLocalities, ["geo:localities"], { revalidate: 3600, tags: [DATA_CACHE_TAG] })();
}

export function invalidateGeo(): void {
  cache = null;
}

/** State/city slugs for a person's saved place (locality key, else city name). */
export async function userPlace(localityKey: string | null, city: string | null): Promise<{ stateSlug: string | null; citySlug: string | null }> {
  const geo = await getGeo();
  const loc = localityKey ? geo.locality(localityKey) : null;
  if (loc) return { stateSlug: loc.stateSlug, citySlug: loc.citySlug };
  const c = city ? geo.cities.find((x) => x.name.toLowerCase() === city.trim().toLowerCase()) : null;
  return { stateSlug: c?.stateSlug ?? null, citySlug: c?.slug ?? null };
}

export interface PlaceSuggestion {
  kind: "city" | "locality";
  /** "Indiranagar" / "Bengaluru" */
  name: string;
  /** "Bengaluru, Karnataka" for a locality; the state for a city. */
  detail: string;
  /** What to put in the location field so the server resolves it unambiguously. */
  text: string;
  stateSlug: string;
  citySlug: string;
  localitySlug?: string;
}

/**
 * Cities and localities ranked against a partial, possibly misspelt, query
 * ("bangalor" → Bengaluru, "indranagar" → Indiranagar, Bengaluru). Cities
 * outrank localities on an equal score.
 */
export async function suggestPlaces(q: string, limit = 6): Promise<PlaceSuggestion[]> {
  const geo = await getGeo();
  if (!normalize(q)) return [];
  const cities = rank(q, geo.cities, (c) => [c.name, c.slug.replace(/-/g, " ")], limit).map(({ item, score }) => ({
    score: score + 0.5,
    s: { kind: "city" as const, name: item.name, detail: item.state, text: item.name, stateSlug: item.stateSlug, citySlug: item.slug },
  }));
  const localities = rank(q, geo.localities.filter((l) => l.slug !== l.citySlug), (l) => [l.name, l.slug.replace(/-/g, " ")], limit).map(({ item, score }) => ({
    score,
    s: { kind: "locality" as const, name: item.name, detail: `${item.city}, ${item.state}`, text: `${item.name}, ${item.city}`, stateSlug: item.stateSlug, citySlug: item.citySlug, localitySlug: item.slug },
  }));
  return [...cities, ...localities].sort((a, b) => b.score - a.score).slice(0, limit).map((x) => x.s);
}

/**
 * Free-text place → city or locality. Exact name first, then prefix, then
 * substring; localities win over cities of the same name only on exact match.
 * "Locality, City" (what a picked suggestion submits) resolves the locality
 * within that city. Failing all of those, a query within a typo or two of a
 * place name still resolves.
 */
export async function resolvePlaceQuery(q: string): Promise<{ name: string; stateSlug: string; citySlug: string; locality: Locality | null } | null> {
  const needle = q.trim().toLowerCase();
  if (!needle) return null;
  const geo = await getGeo();
  const cityHit = (pred: (n: string) => boolean) => geo.cities.find((c) => pred(c.name.toLowerCase()) || pred(c.slug));
  const locHit = (pred: (n: string) => boolean) => geo.localities.find((l) => l.slug !== l.citySlug && (pred(l.name.toLowerCase()) || pred(l.slug)));
  const asLoc = (l: Locality) => ({ name: `${l.name}, ${l.city}`, stateSlug: l.stateSlug, citySlug: l.citySlug, locality: l });
  const asCity = (c: City) => ({ name: c.name, stateSlug: c.stateSlug, citySlug: c.slug, locality: null });
  if (needle.includes(",")) {
    const [locPart, cityPart] = needle.split(",").map((x) => x.trim());
    const city = cityPart ? cityHit((n) => n === cityPart) : null;
    const l = city ? geo.localities.find((x) => x.citySlug === city.slug && x.stateSlug === city.stateSlug && (x.name.toLowerCase() === locPart || x.slug === locPart)) : null;
    if (l) return asLoc(l);
    if (city) return asCity(city);
  }
  const exactCity = cityHit((n) => n === needle);
  if (exactCity) return asCity(exactCity);
  const exactLoc = locHit((n) => n === needle);
  if (exactLoc) return asLoc(exactLoc);
  const c = cityHit((n) => n.startsWith(needle)) ?? cityHit((n) => n.includes(needle));
  if (c) return asCity(c);
  const l = locHit((n) => n.startsWith(needle)) ?? locHit((n) => n.includes(needle));
  if (l) return asLoc(l);
  const [fuzzy] = await suggestPlaces(needle, 1);
  if (!fuzzy) return null;
  if (fuzzy.kind === "city") {
    const fc = geo.city(fuzzy.stateSlug, fuzzy.citySlug);
    return fc ? asCity(fc) : null;
  }
  const fl = fuzzy.localitySlug ? geo.localityBySlug(fuzzy.stateSlug, fuzzy.citySlug, fuzzy.localitySlug) : null;
  return fl ? asLoc(fl) : null;
}
