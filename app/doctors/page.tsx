import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { getAllDoctors } from "@/lib/data";
import { CITY } from "@/lib/data/taxonomy";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { absoluteUrl, paths } from "@/lib/site";

export const metadata: Metadata = {
  title: "Find verified doctors by location in India",
  description:
    "Browse verified doctors by state and city. A location opens only once it has enough verified, currently practising doctors to be useful.",
  alternates: { canonical: absoluteUrl("/doctors") },
  robots: { index: true, follow: true },
};

/**
 * National browse root. The plan opens cities one cluster at a time, so this
 * page is honest about which are open and which are not: states without
 * verified supply are listed as "not yet open" with no link, never as an empty
 * page.
 */
const STATES: Array<{ name: string; slug: string; open: boolean }> = [
  { name: "Karnataka", slug: "karnataka", open: true },
  { name: "Tamil Nadu", slug: "tamil-nadu", open: false },
  { name: "Maharashtra", slug: "maharashtra", open: false },
  { name: "Delhi", slug: "delhi", open: false },
  { name: "Telangana", slug: "telangana", open: false },
  { name: "Kerala", slug: "kerala", open: false },
  { name: "West Bengal", slug: "west-bengal", open: false },
  { name: "Gujarat", slug: "gujarat", open: false },
  { name: "Uttar Pradesh", slug: "uttar-pradesh", open: false },
];

export default async function DoctorsIndexPage() {
  const indexable = (await getAllDoctors()).filter((d) => d.indexable).length;
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
              text: "States and cities without verified supply are shown without a link. We do not mint an empty page per state to look national.",
            },
          ],
        }}
      />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Browse by location</span>
          <h1 style={{ marginTop: "10px" }}>Verified doctors across India</h1>
          <div className="upd">
            {indexable} indexable profiles · 1 state open · nationwide doctor applications accepted
          </div>
          <p style={{ maxWidth: "66ch" }}>
            Any eligible doctor in India can create or claim a profile today. A city opens to patients
            when it has enough verified, currently practising doctors for its pages to be useful — not
            before. Locations below without a link are accepting doctor applications but are not yet
            open for search.
          </p>

          <h2>States</h2>
          <div className="locgrid">
            {STATES.map((s) =>
              s.open ? (
                <Link key={s.slug} className="loc" href={`/doctors/${s.slug}`}>
                  <span className="n">{s.name}</span>
                  <span className="c">{s.slug === CITY.stateSlug ? `${indexable} verified` : ""}</span>
                </Link>
              ) : (
                <div key={s.slug} className="loc off" aria-disabled="true">
                  <span className="n">{s.name}</span>
                  <span className="c">not yet open</span>
                </div>
              ),
            )}
          </div>

          <h2>Practising somewhere that is not open yet?</h2>
          <p>
            Create your free profile now. It is verified against the register the same way, it is
            reachable by direct link and on-site search, and it enters the public index the moment your
            city opens.
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
