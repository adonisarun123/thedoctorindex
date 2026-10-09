import assert from "node:assert/strict";
import { test } from "node:test";

import { linkedinDestination, parseUserinfo } from "../../lib/auth/linkedin";
import { doctorDestination, isDoctorNext } from "../../lib/auth/doctor-journey";
import { parseGoogleUserinfo } from "../../lib/auth/google";
import {
  actionUrl,
  composeReminder,
  dueStep,
  matchUrl,
  searchName,
  unsubscribeToken,
  verifyUnsubscribeToken,
  type ReminderCandidate,
} from "../../lib/signup-reminders";

const DAY = 86_400_000;
const NOW = new Date("2026-10-01T04:30:00Z");
const ago = (d: number) => new Date(NOW.getTime() - d * DAY);

function cand(over: Partial<ReminderCandidate> = {}): ReminderCandidate {
  return {
    userId: "11111111-1111-1111-1111-111111111111",
    email: "dr@example.com",
    displayName: null,
    signupFlow: "claim",
    signupNext: "/claim-profile",
    createdAt: ago(2),
    profileCompletedAt: null,
    optedOut: false,
    disabled: false,
    isStaff: false,
    hasDoctorActivity: false,
    sentSteps: [],
    lastSentAt: null,
    ...over,
  };
}

test("step 1 of setup is due a day after signup, not before", () => {
  assert.equal(dueStep(cand({ createdAt: ago(0.5) }), NOW), null);
  assert.deepEqual(dueStep(cand({ createdAt: ago(1.1) }), NOW), { stage: "setup", step: 1 });
});

test("details done but no claim moves to the doctor_profile stage, anchored on completion", () => {
  assert.equal(dueStep(cand({ createdAt: ago(10), profileCompletedAt: ago(0.5) }), NOW), null);
  assert.deepEqual(dueStep(cand({ createdAt: ago(10), profileCompletedAt: ago(1.5) }), NOW), { stage: "doctor_profile", step: 1 });
});

test("anyone with a claim, submission or profile is never reminded", () => {
  assert.equal(dueStep(cand({ createdAt: ago(5), hasDoctorActivity: true }), NOW), null);
});

test("patients, staff, opted-out, disabled and email-less accounts are skipped", () => {
  for (const over of [{ signupFlow: "enquire" }, { signupFlow: "review" }, { signupFlow: "other" }, { isStaff: true }, { optedOut: true }, { disabled: true }, { email: null }]) {
    assert.equal(dueStep(cand({ createdAt: ago(5), ...over }), NOW), null, JSON.stringify(over));
  }
});

test("accounts from before the journey was recorded are treated as doctors", () => {
  assert.deepEqual(dueStep(cand({ signupFlow: null, createdAt: ago(5) }), NOW), { stage: "setup", step: 1 });
});

test("an old signup catches up one step at a time, two days apart, never skipping", () => {
  const old = { createdAt: ago(14) };
  assert.deepEqual(dueStep(cand(old), NOW), { stage: "setup", step: 1 });
  assert.equal(dueStep(cand({ ...old, sentSteps: [1], lastSentAt: ago(1) }), NOW), null);
  assert.deepEqual(dueStep(cand({ ...old, sentSteps: [1], lastSentAt: ago(2.1) }), NOW), { stage: "setup", step: 2 });
  assert.deepEqual(dueStep(cand({ ...old, sentSteps: [1, 2], lastSentAt: ago(3) }), NOW), { stage: "setup", step: 3 });
  assert.equal(dueStep(cand({ ...old, sentSteps: [1, 2, 3], lastSentAt: ago(3) }), NOW), null);
});

test("step 2 waits for day 3 even if step 1 went out long ago", () => {
  assert.equal(dueStep(cand({ createdAt: ago(2.5), sentSteps: [1], lastSentAt: ago(2.4) }), NOW), null);
});

test("a stage older than the cut-off is not started", () => {
  assert.equal(dueStep(cand({ createdAt: ago(60) }), NOW), null);
});

test("links: setup goes through sign-in back to the journey; profile goes to the register search by name", () => {
  const setup = actionUrl("https://thedoctorindex.com", { signupNext: "/add-doctor?src=gads", displayName: null }, "setup", 1);
  assert.match(setup, /^https:\/\/thedoctorindex\.com\/sign-in\?next=%2Fadd-doctor%3Fsrc%3Dgads&utm_source=tdi&utm_medium=email&utm_campaign=signup_setup_1$/);
  const legacy = actionUrl("https://thedoctorindex.com/", { signupNext: null, displayName: null }, "setup", 2);
  assert.ok(legacy.includes("next=%2Fclaim-profile%2Ffind"));
  const evil = actionUrl("https://thedoctorindex.com", { signupNext: "//evil.example", displayName: null }, "setup", 1);
  assert.ok(evil.includes("next=%2Fclaim-profile%2Ffind"));
  const profile = actionUrl("https://thedoctorindex.com", { signupNext: null, displayName: "Dr. Asha  K Rao" }, "doctor_profile", 1);
  assert.ok(profile.startsWith("https://thedoctorindex.com/claim-profile/find?q=Asha+K+Rao&"));
  const oneWord = actionUrl("https://thedoctorindex.com", { signupNext: null, displayName: "Asha" }, "doctor_profile", 1);
  assert.ok(oneWord.startsWith("https://thedoctorindex.com/claim-profile/find?utm_source"));
});

test("searchName drops the title", () => {
  assert.equal(searchName("Dr Ravi Kumar"), "Ravi Kumar");
  assert.equal(searchName("dr. ravi"), "ravi");
  assert.equal(searchName(null), "");
});

test("unsubscribe tokens verify for their own user only", () => {
  const t = unsubscribeToken("u-1", "secret-secret-secret");
  assert.equal(verifyUnsubscribeToken("u-1", t, "secret-secret-secret"), true);
  assert.equal(verifyUnsubscribeToken("u-2", t, "secret-secret-secret"), false);
  assert.equal(verifyUnsubscribeToken("u-1", t, "another-secret-value"), false);
  assert.equal(verifyUnsubscribeToken("u-1", "short", "secret-secret-secret"), false);
});

test("reminder copy carries the link, the unsubscribe link, and says when it is the last one", () => {
  const m1 = composeReminder({ stage: "setup", step: 1, displayName: "Dr Meera Shah", actionUrl: "https://x/a", unsubscribeUrl: "https://x/u" });
  assert.match(m1.text, /^Hello Dr Meera Shah,/);
  const m2 = composeReminder({ stage: "doctor_profile", step: 1, displayName: "dr. vaibhav  bhatia", actionUrl: "https://x/a", unsubscribeUrl: "https://x/u" });
  assert.match(m2.text, /^Hello Dr Vaibhav Bhatia,/);
  assert.ok(m1.text.includes("https://x/a") && m1.text.includes("https://x/u"));
  assert.ok(!m1.text.includes("last reminder"));
  const m3 = composeReminder({ stage: "doctor_profile", step: 3, displayName: null, actionUrl: "https://x/a", unsubscribeUrl: "https://x/u" });
  assert.match(m3.text, /^Hello,/);
  assert.match(m3.subject, /Last reminder/);
  assert.ok(m3.text.includes("This is the last reminder"));
});

test("LinkedIn userinfo: an unverified or missing email never counts as verified", () => {
  assert.equal(parseUserinfo({ sub: "a", email: "X@Y.com" })?.emailVerified, false);
  assert.equal(parseUserinfo({ sub: "a", email: "X@Y.com", email_verified: true })?.email, "x@y.com");
  assert.equal(parseUserinfo({ email: "x@y.com" }), null);
  assert.equal(parseUserinfo({ sub: "a", given_name: "Asha", family_name: "Rao" })?.name, "Asha Rao");
});

test("LinkedIn destination: bare doctor journeys go to the register search with the name", () => {
  assert.equal(linkedinDestination("/add-doctor", "Asha Rao"), "/claim-profile/find?q=Asha%20Rao");
  assert.equal(linkedinDestination("/claim-profile?src=gads", "Dr. Asha Rao"), "/claim-profile/find?q=Asha%20Rao");
  assert.equal(linkedinDestination("/claim-profile?profile=dr-asha-rao", "Asha Rao"), "/claim-profile?profile=dr-asha-rao");
  assert.equal(linkedinDestination("/add-doctor?registration=123&council=KMC", "Asha Rao"), "/add-doctor?registration=123&council=KMC");
  assert.equal(linkedinDestination("/add-doctor", "Asha"), "/claim-profile/find");
  assert.equal(linkedinDestination("/doctor/x/enquire", "Asha Rao"), "/doctor/x/enquire");
});

test("Doctor journey: setup is shortened only for claim, create and dashboard destinations", () => {
  assert.equal(isDoctorNext("/claim-profile?src=gads"), true);
  assert.equal(isDoctorNext("/claim-profile/find?q=Asha%20Rao"), true);
  assert.equal(isDoctorNext("/add-doctor"), true);
  assert.equal(isDoctorNext("/dashboard"), true);
  assert.equal(isDoctorNext("/doctor/x/enquire"), false);
  assert.equal(isDoctorNext("/account"), false);
  // After setup, an OTP signup on a bare claim journey lands on "Is this you?".
  assert.equal(doctorDestination("/claim-profile", "Radhesh R Menon"), "/claim-profile/find?q=Radhesh%20R%20Menon");
  assert.equal(doctorDestination("/claim-profile/find?q=X%20Y", "Asha Rao"), "/claim-profile/find?q=X%20Y");
  assert.equal(doctorDestination("/", "Asha Rao"), "/");
  // Instant onboarding: manual=1 keeps the full form (dental, AYUSH, physio, or the register missed them).
  assert.equal(doctorDestination("/add-doctor?manual=1&src=find", "Asha Rao"), "/add-doctor?manual=1&src=find");
  assert.equal(doctorDestination("/add-doctor?src=ads", "Asha Rao"), "/claim-profile/find?q=Asha%20Rao");
});

test("Google userinfo: an unverified or missing email never counts as verified", () => {
  assert.equal(parseGoogleUserinfo({ sub: "a", email: "X@Gmail.com" })?.emailVerified, false);
  assert.equal(parseGoogleUserinfo({ sub: "a", email: "X@Gmail.com", email_verified: true })?.email, "x@gmail.com");
  assert.equal(parseGoogleUserinfo({ email: "x@gmail.com" }), null);
  assert.equal(parseGoogleUserinfo({ sub: "a", given_name: "Divya", family_name: "M" })?.name, "Divya M");
});

test("Reminder with register matches: leads with the entries and links straight to each", () => {
  const draft = { name: "Radhesh R Menon", council: "Kerala Medical Council", number: "12345", kind: "claim-draft" as const };
  const pub = { name: "Radhesh R Menon", council: "Kerala Medical Council", number: "12345", kind: "claim-published" as const, slug: "dr-radhesh-r-menon" };
  const create = { ...draft, kind: "create" as const };
  const u1 = new URL(matchUrl("https://thedoctorindex.com/", draft, "doctor_profile", 2));
  assert.equal(u1.pathname, "/claim-profile");
  assert.equal(u1.searchParams.get("registration"), "12345");
  assert.equal(u1.searchParams.get("council"), "Kerala Medical Council");
  assert.equal(u1.searchParams.get("src"), "email");
  assert.equal(u1.searchParams.get("utm_campaign"), "signup_doctor_profile_2");
  assert.equal(new URL(matchUrl("https://x", pub, "setup", 1)).searchParams.get("profile"), "dr-radhesh-r-menon");
  assert.equal(new URL(matchUrl("https://x", create, "setup", 1)).pathname, "/add-doctor");

  const m = composeReminder({ stage: "doctor_profile", step: 2, displayName: "Radhesh R Menon", actionUrl: "https://x/find", unsubscribeUrl: "https://x/u", matches: [{ ...draft, url: "https://x/claim1" }] });
  assert.equal(m.subject, "Is this you? Radhesh R Menon, Kerala Medical Council");
  assert.ok(m.text.includes("We think this is you"));
  assert.ok(m.text.includes("Claim this profile: https://x/claim1"));
  assert.ok(m.text.includes("https://x/find") && m.text.includes("https://x/u"));

  const none = composeReminder({ stage: "doctor_profile", step: 2, displayName: "Radhesh R Menon", actionUrl: "https://x/find", unsubscribeUrl: "https://x/u", matches: [] });
  assert.ok(!none.text.includes("We think this is you"));
  assert.ok(none.text.includes("Find your registration: https://x/find"));
});
