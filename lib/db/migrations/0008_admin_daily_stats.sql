-- One row per day: the stock figures the admin dashboard charts over time.
-- Flows (enquiries, claims, checks per day) are derived from dated columns and
-- need no snapshot; stocks (published, verified, indexable) have no history
-- without one. Written by lib/services/admin-stats.ts from the maintenance job.
CREATE TABLE IF NOT EXISTS "admin_daily_stats" (
  "day" date PRIMARY KEY,
  "published" integer NOT NULL DEFAULT 0,
  "verified" integer NOT NULL DEFAULT 0,
  "indexable" integer NOT NULL DEFAULT 0,
  "claimed" integer NOT NULL DEFAULT 0,
  "registration_verified" integer NOT NULL DEFAULT 0,
  "practice_confirmed" integer NOT NULL DEFAULT 0,
  "nmc_confirmed" integer NOT NULL DEFAULT 0,
  "nmc_pending" integer NOT NULL DEFAULT 0,
  "nmc_queue" integer NOT NULL DEFAULT 0,
  "google_matched" integer NOT NULL DEFAULT 0,
  "seo_routes_indexable" integer NOT NULL DEFAULT 0,
  "queue_open" integer NOT NULL DEFAULT 0,
  "reviews_published" integer NOT NULL DEFAULT 0,
  "doctor_accounts" integer NOT NULL DEFAULT 0,
  "captured_at" timestamptz NOT NULL DEFAULT now()
);
