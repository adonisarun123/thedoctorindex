CREATE TABLE "qualification_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"qualification_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"file_id" uuid NOT NULL,
	"uploaded_by_user_id" uuid,
	"status" "evidence_status" DEFAULT 'supplied' NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_at" timestamp with time zone,
	"decided_by_user_id" uuid
);
--> statement-breakpoint
ALTER TABLE "qualification_evidence" ADD CONSTRAINT "qualification_evidence_qualification_id_doctor_qualifications_id_fk" FOREIGN KEY ("qualification_id") REFERENCES "public"."doctor_qualifications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qualification_evidence" ADD CONSTRAINT "qualification_evidence_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qualification_evidence" ADD CONSTRAINT "qualification_evidence_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qualification_evidence" ADD CONSTRAINT "qualification_evidence_uploaded_by_user_id_users_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qualification_evidence" ADD CONSTRAINT "qualification_evidence_decided_by_user_id_users_id_fk" FOREIGN KEY ("decided_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "qualification_evidence_status_idx" ON "qualification_evidence" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "qualification_evidence_qual_idx" ON "qualification_evidence" USING btree ("qualification_id");