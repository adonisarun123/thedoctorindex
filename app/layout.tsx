import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import "./globals.css";
import { HeaderSearch } from "@/components/HeaderSearch";
import { RouteInspector } from "@/components/RouteInspector";
import { SPECIALTIES, SPECIALTY_KEYS, CITY } from "@/lib/data/taxonomy";
import { SITE, absoluteUrl, paths } from "@/lib/site";
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
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap";

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
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONT_HREF} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationLd(), webSiteLd()]) }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <div className="demo">
          <div className="wrap">
            <b>Seed data</b>
            <span>
              Every doctor, registration number, practice and review in this build is fictional
              demo data. No real practitioner is represented.
            </span>
          </div>
        </div>

        <header className="site">
          <div className="wrap hrow">
            <Link className="brand" href={paths.home()}>
              <span className="mark">{SITE.name}</span>
              <span className="tag">India</span>
            </Link>
            <Suspense fallback={<div className="hsearch" aria-hidden="true" />}>
              <HeaderSearch />
            </Suspense>
            <nav className="hnav">
              <Link className="plain" href={paths.policy("verification")}>
                How verification works
              </Link>
              <Link className="cta" href={paths.addDoctor()}>
                For doctors
              </Link>
            </nav>
          </div>
        </header>

        <main id="main">{children}</main>

        <footer className="site">
          <div className="wrap">
            <div className="fgrid">
              <div>
                <h5>{SITE.name}</h5>
                <p style={{ fontSize: "13.5px", color: "var(--muted)", maxWidth: "34ch" }}>
                  A free, verified directory of practising doctors in India. Basic profiles are
                  permanently free. Organic ranking is never for sale.
                </p>
              </div>
              <div>
                <h5>Trust</h5>
                <ul>
                  <li><Link href={paths.policy("verification")}>Verification methodology</Link></li>
                  <li><Link href={paths.policy("ranking")}>Ranking &amp; sorting</Link></li>
                  <li><Link href={paths.policy("reviews")}>Review policy</Link></li>
                  <li><Link href={paths.policy("corrections")}>Corrections &amp; takedowns</Link></li>
                </ul>
              </div>
              <div>
                <h5>For doctors</h5>
                <ul>
                  <li><Link href={paths.addDoctor()}>Add your profile</Link></li>
                  <li><Link href={paths.claimProfile()}>Claim an existing profile</Link></li>
                </ul>
              </div>
              <div>
                <h5>Browse</h5>
                <ul>
                  {SPECIALTY_KEYS.map((k) => (
                    <li key={k}>
                      <Link
                        href={paths.citySpecialty(CITY.stateSlug, CITY.slug, SPECIALTIES[k].slug)}
                      >
                        {SPECIALTIES[k].plural}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="fnote">
              <span>
                Bengaluru launch cluster, 4 specialities. Front-end application; the verification
                and moderation back office is not part of this repository.
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
