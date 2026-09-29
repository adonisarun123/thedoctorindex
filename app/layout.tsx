import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";

import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { FunnelTracker } from "@/components/FunnelTracker";
import { RouteInspector } from "@/components/RouteInspector";
import { GoogleAdsTag } from "@/components/GoogleAdsTag";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { THEME_BOOT_SCRIPT } from "@/components/ThemeToggle";
import { activeSourceName } from "@/lib/data";
import { env } from "@/lib/env";
import { SITE, absoluteUrl } from "@/lib/site";
import { organizationLd, webSiteLd } from "@/lib/seo/structured-data";

/*
 * Fonts are self-hosted: two woff2 files in app/fonts/ (Atkinson Hyperlegible
 * Next variable and Newsreader variable — both SIL OFL) are served from this
 * origin by next/font/local with size-adjusted fallbacks, so there is no
 * request to fonts.googleapis.com / fonts.gstatic.com, no third-party
 * resource for a crawler to fail on, and no layout shift while the font
 * loads. globals.css reads the CSS variables set on <html>.
 *
 * Atkinson Hyperlegible Next (Braille Institute) is drawn for low-vision
 * readers: open counters, and I/l/1 and O/0 that cannot be confused — which
 * is also why registration numbers and IDs no longer need a monospace face.
 * The readership includes many older patients; do not swap it for a
 * geometric or monospace UI face without testing with them.
 */
const display = localFont({
  src: [{ path: "./fonts/newsreader-var.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-newsreader",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
const sans = localFont({
  src: [{ path: "./fonts/atkinson-hyperlegible-next-var.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f6f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a111d" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_IN",
    url: absoluteUrl("/"),
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    ...(SITE.twitterHandle ? { site: SITE.twitterHandle, creator: SITE.twitterHandle } : {}),
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: {
    ...(env.googleSiteVerification ? { google: env.googleSiteVerification } : {}),
    ...(env.bingSiteVerification ? { other: { "msvalidate.01": env.bingSiteVerification } } : {}),
  },
  category: "health",
  referrer: "strict-origin-when-cross-origin",
};

const showDemoBanner = env.demoBanner ?? activeSourceName() === "seed";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationLd(), webSiteLd()]) }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        {showDemoBanner ? (
          <div className="demo">
            <div className="wrap">
              <b>Seed data</b>
              <span>Fictional demo records throughout. No real practitioner is represented.</span>
            </div>
          </div>
        ) : null}

        <SiteHeader />

        <main id="main">{children}</main>

        <SiteFooter />
        <GoogleAdsTag />

        <Suspense fallback={null}>
          <RouteInspector />
        </Suspense>

        <Analytics />
        <FunnelTracker />
      </body>
    </html>
  );
}
