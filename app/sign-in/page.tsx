import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { OtpSignIn } from "@/components/OtpSignIn";
import { getSessionUser } from "@/lib/auth/session";
import { paths } from "@/lib/site";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function SignInPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/";
  const user = await getSessionUser();
  if (user) redirect(next === "/" ? (user.role === "staff" && user.staffRoles.length ? "/admin" : user.role === "doctor" ? "/dashboard" : "/account") : next);

  return (
    <div className="wrap">
      <div className="signin">
        <span className="eyebrow">The Doctor Index</span>
        <h1 style={{ marginTop: "8px" }}>Sign in</h1>
        <p style={{ color: "var(--ink-2)", fontSize: "14.5px", marginBottom: "18px" }}>
          One account for patients and doctors. Your contact details are never shown on the site.
        </p>
        <div className="panel pad">
          <OtpSignIn next={next} />
        </div>
        <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "16px" }}>
          Doctors sign in the same way and land on their dashboard. New here? <Link href={paths.addDoctor()}>Create your profile</Link> or{" "}
          <Link href={paths.claimProfile()}>claim one</Link> that already exists for your registration.
        </p>
      </div>
    </div>
  );
}
