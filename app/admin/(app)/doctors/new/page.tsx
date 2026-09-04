import Link from "next/link";

import { createDoctorAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { LOCALITIES, LOCALITY_KEYS, SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Create profile" };

const COUNCILS = ["Karnataka Medical Council", "Tamil Nadu Medical Council", "Maharashtra Medical Council", "Delhi Medical Council", "Telangana State Medical Council", "Kerala State Medical Council", "Andhra Pradesh Medical Council", "Gujarat Medical Council", "West Bengal Medical Council", "Uttar Pradesh Medical Council", "National Medical Commission"];

export default async function AdminNewDoctor() {
  await requireStaff();
  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Create a profile</h1>
          <div className="sub">Registration first — council + number is the identity. Only tick “verified” on things you actually checked against a source; unverified items show as “submitted” on the public page.</div>
        </div>
        <Link className="btn quiet" href="/admin/doctors">Back to list</Link>
      </div>

      <ActionForm action={createDoctorAction} submitLabel="Create profile" variant="solid" className="panel pad">
        <h3 style={{ marginTop: 0 }}>Registration</h3>
        <div className="two" style={{ gridTemplateColumns: "1fr 1fr 120px" }}>
          <div className="field"><label>Medical council</label><select name="council" defaultValue={COUNCILS[0]}>{COUNCILS.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="field"><label>Registration number</label><input type="text" name="registration" required placeholder="KMC-12345" /></div>
          <div className="field"><label>Registered year</label><input type="number" name="regYear" min={1950} max={2030} /></div>
        </div>
        <label className="fopt"><input type="checkbox" name="regVerified" /> I matched this council + number in the register today</label>

        <h3>Identity</h3>
        <div className="two" style={{ gridTemplateColumns: "1fr 140px 1fr" }}>
          <div className="field"><label>Full name (without “Dr”)</label><input type="text" name="name" required /></div>
          <div className="field"><label>Gender</label><select name="gender" defaultValue=""><option value="">Not stated</option><option value="F">Female</option><option value="M">Male</option><option value="X">Other</option></select></div>
          <div className="field"><label>Speciality</label><select name="specialty" defaultValue={SPECIALTY_KEYS[0]}>{SPECIALTY_KEYS.map((k) => <option key={k} value={k}>{SPECIALTIES[k].name}</option>)}</select></div>
        </div>
        <div className="two">
          <div className="field"><label>Subspecialities (comma-separated)</label><input type="text" name="subspecialties" placeholder="Interventional cardiology, Heart failure" /></div>
          <div className="field"><label>Practice start year</label><input type="number" name="start" min={1960} max={2030} /></div>
        </div>
        <div className="two">
          <div className="field"><label>Languages (comma-separated)</label><input type="text" name="languages" defaultValue="English, Kannada, Hindi" /></div>
          <div className="field"><label>Consultation modes</label><div style={{ display: "flex", gap: "16px", paddingTop: "8px" }}><label className="fopt"><input type="checkbox" name="mode_inperson" defaultChecked /> In person</label><label className="fopt"><input type="checkbox" name="mode_online" /> Online</label></div></div>
        </div>
        <div className="field"><label>About (plain prose, no superlatives)</label><textarea name="about" style={{ minHeight: "90px" }} /></div>
        <div className="field"><label>Services (comma-separated, controlled terms)</label><input type="text" name="services" placeholder="ECG, Echocardiography, Angiography" /></div>

        <h3>Qualifications</h3>
        {[0, 1, 2].map((i) => (
          <div className="two" key={i} style={{ gridTemplateColumns: "1fr 1.4fr 110px 130px" }}>
            <div className="field"><label>Degree</label><input type="text" name={`q${i}_degree`} placeholder={i === 0 ? "MBBS" : i === 1 ? "MD" : "DM"} /></div>
            <div className="field"><label>Institution</label><input type="text" name={`q${i}_inst`} /></div>
            <div className="field"><label>Year</label><input type="number" name={`q${i}_year`} min={1950} max={2030} /></div>
            <div className="field"><label>&nbsp;</label><label className="fopt"><input type="checkbox" name={`q${i}_verified`} /> verified</label></div>
          </div>
        ))}

        <h3>Experience</h3>
        {[0, 1].map((i) => (
          <div className="two" key={i} style={{ gridTemplateColumns: "1fr 1.4fr 110px 110px" }}>
            <div className="field"><label>Role</label><input type="text" name={`e${i}_role`} placeholder="Consultant cardiologist" /></div>
            <div className="field"><label>Place</label><input type="text" name={`e${i}_place`} /></div>
            <div className="field"><label>From</label><input type="number" name={`e${i}_from`} min={1960} max={2030} /></div>
            <div className="field"><label>To (blank = present)</label><input type="number" name={`e${i}_to`} min={1960} max={2030} /></div>
          </div>
        ))}

        <h3>First practice (optional — add more from the profile page)</h3>
        <div className="two" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
          <div className="field"><label>Facility name</label><input type="text" name="facility" placeholder="Apollo Hospitals, Bannerghatta Road" /></div>
          <div className="field"><label>Locality</label><select name="locality" defaultValue={LOCALITY_KEYS[0]}>{LOCALITY_KEYS.map((k) => <option key={k} value={k}>{LOCALITIES[k].name}</option>)}</select></div>
        </div>
        <div className="two" style={{ gridTemplateColumns: "1.6fr 140px" }}>
          <div className="field"><label>Address</label><input type="text" name="address" /></div>
          <div className="field"><label>PIN code</label><input type="text" name="postal" inputMode="numeric" pattern="[0-9]{6}" /></div>
        </div>
        <div className="two" style={{ gridTemplateColumns: "1fr 1fr 120px 1fr" }}>
          <div className="field"><label>Days</label><input type="text" name="days" placeholder="Mon–Sat" /></div>
          <div className="field"><label>Hours</label><input type="text" name="hours" placeholder="10:00–13:00, 17:00–20:00" /></div>
          <div className="field"><label>Fee (₹)</label><input type="number" name="fee" min={0} /></div>
          <div className="field"><label>Practice phone</label><input type="tel" name="phone" placeholder="+91 80 …" /></div>
        </div>
        <label className="fopt"><input type="checkbox" name="practiceConfirmed" /> Practice confirmed with the facility today (sets the freshness clock)</label>

        <h3>Publishing</h3>
        <div className="two" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="field"><label>Source</label><select name="source" defaultValue="staff"><option value="staff">Staff-created</option><option value="import">Imported dataset</option><option value="practice">Practice / hospital request</option></select></div>
          <div className="field"><label>&nbsp;</label><label className="fopt"><input type="checkbox" name="publish" /> Publish immediately (otherwise saved as draft; it still needs quality ≥ gate to be indexed)</label></div>
        </div>
      </ActionForm>
    </>
  );
}
