/**
 * The "How was your visit?" email sent once per TDi booking after the
 * appointment has passed. Pure so the copy and the eligibility rule are
 * unit-tested; lib/services/review-invites.ts does the database side.
 *
 * TDi, not the doctor, asks — and it asks every patient who booked, not a
 * hand-picked few. The link carries the booking reference, so the review is
 * tied to a visit TDi itself recorded and needs no document to be "Verified".
 */

export interface InviteInput {
  ref: string;
  doctorName: string;
  /** Visit date in words, IST ("Tue 7 Oct"). */
  when: string;
  patientName: string;
  reviewUrl: string;
  siteName: string;
  siteUrl: string;
}

export function reviewInviteEmail(n: InviteInput): { subject: string; text: string } {
  const first = n.patientName.trim().split(/\s+/)[0] || "there";
  return {
    subject: `How was your visit with ${n.doctorName}?`,
    text: [
      `Hi ${first},`,
      "",
      `You had an appointment with ${n.doctorName} on ${n.when} (booking ${n.ref}). Would you rate the visit? Four quick questions, about two minutes:`,
      "",
      n.reviewUrl,
      "",
      "Because this visit was booked through The Doctor Index, your review carries the \"Verified visit\" badge automatically — nothing to upload.",
      "",
      "What to expect: a moderator reads every review before it appears; positive or critical, it is published if it keeps to the review policy. Your name shows as your first name and initial unless you choose to hide it. Please describe the visit, not your diagnosis or treatment.",
      "",
      "We ask every patient who books through the site, and no one is offered anything for a review.",
      "",
      `— ${n.siteName}`,
      n.siteUrl,
      "You receive this once per booking. If the appointment did not take place, ignore this email.",
    ].join("\n"),
  };
}

/**
 * Which past bookings get an invite in a run: confirmed or completed, ended
 * between `minAgeHours` and `maxAgeDays` ago, never invited. Pure so the
 * window is testable; the service adds "no review by this patient yet".
 */
export interface InviteCandidate {
  status: string;
  endsAt: Date;
  reviewInviteSentAt: Date | null;
}

export function inviteDue(a: InviteCandidate, now: Date, opts: { minAgeHours?: number; maxAgeDays?: number } = {}): boolean {
  const minAge = (opts.minAgeHours ?? 2) * 3_600_000;
  const maxAge = (opts.maxAgeDays ?? 7) * 86_400_000;
  if (a.reviewInviteSentAt) return false;
  if (a.status !== "confirmed" && a.status !== "completed") return false;
  const age = now.getTime() - a.endsAt.getTime();
  return age >= minAge && age <= maxAge;
}

/** A booking proves a visit once the slot has passed and it was not declined, cancelled or a no-show. */
export function bookingProvesVisit(a: { status: string; endsAt: Date }, now: Date): boolean {
  return (a.status === "confirmed" || a.status === "completed") && a.endsAt.getTime() <= now.getTime();
}
