CREATE TABLE "nmc_register" (
	"source_record_id" bigint PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"council" text NOT NULL,
	"council_code" text,
	"number" text NOT NULL,
	"number_normalized" text NOT NULL,
	"council_normalized" text NOT NULL,
	"registration_date" date,
	"year_of_information" integer,
	"qualification" text,
	"qualification_year" integer,
	"university" text,
	"uprn" text,
	"additional_count" integer DEFAULT 0 NOT NULL,
	"removed" boolean DEFAULT false NOT NULL,
	"data_notes" text,
	"source_url" text,
	"retrieved_at" timestamp with time zone,
	"name_clean" text,
	"name_tokens" text[] DEFAULT '{}'::text[] NOT NULL,
	"name_sorted" text,
	"state_slug" text,
	"era_year" integer,
	"category" text NOT NULL,
	"specialty_key" text,
	"specialty_basis" text,
	"specialty_rank" integer DEFAULT 0 NOT NULL,
	"doctor_id" uuid,
	"match_kind" text,
	"research_status" text,
	"research_note" text,
	"research_place_id" text,
	"researched_at" timestamp with time zone,
	"loaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nmc_register_qualifications" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"source_record_id" bigint NOT NULL,
	"seq" integer,
	"degree" text NOT NULL,
	"year" integer,
	"university" text
);
--> statement-breakpoint
ALTER TABLE "nmc_register" ADD CONSTRAINT "nmc_register_specialty_key_specialties_key_fk" FOREIGN KEY ("specialty_key") REFERENCES "public"."specialties"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nmc_register" ADD CONSTRAINT "nmc_register_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "nmc_register_council_number_idx" ON "nmc_register" USING btree ("council_normalized","number_normalized");--> statement-breakpoint
CREATE INDEX "nmc_register_number_idx" ON "nmc_register" USING btree ("number_normalized");--> statement-breakpoint
CREATE INDEX "nmc_register_category_idx" ON "nmc_register" USING btree ("category","council_code","era_year");--> statement-breakpoint
CREATE INDEX "nmc_register_doctor_idx" ON "nmc_register" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "nmc_register_research_idx" ON "nmc_register" USING btree ("research_status");--> statement-breakpoint
CREATE INDEX "nmc_register_name_sorted_idx" ON "nmc_register" USING btree ("name_sorted");--> statement-breakpoint
CREATE INDEX "nmc_register_name_tokens_idx" ON "nmc_register" USING gin ("name_tokens");--> statement-breakpoint
CREATE INDEX "nmc_register_quals_record_idx" ON "nmc_register_qualifications" USING btree ("source_record_id");