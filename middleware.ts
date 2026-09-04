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
export function middleware(request: NextRequest) {
  const target = lookupRedirect(request.nextUrl.pathname);
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

  // Staging and preview hosts must never be indexed, whatever the page-level
  // gates say. FORCE_NOINDEX=1 adds an X-Robots-Tag header to every response,
  // which search engines honour for HTML and non-HTML alike (sitemaps included).
  if (env.forceNoindex) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  // Run on everything except Next internals and static assets, so the
  // FORCE_NOINDEX header covers sitemaps and robots.txt too.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
