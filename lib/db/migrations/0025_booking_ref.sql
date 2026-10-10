ALTER TABLE "appointments" ADD COLUMN "ref" text;--> statement-breakpoint
-- Backfill existing appointments with references in the same format as lib/booking/ref.ts.
-- The WHERE on the outer row makes the subquery run per row (one fresh reference each).
UPDATE "appointments" a SET "ref" = 'TDI-BK-' || (
  SELECT string_agg(substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 1 + floor(random() * 31)::int, 1), '')
  FROM generate_series(1, 6) WHERE a.id IS NOT NULL
) WHERE "ref" IS NULL;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "ref" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "appointments_ref_uq" ON "appointments" USING btree ("ref");
