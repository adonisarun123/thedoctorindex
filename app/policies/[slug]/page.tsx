import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { POLICIES, policyBySlug } from "@/lib/data/policies";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { absoluteUrl, paths } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const policy = policyBySlug((await params).slug);
  if (!policy) return { title: "Not found", robots: { index: false, follow: false } };
  return pageMeta({ title: policy.title, description: policy.summary, path: paths.policy(policy.slug) });
}

export default async function PolicyPage({ params }: { params: Promise<Params> }) {
  const policy = policyBySlug((await params).slug);
  if (!policy) notFound();

  const crumbs: Crumb[] = [
    { name: "Home", path: paths.home() },
    { name: "Policies" },
    { name: policy.title },
  ];

  return (
    <>
      <RouteMeta
        data={{
          route: "Trust document",
          title: `${policy.title} | The Doctor Index`,
          h1: policy.title,
          canonical: absoluteUrl(paths.policy(policy.slug)),
          index: true,
          structuredData: "WebPage, BreadcrumbList",
          lastmod: policy.updatedOn,
          notes: [
            {
              label: "Why these pages exist",
              text: "Every public trust label on the site links back to one of these documents. That linkage is a launch acceptance criterion, not a nicety — a badge nobody can look up is a claim, not a fact.",
            },
          ],
        }}
      />
      <JsonLd data={breadcrumbLd(crumbs.map((c) => ({ name: c.name, path: c.path })))} />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <article className="doc">
          <h1>{policy.title}</h1>
          <div className="upd">Last substantive update {policy.updatedOn}</div>
          {policy.body}
        </article>
      </div>
    </>
  );
}
