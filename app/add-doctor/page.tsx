import type { Metadata } from "next";

import { lookupRegistration } from "@/app/add-doctor/actions";
import { AddDoctorFlow } from "@/components/AddDoctorFlow";
import { RouteMeta } from "@/components/RouteMeta";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Create your free doctor profile",
  description:
    "A permanently free, search-visible profile you control. Registration-first submission, verified against the state register.",
  // Submission and claim flows are excluded from crawling entirely, along with
  // the dashboard, the admin console and internal search results.
  robots: { index: false, follow: false },
};

export default function AddDoctorPage() {
  return (
    <>
      <RouteMeta
        data={{
          route: "Authenticated flow",
          title: "Create your free doctor profile | The Doctor Index",
          canonical: absoluteUrl("/add-doctor"),
          index: false,
          structuredData: "None",
          notes: [
            {
              label: "Why noindex, nofollow",
              text: "Claim and submission flows are excluded from crawling entirely, along with the doctor dashboard and the admin console. Nothing behind authentication belongs in the index.",
            },
          ],
        }}
      />
      <div className="wrap">
        <div className="flow">
          <span className="eyebrow">For doctors</span>
          <h1 style={{ margin: "10px 0 6px" }}>Create your free profile</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "22px", maxWidth: "58ch" }}>
            A permanently free, search-visible profile you control. We do not promise rankings, leads
            or appointments — no directory can.
          </p>
          <AddDoctorFlow lookup={lookupRegistration} />
        </div>
      </div>
    </>
  );
}
