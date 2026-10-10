import "server-only";

import { randomBytes } from "node:crypto";
import { and, eq, gt, isNotNull } from "drizzle-orm";

import { sendEmail } from "@/lib/auth/mailer";
import { sha256 } from "@/lib/auth/hash";
import { formatIst } from "@/lib/booking/slots";
import { MAX_NOTIFY_EMAILS, normaliseEmail, practiceNotice, VERIFY_TTL_DAYS, type PracticeEvent } from "@/lib/booking/notice";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { displayName } from "@/lib/display-name";
import { audit } from "@/lib/services/audit";
import { rateLimit } from "@/lib/security/rate-limit";
import { absoluteUrl, SITE } from "@/lib/site";

/**
 * Who hears about appointments on the practice side: the doctor's own
 * account email plus up to five verified extra addresses (front desk, clinic
 * manager). Unverified addresses receive only the verification email.
 */

const t = s.bookingNotifyEmails;
const hashToken = (token: string) => sha256(token, "booking-notify");

export async function listNotifyEmails(doctorId: string) {
  return getDb()
    .select({ id: t.id, email: t.email, verifiedAt: t.verifiedAt, tokenExpiresAt: t.tokenExpiresAt, createdAt: t.createdAt })
    .from(t)
    .where(eq(t.doctorId, doctorId))
    .orderBy(t.createdAt);
}

async function sendVerification(doctorId: string, rowId: string, email: string): Promise<void> {
  const token = randomBytes(24).toString("base64url");
  const expires = new Date(Date.now() + VERIFY_TTL_DAYS * 86_400_000);
  await getDb().update(t).set({ tokenHash: hashToken(token), tokenExpiresAt: expires }).where(and(eq(t.id, rowId), eq(t.doctorId, doctorId)));
  const name = await doctorName(doctorId);
  const link = absoluteUrl(`/booking-emails/verify?t=${encodeURIComponent(token)}`);
  await sendEmail({
    to: email,
    subject: `Confirm appointment emails for ${name}`,
    text:
      `${name}'s practice asked ${SITE.name} to send appointment requests, confirmations and cancellations to this address. Each email includes the patient's name and mobile number.\n\n` +
      `Confirm this address (link valid for ${VERIFY_TTL_DAYS} days): ${link}\n\n` +
      `If you don't recognise this, ignore it — nothing is sent here unless the address is confirmed.\n\n— ${SITE.name}\n${absoluteUrl("/")}`,
  });
}

export async function addNotifyEmail(doctorId: string, actorUserId: string, raw: string): Promise<string> {
  const email = normaliseEmail(raw);
  if (!email) throw new Error("Enter a valid email address.");
  const db = getDb();
  const [owner] = await db.select({ email: s.users.email }).from(s.doctors).innerJoin(s.users, eq(s.users.id, s.doctors.claimedByUserId)).where(eq(s.doctors.id, doctorId)).limit(1);
  if (owner?.email?.toLowerCase() === email) throw new Error("That is already your account email; it receives appointment emails automatically.");
  const existing = await listNotifyEmails(doctorId);
  if (existing.some((e) => e.email === email)) throw new Error("That address is already on the list.");
  if (existing.length >= MAX_NOTIFY_EMAILS) throw new Error(`You can add up to ${MAX_NOTIFY_EMAILS} addresses. Remove one first.`);
  const rl = await rateLimit(`booking-notify-add:${doctorId}`, 10, 86_400);
  if (!rl.ok) throw new Error("Too many addresses added today. Try again tomorrow.");
  const [row] = await db.insert(t).values({ doctorId, email, addedByUserId: actorUserId }).returning({ id: t.id });
  await audit({ actorUserId, actorRole: "doctor", action: "booking_notify_email.added", entityType: "doctor", entityId: doctorId, after: { email } });
  await sendVerification(doctorId, row.id, email);
  return email;
}

export async function resendNotifyVerification(doctorId: string, rowId: string): Promise<string> {
  const [row] = await getDb().select().from(t).where(and(eq(t.id, rowId), eq(t.doctorId, doctorId))).limit(1);
  if (!row) throw new Error("Address not found.");
  if (row.verifiedAt) throw new Error("That address is already confirmed.");
  const rl = await rateLimit(`booking-notify-resend:${rowId}`, 3, 86_400);
  if (!rl.ok) throw new Error("Already resent three times today. Check the spam folder, or try tomorrow.");
  await sendVerification(doctorId, row.id, row.email);
  return row.email;
}

export async function removeNotifyEmail(doctorId: string, actorUserId: string, rowId: string): Promise<void> {
  const [row] = await getDb().delete(t).where(and(eq(t.id, rowId), eq(t.doctorId, doctorId))).returning({ email: t.email });
  if (row) await audit({ actorUserId, actorRole: "doctor", action: "booking_notify_email.removed", entityType: "doctor", entityId: doctorId, before: { email: row.email } });
}

/** Confirms an address from the emailed link. Returns the doctor's name on success. */
export async function verifyNotifyEmail(token: string): Promise<{ doctorName: string; email: string } | null> {
  if (!token || token.length > 100) return null;
  const db = getDb();
  const [row] = await db
    .update(t)
    .set({ verifiedAt: new Date(), tokenHash: null, tokenExpiresAt: null })
    .where(and(eq(t.tokenHash, hashToken(token)), gt(t.tokenExpiresAt, new Date())))
    .returning({ doctorId: t.doctorId, email: t.email });
  if (!row) return null;
  await audit({ actorUserId: null, actorRole: "system", action: "booking_notify_email.verified", entityType: "doctor", entityId: row.doctorId, after: { email: row.email } });
  return { doctorName: await doctorName(row.doctorId), email: row.email };
}

/** Doctor's account email (if enabled) plus verified extras, de-duplicated. */
export async function practiceRecipients(doctorId: string): Promise<string[]> {
  const db = getDb();
  const [owner] = await db
    .select({ email: s.users.email, disabledAt: s.users.disabledAt })
    .from(s.doctors)
    .innerJoin(s.users, eq(s.users.id, s.doctors.claimedByUserId))
    .where(eq(s.doctors.id, doctorId))
    .limit(1);
  const extras = await db.select({ email: t.email }).from(t).where(and(eq(t.doctorId, doctorId), isNotNull(t.verifiedAt)));
  const all = [owner && !owner.disabledAt ? owner.email : null, ...extras.map((e) => e.email)].filter((e): e is string => Boolean(e)).map((e) => e.toLowerCase());
  return [...new Set(all)];
}

/**
 * Emails the practice side about one appointment. Failures are logged and
 * swallowed: a booking must never roll back because the mail provider is down.
 */
export async function notifyPractice(appointmentId: string, event: PracticeEvent): Promise<void> {
  try {
    const a = await getDb().query.appointments.findFirst({
      where: eq(s.appointments.id, appointmentId),
      with: { doctor: true, practice: { with: { facility: true } } },
    });
    if (!a) return;
    const to = await practiceRecipients(a.doctorId);
    if (!to.length) return;
    const { subject, text } = practiceNotice({
      event,
      doctorName: displayName(a.doctor),
      when: formatIst(a.startsAt),
      patientName: a.patientName,
      patientPhone: a.patientPhone,
      forWhom: a.forWhom,
      clinicName: a.practice?.facility?.name ?? "",
      clinicAddress: a.practice?.facility?.address ?? "",
      dashboardUrl: absoluteUrl("/dashboard/calendar"),
      siteName: SITE.name,
      siteUrl: absoluteUrl("/"),
    });
    // One email per recipient, so front-desk addresses never see each other.
    for (const addr of to) {
      try {
        await sendEmail({ to: addr, subject, text });
      } catch (e) {
        console.error("[booking-notify] send failed", event, e instanceof Error ? e.message : e);
      }
    }
  } catch (e) {
    console.error("[booking-notify] failed", event, e instanceof Error ? e.message : e);
  }
}

async function doctorName(doctorId: string): Promise<string> {
  const [d] = await getDb().select({ name: s.doctors.name, specialtyKey: s.doctors.specialtyKey }).from(s.doctors).where(eq(s.doctors.id, doctorId)).limit(1);
  return d ? displayName(d) : "the doctor";
}

