import { eq } from "drizzle-orm";
import Link from "next/link";
import QRCode from "qrcode";

import { beginEnrolAction, confirmEnrolAction, resetOwnMfaAction } from "@/app/admin/mfa/actions";
import { signOutAction } from "@/app/sign-in/actions";
import { ActionForm } from "@/components/ActionForm";
import { decrypt } from "@/lib/auth/crypto";
import { mfaRequired, requireStaffIdentity } from "@/lib/auth/session";
import { otpauthUri } from "@/lib/auth/totp";
import { getDb } from "@/lib/db/client";
import { toDisplay } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { SITE } from "@/lib/site";

export const metadata = { title: "Security" };

/**
 * Authenticator enrolment. Lives outside the (app) group because the
 * console's guard sends un-enrolled staff here; it is the one page that
 * must render before MFA is satisfied.
 */
export default async function AdminSecurity({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const u = await requireStaffIdentity();
  const [m] = await getDb().select({ secret: s.staffMembers.mfaSecret, enrolled: s.staffMembers.mfaEnrolled, enrolledAt: s.staffMembers.mfaEnrolledAt }).from(s.staffMembers).where(eq(s.staffMembers.userId, u.id)).limit(1);
  const confirming = sp.step === "confirm" && m?.secret && !m.enrolled;
  const enrolled = Boolean(m?.enrolled);
  const required = mfaRequired();

  let qr: string | null = null;
  let secret: string | null = null;
  if (confirming && m?.secret) {
    secret = decrypt(m.secret);
    qr = await QRCode.toDataURL(otpauthUri(secret, u.email ?? u.id, SITE.name), { margin: 1, width: 220 });
  }

  return (
    <div className="wrap">
      <div className="signin" style={{ maxWidth: "620px" }}>
        <span className="eyebrow">Admin console · security</span>
        <h1 style={{ marginTop: "8px" }}>Two-step sign-in</h1>
        <p style={{ color: "var(--ink-2)", fontSize: "14.5px" }}>
          Staff accounts can approve doctors and read private evidence, so a one-time code to email is not enough on its own. Add an authenticator app (Google Authenticator, Authy, 1Password, Microsoft Authenticator) as a second step.
          {required && !enrolled ? " Enrolment is required before the console opens." : ""}
        </p>

        {enrolled && !confirming ? (
          <div className="panel pad">
            <div className="notice good" style={{ marginBottom: "12px" }}><b>Authenticator enrolled</b>{m?.enrolledAt ? ` on ${toDisplay(m.enrolledAt)}` : ""}. You are asked for a code once per sign-in.</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link className="btn solid" href="/admin">Back to the console</Link>
              <form action={resetOwnMfaAction}><button type="submit" className="btn quiet">Replace authenticator</button></form>
            </div>
          </div>
        ) : null}

        {!enrolled && !confirming ? (
          <div className="panel pad">
            <p style={{ fontSize: "14px", color: "var(--ink-2)", marginTop: 0 }}>You will scan a QR code, then enter the first code your app shows. Takes about a minute.</p>
            <form action={beginEnrolAction}><button type="submit" className="btn solid">Set up authenticator</button></form>
            {!required ? <div style={{ marginTop: "12px" }}><Link href="/admin" className="btn quiet">Skip for now</Link> <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>(STAFF_MFA_REQUIRED is off in this environment)</span></div> : null}
          </div>
        ) : null}

        {confirming && qr && secret ? (
          <div className="panel pad">
            <div className="two" style={{ gridTemplateColumns: "240px 1fr", gap: "20px", alignItems: "start" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="QR code for your authenticator app" width={220} height={220} style={{ background: "#fff", borderRadius: "4px", padding: "6px", border: "1px solid var(--hair)" }} />
              <div>
                <p style={{ marginTop: 0, fontSize: "14px" }}><b>1.</b> Scan this with your authenticator app.</p>
                <p style={{ fontSize: "12.5px", color: "var(--muted)" }}>Cannot scan? Enter this key manually (time-based, 6 digits):<br /><span className="mono" style={{ userSelect: "all", wordBreak: "break-all" }}>{secret.match(/.{1,4}/g)?.join(" ")}</span></p>
                <p style={{ fontSize: "14px" }}><b>2.</b> Enter the code it shows now.</p>
                <ActionForm action={confirmEnrolAction} submitLabel="Confirm and finish" variant="solid">
                  <div className="field" style={{ marginBottom: "8px" }}><input name="code" type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="123 456" autoFocus required /></div>
                </ActionForm>
              </div>
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
          <form action={signOutAction}><button type="submit" className="btn quiet">Sign out</button></form>
          <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>Signed in as <span className="mono">{u.email}</span></span>
        </div>
      </div>
    </div>
  );
}
