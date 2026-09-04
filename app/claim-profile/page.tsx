import type { Metadata } from "next";

import { ClaimForm } from "@/components/ClaimForm";
import { OtpSignIn } from "@/components/OtpSignIn";
import { RouteMeta } from "@/components/RouteMeta";
import { getSessionUser } from "@/lib/auth/session";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Claim your doctor profile",
  description: "Claiming is free. It gives you control of the editable fields, the right to reply to reviews, and access to how patients are finding you.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function ClaimProfilePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const initial = typeof sp.registration === "string" ? sp.registration : "";
  const user = await getSessionUser();
  return (
    <>
      <RouteMeta
        data={{
          route: "Authenticated flow",
          title: "Claim your doctor profile | The Doctor Index",
          canonical: absoluteUrl("/claim-profile"),
          index: false,
          structuredData: "None",
          notes: [{ label: "Why noindex, nofollow", text: "Claim flows are excluded from crawling entirely. A claim page in the index would be an invitation to impersonation attempts from search." }],
        }}
      />
      <div className="wrap">
        <div className="flow">
          <span className="eyebrow">For doctors</span>
          <h1 style={{ margin: "10px 0 6px" }}>Claim your profile</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "22px", maxWidth: "58ch" }}>
            Claiming is free and gives you control of the editable fields, the right to reply to reviews, and access to how patients are finding you.
          </p>
          {user ? (
            <ClaimForm initialRegistration={initial} />
          ) : (
            <div className="panel pad">
              <div className="eyebrow" style={{ marginBottom: "10px" }}>Sign in first</div>
              <OtpSignIn next={`/claim-profile${initial ? `?registration=${encodeURIComponent(initial)}` : ""}`} label="Continue" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
