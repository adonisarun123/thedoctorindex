import assert from "node:assert/strict";
import { test } from "node:test";

import { applyOverride, overrideMap, type OverrideMap } from "../../lib/seo/override";
import type { GateResult } from "../../lib/seo/gates";

const gate = (indexable: boolean): GateResult => ({ indexable, checks: [{ label: "Inventory", pass: indexable, detail: "n doctors" }] });

test("an override flips the decision and says so in the checks", () => {
  const map: OverrideMap = new Map([
    ["/doctors/karnataka/bengaluru/cardiologists", "force_index"],
    ["/doctors/karnataka/bengaluru/dermatologists", "force_noindex"],
  ]);

  const forcedIn = applyOverride("/doctors/karnataka/bengaluru/cardiologists", gate(false), map);
  assert.equal(forcedIn.indexable, true);
  assert.equal(forcedIn.checks.length, 2);
  assert.equal(forcedIn.checks[1].label, "Staff override");
  assert.equal(forcedIn.checks[1].pass, true);

  const forcedOut = applyOverride("/doctors/karnataka/bengaluru/dermatologists", gate(true), map);
  assert.equal(forcedOut.indexable, false);
  assert.match(forcedOut.checks[1].detail, /Forced out of the index/);

  // An untouched path keeps the computed gate, object and all.
  const untouched = gate(true);
  assert.equal(applyOverride("/doctors/karnataka/bengaluru/paediatricians", untouched, map), untouched);
});

test("the override map degrades to empty rather than failing the caller", async () => {
  // No DATABASE_URL in the test environment: the map is empty and resolves
  // without touching a database, which is what lets the sitemap decide tens of
  // thousands of paths from one lookup instead of one query per path.
  const before = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    const map = await overrideMap();
    assert.equal(map.size, 0);
    assert.equal(applyOverride("/anything", gate(true), map).indexable, true);
  } finally {
    if (before !== undefined) process.env.DATABASE_URL = before;
  }
});
