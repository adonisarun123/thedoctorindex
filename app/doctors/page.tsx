import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { countsByState, totals } from "@/lib/data";
import { getGeo } from "@/lib/data/geo";
import { breadcrumbLd, collectionLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { absoluteUrl, paths } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Verified doctors by state and city",
  ogTitle: "Find verified doctors by location in India",
  description: "Browse verified doctors by state and city. A location opens only once it has enough verified, currently practising doctors to be useful.",
  path: "/doctors",
});

/**
 * National browse root. Every state that exists as data is listed; the count
 * is verified (indexable) profiles, and a state with verified doctors but no
 * open city still links through so its cities can be seen. States with no
 * profiles at all are absent — we do not mint an empty page to look national.
 */
export const revalidate = 3600;

export default async function DoctorsIndexPage() {
  const [geo, byState, published, t] = await Promise.all([getGeo(), countsByState(), countsByState("published"), totals()]);
  const states = geo.states.map((st) => ({ ...st, n: byState[st.slug] ?? 0, p: published[st.slug] ?? 0 })).filter((st) => st.p > 0).sort((a, b) => b.n - a.n || b.p - a.p || a.name.localeCompare(b.name));
  const crumbs = [{ name: "Home", path: paths.home() }, { name: "Doctors by location" }];

  return (
    <>
      <RouteMeta
        data={{
          route: "Location browse root",
          title: "Find verified doctors by location in India | The Doctor Index",
          h1: "Verified doctors across India",
          canonical: absoluteUrl("/doctors"),
          index: true,
          structuredData: "CollectionPage, BreadcrumbList",
          notes: [
            {
              label: "Closed locations",
              text: "States and cities exist as pages only when they exist as data. Counts are verified (indexable) profiles; a place with profiles that fail the gate shows 0 verified rather than an inflated number.",
            },
          ],
        }}
      />
      <JsonLd data={[collectionLd({ name: "Verified doctors by state", path: "/doctors", items: states.map((st) => ({ name: st.name, path: `/doctors/${st.slug}` })) }), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Browse by location</span>
          <h1 style={{ marginTop: "10px" }}>Verified doctors across India</h1>
          <div className="upd">
            {t.indexable.toLocaleString("en-IN")} verified of {t.published.toLocaleString("en-IN")} profiles · {states.length} states and union territories · {t.cities.toLocaleString("en-IN")} cities
          </div>
          <p style={{ maxWidth: "66ch" }}>
            Any eligible doctor in India can create or claim a profile today. A city × speciality page enters search results
            only once it has enough verified, currently practising doctors to be useful — not before. Every page is
            reachable by link and on-site search meanwhile.
          </p>

          <h2>States and union territories</h2>
          <div className="locgrid">
            {states.map((st) => (
              <Link key={st.slug} className="loc" href={`/doctors/${st.slug}`}>
                <span className="n">{st.name}</span>
                <span className="c">{st.n ? `${st.n.toLocaleString("en-IN")} verified · ${st.p.toLocaleString("en-IN")} listed` : `${st.p.toLocaleString("en-IN")} listed · verification pending`}</span>
              </Link>
            ))}
          </div>

          <h2>Practising somewhere that is not listed yet?</h2>
          <p>
            Create your free profile now. It is verified against the register the same way, it is
            reachable by direct link and on-site search, and it enters the public index the moment your
            city passes its gate.
          </p>
          <div className="quick">
            <Link className="btn" href={paths.addDoctor()}>
              Add your profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
