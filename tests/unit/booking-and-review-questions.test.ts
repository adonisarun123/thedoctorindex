import assert from "node:assert/strict";
import { test } from "node:test";

import { bookingRequirements, generateSlots, isUnlocked, istDay, istInstant, validateRules, type UnlockFacts } from "../../lib/booking/slots";
import { labelledRatings, overallScore, parseRatings, validateRatings, type ReviewQuestion } from "../../lib/reviews/score";

/* Review questionnaire */

const Q: ReviewQuestion[] = [
  { key: "knowledge", label: "Knowledge", help: "", specialtyKey: null },
  { key: "explanation", label: "Explanation", help: "", specialtyKey: null },
  { key: "hospitality", label: "Courtesy", help: "", specialtyKey: null },
  { key: "hygiene", label: "Hygiene", help: "", specialtyKey: null },
  { key: "dentistry.pain_comfort", label: "Comfort", help: "", specialtyKey: "dentistry" },
];
const form = (o: Record<string, string>) => (k: string) => o[k];

test("parseRatings keeps stars, drops N/A and blanks", () => {
  assert.deepEqual(parseRatings(Q, form({ knowledge: "5", explanation: "na", hospitality: "3", hygiene: "" })), { knowledge: 5, hospitality: 3 });
});

test("parseRatings rejects values outside 1..5", () => {
  assert.throws(() => parseRatings(Q, form({ knowledge: "6" })), /1 to 5/);
  assert.throws(() => parseRatings(Q, form({ knowledge: "0" })), /1 to 5/);
});

test("validateRatings needs 3 core answers; speciality ones never count toward it", () => {
  assert.throws(() => validateRatings(Q, { knowledge: 5, hospitality: 4, "dentistry.pain_comfort": 5 }), /at least 3/);
  assert.doesNotThrow(() => validateRatings(Q, { knowledge: 5, hospitality: 4, hygiene: 2 }));
});

test("validateRatings rejects a question not on this doctor's form", () => {
  assert.throws(() => validateRatings(Q, { knowledge: 5, hospitality: 4, hygiene: 2, "paediatrics.child_comfort": 5 }), /not part of this review form/);
});

test("overallScore is the mean of rated questions only", () => {
  assert.equal(overallScore({ a: 5, b: 4, c: 3 }), 4);
  assert.equal(overallScore({ a: 5, b: 4 }), 4.5);
  assert.equal(overallScore({}), null);
});

test("labelledRatings orders by question order and keeps retired keys", () => {
  const labels = new Map([["knowledge", { label: "Knowledge", sort: 10 }], ["hygiene", { label: "Hygiene", sort: 50 }]]);
  assert.deepEqual(labelledRatings({ hygiene: 4, old_key: 3, knowledge: 5 }, labels).map((r) => r.label), ["Knowledge", "Hygiene", "old_key"]);
});

/* Calendar unlock */

const complete: UnlockFacts = { registrationVerified: true, practices: 1, practicesWithFee: 1, aboutChars: 120, aboutHasSuperlative: false, services: 3, languages: 2, modes: 1 };

test("a complete profile unlocks the calendar", () => {
  assert.equal(isUnlocked(bookingRequirements(complete)), true);
});

test("each missing piece keeps it locked", () => {
  for (const patch of [{ registrationVerified: false }, { practices: 0, practicesWithFee: 0 }, { practicesWithFee: 0 }, { aboutChars: 40 }, { aboutHasSuperlative: true }, { services: 2 }, { languages: 0 }]) {
    assert.equal(isUnlocked(bookingRequirements({ ...complete, ...patch })), false, JSON.stringify(patch));
  }
});

/* Weekly hours */

test("validateRules rejects bad times, short and overlapping sessions", () => {
  const ok = { practiceId: "p", weekday: 1, startTime: "09:00", endTime: "12:00", slotMinutes: 15 };
  assert.doesNotThrow(() => validateRules([ok, { ...ok, startTime: "17:00", endTime: "20:00" }]));
  assert.throws(() => validateRules([{ ...ok, startTime: "9am" }]), /HH:MM/);
  assert.throws(() => validateRules([{ ...ok, endTime: "08:00" }]), /end after/);
  assert.throws(() => validateRules([{ ...ok, endTime: "09:10" }]), /shorter than/);
  assert.throws(() => validateRules([{ ...ok, slotMinutes: 7 }]), /Slot length/);
  // Overlap across two practices on the same day: the doctor cannot be in two places.
  assert.throws(() => validateRules([ok, { ...ok, practiceId: "q", startTime: "11:00", endTime: "13:00" }]), /overlap on Monday/);
});

/* Slots */

test("IST conversion round-trips", () => {
  const at = istInstant("2026-10-05", 9 * 60 + 30); // Mon 5 Oct 09:30 IST
  assert.equal(at.toISOString(), "2026-10-05T04:00:00.000Z");
  assert.deepEqual(istDay(at), { day: "2026-10-05", weekday: 1 });
});

test("generateSlots honours hours, lead time, blocked days and taken slots", () => {
  const now = istInstant("2026-10-05", 8 * 60 + 50); // Monday 08:50 IST
  const rules = [{ practiceId: "p", weekday: 1, startTime: "09:00", endTime: "11:00", slotMinutes: 30 }];
  const taken = [istInstant("2026-10-05", 10 * 60 + 30)];
  const slots = generateSlots({ rules, blockedDays: ["2026-10-12"], taken, now, days: 14 });
  // Today: 09:00 and 09:30 fall inside the 60-minute lead time, 10:30 is taken → only 10:00.
  const today = slots.filter((s) => s.day === "2026-10-05").map((s) => s.time);
  assert.deepEqual(today, ["10:00"]);
  // Next Monday (12 Oct) is blocked; 19 Oct is outside the 14-day window.
  assert.equal(slots.some((s) => s.day === "2026-10-12"), false);
  assert.equal(slots.length, 1);
});

test("generateSlots spans the window across weekdays", () => {
  const now = istInstant("2026-10-04", 20 * 60); // Sunday evening
  const rules = [1, 2, 3, 4, 5].map((weekday) => ({ practiceId: "p", weekday, startTime: "10:00", endTime: "11:00", slotMinutes: 20 }));
  const slots = generateSlots({ rules, blockedDays: [], taken: [], now, days: 7 });
  assert.equal(slots.length, 15); // Mon–Fri × 3
  assert.equal(slots[0].day, "2026-10-05");
  assert.equal(slots[0].time, "10:00");
});
