import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { letterOf, paths as cpaths } from "@/lib/conditions/browse";
import { listConditions } from "@/lib/conditions/data";
import { DEPARTMENTS, FIRST_CONTACT, departmentBySlug } from "@/lib/conditions/departments";
import { DEPARTMENT_MIN_INDEXABLE, conditionIndexable } from "@/lib/conditions/gate";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { pageMeta } from "@/lib/seo/meta";
import { breadcrumbLd, collectionLd } from "@/lib/seo/structured-data";
import { absoluteUrl, paths } from "@/lib/site";

type Params = { department: string };
export const revalidate = 3600;

export function generateStaticParams(): Params[] {
  return DEPARTMENTS.map((d) => ({ department: d.slug }));
}

async function load(slug: string) {
  const dept = departmentBySlug(slug);
  if (!dept) return null;
  const items = (await listConditions()).filter((c) => c.departmentSlug === slug);
  const reviewed = items.filter((c) => conditionIndexable(c.slug));
  return { dept, items, reviewed, indexable: reviewed.length >= DEPARTMENT_MIN_INDEXABLE };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const data = await load((await params).department);
  if (!data || !data.items.length) return { title: "Not found", robots: { index: false, follow: false } };
  return pageMeta({
    title: `${data.dept.name} conditions: overview and doctors`,
    description: `${data.items.length} ${data.dept.name.toLowerCase()} conditions — what each one is and which doctor to see. ${data.dept.blurb}`,
    path: cpaths.department(data.dept.slug),
    index: data.indexable,
  });
}

export default async function DepartmentPage({ params }: { params: Promise<Params> }) {
  const data = await load((await params).department);
  if (!data || !data.items.length) notFound();
  const { dept, items, reviewed, indexable } = data;
  const specialty = dept.specialty ? SPECIALTIES[dept.specialty] : null;
  const path = cpaths.department(dept.slug);
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Conditions", path: cpaths.hub() },
    { name: dept.name, path },
  ];
  const groups = new Map<string, typeof items>();
  for (const c of items) {
    const l = letterOf(c.name);
    if (!groups.has(l)) groups.set(l, []);
    groups.get(l)!.push(c);
  }

  return (
    <>
      <RouteMeta
        data={{
          route: "Conditions by department",
          title: `${dept.name} conditions`,
          h1: `${dept.name} conditions`,
          canonical: absoluteUrl(path),
          index: indexable,
          structuredData: "CollectionPage › ItemList, BreadcrumbList",
          notes: [{ label: "Gate", text: `Indexable at ${DEPARTMENT_MIN_INDEXABLE} reviewed articles; ${reviewed.length} today.` }],
        }}
      />
      <JsonLd
        data={[
          collectionLd({ name: `${dept.name} conditions`, path, description: dept.blurb, items: (reviewed.length ? reviewed : items.slice(0, 100)).map((c) => ({ name: c.name, path: cpaths.condition(c.slug) })) }),
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Condition library · {items.length} conditions</span>
          <h1 style={{ marginTop: "10px" }}>{dept.name} conditions</h1>
          <p style={{ maxWidth: "70ch" }}>{dept.blurb}</p>

          <div className="panel pad" style={{ maxWidth: "70ch", margin: "16px 0 22px" }}>
            {specialty && dept.basis !== "none" ? (
              <>
                <p style={{ margin: "0 0 10px" }}>
                  {dept.basis === "nearest"
                    ? `The Doctor Index does not list ${dept.name.toLowerCase()} separately; ${specialty.plural.toLowerCase()} are the nearest speciality.`
                    : `Doctors for these conditions are listed as ${specialty.plural.toLowerCase()}.`}
                </p>
                <div className="quick" style={{ marginTop: 0 }}>
                  <Link className="btn" href={paths.citySpecialty("karnataka", "bengaluru", specialty.slug)} style={{ display: "inline-block" }}>
                    {specialty.plural} in Bengaluru
                  </Link>
                  <Link className="chip" href={paths.specialty(specialty.key)}>
                    Across India
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p style={{ margin: "0 0 10px" }}>
                  The Doctor Index does not list this speciality yet. A family physician or paediatrician can assess and refer.
                </p>
                <div className="quick" style={{ marginTop: 0 }}>
                  {FIRST_CONTACT.map((k) => (
                    <Link key={k} className="chip" href={paths.specialty(k)}>
                      {SPECIALTIES[k].plural}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {reviewed.length ? (
            <>
              <h2>Reviewed articles</h2>
              <ul className="condlist">
                {reviewed.map((c) => (
                  <li key={c.slug}>
                    <Link href={cpaths.condition(c.slug)}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <h2>All {dept.name.toLowerCase()} conditions</h2>
          {[...groups.entries()].map(([l, list]) => (
            <section key={l}>
              <h3 style={{ marginTop: "18px" }}>{l === "0-9" ? "0–9" : l.toUpperCase()}</h3>
              <ul className="condlist">
                {list.map((c) => (
                  <li key={c.slug}>
                    <Link href={cpaths.condition(c.slug)}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
