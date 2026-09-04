import Link from "next/link";

import { decideCorrectionAction, resolveProfileReportAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { toDisplay } from "@/lib/db/dates";
import { listCorrections, listProfileReports } from "@/lib/services/cases";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Reports & corrections" };

export default async function AdminReports({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const showAll = sp.all === "1";
  const [reports, corrections] = await Promise.all([listProfileReports(!showAll), listCorrections(!showAll)]);

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Reports &amp; corrections</h1>
          <div className="sub">Safety priority first: 4-hour assessment. Corrections: 3 business days. Serious allegations escalate to the legal queue (EMAIL_LEGAL_ESCALATION_INBOX).</div>
        </div>
        <Link className="btn quiet" href={showAll ? "/admin/reports" : "/admin/reports?all=1"}>{showAll ? "Open only" : "Show decided"}</Link>
      </div>

      <section style={{ marginBottom: "22px" }}>
        <div className="chart-head"><span className="t">Profile reports</span><span className="m">{reports.length}</span></div>
        {reports.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)" }}>None open.</div> : null}
        {reports.map((r) => (
          <div className="qcard" key={r.id}>
            <div className="qh">
              <div><div className="qt">{r.reason} <span className={`pill ${r.priority === "safety" ? "warn" : r.priority === "high" ? "wait" : "neut"}`} style={{ marginLeft: "6px" }}>{r.priority}</span></div><div className="qm">on <Link href={`/admin/doctors/${r.doctorId}`}>Dr {r.doctor.name}</Link> · {toDisplay(r.createdAt)}{r.contact ? ` · contact ${r.contact}` : ""}</div></div>
              <span className={`pill ${r.status === "open" ? "wait" : r.status === "resolved" ? "ok" : "neut"}`}>{r.status}</span>
            </div>
            {r.detail ? <div className="qb">{r.detail}</div> : null}
            {r.resolution ? <div className="qm" style={{ marginTop: "6px" }}>resolution: {r.resolution}</div> : null}
            {r.status === "open" || r.status === "assessed" ? (
              <ActionForm action={resolveProfileReportAction} submitLabel="Update" variant="outline" style={{ marginTop: "8px" }}>
                <input type="hidden" name="id" value={r.id} />
                <div className="two" style={{ gridTemplateColumns: "180px 1fr" }}>
                  <div className="field" style={{ marginBottom: 0 }}><label>Status</label><select name="status" defaultValue="resolved"><option value="assessed">Assessed (in progress)</option><option value="resolved">Resolved</option><option value="dismissed">Dismissed</option></select></div>
                  <div className="field" style={{ marginBottom: 0 }}><label>Resolution</label><input type="text" name="resolution" placeholder="Profile retired after council confirmed…" /></div>
                </div>
              </ActionForm>
            ) : null}
          </div>
        ))}
      </section>

      <section>
        <div className="chart-head"><span className="t">Corrections</span><span className="m">{corrections.length}</span></div>
        {corrections.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)" }}>None open.</div> : null}
        {corrections.map((c) => (
          <div className="qcard" key={c.id}>
            <div className="qh">
              <div><div className="qt">{c.field} · <Link href={`/admin/doctors/${c.doctorId}`}>Dr {c.doctor.name}</Link></div><div className="qm">{toDisplay(c.createdAt)} · {c.isDoctorOrStaff ? "from the doctor or their staff" : "from the public"}{c.contact ? ` · contact ${c.contact}` : ""}</div></div>
              <span className={`pill ${c.status === "open" ? "wait" : c.status === "applied" ? "ok" : "neut"}`}>{c.status}</span>
            </div>
            <dl className="kvi">
              <dt>Currently says</dt><dd style={{ color: "var(--muted)" }}>{c.currentValue ?? "—"}</dd>
              <dt>Should say</dt><dd>{c.proposedValue}</dd>
              {c.sourceNote ? <><dt>Evidence</dt><dd>{c.sourceNote}</dd></> : null}
              {c.note ? <><dt>Note</dt><dd>{c.note}</dd></> : null}
            </dl>
            {c.status === "open" ? (
              <ActionForm action={decideCorrectionAction} submitLabel="Apply decision" variant="solid" style={{ marginTop: "8px" }}>
                <input type="hidden" name="id" value={c.id} />
                <div className="two" style={{ gridTemplateColumns: "180px 1fr" }}>
                  <div className="field" style={{ marginBottom: 0 }}><label>Decision</label><select name="decision" defaultValue="applied"><option value="applied">Applied</option><option value="rejected">Rejected</option></select></div>
                  <div className="field" style={{ marginBottom: 0 }}><label>Note</label><input type="text" name="note" placeholder="Confirmed with practice by phone" /></div>
                </div>
                <div className="two" style={{ gridTemplateColumns: "1fr 1fr", marginTop: "8px" }}>
                  <div className="field" style={{ marginBottom: 0 }}><label>Apply to field (optional)</label><input type="text" name="applyField" placeholder="practice.<id>.hours · about · languages" /><div className="hint">Leave empty if you fixed it on the doctor page.</div></div>
                  <div className="field" style={{ marginBottom: 0 }}><label>Value</label><input type="text" name="applyValue" defaultValue={c.proposedValue} /></div>
                </div>
              </ActionForm>
            ) : null}
          </div>
        ))}
      </section>
    </>
  );
}
