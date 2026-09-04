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
export const fileBucket = pgEnum("file_bucket", ["private", "quarantine", "public"]);
export const scanResult = pgEnum("scan_result", ["pending", "clean", "infected", "skipped"]);
export const seoRouteKind = pgEnum("seo_route_kind", ["national", "city", "locality"]);
export const seoOverride = pgEnum("seo_override", ["force_index", "force_noindex"]);
export const otpPurpose = pgEnum("otp_purpose", ["sign_in", "claim", "enquiry"]);
export const gender = pgEnum("gender", ["F", "M", "X"]);

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
});

export const localities = pgTable("localities", {
  key: text("key").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  citySlug: text("city_slug").notNull(),
  state: text("state").notNull(),
  stateSlug: text("state_slug").notNull(),
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
/* Relations (for db.query.*)                                                */
/* ------------------------------------------------------------------------- */

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  specialty: one(specialties, { fields: [doctors.specialtyKey], references: [specialties.key] }),
  registrations: many(medicalRegistrations),
  qualifications: many(doctorQualifications),
  experience: many(doctorExperience),
  practices: many(doctorPractices),
  reviews: many(reviews),
  changeRequests: many(profileChangeRequests),
  checks: many(verificationChecks),
  managers: many(doctorManagers),
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
