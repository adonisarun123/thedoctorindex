import { NextResponse, type NextRequest } from "next/server";

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
  return NextResponse.next();
}

export const config = {
  matcher: ["/doctor/:path*", "/doctors/:path*", "/specialties/:path*"],
};
