import assert from "node:assert/strict";
import { test } from "node:test";

import { normaliseEmail, patientNotice, practiceNotice } from "../../lib/booking/notice";
import { newBookingRef, normaliseBookingRef, REF_ALPHABET } from "../../lib/booking/ref";

const base = {
  ref: "TDI-BK-7K3M9Q",
  doctorName: "Dr Asha Rao",
  when: "Mon 12 Oct, 10:30 am",
  patientName: "Ravi K",
  patientPhone: "+91 98450 12345",
  forWhom: "self",
  clinicName: "Sunrise Clinic",
  clinicAddress: "27th Main, HSR Layout",
  dashboardUrl: "https://thedoctorindex.in/dashboard/calendar",
  siteName: "The Doctor Index",
  siteUrl: "https://thedoctorindex.in/",
};

test("confirmed notice carries name, mobile, time and clinic", () => {
  const n = practiceNotice({ ...base, event: "confirmed" });
  assert.match(n.subject, /^Appointment confirmed — Mon 12 Oct, 10:30 am, Dr Asha Rao \(TDI-BK-7K3M9Q\)$/);
  for (const bit of ["Booking: TDI-BK-7K3M9Q", "Ravi K", "+91 98450 12345", "Mon 12 Oct, 10:30 am (IST)", "Sunrise Clinic, 27th Main, HSR Layout", "do not forward"]) assert.ok(n.text.includes(bit), bit);
});

test("request notice links to confirm/decline and flags family bookings", () => {
  const n = practiceNotice({ ...base, event: "requested", forWhom: "other" });
  assert.ok(n.text.includes("Confirm or decline: https://thedoctorindex.in/dashboard/calendar"));
  assert.ok(n.text.includes("booked by a family member or carer"));
  assert.ok(n.text.includes("not confirmed until"));
});

test("notice has no field for the visit reason", () => {
  const n = practiceNotice({ ...base, event: "cancelled_by_patient", ...({ reason: "chest pain" } as object) });
  assert.ok(!n.text.includes("chest pain"));
});

test("normaliseEmail", () => {
  assert.equal(normaliseEmail("  FrontDesk@Clinic.IN "), "frontdesk@clinic.in");
  assert.equal(normaliseEmail("no-at-sign.com"), null);
  assert.equal(normaliseEmail("a@b.c"), null);
});

const pbase = {
  ref: "TDI-BK-7K3M9Q",
  doctorName: "Dr Asha Rao",
  when: "Mon 12 Oct, 10:30 am",
  clinicName: "Sunrise Clinic",
  clinicAddress: "27th Main, HSR Layout",
  clinicPhone: "080 4000 1234",
  note: null,
  profileUrl: "https://thedoctorindex.in/doctor/dr-asha-rao",
  accountUrl: "https://thedoctorindex.in/account",
  siteName: "The Doctor Index",
  siteUrl: "https://thedoctorindex.in/",
};

test("patient request email says not confirmed and carries the reference", () => {
  const n = patientNotice({ ...pbase, event: "requested" });
  assert.match(n.subject, /^Appointment requested — not yet confirmed — Dr Asha Rao, Mon 12 Oct, 10:30 am \(TDI-BK-7K3M9Q\)$/);
  for (const bit of ["NOT confirmed yet", "Booking reference: TDI-BK-7K3M9Q", "Sunrise Clinic, 27th Main, HSR Layout", "Phone:   080 4000 1234", "https://thedoctorindex.in/account"]) assert.ok(n.text.includes(bit), bit);
});

test("patient decline email shows the practice note and a rebook link", () => {
  const n = patientNotice({ ...pbase, event: "declined", note: "Full that morning", clinicPhone: null });
  assert.ok(n.text.includes("Note from the practice: Full that morning"));
  assert.ok(n.text.includes("/doctor/dr-asha-rao/book"));
  assert.ok(!n.text.includes("Phone:"));
});

test("booking references: format, alphabet, normalisation", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 2000; i++) {
    const r = newBookingRef();
    assert.match(r, /^TDI-BK-[A-Z2-9]{6}$/);
    assert.ok([...r.slice(7)].every((c) => REF_ALPHABET.includes(c)));
    seen.add(r);
  }
  assert.ok(seen.size > 1990);
  assert.ok(!/[01OIL]/.test(REF_ALPHABET));
  assert.equal(normaliseBookingRef("tdi bk 7k3m9q"), "TDI-BK-7K3M9Q");
  assert.equal(normaliseBookingRef("7K3M9Q"), "TDI-BK-7K3M9Q");
  assert.equal(normaliseBookingRef("7K3M9O"), null);
});
