/**
 * Sign in with Google (OpenID Connect).
 *
 * Every stalled doctor signup in Oct 2026 used a Gmail address, so Google is
 * the one-tap path: no code to wait for, and the verified name comes back
 * with the email, so the register search can start straight away.
 *
 * Configure with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (Google Cloud
 * Console → APIs & Services → Credentials → OAuth client ID, type "Web
 * application"), register `<site>/api/auth/google/callback` as an authorised
 * redirect URI, and set NEXT_PUBLIC_GOOGLE_ENABLED=1 to show the button.
 * Scopes are openid, email, profile — no sensitive scopes, so no Google review.
 */

/** Short-lived cookie holding the OAuth state and the visitor's destination. */
export const GOOGLE_COOKIE = "tdi_g";

export const GOOGLE_AUTHORIZE = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";
export const GOOGLE_USERINFO = "https://openidconnect.googleapis.com/v1/userinfo";

export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function googleRedirectUri(siteUrl: string): string {
  return process.env.GOOGLE_REDIRECT_URI || `${siteUrl.replace(/\/$/, "")}/api/auth/google/callback`;
}

export function googleAuthorizeUrl(state: string, redirectUri: string): string {
  const u = new URL(GOOGLE_AUTHORIZE);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID ?? "");
  u.searchParams.set("redirect_uri", redirectUri);
  u.searchParams.set("state", state);
  u.searchParams.set("scope", "openid email profile");
  u.searchParams.set("prompt", "select_account");
  return u.toString();
}

export interface GoogleProfile {
  sub: string;
  name: string | null;
  givenName: string | null;
  familyName: string | null;
  email: string | null;
  emailVerified: boolean;
}

/** The userinfo response, normalised. Anything unexpected becomes null rather than throwing. */
export function parseGoogleUserinfo(raw: unknown): GoogleProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  const sub = str(r.sub);
  if (!sub) return null;
  const given = str(r.given_name);
  const family = str(r.family_name);
  return {
    sub,
    name: str(r.name) ?? ([given, family].filter(Boolean).join(" ") || null),
    givenName: given,
    familyName: family,
    email: str(r.email)?.toLowerCase() ?? null,
    // Strict: an unverified email must never sign anyone in.
    emailVerified: r.email_verified === true || r.email_verified === "true",
  };
}

export async function exchangeGoogleCode(code: string, redirectUri: string): Promise<string | null> {
  const res = await fetch(GOOGLE_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    console.error(`[google] token exchange failed · ${res.status}`);
    return null;
  }
  const json = (await res.json().catch(() => null)) as { access_token?: string } | null;
  return json?.access_token ?? null;
}

export async function fetchGoogleProfile(accessToken: string): Promise<GoogleProfile | null> {
  const res = await fetch(GOOGLE_USERINFO, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
  if (!res.ok) {
    console.error(`[google] userinfo failed · ${res.status}`);
    return null;
  }
  return parseGoogleUserinfo(await res.json().catch(() => null));
}
