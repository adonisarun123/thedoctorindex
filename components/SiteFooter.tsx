import Link from "next/link";

import { analyticsConsentGated } from "@/components/Analytics";
import { CookieSettingsButton } from "@/components/ConsentGate";
import { Logo } from "@/components/Logo";
import { countsByCity, countsBySpecialty } from "@/lib/data";
import { getGeo } from "@/lib/data/geo";
import { SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { isMetroCity } from "@/lib/geo-names";
import { SITE, paths } from "@/lib/site";
import type { SpecialtyKey } from "@/lib/types";

/** How many cities and specialities the footer lists. Everything else is one click away on the index pages. */
const CITIES_SHOWN = 8;
const SPECIALTIES_SHOWN = 8;

/*
 * The footer used to list "<speciality> in Bengaluru" for every speciality
 * with written guidance. Once all 49 had guidance that became a 49-link
 * column, 1,600px tall, pointing at a fixed home city where many of those
 * pages held nobody — two of them 404. Now it links what the database
 * actually holds: the busiest cities and the best-supplied specialities,
 * read from the same cached counts the homepage uses, so a link here can
 * only point at a page with doctors on it.
 */
export async function SiteFooter() {
  const [cityListed, bySpecialty, geo] = await Promise.all([countsByCity(undefined, "published"), countsBySpecialty(undefined, "published"), getGeo()]);

  // Same rule as the homepage grid: the metros a patient searches by name
  // lead, then the deepest of the rest. Ranked purely by count the list
  // opened Indore, Jabalpur, Bhopal — the council-registry imports — with
  // Bengaluru fourth, which reads as a regional directory.
  const withSupply = cityListed
    .filter((c) => c.n > 0)
    .map((c) => ({ ...c, city: geo.city(c.stateSlug, c.citySlug) }))
    .filter((c) => c.city)
    .sort((a, b) => b.n - a.n);
  const cities = [...withSupply.filter((c) => isMetroCity(c.citySlug)), ...withSupply.filter((c) => !isMetroCity(c.citySlug))].slice(0, CITIES_SHOWN);

  const specialties: SpecialtyKey[] = [...SPECIALTY_KEYS]
    .filter((k) => (bySpecialty[k] ?? 0) > 0)
    .sort((a, b) => (bySpecialty[b] ?? 0) - (bySpecialty[a] ?? 0))
    .slice(0, SPECIALTIES_SHOWN);

  const social = SITE.socialLinks.map((url) => {
    let host = "";
    try {
      host = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return null;
    }
    const label = /linkedin/.test(host) ? "LinkedIn" : /instagram/.test(host) ? "Instagram" : /(x\.com|twitter)/.test(host) ? "X" : /facebook/.test(host) ? "Facebook" : /youtube/.test(host) ? "YouTube" : host;
    return { url, label };
  });

  const year = new Date().getFullYear();

  return (
    <footer className="site">
      <div className="wrap">
        <div className="fgrid">
          <div className="fbrand">
            <p className="flogo">
              <Logo height={30} />
            </p>
            <p className="fabout">
              A free directory of practising doctors in India. Every profile says what has been checked and what has only been submitted.
              Basic profiles are permanently free; organic ranking is never for sale.
            </p>
            <p className="fgriev">
              Grievance officer: <a href={`mailto:${SITE.grievanceEmail}`}>{SITE.grievanceEmail}</a>
              <br />
              <Link href={paths.policy("grievance")}>Grievance process and timelines</Link>
            </p>
          </div>

          <div>
            <p className="fh">Find a doctor</p>
            <ul>
              <li>
                <Link href="/doctors">Browse by city</Link>
              </li>
              <li>
                <Link href={paths.specialties()}>Browse by speciality</Link>
              </li>
              {cities.map((c) => (
                <li key={`${c.stateSlug}/${c.citySlug}`}>
                  <Link href={`/doctors/${c.stateSlug}/${c.citySlug}`}>Doctors in {c.city!.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="fh">Specialities</p>
            <ul>
              {specialties.map((k) => (
                <li key={k}>
                  <Link href={paths.specialty(k)}>{SPECIALTIES[k].plural}</Link>
                </li>
              ))}
              <li>
                <Link href={paths.specialties()}>All {SPECIALTY_KEYS.length} specialities</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="fh">For doctors</p>
            <ul>
              <li>
                <Link href={paths.forDoctors()}>Overview and sign-in</Link>
              </li>
              <li>
                <Link href={paths.whyThisSite()}>Why The Doctor Index</Link>
              </li>
              <li>
                <Link href={paths.claimProfile()}>Claim your profile</Link>
              </li>
              <li>
                <Link href={paths.addDoctor()}>Add your profile</Link>
              </li>
              <li>
                <Link href="/dashboard">Doctor dashboard</Link>
              </li>
            </ul>
            <p className="fh fh-gap">Learn</p>
            <ul>
              <li>
                <Link href="/health-guides">Health guides</Link>
              </li>
              <li>
                <Link href={paths.blog()}>Blog</Link>
              </li>
              <li>
                <Link href={paths.registers()}>Registers</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="fh">Trust</p>
            <ul>
              <li>
                <Link href="/about">About and ownership</Link>
              </li>
              <li>
                <Link href={paths.policy("verification")}>How verification works</Link>
              </li>
              <li>
                <Link href={paths.policy("ranking")}>How ranking works</Link>
              </li>
              <li>
                <Link href={paths.policy("reviews")}>Review policy</Link>
              </li>
              <li>
                <Link href={paths.policy("corrections")}>Corrections &amp; takedowns</Link>
              </li>
              <li>
                <Link href={paths.policies()}>All policies</Link>
              </li>
            </ul>
            <p className="fh fh-gap">Legal</p>
            <ul>
              <li>
                <Link href={paths.policy("privacy")}>Privacy</Link>
              </li>
              <li>
                <Link href={paths.policy("terms")}>Terms of use</Link>
              </li>
              {analyticsConsentGated() ? (
                <li>
                  <CookieSettingsButton />
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="fnote">
          <p className="fnote-warn">
            <strong>Not for emergencies.</strong> If someone is in immediate danger, call {SITE.emergencyNumber}. This site is a directory,
            not medical advice.
          </p>
          <p className="fnote-meta">
            <span>
              © {year} {SITE.name} · Built in Bengaluru, for India
            </span>
            {social.filter(Boolean).length ? (
              <span className="fsocial">
                {social.map((s) =>
                  s ? (
                    <a key={s.url} href={s.url} rel="noopener noreferrer" target="_blank">
                      {s.label}
                    </a>
                  ) : null,
                )}
              </span>
            ) : null}
          </p>
        </div>
      </div>
    </footer>
  );
}
