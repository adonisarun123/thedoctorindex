"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { AccountMenu } from "@/components/AccountMenu";
import { HeaderSearch } from "@/components/HeaderSearch";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SPECIALTIES } from "@/lib/data/taxonomy";
import { paths } from "@/lib/site";

/*
 * The specialities most patients start from. The menu used to list all ~49,
 * which made it a long scroll before reaching anything else; the full list is
 * one tap away on /specialties. Hubs, not city × speciality: a fixed city
 * link per speciality points at pages that may have no supply (and 404).
 */
const COMMON_SPECIALTIES = [
  "general-practice",
  "gynaecology",
  "paediatrics",
  "orthopaedics",
  "cardiology",
  "dermatology",
  "ent",
  "ophthalmology",
  "dentistry",
  "psychiatry",
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // Close the menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While open: the page behind does not scroll, Escape closes, and focus
  // moves into the panel and back to the Menu button on close.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const btn = menuBtn.current;
    return () => {
      root.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  return (
    <header className="site">
      <div className="wrap hrow">
        <Link className="brand" href={paths.home()}>
          <Logo />
          <span className="tag">India</span>
        </Link>
        <Suspense fallback={<div className="hsearch" aria-hidden="true" />}>
          <HeaderSearch />
        </Suspense>
        <nav className="hnav" aria-label="Primary">
          <Link className="plain" href="/blog">
            Blog
          </Link>
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
            ref={menuBtn}
            type="button"
            className="menubtn"
            aria-expanded={open}
            aria-controls="mobnav"
            onClick={() => setOpen(true)}
          >
            <span className="burger" aria-hidden="true" />
            Menu
          </button>
        </nav>
      </div>

      {/* A drawer of its own, fixed to the viewport and scrolling inside
          itself. It used to expand inside the sticky header, so above phone
          width it grew taller than the screen and could not be scrolled. */}
      <div className={`mobnav-back${open ? " open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div
        id="mobnav"
        className={`mobnav${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="mobnav-top">
          <span className="mobnav-title">Menu</span>
          <button ref={closeBtn} type="button" className="mobnav-close" onClick={() => setOpen(false)}>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav className="mobnav-body" aria-label="Menu">
          <div className="h">Find a doctor</div>
          <Link href={paths.home()}>Search for a doctor</Link>
          <Link href="/doctors">Browse by city</Link>
          <Link href={paths.specialties()}>All specialities</Link>

          <div className="h">Common specialities</div>
          <div className="mobnav-grid">
            {COMMON_SPECIALTIES.filter((k) => SPECIALTIES[k]).map((k) => (
              <Link key={k} href={paths.specialty(k)}>
                {SPECIALTIES[k].plural}
              </Link>
            ))}
          </div>

          <div className="h">Your account</div>
          <AccountMenu className="" />

          <div className="h">For doctors</div>
          <Link href={paths.forDoctors()}>Doctor sign-in and overview</Link>
          <Link href={paths.claimProfile()}>Claim your profile</Link>
          <Link href={paths.addDoctor()}>Add your profile</Link>

          <div className="h">Learn</div>
          <Link href="/health-guides">Health guides</Link>
          <Link href="/blog">Blog</Link>
          <Link href={paths.policy("verification")}>How verification works</Link>
          <Link href={paths.policy("ranking")}>How ranking works</Link>
          <Link href="/about">About us</Link>

          <div className="h">Appearance</div>
          <ThemeToggle compact={false} />
        </nav>
      </div>
    </header>
  );
}
