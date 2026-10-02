"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import { submitProfileAction, type SubmitState } from "@/app/add-doctor/actions";
import { CouncilSelect } from "@/components/CouncilSelect";
import { TrustBadges } from "@/components/TrustBadges";
import { PlacePicker } from "@/components/PlacePicker";
import { CertificateInput } from "@/components/CertificateInput";
import { COUNCIL_NAMES } from "@/lib/data/councils";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { paths } from "@/lib/site";
import type { DoctorView } from "@/lib/types";
import { displayName } from "@/lib/display-name";
import { sendConversion } from "@/lib/conversions";
import { trackEvent } from "@/lib/funnel";

/**
 * Registration-first submission (plan §9.2). Step 1 checks council +
 * registration number against the directory; a match sends the doctor to the
 * claim flow instead of creating a duplicate. Step 3 writes a submission that
 * staff approve in the admin panel.
 */
export function AddDoctorFlow({ lookup, source = null, initialRegistration = "", initialCouncil = "" }: { lookup: (registrationNumber: string, council: string) => Promise<DoctorView | null>; source?: string | null; initialRegistration?: string; initialCouncil?: string }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [registration, setRegistration] = useState(initialRegistration);
  const [council, setCouncil] = useState(initialCouncil || COUNCIL_NAMES[0]);
  const [match, setMatch] = useState<DoctorView | null>(null);
  const [checking, setChecking] = useState(false);
  const [qualRows, setQualRows] = useState(3);
  const [state, act, pending] = useActionState<SubmitState, FormData>(submitProfileAction, {});
  const reported = useRef(false);
  useEffect(() => {
    if (state.ok && !reported.current) {
      reported.current = true;
      sendConversion("doctor_profile_submitted", { src: source });
    }
  }, [state.ok, source]);
  // One view per step shown: registration → match_found | no_match → details.
  const stepName = step === 1 ? "registration" : step === 2 ? (match ? "match_found" : "no_match") : "details";
  useEffect(() => {
    if (!state.ok) trackEvent("add_profile_page_view", { step: stepName, src: source });
  }, [stepName, source, state.ok]);
  useEffect(() => {
    if (state.error) trackEvent("add_profile_error", { error_code: state.code ?? "unknown" });
  }, [state]);

  async function check() {
    setChecking(true);
    const found = await lookup(registration, council);
    setMatch(found);
    setChecking(false);
    setStep(2);
    trackEvent("register_check", { match: found ? "found" : "none" });
  }

  if (state.ok) {
    return (
      <div className="panel pad">
        <div className="notice good" style={{ marginBottom: "16px" }}>
          <b>Submitted for verification.</b> Reference <span className="mono">{state.id?.slice(0, 8)}</span>. A verification officer matches your council and registration number against the register, then reviews the rest. Target is 2 business days. Your page stays private until it passes, and you will be told either way.
        </div>
        <Link className="btn quiet" href="/dashboard">
          Go to your dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="steps">
        <div className={step === 1 ? "on" : "done"}>1 · Registration</div>
        <div className={step === 2 ? "on" : step > 2 ? "done" : ""}>2 · Match check</div>
        <div className={step === 3 ? "on" : ""}>3 · Profile &amp; consent</div>
      </div>

      {step === 1 ? (
        <div className="panel pad" data-funnel="add_profile_registration">
          <div className="notice good" style={{ marginBottom: "20px" }}>
            <b>Registration first.</b> We ask for your council or professional-body registration before anything else — medical, dental, AYUSH and allied-health registrations are all accepted. It is how we tell two doctors with the same name apart, and it is what stops someone else creating a page in your name.
          </div>
          <div className="field">
            <label htmlFor="council">Council or registering body</label>
            <CouncilSelect id="council" name="council-picker" value={council} onChange={setCouncil} />
          </div>
          <div className="field">
            <label htmlFor="reg">Registration number</label>
            <input id="reg" type="text" value={registration} onChange={(e) => setRegistration(e.target.value)} placeholder="e.g. KMC-58412" />
            <div className="hint">Exactly as it appears in the register. We match on council + number, never on name.</div>
          </div>
          <div className="flowacts">
            <button className="btn solid" style={{ flex: 1 }} onClick={check} disabled={checking || !registration.trim() || !council.trim()}>
              {checking ? "Checking…" : "Check the register"}
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 && match ? (
        <div className="panel pad">
          <div className="notice" style={{ marginBottom: "20px" }}>
            <b>A profile already exists for this registration.</b> Creating a second one would split your reviews, your search authority and your practice history. Claim the existing page instead.
          </div>
          <div className="rows">
            <article className="row">
              <div className="av" aria-hidden="true">{match.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
              <div>
                <Link className="nm" href={paths.doctor(match.slug)}>{displayName(match)}</Link>
                <div className="sub">{SPECIALTIES[match.specialty].one}</div>
                <div className="meta">
                  {match.registration.council} · {match.registration.number}
                  <br />
                  {match.practices[0]?.facility}, {match.practices[0] ? match.practices[0].localityName : ""}
                </div>
                <TrustBadges doctor={match} />
              </div>
              <div className="act">
                <Link className="btn solid" href={`${paths.claimProfile()}?profile=${encodeURIComponent(match.slug)}${source ? `&src=${source}` : ""}`}>Claim this profile</Link>
              </div>
            </article>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "12px" }}>
            Not you? A competing claim goes to a verification officer, never to an algorithm, and we never show one claimant&rsquo;s contact details to another.
          </p>
          <div className="flowacts">
            <button className="btn quiet" onClick={() => setStep(1)}>Back</button>
          </div>
        </div>
      ) : null}

      {step === 2 && !match ? (
        <div className="panel pad">
          <div className="notice good" style={{ marginBottom: "20px" }}>
            <b>No existing record found</b> for {council} {registration}. We also checked for close name matches in the same city and speciality and found none.
          </div>
          <p style={{ fontSize: "14.5px", color: "var(--ink-2)", marginBottom: "18px" }}>
            Next we collect your qualifications, specialities and first practice location. We verify against the official register first and only ask for documents where the register is incomplete or the records conflict.
          </p>
          <div className="flowacts">
            <button className="btn quiet" onClick={() => setStep(1)}>Back</button>
            <button className="btn solid" style={{ flex: 1 }} onClick={() => setStep(3)}>Continue</button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <form className="panel pad" action={act} data-funnel="add_profile" onSubmit={() => trackEvent("add_profile_submit_attempt")}>
          <input type="hidden" name="council" value={council} />
          <input type="hidden" name="registration" value={registration} />
          {source ? <input type="hidden" name="src" value={source} /> : null}
          {state.error ? <div className="notice alert" style={{ marginBottom: "16px" }}>{state.error}</div> : null}

          <div className="two">
            <div className="field">
              <label htmlFor="name">Name as it appears on the register</label>
              <input id="name" name="name" type="text" required placeholder="Anita Sharma" />
            </div>
            <div className="field">
              <label htmlFor="gender">Gender (optional, shown as a filter)</label>
              <select id="gender" name="gender" defaultValue="">
                <option value="">Prefer not to show</option>
                <option value="F">Female</option>
                <option value="M">Male</option>
                <option value="X">Other</option>
              </select>
            </div>
          </div>
          <div className="two">
            <div className="field">
              <label htmlFor="spec">Primary speciality</label>
              <select id="spec" name="specialty" defaultValue={SPECIALTY_KEYS[0]}>
                {SPECIALTY_KEYS.map((k) => (
                  <option key={k} value={k}>{SPECIALTIES[k].name}</option>
                ))}
              </select>
              <div className="hint">Controlled taxonomy. A speciality outside this list goes to review before it appears.</div>
            </div>
            <div className="field">
              <label htmlFor="sub">Subspecialities (comma-separated)</label>
              <input id="sub" name="subspecialties" type="text" placeholder="Interventional cardiology, Heart failure" />
            </div>
          </div>
          <div className="two">
            <div className="field">
              <label htmlFor="start">Year you started practising</label>
              <input id="start" name="start" type="text" inputMode="numeric" placeholder="2009" />
              <div className="hint">Shown as years of experience, labelled as supplied by you. We never convert your registration year into an experience claim.</div>
            </div>
            <div className="field">
              <label htmlFor="languages">Languages (comma-separated)</label>
              <input id="languages" name="languages" type="text" placeholder="English, Kannada, Hindi" />
              <div style={{ marginTop: "8px", display: "flex", gap: "14px" }}>
                <label className="fopt"><input type="checkbox" name="mode_inperson" defaultChecked /> In person</label>
                <label className="fopt"><input type="checkbox" name="mode_online" /> Online</label>
              </div>
            </div>
          </div>

          <div className="field">
            <label>Qualifications, fellowships and courses</label>
            {Array.from({ length: qualRows }, (_, i) => (
              <div key={i} style={{ marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid var(--hair)" }}>
                <div className="two" style={{ gridTemplateColumns: "1fr 1.4fr 90px", gap: "8px", marginBottom: "6px" }}>
                  <input name={`q${i}_degree`} type="text" placeholder={i === 0 ? "MBBS" : i === 1 ? "MD / MS / DNB" : "Fellowship or course"} />
                  <input name={`q${i}_inst`} type="text" placeholder="Institution" />
                  <input name={`q${i}_year`} type="text" inputMode="numeric" placeholder="Year" />
                </div>
                <CertificateInput name={`q${i}_cert`} />
              </div>
            ))}
            {qualRows < 15 ? (
              <button type="button" className="btn outline" style={{ marginBottom: "8px" }} onClick={() => setQualRows((n) => Math.min(15, n + 1))}>
                + Add another qualification or course
              </button>
            ) : null}
            <div className="hint">Upload each certificate if you can. A qualification with a certificate is checked by our team and shown as verified; without one it shows as pending until the awarding body confirms it. Certificates are private and never published.</div>
          </div>

          <div className="field">
            <label htmlFor="about">Short professional introduction</label>
            <textarea id="about" name="about" required minLength={80} placeholder="What you treat, where, and how your clinic runs. 2–4 factual sentences." />
            <div className="hint">Factual description only. Cure guarantees, outcome promises and superlatives such as “best” are rejected at review.</div>
          </div>
          <div className="field">
            <label htmlFor="services">Services and conditions managed (comma-separated)</label>
            <input id="services" name="services" type="text" placeholder="Coronary angiography, Heart failure management, Hypertension review" />
          </div>

          <div style={{ borderTop: "1px solid var(--hair)", paddingTop: "16px", marginTop: "8px" }}>
            <div className="eyebrow" style={{ marginBottom: "10px" }}>First practice location</div>
            <div className="field"><label htmlFor="facility">Clinic or hospital</label><input id="facility" name="facility" type="text" placeholder="Indiranagar Cardiac Centre" /></div>
            <PlacePicker idPrefix="practice" required={false} />
            <div className="field"><label htmlFor="address">Address</label><input id="address" name="address" type="text" placeholder="2nd Floor, 100 Feet Road" /></div>
            <div className="two" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
              <div className="field"><label htmlFor="postal">PIN</label><input id="postal" name="postal" type="text" placeholder="560038" /></div>
              <div className="field"><label htmlFor="days">Days</label><input id="days" name="days" type="text" placeholder="Mon–Fri" /></div>
              <div className="field"><label htmlFor="hours">Hours</label><input id="hours" name="hours" type="text" placeholder="10:00–13:00" /></div>
              <div className="field"><label htmlFor="fee">Fee (₹)</label><input id="fee" name="fee" type="text" inputMode="numeric" placeholder="900" /></div>
            </div>
            <div className="field"><label htmlFor="phone">Practice phone</label><input id="phone" name="phone" type="tel" placeholder="+91 80 …" /></div>
          </div>

          <div style={{ borderTop: "1px solid var(--hair)", paddingTop: "16px", marginTop: "8px" }}>
            <div className="eyebrow" style={{ marginBottom: "10px" }}>Consent — each item separately</div>
            <label className="consent"><input type="checkbox" name="c_publish" required /> Publish my name, speciality, qualifications and practice addresses on a public page.</label>
            <label className="consent"><input type="checkbox" name="c_photo" /> Publish my photograph, when I upload one.</label>
            <label className="consent"><input type="checkbox" name="c_phone" defaultChecked /> Show my practice phone number as a click-to-call action.</label>
            <label className="consent"><input type="checkbox" name="c_accurate" required /> I confirm the information is accurate and complies with the professional conduct rules that apply to me.</label>
          </div>

          <div className="flowacts">
            <button type="button" className="btn quiet" onClick={() => setStep(2)}>Back</button>
            <button type="submit" className="btn solid" style={{ flex: 1 }} disabled={pending}>{pending ? "Submitting…" : "Submit for verification"}</button>
          </div>
        </form>
      ) : null}
    </>
  );
}
