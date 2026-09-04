"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOutAction } from "@/app/sign-in/actions";
import { Avatar } from "@/components/Avatar";

const ITEMS: Array<{ href: string; label: string; countKey?: string }> = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/profile", label: "Profile & credentials" },
  { href: "/dashboard/practices", label: "Practices & fees" },
  { href: "/dashboard/enquiries", label: "Appointment enquiries", countKey: "enquiries" },
  { href: "/dashboard/reviews", label: "Reviews & replies", countKey: "reviews" },
  { href: "/dashboard/analytics", label: "How patients find you" },
  { href: "/dashboard/verification", label: "Verification & changes", countKey: "changes" },
  { href: "/dashboard/team", label: "Team access" },
];

export function DashboardNav({ name, id, registration, counts }: { name: string; id: string; registration: string; counts: Record<string, number> }) {
  const pathname = usePathname();
  return (
    <nav className="dash-nav" aria-label="Dashboard">
      <div className="who">
        <Avatar name={name} id={id} size={36} />
        <div>
          <div className="n">Dr {name}</div>
          <div className="s">{registration}</div>
        </div>
      </div>
      {ITEMS.map((it) => {
        const active = pathname === it.href;
        const count = it.countKey ? counts[it.countKey] : undefined;
        return (
          <Link key={it.href} href={it.href} aria-current={active ? "page" : undefined}>
            <span>{it.label}</span>
            {count ? <span className="cnt">{count}</span> : null}
          </Link>
        );
      })}
      <form action={signOutAction}>
        <button type="submit" style={{ all: "unset", cursor: "pointer", display: "block", width: "100%", padding: "10px 16px", fontSize: "13.5px", color: "var(--muted)", boxSizing: "border-box" }}>
          Sign out
        </button>
      </form>
    </nav>
  );
}
