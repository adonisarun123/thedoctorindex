import assert from "node:assert/strict";
import { test } from "node:test";

import { composeDigest, digestToken, nextSteps, periodKey, verifyDigestToken, type DigestFacts } from "../../lib/doctor-digest";

const base: DigestFacts = {
  displayName: "Dr Ananya Rao", viewsTotal: 120, viewsPrevTotal: 100, actionsTotal: 9, actionsPrevTotal: 9, enquiries: 2, newEnquiries: 1,
  topTerms: ["paediatrician jayanagar"], hasPhoto: false, aboutWords: 10, publications: 0, articles: 0, pendingReviewReplies: 0, hasTdiId: true,
};
const links = { dashboard: "https://x.in/dashboard", profile: "https://x.in/doctor/a", unsubscribe: "https://x.in/u" };

test("next steps: at most three, enquiries first", () => {
  const s = nextSteps(base, links);
  assert.equal(s.length, 3);
  assert.match(s[0], /enquiry/);
  assert.match(s[1], /photograph/);
});

test("digest reports counts and change, and always carries the unsubscribe link", () => {
  const m = composeDigest(base, links, "October 2026");
  assert.equal(m.subject, "Your profile was viewed 120 times — October 2026");
  assert.match(m.text, /up 20 on the 28 days before/);
  assert.match(m.text, /same as the 28 days before/);
  assert.match(m.text, /https:\/\/x\.in\/u$/);
});

test("a month with no views says so", () => {
  const m = composeDigest({ ...base, viewsTotal: 0, viewsPrevTotal: 0 }, links, "October 2026");
  assert.equal(m.subject, "Your Doctor Index profile — October 2026");
  assert.match(m.text, /Nobody opened your profile/);
});

test("period is the India calendar month; tokens verify", () => {
  assert.equal(periodKey(new Date("2026-10-31T19:00:00Z")), "2026-11");
  const t = digestToken("u1", "secret-secret-secret");
  assert.ok(verifyDigestToken("u1", t, "secret-secret-secret"));
  assert.ok(!verifyDigestToken("u2", t, "secret-secret-secret"));
});
