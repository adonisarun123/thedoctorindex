import { XML_HEADERS, editorialEntries, renderUrlset } from "@/lib/seo/sitemap";

/** Trust and editorial documents. lastmod comes from the substantive review date. */
export const revalidate = 3600;

export async function GET() {
  return new Response(renderUrlset(editorialEntries()), { headers: XML_HEADERS });
}
