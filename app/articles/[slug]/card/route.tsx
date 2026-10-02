import { NextResponse, type NextRequest } from "next/server";

import { SHARE_SIZES, articleCard, type ShareSize } from "@/lib/articles/card";
import { getPublishedArticle } from "@/lib/services/articles";
import { ogCard } from "@/lib/seo/og";

/**
 * `/articles/<slug>/card?size=landscape|portrait|square[&download=1]` — the
 * share image for an approved article, in the size each network wants.
 * Published articles only; rendered on request and cached at the edge.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = process.env.DATABASE_URL ? await getPublishedArticle(slug) : null;
  if (!row) return new NextResponse("No card for this article.", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  const key = (req.nextUrl.searchParams.get("size") ?? "landscape") as ShareSize;
  const size = SHARE_SIZES[key] ?? SHARE_SIZES.landscape;
  const img = ogCard(articleCard(row), size);
  const headers = new Headers(img.headers);
  headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  headers.set("X-Robots-Tag", "noindex");
  if (req.nextUrl.searchParams.has("download")) headers.set("Content-Disposition", `attachment; filename="${slug}-${key in SHARE_SIZES ? key : "landscape"}.png"`);
  return new NextResponse(img.body, { status: 200, headers });
}
