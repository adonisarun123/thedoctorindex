"use client";

import Link from "next/link";
import { useState } from "react";

import { TrustBadges } from "@/components/TrustBadges";
import { LOCALITIES, SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { paths } from "@/lib/site";
import type { DoctorView } from "@/lib/types";

/**
 * Registration-first submission (plan §9.2).
 *
 * We ask for council and registration number before anything else. It is how
 * two doctors with the same name are told apart, and it is what stops a second
 * profile being created for someone who already has one — a duplicate splits
 * their reviews, their practice history and their search authority.
 *
 * `lookup` is a server action passed in from the page, so the seed dataset
 * never ships to the browser.
 */
export function AddDoctorFlow({
  lookup,
}: {
  lookup: (registrationNumber: string) => Promise<DoctorView | null>;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [registration, setRegistration] = useState("");
  const [match, setMatch] = useState<DoctorView | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function check() {
    setChecking(true);
    setMatch(await lookup(registration));
    setChecking(false);
    setStep(2);
  }

  return (
    <>
      <div className="steps">
        <div className={step === 1 ? "on" : "done"}>1 · Registration</div>
        <div className={step === 2 ? "on" : step > 2 ? "done" : ""}>2 · Match check</div>
        <div className={step === 3 ? "on" : ""}>3 · Profile &amp; consent</div>
      </div>

      <div className="panel pad">
        {step === 1 ? (
          <>
            <div className="notice good" style={{ marginBottom: "20px" }}>
              <b>Registration first.</b> We ask for your council registration before anything else.
              It is how we tell two doctors with the same name apart, and it is what stops someone
              else creating a page in your name.
            </div>
            <div className="field">
              <label htmlFor="council">Medical council</label>
              <select id="council" defaultValue="Karnataka Medical Council">
                <option>Karnataka Medical Council</option>
                <option>Tamil Nadu Medical Council</option>
                <option>Maharashtra Medical Council</option>
                <option>Delhi Medical Council</option>
                <option>Telangana State Medical Council</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="reg">Registration number</label>
              <input
                id="reg"
                type="text"
                value={registration}
                onChange={(e) => setRegistration(e.target.value)}
                placeholder="e.g. KMC-58412"
              />
              <div className="hint">
                Try <span className="mono">KMC-58412</span> to see what happens when a record already
                exists, or any other number for a new one.
              </div>
            </div>
            <div className="field">
              <label htmlFor="mobile">Mobile number</label>
              <input id="mobile" type="tel" placeholder="+91" />
              <div className="hint">Used for a one-time password. Never shown on your public page.</div>
            </div>
            <div className="flowacts">
              <button
                className="btn solid"
                style={{ flex: 1 }}
                onClick={check}
                disabled={checking || !registration.trim()}
              >
                {checking ? "Checking the register…" : "Check the register"}
              </button>
            </div>
          </>
        ) : null}

        {step === 2 && match ? (
          <>
            <div className="notice" style={{ marginBottom: "20px" }}>
              <b>A profile already exists for this registration.</b> Creating a second one would split
              your reviews, your search authority and your practice history. Claim the existing page
              instead.
            </div>
            <div className="rows">
              <article className="row">
                <div className="av" aria-hidden="true">
                  {match.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <Link className="nm" href={paths.doctor(match.slug)}>
                    Dr {match.name}
                  </Link>
                  <div className="sub">{SPECIALTIES[match.specialty].one}</div>
                  <div className="meta">
                    {match.registration.council} · {match.registration.number}
                    <br />
                    {match.practices[0].facility}, {LOCALITIES[match.practices[0].locality].name}
                  </div>
                  <TrustBadges doctor={match} />
                </div>
                <div className="act">
                  <Link className="btn solid" href={paths.claimProfile()}>
                    Claim this profile
                  </Link>
                </div>
              </article>
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "12px" }}>
              Not you? A competing claim goes to a verification officer, never to an algorithm, and we
              never show one claimant&rsquo;s contact details to another.
            </p>
            <div className="flowacts">
              <button className="btn quiet" onClick={() => setStep(1)}>
                Back
              </button>
            </div>
          </>
        ) : null}

        {step === 2 && !match ? (
          <>
            <div className="notice good" style={{ marginBottom: "20px" }}>
              <b>No existing record found</b> for {registration || "that number"}. We also checked for
              close name matches in the same city and speciality and found none.
            </div>
            <p style={{ fontSize: "14.5px", color: "var(--ink-2)", marginBottom: "18px" }}>
              Next we collect your qualifications, specialities and practice locations. We verify
              against the official register first and only ask for documents where the register is
              incomplete or the records conflict.
            </p>
            <div className="flowacts">
              <button className="btn quiet" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn solid" style={{ flex: 1 }} onClick={() => setStep(3)}>
                Continue
              </button>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div className="field">
              <label htmlFor="name">Name as it appears on the register</label>
              <input id="name" type="text" placeholder="Dr …" />
            </div>
            <div className="field">
              <label htmlFor="spec">Primary speciality</label>
              <select id="spec" defaultValue={SPECIALTIES[SPECIALTY_KEYS[0]].name}>
                {SPECIALTY_KEYS.map((k) => (
                  <option key={k}>{SPECIALTIES[k].name}</option>
                ))}
              </select>
              <div className="hint">
                Controlled taxonomy. A speciality outside this list goes to review before it appears.
              </div>
            </div>
            <div className="field">
              <label htmlFor="start">Year you started practising</label>
              <input id="start" type="text" placeholder="2009" />
              <div className="hint">
                We display years of experience calculated from this date and labelled as supplied by
                you. We do not convert your registration year into an experience claim.
              </div>
            </div>
            <div className="field">
              <label htmlFor="about">Short professional introduction</label>
              <textarea id="about" placeholder="What you treat, where, and how your clinic runs." />
              <div className="hint">
                Factual description only. Cure guarantees, outcome promises and superlatives such as
                &ldquo;best&rdquo; are rejected at review.
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--hair)", paddingTop: "16px", marginTop: "20px" }}>
              <div className="eyebrow" style={{ marginBottom: "10px" }}>
                Consent — each item separately
              </div>
              {[
                "Publish my name, speciality, qualifications and practice addresses on a public page.",
                "Publish my photograph.",
                "Show my practice phone number as a click-to-call action.",
                "I confirm the information is accurate and complies with the professional conduct rules that apply to me.",
              ].map((label) => (
                <label className="consent" key={label}>
                  <input type="checkbox" />
                  {label}
                </label>
              ))}
            </div>

            <div className="flowacts">
              <button className="btn quiet" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="btn solid" style={{ flex: 1 }} onClick={() => setSubmitted(true)}>
                Submit for verification
              </button>
            </div>

            {submitted ? (
              <div className="notice good" style={{ marginTop: "16px" }}>
                <b>Submitted.</b> In the live product, automated validation runs first, then a
                verification officer matches council + registration number against the register.
                Target is 2 business days, and the page stays private until it passes.
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
}
