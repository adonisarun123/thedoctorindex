import assert from "node:assert/strict";
import { test } from "node:test";

import { firstNameLabel, pseudonym, publicAuthorLabel } from "@/lib/reviews/author-label";
import { bookingProvesVisit, inviteDue, reviewInviteEmail } from "@/lib/reviews/invite";
import { sameSourceBurst } from "@/lib/reviews/burst";

test("public label defaults to first name + surname initial", () => {
  assert.equal(firstNameLabel("Anita Sharma"), "Anita S.");
  assert.equal(firstNameLabel("anita"), "Anita");
  assert.equal(firstNameLabel("Dr. Ravi Kumar Joshi"), "Ravi J.");
  assert.equal(firstNameLabel("anita.sharma92@gmail.com"), "Anita S.");
  assert.equal(firstNameLabel("+919845860005"), "Reviewer");
});

test("hidden name falls back to the pseudonym", () => {
  assert.equal(pseudonym("Anita Sharma"), "Reviewer A.S.");
  assert.equal(publicAuthorLabel("Anita Sharma", true), "Reviewer A.S.");
  assert.equal(publicAuthorLabel("Anita Sharma", false), "Anita S.");
  assert.equal(pseudonym(""), "Reviewer A.");
});

test("invite window: 2 hours to 7 days after the slot, once, confirmed or completed only", () => {
  const now = new Date("2026-10-13T10:00:00+05:30");
  const h = (n: number) => new Date(now.getTime() - n * 3_600_000);
  assert.equal(inviteDue({ status: "confirmed", endsAt: h(3), reviewInviteSentAt: null }, now), true);
  assert.equal(inviteDue({ status: "completed", endsAt: h(3), reviewInviteSentAt: null }, now), true);
  assert.equal(inviteDue({ status: "confirmed", endsAt: h(1), reviewInviteSentAt: null }, now), false, "too soon");
  assert.equal(inviteDue({ status: "confirmed", endsAt: h(24 * 8), reviewInviteSentAt: null }, now), false, "too old");
  assert.equal(inviteDue({ status: "confirmed", endsAt: h(3), reviewInviteSentAt: h(1) }, now), false, "already sent");
  for (const status of ["requested", "declined", "cancelled", "no_show"]) assert.equal(inviteDue({ status, endsAt: h(3), reviewInviteSentAt: null }, now), false, status);
});

test("a booking proves a visit only once the slot has passed", () => {
  const now = new Date("2026-10-13T10:00:00+05:30");
  assert.equal(bookingProvesVisit({ status: "confirmed", endsAt: new Date(now.getTime() - 1000) }, now), true);
  assert.equal(bookingProvesVisit({ status: "confirmed", endsAt: new Date(now.getTime() + 1000) }, now), false);
  assert.equal(bookingProvesVisit({ status: "no_show", endsAt: new Date(now.getTime() - 1000) }, now), false);
});

test("invite email names the booking, the badge and the no-reward rule", () => {
  const m = reviewInviteEmail({ ref: "TDI-BK-7K3M9Q", doctorName: "Dr Naveen Kumar", when: "Tue 7 Oct", patientName: "Anita Sharma", reviewUrl: "https://x/doctor/a/review?booking=TDI-BK-7K3M9Q", siteName: "The Doctor Index", siteUrl: "https://x" });
  assert.equal(m.subject, "How was your visit with Dr Naveen Kumar?");
  assert.match(m.text, /^Hi Anita,/);
  assert.match(m.text, /TDI-BK-7K3M9Q/);
  assert.match(m.text, /Verified visit/);
  assert.match(m.text, /no one is offered anything/);
  assert.doesNotMatch(m.text, /diagnos(is|ed) was/);
});

test("same-source burst: 3+ reviews for one doctor from one IP in a day is a hold", () => {
  assert.equal(sameSourceBurst(2), false);
  assert.equal(sameSourceBurst(3), true);
});
