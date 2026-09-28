import assert from "node:assert/strict";
import { test } from "node:test";

import { claimLink, claimSource } from "../../lib/claim-source";
import { badgeSnippet, badgeSvg, BADGE_H, BADGE_W } from "../../lib/tdi/badge";
import { sameName } from "../../scripts/merge-duplicate-registrations";

test("claim source keeps short lowercase tags and drops anything else", () => {
  assert.equal(claimSource("LinkedIn"), "linkedin");
  assert.equal(claimSource(" whatsapp "), "whatsapp");
  assert.equal(claimSource("a".repeat(33)), null);
  assert.equal(claimSource("<script>"), null);
  assert.equal(claimSource(["email"]), null);
  assert.equal(claimSource(undefined), null);
});

test("claim link carries the profile and a valid tag only", () => {
  assert.equal(claimLink("asha-rao-1a2b3c", "hospital"), "/claim-profile?profile=asha-rao-1a2b3c&src=hospital");
  assert.equal(claimLink("asha-rao-1a2b3c", "bad tag!"), "/claim-profile?profile=asha-rao-1a2b3c");
});

test("badge only says verified in the verified state", () => {
  assert.match(badgeSvg("verified"), /Registration verified/);
  assert.doesNotMatch(badgeSvg("listed"), /verified/i);
  assert.match(badgeSvg("listed"), new RegExp(`width="${BADGE_W}" height="${BADGE_H}"`));
});

test("badge snippet links the canonical profile and escapes the name", () => {
  const html = badgeSnippet({ origin: "https://www.thedoctorindex.com", slug: "a-b-123", tdiId: "TDI-CAR-00001", name: 'Dr "A" <B>', state: "verified" });
  assert.match(html, /^<a href="https:\/\/www\.thedoctorindex\.com\/doctor\/a-b-123"/);
  assert.match(html, /src="https:\/\/www\.thedoctorindex\.com\/d\/TDI-CAR-00001\/badge"/);
  assert.match(html, /Dr &quot;A&quot; &lt;B&gt; — registration verified/);
  assert.doesNotMatch(html, /<B>/);
});

test("duplicate matching needs every token of the shorter name", () => {
  assert.equal(sameName("Smita B Kalappa", "Smita Kalappa"), true);
  assert.equal(sameName("Kulkarni Abhijit.Vilas", "Abhijit Vilas Kulkarni"), true);
  assert.equal(sameName("Gandhi Vinod Kumar", "Gandhi Virendra Kumar"), false);
  assert.equal(sameName("Nalini K S", "Nalini K S"), false, "one real token is too thin to merge on");
  assert.equal(sameName("Sanjay Simlot", "Anjum Quasim"), false);
});
