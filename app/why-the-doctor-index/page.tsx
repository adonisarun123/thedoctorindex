import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RouteMeta } from "@/components/RouteMeta";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { pageMeta } from "@/lib/seo/meta";
import { absoluteUrl, paths } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Why this exists, and what it does for you",
  ogTitle: "Why The Doctor Index exists — and what it does for a doctor",
  description:
    "Your name is already listed on sites you never wrote and cannot correct. This is what a registration-first, dated, free directory changes for a practising doctor — and what we will never sell.",
  path: paths.whyThisSite(),
});

export const revalidate = 86400;

export default function WhyPage() {
  const crumbs = [{ name: "Home", path: paths.home() }, { name: "Why this exists" }];

  return (
    <>
      <RouteMeta
        data={{
          route: "Why this exists (doctors)",
          title: String(metadata.title),
          h1: "Your name is already online. You did not write it.",
          canonical: absoluteUrl(paths.whyThisSite()),
          index: true,
          structuredData: "AboutPage, BreadcrumbList",
        }}
      />
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "AboutPage", url: absoluteUrl(paths.whyThisSite()), name: "Why The Doctor Index exists" },
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="wrap">
        <article className="doc">
          <span className="eyebrow">For doctors</span>
          <h1 style={{ marginTop: "10px", maxWidth: "24ch" }}>Your name is already online. You did not write it.</h1>

          <p>
            Search your own name with your city. You will find yourself on directories you never
            signed up to, with a clinic you left years ago, a degree spelled wrong, a consultation fee
            you have never charged, and a phone number that rings somewhere else. Somewhere in those
            results is a doctor with your name who is not you.
          </p>
          <p>
            None of those pages tell a patient the one thing that separates you from anyone who can
            afford a website: that you hold a current registration with a State Medical Council, and
            that somebody checked it.
          </p>

          <h2>What we are trying to fix</h2>
          <p>
            Indian medical directories are mostly advertising products. Position is sold, "verified"
            is a badge with nothing behind it, and the page about you exists to sell an appointment
            slot rather than to be correct. That is a problem for patients, and it is a problem for
            you: it puts a serious clinician and a well-funded one on the same page, and lets the
            better-funded one win.
          </p>
          <p>
            The Doctor Index is built the other way round. A profile starts from a council
            registration number, not from a marketing form. Every claim on it is checked separately,
            against a named source, on a date the page shows. Registration is verified separately
            from qualification, and both separately from whether you still practise at that address —
            because those are three different facts and collapsing them into one tick is how the
            other sites end up saying things that are not true.
          </p>

          <h2>What that does for you</h2>
          <dl className="kvi">
            <dt>A page that says you are real</dt>
            <dd>
              A patient sees the council, the registration number, and the date it was matched
              against the register. Not a badge we invented — a check they can follow. Read{" "}
              <Link href={paths.policy("verification")}>how verification works</Link>.
            </dd>
            <dt>Control of what it says</dt>
            <dd>
              Practices, hours, fees, languages, consultation modes and your introduction are yours to
              edit. Name, speciality and gender changes are re-verified before they go live, so nobody
              can quietly become a different doctor on a page carrying your registration number.
            </dd>
            <dt>An honest expiry date</dt>
            <dd>
              Every practice carries the date it was last reconfirmed, and a stale one is labelled
              stale rather than quietly left to look current. That protects you: a patient who arrives
              at a clinic you left is your reputation problem, not the directory's.
            </dd>
            <dt>A right of reply</dt>
            <dd>
              You may reply once to any published review. Replies are checked so nothing about the
              reviewer's health is revealed, and you can dispute a review that breaches the{" "}
              <Link href={paths.policy("reviews")}>review policy</Link>. We do not import ratings from
              other platforms, so no score you have never seen follows you here.
            </dd>
            <dt>Enquiries and numbers</dt>
            <dd>
              Appointment enquiries reach your practice directly. Your dashboard shows views, calls and
              directions over the last 28 days — enough to know whether the page is working, without a
              sales call attached.
            </dd>
            <dt>Search visibility you do not rent</dt>
            <dd>
              A profile is indexed because it exists and is complete, not because it is paid for.
              Ranking is organic and the weights are published in full at{" "}
              <Link href={paths.policy("ranking")}>the ranking policy</Link>. Payment is not an input,
              and there is no field in the code for one.
            </dd>
          </dl>

          <h2>What it costs</h2>
          <p>
            Nothing. Not to be listed, not to be verified, not to claim the profile, not to reply to a
            review, not to appear higher. The basic profile is permanently free and that promise is
            written into the <Link href={paths.policy("advertising")}>advertising policy</Link> rather
            than left as a launch offer.
          </p>
          <p>
            When the site does earn money it will be from things that sit beside the directory and
            cannot bend it — never from position, and never from removing something true.
          </p>

          <h2>What we will not do</h2>
          <ul>
            <li>Sell position in organic results, or offer to "boost" a profile.</li>
            <li>Charge for verification, or make verification a paid tier.</li>
            <li>Remove a policy-compliant negative review for money.</li>
            <li>Import star ratings or review text from other platforms.</li>
            <li>Publish your personal mobile number — only a practice number you consent to, and only to a signed-in patient.</li>
            <li>Let anyone create a page in your name without a registration number behind it.</li>
          </ul>

          <h2>Where we actually are</h2>
          <p>
            Honestly: early. Coverage is uneven, and a large share of the profiles on the site today
            were compiled from permitted public sources rather than supplied by the doctor. Those are
            published unclaimed, with their registration and qualifications marked <em>not yet
            checked</em> — because that is what they are. We would rather show you an unflattering
            label than a verification we have not done.
          </p>
          <p>
            That is also the fastest way to fix a page: claim it. A claim proves you control the
            practice — a one-time code to the number on file, a hospital email, or a document — and
            the page becomes yours to correct the same day.
          </p>

          <div className="panel pad" style={{ marginTop: "28px" }}>
            <h3 style={{ marginTop: 0 }}>Three ways in</h3>
            <p style={{ fontSize: "14px", color: "var(--ink-2)" }}>
              Already listed? <Link href={paths.claimProfile()}>Claim the profile</Link> and correct
              it. Not listed? <Link href={paths.addDoctor()}>Add yourself</Link>, starting with your
              council and registration number. Already claimed?{" "}
              <Link href={paths.signIn("/dashboard")}>Sign in to the dashboard</Link>.
            </p>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: 0 }}>
              Something on a page about you is wrong? The{" "}
              <Link href={paths.policy("corrections")}>corrections policy</Link> is a route to a human,
              with a deadline attached, whether or not you have claimed the profile.
            </p>
            <p style={{ marginTop: "14px", marginBottom: 0 }}>
              <Link className="btn solid" href={paths.forDoctors()}>
                What you can do once signed in
              </Link>
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
