import Link from "next/link";

import { moderateResponseAction, moderateReviewAction, resolveReviewReportAction, validateEvidenceAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { toDisplay } from "@/lib/db/dates";
import { listResponseQueue, listReviewQueue, listReviewReports } from "@/lib/services/reviews";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Review moderation" };

export default async function AdminReviews({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const status = (typeof sp.status === "string" ? sp.status : "pending") as "pending" | "published" | "redacted" | "rejected" | "removed";
  const [reviews, responses, reports] = await Promise.all([listReviewQueue(status), listResponseQueue(), listReviewReports(true)]);

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Review moderation</h1>
          <div className="sub">Highest risk first. Automated checks flag; a person decides. <b>Step 1:</b> open the proof of consultation and record whether it is valid (doctor or practice name and a date that fits the stated visit month). <b>Step 2:</b> publish, redact or reject the text. Publishing is blocked until the proof is validated; a rejected proof rejects the review automatically.</div>
        </div>
        <div className="quick" style={{ marginTop: 0 }}>
          {(["pending", "published", "redacted", "rejected", "removed"] as const).map((st) => (
            <Link key={st} className="chip" href={`/admin/reviews?status=${st}`} style={status === st ? { borderColor: "var(--accent)", color: "var(--accent)" } : undefined}>{st}</Link>
          ))}
        </div>
      </div>

      {reports.length > 0 ? (
        <section style={{ marginBottom: "22px" }}>
          <div className="chart-head"><span className="t">Open reports on reviews</span><span className="m">{reports.length}</span></div>
          {reports.map((rp) => (
            <div className="qcard" key={rp.id}>
              <div className="qh">
                <div>
                  <div className="qt">{rp.reason} <span className={`pill ${rp.priority === "safety" ? "warn" : "neut"}`} style={{ marginLeft: "6px" }}>{rp.priority}</span></div>
                  <div className="qm">on review by {rp.review.authorLabel} for Dr {rp.review.doctor.name} · {toDisplay(rp.createdAt)}{rp.contact ? ` · contact ${rp.contact}` : ""}</div>
                </div>
              </div>
              {rp.detail ? <div className="qb">{rp.detail}</div> : null}
              <div className="qb" style={{ marginTop: "6px", fontStyle: "italic" }}>“{rp.review.text}”</div>
              <ActionForm action={resolveReviewReportAction} submitLabel="Update report" variant="outline" style={{ marginTop: "8px" }}>
                <input type="hidden" name="id" value={rp.id} />
                <div className="two" style={{ gridTemplateColumns: "180px 1fr" }}>
                  <div className="field" style={{ marginBottom: 0 }}><label>Status</label><select name="status" defaultValue="resolved"><option value="assessed">Assessed (in progress)</option><option value="resolved">Resolved</option><option value="dismissed">Dismissed</option></select></div>
                  <div className="field" style={{ marginBottom: 0 }}><label>Resolution</label><input type="text" name="resolution" placeholder="Redacted phone number; review stays published" /></div>
                </div>
              </ActionForm>
            </div>
          ))}
        </section>
      ) : null}

      {responses.length > 0 ? (
        <section style={{ marginBottom: "22px" }}>
          <div className="chart-head"><span className="t">Doctor replies awaiting moderation</span><span className="m">{responses.length}</span></div>
          {responses.map((r) => (
            <div className="qcard" key={r.id}>
              <div className="qh"><div><div className="qt">Reply from Dr {r.review.doctor.name}</div><div className="qm">to review by {r.review.authorLabel} · {toDisplay(r.createdAt)}</div></div></div>
              <div className="qb" style={{ fontStyle: "italic", color: "var(--muted)" }}>Review: “{r.review.text}”</div>
              <div className="qb" style={{ marginTop: "6px" }}>Reply: “{r.text}”</div>
              <ActionForm action={moderateResponseAction} submitLabel="Apply" variant="outline" style={{ marginTop: "8px" }}>
                <input type="hidden" name="id" value={r.id} />
                <div className="two" style={{ gridTemplateColumns: "180px 1fr" }}>
                  <div className="field" style={{ marginBottom: 0 }}><label>Decision</label><select name="decision" defaultValue="published"><option value="published">Publish</option><option value="rejected">Reject — reveals health information</option></select></div>
                  <div className="field" style={{ marginBottom: 0 }}><label>Reason (shown to doctor if rejected)</label><input type="text" name="reason" /></div>
                </div>
              </ActionForm>
            </div>
          ))}
        </section>
      ) : null}

      <section>
        <div className="chart-head"><span className="t">Reviews · {status}</span><span className="m">{reviews.length}</span></div>
        {reviews.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)" }}>Nothing here.</div> : null}
        {reviews.map((r) => (
          <div className="qcard" key={r.id}>
            <div className="qh">
              <div>
                <div className="qt">{r.authorLabel} on <Link href={`/admin/doctors/${r.doctorId}`}>Dr {r.doctor.name}</Link></div>
                <div className="qm">{r.visitMonth} · {r.mode} · for {r.forWhom} · submitted {toDisplay(r.submittedAt)} · comm {r.communication} / expl {r.explanation} / wait {r.waitTime} / fac {r.facility}</div>
              </div>
              <div className="risk">
                <span className={`pill ${r.riskScore >= 40 ? "warn" : r.riskScore >= 15 ? "wait" : "ok"}`}>risk {r.riskScore}</span>
                {r.riskFlags.map((f) => <span key={f} className="pill neut">{f}</span>)}
                <span className={`pill ${r.evidence === "checked" ? "ok" : r.evidence === "supplied" ? "wait" : "neut"}`}>evidence {r.evidence}</span>
              </div>
            </div>
            <div className="qb">“{r.text}”</div>
            {r.status === "redacted" && r.publishedText ? <div className="qb" style={{ marginTop: "6px" }}><b>Published as:</b> “{r.publishedText}”</div> : null}
            {r.moderationReason ? <div className="qm" style={{ marginTop: "6px" }}>reason: {r.moderationReason}</div> : null}

            {r.evidenceFiles.length && r.evidenceFiles[0]?.outcome === "supplied" ? (
              <div style={{ marginTop: "10px", borderTop: "1px solid var(--hair)", paddingTop: "10px" }}>
                <div className="eyebrow" style={{ marginBottom: "6px" }}>Step 1 · Proof of consultation (private)</div>
                <Link href={`/admin/files/${r.evidenceFiles[0].fileId}`} target="_blank">Open document ↗</Link>
                <div className="qm" style={{ margin: "4px 0 6px" }}>Valid when it names this doctor or their practice and carries a date consistent with “{r.visitMonth}”. Diagnoses or results may be covered by the reviewer; that does not invalidate it.</div>
                <ActionForm action={validateEvidenceAction} submitLabel="Record evidence decision" variant="outline" style={{ marginTop: "6px" }}>
                  <input type="hidden" name="id" value={r.evidenceFiles[0].id} />
                  <div className="two" style={{ gridTemplateColumns: "220px 1fr" }}>
                    <div className="field" style={{ marginBottom: 0 }}><select name="outcome" defaultValue="checked"><option value="checked">Valid — doctor/practice and date match</option><option value="rejected">Not valid — rejects the review</option></select></div>
                    <div className="field" style={{ marginBottom: 0 }}><input type="text" name="note" placeholder="Prescription on clinic letterhead dated 12 Aug" /></div>
                  </div>
                </ActionForm>
              </div>
            ) : null}

            {r.status === "pending" && r.evidence !== "checked" ? (
              <div className="qm" style={{ marginTop: "10px", color: "var(--pending)" }}>Step 2 unlocks once the proof is recorded as valid. {r.evidence === "none" ? "No document was supplied — reject." : ""}</div>
            ) : null}
            {r.status === "pending" || status !== "pending" ? (
              <ActionForm action={moderateReviewAction} submitLabel="Apply decision" variant="solid" style={{ marginTop: "10px" }}>
                <input type="hidden" name="id" value={r.id} />
                <div className="two" style={{ gridTemplateColumns: "220px 1fr" }}>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Decision</label>
                    <select name="decision" defaultValue={r.status === "pending" ? "published" : r.status}>
                      <option value="published">Publish as written</option>
                      <option value="redacted">Publish redacted text</option>
                      <option value="rejected">Reject (policy breach)</option>
                      <option value="removed">Remove (post-publication)</option>
                    </select>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}><label>Reason code / note</label><input type="text" name="reason" placeholder="phone_number redacted; otherwise compliant" /></div>
                </div>
                <div className="field" style={{ marginTop: "8px", marginBottom: 0 }}>
                  <label>Redacted text (only for “publish redacted”)</label>
                  <textarea name="publishedText" defaultValue={r.publishedText ?? r.text} style={{ minHeight: "64px" }} />
                </div>
              </ActionForm>
            ) : null}
          </div>
        ))}
      </section>
    </>
  );
}
