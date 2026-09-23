import Script from "next/script";

import { ConsentGate } from "@/components/ConsentGate";
import { env } from "@/lib/env";

/**
 * Google Analytics 4 (gtag.js).
 *
 * Rendered only when NEXT_PUBLIC_GA4_MEASUREMENT_ID is set and APP_ENV is
 * "production", so local development and any environment that deliberately
 * unsets the id send nothing. Both tags use next/script's "afterInteractive"
 * strategy: they load after hydration, off the critical path, so the LCP of a
 * profile page is unaffected.
 *
 * Client-side route changes are counted by GA4's own enhanced measurement
 * ("page changes based on browser history events"), which reads the pushState
 * the App Router performs — no manual page_view on navigation is needed here,
 * and adding one would double-count.
 *
 * No profile identifier, search term, enquiry payload or any other field that
 * could describe a patient's interest in a condition is sent to Google. The
 * default gtag config transmits page path, referrer and title only.
 */
/** True when a tag would be served here at all. The footer's "Cookie settings" link keys off this. */
export function analyticsActive(): boolean {
  return Boolean(env.ga4MeasurementId) && env.appEnv === "production";
}

/** True when the tag waits for the visitor's consent (the default). */
export function analyticsConsentGated(): boolean {
  return analyticsActive() && env.consentRequired;
}

export function Analytics() {
  const id = env.ga4MeasurementId;
  if (!analyticsActive()) return null;

  // Default path: nothing loads until the visitor accepts. See ConsentGate.
  if (env.consentRequired) {
    return (
      <ConsentGate
        measurementId={id}
        cookieName={env.consentCookieName}
        version={env.consentVersion}
        privacyHref="/policies/privacy#cookies"
      />
    );
  }

  // NEXT_PUBLIC_CONSENT_REQUIRED=0 — staging only. Loads unconditionally.
  const quotedId = JSON.stringify(id);

  return (
    <>
      <Script
        id="ga4-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {[
          "window.dataLayer = window.dataLayer || [];",
          "function gtag(){dataLayer.push(arguments);}",
          "gtag('js', new Date());",
          `gtag('config', ${quotedId});`,
        ].join("\n")}
      </Script>
    </>
  );
}
