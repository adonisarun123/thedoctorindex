import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { countsByLocalityAll } from "@/lib/data";
import { getGeo } from "@/lib/data/geo";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { AREA_ARTICLE_EXCLUDED, AREA_ARTICLE_MIN, isCitywideLocality } from "@/lib/content/area-article";
import { breadcrumbLd, collectionLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { absoluteUrl, paths } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Doctors by area and speciality",
  description: `Every neighbourhood with ${AREA_ARTICLE_MIN} or more doctors of one speciality on The Doctor Index — orthopaedic surgeons in HSR Layout, gynaecologists in Koramangala and more — each listing every doctor, claimed or not.`,
  path: "/doctors/by-area",
});

/**
 * Area hub (8 Oct 2026). Links every locality × speciality page that carries an
 * area article, grouped by city, so those pages are one click from a crawlable
 * index rather than reachable only through city pages and the sitemap.
 * A static segment, so it takes precedence over /doctors/[state].
 */
export const revalidate = 3600;

interface Entry { label: string; path: string; n: number }

export default async function AreasHubPage() {
  const [geo, rows] = await Promise.all([getGeo(), countsByLocalityAll("published")]);
  const byCity = new Map<string, { city: string; state: string; entries: Entry[] }>();
  for (const r of rows) {
    if (r.n < AREA_ARTICLE_MIN || !r.localityKey || AREA_ARTICLE_EXCLUDED.has(r.specialty)) continue;
    const spec = SPECIALTIES[r.specialty as keyof typeof SPECIALTIES];
    const loc = geo.locality(r.localityKey);
    const city = geo.city(r.stateSlug, r.citySlug);
    if (!spec || !loc || !city || isCitywideLocality(loc)) continue;
    const k = `${city.stateSlug}/${city.slug}`;
    const g = byCity.get(k) ?? { city: city.name, state: city.state, entries: [] };
    g.entries.push({ label: `${spec.plural} in ${loc.name}`, path: paths.localitySpecialty(city.stateSlug, city.slug, loc.slug, spec.slug), n: r.n });
    byCity.set(k, g);
  }
  const groups = [...byCity.values()]
    .map((g) => ({ ...g, entries: g.entries.sort((a, b) => b.n - a.n || a.label.localeCompare(b.label)) }))
    .sort((a, b) => b.entries.length - a.entries.length || a.city.localeCompare(b.city));
  const total = groups.reduce((a, g) => a + g.entries.length, 0);
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Doctors by location", path: "/doctors" },
    { name: "By area", path: "/doctors/by-area" },
  ];

  return (
    <>
      <RouteMeta
        data={{
          route: "Area hub",
          title: "Doctors by area and speciality | The Doctor Index",
          h1: "Doctors by area and speciality",
          canonical: absoluteUrl("/doctors/by-area"),
          index: true,
          structuredData: "CollectionPage, BreadcrumbList",
          notes: [{ label: "Threshold", text: `A locality × speciality appears here at ${AREA_ARTICLE_MIN}+ published doctors. City-wide "localities" (Indore in Indore) are left out because they repeat the city page.` }],
        }}
      />
      <JsonLd
        data={[
          collectionLd({ name: "Doctors by area and speciality", path: "/doctors/by-area", items: groups.flatMap((g) => g.entries.map((e) => ({ name: e.label, path: e.path }))) }),
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Browse by area</span>
          <h1 style={{ marginTop: "10px" }}>Doctors by area and speciality</h1>
          <div className="upd">
            {total.toLocaleString("en-IN")} area guides · {groups.length.toLocaleString("en-IN")} cities
          </div>
          <p style={{ maxWidth: "66ch" }}>
            Each guide covers one speciality in one neighbourhood with at least {AREA_ARTICLE_MIN} doctors on record. It lists
            every one of them — including doctors who have not yet claimed their profile — with where they practise and what
            has been checked.
          </p>

          {groups.map((g) => (
            <section key={`${g.state}-${g.city}`}>
              <h2>
                {g.city}, {g.state}
              </h2>
              <ul style={{ columns: "2 300px", paddingLeft: "20px" }}>
                {g.entries.map((e) => (
                  <li key={e.path} style={{ breakInside: "avoid", marginBottom: "4px" }}>
                    <Link href={e.path}>{e.label}</Link> <span style={{ color: "var(--muted)" }}>({e.n})</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
