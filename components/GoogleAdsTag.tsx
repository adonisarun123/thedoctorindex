import { env } from "@/lib/env";

/**
 * Google Ads tag (gtag.js) for AW-18482115489, installed verbatim in the page
 * footer at Arun's request (29 Sep 2026), as raw <script> tags so the loader
 * and config are visible in the server HTML for Google's tag checker.
 *
 * This runs before the cookie banner is answered. Analytics.tsx / ConsentGate
 * no longer send their own `config` for the Ads id, so Ads is configured once.
 * Production only, like GA4.
 */
const INIT = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
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
