import { enquiryStatusAction } from "@/app/dashboard/actions";
import { ActionForm } from "@/components/ActionForm";
import { getDashboardContext } from "@/lib/dashboard";
import { toDisplay } from "@/lib/db/dates";
import { listEnquiries } from "@/lib/services/cases";

export const metadata = { title: "Appointment enquiries" };

export default async function DashboardEnquiries() {
  const { doctorId, asManager, scope } = await getDashboardContext();
  const all = await listEnquiries({ doctorId });
  const rows = asManager && scope.length ? all.filter((e) => e.practiceId && scope.includes(e.practiceId)) : all;

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Appointment enquiries</h1>
          <div className="sub">{rows.filter((e) => e.status === "new").length} new · the patient consented to share their contact with the practice; use it for this enquiry only</div>
        </div>
      </div>
      <table className="table">
        <thead><tr><th>Received</th><th>Practice</th><th>Patient contact</th><th>Preferred</th><th>Note</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {rows.length === 0 ? <tr><td colSpan={7} style={{ color: "var(--muted)" }}>No enquiries yet.</td></tr> : null}
          {rows.map((e) => (
            <tr key={e.id}>
              <td className="mono">{toDisplay(e.createdAt)}</td>
              <td style={{ fontSize: "13px" }}>{e.practice?.facility.name ?? "—"}</td>
              <td className="mono">{e.contact}<div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--muted)" }}>for {e.forWhom === "self" ? "themselves" : "someone else"}</div></td>
              <td style={{ fontSize: "13px" }}>{e.preferredDay ?? "—"}</td>
              <td style={{ fontSize: "13px", maxWidth: "26ch" }}>{e.note ?? "—"}</td>
              <td><span className={`pill ${e.status === "new" ? "wait" : e.status === "closed" ? "neut" : "ok"}`}>{e.status}</span></td>
              <td>
                {e.status !== "closed" ? (
                  <ActionForm action={enquiryStatusAction} submitLabel={e.status === "new" ? "Mark contacted" : "Close"} variant="quiet" inline>
                    <input type="hidden" name="enquiryId" value={e.id} />
                    <input type="hidden" name="status" value={e.status === "new" ? "contacted" : "closed"} />
                  </ActionForm>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "12px" }}>Enquiries are retained for {process.env.RETENTION_ENQUIRY_DAYS ?? 180} days and then deleted.</p>
    </>
  );
}
