import assert from "node:assert/strict";
import { test } from "node:test";

import { normalizeKey, slugify } from "../../lib/services/doctors";

test("slugify keeps letters and digits, appends the public id", () => {
  assert.equal(slugify("Dr. Anita Sharma", "d8f4c2"), "dr-anita-sharma-d8f4c2");
  assert.equal(slugify("E2E Testdoctor", "a1b2c3"), "e2e-testdoctor-a1b2c3");
  assert.equal(slugify("   ", "a1b2c3"), "doctor-a1b2c3");
});

test("normalizeKey strips punctuation and case for registration matching", () => {
  assert.equal(normalizeKey("kmc-58 412"), normalizeKey("KMC58412"));
});
