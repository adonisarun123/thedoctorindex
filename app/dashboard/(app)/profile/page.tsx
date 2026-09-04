import { photoAction, saveProfileAction } from "@/app/dashboard/actions";
import { ActionForm } from "@/components/ActionForm";
import { Avatar } from "@/components/Avatar";
import { getDashboardContext } from "@/lib/dashboard";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";

export const metadata = { title: "Profile & credentials" };

/**
 * Identity, registration, qualifications, specialities, experience and
 * languages. Non-sensitive fields publish on save; fields marked re-verified
 * become change requests a verification officer decides.
 */
export default async function DashboardProfile() {
  const { doctor, asManager } = await getDashboardContext();
  const specialty = SPECIALTIES[doctor.specialty];

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Profile &amp; credentials</h1>
          <div className="sub">Fields marked <span className="pill wait">re-verified</span> go back through verification before they change on the public page. Everything else publishes when you save.</div>
        </div>
      </div>

      {!asManager ? (
        <section className="panel pad" style={{ marginBottom: "18px" }}>
          <h3 style={{ marginTop: 0 }}>Photograph</h3>
          <div style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: "18px", alignItems: "start" }}>
            <Avatar name={doctor.name} id={doctor.id} size={84} photoUrl={doctor.photoUrl} />
            <div>
              <p style={{ margin: "0 0 10px", fontSize: "13.5px", color: "var(--ink-2)" }}>Optional, and worth 4 quality points. A plain head-and-shoulders photograph helps patients recognise you at the clinic. We resize it to 512 px and remove all embedded metadata (including location) before it is published.</p>
              <ActionForm action={photoAction} submitLabel={doctor.photoUrl ? "Replace photograph" : "Publish photograph"} variant="outline">
                <div className="field"><input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required /></div>
                <label className="fopt" style={{ marginBottom: "8px" }}><input type="checkbox" name="consent" required /> I consent to this photograph being published on my profile and shown in search results. I can withdraw this at any time by removing it.</label>
              </ActionForm>
              {doctor.photoUrl ? (
                <ActionForm action={photoAction} submitLabel="Remove photograph" variant="quiet" inline style={{ marginTop: "6px" }}>
                  <input type="hidden" name="remove" value="1" />
                </ActionForm>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {asManager ? (
        <div className="notice">Clinic managers cannot edit this page. Ask Dr {doctor.name} to make identity or credential changes.</div>
      ) : (
        <ActionForm action={saveProfileAction} submitLabel="Save and publish changes" className="stack">
          <section className="panel pad">
            <div className="chart-head"><span className="t">Identity</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: "18px", alignItems: "start" }}>
              <Avatar name={doctor.name} id={doctor.id} size={84} photoUrl={doctor.photoUrl} />
              <div>
                <div className="field">
                  <label htmlFor="name">Display name <span className="pill wait" style={{ marginLeft: "6px" }}>re-verified</span></label>
                  <input id="name" name="name" type="text" defaultValue={`Dr ${doctor.name}`} />
                  <div className="hint">Must match the register. A change triggers a fresh registration match and the old URL redirects to the new one.</div>
                </div>
                <div className="two">
                  <div className="field">
                    <label htmlFor="gender">Gender (optional, shown as a filter) <span className="pill wait" style={{ marginLeft: "6px" }}>re-verified</span></label>
                    <select id="gender" name="gender" defaultValue={doctor.gender}>
                      <option value="F">Female</option>
                      <option value="M">Male</option>
                      <option value="X">Other</option>
                      <option value="">Prefer not to show</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="languages">Languages (comma-separated)</label>
                    <input id="languages" name="languages" type="text" defaultValue={doctor.languages.join(", ")} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="panel pad">
            <div className="chart-head"><span className="t">Medical registration</span><span className="pill ok">verified {doctor.registration.checkedOn}</span></div>
            <table className="table">
              <thead><tr><th>Council</th><th>Number</th><th>Year</th><th>Status</th></tr></thead>
              <tbody><tr><td>{doctor.registration.council}</td><td className="mono">{doctor.registration.number}</td><td className="mono">{doctor.registration.registeredYear || "—"}</td><td><span className="pill ok">active</span></td></tr></tbody>
            </table>
            <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "10px" }}>
              Registration is the identity key for your profile and cannot be edited here. If it is wrong, <a href="/dashboard/verification">open a verification case</a>.
            </p>
          </section>

          <section className="panel pad">
            <div className="chart-head"><span className="t">Qualifications</span><span className="m">{doctor.qualifications.filter((q) => q.state === "verified").length} of {doctor.qualifications.length} verified</span></div>
            <table className="table">
              <thead><tr><th>Degree</th><th>Institution</th><th>Year</th><th>Status</th></tr></thead>
              <tbody>
                {doctor.qualifications.map((q) => (
                  <tr key={`${q.degree}-${q.year}`}><td>{q.degree}</td><td>{q.institution}</td><td className="mono">{q.year || "—"}</td><td><span className={`pill ${q.state === "verified" ? "ok" : "wait"}`}>{q.state}</span></td></tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "10px" }}>To add a qualification, <a href="/dashboard/verification">open a verification case</a> with the degree, institution and year. It is matched against the awarding body before it appears.</p>
          </section>

          <section className="panel pad">
            <div className="chart-head"><span className="t">Speciality and experience</span></div>
            <div className="two">
              <div className="field">
                <label htmlFor="specialty">Primary speciality <span className="pill wait" style={{ marginLeft: "6px" }}>re-verified</span></label>
                <select id="specialty" name="specialty" defaultValue={specialty.key}>
                  {SPECIALTY_KEYS.map((k) => (<option key={k} value={k}>{SPECIALTIES[k].name}</option>))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="subspecialties">Subspecialities (comma-separated)</label>
                <input id="subspecialties" name="subspecialties" type="text" defaultValue={doctor.subspecialties.join(", ")} />
              </div>
            </div>
            <div className="two">
              <div className="field">
                <label htmlFor="start">Practice start year</label>
                <input id="start" name="start" type="text" inputMode="numeric" defaultValue={String(doctor.practiceStartYear)} />
                <div className="hint">Shown as “{doctor.yearsOfExperience} years — supplied by the doctor and supported by the career history”.</div>
              </div>
              <div className="field">
                <label>Consultation modes</label>
                <div style={{ display: "flex", gap: "14px", marginTop: "8px" }}>
                  <label className="fopt"><input type="checkbox" name="mode_inperson" defaultChecked={doctor.modes.includes("In person")} /> In person</label>
                  <label className="fopt"><input type="checkbox" name="mode_online" defaultChecked={doctor.modes.includes("Online")} /> Online</label>
                </div>
              </div>
            </div>
            <div className="field">
              <label htmlFor="about">Professional introduction</label>
              <textarea id="about" name="about" defaultValue={doctor.about} />
              <div className="hint">Factual. Cure guarantees, outcome promises and superlatives are rejected.</div>
            </div>
            <div className="field">
              <label htmlFor="services">Services and conditions managed (comma-separated)</label>
              <input id="services" name="services" type="text" defaultValue={doctor.services.join(", ")} />
              <div className="hint">Terms outside the controlled list are routed to taxonomy review rather than published.</div>
            </div>
          </section>
        </ActionForm>
      )}
    </>
  );
}
