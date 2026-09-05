import { CITY, localityBySlug, specialtyBySlug } from "@/lib/data/taxonomy";
import { paths } from "@/lib/site";
import type { Locality, Specialty } from "@/lib/types";

/**
 * Resolves the catch-all listing segments to a canonical page, or null.
 * Shared by the page, its metadata and its social-card route so the three
 * can never disagree about what a URL means.
 *
 *   1 segment  → /doctors/karnataka/bengaluru/cardiologists
 *   2 segments → /doctors/karnataka/bengaluru/indiranagar/cardiologists
 */
export interface ListingParams {
  state: string;
  city: string;
  segments: string[];
}

export interface ResolvedListing {
  specialty: Specialty;
  locality: Locality | null;
  canonicalPath: string;
  placeName: string;
}

export function resolveListing(params: ListingParams): ResolvedListing | null {
  const { state, city, segments } = params;
  if (state !== CITY.stateSlug || city !== CITY.slug) return null;
  if (segments.length === 1) {
    const specialty = specialtyBySlug(segments[0]);
    if (!specialty) return null;
    return { specialty, locality: null, canonicalPath: paths.citySpecialty(state, city, specialty.slug), placeName: CITY.name };
  }
  if (segments.length === 2) {
    const locality = localityBySlug(segments[0]);
    const specialty = specialtyBySlug(segments[1]);
    if (!locality || !specialty) return null;
    return { specialty, locality, canonicalPath: paths.localitySpecialty(state, city, locality.key, specialty.slug), placeName: `${locality.name}, ${locality.city}` };
  }
  return null;
}
