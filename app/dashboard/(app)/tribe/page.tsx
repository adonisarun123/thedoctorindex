import Link from "next/link";
import { redirect } from "next/navigation";

import { TribeShare } from "@/components/TribeShare";
import { getDashboardContext } from "@/lib/dashboard";
import { toDisplay } from "@/lib/db/dates";
import { displayName } from "@/lib/display-name";
import { colleaguesToInvite, leaderboard, tribeSummary } from "@/lib/services/tribe";
import { SITE, paths } from "@/lib/site";
import { progressFor, tierName, TRIBE } from "@/lib/tribe";

export const metadata = { title: "Grow your tribe" };

const STATUS: Record<string, { label: string; cls: string }> = {
  verified: { label: "verified", cls: "ok" },
  pending: { label: "in progress", cls: "wait" },
  rejected: { label: "not counted", cls: "neut" },
  clawed_back: { label: "reversed", cls: "neut" },
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default async function TribePage() {
  const ctx = await getDashboardContext();
  if (!TRIBE.enabled) redirect("/dashboard");
  const me = displayName(ctx.doctor);

  if (ctx.asManager) {
    return (
      <>
        <div className="dash-head"><div><h1>Grow your tribe</h1><div className="sub">Invite colleagues, earn levels.</div></div></div>
        <div className="notice"><b>This page belongs to the doctor.</b> Referral links are personal to the practitioner whose profile this is; a clinic manager cannot invite on their behalf.</div>
      </>
    );
  }

  const [summary, colleagues, leaders] = await Promise.all([tribeSummary(ctx.user.id), colleaguesToInvite(ctx.doctorId), leaderboard(10, ctx.user.id)]);
  const p = progressFor(summary.verified);
  const issued = summary.rewards.filter((r) => r.status === "issued");
  const vouchersDue = summary.rewards.filter((r) => r.status === "pending_review" && r.kind === "voucher");

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Grow your tribe</h1>
          <div className="sub">
            <span className="pill ok">Level {p.level}</span> {tierName(p.level)} · {summary.verified} verified colleague{summary.verified === 1 ? "" : "s"}
          </div>
        </div>
        <Link className="btn" href="#share">Invite a colleague</Link>
      </div>

      <div className="tiles">
        <div className="tile"><div className="l">Level</div><div className="v">{p.level}<small>of {TRIBE.maxLevel}</small></div><div className="d">{p.maxed ? "Top level reached." : `${p.remaining} more to Level ${p.level + 1}`}</div></div>
        <div className="tile"><div className="l">Verified colleagues</div><div className="v">{summary.verified}</div><div className="d">Profile live and register-checked</div></div>
        <div className="tile"><div className="l">In progress</div><div className="v">{summary.pending}</div><div className="d">Claimed, awaiting verification</div></div>
        <div className="tile"><div className="l">Vouchers</div><div className="v">{inr(summary.cashIssuedInr)}</div><div className="d">{vouchersDue.length ? `${inr(summary.cashPendingInr)} in review` : "issued so far"}</div></div>
      </div>

      <div className="panel pad" style={{ marginTop: 16 }}>
        <div className="chart-head"><span className="t">Progress to Level {p.maxed ? p.level : p.level + 1}</span><span className="m">{p.verified} / {p.nextAt}</span></div>
        <div className="progress"><i style={{ width: `${p.pct}%` }} /></div>
        <p style={{ fontSize: 14.5, color: "var(--muted)", marginTop: 10 }}>
          Every {TRIBE.levelSize} colleagues whose profile goes live through your link is a level, up to Level {TRIBE.maxLevel}.
          {TRIBE.rewardInr > 0 ? ` Each level earns a ${inr(TRIBE.rewardInr)} Amazon gift voucher${TRIBE.cashCapInrPerFy > 0 ? `, up to ${inr(TRIBE.cashCapInrPerFy)} in a financial year` : ""}.` : ""}
          {" "}A colleague counts once their profile is published under their own account and their registration has been checked against the register — the same bar every profile here has to clear.
        </p>
      </div>

      <div className="two" style={{ marginTop: 16 }}>
        <div className="stack">
          <div className="panel pad" id="share">
            <div className="eyebrow">Your invite</div>
            <p style={{ margin: "4px 0 12px", fontSize: 15 }}>Code <span className="mono">{summary.code}</span>. Send the link any way you like; the message names you and says nothing about rewards.</p>
            <TribeShare code={summary.code} origin={SITE.origin} inviterName={me} />
          </div>

          {colleagues.length ? (
            <div className="panel pad">
              <div className="chart-head"><span className="t">Colleagues already listed, not yet claimed</span><span className="m">{colleagues.reduce((a, g) => a + g.doctors.length, 0)}</span></div>
              <p style={{ fontSize: 14.5, color: "var(--muted)", margin: "0 0 10px" }}>These doctors practise where you do and have a profile nobody has claimed. An invite that names them and opens their own page is the one most likely to be acted on.</p>
              {colleagues.map((g) => (
                <div key={g.facilityId} style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{g.facility}</div>
                  <div className="checklist">
                    {g.doctors.map((d) => (
                      <div key={d.slug} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px 16px", padding: "10px 14px", borderBottom: "1px solid var(--hair)" }}>
                        <div style={{ flex: "1 1 180px", fontSize: 15.5, fontWeight: 600 }}><Link href={paths.doctor(d.slug)} target="_blank">{displayName(d)}</Link></div>
                        <div style={{ flex: "0 0 auto" }}><TribeShare code={summary.code} origin={SITE.origin} inviterName={me} colleague={{ slug: d.slug, name: d.name }} compact /></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

        </div>

        <div className="stack">
          <div className="panel pad">
            <div className="chart-head"><span className="t">Rewards</span><span className="m">{issued.length} issued</span></div>
            {summary.rewards.length ? (
              <table className="table">
                <thead><tr><th>Level</th><th>Reward</th><th>Status</th></tr></thead>
                <tbody>
                  {summary.rewards.map((r) => (
                    <tr key={r.id}>
                      <td className="mono">{r.level}</td>
                      <td>{r.kind === "voucher" ? `${inr(r.amountInr)} Amazon voucher` : "Recognition"}{r.status === "issued" && r.voucherCode ? <div className="mono" style={{ fontSize: 13.5, marginTop: 3 }}>{r.voucherCode}</div> : null}</td>
                      <td>
                        {r.status === "issued" ? <span className="pill ok">issued {r.issuedAt ? toDisplay(r.issuedAt) : ""}</span> : r.status === "cancelled" ? <span className="pill neut">withdrawn</span> : <span className="pill wait">in review until {toDisplay(r.holdUntil)}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ fontSize: 14.5, color: "var(--muted)", margin: 0 }}>Your first voucher is released when the tenth colleague&rsquo;s profile is verified.</p>
            )}
          </div>

          <div className="panel pad">
            <div className="chart-head"><span className="t">Leaderboard</span><span className="m">verified colleagues</span></div>
            {leaders.length ? (
              <table className="table">
                <thead><tr><th>#</th><th>Doctor</th><th className="num">Tribe</th><th className="num">Level</th></tr></thead>
                <tbody>
                  {leaders.map((l) => (
                    <tr key={l.rank} style={l.you ? { fontWeight: 600 } : undefined}>
                      <td className="mono">{l.rank}</td>
                      <td>{l.name}{l.city ? <span style={{ color: "var(--muted)" }}> · {l.city}</span> : null}{l.you ? " (you)" : ""}</td>
                      <td className="num">{l.verified}</td>
                      <td className="num">{l.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ fontSize: 14.5, color: "var(--muted)", margin: 0 }}>No verified referrals yet across the index. First name on this board is still open.</p>
            )}
          </div>

          <div className="panel pad">
            <div className="eyebrow">How it is counted</div>
            <ul style={{ fontSize: 14.5, color: "var(--ink-2)", margin: "6px 0 0", paddingLeft: 18 }}>
              <li>A colleague counts once: one credit per doctor, one per account, whoever invited them first.</li>
              <li>Only a profile that is published under the colleague&rsquo;s own account and register-checked counts. Sign-ups, invites and pending claims do not.</li>
              <li>Vouchers are released after a {TRIBE.holdDays}-day review; a profile later suspended or merged away reverses the credit.</li>
              <li>Inviting yourself, or profiles you control, earns nothing.</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="chart-head"><span className="t">Your tribe</span><span className="m">{summary.members.length} invited</span></div>
        {summary.members.length ? (
          <div className="tablewrap">
            <table className="table">
              <thead><tr><th>Colleague</th><th>How</th><th>Started</th><th>Status</th></tr></thead>
              <tbody>
                {summary.members.map((m) => (
                  <tr key={m.id}>
                    <td>{m.doctorName ? (m.doctorSlug ? <Link href={paths.doctor(m.doctorSlug)}>{m.doctorName}</Link> : m.doctorName) : <span style={{ color: "var(--muted)" }}>New profile, awaiting review</span>}</td>
                    <td className="mono">{m.kind === "claim" ? "claimed" : "created"}{m.channel ? ` · ${m.channel}` : ""}</td>
                    <td className="mono">{toDisplay(m.createdAt)}</td>
                    <td><span className={`pill ${STATUS[m.status]?.cls ?? "neut"}`}>{STATUS[m.status]?.label ?? m.status}</span>{m.status === "pending" && m.reason ? <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>{m.reason}</div> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="panel pad" style={{ color: "var(--muted)", fontSize: 15 }}>Nobody yet. The first ten are the hardest; start with the colleagues listed above.</div>
        )}
      </div>
    </>
  );
}
