/**
 * Typed access to the environment variables this front end reads.
 *
 * Every variable is documented in .env.example. This module is the only place
 * process.env is parsed, so a rename or a default change happens once. Values
 * are read at build time for static routes and at request time for dynamic
 * ones; both see the same defaults.
 *
 * Anything not listed here is RESERVED in .env.example — named for the service
 * it belongs to, but not consumed by this repository.
 */

function num(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function str(name: string, fallback: string): string {
  const raw = process.env[name];
  return raw === undefined || raw === "" ? fallback : raw;
}

function flag(name: string, fallback = false): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  return raw === "1" || raw.toLowerCase() === "true";
}

export const env = {
  /* --- site ------------------------------------------------------------- */
  siteUrl: str("NEXT_PUBLIC_SITE_URL", "https://thedoctorindex.in").replace(/\/$/, ""),
  siteName: str("NEXT_PUBLIC_SITE_NAME", "The Doctor Index"),
  grievanceEmail: str("NEXT_PUBLIC_GRIEVANCE_EMAIL", "grievance@thedoctorindex.in"),
  supportEmail: str("NEXT_PUBLIC_SUPPORT_EMAIL", "support@thedoctorindex.in"),
  emergencyNumber: str("NEXT_PUBLIC_EMERGENCY_NUMBER", "108"),
  /** Official profiles for Organization.sameAs; comma-separated absolute URLs. */
  socialLinks: str("NEXT_PUBLIC_SOCIAL_LINKS", "").split(",").map((u) => u.trim()).filter((u) => /^https?:\/\//.test(u)),
  /** Handle for twitter:site (e.g. @thedoctorindex). Empty = tag omitted. */
  twitterHandle: str("NEXT_PUBLIC_TWITTER_HANDLE", ""),
  /** Google Search Console HTML-tag verification token. Empty = tag omitted. */
  googleSiteVerification: str("GOOGLE_SITE_VERIFICATION", ""),
  bingSiteVerification: str("BING_SITE_VERIFICATION", ""),
  appEnv: str("APP_ENV", process.env.NODE_ENV === "production" ? "production" : "development"),
  forceNoindex: flag("FORCE_NOINDEX"),
  routeInspector: flag("NEXT_PUBLIC_ROUTE_INSPECTOR"),
  /** "1" / "0" to force the "seed data" banner on or off; unset = shown only while the seed dataset is the data source. */
  demoBanner: process.env.NEXT_PUBLIC_DEMO_BANNER === undefined || process.env.NEXT_PUBLIC_DEMO_BANNER === "" ? null : flag("NEXT_PUBLIC_DEMO_BANNER"),
  mediaCdnUrl: str("NEXT_PUBLIC_MEDIA_CDN_URL", ""),

  /* --- launch cluster ---------------------------------------------------- */
  defaultCountry: str("NEXT_PUBLIC_DEFAULT_COUNTRY", "IN"),
  defaultStateSlug: str("NEXT_PUBLIC_DEFAULT_STATE_SLUG", "karnataka"),
  defaultCitySlug: str("NEXT_PUBLIC_DEFAULT_CITY_SLUG", "bengaluru"),
  locale: str("NEXT_PUBLIC_LOCALE", "en-IN"),
  timezone: str("NEXT_PUBLIC_TIMEZONE", "Asia/Kolkata"),
  currency: str("NEXT_PUBLIC_CURRENCY", "INR"),

  /* --- indexation gates (plan §6) ---------------------------------------- */
  gates: {
    profileQuality: num("GATE_PROFILE_QUALITY", 70),
    citySpecialty: num("GATE_CITY_SPECIALTY_MIN_DOCTORS", 3),
    localitySpecialty: num("GATE_LOCALITY_SPECIALTY_MIN_DOCTORS", 5),
    nationalSpecialty: num("GATE_NATIONAL_SPECIALTY_MIN_DOCTORS", 3),
    /** Localities with at least this many indexable doctors get a link from the city page. */
    localityLinkMin: num("GATE_LOCALITY_LINK_MIN_DOCTORS", 2),
  },

  /* --- ranking weights (plan §8.3) --------------------------------------- */
  ranking: {
    relevance: num("RANK_WEIGHT_RELEVANCE", 35),
    location: num("RANK_WEIGHT_LOCATION", 20),
    verification: num("RANK_WEIGHT_VERIFICATION", 15),
    completeness: num("RANK_WEIGHT_COMPLETENESS", 10),
    freshness: num("RANK_WEIGHT_FRESHNESS", 10),
    reviewConfidence: num("RANK_WEIGHT_REVIEW_CONFIDENCE", 10),
    /** Review count at which the confidence discount reaches full weight. */
    reviewConfidenceFullAt: num("RANK_REVIEW_CONFIDENCE_FULL_AT", 25),
  },

  /* --- freshness windows (plan §9.5) ------------------------------------- */
  freshness: {
    feeDays: num("FRESHNESS_FEE_DAYS", 90),
    practiceDays: num("FRESHNESS_PRACTICE_DAYS", 180),
    registrationDays: num("FRESHNESS_REGISTRATION_DAYS", 365),
    /** Days without reconfirmation after which a profile leaves the index. */
    deindexAfterDays: num("FRESHNESS_DEINDEX_AFTER_DAYS", 365),
  },

  /* --- feature flags ----------------------------------------------------- */
  features: {
    mapView: flag("NEXT_PUBLIC_FEATURE_MAP_VIEW"),
    reviewsOpen: flag("NEXT_PUBLIC_FEATURE_REVIEWS_OPEN", true),
    enquiries: flag("NEXT_PUBLIC_FEATURE_ENQUIRIES", true),
    whatsapp: flag("NEXT_PUBLIC_FEATURE_WHATSAPP"),
    clinicPages: flag("NEXT_PUBLIC_FEATURE_CLINIC_PAGES"),
    sponsored: flag("NEXT_PUBLIC_FEATURE_SPONSORED"),
    doctorDashboard: flag("NEXT_PUBLIC_FEATURE_DOCTOR_DASHBOARD", true),
  },
} as const;
