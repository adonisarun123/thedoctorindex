import { GUIDES } from "@/lib/data/guides";
import { POLICIES } from "@/lib/data/policies";
import { countIndexable, countsByCity, countsByLocality, countsByState, listIndexableSlugs } from "@/lib/data";
import { getGeo } from "@/lib/data/geo";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { withOverride } from "@/lib/seo/override";
import { GATES, listingGate } from "@/lib/seo/gates";
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

export async function doctorEntries(): Promise<SitemapEntry[]> {
  return (await listIndexableSlugs()).map((d) => ({
    loc: absoluteUrl(paths.doctor(d.slug)),
    lastmod: toIsoDate(d.lastVerifiedOn),
  }));
}

/**
 * Browse pages: every state and city that exists as data, then each
 * (place × speciality) listing that clears its inventory gate. One GROUP BY
 * per speciality rather than one query per page, so this scales to
 * hundreds of cities.
 */
export async function directoryEntries(): Promise<SitemapEntry[]> {
  const geo = await getGeo();
  const entries: SitemapEntry[] = [
    { loc: absoluteUrl(paths.home()) },
    { loc: absoluteUrl("/doctors") },
    { loc: absoluteUrl("/specialties") },
  ];
  const stateCounts = await countsByState();
  for (const st of geo.states) if ((stateCounts[st.slug] ?? 0) > 0) entries.push({ loc: absoluteUrl(`/doctors/${st.slug}`) });
  const cityTotals = await countsByCity();
  for (const c of cityTotals) if (c.n > 0 && geo.city(c.stateSlug, c.citySlug)) entries.push({ loc: absoluteUrl(`/doctors/${c.stateSlug}/${c.citySlug}`) });

  for (const key of SPECIALTY_KEYS) {
    const specialty = SPECIALTIES[key];
    const hasGuide = Boolean(specialty.guide);
    const national = await countIndexable(key);
    if ((await withOverride(paths.specialty(key), listingGate("national", national, hasGuide))).indexable) {
      entries.push({ loc: absoluteUrl(paths.specialty(key)) });
    }
    const cities = await countsByCity(key);
    for (const c of cities) {
      if (!geo.city(c.stateSlug, c.citySlug)) continue;
      const cityPath = paths.citySpecialty(c.stateSlug, c.citySlug, specialty.slug);
      if ((await withOverride(cityPath, listingGate("city", c.n, hasGuide))).indexable) entries.push({ loc: absoluteUrl(cityPath) });
      if (c.n < GATES.localitySpecialty) continue;
      const byLocality = await countsByLocality(c.citySlug, key);
      for (const [locKey, n] of Object.entries(byLocality)) {
        const loc = geo.locality(locKey);
        if (!loc || loc.stateSlug !== c.stateSlug) continue;
        const locPath = paths.localitySpecialty(c.stateSlug, c.citySlug, loc.slug, specialty.slug);
        if ((await withOverride(locPath, listingGate("locality", n, hasGuide))).indexable) entries.push({ loc: absoluteUrl(locPath) });
      }
    }
  }
  return entries;
}

export function editorialEntries(): SitemapEntry[] {
  return [
    { loc: absoluteUrl("/about") },
    { loc: absoluteUrl(paths.forDoctors()) },
    { loc: absoluteUrl("/health-guides") },
    ...GUIDES.map((g) => ({
      loc: absoluteUrl(`/health-guides/${g.slug}`),
      lastmod: toIsoDate(g.reviewedOn),
    })),
    ...POLICIES.map((p) => ({
      loc: absoluteUrl(paths.policy(p.slug)),
      lastmod: toIsoDate(p.updatedOn),
    })),
  ];
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
