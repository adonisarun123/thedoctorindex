import { XML_HEADERS, doctorEntriesFile, renderUrlset } from "@/lib/seo/sitemap";

/**
 * Indexable doctor profiles, file 1 of N. A profile that fails its gate never
 * appears here. While no profile passes, the file is not listed in the index
 * and this route answers 404 rather than serving an empty (schema-invalid)
 * urlset. Regenerated hourly.
 */
export const revalidate = 3600;

export async function GET() {
  const entries = await doctorEntriesFile(1);
  if (!entries) return new Response("No indexable profiles yet; this sitemap appears in /sitemap.xml once one passes its gate.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=3600" } });
  return new Response(renderUrlset(entries), { headers: XML_HEADERS });
}
