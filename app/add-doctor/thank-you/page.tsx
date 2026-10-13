import type { Metadata } from "next";

import { ConversionThankYou } from "@/components/ConversionThankYou";
import { RouteMeta } from "@/components/RouteMeta";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Profile submitted",
  description: "Your profile is with a verification officer.",
  robots: { index: false, follow: false },
};

/**
 * Google Ads conversion page for "Doctor profile created". AddDoctorFlow
 * navigates here on success; the conversion fires once from the
 * sessionStorage stash (lib/conversions.ts), so refreshes and direct visits
 * do not count.
 */
export default function AddDoctorThankYouPage() {
  return (
    <>
      <RouteMeta
        data={{
          route: "Authenticated flow",
          title: "Profile submitted | The Doctor Index",
          canonical: absoluteUrl("/add-doctor/thank-you"),
          index: false,
          structuredData: "None",
          notes: [
            { label: "Purpose", text: "Conversion page for Google Ads (Doctor profile created) and the GA4 key event doctor_profile_submitted. Reached only by navigation from a successful submission." },
            { label: "Why noindex, nofollow", text: "Part of the add-doctor flow, which is excluded from crawling entirely (see /add-doctor). Also disallowed in robots.txt by prefix." },
          ],
        }}
      />
      <div className="wrap">
        <div className="flow">
          <span className="eyebrow">For doctors</span>
          <h1 style={{ margin: "10px 0 6px" }}>Thank you — profile submitted</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "22px", maxWidth: "58ch" }}>
            A verification officer matches your council and registration number against the register, then reviews the rest. Target is 2 business days. Your page stays private until it passes, and you will be told either way.
          </p>
          <ConversionThankYou kind="profile" />
        </div>
      </div>
    </>
  );
}
