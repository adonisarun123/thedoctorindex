import type { Locality, LocalityKey, Specialty, SpecialtyKey } from "@/lib/types";

/**
 * Controlled taxonomy. Adding a speciality here is a governed act: it needs a
 * canonical slug, its patient-language aliases, and original medically reviewed
 * guidance before any page for it can be indexed.
 */
export { SPECIALTIES } from "@/lib/data/specialties";
import { SPECIALTIES } from "@/lib/data/specialties";

export const SPECIALTY_KEYS = Object.keys(SPECIALTIES) as SpecialtyKey[];

const SLUG_TO_SPECIALTY: Record<string, SpecialtyKey> = Object.fromEntries(
  SPECIALTY_KEYS.map((k) => [SPECIALTIES[k].slug, k]),
);

export function specialtyBySlug(slug: string): Specialty | null {
  const key = SLUG_TO_SPECIALTY[slug];
  return key ? SPECIALTIES[key] : null;
}

/**
 * The /specialties/ hub is addressed by the speciality itself (cardiology),
 * while listing pages are addressed by the practitioner noun (cardiologists).
 * A speciality is a field of medicine; the people are what a patient browses.
 */
export function specialtyByKey(key: string): Specialty | null {
  return (SPECIALTIES as Record<string, Specialty>)[key] ?? null;
}

/**
 * Seed-mode geography: the six Bengaluru localities the fixture doctors use.
 * With a database the `localities` table is the registry (lib/data/geo.ts).
 */
export const LOCALITIES: Record<LocalityKey, Locality> = {
  indiranagar: mk("indiranagar", "Indiranagar", 12.9784, 77.6408),
  koramangala: mk("koramangala", "Koramangala", 12.9352, 77.6245),
  jayanagar: mk("jayanagar", "Jayanagar", 12.9308, 77.5838),
  whitefield: mk("whitefield", "Whitefield", 12.9698, 77.75),
  "hsr-layout": mk("hsr-layout", "HSR Layout", 12.9116, 77.6389),
  malleshwaram: mk("malleshwaram", "Malleshwaram", 13.0031, 77.5643),
};

/**
 * Approximate locality centroids (WGS84, ~4 decimal places). They stand in
 * for a facility's own coordinates until the geocoder (GEOCODING_* in .env)
 * has run, and are the anchor for "near me" distances in the meantime.
 */
function mk(key: LocalityKey, name: string, lat: number, lng: number): Locality {
  return {
    key,
    slug: key,
    name,
    city: "Bengaluru",
    citySlug: "bengaluru",
    state: "Karnataka",
    stateSlug: "karnataka",
    lat,
    lng,
  };
}

export const LOCALITY_KEYS = Object.keys(LOCALITIES) as LocalityKey[];

/**
 * Maps a free-text patient query onto one canonical speciality. Synonyms with
 * the same search intent resolve to the same page; they never get one of
 * their own.
 */
export function resolveSpecialtyQuery(query: string): Specialty | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  for (const key of SPECIALTY_KEYS) {
    const s = SPECIALTIES[key];
    if (
      s.name.toLowerCase().includes(q) ||
      s.plural.toLowerCase().includes(q) ||
      s.one.toLowerCase().includes(q) ||
      s.slug.includes(q)
    ) {
      return s;
    }
    if (s.aliases.some((a) => a.includes(q) || q.includes(a))) return s;
  }
  return null;
}
