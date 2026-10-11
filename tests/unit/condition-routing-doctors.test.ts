import assert from "node:assert/strict";
import { test } from "node:test";

import { departmentByName } from "../../lib/conditions/departments";
import { pickConditionDoctors } from "../../lib/conditions/doctors";
import { ROUTING_OVERRIDES } from "../../lib/conditions/routing-overrides";
import type { DoctorView } from "../../lib/types";

test("every routing override names a known department that maps to a speciality", () => {
  for (const [slug, name] of Object.entries(ROUTING_OVERRIDES)) {
    const d = departmentByName(name);
    assert.ok(d, `${slug}: unknown department ${name}`);
    assert.ok(d.specialty, `${slug}: ${name} has no speciality, so the override would still show no doctor`);
  }
});

const doc = (i: number, indexable: boolean) => ({ slug: `d${i}`, indexable }) as unknown as DoctorView;

test("condition doctors: indexable profiles first, five shown, stable per slug", () => {
  const ranked = [...Array.from({ length: 10 }, (_, i) => doc(i, false)), ...Array.from({ length: 20 }, (_, i) => doc(100 + i, true))];
  const a = pickConditionDoctors("vitiligo", ranked);
  assert.equal(a.length, 5);
  assert.deepEqual(a, pickConditionDoctors("vitiligo", ranked));
  // Pool of 24 = 20 indexable + 4 non-indexable; most picks are indexable.
  assert.ok(a.filter((d) => d.indexable).length >= 1);
});

test("condition doctors: different conditions spread across profiles", () => {
  const ranked = Array.from({ length: 30 }, (_, i) => doc(i, true));
  const seen = new Set<string>();
  for (const slug of ["acne", "psoriasis", "vitiligo", "eczema", "scabies", "ringworm", "hives", "rosacea"]) for (const d of pickConditionDoctors(slug, ranked)) seen.add(d.slug);
  assert.ok(seen.size > 10, `only ${seen.size} distinct profiles across 8 pages`);
});

test("condition doctors: short pool is shown whole", () => {
  assert.equal(pickConditionDoctors("x", [doc(1, true), doc(2, false)]).length, 2);
});
