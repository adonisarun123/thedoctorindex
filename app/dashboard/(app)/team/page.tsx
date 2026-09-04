import { inviteManagerAction, revokeManagerAction } from "@/app/dashboard/actions";
import { ActionForm } from "@/components/ActionForm";
import { getDashboardContext } from "@/lib/dashboard";
import { toDisplay } from "@/lib/db/dates";
import { listManagersForDoctor } from "@/lib/services/workflow";

export const metadata = { title: "Team access" };

export default async function DashboardTeam() {
  const { doctor, doctorId, asManager } = await getDashboardContext();
  const managers = await listManagersForDoctor(doctorId);

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Team access</h1>
          <div className="sub">People who can update practice details on your behalf. You can revoke access at any time.</div>
        </div>
      </div>

      <table className="table">
        <thead><tr><th>Person</th><th>Scope</th><th>Status</th><th>Added</th><th></th></tr></thead>
        <tbody>
          {managers.length === 0 ? <tr><td colSpan={5} style={{ color: "var(--muted)" }}>No one else has access.</td></tr> : null}
          {managers.map((m) => (
            <tr key={m.id}>
              <td>{m.name ?? "—"}<div className="mono" style={{ fontSize: "11px", color: "var(--muted)" }}>{m.email}</div></td>
              <td style={{ fontSize: "13px" }}>{m.scopePracticeIds.length ? doctor.practices.filter((p) => m.scopePracticeIds.includes(p.id!)).map((p) => p.facility).join(", ") : "All practices"}</td>
              <td><span className={`pill ${m.status === "active" ? "ok" : m.status === "invited" ? "wait" : "neut"}`}>{m.status}</span></td>
              <td className="mono">{toDisplay(m.createdAt)}</td>
              <td>{!asManager && m.status !== "revoked" ? (
                <ActionForm action={revokeManagerAction} submitLabel="Revoke" variant="quiet" inline confirm={`Revoke access for ${m.email}?`}>
                  <input type="hidden" name="managerId" value={m.id} />
                </ActionForm>
              ) : null}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!asManager ? (
        <div className="panel pad" style={{ marginTop: "18px" }}>
          <div className="chart-head"><span className="t">Invite a clinic manager</span></div>
          <ActionForm action={inviteManagerAction} submitLabel="Add manager" variant="outline" resetOnSuccess>
            <div className="two">
              <div className="field"><label htmlFor="m-name">Name</label><input id="m-name" name="name" type="text" /></div>
              <div className="field"><label htmlFor="m-email">Work email</label><input id="m-email" name="email" type="email" required /><div className="hint">They sign in with this email using a one-time code.</div></div>
            </div>
            <div className="field">
              <label>Practices they may edit</label>
              {doctor.practices.map((p) => (
                <label key={p.id} className="fopt"><input type="checkbox" name="scope" value={p.id} defaultChecked /> {p.facility}</label>
              ))}
              <div className="hint">Hours, fees and contact only. Never identity, credentials, reviews or analytics.</div>
            </div>
          </ActionForm>
        </div>
      ) : null}

      <div className="panel pad" style={{ marginTop: "18px" }}>
        <div className="chart-head"><span className="t">What a clinic manager can and cannot do</span></div>
        <div className="two">
          <div><div className="eyebrow" style={{ marginBottom: "6px" }}>Can</div><ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13.5px", color: "var(--ink-2)" }}><li>Update hours, fees and phone for the practices named</li><li>Confirm the practice address when we ask</li><li>See and update appointment enquiries for those practices</li></ul></div>
          <div><div className="eyebrow" style={{ marginBottom: "6px" }}>Cannot</div><ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13.5px", color: "var(--ink-2)" }}><li>Change your name, registration, qualifications or speciality</li><li>Reply to or dispute reviews</li><li>See your analytics or verification evidence</li><li>Add other managers</li></ul></div>
        </div>
      </div>
    </>
  );
}
