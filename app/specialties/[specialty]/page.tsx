import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta, type RouteMetaData } from "@/components/RouteMeta";
import { countIndexable } from "@/lib/data";
import { CITY, SPECIALTY_KEYS, specialtyByKey } from "@/lib/data/taxonomy";
import { withOverride } from "@/lib/seo/override";
import { listingGate } from "@/lib/seo/gates";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { absoluteUrl, paths } from "@/lib/site";

type Params = { specialty: string };

export function generateStaticParams(): Params[] {
  return SPECIALTY_KEYS.map((k) => ({ specialty: k }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const specialty = specialtyByKey((await params).specialty);
  if (!specialty) return { title: "Not found", robots: { index: false, follow: false } };
  const count = await countIndexable(specialty.key);
  return {
    title: `${specialty.name} — verified ${specialty.plural.toLowerCase()} in India`,
    description: specialty.guide.slice(0, 155),
    alternates: { canonical: absoluteUrl(paths.specialty(specialty.key)) },
    robots: { index: (await withOverride(paths.specialty(specialty.key), listingGate("national", count, true))).indexable, follow: true },
  };
}

export default async function SpecialtyPage({ params }: { params: Promise<Params> }) {
  const specialty = specialtyByKey((await params).specialty);
  if (!specialty) notFound();

  const count = await countIndexable(specialty.key);
  const gate = await withOverride(paths.specialty(specialty.key), listingGate("national", count, true));
  const crumbs: Crumb[] = [
    { name: "Home", path: paths.home() },
    { name: "Specialities" },
    { name: specialty.name },
  ];

  const routeMeta: RouteMetaData = {
    route: "National speciality",
    title: `${specialty.name} — verified ${specialty.plural.toLowerCase()} in India | The Doctor Index`,
    h1: specialty.name,
    canonical: absoluteUrl(paths.specialty(specialty.key)),
    index: gate.indexable,
    gate: { name: "National speciality gate", checks: gate.checks },
    structuredData: "CollectionPage, BreadcrumbList",
    notes: [
      {
        label: "Why this indexes",
        text: "It carries original, medically reviewed guidance rather than only a list of doctors. Without that content it would be a thin hub and would stay out of the index.",
      },
      {
        label: "Synonyms",
        text: `${specialty.aliases.join(", ")} all resolve to this one page. Synonyms with the same search intent never get a URL of their own.`,
      },
    ],
  };

  return (
    <>
      <RouteMeta data={routeMeta} />
      <JsonLd data={breadcrumbLd(crumbs.map((c) => ({ name: c.name, path: c.path })))} />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="doc">
          <span className="eyebrow">{specialty.department}</span>
          <h1 style={{ marginTop: "10px" }}>{specialty.name}</h1>
          <div className="upd">
            {count} verified {specialty.plural.toLowerCase()} indexed · Bengaluru only in this build
          </div>

          <p>{specialty.guide}</p>

          <h2>Reasons people consult this speciality</h2>
          <ul>
            {specialty.when.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>

          <h2>Cities with verified supply</h2>
          <p>
            City pages open when the cluster passes its inventory gate. Only {CITY.name} qualifies in
            this build.
          </p>
          <div className="quick">
            <Link className="chip" href={paths.citySpecialty(CITY.stateSlug, CITY.slug, specialty.slug)}>
              {CITY.name} · {count} verified
            </Link>
          </div>

          <h2>Also called</h2>
          <p>
            {specialty.aliases.join(", ")}. These map to this one page — synonyms with the same
            intent do not get their own URL.
          </p>

          <p style={{ fontSize: "12.5px", color: "var(--muted)" }}>
            Medically reviewed · last substantive review {specialty.reviewedOn}.
          </p>
        </div>
      </div>
    </>
  );
}
