import { NEWS_CATEGORIES, NEWS_DESK, isCategory } from "@/lib/news/format";
import { listPublishedStories } from "@/lib/services/news";
import { SITE, absoluteUrl, paths } from "@/lib/site";

/** RSS for the Newsdesk: the latest 30 stories, with highlights in the item body. */
export const revalidate = 600;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const rows = process.env.DATABASE_URL ? await listPublishedStories({ limit: 30 }) : [];
  const items = rows
    .map((r) => {
      const url = absoluteUrl(paths.newsStory(r.slug));
      const html = `<p>${esc(r.dek)}</p><ol>${r.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ol>`;
      return [
        "    <item>",
        `      <title>${esc(r.headline)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${(r.publishedAt ?? new Date()).toUTCString()}</pubDate>`,
        `      <category>${esc(isCategory(r.category) ? NEWS_CATEGORIES[r.category].label : "News")}</category>`,
        `      <description>${esc(r.dek)}</description>`,
        `      <content:encoded><![CDATA[${html}]]></content:encoded>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    "  <channel>",
    `    <title>${esc(`${NEWS_DESK} — ${SITE.name}`)}</title>`,
    `    <link>${absoluteUrl(paths.news())}</link>`,
    `    <description>${esc("Achievements, firsts, research and appointments of Indian doctors at home and abroad. Every story sourced.")}</description>`,
    "    <language>en-IN</language>",
    `    <lastBuildDate>${(rows[0]?.publishedAt ?? new Date()).toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${absoluteUrl("/news/feed.xml")}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=600, s-maxage=600" } });
}
