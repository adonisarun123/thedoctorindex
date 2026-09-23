import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { POLICIES } from "@/lib/data/policies";
import { breadcrumbLd, collectionLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { absoluteUrl, paths } from "@/lib/site";

const DESCRIPTION =
  "How The Doctor Index verifies, ranks, moderates and corrects what it publishes, what it will not sell, and how your data is handled. Every trust label on the site links to one of these.";

export const metadata: Metadata = pageMeta({
  title: "Policies: how the directory works",
  description: DESCRIPTION,
  path: paths.policies(),
});

export default function PoliciesIndexPage() {
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Policies", path: paths.policies() },
  ];
  return (
    <>
      <RouteMeta
        data={{
          route: "Trust index",
          title: "Policies | The Doctor Index",
          h1: "Policies",
          canonical: absoluteUrl(paths.policies()),
          index: true,
          structuredData: "CollectionPage, BreadcrumbList",
          notes: [{ label: "Why it exists", text: "One crawlable entry point for the trust documents, and the middle step of every policy page's breadcrumb." }],
        }}
      />
      <JsonLd
        data={[
          collectionLd({ name: "Policies", path: paths.policies(), description: DESCRIPTION, items: POLICIES.map((p) => ({ name: p.title, path: paths.policy(p.slug) })) }),
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Trust</span>
          <h1 style={{ marginTop: "10px" }}>Policies</h1>
          <p style={{ maxWidth: "66ch" }}>
            Every label on a profile — registration checked, practice confirmed, review with proof of
            visit — means exactly what the matching document below says, and nothing more. They are
            written as plain-language product documents pending counsel review.
          </p>
          <div className="guidegrid">
            {POLICIES.map((p) => (
              <Link key={p.slug} className="guide" href={paths.policy(p.slug)}>
                <div className="t">{p.title}</div>
                <div className="d">{p.summary}</div>
                <div className="m">Updated {p.updatedOn}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
