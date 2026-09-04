import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { getAllDoctors } from "@/lib/data";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { SITE, absoluteUrl, paths } from "@/lib/site";

export const metadata: Metadata = {
  title: "About and ownership",
  description:
    "Who runs The Doctor Index, what it is for, how it is funded, and the commitments that do not change when money arrives.",
  alternates: { canonical: absoluteUrl("/about") },
  robots: { index: true, follow: true },
};

export default async function AboutPage() {
  const all = await getAllDoctors();
  const crumbs = [{ name: "Home", path: paths.home() }, { name: "About" }];
  return (
    <>
      <RouteMeta
        data={{
          route: "Trust document",
          title: "About and ownership | The Doctor Index",
          h1: "About The Doctor Index",
          canonical: absoluteUrl("/about"),
          index: true,
          structuredData: "AboutPage, BreadcrumbList",
        }}
      />
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "AboutPage", url: absoluteUrl("/about"), name: "About The Doctor Index" },
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <article className="doc">
          <span className="eyebrow">Ownership and purpose</span>
          <h1 style={{ marginTop: "10px" }}>About The Doctor Index</h1>
          <div className="upd">Company details, funding and officers to be completed before public launch</div>

          <p>
            The Doctor Index is a directory of practising doctors in India. It exists to do one thing
            well: tell a patient who a doctor is, what they are qualified in, where they practise, and
            what other patients experienced — with every claim checked against a source and dated.
          </p>

          <h2>What we are</h2>
          <p>
            A professional register, not a marketplace. Doctors do not pay to be listed, verified or
            found. Patients do not pay to search. The basic profile is permanently free and we say so
            in writing on the <Link href={paths.policy("advertising")}>advertising policy</Link>.
          </p>

          <h2>What we are not</h2>
          <ul>
            <li>Not a regulator. Registration verification confirms that a doctor is on the register; it does not certify competence.</li>
            <li>Not a source of medical advice. Health guides help you choose a kind of doctor; they never diagnose.</li>
            <li>Not a ranking of who is best. We publish how results are ordered and payment is not an input.</li>
            <li>Not an emergency service. Call 108.</li>
          </ul>

          <h2>How verification works, in one paragraph</h2>
          <p>
            Council and registration number are matched in the state register — never name alone.
            Qualifications are checked against the awarding body. Practice addresses and hours are
            reconfirmed with the practice, and the date is shown. Each check is a separate label with
            its own date, because a single tick would imply we had checked more than we have. The full
            method is on the <Link href={paths.policy("verification")}>verification page</Link>.
          </p>

          <h2>Where we are</h2>
          <p>
            Bengaluru first, four specialities, {all.filter((d) => d.indexable).length} indexable
            profiles. Doctors anywhere in India can create a profile today; cities open to search as
            verified supply reaches the threshold for their pages to be useful.
          </p>

          <h2>Commitments that do not change</h2>
          <ul>
            <li>Organic ranking is never sold.</li>
            <li>No verification label is ever sold.</li>
            <li>No review is ever removed for money.</li>
            <li>No patient data is ever sold.</li>
            <li>Every public trust label links to the page that explains it.</li>
          </ul>

          <h2>Contact</h2>
          <p>
            Grievance officer: <a href={`mailto:${SITE.grievanceEmail}`}>{SITE.grievanceEmail}</a>.
            Process and timelines are on the <Link href={paths.policy("grievance")}>grievance page</Link>.
          </p>
        </article>
      </div>
    </>
  );
}
