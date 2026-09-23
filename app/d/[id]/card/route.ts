import { NextResponse, type NextRequest } from "next/server";

import { getDoctorBySlug } from "@/lib/data";
import { cardData, cardPng, cardSvg } from "@/lib/tdi/card";
import { resolveTdiId } from "@/lib/services/tdi";

/**
 * `/d/TDI-CAR-00412/card?format=png|svg[&download=1]` — the shareable QR card.
 *
 * Rendered on request, never stored. Only a currently published profile gets
 * a card: a suspended or retired page still resolves from an old printed code,
 * but no new card is handed out for it.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hit = await resolveTdiId(decodeURIComponent(id));
  const d = hit ? await getDoctorBySlug(hit.slug) : null;
  if (!hit || !d || (d.lifecycle && d.lifecycle !== "published")) {
    return new NextResponse("No card for this TDI ID.", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }

  const data = cardData(d, hit.tdiId);
  const format = req.nextUrl.searchParams.get("format") === "svg" ? "svg" : "png";
  const download = req.nextUrl.searchParams.has("download");
  const headers: Record<string, string> = {
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    "X-Robots-Tag": "noindex",
  };
  if (download) headers["Content-Disposition"] = `attachment; filename="${hit.tdiId}-QR.${format}"`;

  if (format === "svg") {
    return new NextResponse(cardSvg(data), { headers: { ...headers, "Content-Type": "image/svg+xml; charset=utf-8" } });
  }
  const img = cardPng(data);
  return new NextResponse(img.body, { headers: { ...headers, "Content-Type": "image/png" } });
}
