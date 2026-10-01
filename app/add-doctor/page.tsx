import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { lookupRegistration } from "@/app/add-doctor/actions";
import { AddDoctorFlow } from "@/components/AddDoctorFlow";
import { OtpSignIn } from "@/components/OtpSignIn";
import { FunnelStep } from "@/components/FunnelStep";
import { RouteMeta } from "@/components/RouteMeta";
import { getSessionUser, setupPath } from "@/lib/auth/session";
import { absoluteUrl } from "@/lib/site";
import { claimSource } from "@/lib/claim-source";

export const metadata: Metadata = {
  title: "Create your free doctor profile",
  description: "A permanently free, search-visible profile you control. Registration-first submission, verified against the state register.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AddDoctorPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // The channel tag rides along through sign-in and account setup, so a profile
  // created from an ad is counted against that ad (events.query = src:<tag>).
  const sp = await searchParams;
  const src = claimSource(sp.src);
  const initialRegistration = typeof sp.registration === "string" ? sp.registration.slice(0, 40) : "";
  const initialCouncil = typeof sp.council === "string" ? sp.council.slice(0, 120) : "";
  const keep = new URLSearchParams();
  if (initialRegistration) keep.set("registration", initialRegistration);
  if (initialCouncil) keep.set("council", initialCouncil);
  if (src) keep.set("src", src);
  const self = keep.toString() ? `/add-doctor?${keep.toString()}` : "/add-doctor";
  const user = await getSessionUser();
  if (user && !user.profileComplete) redirect(setupPath(self));
  return (
    <>
      <RouteMeta
        data={{
          route: "Authenticated flow",
          title: "Create your free doctor profile | The Doctor Index",
          canonical: absoluteUrl("/add-doctor"),
          index: false,
          structuredData: "None",
          notes: [{ label: "Why noindex, nofollow", text: "Claim and submission flows are excluded from crawling entirely, along with the doctor dashboard and the admin console." }],
        }}
      />
      <div className="wrap">
        <div className="flow">
          <span className="eyebrow">For doctors</span>
          <h1 style={{ margin: "10px 0 6px" }}>Create your free profile</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "22px", maxWidth: "58ch" }}>
            A permanently free, search-visible profile you control. We do not promise rankings, leads or appointments — no directory can.
          </p>
          {!process.env.DATABASE_URL ? (
            <div className="notice" style={{ marginBottom: "16px" }}><b>Read-only build.</b> No database is configured, so submissions cannot be saved here.</div>
          ) : null}
          {user ? (
            <AddDoctorFlow lookup={lookupRegistration} source={src} initialRegistration={initialRegistration} initialCouncil={initialCouncil} />
          ) : (
            <div className="panel pad">
              <FunnelStep event="add_profile_page_view" params={{ step: "sign_in", src }} />
              <div className="eyebrow" style={{ marginBottom: "10px" }}>Sign in first</div>
              <p style={{ fontSize: "14.5px", color: "var(--ink-2)", marginBottom: "16px" }}>
                Your profile is tied to a verified email or mobile number. It is how you get back in to manage it, and it is never shown publicly.
              </p>
              <OtpSignIn next={self} label="Continue" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
