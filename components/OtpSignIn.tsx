"use client";

import { useActionState } from "react";

import { requestOtpAction, verifyOtpAction, type SignInState } from "@/app/sign-in/actions";

/**
 * Two-step passwordless sign-in shared by patients, doctors and staff. The
 * server decides what the account can do; this component only collects the
 * identifier and the code.
 */
export function OtpSignIn({ next, label }: { next: string; label?: string }) {
  const [state, act, pending] = useActionState<SignInState, FormData>(
    async (prev, form) => (prev.step === "verify" && form.get("code") ? verifyOtpAction(prev, form) : requestOtpAction(prev, form)),
    { step: "identify", next },
  );

  if (state.step === "verify") {
    return (
      <form action={act}>
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
    <form action={act}>
      <input type="hidden" name="next" value={next} />
      {state.error ? <div className="notice alert" style={{ marginBottom: "12px" }}>{state.error}</div> : null}
      <div className="field">
        <label htmlFor="identifier">Email address or mobile number</label>
        <input id="identifier" name="identifier" type="text" autoComplete="username" placeholder="you@example.com or +91 …" required />
        <div className="hint">We send a one-time code. No password to remember. Mobile requires the SMS provider to be configured.</div>
      </div>
      <button type="submit" className="btn solid" style={{ width: "100%" }} disabled={pending}>
        {pending ? "Sending…" : "Send one-time password"}
      </button>
    </form>
  );
}
