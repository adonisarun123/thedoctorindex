import type { Metadata } from "next";

import { lookupRegistration } from "@/app/add-doctor/actions";
import { AddDoctorFlow } from "@/components/AddDoctorFlow";
import { OtpSignIn } from "@/components/OtpSignIn";
import { RouteMeta } from "@/components/RouteMeta";
import { getSessionUser } from "@/lib/auth/session";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Create your free doctor profile",
  description: "A permanently free, search-visible profile you control. Registration-first submission, verified against the state register.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AddDoctorPage() {
  const user = await getSessionUser();
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
            <AddDoctorFlow lookup={lookupRegistration} />
          ) : (
            <div className="panel pad">
              <div className="eyebrow" style={{ marginBottom: "10px" }}>Sign in first</div>
              <p style={{ fontSize: "14.5px", color: "var(--ink-2)", marginBottom: "16px" }}>
                Your profile is tied to a verified email or mobile number. It is how you get back in to manage it, and it is never shown publicly.
              </p>
              <OtpSignIn next="/add-doctor" label="Continue" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
