import { bestScore, normalize } from "@/lib/search/fuzzy";
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
 * their own. Every speciality is scored against the query (exact, prefix,
 * a term contained in the query, then one or two typos — "cardiolgy",
 * "skn doctor") and the best one wins, so a misspelling lands on the listing
 * rather than /search and a short term such as "ent" no longer matches
 * whichever alias happens to contain those letters.
 */
export function resolveSpecialtyQuery(query: string): Specialty | null {
  if (normalize(query).length < 3) return null;
  const top = suggestSpecialties(query, 1)[0];
  return top && top.score >= 40 ? top.item : null;
}

/** What one speciality can be found by: its names, slug and patient-language aliases. */
export function specialtyTerms(s: Specialty): string[] {
  return [s.name, s.plural, s.one, s.slug.replace(/-/g, " "), ...s.aliases];
}

/** Specialities ranked against a partial, possibly misspelt, query — the search box's suggestions. */
export function suggestSpecialties(query: string, limit = 6): Array<{ item: Specialty; score: number }> {
  const q = normalize(query);
  if (!q) return [];
  const padded = ` ${q} `;
  const all = SPECIALTY_KEYS.map((k) => SPECIALTIES[k]);
  const out: Array<{ item: Specialty; score: number; i: number }> = [];
  all.forEach((item, i) => {
    // The speciality's own names outrank an alias that merely starts the same way ("ca" → cardiology before "cataract").
    const own = bestScore(q, [item.name, item.plural, item.one, item.slug.replace(/-/g, " ")]);
    const alias = bestScore(q, item.aliases);
    let score = Math.max(own, alias >= 70 ? alias - 6 : alias);
    // "best heart doctor near me": a term used as a whole word inside a longer query.
    if (score < 75 && q.includes(" ") && specialtyTerms(item).some((t) => t.length >= 3 && padded.includes(` ${normalize(t)} `))) score = 75;
    if (score > 0) out.push({ item, score, i });
  });
  return out
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, limit)
    .map(({ item, score }) => ({ item, score }));
}
