import { POSTS, abstract } from "@/lib/blog";
import { isoDate } from "@/lib/seo/structured-data";
import { SITE, absoluteUrl, paths } from "@/lib/site";

/**
 * RSS for the blog.
 *
 * A feed is not an SEO device — it is how the handful of people who follow a
 * publication like this actually follow it, and how aggregators pick a post up
 * without us pushing it anywhere. Cheap to maintain because it is generated
 * from the same registry the pages are.
 */
export const revalidate = 3600;

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** "17 Sep 2026" → an RFC 822 date, which is what RSS readers expect. */
function rfc822(display: string): string {
  const iso = isoDate(display);
  const d = iso ? new Date(`${iso}T09:00:00+05:30`) : new Date();
  return d.toUTCString();
}

export async function GET() {
  const self = absoluteUrl("/blog/feed.xml");
  const items = POSTS.map((p) => {
    const url = absoluteUrl(paths.blogPost(p.slug));
    return [
      "    <item>",
      `      <title>${escape(p.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${rfc822(p.publishedOn)}</pubDate>`,
      `      <description>${escape(p.standfirst)}</description>`,
      `      <content:encoded><![CDATA[<p>${abstract(p)}</p>]]></content:encoded>`,
      "    </item>",
    ].join("\n");
  }).join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    "  <channel>",
    `    <title>${escape(`${SITE.name} — notes on finding and checking a doctor`)}</title>`,
    `    <link>${absoluteUrl("/blog")}</link>`,
    `    <description>${escape("Registers, credentials, costs, records and patient rights in India. Non-clinical, and written to be checked.")}</description>`,
    "    <language>en-IN</language>",
    `    <lastBuildDate>${POSTS.length ? rfc822(POSTS[0].updatedOn) : new Date().toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${self}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600, s-maxage=3600" },
  });
}
