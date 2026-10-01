"use client";

import { useActionState, useEffect, useRef } from "react";

import { requestOtpAction, verifyOtpAction, type SignInState } from "@/app/sign-in/actions";
import { flowFromNext, trackEvent } from "@/lib/funnel";

/**
 * Two-step passwordless sign-in shared by patients, doctors and staff. The
 * server decides what the account can do; this component only collects the
 * identifier and the code.
 */
export function OtpSignIn({
  next,
  label,
  allowPhone = process.env.NEXT_PUBLIC_SMS_ENABLED === "1",
  linkedin = false,
}: {
  next: string;
  label?: string;
  allowPhone?: boolean;
  /** Offer "Continue with LinkedIn" above the email form (doctor journeys). Needs NEXT_PUBLIC_LINKEDIN_ENABLED=1. */
  linkedin?: boolean;
}) {
  const showLinkedIn = linkedin && process.env.NEXT_PUBLIC_LINKEDIN_ENABLED === "1";
  const [state, act, pending] = useActionState<SignInState, FormData>(
    async (prev, form) => (prev.step === "verify" && form.get("code") ? verifyOtpAction(prev, form) : requestOtpAction(prev, form)),
    { step: "identify", next },
  );
  // Sign-in is step one of every doctor journey, so it is tagged with the
  // journey it serves (claim, add_doctor, …). A successful verify redirects,
  // so "verified" shows up as the next step's view, not here.
  const flow = flowFromNext(next);
  const seen = useRef<SignInState | null>(null);
  useEffect(() => {
    if (seen.current === state) return;
    const first = seen.current === null;
    seen.current = state;
    if (first) return;
    if (state.error) trackEvent("otp_error", { flow, stage: state.step === "verify" ? "verify" : "request" });
    else if (state.step === "verify") trackEvent("otp_requested", { flow });
  }, [state, flow]);

  if (state.step === "verify") {
    return (
      <form action={act} data-funnel="sign_in_code" data-funnel-flow={flow} onSubmit={() => trackEvent("otp_submitted", { flow })}>
        <input type="hidden" name="identifier" value={state.identifier} />
        <input type="hidden" name="next" value={state.next ?? next} />
        <div className="notice good" style={{ marginBottom: "16px" }}>
          <b>Code sent</b> to {state.identifier}. It expires in {Math.round(Number(process.env.NEXT_PUBLIC_OTP_TTL_MINUTES ?? 10))} minutes.
          {process.env.NODE_ENV !== "production" ? " In development the code is printed in the server console." : ""}
        </div>
        {state.error ? <div className="notice alert" style={{ marginBottom: "12px" }}>{state.error}</div> : null}
        <div className="field">
          <label htmlFor="code">One-time password</label>
          <input id="code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="6 digits" autoFocus required />
        </div>
        <button type="submit" className="btn solid" style={{ width: "100%" }} disabled={pending}>
          {pending ? "Checking…" : label ?? "Sign in"}
        </button>
      </form>
    );
  }

  return (
    <>
    {showLinkedIn ? (
      <>
        <a
          className="btn"
          href={`/api/auth/linkedin?next=${encodeURIComponent(next)}`}
          onClick={() => trackEvent("linkedin_click", { flow })}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "#0A66C2", borderColor: "#0A66C2", color: "#fff" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
          Continue with LinkedIn
        </a>
        <div className="hint" style={{ textAlign: "center", margin: "8px 0 14px" }}>
          Fills in your name and verified email. We then find you in the medical council register.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--muted)", fontSize: "13px", margin: "0 0 14px" }}>
          <span style={{ flex: 1, height: 1, background: "var(--line, #e5e5e5)" }} />or use your email<span style={{ flex: 1, height: 1, background: "var(--line, #e5e5e5)" }} />
        </div>
      </>
    ) : null}
    <form action={act} data-funnel="sign_in" data-funnel-flow={flow}>
      <input type="hidden" name="next" value={next} />
      {state.error ? <div className="notice alert" style={{ marginBottom: "12px" }}>{state.error}</div> : null}
      <div className="field">
        <label htmlFor="identifier">{allowPhone ? "Email address or mobile number" : "Email address"}</label>
        <input
          id="identifier"
          name="identifier"
          type={allowPhone ? "text" : "email"}
          inputMode={allowPhone ? "text" : "email"}
          autoComplete={allowPhone ? "username" : "email"}
          placeholder={allowPhone ? "you@example.com or +91 …" : "you@example.com"}
          required
        />
        <div className="hint">
          We send a one-time code. No password to remember.
          {allowPhone ? " Mobile requires the SMS provider to be configured." : " Codes go to email — SMS is not available yet."}
        </div>
      </div>
      <button type="submit" className="btn solid" style={{ width: "100%" }} disabled={pending}>
        {pending ? "Sending…" : "Send one-time password"}
      </button>
    </form>
    </>
  );
}
