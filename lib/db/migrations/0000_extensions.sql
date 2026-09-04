-- Extensions the plan requires (§13.1). Neon supports all three.
-- pg_trgm: typo-tolerant name matching and transliteration variants.
-- postgis: geospatial indexes on facility locations.
-- pgcrypto: gen_random_uuid() on older Postgres; harmless on 13+.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS postgis;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'postgis not available on this server; geography column and GiST index will be skipped';
END $$;
