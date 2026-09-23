import assert from "node:assert/strict";
import { test } from "node:test";

import { normalizeLanguages } from "../../lib/data/languages";

test("drops scraper debris, keeps the languages around it", () => {
  assert.deepEqual(
    normalizeLanguages(["English", "Kannada", "&times;", "× -->", "Personal Attention.", "Know More", "Continue", "FAQ's"]),
    ["English", "Kannada"],
  );
});

test("drops scraped review text and reviewer names", () => {
  assert.deepEqual(
    normalizeLanguages(["English", "Google Reviews", "3 Google", "2 months ago", "chandan patra", "Best pediatrician"]),
    ["English"],
  );
});

test("folds misspellings and case to one spelling, without duplicates", () => {
  assert.deepEqual(normalizeLanguages(["Telegu", "telugu", "Kanada", "kannada", "Bangla", "Bengali", "Odiya"]), ["Telugu", "Kannada", "Bengali", "Odia"]);
});

test("splits compound values and strips suffixes", () => {
  assert.deepEqual(normalizeLanguages(["English, Hindi", "Tulu & Bengali", "English &amp; Hindi", "and Marathi.", "Telugu- Spoken"]), ["English", "Hindi", "Tulu", "Bengali", "Marathi", "Telugu"]);
});

test("the 'Languages Spoken' heading repeated into the list is not a language", () => {
  assert.deepEqual(normalizeLanguages(["Hindi", "Languages Spoken", "Hindi"]), ["Hindi"]);
});
