import { redirect } from "next/navigation";

import { OtpSignIn } from "@/components/OtpSignIn";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Staff sign in" };

export default async function AdminSignIn({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const user = await getSessionUser();
  if (user && user.role === "staff" && user.staffRoles.length) redirect("/admin");
  return (
    <div className="wrap">
      <div className="signin">
        <span className="eyebrow">Admin console</span>
        <h1 style={{ marginTop: "8px" }}>Staff sign in</h1>
        {sp.denied ? (
          <div className="notice alert" style={{ marginBottom: "14px" }}>
            {user ? <>The account <b>{user.email ?? user.phone}</b> is signed in but holds no staff role. A super administrator adds staff under Admin → Staff.</> : "That account has no staff role."}
          </div>
        ) : null}
        <p style={{ color: "var(--ink-2)", fontSize: "14.5px", marginBottom: "18px" }}>
          One-time code to your work email. Staff accounts are limited to the domains in STAFF_ALLOWED_EMAIL_DOMAINS and every action is written to the audit log.
        </p>
        <div className="panel pad">
          <OtpSignIn next="/admin" label="Sign in" />
        </div>
        {!process.env.DATABASE_URL ? <p className="notice" style={{ marginTop: "14px", fontSize: "13px" }}>No DATABASE_URL — the console cannot run on fixture data.</p> : null}
      </div>
    </div>
  );
}
