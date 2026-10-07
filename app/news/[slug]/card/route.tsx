import { NextResponse, type NextRequest } from "next/server";

import { CARD_SIZES, CAROUSEL_SLIDES, type CardSize, carouselSlide, coverCard, doctorPhotoDataUri } from "@/lib/news/card";
import { getPublishedStory } from "@/lib/services/news";

export const runtime = "nodejs";

/**
 * `/news/<slug>/card?size=og|wide|standard|square|portrait[&slide=1-5][&download=1]`
 *
 * wide / standard / square are the 16:9, 4:3 and 1:1 images the NewsArticle
 * markup lists; `slide` renders the Instagram carousel (1080×1350). Live
 * stories only; cached at the edge, kept out of the index.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = process.env.DATABASE_URL ? await getPublishedStory(slug) : null;
  if (!row) return new NextResponse("No card for this story.", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  const q = req.nextUrl.searchParams;
  const photo = await doctorPhotoDataUri(row.doctors.find((d) => d.primary));
  const slideParam = q.get("slide");
  const slide = slideParam ? Math.min(CAROUSEL_SLIDES, Math.max(1, Number(slideParam) || 1)) : 0;
  const key = (q.get("size") ?? "wide") as CardSize;
  const sizeKey: CardSize = key in CARD_SIZES ? key : "wide";
  const img = slide ? carouselSlide(row.story, photo, slide) : coverCard(row.story, photo, sizeKey);
  const headers = new Headers(img.headers);
  headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  headers.set("X-Robots-Tag", "noindex");
  if (q.has("download")) headers.set("Content-Disposition", `attachment; filename="${slug}-${slide ? `slide-${slide}` : sizeKey}.png"`);
  return new NextResponse(img.body, { status: 200, headers });
}
