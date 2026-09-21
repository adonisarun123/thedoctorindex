import assert from "node:assert/strict";
import { test } from "node:test";

import { SPECIALTIES } from "../../lib/data/specialties";
import { specialtyLd } from "../../lib/seo/structured-data";
import type { Specialty } from "../../lib/types";

const all = Object.values(SPECIALTIES) as Specialty[];

/**
 * Guidance guards.
 *
 * Until 21 Sep 2026, 39 of the 43 specialities carried `guide: ""` and their
 * hub and listing pages fell back to "guidance is being written". The copy now
 * exists for all 43. What must never come with it is a *review* claim nobody
 * made: `reviewedOn` is a separate assertion, set only where a named clinician
 * signed the text off, and every "medically reviewed" surface is guarded on it.
 * Same defect class as the guessed gender and the em-dash registration number.
 */

test("every speciality carries original orientation copy", () => {
  for (const s of all) {
    assert.ok(s.guide.trim().length > 120, `${s.key}: guide is missing or too short to be orientation`);
  }
});

test("guidance is written per speciality, never copied between them", () => {
  const seen = new Map<string, string>();
  for (const s of all) {
    const prior = seen.get(s.guide);
    assert.equal(prior, undefined, `${s.key} reuses the guide written for ${prior}`);
    seen.set(s.guide, s.key);
  }
  const bullets = new Map<string, string>();
  for (const s of all) {
    for (const w of s.when) {
      const prior = bullets.get(w);
      assert.equal(prior, undefined, `${s.key} reuses the bullet "${w}" from ${prior}`);
      bullets.set(w, s.key);
    }
  }
});

test("guidance names its own speciality rather than a swapped noun", () => {
  for (const s of all) {
    const words = [s.name, s.plural, s.one, s.aOne.replace(/^an? /, "")]
      .map((w) => w.toLowerCase())
      .flatMap((w) => [w, w.replace(/s$/, "")]);
    const hay = `${s.guide} ${s.when.join(" ")}`.toLowerCase();
    assert.ok(
      words.some((w) => w.length > 3 && hay.includes(w)) ||
        s.department.toLowerCase().split(" ").some((w) => w.length > 4 && hay.includes(w)),
      `${s.key}: guidance never names the speciality it is about`,
    );
  }
});

test("a review date is only ever set alongside guidance", () => {
  for (const s of all) {
    if (s.reviewedOn) assert.ok(s.guide.trim().length > 0, `${s.key}: reviewedOn set with no guidance to review`);
  }
});

test("lastReviewed is omitted for specialities no clinician has reviewed", () => {
  const unreviewed = all.find((s) => !s.reviewedOn);
  assert.ok(unreviewed, "expected at least one speciality with no review claim");
  const ld = specialtyLd(unreviewed!, 5, []) as Record<string, unknown>;
  assert.equal("lastReviewed" in ld, false, `${unreviewed!.key}: markup asserts a review that never happened`);

  const reviewed = all.find((s) => s.reviewedOn);
  assert.ok(reviewed, "expected at least one reviewed speciality");
  const reviewedLd = specialtyLd(reviewed!, 5, []) as Record<string, unknown>;
  assert.ok("lastReviewed" in reviewedLd, `${reviewed!.key}: a real review date is missing from the markup`);
});

test("when-bullets are either absent or a usable list", () => {
  for (const s of all) {
    assert.ok(s.when.length === 0 || s.when.length >= 4, `${s.key}: ${s.when.length} bullets is neither empty nor a list`);
    for (const w of s.when) assert.ok(w.trim().length > 10, `${s.key}: bullet "${w}" is too short to mean anything`);
  }
});
