import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { LETTERS, letterLabel, letterOf, paths as cpaths } from "@/lib/conditions/browse";
import { listConditions } from "@/lib/conditions/data";
import { DEPARTMENTS } from "@/lib/conditions/departments";
import { HUB_MIN_INDEXABLE, conditionIndexable } from "@/lib/conditions/gate";
import { pageMeta } from "@/lib/seo/meta";
import { breadcrumbLd, collectionLd } from "@/lib/seo/structured-data";
import { absoluteUrl, paths } from "@/lib/site";

export const revalidate = 3600;

const TITLE = "Health conditions A–Z: what they are and which doctor to see";
const DESCRIPTION = "Browse health conditions by name or department, read what each one is, and find the right specialist with a checked registration.";

async function state() {
  const all = await listConditions();
  const reviewed = all.filter((c) => conditionIndexable(c.slug));
  return { all, reviewed, indexable: reviewed.length >= HUB_MIN_INDEXABLE };
}

export async function generateMetadata(): Promise<Metadata> {
  const { indexable } = await state();
  return pageMeta({ title: TITLE, description: DESCRIPTION, path: cpaths.hub(), index: indexable });
}

export default async function ConditionsHub() {
  const { all, reviewed, indexable } = await state();
  const byDept = new Map<string, number>();
  for (const c of all) byDept.set(c.departmentSlug, (byDept.get(c.departmentSlug) ?? 0) + 1);
  const letters = new Set(all.map((c) => letterOf(c.name)));
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Conditions", path: cpaths.hub() },
  ];
  const depts = DEPARTMENTS.filter((d) => byDept.get(d.slug)).sort((a, b) => (byDept.get(b.slug) ?? 0) - (byDept.get(a.slug) ?? 0));

  return (
    <>
      <RouteMeta
        data={{
          route: "Conditions hub",
          title: TITLE,
          h1: "Health conditions A–Z",
          canonical: absoluteUrl(cpaths.hub()),
          index: indexable,
          structuredData: "CollectionPage › ItemList (departments), BreadcrumbList",
          notes: [{ label: "Gate", text: `Indexable at ${HUB_MIN_INDEXABLE} reviewed articles; ${reviewed.length} today. ${all.length} conditions are browsable.` }],
        }}
      />
      <JsonLd
        data={[
          collectionLd({ name: "Health conditions A–Z", path: cpaths.hub(), description: DESCRIPTION, items: depts.map((d) => ({ name: `${d.name} conditions`, path: cpaths.department(d.slug) })) }),
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Condition library</span>
          <h1 style={{ marginTop: "10px" }}>Health conditions A–Z</h1>
          <p style={{ maxWidth: "70ch" }}>
            {all.length.toLocaleString("en-IN")} conditions, each with what it is, the department that usually sees it, and a route to doctors on the index whose registration you can check.
            {reviewed.length
              ? ` ${reviewed.length} have an original article reviewed by a registered doctor.`
              : " Pages are compiled from public medical sources and labelled as such; reviewed articles are being added."}
          </p>

          <nav className="azbar" aria-label="Browse by letter">
            {LETTERS.map((l) =>
              letters.has(l) ? (
                <Link key={l} href={cpaths.letter(l)}>
                  {letterLabel(l)}
                </Link>
              ) : (
                <span key={l}>{letterLabel(l)}</span>
              ),
            )}
          </nav>

          {reviewed.length ? (
            <>
              <h2>Reviewed articles</h2>
              <ul className="condlist">
                {reviewed.map((c) => (
                  <li key={c.slug}>
                    <Link href={cpaths.condition(c.slug)}>{c.name}</Link>
                    <span className="dept">{c.department}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <h2>By department</h2>
          <div className="deptgrid">
            {depts.map((d) => (
              <Link key={d.slug} className="deptcard" href={cpaths.department(d.slug)}>
                <b>{d.name}</b> <span className="n">· {byDept.get(d.slug)}</span>
                <p>{d.blurb}</p>
              </Link>
            ))}
          </div>

          <p style={{ fontSize: "12.5px", color: "var(--muted)", maxWidth: "70ch" }}>
            General information, not medical advice. In an emergency call 112, or 108 for an ambulance.
          </p>
        </div>
      </div>
    </>
  );
}
