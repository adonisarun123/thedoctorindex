CREATE TABLE "doctor_digests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"period" text NOT NULL,
	"delivered" boolean NOT NULL,
	"provider" text,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "digest_opt_out_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "doctor_digests" ADD CONSTRAINT "doctor_digests_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_digests" ADD CONSTRAINT "doctor_digests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "doctor_digests_doctor_period_uq" ON "doctor_digests" USING btree ("doctor_id","period");