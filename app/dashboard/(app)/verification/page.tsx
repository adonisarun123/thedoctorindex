import Link from "next/link";

import { getDashboardContext } from "@/lib/dashboard";
import { toDisplay } from "@/lib/db/dates";
import { LOCALITIES } from "@/lib/data/taxonomy";
import { listChangesForDoctor, listChecksForDoctor } from "@/lib/services/workflow";
import { paths } from "@/lib/site";

export const metadata = { title: "Verification & changes" };

const STATUS: Record<string, { cls: string; label: string }> = {
  pending: { cls: "wait", label: "pending verification" },
  published: { cls: "ok", label: "published" },
  rejected: { cls: "warn", label: "declined" },
};

export default async function DashboardVerification() {
  const { doctor, doctorId } = await getDashboardContext();
  const [changes, checks] = await Promise.all([listChangesForDoctor(doctorId), listChecksForDoctor(doctorId)]);

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Verification &amp; changes</h1>
          <div className="sub">Every public label, its source and date · every change you have requested and what happened to it</div>
        </div>
        <Link className="btn quiet" href={paths.policy("verification")}>Methodology</Link>
      </div>

      <div className="register">
        <div className="rhead"><span className="t">Your verification record · as shown publicly</span><span className="n">{doctor.lastVerifiedOn}</span></div>
        <Row tone="ok" label="Medical registration verified" source={`${doctor.registration.council} · ${doctor.registration.number}`} when={doctor.registration.checkedOn} />
        {doctor.qualifications.map((q) => (
          <Row key={`${q.degree}-${q.year}`} tone={q.state === "verified" ? "ok" : "wait"} label={q.state === "verified" ? "Qualification verified" : "Qualification submitted — pending"} source={`${q.degree} · ${q.institution} · ${q.year || ""}`} when={q.state === "verified" ? doctor.registration.checkedOn : "pending"} />
        ))}
        {doctor.practices.map((p) => (
          <Row key={p.id} tone="ok" label="Practice location confirmed" source={`${p.facility}, ${LOCALITIES[p.locality].name}`} when={p.confirmedOn} />
        ))}
        <Row tone={doctor.claimed ? "ok" : "wait"} label={doctor.claimed ? "Profile claimed" : "Claim pending"} source="You control the editable fields" when={doctor.lastVerifiedOn} />
        {doctor.hprVerified ? <Row tone="ok" label="HPR ID verified" source="Healthcare Professionals Registry · secondary signal" when={doctor.registration.checkedOn} /> : null}
      </div>

      <div style={{ marginTop: "22px" }}>
        <div className="chart-head"><span className="t">Change requests</span><span className="m">{changes.length} total</span></div>
        {changes.length === 0 ? (
          <div className="panel pad" style={{ color: "var(--muted)", fontSize: "13.5px" }}>No changes requested yet. Edits on the profile and practice pages appear here with their outcome.</div>
        ) : (
          <table className="table">
            <thead><tr><th>Field</th><th>Change</th><th>Submitted</th><th>Status</th></tr></thead>
            <tbody>
              {changes.map((c) => (
                <tr key={c.id}>
                  <td>{c.field}<div className="mono" style={{ fontSize: "10.5px", color: "var(--muted)" }}>{c.id.slice(0, 8)}</div></td>
                  <td><span style={{ color: "var(--muted)" }}>{fmt(c.fromValue)}</span><br />→ {fmt(c.toValue)}{c.note ? <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "3px" }}>{c.note}</div> : null}</td>
                  <td className="mono">{toDisplay(c.createdAt)}</td>
                  <td><span className={`pill ${STATUS[c.status].cls}`}>{STATUS[c.status].label}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: "22px" }}>
        <div className="chart-head"><span className="t">Verification events</span><span className="m">{checks.length} recorded</span></div>
        <table className="table">
          <thead><tr><th>Check</th><th>Result</th><th>Source</th><th>When</th></tr></thead>
          <tbody>
            {checks.map((c) => (
              <tr key={c.id}><td>{c.kind}</td><td><span className={`pill ${c.result === "verified" ? "ok" : c.result === "failed" ? "warn" : "wait"}`}>{c.result}</span></td><td style={{ fontSize: "13px" }}>{c.source ?? "—"}{c.note ? <div style={{ color: "var(--muted)", fontSize: "12px" }}>{c.note}</div> : null}</td><td className="mono">{toDisplay(c.checkedOn)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel pad" style={{ marginTop: "22px" }}>
        <div className="chart-head"><span className="t">Something wrong you cannot edit?</span></div>
        <p style={{ fontSize: "13.5px", color: "var(--ink-2)" }}>
          A registration number, a council, a degree that failed to match, a qualification to add. Use the correction form on your public profile and tick “I am the doctor” — it opens a verification case with a 2-business-day target and you can attach a document.
        </p>
        <Link className="btn quiet" href={`${paths.doctor(doctor.slug)}/correct`} style={{ display: "inline-block", marginTop: "10px" }}>Open a verification case</Link>
      </div>
    </>
  );
}

function fmt(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function Row({ tone, label, source, when }: { tone: "ok" | "wait"; label: string; source: string; when: string }) {
  return (
    <div className="rrow">
      <span className={`dot ${tone}`} />
      <div><div className="lbl">{label}</div><div className="src">{source}</div></div>
      <span className="when">{when}</span>
    </div>
  );
}
