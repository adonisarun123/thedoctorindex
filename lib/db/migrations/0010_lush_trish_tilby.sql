CREATE TYPE "public"."credential_kind" AS ENUM('award', 'membership', 'publication');--> statement-breakpoint
CREATE TABLE "doctor_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"kind" "credential_kind" NOT NULL,
	"title" text NOT NULL,
	"issuer" text,
	"year" integer,
	"url" text,
	"state" "verification_state" DEFAULT 'submitted' NOT NULL,
	"verified_on" date,
	"verified_by_user_id" uuid,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "doctor_credentials" ADD CONSTRAINT "doctor_credentials_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_credentials" ADD CONSTRAINT "doctor_credentials_verified_by_user_id_users_id_fk" FOREIGN KEY ("verified_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "doctor_credentials_doctor_idx" ON "doctor_credentials" USING btree ("doctor_id","kind");