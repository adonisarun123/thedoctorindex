import type { Metadata, Viewport } from "next";
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
 * Fonts.
 *
 * We load Newsreader / IBM Plex Sans / IBM Plex Mono over <link> so the build
 * has no network dependency on fonts.googleapis.com. For production, prefer
 * self-hosting via next/font — it removes the third-party request and improves
 * LCP. To switch, uncomment the block below, add the class names to <html>,
 * and delete the two <link> tags in <head>:
 *
 *   import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
 *   const display = Newsreader({ subsets: ["latin"], weight: ["400","500","600"], variable: "--font-newsreader", display: "swap" });
 *   const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-plex-sans", display: "swap" });
 *   const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400","500","600"], variable: "--font-plex-mono", display: "swap" });
 *
 * globals.css already reads --font-newsreader / --font-plex-sans /
 * --font-plex-mono with literal-family fallbacks, so both paths render the
 * same typefaces.
 */

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap";

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
    <html lang="en-IN">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Fonts load without blocking first paint: preload the CSS, attach it
            once fetched, and fall back to the system stack meanwhile
            (display=swap). <noscript> keeps them for script-less clients. */}
        <link rel="preload" as="style" href={FONT_HREF} />
        <script dangerouslySetInnerHTML={{ __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(FONT_HREF)};document.head.appendChild(l);})();` }} />
        <noscript>
          <link rel="stylesheet" href={FONT_HREF} />
        </noscript>
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
              <span className="mono">Data snapshot {SITE.dataSnapshot}</span>
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
