import { XML_HEADERS, articleEntries, renderUrlset } from "@/lib/seo/sitemap";

/**
 * Approved doctor articles first published on this site, plus the /articles
 * index. While nothing qualifies the file answers 404 and is left out of the
 * sitemap index (an empty urlset is schema-invalid).
 */
export const revalidate = 3600;

export async function GET() {
  const entries = await articleEntries();
  if (!entries.length) return new Response("No published articles yet.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(renderUrlset(entries), { headers: XML_HEADERS });
}
