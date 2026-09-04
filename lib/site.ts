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
    "Find a doctor in India and see exactly what has been verified: registration, qualification and current practice are checked separately, and each carries its source and date.",
  /** Date the seed dataset was last reconciled. Shown as the data freshness date. */
  dataSnapshot: "04 Sep 2026",
  /** Published grievance contact. Required before the platform accepts reviews. */
  grievanceEmail: env.grievanceEmail,
  supportEmail: env.supportEmail,
  emergencyNumber: env.emergencyNumber,
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
