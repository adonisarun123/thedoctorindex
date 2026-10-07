import { googleNewsEntries } from "@/lib/seo/sitemap";
import { SITE } from "@/lib/site";

/**
 * Google News sitemap (news:news extension): the last 48 hours of stories.
 * 404 while empty, so it never serves an invalid empty urlset.
 */
export const revalidate = 600;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export async function GET() {
  const rows = await googleNewsEntries();
  if (!rows.length) return new Response("No stories in the last 48 hours.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    ...rows.map((r) =>
      [
        "  <url>",
        `    <loc>${esc(r.loc)}</loc>`,
        "    <news:news>",
        `      <news:publication><news:name>${esc(SITE.name)}</news:name><news:language>en</news:language></news:publication>`,
        `      <news:publication_date>${r.published}</news:publication_date>`,
        `      <news:title>${esc(r.title)}</news:title>`,
        "    </news:news>",
        "  </url>",
      ].join("\n"),
    ),
    "</urlset>",
  ].join("\n");
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" } });
}
