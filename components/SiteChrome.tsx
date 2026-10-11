"use client";

import { usePathname } from "next/navigation";

/**
 * The public header and footer, withheld on the admin console. The console
 * has its own shell (components/AdminShell.tsx); the public search bar and
 * footer links only cost it width and attention. Auth screens under /admin
 * keep the chrome so the brand is on the page the staff member signs in on.
 */
const BARE = /^\/admin(?!\/(sign-in|mfa|security|files)(\/|$))(\/|$)/;

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname && BARE.test(pathname)) return null;
  return <>{children}</>;
}
