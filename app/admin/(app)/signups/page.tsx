import { requireStaff } from "@/lib/auth/session";
import { toDisplay } from "@/lib/db/dates";
import { dueStep, isDoctorJourney, REMINDER_DAYS } from "@/lib/signup-reminders";
import { remindersEnabled, stalledSignups } from "@/lib/services/signup-reminders";

export const metadata = { title: "Stalled signups" };
export const dynamic = "force-dynamic";

const STAGE_LABEL = { setup: "Details form not finished", doctor_profile: "No claim or profile yet" } as const;
const FLOW_LABEL: Record<string, string> = { claim: "Claim", add_doctor: "Create profile", dashboard: "Dashboard", enquire: "Enquiry", review: "Review", other: "Sign-in page", admin: "Admin" };

/**
 * Everyone who signed up and has not reached a claim or a profile, with where
 * they stopped and what the reminder sequence has sent them. Doctor journeys
 * (and accounts from before the journey was recorded) are reminded; patient
 * journeys are listed for context only.
 */
export default async function AdminSignups() {
  await requireStaff();
  const rows = await stalledSignups();
  const now = new Date();
  const enabled = remindersEnabled();
  const doctorRows = rows.filter((r) => isDoctorJourney(r.signupFlow));
  const setup = doctorRows.filter((r) => r.stage === "setup").length;
  const profile = doctorRows.filter((r) => r.stage === "doctor_profile").length;

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Stalled signups</h1>
          <div className="sub">
            Accounts that signed up and stopped before a claim or a profile. Reminders go out daily at 10:00 IST on days {REMINDER_DAYS.join(", ")}, at most three per stage.{" "}
            {enabled ? "Sending is on." : <b>Sending is off (SIGNUP_REMINDERS_ENABLED is not set); the “Next” column shows what would go out.</b>}
          </div>
        </div>
      </div>

      <div className="tiles">
        <div className="tile"><div className="l">Stopped at details form</div><div className="v">{setup}</div><div className="d">got the code, never gave name, mobile, city</div></div>
        <div className="tile"><div className="l">Stopped before profile</div><div className="v">{profile}</div><div className="d">details done, no claim or submission</div></div>
        <div className="tile"><div className="l">Patient journeys</div><div className="v">{rows.length - doctorRows.length}</div><div className="d">listed, not reminded</div></div>
      </div>

      <div className="panel" style={{ overflowX: "auto", marginTop: 18 }}>
        <table className="table">
          <thead>
            <tr><th>Email</th><th>Name</th><th>Came for</th><th>Stopped at</th><th>Signed up</th><th>Sent</th><th>Next</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={7} style={{ color: "var(--muted)" }}>Nobody is stalled.</td></tr> : null}
            {rows.map((r) => {
              const due = dueStep(r, now);
              const reminded = isDoctorJourney(r.signupFlow);
              return (
                <tr key={r.userId}>
                  <td className="mono">{r.email ?? "—"}</td>
                  <td>{r.displayName ?? <span style={{ color: "var(--muted)" }}>not given</span>}</td>
                  <td>{r.signupFlow ? FLOW_LABEL[r.signupFlow] ?? r.signupFlow : <span style={{ color: "var(--muted)" }}>not recorded</span>}</td>
                  <td>{r.stage ? STAGE_LABEL[r.stage] : "—"}</td>
                  <td>{toDisplay(r.createdAt)}</td>
                  <td>{r.sentSteps.length ? `${r.sentSteps.length} of ${REMINDER_DAYS.length}` : "none"}</td>
                  <td>
                    {r.optedOut ? "unsubscribed" : !reminded ? "not reminded (patient)" : !r.email ? "no email" : due ? `step ${due.step} today` : r.sentSteps.length >= REMINDER_DAYS.length ? "sequence finished" : "waiting"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
