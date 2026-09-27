import assert from "node:assert/strict";
import { test } from "node:test";

import { SEED_DOCTORS } from "../../lib/data/doctors";
import { GATES, hasFacetParams, isProfileIndexable, isProfilePublishable, isProfileSubstantive, isProfileVerified, listingGate, listingPageParam, profileGate } from "../../lib/seo/gates";
import type { Doctor } from "../../lib/types";

test("listing gate thresholds", () => {
  assert.equal(listingGate("city", GATES.citySpecialty, true).indexable, true);
  assert.equal(listingGate("city", GATES.citySpecialty - 1, true).indexable, false);
  assert.equal(listingGate("locality", GATES.localitySpecialty, true).indexable, true);
  assert.equal(listingGate("national", GATES.nationalSpecialty - 1, true).indexable, false);
});

test("any facet, sort, query or near parameter makes a view noindex; page does not", () => {
  assert.equal(hasFacetParams({}), false);
  assert.equal(hasFacetParams({ sort: "reviews" }), true);
  assert.equal(hasFacetParams({ near: "1,2" }), true);
  assert.equal(hasFacetParams({ locality: "" }), false);
  assert.equal(hasFacetParams({ utm_source: "x" }), false);
  assert.equal(hasFacetParams({ page: "2" }), false);
});

test("listing ?page= is read strictly: bare, 2..9999, explicit 1 redirects, anything else 404s", () => {
  assert.equal(listingPageParam({}), 1);
  assert.equal(listingPageParam({ page: "2" }), 2);
  assert.equal(listingPageParam({ page: "17" }), 17);
  assert.equal(listingPageParam({ page: "1" }), "first");
  for (const bad of ["0", "-1", "abc", "2.5", "02", "", "99999"]) assert.equal(listingPageParam({ page: bad }), null, bad);
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
  assert.ok(g.checks[1].label.startsWith("Substantive"));
  assert.ok(g.checks.slice(2).every((c) => c.label.endsWith("(shown, not required)")));
  assert.equal(g.checks.slice(2).some((c) => !c.pass), true);
  assert.equal(profileGate({ ...unverified, practices: [] }).indexable, false);
});

test("in all mode a thin profile (no claim, photo, bio or quality) is live but not indexed", () => {
  const thin = { ...unverified, claimed: false, about: "", photoUrl: null };
  assert.equal(isProfileSubstantive(thin), false);
  assert.equal(isProfileIndexable(thin), false);
  assert.equal(profileGate(thin).indexable, false);
  assert.equal(isProfilePublishable(thin), true, "still a page, just noindex");
  assert.equal(isProfileIndexable({ ...thin, photoUrl: "/photos/x" }), true);
  assert.equal(isProfileIndexable({ ...thin, claimed: true }), true);
  assert.equal(isProfileIndexable({ ...thin, about: "x".repeat(201) }), true);
  assert.equal(isProfileIndexable({ ...thin, about: "x".repeat(200) }), false, "200 chars is the template line, not a bio");
});
