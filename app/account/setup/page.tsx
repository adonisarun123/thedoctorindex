import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { ProfileDetailsForm } from "@/components/ProfileDetailsForm";
import { RouteMeta } from "@/components/RouteMeta";
import { getSessionUser } from "@/lib/auth/session";
import { userPlace } from "@/lib/data/geo";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Complete your details", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/**
 * First-run registration. Reached from requireUser() whenever an account
 * has not yet given its details; returns to `next` when done. Not behind
 * requireUser itself, or it would loop.
 */
export default async function AccountSetup({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" && sp.next.startsWith("/") && !sp.next.startsWith("//") ? sp.next : "/account";
  if (!process.env.DATABASE_URL) redirect("/sign-in");
  const user = await getSessionUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(`/account/setup?next=${encodeURIComponent(next)}`)}`);
  if (user.profileComplete) redirect(next);
  const [row] = await getDb().select({ city: s.users.city, marketingOptIn: s.users.marketingOptIn }).from(s.users).where(eq(s.users.id, user.id)).limit(1);

  const why = next.includes("/enquire") ? "An enquiry is sent to a practice with your name and mobile number, so we need them first." : next.includes("/review") ? "Reviews are tied to a real, contactable person (published under a pseudonym), so we need your details first." : next.startsWith("/dashboard") || next.includes("add-doctor") || next.includes("claim") ? "A doctor's account is a real identity we may need to reach." : "Before you can enquire, review or manage a profile we need to know who you are.";

  return (
    <>
      <RouteMeta data={{ route: "Account setup (authenticated)", title: "Complete your details", canonical: absoluteUrl("/account/setup"), index: false, structuredData: "None" }} />
      <div className="wrap">
        <div className="signin" style={{ maxWidth: "640px" }}>
          <span className="eyebrow">Create your account · step 2 of 2</span>
          <h1 style={{ marginTop: "8px" }}>Complete your details</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "14.5px", marginBottom: "18px" }}>
            {why} Signed in as <span className="mono">{user.email ?? user.phone}</span>. One account works for patients and doctors.
          </p>
          <ProfileDetailsForm user={{ ...user, city: row?.city ?? null, ...(await userPlace(user.localityKey, row?.city ?? null)), marketingOptIn: row?.marketingOptIn ?? false }} next={next} />
          <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "14px" }}>
            Your name and contact details are never shown on the public site. They are shared only with a practice you choose to enquire with, and used to tell you the outcome of anything you submit.
          </p>
        </div>
      </div>
    </>
  );
}
