import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { countsByLocalitySpecialty, countsBySpecialty, supplyProfile, totals } from "@/lib/data";
import { SupplyPanel } from "@/components/SupplyPanel";
import { concentrationSentence, councilSentence, countPhrase, gapSentence, placementSentence, qualificationSentence, singletonSentence, supplyFacts, verificationSentence } from "@/lib/content/supply";
import { getGeo } from "@/lib/data/geo";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { GATES } from "@/lib/seo/gates";
import { breadcrumbLd, collectionLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { absoluteUrl, paths } from "@/lib/site";

type Params = { state: string; city: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { state, city } = await params;
  const c = (await getGeo()).city(state, city);
  if (!c) return { title: "Not found", robots: { index: false, follow: false } };
  const place = { stateSlug: state, citySlug: city };
  const [bySpecialty, profile] = await Promise.all([countsBySpecialty(place, "eligible"), supplyProfile(place, undefined, "published")]);
  const n = Object.values(bySpecialty).reduce((a, b) => a + b, 0);
  // Data-derived, so 269 city pages do not ship 269 copies of one sentence.
  const specialities = Object.values(bySpecialty).filter((v) => v > 0).length;
  const scope = [
    specialities > 0 ? `${specialities} ${specialities === 1 ? "speciality" : "specialities"}` : null,
    profile.localities > 0 ? `${profile.localities} ${profile.localities === 1 ? "locality" : "localities"}` : null,
  ].filter(Boolean).join(" and ");
  return pageMeta({
    // Not "Verified doctors in X": verified supply is 6 profiles site-wide,
    // so that title asserted a check the page's own counts contradict.
    title: `Doctors in ${c.name}`,
    ogTitle: `Doctors in ${c.name} by speciality and locality`,
    description: `${profile.total.toLocaleString("en-IN")} doctors listed in ${c.name}${scope ? ` across ${scope}` : ""}${profile.withRegistration > 0 ? `, ${profile.withRegistration.toLocaleString("en-IN")} with a council registration on record` : ""}. Every profile shows what has been checked, and when.`,
    path: `/doctors/${state}/${city}`,
    index: n > 0,
  });
}

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams(): Params[] {
  return [];
}

/**
 * City hub: specialities with verified counts, then localities with the
 * speciality pages that have cleared the locality gate. Counts come from two
 * GROUP BY queries, not one per combination.
 */
export default async function CityPage({ params }: { params: Promise<Params> }) {
  const { state, city } = await params;
  const geo = await getGeo();
  const c = geo.city(state, city);
  if (!c) notFound();

  const place = { stateSlug: state, citySlug: city };
  const [countBySpecialty, listedBySpecialty, perLocality, t, profile] = await Promise.all([countsBySpecialty(place), countsBySpecialty(place, "published"), countsByLocalitySpecialty(city, "eligible"), totals(place), supplyProfile(place, undefined, "published")]);
  const verified = t.indexable;
  const openSpecialties = SPECIALTY_KEYS.filter((k) => (listedBySpecialty[k] ?? 0) > 0).sort((a, b) => (countBySpecialty[b] ?? 0) - (countBySpecialty[a] ?? 0) || (listedBySpecialty[b] ?? 0) - (listedBySpecialty[a] ?? 0));
  const localities = geo.localitiesIn(city).filter((l) => l.stateSlug === state);
  const localityInfo = new Map<string, { n: number; qualifying: string[] }>();
  for (const l of localities) localityInfo.set(l.key, { n: 0, qualifying: [] });
  for (const r of perLocality) {
    const info = localityInfo.get(r.localityKey);
    if (!info) continue;
    info.n += r.n;
    if (r.n >= GATES.localitySpecialty && SPECIALTIES[r.specialty]) info.qualifying.push(r.specialty);
  }
  const sortedLocalities = [...localities].sort((a, b) => (localityInfo.get(b.key)?.n ?? 0) - (localityInfo.get(a.key)?.n ?? 0) || a.name.localeCompare(b.name));
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Doctors by location", path: "/doctors" },
    { name: c.state, path: `/doctors/${state}` },
    { name: c.name, path: `/doctors/${state}/${city}` },
  ];

  /*
   * Measured composition. Every figure below comes from the same pool the
   * counts on this page already agree on, so the prose cannot drift from the
   * numbers beside it. The locality distribution is totalled from its own rows
   * rather than from `t.published`, so its percentage stays internally
   * consistent whatever the index mode counts.
   */
  const specialtyMix = openSpecialties.map((k) => ({ name: SPECIALTIES[k].plural, n: listedBySpecialty[k] ?? 0 })).filter((e) => e.n > 0);
  const localityMix = sortedLocalities.map((l) => ({ name: l.name, n: localityInfo.get(l.key)?.n ?? 0 })).filter((e) => e.n > 0);
  const localityTotal = localityMix.reduce((a, e) => a + e.n, 0);
  const supplySentences = [
    placementSentence(profile, countPhrase(profile.total, "doctor", "doctors"), c.name),
    concentrationSentence(specialtyMix, profile.total, { singular: "speciality", plural: "specialities" }),
    concentrationSentence(localityMix, localityTotal, { singular: "locality", plural: "localities" }, c.name),
    singletonSentence(localityMix, { singular: "locality", plural: "localities" }),
    verificationSentence(profile),
    qualificationSentence(profile),
    councilSentence(profile),
  ];

  return (
    <>
      <RouteMeta
        data={{
          route: "City hub",
          title: `Doctors in ${c.name} by speciality and locality | The Doctor Index`,
          h1: `Doctors in ${c.name}`,
          canonical: absoluteUrl(`/doctors/${state}/${city}`),
          index: verified > 0,
          structuredData: "CollectionPage, BreadcrumbList",
          notes: [
            {
              label: "Locality links",
              text: `Only locality × speciality combinations that clear the ${GATES.localitySpecialty}-doctor gate are linked from here. The rest exist and serve, but are not linked into from a hub — we do not pass crawl equity to thin pages.`,
            },
          ],
        }}
      />
      <JsonLd data={[collectionLd({ name: `Doctors in ${c.name}`, path: `/doctors/${state}/${city}`, items: openSpecialties.map((k) => ({ name: `${SPECIALTIES[k].plural} in ${c.name}`, path: paths.citySpecialty(state, city, SPECIALTIES[k].slug) })) }), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">
            {c.state} · {c.name}
          </span>
          <h1 style={{ marginTop: "10px" }}>Doctors in {c.name}</h1>
          {/* Zero-valued clauses are dropped rather than printed. Verified
              supply is 0 in every city and no practice has been confirmed yet,
              so this line used to open "0 verified … · 0 practice locations"
              above a panel counting thousands of real records. */}
          <div className="upd">
            {[
              `${t.published.toLocaleString("en-IN")} listed profiles`,
              verified > 0 ? `${verified.toLocaleString("en-IN")} verified` : null,
              t.practices > 0 ? `${t.practices.toLocaleString("en-IN")} confirmed practice locations` : null,
              `${openSpecialties.length} specialities`,
            ].filter(Boolean).join(" · ")}
          </div>

          <SupplyPanel
            heading={`What the index holds in ${c.name}`}
            sentences={supplySentences}
            facts={supplyFacts(profile)}
            footnote={gapSentence(profile)}
          />

          <h2>By speciality</h2>
          {openSpecialties.length === 0 ? (
            <p style={{ maxWidth: "66ch", color: "var(--muted)" }}>
              Profiles here are still being verified against the council registers. They open by speciality as each one passes the gate.
            </p>
          ) : null}
          <div className="deptgrid">
            {(openSpecialties.length ? openSpecialties : SPECIALTY_KEYS.slice(0, 8)).map((k) => {
              const s = SPECIALTIES[k];
              return (
                <Link key={k} className="dept" href={paths.citySpecialty(state, city, s.slug)}>
                  <div className="d">{s.department}</div>
                  <div className="n">{s.plural}</div>
                  <div className="c">{countBySpecialty[k] ?? 0} verified · {listedBySpecialty[k] ?? 0} listed</div>
                </Link>
              );
            })}
          </div>

          <h2 id="localities">By locality</h2>
          <p style={{ maxWidth: "66ch" }}>
            A locality page for a speciality opens once it has {GATES.localitySpecialty} verified
            doctors with confirmed addresses. Localities below show how many verified doctors practise
            there across all specialities; speciality-level pages appear as they qualify.
          </p>
          <div className="locgrid">
            {sortedLocalities.map((l) => {
              const { n, qualifying } = localityInfo.get(l.key)!;
              return (
                <div key={l.key} className="loc" style={{ flexDirection: "column", alignItems: "stretch", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="n">{l.name}</span>
                    <span className="c">{n} verified</span>
                  </div>
                  {qualifying.length ? (
                    <div className="quick" style={{ marginTop: "2px" }}>
                      {qualifying.map((sk) => (
                        <Link key={sk} className="chip" href={paths.localitySpecialty(state, city, l.slug, SPECIALTIES[sk].slug)}>
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
