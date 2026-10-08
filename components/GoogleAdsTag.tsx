import { env } from "@/lib/env";

/**
 * Google Ads tag (gtag.js) for AW-18482115489, installed verbatim in the page
 * footer at Arun's request (29 Sep 2026), as raw <script> tags so the loader
 * and config are visible in the server HTML for Google's tag checker.
 *
 * This runs before the cookie banner is answered. Analytics.tsx / ConsentGate
 * no longer send their own `config` for the Ads id, so Ads is configured once.
 * Production only, like GA4.
 *
 * Ad personalisation (remarketing audiences) is denied by default, as the
 * privacy policy states: on a health site a remarketing list built from page
 * visits is itself health data. Conversion measurement is unaffected.
 */
const INIT = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', { ad_personalization: 'denied' });
  gtag('js', new Date());

  gtag('config', 'AW-18482115489');
`;

export function GoogleAdsTag() {
  if (env.appEnv !== "production") return null;
  return (
    <>
      {/* Google tag (gtag.js) */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18482115489" />
      <script dangerouslySetInnerHTML={{ __html: INIT }} />
    </>
  );
}
