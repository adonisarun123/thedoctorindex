/**
 * Single source of truth for anything that appears in a canonical URL, a
 * sitemap entry, or a piece of structured data. Internal links, canonicals,
 * redirects and sitemap URLs must agree; they can only do that if they are all
 * built from here.
 */

import { env } from "@/lib/env";

export const SITE = {
  name: env.siteName,
  shortName: "Doctor Index",
  /**
   * Absolute origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL in the
   * environment for previews and staging so canonicals never point at prod
   * from a preview deployment.
   */
  origin: env.siteUrl,
  tagline: "Verified doctors in India",
  description:
    "Find a doctor in India and see exactly what was verified: registration, qualification and current practice, each checked separately, with source and date.",
  /** Official profiles, from NEXT_PUBLIC_SOCIAL_LINKS. */
  socialLinks: env.socialLinks,
  twitterHandle: env.twitterHandle,
  /** Date the seed dataset was last reconciled. Shown as the data freshness date. */
  dataSnapshot: "04 Sep 2026",
  /** Published grievance contact. Required before the platform accepts reviews. */
  grievanceEmail: env.grievanceEmail,
  supportEmail: env.supportEmail,
  emergencyNumber: env.emergencyNumber,
} as const;

/**
 * The launch city: header and footer quick links, the default place for a
 * search without a location, and the example city in editorial copy. Any
 * other city is reached through the geography registry (lib/data/geo.ts).
 */
export const HOME_CITY = {
  name: env.defaultCityName,
  slug: env.defaultCitySlug,
  state: env.defaultStateName,
  stateSlug: env.defaultStateSlug,
} as const;

/** Build an absolute URL for canonicals, sitemaps and JSON-LD. */
export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE.origin}${path === "/" ? "/" : path.replace(/\/$/, "")}`;
}

/* ---------------------------------------------------------------------------
   Canonical path builders. Nothing in the app should hand-write these strings.
--------------------------------------------------------------------------- */

export const paths = {
  home: () => "/",
  doctor: (slug: string) => `/doctor/${slug}`,
  /** Hub page, addressed by speciality key: /specialties/cardiology */
  specialty: (specialtyKey: string) => `/specialties/${specialtyKey}`,
  citySpecialty: (stateSlug: string, citySlug: string, specialtySlug: string) =>
    `/doctors/${stateSlug}/${citySlug}/${specialtySlug}`,
  localitySpecialty: (
    stateSlug: string,
    citySlug: string,
    localitySlug: string,
    specialtySlug: string,
  ) => `/doctors/${stateSlug}/${citySlug}/${localitySlug}/${specialtySlug}`,
  search: (q: string) => `/search?q=${encodeURIComponent(q)}`,
  addDoctor: () => "/add-doctor",
  forDoctors: () => "/for-doctors",
  signIn: (next?: string) => (next ? `/sign-in?next=${encodeURIComponent(next)}` : "/sign-in"),
  account: () => "/account",
  claimProfile: () => "/claim-profile",
  policy: (slug: string) => `/policies/${slug}`,
} as const;
