import Link from "next/link";

import { addBlockAction, addNotifyEmailAction, decideAppointmentAction, removeBlockAction, removeNotifyEmailAction, resendNotifyEmailAction, saveHoursAction, toggleBookingAction } from "@/app/dashboard/calendar-actions";
import { ActionForm } from "@/components/ActionForm";
import { ProfileLinks } from "@/components/ProfileLinks";
import { getDashboardContext } from "@/lib/dashboard";
import { formatIst, istDay, WEEKDAYS } from "@/lib/booking/slots";
import { bookingRequirementsFor, getRules, listBlocks, listDoctorAppointments } from "@/lib/services/booking";
import { listNotifyEmails } from "@/lib/services/booking-notify";
import { MAX_NOTIFY_EMAILS } from "@/lib/booking/notice";
import { SITE } from "@/lib/site";
import { displayName } from "@/lib/display-name";

export const metadata = { title: "Calendar" };

/** Features that open with a complete profile. Booking is live; the rest are named only as "coming". */
const UPCOMING = ["Online appointment booking", "Appointment reminders to patients", "Follow-up scheduling", "Teleconsultation slots"];

const STATUS_PILL: Record<string, string> = { requested: "wait", confirmed: "ok", declined: "neut", cancelled: "neut", completed: "ok", no_show: "warn" };

export default async function CalendarPage() {
  const ctx = await getDashboardContext();
  const { requirements, unlocked, enabled } = await bookingRequirementsFor(ctx.doctorId);
  const done = requirements.filter((r) => r.done).length;

  if (!unlocked) {
    return (
      <>
        <div className="dash-head">
          <div>
            <h1>Calendar <span className="pill neut" style={{ verticalAlign: "middle" }}>locked</span></h1>
            <div className="sub">Complete your profile to unlock the calendar and the features that come with it. {done} of {requirements.length} done.</div>
          </div>
        </div>
        <div className="two">
          <div className="panel pad">
            <div className="chart-head"><span className="t">To unlock</span><span className="m">{done}/{requirements.length}</span></div>
            <div className="progress"><i style={{ width: `${Math.round((done / requirements.length) * 100)}%` }} /></div>
            <div className="checklist" style={{ marginTop: "14px", border: 0 }}>
              {requirements.map((r) => (
                <div className={`check${r.done ? " done" : ""}`} key={r.key} style={{ padding: "8px 0" }}>
                  <div className="box">{r.done ? "✓" : ""}</div>
                  <div><div className="t">{r.label}</div><div className="d">{r.detail}</div></div>
                  {r.done ? <div className="pts" /> : <Link href={r.href} className="pts">Fix →</Link>}
                </div>
              ))}
            </div>
          </div>
          <div className="panel pad">
            <div className="chart-head"><span className="t">What unlocks</span></div>
            <ul style={{ margin: "8px 0 0", paddingLeft: "18px", fontSize: "14px", lineHeight: 1.8 }}>
              {UPCOMING.map((u, i) => (
                <li key={u}>{u} {i === 0 ? <span className="pill ok">ready</span> : <span className="pill neut">coming</span>}</li>
              ))}
            </ul>
            <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "10px" }}>New tools open first to doctors with complete profiles.</p>
          </div>
        </div>
      </>
    );
  }

  const [rules, blocks, appts, notifyEmails] = await Promise.all([getRules(ctx.doctorId), listBlocks(ctx.doctorId), listDoctorAppointments(ctx.doctorId), listNotifyEmails(ctx.doctorId)]);
  const practices = ctx.doctor.practices.filter((p) => p.id && (!ctx.asManager || !ctx.scope.length || ctx.scope.includes(p.id)));
  const scoped = ctx.asManager && ctx.scope.length ? appts.filter((a) => ctx.scope.includes(a.practiceId)) : appts;
  const now = new Date();
  const requests = scoped.filter((a) => a.status === "requested" && a.startsAt > now);
  const upcoming = scoped.filter((a) => a.status === "confirmed" && a.startsAt > now);
  const past = scoped.filter((a) => a.startsAt <= now && (a.status === "confirmed" || a.status === "requested"));
  const today = istDay(now).day;

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Calendar</h1>
          <div className="sub">
            Online booking is {enabled ? <span className="pill ok">on</span> : <span className="pill neut">off</span>} · patients request a slot, you confirm it · times are IST
          </div>
        </div>
        <ActionForm action={toggleBookingAction} submitLabel={enabled ? "Turn booking off" : "Turn booking on"} variant={enabled ? "outline" : "solid"} inline>
          <input type="hidden" name="on" value={enabled ? "0" : "1"} />
        </ActionForm>
      </div>

      {!rules.length ? (
        <div className="notice" style={{ marginBottom: "16px" }}>
          <b>Set your weekly hours below, then turn booking on.</b> Patients only see slots inside these hours, minus blocked days and taken slots.
        </div>
      ) : null}

      <section style={{ marginBottom: "22px" }}>
        <div className="chart-head"><span className="t">Requests to confirm</span><span className="m">{requests.length}</span></div>
        {requests.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)", fontSize: "14px" }}>No pending requests.</div> : null}
        {requests.map((a) => (
          <div className="qcard" key={a.id}>
            <div className="qh">
              <div>
                <div className="qt">{formatIst(a.startsAt)} · {a.practice.facility.name} · <span className="mono">{a.ref}</span></div>
                <div className="qm">{a.patientName} · <span className="mono">{a.patientPhone}</span> · for {a.forWhom === "other" ? "someone else" : "themself"}{a.reason ? ` · “${a.reason}”` : ""}</div>
              </div>
            </div>
            <ActionForm action={decideAppointmentAction} submitLabel="Apply" variant="solid" style={{ marginTop: "8px" }}>
              <input type="hidden" name="id" value={a.id} />
              <div className="two" style={{ gridTemplateColumns: "200px 1fr" }}>
                <div className="field" style={{ marginBottom: 0 }}><select name="decision" defaultValue="confirmed"><option value="confirmed">Confirm</option><option value="declined">Decline</option></select></div>
                <div className="field" style={{ marginBottom: 0 }}><input type="text" name="note" maxLength={200} placeholder="Note to the patient if declining (optional)" /></div>
              </div>
            </ActionForm>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: "22px" }}>
        <div className="chart-head"><span className="t">Upcoming</span><span className="m">{upcoming.length}</span></div>
        {upcoming.length ? (
          <table className="table">
            <thead><tr><th>When</th><th>Patient</th><th>Practice</th><th>Ref</th><th /></tr></thead>
            <tbody>
              {upcoming.map((a) => (
                <tr key={a.id}>
                  <td className="mono">{formatIst(a.startsAt)}</td>
                  <td>{a.patientName}<br /><span className="mono" style={{ fontSize: "12px" }}>{a.patientPhone}</span></td>
                  <td>{a.practice.facility.name}</td>
                  <td className="mono">{a.ref}</td>
                  <td>
                    <ActionForm action={decideAppointmentAction} submitLabel="Cancel" variant="quiet" inline confirm="Cancel this appointment? The patient is emailed.">
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="decision" value="cancelled" />
                    </ActionForm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="panel pad" style={{ color: "var(--muted)", fontSize: "14px" }}>Nothing confirmed yet.</div>
        )}
      </section>

      {past.length ? (
        <section style={{ marginBottom: "22px" }}>
          <div className="chart-head"><span className="t">Mark attendance</span><span className="m">last 7 days</span></div>
          {past.map((a) => (
            <div className="qcard" key={a.id}>
              <div className="qh"><div><div className="qt">{formatIst(a.startsAt)} · {a.patientName} · <span className="mono">{a.ref}</span></div><div className="qm"><span className={`pill ${STATUS_PILL[a.status]}`}>{a.status}</span></div></div></div>
              <ActionForm action={decideAppointmentAction} submitLabel="Record" variant="outline" inline style={{ marginTop: "6px" }}>
                <input type="hidden" name="id" value={a.id} />
                <select name="decision" defaultValue="completed">
                  {a.status === "confirmed" ? (<><option value="completed">Seen</option><option value="no_show">Did not come</option></>) : (<option value="declined">Close request</option>)}
                </select>
              </ActionForm>
            </div>
          ))}
        </section>
      ) : null}

      <section style={{ marginBottom: "22px" }}>
        <div className="chart-head"><span className="t">Weekly hours</span><span className="m">up to two sessions a day per practice</span></div>
        {practices.length === 0 ? <div className="panel pad">Add a practice first.</div> : null}
        <ActionForm action={saveHoursAction} submitLabel="Save weekly hours" variant="solid">
          {practices.map((p) => {
            const mine = rules.filter((r) => r.practiceId === p.id);
            const slot = mine[0]?.slotMinutes ?? 15;
            return (
              <div className="panel pad" key={p.id} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <b>{p.facility}</b>
                  <label style={{ fontSize: "13px" }}>
                    Slot length{" "}
                    <select name={`slot:${p.id}`} defaultValue={String(slot)}>
                      {[10, 15, 20, 30, 45, 60].map((m) => <option key={m} value={m}>{m} min</option>)}
                    </select>
                  </label>
                </div>
                <table className="table" style={{ marginTop: "8px" }}>
                  <thead><tr><th>Day</th><th>Session 1</th><th>Session 2</th></tr></thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                      const day = mine.filter((r) => r.weekday === d);
                      return (
                        <tr key={d}>
                          <td>{WEEKDAYS[d].slice(0, 3)}</td>
                          {[0, 1].map((k) => (
                            <td key={k} style={{ whiteSpace: "nowrap" }}>
                              <input type="time" name={`r:${p.id}:${d}:${k}:start`} defaultValue={day[k]?.startTime ?? ""} style={{ width: "7.2em" }} aria-label={`${WEEKDAYS[d]} session ${k + 1} start`} />{" – "}
                              <input type="time" name={`r:${p.id}:${d}:${k}:end`} defaultValue={day[k]?.endTime ?? ""} style={{ width: "7.2em" }} aria-label={`${WEEKDAYS[d]} session ${k + 1} end`} />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </ActionForm>
      </section>

      <section style={{ marginBottom: "22px" }}>
        <div className="chart-head"><span className="t">Days off</span><span className="m">no slots offered on these dates</span></div>
        <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 8px" }}>Blocking a day cancels any appointments already on it and emails those patients.</p>
        <ActionForm action={addBlockAction} submitLabel="Block day" variant="outline" inline confirm="Block this day? Any appointments already booked on it will be cancelled and the patients emailed.">
          <input type="date" name="day" min={today} required />
          <input type="text" name="note" placeholder="Leave, conference… (private)" maxLength={80} />
        </ActionForm>
        {blocks.length ? (
          <div className="checklist" style={{ marginTop: "10px" }}>
            {blocks.map((b) => (
              <div className="check" key={b.id}>
                <div className="box" />
                <div><div className="t mono">{b.day}</div>{b.note ? <div className="d">{b.note}</div> : null}</div>
                <ActionForm action={removeBlockAction} submitLabel="Reopen" variant="quiet" inline>
                  <input type="hidden" name="id" value={b.id} />
                </ActionForm>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section style={{ marginBottom: "22px" }}>
        <div className="chart-head"><span className="t">Who gets appointment emails</span><span className="m">{notifyEmails.length}/{MAX_NOTIFY_EMAILS} extra</span></div>
        <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 8px" }}>
          The doctor&rsquo;s account email{!ctx.asManager && ctx.user.email ? <> (<span className="mono">{ctx.user.email}</span>)</> : null} always gets them. Add your front desk or clinic manager below. Each email carries the patient&rsquo;s name, mobile, time and clinic &mdash; never the visit reason &mdash; so a new address receives nothing until someone there clicks the verification link we send.
        </p>
        {ctx.asManager ? (
          <p style={{ fontSize: "13px", margin: 0 }}>Only the doctor can change this list.</p>
        ) : notifyEmails.length < MAX_NOTIFY_EMAILS ? (
          <ActionForm action={addNotifyEmailAction} submitLabel="Add and send verification" variant="outline" inline>
            <input type="email" name="email" placeholder="frontdesk@yourclinic.in" required maxLength={254} />
          </ActionForm>
        ) : null}
        {notifyEmails.length ? (
          <div className="checklist" style={{ marginTop: "10px" }}>
            {notifyEmails.map((e) => (
              <div className={`check${e.verifiedAt ? " done" : ""}`} key={e.id}>
                <div className="box">{e.verifiedAt ? "✓" : ""}</div>
                <div>
                  <div className="t mono">{e.email}</div>
                  <div className="d">{e.verifiedAt ? "Verified — receiving appointment emails" : e.tokenExpiresAt && e.tokenExpiresAt > new Date() ? "Waiting for verification — receives nothing yet" : "Verification link expired — resend it"}</div>
                </div>
                {ctx.asManager ? <div className="pts" /> : (
                  <div style={{ display: "flex", gap: "6px" }}>
                    {e.verifiedAt ? null : (
                      <ActionForm action={resendNotifyEmailAction} submitLabel="Resend" variant="quiet" inline>
                        <input type="hidden" name="id" value={e.id} />
                      </ActionForm>
                    )}
                    <ActionForm action={removeNotifyEmailAction} submitLabel="Remove" variant="quiet" inline confirm={`Stop sending appointment emails to ${e.email}?`}>
                      <input type="hidden" name="id" value={e.id} />
                    </ActionForm>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <ProfileLinks slug={ctx.doctor.slug} origin={SITE.origin} name={displayName(ctx.doctor)} bookingEnabled={enabled} />
    </>
  );
}
