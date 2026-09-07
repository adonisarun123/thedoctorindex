import { GUIDES } from "@/lib/data/guides";
import { POLICIES } from "@/lib/data/policies";
import { countIndexable, countsByCity, countsByLocality, countsByState, listIndexableSlugs } from "@/lib/data";
import { getGeo } from "@/lib/data/geo";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { withOverride } from "@/lib/seo/override";
import { GATES, listingGate } from "@/lib/seo/gates";
import { absoluteUrl, paths } from "@/lib/site";
import { DOCTORS_PER_FILE, doctorFileCount, doctorFilePath, latestLastmod, toIsoDate, type SitemapEntry } from "@/lib/seo/sitemap-xml";

export * from "@/lib/seo/sitemap-xml";

/**
 * Sitemaps are split by page type — doctors, directory, editorial — so an
 * indexation problem can be isolated to one type instead of one 40,000-line
 * file. Every entry here is canonical, indexable and returns 200. Nothing that
 * fails a gate appears, because the same gate functions build this list and the
 * robots meta tag on the page itself.
 */

export async function doctorEntries(): Promise<SitemapEntry[]> {
  return (await listIndexableSlugs()).map((d) => ({
    loc: absoluteUrl(paths.doctor(d.slug)),
    lastmod: toIsoDate(d.lastVerifiedOn),
  }));
}

/** Entries for doctor file n (1-based; see sitemap-xml.ts), or null when n is beyond the last file. */
export async function doctorEntriesFile(n: number): Promise<SitemapEntry[] | null> {
  const all = await doctorEntries();
  if (n < 1 || (n > 1 && n > doctorFileCount(all.length))) return null;
  return all.slice((n - 1) * DOCTORS_PER_FILE, n * DOCTORS_PER_FILE);
}

/** Every sitemap the index should list, with the newest lastmod each carries. */
export async function indexEntries(): Promise<SitemapEntry[]> {
  const doctors = await doctorEntries();
  const files = doctorFileCount(doctors.length);
  const entries: SitemapEntry[] = [];
  for (let n = 1; n <= files; n++) {
    entries.push({ loc: absoluteUrl(doctorFilePath(n)), lastmod: latestLastmod(doctors.slice((n - 1) * DOCTORS_PER_FILE, n * DOCTORS_PER_FILE)) });
  }
  entries.push({ loc: absoluteUrl("/sitemaps/directory.xml") });
  entries.push({ loc: absoluteUrl("/sitemaps/editorial.xml"), lastmod: latestLastmod(editorialEntries()) });
  return entries;
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
