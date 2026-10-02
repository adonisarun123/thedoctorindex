import { eq } from "drizzle-orm";

import { enquiryStatusAction } from "@/app/dashboard/actions";
import { whatsappAlertsAction } from "@/app/dashboard/whatsapp-actions";
import { ActionForm } from "@/components/ActionForm";
import { getDashboardContext } from "@/lib/dashboard";
import { toDisplay } from "@/lib/db/dates";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { listEnquiries } from "@/lib/services/cases";
import { whatsappConfigured } from "@/lib/whatsapp";

export const metadata = { title: "Appointment enquiries" };

export default async function DashboardEnquiries() {
  const { doctorId, asManager, scope, user } = await getDashboardContext();
  const [wa] = asManager ? [null] : await getDb().select({ number: s.users.whatsappNumber, optIn: s.users.whatsappOptInAt, phone: s.users.phone }).from(s.users).where(eq(s.users.id, user.id)).limit(1);
  const live = whatsappConfigured();
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
      {wa ? (
        <section className="panel pad" style={{ marginBottom: "16px" }}>
          <div className="eyebrow">WhatsApp alerts</div>
          {wa.optIn && wa.number ? (
            <>
              <p style={{ margin: "6px 0 10px", fontSize: "14px" }}>
                On for <span className="mono">{wa.number}</span>.{" "}
                {live ? "Each new enquiry sends you a WhatsApp message with a link here." : "Pending: WhatsApp sending is being switched on; until then alerts come by email."} Patient contact details stay in this dashboard, never in the message.
              </p>
              <ActionForm action={whatsappAlertsAction} submitLabel="Turn off" variant="quiet" inline>
                <input type="hidden" name="off" value="1" />
              </ActionForm>
            </>
          ) : (
            <ActionForm action={whatsappAlertsAction} submitLabel="Get enquiry alerts on WhatsApp" variant="outline">
              <p style={{ margin: "6px 0 10px", fontSize: "14px", color: "var(--ink-2)" }}>Get a WhatsApp message the moment a patient asks for an appointment. The message never contains the patient&rsquo;s details — it links here.</p>
              <div className="field" style={{ maxWidth: "280px" }}>
                <label htmlFor="wa-number">WhatsApp number</label>
                <input id="wa-number" name="number" type="tel" inputMode="tel" defaultValue={wa.number ?? wa.phone ?? ""} placeholder="98xxxxxxxx" />
              </div>
              <label className="fopt"><input type="checkbox" name="consent" required /> I agree to receive appointment-enquiry alerts from The Doctor Index on WhatsApp. I can turn this off here at any time.</label>
              {live ? <label className="fopt"><input type="checkbox" name="test" defaultChecked /> Send me a test message</label> : null}
            </ActionForm>
          )}
        </section>
      ) : null}

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
