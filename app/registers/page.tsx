import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { registerProfile } from "@/lib/data";
import { REGISTERS, REGISTER_GROUPS, registersOf } from "@/lib/registers";
import { pageMeta } from "@/lib/seo/meta";
import { breadcrumbLd, collectionLd } from "@/lib/seo/structured-data";
import { SITE, absoluteUrl, paths } from "@/lib/site";

export const revalidate = 3600;

const TITLE = "Medical and professional registers in India";
const DESCRIPTION = "Every council and registering body a doctor, dentist, AYUSH or allied-health practitioner in India can cite — where its register is searched, and who on this site cites it.";

export function generateMetadata(): Metadata {
  return pageMeta({ title: TITLE, description: DESCRIPTION, path: paths.registers() });
}

const fmt = (n: number) => n.toLocaleString("en-IN");

export default async function RegistersPage() {
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Registers", path: paths.registers() },
  ];
  const counts = new Map(await Promise.all(REGISTERS.map(async (r) => [r.slug, await registerProfile(r.match)] as const)));
  const cited = REGISTERS.filter((r) => (counts.get(r.slug)?.total ?? 0) > 0).length;
  const checkedTotal = [...counts.values()].reduce((n, p) => n + p.registerChecked, 0);

  return (
    <>
      <RouteMeta
        data={{
          route: "Registers hub",
          title: `${TITLE} | ${SITE.name}`,
          h1: TITLE,
          canonical: absoluteUrl(paths.registers()),
          index: true,
          structuredData: "CollectionPage › BreadcrumbList",
          notes: [{ label: "Counts live", text: "One query per register against the production database, cached for an hour." }],
        }}
      />
      <JsonLd
        data={[
          collectionLd({
            name: TITLE,
            path: paths.registers(),
            description: DESCRIPTION,
            items: REGISTERS.map((r) => ({ name: r.name, path: paths.register(r.slug) })),
          }),
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <header className="posthead">
          <span className="eyebrow">Registers · {REGISTERS.length} bodies</span>
          <h1>{TITLE}</h1>
          <p className="standfirst">
            A registration number means nothing without the body that issued it. These pages say, for each council and registering body in
            India, what it registers, where its public register is searched, what its numbers look like on this site, and how many profiles
            here cite it — {fmt(cited)} of the {REGISTERS.length} are cited by at least one published profile, and {fmt(checkedTotal)} registrations
            across them have been checked against a register.
          </p>
        </header>

        <div className="notice" style={{ maxWidth: "70ch" }}>
          <b>One search covers modern medicine.</b> The National Medical Commission&apos;s Indian Medical Register compiles every state medical
          council, so any MBBS-holder&apos;s number is searched there. Dentists, AYUSH practitioners and allied professionals are on other
          registers, listed below. The <Link href="/blog/how-to-spot-a-fake-doctor-in-india">how to spot a fake doctor</Link> guide walks
          through the whole check.
        </div>

        {REGISTER_GROUPS.map((g) => {
          const items = registersOf(g.kind);
          if (!items.length) return null;
          return (
            <section key={g.kind} className="reggroup" aria-labelledby={`group-${g.kind}`}>
              <h2 id={`group-${g.kind}`}>{g.name}</h2>
              <p>{g.blurb}</p>
              <div className="reggrid">
                {items.map((r) => {
                  const p = counts.get(r.slug);
                  return (
                    <Link key={r.slug} className="guide" href={paths.register(r.slug)}>
                      <div className="eyebrow">{r.state?.name ?? (r.kind === "medical" ? "National" : g.name)}</div>
                      <div className="t">{r.name}</div>
                      <div className="d">{r.standfirst}</div>
                      {p?.total ? (
                        <div className="m">
                          {fmt(p.total)} profiles · {fmt(p.registerChecked)} checked
                        </div>
                      ) : (
                        <div className="m">No profile on this site cites it yet</div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="reggroup" aria-labelledby="missing-heading">
          <h2 id="missing-heading">A body that is not listed</h2>
          <p>
            A profile can cite any council or registering body, listed here or not; the list is a convenience, never a gate. If a body you
            need is missing, the profile still shows the name and number exactly as supplied, and the{" "}
            <Link href={paths.policy("verification")}>verification policy</Link> explains how staff check registrations the automated worker
            cannot reach.
          </p>
        </section>
      </div>
    </>
  );
}
