"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { AccountMenu } from "@/components/AccountMenu";
import { HeaderSearch } from "@/components/HeaderSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CITY, SPECIALTIES, SPECIALTY_KEYS } from "@/lib/data/taxonomy";
import { SITE, paths } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="site">
      <div className="wrap hrow">
        <Link className="brand" href={paths.home()}>
          <span className="mark">{SITE.name}</span>
          <span className="tag">India</span>
        </Link>
        <Suspense fallback={<div className="hsearch" aria-hidden="true" />}>
          <HeaderSearch />
        </Suspense>
        <nav className="hnav" aria-label="Primary">
          <Link className="plain" href="/health-guides">
            Health guides
          </Link>
          <Link className="plain" href={paths.policy("verification")}>
            How verification works
          </Link>
          <AccountMenu />
          <Link className="cta" href={paths.forDoctors()}>
            For doctors
          </Link>
          <ThemeToggle />
          <button
            type="button"
            className="menubtn"
            aria-expanded={open}
            aria-controls="mobnav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </div>

      <div id="mobnav" className={`mobnav${open ? " open" : ""}`}>
        <div className="wrap">
          <div className="h">Browse {CITY.name}</div>
          {SPECIALTY_KEYS.map((k) => (
            <Link key={k} href={paths.citySpecialty(CITY.stateSlug, CITY.slug, SPECIALTIES[k].slug)}>
              {SPECIALTIES[k].plural}
            </Link>
          ))}
          <div className="h">Learn</div>
          <Link href="/health-guides">Health guides</Link>
          <Link href={paths.policy("verification")}>How verification works</Link>
          <Link href={paths.policy("ranking")}>How ranking works</Link>
          <Link href="/about">About</Link>
          <div className="h">Account</div>
          <AccountMenu className="" />
          <div className="h">For doctors</div>
          <Link href={paths.forDoctors()}>Doctor sign-in and overview</Link>
          <Link href={paths.addDoctor()}>Add your profile</Link>
          <Link href={paths.claimProfile()}>Claim a profile</Link>
          <Link href="/dashboard">Doctor dashboard</Link>
          <div className="h">Appearance</div>
          <ThemeToggle compact={false} />
        </div>
      </div>
    </header>
  );
}
