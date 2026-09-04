import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { getAllDoctors } from "@/lib/data";
import { CITY } from "@/lib/data/taxonomy";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { absoluteUrl, paths } from "@/lib/site";

type Params = { state: string };

export function generateStaticParams(): Params[] {
  return [{ state: CITY.stateSlug }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { state } = await params;
  if (state !== CITY.stateSlug) return { title: "Not found", robots: { index: false, follow: false } };
  return {
    title: `Verified doctors in ${CITY.state}`,
    description: `Cities in ${CITY.state} with verified, currently practising doctors on The Doctor Index.`,
    alternates: { canonical: absoluteUrl(`/doctors/${state}`) },
    robots: { index: true, follow: true },
  };
}

export default async function StatePage({ params }: { params: Promise<Params> }) {
  const { state } = await params;
  if (state !== CITY.stateSlug) notFound();

  const indexable = (await getAllDoctors()).filter((d) => d.indexable).length;
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Doctors by location", path: "/doctors" },
    { name: CITY.state },
  ];

  const cities: Array<{ name: string; slug: string; open: boolean; count?: number }> = [
    { name: CITY.name, slug: CITY.slug, open: true, count: indexable },
    { name: "Mysuru", slug: "mysuru", open: false },
    { name: "Mangaluru", slug: "mangaluru", open: false },
    { name: "Hubballi-Dharwad", slug: "hubballi-dharwad", open: false },
    { name: "Belagavi", slug: "belagavi", open: false },
  ];

  return (
    <>
      <RouteMeta
        data={{
          route: "State",
          title: `Verified doctors in ${CITY.state} | The Doctor Index`,
          h1: `Verified doctors in ${CITY.state}`,
          canonical: absoluteUrl(`/doctors/${state}`),
          index: true,
          structuredData: "CollectionPage, BreadcrumbList",
          notes: [
            {
              label: "Why this indexes",
              text: "A state page indexes when verified inventory makes it useful. Karnataka has one open city with indexable supply; the others are listed without links.",
            },
          ],
        }}
      />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">{CITY.state}</span>
          <h1 style={{ marginTop: "10px" }}>Verified doctors in {CITY.state}</h1>
          <div className="upd">{indexable} indexable profiles · 1 city open</div>

          <h2>Cities</h2>
          <div className="locgrid">
            {cities.map((c) =>
              c.open ? (
                <Link key={c.slug} className="loc" href={`/doctors/${state}/${c.slug}`}>
                  <span className="n">{c.name}</span>
                  <span className="c">{c.count} verified</span>
                </Link>
              ) : (
                <div key={c.slug} className="loc off" aria-disabled="true">
                  <span className="n">{c.name}</span>
                  <span className="c">not yet open</span>
                </div>
              ),
            )}
          </div>

          <p style={{ marginTop: "22px", fontSize: "13.5px", color: "var(--muted)" }}>
            Cities open when a speciality cluster passes its inventory gate. Doctors anywhere in{" "}
            {CITY.state} can <Link href={paths.addDoctor()}>create a profile</Link> now.
          </p>
        </div>
      </div>
    </>
  );
}
