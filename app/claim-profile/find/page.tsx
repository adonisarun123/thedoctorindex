import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";

import { FunnelStep } from "@/components/FunnelStep";
import { GoLiveButton } from "@/components/GoLiveButton";
import { RegisterResultCta } from "@/components/RegisterResultCta";
import { RouteMeta } from "@/components/RouteMeta";
import { SPECIALTIES } from "@/lib/data/specialties";
import { STATE_NAMES } from "@/lib/nmc/classify";
import { parseQuery, searchRegister, type RegisterHit } from "@/lib/nmc/claim-search";
import { rateLimit } from "@/lib/security/rate-limit";
import { absoluteUrl } from "@/lib/site";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Find your registration",
  description: "Search the medical council registers by name or registration number, then claim your profile or create it.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/** This search covers the NMC / state medical registers only. */
const NON_NMC_NOTE = "Dentists, AYUSH practitioners and physiotherapists are on other registers that are not searchable here — create your profile with your council and number and staff check it.";

const qs = (o: Record<string, string>) => new URLSearchParams(o).toString();

/**
 * Instant onboarding: a signed-in doctor picks their entry and goes live in one
 * click (components/GoLiveButton → lib/services/instant-onboard.ts). Signed out,
 * the same button sends them through sign-in and back to these results.
 */
function actionFor(hit: RegisterHit, signedIn: boolean, back: string) {
  const a = hit.action;
  const goLive = (note: string) =>
    signedIn
      ? { cta: <GoLiveButton entry={hit.id} label="This is me — go live" />, note }
      : { cta: <RegisterResultCta href={`/sign-in?${qs({ next: back })}`} kind={`${a.kind}:sign-in`} label="This is me — sign in to go live" />, note };
  switch (a.kind) {
    case "claim-published":
      return goLive("We already hold a profile for this registration. Confirm it is you and it is yours.");
    case "claim-draft":
      return goLive("We hold a private draft built from the register. Confirm it is you and it goes live.");
    case "create":
      return goLive("No profile yet. Confirm it is you and we create it from the register.");
    case "claimed":
      return {
        cta: a.slug ? <RegisterResultCta href={`/doctor/${a.slug}`} kind="claimed" label="View the profile" solid={false} /> : null,
        note: "This profile has already been claimed. If that was not you, a verification officer decides competing claims on evidence from both sides.",
      };
    case "unavailable":
      return { cta: null, note: "This profile is not available to claim online. Contact us and we will help." };
    case "removed":
      return { cta: null, note: "The council marks this registration as removed, so it cannot be claimed here." };
  }
}

export default async function FindRegistrationPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const state = typeof sp.state === "string" && STATE_NAMES[sp.state] ? sp.state : "";
  const parsed = q ? parseQuery(q) : null;
  const user = await getSessionUser();
  const signedIn = Boolean(user?.profileComplete);
  const back = `/claim-profile/find?${qs(state ? { q, state } : { q })}`;

  let hits: RegisterHit[] = [];
  let limited = false;
  if (parsed && parsed.kind !== "invalid") {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await rateLimit(`registerfind:${ip}`, 30, 600);
    if (rl.ok) hits = await searchRegister(parsed, state || null);
    else limited = true;
  }

  const searchForm = (
          <form className="panel pad" method="get" action="/claim-profile/find" style={{ marginBottom: "18px" }}>
            <div className="field">
              <label htmlFor="q">Your name or registration number</label>
              <input id="q" name="q" type="text" defaultValue={q} placeholder="Anil Kumar Rao  ·  KMC-58412" required minLength={3} maxLength={80} />
            </div>
            <div className="field">
              <label htmlFor="state">State of registration (optional)</label>
              <select id="state" name="state" defaultValue={state}>
                <option value="">Any state</option>
                {Object.entries(STATE_NAMES).map(([slug, name]) => (
                  <option key={slug} value={slug}>{name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn solid" style={{ width: "100%" }}>Search the register</button>
          </form>
  );

  return (
    <>
      <RouteMeta
        data={{
          route: "Authenticated flow",
          title: "Find your registration | The Doctor Index",
          canonical: absoluteUrl("/claim-profile/find"),
          index: false,
          structuredData: "None",
          notes: [{ label: "Why noindex, nofollow", text: "A search over the council registers is a tool for the doctor, not a page for Google. Result pages built from arbitrary names would be thin, unbounded and a way to enumerate people." }],
        }}
      />
      <div className="wrap">
        <div className="flow">
          <span className="eyebrow">For doctors</span>
          <h1 style={{ margin: "10px 0 6px" }}>{hits.length ? "Is this you?" : "Find your registration"}</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "22px", maxWidth: "58ch" }}>
            {hits.length
              ? "These entries in the medical council register match. Pick yours and your verified profile goes live straight away — photo, clinic and bio can come later."
              : "Search the medical council register by your registration number or your name as the council records it. Pick your entry and your verified profile goes live straight away."}
          </p>
          {hits.length ? null : searchForm}

          {parsed?.kind === "invalid" ? <div className="notice alert">{parsed.reason}</div> : null}
          {limited ? <div className="notice alert">Too many searches from this connection. Please wait a few minutes and try again.</div> : null}
          {parsed && parsed.kind !== "invalid" && !limited ? <FunnelStep event="register_search" params={{ match: hits.length ? "found" : "none" }} /> : null}

          {hits.length > 0 ? (
            <div style={{ display: "grid", gap: "12px" }}>
              {hits.map((hit) => {
                const { cta, note } = actionFor(hit, signedIn, back);
                return (
                  <div className="panel pad" key={hit.id}>
                    <div style={{ fontWeight: 600, fontSize: "16px" }}>{hit.name}</div>
                    <div className="mono" style={{ fontSize: "13px", color: "var(--ink-2)", margin: "4px 0 8px" }}>{hit.council} · {hit.number}</div>
                    <div style={{ fontSize: "14px", color: "var(--ink-2)" }}>
                      {[hit.qualification, hit.qualificationYear ? String(hit.qualificationYear) : null].filter(Boolean).join(" · ") || "Qualification not recorded"}
                      {hit.specialtyKey && SPECIALTIES[hit.specialtyKey] ? ` · ${SPECIALTIES[hit.specialtyKey].name}` : ""}
                    </div>
                    <div className="hint" style={{ margin: "10px 0 12px" }}>{note}</div>
                    {cta}
                  </div>
                );
              })}
              {hits.length >= 10 ? <div className="hint">Showing the first 10. Add your state or use your registration number to narrow it down.</div> : null}
              <div className="notice">
                <b>None of these is you?</b> Search again above with your registration number, or{" "}
                <Link href="/add-doctor?manual=1&src=find">fill in the full form</Link>. {NON_NMC_NOTE}
              </div>
            </div>
          ) : parsed && parsed.kind !== "invalid" && !limited ? (
            <div className="notice">
              <b>No entry found.</b> The register spells some names differently from how you write them (initials, a surname first). Try your registration number, or{" "}
              <Link href="/add-doctor?manual=1&src=find">fill in the full form with your registration</Link>; a verification officer checks it against the register. {NON_NMC_NOTE}
            </div>
          ) : null}
          {hits.length ? <div style={{ marginTop: "18px" }}>{searchForm}</div> : null}
        </div>
      </div>
    </>
  );
}
