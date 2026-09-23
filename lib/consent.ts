/**
 * Cookie consent — pure helpers, shared by the client gate and the tests.
 *
 * The cookie holds `<version>.<choice>`, e.g. `2026-09-23.granted`. A value
 * written under an older CONSENT_VERSION reads as "no decision", so bumping the
 * version asks everyone again. Nothing here touches `document`; callers pass
 * the cookie string and hostname in, which keeps this testable and SSR-safe.
 */

export type ConsentChoice = "granted" | "denied";

/** 180 days. Long enough not to nag, short enough that a stale choice lapses. */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

/** Fired on window to reopen the banner (footer "Cookie settings"). */
export const CONSENT_OPEN_EVENT = "tdi:consent-open";

function cookieValue(cookieString: string, name: string): string | null {
  for (const part of cookieString.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) {
      try {
        return decodeURIComponent(part.slice(eq + 1).trim());
      } catch {
        return null;
      }
    }
  }
  return null;
}

/** The visitor's current choice, or null if none was made under this version. */
export function readConsent(cookieString: string, name: string, version: string): ConsentChoice | null {
  const raw = cookieValue(cookieString, name);
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot < 0) return null;
  const v = raw.slice(0, dot);
  const choice = raw.slice(dot + 1);
  if (v !== version) return null;
  return choice === "granted" || choice === "denied" ? choice : null;
}

/** The Set-Cookie string for a choice. `secure` only on https. */
export function consentCookie(name: string, version: string, choice: ConsentChoice, secure: boolean): string {
  return [
    `${name}=${encodeURIComponent(`${version}.${choice}`)}`,
    "Path=/",
    `Max-Age=${CONSENT_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
    ...(secure ? ["Secure"] : []),
  ].join("; ");
}

/** Names of the Google Analytics cookies present: `_ga` and `_ga_<stream>`. */
export function analyticsCookieNames(cookieString: string): string[] {
  const names = new Set<string>();
  for (const part of cookieString.split(";")) {
    const name = part.split("=")[0]?.trim() ?? "";
    if (name === "_ga" || name.startsWith("_ga_") || name === "_gid" || name === "_gat") names.add(name);
  }
  return [...names];
}

/**
 * Every domain a GA cookie may have been set on, so deletion can hit each one.
 * gtag writes to the widest domain it can (".thedoctorindex.com" from
 * "www.thedoctorindex.com"); a host-only cookie needs no domain attribute at all,
 * which the caller covers by also expiring with the domain omitted.
 */
export function cookieDomains(hostname: string): string[] {
  if (!hostname || hostname === "localhost" || /^[\d.]+$/.test(hostname)) return [];
  const labels = hostname.split(".");
  const out: string[] = [];
  for (let i = 0; i < labels.length - 1; i++) out.push(`.${labels.slice(i).join(".")}`);
  return out;
}

/** Set-Cookie strings that expire every analytics cookie on every candidate domain. */
export function analyticsCookieDeletions(cookieString: string, hostname: string): string[] {
  const out: string[] = [];
  for (const name of analyticsCookieNames(cookieString)) {
    out.push(`${name}=; Path=/; Max-Age=0`);
    for (const d of cookieDomains(hostname)) out.push(`${name}=; Path=/; Domain=${d}; Max-Age=0`);
  }
  return out;
}
