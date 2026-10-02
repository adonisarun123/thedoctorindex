import assert from "node:assert/strict";
import { test } from "node:test";

import { composeInvite, dueSend, hashInviteToken, istDayStart, looksLikeToken, newInviteToken, normalizeEmail } from "../../lib/doctor-invites";

const DAY = 86_400_000;
const NOW = new Date("2026-10-02T08:00:00Z");
const ago = (d: number) => new Date(NOW.getTime() - d * DAY);
const sent = (sends: number, days: number, expiresAt: Date | null = null) => ({ status: "sent", sends, firstSentAt: ago(days), expiresAt });

test("tokens are url-safe, recognisable and hashed", () => {
  const t = newInviteToken();
  assert.ok(looksLikeToken(t));
  assert.equal(hashInviteToken(t), hashInviteToken(t));
  assert.notEqual(hashInviteToken(t), hashInviteToken(newInviteToken()));
  assert.equal(looksLikeToken("../../etc"), false);
});

test("emails are normalised and junk refused", () => {
  assert.equal(normalizeEmail("  Dr.HariKeerthy@Yahoo.in "), "dr.harikeerthy@yahoo.in");
  assert.equal(normalizeEmail("not an email"), null);
  assert.equal(normalizeEmail("a@b"), null);
});

test("reminders fall on day 3 and day 10, then stop", () => {
  assert.equal(dueSend(sent(1, 2), NOW), null);
  assert.equal(dueSend(sent(1, 3), NOW), 2);
  assert.equal(dueSend(sent(2, 9), NOW), null);
  assert.equal(dueSend(sent(2, 10), NOW), 3);
  assert.equal(dueSend(sent(3, 40), NOW), null);
  assert.equal(dueSend({ ...sent(1, 5), status: "opted_out" }, NOW), null);
  assert.equal(dueSend({ ...sent(1, 5), status: "claimed" }, NOW), null);
  assert.equal(dueSend(sent(1, 5, ago(1)), NOW), null, "expired invites get no reminder");
});

test("the daily cap resets at midnight India time", () => {
  assert.equal(istDayStart(new Date("2026-10-02T08:00:00Z")).toISOString(), "2026-10-01T18:30:00.000Z");
  assert.equal(istDayStart(new Date("2026-10-01T19:00:00Z")).toISOString(), "2026-10-01T18:30:00.000Z");
});

test("the invite names the profile, the link and the way out", () => {
  const m = composeInvite(1, { name: "Dr Hari Keerthy", specialty: "Dentistry", practice: "Dental Domain, Electronic City", registration: "Karnataka State Dental Council 22.190-A", profileUrl: "https://x/doctor/h" }, "https://x/invite/T");
  assert.match(m.subject, /ready to claim/);
  assert.match(m.text, /^Hello Dr Hari Keerthy,/);
  assert.match(m.text, /Dental Domain/);
  assert.match(m.text, /https:\/\/x\/invite\/T/);
  assert.match(m.text, /Stop these emails/);
  assert.doesNotMatch(m.text, /22\.190-A/, "the number the recipient must confirm is not handed to them");
  assert.match(composeInvite(3, { name: "Dr A", specialty: null, practice: null, registration: null, profileUrl: "u" }, "l").subject, /Last reminder/);
});

test("an invite's link is stable for its id and secret", async () => {
  const { inviteToken } = await import("../../lib/doctor-invites");
  const a = inviteToken("11111111-1111-1111-1111-111111111111", "secret-one-123456");
  assert.equal(a, inviteToken("11111111-1111-1111-1111-111111111111", "secret-one-123456"));
  assert.notEqual(a, inviteToken("11111111-1111-1111-1111-111111111111", "secret-two-123456"));
  assert.ok(looksLikeToken(a));
});
