import Link from "next/link";

import { decideCertificateAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { requireStaff } from "@/lib/auth/session";
import { toDisplay } from "@/lib/db/dates";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { CERT_SLA_HOURS, certificateQueue } from "@/lib/services/qualification-evidence";

export const metadata = { title: "Qualification certificates" };

const TABS = [
  ["supplied", "Waiting"],
  ["checked", "Verified"],
  ["rejected", "Rejected"],
] as const;

/**
 * Certificates doctors uploaded for their qualifications, fellowships and
 * courses. Open the file, compare it with the degree, institution and year
 * on the row, then verify or reject. Verifying records a qualification check
 * that carries the file, so the public "verified" mark is traceable to it.
 */
export default async function AdminQualifications({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const tab = (TABS.find(([k]) => k === sp.status)?.[0] ?? "supplied") as (typeof TABS)[number][0];
  const rows = await certificateQueue(tab);
  const now = Date.now();
  const overdue = tab === "supplied" ? rows.filter((r) => now - r.createdAt.getTime() > CERT_SLA_HOURS * 3600_000).length : 0;

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Qualification certificates</h1>
          <div className="sub">
            Check the name on the certificate matches the doctor, and that the qualification, institution and year match the row. Doctors are promised an answer
            within 2 business days. Files are private: never download them to a shared drive or forward them.
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {TABS.map(([k, label]) => (
            <Link key={k} className={`btn ${k === tab ? "solid" : "quiet"}`} href={k === "supplied" ? "/admin/qualifications" : `/admin/qualifications?status=${k}`}>{label}</Link>
          ))}
        </div>
      </div>

      {overdue ? <div className="notice alert" style={{ marginBottom: "14px" }}><b>{overdue} certificate{overdue === 1 ? "" : "s"} waiting more than {CERT_SLA_HOURS} hours.</b> Oldest are at the top.</div> : null}
      {rows.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)" }}>{tab === "supplied" ? "Queue is empty." : "Nothing here yet."}</div> : null}

      {rows.map((r) => {
        const hours = Math.floor((now - r.createdAt.getTime()) / 3600_000);
        const late = tab === "supplied" && hours > CERT_SLA_HOURS;
        return (
          <div className="qcard" id={r.evidenceId} key={r.evidenceId}>
            <div className="qh">
              <div>
                <div className="qt">
                  <Link href={`/admin/doctors/${r.doctorId}`}>Dr {r.doctorName}</Link>
                  <span className="pill neut" style={{ marginLeft: "6px" }}>{SPECIALTIES[r.specialtyKey as keyof typeof SPECIALTIES]?.name ?? r.specialtyKey}</span>
                </div>
                <div className="qm">uploaded {toDisplay(r.createdAt)} · {hours < 1 ? "under an hour ago" : `${hours} h ago`} · <Link href={`/doctor/${r.doctorSlug}`} target="_blank">public profile ↗</Link></div>
              </div>
              <span className={`pill ${late ? "warn" : tab === "checked" ? "ok" : tab === "rejected" ? "warn" : "wait"}`}>{late ? "overdue" : tab === "supplied" ? "waiting" : tab}</span>
            </div>
            <dl className="kvi">
              <dt>Qualification</dt><dd><b>{r.degree}</b></dd>
              <dt>Institution</dt><dd>{r.institution}</dd>
              <dt>Year</dt><dd className="mono">{r.year ?? "—"}</dd>
              <dt>Certificate</dt>
              <dd><Link href={`/admin/files/${r.fileId}`} target="_blank">Open {r.filename} ↗</Link> <span className="hint">({r.mime === "application/pdf" ? "PDF" : "image"}, {Math.max(1, Math.round(r.size / 1024))} KB)</span></dd>
            </dl>
            {tab === "supplied" ? (
              <ActionForm action={decideCertificateAction} submitLabel="Apply decision" variant="solid" style={{ marginTop: "8px" }}>
                <input type="hidden" name="id" value={r.evidenceId} />
                <div className="two" style={{ gridTemplateColumns: "220px 1fr" }}>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Decision</label>
                    <select name="decision" defaultValue="verified">
                      <option value="verified">Verify qualification</option>
                      <option value="rejected">Reject certificate</option>
                    </select>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Note (required to reject; the doctor sees it)</label>
                    <input type="text" name="note" placeholder="Name on certificate differs / page cut off / year does not match" />
                  </div>
                </div>
              </ActionForm>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
