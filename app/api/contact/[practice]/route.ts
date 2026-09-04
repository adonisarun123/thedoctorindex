import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { rateLimit } from "@/lib/security/rate-limit";
import { track } from "@/lib/services/events";

export const dynamic = "force-dynamic";

/**
 * Contact details for one practice, released only to a signed-in person.
 * The practice phone is never in the public HTML, sitemaps or JSON-LD; it
 * leaves the server here, per request, rate-limited per account so a
 * signed-in scraper cannot walk the directory. Every release is counted as
 * the doctor's "call" or "directions" action.
 */
export async function GET(req: Request, ctx: { params: Promise<{ practice: string }> }) {
  const noindex = { "X-Robots-Tag": "noindex", "Cache-Control": "private, no-store" };
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "unavailable" }, { status: 503, headers: noindex });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "sign_in_required" }, { status: 401, headers: noindex });
  const { practice } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/.test(practice)) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noindex });

  const rl = await rateLimit(`contact:${user.id}`, Number(process.env.RATE_LIMIT_CONTACT_PER_HOUR ?? 60), 3600);
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: noindex });

  const row = await getDb().query.doctorPractices.findFirst({ where: eq(s.doctorPractices.id, practice), with: { facility: true, doctor: { columns: { id: true, status: true, phoneConsent: true } } } });
  if (!row || !row.active || row.doctor.status !== "published") return NextResponse.json({ error: "not_found" }, { status: 404, headers: noindex });

  const kind = new URL(req.url).searchParams.get("for") === "directions" ? "directions_clicked" : "call_clicked";
  await track(kind, { doctorId: row.doctor.id, practiceId: row.id, path: req.headers.get("referer") ? new URL(req.headers.get("referer")!).pathname : null });

  const phone = row.doctor.phoneConsent ? (row.phone ?? row.facility.phone ?? null) : null;
  const address = `${row.facility.name}, ${row.facility.address}${row.facility.postalCode ? " " + row.facility.postalCode : ""}`;
  const base = process.env.NEXT_PUBLIC_DIRECTIONS_URL_BASE ?? "https://www.google.com/maps/dir/?api=1&destination=";
  return NextResponse.json(
    {
      tel: phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null,
      phone,
      directions: row.facility.lat && row.facility.lng ? `${base}${row.facility.lat},${row.facility.lng}` : `${base}${encodeURIComponent(address)}`,
      address,
    },
    { headers: noindex },
  );
}
