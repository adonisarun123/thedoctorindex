/**
 * Sitemap XML rendering and file arithmetic — pure, so it can be unit-tested
 * without loading the data layer. lib/seo/sitemap.ts builds the entries.
 */

export interface SitemapEntry {
  loc: string;
  /** W3C date (YYYY-MM-DD or full datetime). Only ever set from a real substantive update. */
  lastmod?: string;
}

const MONTHS: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

/** "29 Aug 2026" -> "2026-08-29". Returns undefined rather than guessing. */
export function toIsoDate(display: string): string | undefined {
  const m = /^(\d{2}) ([A-Za-z]{3}) (\d{4})$/.exec(display.trim());
  if (!m) return undefined;
  const month = MONTHS[m[2]];
  if (!month) return undefined;
  return `${m[3]}-${month}-${m[1]}`;
}

/**
 * The protocol caps a sitemap at 50,000 URLs and 50 MB. Doctor profiles are
 * served in files of SITEMAP_MAX_URLS_PER_FILE (default 45,000): the first is
 * /sitemaps/doctors.xml (the URL Search Console already knows), the rest
 * /sitemaps/doctors/2, /3 … The index lists however many exist right now.
 */
export const DOCTORS_PER_FILE = Math.min(50_000, Math.max(1_000, Number(process.env.SITEMAP_MAX_URLS_PER_FILE ?? 45_000) || 45_000));

export function doctorFileCount(total: number): number {
  return Math.max(1, Math.ceil(total / DOCTORS_PER_FILE));
}

export function doctorFilePath(n: number): string {
  return n <= 1 ? "/sitemaps/doctors.xml" : `/sitemaps/doctors/${n}`;
}

export function latestLastmod(entries: SitemapEntry[]): string | undefined {
  let best: string | undefined;
  for (const e of entries) if (e.lastmod && (!best || e.lastmod > best)) best = e.lastmod;
  return best;
}

/** The five characters the sitemap protocol requires entity-escaped inside <loc>. */
export function escapeXml(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

const W3C_DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?$/;

function lastmodNode(lastmod: string | undefined): string {
  return lastmod && W3C_DATE.test(lastmod) ? `\n    <lastmod>${lastmod}</lastmod>` : "";
}

/**
 * A urlset per sitemaps.org 0.9: loc (escaped, absolute, ≤2,048 chars) and an
 * optional W3C-datetime lastmod. changefreq and priority are omitted — the
 * major engines ignore them and they would only invite drift.
 */
export function renderUrlset(entries: SitemapEntry[]): string {
  const urls = entries
    .filter((e) => e.loc.length <= 2048)
    .map((e) => `  <url>\n    <loc>${escapeXml(e.loc)}</loc>${lastmodNode(e.lastmod)}\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n${urls}\n</urlset>\n`;
}

export function renderIndex(entries: Array<SitemapEntry | string>): string {
  const items = entries
    .map((e) => (typeof e === "string" ? { loc: e } : e))
    .map((e) => `  <sitemap>\n    <loc>${escapeXml(e.loc)}</loc>${lastmodNode(e.lastmod)}\n  </sitemap>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">\n${items}\n</sitemapindex>\n`;
}

export const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
} as const;
