import { createHash, createHmac, randomBytes } from "node:crypto";

/**
 * Staff invites to claim a profile: the rules, with no database or network.
 * The database side is lib/services/doctor-invites.ts.
 *
 *   send 1  the invite, when a staff member presses Send
 *   send 2  reminder, 3 days after the invite
 *   send 3  last reminder, 10 days after the invite
 *
 * The link stays valid for 30 days from the first send. Opening it shows the
 * profile and asks; nothing changes on a GET, because mail scanners open every
 * link in a message.
 */

const DAY = 86_400_000;
export const REMINDER_DAYS = [3, 10] as const;
export const INVITE_VALID_DAYS = 30;
/** First sends per India day across all staff, so the sending domain is not flagged. */
export const DAILY_INVITE_CAP = 50;
export const MAX_CONFIRM_ATTEMPTS = 5;

export function newInviteToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * The link token for an invite: an HMAC of its id under the server secret, so
 * every email in the sequence carries the same link and no token is stored.
 * Cancelling or claiming the invite is what retires it.
 */
export function inviteToken(inviteId: string, secret: string): string {
  return createHmac("sha256", secret).update(`doctor-invite:${inviteId}`).digest("base64url");
}

export function hashInviteToken(token: string): string {
  return createHash("sha256").update(`doctor-invite:${token}`).digest("hex");
}

/** A token as it arrives in a URL (base64url, 43 characters). Anything else is refused before a lookup. */
export function looksLikeToken(t: string): boolean {
  return /^[A-Za-z0-9_-]{43}$/.test(t);
}

export function normalizeEmail(raw: string): string | null {
  const e = raw.trim().toLowerCase();
  return /^[^\s@<>(),;:"]+@[^\s@<>(),;:"]+\.[a-z]{2,}$/.test(e) ? e : null;
}

/** Which send (2 or 3) is due now for an invite already sent `sends` times, or null. */
export function dueSend(inv: { status: string; sends: number; firstSentAt: Date | null; expiresAt: Date | null }, now: Date): number | null {
  if (inv.status !== "sent" || !inv.firstSentAt) return null;
  if (inv.expiresAt && inv.expiresAt <= now) return null;
  const next = inv.sends + 1;
  if (next < 2 || next > REMINDER_DAYS.length + 1) return null;
  const days = REMINDER_DAYS[next - 2];
  return now.getTime() - inv.firstSentAt.getTime() >= days * DAY ? next : null;
}

/** Start of the current day in India, for the daily cap. */
export function istDayStart(now: Date): Date {
  const IST = 5.5 * 3_600_000;
  const local = new Date(now.getTime() + IST);
  return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - IST);
}

export function inviteUrl(siteUrl: string, token: string): string {
  return `${siteUrl.replace(/\/$/, "")}/invite/${token}`;
}

export interface InviteProfile {
  /** Display name with the right honorific (lib/display-name.ts). */
  name: string;
  specialty: string | null;
  practice: string | null;
  registration: string | null;
  profileUrl: string;
}

export function composeInvite(send: number, p: InviteProfile, link: string): { subject: string; text: string } {
  // The registration number is never in the email: it is what the recipient types to claim.
  const facts = [p.specialty, p.practice].filter(Boolean).join(" · ");
  const subject =
    send === 1
      ? "Your profile on The Doctor Index is ready to claim"
      : send === 2
        ? "Reminder: claim your profile on The Doctor Index"
        : "Last reminder: your Doctor Index profile is waiting for you";

  const lead =
    send === 1
      ? [
          "Our team has set up a free profile for you on The Doctor Index, a directory of registered doctors in India:",
          p.profileUrl,
          ...(facts ? ["", `It currently shows: ${facts}.`] : []),
          "",
          "Claim it to check these details, add your photograph, qualifications, timings and fees, and decide what patients see. It takes about two minutes: open the link below, then confirm your registration number.",
        ]
      : send === 2
        ? [
            "A few days ago we let you know that your profile on The Doctor Index is ready:",
            p.profileUrl,
            "",
            "Claiming it takes about two minutes. Open the link below and confirm your registration number.",
          ]
        : [
            "This is the last email we will send about your profile on The Doctor Index:",
            p.profileUrl,
            "",
            "It stays listed whether or not you claim it, but only once it is claimed can you correct it or add to it.",
          ];

  const text = [
    `Hello ${p.name},`,
    "",
    ...lead,
    "",
    link,
    "",
    "The profile is free, permanently.",
    "",
    'Not you, or would rather we did not email you? Open the same link and choose "This is not me" or "Stop these emails".',
    "",
    "The Doctor Index",
    "",
    "You are receiving this because our team added your practice details to The Doctor Index.",
  ].join("\n");
  return { subject, text };
}
