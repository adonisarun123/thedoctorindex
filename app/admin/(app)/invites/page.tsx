import Link from "next/link";

import { sendInviteAction, sendQueuedInvitesAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { requireStaff } from "@/lib/auth/session";
import { toDisplay } from "@/lib/db/dates";
import { DAILY_INVITE_CAP } from "@/lib/doctor-invites";
import { displayName } from "@/lib/display-name";
import { listInvites, sentToday } from "@/lib/services/doctor-invites";

export const dynamic = "force-dynamic";

const FILTERS = ["", "queued", "sent", "claimed", "opted_out", "cancelled"] as const;

export default async function AdminInvites({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const status = typeof sp.status === "string" && (FILTERS as readonly string[]).includes(sp.status) ? sp.status : "";
  const [rows, today] = await Promise.all([listInvites(status || undefined), sentToday()]);
  const queued = rows.filter((r) => r.status === "queued").length;

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Doctor invites</h1>
          <div className="sub">Emails asking a doctor to claim a profile staff built. Add an address from a doctor&apos;s admin page. {today} of {DAILY_INVITE_CAP} sent today; reminders go on day 3 and day 10.</div>
        </div>
      </div>
      <div className="quick" style={{ marginBottom: "14px" }}>
        {FILTERS.map((f) => (
          <Link key={f || "all"} className={`btn ${status === f ? "solid" : "quiet"}`} href={f ? `/admin/invites?status=${f}` : "/admin/invites"}>{f ? f.replace("_", " ") : "All"}</Link>
        ))}
      </div>
      {queued && (!status || status === "queued") ? (
        <ActionForm action={sendQueuedInvitesAction} submitLabel="Send queued invites" variant="solid" className="panel pad" style={{ marginBottom: "18px" }} confirm="Email the oldest queued invites now?">
          <div className="field" style={{ maxWidth: "220px" }}><label>How many (up to today&apos;s remaining {Math.max(0, DAILY_INVITE_CAP - today)})</label><input type="number" name="limit" min={1} max={50} defaultValue={Math.min(20, Math.max(1, DAILY_INVITE_CAP - today))} /></div>
        </ActionForm>
      ) : null}
      <section className="panel">
        <table className="table">
          <thead><tr><th>Doctor</th><th>Email · source</th><th>Status</th><th>Emails</th><th>Created</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={6} style={{ color: "var(--muted)" }}>No invites{status ? ` with status ${status.replace("_", " ")}` : ""}.</td></tr> : null}
            {rows.map((r) => (
              <tr key={r.id}>
                <td><Link href={`/admin/doctors/${r.doctorId}`}>{displayName({ name: r.doctorName, specialtyKey: r.specialtyKey })}</Link></td>
                <td><span className="mono">{r.email}</span><div style={{ fontSize: "12px", color: "var(--muted)" }}>{r.emailSource}</div></td>
                <td>{r.status.replace("_", " ")}{r.optOutReason ? ` (${r.optOutReason.replace("_", " ")})` : ""}{r.acceptedAt && r.status === "sent" ? " · link opened" : ""}</td>
                <td>{r.sends}/3{r.lastDelivered === false ? " · not delivered" : ""}</td>
                <td>{toDisplay(r.createdAt)}{r.createdByEmail ? <div style={{ fontSize: "12px", color: "var(--muted)" }}>{r.createdByEmail}</div> : null}</td>
                <td>
                  {r.status === "queued" ? (
                    <ActionForm action={sendInviteAction} submitLabel="Send" variant="outline" inline>
                      <input type="hidden" name="inviteId" value={r.id} /><input type="hidden" name="doctorId" value={r.doctorId} />
                    </ActionForm>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
