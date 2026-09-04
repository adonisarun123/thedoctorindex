import { XML_HEADERS, renderIndex } from "@/lib/seo/sitemap";
import { absoluteUrl } from "@/lib/site";

/**
 * Sitemap index. Split by page type so a coverage problem in Search Console
 * points at one class of page rather than the whole site.
 */
export function GET() {
  const body = renderIndex([
    absoluteUrl("/sitemaps/doctors.xml"),
    absoluteUrl("/sitemaps/directory.xml"),
    absoluteUrl("/sitemaps/editorial.xml"),
  ]);
  return new Response(body, { headers: XML_HEADERS });
}
