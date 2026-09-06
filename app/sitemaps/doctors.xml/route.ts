import { XML_HEADERS, doctorEntries, renderUrlset } from "@/lib/seo/sitemap";

/** Indexable doctor profiles only. A profile that fails its gate never appears here. */
/** Regenerated hourly so newly verified profiles reach the sitemap without a deploy. */
export const revalidate = 3600;

export async function GET() {
  return new Response(renderUrlset(await doctorEntries()), { headers: XML_HEADERS });
}
