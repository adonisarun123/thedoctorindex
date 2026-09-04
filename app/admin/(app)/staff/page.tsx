import { desc } from "drizzle-orm";

import { setStaffAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { hasRole, requireStaff } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { toDisplay } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";

export const metadata = { title: "Staff" };

const ROLES: Array<[typeof s.staffRole.enumValues[number], string]> = [
  ["super_admin", "Super administrator — everything, including this page"],
  ["verification_officer", "Verification officer — submissions, claims, change requests, doctor records"],
  ["review_moderator", "Review moderator — reviews, replies, review reports"],
  ["content_editor", "Content editor — profile text, SEO routes, taxonomy"],
  ["support_officer", "Support officer — profile reports, corrections, enquiries"],
];

export default async function AdminStaff() {
  const me = await requireStaff();
  const isSuper = hasRole(me);
  const rows = await getDb().query.staffMembers.findMany({ with: { user: true }, orderBy: [desc(s.staffMembers.createdAt)] });

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Staff</h1>
          <div className="sub">Least privilege. Every staff action is written to the audit log under the person&rsquo;s own account; shared logins are not supported. Deactivating revokes all sessions immediately.</div>
        </div>
      </div>

      <table className="table" style={{ marginBottom: "22px" }}>
        <thead><tr><th>Email</th><th>Name</th><th>Roles</th><th>Since</th><th>2-step</th><th>Status</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.userId} style={r.active ? undefined : { color: "var(--muted)" }}>
              <td className="mono">{r.user.email ?? r.user.phone}{r.userId === me.id ? <span className="pill neut" style={{ marginLeft: "6px" }}>you</span> : null}</td>
              <td>{r.user.displayName ?? "—"}</td>
              <td style={{ fontSize: "12.5px" }}>{r.roles.map((x) => <span key={x} className="pill neut" style={{ marginRight: "4px" }}>{x.replace("_", " ")}</span>)}</td>
              <td className="mono">{toDisplay(r.createdAt)}</td>
              <td><span className={`pill ${r.mfaEnrolled ? "ok" : "wait"}`}>{r.mfaEnrolled ? "enrolled" : "not enrolled"}</span></td>
              <td><span className={`pill ${r.active ? "ok" : "warn"}`}>{r.active ? "active" : "deactivated"}</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      {isSuper ? (
        <ActionForm action={setStaffAction} submitLabel="Save staff member" variant="solid" className="panel pad" resetOnSuccess>
          <h3 style={{ marginTop: 0 }}>Add or update a staff member</h3>
          <div className="two">
            <div className="field"><label>Work email</label><input type="email" name="email" required placeholder="name@thedoctorindex.in" /><div className="hint">They sign in with a one-time code to this address at /admin/sign-in. An existing account is upgraded in place.</div></div>
            <div className="field"><label>Display name</label><input type="text" name="name" /></div>
          </div>
          <div className="field">
            <label>Roles</label>
            {ROLES.map(([k, label]) => <label key={k} className="fopt"><input type="checkbox" name="roles" value={k} /> {label}</label>)}
          </div>
          <div className="field">
            <label>Status</label>
            <select name="active" defaultValue="on" style={{ width: "auto" }}><option value="on">Active</option><option value="off">Deactivated (revokes sessions)</option></select>
          </div>
          <label className="fopt" style={{ marginBottom: "10px" }}><input type="checkbox" name="resetMfa" /> Reset their authenticator (lost device) — signs them out; they enrol again on next sign-in</label>
        </ActionForm>
      ) : (
        <div className="panel pad" style={{ color: "var(--muted)", fontSize: "13.5px" }}>Only a super administrator can add staff or change roles. Ask one to do it; the change is audited.</div>
      )}
    </>
  );
}
