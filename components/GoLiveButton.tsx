"use client";

import Link from "next/link";
import { useActionState } from "react";

import { goLiveAction, type GoLiveState } from "@/app/claim-profile/find/actions";
import { trackEvent } from "@/lib/funnel";

const REVIEW: Record<string, string> = {
  name_mismatch:
    "The name on your account doesn’t match how the council records this registration, so a verification officer will confirm it — usually within two working days. We’ll email you.",
  claimed_by_other:
    "Another account already manages this profile. A verification officer will look at both sides and email you.",
  has_profile: "Your account already manages a profile. A verification officer will check this one and email you.",
};

const BLOCKED: Record<string, string> = {
  removed: "The council marks this registration as removed, so it can’t go live here.",
  not_found: "We couldn’t read this register entry. Search again, or contact us.",
  unavailable: "This profile isn’t available online. Contact us and we will help.",
  no_account_name: "Add your name to your account first, then try again.",
};

/** One register entry → a live profile. Shown only to a signed-in user on /claim-profile/find. */
export function GoLiveButton({ entry, label }: { entry: number; label: string }) {
  const [state, action, pending] = useActionState<GoLiveState, FormData>(goLiveAction, {});
  const o = state.outcome;

  if (o?.kind === "live" || o?.kind === "already_yours") {
    return (
      <div className="notice" style={{ marginTop: "4px" }}>
        <b>{o.kind === "live" ? "You’re live." : "This profile is already yours."}</b>{" "}
        {o.kind === "live" ? "Your verified profile is on The Doctor Index now. Adding a photo, your clinic and a short introduction helps patients find you — do it whenever you like." : null}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
          <Link className="btn solid" href="/dashboard">Add photo, clinic &amp; bio</Link>
          <Link className="btn quiet" href={`/doctor/${o.slug}`}>View my profile</Link>
        </div>
      </div>
    );
  }
  if (o?.kind === "review") return <div className="notice"><b>Sent for a quick check.</b> {REVIEW[o.reason]}</div>;
  if (o?.kind === "blocked") return <div className="notice alert">{BLOCKED[o.reason]}</div>;

  return (
    <form action={action} onSubmit={() => trackEvent("register_result_click", { cta_location: "go-live" })}>
      <input type="hidden" name="entry" value={entry} />
      <label style={{ display: "flex", gap: "8px", alignItems: "flex-start", fontSize: "14px", margin: "0 0 10px" }}>
        <input type="checkbox" name="confirm" required style={{ marginTop: "3px" }} />
        <span>This is my registration, and I agree to these register details being shown on my profile.</span>
      </label>
      {state.error ? <div className="notice alert" style={{ marginBottom: "10px" }}>{state.error}</div> : null}
      <button type="submit" className="btn solid" disabled={pending}>{pending ? "Checking the register…" : label}</button>
    </form>
  );
}
