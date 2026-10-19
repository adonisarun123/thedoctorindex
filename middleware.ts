import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";
import { lookupRedirect } from "@/lib/seo/redirects";
import { SESSION_HINT_COOKIE } from "@/lib/session-hint";
import { parseReferralCode, TRIBE, tribeChannel } from "@/lib/tribe";

/**
 * Permanent redirects for renamed and merged profiles.
 *
 * A 301 here is the only correct answer for a URL whose content moved. A
 * removed profile with no successor is deliberately absent from the table: it
 * returns 404/410 from the route instead. Redirecting every dead profile to the
 * homepage would be a soft-404 farm.
 */
/**
 * City identities that were merged, and the slug they became.
 *
 * The imports named Bengaluru three ways, so the city was published as two URL
 * trees with its doctors split between them. Merging the data fixes the pages;
 * these keep the URLs that were already crawled under the old spellings from
 * turning into 404s. A prefix match, because everything below a city slug —
 * the city page, each speciality, each locality — moves with it.
 */
const MERGED_CITY_SLUGS: Array<[string, string]> = [
  ["/doctors/karnataka/bangalore-urban", "/doctors/karnataka/bengaluru"],
  ["/doctors/karnataka/bangalore", "/doctors/karnataka/bengaluru"],
];

function mergedCityRedirect(pathname: string): string | null {
  for (const [from, to] of MERGED_CITY_SLUGS) {
    if (pathname === from || pathname.startsWith(`${from}/`)) return to + pathname.slice(from.length);
  }
  return null;
}

export function middleware(request: NextRequest) {
  const target = lookupRedirect(request.nextUrl.pathname) ?? mergedCityRedirect(request.nextUrl.pathname);
  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 301);
  }

  // Cheap first gate for authenticated areas: no session cookie, no render.
  // The real check (signature, revocation, role) happens in each page via
  // requireStaff()/requireDoctor() — layouts alone cannot protect pages
  // because Next renders layout and page in parallel.
  const path = request.nextUrl.pathname;
  const protectedArea = (path.startsWith("/admin") && path !== "/admin/sign-in") || (path.startsWith("/dashboard") && path !== "/dashboard/sign-in") || path.startsWith("/account");
  if (protectedArea && !request.cookies.get(process.env.AUTH_COOKIE_NAME ?? "tdi_session")) {
    const url = request.nextUrl.clone();
    url.pathname = path.startsWith("/admin") ? "/admin/sign-in" : "/sign-in";
    url.search = path.startsWith("/admin") ? "" : `?next=${encodeURIComponent(path)}`;
    const r = NextResponse.redirect(url, 307);
    r.headers.set("X-Robots-Tag", "noindex, nofollow");
    return r;
  }

  const response = NextResponse.next();

  // Grow Your Tribe: an invite link (/join?ref=DRXXXXXX&ch=whatsapp) is
  // remembered on the invitee's browser so the claim or new-profile action
  // they take later — usually after a sign-in round trip — can credit the
  // colleague who sent it. Malformed codes are dropped, never stored.
  if (path === "/join" && TRIBE.enabled) {
    const ref = parseReferralCode(request.nextUrl.searchParams.get("ref"));
    if (ref) {
      const opts = { path: "/", httpOnly: true, sameSite: "lax" as const, secure: request.nextUrl.protocol === "https:", maxAge: TRIBE.cookieDays * 86400 };
      response.cookies.set(TRIBE.cookieName, ref, opts);
      response.cookies.set(`${TRIBE.cookieName}_ch`, tribeChannel(request.nextUrl.searchParams.get("ch")), opts);
    }
  }

  // Shared-cache the canonical browse pages.
  //
  // These render the same HTML for everyone: the header, the account menu and
  // the call/directions actions are client components that probe /api/me, so
  // nothing personal is in the document. Only bare URLs qualify — a query
  // string means a filter, a sort, a page or a location, and those stay live.
  //
  // The city × speciality and locality × speciality listings render per
  // request (force-dynamic: they read ?page and filter params), so this
  // header is the only thing between a crawler walking ~12,000 listing URLs
  // and a full render on every hit. Oct 2026: at s-maxage=60 that walk cost
  // more than every other project on the account combined. An hour at the
  // edge, a day of stale-while-revalidate: a visitor is served from the edge
  // immediately while the CDN refreshes behind them; the worst case after an
  // import is an hour-old listing.
  if (isCacheableBrowsePage(request)) {
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  }

  // Signed-in hint for client components. The session cookie is httpOnly, so
  // the header's account menu and the gated call/directions buttons could
  // only learn "signed out" by calling /api/me — a function invocation on
  // every page view for every anonymous visitor. This readable flag (no
  // secret in it; /api/me stays the authority) lets them skip that call when
  // there is no session at all. Kept in step with the session cookie here
  // because every page request passes through.
  syncSessionHint(request, response);

  // Staging and preview hosts must never be indexed, whatever the page-level
  // gates say. FORCE_NOINDEX=1 adds an X-Robots-Tag header to every response,
  // which search engines honour for HTML and non-HTML alike (sitemaps included).
  if (env.forceNoindex) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

function syncSessionHint(request: NextRequest, response: NextResponse): void {
  const hasSession = Boolean(request.cookies.get(process.env.AUTH_COOKIE_NAME ?? "tdi_session"));
  const hasHint = request.cookies.get(SESSION_HINT_COOKIE)?.value === "1";
  if (hasSession && !hasHint) {
    response.cookies.set(SESSION_HINT_COOKIE, "1", { path: "/", sameSite: "lax", secure: request.nextUrl.protocol === "https:", maxAge: 30 * 86400 });
  } else if (!hasSession && hasHint) {
    response.cookies.delete(SESSION_HINT_COOKIE);
  }
}

/**
 * A browse page that is safe to hold in a shared cache: a plain GET, no query
 * string, no session cookie, and one of the listing or hub routes.
 */
function isCacheableBrowsePage(request: NextRequest): boolean {
  if (request.method !== "GET") return false;
  if (request.nextUrl.search) return false;
  if (request.cookies.get(process.env.AUTH_COOKIE_NAME ?? "tdi_session")) return false;
  const p = request.nextUrl.pathname;
  return p === "/doctors" || p.startsWith("/doctors/") || p === "/specialties" || p.startsWith("/specialties/");
}

export const config = {
  // Run on pages, sitemaps and robots.txt (so FORCE_NOINDEX covers them), but
  // not on Next internals, /api/* or static files: middleware is billed as an
  // invocation per request, and none of its work applies to JSON endpoints,
  // icons or images. /api/* is already Disallowed in robots.txt.
  matcher: ["/((?!_next/static|_next/image|api/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?|css|js|map)$).*)"],
};
