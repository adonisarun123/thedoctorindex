import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { LETTERS, isLetter, letterLabel, letterOf, paths as cpaths, type Letter } from "@/lib/conditions/browse";
import { listConditions } from "@/lib/conditions/data";
import { pageMeta } from "@/lib/seo/meta";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { absoluteUrl, paths } from "@/lib/site";

type Params = { letter: string };
export const revalidate = 3600;

export function generateStaticParams(): Params[] {
  return LETTERS.map((letter) => ({ letter }));
}

/**
 * A–Z browse. Always noindex, follow: a list of links is a navigation page,
 * not an answer to a query. It exists so every condition is reachable in
 * two clicks from the hub.
 */
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { letter } = await params;
  if (!isLetter(letter)) return { title: "Not found", robots: { index: false, follow: false } };
  return pageMeta({
    title: `Conditions starting with ${letterLabel(letter)}`,
    description: `Health conditions beginning with ${letterLabel(letter)}: what each one is and which doctor to see.`,
    path: cpaths.letter(letter),
    index: false,
    follow: true,
  });
}

export default async function LetterPage({ params }: { params: Promise<Params> }) {
  const { letter } = await params;
  if (!isLetter(letter)) notFound();
  const all = await listConditions();
  const items = all.filter((c) => letterOf(c.name) === letter);
  const present = new Set(all.map((c) => letterOf(c.name)));
  const path = cpaths.letter(letter as Letter);
  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Conditions", path: cpaths.hub() },
    { name: letterLabel(letter), path },
  ];
  return (
    <>
      <RouteMeta
        data={{ route: "Conditions A–Z", title: `Conditions: ${letterLabel(letter)}`, h1: `Conditions: ${letterLabel(letter)}`, canonical: absoluteUrl(path), index: false, structuredData: "BreadcrumbList", notes: [{ label: "Noindex, follow", text: "Navigation page." }] }}
      />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <div className="wrap">
        <div className="doc" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Condition library · {items.length} conditions</span>
          <h1 style={{ marginTop: "10px" }}>Conditions: {letterLabel(letter)}</h1>
          <nav className="azbar" aria-label="Browse by letter">
            {LETTERS.map((l) =>
              present.has(l) ? (
                <Link key={l} href={cpaths.letter(l)} aria-current={l === letter ? "page" : undefined}>
                  {letterLabel(l)}
                </Link>
              ) : (
                <span key={l}>{letterLabel(l)}</span>
              ),
            )}
          </nav>
          {items.length ? (
            <ul className="condlist">
              {items.map((c) => (
                <li key={c.slug}>
                  <Link href={cpaths.condition(c.slug)}>{c.name}</Link>
                  <span className="dept">{c.department}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No conditions start with {letterLabel(letter)}.</p>
          )}
        </div>
      </div>
    </>
  );
}
