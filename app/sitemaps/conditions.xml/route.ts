import { XML_HEADERS, conditionEntries, renderUrlset } from "@/lib/seo/sitemap";

/**
 * Reviewed condition articles and the condition hubs that clear their gate.
 * Compiled drafts never appear. While nothing qualifies the file answers 404
 * and is left out of the index (an empty urlset is schema-invalid).
 */
export const revalidate = 3600;

export async function GET() {
  const entries = conditionEntries();
  if (!entries.length) return new Response("No reviewed condition articles yet.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(renderUrlset(entries), { headers: XML_HEADERS });
}
