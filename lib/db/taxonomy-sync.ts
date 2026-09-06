import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { LOCALITIES, LOCALITY_KEYS, SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { toIso } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";


/**
 * Mirrors the static registries into the database: every speciality in
 * lib/data/specialties.ts (doctors.specialty_key references it) and the
 * seed localities. Idempotent; run by `npm run db:taxonomy`, the seed script
 * and the importer. Localities created since (by imports or forms) are left
 * untouched.
 */
export async function syncTaxonomy(db: PostgresJsDatabase<typeof s>): Promise<{ specialties: number; localities: number }> {
  for (const [i, key] of SPECIALTY_KEYS.entries()) {
    const sp = SPECIALTIES[key];
    const row = { name: sp.name, plural: sp.plural, one: sp.one, aOne: sp.aOne, slug: sp.slug, department: sp.department, aliases: sp.aliases, guide: sp.guide, whenItems: sp.when, reviewedOn: sp.reviewedOn ? toIso(sp.reviewedOn) : null, sort: i, active: true };
    await db.insert(s.specialties).values({ key, ...row }).onConflictDoUpdate({ target: s.specialties.key, set: row });
  }
  for (const [i, key] of LOCALITY_KEYS.entries()) {
    const l = LOCALITIES[key];
    const row = { slug: l.slug, name: l.name, city: l.city, citySlug: l.citySlug, state: l.state, stateSlug: l.stateSlug, lat: l.lat === null ? null : String(l.lat), lng: l.lng === null ? null : String(l.lng), sort: i };
    await db.insert(s.localities).values({ key, ...row }).onConflictDoUpdate({ target: s.localities.key, set: row });
  }
  return { specialties: SPECIALTY_KEYS.length, localities: LOCALITY_KEYS.length };
}
