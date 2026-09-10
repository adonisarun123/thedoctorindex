import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";
import { lookupRedirect } from "@/lib/seo/redirects";

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

  // Shared-cache the canonical browse pages.
  //
  // These render the same HTML for everyone: the header, the account menu and
  // the call/directions actions are client components that probe /api/me, so
  // nothing personal is in the document. Only bare URLs qualify — a query
  // string means a filter, a sort, a page or a location, and those stay live.
  //
  // s-maxage is short and stale-while-revalidate long: a visitor is served
  // from the edge immediately while the CDN refreshes behind them, so the
  // worst case after an import is a minute-old page, against the hour the
  // data cache already allows.
  if (isCacheableBrowsePage(request)) {
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600");
  }

  // Staging and preview hosts must never be indexed, whatever the page-level
  // gates say. FORCE_NOINDEX=1 adds an X-Robots-Tag header to every response,
  // which search engines honour for HTML and non-HTML alike (sitemaps included).
  if (env.forceNoindex) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
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
  // Run on everything except Next internals and static assets, so the
  // FORCE_NOINDEX header covers sitemaps and robots.txt too.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
