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
  /** Minimum quality score for a doctor profile to be indexed. GATE_PROFILE_QUALITY */
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
 * A doctor profile is indexed only after registration and current practice are
 * verified and the quality score clears the gate. Everything else stays
 * reachable by direct link and by on-site search, with noindex.
 */
export function isProfileIndexable(d: Doctor): boolean {
  return d.qualityScore >= GATES.profileQuality && d.status === "active";
}

export function profileGate(d: Doctor): GateResult {
  const checks = [
    {
      label: "Registration verified",
      pass: registrationState(d) === "verified",
      detail: registrationState(d) === "verified" ? `${d.registration.council} · checked ${d.registration.checkedOn}` : registrationState(d) === "submitted" ? "Supplied, not yet checked against the register" : "No registration number on record",
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
  return { indexable: checks.every((c) => c.pass), checks };
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
