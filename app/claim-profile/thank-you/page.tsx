import type { Metadata } from "next";

import { ConversionThankYou } from "@/components/ConversionThankYou";
import { RouteMeta } from "@/components/RouteMeta";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Claim received",
  description: "Your claim is with a verification officer.",
  robots: { index: false, follow: false },
};

/**
 * Google Ads conversion page for "Doctor profile claimed". ClaimForm navigates
 * here on success; the conversion itself fires once from the sessionStorage
 * stash (lib/conversions.ts), so refreshes and direct visits do not count.
 */
export default async function ClaimThankYouPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const verified = typeof sp.verified === "string" ? sp.verified.slice(0, 80) : "";
  return (
    <>
      <RouteMeta
        data={{
          route: "Authenticated flow",
          title: "Claim received | The Doctor Index",
          canonical: absoluteUrl("/claim-profile/thank-you"),
          index: false,
          structuredData: "None",
          notes: [
            { label: "Purpose", text: "Conversion page for Google Ads (Doctor profile claimed) and the GA4 key event doctor_claim_submitted. Reached only by navigation from a successful claim." },
            { label: "Why noindex, nofollow", text: "Part of the claim flow, which is excluded from crawling entirely (see /claim-profile). Also disallowed in robots.txt by prefix." },
          ],
        }}
      />
      <div className="wrap">
        <div className="flow">
          <span className="eyebrow">For doctors</span>
          <h1 style={{ margin: "10px 0 6px" }}>{verified ? "Verified — the profile is yours" : "Thank you — claim received"}</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "22px", maxWidth: "58ch" }}>
            {verified
              ? `Your ${verified} email address confirmed the claim on the spot — no document, no wait. Your dashboard is open: add a photo, check your practices and switch on bookings when you are ready.`
              : "A verification officer confirms control through the method you chose. Target is 2 business days, and you will be told either way."}
          </p>
          <ConversionThankYou kind="claim" />
        </div>
      </div>
    </>
  );
}
