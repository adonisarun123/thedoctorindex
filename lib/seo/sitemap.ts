import { GUIDES } from "@/lib/data/guides";
import { POLICIES } from "@/lib/data/policies";
import { countsByCity, countsByCitySpecialty, countsByLocalityAll, countsBySpecialty, countsByState, listIndexableSlugs } from "@/lib/data";
import { getGeo } from "@/lib/data/geo";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { withOverride } from "@/lib/seo/override";
import { listingGate, type GateResult } from "@/lib/seo/gates";
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
  if (n < 1 || !all.length || n > doctorFileCount(all.length)) return null;
  return all.slice((n - 1) * DOCTORS_PER_FILE, n * DOCTORS_PER_FILE);
}

/** Every sitemap the index should list, with the newest lastmod each carries. */
export async function indexEntries(): Promise<SitemapEntry[]> {
  const doctors = await doctorEntries();
  // An empty <urlset> is invalid against the schema (it needs at least one
  // <url>), so a doctors file with nothing to list is left out of the index
  // and answers 404 until a profile clears its gate.
  const files = doctors.length ? doctorFileCount(doctors.length) : 0;
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
 * (place x speciality) listing that clears its inventory gate. Counts use the
 * "eligible" measure — the same pool the profile index mode publishes — so the
 * browse pages are submitted exactly when the profiles beneath them are.
 *
 * Five grouped queries, not one per combination: at 24,000 profiles the old
 * per-city loop was several hundred round trips and took minutes, which a
 * serverless route does not have.
 */
export async function directoryEntries(): Promise<SitemapEntry[]> {
  const [geo, stateCounts, cityTotals, nationalCounts, byCitySpecialty, byLocalitySpecialty] = await Promise.all([
    getGeo(),
    countsByState("eligible"),
    countsByCity(undefined, "eligible"),
    countsBySpecialty(undefined, "eligible"),
    countsByCitySpecialty("eligible"),
    countsByLocalityAll("eligible"),
  ]);

  const entries: SitemapEntry[] = [
    { loc: absoluteUrl(paths.home()) },
    { loc: absoluteUrl("/doctors") },
    { loc: absoluteUrl("/specialties") },
  ];
  for (const st of geo.states) if ((stateCounts[st.slug] ?? 0) > 0) entries.push({ loc: absoluteUrl(`/doctors/${st.slug}`) });
  for (const c of cityTotals) if (c.n > 0 && geo.city(c.stateSlug, c.citySlug)) entries.push({ loc: absoluteUrl(`/doctors/${c.stateSlug}/${c.citySlug}`) });

  // Gate decisions can be overridden per route by staff; the override table is
  // cached, so asking per candidate costs nothing extra.
  const keep = async (path: string, gate: GateResult) => (await withOverride(path, gate)).indexable;

  for (const key of SPECIALTY_KEYS) {
    const specialty = SPECIALTIES[key];
    const hasGuide = Boolean(specialty.guide);
    if (await keep(paths.specialty(key), listingGate("national", nationalCounts[key] ?? 0, hasGuide))) {
      entries.push({ loc: absoluteUrl(paths.specialty(key)) });
    }
  }

  for (const r of byCitySpecialty) {
    const specialty = SPECIALTIES[r.specialty];
    if (!specialty || !geo.city(r.stateSlug, r.citySlug)) continue;
    const path = paths.citySpecialty(r.stateSlug, r.citySlug, specialty.slug);
    if (await keep(path, listingGate("city", r.n, Boolean(specialty.guide)))) entries.push({ loc: absoluteUrl(path) });
  }

  for (const r of byLocalitySpecialty) {
    const specialty = SPECIALTIES[r.specialty];
    if (!specialty || !r.localityKey) continue;
    const loc = geo.locality(r.localityKey);
    if (!loc || loc.stateSlug !== r.stateSlug || loc.citySlug !== r.citySlug) continue;
    const path = paths.localitySpecialty(r.stateSlug, r.citySlug, loc.slug, specialty.slug);
    if (await keep(path, listingGate("locality", r.n, Boolean(specialty.guide)))) entries.push({ loc: absoluteUrl(path) });
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
