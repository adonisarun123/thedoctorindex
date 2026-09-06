/**
 * Domain types for The Doctor Index.
 *
 * These mirror the relational model in the project plan (§14). The seed data in
 * lib/data/doctors.ts satisfies these shapes; when the real API lands, only the
 * loader in lib/data/index.ts changes — every route and component below it is
 * already written against these types.
 */

/**
 * Speciality keys are the ids of the static registry in lib/data/specialties.ts
 * (mirrored into the `specialties` table). Locality keys are database rows.
 * Both were closed unions while only Bengaluru was open; they are open strings
 * now that the taxonomy is data.
 */
export type SpecialtyKey = string;
export type LocalityKey = string;

export interface Specialty {
  key: SpecialtyKey;
  /** Display name of the speciality, e.g. "Cardiology". */
  name: string;
  /** Plural practitioner noun, e.g. "Cardiologists". */
  plural: string;
  /** Singular practitioner noun, e.g. "Cardiologist". */
  one: string;
  /** Article-correct singular for prose, e.g. "a cardiologist". */
  aOne: string;
  /** URL segment. One canonical slug per speciality; synonyms never get their own. */
  slug: string;
  /** Parent department for browse pages. */
  department: string;
  /**
   * Patient-language synonyms mapped to this one canonical page (plan §6).
   * Used by search, never used to mint a separate URL.
   */
  aliases: string[];
  /** Original, medically reviewed guidance. Required before a listing page indexes. */
  guide: string;
  /** "When to consult" bullets shown on listing and speciality pages. */
  when: string[];
  /** Date of the last substantive medical review of `guide` and `when`; "" until reviewed. */
  reviewedOn: string;
  /** Which register governs the practitioner. */
  system: "modern" | "dental" | "ayush" | "allied" | "alternative";
  /** Speciality strings used by imported datasets that map onto this entry. */
  sourceLabels: string[];
}

export interface Locality {
  /** Globally unique id, e.g. "indiranagar" (legacy) or "indore-vijay-nagar". */
  key: LocalityKey;
  /** URL segment within its city, e.g. "vijay-nagar". Unique per city. */
  slug: string;
  name: string;
  city: string;
  citySlug: string;
  state: string;
  stateSlug: string;
  /** Approximate centroid, WGS84; null until geocoded. */
  lat: number | null;
  lng: number | null;
}

export interface City {
  slug: string;
  name: string;
  state: string;
  stateSlug: string;
}

export interface State {
  slug: string;
  name: string;
}

/** Whether a claim on the profile has been checked, and against what. */
export type VerificationState = "verified" | "submitted";

export interface MedicalRegistration {
  number: string;
  council: string;
  registeredYear: number;
  /** Date this registration was last matched against the register. */
  checkedOn: string;
}

export interface Qualification {
  degree: string;
  institution: string;
  year: number;
  state: VerificationState;
}

export interface ExperienceEntry {
  role: string;
  place: string;
  from: number;
  /** null means "to present". */
  to: number | null;
}

export interface Practice {
  /** Database ids, present when the record came from Postgres. */
  id?: string;
  facilityId?: string;
  facility: string;
  locality: LocalityKey;
  /** Denormalised place names, filled by the data layer so components never look keys up. */
  localityName: string;
  localitySlug: string;
  city: string;
  citySlug: string;
  state: string;
  stateSlug: string;
  address: string;
  postalCode: string;
  days: string;
  hours: string;
  /** null when the fee has not been confirmed recently enough to display. */
  feeInr: number | null;
  /** Date the fee was last reconfirmed. Fees go stale after 90-180 days. */
  feeCheckedOn: string | null;
  /** Date the address, hours and contact were last reconfirmed with the practice. */
  confirmedOn: string;
  phone: string;
  /** Facility coordinates when geocoded, else the locality centroid. Filled by the data layer. */
  lat?: number;
  lng?: number;
  /** "facility" when geocoded, "locality" when the centroid stands in. */
  geoSource?: "facility" | "locality";
}

export interface ReviewDimensions {
  communication: number;
  explanation: number;
  waitTime: number;
  facility: number;
}

export interface Review {
  id: string;
  /** Pseudonymised reviewer label. Never a full patient name. */
  author: string;
  /** Approximate visit month, not an exact date. */
  visitMonth: string;
  mode: "In person" | "Online";
  /** True only where private proof of consultation was supplied AND validated. */
  evidenceChecked: boolean;
  dimensions: ReviewDimensions;
  text: string;
  /** At most one privacy-safe reply from the doctor. */
  reply: string | null;
}

export interface RatingRollup {
  average: number;
  count: number;
  /** Counts for 1..5 stars, index 0 = one star. */
  distribution: [number, number, number, number, number];
}

export type ProfileStatus = "active" | "stale" | "retired";

export interface Doctor {
  /** Immutable public ID. Part of the URL so a name change never breaks it. */
  id: string;
  /** name-slug + "-" + id. */
  slug: string;
  name: string;
  gender: "F" | "M";
  specialty: SpecialtyKey;
  subspecialties: string[];
  registration: MedicalRegistration;
  qualifications: Qualification[];
  /** Year the doctor started practising, supplied by the doctor. */
  practiceStartYear: number;
  languages: string[];
  modes: Array<"In person" | "Online">;
  about: string;
  services: string[];
  experience: ExperienceEntry[];
  practices: Practice[];
  /** True once a verified doctor has taken control of the page. */
  claimed: boolean;
  /** 0-100 completeness and quality score. Hard gate for indexation is 70. */
  qualityScore: number;
  status: ProfileStatus;
  /** Date of the most recent verification event of any kind. */
  lastVerifiedOn: string;
  /** Matching entry in the Healthcare Professionals Registry (secondary signal). */
  hprVerified: boolean;
  rating: RatingRollup;
  reviews: Review[];
}

/** A doctor with the derived fields the UI needs. */
export interface DoctorView extends Doctor {
  /** Postgres row id, present when the record came from the database. */
  dbId?: string;
  /** Lifecycle status from the database; seed records are always "published". */
  lifecycle?: "draft" | "submitted" | "in_review" | "published" | "suspended" | "retired" | "archived";
  yearsOfExperience: number;
  localities: LocalityKey[];
  /** Distinct city slugs the doctor practises in, primary first. */
  citySlugs: string[];
  /** True when every hard indexation gate passes. See lib/seo/gates.ts. */
  indexable: boolean;
  /** True where at least one published review carries validated visit evidence. */
  hasEvidenceReviews: boolean;
  /** Public photo URL when one was supplied with usage consent. */
  photoUrl?: string | null;
}

export interface RankingBreakdown {
  relevance: number;
  location: number;
  verification: number;
  completeness: number;
  freshness: number;
  reviewConfidence: number;
  total: number;
}

export interface ListingFilters {
  locality?: LocalityKey;
  online?: boolean;
  gender?: "F" | "M";
  language?: string;
  minExperience?: number;
  maxFee?: number;
  claimedOnly?: boolean;
  evidenceOnly?: boolean;
}
