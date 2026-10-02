import { cancelInviteAction, inviteDoctorAction, sendInviteAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { toDisplay } from "@/lib/db/dates";
import { DAILY_INVITE_CAP } from "@/lib/doctor-invites";
import { invitesForDoctor, sentToday } from "@/lib/services/doctor-invites";

const LABEL: Record<string, string> = { queued: "queued", sent: "sent", claimed: "claimed", opted_out: "opted out", cancelled: "cancelled" };

/** "Invite to claim" on the admin doctor page: one open invite per profile. */
export async function InvitePanel({ doctorId, claimed, published, hasRegistration }: { doctorId: string; claimed: boolean; published: boolean; hasRegistration: boolean }) {
  const [invites, today] = await Promise.all([invitesForDoctor(doctorId), sentToday()]);
  const open = invites.find((i) => i.status === "queued" || i.status === "sent");
  const blocked = claimed ? "Already claimed." : !published ? "Publish the profile first." : !hasRegistration ? "Add the registration number first: the doctor claims by confirming it." : null;

  return (
    <section className="panel pad" style={{ marginBottom: "18px" }}>
      <h3 style={{ marginTop: 0 }}>Invite to claim</h3>
      {invites.map((i) => (
        <div key={i.id} style={{ fontSize: "13px", borderTop: "1px solid var(--hair)", padding: "8px 0" }}>
          <div><span className="mono">{i.email}</span> · <b>{LABEL[i.status]}</b>{i.status === "opted_out" && i.optOutReason ? ` (${i.optOutReason.replace("_", " ")})` : ""}</div>
          <div style={{ color: "var(--muted)" }}>
            source: {i.emailSource} · {i.firstSentAt ? `sent ${toDisplay(i.firstSentAt)}, ${i.sends} of 3 emails${i.lastDelivered === false ? ", last NOT delivered" : ""}` : `queued ${toDisplay(i.createdAt)}`}
            {i.acceptedAt ? ` · link opened ${toDisplay(i.acceptedAt)}` : ""}{i.claimedAt ? ` · claimed ${toDisplay(i.claimedAt)}` : ""}
          </div>
          {i.status === "queued" ? (
            <ActionForm action={sendInviteAction} submitLabel="Send now" variant="outline" inline confirm={`Email the invite to ${i.email}?`}>
              <input type="hidden" name="inviteId" value={i.id} /><input type="hidden" name="doctorId" value={doctorId} />
            </ActionForm>
          ) : null}
          {i.status === "queued" || i.status === "sent" ? (
            <ActionForm action={cancelInviteAction} submitLabel="Cancel invite" variant="quiet" inline confirm="Cancel this invite? Its link stops working and no reminders go out.">
              <input type="hidden" name="inviteId" value={i.id} /><input type="hidden" name="doctorId" value={doctorId} />
            </ActionForm>
          ) : null}
        </div>
      ))}
      {blocked ? (
        <div className="hint">{blocked}</div>
      ) : open ? null : (
        <ActionForm action={inviteDoctorAction} submitLabel="Send invite" variant="solid" resetOnSuccess confirm="Email this doctor an invite to claim the profile? Reminders follow on day 3 and day 10 unless they claim or opt out.">
          <input type="hidden" name="id" value={doctorId} />
          <div className="field"><label>Doctor&apos;s email</label><input type="email" name="email" required placeholder="name@example.com" /></div>
          <div className="field"><label>Where the address came from (required)</label><input type="text" name="source" required minLength={3} placeholder="Supplied by the doctor / clinic website / visiting card" /></div>
          <label className="fopt"><input type="radio" name="mode" value="send" defaultChecked /> Send now</label>{" "}
          <label className="fopt"><input type="radio" name="mode" value="queue" /> Queue for a batch</label>
          <div className="hint" style={{ margin: "6px 0 8px" }}>Only addresses the doctor or their practice published or gave us. {today} of {DAILY_INVITE_CAP} invites sent today. The email links to a page where they sign in and confirm their registration number; it is never shown on the profile.</div>
        </ActionForm>
      )}
    </section>
  );
}
