"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { beacon } from "@/components/ContactActions";
import { trackEvent } from "@/lib/funnel";

/**
 * Every "Rate your visit" link on a profile goes through here, so the click is
 * counted once in GA4 (`review_cta_click`, with the placement) and once in the
 * first-party funnel (`review_started`, per doctor). Which placement actually
 * starts reviews — header, mobile bar, the reviews block or the rail — is the
 * number that decides where the button lives next.
 */
export function ReviewCta({
  href,
  doctorId,
  placement,
  variant = "review",
  className,
  children,
}: {
  href: string;
  doctorId?: string;
  placement: "header" | "mobile_bar" | "reviews_block" | "reviews_head" | "rail" | "practice";
  variant?: "review" | "solid" | "quiet";
  className?: string;
  children?: ReactNode;
}) {
  const cls = variant === "solid" ? "btn solid" : variant === "quiet" ? "btn quiet" : "btn review";
  return (
    <Link
      className={className ? `${cls} ${className}` : cls}
      href={href}
      rel="nofollow"
      onClick={() => {
        trackEvent("review_cta_click", { cta_location: placement });
        beacon("review_started", { doctorId });
      }}
    >
      {children ?? (
        <>
          <StarIcon />
          Rate your visit
        </>
      )}
    </Link>
  );
}

export function StarIcon() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
      <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" fill="currentColor" stroke="none" />
    </svg>
  );
}
