/**
 * Sign In with LinkedIn using OpenID Connect.
 *
 * LinkedIn product: "Sign In with LinkedIn using OpenID Connect" (scopes
 * openid, profile, email). It returns the member's name, a verified email and
 * a portrait URL — not their experience, education or headline; LinkedIn does
 * not release those to ordinary apps. The doctor's professional details come
 * from the medical council register instead (/claim-profile/find).
 *
 * Configure with LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET, register
 * `<site>/api/auth/linkedin/callback` as an authorised redirect URL in the
 * LinkedIn app, and set NEXT_PUBLIC_LINKEDIN_ENABLED=1 to show the button.
 */

/** Short-lived cookie holding the OAuth state and the visitor's destination. */
export const LI_COOKIE = "tdi_li";

export const LINKEDIN_AUTHORIZE = "https://www.linkedin.com/oauth/v2/authorization";
export const LINKEDIN_TOKEN = "https://www.linkedin.com/oauth/v2/accessToken";
export const LINKEDIN_USERINFO = "https://api.linkedin.com/v2/userinfo";

export function linkedinConfigured(): boolean {
  return Boolean(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET);
}

export function linkedinRedirectUri(siteUrl: string): string {
  return process.env.LINKEDIN_REDIRECT_URI || `${siteUrl.replace(/\/$/, "")}/api/auth/linkedin/callback`;
}

export function linkedinAuthorizeUrl(state: string, redirectUri: string): string {
  const u = new URL(LINKEDIN_AUTHORIZE);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", process.env.LINKEDIN_CLIENT_ID ?? "");
  u.searchParams.set("redirect_uri", redirectUri);
  u.searchParams.set("state", state);
  u.searchParams.set("scope", "openid profile email");
  return u.toString();
}

export interface LinkedInProfile {
  sub: string;
  name: string | null;
  givenName: string | null;
  familyName: string | null;
  email: string | null;
  emailVerified: boolean;
  picture: string | null;
}

/** The userinfo response, normalised. Anything unexpected becomes null rather than throwing. */
export function parseUserinfo(raw: unknown): LinkedInProfile | null {
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
    // LinkedIn sends a boolean; be strict about it — an unverified email must not sign anyone in.
    emailVerified: r.email_verified === true || r.email_verified === "true",
    picture: str(r.picture),
  };
}

export async function exchangeCode(code: string, redirectUri: string): Promise<string | null> {
  const res = await fetch(LINKEDIN_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
      client_secret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    console.error(`[linkedin] token exchange failed · ${res.status}`);
    return null;
  }
  const json = (await res.json().catch(() => null)) as { access_token?: string } | null;
  return json?.access_token ?? null;
}

export async function fetchProfile(accessToken: string): Promise<LinkedInProfile | null> {
  const res = await fetch(LINKEDIN_USERINFO, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
  if (!res.ok) {
    console.error(`[linkedin] userinfo failed · ${res.status}`);
    return null;
  }
  return parseUserinfo(await res.json().catch(() => null));
}

/** Where a doctor lands after LinkedIn — shared with every sign-in route (lib/auth/doctor-journey.ts). */
export { doctorDestination as linkedinDestination } from "@/lib/auth/doctor-journey";
