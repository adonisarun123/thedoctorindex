"use client";

import { useActionState } from "react";

import { requestOtpAction, verifyOtpAction, type SignInState } from "@/app/sign-in/actions";

/**
 * Two-step passwordless sign-in shared by patients, doctors and staff. The
 * server decides what the account can do; this component only collects the
 * identifier and the code.
 */
export function OtpSignIn({ next, label, allowPhone = process.env.NEXT_PUBLIC_SMS_ENABLED === "1" }: { next: string; label?: string; allowPhone?: boolean }) {
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
  );
}
