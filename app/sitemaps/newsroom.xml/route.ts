import { XML_HEADERS, newsroomEntries, renderUrlset } from "@/lib/seo/sitemap";

/** Every live news story and the /news hub. 404 while there are none (an empty urlset is invalid). */
export const revalidate = 600;

export async function GET() {
  const entries = await newsroomEntries();
  if (!entries.length) return new Response("No published stories yet.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(renderUrlset(entries), { headers: XML_HEADERS });
}
