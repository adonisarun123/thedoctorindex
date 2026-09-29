import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { ClaimForm } from "@/components/ClaimForm";
import { FunnelStep } from "@/components/FunnelStep";
import { OtpSignIn } from "@/components/OtpSignIn";
import { RouteMeta } from "@/components/RouteMeta";
import { getSessionUser, setupPath } from "@/lib/auth/session";
import { getDoctorBySlug } from "@/lib/data";
import { SPECIALTIES } from "@/lib/data/specialties";
import { registrationState } from "@/lib/verification";
import { absoluteUrl } from "@/lib/site";
import { displayName } from "@/lib/display-name";
import { claimSource } from "@/lib/claim-source";
import { track } from "@/lib/services/events";

export const metadata: Metadata = {
  title: "Claim your doctor profile",
  description: "Claiming is free. It gives you control of the editable fields, the right to reply to reviews, and access to how patients are finding you.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function ClaimProfilePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const initial = typeof sp.registration === "string" ? sp.registration : "";
  const profileSlug = typeof sp.profile === "string" ? sp.profile : "";
  const src = claimSource(sp.src);
  const doctor = profileSlug ? await getDoctorBySlug(profileSlug) : null;
  const profile = doctor && !doctor.claimed
    ? {
        slug: doctor.slug,
        name: displayName(doctor),
        specialty: SPECIALTIES[doctor.specialty]?.name ?? "",
        hasRegistration: registrationState(doctor) !== "none",
        council:
          registrationState(doctor) !== "none" && !/^(council not stated|—)$/i.test(doctor.registration.council)
            ? doctor.registration.council
            : "",
      }
    : null;
  const nextQuery = profile ? `?profile=${encodeURIComponent(profile.slug)}${src ? `&src=${src}` : ""}` : initial ? `?registration=${encodeURIComponent(initial)}` : "";
  const user = await getSessionUser();
  if (user && !user.profileComplete) redirect(setupPath(`/claim-profile${nextQuery}`));
  // Count the open once per visit that arrives with a tag; untagged opens are the
  // site's own buttons and are already counted as profile views.
  if (src && doctor?.dbId && !user) await track("claim_link_opened", { doctorId: doctor.dbId, query: `src:${src}`, path: "/claim-profile" });
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
          <FunnelStep event="claim_page_view" params={{ step: user ? "form" : "sign_in", has_profile: Boolean(profile), src }} />
          {user ? (
            <ClaimForm initialRegistration={initial} profile={profile} source={src} />
          ) : (
            <div className="panel pad">
              <div className="eyebrow" style={{ marginBottom: "10px" }}>Sign in first</div>
              <OtpSignIn next={`/claim-profile${nextQuery}`} label="Continue" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
