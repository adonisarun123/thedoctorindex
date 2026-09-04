import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { absoluteUrl, paths } from "@/lib/site";

export const metadata: Metadata = {
  title: "For doctors — a free, verified profile you control",
  description: "Sign in to your dashboard, create a registration-first profile, or claim one that already exists. Basic profiles are permanently free; ranking is never for sale.",
  alternates: { canonical: absoluteUrl(paths.forDoctors()) },
};

export default function ForDoctorsPage() {
  const dashboard = paths.signIn("/dashboard");
  return (
    <>
      <RouteMeta data={{ route: "For doctors (landing)", title: String(metadata.title), canonical: absoluteUrl(paths.forDoctors()), index: true, structuredData: "BreadcrumbList" }} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: paths.home() }, { name: "For doctors" }])} />
      <div className="wrap" style={{ paddingTop: "34px", paddingBottom: "50px" }}>
        <span className="eyebrow">For doctors</span>
        <h1 style={{ marginTop: "8px", maxWidth: "22ch" }}>A free profile you control. Nothing to pay, ever, to be found.</h1>
        <p style={{ color: "var(--ink-2)", fontSize: "16px", maxWidth: "62ch" }}>
          Registration-first, verified against the state register, with your practice details kept current on your terms. We do not sell rankings, leads or appointment slots. We do promise the basic profile stays free.
        </p>

        <div className="tiles" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginTop: "26px" }}>
          <div className="tile" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="l">Already have a profile?</div>
            <h3 style={{ margin: 0 }}>Sign in to your dashboard</h3>
            <p style={{ fontSize: "13.5px", color: "var(--ink-2)", margin: 0, flex: 1 }}>One-time code to the email or mobile you registered with. Edit practices, hours and fees, reply to reviews, invite a clinic manager, see enquiries and analytics.</p>
            <Link className="btn solid" href={dashboard}>Sign in</Link>
          </div>
          <div className="tile" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="l">Not listed yet?</div>
            <h3 style={{ margin: 0 }}>Create your profile</h3>
            <p style={{ fontSize: "13.5px", color: "var(--ink-2)", margin: 0, flex: 1 }}>Starts with your council and registration number so nobody can create a page in your name. A verification officer matches it in the register within two business days.</p>
            <Link className="btn" href={paths.addDoctor()}>Add your profile</Link>
          </div>
          <div className="tile" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="l">Found yourself already listed?</div>
            <h3 style={{ margin: 0 }}>Claim the existing profile</h3>
            <p style={{ fontSize: "13.5px", color: "var(--ink-2)", margin: 0, flex: 1 }}>Some profiles are compiled from permitted public sources. Prove control — an OTP to the practice number on file, a hospital email, or a document — and it is yours.</p>
            <Link className="btn" href={paths.claimProfile()}>Claim a profile</Link>
          </div>
        </div>

        <div className="two" style={{ marginTop: "40px", gridTemplateColumns: "1.2fr 1fr", gap: "28px", alignItems: "start" }}>
          <div>
            <h2 style={{ marginTop: 0 }}>What you can do once signed in</h2>
            <dl className="kvi" style={{ fontSize: "14px" }}>
              <dt>Practices</dt><dd>Add or remove locations, update days, hours and fees, and reconfirm each practice — the reconfirmation date is shown to patients.</dd>
              <dt>Profile</dt><dd>Introduction, languages, consultation modes and services from the controlled list. Name, speciality and gender changes are re-verified before they go live.</dd>
              <dt>Reviews</dt><dd>Reply once to any published review. Replies are checked so no health detail about the reviewer is revealed. Dispute a review you believe breaches policy.</dd>
              <dt>Team</dt><dd>Invite a clinic manager with a scope limited to specific practices. Sensitive fields stay with you.</dd>
              <dt>Enquiries and analytics</dt><dd>Appointment enquiries forwarded to your practice, plus views, calls and directions over the last 28 days.</dd>
            </dl>
          </div>
          <div className="panel pad">
            <h3 style={{ marginTop: 0 }}>What we will not do</h3>
            <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--ink-2)", lineHeight: 1.6 }}>
              <li>Charge for the basic profile or for verification.</li>
              <li>Sell position in organic results.</li>
              <li>Import ratings from other platforms.</li>
              <li>Remove a policy-compliant negative review for payment.</li>
              <li>Show your personal contact details; only the practice phone you consent to.</li>
            </ul>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: 0 }}>
              Read the <Link href={paths.policy("ranking")}>ranking policy</Link> and <Link href={paths.policy("reviews")}>review policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
