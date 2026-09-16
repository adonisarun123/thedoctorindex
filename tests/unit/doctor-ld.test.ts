import assert from "node:assert/strict";
import { test } from "node:test";

import { SEED_DOCTORS } from "../../lib/data/doctors";
import { doctorLd } from "../../lib/seo/structured-data";
import type { DoctorView } from "../../lib/types";

/**
 * Regression guards for claims the markup must never make up. Before 16 Sep
 * 2026 every record without a gender on file (24,440 of 24,445) was published
 * as `gender: Female`, and every record without a council registration number
 * (17,201) carried an `identifier` whose value was the display em dash.
 */
const base = { ...SEED_DOCTORS.find((d) => d.status === "active")!, slug: "seed-doctor" } as unknown as DoctorView;

const mainEntity = (d: DoctorView) => (doctorLd(d) as { mainEntity: Record<string, unknown> }).mainEntity;

test("gender is omitted rather than guessed when none is on record", () => {
  assert.equal(mainEntity({ ...base, gender: "F" }).gender, "Female");
  assert.equal(mainEntity({ ...base, gender: "M" }).gender, "Male");
  assert.ok(!("gender" in mainEntity({ ...base, gender: null })), "no gender key when unknown");
});

test("a registration identifier is emitted only for a real number", () => {
  const withNumber = mainEntity({ ...base, registration: { ...base.registration, number: "KMC/12345", council: "Karnataka Medical Council" } });
  assert.equal((withNumber.identifier as { value: string }).value, "KMC/12345");

  for (const number of ["", "—"]) {
    const none = mainEntity({ ...base, registration: { ...base.registration, number } });
    assert.ok(!("identifier" in none), `no identifier for number ${JSON.stringify(number)}`);
  }
});

test("hasCredential is dropped rather than emitted empty", () => {
  const unverified = mainEntity({ ...base, qualifications: base.qualifications.map((q) => ({ ...q, state: "submitted" as const })) });
  assert.ok(!("hasCredential" in unverified));
  const verified = mainEntity({ ...base, qualifications: base.qualifications.map((q) => ({ ...q, state: "verified" as const })) });
  assert.ok(Array.isArray(verified.hasCredential) && (verified.hasCredential as unknown[]).length > 0);
});
