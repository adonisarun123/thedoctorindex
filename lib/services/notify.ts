import "server-only";

import { eq } from "drizzle-orm";

import { sendEmail } from "@/lib/auth/mailer";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { absoluteUrl, SITE } from "@/lib/site";

/**
 * Transactional notifications to the person a decision concerns. Plain text,
 * no tracking, never health detail, never another person's contact details.
 * Failures are logged and swallowed — a decision must not roll back because
 * the mail provider is down. Everything sent is written to the audit log as
 * `notification.sent` by the caller's audit row context.
 */

type Kind =
  | { kind: "submission"; decision: "approved" | "rejected" | "needs_info" | "in_review"; doctorName: string; note?: string | null; slug?: string | null }
  | { kind: "claim"; decision: "approved" | "rejected"; doctorName: string; note?: string | null }
  | { kind: "change"; decision: "published" | "rejected"; field: string; doctorName: string; note?: string | null }
  | { kind: "review"; decision: "published" | "redacted" | "rejected" | "removed"; doctorName: string; slug: string; reason?: string | null }
  | { kind: "reply"; decision: "published" | "rejected"; doctorName: string; reason?: string | null }
  | { kind: "manager_invite"; doctorName: string; invitedBy: string }
  | { kind: "review_received"; doctorName: string; authorLabel: string }
  | { kind: "enquiry_received"; doctorName: string; preferredDay: string | null };

function body(n: Kind): { subject: string; text: string } {
  const sign = `\n\n— ${SITE.name}\n${absoluteUrl("/")}\nThis is a transactional message about an action on your account; it is not marketing.`;
  switch (n.kind) {
    case "submission": {
      const map = {
        approved: [`Your profile is live — Dr ${n.doctorName}`, `A verification officer matched your council and registration number and your profile is now published${n.slug ? ` at ${absoluteUrl(`/doctor/${n.slug}`)}` : ""}.\n\nSign in at ${absoluteUrl("/sign-in?next=%2Fdashboard")} to add practices, reconfirm your hours and fees, and reply to reviews. Profiles that are reconfirmed regularly stay indexed; stale ones drop out.`],
        rejected: [`We could not publish your profile — Dr ${n.doctorName}`, `Your submission was not approved.${n.note ? `\n\nReason: ${n.note}` : ""}\n\nIf a profile already exists for your registration number, claim it at ${absoluteUrl("/claim-profile")}. Otherwise reply to this message with the correction and we will look again.`],
        needs_info: [`One more thing before we publish — Dr ${n.doctorName}`, `A verification officer needs more information before your profile can go live.${n.note ? `\n\nWhat we need: ${n.note}` : ""}\n\nReply to this message with the detail, or resubmit at ${absoluteUrl("/add-doctor")}.`],
        in_review: [`Your profile is being verified — Dr ${n.doctorName}`, `Your submission is with a verification officer. Target is two business days.${n.note ? `\n\nNote: ${n.note}` : ""}`],
      } as const;
      return { subject: map[n.decision][0], text: map[n.decision][1] + sign };
    }
    case "claim":
      return n.decision === "approved"
        ? { subject: `Profile claim approved — Dr ${n.doctorName}`, text: `Control of the profile for Dr ${n.doctorName} has been transferred to your account.${n.note ? `\n\nHow it was confirmed: ${n.note}` : ""}\n\nSign in at ${absoluteUrl("/sign-in?next=%2Fdashboard")}.` + sign }
        : { subject: `Profile claim not approved — Dr ${n.doctorName}`, text: `We could not confirm control of the profile for Dr ${n.doctorName}.${n.note ? `\n\nReason: ${n.note}` : ""}\n\nYou can try again with a different method (OTP to the practice number on file, a hospital email, or a document) at ${absoluteUrl("/claim-profile")}.` + sign };
    case "change":
      return n.decision === "published"
        ? { subject: `Change published — ${n.field} for Dr ${n.doctorName}`, text: `Your change to "${n.field}" was re-verified and is now live on the public page.${n.note ? `\n\nVerification note: ${n.note}` : ""}` + sign }
        : { subject: `Change not published — ${n.field} for Dr ${n.doctorName}`, text: `Your change to "${n.field}" was not approved.${n.note ? `\n\nReason: ${n.note}` : ""}\n\nOpen a verification case from your dashboard if you have supporting documents.` + sign };
    case "review": {
      const url = absoluteUrl(`/doctor/${n.slug}`);
      const map = {
        published: [`Your review of Dr ${n.doctorName} is live`, `Thank you. Your review is published as written at ${url}. Only you and our moderators can see who wrote it.`],
        redacted: [`Your review of Dr ${n.doctorName} is live, lightly edited`, `Your review is published at ${url}. We removed identifying detail such as phone numbers, addresses or health information before publishing, as our policy requires; your ratings and the substance of your experience are unchanged.${n.reason ? `\n\nWhat was removed: ${n.reason}` : ""}`],
        rejected: [`We could not publish your review of Dr ${n.doctorName}`, `Your review was not published because it breaches the review policy (${absoluteUrl("/policies/reviews")}).${n.reason ? `\n\nReason: ${n.reason}` : ""}\n\nYou may submit a revised review from the doctor's page.`],
        removed: [`Your review of Dr ${n.doctorName} was removed`, `A published review was removed after a report was upheld.${n.reason ? `\n\nReason: ${n.reason}` : ""}\n\nIf you believe this is wrong, reply to this message.`],
      } as const;
      return { subject: map[n.decision][0], text: map[n.decision][1] + sign };
    }
    case "reply":
      return n.decision === "published"
        ? { subject: `Your reply is live — Dr ${n.doctorName}`, text: `Your reply to a patient review has been checked and published.` + sign }
        : { subject: `Your reply was not published — Dr ${n.doctorName}`, text: `Your reply to a patient review was not published.${n.reason ? `\n\nReason: ${n.reason}` : ""}\n\nReplies must not confirm or reveal any health detail about the reviewer. You can write a new reply from your dashboard.` + sign };
    case "manager_invite":
      return { subject: `You have been given access to Dr ${n.doctorName}'s profile`, text: `${n.invitedBy} has invited you to manage practice details for Dr ${n.doctorName} on ${SITE.name}.\n\nSign in with this email address at ${absoluteUrl("/sign-in?next=%2Fdashboard")} — a one-time code is sent to you, no password needed. Name, speciality and registration stay with the doctor.` + sign };
    case "review_received":
      return { subject: `A new review of Dr ${n.doctorName} is in moderation`, text: `${n.authorLabel} has written a review. It is being moderated and will appear on the profile if it meets the policy. You can reply once it is published: ${absoluteUrl("/dashboard/reviews")}.` + sign };
    case "enquiry_received":
      return { subject: `New appointment enquiry — Dr ${n.doctorName}`, text: `A patient has asked for an appointment${n.preferredDay ? ` (${n.preferredDay})` : ""}. Their contact details are in your dashboard, never in email: ${absoluteUrl("/dashboard/enquiries")}.` + sign };
  }
}

export async function notifyUser(userId: string | null | undefined, n: Kind): Promise<void> {
  if (!userId) return;
  try {
    const [u] = await getDb().select({ email: s.users.email, disabledAt: s.users.disabledAt }).from(s.users).where(eq(s.users.id, userId)).limit(1);
    if (!u?.email || u.disabledAt) return;
    const { subject, text } = body(n);
    await sendEmail({ to: u.email, subject, text });
  } catch (e) {
    console.error("[notify] failed", n.kind, e instanceof Error ? e.message : e);
  }
}

/** The doctor who owns a profile, when it is claimed. */
export async function notifyDoctorOwner(doctorId: string, n: Kind): Promise<void> {
  const [d] = await getDb().select({ owner: s.doctors.claimedByUserId }).from(s.doctors).where(eq(s.doctors.id, doctorId)).limit(1);
  await notifyUser(d?.owner, n);
}
