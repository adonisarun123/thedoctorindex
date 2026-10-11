import Link from "next/link";

import { enquiryStatusAdminAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { PatientCell } from "@/components/admin/PatientCell";
import { toDisplay } from "@/lib/db/dates";
import { listEnquiries } from "@/lib/services/cases";
import { areaLabel } from "@/lib/services/patients";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Enquiries" };

export default async function AdminEnquiries({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? (sp.status as "new" | "sent" | "contacted" | "closed") : undefined;
  const rows = await listEnquiries({ status });
  // Name, mobile, email and area come from the account; the stored contact
  // line ("Name · mobile") is the fallback for enquiries without one.
  const patients = await Promise.all(
    rows.map(async (e) => {
      const u = e.user;
      const [name = "", phone = ""] = u ? [u.displayName ?? "", u.phone ?? ""] : e.contact.split(" · ");
      return { id: u?.id ?? null, name, phone, email: u?.email ?? "", area: u ? (await areaLabel(u.localityKey, u.city)).area : "" };
    }),
  );
  return (
    <>
      <div className="dash-head">
        <div><h1>Appointment enquiries</h1><div className="sub">Forwarded to the practice; the doctor or their manager marks them contacted. Support closes stale ones.</div></div>
        <div className="quick" style={{ marginTop: 0 }}>
          <Link className="chip" href="/admin/enquiries">all</Link>
          {(["new", "sent", "contacted", "closed"] as const).map((st) => (<Link key={st} className="chip" href={`/admin/enquiries?status=${st}`} style={status === st ? { borderColor: "var(--accent)", color: "var(--accent)" } : undefined}>{st}</Link>))}
        </div>
      </div>
      <table className="table">
        <thead><tr><th>Received</th><th>Doctor · practice</th><th>Patient</th><th>Preferred</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {rows.length === 0 ? <tr><td colSpan={6} style={{ color: "var(--muted)" }}>None.</td></tr> : null}
          {rows.map((e, i) => (
            <tr key={e.id} id={e.id}>
              <td className="mono">{toDisplay(e.createdAt)}</td>
              <td style={{ fontSize: "13px" }}><Link href={`/admin/doctors/${e.doctorId}`}>Dr {e.doctor.name}</Link><div style={{ color: "var(--muted)" }}>{e.practice?.facility.name ?? "—"}</div></td>
              <td><PatientCell {...patients[i]} note={e.forWhom === "other" ? "· for someone else" : undefined} /></td>
              <td style={{ fontSize: "13px" }}>{e.preferredDay ?? "—"}{e.note ? <div style={{ color: "var(--muted)" }}>{e.note}</div> : null}</td>
              <td><span className={`pill ${e.status === "new" ? "wait" : e.status === "closed" ? "neut" : "ok"}`}>{e.status}</span></td>
              <td>
                <ActionForm action={enquiryStatusAdminAction} submitLabel="Set" variant="quiet" inline>
                  <input type="hidden" name="id" value={e.id} />
                  <select name="status" defaultValue={e.status} style={{ width: "auto" }}><option value="new">new</option><option value="sent">sent to practice</option><option value="contacted">contacted</option><option value="closed">closed</option></select>
                </ActionForm>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
