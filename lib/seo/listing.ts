import { getGeo } from "@/lib/data/geo";
import { specialtyBySlug } from "@/lib/data/taxonomy";
import { paths } from "@/lib/site";
import type { City, Locality, Specialty } from "@/lib/types";

/**
 * Resolves the catch-all listing segments to a canonical page, or null.
 * Shared by the page, its metadata and its social-card route so the three
 * can never disagree about what a URL means.
 *
 *   1 segment  → /doctors/karnataka/bengaluru/cardiologists
 *   2 segments → /doctors/karnataka/bengaluru/indiranagar/cardiologists
 *
 * State, city and locality all come from the geography registry, so a URL
 * exists exactly when the place exists as data.
 */
export interface ListingParams {
  state: string;
  city: string;
  segments: string[];
}

export interface ResolvedListing {
  specialty: Specialty;
  city: City;
  locality: Locality | null;
  canonicalPath: string;
  placeName: string;
}

export async function resolveListing(params: ListingParams): Promise<ResolvedListing | null> {
  const { state, city: citySlug, segments } = params;
  const geo = await getGeo();
  const city = geo.city(state, citySlug);
  if (!city) return null;
  if (segments.length === 1) {
    const specialty = specialtyBySlug(segments[0]);
    if (!specialty) return null;
    return { specialty, city, locality: null, canonicalPath: paths.citySpecialty(state, citySlug, specialty.slug), placeName: city.name };
  }
  if (segments.length === 2) {
    const locality = geo.localityBySlug(state, citySlug, segments[0]);
    const specialty = specialtyBySlug(segments[1]);
    if (!locality || !specialty) return null;
    return { specialty, city, locality, canonicalPath: paths.localitySpecialty(state, citySlug, locality.slug, specialty.slug), placeName: `${locality.name}, ${city.name}` };
  }
  return null;
}
