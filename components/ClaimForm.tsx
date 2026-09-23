"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { claimAction, type ClaimState } from "@/app/claim-profile/actions";
import { CouncilSelect } from "@/components/CouncilSelect";

export interface ClaimTarget {
  slug: string;
  name: string;
  specialty: string;
  hasRegistration: boolean;
  council: string;
}

export function ClaimForm({ initialRegistration, profile }: { initialRegistration: string; profile: ClaimTarget | null }) {
  const [state, act, pending] = useActionState<ClaimState, FormData>(claimAction, {});
  const [method, setMethod] = useState("practice_otp");

  if (state.ok) {
    return (
      <div className="panel pad">
        <div className="notice good" style={{ marginBottom: "16px" }}>
          <b>Claim received for Dr {state.doctorName}.</b> A verification officer confirms control through the method you chose — target 2 business days. If someone else has already claimed this profile we will not show you their details, and we will not transfer control without evidence from both sides.
        </div>
        <Link className="btn quiet" href="/dashboard">Go to your dashboard</Link>
      </div>
    );
  }

  return (
    <form className="panel pad" action={act}>
      {state.error ? <div className="notice alert" style={{ marginBottom: "16px" }}>{state.error}</div> : null}
      {profile ? (
        <div className="notice" style={{ marginBottom: "16px" }}>
          Claiming <b>Dr {profile.name}</b>{profile.specialty ? ` · ${profile.specialty}` : ""}.{" "}
          {profile.hasRegistration
            ? "Enter the council and number exactly as they appear on this profile."
            : "This profile has no registration on file yet. Enter yours; a verification officer checks it against the register before approving."}
          <input type="hidden" name="profile" value={profile.slug} />
        </div>
      ) : null}
      <div className="field">
        <label htmlFor="council">Council or registering body</label>
        <CouncilSelect id="council" name="council" defaultValue={profile?.council || undefined} />
      </div>
      <div className="field">
        <label htmlFor="reg">Registration number</label>
        <input id="reg" name="registration" type="text" required defaultValue={initialRegistration} placeholder="KMC-58412" />
        <div className="hint">We match council and number together. The same number can belong to different doctors in different states.</div>
      </div>
      <div className="field">
        <label>How should we confirm you control this profile?</label>
        {[
          ["practice_otp", "One-time password to the practice number already on file"],
          ["work_email", "Email at your hospital or clinic domain"],
          ["practice_admin", "Confirmation from the practice administrator"],
          ["document", "Upload supporting evidence for manual review"],
        ].map(([value, label]) => (
          <label className="fopt" style={{ padding: "5px 0" }} key={value}>
            <input type="radio" name="method" value={value} checked={method === value} onChange={() => setMethod(value)} />
            {label}
          </label>
        ))}
      </div>
      {method === "document" ? (
        <div className="field">
          <label htmlFor="evidence">Supporting document</label>
          <input id="evidence" name="evidence" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" required />
          <div className="hint">Registration certificate, hospital ID or a letter from the practice. Private; seen only by a verification officer.</div>
        </div>
      ) : null}
      <div className="notice" style={{ margin: "18px 0" }}>
        <b>Competing claims go to a person, not an algorithm.</b> If someone else has already claimed this profile we will not show you their contact details, and we will not transfer control without evidence from both sides.
      </div>
      <button type="submit" className="btn solid" style={{ width: "100%" }} disabled={pending}>
        {pending ? "Submitting…" : "Submit claim"}
      </button>
    </form>
  );
}
