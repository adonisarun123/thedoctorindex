"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { paths } from "@/lib/site";

type Me = { signedIn: false } | { signedIn: true; role: "patient" | "doctor" | "staff"; staff: boolean; home: string };

/**
 * Header account entry. Public pages are prerendered, so the session is
 * probed client-side from /api/me after hydration; until then the link
 * reads "Sign in", which is also the right answer for a cached page.
 */
export function AccountMenu({ className = "plain" }: { className?: string }) {
  const [me, setMe] = useState<Me>({ signedIn: false });
  const pathname = usePathname();
  useEffect(() => {
    let alive = true;
    fetch("/api/me", { credentials: "same-origin", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { signedIn: false }))
      .then((j) => alive && setMe(j))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [pathname]);

  if (!me.signedIn) {
    const next = pathname && pathname !== "/" && !pathname.startsWith("/sign-in") ? pathname : undefined;
    return (
      <Link className={className} href={paths.signIn(next)}>
        Sign in / Sign up
      </Link>
    );
  }
  const label = me.staff ? "Admin" : me.role === "doctor" ? "Dashboard" : "My account";
  return (
    <Link className={className} href={me.home}>
      {label}
    </Link>
  );
}
