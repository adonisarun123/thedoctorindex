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
  /** Which browse pages may index: inventory thresholds alone, or verified supply plus reviewed guidance. LISTING_INDEX_MODE */
  listingIndexMode: env.gates.listingIndexMode,
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
 * The pool listing gates and "eligible" counts draw on: every publishable
 * profile in "all" mode, verified supply in "verified" mode. A listing page is
 * useful with thin profiles on it, so this stays wider than the index set.
 */
export function isProfileEligible(d: Doctor): boolean {
  return GATES.profileIndexMode === "all" ? isProfilePublishable(d) : isProfileVerified(d);
}

/** A bio this long is written text about the doctor, not a one-line template. */
export const PROFILE_ABOUT_MIN_CHARS = 200;

/**
 * A profile with something on it a reader could not get from the name and
 * speciality alone: claimed by the doctor, a consented photo, a real bio, or a
 * quality score at the gate. 24k imported profiles with none of these made up
 * 86% of the sitemap on 27 Sep 2026 and Google stopped fetching; they stay
 * live and linked, with noindex, and re-qualify the day one of these arrives.
 * Mirrored in SQL by SUBSTANTIVE_SQL in lib/data/db-source.ts.
 */
/** A Doctor plus the one view field the substance test reads (DoctorView carries it). */
export type IndexableDoctor = Doctor & { photoUrl?: string | null };

export function isProfileSubstantive(d: IndexableDoctor): boolean {
  return (
    d.claimed ||
    Boolean(d.photoUrl) ||
    (d.about ?? "").trim().length > PROFILE_ABOUT_MIN_CHARS ||
    d.qualityScore >= GATES.profileQuality
  );
}

/**
 * Whether the profile carries index,follow and goes into the sitemap.
 *
 * In "all" mode an eligible profile is indexed once it is substantive, and the
 * page itself says what has and has not been verified. In "verified" mode only
 * verified supply is indexed. Everything else stays reachable by link and
 * on-site search, with noindex.
 */
export function isProfileIndexable(d: IndexableDoctor): boolean {
  return GATES.profileIndexMode === "all" ? isProfilePublishable(d) && isProfileSubstantive(d) : isProfileVerified(d);
}

export function profileGate(d: IndexableDoctor): GateResult {
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
    {
      label: "Substantive: claimed, photo, bio or quality at the gate",
      pass: isProfileSubstantive(d),
      detail: d.claimed
        ? "Claimed by the doctor"
        : d.photoUrl
          ? "Consented photo on record"
          : (d.about ?? "").trim().length > PROFILE_ABOUT_MIN_CHARS
            ? "Bio on record"
            : d.qualityScore >= GATES.profileQuality
              ? "Quality at the gate"
              : "Name and speciality only — noindex until one arrives",
    },
    ...verification.map((c) => ({ ...c, label: `${c.label} (shown, not required)` })),
  ];
  return { indexable: checks[0].pass && checks[1].pass, checks };
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

  const all = GATES.listingIndexMode === "all";
  const checks = [
    {
      label: "Supply",
      pass: indexableCount >= threshold,
      detail: `${indexableCount} indexable doctors against a threshold of ${threshold}`,
    },
    {
      label: "Locally specific data modules",
      pass: indexableCount > 0,
      detail: "Verified count, localities covered, fee range and practice availability",
    },
    {
      // In "all" mode the guidance is still written and still shown on the
      // page; it just no longer decides whether the page may index, so the 39
      // specialities without a reviewed guide are not held out of the index.
      label: all ? "Original speciality guidance (shown, not required)" : "Original speciality guidance",
      pass: hasOriginalGuidance,
      detail: "Guidance written for this speciality, not another speciality's copy with the nouns swapped. A clinician's review is a separate claim, made only where `reviewedOn` is set.",
    },
  ];
  const required = all ? checks.slice(0, 2) : checks;
  return { indexable: required.every((c) => c.pass), checks };
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
    "q",
    "near",
  ];
  return FACET_KEYS.some((k) => {
    const v = searchParams[k];
    return v !== undefined && v !== "";
  });
}

/**
 * The ?page= of a listing, read strictly. Pagination is not a facet: page 2
 * of a listing is a distinct set of profiles and the only link most of them
 * get, so it is self-canonical and indexable like page 1. Until 27 Sep 2026
 * every page past the first was noindex and canonicalised to page 1, which
 * left ~24k profiles reachable only through the sitemap.
 *
 * Returns 1 when absent, the page number when it is a clean integer >= 2,
 * "first" for an explicit ?page=1 (redirect to the bare URL), and null for
 * anything else (404 — no unbounded parameter space).
 */
export function listingPageParam(searchParams: Record<string, string | string[] | undefined>): number | "first" | null {
  const raw = searchParams.page;
  if (raw === undefined) return 1;
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "1") return "first";
  return /^[1-9][0-9]{0,3}$/.test(v ?? "") ? Number(v) : null;
}
