import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";

import { FunnelStep } from "@/components/FunnelStep";
import { RegisterResultCta } from "@/components/RegisterResultCta";
import { RouteMeta } from "@/components/RouteMeta";
import { SPECIALTIES } from "@/lib/data/specialties";
import { STATE_NAMES } from "@/lib/nmc/classify";
import { parseQuery, searchRegister, type RegisterHit } from "@/lib/nmc/claim-search";
import { rateLimit } from "@/lib/security/rate-limit";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Find your registration",
  description: "Search the medical council registers by name or registration number, then claim your profile or create it.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const qs = (o: Record<string, string>) => new URLSearchParams(o).toString();

function actionFor(hit: RegisterHit) {
  const a = hit.action;
  switch (a.kind) {
    case "claim-published":
      return { cta: <RegisterResultCta href={`/claim-profile?${qs({ profile: a.slug, src: "find" })}`} kind="claim-published" label="Claim this profile" />, note: "A profile already exists for this registration." };
    case "claim-draft":
      return { cta: <RegisterResultCta href={`/claim-profile?${qs({ registration: hit.number, council: hit.council, src: "find" })}`} kind="claim-draft" label="Claim this profile" />, note: "We hold a private draft built from the register. Claiming it lets you review it before it is shown." };
    case "create":
      return { cta: <RegisterResultCta href={`/add-doctor?${qs({ registration: hit.number, council: hit.council, src: "find" })}`} kind="create" label="Create my profile" />, note: "No profile exists yet for this registration." };
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

  let hits: RegisterHit[] = [];
  let limited = false;
  if (parsed && parsed.kind !== "invalid") {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await rateLimit(`registerfind:${ip}`, 30, 600);
    if (rl.ok) hits = await searchRegister(parsed, state || null);
    else limited = true;
  }

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
          <h1 style={{ margin: "10px 0 6px" }}>Find your registration</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "22px", maxWidth: "58ch" }}>
            Search the medical council registers by your name as the council records it, or by your registration number. Then claim the profile we hold for you, or create it.
          </p>
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

          {parsed?.kind === "invalid" ? <div className="notice alert">{parsed.reason}</div> : null}
          {limited ? <div className="notice alert">Too many searches from this connection. Please wait a few minutes and try again.</div> : null}
          {parsed && parsed.kind !== "invalid" && !limited ? <FunnelStep event="register_search" params={{ match: hits.length ? "found" : "none" }} /> : null}

          {hits.length > 0 ? (
            <div style={{ display: "grid", gap: "12px" }}>
              {hits.map((hit) => {
                const { cta, note } = actionFor(hit);
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
            </div>
          ) : parsed && parsed.kind !== "invalid" && !limited ? (
            <div className="notice">
              <b>No entry found.</b> The register spells some names differently from how you write them (initials, a surname first). Try your registration number, or{" "}
              <Link href="/add-doctor?src=find">create a profile with your registration</Link>; a verification officer checks it against the register.
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
