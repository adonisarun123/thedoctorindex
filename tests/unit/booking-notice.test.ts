import assert from "node:assert/strict";
import { test } from "node:test";

import { normaliseEmail, practiceNotice } from "../../lib/booking/notice";

const base = {
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
  assert.match(n.subject, /^Appointment confirmed — Mon 12 Oct, 10:30 am, Dr Asha Rao$/);
  for (const bit of ["Ravi K", "+91 98450 12345", "Mon 12 Oct, 10:30 am (IST)", "Sunrise Clinic, 27th Main, HSR Layout", "do not forward"]) assert.ok(n.text.includes(bit), bit);
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
