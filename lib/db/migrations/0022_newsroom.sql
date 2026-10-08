CREATE TYPE "public"."news_status" AS ENUM('draft', 'approved', 'published', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TABLE "news_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"ok" boolean,
	"report" jsonb,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "news_seen_urls" (
	"url" text PRIMARY KEY NOT NULL,
	"outcome" text NOT NULL,
	"story_id" uuid,
	"seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news_stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"headline" text NOT NULL,
	"dek" text NOT NULL,
	"highlights" text[] DEFAULT '{}'::text[] NOT NULL,
	"why_it_matters" text DEFAULT '' NOT NULL,
	"body" text NOT NULL,
	"numbers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"category" text NOT NULL,
	"subject_name" text NOT NULL,
	"subject_role" text DEFAULT '' NOT NULL,
	"place" text DEFAULT '' NOT NULL,
	"abroad" boolean DEFAULT false NOT NULL,
	"specialty_key" text,
	"sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"fingerprint" text NOT NULL,
	"event_date" date,
	"status" "news_status" DEFAULT 'draft' NOT NULL,
	"auto_eligible" boolean DEFAULT false NOT NULL,
	"gate_notes" text[] DEFAULT '{}'::text[] NOT NULL,
	"verification" jsonb,
	"origin" text DEFAULT 'pipeline' NOT NULL,
	"correction" text,
	"corrected_at" timestamp with time zone,
	"reviewer_note" text,
	"decided_at" timestamp with time zone,
	"decided_by_user_id" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "news_stories_slug_unique" UNIQUE("slug"),
	CONSTRAINT "news_stories_fingerprint_unique" UNIQUE("fingerprint")
);
--> statement-breakpoint
CREATE TABLE "news_story_doctors" (
	"story_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"primary" boolean DEFAULT true NOT NULL,
	"matched_by" text NOT NULL,
	CONSTRAINT "news_story_doctors_story_id_doctor_id_pk" PRIMARY KEY("story_id","doctor_id")
);
--> statement-breakpoint
ALTER TABLE "news_seen_urls" ADD CONSTRAINT "news_seen_urls_story_id_news_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."news_stories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_stories" ADD CONSTRAINT "news_stories_specialty_key_specialties_key_fk" FOREIGN KEY ("specialty_key") REFERENCES "public"."specialties"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_stories" ADD CONSTRAINT "news_stories_decided_by_user_id_users_id_fk" FOREIGN KEY ("decided_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_story_doctors" ADD CONSTRAINT "news_story_doctors_story_id_news_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."news_stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_story_doctors" ADD CONSTRAINT "news_story_doctors_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "news_status_published_idx" ON "news_stories" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "news_category_idx" ON "news_stories" USING btree ("category","published_at");--> statement-breakpoint
CREATE INDEX "news_doctor_idx" ON "news_story_doctors" USING btree ("doctor_id");