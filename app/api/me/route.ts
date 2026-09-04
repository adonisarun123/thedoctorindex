import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * Tiny session probe for the (static) header. Returns only what the menu
 * needs — never contact details — so public pages can stay prerendered while
 * the account menu hydrates client-side.
 */
export async function GET() {
  const u = process.env.DATABASE_URL ? await getSessionUser() : null;
  const body = u
    ? { signedIn: true, role: u.role, staff: u.role === "staff" && u.staffRoles.length > 0, home: u.role === "staff" && u.staffRoles.length ? "/admin" : u.role === "doctor" ? "/dashboard" : "/account" }
    : { signedIn: false };
  return NextResponse.json(body, { headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" } });
}
