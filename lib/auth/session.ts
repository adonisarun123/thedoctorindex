import "server-only";

import { and, eq, isNull, sql } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { ipHash } from "@/lib/auth/hash";
import { getDb } from "@/lib/db/client";
import { doctorManagers, doctors, sessions, staffMembers, users } from "@/lib/db/schema";

/**
 * Sessions.
 *
 * A signed JWT cookie carries only the session id. The session row is the
 * source of truth so a sign-out or a staff revocation takes effect at once.
 * Doctors and reviewers are `users`; staff are `users` with a `staff_members`
 * row and one or more roles.
 */

const COOKIE = () => process.env.AUTH_COOKIE_NAME ?? "tdi_session";
const TTL = () => Number(process.env.AUTH_SESSION_TTL_SECONDS ?? 2_592_000);

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    if (process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET must be set (32+ random bytes)");
    return new TextEncoder().encode("development-only-secret-change-me");
  }
  return new TextEncoder().encode(s);
}

export type StaffRole = (typeof staffMembers.$inferSelect)["roles"][number];

export interface SessionUser {
  id: string;
  email: string | null;
  phone: string | null;
  role: "patient" | "doctor" | "staff";
  displayName: string | null;
  staffRoles: StaffRole[];
  sessionId: string;
  /** Staff only: has a TOTP authenticator been enrolled, and has this session passed it. */
  mfaEnrolled: boolean;
  mfaVerified: boolean;
  /** Registration complete: name, mobile, email, locality and accepted terms. */
  profileComplete: boolean;
  localityKey: string | null;
}

export async function createSession(userId: string): Promise<void> {
  const db = getDb();
  const h = await headers();
  const expiresAt = new Date(Date.now() + TTL() * 1000);
  const [row] = await db
    .insert(sessions)
    .values({
      userId,
      expiresAt,
      userAgent: h.get("user-agent")?.slice(0, 200) ?? null,
      ipHash: ipHash(h.get("x-forwarded-for")?.split(",")[0] ?? null),
    })
    .returning({ id: sessions.id });
  await db.update(users).set({ lastSignInAt: new Date() }).where(eq(users.id, userId));

  const token = await new SignJWT({ sid: row.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.AUTH_COOKIE_SECURE !== "0" && process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
    domain: process.env.AUTH_COOKIE_DOMAIN || undefined,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE())?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret());
      const sid = String(payload.sid);
      await getDb().update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.id, sid));
    } catch {
      /* already invalid */
    }
  }
  jar.delete(COOKIE());
}

/** Current user or null. Cheap: one query joining sessions → users → staff. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!process.env.DATABASE_URL) return null;
  const jar = await cookies();
  const token = jar.get(COOKIE())?.value;
  if (!token) return null;
  let sid: string;
  try {
    const { payload } = await jwtVerify(token, secret());
    sid = String(payload.sid);
  } catch {
    return null;
  }
  const db = getDb();
  const [row] = await db
    .select({
      sessionId: sessions.id,
      id: users.id,
      email: users.email,
      phone: users.phone,
      role: users.role,
      displayName: users.displayName,
      staffRoles: staffMembers.roles,
      staffActive: staffMembers.active,
      mfaEnrolled: staffMembers.mfaEnrolled,
      mfaVerifiedAt: sessions.mfaVerifiedAt,
      disabledAt: users.disabledAt,
      profileCompletedAt: users.profileCompletedAt,
      localityKey: users.localityKey,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .leftJoin(staffMembers, eq(staffMembers.userId, users.id))
    .where(and(eq(sessions.id, sid), isNull(sessions.revokedAt), sql`${sessions.expiresAt} > now()`))
    .limit(1);
  if (!row || row.disabledAt) return null;
  // Touch last_seen at most once a minute per session.
  void db.update(sessions).set({ lastSeenAt: new Date() }).where(and(eq(sessions.id, sid), sql`coalesce(${sessions.lastSeenAt}, 'epoch') < now() - interval '1 minute'`));
  return {
    id: row.id,
    email: row.email,
    phone: row.phone,
    role: row.role,
    displayName: row.displayName,
    staffRoles: row.staffActive ? (row.staffRoles ?? []) : [],
    sessionId: row.sessionId,
    mfaEnrolled: Boolean(row.mfaEnrolled),
    mfaVerified: Boolean(row.mfaVerifiedAt),
    profileComplete: Boolean(row.profileCompletedAt && row.displayName && row.phone && row.email),
    localityKey: row.localityKey,
  };
}

/** Where an account with missing registration details is sent, returning to `next` after. */
export function setupPath(next?: string): string {
  return `/account/setup${next ? `?next=${encodeURIComponent(next)}` : ""}`;
}

/**
 * A signed-in account whose registration is complete. New accounts are
 * created by the one-time code alone; before they can do anything that
 * touches a doctor or a practice — enquire, review, submit, claim, manage —
 * they give a full name, mobile, email, locality and accept the terms once.
 */
export async function requireUser(next?: string): Promise<SessionUser> {
  const u = await getSessionUser();
  if (!u) redirect(`/sign-in${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  if (!u.profileComplete) redirect(setupPath(next));
  return u;
}

/**
 * The doctor record the signed-in user may manage: their own claimed profile,
 * or one where they hold an active clinic-manager grant.
 */
export async function requireDoctor(): Promise<{ user: SessionUser; doctorId: string; asManager: boolean; scope: string[] }> {
  const user = await requireUser("/dashboard");
  const db = getDb();
  const [own] = await db.select({ id: doctors.id }).from(doctors).where(eq(doctors.claimedByUserId, user.id)).limit(1);
  if (own) return { user, doctorId: own.id, asManager: false, scope: [] };
  const [grant] = await db
    .select({ doctorId: doctorManagers.doctorId, scope: doctorManagers.scopePracticeIds })
    .from(doctorManagers)
    .where(and(eq(doctorManagers.userId, user.id), eq(doctorManagers.status, "active")))
    .limit(1);
  if (grant) return { user, doctorId: grant.doctorId, asManager: true, scope: grant.scope };
  redirect("/dashboard/no-profile");
}

/**
 * Second factor policy for staff. STAFF_MFA_REQUIRED=1 (the default in
 * production) forces enrolment before the console opens; an enrolled staff
 * member must always pass TOTP once per session, whatever the setting.
 */
export function mfaRequired(): boolean {
  const v = process.env.STAFF_MFA_REQUIRED;
  if (v === "0" || v === "false") return false;
  if (v === "1" || v === "true") return true;
  return process.env.NODE_ENV === "production";
}

/** Staff identity without the MFA gate — for the enrol/verify pages themselves. */
export async function requireStaffIdentity(): Promise<SessionUser> {
  const user = await requireUser("/admin");
  if (user.role !== "staff" || user.staffRoles.length === 0) redirect("/admin/sign-in?denied=1");
  return user;
}

export async function requireStaff(...roles: StaffRole[]): Promise<SessionUser> {
  const user = await requireStaffIdentity();
  if (user.mfaEnrolled && !user.mfaVerified) redirect("/admin/mfa");
  if (!user.mfaEnrolled && mfaRequired()) redirect("/admin/security?enrol=1");
  if (roles.length && !user.staffRoles.includes("super_admin") && !roles.some((r) => user.staffRoles.includes(r))) {
    redirect("/admin?denied=1");
  }
  return user;
}

export function hasRole(user: SessionUser, ...roles: StaffRole[]): boolean {
  return user.staffRoles.includes("super_admin") || roles.some((r) => user.staffRoles.includes(r));
}
