import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { GUIDES } from "@/lib/data/guides";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { breadcrumbLd, collectionLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { absoluteUrl, paths } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Health guides: which specialist to see",
  ogTitle: "Health guides — when to consult which specialist",
  description: "Plain-language, medically reviewed guides to which kind of doctor to see and what to expect. Each names its author and reviewer and shows its review date.",
  path: "/health-guides",
});

export default function GuidesIndexPage() {
  const crumbs = [{ name: "Home", path: paths.home() }, { name: "Health guides" }];
  return (
    <>
      <RouteMeta
        data={{
          route: "Editorial index",
          title: "Health guides | The Doctor Index",
          h1: "Health guides",
          canonical: absoluteUrl("/health-guides"),
          index: true,
          structuredData: "CollectionPage, BreadcrumbList",
          notes: [
            {
              label: "Editorial rule",
              text: "Every guide is individually commissioned, written and reviewed with a named reviewer. No bulk condition pages, no symptom checker, and no guide ever names a doctor.",
            },
          ],
        }}
      />
      <JsonLd data={[collectionLd({ name: "Health guides", path: "/health-guides", description: String(metadata.description), items: GUIDES.map((g) => ({ name: g.title, path: `/health-guides/${g.slug}` })) }), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Editorial</span>
          <h1 style={{ marginTop: "10px" }}>Health guides</h1>
          <div className="upd">
            {GUIDES.length} guides · each with a named author and medical reviewer ·{" "}
            <Link href={paths.policy("editorial")}>editorial policy</Link>
          </div>
          <p style={{ maxWidth: "66ch" }}>
            These exist to help you decide which kind of doctor to see and what to expect when you get
            there. They are not diagnosis and they never recommend a particular doctor — guidance and
            the directory are kept separate on purpose.
          </p>

          <div className="guidegrid">
            {GUIDES.map((g) => (
              <Link key={g.slug} className="guide" href={`/health-guides/${g.slug}`}>
                <div className="eyebrow">
                  {g.specialty ? SPECIALTIES[g.specialty].department : "Choosing a doctor"}
                </div>
                <div className="t">{g.title}</div>
                <div className="d">{g.standfirst}</div>
                <div className="m">
                  {g.readingMinutes} min · reviewed {g.reviewedOn}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
