CREATE TYPE "public"."referral_status" AS ENUM('pending', 'verified', 'rejected', 'clawed_back');--> statement-breakpoint
CREATE TYPE "public"."tribe_reward_kind" AS ENUM('voucher', 'recognition');--> statement-breakpoint
CREATE TYPE "public"."tribe_reward_status" AS ENUM('pending_review', 'issued', 'cancelled');--> statement-breakpoint
CREATE TABLE "referral_codes" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "referral_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_user_id" uuid NOT NULL,
	"referee_user_id" uuid NOT NULL,
	"doctor_id" uuid,
	"kind" text NOT NULL,
	"channel" text,
	"status" "referral_status" DEFAULT 'pending' NOT NULL,
	"reason" text,
	"ip_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"verified_at" timestamp with time zone,
	"settled_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "tribe_rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"level" integer NOT NULL,
	"kind" "tribe_reward_kind" DEFAULT 'voucher' NOT NULL,
	"amount_inr" integer DEFAULT 0 NOT NULL,
	"status" "tribe_reward_status" DEFAULT 'pending_review' NOT NULL,
	"hold_until" timestamp with time zone NOT NULL,
	"voucher_code" text,
	"issued_at" timestamp with time zone,
	"issued_by_user_id" uuid,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "referral_codes" ADD CONSTRAINT "referral_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_user_id_users_id_fk" FOREIGN KEY ("referrer_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referee_user_id_users_id_fk" FOREIGN KEY ("referee_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tribe_rewards" ADD CONSTRAINT "tribe_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tribe_rewards" ADD CONSTRAINT "tribe_rewards_issued_by_user_id_users_id_fk" FOREIGN KEY ("issued_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "referrals_referee_uq" ON "referrals" USING btree ("referee_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "referrals_doctor_uq" ON "referrals" USING btree ("doctor_id") WHERE "referrals"."doctor_id" is not null;--> statement-breakpoint
CREATE INDEX "referrals_referrer_status_idx" ON "referrals" USING btree ("referrer_user_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "tribe_rewards_user_level_uq" ON "tribe_rewards" USING btree ("user_id","level");--> statement-breakpoint
CREATE INDEX "tribe_rewards_status_idx" ON "tribe_rewards" USING btree ("status","hold_until");