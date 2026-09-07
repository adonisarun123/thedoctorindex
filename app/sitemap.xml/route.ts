import { XML_HEADERS, indexEntries, renderIndex } from "@/lib/seo/sitemap";

/**
 * Sitemap index. Split by page type so a coverage problem in Search Console
 * points at one class of page rather than the whole site. Doctor profiles are
 * further split into files of at most SITEMAP_MAX_URLS_PER_FILE; the index
 * grows with the directory and is regenerated hourly, so a profile that
 * clears its gate is listed within the hour without a deploy.
 */
export const revalidate = 3600;

export async function GET() {
  return new Response(renderIndex(await indexEntries()), { headers: XML_HEADERS });
}
