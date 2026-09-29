import Link from "next/link";

import { cancelRewardAction, issueRewardAction, rejectReferralAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ActionForm";
import { requireStaff } from "@/lib/auth/session";
import { toDisplay } from "@/lib/db/dates";
import { getDb } from "@/lib/db/client";
import * as s from "@/lib/db/schema";
import { displayName } from "@/lib/display-name";
import { rewardQueue, tribeStats } from "@/lib/services/tribe";
import { TRIBE } from "@/lib/tribe";
import { desc, eq } from "drizzle-orm";

export const metadata = { title: "Tribe rewards" };
export const dynamic = "force-dynamic";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default async function AdminTribe({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireStaff();
  const sp = await searchParams;
  const showAll = sp.all === "1";
  const [stats, queue, recent] = await Promise.all([
    tribeStats(),
    rewardQueue(showAll),
    getDb()
      .select({ id: s.referrals.id, status: s.referrals.status, kind: s.referrals.kind, channel: s.referrals.channel, createdAt: s.referrals.createdAt, reason: s.referrals.reason, referrerUserId: s.referrals.referrerUserId, dId: s.doctors.id, dName: s.doctors.name, dSpec: s.doctors.specialtyKey })
      .from(s.referrals)
      .leftJoin(s.doctors, eq(s.doctors.id, s.referrals.doctorId))
      .orderBy(desc(s.referrals.createdAt))
      .limit(40),
  ]);
  const now = Date.now();

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Tribe rewards</h1>
          <div className="sub">Every voucher passes a person. Issue only after the hold window, and only when nothing in the flags column needs an answer first. Programme settings live in the environment (TRIBE_*).</div>
        </div>
        <Link className="btn quiet" href={showAll ? "/admin/tribe" : "/admin/tribe?all=1"}>{showAll ? "Pending only" : "Show decided"}</Link>
      </div>

      <div className="tiles">
        <div className="tile"><div className="l">Referrers</div><div className="v">{stats.referrers}</div><div className="d">doctors with at least one invite acted on</div></div>
        <div className="tile"><div className="l">Referrals</div><div className="v">{stats.verified}<small>verified</small></div><div className="d">{stats.pending} pending verification</div></div>
        <div className="tile"><div className="l">Rewards due</div><div className="v">{stats.rewardsDue}</div><div className="d">past the {TRIBE.holdDays}-day hold</div></div>
        <div className="tile"><div className="l">Cash issued</div><div className="v">{inr(stats.cashIssuedInr)}</div><div className="d">cap {TRIBE.cashCapInrPerFy ? `${inr(TRIBE.cashCapInrPerFy)} per doctor per FY` : "none"}</div></div>
      </div>

      <h2 style={{ fontSize: "1.2rem", margin: "22px 0 10px" }}>Reward queue</h2>
      {queue.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)" }}>Queue is empty.</div> : null}
      {queue.map((r) => {
        const held = r.holdUntil.getTime() > now;
        return (
          <div className="qcard" id={r.id} key={r.id}>
            <div className="qh">
              <div>
                <div className="qt">{r.referrer.doctorId ? <Link href={`/admin/doctors/${r.referrer.doctorId}`}>{r.referrer.name}</Link> : r.referrer.name} · Level {r.level}</div>
                <div className="qm">{r.kind === "voucher" ? `${inr(r.amountInr)} Amazon voucher` : "recognition only (cash cap reached)"} · reached {toDisplay(r.createdAt)} · {r.referrer.email ?? "no email on file"}</div>
              </div>
              <span className={`pill ${r.status === "issued" ? "ok" : r.status === "cancelled" ? "neut" : held ? "wait" : "warn"}`}>{r.status === "pending_review" ? (held ? `held until ${toDisplay(r.holdUntil)}` : "ready to issue") : r.status}</span>
            </div>
            <dl className="kvi">
              <dt>Referrer</dt><dd>{r.referrer.verified} verified · {r.referrer.pending} pending · {inr(r.referrer.cashThisFyInr)} committed this FY</dd>
              <dt>Flags</dt>
              <dd>{r.flags.length ? <ul style={{ margin: 0, paddingLeft: 18, color: "var(--alert)" }}>{r.flags.map((f) => <li key={f}>{f}</li>)}</ul> : <span style={{ color: "var(--verified)" }}>Nothing stood out.</span>}</dd>
              {r.voucherCode ? <><dt>Voucher</dt><dd className="mono">{r.voucherCode}</dd></> : null}
              {r.note ? <><dt>Note</dt><dd>{r.note}</dd></> : null}
              {r.issuedAt ? <><dt>Issued</dt><dd>{toDisplay(r.issuedAt)}</dd></> : null}
            </dl>
            {r.status === "pending_review" ? (
              <div className="two" style={{ gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
                <ActionForm action={issueRewardAction} submitLabel={r.kind === "voucher" ? "Issue voucher" : "Confirm level"} variant="solid">
                  <input type="hidden" name="id" value={r.id} />
                  {r.kind === "voucher" ? (
                    <div className="field" style={{ marginBottom: 6 }}><label>Gift-card code as issued (emailed to the doctor)</label><input type="text" name="voucherCode" placeholder="Buy on amazon.in → Gift Cards → email delivery, paste the code" required disabled={held} /></div>
                  ) : null}
                  <div className="field" style={{ marginBottom: 6 }}><label>Note (optional)</label><input type="text" name="note" placeholder="Order id, or why issued early" /></div>
                </ActionForm>
                <ActionForm action={cancelRewardAction} submitLabel="Withdraw reward" variant="quiet">
                  <input type="hidden" name="id" value={r.id} />
                  <div className="field" style={{ marginBottom: 6 }}><label>Reason (audit-logged)</label><input type="text" name="note" placeholder="e.g. referred profiles were not real practitioners" required /></div>
                </ActionForm>
              </div>
            ) : null}
          </div>
        );
      })}

      <h2 style={{ fontSize: "1.2rem", margin: "26px 0 10px" }}>Latest referrals</h2>
      <div className="tablewrap">
        <table className="table">
          <thead><tr><th>Started</th><th>Invitee&rsquo;s profile</th><th>How</th><th>Status</th><th>Reverse</th></tr></thead>
          <tbody>
            {recent.length === 0 ? <tr><td colSpan={5} style={{ color: "var(--muted)" }}>No referrals yet.</td></tr> : null}
            {recent.map((x) => (
              <tr key={x.id}>
                <td className="mono">{toDisplay(x.createdAt)}</td>
                <td>{x.dId && x.dName && x.dSpec ? <Link href={`/admin/doctors/${x.dId}`}>{displayName({ name: x.dName, specialtyKey: x.dSpec })}</Link> : <span style={{ color: "var(--muted)" }}>submission pending</span>}</td>
                <td className="mono">{x.kind}{x.channel ? ` · ${x.channel}` : ""}</td>
                <td><span className={`pill ${x.status === "verified" ? "ok" : x.status === "pending" ? "wait" : "neut"}`}>{x.status}</span>{x.reason ? <div style={{ fontSize: 13, color: "var(--muted)" }}>{x.reason}</div> : null}</td>
                <td>
                  {x.status === "pending" || x.status === "verified" ? (
                    <ActionForm action={rejectReferralAction} submitLabel="Reverse" variant="quiet">
                      <input type="hidden" name="id" value={x.id} />
                      <input type="text" name="note" placeholder="Reason" required style={{ width: 160 }} />
                    </ActionForm>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
