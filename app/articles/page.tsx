import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { articleReadingMinutes, registrationLine } from "@/lib/articles/format";
import { toDisplay } from "@/lib/db/dates";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { displayName } from "@/lib/display-name";
import { listPublishedArticles } from "@/lib/services/articles";
import { breadcrumbLd, collectionLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { SITE, absoluteUrl, paths } from "@/lib/site";

const DESCRIPTION = "Articles for patients written by registered doctors, each signed with the author's medical registration number.";

export const revalidate = 3600;

async function load() {
  return process.env.DATABASE_URL ? listPublishedArticles({ limit: 200 }) : [];
}

export async function generateMetadata(): Promise<Metadata> {
  const rows = await load();
  // An empty index is a thin page: keep it out until there is something on it.
  return pageMeta({ title: "Articles by doctors", description: DESCRIPTION, path: paths.articles(), index: rows.some((r) => !r.sourceUrl) });
}

export default async function ArticlesIndex() {
  const rows = await load();
  const crumbs = [{ name: "Home", path: paths.home() }, { name: "Articles by doctors", path: paths.articles() }];

  return (
    <>
      <RouteMeta data={{ route: "Doctor articles index", title: `Articles by doctors | ${SITE.name}`, h1: "Articles by doctors", canonical: absoluteUrl(paths.articles()), index: rows.some((r) => !r.sourceUrl), structuredData: "CollectionPage › BreadcrumbList" }} />
      <JsonLd data={[collectionLd({ name: "Articles by doctors", path: paths.articles(), description: DESCRIPTION, items: rows.map((r) => ({ name: r.title, path: paths.article(r.slug) })) }), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <div className="wrap post">
        <header className="posthead">
          <span className="eyebrow">Written by registered doctors</span>
          <h1>Articles by doctors</h1>
          <p className="standfirst">{DESCRIPTION} Every author&rsquo;s registration was checked against the register before publication.</p>
        </header>
        {rows.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>
            No articles yet. Doctors with a claimed, verified profile can write from their <Link href="/dashboard/articles">dashboard</Link>.
          </p>
        ) : (
          <div className="guidegrid">
            {rows.map((r) => {
              const sp = SPECIALTIES[r.specialty];
              const reg = registrationLine(r.registrationCouncil, r.registrationNumber);
              return (
                <Link key={r.slug} className="guide" href={paths.article(r.slug)}>
                  <div className="eyebrow">{sp?.name ?? "Health"}</div>
                  <div className="t">{r.title}</div>
                  <div className="d">{r.description}</div>
                  <div className="m">
                    {displayName({ name: r.doctorName, specialty: r.specialty })}
                    {reg ? ` · Reg. ${reg}` : ""} · {toDisplay(r.publishedAt)} · {articleReadingMinutes(r)} min
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
