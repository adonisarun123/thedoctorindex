import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { countsByCity, countsByState, supplyProfile } from "@/lib/data";
import { SupplyPanel } from "@/components/SupplyPanel";
import { concentrationSentence, councilSentence, countPhrase, gapSentence, placementSentence, qualificationSentence, singletonSentence, supplyFacts, verificationSentence } from "@/lib/content/supply";
import { getGeo } from "@/lib/data/geo";
import { breadcrumbLd, collectionLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { absoluteUrl, paths } from "@/lib/site";

type Params = { state: string };

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams(): Params[] {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { state } = await params;
  const st = (await getGeo()).state(state);
  if (!st) return { title: "Not found", robots: { index: false, follow: false } };
  const [byState, profile] = await Promise.all([countsByState("eligible"), supplyProfile({ stateSlug: state }, undefined, "published")]);
  const n = byState[st.slug] ?? 0;
  // Data-derived, so 32 state pages do not ship 32 copies of one sentence.
  return pageMeta({
    // Not "Verified doctors in X" — see the city page for why.
    title: `Doctors in ${st.name}`,
    description: `${profile.total.toLocaleString("en-IN")} doctors listed across ${st.name}${profile.localities > 0 ? `, in ${profile.localities.toLocaleString("en-IN")} localities` : ""}${profile.withRegistration > 0 ? `, ${profile.withRegistration.toLocaleString("en-IN")} with a council registration on record` : ""}. Browse by city, then by speciality.`,
    path: `/doctors/${state}`,
    index: n > 0,
  });
}

/**
 * State page: every city in the state that exists as data, with its verified
 * count. A state with profiles but no verified ones yet is served (people
 * arrive by link) but kept out of the index until something passes a gate.
 */
export default async function StatePage({ params }: { params: Promise<Params> }) {
  const { state } = await params;
  const geo = await getGeo();
  const st = geo.state(state);
  if (!st) notFound();

  const [byCity, byState, pubCity, pubState, profile] = await Promise.all([countsByCity(), countsByState(), countsByCity(undefined, "published"), countsByState("published"), supplyProfile({ stateSlug: state }, undefined, "published")]);
  const verified = byState[st.slug] ?? 0;
  const listed = pubState[st.slug] ?? 0;
  const cityCounts = new Map(byCity.filter((c) => c.stateSlug === st.slug).map((c) => [c.citySlug, c.n]));
  const cityListed = new Map(pubCity.filter((c) => c.stateSlug === st.slug).map((c) => [c.citySlug, c.n]));
  const cities = geo.citiesIn(st.slug).map((c) => ({ ...c, n: cityCounts.get(c.slug) ?? 0, p: cityListed.get(c.slug) ?? 0 })).filter((c) => c.p > 0).sort((a, b) => b.n - a.n || b.p - a.p || a.name.localeCompare(b.name));
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Doctors by location", path: "/doctors" },
    { name: st.name, path: `/doctors/${state}` },
  ];

  /* Measured composition, on the same pool as the counts above. */
  const cityMix = cities.map((c) => ({ name: c.name, n: c.p })).filter((e) => e.n > 0);
  const supplySentences = [
    placementSentence(profile, countPhrase(profile.total, "doctor", "doctors"), st.name),
    concentrationSentence(cityMix, profile.total, { singular: "city", plural: "cities" }),
    singletonSentence(cityMix, { singular: "city", plural: "cities" }),
    verificationSentence(profile),
    qualificationSentence(profile),
    councilSentence(profile),
  ];

  return (
    <>
      <RouteMeta
        data={{
          route: "State",
          title: `Doctors in ${st.name} | The Doctor Index`,
          h1: `Doctors in ${st.name}`,
          canonical: absoluteUrl(`/doctors/${state}`),
          index: verified > 0,
          structuredData: "CollectionPage, BreadcrumbList",
          notes: [
            {
              label: "Why this indexes",
              text: verified > 0 ? `${st.name} has ${verified} verified profiles across ${cities.filter((c) => c.n > 0).length} cities.` : "No verified profile in this state yet; the page is served but noindex until one passes its gate.",
            },
          ],
        }}
      />
      <JsonLd data={[collectionLd({ name: `Doctors in ${st.name}`, path: `/doctors/${state}`, items: cities.map((c) => ({ name: c.name, path: `/doctors/${state}/${c.slug}` })) }), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">{st.name}</span>
          <h1 style={{ marginTop: "10px" }}>Doctors in {st.name}</h1>
          <div className="upd">
            {[
              `${listed.toLocaleString("en-IN")} listed profiles`,
              verified > 0 ? `${verified.toLocaleString("en-IN")} verified` : null,
              `${cities.length} ${cities.length === 1 ? "city" : "cities"}`,
            ].filter(Boolean).join(" · ")}
          </div>

          <SupplyPanel
            heading={`What the index holds in ${st.name}`}
            sentences={supplySentences}
            facts={supplyFacts(profile)}
            footnote={gapSentence(profile)}
          />

          <h2>Cities and districts</h2>
          <div className="locgrid">
            {cities.map((c) => (
              <Link key={c.slug} className="loc" href={`/doctors/${state}/${c.slug}`}>
                <span className="n">{c.name}</span>
                <span className="c">{c.n ? `${c.n.toLocaleString("en-IN")} verified · ${c.p.toLocaleString("en-IN")} listed` : `${c.p.toLocaleString("en-IN")} listed · verification pending`}</span>
              </Link>
            ))}
          </div>

          <p style={{ marginTop: "22px", fontSize: "13.5px", color: "var(--muted)" }}>
            A city × speciality page enters search results when it passes its inventory gate. Doctors anywhere in{" "}
            {st.name} can <Link href={paths.addDoctor()}>create a profile</Link> now.
          </p>
        </div>
      </div>
    </>
  );
}
