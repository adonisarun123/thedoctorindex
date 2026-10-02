import { NextResponse, type NextRequest } from "next/server";

import { exchangeGoogleCode, fetchGoogleProfile, GOOGLE_COOKIE, googleConfigured, googleRedirectUri } from "@/lib/auth/google";
import { doctorDestination } from "@/lib/auth/doctor-journey";
import { safeEqual } from "@/lib/auth/hash";
import { eq } from "drizzle-orm";

import { createSession, setupPath } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { env } from "@/lib/env";
import { audit } from "@/lib/services/audit";
import { signInWithGoogle } from "@/lib/services/google-signin";

export const dynamic = "force-dynamic";

function readCookie(raw: string | undefined): { s: string; n: string } | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as { s?: unknown; n?: unknown };
    if (typeof v.s !== "string" || typeof v.n !== "string") return null;
    const n = v.n.startsWith("/") && !v.n.startsWith("//") ? v.n : "/";
    return { s: v.s, n };
  } catch {
    return null;
  }
}

/**
 * Step two: Google sends the visitor back with a code. Check the state,
 * swap the code for the member's name and verified email, sign them in, and
 * send a doctor on to the register search with their name already typed.
 * Every failure returns to /sign-in with a short reason code, never a stack.
 */
export async function GET(req: NextRequest) {
  const cookie = readCookie(req.cookies.get(GOOGLE_COOKIE)?.value);
  const next = cookie?.n ?? "/";
  const back = (reason: string) => {
    const res = NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(next)}&g=${reason}`, env.siteUrl));
    res.cookies.delete({ name: GOOGLE_COOKIE, path: "/api/auth/google" });
    return res;
  };

  const q = req.nextUrl.searchParams;
  if (q.get("error")) return back(q.get("error") === "access_denied" ? "cancelled" : "denied");
  if (!googleConfigured()) return back("unavailable");
  const state = q.get("state") ?? "";
  const code = q.get("code") ?? "";
  if (!cookie || !state || !code || !safeEqual(cookie.s, state)) return back("expired");

  const redirectUri = googleRedirectUri(env.siteUrl);
  const token = await exchangeGoogleCode(code, redirectUri);
  if (!token) return back("failed");
  const profile = await fetchGoogleProfile(token);
  if (!profile) return back("failed");
  if (!profile.email || !profile.emailVerified) return back("no_email");

  const result = await signInWithGoogle({ ...profile, email: profile.email }, next);
  if (!result) return back("disabled");

  await createSession(result.userId);
  await audit({
    actorUserId: result.userId,
    action: result.created ? "user.created_via_google" : "user.signed_in_google",
    entityType: "user",
    entityId: result.userId,
  });

  // Read straight from the database: the session cookie was set on this
  // response, not on the request, so getSessionUser() would not see it yet.
  const [me] = await getDb()
    .select({ role: s.users.role, done: s.users.profileCompletedAt, name: s.users.displayName, phone: s.users.phone, email: s.users.email, staff: s.staffMembers.userId })
    .from(s.users)
    .leftJoin(s.staffMembers, eq(s.staffMembers.userId, s.users.id))
    .where(eq(s.users.id, result.userId))
    .limit(1);
  const profileComplete = Boolean(me?.done && me.name && me.phone && me.email);
  // Unlike LinkedIn, a Google account is as likely a patient as a doctor, so
  // only a doctor journey is sent to the register search; anyone else goes home.
  let dest = doctorDestination(next, profile.name);
  if (dest === "/") dest = me?.staff ? "/admin" : me?.role === "doctor" ? "/dashboard" : "/account";
  if (!profileComplete) dest = setupPath(dest);

  const res = NextResponse.redirect(new URL(dest, env.siteUrl));
  res.cookies.delete({ name: GOOGLE_COOKIE, path: "/api/auth/google" });
  return res;
}
