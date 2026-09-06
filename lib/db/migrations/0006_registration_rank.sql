-- Listings sort by registration tier first (lib/data/db-source.ts REGISTRATION_TIER);
-- the correlated lookup needs an index on the doctor.
CREATE INDEX IF NOT EXISTS "medical_registrations_doctor_idx" ON "medical_registrations" ("doctor_id");
