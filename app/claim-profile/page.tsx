import type { Metadata } from "next";

import { DemoAction } from "@/components/DemoAction";
import { RouteMeta } from "@/components/RouteMeta";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Claim your doctor profile",
  description:
    "Claiming is free. It gives you control of the editable fields, the right to reply to reviews, and access to how patients are finding you.",
  robots: { index: false, follow: false },
};

export default function ClaimProfilePage() {
  return (
    <>
      <RouteMeta
        data={{
          route: "Authenticated flow",
          title: "Claim your doctor profile | The Doctor Index",
          canonical: absoluteUrl("/claim-profile"),
          index: false,
          structuredData: "None",
          notes: [
            {
              label: "Why noindex, nofollow",
              text: "Claim flows are excluded from crawling entirely. A claim page in the index would be an invitation to impersonation attempts from search.",
            },
          ],
        }}
      />
      <div className="wrap">
        <div className="flow">
          <span className="eyebrow">For doctors</span>
          <h1 style={{ margin: "10px 0 6px" }}>Claim your profile</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "22px", maxWidth: "58ch" }}>
            Claiming is free and gives you control of the editable fields, the right to reply to
            reviews, and access to how patients are finding you.
          </p>

          <div className="panel pad">
            <div className="field">
              <label htmlFor="reg">Registration number and council</label>
              <input id="reg" type="text" placeholder="KMC-58412" />
            </div>

            <div className="field">
              <label>How should we confirm you control this profile?</label>
              {[
                "One-time password to the practice number already on file",
                "Email at your hospital or clinic domain",
                "Confirmation from the practice administrator",
                "Upload supporting evidence for manual review",
              ].map((label, i) => (
                <label className="fopt" style={{ padding: "5px 0" }} key={label}>
                  <input type="radio" name="method" defaultChecked={i === 0} />
                  {label}
                </label>
              ))}
            </div>

            <div className="notice" style={{ margin: "18px 0" }}>
              <b>Competing claims go to a person, not an algorithm.</b> If someone else has already
              claimed this profile we will not show you their contact details, and we will not
              transfer control without evidence from both sides.
            </div>

            <DemoAction
              label="Start verification"
              variant="solid"
              explains="Sends a one-time password to the practice number on file. A verification officer reviews within 2 business days."
            />

            <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "14px" }}>
              After claiming you can add practice locations, revoke clinic-manager access at any time,
              and request correction of any field. Changes to name, registration, qualification or
              speciality return to verification before they go public.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
