import { randomBytes } from "node:crypto";

import { NextResponse, type NextRequest } from "next/server";

import { LI_COOKIE, linkedinAuthorizeUrl, linkedinConfigured, linkedinRedirectUri } from "@/lib/auth/linkedin";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

function safeNext(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next.slice(0, 300) : "/";
}

/**
 * Step one: remember where the visitor was going and a random state, then hand
 * them to LinkedIn. The state comes back on the callback and must match the
 * cookie, which is what stops a forged callback signing someone in.
 */
export async function GET(req: NextRequest) {
  const next = safeNext(req.nextUrl.searchParams.get("next"));
  if (!linkedinConfigured()) {
    return NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(next)}&li=unavailable`, env.siteUrl));
  }
  const state = randomBytes(24).toString("base64url");
  const res = NextResponse.redirect(linkedinAuthorizeUrl(state, linkedinRedirectUri(env.siteUrl)));
  res.cookies.set(LI_COOKIE, Buffer.from(JSON.stringify({ s: state, n: next })).toString("base64url"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/auth/linkedin",
    maxAge: 600,
  });
  return res;
}
