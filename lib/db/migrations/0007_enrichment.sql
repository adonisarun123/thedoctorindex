-- Enrichment state per doctor (NMC register match, Google Places match). See scripts/enrich.ts.
CREATE TABLE IF NOT EXISTS "doctor_enrichment" (
  "doctor_id" uuid PRIMARY KEY REFERENCES "doctors"("id") ON DELETE CASCADE,
  "nmc_status" text NOT NULL DEFAULT 'pending',
  "nmc_candidates" jsonb,
  "nmc_query" text,
  "nmc_checked_at" timestamptz,
  "google_status" text NOT NULL DEFAULT 'pending',
  "google_place_id" text,
  "google_maps_uri" text,
  "google_name" text,
  "google_address" text,
  "google_phone" text,
  "google_website" text,
  "google_address_match" boolean,
  "google_score" integer,
  "google_checked_at" timestamptz,
  "attempts" integer NOT NULL DEFAULT 0,
  "last_error" text,
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "doctor_enrichment_nmc_idx" ON "doctor_enrichment" ("nmc_status");
CREATE INDEX IF NOT EXISTS "doctor_enrichment_google_idx" ON "doctor_enrichment" ("google_status");
