import { env } from "@/lib/env";
import type { Doctor } from "@/lib/types";
import { hasDate, registrationState } from "@/lib/verification";

/**
 * Indexation gates (project plan §6).
 *
 * The moat is a reliable structured database, not the number of URLs we can
 * generate. A page is indexable only when it is genuinely useful, and these
 * functions are the single place that decides. Routes call them for
 * generateStaticParams (which URLs get built), for generateMetadata (robots),
 * and for the sitemap (which URLs get submitted) — so those three can never
 * drift apart.
 *
 * The thresholds are operating defaults, not Google requirements. Tune them
 * against demand and verified supply.
 */

export const GATES = {
  /** Which profiles are indexed: every published profile, or only verified ones. PROFILE_INDEX_MODE */
  profileIndexMode: env.gates.profileIndexMode,
  /** Minimum quality score for a doctor profile to count as verified supply (and, in verified mode, to be indexed). GATE_PROFILE_QUALITY */
  profileQuality: env.gates.profileQuality,
  /** Minimum indexable doctors before a city × speciality page is indexed. GATE_CITY_SPECIALTY_MIN_DOCTORS */
  citySpecialty: env.gates.citySpecialty,
  /** Minimum indexable doctors before a locality × speciality page is indexed. GATE_LOCALITY_SPECIALTY_MIN_DOCTORS */
  localitySpecialty: env.gates.localitySpecialty,
  /** Minimum indexable doctors before a national speciality page is indexed. GATE_NATIONAL_SPECIALTY_MIN_DOCTORS */
  nationalSpecialty: env.gates.nationalSpecialty,
  /** Localities linked from a city page. GATE_LOCALITY_LINK_MIN_DOCTORS */
  localityLinkMin: env.gates.localityLinkMin,
} as const;

export interface GateResult {
  indexable: boolean;
  /** Human-readable checks, in the order they are evaluated. */
  checks: Array<{ label: string; pass: boolean; detail: string }>;
}

/**
 * Verified supply: the quality score clears the gate and the current practice
 * has been confirmed inside the freshness window. This is what listing gates,
 * "verified" counts and the featured/nearby pools mean by a verified doctor,
 * whatever the index mode.
 */
export function isProfileVerified(d: Doctor): boolean {
  return d.qualityScore >= GATES.profileQuality && d.status === "active";
}

/** A profile that exists as a page at all: not retired, with at least one practice to place it. */
export function isProfilePublishable(d: Doctor): boolean {
  return d.status !== "retired" && d.practices.length > 0;
}

/**
 * Whether the profile carries index,follow and goes into the sitemap.
 *
 * In "all" mode every publishable profile is indexed and the page itself says
 * what has and has not been verified (verification line, register check,
 * FAQ). In "verified" mode only verified supply is indexed and the rest stays
 * reachable by direct link and on-site search, with noindex.
 */
export function isProfileIndexable(d: Doctor): boolean {
  return GATES.profileIndexMode === "all" ? isProfilePublishable(d) : isProfileVerified(d);
}

export function profileGate(d: Doctor): GateResult {
  const reg = registrationState(d);
  const verification = [
    {
      label: "Registration verified",
      pass: reg === "verified",
      detail: reg === "verified" ? `${d.registration.council} · checked ${d.registration.checkedOn}` : reg === "submitted" ? "Supplied, not yet checked against the register" : "No registration number on record",
    },
    {
      label: "Current practice confirmed",
      pass: d.status === "active",
      detail:
        d.status === "active"
          ? `Last confirmed ${d.practices[0]?.confirmedOn}`
          : hasDate(d.practices[0]?.confirmedOn)
            ? `Not reconfirmed since ${d.practices[0]?.confirmedOn}`
            : "Never confirmed with the practice",
    },
    {
      label: "Quality score",
      pass: d.qualityScore >= GATES.profileQuality,
      detail: `${d.qualityScore} against a gate of ${GATES.profileQuality}`,
    },
  ];
  if (GATES.profileIndexMode === "verified") return { indexable: verification.every((c) => c.pass), checks: verification };
  const checks = [
    {
      label: "Published with a practice",
      pass: isProfilePublishable(d),
      detail: d.status === "retired" ? "Retired record" : d.practices.length ? `${d.practices.length} practice location${d.practices.length === 1 ? "" : "s"} on record` : "No practice location on record",
    },
    ...verification.map((c) => ({ ...c, label: `${c.label} (shown, not required)` })),
  ];
  return { indexable: checks[0].pass, checks };
}

export function listingGate(
  kind: "city" | "locality" | "national",
  indexableCount: number,
  hasOriginalGuidance: boolean,
): GateResult {
  const threshold =
    kind === "locality"
      ? GATES.localitySpecialty
      : kind === "city"
        ? GATES.citySpecialty
        : GATES.nationalSpecialty;

  const checks = [
    {
      label: "Verified supply",
      pass: indexableCount >= threshold,
      detail: `${indexableCount} indexable doctors against a threshold of ${threshold}`,
    },
    {
      label: "Locally specific data modules",
      pass: indexableCount > 0,
      detail: "Verified count, localities covered, fee range and practice availability",
    },
    {
      label: "Original medically reviewed guidance",
      pass: hasOriginalGuidance,
      detail: "Speciality guidance written and reviewed for this page, not swapped city names",
    },
  ];
  return { indexable: checks.every((c) => c.pass), checks };
}

/**
 * Any filter, sort or free-text parameter makes the view a facet, not a
 * landing page. Faceted views are never separately indexable unless a route is
 * explicitly promoted into the allowlist (plan §11.4).
 */
export function hasFacetParams(searchParams: Record<string, string | string[] | undefined>): boolean {
  const FACET_KEYS = [
    "locality",
    "online",
    "gender",
    "language",
    "experience",
    "fee",
    "claimed",
    "evidence",
    "sort",
    "page",
    "q",
    "near",
  ];
  return FACET_KEYS.some((k) => {
    const v = searchParams[k];
    return v !== undefined && v !== "";
  });
}
