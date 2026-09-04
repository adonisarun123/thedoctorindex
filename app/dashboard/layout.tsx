import type { Metadata } from "next";

/**
 * Everything under /dashboard is behind authentication in the real product and
 * is excluded from the index here regardless. robots.txt also disallows it.
 */
export const metadata: Metadata = {
  title: { default: "Doctor dashboard", template: "%s · Dashboard | The Doctor Index" },
  robots: { index: false, follow: false },
};

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
