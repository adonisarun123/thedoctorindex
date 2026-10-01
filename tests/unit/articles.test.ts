import assert from "node:assert/strict";
import { test } from "node:test";

import { articleProblems, normaliseSlug, normaliseSourceUrl, parseArticleBody, registrationLine } from "../../lib/articles/format";

test("slug is lower-case, hyphenated ASCII and accepts a pasted site URL", () => {
  assert.equal(normaliseSlug("  When a Child's Fever Needs a Doctor! "), "when-a-child-s-fever-needs-a-doctor");
  assert.equal(normaliseSlug("https://thedoctorindex.com/articles/Knee-Pain--After-Running"), "knee-pain-after-running");
  assert.equal(normaliseSlug("Café résumé"), "cafe-resume");
});

test("source URL must be an external http(s) link", () => {
  assert.equal(normaliseSourceUrl(""), null);
  assert.equal(normaliseSourceUrl("https://clinic.example/blog/post#top"), "https://clinic.example/blog/post");
  assert.throws(() => normaliseSourceUrl("clinic.example/post"));
  assert.throws(() => normaliseSourceUrl("javascript:alert(1)"));
  assert.throws(() => normaliseSourceUrl("https://www.thedoctorindex.com/articles/x"));
});

test("a draft can be thin; a submission cannot", () => {
  const a = { slug: "fever-in-children", title: "Fever", description: "Short.", body: "Too short.", sourceUrl: null };
  assert.deepEqual(articleProblems(a, { forSubmit: false }), []);
  const p = articleProblems(a, { forSubmit: true });
  assert.ok(p.some((x) => x.includes("title")));
  assert.ok(p.some((x) => x.includes("description")));
  assert.ok(p.some((x) => x.includes("300")));
});

test("a full article passes, and a level-1 heading is refused", () => {
  const body = Array.from({ length: 40 }, () => "This sentence has exactly eight words in it.").join(" ");
  const ok = { slug: "fever-in-children", title: "When a child's fever needs a doctor", description: "What temperature matters, which signs mean go now, and what you can safely do at home first.", body, sourceUrl: null };
  assert.deepEqual(articleProblems(ok, { forSubmit: true }), []);
  assert.ok(articleProblems({ ...ok, body: `# Title\n\n${body}` }, { forSubmit: true }).some((x) => x.includes("##")));
});

test("body parses into headings, paragraphs and lists", () => {
  const blocks = parseArticleBody("Intro line one\ncontinues here.\n\n## Signs\n\n- Rash\n- Stiff neck\n1. Call\n2. Go\n\n### Note\n**Bold** text.");
  assert.deepEqual(blocks, [
    { k: "p", text: "Intro line one continues here." },
    { k: "h2", text: "Signs" },
    { k: "ul", items: ["Rash", "Stiff neck"] },
    { k: "ol", items: ["Call", "Go"] },
    { k: "h3", text: "Note" },
    { k: "p", text: "**Bold** text." },
  ]);
});

test("the printed registration line", () => {
  assert.equal(registrationLine("Karnataka Medical Council", "12345"), "Karnataka Medical Council · 12345");
  assert.equal(registrationLine(null, "12345"), "12345");
  assert.equal(registrationLine("KMC", null), null);
});
