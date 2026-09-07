import assert from "node:assert/strict";
import { test } from "node:test";

import { SEED_DOCTORS } from "../../lib/data/doctors";
import { GATES, hasFacetParams, isProfileIndexable, isProfilePublishable, isProfileVerified, listingGate, profileGate } from "../../lib/seo/gates";
import type { Doctor } from "../../lib/types";

test("listing gate thresholds", () => {
  assert.equal(listingGate("city", GATES.citySpecialty, true).indexable, true);
  assert.equal(listingGate("city", GATES.citySpecialty - 1, true).indexable, false);
  assert.equal(listingGate("locality", GATES.localitySpecialty, true).indexable, true);
  assert.equal(listingGate("national", GATES.nationalSpecialty - 1, true).indexable, false);
});

test("any facet, sort, page, query or near parameter makes a view noindex", () => {
  assert.equal(hasFacetParams({}), false);
  assert.equal(hasFacetParams({ sort: "reviews" }), true);
  assert.equal(hasFacetParams({ near: "1,2" }), true);
  assert.equal(hasFacetParams({ locality: "" }), false);
  assert.equal(hasFacetParams({ utm_source: "x" }), false);
});

const seed = SEED_DOCTORS.find((d) => d.status === "active" && d.qualityScore >= GATES.profileQuality)!;
const base = { ...seed, slug: "seed-doctor" } as unknown as Doctor;
const unverified: Doctor = {
  ...base,
  qualityScore: GATES.profileQuality - 30,
  status: "stale",
  registration: { ...base.registration, number: "", checkedOn: "—" },
};

test("profile index mode: all publishes every profile with a practice, verified only verified supply", () => {
  assert.equal(GATES.profileIndexMode, "all", "tests run with the default mode");
  assert.equal(isProfileVerified(base), true);
  assert.equal(isProfileVerified(unverified), false);
  assert.equal(isProfilePublishable(unverified), true);
  assert.equal(isProfileIndexable(unverified), true);
  assert.equal(isProfileIndexable({ ...unverified, practices: [] }), false);
  assert.equal(isProfileIndexable({ ...unverified, status: "retired" }), false);
});

test("profile gate in all mode reports the verification checks without requiring them", () => {
  const g = profileGate(unverified);
  assert.equal(g.indexable, true);
  assert.equal(g.checks[0].label, "Published with a practice");
  assert.ok(g.checks.slice(1).every((c) => c.label.endsWith("(shown, not required)")));
  assert.equal(g.checks.slice(1).some((c) => !c.pass), true);
  assert.equal(profileGate({ ...unverified, practices: [] }).indexable, false);
});
