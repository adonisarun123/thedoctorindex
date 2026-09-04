import Link from "next/link";

import { disputeAction, replyAction } from "@/app/dashboard/actions";
import { ActionForm } from "@/components/ActionForm";
import { getDashboardContext } from "@/lib/dashboard";
import { toDisplay } from "@/lib/db/dates";
import { listDoctorReviewsForDashboard } from "@/lib/services/reviews";
import { paths } from "@/lib/site";

export const metadata = { title: "Reviews & replies" };

export default async function DashboardReviews() {
  const { doctor, doctorId, asManager } = await getDashboardContext();
  const rows = await listDoctorReviewsForDashboard(doctorId);
  const { rating } = doctor;

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Reviews &amp; replies</h1>
          <div className="sub">{rating.count} published · {rows.filter((r) => !r.response || r.response.status !== "published").length} awaiting a reply</div>
        </div>
        <Link className="btn quiet" href={paths.policy("reviews")}>Review policy</Link>
      </div>

      <div className="tiles" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="tile"><div className="l">Average</div><div className="v">{rating.count ? rating.average.toFixed(1) : "—"}</div><div className="d">Displayed with the full distribution, never alone</div></div>
        <div className="tile"><div className="l">Evidence-checked</div><div className="v">{rows.filter((r) => r.evidence === "checked").length}</div><div className="d">Reviews where private proof of visit was validated</div></div>
        <div className="tile"><div className="l">Replies pending moderation</div><div className="v">{rows.filter((r) => r.response?.status === "pending").length}</div><div className="d">Checked for health information before they appear</div></div>
      </div>

      <div className="notice" style={{ margin: "16px 0" }}>
        <b>One reply per review, and it must not reveal or confirm any health information</b> — not the condition, not the visit, not that the person was your patient. Replies are moderated before they appear. You cannot pay to remove a review and neither can anyone else.
      </div>

      {rows.length === 0 ? (
        <div className="panel pad" style={{ color: "var(--muted)", fontSize: "14px" }}>No published reviews yet. Reviews appear here once a moderator approves them.</div>
      ) : (
        <div className="rows">
          {rows.map((r) => (
            <article key={r.id} style={{ padding: "16px 20px", borderBottom: "1px solid var(--hair)" }}>
              <div className="rev" style={{ border: 0, padding: 0 }}>
                <div className="top">
                  <span className="who">{r.authorLabel} <span className={`badge ${r.evidence === "checked" ? "ok" : "neut"}`} style={{ marginLeft: "6px" }}>{r.evidence === "checked" ? "Visit evidence checked" : "Evidence not supplied"}</span></span>
                  <span className="when">{r.visitMonth} · {r.mode} · published {toDisplay(r.moderatedAt)}</span>
                </div>
                <div className="dims"><span>Communication {r.communication}/5</span><span>Explanation {r.explanation}/5</span><span>Wait time {r.waitTime}/5</span><span>Facility {r.facility}/5</span></div>
                <p className="txt">{r.status === "redacted" && r.publishedText ? r.publishedText : r.text}</p>
              </div>

              {r.response ? (
                <div className="reply" style={{ marginTop: "12px" }}>
                  <div className="who">Your reply · <span className={`pill ${r.response.status === "published" ? "ok" : r.response.status === "pending" ? "wait" : "warn"}`}>{r.response.status}</span></div>
                  <p className="txt">{r.response.text}</p>
                  {r.response.status === "rejected" && r.response.moderationReason ? <p style={{ fontSize: "12.5px", color: "var(--alert)", marginTop: "4px" }}>Declined: {r.response.moderationReason}</p> : null}
                </div>
              ) : null}

              {!asManager ? (
                <div style={{ marginTop: "12px", display: "grid", gap: "10px" }}>
                  {!r.response || r.response.status === "rejected" ? (
                    <ActionForm action={replyAction} submitLabel="Submit reply for moderation" variant="outline">
                      <input type="hidden" name="reviewId" value={r.id} />
                      <div className="field" style={{ marginBottom: 0 }}>
                        <label htmlFor={`reply-${r.id}`}>Reply (one per review)</label>
                        <textarea id={`reply-${r.id}`} name="text" required maxLength={800} placeholder="Thank the reviewer or address the point raised. Do not confirm they were your patient or mention any health detail." style={{ minHeight: "64px" }} />
                      </div>
                    </ActionForm>
                  ) : null}
                  <details>
                    <summary style={{ fontSize: "12.5px", color: "var(--muted)", cursor: "pointer" }}>Dispute this review</summary>
                    <ActionForm action={disputeAction} submitLabel="Open a dispute" variant="quiet" style={{ marginTop: "8px" }}>
                      <input type="hidden" name="reviewId" value={r.id} />
                      <div className="field" style={{ marginBottom: 0 }}>
                        <select name="reason" defaultValue="Not first-hand (staff, competitor, incentivised)">
                          <option>Not first-hand (staff, competitor, incentivised)</option>
                          <option>Reveals health or personal information</option>
                          <option>Contains a serious allegation that needs escalation</option>
                          <option>Abusive or threatening</option>
                          <option>Factually wrong about a verifiable detail</option>
                        </select>
                        <textarea name="detail" placeholder="What a moderator should know. Do not include patient details." style={{ minHeight: "54px", marginTop: "8px" }} />
                      </div>
                    </ActionForm>
                  </details>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
