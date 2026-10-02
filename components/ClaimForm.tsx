"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import { claimAction, type ClaimState } from "@/app/claim-profile/actions";
import { CouncilSelect } from "@/components/CouncilSelect";
import { sendConversion } from "@/lib/conversions";
import { trackEvent } from "@/lib/funnel";

export interface ClaimTarget {
  slug: string;
  name: string;
  specialty: string;
  hasRegistration: boolean;
  council: string;
}

/** Verification options. The default needs nothing from the doctor: an officer calls the practice on file. */
const METHOD_LABELS: Record<string, { short: string; long: string }> = {
  practice_otp: { short: "a one-time code to the practice number on file", long: "One-time password to the practice number already on file" },
  work_email: { short: "an email at your hospital or clinic domain", long: "Email at your hospital or clinic domain" },
  practice_admin: { short: "confirmation from your practice administrator", long: "Confirmation from the practice administrator" },
  document: { short: "a document you upload", long: "Upload supporting evidence (registration certificate, hospital ID) — usually fastest" },
};

export function ClaimForm({ initialRegistration, initialCouncil = "", profile, source = null }: { initialRegistration: string; initialCouncil?: string; profile: ClaimTarget | null; source?: string | null }) {
  const [state, act, pending] = useActionState<ClaimState, FormData>(claimAction, {});
  const [method, setMethod] = useState("practice_otp");
  const reported = useRef(false);
  useEffect(() => {
    if (state.ok && !reported.current) {
      reported.current = true;
      sendConversion("doctor_claim_submitted", { src: source, method });
    }
    // method is read at the moment of success only; it must not re-trigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok, source]);
  useEffect(() => {
    if (state.error) trackEvent("claim_error", { error_code: state.code ?? "unknown", method });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state.ok) {
    return (
      <div className="panel pad">
        <div className="notice good" style={{ marginBottom: "16px" }}>
          <b>Claim received for {state.doctorName}.</b> A verification officer confirms control through the method you chose — target 2 business days. If someone else has already claimed this profile we will not show you their details, and we will not transfer control without evidence from both sides.
        </div>
        <Link className="btn quiet" href="/dashboard">Go to your dashboard</Link>
      </div>
    );
  }

  return (
    <form className="panel pad" action={act} data-funnel="claim" onSubmit={() => trackEvent("claim_submit_attempt", { method })}>
      {source ? <input type="hidden" name="src" value={source} /> : null}
      {state.error ? <div className="notice alert" style={{ marginBottom: "16px" }}>{state.error}</div> : null}
      {profile ? (
        <div className="notice" style={{ marginBottom: "16px" }}>
          Claiming <b>{profile.name}</b>{profile.specialty ? ` · ${profile.specialty}` : ""}.{" "}
          {profile.hasRegistration
            ? "Enter the council and number exactly as they appear on this profile."
            : "This profile has no registration on file yet. Enter yours; a verification officer checks it against the register before approving."}
          <input type="hidden" name="profile" value={profile.slug} />
        </div>
      ) : null}
      <div className="field">
        <label htmlFor="council">Council or registering body</label>
        <CouncilSelect id="council" name="council" defaultValue={profile?.council || initialCouncil || undefined} />
      </div>
      <div className="field">
        <label htmlFor="reg">Registration number</label>
        <input id="reg" name="registration" type="text" required defaultValue={initialRegistration} placeholder="KMC-58412" />
        <div className="hint">We match council and number together. The same number can belong to different doctors in different states.</div>
      </div>
      <details className="field" open={method !== "practice_otp"} style={{ margin: "6px 0 14px" }}>
        <summary style={{ cursor: "pointer", fontSize: "14px" }}>
          <b>How we confirm it&rsquo;s you:</b> {METHOD_LABELS[method]?.short ?? METHOD_LABELS.practice_otp.short} <span style={{ color: "var(--muted)" }}>(change)</span>
        </summary>
        <div style={{ marginTop: "8px" }}>
          {Object.entries(METHOD_LABELS).map(([value, m]) => (
            <label className="fopt" style={{ padding: "5px 0" }} key={value}>
              <input type="radio" name="method" value={value} checked={method === value} onChange={() => {
                setMethod(value);
                trackEvent("claim_method_select", { method: value });
              }} />
              {m.long}
            </label>
          ))}
        </div>
      </details>
      {method === "document" ? (
        <div className="field">
          <label htmlFor="evidence">Supporting document</label>
          <input id="evidence" name="evidence" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" required />
          <div className="hint">Registration certificate, hospital ID or a letter from the practice. Private; seen only by a verification officer.</div>
        </div>
      ) : null}
      <div className="hint" style={{ margin: "0 0 14px" }}>
        Free. A verification officer approves claims within about 2 business days. If someone else has claimed this profile, a person decides on evidence from both sides.
      </div>
      <button type="submit" className="btn solid" style={{ width: "100%" }} disabled={pending}>
        {pending ? "Submitting…" : "Claim my profile"}
      </button>
    </form>
  );
}
