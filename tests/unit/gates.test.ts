import assert from "node:assert/strict";
import { test } from "node:test";

import { GATES, hasFacetParams, listingGate } from "../../lib/seo/gates";

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
