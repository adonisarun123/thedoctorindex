"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOutAction } from "@/app/sign-in/actions";

const ITEMS: Array<{ href: string; label: string; countKey?: string }> = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/submissions", label: "New profiles", countKey: "submissions" },
  { href: "/admin/claims", label: "Claims", countKey: "claims" },
  { href: "/admin/changes", label: "Change requests", countKey: "changes" },
  { href: "/admin/reviews", label: "Review moderation", countKey: "reviews" },
  { href: "/admin/reports", label: "Reports & corrections", countKey: "reports" },
  { href: "/admin/enquiries", label: "Enquiries", countKey: "enquiries" },
  { href: "/admin/doctors", label: "Doctors" },
  { href: "/admin/enrichment", label: "Register matching", countKey: "enrichment_queue" },
  { href: "/admin/taxonomy", label: "Taxonomy" },
  { href: "/admin/seo", label: "SEO routes" },
  { href: "/admin/audit", label: "Audit log" },
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/security", label: "Security (2-step)" },
];

export function AdminNav({ email, roles, counts }: { email: string; roles: string[]; counts: Record<string, number> }) {
  const pathname = usePathname();
  return (
    <nav className="dash-nav" aria-label="Admin">
      <div className="who" style={{ display: "block" }}>
        <div className="n">{email}</div>
        <div className="s">{roles.join(", ")}</div>
      </div>
      {ITEMS.map((it) => {
        const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
        const count = it.countKey ? counts[it.countKey] : undefined;
        return (
          <Link key={it.href} href={it.href} aria-current={active ? "page" : undefined}>
            <span>{it.label}</span>
            {count ? <span className="cnt">{count}</span> : null}
          </Link>
        );
      })}
      <form action={signOutAction}>
        <button type="submit" style={{ all: "unset", cursor: "pointer", display: "block", width: "100%", padding: "10px 16px", fontSize: "13.5px", color: "var(--muted)", boxSizing: "border-box" }}>Sign out</button>
      </form>
    </nav>
  );
}
