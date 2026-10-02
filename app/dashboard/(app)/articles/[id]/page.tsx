import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteArticleAction, withdrawArticleAction } from "@/app/dashboard/article-actions";
import { ActionForm } from "@/components/ActionForm";
import { ArticleEditor, type ArticleDraft } from "@/components/ArticleEditor";
import { ArticleStatusPill } from "@/components/ArticleStatusPill";
import { ShareArticle } from "@/components/ShareArticle";
import { registrationLine } from "@/lib/articles/format";
import { getDashboardContext } from "@/lib/dashboard";
import { toDisplay } from "@/lib/db/dates";
import { displayName } from "@/lib/display-name";
import { authorEligibility, getArticleForDoctor, type ArticleRevision } from "@/lib/services/articles";
import { SITE, absoluteUrl, paths } from "@/lib/site";

export const metadata = { title: "Edit article" };

export default async function DashboardArticle({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { id } = await params;
  const sp = await searchParams;
  const { doctor, doctorId, user, asManager } = await getDashboardContext();
  if (asManager) notFound();
  const isNew = id === "new";
  const row = isNew ? null : /^[0-9a-f-]{36}$/i.test(id) ? await getArticleForDoctor(id, doctorId) : null;
  if (!isNew && !row) notFound();
  const gate = await authorEligibility(doctorId, user.id);

  // A published article opens on its pending edit, if there is one.
  const rev = row?.revision as ArticleRevision | null | undefined;
  const initial: ArticleDraft = row
    ? { id: row.id, slug: row.slug, title: rev?.title ?? row.title, description: rev?.description ?? row.description, body: rev?.body ?? row.body, sourceUrl: rev ? rev.sourceUrl : row.sourceUrl }
    : { slug: "", title: "", description: "", body: "", sourceUrl: null };
  const registration = registrationLine(doctor.registration.council, doctor.registration.number) ?? "your registration number";
  const host = SITE.origin.replace(/^https?:\/\//, "");

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>{isNew ? "New article" : row!.title}</h1>
          <div className="sub">
            {row ? <><ArticleStatusPill a={row} /> · updated {toDisplay(row.updatedAt)}</> : "Saved privately until you submit it for review."}
          </div>
        </div>
        <Link className="btn quiet" href="/dashboard/articles">All articles</Link>
      </div>

      {sp.saved ? <div className="notice good" style={{ marginBottom: "14px" }}>Draft saved.</div> : null}
      {!gate.ok ? <div className="notice alert" style={{ marginBottom: "14px" }}>{gate.reason}</div> : null}
      {row?.reviewerNote && (row.status === "rejected" || (row.revision && !row.revisionSubmittedAt)) ? (
        <div className="notice alert" style={{ marginBottom: "14px" }}><b>Reviewer&rsquo;s note:</b> {row.reviewerNote}</div>
      ) : null}
      {row?.status === "published" ? (
        <div className="notice" style={{ marginBottom: "14px" }}>
          Live at <Link href={paths.article(row.slug)} target="_blank">/articles/{row.slug}</Link>. Changes you submit are reviewed first; the live version stays up until they are approved.
        </div>
      ) : null}

      {row?.status === "published" ? (
        <ShareArticle
          url={absoluteUrl(paths.article(row.slug))}
          slug={row.slug}
          title={row.title}
          caption={`New article: ${row.title}\n\n${row.description}\n\nWritten by ${displayName(doctor)}${registrationLine(row.registrationCouncil, row.registrationNumber) ? ` (Reg. ${registrationLine(row.registrationCouncil, row.registrationNumber)})` : ""} on The Doctor Index.`}
        />
      ) : null}

      {gate.ok ? (
        <ArticleEditor
          initial={initial}
          slugLocked={Boolean(row?.publishedAt)}
          origin={host}
          registration={registration}
          submitLabel={row?.status === "published" ? "Submit edit for review" : "Submit for review"}
        />
      ) : null}

      {row ? (
        <div className="qacts" style={{ marginTop: "22px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {row.status === "published" && row.revision ? (
            <ActionForm action={withdrawArticleAction} submitLabel="Discard pending edit" variant="quiet" inline confirm="Discard your unpublished changes?">
              <input type="hidden" name="id" value={row.id} />
              <input type="hidden" name="what" value="revision" />
            </ActionForm>
          ) : null}
          {row.status === "published" || row.status === "submitted" ? (
            <ActionForm action={withdrawArticleAction} submitLabel={row.status === "published" ? "Take down from the site" : "Withdraw from review"} variant="quiet" inline confirm={row.status === "published" ? "Take this article off the site? You can resubmit it later." : undefined}>
              <input type="hidden" name="id" value={row.id} />
              <input type="hidden" name="what" value="article" />
            </ActionForm>
          ) : null}
          {!row.publishedAt ? (
            <ActionForm action={deleteArticleAction} submitLabel="Delete draft" variant="quiet" inline confirm="Delete this draft permanently?">
              <input type="hidden" name="id" value={row.id} />
            </ActionForm>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
