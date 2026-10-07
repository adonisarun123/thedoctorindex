import assert from "node:assert/strict";
import { test } from "node:test";

import { POSTS, postBySlug, postLinks } from "../../lib/blog";
import {
  POOLS,
  placedSlugs,
  postsForCondition,
  postsForProfile,
  postsForQualification,
  postsForRegister,
  postsForSpecialty,
} from "../../lib/blog/placements";
import { SPECIALTIES } from "../../lib/data/specialties";

/**
 * Inbound links to the blog from the rest of the site.
 *
 * A post that nothing links to is a post a crawler finds only through the
 * /blog index. These tests keep every post reachable from at least one page
 * family outside the blog, and from at least two other posts.
 */

test("every slug in a placement pool is a published post", () => {
  for (const [name, pool] of Object.entries(POOLS)) {
    for (const slug of pool) assert.ok(postBySlug(slug), `pool ${name}: ${slug} is not a published post`);
    assert.equal(new Set(pool).size, pool.length, `pool ${name} lists a post twice`);
  }
});

test("every published post is placed on at least one page family outside the blog", () => {
  const placed = placedSlugs();
  for (const p of POSTS) assert.ok(placed.has(p.slug), `${p.slug} is linked from no page family — add it to a pool`);
});

test("every published post is linked from the body of at least two other posts", () => {
  for (const p of POSTS) {
    const from = POSTS.filter((q) => q.slug !== p.slug && postLinks(q).includes(`/blog/${p.slug}`));
    assert.ok(from.length >= 2, `${p.slug}: only ${from.length} posts link to it in their body`);
  }
});

test("each page family returns a full, distinct block", () => {
  for (const key of Object.keys(SPECIALTIES)) {
    const got = postsForSpecialty(key);
    assert.equal(got.length, 3, `speciality ${key}: block is short`);
    assert.equal(new Set(got.map((p) => p.slug)).size, 3, `speciality ${key}: duplicate post`);
  }
  for (const slug of ["diabetes-type-2", "migraine", "dengue", "a", ""]) {
    const got = postsForCondition(slug);
    assert.equal(new Set(got.map((p) => p.slug)).size, 3, `condition ${slug}: block not full and distinct`);
  }
  for (const slug of ["naveen-kumar-lv-19162b", "x", "nandlal-k-manseta-17aca6"]) {
    const got = postsForProfile(slug);
    assert.equal(new Set(got.map((p) => p.slug)).size, 2, `profile ${slug}: block not full and distinct`);
  }
  assert.equal(postsForRegister().length, 3);
  assert.equal(postsForQualification().length, 3);
});

test("profile rotation spreads links across the whole pool", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 400; i++) postsForProfile(`doctor-${i}`).forEach((p) => seen.add(p.slug));
  assert.equal(seen.size, POOLS.profile.length, "some profile-pool posts are never shown");
});
