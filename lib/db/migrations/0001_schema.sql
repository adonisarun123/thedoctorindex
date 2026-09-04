CREATE TYPE "public"."case_priority" AS ENUM('safety', 'high', 'normal', 'low');--> statement-breakpoint
CREATE TYPE "public"."case_status" AS ENUM('open', 'assessed', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."change_status" AS ENUM('pending', 'published', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."check_kind" AS ENUM('registration', 'qualification', 'practice', 'hpr', 'claim', 'identity', 'disciplinary');--> statement-breakpoint
CREATE TYPE "public"."check_result" AS ENUM('verified', 'failed', 'pending', 'not_found');--> statement-breakpoint
CREATE TYPE "public"."claim_method" AS ENUM('practice_otp', 'work_email', 'practice_admin', 'document');--> statement-breakpoint
CREATE TYPE "public"."claim_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."correction_status" AS ENUM('open', 'applied', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."doctor_status" AS ENUM('draft', 'submitted', 'in_review', 'published', 'suspended', 'retired', 'archived');--> statement-breakpoint
CREATE TYPE "public"."enquiry_status" AS ENUM('new', 'sent', 'contacted', 'closed');--> statement-breakpoint
CREATE TYPE "public"."evidence_status" AS ENUM('none', 'supplied', 'checked', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."file_bucket" AS ENUM('private', 'quarantine', 'public');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('F', 'M', 'X');--> statement-breakpoint
CREATE TYPE "public"."manager_status" AS ENUM('invited', 'active', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."otp_purpose" AS ENUM('sign_in', 'claim', 'enquiry');--> statement-breakpoint
CREATE TYPE "public"."response_status" AS ENUM('pending', 'published', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('pending', 'published', 'redacted', 'rejected', 'removed');--> statement-breakpoint
CREATE TYPE "public"."scan_result" AS ENUM('pending', 'clean', 'infected', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."seo_override" AS ENUM('force_index', 'force_noindex');--> statement-breakpoint
CREATE TYPE "public"."seo_route_kind" AS ENUM('national', 'city', 'locality');--> statement-breakpoint
CREATE TYPE "public"."staff_role" AS ENUM('super_admin', 'verification_officer', 'review_moderator', 'content_editor', 'support_officer');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('submitted', 'in_review', 'needs_info', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('patient', 'doctor', 'staff');--> statement-breakpoint
CREATE TYPE "public"."verification_state" AS ENUM('verified', 'submitted', 'rejected');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"actor_role" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"before" jsonb,
	"after" jsonb,
	"reason" text,
	"ip_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "corrections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"submitted_by_user_id" uuid,
	"field" text NOT NULL,
	"current_value" text,
	"proposed_value" text NOT NULL,
	"source_note" text,
	"is_doctor_or_staff" boolean DEFAULT false NOT NULL,
	"contact" text,
	"status" "correction_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_at" timestamp with time zone,
	"decided_by_user_id" uuid,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "doctor_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"registration_number" text NOT NULL,
	"method" "claim_method" NOT NULL,
	"evidence_file_id" uuid,
	"status" "claim_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_at" timestamp with time zone,
	"decided_by_user_id" uuid,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "doctor_experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"role" text NOT NULL,
	"place" text NOT NULL,
	"from_year" integer NOT NULL,
	"to_year" integer,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctor_managers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"user_id" uuid,
	"email" text NOT NULL,
	"name" text,
	"scope_practice_ids" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"status" "manager_status" DEFAULT 'invited' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "doctor_practices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"facility_id" uuid NOT NULL,
	"days" text DEFAULT '' NOT NULL,
	"hours" text DEFAULT '' NOT NULL,
	"fee_inr" integer,
	"fee_checked_on" date,
	"confirmed_on" date,
	"phone" text,
	"whatsapp" text,
	"wheelchair_access" boolean,
	"active" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctor_qualifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"degree" text NOT NULL,
	"institution" text NOT NULL,
	"university" text,
	"year" integer,
	"country" text DEFAULT 'IN' NOT NULL,
	"state" "verification_state" DEFAULT 'submitted' NOT NULL,
	"checked_on" date,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctor_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"text" text NOT NULL,
	"status" "response_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"moderated_at" timestamp with time zone,
	"moderated_by_user_id" uuid,
	"moderation_reason" text,
	CONSTRAINT "doctor_responses_review_id_unique" UNIQUE("review_id")
);
--> statement-breakpoint
CREATE TABLE "doctor_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"council" text NOT NULL,
	"registration_number" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" "submission_status" DEFAULT 'submitted' NOT NULL,
	"doctor_id" uuid,
	"reviewer_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_at" timestamp with time zone,
	"decided_by_user_id" uuid
);
--> statement-breakpoint
CREATE TABLE "doctors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_id" char(6) NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"gender" "gender",
	"specialty_key" text NOT NULL,
	"subspecialties" text[] DEFAULT '{}'::text[] NOT NULL,
	"practice_start_year" integer,
	"languages" text[] DEFAULT '{}'::text[] NOT NULL,
	"modes" text[] DEFAULT '{"In person"}'::text[] NOT NULL,
	"about" text DEFAULT '' NOT NULL,
	"services" text[] DEFAULT '{}'::text[] NOT NULL,
	"claimed" boolean DEFAULT false NOT NULL,
	"claimed_by_user_id" uuid,
	"quality_score" integer DEFAULT 0 NOT NULL,
	"status" "doctor_status" DEFAULT 'draft' NOT NULL,
	"last_verified_on" date,
	"hpr_verified" boolean DEFAULT false NOT NULL,
	"hpr_id" text,
	"photo_file_id" uuid,
	"photo_consent" boolean DEFAULT false NOT NULL,
	"phone_consent" boolean DEFAULT true NOT NULL,
	"source" text DEFAULT 'self' NOT NULL,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"suspended_reason" text,
	"retired_at" timestamp with time zone,
	"merged_into_id" uuid,
	CONSTRAINT "doctors_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "doctors_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"practice_id" uuid,
	"user_id" uuid,
	"contact" text NOT NULL,
	"preferred_day" text,
	"for_whom" text DEFAULT 'self' NOT NULL,
	"note" text,
	"consent_to_share" boolean DEFAULT false NOT NULL,
	"status" "enquiry_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"doctor_id" uuid,
	"practice_id" uuid,
	"path" text,
	"query" text,
	"locality_key" text,
	"session_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"locality_key" text NOT NULL,
	"address" text NOT NULL,
	"postal_code" text,
	"lat" text,
	"lng" text,
	"geocode_source" text,
	"geocode_confidence" text,
	"phone" text,
	"website" text,
	"hfr_id" text,
	"confirmed_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bucket" "file_bucket" DEFAULT 'private' NOT NULL,
	"filename" text NOT NULL,
	"mime" text NOT NULL,
	"size" integer NOT NULL,
	"sha256" text NOT NULL,
	"data" "bytea",
	"storage_key" text,
	"uploaded_by_user_id" uuid,
	"scan" "scan_result" DEFAULT 'pending' NOT NULL,
	"scanned_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "localities" (
	"key" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"city_slug" text NOT NULL,
	"state" text NOT NULL,
	"state_slug" text NOT NULL,
	"lat" text,
	"lng" text,
	"active" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 100 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medical_registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"number" text NOT NULL,
	"number_normalized" text NOT NULL,
	"council" text NOT NULL,
	"council_normalized" text NOT NULL,
	"registered_year" integer,
	"status" text DEFAULT 'active' NOT NULL,
	"checked_on" date,
	"source" text,
	"is_primary" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "otp_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"code_hash" text NOT NULL,
	"purpose" "otp_purpose" DEFAULT 'sign_in' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"attempts" smallint DEFAULT 0 NOT NULL,
	"consumed_at" timestamp with time zone,
	"ip_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_change_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"requested_by_user_id" uuid NOT NULL,
	"field" text NOT NULL,
	"from_value" jsonb,
	"to_value" jsonb NOT NULL,
	"sensitive" boolean DEFAULT false NOT NULL,
	"status" "change_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_at" timestamp with time zone,
	"decided_by_user_id" uuid,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "profile_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"reporter_user_id" uuid,
	"reason" text NOT NULL,
	"detail" text,
	"contact" text,
	"priority" "case_priority" DEFAULT 'normal' NOT NULL,
	"status" "case_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"assessed_at" timestamp with time zone,
	"resolved_at" timestamp with time zone,
	"resolved_by_user_id" uuid,
	"resolution" text
);
--> statement-breakpoint
CREATE TABLE "profile_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"snapshot" jsonb NOT NULL,
	"reason" text,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" text NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "rate_limits_key_window_start_pk" PRIMARY KEY("key","window_start")
);
--> statement-breakpoint
CREATE TABLE "review_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"file_id" uuid NOT NULL,
	"note" text,
	"validated_by_user_id" uuid,
	"validated_at" timestamp with time zone,
	"outcome" "evidence_status" DEFAULT 'supplied' NOT NULL,
	"purge_after" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "review_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"reporter_user_id" uuid,
	"reason" text NOT NULL,
	"detail" text,
	"contact" text,
	"priority" "case_priority" DEFAULT 'normal' NOT NULL,
	"status" "case_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"assessed_at" timestamp with time zone,
	"resolved_at" timestamp with time zone,
	"resolved_by_user_id" uuid,
	"resolution" text
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"author_user_id" uuid NOT NULL,
	"author_label" text NOT NULL,
	"for_whom" text DEFAULT 'self' NOT NULL,
	"visit_month" text NOT NULL,
	"mode" text NOT NULL,
	"communication" smallint NOT NULL,
	"explanation" smallint NOT NULL,
	"wait_time" smallint NOT NULL,
	"facility" smallint NOT NULL,
	"text" text NOT NULL,
	"published_text" text,
	"status" "review_status" DEFAULT 'pending' NOT NULL,
	"evidence" "evidence_status" DEFAULT 'none' NOT NULL,
	"risk_score" smallint DEFAULT 0 NOT NULL,
	"risk_flags" text[] DEFAULT '{}'::text[] NOT NULL,
	"device_hash" text,
	"ip_hash" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"moderated_at" timestamp with time zone,
	"moderated_by_user_id" uuid,
	"moderation_reason" text
);
--> statement-breakpoint
CREATE TABLE "seo_routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "seo_route_kind" NOT NULL,
	"specialty_key" text NOT NULL,
	"locality_key" text,
	"path" text NOT NULL,
	"indexable_count" integer DEFAULT 0 NOT NULL,
	"computed_indexable" boolean DEFAULT false NOT NULL,
	"override" "seo_override",
	"note" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seo_routes_path_unique" UNIQUE("path")
);
--> statement-breakpoint
CREATE TABLE "service_terms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"specialty_key" text,
	"term" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"user_agent" text,
	"ip_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "slug_redirects" (
	"from_path" text PRIMARY KEY NOT NULL,
	"to_path" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "specialties" (
	"key" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"plural" text NOT NULL,
	"one" text NOT NULL,
	"a_one" text NOT NULL,
	"slug" text NOT NULL,
	"department" text NOT NULL,
	"aliases" text[] DEFAULT '{}'::text[] NOT NULL,
	"guide" text DEFAULT '' NOT NULL,
	"when_items" text[] DEFAULT '{}'::text[] NOT NULL,
	"reviewed_on" date,
	"active" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 100 NOT NULL,
	CONSTRAINT "specialties_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "staff_members" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"roles" "staff_role"[] DEFAULT '{}'::staff_role[] NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"mfa_enrolled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text,
	"phone" text,
	"role" "user_role" DEFAULT 'patient' NOT NULL,
	"display_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_sign_in_at" timestamp with time zone,
	"disabled_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "verification_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"kind" "check_kind" NOT NULL,
	"subject_id" uuid,
	"result" "check_result" DEFAULT 'pending' NOT NULL,
	"source" text,
	"evidence_file_id" uuid,
	"checked_by_user_id" uuid,
	"checked_on" timestamp with time zone DEFAULT now() NOT NULL,
	"note" text
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corrections" ADD CONSTRAINT "corrections_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corrections" ADD CONSTRAINT "corrections_submitted_by_user_id_users_id_fk" FOREIGN KEY ("submitted_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corrections" ADD CONSTRAINT "corrections_decided_by_user_id_users_id_fk" FOREIGN KEY ("decided_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_claims" ADD CONSTRAINT "doctor_claims_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_claims" ADD CONSTRAINT "doctor_claims_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_claims" ADD CONSTRAINT "doctor_claims_evidence_file_id_files_id_fk" FOREIGN KEY ("evidence_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_claims" ADD CONSTRAINT "doctor_claims_decided_by_user_id_users_id_fk" FOREIGN KEY ("decided_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_experience" ADD CONSTRAINT "doctor_experience_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_managers" ADD CONSTRAINT "doctor_managers_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_managers" ADD CONSTRAINT "doctor_managers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_practices" ADD CONSTRAINT "doctor_practices_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_practices" ADD CONSTRAINT "doctor_practices_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_qualifications" ADD CONSTRAINT "doctor_qualifications_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_responses" ADD CONSTRAINT "doctor_responses_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_responses" ADD CONSTRAINT "doctor_responses_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_responses" ADD CONSTRAINT "doctor_responses_moderated_by_user_id_users_id_fk" FOREIGN KEY ("moderated_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_submissions" ADD CONSTRAINT "doctor_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_submissions" ADD CONSTRAINT "doctor_submissions_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_submissions" ADD CONSTRAINT "doctor_submissions_decided_by_user_id_users_id_fk" FOREIGN KEY ("decided_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_specialty_key_specialties_key_fk" FOREIGN KEY ("specialty_key") REFERENCES "public"."specialties"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_claimed_by_user_id_users_id_fk" FOREIGN KEY ("claimed_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_practice_id_doctor_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."doctor_practices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_locality_key_localities_key_fk" FOREIGN KEY ("locality_key") REFERENCES "public"."localities"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_user_id_users_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_registrations" ADD CONSTRAINT "medical_registrations_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_change_requests" ADD CONSTRAINT "profile_change_requests_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_change_requests" ADD CONSTRAINT "profile_change_requests_requested_by_user_id_users_id_fk" FOREIGN KEY ("requested_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_change_requests" ADD CONSTRAINT "profile_change_requests_decided_by_user_id_users_id_fk" FOREIGN KEY ("decided_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_reports" ADD CONSTRAINT "profile_reports_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_reports" ADD CONSTRAINT "profile_reports_reporter_user_id_users_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_reports" ADD CONSTRAINT "profile_reports_resolved_by_user_id_users_id_fk" FOREIGN KEY ("resolved_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_revisions" ADD CONSTRAINT "profile_revisions_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_revisions" ADD CONSTRAINT "profile_revisions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_evidence" ADD CONSTRAINT "review_evidence_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_evidence" ADD CONSTRAINT "review_evidence_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_evidence" ADD CONSTRAINT "review_evidence_validated_by_user_id_users_id_fk" FOREIGN KEY ("validated_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_reports" ADD CONSTRAINT "review_reports_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_reports" ADD CONSTRAINT "review_reports_reporter_user_id_users_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_reports" ADD CONSTRAINT "review_reports_resolved_by_user_id_users_id_fk" FOREIGN KEY ("resolved_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_moderated_by_user_id_users_id_fk" FOREIGN KEY ("moderated_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seo_routes" ADD CONSTRAINT "seo_routes_specialty_key_specialties_key_fk" FOREIGN KEY ("specialty_key") REFERENCES "public"."specialties"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seo_routes" ADD CONSTRAINT "seo_routes_locality_key_localities_key_fk" FOREIGN KEY ("locality_key") REFERENCES "public"."localities"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_terms" ADD CONSTRAINT "service_terms_specialty_key_specialties_key_fk" FOREIGN KEY ("specialty_key") REFERENCES "public"."specialties"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_members" ADD CONSTRAINT "staff_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_checks" ADD CONSTRAINT "verification_checks_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_checks" ADD CONSTRAINT "verification_checks_evidence_file_id_files_id_fk" FOREIGN KEY ("evidence_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_checks" ADD CONSTRAINT "verification_checks_checked_by_user_id_users_id_fk" FOREIGN KEY ("checked_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_created_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "practices_doctor_idx" ON "doctor_practices" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "practices_facility_idx" ON "doctor_practices" USING btree ("facility_id");--> statement-breakpoint
CREATE INDEX "doctors_specialty_status_idx" ON "doctors" USING btree ("specialty_key","status");--> statement-breakpoint
CREATE INDEX "doctors_status_quality_idx" ON "doctors" USING btree ("status","quality_score");--> statement-breakpoint
CREATE INDEX "enquiries_doctor_idx" ON "enquiries" USING btree ("doctor_id","created_at");--> statement-breakpoint
CREATE INDEX "events_doctor_kind_idx" ON "events" USING btree ("doctor_id","kind","created_at");--> statement-breakpoint
CREATE INDEX "events_created_idx" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "facilities_locality_idx" ON "facilities" USING btree ("locality_key");--> statement-breakpoint
CREATE UNIQUE INDEX "registration_council_number_uq" ON "medical_registrations" USING btree ("council_normalized","number_normalized");--> statement-breakpoint
CREATE INDEX "otp_identifier_idx" ON "otp_codes" USING btree ("identifier","created_at");--> statement-breakpoint
CREATE INDEX "changes_doctor_status_idx" ON "profile_change_requests" USING btree ("doctor_id","status");--> statement-breakpoint
CREATE INDEX "revisions_doctor_idx" ON "profile_revisions" USING btree ("doctor_id","created_at");--> statement-breakpoint
CREATE INDEX "reviews_doctor_status_idx" ON "reviews" USING btree ("doctor_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_one_per_author_doctor_uq" ON "reviews" USING btree ("doctor_id","author_user_id");--> statement-breakpoint
CREATE INDEX "seo_routes_kind_idx" ON "seo_routes" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_uq" ON "users" USING btree (lower("email")) WHERE "users"."email" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "users_phone_uq" ON "users" USING btree ("phone") WHERE "users"."phone" is not null;--> statement-breakpoint
CREATE INDEX "checks_doctor_kind_idx" ON "verification_checks" USING btree ("doctor_id","kind","checked_on");