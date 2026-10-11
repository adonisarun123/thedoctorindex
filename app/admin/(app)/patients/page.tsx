import Link from "next/link";

import { PatientCell } from "@/components/admin/PatientCell";
import { requireStaff } from "@/lib/auth/session";
import { toDisplay } from "@/lib/db/dates";
import { listPatients, patientTotals } from "@/lib/services/patients";

export const metadata = { title: "Patients" };

const FLOW: Record<string, string> = { enquire: "to enquire", review: "to review", book: "to book", claim: "to claim a profile", add_doctor: "to add a doctor", dashboard: "doctor dashboard", other: "—" };

/**
 * Every patient account with the details it gave at setup, and what it has
 * done since. Name, mobile, email and area are collected once at
 * /account/setup; this is where staff read them back.
 */
export default async function AdminPatients({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 80) : "";
  const only = sp.only === "active" || sp.only === "incomplete" ? sp.only : undefined;
  const [rows, totals] = await Promise.all([listPatients({ q, only }), patientTotals()]);
  const chip = (href: string, on: boolean, label: string) => (
    <Link className="chip" href={href} style={on ? { borderColor: "var(--accent)", color: "var(--accent)" } : undefined}>{label}</Link>
  );
  const exportHref = `/admin/patients/export${q || only ? `?${new URLSearchParams({ ...(q ? { q } : {}), ...(only ? { only } : {}) })}` : ""}`;
  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Patients</h1>
          <div className="sub">Every patient account and the details it gave at sign-up: name, mobile, email and area. Shared with a practice only when the patient enquires or books with it.</div>
        </div>
        <a className="btn quiet" href={exportHref}>Download CSV</a>
      </div>

      <div className="tiles" style={{ marginBottom: "18px" }}>
        <div className="tile"><div className="l">Patient accounts</div><div className="v">{totals.total}</div><div className="d">{totals.last7} in the last 7 days</div></div>
        <div className="tile"><div className="l">Details complete</div><div className="v">{totals.complete}</div><div className="d">{totals.total - totals.complete} signed in and stopped</div></div>
        <div className="tile"><div className="l">Enquired, booked or reviewed</div><div className="v">{totals.active}</div><div className="d">{totals.total ? Math.round((totals.active / totals.total) * 100) : 0}% of accounts</div></div>
        <div className="tile"><div className="l">Marketing opt-in</div><div className="v">{totals.optedIn}</div><div className="d">may be emailed about TDi</div></div>
      </div>

      <form method="get" className="quick" style={{ marginBottom: "12px", display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
        {chip("/admin/patients", !only, "all")}
        {chip("/admin/patients?only=active", only === "active", "active")}
        {chip("/admin/patients?only=incomplete", only === "incomplete", "incomplete")}
        {only ? <input type="hidden" name="only" value={only} /> : null}
        <input type="search" name="q" defaultValue={q} placeholder="Name, mobile, email or area" style={{ minWidth: "260px" }} />
        <button className="btn quiet" type="submit">Search</button>
      </form>

      <table className="table">
        <thead><tr><th>Patient</th><th>Signed up</th><th>Came to</th><th className="num">Enquiries</th><th className="num">Bookings</th><th className="num">Reviews</th><th>Last sign-in</th></tr></thead>
        <tbody>
          {rows.length === 0 ? <tr><td colSpan={7} style={{ color: "var(--muted)" }}>No patients match.</td></tr> : null}
          {rows.map((p) => (
            <tr key={p.id} id={p.id}>
              <td><PatientCell name={p.name} phone={p.phone} email={p.email} area={p.area} note={p.completedAt ? undefined : "· details incomplete"} /></td>
              <td className="mono" style={{ whiteSpace: "nowrap" }}>{toDisplay(p.signedUpAt)}</td>
              <td>{FLOW[p.flow] ?? (p.flow || "—")}</td>
              <td className="num">{p.enquiries || <span style={{ color: "var(--muted)" }}>0</span>}</td>
              <td className="num">{p.bookings || <span style={{ color: "var(--muted)" }}>0</span>}</td>
              <td className="num">{p.reviews || <span style={{ color: "var(--muted)" }}>0</span>}</td>
              <td className="mono" style={{ whiteSpace: "nowrap" }}>{p.lastSignInAt ? toDisplay(p.lastSignInAt) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length >= 500 ? <p style={{ fontSize: "13px", color: "var(--muted)" }}>Showing the latest 500. Search to narrow, or download the CSV for everyone.</p> : null}
    </>
  );
}
