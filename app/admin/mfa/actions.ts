"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { decrypt, encrypt } from "@/lib/auth/crypto";
import { requireStaffIdentity } from "@/lib/auth/session";
import { generateSecret, verifyTotp } from "@/lib/auth/totp";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { rateLimit } from "@/lib/security/rate-limit";
import { audit } from "@/lib/services/audit";

export interface MfaState {
  error?: string;
  ok?: boolean;
  message?: string;
}

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

/** Step 1 of enrolment: mint a secret, store it encrypted but not yet active. */
export async function beginEnrolAction(): Promise<void> {
  const u = await requireStaffIdentity();
  const secret = generateSecret();
  await getDb().update(s.staffMembers).set({ mfaSecret: encrypt(secret), mfaEnrolled: false, mfaEnrolledAt: null }).where(eq(s.staffMembers.userId, u.id));
  await audit({ actorUserId: u.id, actorRole: "staff", action: "staff.mfa.enrol_started", entityType: "user", entityId: u.id });
  redirect("/admin/security?enrol=1&step=confirm");
}

/** Step 2: the first valid code proves the authenticator holds the secret. */
export async function confirmEnrolAction(_p: MfaState, f: FormData): Promise<MfaState> {
  const u = await requireStaffIdentity();
  const db = getDb();
  const [m] = await db.select({ secret: s.staffMembers.mfaSecret }).from(s.staffMembers).where(eq(s.staffMembers.userId, u.id)).limit(1);
  if (!m?.secret) return { error: "Start enrolment again — no pending secret." };
  const rl = await rateLimit(`mfa:${u.id}`, 10, 300);
  if (!rl.ok) return { error: "Too many attempts. Wait five minutes." };
  if (!verifyTotp(decrypt(m.secret), str(f, "code"))) return { error: "That code did not match. Check the device clock and try the next code." };
  await db.update(s.staffMembers).set({ mfaEnrolled: true, mfaEnrolledAt: new Date() }).where(eq(s.staffMembers.userId, u.id));
  await db.update(s.sessions).set({ mfaVerifiedAt: new Date() }).where(eq(s.sessions.id, u.sessionId));
  await audit({ actorUserId: u.id, actorRole: "staff", action: "staff.mfa.enrolled", entityType: "user", entityId: u.id });
  redirect("/admin?mfa=enrolled");
}

/** Per-session second factor. */
export async function verifyMfaAction(_p: MfaState, f: FormData): Promise<MfaState> {
  const u = await requireStaffIdentity();
  const db = getDb();
  const [m] = await db.select({ secret: s.staffMembers.mfaSecret, enrolled: s.staffMembers.mfaEnrolled }).from(s.staffMembers).where(eq(s.staffMembers.userId, u.id)).limit(1);
  if (!m?.secret || !m.enrolled) redirect("/admin/security?enrol=1");
  const rl = await rateLimit(`mfa:${u.id}`, 10, 300);
  if (!rl.ok) return { error: "Too many attempts. Wait five minutes." };
  if (!verifyTotp(decrypt(m.secret), str(f, "code"))) {
    await audit({ actorUserId: u.id, actorRole: "staff", action: "staff.mfa.failed", entityType: "user", entityId: u.id });
    return { error: "That code did not match." };
  }
  await db.update(s.sessions).set({ mfaVerifiedAt: new Date() }).where(and(eq(s.sessions.id, u.sessionId), eq(s.sessions.userId, u.id)));
  await audit({ actorUserId: u.id, actorRole: "staff", action: "staff.mfa.verified", entityType: "user", entityId: u.id });
  const next = str(f, "next");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

/** A staff member re-enrols their own authenticator (lost phone with a still-valid session). */
export async function resetOwnMfaAction(): Promise<void> {
  const u = await requireStaffIdentity();
  if (!u.mfaVerified) redirect("/admin/mfa");
  await getDb().update(s.staffMembers).set({ mfaEnrolled: false, mfaSecret: null, mfaEnrolledAt: null }).where(eq(s.staffMembers.userId, u.id));
  await audit({ actorUserId: u.id, actorRole: "staff", action: "staff.mfa.reset_self", entityType: "user", entityId: u.id });
  redirect("/admin/security?enrol=1");
}
