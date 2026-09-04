import { redirect } from "next/navigation";

import { verifyMfaAction } from "@/app/admin/mfa/actions";
import { signOutAction } from "@/app/sign-in/actions";
import { ActionForm } from "@/components/ActionForm";
import { requireStaffIdentity } from "@/lib/auth/session";

export const metadata = { title: "Second factor" };

export default async function AdminMfa({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const u = await requireStaffIdentity();
  if (!u.mfaEnrolled) redirect("/admin/security?enrol=1");
  if (u.mfaVerified) redirect("/admin");
  const next = typeof sp.next === "string" ? sp.next : "/admin";
  return (
    <div className="wrap">
      <div className="signin">
        <span className="eyebrow">Admin console</span>
        <h1 style={{ marginTop: "8px" }}>Enter your authenticator code</h1>
        <p style={{ color: "var(--ink-2)", fontSize: "14.5px", marginBottom: "18px" }}>
          Signed in as <span className="mono">{u.email}</span>. Open your authenticator app and enter the six-digit code for {process.env.NEXT_PUBLIC_SITE_NAME ?? "The Doctor Index"}.
        </p>
        <ActionForm action={verifyMfaAction} submitLabel="Continue" variant="solid" className="panel pad">
          <input type="hidden" name="next" value={next} />
          <div className="field"><label htmlFor="code">Six-digit code</label><input id="code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" autoFocus required /></div>
        </ActionForm>
        <form action={signOutAction} style={{ marginTop: "14px" }}><button type="submit" className="btn quiet">Sign out</button></form>
        <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "14px" }}>Lost the device? A super administrator can reset your authenticator under Admin → Staff; you will enrol again on next sign-in.</p>
      </div>
    </div>
  );
}
