import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { Suspense } from "react";

import "./globals.css";
import { RouteInspector } from "@/components/RouteInspector";
import { SiteHeader } from "@/components/SiteHeader";
import { THEME_BOOT_SCRIPT } from "@/components/ThemeToggle";
import { activeSourceName } from "@/lib/data";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { env } from "@/lib/env";
import { SITE, absoluteUrl, paths, HOME_CITY } from "@/lib/site";
import { organizationLd, webSiteLd } from "@/lib/seo/structured-data";

/*
 * Fonts are self-hosted: the four woff2 files in app/fonts/ (IBM Plex Sans
 * variable, IBM Plex Mono 400/500, Newsreader variable — all SIL OFL) are
 * served from this origin by next/font/local with size-adjusted fallbacks,
 * so there is no request to fonts.googleapis.com / fonts.gstatic.com, no
 * third-party resource for a crawler to fail on, and no layout shift while
 * the font loads. globals.css reads the CSS variables set on <html>.
 */
const display = localFont({
  src: [{ path: "./fonts/newsreader-var.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-newsreader",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
const sans = localFont({
  src: [{ path: "./fonts/ibm-plex-sans-var.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-plex-sans",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});
const mono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-mono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f5f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1211" },
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
    <html lang="en-IN" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
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

        <footer className="site">
          <div className="wrap">
            <div className="fgrid">
              <div>
                <p className="fh">{SITE.name}</p>
                <p style={{ fontSize: "13.5px", color: "var(--muted)", maxWidth: "34ch" }}>
                  A free, verified directory of practising doctors in India. Basic profiles are
                  permanently free. Organic ranking is never for sale.
                </p>
                <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "12px" }}>
                  Grievance officer:{" "}
                  <a href={`mailto:${SITE.grievanceEmail}`}>{SITE.grievanceEmail}</a>
                  <br />
                  <Link href={paths.policy("grievance")}>Grievance process and timelines</Link>
                </p>
              </div>
              <div>
                <p className="fh">Trust</p>
                <ul>
                  <li><Link href="/about">About and ownership</Link></li>
                  <li><Link href={paths.policy("verification")}>Verification methodology</Link></li>
                  <li><Link href={paths.policy("ranking")}>Ranking &amp; sorting</Link></li>
                  <li><Link href={paths.policy("reviews")}>Review policy</Link></li>
                  <li><Link href={paths.policy("editorial")}>Editorial &amp; medical review</Link></li>
                  <li><Link href={paths.policy("corrections")}>Corrections &amp; takedowns</Link></li>
                  <li><Link href={paths.policy("advertising")}>Advertising &amp; sponsorship</Link></li>
                </ul>
              </div>
              <div>
                <p className="fh">For doctors</p>
                <ul>
                  <li><Link href={paths.addDoctor()}>Add your profile</Link></li>
                  <li><Link href={paths.claimProfile()}>Claim an existing profile</Link></li>
                  <li><Link href="/dashboard">Doctor dashboard</Link></li>
                </ul>
                <p className="fh" style={{ marginTop: "18px" }}>Legal</p>
                <ul>
                  <li><Link href={paths.policy("privacy")}>Privacy</Link></li>
                  <li><Link href={paths.policy("terms")}>Terms of use</Link></li>
                </ul>
              </div>
              <div>
                <p className="fh">Browse</p>
                <ul>
                  <li><Link href="/doctors">All locations</Link></li>
                  <li><Link href="/specialties">All specialities</Link></li>
                  <li><Link href="/health-guides">Health guides</Link></li>
                  {SPECIALTY_KEYS.filter((k) => SPECIALTIES[k].guide).map((k) => (
                    <li key={k}>
                      <Link
                        href={paths.citySpecialty(HOME_CITY.stateSlug, HOME_CITY.slug, SPECIALTIES[k].slug)}
                      >
                        {SPECIALTIES[k].plural} in {HOME_CITY.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="fnote">
              <span>
                Not for emergencies. If someone is in immediate danger, call {SITE.emergencyNumber}.
                Information on this site is a directory, not medical advice.
              </span>
            </div>
          </div>
        </footer>

        <Suspense fallback={null}>
          <RouteInspector />
        </Suspense>
      </body>
    </html>
  );
}
