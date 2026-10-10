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
  ref: string;
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
    `Booking: ${n.ref}`,
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
  return { subject: `${SUBJECT[n.event]} — ${n.when}, ${n.doctorName} (${n.ref})`, text: lines.join("\n") };
}

export type PatientEvent = "requested" | "confirmed" | "declined" | "cancelled_by_patient" | "cancelled_by_practice";

export interface PatientNoticeInput {
  event: PatientEvent;
  ref: string;
  doctorName: string;
  when: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string | null;
  note: string | null;
  profileUrl: string;
  accountUrl: string;
  siteName: string;
  siteUrl: string;
}

const P_SUBJECT: Record<PatientEvent, string> = {
  requested: "Appointment requested — not yet confirmed",
  confirmed: "Appointment confirmed",
  declined: "Appointment not available",
  cancelled_by_patient: "You cancelled your appointment",
  cancelled_by_practice: "Appointment cancelled by the practice",
};

/** Email to the patient (the account that booked). Their own booking, so no "do not forward" line. */
export function patientNotice(n: PatientNoticeInput): { subject: string; text: string } {
  const lead: Record<PatientEvent, string> = {
    requested: `We have sent your request to ${n.doctorName}'s practice. It is NOT confirmed yet — please don't go to the clinic until you get a confirmation email. You will hear either way.`,
    confirmed: `Your appointment with ${n.doctorName} is confirmed by the practice.`,
    declined: `The practice could not take your request for this time.`,
    cancelled_by_patient: `Your appointment has been cancelled as you asked, and the practice has been told.`,
    cancelled_by_practice: `The practice has cancelled this appointment.`,
  };
  const next: Record<PatientEvent, string> = {
    requested: `Changed your mind? Cancel from ${n.accountUrl}`,
    confirmed: `Can't make it? Cancel from ${n.accountUrl} so someone else can have the slot. Quote the booking reference if you call the clinic.`,
    declined: `Pick another time at ${n.profileUrl}/book`,
    cancelled_by_patient: `Book another time at ${n.profileUrl}/book`,
    cancelled_by_practice: `Pick another time at ${n.profileUrl}/book`,
  };
  const lines = [
    lead[n.event],
    ...(n.note ? ["", `Note from the practice: ${n.note}`] : []),
    "",
    `Booking reference: ${n.ref}`,
    `Doctor:  ${n.doctorName}`,
    `When:    ${n.when} (IST)`,
    `Clinic:  ${n.clinicName}${n.clinicAddress ? `, ${n.clinicAddress}` : ""}`,
    ...(n.clinicPhone ? [`Phone:   ${n.clinicPhone}`] : []),
    "",
    next[n.event],
    "",
    `— ${n.siteName}`,
    n.siteUrl,
    "This is a transactional message about a booking on your account; it is not marketing.",
  ];
  return { subject: `${P_SUBJECT[n.event]} — ${n.doctorName}, ${n.when} (${n.ref})`, text: lines.join("\n") };
}

/** Lower-case and validate; null when it is not a plausible address. */
export function normaliseEmail(raw: string): string | null {
  const e = raw.trim().toLowerCase();
  if (e.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return null;
  return e;
}

export const MAX_NOTIFY_EMAILS = 5;
export const VERIFY_TTL_DAYS = 7;
