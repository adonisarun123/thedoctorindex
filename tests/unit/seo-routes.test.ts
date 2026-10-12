import assert from "node:assert/strict";
import { test } from "node:test";

import { buildSeoRoutes } from "../../lib/seo/routes";

const gates = { national: 3, city: 2, locality: 3 };
const specialties = [
  { key: "cardiology", slug: "cardiologists" },
  { key: "dermatology", slug: "dermatologists" },
];
const localities = [
  { key: "ka-blr-hsr", slug: "hsr-layout", citySlug: "bengaluru", stateSlug: "karnataka" },
  { key: "ka-blr-kor", slug: "koramangala", citySlug: "bengaluru", stateSlug: "karnataka" },
  { key: "ts-hyd-jub", slug: "jubilee-hills", citySlug: "hyderabad", stateSlug: "telangana" },
];

test("every level is counted on its own and gated on its own threshold", () => {
  const rows = buildSeoRoutes(
    {
      national: { cardiology: 7, dermatology: 1 },
      city: [
        { stateSlug: "karnataka", citySlug: "bengaluru", specialty: "cardiology", n: 4 },
        { stateSlug: "telangana", citySlug: "hyderabad", specialty: "cardiology", n: 3 },
        { stateSlug: "telangana", citySlug: "hyderabad", specialty: "dermatology", n: 1 },
      ],
      locality: [
        // One cardiologist practises in both HSR and Koramangala: 3 + 2 on the
        // locality rows, 4 distinct on the city row. That is what the pages show.
        { stateSlug: "karnataka", citySlug: "bengaluru", localityKey: "ka-blr-hsr", specialty: "cardiology", n: 3 },
        { stateSlug: "karnataka", citySlug: "bengaluru", localityKey: "ka-blr-kor", specialty: "cardiology", n: 2 },
        { stateSlug: "telangana", citySlug: "hyderabad", localityKey: "ts-hyd-jub", specialty: "cardiology", n: 3 },
        { stateSlug: "telangana", citySlug: "hyderabad", localityKey: "ts-hyd-jub", specialty: "dermatology", n: 1 },
      ],
    },
    specialties,
    localities,
    gates,
  );
  const byPath = new Map(rows.map((r) => [r.path, r]));

  // National: both specialities listed, only the one at the gate indexes.
  assert.equal(byPath.get("/specialties/cardiology")?.computedIndexable, true);
  assert.equal(byPath.get("/specialties/dermatology")?.indexableCount, 1);
  assert.equal(byPath.get("/specialties/dermatology")?.computedIndexable, false);

  // City rows carry the distinct count, not the sum of localities.
  assert.equal(byPath.get("/doctors/karnataka/bengaluru/cardiologists")?.indexableCount, 4);
  assert.equal(byPath.get("/doctors/telangana/hyderabad/cardiologists")?.computedIndexable, true);
  assert.equal(byPath.get("/doctors/telangana/hyderabad/dermatologists")?.computedIndexable, false);

  // Locality rows use the locality's URL slug and the locality gate.
  assert.equal(byPath.get("/doctors/karnataka/bengaluru/hsr-layout/cardiologists")?.computedIndexable, true);
  assert.equal(byPath.get("/doctors/karnataka/bengaluru/koramangala/cardiologists")?.computedIndexable, false);
  assert.equal(byPath.get("/doctors/karnataka/bengaluru/koramangala/cardiologists")?.localityKey, "ka-blr-kor");
  assert.equal(rows.length, 2 + 3 + 4);
});

test("unknown specialities, unknown localities and geography mismatches produce no route", () => {
  const rows = buildSeoRoutes(
    {
      national: { cardiology: 2, surgery: 9 },
      city: [{ stateSlug: "karnataka", citySlug: "bengaluru", specialty: "surgery", n: 9 }],
      locality: [
        { stateSlug: "karnataka", citySlug: "bengaluru", localityKey: "nope", specialty: "cardiology", n: 5 },
        // Locality filed under Hyderabad but the facility row says Bengaluru: skipped, like the sitemap.
        { stateSlug: "karnataka", citySlug: "bengaluru", localityKey: "ts-hyd-jub", specialty: "cardiology", n: 5 },
        { stateSlug: "karnataka", citySlug: "bengaluru", localityKey: "ka-blr-hsr", specialty: "cardiology", n: 0 },
      ],
    },
    specialties,
    localities,
    gates,
  );
  assert.deepEqual(rows.map((r) => r.path).sort(), ["/specialties/cardiology", "/specialties/dermatology"]);
});

test("a path is emitted once even if the counts repeat it", () => {
  const rows = buildSeoRoutes(
    {
      national: {},
      city: [
        { stateSlug: "karnataka", citySlug: "bengaluru", specialty: "cardiology", n: 2 },
        { stateSlug: "karnataka", citySlug: "bengaluru", specialty: "cardiology", n: 2 },
      ],
      locality: [],
    },
    specialties,
    localities,
    gates,
  );
  assert.equal(rows.filter((r) => r.kind === "city").length, 1);
});

test("a city-wide locality is recognised by slug or by name", async () => {
  const { isCitywideLocality } = await import("../../lib/geo-names");
  assert.equal(isCitywideLocality({ slug: "indore", name: "Indore", citySlug: "indore", city: "Indore" }), true);
  assert.equal(isCitywideLocality({ slug: "central", name: " indore ", citySlug: "indore", city: "Indore" }), true);
  assert.equal(isCitywideLocality({ slug: "vijay-nagar", name: "Vijay Nagar", citySlug: "indore", city: "Indore" }), false);
});
