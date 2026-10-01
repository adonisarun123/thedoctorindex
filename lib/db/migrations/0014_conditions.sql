CREATE TABLE "conditions" (
	"slug" text PRIMARY KEY NOT NULL,
	"source_id" text NOT NULL,
	"name" text NOT NULL,
	"other_names" text[] DEFAULT '{}'::text[] NOT NULL,
	"department" text NOT NULL,
	"department_slug" text NOT NULL,
	"specialty_key" text,
	"clinician_label" text NOT NULL,
	"additional_departments" text,
	"scope" text NOT NULL,
	"source_collection" text NOT NULL,
	"orpha_code" text,
	"meta_description" text NOT NULL,
	"sections" jsonb NOT NULL,
	"sources" jsonb NOT NULL,
	"attribution" text NOT NULL,
	"hpo_citation" text,
	"review_flags" text[] DEFAULT '{}'::text[] NOT NULL,
	"source_gaps" text[] DEFAULT '{}'::text[] NOT NULL,
	"cleanup_notes" text[] DEFAULT '{}'::text[] NOT NULL,
	"word_count" integer NOT NULL,
	"unique_word_count" integer NOT NULL,
	"content_sha256" text NOT NULL,
	"compiled_on" date NOT NULL,
	"live" boolean DEFAULT true NOT NULL,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "conditions_source_id_unique" UNIQUE("source_id")
);
--> statement-breakpoint
ALTER TABLE "conditions" ADD CONSTRAINT "conditions_specialty_key_specialties_key_fk" FOREIGN KEY ("specialty_key") REFERENCES "public"."specialties"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "conditions_department_idx" ON "conditions" USING btree ("department_slug","name");--> statement-breakpoint
CREATE INDEX "conditions_specialty_idx" ON "conditions" USING btree ("specialty_key");--> statement-breakpoint
CREATE INDEX "conditions_name_idx" ON "conditions" USING btree ("name");