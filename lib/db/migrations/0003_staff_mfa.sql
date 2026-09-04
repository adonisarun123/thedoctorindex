ALTER TABLE "sessions" ADD COLUMN "mfa_verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "staff_members" ADD COLUMN "mfa_secret" text;--> statement-breakpoint
ALTER TABLE "staff_members" ADD COLUMN "mfa_enrolled_at" timestamp with time zone;