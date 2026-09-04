import Link from "next/link";

import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { toDisplay } from "@/lib/db/dates";
import { listDoctorsAdmin } from "@/lib/services/doctors";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Doctors" };

const STATUSES = ["draft", "in_review", "published", "suspended", "retired", "archived"] as const;

function statusPill(status: string) {
  return status === "published" ? "ok" : status === "suspended" ? "warn" : status === "draft" || status === "in_review" ? "wait" : "neut";
}

export default async function AdminDoctors({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const status = typeof sp.status === "string" ? sp.status : "";
  const specialty = typeof sp.specialty === "string" ? sp.specialty : "";
  const rows = await listDoctorsAdmin({ q: q || undefined, status: status || undefined, specialty: specialty || undefined, limit: 200 });

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Doctors</h1>
          <div className="sub">Every profile in the registry, whatever its state. Staff-created profiles start as drafts unless you publish on creation.</div>
        </div>
        <Link className="btn solid" href="/admin/doctors/new">Create profile</Link>
      </div>

      <form className="admin-search" method="get" action="/admin/doctors">
        <input type="search" name="q" defaultValue={q} placeholder="Name, slug or registration number" aria-label="Search doctors" />
        <select name="status" defaultValue={status} aria-label="Status">
          <option value="">Any status</option>
          {STATUSES.map((st) => <option key={st} value={st}>{st.replace("_", " ")}</option>)}
        </select>
        <select name="specialty" defaultValue={specialty} aria-label="Speciality">
          <option value="">Any speciality</option>
          {SPECIALTY_KEYS.map((k) => <option key={k} value={k}>{SPECIALTIES[k].name}</option>)}
        </select>
        <button type="submit" className="btn">Filter</button>
        {q || status || specialty ? <Link className="btn quiet" href="/admin/doctors">Clear</Link> : null}
      </form>

      <table className="table">
        <thead><tr><th>Doctor</th><th>Registration</th><th>Practices</th><th>Quality</th><th>Status</th><th>Updated</th></tr></thead>
        <tbody>
          {rows.length === 0 ? <tr><td colSpan={6} style={{ color: "var(--muted)" }}>No profiles match.</td></tr> : null}
          {rows.map((d) => {
            const reg = d.registrations.find((r) => r.isPrimary) ?? d.registrations[0];
            const active = d.practices.filter((p) => p.active);
            return (
              <tr key={d.id}>
                <td>
                  <Link href={`/admin/doctors/${d.id}`}><b>Dr {d.name}</b></Link>
                  <div style={{ fontSize: "12.5px", color: "var(--muted)" }}>{SPECIALTIES[d.specialtyKey as keyof typeof SPECIALTIES]?.name ?? d.specialtyKey} · <span className="mono">{d.publicId}</span>{d.claimed ? " · claimed" : ""}</div>
                </td>
                <td className="mono" style={{ fontSize: "12.5px" }}>{reg ? `${reg.council} ${reg.number}` : "—"}{reg?.checkedOn ? <div style={{ color: "var(--ok)" }}>checked {toDisplay(reg.checkedOn)}</div> : <div style={{ color: "var(--warn)" }}>unchecked</div>}</td>
                <td style={{ fontSize: "12.5px" }}>{active.length ? active.map((p) => p.facility.name).join("; ") : "—"}</td>
                <td className="mono">{d.qualityScore}</td>
                <td><span className={`pill ${statusPill(d.status)}`}>{d.status.replace("_", " ")}</span></td>
                <td className="mono" style={{ fontSize: "12.5px" }}>{toDisplay(d.updatedAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ color: "var(--muted)", fontSize: "12.5px", marginTop: "10px" }}>{rows.length} shown{rows.length === 200 ? " (limit reached — narrow the filter)" : ""}.</p>
    </>
  );
}
