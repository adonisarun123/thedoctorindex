import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { sql } from "drizzle-orm";
import { confirmInvite, inviteByToken } from "@/lib/services/doctor-invites";

export const metadata: Metadata = { title: "Confirm your registration", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

async function confirm(form: FormData) {
  "use server";
  const token = String(form.get("token") ?? "");
  const user = await requireUser(`/invite/${token}/confirm`);
  let claimed = false;
  try {
    ({ claimed } = await confirmInvite(token, user, String(form.get("registration") ?? "").trim()));
  } catch (e) {
    redirect(`/invite/${encodeURIComponent(token)}/confirm?error=${encodeURIComponent(e instanceof Error ? e.message : "Something went wrong.")}`);
  }
  redirect(claimed ? "/dashboard?claimed=1" : `/invite/${encodeURIComponent(token)}/confirm?pending=1`);
}

export default async function ConfirmInvite({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { token } = await params;
  const sp = await searchParams;
  const user = await requireUser(`/invite/${token}/confirm`);
  const view = await inviteByToken(token);
  const error = typeof sp.error === "string" ? sp.error : null;

  let body: React.ReactNode;
  if (sp.pending === "1") {
    body = <p style={{ margin: 0 }}>Thank you. A verification officer will check your claim and email you, usually within a working day.</p>;
  } else if (view.state === "claimed") {
    body = <p style={{ margin: 0 }}>This profile is claimed. <Link href="/dashboard">Go to your dashboard</Link>.</p>;
  } else if (view.state !== "open") {
    body = <p style={{ margin: 0 }}>This link is no longer valid. <Link href="/claim-profile">Claim your profile here</Link> instead.</p>;
  } else if ((user.email ?? "").toLowerCase() !== view.invite.email) {
    body = <p style={{ margin: 0 }}>You are signed in with a different email address from the one this invite went to. Sign out, then open the link from the email again.</p>;
  } else {
    const [council] = (await getDb().execute(sql`select council from medical_registrations where doctor_id = ${view.invite.doctorId} order by is_primary desc limit 1`)) as unknown as Array<{ council: string | null }>;
    body = (
      <form action={confirm}>
        <input type="hidden" name="token" value={token} />
        <p style={{ marginTop: 0 }}>Last step for <b>{view.profile.name}</b>: enter your registration number{council?.council ? <> with the <b>{council.council}</b></> : null}, exactly as on your certificate.</p>
        <div className="field"><label>Registration number</label><input type="text" name="registration" required autoComplete="off" /></div>
        <button type="submit" className="btn solid" style={{ width: "100%" }}>Claim my profile</button>
      </form>
    );
  }

  return (
    <div className="wrap">
      <div className="signin">
        <span className="eyebrow">The Doctor Index</span>
        <h1 style={{ marginTop: "8px" }}>Confirm it&apos;s you</h1>
        {error ? <div className="notice bad" style={{ marginBottom: "12px" }}>{error}</div> : null}
        <div className="panel pad">{body}</div>
      </div>
    </div>
  );
}
