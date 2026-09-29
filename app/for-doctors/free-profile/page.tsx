import type { Metadata } from "next";
import Link from "next/link";

import { DoctorLpSearch } from "@/components/DoctorLpSearch";
import { RouteMeta } from "@/components/RouteMeta";
import { totals } from "@/lib/data";
import { claimSource } from "@/lib/claim-source";
import { absoluteUrl, paths } from "@/lib/site";
import { track } from "@/lib/services/events";

/**
 * Paid-acquisition landing page for doctors (Google Ads, and any other paid
 * channel via ?src=). One job: get a doctor to find and claim their profile,
 * or create one. /for-doctors stays the organic page; this one is noindex so the
 * two never compete.
 *
 * Channel attribution: ?src=<tag> wins; then utm_source=google&utm_medium=cpc
 * or a Google Ads click id (gclid / gbraid / wbraid) means "gads"; otherwise
 * "lp". The tag rides on every onward link so the server-side claim funnel
 * counts it without cookies, and the client conversions (lib/conversions.ts)
 * report it to GA4.
 */
export const metadata: Metadata = {
  title: "Claim your free doctor profile",
  description:
    "Patients are already looking you up. Find your profile on The Doctor Index and claim it free — correct your practices, hours and fees, reply to reviews and see how patients find you.",
  alternates: { canonical: "/for-doctors/free-profile" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Claim your free doctor profile — The Doctor Index",
    description: "Registration-verified. Free for good. Nobody pays to rank.",
    url: "/for-doctors/free-profile",
  },
};
export const dynamic = "force-dynamic";

function channel(sp: Record<string, string | string[] | undefined>): string {
  const tagged = claimSource(sp.src);
  if (tagged) return tagged;
  if (sp.gclid || sp.gbraid || sp.wbraid) return "gads";
  if (sp.utm_source === "google" && sp.utm_medium === "cpc") return "gads";
  return claimSource(sp.utm_source) ?? "lp";
}

function rounded(n: number): string {
  if (n >= 1000) return `${(Math.floor(n / 1000) * 1000).toLocaleString("en-IN")}+`;
  return n.toLocaleString("en-IN");
}

const SMS = process.env.NEXT_PUBLIC_SMS_ENABLED === "1";

const FAQ: Array<[string, string]> = [
  ["Is it really free?", "Yes. The basic profile and verification are free, permanently. We do not sell rankings, leads or appointment slots, and nobody can pay to appear above you."],
  [
    "Why is there already a profile in my name?",
    "Some profiles are compiled from permitted public sources, such as hospital and clinic websites and the public medical registers. Claiming it lets you correct anything out of date and control what patients see.",
  ],
  [
    "What do I need?",
    `Your council and registration number, and ${SMS ? "an email address or mobile number" : "an email address"} for a one-time sign-in code. No password.`,
  ],
  [
    "How do you confirm it is really me?",
    "You choose: a one-time password to the practice number already on file, an email at your hospital or clinic domain, confirmation from the practice administrator, or a document for manual review. A verification officer checks it — target two business days.",
  ],
  ["Someone else already claimed my profile.", "Competing claims go to a person, not an algorithm. We never show one claimant's details to another, and we do not transfer control without evidence from both sides."],
  ["Can my clinic manager handle it?", "Yes. Once you have claimed it, invite a clinic manager with access limited to specific practices. Name, speciality and registration stay with you."],
];

export default async function DoctorFreeProfileLanding({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const src = channel(sp);
  const sum = await totals().catch(() => null);
  // Counted server-side, so the funnel per channel (report:growth) does not
  // depend on the visitor accepting cookies. No identity is stored.
  await track("doctor_lp_viewed", { path: "/for-doctors/free-profile", query: `src:${src}` });
  const createHref = `/add-doctor?src=${encodeURIComponent(src)}`;

  return (
    <>
      <RouteMeta
        data={{
          route: "For doctors (paid landing)",
          title: "Claim your free doctor profile | The Doctor Index",
          canonical: absoluteUrl("/for-doctors/free-profile"),
          index: false,
          structuredData: "None",
          notes: [
            { label: "Why noindex", text: "Paid-traffic landing page. /for-doctors is the organic page for the same intent; indexing both would split it." },
            { label: "Channel", text: `This visit is tagged src=${src}. Claims and new profiles carry the tag into events.query.` },
          ],
        }}
      />

      <section className="lp-hero">
        <div className="wrap lp-hero-grid">
          <div className="lp-hero-copy">
            <span className="eyebrow">For doctors · Free, permanently</span>
            <h1>Patients are already looking you up. Make sure they find the right details.</h1>
            <p className="lp-lede">
              {sum?.published
                ? `The Doctor Index lists ${rounded(sum.published)} doctors${sum.cities > 1 ? ` across ${sum.cities.toLocaleString("en-IN")} cities` : ""}, `
                : "The Doctor Index lists doctors "}
              checked against the state medical registers. Claim your profile to keep your practices, hours and fees correct — or create one if you are not listed yet.
            </p>
            <ul className="lp-ticks">
              <li>No fee, no subscription, no paid ranking</li>
              <li>Registration-verified badge on your profile</li>
              <li>Your personal phone and email are never shown</li>
            </ul>
          </div>
          <div className="lp-card" id="find">
            <h2>Find your profile</h2>
            <DoctorLpSearch src={src} />
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="wrap">
          <h2 className="lp-h2">What claiming gives you</h2>
          <div className="lp-benefits">
            <div className="lp-benefit">
              <h3>Correct details, on your terms</h3>
              <p>Add or remove practice locations and update days, hours and fees. Each practice shows patients the date you last confirmed it.</p>
            </div>
            <div className="lp-benefit">
              <h3>A say in your reviews</h3>
              <p>Reply once to any published review, and dispute one you believe breaches policy. No review is removed for payment — anyone&rsquo;s.</p>
            </div>
            <div className="lp-benefit">
              <h3>See how patients find you</h3>
              <p>Profile views, calls and direction requests over the last 28 days, plus appointment enquiries forwarded to your practice.</p>
            </div>
            <div className="lp-benefit">
              <h3>A profile nobody else can take</h3>
              <p>Everything starts from your council and registration number, so no one can create or control a page in your name.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section lp-alt">
        <div className="wrap">
          <h2 className="lp-h2">Three steps</h2>
          <ol className="lp-steps">
            <li>
              <span className="lp-num">1</span>
              <div>
                <h3>Find or create</h3>
                <p>Search your name above. If you are listed, tap <b>This is me</b>. If not, create a profile starting with your registration number.</p>
              </div>
            </li>
            <li>
              <span className="lp-num">2</span>
              <div>
                <h3>Sign in with a one-time code</h3>
                <p>{SMS ? "Sent to your email or mobile." : "Sent to your email."} No password to remember. Your contact details are never published.</p>
              </div>
            </li>
            <li>
              <span className="lp-num">3</span>
              <div>
                <h3>We verify, you go live</h3>
                <p>A verification officer checks your registration against the register and confirms control. Target: two business days.</p>
              </div>
            </li>
          </ol>
          <div className="lp-cta-row">
            <a className="btn solid lp-big" href="#find">Find my profile</a>
            <a className="btn lp-big" href={createHref}>Create a new profile</a>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="wrap lp-two">
          <div>
            <h2 className="lp-h2">What we will not do</h2>
            <ul className="lp-nots">
              <li>Charge for the basic profile or for verification.</li>
              <li>Sell position in search results.</li>
              <li>Import star ratings from other platforms.</li>
              <li>Remove a policy-compliant review for payment.</li>
              <li>Show your personal contact details — only the practice phone you consent to.</li>
            </ul>
            <p className="lp-small">
              Read the <Link href={paths.policy("ranking")}>ranking policy</Link>, the <Link href={paths.policy("reviews")}>review policy</Link> and{" "}
              <Link href={paths.whyThisSite()}>why this site exists</Link>.
            </p>
          </div>
          <div>
            <h2 className="lp-h2">Questions doctors ask</h2>
            <div className="lp-faq">
              {FAQ.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="lp-final">
        <div className="wrap lp-final-in">
          <h2>Your profile, correct and in your control.</h2>
          <p>Free for good. Verified against the register. Nobody pays to rank.</p>
          <div className="lp-cta-row">
            <a className="btn lp-big lp-on-dark" href="#find">Find my profile</a>
            <a className="btn lp-big lp-ghost" href={createHref}>Create a new profile</a>
          </div>
          <p className="lp-small lp-muted-dark">
            Already claimed? <Link href={paths.signIn("/dashboard")}>Sign in to your dashboard</Link>.
          </p>
        </div>
      </section>

      <div className="lp-sticky">
        <a className="btn solid" href="#find">Find my profile</a>
        <a className="btn" href={createHref}>Create profile</a>
      </div>
    </>
  );
}
