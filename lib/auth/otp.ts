import "server-only";

import { and, desc, eq, gt, isNull, sql } from "drizzle-orm";

import { generateOtp, ipHash, normalizeIdentifier, safeEqual, sha256 } from "@/lib/auth/hash";
import { sendEmail, sendSms } from "@/lib/auth/mailer";
import { getDb } from "@/lib/db/client";
import { otpCodes, users } from "@/lib/db/schema";
import { rateLimit } from "@/lib/security/rate-limit";

/**
 * One-time passwords. Codes are hashed at rest; attempts are capped; a code
 * is consumed on first success. Identifier is a lower-cased email or an
 * E.164 Indian mobile number.
 */

const PEPPER = () => process.env.CONTACT_HASH_PEPPER ?? "tdi-otp";

export type OtpPurpose = "sign_in" | "claim" | "enquiry";

export async function requestOtp(
  rawIdentifier: string,
  purpose: OtpPurpose,
  ip?: string | null,
): Promise<{ ok: true; kind: "email" | "phone"; identifier: string } | { ok: false; error: string }> {
  const id = normalizeIdentifier(rawIdentifier);
  if (!id) return { ok: false, error: "Enter a valid email address or Indian mobile number." };

  const perContact = await rateLimit(`otp:${id.value}`, Number(process.env.RATE_LIMIT_OTP_REQUEST ?? 5), 600);
  if (!perContact.ok) return { ok: false, error: "Too many codes requested. Wait ten minutes and try again." };
  if (ip) {
    const perIp = await rateLimit(`otp-ip:${ipHash(ip)}`, Number(process.env.OTP_DAILY_LIMIT_PER_IP ?? 50), 86_400);
    if (!perIp.ok) return { ok: false, error: "Too many requests from this network." };
  }

  const code = generateOtp();
  const ttl = Number(process.env.OTP_TTL_SECONDS ?? 600);
  const [inserted] = await getDb().insert(otpCodes).values({
    identifier: id.value,
    codeHash: sha256(code, PEPPER()),
    purpose,
    expiresAt: new Date(Date.now() + ttl * 1000),
    ipHash: ipHash(ip),
  }).returning({ id: otpCodes.id });

  const minutes = Math.round(ttl / 60);
  const sent =
    id.kind === "email"
      ? await sendEmail({
          to: id.value,
          subject: `${code} is your Doctor Index code`,
          text: `Your one-time password is ${code}. It expires in ${minutes} minutes.\n\nIf you did not request this, ignore this email.`,
        })
      : await sendSms(id.value, `${code} is your Doctor Index code. Valid ${minutes} min.`);

  /**
   * Never advance to the code screen for a code that was not actually sent.
   * With no provider configured the mailer falls back to the server log and
   * reports `delivered: false` in production; sending the user to "enter the
   * code we just sent you" in that state is a dead end they cannot escape.
   */
  if (!sent.delivered) {
    console.error(`[otp] undelivered ${id.kind} code · provider=${sent.provider} · purpose=${purpose}`);
    await getDb().delete(otpCodes).where(eq(otpCodes.id, inserted.id));
    return {
      ok: false,
      error:
        id.kind === "email"
          ? "We could not send the code by email just now. Try again in a few minutes, or write to " + (process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@thedoctorindex.in") + "."
          : "Codes by SMS are not available yet. Use an email address instead.",
    };
  }
  return { ok: true, kind: id.kind, identifier: id.value };
}

export async function verifyOtp(
  rawIdentifier: string,
  code: string,
  purpose: OtpPurpose,
): Promise<{ ok: true; userId: string; created: boolean } | { ok: false; error: string }> {
  const id = normalizeIdentifier(rawIdentifier);
  if (!id) return { ok: false, error: "Invalid identifier." };
  const db = getDb();

  const [row] = await db
    .select()
    .from(otpCodes)
    .where(and(eq(otpCodes.identifier, id.value), eq(otpCodes.purpose, purpose), isNull(otpCodes.consumedAt), gt(otpCodes.expiresAt, new Date())))
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);
  if (!row) return { ok: false, error: "That code has expired. Request a new one." };

  const maxAttempts = Number(process.env.OTP_MAX_ATTEMPTS ?? 5);
  if (row.attempts >= maxAttempts) return { ok: false, error: "Too many attempts. Request a new code." };

  if (!safeEqual(row.codeHash, sha256(code.trim(), PEPPER()))) {
    await db.update(otpCodes).set({ attempts: row.attempts + 1 }).where(eq(otpCodes.id, row.id));
    return { ok: false, error: `Incorrect code. ${maxAttempts - row.attempts - 1} attempts left.` };
  }
  await db.update(otpCodes).set({ consumedAt: new Date() }).where(eq(otpCodes.id, row.id));

  // Find or create the user.
  const where = id.kind === "email" ? sql`lower(${users.email}) = ${id.value}` : eq(users.phone, id.value);
  const [existing] = await db.select({ id: users.id }).from(users).where(where).limit(1);
  if (existing) return { ok: true, userId: existing.id, created: false };
  const [u] = await db
    .insert(users)
    .values(id.kind === "email" ? { email: id.value } : { phone: id.value })
    .returning({ id: users.id });
  return { ok: true, userId: u.id, created: true };
}
