import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody, Contents, FaqList } from "@/components/ArticleBody";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ConditionDraftBody } from "@/components/ConditionDraftBody";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { anchorId } from "@/lib/blog/types";
import { plain } from "@/lib/content/text";
import { articleWordCount } from "@/lib/conditions/article";
import { articleBySlug } from "@/lib/conditions/articles";
import { paths as cpaths } from "@/lib/conditions/browse";
import { getConditionDraft, listConditions } from "@/lib/conditions/data";
import { FIRST_CONTACT, departmentBySlug } from "@/lib/conditions/departments";
import { articleIndexable, conditionIndexable, indexableSlugs } from "@/lib/conditions/gate";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { pageMeta } from "@/lib/seo/meta";
import { breadcrumbLd, conditionLd } from "@/lib/seo/structured-data";
import { absoluteUrl, paths } from "@/lib/site";

type Params = { slug: string };

export const revalidate = 3600;
/** Indexable articles are prerendered; the 2,500 drafts render on first request. */
export const dynamicParams = true;

export function generateStaticParams(): Params[] {
  return indexableSlugs().map((slug) => ({ slug }));
}

const BENGALURU = { state: "karnataka", city: "bengaluru" };

/** "2026-10-01" → "01 Oct 2026", the site's display format. */
function displayDate(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const draft = await getConditionDraft(slug);
  if (!draft) return { title: "Not found", robots: { index: false, follow: false } };
  const article = articleBySlug(slug);
  const index = articleIndexable(article);
  return pageMeta({
    title: article?.metaTitle ?? article?.title ?? `${draft.name}: overview and which doctor to see`,
    description: article?.standfirst ?? draft.metaDescription,
    path: cpaths.condition(slug),
    type: "article",
    index,
    follow: true,
    article: article
      ? { publishedTime: article.writtenOn, modifiedTime: article.updatedOn, section: "Conditions", tags: [draft.department] }
      : { section: "Conditions", tags: [draft.department] },
  });
}

export default async function ConditionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const draft = await getConditionDraft(slug);
  if (!draft) notFound();

  const article = articleBySlug(slug);
  const indexable = articleIndexable(article);
  const dept = departmentBySlug(draft.departmentSlug);
  const specialtyKey = article?.specialty ?? draft.specialtyKey;
  const specialty = specialtyKey ? SPECIALTIES[specialtyKey] : null;
  const path = cpaths.condition(slug);
  const title = article?.title ?? draft.name;
  const description = article?.standfirst ?? draft.metaDescription;

  const crumbs = [
    { name: "Home", path: paths.home() },
    { name: "Conditions", path: cpaths.hub() },
    { name: draft.department, path: cpaths.department(draft.departmentSlug) },
    { name: draft.name, path },
  ];

  // Related: same department, indexable only — a page never points a crawler
  // at a page we decided not to index. The department hub links everything.
  const related = (await listConditions())
    .filter((c) => c.departmentSlug === draft.departmentSlug && c.slug !== slug && conditionIndexable(c.slug))
    .slice(0, 8);

  const sourceById = new Map(draft.sources.map((s) => [s.id, s]));
  const sourceLabel = (id: string) => {
    const s = sourceById.get(id);
    if (!s || /emergency/i.test(s.label)) return null;
    return s.label.split(" — ")[0];
  };
  const usedSources = article ? draft.sources.filter((s) => !/emergency/i.test(s.label)) : draft.sources;

  const wordCount = article ? articleWordCount(article) : draft.wordCount;
  const readingMinutes = Math.max(2, Math.round(wordCount / 220));
  const toc = article
    ? article.body.filter((b) => b.k === "h2").map((b) => ({ id: anchorId((b as { text: string }).text), text: plain((b as { text: string }).text) }))
    : draft.sections.map((s) => ({ id: anchorId(s.heading), text: s.heading }));

  const ld = conditionLd({
    path,
    name: draft.name,
    title,
    description,
    otherNames: draft.otherNames,
    specialtyKey,
    orphaCode: draft.orphaCode,
    basedOn: draft.sources.filter((s) => !/emergency/i.test(s.label) && !/hpo\.jax/.test(s.url)).map((s) => s.url),
    article: article
      ? {
          writtenOn: article.writtenOn,
          updatedOn: article.updatedOn,
          wordCount,
          symptoms: article.symptoms,
          tests: article.tests,
          treatments: article.treatments,
          reviewed: indexable && article.reviewer ? { name: article.reviewer.name, on: article.reviewedOn, qualification: article.reviewer.qualification } : null,
        }
      : null,
  });

  const otherNames = draft.otherNames;

  return (
    <>
      <RouteMeta
        data={{
          route: article ? "Condition article" : "Condition draft",
          title,
          h1: title,
          canonical: absoluteUrl(path),
          index: indexable,
          structuredData: `MedicalWebPage › MedicalCondition${article ? " (signs, tests, treatments) › Article" : ""}${indexable ? " (reviewedBy, lastReviewed)" : ""}, BreadcrumbList`,
          lastmod: article?.updatedOn ?? draft.compiledOn,
          notes: [
            indexable
              ? { label: "Indexable", text: `Original article, reviewed by ${article!.reviewer!.name} on ${article!.reviewedOn}.` }
              : article
                ? { label: "Noindex: awaiting clinical review", text: "Original article exists; it is indexed once a named clinician signs it off (reviewer + reviewedOn)." }
                : { label: "Noindex: compiled draft", text: `Source text, ${draft.uniqueWordCount} of ${draft.wordCount} words not shared with other drafts. Indexed only once an original, reviewed article replaces it.` },
          ],
        }}
      />
      <JsonLd data={[ld, breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <article className="doc">
          <span className="eyebrow">
            {draft.department} · {readingMinutes} min read
          </span>
          <h1 style={{ marginTop: "10px" }}>{title}</h1>
          <p style={{ fontSize: "17px", color: "var(--ink-2)", marginTop: "10px" }}>{description}</p>

          {otherNames.length ? (
            <p style={{ fontSize: "14.5px", color: "var(--muted)" }}>
              <b style={{ color: "var(--ink-2)", fontWeight: 500 }}>Also known as:</b> {otherNames.slice(0, 6).join("; ")}
              {otherNames.length > 6 ? (
                <details style={{ display: "inline" }}>
                  <summary style={{ display: "inline", cursor: "pointer" }}> and {otherNames.length - 6} more</summary> {otherNames.slice(6).join("; ")}
                </details>
              ) : null}
            </p>
          ) : null}

          <div className="register" style={{ margin: "20px 0 26px" }}>
            {article ? (
              <div className="rrow">
                <span className="dot ok" />
                <div>
                  <div className="lbl">Written by {article.author}</div>
                  <div className="src">Original article for readers in India · updated {article.updatedOn}</div>
                </div>
                <span className="when">{article.writtenOn}</span>
              </div>
            ) : (
              <div className="rrow">
                <span className="dot" />
                <div>
                  <div className="lbl">Compiled from public sources</div>
                  <div className="src">
                    Text selected and arranged from {draft.sourceCollection.replace("MedlinePlus", "MedlinePlus (US National Library of Medicine)").replace(" + ", " and ")}. It describes the condition as those sources do; it has not been rewritten for India.
                  </div>
                </div>
                <span className="when">{displayDate(draft.compiledOn)}</span>
              </div>
            )}
            {indexable && article?.reviewer ? (
              <div className="rrow">
                <span className="dot ok" />
                <div>
                  <div className="lbl">Medically reviewed</div>
                  <div className="src">
                    {article.reviewer.doctorSlug ? <Link href={paths.doctor(article.reviewer.doctorSlug)}>{article.reviewer.name}</Link> : article.reviewer.name}, {article.reviewer.qualification} · {article.reviewer.council} {article.reviewer.registration}
                  </div>
                </div>
                <span className="when">{article.reviewedOn}</span>
              </div>
            ) : (
              <div className="rrow">
                <span className="dot" />
                <div>
                  <div className="lbl">Not medically reviewed</div>
                  <div className="src">No registered doctor has reviewed this page. Use it to decide who to see and what to ask — not to diagnose or treat.</div>
                </div>
                <span className="when">—</span>
              </div>
            )}
          </div>

          <div className="notice alert">
            <b>This is not medical advice.</b> If symptoms are severe, sudden or getting worse, call 112 (or 108 for an ambulance) or go to the nearest emergency department.
          </div>

          {!article && draft.sourceGaps.length ? (
            <p style={{ fontSize: "14.5px", color: "var(--muted)", marginTop: "14px" }}>
              The sources compiled here do not cover: {draft.sourceGaps.join(", ").split(", ").filter((v, i, a) => a.indexOf(v) === i).join(", ")}. Ask the treating doctor about these.
            </p>
          ) : null}

          {toc.length > 3 ? <Contents items={toc} /> : null}

          {article ? <ArticleBody blocks={article.body} /> : <ConditionDraftBody sections={draft.sections} sourceLabel={sourceLabel} />}

          {article && article.faqs.length ? (
            <>
              <h2 id="questions">Common questions</h2>
              <FaqList faqs={article.faqs} />
            </>
          ) : null}

          <div className="panel pad" style={{ marginTop: "30px" }}>
            <div className="eyebrow">Find a doctor for {draft.name}</div>
            {specialty && dept?.basis !== "none" ? (
              <>
                <p style={{ marginTop: "8px", marginBottom: "12px" }}>
                  {dept?.basis === "nearest" && !article
                    ? `${draft.department} is not listed separately on The Doctor Index; the nearest speciality is ${specialty.name.toLowerCase()}.`
                    : `This condition is usually assessed by ${specialty.aOne}.`}{" "}
                  Every profile shows the doctor’s registration and what has been checked.
                </p>
                <div className="quick" style={{ marginTop: 0 }}>
                  <Link className="btn" href={paths.citySpecialty(BENGALURU.state, BENGALURU.city, specialty.slug)} style={{ display: "inline-block" }}>
                    {specialty.plural} in Bengaluru
                  </Link>
                  <Link className="chip" href={paths.specialty(specialty.key)}>
                    {specialty.plural} across India
                  </Link>
                  {(article?.alsoSee ?? []).map((k) => (
                    <Link key={k} className="chip" href={paths.specialty(k)}>
                      {SPECIALTIES[k].plural}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p style={{ marginTop: "8px", marginBottom: "12px" }}>
                  This condition is usually assessed by a {draft.clinicianLabel.toLowerCase()}. The Doctor Index does not list that speciality yet. A family physician or paediatrician can examine, arrange first tests and refer to the right specialist centre.
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

          {related.length ? (
            <>
              <h2 id="related">Related conditions</h2>
              <ul>
                {related.map((c) => (
                  <li key={c.slug}>
                    <Link href={cpaths.condition(c.slug)}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <p style={{ marginTop: "14px" }}>
            <Link href={cpaths.department(draft.departmentSlug)}>All {draft.department.toLowerCase()} conditions →</Link>
          </p>

          <h2 id="sources">Sources</h2>
          <ul style={{ fontSize: "15px" }}>
            {(article ? [...article.sources.map((s) => ({ label: s.label, url: s.url, rights: "" })), ...usedSources] : usedSources).map((s, i) => (
              <li key={`${s.url}-${i}`}>
                <a href={s.url} rel="noopener" target="_blank">
                  {s.label}
                </a>
                {s.rights ? <span style={{ color: "var(--muted)" }}> — {s.rights}</span> : null}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: "12.5px", color: "var(--muted)" }}>
            {article ? `${article.title} is original text by ${article.author}; the compiled source draft was used for research. ` : null}
            {draft.attribution}
            {draft.hpoCitation ? ` ${draft.hpoCitation}` : ""}
          </p>
          <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "18px" }}>
            General information, not advice about your situation. Errors can be reported through the{" "}
            <Link href={paths.policy("corrections")}>corrections process</Link>. Reference {draft.sourceId}.
          </p>
        </article>
      </div>
    </>
  );
}
