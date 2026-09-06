-- India-wide geography and imported records.
ALTER TABLE "localities" ADD COLUMN IF NOT EXISTS "slug" text;--> statement-breakpoint
UPDATE "localities" SET "slug" = "key" WHERE "slug" IS NULL;--> statement-breakpoint
ALTER TABLE "localities" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "localities_city_slug_uq" ON "localities" ("state_slug", "city_slug", "slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "localities_city_idx" ON "localities" ("state_slug", "city_slug");--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "source_ref" text;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "source_url" text;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "doctors_source_ref_uq" ON "doctors" ("source", "source_ref") WHERE "source_ref" IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "doctors_status_quality_idx" ON "doctors" ("status", "quality_score" DESC);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "doctor_practices_facility_idx" ON "doctor_practices" ("facility_id") WHERE "active";
