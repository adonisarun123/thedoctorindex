import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { qualificationProfile } from "@/lib/data";
import { QUALIFICATIONS, QUALIFICATION_GROUPS, branchesOf, qualificationsOf } from "@/lib/qualifications";
import { pageMeta } from "@/lib/seo/meta";
import { breadcrumbLd, collectionLd } from "@/lib/seo/structured-data";
import { SITE, absoluteUrl, paths } from "@/lib/site";

export const revalidate = 3600;

const TITLE = "Medical qualifications in India, explained";
const DESCRIPTION = "What each degree, diploma, fellowship and membership on a doctor's profile means — MBBS, MD, MS, DNB, DM, MCh, the diplomas, BDS, BAMS, FRCS and the rest — and how many doctors here hold it.";

export function generateMetadata(): Metadata {
  return pageMeta({ title: TITLE, description: DESCRIPTION, path: paths.qualifications() });
}

const fmt = (n: number) => n.toLocaleString("en-IN");

export default async function QualificationsPage() {
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Qualifications", path: paths.qualifications() },
  ];
  const counts = new Map(await Promise.all(QUALIFICATIONS.map(async (q) => [q.slug, await qualificationProfile(q.pattern)] as const)));

  return (
    <>
      <RouteMeta
        data={{
          route: "Qualifications hub",
          title: `${TITLE} | ${SITE.name}`,
          h1: TITLE,
          canonical: absoluteUrl(paths.qualifications()),
          index: true,
          structuredData: "CollectionPage › BreadcrumbList",
          notes: [{ label: "Counts live", text: "One query per qualification against the production database, cached for an hour." }],
        }}
      />
      <JsonLd
        data={[
          collectionLd({
            name: TITLE,
            path: paths.qualifications(),
            description: DESCRIPTION,
            items: QUALIFICATIONS.map((q) => ({ name: q.abbr, path: paths.qualification(q.slug) })),
          }),
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <header className="posthead">
          <span className="eyebrow">Qualifications · {QUALIFICATIONS.length} pages</span>
          <h1>{TITLE}</h1>
          <p className="standfirst">
            A doctor&apos;s qualification line — &quot;MBBS, MD (Medicine), FICS&quot; — is several different kinds of claim written as one. A
            primary degree licenses practice; a postgraduate degree makes a specialist; a diploma is a shorter specialist route; a fellowship
            may be an examination or a society membership. These pages take them one at a time: what each is, who awards it, what it does and
            does not make its holder, and — measured from the profiles here — how many doctors record it and in which branches.
          </p>
        </header>

        <div className="notice" style={{ maxWidth: "70ch" }}>
          <b>The branch is the speciality.</b> &quot;MD&quot; says a doctor is a specialist; &quot;MD (Psychiatry)&quot; says in what. Where a branch has enough
          holders here it has a page of its own, listed under its degree. A qualification is marked verified on a profile only when it has been
          checked against the awarding body, with the date shown.
        </div>

        {QUALIFICATION_GROUPS.map((g) => {
          const items = qualificationsOf(g.kind);
          if (!items.length) return null;
          return (
            <section key={g.kind} className="reggroup" aria-labelledby={`group-${g.kind}`}>
              <h2 id={`group-${g.kind}`}>{g.name}</h2>
              <p>{g.blurb}</p>
              <div className="reggrid">
                {items.map((q) => {
                  const p = counts.get(q.slug);
                  const branches = branchesOf(q.slug);
                  return (
                    <div key={q.slug} className="guide" style={{ display: "block" }}>
                      <Link href={paths.qualification(q.slug)} style={{ textDecoration: "none", color: "inherit" }}>
                        <div className="eyebrow">{q.system === "modern" ? "Modern medicine" : q.system === "dental" ? "Dentistry" : q.system === "ayush" ? "AYUSH" : "Allied health"}</div>
                        <div className="t">{q.abbr}</div>
                        <div className="d">{q.standfirst}</div>
                        <div className="m">{p?.total ? `${fmt(p.total)} doctors · ${fmt(p.checked)} checked` : "No profile on this site records it yet"}</div>
                      </Link>
                      {branches.length ? (
                        <ul className="regchips" style={{ marginTop: "10px" }}>
                          {branches.map((b) => (
                            <li key={b.slug}>
                              <Link href={paths.qualification(b.slug)}>
                                {b.abbr.replace(/^[A-Za-z/]+\s*/, "")}
                                {counts.get(b.slug)?.total ? ` · ${fmt(counts.get(b.slug)!.total)}` : ""}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="reggroup" aria-labelledby="missing-heading">
          <h2 id="missing-heading">A qualification that is not listed</h2>
          <p>
            Profiles record qualifications exactly as supplied, listed here or not. A page exists for a qualification once enough doctors on
            this site record it to measure; the <Link href={paths.registers()}>register pages</Link> cover the bodies those doctors register
            with, and the <Link href="/blog/how-to-spot-a-fake-doctor-in-india">how to spot a fake doctor</Link> guide walks through checking
            a qualification you cannot place.
          </p>
        </section>
      </div>
    </>
  );
}
