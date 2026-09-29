import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DoctorLpSearch } from "@/components/DoctorLpSearch";
import { RouteMeta } from "@/components/RouteMeta";
import { claimLink } from "@/lib/claim-source";
import { getDoctorBySlug } from "@/lib/data";
import { displayName } from "@/lib/display-name";
import { track } from "@/lib/services/events";
import { getReferrerByCode } from "@/lib/services/tribe";
import { absoluteUrl, paths } from "@/lib/site";
import { parseReferralCode, TRIBE, tribeChannel } from "@/lib/tribe";

/**
 * Grow Your Tribe landing: where a colleague's invite link arrives.
 *
 * Middleware has already dropped the referral cookie. This page's one job is
 * to turn the invite into a claim or a new profile. When the link names a
 * specific unclaimed profile (?p=<slug>) the invitee sees their own name and
 * one button; otherwise the same find-your-profile search the paid landing
 * page uses. Dead or malformed codes fall through to the ordinary doctor
 * landing so a stale link is never a dead end. noindex: it is personal.
 */
export const metadata: Metadata = {
  title: "A colleague has invited you",
  robots: { index: false, follow: false },
  alternates: { canonical: "/for-doctors" },
};
export const dynamic = "force-dynamic";

export default async function JoinPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const code = parseReferralCode(sp.ref);
  const referrer = TRIBE.enabled && code ? await getReferrerByCode(code) : null;
  if (!referrer) redirect("/for-doctors/free-profile?src=tribe");

  const channel = tribeChannel(sp.ch);
  const slug = typeof sp.p === "string" ? sp.p : null;
  const target = slug ? await getDoctorBySlug(slug).catch(() => null) : null;
  const named = target && target.dbId && !target.claimed && target.lifecycle === "published" ? target : null;
  await track("referral_link_opened", { doctorId: named?.dbId ?? referrer.doctorId, path: "/join", query: `ch:${channel}` });

  const inviter = displayName(referrer);
  const createHref = `${paths.addDoctor()}?src=tribe`;

  return (
    <>
      <RouteMeta
        data={{
          route: "Grow Your Tribe invite landing",
          title: "A colleague has invited you | The Doctor Index",
          canonical: absoluteUrl("/for-doctors"),
          index: false,
          structuredData: "None",
          notes: [
            { label: "Why noindex", text: "Personal invite link; the referral cookie is set by middleware on this path." },
            { label: "Channel", text: `Invite tagged ch=${channel}; claims and new profiles from here carry src=tribe.` },
          ],
        }}
      />

      <section className="lp-hero">
        <div className="wrap lp-hero-grid">
          <div className="lp-hero-copy">
            <span className="eyebrow">Invited by {inviter}{referrer.city ? ` · ${referrer.city}` : ""}</span>
            <h1>{named ? `${displayName(named)}, your profile is already here.` : `${inviter} is on The Doctor Index. Join them.`}</h1>
            <p className="lp-lede">
              {named
                ? "It was compiled from public sources and nobody controls it yet. Claim it to correct your practices, hours and fees, reply to reviews and see how patients find you. Free, permanently."
                : "A directory that checks every doctor against the state medical registers. Claim the profile that already exists in your name, or create one from your registration number. Free, permanently."}
            </p>
            <ul className="lp-ticks">
              <li>No fee, no subscription, no paid ranking</li>
              <li>Registration-verified badge on your profile</li>
              <li>Your personal phone and email are never shown</li>
            </ul>
          </div>
          <div className="lp-card" id="find">
            {named ? (
              <>
                <h2>Is this you?</h2>
                <p style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600 }}>{displayName(named)}</p>
                <p style={{ margin: "0 0 16px", color: "var(--muted)" }}>{named.practices[0] ? `${named.practices[0].facility}, ${named.practices[0].city}` : "Practice location on record"}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <a className="btn solid lp-big" href={claimLink(named.slug, "tribe")}>This is me — claim it</a>
                  <Link className="btn lp-big" href={paths.doctor(named.slug)}>See the profile</Link>
                </div>
                <p className="lp-small" style={{ marginTop: 16 }}>Not you? <a href="#search">Search for your own profile</a> or <Link href={createHref}>create a new one</Link>.</p>
                <div id="search" style={{ marginTop: 18 }}>
                  <DoctorLpSearch src="tribe" />
                </div>
              </>
            ) : (
              <>
                <h2>Find your profile</h2>
                <DoctorLpSearch src="tribe" autoFocus />
                <p className="lp-small" style={{ marginTop: 14 }}>Not listed yet? <Link href={createHref}>Create a profile</Link> — it starts from your council and registration number.</p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="wrap">
          <h2 className="lp-h2">Three steps</h2>
          <ol className="lp-steps">
            <li><span className="lp-num">1</span><div><h3>Claim or create</h3><p>Tap <b>This is me</b> on your profile, or create one from your registration number.</p></div></li>
            <li><span className="lp-num">2</span><div><h3>Sign in with a one-time code</h3><p>No password. Your contact details are never published.</p></div></li>
            <li><span className="lp-num">3</span><div><h3>We verify, you go live</h3><p>A verification officer checks your registration against the register. Target: two business days.</p></div></li>
          </ol>
          <p className="lp-small">
            Why this site exists: <Link href={paths.whyThisSite()}>{absoluteUrl(paths.whyThisSite()).replace(/^https?:\/\//, "")}</Link>. Read the <Link href={paths.policy("ranking")}>ranking policy</Link> — nobody pays to rank, including the colleague who invited you.
          </p>
        </div>
      </section>
    </>
  );
}
