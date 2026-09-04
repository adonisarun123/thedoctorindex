-- Trigram indexes for typo-tolerant doctor and facility name search (plan §14).
CREATE INDEX IF NOT EXISTS doctors_name_trgm_idx ON doctors USING gin (lower(name) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS facilities_name_trgm_idx ON facilities USING gin (lower(name) gin_trgm_ops);

-- Geography column on facilities, maintained from lat/lng, with a GiST index.
-- Skipped cleanly where PostGIS is unavailable.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
    EXECUTE 'ALTER TABLE facilities ADD COLUMN IF NOT EXISTS geom geography(Point, 4326)';
    EXECUTE $f$
      CREATE OR REPLACE FUNCTION facilities_set_geom() RETURNS trigger AS $t$
      BEGIN
        IF NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
          NEW.geom := ST_SetSRID(ST_MakePoint(NEW.lng::double precision, NEW.lat::double precision), 4326)::geography;
        ELSE
          NEW.geom := NULL;
        END IF;
        RETURN NEW;
      END
      $t$ LANGUAGE plpgsql
    $f$;
    EXECUTE 'DROP TRIGGER IF EXISTS facilities_geom_trg ON facilities';
    EXECUTE 'CREATE TRIGGER facilities_geom_trg BEFORE INSERT OR UPDATE OF lat, lng ON facilities FOR EACH ROW EXECUTE FUNCTION facilities_set_geom()';
    EXECUTE 'CREATE INDEX IF NOT EXISTS facilities_geom_gix ON facilities USING gist (geom)';
  END IF;
END $$;

-- updated_at maintenance on doctors.
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS doctors_updated_at_trg ON doctors;
CREATE TRIGGER doctors_updated_at_trg BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS enquiries_updated_at_trg ON enquiries;
CREATE TRIGGER enquiries_updated_at_trg BEFORE UPDATE ON enquiries FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Rating rollups: computed from published reviews only. A view keeps it
-- correct by construction; materialise later if profile reads need it.
CREATE OR REPLACE VIEW doctor_rating_rollups AS
SELECT
  d.id AS doctor_id,
  COUNT(r.id)::int AS review_count,
  COALESCE(ROUND(AVG((r.communication + r.explanation + r.wait_time + r.facility) / 4.0), 2), 0)::numeric(3,2) AS average,
  COUNT(*) FILTER (WHERE (r.communication + r.explanation + r.wait_time + r.facility) / 4.0 < 1.5)::int AS star1,
  COUNT(*) FILTER (WHERE (r.communication + r.explanation + r.wait_time + r.facility) / 4.0 >= 1.5 AND (r.communication + r.explanation + r.wait_time + r.facility) / 4.0 < 2.5)::int AS star2,
  COUNT(*) FILTER (WHERE (r.communication + r.explanation + r.wait_time + r.facility) / 4.0 >= 2.5 AND (r.communication + r.explanation + r.wait_time + r.facility) / 4.0 < 3.5)::int AS star3,
  COUNT(*) FILTER (WHERE (r.communication + r.explanation + r.wait_time + r.facility) / 4.0 >= 3.5 AND (r.communication + r.explanation + r.wait_time + r.facility) / 4.0 < 4.5)::int AS star4,
  COUNT(*) FILTER (WHERE (r.communication + r.explanation + r.wait_time + r.facility) / 4.0 >= 4.5)::int AS star5,
  COUNT(*) FILTER (WHERE r.evidence = 'checked')::int AS evidence_checked_count
FROM doctors d
LEFT JOIN reviews r ON r.doctor_id = d.id AND r.status IN ('published', 'redacted')
GROUP BY d.id;
