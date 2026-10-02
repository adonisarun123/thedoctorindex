CREATE TYPE "public"."invite_status" AS ENUM('queued', 'sent', 'claimed', 'opted_out', 'cancelled');--> statement-breakpoint
ALTER TYPE "public"."claim_method" ADD VALUE 'staff_invite';--> statement-breakpoint
CREATE TABLE "doctor_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"email" text NOT NULL,
	"email_source" text NOT NULL,
	"token_hash" text NOT NULL,
	"status" "invite_status" DEFAULT 'queued' NOT NULL,
	"sends" smallint DEFAULT 0 NOT NULL,
	"last_delivered" boolean,
	"first_sent_at" timestamp with time zone,
	"last_sent_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"accepted_at" timestamp with time zone,
	"accepted_user_id" uuid,
	"confirm_attempts" smallint DEFAULT 0 NOT NULL,
	"claimed_at" timestamp with time zone,
	"opted_out_at" timestamp with time zone,
	"opt_out_reason" text,
	"created_by_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "doctor_invites" ADD CONSTRAINT "doctor_invites_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_invites" ADD CONSTRAINT "doctor_invites_accepted_user_id_users_id_fk" FOREIGN KEY ("accepted_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_invites" ADD CONSTRAINT "doctor_invites_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "doctor_invites_token_uq" ON "doctor_invites" USING btree ("token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "doctor_invites_open_uq" ON "doctor_invites" USING btree ("doctor_id") WHERE status in ('queued', 'sent');--> statement-breakpoint
CREATE INDEX "doctor_invites_status_idx" ON "doctor_invites" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "doctor_invites_email_idx" ON "doctor_invites" USING btree (lower("email"));