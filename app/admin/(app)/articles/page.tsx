import Link from "next/link";

import { decideArticleAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticleStatusPill } from "@/components/ArticleStatusPill";
import { articleWordCount, parseArticleBody, registrationLine } from "@/lib/articles/format";
import { requireStaff } from "@/lib/auth/session";
import { toDisplay } from "@/lib/db/dates";
import { authorEligibility, listArticleQueue, type ArticleRevision } from "@/lib/services/articles";
import { paths } from "@/lib/site";

export const metadata = { title: "Doctor articles" };

/**
 * Review queue for articles doctors publish under their own name. Staff
 * approve or reject with a note; they never edit the text. The checks are
 * authorship and content rules — this is not clinical peer review, and the
 * public page says so.
 */
export default async function AdminArticles({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff("content_editor");
  const showAll = (await searchParams).all === "1";
  const rows = await listArticleQueue(showAll);
  const gates = await Promise.all(rows.map((r) => authorEligibility(r.doctorId, null)));

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Doctor articles</h1>
          <div className="sub">
            Approve publishes exactly what the doctor wrote, with the registration number from their verified profile. Check: written by a clinician in their own field, no superlatives or outcome promises, no fees or offers, no patient-identifying detail, not copied from elsewhere without the original link.
          </div>
        </div>
        <Link className="btn quiet" href={showAll ? "/admin/articles" : "/admin/articles?all=1"}>{showAll ? "Waiting only" : "Show all"}</Link>
      </div>
      {rows.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)" }}>Queue is empty.</div> : null}
      {rows.map((a, i) => {
        const rev = a.status === "published" && a.revisionSubmittedAt ? (a.revision as ArticleRevision) : null;
        const shown = rev ?? { title: a.title, description: a.description, body: a.body, sourceUrl: a.sourceUrl };
        const gate = gates[i];
        const waiting = a.status === "submitted" || Boolean(rev);
        return (
          <div className="qcard" id={a.id} key={a.id}>
            <div className="qh">
              <div>
                <div className="qt">{shown.title}</div>
                <div className="qm">
                  <Link href={`/admin/doctors/${a.doctorId}`}>Dr {a.doctor.name}</Link> · /articles/{a.slug} · {articleWordCount(shown).toLocaleString("en-IN")} words · {rev ? `edit submitted ${toDisplay(a.revisionSubmittedAt)}` : `submitted ${toDisplay(a.submittedAt)}`} · by {a.author.email ?? a.author.phone}
                </div>
              </div>
              <ArticleStatusPill a={a} />
            </div>
            <dl className="kvi">
              <dt>Will print</dt>
              <dd>{gate.ok ? registrationLine(gate.council, gate.number) : <span style={{ color: "var(--alert)" }}>Cannot publish — {gate.reason}</span>}</dd>
              <dt>Description</dt>
              <dd>{shown.description}</dd>
              <dt>Original</dt>
              <dd>{shown.sourceUrl ? <><a href={shown.sourceUrl} target="_blank" rel="noopener nofollow">{shown.sourceUrl}</a> — canonical points there; not indexed here</> : "First published here — indexed"}</dd>
              {rev ? <><dt>Live title</dt><dd style={{ color: "var(--muted)" }}>{a.title} (stays live until this edit is approved)</dd></> : null}
              {a.status === "published" ? <><dt>Live page</dt><dd><Link href={paths.article(a.slug)} target="_blank">{paths.article(a.slug)}</Link></dd></> : null}
            </dl>
            <details style={{ margin: "8px 0" }}>
              <summary style={{ cursor: "pointer", fontSize: "14px" }}>Read the {rev ? "edited " : ""}article</summary>
              <div className="doc" style={{ marginTop: "10px", maxHeight: "520px", overflow: "auto", border: "1px solid var(--hair)", borderRadius: "8px", padding: "12px 16px" }}>
                <ArticleBody blocks={parseArticleBody(shown.body)} />
              </div>
            </details>
            {waiting ? (
              <ActionForm action={decideArticleAction} submitLabel="Apply decision" variant="solid" style={{ marginTop: "8px" }}>
                <input type="hidden" name="id" value={a.id} />
                <div className="two" style={{ gridTemplateColumns: "200px 1fr" }}>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Decision</label>
                    <select name="decision" defaultValue={gate.ok ? "published" : "rejected"}>
                      <option value="published" disabled={!gate.ok}>Approve and publish</option>
                      <option value="rejected">Return with note</option>
                    </select>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Note to the doctor (required to return)</label>
                    <input type="text" name="note" placeholder="e.g. Remove the fee offer in the last paragraph; add the original link — this appeared on your clinic blog." />
                  </div>
                </div>
              </ActionForm>
            ) : a.reviewerNote ? (
              <p className="qb">Note: {a.reviewerNote}</p>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
