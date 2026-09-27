import assert from "node:assert/strict";
import { test } from "node:test";

import { SPECIALTY_CONTENT_KEYS, specialtyContent } from "../../lib/data/specialty-content";
import { SPECIALTY_KEYS } from "../../lib/data/taxonomy";

test("every speciality has long-form content, and every content entry is a live speciality", () => {
  assert.deepEqual([...SPECIALTY_CONTENT_KEYS].sort(), [...SPECIALTY_KEYS].sort());
});

test("speciality content keeps its shape and its honesty rules", () => {
  for (const k of SPECIALTY_KEYS) {
    const c = specialtyContent(k)!;
    assert.equal(c.key, k, k);
    assert.ok(c.overview.length >= 2, `${k} overview`);
    assert.ok(c.faqs.length >= 3, `${k} faqs`);
    assert.ok(c.urgent.length >= 1, `${k} urgent`);
    assert.ok(c.versus.every((v) => v.key !== k && SPECIALTY_KEYS.includes(v.key)), `${k} versus`);
    // No review claim without a named reviewer.
    if (c.reviewedOn) assert.ok(c.reviewedBy, `${k} reviewedOn without reviewedBy`);
    const text = JSON.stringify(c);
    // No doses, prices, percentages or superlatives on unreviewed medical text.
    assert.doesNotMatch(text, /\d\s?(mg|mcg|ml)\b/i, `${k} dose`);
    assert.doesNotMatch(text, /₹|\bRs\.?\s?\d|\d+\s?%/, `${k} price or percentage`);
    // "best treated early" is clinical usage; "the best doctor" is a ranking claim.
    assert.doesNotMatch(text, /\bthe best\b|\bbest (doctor|hospital|clinic|specialist|surgeon|treatment)/i, `${k} superlative`);
    // Warning against cure claims is fine ("a treatment rather than a cure"); making one is not.
    assert.doesNotMatch(text, /\b(can|will|permanently|completely|fully) cure|\bcures (it|the|your)|\bguarantee[sd]? (a |to |results|success)/i, `${k} cure or guarantee claim`);
  }
});
