import { addPracticeAction, confirmPracticeAction, removePracticeAction, savePracticeAction } from "@/app/dashboard/actions";
import { ActionForm } from "@/components/ActionForm";
import { env } from "@/lib/env";
import { getDashboardContext } from "@/lib/dashboard";
import { LOCALITIES, LOCALITY_KEYS } from "@/lib/data/taxonomy";

export const metadata = { title: "Practices & fees" };

export default async function DashboardPractices() {
  const { doctor, asManager, scope } = await getDashboardContext();
  const editable = (pid?: string) => !asManager || !scope.length || (pid ? scope.includes(pid) : false);

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Practices &amp; fees</h1>
          <div className="sub">{doctor.practices.length} location{doctor.practices.length === 1 ? "" : "s"} · fees prompt for reconfirmation every {env.freshness.feeDays} days, addresses every {env.freshness.practiceDays}</div>
        </div>
      </div>

      <div className="stack">
        {doctor.practices.map((p, i) => (
          <section className="panel pad" key={p.id}>
            <div className="chart-head">
              <span className="t">Practice {i + 1} · {p.facility}</span>
              <span className="pill ok">address confirmed {p.confirmedOn}</span>
            </div>
            {editable(p.id) ? (
              <ActionForm action={savePracticeAction} submitLabel="Save changes">
                <input type="hidden" name="practiceId" value={p.id} />
                <div className="field">
                  <label htmlFor={`address-${p.id}`}>Address <span className="pill wait" style={{ marginLeft: "6px" }}>re-confirmed</span></label>
                  <input id={`address-${p.id}`} name="address" type="text" defaultValue={p.address} />
                  <div className="hint">An address change asks the practice to reconfirm before it publishes.</div>
                </div>
                <div className="two">
                  <div className="field"><label htmlFor={`days-${p.id}`}>Days</label><input id={`days-${p.id}`} name="days" type="text" defaultValue={p.days} /></div>
                  <div className="field"><label htmlFor={`hours-${p.id}`}>Hours</label><input id={`hours-${p.id}`} name="hours" type="text" defaultValue={p.hours} /></div>
                </div>
                <div className="two">
                  <div className="field">
                    <label htmlFor={`fee-${p.id}`}>Consultation fee (₹) {p.feeInr !== null ? <span className="pill ok" style={{ marginLeft: "6px" }}>confirmed {p.feeCheckedOn}</span> : <span className="pill wait" style={{ marginLeft: "6px" }}>hidden — not current</span>}</label>
                    <input id={`fee-${p.id}`} name="fee" type="text" inputMode="numeric" defaultValue={p.feeInr ?? ""} />
                    <div className="hint">Shown publicly with its confirmation date. Saving a fee stamps today&rsquo;s date on it.</div>
                  </div>
                  <div className="field">
                    <label htmlFor={`phone-${p.id}`}>Practice phone (click-to-call)</label>
                    <input id={`phone-${p.id}`} name="phone" type="tel" defaultValue={p.phone} />
                  </div>
                </div>
              </ActionForm>
            ) : (
              <p style={{ fontSize: "13.5px", color: "var(--muted)" }}>This practice is outside your manager access.</p>
            )}
            {editable(p.id) ? (
              <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap", borderTop: "1px solid var(--hair)", paddingTop: "14px" }}>
                <ActionForm action={confirmPracticeAction} submitLabel="Confirm all details are current" variant="outline" inline>
                  <input type="hidden" name="practiceId" value={p.id} />
                </ActionForm>
                {!asManager ? (
                  <ActionForm action={removePracticeAction} submitLabel="Remove this practice" variant="quiet" inline confirm={`Remove ${p.facility} from your public profile?`}>
                    <input type="hidden" name="practiceId" value={p.id} />
                  </ActionForm>
                ) : null}
              </div>
            ) : null}
          </section>
        ))}

        {!asManager ? (
          <section className="panel pad">
            <div className="chart-head"><span className="t">Add a practice</span></div>
            <ActionForm action={addPracticeAction} submitLabel="Add practice" variant="outline" resetOnSuccess>
              <div className="two">
                <div className="field"><label htmlFor="facility">Clinic or hospital</label><input id="facility" name="facility" type="text" required /></div>
                <div className="field"><label htmlFor="locality">Locality</label>
                  <select id="locality" name="locality" defaultValue={LOCALITY_KEYS[0]}>
                    {LOCALITY_KEYS.map((k) => (<option key={k} value={k}>{LOCALITIES[k].name}, {LOCALITIES[k].city}</option>))}
                  </select>
                </div>
              </div>
              <div className="field"><label htmlFor="new-address">Address</label><input id="new-address" name="address" type="text" required /></div>
              <div className="two" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
                <div className="field"><label htmlFor="postal">PIN</label><input id="postal" name="postal" type="text" /></div>
                <div className="field"><label htmlFor="new-days">Days</label><input id="new-days" name="days" type="text" /></div>
                <div className="field"><label htmlFor="new-hours">Hours</label><input id="new-hours" name="hours" type="text" /></div>
                <div className="field"><label htmlFor="new-fee">Fee (₹)</label><input id="new-fee" name="fee" type="text" inputMode="numeric" /></div>
              </div>
              <div className="field"><label htmlFor="new-phone">Practice phone</label><input id="new-phone" name="phone" type="tel" /></div>
              <div className="hint" style={{ marginBottom: "8px" }}>Geocoded on save; the practice is contacted to confirm before it appears publicly.</div>
            </ActionForm>
          </section>
        ) : null}
      </div>
    </>
  );
}
