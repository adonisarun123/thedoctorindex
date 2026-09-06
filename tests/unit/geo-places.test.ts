import assert from "node:assert/strict";
import { test } from "node:test";

import { placeName, placeSlug } from "../../lib/geo-names";
import { localityKeyFor } from "../../lib/services/places-pure";

test("place names normalise to title case and stable slugs", () => {
  assert.equal(placeName("INDORE"), "Indore");
  assert.equal(placeName("kamrup metropolitan"), "Kamrup Metropolitan");
  assert.equal(placeName("ANDAMAN AND NICOBAR"), "Andaman and Nicobar");
  assert.equal(placeSlug("Vijay Nagar"), "vijay-nagar");
  assert.equal(placeSlug("Sector-52 (Phase II)"), "sector-52-phase-ii");
  assert.equal(placeSlug("  Napier Town  "), "napier-town");
});

test("locality keys are unique across cities and legacy keys survive", () => {
  assert.equal(localityKeyFor("indore", "vijay-nagar"), "indore-vijay-nagar");
  assert.equal(localityKeyFor("indore", "indore"), "indore");
});
