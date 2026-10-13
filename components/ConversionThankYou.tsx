"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { takeStashedConversion, type ConversionName, type StashedConversion } from "@/lib/conversions";

/**
 * Body of a /thank-you page. On mount it takes the stashed conversion (fires
 * Google Ads + GA4 once, see lib/conversions.ts) and renders copy from the
 * stash. With no stash — refresh, back button, direct hit — it shows the
 * generic copy and records nothing.
 *
 * Copy lives here (not in the server page) because a server component cannot
 * hand a render function to a client component.
 */
const COPY: Record<"claim" | "profile", { expect: ConversionName; got: (c: StashedConversion) => React.ReactNode; none: React.ReactNode }> = {
  claim: {
    expect: "doctor_claim_submitted",
    got: (c) => (
      <>
        <b>Claim received{c.display?.doctorName ? ` for ${c.display.doctorName}` : ""}.</b> If someone else has already claimed this profile we will not show you their details, and we will not transfer control without evidence from both sides.
      </>
    ),
    none: (
      <>
        <b>Your claim is on file.</b> Any claim you have submitted is listed on your dashboard with its current status.
      </>
    ),
  },
  profile: {
    expect: "doctor_profile_submitted",
    got: (c) => (
      <>
        <b>Submitted for verification.</b>
        {c.display?.reference ? <> Reference <span className="mono">{c.display.reference}</span>.</> : null}
      </>
    ),
    none: (
      <>
        <b>Your submission is on file.</b> Any profile you have submitted is listed on your dashboard with its current status.
      </>
    ),
  },
};

export function ConversionThankYou({ kind }: { kind: "claim" | "profile" }) {
  const [c, setC] = useState<StashedConversion | null | undefined>(undefined);
  useEffect(() => {
    const got = takeStashedConversion();
    setC(got && got.name === COPY[kind].expect ? got : null);
  }, [kind]);
  if (c === undefined) return <div className="panel pad" aria-busy="true" style={{ minHeight: "120px" }} />;
  return (
    <div className="panel pad">
      <div className="notice good" style={{ marginBottom: "16px" }}>{c ? COPY[kind].got(c) : COPY[kind].none}</div>
      <Link className="btn quiet" href="/dashboard">Go to your dashboard</Link>
    </div>
  );
}
