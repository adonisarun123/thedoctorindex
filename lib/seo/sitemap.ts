import { POLICIES } from "@/lib/data/policies";
import { countIndexable, getAllDoctors } from "@/lib/data";
import { CITY, LOCALITY_KEYS, SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { listingGate } from "@/lib/seo/gates";
import { absoluteUrl, paths } from "@/lib/site";

/**
 * Sitemaps are split by page type — doctors, directory, editorial — so an
 * indexation problem can be isolated to one type instead of one 40,000-line
 * file. Every entry here is canonical, indexable and returns 200. Nothing that
 * fails a gate appears, because the same gate functions build this list and the
 * robots meta tag on the page itself.
 */

export interface SitemapEntry {
  loc: string;
  /** ISO date. Only ever set from a real substantive update. */
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

export function doctorEntries(): SitemapEntry[] {
  return getAllDoctors()
    .filter((d) => d.indexable)
    .map((d) => ({
      loc: absoluteUrl(paths.doctor(d.slug)),
      lastmod: toIsoDate(d.lastVerifiedOn),
    }));
}

export function directoryEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [{ loc: absoluteUrl(paths.home()) }];

  for (const key of SPECIALTY_KEYS) {
    const specialty = SPECIALTIES[key];

    if (listingGate("national", countIndexable(key), true).indexable) {
      entries.push({ loc: absoluteUrl(paths.specialty(specialty.key)) });
    }

    if (listingGate("city", countIndexable(key), true).indexable) {
      entries.push({
        loc: absoluteUrl(paths.citySpecialty(CITY.stateSlug, CITY.slug, specialty.slug)),
      });
    }

    for (const locality of LOCALITY_KEYS) {
      if (listingGate("locality", countIndexable(key, locality), true).indexable) {
        entries.push({
          loc: absoluteUrl(
            paths.localitySpecialty(CITY.stateSlug, CITY.slug, locality, specialty.slug),
          ),
        });
      }
    }
  }

  return entries;
}

export function editorialEntries(): SitemapEntry[] {
  return POLICIES.map((p) => ({
    loc: absoluteUrl(paths.policy(p.slug)),
    lastmod: toIsoDate(p.updatedOn),
  }));
}

export function renderUrlset(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""}\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function renderIndex(locs: string[]): string {
  const items = locs.map((loc) => `  <sitemap>\n    <loc>${loc}</loc>\n  </sitemap>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

export const XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
} as const;
