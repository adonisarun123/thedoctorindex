import Link from "next/link";

import { getDashboardContext } from "@/lib/dashboard";
import { toDisplay } from "@/lib/db/dates";
import { ArticleStatusPill } from "@/components/ArticleStatusPill";
import { authorEligibility, listArticlesForDoctor } from "@/lib/services/articles";
import { paths } from "@/lib/site";

export const metadata = { title: "Articles" };

export default async function DashboardArticles() {
  const { doctorId, user, asManager } = await getDashboardContext();
  const [rows, gate] = await Promise.all([listArticlesForDoctor(doctorId), asManager ? null : authorEligibility(doctorId, user.id)]);

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Articles</h1>
          <div className="sub">Write for patients under your own name. Each article carries your medical registration number and is reviewed by our team before it goes live.</div>
        </div>
        {gate?.ok ? <Link className="btn solid" href="/dashboard/articles/new">New article</Link> : null}
      </div>

      {asManager ? <div className="notice">Clinic managers cannot write articles. Only the doctor can publish under their own name.</div> : null}
      {gate && !gate.ok ? <div className="notice alert" style={{ marginBottom: "16px" }}>{gate.reason}</div> : null}

      {rows.length === 0 ? (
        <div className="panel pad" style={{ color: "var(--muted)" }}>
          No articles yet. Good first topics answer a question your patients ask you every week — what a test result means, when to come back, what recovery looks like.
        </div>
      ) : (
        rows.map((a) => (
          <div className="qcard" key={a.id}>
            <div className="qh">
              <div>
                <div className="qt"><Link href={`/dashboard/articles/${a.id}`}>{a.title}</Link></div>
                <div className="qm">/articles/{a.slug} · updated {toDisplay(a.updatedAt)}{a.publishedAt ? ` · first published ${toDisplay(a.publishedAt)}` : ""}</div>
              </div>
              <ArticleStatusPill a={a} />
            </div>
            {a.reviewerNote && (a.status === "rejected" || (a.revision && !a.revisionSubmittedAt)) ? (
              <p className="qb" style={{ color: "var(--alert)" }}>Reviewer: {a.reviewerNote}</p>
            ) : null}
            <div className="qacts">
              <Link className="btn quiet" href={`/dashboard/articles/${a.id}`}>Edit</Link>
              {a.status === "published" ? <Link className="btn quiet" href={paths.article(a.slug)} target="_blank">View live</Link> : null}
            </div>
          </div>
        ))
      )}
    </>
  );
}
