"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { signOutAction } from "@/app/sign-in/actions";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandPalette, type NavEntry } from "@/components/admin/CommandPalette";
import { EnhanceTables } from "@/components/admin/EnhanceTables";
import { Shortcuts } from "@/components/admin/Shortcuts";
import { Toaster } from "@/components/admin/Toaster";

/* ---------------------------------------------------------------------------
   The admin console shell: a grouped sidebar, a slim top bar, the page.
   Pages keep their own `.dash-head` title; the top bar carries the section
   so a deep queue page still says where it sits. Counts come from
   lib/admin queueCounts() and only render when non-zero.
--------------------------------------------------------------------------- */

type Item = { href: string; label: string; countKey?: string; superOnly?: boolean; icon: IconName; keys?: string };
type Group = { label: string; items: Item[] };

const GROUPS: Group[] = [
  { label: "", items: [{ href: "/admin", label: "Overview", icon: "home", keys: "g o" }] },
  {
    label: "Doctors",
    items: [
      { href: "/admin/doctors", label: "All doctors", icon: "users", keys: "g d" },
      { href: "/admin/submissions", label: "New profiles", countKey: "submissions", icon: "plus" },
      { href: "/admin/claims", label: "Claims", countKey: "claims", icon: "shield", keys: "g c" },
      { href: "/admin/qualifications", label: "Certificates", countKey: "qualifications", icon: "award" },
      { href: "/admin/changes", label: "Change requests", countKey: "changes", icon: "edit" },
      { href: "/admin/enrichment", label: "Register matching", countKey: "enrichment_queue", icon: "search", keys: "g m" },
      { href: "/admin/invites", label: "Invites", countKey: "invites", icon: "mail" },
      { href: "/admin/signups", label: "Stalled signups", icon: "clock" },
      { href: "/admin/calls", label: "Call queue", icon: "phone" },
    ],
  },
  {
    label: "Patients",
    items: [
      { href: "/admin/patients", label: "Patients", icon: "heart", keys: "g p" },
      { href: "/admin/enquiries", label: "Enquiries", countKey: "enquiries", icon: "inbox", keys: "g e" },
      { href: "/admin/bookings", label: "Bookings", countKey: "bookings_stale", superOnly: true, icon: "calendar", keys: "g b" },
      { href: "/admin/reviews", label: "Reviews", countKey: "reviews", icon: "star", keys: "g r" },
      { href: "/admin/reports", label: "Reports & corrections", countKey: "reports", icon: "flag" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/articles", label: "Doctor articles", countKey: "articles", icon: "file" },
      { href: "/admin/news", label: "Newsroom", countKey: "news", icon: "news", keys: "g n" },
      { href: "/admin/condition-drafts", label: "Condition drafts", icon: "book" },
      { href: "/admin/seo", label: "SEO routes", icon: "globe" },
      { href: "/admin/taxonomy", label: "Taxonomy", icon: "tag" },
    ],
  },
  {
    label: "Growth & system",
    items: [
      { href: "/admin/tribe", label: "Tribe rewards", countKey: "tribe", icon: "gift" },
      { href: "/admin/audit", label: "Audit log", icon: "list", keys: "g a" },
      { href: "/admin/staff", label: "Staff", icon: "key" },
      { href: "/admin/security", label: "Security", icon: "lock" },
    ],
  },
];

export function AdminShell({ email, roles, counts, children }: { email: string; roles: string[]; counts: Record<string, number>; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);
  useEffect(() => { setOpen(false); setPalette(false); }, [pathname]);
  const openPalette = useCallback(() => setPalette(true), []);
  const closePalette = useCallback(() => setPalette(false), []);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const groups = useMemo(() => GROUPS.map((g) => ({ ...g, items: g.items.filter((it) => !it.superOnly || roles.includes("super_admin")) })), [roles]);
  const current = groups.flatMap((g) => g.items.map((it) => ({ ...it, group: g.label }))).find((it) => isActive(it.href));
  const navEntries = useMemo<NavEntry[]>(() => groups.flatMap((g) => g.items.map((it) => ({ href: it.href, label: it.label, group: g.label || "Overview", keys: it.keys }))), [groups]);
  const initial = (email.trim()[0] ?? "?").toUpperCase();

  return (
    <div className={`admin-shell${open ? " nav-open" : ""}`}>
      <aside className="adm-side" aria-label="Admin navigation">
        <div className="adm-brand">
          <Link href="/admin" className="adm-logo" aria-label="Admin overview">
            <span className="adm-mark">TDi</span>
            <span className="adm-brand-t">Admin console</span>
          </Link>
          <button type="button" className="adm-close" aria-label="Close menu" onClick={() => setOpen(false)}>×</button>
        </div>
        <nav className="adm-nav">
          {groups.map((g) => (
            <div className="adm-group" key={g.label || "top"}>
              {g.label ? <div className="adm-group-l">{g.label}</div> : null}
              {g.items.map((it) => {
                const active = isActive(it.href);
                const count = it.countKey ? counts[it.countKey] : undefined;
                return (
                  <Link key={it.href} href={it.href} className="adm-item" aria-current={active ? "page" : undefined}>
                    <Icon name={it.icon} />
                    <span className="adm-item-l">{it.label}</span>
                    {count ? <span className="adm-cnt">{count > 999 ? "999+" : count}</span> : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="adm-foot">
          <div className="adm-user">
            <span className="adm-av" aria-hidden="true">{initial}</span>
            <span className="adm-user-t">
              <span className="adm-user-n">{email}</span>
              <span className="adm-user-r">{roles.join(", ").replace(/_/g, " ")}</span>
            </span>
          </div>
          <div className="adm-foot-acts">
            <Link href="/" className="adm-foot-link" target="_blank" rel="noreferrer">View site ↗</Link>
            <form action={signOutAction}><button type="submit" className="adm-foot-link">Sign out</button></form>
          </div>
        </div>
      </aside>
      <button type="button" className="adm-scrim" aria-hidden="true" tabIndex={-1} onClick={() => setOpen(false)} />

      <div className="adm-main">
        <header className="adm-top">
          <button type="button" className="adm-menu" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <Icon name="menu" />
          </button>
          <div className="adm-crumb">
            {current?.group ? <><span className="adm-crumb-g">{current.group}</span><span className="adm-crumb-s">/</span></> : null}
            <span className="adm-crumb-p">{current?.label ?? "Admin"}</span>
          </div>
          <form
            className="adm-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
              router.push(q ? `/admin/doctors?q=${encodeURIComponent(q)}` : "/admin/doctors");
            }}
          >
            <Icon name="search" />
            <input name="q" type="search" placeholder="Find a doctor by name, slug or registration" aria-label="Find a doctor" autoComplete="off" />
          </form>
          <div className="adm-top-acts">
            <button type="button" className="adm-kbtn" onClick={openPalette} aria-label="Open command palette">
              <Icon name="search" /><span>Search</span><kbd>⌘K</kbd>
            </button>
            <ThemeToggle />
            <Link href="/admin/doctors/new" className="btn solid adm-new">New profile</Link>
          </div>
        </header>
        <div className="adm-body">{children}</div>
      </div>
      <CommandPalette nav={navEntries} open={palette} onClose={closePalette} />
      <Shortcuts nav={navEntries} onPalette={openPalette} />
      <Toaster />
      <EnhanceTables />
    </div>
  );
}

/* --- icons: 16px, stroke-only, currentColor ------------------------------- */

type IconName = "home" | "users" | "plus" | "shield" | "award" | "edit" | "search" | "mail" | "clock" | "phone" | "heart" | "inbox" | "calendar" | "star" | "flag" | "file" | "news" | "book" | "globe" | "tag" | "gift" | "list" | "key" | "lock" | "menu";

const PATHS: Record<IconName, string> = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m13 10v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  plus: "M12 5v14M5 12h14",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
  award: "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14m-3.5-1.1L7 23l5-3 5 3-1.5-9.1",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16m10 2-4.3-4.3",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m18 2-10 7L2 6",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20m0-16v6l4 2",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.9 2.1",
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2m3.5-6.9L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1",
  calendar: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm13-4v4M8 2v4M3 10h18",
  star: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z",
  flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zm0 7v-7",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 0v6h6M8 13h8M8 17h8",
  news: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V11h4m8-5h4m-4 4h4m-6 4h6m-6 4h6",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5z",
  globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20m-10-10h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10",
  tag: "m20.6 13.4-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8M7 7h.01",
  gift: "M20 12v10H4V12m18-5H2v5h20zM12 22V7m0 0H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7m0 0h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  key: "m21 2-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8m0 0L19 4m-3.5 3.5L18 10",
  lock: "M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2m2 0V7a5 5 0 0 1 10 0v4",
  menu: "M3 6h18M3 12h18M3 18h18",
};

function Icon({ name }: { name: IconName }) {
  return (
    <svg className="adm-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
