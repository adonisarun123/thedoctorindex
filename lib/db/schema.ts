/**
 * Relational schema for The Doctor Index (project plan §14).
 *
 * Design rules carried from the plan:
 *  - Immutable public IDs; slugs can change, IDs cannot. Old slugs 301.
 *  - Normalised relational fields for anything that affects search or
 *    filtering. JSON only for snapshots (revisions, audit before/after) and
 *    flexible metadata — never for specialities, locations or qualifications.
 *  - Registration uniqueness on normalised council + number.
 *  - Practice-specific fees, hours, contacts and addresses live on the practice
 *    record, not the doctor master record.
 *  - Private evidence (identity documents, review proof) never joins a public
 *    read path. It lives in `files` with bucket = 'private'.
 *  - Every state change is written to audit_logs by the service layer.
 *
 * Migrations are generated from this file with drizzle-kit and committed under
 * ./migrations. Extensions and trigram/geo indexes that drizzle cannot express
 * are in the hand-written 0000 migration.
 */
import { relations, sql } from "drizzle-orm";
import {
  bigint,
  bigserial,
  boolean,
  char,
  customType,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------------- */
/* Custom types                                                              */
/* ------------------------------------------------------------------------- */

/** bytea for private file contents. Swap to object storage via files.storage_key. */
const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

/* ------------------------------------------------------------------------- */
/* Enums                                                                     */
/* ------------------------------------------------------------------------- */

export const userRole = pgEnum("user_role", ["patient", "doctor", "staff"]);
export const staffRole = pgEnum("staff_role", [
  "super_admin",
  "verification_officer",
  "review_moderator",
  "content_editor",
  "support_officer",
]);
export const doctorStatus = pgEnum("doctor_status", [
  "draft",
  "submitted",
  "in_review",
  "published",
  "suspended",
  "retired",
  "archived",
]);
export const verificationState = pgEnum("verification_state", ["verified", "submitted", "rejected"]);
export const reviewStatus = pgEnum("review_status", ["pending", "published", "redacted", "rejected", "removed"]);
export const evidenceStatus = pgEnum("evidence_status", ["none", "supplied", "checked", "rejected"]);
export const responseStatus = pgEnum("response_status", ["pending", "published", "rejected"]);
export const caseStatus = pgEnum("case_status", ["open", "assessed", "resolved", "dismissed"]);
export const casePriority = pgEnum("case_priority", ["safety", "high", "normal", "low"]);
export const correctionStatus = pgEnum("correction_status", ["open", "applied", "rejected"]);
export const enquiryStatus = pgEnum("enquiry_status", ["new", "sent", "contacted", "closed"]);
export const submissionStatus = pgEnum("submission_status", ["submitted", "in_review", "needs_info", "approved", "rejected"]);
export const claimStatus = pgEnum("claim_status", ["pending", "approved", "rejected"]);
export const claimMethod = pgEnum("claim_method", ["practice_otp", "work_email", "practice_admin", "document"]);
export const changeStatus = pgEnum("change_status", ["pending", "published", "rejected"]);
export const checkKind = pgEnum("check_kind", ["registration", "qualification", "practice", "hpr", "claim", "identity", "disciplinary"]);
export const checkResult = pgEnum("check_result", ["verified", "failed", "pending", "not_found"]);
export const managerStatus = pgEnum("manager_status", ["invited", "active", "revoked"]);
export const credentialKind = pgEnum("credential_kind", ["award", "membership", "publication"]);
export const fileBucket = pgEnum("file_bucket", ["private", "quarantine", "public"]);
export const scanResult = pgEnum("scan_result", ["pending", "clean", "infected", "skipped"]);
export const seoRouteKind = pgEnum("seo_route_kind", ["national", "city", "locality"]);
export const seoOverride = pgEnum("seo_override", ["force_index", "force_noindex"]);
export const otpPurpose = pgEnum("otp_purpose", ["sign_in", "claim", "enquiry"]);
export const gender = pgEnum("gender", ["F", "M", "X"]);
/** Grow Your Tribe (lib/services/tribe.ts). */
export const referralStatus = pgEnum("referral_status", ["pending", "verified", "rejected", "clawed_back"]);
export const tribeRewardKind = pgEnum("tribe_reward_kind", ["voucher", "recognition"]);
export const tribeRewardStatus = pgEnum("tribe_reward_status", ["pending_review", "issued", "cancelled"]);
export const articleStatus = pgEnum("article_status", ["draft", "submitted", "published", "rejected", "withdrawn"]);

/* ------------------------------------------------------------------------- */
/* Identity and access                                                       */
/* ------------------------------------------------------------------------- */

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email"),
    phone: text("phone"),
    role: userRole("role").notNull().default("patient"),
    displayName: text("display_name"),
    /** Registration details (plan §5.1 accounts): every account completes these once. */
    localityKey: text("locality_key"),
    city: text("city"),
    termsAcceptedAt: timestamp("terms_accepted_at", { withTimezone: true }),
    profileCompletedAt: timestamp("profile_completed_at", { withTimezone: true }),
    marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
    /**
     * The journey the account was created for (lib/funnel.ts flowFromNext:
     * claim, add_doctor, enquire, review, dashboard, other) and the path it was
     * heading to. Null for accounts created before this was recorded. Drives
     * which signup reminder, if any, the account is sent.
     */
    signupFlow: text("signup_flow"),
    signupNext: text("signup_next"),
    /** Set by the unsubscribe link in a signup reminder; no further reminders. */
    remindersOptOutAt: timestamp("reminders_opt_out_at", { withTimezone: true }),
    /** Set by the unsubscribe link in the monthly doctor digest; no further digests. */
    digestOptOutAt: timestamp("digest_opt_out_at", { withTimezone: true }),
    /** Doctor's WhatsApp number (E.164) for enquiry alerts; used only while whatsappOptInAt is set. */
    whatsappNumber: text("whatsapp_number"),
    whatsappOptInAt: timestamp("whatsapp_opt_in_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
    disabledAt: timestamp("disabled_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("users_email_uq").on(sql`lower(${t.email})`).where(sql`${t.email} is not null`),
    uniqueIndex("users_phone_uq").on(t.phone).where(sql`${t.phone} is not null`),
  ],
);

export const staffMembers = pgTable("staff_members", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  roles: staffRole("roles").array().notNull().default(sql`'{}'::staff_role[]`),
  active: boolean("active").notNull().default(true),
  mfaEnrolled: boolean("mfa_enrolled").notNull().default(false),
  /** TOTP secret, AES-256-GCM encrypted at rest (lib/auth/crypto.ts). */
  mfaSecret: text("mfa_secret"),
  mfaEnrolledAt: timestamp("mfa_enrolled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const otpCodes = pgTable(
  "otp_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(), // lower-cased email or E.164 phone
    codeHash: text("code_hash").notNull(),
    purpose: otpPurpose("purpose").notNull().default("sign_in"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    attempts: smallint("attempts").notNull().default(0),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    ipHash: text("ip_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("otp_identifier_idx").on(t.identifier, t.createdAt)],
);

/**
 * An external sign-in linked to an account (today: LinkedIn via OpenID
 * Connect). Holds what the provider asserted at the last sign-in — name,
 * verified email, portrait — so a doctor's profile can be prefilled from it.
 * The portrait is copied into `files` (private) because the provider's URL
 * expires; it is shown publicly only if the doctor chooses to use it.
 */
export const userIdentities = pgTable(
  "user_identities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    /** The provider's stable subject id (OIDC `sub`). */
    subject: text("subject").notNull(),
    email: text("email"),
    emailVerified: boolean("email_verified").notNull().default(false),
    name: text("name"),
    givenName: text("given_name"),
    familyName: text("family_name"),
    photoFileId: uuid("photo_file_id").references(() => files.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("user_identities_provider_subject_uq").on(t.provider, t.subject),
    index("user_identities_user_idx").on(t.userId),
  ],
);

/**
 * One row per signup reminder email sent. The unique key makes the daily job
 * idempotent: a re-run on the same day cannot send the same step twice.
 */
export const signupReminders = pgTable(
  "signup_reminders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    /** "setup" (details form not finished) or "doctor_profile" (no claim or profile yet). */
    stage: text("stage").notNull(),
    /** 1, 2, 3 — the position in the sequence. */
    step: smallint("step").notNull(),
    delivered: boolean("delivered").notNull(),
    provider: text("provider"),
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("signup_reminders_user_stage_step_uq").on(t.userId, t.stage, t.step)],
);

/**
 * Monthly "how patients found you" email to claimed doctors
 * (lib/services/doctor-digest.ts). One row per doctor per period, inserted
 * before sending, so overlapping cron runs cannot send twice.
 */
export const doctorDigests = pgTable(
  "doctor_digests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    /** YYYY-MM of the run. */
    period: text("period").notNull(),
    delivered: boolean("delivered").notNull(),
    provider: text("provider"),
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("doctor_digests_doctor_period_uq").on(t.doctorId, t.period)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    userAgent: text("user_agent"),
    ipHash: text("ip_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    /** Set when a staff member passes their second factor in this session. */
    mfaVerifiedAt: timestamp("mfa_verified_at", { withTimezone: true }),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

/* ------------------------------------------------------------------------- */
/* Taxonomy and geography                                                    */
/* ------------------------------------------------------------------------- */

export const specialties = pgTable("specialties", {
  key: text("key").primaryKey(),
  name: text("name").notNull(),
  plural: text("plural").notNull(),
  one: text("one").notNull(),
  aOne: text("a_one").notNull(),
  slug: text("slug").notNull().unique(),
  department: text("department").notNull(),
  aliases: text("aliases").array().notNull().default(sql`'{}'::text[]`),
  guide: text("guide").notNull().default(""),
  whenItems: text("when_items").array().notNull().default(sql`'{}'::text[]`),
  reviewedOn: date("reviewed_on"),
  active: boolean("active").notNull().default(true),
  sort: integer("sort").notNull().default(100),
  /** Frozen three-letter code used in TDI IDs; see lib/data/tdi-codes.ts. */
  tdiCode: char("tdi_code", { length: 3 }).unique(),
});

/** Last issued number per TDI code. Bumped only by the doctors_assign_tdi_id trigger. */
export const tdiIdCounters = pgTable("tdi_id_counters", {
  code: char("code", { length: 3 }).primaryKey(),
  last: integer("last").notNull().default(0),
});

export const localities = pgTable("localities", {
  key: text("key").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  citySlug: text("city_slug").notNull(),
  state: text("state").notNull(),
  stateSlug: text("state_slug").notNull(),
  /** URL segment within the city; unique per (state, city). Legacy rows: slug = key. */
  slug: text("slug").notNull(),
  lat: text("lat"),
  lng: text("lng"),
  active: boolean("active").notNull().default(true),
  sort: integer("sort").notNull().default(100),
});

export const serviceTerms = pgTable("service_terms", {
  id: uuid("id").primaryKey().defaultRandom(),
  specialtyKey: text("specialty_key").references(() => specialties.key),
  term: text("term").notNull(),
  active: boolean("active").notNull().default(true),
});

/* ------------------------------------------------------------------------- */
/* Doctors and credentials                                                   */
/* ------------------------------------------------------------------------- */

export const doctors = pgTable(
  "doctors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Immutable, part of the public URL. */
    publicId: char("public_id", { length: 6 }).notNull().unique(),
    /**
     * Permanent, human-readable ID (`TDI-CAR-00412`), issued by a database
     * trigger the first time the record is published and never changed after.
     * Printed on QR cards; `/d/<tdi_id>` resolves it to the current slug.
     */
    tdiId: text("tdi_id").unique(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    gender: gender("gender"),
    specialtyKey: text("specialty_key").notNull().references(() => specialties.key),
    subspecialties: text("subspecialties").array().notNull().default(sql`'{}'::text[]`),
    practiceStartYear: integer("practice_start_year"),
    languages: text("languages").array().notNull().default(sql`'{}'::text[]`),
    modes: text("modes").array().notNull().default(sql`'{"In person"}'::text[]`),
    about: text("about").notNull().default(""),
    services: text("services").array().notNull().default(sql`'{}'::text[]`),
    claimed: boolean("claimed").notNull().default(false),
    claimedByUserId: uuid("claimed_by_user_id").references(() => users.id),
    qualityScore: integer("quality_score").notNull().default(0),
    status: doctorStatus("status").notNull().default("draft"),
    lastVerifiedOn: date("last_verified_on"),
    hprVerified: boolean("hpr_verified").notNull().default(false),
    hprId: text("hpr_id"),
    photoFileId: uuid("photo_file_id"),
    photoConsent: boolean("photo_consent").notNull().default(false),
    phoneConsent: boolean("phone_consent").notNull().default(true),
    /** Where the record came from: self | staff | import | claim */
    source: text("source").notNull().default("self"),
    /** Stable id within the source dataset (import de-duplication). */
    sourceRef: text("source_ref"),
    /** Where the record was read from, for provenance display and audit. */
    sourceUrl: text("source_url"),
    createdByUserId: uuid("created_by_user_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    suspendedReason: text("suspended_reason"),
    retiredAt: timestamp("retired_at", { withTimezone: true }),
    mergedIntoId: uuid("merged_into_id"),
  },
  (t) => [
    index("doctors_specialty_status_idx").on(t.specialtyKey, t.status),
    index("doctors_status_quality_idx").on(t.status, t.qualityScore),
  ],
);

export const medicalRegistrations = pgTable(
  "medical_registrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
    number: text("number").notNull(),
    numberNormalized: text("number_normalized").notNull(),
    council: text("council").notNull(),
    councilNormalized: text("council_normalized").notNull(),
    registeredYear: integer("registered_year"),
    status: text("status").notNull().default("active"),
    checkedOn: date("checked_on"),
    source: text("source"),
    isPrimary: boolean("is_primary").notNull().default(true),
  },
  (t) => [uniqueIndex("registration_council_number_uq").on(t.councilNormalized, t.numberNormalized)],
);

export const doctorQualifications = pgTable("doctor_qualifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  university: text("university"),
  year: integer("year"),
  country: text("country").notNull().default("IN"),
  state: verificationState("state").notNull().default("submitted"),
  checkedOn: date("checked_on"),
  sort: integer("sort").notNull().default(0),
});

/**
 * Awards, professional memberships and publications.
 *
 * Every row here is a claim the doctor made about themselves — no import
 * supplies them and no register can confirm most of them. They carry the same
 * `verification_state` the qualifications do, they default to "submitted", and
 * nothing outside this table reads them as a trust signal: they are excluded
 * from the quality score, so a doctor cannot type their way past the index
 * gate, and only a row staff have marked `verified` is ever asserted in
 * machine-readable markup.
 */
export const doctorCredentials = pgTable(
  "doctor_credentials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
    kind: credentialKind("kind").notNull(),
    title: text("title").notNull(),
    /** Awarding body, society, or journal. */
    issuer: text("issuer"),
    year: integer("year"),
    /** Citation or announcement the reader can check for themselves. */
    url: text("url"),
    state: verificationState("state").notNull().default("submitted"),
    verifiedOn: date("verified_on"),
    verifiedByUserId: uuid("verified_by_user_id").references(() => users.id),
    sort: integer("sort").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("doctor_credentials_doctor_idx").on(t.doctorId, t.kind)],
);

export const doctorExperience = pgTable("doctor_experience", {
  id: uuid("id").primaryKey().defaultRandom(),
  doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  place: text("place").notNull(),
  fromYear: integer("from_year").notNull(),
  toYear: integer("to_year"),
  sort: integer("sort").notNull().default(0),
});

/* ------------------------------------------------------------------------- */
/* Practices                                                                 */
/* ------------------------------------------------------------------------- */

export const facilities = pgTable(
  "facilities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    localityKey: text("locality_key").notNull().references(() => localities.key),
    address: text("address").notNull(),
    postalCode: text("postal_code"),
    lat: text("lat"),
    lng: text("lng"),
    geocodeSource: text("geocode_source"),
    geocodeConfidence: text("geocode_confidence"),
    phone: text("phone"),
    website: text("website"),
    hfrId: text("hfr_id"),
    confirmedOn: date("confirmed_on"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("facilities_locality_idx").on(t.localityKey)],
);

export const doctorPractices = pgTable(
  "doctor_practices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
    facilityId: uuid("facility_id").notNull().references(() => facilities.id),
    days: text("days").notNull().default(""),
    hours: text("hours").notNull().default(""),
    feeInr: integer("fee_inr"),
    feeCheckedOn: date("fee_checked_on"),
    confirmedOn: date("confirmed_on"),
    phone: text("phone"),
    whatsapp: text("whatsapp"),
    wheelchairAccess: boolean("wheelchair_access"),
    active: boolean("active").notNull().default(true),
    sort: integer("sort").notNull().default(0),
  },
  (t) => [index("practices_doctor_idx").on(t.doctorId), index("practices_facility_idx").on(t.facilityId)],
);

/* ------------------------------------------------------------------------- */
/* Files (private evidence, photos)                                          */
/* ------------------------------------------------------------------------- */

export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  bucket: fileBucket("bucket").notNull().default("private"),
  filename: text("filename").notNull(),
  mime: text("mime").notNull(),
  size: integer("size").notNull(),
  sha256: text("sha256").notNull(),
  /** Inline bytes for the MVP. Null once storage_key points at object storage. */
  data: bytea("data"),
  storageKey: text("storage_key"),
  uploadedByUserId: uuid("uploaded_by_user_id").references(() => users.id),
  scan: scanResult("scan").notNull().default("pending"),
  scannedAt: timestamp("scanned_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

/**
 * A portrait we know exists but are not entitled to show.
 *
 * Imported hospital-sourced profiles carry a photo on the hospital's own site.
 * That image is the hospital's asset and the doctor never consented to it
 * appearing here, so we record where it is and render nothing. When the doctor
 * claims the profile they are shown the candidate and can adopt it in one
 * click, which is the moment consent actually exists. Nothing here is ever
 * fetched or displayed until then.
 */
export const photoCandidates = pgTable(
  "photo_candidates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    doctorId: uuid("doctor_id")
      .notNull()
      .references(() => doctors.id, { onDelete: "cascade" }),
    /** Where the image is on the source site. A URL only — the bytes are not copied. */
    url: text("url").notNull(),
    /** The page the portrait was published on, for provenance. */
    sourceUrl: text("source_url").notNull(),
    /** "hospital:manipal", matching doctors.source. */
    source: text("source").notNull(),
    /** pending → the doctor has not claimed; adopted → promoted to doctors.photo_file_id; declined → they said no. */
    status: text("status").notNull().default("pending"),
    capturedAt: timestamp("captured_at", { withTimezone: true }).notNull().defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("photo_candidates_doctor_url_idx").on(t.doctorId, t.url),
    index("photo_candidates_doctor_idx").on(t.doctorId),
  ],
);

/* ------------------------------------------------------------------------- */
/* Reviews and trust                                                         */
/* ------------------------------------------------------------------------- */

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
    authorUserId: uuid("author_user_id").notNull().references(() => users.id),
    /** Pseudonymised label shown publicly, e.g. "Reviewer R.K." */
    authorLabel: text("author_label").notNull(),
    forWhom: text("for_whom").notNull().default("self"),
    visitMonth: text("visit_month").notNull(),
    mode: text("mode").notNull(),
    communication: smallint("communication").notNull(),
    explanation: smallint("explanation").notNull(),
    waitTime: smallint("wait_time").notNull(),
    facility: smallint("facility").notNull(),
    text: text("text").notNull(),
    /** Redacted text shown publicly when status = redacted. */
    publishedText: text("published_text"),
    status: reviewStatus("status").notNull().default("pending"),
    evidence: evidenceStatus("evidence").notNull().default("none"),
    riskScore: smallint("risk_score").notNull().default(0),
    riskFlags: text("risk_flags").array().notNull().default(sql`'{}'::text[]`),
    deviceHash: text("device_hash"),
    ipHash: text("ip_hash"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
    moderatedAt: timestamp("moderated_at", { withTimezone: true }),
    moderatedByUserId: uuid("moderated_by_user_id").references(() => users.id),
    moderationReason: text("moderation_reason"),
  },
  (t) => [
    index("reviews_doctor_status_idx").on(t.doctorId, t.status),
    uniqueIndex("reviews_one_per_author_doctor_uq").on(t.doctorId, t.authorUserId),
  ],
);

export const reviewEvidence = pgTable("review_evidence", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewId: uuid("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }),
  fileId: uuid("file_id").notNull().references(() => files.id),
  note: text("note"),
  validatedByUserId: uuid("validated_by_user_id").references(() => users.id),
  validatedAt: timestamp("validated_at", { withTimezone: true }),
  outcome: evidenceStatus("outcome").notNull().default("supplied"),
  /** Proof is deleted 90 days after moderation (plan §16.2). */
  purgeAfter: timestamp("purge_after", { withTimezone: true }),
});

export const doctorResponses = pgTable("doctor_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewId: uuid("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }).unique(),
  doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  status: responseStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  moderatedAt: timestamp("moderated_at", { withTimezone: true }),
  moderatedByUserId: uuid("moderated_by_user_id").references(() => users.id),
  moderationReason: text("moderation_reason"),
});

export const reviewReports = pgTable("review_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewId: uuid("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }),
  reporterUserId: uuid("reporter_user_id").references(() => users.id),
  reason: text("reason").notNull(),
  detail: text("detail"),
  contact: text("contact"),
  priority: casePriority("priority").notNull().default("normal"),
  status: caseStatus("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  assessedAt: timestamp("assessed_at", { withTimezone: true }),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  resolvedByUserId: uuid("resolved_by_user_id").references(() => users.id),
  resolution: text("resolution"),
});

export const profileReports = pgTable("profile_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  reporterUserId: uuid("reporter_user_id").references(() => users.id),
  reason: text("reason").notNull(),
  detail: text("detail"),
  contact: text("contact"),
  priority: casePriority("priority").notNull().default("normal"),
  status: caseStatus("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  assessedAt: timestamp("assessed_at", { withTimezone: true }),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  resolvedByUserId: uuid("resolved_by_user_id").references(() => users.id),
  resolution: text("resolution"),
});

export const corrections = pgTable("corrections", {
  id: uuid("id").primaryKey().defaultRandom(),
  doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  submittedByUserId: uuid("submitted_by_user_id").references(() => users.id),
  field: text("field").notNull(),
  currentValue: text("current_value"),
  proposedValue: text("proposed_value").notNull(),
  sourceNote: text("source_note"),
  isDoctorOrStaff: boolean("is_doctor_or_staff").notNull().default(false),
  contact: text("contact"),
  status: correctionStatus("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  decidedByUserId: uuid("decided_by_user_id").references(() => users.id),
  note: text("note"),
});

export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
    practiceId: uuid("practice_id").references(() => doctorPractices.id),
    userId: uuid("user_id").references(() => users.id),
    contact: text("contact").notNull(),
    preferredDay: text("preferred_day"),
    forWhom: text("for_whom").notNull().default("self"),
    note: text("note"),
    consentToShare: boolean("consent_to_share").notNull().default(false),
    status: enquiryStatus("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("enquiries_doctor_idx").on(t.doctorId, t.createdAt)],
);

/* ------------------------------------------------------------------------- */
/* Claims, submissions, change requests, verification                        */
/* ------------------------------------------------------------------------- */

export const doctorSubmissions = pgTable("doctor_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  council: text("council").notNull(),
  registrationNumber: text("registration_number").notNull(),
  /** The submitted profile as a snapshot; approval turns it into rows. */
  payload: jsonb("payload").notNull(),
  status: submissionStatus("status").notNull().default("submitted"),
  doctorId: uuid("doctor_id").references(() => doctors.id),
  reviewerNote: text("reviewer_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  decidedByUserId: uuid("decided_by_user_id").references(() => users.id),
});

export const doctorClaims = pgTable("doctor_claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id),
  registrationNumber: text("registration_number").notNull(),
  method: claimMethod("method").notNull(),
  evidenceFileId: uuid("evidence_file_id").references(() => files.id),
  status: claimStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  decidedByUserId: uuid("decided_by_user_id").references(() => users.id),
  note: text("note"),
});

export const profileChangeRequests = pgTable(
  "profile_change_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
    requestedByUserId: uuid("requested_by_user_id").notNull().references(() => users.id),
    /** Dotted path, e.g. "name", "about", "practice.<id>.hours". */
    field: text("field").notNull(),
    fromValue: jsonb("from_value"),
    toValue: jsonb("to_value").notNull(),
    /** Sensitive fields return to verification before publication. */
    sensitive: boolean("sensitive").notNull().default(false),
    status: changeStatus("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    decidedByUserId: uuid("decided_by_user_id").references(() => users.id),
    note: text("note"),
  },
  (t) => [index("changes_doctor_status_idx").on(t.doctorId, t.status)],
);

export const verificationChecks = pgTable(
  "verification_checks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
    kind: checkKind("kind").notNull(),
    /** Row the check applies to (registration id, qualification id, practice id…). */
    subjectId: uuid("subject_id"),
    result: checkResult("result").notNull().default("pending"),
    source: text("source"),
    evidenceFileId: uuid("evidence_file_id").references(() => files.id),
    checkedByUserId: uuid("checked_by_user_id").references(() => users.id),
    checkedOn: timestamp("checked_on", { withTimezone: true }).notNull().defaultNow(),
    note: text("note"),
  },
  (t) => [index("checks_doctor_kind_idx").on(t.doctorId, t.kind, t.checkedOn)],
);

export const doctorManagers = pgTable("doctor_managers", {
  id: uuid("id").primaryKey().defaultRandom(),
  doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id),
  email: text("email").notNull(),
  name: text("name"),
  scopePracticeIds: uuid("scope_practice_ids").array().notNull().default(sql`'{}'::uuid[]`),
  status: managerStatus("status").notNull().default("invited"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});

/* ------------------------------------------------------------------------- */
/* Provenance, publishing, SEO                                               */
/* ------------------------------------------------------------------------- */

export const profileRevisions = pgTable(
  "profile_revisions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
    snapshot: jsonb("snapshot").notNull(),
    reason: text("reason"),
    createdByUserId: uuid("created_by_user_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("revisions_doctor_idx").on(t.doctorId, t.createdAt)],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorUserId: uuid("actor_user_id").references(() => users.id),
    actorRole: text("actor_role"),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    before: jsonb("before"),
    after: jsonb("after"),
    reason: text("reason"),
    ipHash: text("ip_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("audit_entity_idx").on(t.entityType, t.entityId, t.createdAt), index("audit_created_idx").on(t.createdAt)],
);

/**
 * Enrichment state per doctor: the outcome of matching the profile against
 * the NMC Indian Medical Register and against Google Places (scripts/enrich.ts).
 * Only professional, public data is kept from the register; Google content is
 * limited to the place ID and the fields needed to explain the match.
 */
export const doctorEnrichment = pgTable(
  "doctor_enrichment",
  {
    doctorId: uuid("doctor_id").primaryKey().references(() => doctors.id, { onDelete: "cascade" }),
    /** pending | confirmed (existing number found on the register) | matched (number filled from a unique match) | ambiguous | not_found | not_applicable | error */
    nmcStatus: text("nmc_status").notNull().default("pending"),
    /** Candidate register entries when ambiguous: [{ doctorId, registrationNo, council, name, year, degree, university, place }]. Staff-only. */
    nmcCandidates: jsonb("nmc_candidates"),
    nmcQuery: text("nmc_query"),
    nmcCheckedAt: timestamp("nmc_checked_at", { withTimezone: true }),
    /** pending | matched | no_match | skipped | error */
    googleStatus: text("google_status").notNull().default("pending"),
    googlePlaceId: text("google_place_id"),
    googleMapsUri: text("google_maps_uri"),
    googleName: text("google_name"),
    googleAddress: text("google_address"),
    googlePhone: text("google_phone"),
    googleWebsite: text("google_website"),
    /** Whether the Google listing's address agrees with the practice address on file (locality or pincode). */
    googleAddressMatch: boolean("google_address_match"),
    googleScore: integer("google_score"),
    googleCheckedAt: timestamp("google_checked_at", { withTimezone: true }),
    attempts: integer("attempts").notNull().default(0),
    lastError: text("last_error"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("doctor_enrichment_nmc_idx").on(t.nmcStatus), index("doctor_enrichment_google_idx").on(t.googleStatus)],
);

/**
 * Daily snapshot of the stock figures the admin dashboard charts over time
 * (published, verified, indexable, claimed …). One row per day, upserted by
 * the maintenance job via lib/services/admin-stats.ts. Flows such as
 * enquiries per day come from dated columns and are not stored here.
 */
export const adminDailyStats = pgTable("admin_daily_stats", {
  day: date("day").primaryKey(),
  published: integer("published").notNull().default(0),
  verified: integer("verified").notNull().default(0),
  indexable: integer("indexable").notNull().default(0),
  claimed: integer("claimed").notNull().default(0),
  registrationVerified: integer("registration_verified").notNull().default(0),
  practiceConfirmed: integer("practice_confirmed").notNull().default(0),
  nmcConfirmed: integer("nmc_confirmed").notNull().default(0),
  nmcPending: integer("nmc_pending").notNull().default(0),
  nmcQueue: integer("nmc_queue").notNull().default(0),
  googleMatched: integer("google_matched").notNull().default(0),
  seoRoutesIndexable: integer("seo_routes_indexable").notNull().default(0),
  queueOpen: integer("queue_open").notNull().default(0),
  reviewsPublished: integer("reviews_published").notNull().default(0),
  doctorAccounts: integer("doctor_accounts").notNull().default(0),
  capturedAt: timestamp("captured_at", { withTimezone: true }).notNull().defaultNow(),
});

export const seoRoutes = pgTable(
  "seo_routes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: seoRouteKind("kind").notNull(),
    specialtyKey: text("specialty_key").notNull().references(() => specialties.key),
    localityKey: text("locality_key").references(() => localities.key),
    path: text("path").notNull().unique(),
    indexableCount: integer("indexable_count").notNull().default(0),
    computedIndexable: boolean("computed_indexable").notNull().default(false),
    override: seoOverride("override"),
    note: text("note"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("seo_routes_kind_idx").on(t.kind)],
);

export const slugRedirects = pgTable("slug_redirects", {
  fromPath: text("from_path").primaryKey(),
  toPath: text("to_path").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------------- */
/* Analytics events (no PII) and rate limits                                 */
/* ------------------------------------------------------------------------- */

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: text("kind").notNull(),
    doctorId: uuid("doctor_id").references(() => doctors.id, { onDelete: "cascade" }),
    practiceId: uuid("practice_id"),
    path: text("path"),
    query: text("query"),
    localityKey: text("locality_key"),
    sessionHash: text("session_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("events_doctor_kind_idx").on(t.doctorId, t.kind, t.createdAt), index("events_created_idx").on(t.createdAt)],
);

export const rateLimits = pgTable(
  "rate_limits",
  {
    key: text("key").notNull(),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
    count: integer("count").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.key, t.windowStart] })],
);

/* ------------------------------------------------------------------------- */
/* Grow Your Tribe — doctor-to-doctor referrals (lib/services/tribe.ts)      */
/* ------------------------------------------------------------------------- */

/** One permanent code per referring account, minted the first time they open the tribe page. */
export const referralCodes = pgTable("referral_codes", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * A referral is recorded the moment the invitee starts a claim or a new
 * profile with a referral cookie present, and counts (`verified`) only once
 * that profile is published under the invitee's account AND its registration
 * has been checked against the register. Nothing is paid for a sign-up, an
 * invite or a pending claim. One credit per invitee account and per doctor
 * record, ever — a second claim, a re-registration or a re-import earns nothing.
 */
export const referrals = pgTable(
  "referrals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    referrerUserId: uuid("referrer_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    refereeUserId: uuid("referee_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    /** The profile the invitee claimed or created; null until a new-profile submission is approved. */
    doctorId: uuid("doctor_id").references(() => doctors.id, { onDelete: "set null" }),
    /** claim | submission */
    kind: text("kind").notNull(),
    /** Channel tag the invite link carried (whatsapp, linkedin, link …). */
    channel: text("channel"),
    status: referralStatus("status").notNull().default("pending"),
    /** Why it is pending, rejected or clawed back, in staff-readable words. */
    reason: text("reason"),
    ipHash: text("ip_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    settledAt: timestamp("settled_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("referrals_referee_uq").on(t.refereeUserId),
    uniqueIndex("referrals_doctor_uq").on(t.doctorId).where(sql`${t.doctorId} is not null`),
    index("referrals_referrer_status_idx").on(t.referrerUserId, t.status),
  ],
);

/**
 * One row per level a referrer has crossed. Levels are computed from verified
 * referrals (lib/tribe.ts); a row is created when the level is reached, held
 * for a review window, and issued by staff with the voucher code. Cash stops
 * at the per-financial-year cap and later levels are `recognition` only —
 * see .env.example §19 for why.
 */
export const tribeRewards = pgTable(
  "tribe_rewards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    level: integer("level").notNull(),
    kind: tribeRewardKind("kind").notNull().default("voucher"),
    amountInr: integer("amount_inr").notNull().default(0),
    status: tribeRewardStatus("status").notNull().default("pending_review"),
    /** Earliest moment staff may issue it; the fraud-review window. */
    holdUntil: timestamp("hold_until", { withTimezone: true }).notNull(),
    /** The gift-card code as issued. Staff-only; shown once to the doctor by email and on their tribe page. */
    voucherCode: text("voucher_code"),
    issuedAt: timestamp("issued_at", { withTimezone: true }),
    issuedByUserId: uuid("issued_by_user_id").references(() => users.id),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("tribe_rewards_user_level_uq").on(t.userId, t.level), index("tribe_rewards_status_idx").on(t.status, t.holdUntil)],
);

/* ------------------------------------------------------------------------- */
/* NMC Indian Medical Register (offline copy)                                */
/* ------------------------------------------------------------------------- */

/**
 * One row per entry of the NMC Indian Medical Register, loaded from the
 * 29 Sep 2026 export (scripts/nmc/load-register.ts). The register columns are
 * stored exactly as the register carries them; the derived columns (clean
 * name, category, speciality, era) are the site's reading of the entry and
 * are recomputed by the loader. `doctor_id` links an entry to the profile it
 * verifies or created. Never rendered directly — profiles are.
 */
export const nmcRegister = pgTable(
  "nmc_register",
  {
    sourceRecordId: bigint("source_record_id", { mode: "number" }).primaryKey(),
    name: text("name").notNull(),
    council: text("council").notNull(),
    councilCode: text("council_code"),
    number: text("number").notNull(),
    numberNormalized: text("number_normalized").notNull(),
    councilNormalized: text("council_normalized").notNull(),
    /** As exported. Unreliable for several councils (renewal dates, placeholders) — never shown. */
    registrationDate: date("registration_date"),
    yearOfInformation: integer("year_of_information"),
    qualification: text("qualification"),
    qualificationYear: integer("qualification_year"),
    university: text("university"),
    uprn: text("uprn"),
    additionalCount: integer("additional_count").notNull().default(0),
    removed: boolean("removed").notNull().default(false),
    dataNotes: text("data_notes"),
    sourceUrl: text("source_url"),
    retrievedAt: timestamp("retrieved_at", { withTimezone: true }),
    /* derived */
    nameClean: text("name_clean"),
    nameTokens: text("name_tokens").array().notNull().default(sql`'{}'::text[]`),
    nameSorted: text("name_sorted"),
    stateSlug: text("state_slug"),
    /** Latest plausible qualification year; the registration date is ignored. */
    eraYear: integer("era_year"),
    /** superspecialist | specialist | diploma-specialist | pg-unspecified | mbbs-only | pre-1980 | struck-off | name-unusable | no-number */
    category: text("category").notNull(),
    specialtyKey: text("specialty_key").references(() => specialties.key),
    /** The degree string that decided the speciality. */
    specialtyBasis: text("specialty_basis"),
    specialtyRank: integer("specialty_rank").notNull().default(0),
    doctorId: uuid("doctor_id").references(() => doctors.id, { onDelete: "set null" }),
    /** existing:number | existing:name | created | duplicate:<record id> */
    matchKind: text("match_kind"),
    /** pending | matched | no_match | ambiguous | skipped | error */
    researchStatus: text("research_status"),
    researchNote: text("research_note"),
    researchPlaceId: text("research_place_id"),
    researchedAt: timestamp("researched_at", { withTimezone: true }),
    loadedAt: timestamp("loaded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("nmc_register_council_number_idx").on(t.councilNormalized, t.numberNormalized),
    index("nmc_register_number_idx").on(t.numberNormalized),
    index("nmc_register_category_idx").on(t.category, t.councilCode, t.eraYear),
    index("nmc_register_doctor_idx").on(t.doctorId),
    index("nmc_register_research_idx").on(t.researchStatus),
    index("nmc_register_name_sorted_idx").on(t.nameSorted),
    index("nmc_register_name_tokens_idx").using("gin", t.nameTokens),
  ],
);

export const nmcRegisterQualifications = pgTable(
  "nmc_register_qualifications",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    sourceRecordId: bigint("source_record_id", { mode: "number" }).notNull(),
    seq: integer("seq"),
    degree: text("degree").notNull(),
    year: integer("year"),
    university: text("university"),
  },
  (t) => [index("nmc_register_quals_record_idx").on(t.sourceRecordId)],
);

/* ------------------------------------------------------------------------- */
/* Relations (for db.query.*)                                                */
/* ------------------------------------------------------------------------- */

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  specialty: one(specialties, { fields: [doctors.specialtyKey], references: [specialties.key] }),
  registrations: many(medicalRegistrations),
  qualifications: many(doctorQualifications),
  experience: many(doctorExperience),
  credentials: many(doctorCredentials),
  practices: many(doctorPractices),
  reviews: many(reviews),
  changeRequests: many(profileChangeRequests),
  checks: many(verificationChecks),
  managers: many(doctorManagers),
  enrichment: one(doctorEnrichment, { fields: [doctors.id], references: [doctorEnrichment.doctorId] }),
}));

export const doctorEnrichmentRelations = relations(doctorEnrichment, ({ one }) => ({
  doctor: one(doctors, { fields: [doctorEnrichment.doctorId], references: [doctors.id] }),
}));

export const medicalRegistrationsRelations = relations(medicalRegistrations, ({ one }) => ({
  doctor: one(doctors, { fields: [medicalRegistrations.doctorId], references: [doctors.id] }),
}));
export const doctorQualificationsRelations = relations(doctorQualifications, ({ one }) => ({
  doctor: one(doctors, { fields: [doctorQualifications.doctorId], references: [doctors.id] }),
}));
export const doctorExperienceRelations = relations(doctorExperience, ({ one }) => ({
  doctor: one(doctors, { fields: [doctorExperience.doctorId], references: [doctors.id] }),
}));
export const doctorCredentialsRelations = relations(doctorCredentials, ({ one }) => ({
  doctor: one(doctors, { fields: [doctorCredentials.doctorId], references: [doctors.id] }),
}));
export const doctorPracticesRelations = relations(doctorPractices, ({ one }) => ({
  doctor: one(doctors, { fields: [doctorPractices.doctorId], references: [doctors.id] }),
  facility: one(facilities, { fields: [doctorPractices.facilityId], references: [facilities.id] }),
}));
export const facilitiesRelations = relations(facilities, ({ one, many }) => ({
  locality: one(localities, { fields: [facilities.localityKey], references: [localities.key] }),
  practices: many(doctorPractices),
}));
export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  doctor: one(doctors, { fields: [reviews.doctorId], references: [doctors.id] }),
  author: one(users, { fields: [reviews.authorUserId], references: [users.id] }),
  response: one(doctorResponses, { fields: [reviews.id], references: [doctorResponses.reviewId] }),
  evidenceFiles: many(reviewEvidence),
  reports: many(reviewReports),
}));
export const doctorResponsesRelations = relations(doctorResponses, ({ one }) => ({
  review: one(reviews, { fields: [doctorResponses.reviewId], references: [reviews.id] }),
}));
export const reviewEvidenceRelations = relations(reviewEvidence, ({ one }) => ({
  review: one(reviews, { fields: [reviewEvidence.reviewId], references: [reviews.id] }),
  file: one(files, { fields: [reviewEvidence.fileId], references: [files.id] }),
}));
export const reviewReportsRelations = relations(reviewReports, ({ one }) => ({
  review: one(reviews, { fields: [reviewReports.reviewId], references: [reviews.id] }),
}));
export const profileReportsRelations = relations(profileReports, ({ one }) => ({
  doctor: one(doctors, { fields: [profileReports.doctorId], references: [doctors.id] }),
}));
export const correctionsRelations = relations(corrections, ({ one }) => ({
  doctor: one(doctors, { fields: [corrections.doctorId], references: [doctors.id] }),
}));
export const enquiriesRelations = relations(enquiries, ({ one }) => ({
  doctor: one(doctors, { fields: [enquiries.doctorId], references: [doctors.id] }),
  practice: one(doctorPractices, { fields: [enquiries.practiceId], references: [doctorPractices.id] }),
}));
export const doctorSubmissionsRelations = relations(doctorSubmissions, ({ one }) => ({
  user: one(users, { fields: [doctorSubmissions.userId], references: [users.id] }),
  doctor: one(doctors, { fields: [doctorSubmissions.doctorId], references: [doctors.id] }),
}));
export const doctorClaimsRelations = relations(doctorClaims, ({ one }) => ({
  doctor: one(doctors, { fields: [doctorClaims.doctorId], references: [doctors.id] }),
  user: one(users, { fields: [doctorClaims.userId], references: [users.id] }),
}));
export const profileChangeRequestsRelations = relations(profileChangeRequests, ({ one }) => ({
  doctor: one(doctors, { fields: [profileChangeRequests.doctorId], references: [doctors.id] }),
  requestedBy: one(users, { fields: [profileChangeRequests.requestedByUserId], references: [users.id] }),
}));
export const verificationChecksRelations = relations(verificationChecks, ({ one }) => ({
  doctor: one(doctors, { fields: [verificationChecks.doctorId], references: [doctors.id] }),
}));
export const doctorManagersRelations = relations(doctorManagers, ({ one }) => ({
  doctor: one(doctors, { fields: [doctorManagers.doctorId], references: [doctors.id] }),
}));
export const usersRelations = relations(users, ({ one, many }) => ({
  staff: one(staffMembers, { fields: [users.id], references: [staffMembers.userId] }),
  sessions: many(sessions),
  referralsMade: many(referrals, { relationName: "referrer" }),
  referralsReceived: many(referrals, { relationName: "referee" }),
  tribeRewards: many(tribeRewards),
}));
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, { fields: [auditLogs.actorUserId], references: [users.id] }),
}));
export const staffMembersRelations = relations(staffMembers, ({ one }) => ({
  user: one(users, { fields: [staffMembers.userId], references: [users.id] }),
}));
export const seoRoutesRelations = relations(seoRoutes, ({ one }) => ({
  specialty: one(specialties, { fields: [seoRoutes.specialtyKey], references: [specialties.key] }),
  locality: one(localities, { fields: [seoRoutes.localityKey], references: [localities.key] }),
}));
export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, { fields: [referrals.referrerUserId], references: [users.id], relationName: "referrer" }),
  referee: one(users, { fields: [referrals.refereeUserId], references: [users.id], relationName: "referee" }),
  doctor: one(doctors, { fields: [referrals.doctorId], references: [doctors.id] }),
}));
export const tribeRewardsRelations = relations(tribeRewards, ({ one }) => ({
  user: one(users, { fields: [tribeRewards.userId], references: [users.id] }),
}));

/* ------------------------------------------------------------------------- */
/* Doctor articles (/articles)                                               */
/* ------------------------------------------------------------------------- */

/**
 * Articles written by a doctor and published under their name after a staff
 * decision (lib/services/articles.ts). Rules:
 *  - Only the claiming doctor of a published profile whose primary
 *    registration has been checked against the register may write. Clinic
 *    managers cannot.
 *  - The registration printed on the article is snapshotted from the
 *    verified profile at approval — never typed by the doctor — so nobody can
 *    sign an article with someone else's number.
 *  - Staff approve or reject with a note; they never edit the doctor's text.
 *  - `sourceUrl` is set when the piece first appeared elsewhere; the page then
 *    canonicalises to it and stays out of the sitemap.
 *  - An edit to a published article is held in `revision` while the approved
 *    version stays live, until staff decide it.
 */
export const doctorArticles = pgTable(
  "doctor_articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
    authorUserId: uuid("author_user_id").notNull().references(() => users.id),
    /** Public path segment: /articles/<slug>. Unique across the site. */
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    /** Standfirst under the H1 and the meta description. */
    description: text("description").notNull(),
    /** Body in the editorial inline syntax (## headings, - lists, **bold**, [links](…)). */
    body: text("body").notNull(),
    /** Original publication, when republished here. Becomes the canonical. */
    sourceUrl: text("source_url"),
    status: articleStatus("status").notNull().default("draft"),
    /** Pending edit to a published article: { slug?, title, description, body, sourceUrl }. */
    revision: jsonb("revision"),
    revisionSubmittedAt: timestamp("revision_submitted_at", { withTimezone: true }),
    registrationCouncil: text("registration_council"),
    registrationNumber: text("registration_number"),
    reviewerNote: text("reviewer_note"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    decidedByUserId: uuid("decided_by_user_id").references(() => users.id),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("articles_doctor_status_idx").on(t.doctorId, t.status), index("articles_status_published_idx").on(t.status, t.publishedAt)],
);

export const doctorArticlesRelations = relations(doctorArticles, ({ one }) => ({
  doctor: one(doctors, { fields: [doctorArticles.doctorId], references: [doctors.id] }),
  author: one(users, { fields: [doctorArticles.authorUserId], references: [users.id] }),
}));

/* ------------------------------------------------------------------------- */
/* Condition library (/conditions)                                           */
/* ------------------------------------------------------------------------- */

/**
 * Compiled condition drafts (MedlinePlus, Orphanet, HPO), imported by
 * scripts/import-conditions.ts. These rows are *source drafts*: attributed,
 * unreviewed, and rendered noindex. A condition becomes indexable only when an
 * original article for it exists in lib/conditions/articles and a named
 * clinician has signed that article off — see lib/conditions/gate.ts. Nothing
 * in this table can make a page indexable on its own.
 *
 * `sections` and `sources` are the compiled body as a snapshot (JSON is the
 * right shape for an editorial body); the department and the speciality it
 * routes to are relational columns because listings and hubs filter on them.
 */
export const conditions = pgTable(
  "conditions",
  {
    slug: text("slug").primaryKey(),
    /** Compiler id, e.g. TDI-C-0001. Stable across re-imports. */
    sourceId: text("source_id").notNull().unique(),
    name: text("name").notNull(),
    otherNames: text("other_names").array().notNull().default(sql`'{}'::text[]`),
    department: text("department").notNull(),
    departmentSlug: text("department_slug").notNull(),
    /** Nearest speciality on the directory; null where none exists (e.g. clinical genetics). */
    specialtyKey: text("specialty_key").references(() => specialties.key),
    clinicianLabel: text("clinician_label").notNull(),
    additionalDepartments: text("additional_departments"),
    scope: text("scope").notNull(),
    sourceCollection: text("source_collection").notNull(),
    /** Orphanet ORPHA code when the source is Orphanet. */
    orphaCode: text("orpha_code"),
    metaDescription: text("meta_description").notNull(),
    sections: jsonb("sections").notNull(),
    sources: jsonb("sources").notNull(),
    attribution: text("attribution").notNull(),
    hpoCitation: text("hpo_citation"),
    reviewFlags: text("review_flags").array().notNull().default(sql`'{}'::text[]`),
    sourceGaps: text("source_gaps").array().notNull().default(sql`'{}'::text[]`),
    /** Cleanup applied on import (detached lists re-attached, stray lines dropped …). */
    cleanupNotes: text("cleanup_notes").array().notNull().default(sql`'{}'::text[]`),
    wordCount: integer("word_count").notNull(),
    /** Words not shared with 5+ other drafts — the honest measure of page substance. */
    uniqueWordCount: integer("unique_word_count").notNull(),
    contentSha256: text("content_sha256").notNull(),
    compiledOn: date("compiled_on").notNull(),
    /** Live = served (noindex). False hides the page entirely (404). */
    live: boolean("live").notNull().default(true),
    importedAt: timestamp("imported_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("conditions_department_idx").on(t.departmentSlug, t.name),
    index("conditions_specialty_idx").on(t.specialtyKey),
    index("conditions_name_idx").on(t.name),
  ],
);
