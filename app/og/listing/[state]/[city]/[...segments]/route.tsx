import { countIndexable } from "@/lib/data";
import { resolveListing } from "@/lib/seo/listing";
import { ogCard } from "@/lib/seo/og";

export const dynamic = "force-static";
export const revalidate = 86400;

/**
 * Social card for the listing pages. Next's file-based `opengraph-image`
 * cannot live under a catch-all segment ("Catch-all must be the last part of
 * the URL"), so the listing page points `og:image` at this handler instead.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ state: string; city: string; segments: string[] }> }) {
  const r = resolveListing(await ctx.params);
  if (!r) return new Response("Not found", { status: 404 });
  const n = await countIndexable(r.specialty.key, r.locality?.key);
  const img = ogCard({
    eyebrow: r.specialty.department,
    title: `Verified ${r.specialty.plural} in ${r.placeName}`,
    subtitle: `${n} ${r.specialty.plural.toLowerCase()} with registration, qualification and current practice checked and dated.`,
    chips: ["Council-checked registration", "Dated practice details", "No paid placement"],
    kicker: `${n} verified`,
  });
  img.headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
  return img;
}
