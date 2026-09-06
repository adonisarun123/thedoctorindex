import "server-only";

import { and, eq } from "drizzle-orm";

import { getGeo, invalidateGeo, placeName, placeSlug } from "@/lib/data/geo";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import type { Locality } from "@/lib/types";
import { localityKeyFor } from "@/lib/services/places-pure";
export { localityKeyFor };

/**
 * Geography writes. A locality is created the first time a place is named —
 * by the importer, by a doctor adding a practice, or by staff — and reused
 * afterwards. Keys are stable ("indore-vijay-nagar"); URL slugs are unique
 * within a city. Every city also gets a locality that stands for the city
 * itself ("Indore") for practices whose area is unknown.
 */

export interface PlaceInput {
  state: string;
  city: string;
  /** Area / neighbourhood; empty = the city-level locality. */
  locality?: string | null;
}


/**
 * Resolves (state, city, locality) names to a locality row, creating it when
 * missing. Names are normalised (title case, collapsed whitespace) so "INDORE"
 * and "Indore " land on the same row.
 */
export async function ensureLocality(input: PlaceInput): Promise<Locality> {
  const state = placeName(input.state);
  const city = placeName(input.city);
  const locality = input.locality?.trim() ? placeName(input.locality) : city;
  const stateSlug = placeSlug(state);
  const citySlug = placeSlug(city);
  const slug = locality === city ? citySlug : placeSlug(locality);
  if (!stateSlug || !citySlug || !slug) throw new Error(`Cannot derive a place from ${JSON.stringify(input)}`);

  const geo = await getGeo();
  const existing = geo.localityBySlug(stateSlug, citySlug, slug);
  if (existing) return existing;

  const db = getDb();
  const key = localityKeyFor(citySlug, slug);
  const [row] = await db
    .insert(s.localities)
    .values({ key, slug, name: locality, city, citySlug, state, stateSlug, active: true, sort: locality === city ? 0 : 100 })
    .onConflictDoNothing({ target: s.localities.key })
    .returning();
  invalidateGeo();
  if (row) return { key: row.key, slug: row.slug, name: row.name, city: row.city, citySlug: row.citySlug, state: row.state, stateSlug: row.stateSlug, lat: null, lng: null };
  // Key existed under another state/city (rare slug clash) — read it back.
  const [found] = await db.select().from(s.localities).where(and(eq(s.localities.stateSlug, stateSlug), eq(s.localities.citySlug, citySlug), eq(s.localities.slug, slug))).limit(1);
  if (found) return { key: found.key, slug: found.slug, name: found.name, city: found.city, citySlug: found.citySlug, state: found.state, stateSlug: found.stateSlug, lat: null, lng: null };
  const [clash] = await db.insert(s.localities).values({ key: `${stateSlug}-${key}`, slug, name: locality, city, citySlug, state, stateSlug, active: true }).returning();
  invalidateGeo();
  return { key: clash.key, slug: clash.slug, name: clash.name, city: clash.city, citySlug: clash.citySlug, state: clash.state, stateSlug: clash.stateSlug, lat: null, lng: null };
}

/**
 * Form helper: a picker submits either an existing locality key, or a city
 * (state + city names) plus an optional new locality name. Returns the key.
 */
export async function localityFromForm(f: FormData): Promise<string | null> {
  const key = String(f.get("locality") ?? "").trim();
  const geo = await getGeo();
  if (key && geo.locality(key)) return key;
  const state = String(f.get("placeState") ?? "").trim();
  const city = String(f.get("placeCity") ?? "").trim();
  const locality = String(f.get("placeLocality") ?? "").trim();
  if (!state || !city) return null;
  if (!process.env.DATABASE_URL) return null;
  return (await ensureLocality({ state, city, locality })).key;
}
