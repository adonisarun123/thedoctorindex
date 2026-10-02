CREATE TYPE "public"."appointment_status" AS ENUM('requested', 'confirmed', 'declined', 'cancelled', 'completed', 'no_show');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"practice_id" uuid NOT NULL,
	"patient_user_id" uuid NOT NULL,
	"patient_name" text NOT NULL,
	"patient_phone" text NOT NULL,
	"for_whom" text DEFAULT 'self' NOT NULL,
	"reason" text,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"status" "appointment_status" DEFAULT 'requested' NOT NULL,
	"status_note" text,
	"decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "availability_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"day" date NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "availability_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"practice_id" uuid NOT NULL,
	"weekday" smallint NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"slot_minutes" smallint DEFAULT 15 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_questions" (
	"key" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"help" text DEFAULT '' NOT NULL,
	"specialty_key" text,
	"active" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "communication" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "explanation" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "wait_time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "facility" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "text" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "booking_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "ratings" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "score" real;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_practice_id_doctor_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."doctor_practices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_user_id_users_id_fk" FOREIGN KEY ("patient_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability_blocks" ADD CONSTRAINT "availability_blocks_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability_rules" ADD CONSTRAINT "availability_rules_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability_rules" ADD CONSTRAINT "availability_rules_practice_id_doctor_practices_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."doctor_practices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_questions" ADD CONSTRAINT "review_questions_specialty_key_specialties_key_fk" FOREIGN KEY ("specialty_key") REFERENCES "public"."specialties"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "appointments_doctor_start_idx" ON "appointments" USING btree ("doctor_id","starts_at");--> statement-breakpoint
CREATE INDEX "appointments_patient_idx" ON "appointments" USING btree ("patient_user_id","starts_at");--> statement-breakpoint
CREATE UNIQUE INDEX "appointments_live_slot_uq" ON "appointments" USING btree ("doctor_id","starts_at") WHERE status in ('requested','confirmed');--> statement-breakpoint
CREATE UNIQUE INDEX "availability_blocks_doctor_day_uq" ON "availability_blocks" USING btree ("doctor_id","day");--> statement-breakpoint
CREATE INDEX "availability_rules_doctor_idx" ON "availability_rules" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "review_questions_specialty_idx" ON "review_questions" USING btree ("specialty_key","active");--> statement-breakpoint
UPDATE "reviews" SET "score" = ("communication" + "explanation" + "wait_time" + "facility") / 4.0 WHERE "score" IS NULL AND "communication" IS NOT NULL;--> statement-breakpoint
CREATE OR REPLACE VIEW doctor_rating_rollups AS
SELECT
  d.id AS doctor_id,
  COUNT(r.id)::int AS review_count,
  COALESCE(ROUND(AVG(r.s)::numeric, 2), 0)::numeric(3,2) AS average,
  COUNT(*) FILTER (WHERE r.s < 1.5)::int AS star1,
  COUNT(*) FILTER (WHERE r.s >= 1.5 AND r.s < 2.5)::int AS star2,
  COUNT(*) FILTER (WHERE r.s >= 2.5 AND r.s < 3.5)::int AS star3,
  COUNT(*) FILTER (WHERE r.s >= 3.5 AND r.s < 4.5)::int AS star4,
  COUNT(*) FILTER (WHERE r.s >= 4.5)::int AS star5,
  COUNT(*) FILTER (WHERE r.evidence = 'checked')::int AS evidence_checked_count
FROM doctors d
LEFT JOIN (
  SELECT doctor_id, evidence, id,
         COALESCE(score, (communication + explanation + wait_time + facility) / 4.0) AS s
  FROM reviews WHERE status IN ('published', 'redacted')
) r ON r.doctor_id = d.id
GROUP BY d.id;--> statement-breakpoint
INSERT INTO "review_questions" ("key", "label", "help", "specialty_key", "sort") VALUES
  ('knowledge', 'Knowledge and expertise', 'Did the doctor seem thorough and well informed about your concern?', NULL, 10),
  ('explanation', 'Explanation', 'Did you leave understanding what is going on and what happens next?', NULL, 20),
  ('services', 'Services and care', 'Were the consultation, tests or procedures you needed handled properly?', NULL, 30),
  ('hospitality', 'Courtesy of doctor and staff', 'Were you listened to and treated with respect, from the front desk on?', NULL, 40),
  ('hygiene', 'Hygiene and cleanliness', 'Were the clinic, consulting room and equipment clean?', NULL, 50),
  ('wait_time', 'Waiting time', 'How close to your appointment time were you seen?', NULL, 60)
ON CONFLICT ("key") DO NOTHING;--> statement-breakpoint
INSERT INTO "review_questions" ("key", "label", "help", "specialty_key", "sort")
SELECT v.key, v.label, v.help, v.spec, v.sort
FROM (VALUES
  ('paediatrics.child_comfort', 'Comfort with your child', 'Was the doctor patient and gentle with your child?', 'paediatrics', 100),
  ('paediatrics.parent_guidance', 'Guidance for parents', 'Did you get clear advice on care at home and warning signs to watch for?', 'paediatrics', 110),
  ('gynaecology.privacy', 'Privacy and dignity', 'Were you given privacy during examination, and a chaperone if you wanted one?', 'gynaecology', 100),
  ('gynaecology.options', 'Options explained', 'Were the choices available to you explained without pressure?', 'gynaecology', 110),
  ('dentistry.pain_comfort', 'Comfort during treatment', 'Was pain managed and were you told what to expect before each step?', 'dentistry', 100),
  ('dentistry.cost_clarity', 'Cost explained upfront', 'Were the cost and number of sittings explained before treatment started?', 'dentistry', 110),
  ('orthopaedics.recovery_plan', 'Recovery plan', 'Did you get a clear plan for recovery, exercises or follow-up?', 'orthopaedics', 100),
  ('physiotherapy.session_attention', 'Attention during sessions', 'Was the therapist with you and attentive for the session?', 'physiotherapy', 100),
  ('physiotherapy.home_plan', 'Home exercise plan', 'Were you taught exercises to continue at home?', 'physiotherapy', 110),
  ('psychiatry.felt_heard', 'Felt heard without judgement', 'Did you feel listened to and not judged?', 'psychiatry', 100),
  ('psychiatry.medication_explained', 'Medication explained', 'Were medicines, side effects and duration explained?', 'psychiatry', 110),
  ('clinical-psychology.felt_heard', 'Felt heard without judgement', 'Did you feel listened to and not judged?', 'clinical-psychology', 100),
  ('dermatology.options', 'Treatment options explained', 'Were the options, costs and expected timeline explained?', 'dermatology', 100),
  ('ophthalmology.examination', 'Thoroughness of the eye examination', 'Were the tests explained and the results discussed with you?', 'ophthalmology', 100),
  ('cardiology.risk_explained', 'Risk and medicines explained', 'Did you understand your heart risk and why each medicine was prescribed?', 'cardiology', 100),
  ('general-surgery.options_risks', 'Surgery options and risks explained', 'Were the alternatives, risks and recovery time explained before you decided?', 'general-surgery', 100),
  ('general-practice.medicines_reviewed', 'Medicines reviewed', 'Did the doctor check what you already take before prescribing?', 'general-practice', 100),
  ('internal-medicine.medicines_reviewed', 'Medicines reviewed', 'Did the doctor check what you already take before prescribing?', 'internal-medicine', 100),
  ('ent.examination', 'Examination explained', 'Were the examination and its findings explained to you?', 'ent', 100),
  ('ayush.treatment_plan', 'Treatment plan and duration', 'Were the treatment, its duration and any diet advice explained?', 'ayush', 100)
) AS v(key, label, help, spec, sort)
WHERE EXISTS (SELECT 1 FROM specialties s WHERE s.key = v.spec)
ON CONFLICT ("key") DO NOTHING;
