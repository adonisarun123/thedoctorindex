import { decideAppointmentAction } from "@/app/dashboard/calendar-actions";
import { ActionForm } from "@/components/ActionForm";
import { formatIst } from "@/lib/booking/slots";

export interface BookingRequest {
  id: string;
  ref: string;
  startsAt: Date;
  createdAt: Date;
  patientName: string;
  patientPhone: string;
  forWhom: string;
  reason: string | null;
  practice: { facility: { name: string } };
}

function ago(d: Date): string {
  const h = Math.floor((Date.now() - d.getTime()) / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h} h ago`;
  return `${Math.floor(h / 24)} d ago`;
}

/** A pending booking with one-click Confirm and a Decline that can carry a note to the patient. */
export function BookingRequestCard({ a }: { a: BookingRequest }) {
  const stale = Date.now() - a.createdAt.getTime() > 24 * 3_600_000;
  return (
    <div className="qcard">
      <div className="qh">
        <div>
          <div className="qt">{formatIst(a.startsAt)} · {a.practice.facility.name} · <span className="mono">{a.ref}</span></div>
          <div className="qm">
            {a.patientName} · <span className="mono">{a.patientPhone}</span> · for {a.forWhom === "other" ? "someone else" : "themself"}
            {a.reason ? ` · “${a.reason}”` : ""} · requested {ago(a.createdAt)}
            {stale ? <> <span className="pill warn">waiting over a day</span></> : null}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "flex-start", marginTop: "8px" }}>
        <ActionForm action={decideAppointmentAction} submitLabel="Confirm" variant="solid" inline>
          <input type="hidden" name="id" value={a.id} />
          <input type="hidden" name="decision" value="confirmed" />
        </ActionForm>
        <ActionForm action={decideAppointmentAction} submitLabel="Decline" variant="outline" inline confirm="Decline this request? The patient is emailed.">
          <input type="hidden" name="id" value={a.id} />
          <input type="hidden" name="decision" value="declined" />
          <input type="text" name="note" maxLength={200} placeholder="Note to the patient (optional)" style={{ minWidth: "220px" }} />
        </ActionForm>
      </div>
    </div>
  );
}
