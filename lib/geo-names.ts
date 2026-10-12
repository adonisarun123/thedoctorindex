/**
 * Pure helpers for place names; no server-only imports so scripts and tests can use them.
 */

/** URL-safe slug for place names: "Vijay Nagar" → "vijay-nagar". */
export function placeSlug(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "INDORE" / "kamrup metropolitan" → "Indore" / "Kamrup Metropolitan". */
export function placeName(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/(^|[\s(\-/])([a-z])/g, (m, pre, c) => pre + c.toUpperCase())
    .replace(/\bAnd\b/g, "and")
    .replace(/\bOf\b/g, "of");
}


/**
 * The cities India treats as metros. The homepage lists these first — they are
 * what a patient searches by name — and everything else underneath.
 *
 * Matched on slug, not display name, so a row imported as "Bangalore",
 * "Bengaluru" or "New Delhi" lands in the same group.
 */
const METRO_CITY_SLUGS = new Set([
  "ahmedabad",
  "bangalore",
  "bangalore-urban",
  "bengaluru",
  "chennai",
  "delhi",
  "hyderabad",
  "kolkata",
  "mumbai",
  "new-delhi",
  "pune",
]);

/** True for one of the metro cities above. */
export function isMetroCity(citySlug: string): boolean {
  return METRO_CITY_SLUGS.has(citySlug);
}

/**
 * Some imported records place doctors in a "locality" that is the whole city
 * (Indore in Indore; 443 of them on 12 Oct 2026, holding 17,170 doctors).
 * A page for that locality repeats the city page, so it is a duplicate, not
 * a place: no route, no sitemap entry, no link, no area guide, and the URL
 * itself 301s to the city page. The practices keep the locality key — the
 * data is right, there is just no second page for it.
 */
export function isCitywideLocality(locality: { slug: string; name: string; citySlug: string; city: string }): boolean {
  return locality.slug === locality.citySlug || locality.name.trim().toLowerCase() === locality.city.trim().toLowerCase();
}
