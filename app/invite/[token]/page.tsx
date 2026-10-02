import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createSession } from "@/lib/auth/session";
import { acceptInvite, inviteByToken, optOutInvite } from "@/lib/services/doctor-invites";

export const metadata: Metadata = { title: "Your profile on The Doctor Index", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const back = (token: string, q: string) => `/invite/${encodeURIComponent(token)}?${q}`;

async function accept(form: FormData) {
  "use server";
  const token = String(form.get("token") ?? "");
  let userId: string;
  try {
    ({ userId } = await acceptInvite(token));
  } catch (e) {
    redirect(back(token, `error=${encodeURIComponent(e instanceof Error ? e.message : "Something went wrong.")}`));
  }
  await createSession(userId);
  redirect(`/invite/${encodeURIComponent(token)}/confirm`);
}

async function stop(form: FormData) {
  "use server";
  const token = String(form.get("token") ?? "");
  const reason = form.get("reason") === "not_me" ? "not_me" : "not_interested";
  try {
    await optOutInvite(token, reason);
  } catch (e) {
    redirect(back(token, `error=${encodeURIComponent(e instanceof Error ? e.message : "Something went wrong.")}`));
  }
  redirect(back(token, `done=${reason}`));
}

/**
 * Landing page for a staff invite. Every choice is a POST: mail scanners open
 * every link in a message, and a GET that signed someone in or opted them out
 * would act on delivery.
 */
export default async function InvitePage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { token } = await params;
  const sp = await searchParams;
  const view = await inviteByToken(token);
  const error = typeof sp.error === "string" ? sp.error : null;
  const done = sp.done === "not_me" || sp.done === "not_interested" ? sp.done : null;

  let body: React.ReactNode;
  if (view.state === "invalid") {
    body = <p style={{ margin: 0 }}>This link is not valid, or the invite was withdrawn. If you are a doctor, <Link href="/claim-profile">find your profile and claim it here</Link>.</p>;
  } else if (view.state === "claimed") {
    body = <p style={{ margin: 0 }}>This profile has been claimed. <Link href="/dashboard">Sign in to manage it</Link>.</p>;
  } else if (view.state === "expired") {
    body = <p style={{ margin: 0 }}>This link has expired. You can still claim the profile from <Link href={`/doctor/${view.slug}`}>its page</Link> using the Claim button.</p>;
  } else {
    const p = view.profile;
    const card = (
      <div style={{ border: "1px solid var(--hair)", borderRadius: "10px", padding: "12px 14px", margin: "0 0 14px" }}>
        <div style={{ fontWeight: 600 }}>{p.name}</div>
        <div style={{ fontSize: "13.5px", color: "var(--muted)" }}>{[p.specialty, p.practice].filter(Boolean).join(" · ")}</div>
        <Link href={`/doctor/${view.slug}`} target="_blank" style={{ fontSize: "13px" }}>View the profile ↗</Link>
      </div>
    );
    const optedOut = view.state === "opted_out" || done;
    body = (
      <>
        {card}
        {done === "not_me" ? <div className="notice" style={{ marginBottom: "12px" }}>Thank you. We will not email this address about the profile again.</div> : null}
        {done === "not_interested" ? <div className="notice" style={{ marginBottom: "12px" }}>Done. No more emails, and the practice phone number is hidden on the profile.</div> : null}
        {!optedOut ? <p style={{ marginTop: 0 }}>Our team set up this profile from your practice details. Claim it to correct anything, add your photograph, qualifications, timings and fees, and decide what patients see. It is free.</p> : <p style={{ marginTop: 0 }}>Changed your mind? You can still claim the profile.</p>}
        <form action={accept}>
          <input type="hidden" name="token" value={token} />
          <button type="submit" className="btn solid" style={{ width: "100%" }}>Yes, this is me — continue</button>
        </form>
        <div className="hint" style={{ margin: "8px 0 16px" }}>Next you confirm your registration number. If this is your first visit we will also ask for your mobile number and acceptance of the terms.</div>
        {!optedOut ? (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <form action={stop}>
              <input type="hidden" name="token" value={token} /><input type="hidden" name="reason" value="not_me" />
              <button type="submit" className="btn quiet">This is not me</button>
            </form>
            <form action={stop}>
              <input type="hidden" name="token" value={token} /><input type="hidden" name="reason" value="not_interested" />
              <button type="submit" className="btn quiet">Stop these emails</button>
            </form>
          </div>
        ) : null}
        {!optedOut ? <div className="hint" style={{ marginTop: "6px" }}>&ldquo;Stop these emails&rdquo; also hides the practice phone number on the profile.</div> : null}
      </>
    );
  }

  return (
    <div className="wrap">
      <div className="signin">
        <span className="eyebrow">The Doctor Index</span>
        <h1 style={{ marginTop: "8px" }}>Your profile</h1>
        {error ? <div className="notice bad" style={{ marginBottom: "12px" }}>{error}</div> : null}
        <div className="panel pad">{body}</div>
      </div>
    </div>
  );
}
