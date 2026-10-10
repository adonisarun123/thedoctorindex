/**
 * Plain-text appointment emails for the practice side (the doctor and the
 * verified front-desk addresses). Pure so it can be unit-tested.
 *
 * What goes in: patient name, mobile, time (IST) and clinic. What never goes
 * in: the visit reason — it stays in the dashboard behind sign-in.
 */

export type PracticeEvent = "requested" | "confirmed" | "declined" | "cancelled_by_patient" | "cancelled_by_practice";

export interface NoticeInput {
  event: PracticeEvent;
  doctorName: string;
  when: string;
  patientName: string;
  patientPhone: string;
  forWhom: string;
  clinicName: string;
  clinicAddress: string;
  dashboardUrl: string;
  siteName: string;
  siteUrl: string;
}

const SUBJECT: Record<PracticeEvent, string> = {
  requested: "New appointment request",
  confirmed: "Appointment confirmed",
  declined: "Appointment request declined",
  cancelled_by_patient: "Appointment cancelled by the patient",
  cancelled_by_practice: "Appointment cancelled by the practice",
};

const LEAD: Record<PracticeEvent, string> = {
  requested: "A patient has requested an appointment. It is not confirmed until someone at the practice confirms it in the calendar; the patient is emailed either way.",
  confirmed: "This appointment is confirmed. Please add it to the clinic diary.",
  declined: "This appointment request was declined. The patient has been told and asked to pick another time.",
  cancelled_by_patient: "The patient cancelled this appointment. The slot is open for booking again.",
  cancelled_by_practice: "This appointment was cancelled by the practice. The patient has been emailed.",
};

export function practiceNotice(n: NoticeInput): { subject: string; text: string } {
  const lines = [
    LEAD[n.event],
    "",
    `Doctor:  ${n.doctorName}`,
    `When:    ${n.when} (IST)`,
    `Clinic:  ${n.clinicName}${n.clinicAddress ? `, ${n.clinicAddress}` : ""}`,
    `Patient: ${n.patientName}${n.forWhom === "other" ? " (booked by a family member or carer)" : ""}`,
    `Mobile:  ${n.patientPhone}`,
    "",
    n.event === "requested" ? `Confirm or decline: ${n.dashboardUrl}` : `Calendar: ${n.dashboardUrl}`,
    "",
    "These are a patient's contact details, shared with the practice for this appointment only. Please do not forward this email or use the number for anything else.",
    "",
    `— ${n.siteName}`,
    n.siteUrl,
    "You receive this because this address was added to receive appointment emails for this doctor. The doctor can remove it from their calendar settings.",
  ];
  return { subject: `${SUBJECT[n.event]} — ${n.when}, ${n.doctorName}`, text: lines.join("\n") };
}

/** Lower-case and validate; null when it is not a plausible address. */
export function normaliseEmail(raw: string): string | null {
  const e = raw.trim().toLowerCase();
  if (e.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return null;
  return e;
}

export const MAX_NOTIFY_EMAILS = 5;
export const VERIFY_TTL_DAYS = 7;
