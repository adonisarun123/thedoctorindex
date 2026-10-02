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
  // Google is offered on every sign-in surface: most doctors and patients sign up with a Gmail address.
  const showGoogle = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "1";
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
    {showGoogle ? (
      <>
        <a
          className="btn"
          href={`/api/auth/google?next=${encodeURIComponent(next)}`}
          onClick={() => trackEvent("google_click", { flow })}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "#fff", borderColor: "#dadce0", color: "#3c4043", marginBottom: showLinkedIn ? "10px" : 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
          Continue with Google
        </a>
        {!showLinkedIn ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--muted)", fontSize: "13px", margin: "14px 0" }}>
            <span style={{ flex: 1, height: 1, background: "var(--line, #e5e5e5)" }} />or use a one-time code<span style={{ flex: 1, height: 1, background: "var(--line, #e5e5e5)" }} />
          </div>
        ) : null}
      </>
    ) : null}
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
          {showGoogle ? "Either fills in your name and verified email." : "Fills in your name and verified email."} We then find you in the medical council register.
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
