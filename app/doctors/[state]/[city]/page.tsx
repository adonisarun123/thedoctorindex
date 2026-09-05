import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { countIndexable, getAllDoctors, getDoctorsByLocality } from "@/lib/data";
import { CITY, LOCALITIES, LOCALITY_KEYS, SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { GATES } from "@/lib/seo/gates";
import { breadcrumbLd, collectionLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { absoluteUrl, paths } from "@/lib/site";

type Params = { state: string; city: string };

export function generateStaticParams(): Params[] {
  return [{ state: CITY.stateSlug, city: CITY.slug }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { state, city } = await params;
  if (state !== CITY.stateSlug || city !== CITY.slug) {
    return { title: "Not found", robots: { index: false, follow: false } };
  }
  return pageMeta({
    title: `Verified doctors in ${CITY.name}`,
    ogTitle: `Verified doctors in ${CITY.name} by speciality and locality`,
    description: `Browse verified ${CITY.name} doctors by speciality and locality. Every profile shows registration, qualification and current practice, dated when checked.`,
    path: `/doctors/${state}/${city}`,
  });
}

export default async function CityPage({ params }: { params: Promise<Params> }) {
  const { state, city } = await params;
  if (state !== CITY.stateSlug || city !== CITY.slug) notFound();

  const all = await getAllDoctors();
  const countBySpecialty = Object.fromEntries(await Promise.all(SPECIALTY_KEYS.map(async (k) => [k, await countIndexable(k)])));
  const localityInfo = Object.fromEntries(
    await Promise.all(
      LOCALITY_KEYS.map(async (k) => {
        const n = (await getDoctorsByLocality(k)).filter((d) => d.indexable).length;
        const counts = await Promise.all(SPECIALTY_KEYS.map((sk) => countIndexable(sk, k)));
        const qualifying = SPECIALTY_KEYS.filter((_, i) => counts[i] >= GATES.localitySpecialty);
        return [k, { n, qualifying }];
      }),
    ),
  ) as Record<string, { n: number; qualifying: typeof SPECIALTY_KEYS }>;
  const indexable = all.filter((d) => d.indexable).length;
  const practices = all.reduce((n, d) => n + d.practices.length, 0);
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Doctors by location", path: "/doctors" },
    { name: CITY.state, path: `/doctors/${state}` },
    { name: CITY.name },
  ];

  return (
    <>
      <RouteMeta
        data={{
          route: "City hub",
          title: `Verified doctors in ${CITY.name} by speciality and locality | The Doctor Index`,
          h1: `Verified doctors in ${CITY.name}`,
          canonical: absoluteUrl(`/doctors/${state}/${city}`),
          index: true,
          structuredData: "CollectionPage, BreadcrumbList",
          notes: [
            {
              label: "Locality links",
              text: `Only locality × speciality combinations that clear the ${GATES.localitySpecialty}-doctor gate are linked from here. The rest exist and serve, but are not linked into from a hub — we do not pass crawl equity to thin pages.`,
            },
          ],
        }}
      />
      <JsonLd data={[collectionLd({ name: `Verified doctors in ${CITY.name}`, path: `/doctors/${state}/${city}`, items: SPECIALTY_KEYS.map((k) => ({ name: `${SPECIALTIES[k].plural} in ${CITY.name}`, path: paths.citySpecialty(CITY.stateSlug, CITY.slug, SPECIALTIES[k].slug) })) }), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">
            {CITY.state} · {CITY.name}
          </span>
          <h1 style={{ marginTop: "10px" }}>Verified doctors in {CITY.name}</h1>
          <div className="upd">
            {indexable} indexable profiles · {practices} confirmed practice locations · 4 specialities
            open
          </div>

          <h2>By speciality</h2>
          <div className="deptgrid">
            {SPECIALTY_KEYS.map((k) => {
              const s = SPECIALTIES[k];
              return (
                <Link key={k} className="dept" href={paths.citySpecialty(state, city, s.slug)}>
                  <div className="d">{s.department}</div>
                  <div className="n">{s.plural}</div>
                  <div className="c">{countBySpecialty[k]} verified</div>
                </Link>
              );
            })}
          </div>

          <h2 id="localities">By locality</h2>
          <p style={{ maxWidth: "66ch" }}>
            A locality page for a speciality opens once it has {GATES.localitySpecialty} verified
            doctors with confirmed addresses. Localities below show how many verified doctors practise
            there across all four specialities; speciality-level pages appear as they qualify.
          </p>
          <div className="locgrid">
            {LOCALITY_KEYS.map((k) => {
              const { n, qualifying } = localityInfo[k];
              return (
                <div key={k} className="loc" style={{ flexDirection: "column", alignItems: "stretch", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="n">{LOCALITIES[k].name}</span>
                    <span className="c">{n} verified</span>
                  </div>
                  {qualifying.length ? (
                    <div className="quick" style={{ marginTop: "2px" }}>
                      {qualifying.map((sk) => (
                        <Link
                          key={sk}
                          className="chip"
                          href={paths.localitySpecialty(state, city, k, SPECIALTIES[sk].slug)}
                        >
                          {SPECIALTIES[sk].plural}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                      No speciality has reached the locality gate yet
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
