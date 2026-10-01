"use client";

import { useActionState, useState } from "react";

import { saveArticleAction, type ArticleFormState } from "@/app/dashboard/article-actions";
import { ARTICLE_LIMITS, normaliseSlug } from "@/lib/articles/format";

export interface ArticleDraft {
  id?: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  sourceUrl: string | null;
}

const count = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);

/**
 * The doctor's article form: title, description, URL, optional original
 * publication link, and the body. Two buttons — save privately, or submit to
 * the review queue. The registration line is shown read-only: it comes from
 * the verified profile, never from this form.
 */
export function ArticleEditor({
  initial,
  slugLocked,
  origin,
  registration,
  submitLabel = "Submit for review",
}: {
  initial: ArticleDraft;
  slugLocked: boolean;
  origin: string;
  registration: string;
  submitLabel?: string;
}) {
  const [state, act, pending] = useActionState<ArticleFormState, FormData>(saveArticleAction, {});
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const [description, setDescription] = useState(initial.description);
  const [body, setBody] = useState(initial.body);
  const [sourceUrl, setSourceUrl] = useState(initial.sourceUrl ?? "");
  const L = ARTICLE_LIMITS;
  const shownSlug = slugLocked ? initial.slug : normaliseSlug(slugTouched ? slug : title);
  const words = count(body);

  return (
    <form action={act} className="stack">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <section className="panel pad">
        <div className="field">
          <label htmlFor="a-title">Title</label>
          <input id="a-title" name="title" type="text" required maxLength={L.titleMax} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. When a child's fever needs a doctor, and when it can wait" />
          <div className="hint">{title.length}/{L.titleMax} characters. Say what the reader will learn; no “best” or “top”.</div>
        </div>
        <div className="field">
          <label htmlFor="a-desc">Description</label>
          <textarea id="a-desc" name="description" rows={2} maxLength={L.descriptionMax} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="One or two sentences shown under the title and in search results." />
          <div className="hint">{description.length}/{L.descriptionMax} characters (at least {L.descriptionMin}). The first 155 appear in Google.</div>
        </div>
        <div className="field">
          <label htmlFor="a-slug">URL</label>
          {slugLocked ? (
            <>
              <input type="hidden" name="slug" value={initial.slug} />
              <div className="mono" style={{ fontSize: "13.5px" }}>{origin}/articles/{initial.slug}</div>
              <div className="hint">Fixed once published, so existing links keep working.</div>
            </>
          ) : (
            <>
              <input id="a-slug" name="slug" type="text" maxLength={L.slugMax} value={slugTouched ? slug : shownSlug} onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }} placeholder="childs-fever-when-to-see-a-doctor" />
              <div className="hint mono">{origin}/articles/{shownSlug || "…"}</div>
            </>
          )}
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="a-src">Original publication link <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
          <input id="a-src" name="sourceUrl" type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://… — only if this article first appeared elsewhere" />
          <div className="hint">If you fill this in, search engines are told the original is the main copy and this page is not indexed here. Leave it empty for articles first published on The Doctor Index.</div>
        </div>
      </section>

      <section className="panel pad">
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="a-body">Article</label>
          <textarea id="a-body" name="body" rows={22} value={body} onChange={(e) => setBody(e.target.value)} style={{ fontFamily: "inherit", lineHeight: 1.55 }} placeholder={"Start with a short paragraph.\n\n## A section heading\n\nLeave a blank line between paragraphs.\n\n- A bulleted point\n- Another point\n\n**Bold**, *italic* and [a link](https://example.org) also work."} />
          <div className="hint">
            {words.toLocaleString("en-IN")} words · at least {L.bodyMinWords} to publish. Use <span className="mono">##</span> for headings and <span className="mono">-</span> for lists.
          </div>
        </div>
      </section>

      <div className="notice">
        Published as written under your name with <b>{registration}</b> from your verified profile. Our team checks authorship and the site&rsquo;s content rules (no superlatives, no promises of outcomes, no fee offers); it does not edit your text.
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <button type="submit" name="intent" value="submit" className="btn solid" disabled={pending}>{pending ? "Working…" : submitLabel}</button>
        <button type="submit" name="intent" value="draft" className="btn" disabled={pending}>Save draft</button>
        {state.error ? <span className="notice alert" style={{ fontSize: "12.5px", padding: "6px 10px" }}>{state.error}</span> : null}
        {state.ok && state.message ? <span className={`notice ${state.queued ? "" : "good"}`} style={{ fontSize: "12.5px", padding: "6px 10px" }}>{state.message}</span> : null}
      </div>
    </form>
  );
}
