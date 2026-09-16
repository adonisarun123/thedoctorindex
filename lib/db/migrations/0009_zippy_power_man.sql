CREATE TABLE "photo_candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"url" text NOT NULL,
	"source_url" text NOT NULL,
	"source" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "photo_candidates" ADD CONSTRAINT "photo_candidates_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "photo_candidates_doctor_url_idx" ON "photo_candidates" USING btree ("doctor_id","url");--> statement-breakpoint
CREATE INDEX "photo_candidates_doctor_idx" ON "photo_candidates" USING btree ("doctor_id");
