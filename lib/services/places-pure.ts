/** Locality key: globally unique, derived from city + area slug; the city-level locality is the city slug itself. */
export function localityKeyFor(citySlug: string, localitySlug: string): string {
  return localitySlug === citySlug ? citySlug : `${citySlug}-${localitySlug}`;
}
