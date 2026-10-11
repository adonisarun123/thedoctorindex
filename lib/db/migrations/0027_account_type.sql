-- Who the account is for, as declared at sign-up. `role` stays the verified
-- state (doctor only after a profile is claimed or created against the
-- register). Staff and patient lists filter on account_type, so a doctor who
-- has not finished verification no longer shows up as a patient.
ALTER TABLE "users" ADD COLUMN "account_type" text;--> statement-breakpoint
-- Backfill from what the account has done, then from the journey it signed up for.
UPDATE "users" u SET "account_type" = 'doctor'
WHERE u.role = 'doctor'
   OR EXISTS (SELECT 1 FROM doctors d WHERE d.claimed_by_user_id = u.id)
   OR EXISTS (SELECT 1 FROM doctor_claims c WHERE c.user_id = u.id)
   OR EXISTS (SELECT 1 FROM doctor_submissions x WHERE x.user_id = u.id)
   OR EXISTS (SELECT 1 FROM doctor_managers m WHERE m.user_id = u.id)
   OR u.signup_flow IN ('claim', 'add_doctor', 'dashboard');--> statement-breakpoint
UPDATE "users" SET "account_type" = 'patient' WHERE "account_type" IS NULL AND role = 'patient';
