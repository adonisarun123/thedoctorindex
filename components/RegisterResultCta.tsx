"use client";

import Link from "next/link";

import { trackEvent } from "@/lib/funnel";

/** A result's action on /claim-profile/find. Reports which kind of action was taken, never whose record. */
export function RegisterResultCta({ href, kind, label, solid = true }: { href: string; kind: string; label: string; solid?: boolean }) {
  return (
    <Link className={solid ? "btn solid" : "btn quiet"} href={href} onClick={() => trackEvent("register_result_click", { cta_location: kind })}>
      {label}
    </Link>
  );
}
