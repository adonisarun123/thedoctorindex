import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { BLOG_CATEGORIES, CATEGORY_ORDER, POSTS, contents, postBySlug, postLinks, postStrings, relatedTo, wordCount } from "../../lib/blog";
import { DESCRIPTION_MAX, TITLE_MAX, fullTitle } from "../../lib/seo/meta";

/**
 * Editorial minimums, enforced rather than asserted in a style guide.
 *
 * The blog's whole claim is that a post is a substantial piece of work rather
 * than a keyword page. That claim is checkable because bodies are stored as
 * data, so it is checked here: length, questions, headings, meta budgets and
 * every internal link. A post that does not meet the bar fails the test run
 * instead of quietly shipping.
 */

const MIN_WORDS = 1800;

/** Slugs from the sibling editorial modules, read as text: both are .tsx. */
function slugsIn(file: string): string[] {
  const src = readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
  return [...src.matchAll(/^\s*slug: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
}

const GUIDE_SLUGS = new Set([...slugsIn("lib/data/guides.tsx"), ...slugsIn("lib/data/guides-credentials.tsx")]);
const POLICY_SLUGS = new Set(slugsIn("lib/data/policies.tsx"));
const STATIC_ROUTES = new Set([
  "/", "/doctors", "/specialties", "/search", "/about", "/for-doctors",
  "/why-the-doctor-index", "/add-doctor", "/claim-profile", "/health-guides", "/blog",
]);

test("the registry is coherent", () => {
  assert.ok(POSTS.length >= 10, `expected at least 10 posts, found ${POSTS.length}`);
  const slugs = POSTS.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  const queries = POSTS.map((p) => p.targetQuery.toLowerCase());
  assert.equal(new Set(queries).size, queries.length, "two posts target the same query");
  for (const p of POSTS) {
    assert.ok(CATEGORY_ORDER.includes(p.category), `${p.slug}: unknown category`);
    assert.ok(BLOG_CATEGORIES[p.category], `${p.slug}: category not defined`);
  }
  for (const key of CATEGORY_ORDER) {
    assert.ok(POSTS.some((p) => p.category === key), `category ${key} has no posts`);
  }
});

test("every post meets the published length minimum", () => {
  for (const p of POSTS) {
    const n = wordCount(p);
    assert.ok(n >= MIN_WORDS, `${p.slug}: ${n} words, minimum is ${MIN_WORDS}`);
  }
});

test("every post is structured: headings, questions, substantive answers", () => {
  for (const p of POSTS) {
    assert.ok(contents(p).length >= 5, `${p.slug}: only ${contents(p).length} sections`);
    assert.ok(p.faqs.length >= 4, `${p.slug}: only ${p.faqs.length} questions`);
    for (const f of p.faqs) {
      assert.ok(f.q.trim().endsWith("?"), `${p.slug}: question is not a question — ${f.q}`);
      assert.ok(f.a.split(/\s+/).length >= 25, `${p.slug}: answer too thin — ${f.q}`);
    }
    const ids = contents(p).map((c) => c.id);
    assert.equal(new Set(ids).size, ids.length, `${p.slug}: two sections produce the same anchor`);
  }
});

test("titles and standfirsts fit the snippet budgets", () => {
  for (const p of POSTS) {
    const title = p.metaTitle ?? p.title;
    assert.ok(
      fullTitle(title).length <= TITLE_MAX,
      `${p.slug}: title does not fit — "${fullTitle(title)}"`,
    );
    assert.ok(
      p.standfirst.length <= DESCRIPTION_MAX,
      `${p.slug}: standfirst is ${p.standfirst.length} chars, budget is ${DESCRIPTION_MAX}`,
    );
    assert.ok(p.standfirst.length >= 80, `${p.slug}: standfirst is too short to be a useful description`);
  }
});

test("every internal link resolves to a route that exists", () => {
  for (const p of POSTS) {
    for (const href of postLinks(p)) {
      if (!href.startsWith("/")) continue;
      const path = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
      if (STATIC_ROUTES.has(path)) continue;
      const [, head, slug] = path.split("/");
      if (head === "blog") {
        assert.ok(postBySlug(slug), `${p.slug}: links to a post that does not exist — ${path}`);
        assert.notEqual(slug, p.slug, `${p.slug}: links to itself`);
      } else if (head === "health-guides") {
        assert.ok(GUIDE_SLUGS.has(slug), `${p.slug}: links to a guide that does not exist — ${path}`);
      } else if (head === "policies") {
        assert.ok(POLICY_SLUGS.has(slug), `${p.slug}: links to a policy that does not exist — ${path}`);
      } else {
        assert.fail(`${p.slug}: unrecognised internal link — ${path}`);
      }
    }
  }
});

test("every post links out to the directory and to at least two siblings", () => {
  for (const p of POSTS) {
    const links = postLinks(p);
    assert.ok(
      links.some((h) => h === "/doctors" || h.startsWith("/doctors/") || h.startsWith("/specialties")),
      `${p.slug}: never links into the directory`,
    );
    const siblings = new Set(links.filter((h) => h.startsWith("/blog/") || h.startsWith("/health-guides/")));
    assert.ok(siblings.size >= 2, `${p.slug}: only ${siblings.size} editorial links`);
  }
});

test("related posts resolve, exclude the post itself, and are always filled", () => {
  for (const p of POSTS) {
    for (const slug of p.related) {
      assert.ok(postBySlug(slug), `${p.slug}: related post ${slug} does not exist`);
      assert.notEqual(slug, p.slug, `${p.slug}: lists itself as related`);
    }
    const related = relatedTo(p);
    assert.equal(related.length, 3, `${p.slug}: related block is short`);
    assert.ok(!related.some((r) => r.slug === p.slug), `${p.slug}: appears in its own related block`);
  }
});

test("no post claims a medical reviewer or gives clinical instruction", () => {
  // The blog is the non-clinical half of the editorial. If a post starts
  // telling people what to take, it needs a reviewer and does not belong here.
  const banned = /\b(medically reviewed|reviewed by dr|you should take|take (?:this )?(?:tablet|medicine|antibiotic)s? (?:twice|thrice|daily)|the recommended dose)\b/i;
  for (const p of POSTS) {
    for (const s of postStrings(p)) {
      assert.ok(!banned.test(s), `${p.slug}: reads as clinical or claims review — "${s.slice(0, 90)}"`);
    }
  }
});
