import { NextResponse, type NextRequest } from "next/server";

import { exchangeCode, fetchProfile, LI_COOKIE, linkedinConfigured, linkedinDestination, linkedinRedirectUri } from "@/lib/auth/linkedin";
import { safeEqual } from "@/lib/auth/hash";
import { eq } from "drizzle-orm";

import { createSession, setupPath } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { env } from "@/lib/env";
import { audit } from "@/lib/services/audit";
import { signInWithLinkedIn } from "@/lib/services/linkedin-signin";

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
 * Step two: LinkedIn sends the visitor back with a code. Check the state,
 * swap the code for the member's name and verified email, sign them in, and
 * send a doctor on to the register search with their name already typed.
 * Every failure returns to /sign-in with a short reason code, never a stack.
 */
export async function GET(req: NextRequest) {
  const cookie = readCookie(req.cookies.get(LI_COOKIE)?.value);
  const next = cookie?.n ?? "/";
  const back = (reason: string) => {
    const res = NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(next)}&li=${reason}`, env.siteUrl));
    res.cookies.delete({ name: LI_COOKIE, path: "/api/auth/linkedin" });
    return res;
  };

  const q = req.nextUrl.searchParams;
  if (q.get("error")) return back(q.get("error") === "user_cancelled_login" || q.get("error") === "user_cancelled_authorize" ? "cancelled" : "denied");
  if (!linkedinConfigured()) return back("unavailable");
  const state = q.get("state") ?? "";
  const code = q.get("code") ?? "";
  if (!cookie || !state || !code || !safeEqual(cookie.s, state)) return back("expired");

  const redirectUri = linkedinRedirectUri(env.siteUrl);
  const token = await exchangeCode(code, redirectUri);
  if (!token) return back("failed");
  const profile = await fetchProfile(token);
  if (!profile) return back("failed");
  if (!profile.email || !profile.emailVerified) return back("no_email");

  const result = await signInWithLinkedIn({ ...profile, email: profile.email }, next);
  if (!result) return back("disabled");

  await createSession(result.userId);
  await audit({
    actorUserId: result.userId,
    action: result.created ? "user.created_via_linkedin" : "user.signed_in_linkedin",
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
  // From the general sign-in page: a new LinkedIn account is almost always a
  // doctor, so it goes to the register search; a returning one goes home.
  let dest = linkedinDestination(next === "/" && result.created ? "/claim-profile/find" : next, profile.name);
  if (dest === "/") dest = me?.staff ? "/admin" : me?.role === "doctor" ? "/dashboard" : "/account";
  if (!profileComplete) dest = setupPath(dest);

  const res = NextResponse.redirect(new URL(dest, env.siteUrl));
  res.cookies.delete({ name: LI_COOKIE, path: "/api/auth/linkedin" });
  return res;
}
