import assert from "node:assert/strict";
import { test } from "node:test";

import { editDistance, matchScore, rank } from "../../lib/search/fuzzy";
import { resolveSpecialtyQuery, suggestSpecialties } from "../../lib/data/taxonomy";

test("edit distance counts insert, delete, substitute and transposition as one", () => {
  assert.equal(editDistance("cardiology", "cardiolgy"), 1);
  assert.equal(editDistance("cardiology", "cardioloyg"), 1);
  assert.equal(editDistance("sharma", "sharna"), 1);
  assert.equal(editDistance("abc", "xyz", 1), 2);
});

test("scores prefer exact, then prefix, then word prefix, then typos", () => {
  assert.equal(matchScore("Cardiology", "cardiology"), 100);
  assert.ok(matchScore("cardio", "Cardiology") > matchScore("ology", "Cardiology"));
  assert.ok(matchScore("sharma", "Dr Priya Sharma") >= 80);
  assert.ok(matchScore("cardiolgy", "Cardiology") > 0);
  assert.ok(matchScore("dermatolgist", "Dermatologists") > 0);
  assert.ok(matchScore("bangalor", "Bengaluru") > 0);
  assert.equal(matchScore("ca", "Cardiology") > 0, true);
  assert.equal(matchScore("xa", "Cardiology"), 0);
  assert.equal(matchScore("neuro", "Cardiology"), 0);
});

test("short queries never fan out through typo tolerance", () => {
  assert.equal(matchScore("eye", "Ear"), 0);
  assert.equal(matchScore("ent", "Eye"), 0);
});

test("rank keeps the best match first and drops non-matches", () => {
  const items = ["Cardiology", "Cardiothoracic surgery", "Dermatology", "Neurology"];
  const r = rank("cardiolgy", items, (s) => [s]);
  assert.equal(r[0].item, "Cardiology");
  assert.ok(!r.some((x) => x.item === "Neurology"));
});

test("speciality resolver tolerates typos and patient language", () => {
  assert.equal(resolveSpecialtyQuery("cardiolgist")?.key, "cardiology");
  assert.equal(resolveSpecialtyQuery("skin doctor")?.key, "dermatology");
  assert.equal(resolveSpecialtyQuery("skn doctr")?.key, "dermatology");
  assert.equal(resolveSpecialtyQuery("zzzz"), null);
  assert.equal(suggestSpecialties("dermat")[0]?.item.key, "dermatology");
});
