CREATE TABLE "booking_notify_emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"email" text NOT NULL,
	"token_hash" text,
	"token_expires_at" timestamp with time zone,
	"verified_at" timestamp with time zone,
	"added_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "booking_notify_emails" ADD CONSTRAINT "booking_notify_emails_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_notify_emails" ADD CONSTRAINT "booking_notify_emails_added_by_user_id_users_id_fk" FOREIGN KEY ("added_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "booking_notify_emails_doctor_email_uq" ON "booking_notify_emails" USING btree ("doctor_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "booking_notify_emails_token_uq" ON "booking_notify_emails" USING btree ("token_hash");