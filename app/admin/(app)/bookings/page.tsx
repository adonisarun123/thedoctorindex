import Link from "next/link";

import { requireStaff } from "@/lib/auth/session";
import { formatIst } from "@/lib/booking/slots";
import { toDisplay } from "@/lib/db/dates";
import { displayName } from "@/lib/display-name";
import { listAppointmentsAdmin } from "@/lib/services/booking";

export const metadata = { title: "Bookings" };

const STATUSES = ["requested", "confirmed", "declined", "cancelled", "completed", "no_show"] as const;
const PILL: Record<string, string> = { requested: "wait", confirmed: "ok", completed: "ok", declined: "neut", cancelled: "neut", no_show: "warn" };

/**
 * Every appointment across all doctors. Super admins only (it lists patients'
 * names and mobiles), and read-only: confirming is the practice's decision,
 * so staff chase doctors with stale requests rather than confirm for them.
 */
export default async function AdminBookings({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff("super_admin");
  const sp = await searchParams;
  const status = typeof sp.status === "string" && (STATUSES as readonly string[]).includes(sp.status) ? sp.status : undefined;
  const stale = sp.stale === "1";
  const q = typeof sp.q === "string" ? sp.q.slice(0, 80) : "";
  const rows = await listAppointmentsAdmin({ status, stale, q });
  const chip = (href: string, on: boolean, label: string) => (
    <Link className="chip" href={href} style={on ? { borderColor: "var(--accent)", color: "var(--accent)" } : undefined}>{label}</Link>
  );
  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Bookings</h1>
          <div className="sub">All appointment requests across doctors. Read-only — the practice confirms or declines from its dashboard. &ldquo;Stale&rdquo; = an upcoming request unanswered for over 24 hours; chase the doctor.</div>
        </div>
      </div>
      <form method="get" className="quick" style={{ marginTop: 0, marginBottom: "12px", display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
        {chip("/admin/bookings", !status && !stale, "all")}
        {chip("/admin/bookings?stale=1", stale, "stale requests")}
        {STATUSES.map((st) => <span key={st}>{chip(`/admin/bookings?status=${st}`, status === st && !stale, st.replace("_", " "))}</span>)}
        <input type="search" name="q" defaultValue={q} placeholder="Booking ref, doctor, patient or mobile" style={{ minWidth: "260px" }} />
        <button className="btn outline" type="submit">Search</button>
      </form>
      <table className="table">
        <thead><tr><th>Ref</th><th>Requested</th><th>Appointment (IST)</th><th>Doctor · clinic</th><th>Patient</th><th>Status</th></tr></thead>
        <tbody>
          {rows.length === 0 ? <tr><td colSpan={6} style={{ color: "var(--muted)" }}>None.</td></tr> : null}
          {rows.map((a) => {
            const overdue = a.status === "requested" && a.startsAt > new Date() && Date.now() - a.createdAt.getTime() > 24 * 3_600_000;
            return (
              <tr key={a.id}>
                <td className="mono" style={{ whiteSpace: "nowrap" }}>{a.ref}</td>
                <td className="mono" style={{ fontSize: "12.5px" }}>{toDisplay(a.createdAt)}</td>
                <td className="mono">{formatIst(a.startsAt)}</td>
                <td style={{ fontSize: "13px" }}><Link href={`/admin/doctors/${a.doctorId}`}>{displayName(a.doctor)}</Link><div style={{ color: "var(--muted)" }}>{a.practice?.facility.name ?? "—"}</div></td>
                <td style={{ fontSize: "13px" }}>{a.patientName}{a.forWhom === "other" ? " (for someone else)" : ""}<div className="mono">{a.patientPhone}</div></td>
                <td>
                  <span className={`pill ${PILL[a.status] ?? "neut"}`}>{a.status === "requested" ? "awaiting doctor" : a.status.replace("_", " ")}</span>
                  {overdue ? <> <span className="pill warn">stale</span></> : null}
                  {a.statusNote ? <div style={{ fontSize: "12px", color: "var(--muted)" }}>{a.statusNote}</div> : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length === 200 ? <p style={{ fontSize: "13px", color: "var(--muted)" }}>Showing the latest 200. Narrow with a filter or search.</p> : null}
    </>
  );
}
