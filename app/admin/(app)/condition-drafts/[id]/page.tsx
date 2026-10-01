import Link from "next/link";
import { notFound } from "next/navigation";

import { requireStaff } from "@/lib/auth/session";
import { conditionDraftById } from "@/lib/content/condition-drafts";
import { privateMeta } from "@/lib/seo/meta";

export const metadata = privateMeta("Condition article draft");

export default async function ConditionDraftPage({ params }: { params: Promise<{ id: string }> }) {
  // Guard inside the page: a parent layout alone does not protect streamed child data.
  await requireStaff();
  const article = await conditionDraftById((await params).id);
  if (!article) notFound();
  return <article style={{ maxWidth: "860px" }}>
    <Link href="/admin/condition-drafts">← Condition article drafts</Link>
    <p className="eyebrow" style={{ marginTop: "20px" }}>{article.department} · {article.id}</p>
    <h1>{article.title}</h1>
    <p style={{ color: "var(--muted)" }}>{article.word_count.toLocaleString()} body words · Compiled {article.compiled_on} · Not medically reviewed</p>
    <div className="notice alert"><b>Unpublished research draft.</b> {article.source_method}</div>
    <details style={{ margin: "22px 0" }} open>
      <summary><b>Review notes and missing evidence</b></summary>
      <ul>{article.review_flags.map((flag) => <li key={flag}>{flag}</li>)}</ul>
      <p>Unfilled source fields: {article.source_gaps.join("; ") || "None of the tracked fields"}.</p>
    </details>
    {article.sections.map((section, index) => <section key={index} style={{ marginTop: "30px", lineHeight: 1.75 }}>
      <h2>{section.heading}</h2>
      {section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
      {section.items.length ? <ul>{section.items.map((item, i) => <li key={i}>{item}</li>)}</ul> : null}
      {section.source_ids.length ? <p style={{ fontSize: "12px", color: "var(--muted)" }}>
        Sources: {section.source_ids.map((id, i) => <span key={id}>{i ? ", " : ""}<a href={`#source-${id}`}>{id}</a></span>)}
      </p> : null}
    </section>)}
    <section style={{ marginTop: "36px", overflowWrap: "anywhere" }}>
      <h2>Sources and attribution</h2>
      <ol>{article.sources.map((source) => <li id={`source-${source.id}`} key={source.id} style={{ marginBottom: "12px" }}>
        <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>. {source.rights}.
        {source.version ? ` Source version/date: ${source.version}.` : ""} Retrieved {source.retrieved_on}.
      </li>)}</ol>
      <p style={{ fontSize: "12.5px", color: "var(--muted)" }}>{article.attribution}</p>
      <p style={{ fontSize: "12.5px", color: "var(--muted)" }}>{article.hpo_citation}</p>
    </section>
  </article>;
}
