"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  analyticsCookieDeletions,
  CONSENT_OPEN_EVENT,
  consentCookie,
  readConsent,
  type ConsentChoice,
} from "@/lib/consent";

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void } & Record<string, unknown>;

/**
 * Loads GA4 only after the visitor has said yes.
 *
 * The decision is read from the cookie after hydration, never on the server:
 * /doctors/** and /specialties/** are served with a shared-cache header
 * (middleware.ts), so the HTML must be identical for everyone. Until the
 * choice is read, nothing renders and nothing loads.
 *
 * Declining — first time or later from "Cookie settings" — disables the tag
 * for the rest of the page's life and deletes any _ga cookies it had set.
 * Advertising storage follows the same single choice only when a Google Ads
 * tag is configured (adsId): that is conversion measurement for the site's own
 * doctor-acquisition ads — which ad brought a doctor who then claimed a
 * profile. ad_personalization is denied unconditionally: no remarketing lists
 * are built from visitors of a health directory. With no adsId, all ad
 * storage stays denied and the banner asks about analytics only.
 */
export function ConsentGate({
  measurementId,
  adsId = "",
  cookieName,
  version,
  privacyHref,
}: {
  measurementId: string;
  adsId?: string;
  cookieName: string;
  version: string;
  privacyHref: string;
}) {
  // undefined = cookie not yet read (SSR and first paint); null = no decision.
  const [choice, setChoice] = useState<ConsentChoice | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusOnOpen = useRef(false);

  useEffect(() => {
    const current = readConsent(document.cookie, cookieName, version);
    setChoice(current);
    setOpen(current === null);
    const reopen = () => {
      focusOnOpen.current = true;
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, [cookieName, version]);

  useEffect(() => {
    if (open && focusOnOpen.current) {
      focusOnOpen.current = false;
      headingRef.current?.focus();
    }
  }, [open]);

  const decide = useCallback(
    (next: ConsentChoice) => {
      const w = window as unknown as GtagWindow;
      document.cookie = consentCookie(cookieName, version, next, window.location.protocol === "https:");
      w[`ga-disable-${measurementId}`] = next === "denied";
      if (typeof w.gtag === "function") {
        w.gtag("consent", "update", adsId ? { analytics_storage: next, ad_storage: next, ad_user_data: next } : { analytics_storage: next });
      }
      if (next === "denied") {
        for (const c of analyticsCookieDeletions(document.cookie, window.location.hostname)) {
          document.cookie = c;
        }
      }
      setChoice(next);
      setOpen(false);
    },
    [cookieName, version, measurementId, adsId],
  );

  const quotedId = JSON.stringify(measurementId);

  return (
    <>
      {choice === "granted" ? (
        <>
          <Script id="ga4-init" strategy="afterInteractive">
            {[
              "window.dataLayer = window.dataLayer || [];",
              "function gtag(){dataLayer.push(arguments);}",
              "window.gtag = gtag;",
              adsId
                ? "gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied' });"
                : "gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });",
              "gtag('js', new Date());",
              `gtag('config', ${quotedId});`,
              ...(adsId ? [`gtag('config', ${JSON.stringify(adsId)});`] : []),
            ].join("\n")}
          </Script>
          <Script
            id="ga4-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
            strategy="afterInteractive"
          />
        </>
      ) : null}

      {open ? (
        <section className="consent" role="region" aria-labelledby="consent-h">
          <div className="consent-in">
            <h2 id="consent-h" ref={headingRef} tabIndex={-1}>
              {adsId ? "Analytics and ad measurement cookies" : "Analytics cookies"}
            </h2>
            <p>
              We would like to use Google Analytics to count visits and see which pages help people
              find a doctor
              {adsId ? ", and Google Ads to measure which of our own adverts bring doctors to list their practice" : ""}
              . {adsId ? "Both set" : "It sets"} cookies on your device. Which doctors you look at and what you
              search for are not sent{adsId ? ", and we never use your visit to show you adverts elsewhere" : ""}. You can change your mind any time from{" "}
              <em>Cookie settings</em> at the foot of every page.{" "}
              <a href={privacyHref}>Privacy policy</a>
            </p>
            <div className="consent-acts">
              <button type="button" className="btn solid" onClick={() => decide("granted")}>
                {adsId ? "Allow" : "Allow analytics"}
              </button>
              <button type="button" className="btn solid" onClick={() => decide("denied")}>
                Decline
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

/** Footer link that reopens the banner, so withdrawing is as easy as consenting. */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="linkbtn"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
    >
      Cookie settings
    </button>
  );
}
