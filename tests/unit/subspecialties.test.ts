import assert from "node:assert/strict";
import { test } from "node:test";

import { cleanSubspecialties } from "../../lib/data/subspecialties";

test("drops system tags and job titles, keeps real subspecialities", () => {
  assert.deepEqual(
    cleanSubspecialties(["Allopathic Medicine", "Allopathic General Medicine", "Senior Consultant", "Joint Replacement", "Trauma Care"], "orthopaedics"),
    ["Joint Replacement", "Trauma Care"],
  );
});

test("any spelling of an allopathic system tag is dropped", () => {
  assert.deepEqual(cleanSubspecialties(["Allopathic General Madicine", "Allpathic General Medicine", "Diabetes Care"], "general-practice"), ["Diabetes Care"]);
});

test("drops the speciality restated in its own or lay words", () => {
  assert.deepEqual(cleanSubspecialties(["Ophthalmology", "Cataract Surgery", "Eye Care"], "ophthalmology"), ["Cataract Surgery"]);
  assert.deepEqual(cleanSubspecialties(["Orthopaedician", "Spine Surgery"], "orthopaedics"), ["Spine Surgery"]);
});

test("case-insensitive de-duplication keeps the first spelling", () => {
  assert.deepEqual(cleanSubspecialties(["Interventional Cardiology", "interventional cardiology"], "cardiology"), ["Interventional Cardiology"]);
});
