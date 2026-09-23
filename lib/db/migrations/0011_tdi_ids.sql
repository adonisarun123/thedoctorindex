CREATE TABLE "tdi_id_counters" (
	"code" char(3) PRIMARY KEY NOT NULL,
	"last" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "tdi_id" text;--> statement-breakpoint
ALTER TABLE "specialties" ADD COLUMN "tdi_code" char(3);--> statement-breakpoint
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_tdi_id_unique" UNIQUE("tdi_id");--> statement-breakpoint
ALTER TABLE "specialties" ADD CONSTRAINT "specialties_tdi_code_unique" UNIQUE("tdi_code");--> statement-breakpoint
UPDATE "specialties" s SET "tdi_code" = v.code FROM (VALUES
  ('acupuncture','ACU'),
  ('anaesthesiology','ANE'),
  ('audiology','AUD'),
  ('ayush','AYU'),
  ('cardiology','CAR'),
  ('cardiothoracic-surgery','CTS'),
  ('clinical-psychology','CPS'),
  ('cosmetology','COS'),
  ('dentistry','DEN'),
  ('dermatology','DRM'),
  ('diabetology','DIA'),
  ('dietetics','DIE'),
  ('endocrinology','END'),
  ('ent','ENT'),
  ('gastroenterology','GAS'),
  ('general-practice','GPR'),
  ('general-surgery','GSU'),
  ('geriatrics','GER'),
  ('gi-surgery','GIS'),
  ('gynaecology','GYN'),
  ('haematology','HAE'),
  ('internal-medicine','IMD'),
  ('medical-oncology','MON'),
  ('nephrology','NEP'),
  ('neurology','NEU'),
  ('neurosurgery','NSU'),
  ('non-clinical-medicine','NCM'),
  ('occupational-therapy','OCT'),
  ('ophthalmology','OPH'),
  ('orthopaedics','ORT'),
  ('paediatric-surgery','PSU'),
  ('paediatrics','PAE'),
  ('pathology','PAT'),
  ('physiotherapy','PHY'),
  ('plastic-surgery','PLS'),
  ('psychiatry','PSY'),
  ('pulmonology','PUL'),
  ('radiation-oncology','ROC'),
  ('radiology','RAD'),
  ('rheumatology','RHE'),
  ('sexual-medicine','SXM'),
  ('surgical-oncology','SON'),
  ('urology','URO')
) AS v(key, code) WHERE s.key = v.key;--> statement-breakpoint
-- Backfill: every currently published doctor, numbered within its speciality code
-- in publication order (earliest first). Drafts get theirs on publish, via the trigger.
WITH ordered AS (
  SELECT d.id, sp.tdi_code AS code,
         row_number() OVER (PARTITION BY sp.tdi_code ORDER BY d.published_at NULLS LAST, d.created_at, d.id) AS n
  FROM "doctors" d JOIN "specialties" sp ON sp.key = d.specialty_key
  WHERE d.status = 'published' AND d.tdi_id IS NULL AND sp.tdi_code IS NOT NULL
)
UPDATE "doctors" d SET "tdi_id" = 'TDI-' || o.code || '-' || right('0000' || o.n, greatest(5, length(o.n::text)))
FROM ordered o WHERE d.id = o.id;--> statement-breakpoint
INSERT INTO "tdi_id_counters" ("code", "last")
SELECT sp.tdi_code, COALESCE(MAX(substring(d.tdi_id from 9)::int), 0)
FROM "specialties" sp LEFT JOIN "doctors" d ON d.tdi_id LIKE 'TDI-' || sp.tdi_code || '-%'
WHERE sp.tdi_code IS NOT NULL GROUP BY sp.tdi_code
ON CONFLICT ("code") DO UPDATE SET "last" = GREATEST("tdi_id_counters"."last", EXCLUDED."last");--> statement-breakpoint
-- Issue an ID the first time a record is published, whatever wrote the row
-- (app, importer script, or SQL). The counter row lock serialises concurrent issues.
CREATE OR REPLACE FUNCTION assign_tdi_id() RETURNS trigger AS $$
DECLARE c char(3); n integer;
BEGIN
  IF NEW.tdi_id IS NULL AND NEW.status = 'published' THEN
    SELECT tdi_code INTO c FROM specialties WHERE key = NEW.specialty_key;
    IF c IS NULL THEN
      RAISE EXCEPTION 'speciality % has no tdi_code; add it to lib/data/tdi-codes.ts and run db:taxonomy', NEW.specialty_key;
    END IF;
    INSERT INTO tdi_id_counters (code, last) VALUES (c, 1)
      ON CONFLICT (code) DO UPDATE SET last = tdi_id_counters.last + 1
      RETURNING last INTO n;
    NEW.tdi_id := 'TDI-' || c || '-' || right('0000' || n, greatest(5, length(n::text)));
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;--> statement-breakpoint
CREATE TRIGGER doctors_assign_tdi_id BEFORE INSERT OR UPDATE OF status ON "doctors"
  FOR EACH ROW EXECUTE FUNCTION assign_tdi_id();--> statement-breakpoint
-- An issued ID is permanent: it is printed on cards.
CREATE OR REPLACE FUNCTION freeze_tdi_id() RETURNS trigger AS $$
BEGIN
  IF OLD.tdi_id IS NOT NULL AND NEW.tdi_id IS DISTINCT FROM OLD.tdi_id THEN
    RAISE EXCEPTION 'tdi_id % is permanent and cannot be changed', OLD.tdi_id;
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;--> statement-breakpoint
CREATE TRIGGER doctors_freeze_tdi_id BEFORE UPDATE OF tdi_id ON "doctors"
  FOR EACH ROW EXECUTE FUNCTION freeze_tdi_id();
