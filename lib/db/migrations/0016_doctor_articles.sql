CREATE TYPE "public"."article_status" AS ENUM('draft', 'submitted', 'published', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TABLE "doctor_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"author_user_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"body" text NOT NULL,
	"source_url" text,
	"status" "article_status" DEFAULT 'draft' NOT NULL,
	"revision" jsonb,
	"revision_submitted_at" timestamp with time zone,
	"registration_council" text,
	"registration_number" text,
	"reviewer_note" text,
	"submitted_at" timestamp with time zone,
	"decided_at" timestamp with time zone,
	"decided_by_user_id" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "doctor_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "doctor_articles" ADD CONSTRAINT "doctor_articles_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_articles" ADD CONSTRAINT "doctor_articles_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_articles" ADD CONSTRAINT "doctor_articles_decided_by_user_id_users_id_fk" FOREIGN KEY ("decided_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "articles_doctor_status_idx" ON "doctor_articles" USING btree ("doctor_id","status");--> statement-breakpoint
CREATE INDEX "articles_status_published_idx" ON "doctor_articles" USING btree ("status","published_at");