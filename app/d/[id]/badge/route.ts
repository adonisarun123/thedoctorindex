import { NextResponse, type NextRequest } from "next/server";

import { getDoctorBySlug } from "@/lib/data";
import { resolveTdiId } from "@/lib/services/tdi";
import { badgeSvg } from "@/lib/tdi/badge";
import { registrationState } from "@/lib/verification";

/**
 * `/d/TDI-CAR-00412/badge` — the badge image a doctor embeds on their own site.
 *
 * Reads "Registration verified" only while the register check is on file, so
 * a badge already pasted on a clinic site changes to "Listed on" by itself if
 * the check lapses. Published profiles only; anything else is a 404 so a
 * retired doctor's site stops showing it. Short edge cache for the same reason.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hit = await resolveTdiId(decodeURIComponent(id));
  const d = hit ? await getDoctorBySlug(hit.slug) : null;
  if (!hit || !d || (d.lifecycle && d.lifecycle !== "published")) {
    return new NextResponse("No badge for this TDI ID.", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }
  return new NextResponse(badgeSvg(registrationState(d) === "verified" ? "verified" : "listed"), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "noindex",
    },
  });
}
