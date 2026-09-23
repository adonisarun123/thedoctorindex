import { NextResponse, type NextRequest } from "next/server";

import { resolveTdiId } from "@/lib/services/tdi";

/**
 * `/d/TDI-CAR-00412` — the permanent short link printed in every TDI QR code.
 *
 * Resolves the ID to the doctor's current slug on every request, so a rename
 * or a merge never breaks a printed card. 308, and only briefly cached at the
 * edge, because the slug it points at can change while the ID cannot.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hit = await resolveTdiId(decodeURIComponent(id));
  if (!hit) {
    return new NextResponse("No public profile has this TDI ID.", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }
  const res = NextResponse.redirect(new URL(`/doctor/${hit.slug}`, req.url), 308);
  res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  res.headers.set("X-Robots-Tag", "noindex");
  return res;
}
