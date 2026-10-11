import Link from "next/link";

import { PatientCell } from "@/components/admin/PatientCell";
import { requireStaff } from "@/lib/auth/session";
import { toDisplay } from "@/lib/db/dates";
import { doctorAccountTotals, listDoctorAccounts } from "@/lib/services/doctor-accounts";

export const metadata = { title: "Doctor accounts" };

const STATE = {
  verified: { pill: "ok", label: "verified" },
  pending: { pill: "wait", label: "awaiting staff" },
  unverified: { pill: "neut", label: "unverified" },
} as const;

/**
 * Everyone who signed up as a doctor, and whether the register has confirmed
 * them yet. Verified accounts own a profile; pending ones have a claim or a
 * new-profile submission in a queue; unverified ones stopped before either —
 * the list to chase. Patients never appear here (see /admin/patients).
 */
export default async function AdminDoctorAccounts({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 80) : "";
  const state = sp.state === "verified" || sp.state === "pending" || sp.state === "unverified" ? sp.state : undefined;
  const [rows, totals] = await Promise.all([listDoctorAccounts({ q, state }), doctorAccountTotals()]);
  const chip = (href: string, on: boolean, label: string) => (
    <Link className="chip" href={href} style={on ? { borderColor: "var(--accent)", color: "var(--accent)" } : undefined}>{label}</Link>
  );
  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Doctor accounts</h1>
          <div className="sub">Accounts that signed up as a doctor. &ldquo;Verified&rdquo; means a profile was claimed or created against the council register; the rest have not been through it yet and are kept apart from patient accounts.</div>
        </div>
        <Link className="btn quiet" href="/admin/signups">Reminder schedule</Link>
      </div>

      <div className="tiles" style={{ marginBottom: "18px" }}>
        <div className="tile"><div className="l">Doctor accounts</div><div className="v">{totals.total}</div><div className="d">{totals.last7} in the last 7 days</div></div>
        <div className="tile"><div className="l">Verified</div><div className="v">{totals.verified}</div><div className="d">own a profile</div></div>
        <div className="tile"><div className="l">Awaiting staff</div><div className="v">{totals.pending}</div><div className="d">claim or new profile in a queue</div></div>
        <div className="tile"><div className="l">Unverified</div><div className="v">{totals.unverified}</div><div className="d">signed up, no claim or profile yet</div></div>
      </div>

      <form method="get" className="quick" style={{ marginBottom: "12px", display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
        {chip("/admin/doctor-accounts", !state, "all")}
        {chip("/admin/doctor-accounts?state=unverified", state === "unverified", "unverified")}
        {chip("/admin/doctor-accounts?state=pending", state === "pending", "awaiting staff")}
        {chip("/admin/doctor-accounts?state=verified", state === "verified", "verified")}
        {state ? <input type="hidden" name="state" value={state} /> : null}
        <input type="search" name="q" defaultValue={q} placeholder="Name, mobile, email or profile" style={{ minWidth: "260px" }} />
        <button className="btn quiet" type="submit">Search</button>
      </form>

      <table className="table">
        <thead><tr><th>Account</th><th>Signed up</th><th>Verification</th><th>Profile</th><th>Last sign-in</th></tr></thead>
        <tbody>
          {rows.length === 0 ? <tr><td colSpan={5} style={{ color: "var(--muted)" }}>No doctor accounts match.</td></tr> : null}
          {rows.map((r) => (
            <tr key={r.id} id={r.id}>
              <td><PatientCell name={r.name} phone={r.phone} email={r.email} area="" hideArea note={r.completedAt ? undefined : "· details incomplete"} /></td>
              <td className="mono" style={{ whiteSpace: "nowrap" }}>{toDisplay(r.signedUpAt)}</td>
              <td data-sort={r.state}>
                <span className={`pill ${STATE[r.state].pill}`}>{STATE[r.state].label}</span>
                {r.pendingKind ? <div style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "3px" }}><Link href={r.pendingKind === "claim" ? "/admin/claims" : "/admin/submissions"}>{r.pendingKind === "claim" ? "claim in queue →" : "new profile in queue →"}</Link></div> : null}
              </td>
              <td>{r.profileId ? <><Link href={`/admin/doctors/${r.profileId}`}>Dr {r.profileName}</Link> <span className="pill neut" style={{ marginLeft: "4px" }}>{r.profileStatus}</span></> : <span style={{ color: "var(--muted)" }}>—</span>}</td>
              <td className="mono" style={{ whiteSpace: "nowrap" }}>{r.lastSignInAt ? toDisplay(r.lastSignInAt) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
