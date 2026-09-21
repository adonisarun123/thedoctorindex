import assert from "node:assert/strict";
import { test } from "node:test";

import { breadcrumbLd } from "../../lib/seo/structured-data";
import { absoluteUrl, paths } from "../../lib/site";

/**
 * Search Console reported `Missing field "item" (in "itemListElement")` on
 * 17 Sep 2026 for nine URLs: the speciality hubs and every policy page. The
 * cause was a crumb with no path in the middle of the trail, which the old
 * builder silently emitted as a ListItem with a name and no `item`. Google
 * tolerates that only on the final element, and reports it everywhere else.
 * These tests hold the invariant: every ListItem carries an absolute `item`.
 */

type ListItem = { "@type": string; position: number; name: string; item?: string };

function elements(ld: unknown): ListItem[] {
  const list = (ld as { itemListElement: ListItem[] }).itemListElement;
  assert.ok(Array.isArray(list) && list.length > 0, "itemListElement must be a non-empty array");
  return list;
}

test("every ListItem carries an absolute item URL, the current page included", () => {
  const ld = breadcrumbLd([
    { name: "Home", path: paths.home() },
    { name: "Specialities", path: paths.specialties() },
    { name: "General surgery", path: paths.specialty("general-surgery") },
  ]);

  const list = elements(ld);
  assert.equal(list.length, 3);
  list.forEach((el, i) => {
    assert.equal(el["@type"], "ListItem");
    assert.equal(el.position, i + 1);
    assert.ok(el.name, `element ${i + 1} has no name`);
    assert.ok(el.item, `element ${i + 1} has no item`);
    assert.ok(el.item!.startsWith("https://"), `element ${i + 1} item is not absolute: ${el.item}`);
  });
  assert.equal(list[2].item, absoluteUrl("/specialties/general-surgery"));
});

test("a policy page trail is Home then the policy itself, both with URLs", () => {
  const list = elements(
    breadcrumbLd([
      { name: "Home", path: paths.home() },
      { name: "Corrections policy", path: paths.policy("corrections") },
    ]),
  );
  assert.deepEqual(
    list.map((el) => el.item),
    [absoluteUrl("/"), absoluteUrl("/policies/corrections")],
  );
});

test("the speciality index the hub breadcrumb points at is the real route", () => {
  assert.equal(paths.specialties(), "/specialties");
});
