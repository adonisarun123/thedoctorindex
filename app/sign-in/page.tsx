import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { OtpSignIn } from "@/components/OtpSignIn";
import { isDoctorNext } from "@/lib/auth/doctor-journey";
import { getSessionUser } from "@/lib/auth/session";
import { privateMeta } from "@/lib/seo/meta";
import { paths } from "@/lib/site";

export const metadata: Metadata = privateMeta("Sign in or create an account", "Sign in with a one-time code to request appointments, write verified reviews or manage a doctor profile.", "/sign-in");

/** Reason codes the LinkedIn callback sends back (app/api/auth/linkedin/callback). */
const LINKEDIN_ERRORS: Record<string, string> = {
  cancelled: "LinkedIn sign-in was cancelled. Try again, or use your email below.",
  denied: "LinkedIn did not let us sign you in. Use your email below instead.",
  expired: "That LinkedIn sign-in took too long or was opened in another browser. Try again.",
  no_email: "Your LinkedIn account has no verified email address, so we cannot use it to sign you in. Use your email below.",
  disabled: "This account is disabled. Write to support if you think that is a mistake.",
  unavailable: "LinkedIn sign-in is not available right now. Use your email below.",
  failed: "Something went wrong talking to LinkedIn. Try again, or use your email below.",
};

/** Reason codes the Google callback sends back (app/api/auth/google/callback). */
const GOOGLE_ERRORS: Record<string, string> = {
  cancelled: "Google sign-in was cancelled. Try again, or use your email below.",
  denied: "Google did not let us sign you in. Use your email below instead.",
  expired: "That Google sign-in took too long or was opened in another browser. Try again.",
  no_email: "Your Google account has no verified email address, so we cannot use it to sign you in. Use your email below.",
  disabled: "This account is disabled. Write to support if you think that is a mistake.",
  unavailable: "Google sign-in is not available right now. Use your email below.",
  failed: "Something went wrong talking to Google. Try again, or use your email below.",
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const as = sp.as === "doctor" ? "doctor" : "patient";
  const requested = typeof sp.next === "string" ? sp.next : "/";
  // The doctor tab steers a bare sign-in to the register search; a destination
  // the person already carried (a profile to claim, an enquiry to send) stays.
  const next = as === "doctor" && !isDoctorNext(requested) && requested === "/" ? "/claim-profile" : requested;
  const tabHref = (kind: "patient" | "doctor") => `/sign-in?${new URLSearchParams({ ...(requested !== "/" ? { next: requested } : {}), ...(kind === "doctor" ? { as: "doctor" } : {}) })}`;
  const liError = typeof sp.li === "string" ? LINKEDIN_ERRORS[sp.li] ?? LINKEDIN_ERRORS.failed : typeof sp.g === "string" ? GOOGLE_ERRORS[sp.g] ?? GOOGLE_ERRORS.failed : null;
  const user = await getSessionUser();
  if (user) {
    const dest = next === "/" ? (user.role === "staff" && user.staffRoles.length ? "/admin" : user.role === "doctor" ? "/dashboard" : "/account") : next;
    redirect(user.profileComplete ? dest : `/account/setup?next=${encodeURIComponent(dest)}`);
  }

  return (
    <div className="wrap">
      <div className="signin">
        <span className="eyebrow">The Doctor Index</span>
        <h1 style={{ marginTop: "8px" }}>Sign in or create an account</h1>
        <nav className="acct-tabs" aria-label="I am a">
          <Link href={tabHref("patient")} aria-current={as === "patient" ? "page" : undefined}>I&rsquo;m a patient</Link>
          <Link href={tabHref("doctor")} aria-current={as === "doctor" ? "page" : undefined}>I&rsquo;m a doctor</Link>
        </nav>
        <p style={{ color: "var(--ink-2)", fontSize: "14.5px", marginBottom: "18px" }}>
          {as === "doctor"
            ? "Enter your email or mobile; we send a one-time code. New here? The same step creates your account, then we match your name and registration number against the medical council register before anything goes live. Nothing about you is shown until it is verified."
            : "Enter your email or mobile; we send a one-time code. New here? The same step creates your account, then we ask for your name, contact details and area once. Nothing about you is ever shown publicly."}
        </p>
        {liError ? <div className="notice alert" style={{ marginBottom: "12px" }}>{liError}</div> : null}
        <div className="panel pad">
          <OtpSignIn next={next} linkedin={as === "doctor"} />
        </div>
        <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "16px" }}>
          {as === "doctor" ? (
            <>Already have a profile here? Signing in with the email or mobile it was created with opens your dashboard. Otherwise <Link href={paths.addDoctor()}>create your profile</Link> or <Link href={paths.claimProfile()}>claim one</Link> that exists for your registration.</>
          ) : (
            <>A doctor or healthcare professional? <Link href={tabHref("doctor")}>Sign in as a doctor</Link> — your account is verified against the council register and kept separate from patient accounts.</>
          )}
        </p>
      </div>
    </div>
  );
}
