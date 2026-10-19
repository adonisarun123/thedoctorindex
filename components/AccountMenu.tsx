"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getMe, type Me } from "@/lib/session-client";
import { paths } from "@/lib/site";

/**
 * Header account entry. Public pages are prerendered, so the session is
 * probed client-side after hydration — through the shared getMe(), which
 * makes no request at all for a visitor without a session; until then the
 * link reads "Sign in", which is also the right answer for a cached page.
 *
 * prefetch={false}: the sign-in link is in the header of every page with a
 * unique ?next=, so viewport prefetch rendered /sign-in once per page view.
 */
export function AccountMenu({ className = "plain" }: { className?: string }) {
  const [me, setMe] = useState<Me>({ signedIn: false });
  const pathname = usePathname();
  useEffect(() => {
    let alive = true;
    getMe().then((j) => alive && setMe(j));
    return () => {
      alive = false;
    };
  }, [pathname]);

  if (!me.signedIn) {
    const next = pathname && pathname !== "/" && !pathname.startsWith("/sign-in") ? pathname : undefined;
    return (
      <Link className={className} href={paths.signIn(next)} prefetch={false} rel="nofollow">
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
