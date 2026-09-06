import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta, type RouteMetaData } from "@/components/RouteMeta";
import { countIndexable, countsByCity } from "@/lib/data";
import { getGeo } from "@/lib/data/geo";
import { SPECIALTY_KEYS, specialtyByKey } from "@/lib/data/taxonomy";
import { withOverride } from "@/lib/seo/override";
import { GATES, listingGate } from "@/lib/seo/gates";
import { breadcrumbLd, specialtyLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { absoluteUrl, paths } from "@/lib/site";

type Params = { specialty: string };

/** Counts on the hub are live data: prerendered, then refreshed hourly. */
export const revalidate = 3600;

export function generateStaticParams(): Params[] {
  return SPECIALTY_KEYS.map((k) => ({ specialty: k }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const specialty = specialtyByKey((await params).specialty);
  if (!specialty) return { title: "Not found", robots: { index: false, follow: false } };
  const count = await countIndexable(specialty.key);
  return pageMeta({
    title: `${specialty.name}: verified ${specialty.plural.toLowerCase()} in India`,
    ogTitle: `${specialty.name} — when to consult ${specialty.aOne}, and verified ${specialty.plural.toLowerCase()} in India`,
    description: `When to consult ${specialty.aOne}, reviewed ${specialty.reviewedOn}, plus ${count} verified ${specialty.plural.toLowerCase()} with registration, qualification and practice checked.`,
    path: paths.specialty(specialty.key),
    image: "segment",
    index: (await withOverride(paths.specialty(specialty.key), listingGate("national", count, true))).indexable,
  });
}

export default async function SpecialtyPage({ params }: { params: Promise<Params> }) {
  const specialty = specialtyByKey((await params).specialty);
  if (!specialty) notFound();

  const [count, cityCounts, listedCounts, geo] = await Promise.all([countIndexable(specialty.key), countsByCity(specialty.key), countsByCity(specialty.key, "published"), getGeo()]);
  const openCities = cityCounts
    .filter((c) => c.n >= GATES.citySpecialty)
    .map((c) => ({ ...c, city: geo.city(c.stateSlug, c.citySlug) }))
    .filter((c) => c.city);
  const verifiedByCity = new Map(cityCounts.map((c) => [`${c.stateSlug}/${c.citySlug}`, c.n]));
  /* Every city with a published profile, grouped by state; states and cities best-supplied first. Browsable whether or not a page indexes. */
  const listedCities = listedCounts
    .map((c) => ({ ...c, verified: verifiedByCity.get(`${c.stateSlug}/${c.citySlug}`) ?? 0, city: geo.city(c.stateSlug, c.citySlug) }))
    .filter((c) => c.city && c.n > 0);
  const listedTotal = listedCities.reduce((a, c) => a + c.n, 0);
  const CITIES_PER_STATE = 8;
  const byState = new Map<string, { state: { slug: string; name: string }; listed: number; verified: number; cities: typeof listedCities }>();
  for (const c of listedCities) {
    const g = byState.get(c.stateSlug) ?? { state: { slug: c.stateSlug, name: c.city!.state }, listed: 0, verified: 0, cities: [] };
    g.listed += c.n;
    g.verified += c.verified;
    g.cities.push(c);
    byState.set(c.stateSlug, g);
  }
  const stateGroups = [...byState.values()].sort((a, b) => b.listed - a.listed || a.state.name.localeCompare(b.state.name));
  const fmt = (n: number) => n.toLocaleString("en-IN");
  const gate = await withOverride(paths.specialty(specialty.key), listingGate("national", count, Boolean(specialty.guide)));
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
    structuredData: "CollectionPage + MedicalWebPage (about MedicalSpecialty, lastReviewed), BreadcrumbList",
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
      <JsonLd data={[specialtyLd(specialty, count, openCities.map((c) => paths.citySpecialty(c.stateSlug, c.citySlug, specialty.slug))), breadcrumbLd(crumbs.map((c) => ({ name: c.name, path: c.path })))]} />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="doc">
          <span className="eyebrow">{specialty.department}</span>
          <h1 style={{ marginTop: "10px" }}>{specialty.name}</h1>
          <div className="upd">
            {count.toLocaleString("en-IN")} verified · {listedTotal.toLocaleString("en-IN")} listed {specialty.plural.toLowerCase()} across {listedCities.length} {listedCities.length === 1 ? "city" : "cities"}
          </div>

          {specialty.guide ? (
            <>
              <p>{specialty.guide}</p>
              <h2>Reasons people consult this speciality</h2>
              <ul>
                {specialty.when.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>
              Guidance on when to consult {specialty.aOne} is being written and medically reviewed. Until it is signed off, this hub and
              its city pages stay out of search results; the profiles themselves are complete and reachable.
            </p>
          )}

          <h2>Also called</h2>
          <p>
            {specialty.aliases.join(", ")}. These map to this one page — synonyms with the same
            intent do not get their own URL.
          </p>

          {specialty.reviewedOn ? (
            <p style={{ fontSize: "12.5px", color: "var(--muted)" }}>
              Medically reviewed · last substantive review {specialty.reviewedOn}.
            </p>
          ) : null}
        </div>
      </div>

      <section className="section" aria-labelledby="by-place">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2 id="by-place" style={{ margin: 0 }}>{specialty.plural} by state and city</h2>
              <p style={{ margin: "6px 0 0", fontSize: "13.5px", color: "var(--muted)" }}>
                {fmt(listedTotal)} listed in {fmt(listedCities.length)} {listedCities.length === 1 ? "city" : "cities"} across {stateGroups.length} {stateGroups.length === 1 ? "state" : "states"}. Best-supplied first; a profile that has not been verified yet says so on its page.
              </p>
            </div>
            <Link href="/doctors" className="mono" style={{ fontSize: "12.5px" }}>All locations →</Link>
          </div>

          {stateGroups.length === 0 ? (
            <div className="panel zero">
              <p style={{ margin: 0 }}>No {specialty.plural.toLowerCase()} are listed yet.</p>
            </div>
          ) : (
            <div className="stategrid">
              {stateGroups.map((g) => {
                const shown = g.cities.slice(0, CITIES_PER_STATE);
                const more = g.cities.length - shown.length;
                return (
                  <div className="stategroup" key={g.state.slug}>
                    <div className="stategroup-head">
                      <Link href={`/doctors/${g.state.slug}`} className="stategroup-name">{g.state.name}</Link>
                      <span className="mono stategroup-count">
                        {fmt(g.listed)} listed{g.verified > 0 ? ` · ${fmt(g.verified)} verified` : ""}
                      </span>
                    </div>
                    <ul className="citylist">
                      {shown.map((c) => (
                        <li key={c.citySlug}>
                          <Link href={paths.citySpecialty(c.stateSlug, c.citySlug, specialty.slug)} className="cityrow">
                            <span className="cityrow-name">{c.city!.name}</span>
                            <span className="mono cityrow-count">
                              {c.verified > 0 ? <span className="cityrow-verified">{fmt(c.verified)} verified · </span> : null}
                              {fmt(c.n)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {more > 0 ? (
                      <Link href={`/doctors/${g.state.slug}`} className="stategroup-more">
                        {more} more {more === 1 ? "city" : "cities"} in {g.state.name} →
                      </Link>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div className="wrap">
        <div className="doc" style={{ paddingTop: 0 }}>
          <h2>Cities with verified supply</h2>
          <p>
            A city page enters search results when it has at least {GATES.citySpecialty} verified {specialty.plural.toLowerCase()} with confirmed practice details.
            {openCities.length === 0 ? " No city has reached that yet; the city pages above are still open to browse." : ""}
          </p>
          {openCities.length > 0 ? (
            <div className="quick">
              {openCities.map((c) => (
                <Link key={`${c.stateSlug}/${c.citySlug}`} className="chip" href={paths.citySpecialty(c.stateSlug, c.citySlug, specialty.slug)}>
                  {c.city!.name} · {c.n} verified
                </Link>
              ))}
            </div>
          ) : null}

        </div>
      </div>
    </>
  );
}
