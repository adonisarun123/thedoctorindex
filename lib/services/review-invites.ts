import "server-only";

import { and, eq, isNull, sql } from "drizzle-orm";

import { sendEmail } from "@/lib/auth/mailer";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { displayName } from "@/lib/display-name";
import { inviteDue, reviewInviteEmail } from "@/lib/reviews/invite";
import { audit } from "@/lib/services/audit";
import { absoluteUrl, SITE } from "@/lib/site";

/**
 * "How was your visit?" — one email per TDi booking, after the slot has
 * passed. TDi solicits, not the doctor, and it asks everyone who booked. The
 * link carries the booking reference; a review written from it is "Verified
 * visit" on the site's own record of the appointment, with nothing to upload.
 *
 * Runs daily from /api/cron/reminders, and at once when a doctor marks a
 * booking completed. No-shows, cancellations and declines are stamped without
 * an email so they are never asked.
 */

function istDate(d: Date): string {
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
}

export interface InviteReport {
  considered: number;
  sent: number;
  skippedReviewed: number;
  skippedNoEmail: number;
}

/** Send the invite for one booking now, if it qualifies. Returns true when an email went out. */
export async function sendReviewInvite(appointmentId: string, now = new Date()): Promise<boolean> {
  const db = getDb();
  const a = await db.query.appointments.findFirst({ where: eq(s.appointments.id, appointmentId), with: { doctor: true, patient: true } });
  if (!a) return false;
  if (!inviteDue({ status: a.status, endsAt: a.endsAt, reviewInviteSentAt: a.reviewInviteSentAt }, now, { minAgeHours: 0, maxAgeDays: 30 })) return false;
  const [already] = await db.select({ id: s.reviews.id }).from(s.reviews).where(and(eq(s.reviews.doctorId, a.doctorId), eq(s.reviews.authorUserId, a.patientUserId))).limit(1);
  if (already || !a.patient?.email || a.patient.disabledAt) {
    await db.update(s.appointments).set({ reviewInviteSentAt: now }).where(eq(s.appointments.id, a.id));
    return false;
  }
  const { subject, text } = reviewInviteEmail({
    ref: a.ref,
    doctorName: displayName(a.doctor),
    when: istDate(a.startsAt),
    patientName: a.patientName,
    reviewUrl: absoluteUrl(`/doctor/${a.doctor.slug}/review?booking=${encodeURIComponent(a.ref)}`),
    siteName: SITE.name,
    siteUrl: absoluteUrl("/"),
  });
  // Stamped before the send so a retry never emails twice.
  await db.update(s.appointments).set({ reviewInviteSentAt: now }).where(eq(s.appointments.id, a.id));
  await sendEmail({ to: a.patient.email, subject, text });
  await audit({ actorUserId: null, actorRole: "staff", action: "appointment.review_invited", entityType: "appointment", entityId: a.id, after: { ref: a.ref } });
  return true;
}

/** Stamp a booking so it is never invited (no-show, cancelled, declined). */
export async function suppressReviewInvite(appointmentId: string): Promise<void> {
  await getDb().update(s.appointments).set({ reviewInviteSentAt: sql`coalesce(${s.appointments.reviewInviteSentAt}, now())` }).where(eq(s.appointments.id, appointmentId));
}

/** Daily sweep: every confirmed/completed booking that ended 2 hours to 7 days ago and has not been invited. */
export async function runReviewInvites(now = new Date()): Promise<InviteReport> {
  const db = getDb();
  const rows = await db
    .select({ id: s.appointments.id, status: s.appointments.status, endsAt: s.appointments.endsAt, reviewInviteSentAt: s.appointments.reviewInviteSentAt })
    .from(s.appointments)
    .where(and(isNull(s.appointments.reviewInviteSentAt), sql`${s.appointments.status} in ('confirmed','completed')`, sql`${s.appointments.endsAt} < now() - interval '2 hours'`, sql`${s.appointments.endsAt} > now() - interval '7 days'`))
    .limit(500);
  const report: InviteReport = { considered: rows.length, sent: 0, skippedReviewed: 0, skippedNoEmail: 0 };
  for (const r of rows) {
    if (!inviteDue(r, now)) continue;
    const sent = await sendReviewInvite(r.id, now);
    if (sent) report.sent += 1;
    else report.skippedReviewed += 1;
  }
  return report;
}
