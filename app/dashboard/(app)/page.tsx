import Link from "next/link";

import { getDashboardContext } from "@/lib/dashboard";
import { toDisplay } from "@/lib/db/dates";
import { GATES } from "@/lib/seo/gates";
import { listEnquiries } from "@/lib/services/cases";
import { recomputeQuality } from "@/lib/services/doctors";
import { doctorAnalytics } from "@/lib/services/events";
import { listChangesForDoctor, reconfirmSchedule } from "@/lib/services/workflow";
import { verifiedCount } from "@/lib/services/tribe";
import { progressFor, TRIBE } from "@/lib/tribe";
import { QrShare } from "@/components/QrShare";
import { EmbedBadge } from "@/components/EmbedBadge";
import { ProfileLinks } from "@/components/ProfileLinks";
import { bookingRequirementsFor, listPendingRequests } from "@/lib/services/booking";
import { BookingRequestCard } from "@/components/BookingRequestCard";
import { badgeSnippet } from "@/lib/tdi/badge";
import { registrationState } from "@/lib/verification";
import { paths, SITE } from "@/lib/site";
import { displayName } from "@/lib/display-name";

function pct(now: number, prev: number): string {
  if (!prev) return now ? "no data for the previous 28 days" : "no views recorded yet";
  const d = Math.round(((now - prev) / prev) * 100);
  return `${d >= 0 ? "+" : ""}${d}% vs previous 28 days`;
}

export default async function DashboardOverview() {
  const ctx = await getDashboardContext();
  const { doctor } = ctx;
  const [{ score, checklist }, analytics, changes, schedule, enquiries, tribeVerified, booking] = await Promise.all([
    recomputeQuality(ctx.doctorId),
    doctorAnalytics(ctx.doctorId),
    listChangesForDoctor(ctx.doctorId),
    reconfirmSchedule(ctx.doctorId),
    listEnquiries({ doctorId: ctx.doctorId, status: "new" }),
    ctx.asManager ? Promise.resolve(0) : verifiedCount(ctx.user.id),
    bookingRequirementsFor(ctx.doctorId),
  ]);
  const bookingRequests = await listPendingRequests(ctx.doctorId, ctx.asManager ? ctx.scope : []);
  const bookingDone = booking.requirements.filter((r) => r.done).length;
  const tribe = progressFor(tribeVerified);
  const actions = Object.values(analytics.actions).reduce((a, b) => a + b, 0);
  const prevActions = Object.values(analytics.actionsPrev).reduce((a, b) => a + b, 0);
  const unreplied = doctor.reviews.filter((r) => !r.reply);
  const pending = changes.filter((c) => c.status === "pending");
  const live = doctor.lifecycle === "published";
  const max = Math.max(1, ...analytics.views);

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Overview</h1>
          <div className="sub">
            Public profile is{" "}
            {live ? (
              doctor.indexable ? <span className="pill ok">live and indexed</span> : <span className="pill wait">live, not indexed</span>
            ) : (
              <span className="pill neut">{doctor.lifecycle}</span>
            )}{" "}
            · last verified {doctor.lastVerifiedOn}
          </div>
        </div>
        <Link className="btn" href={paths.doctor(doctor.slug)}>View public profile</Link>
      </div>

      {bookingRequests.length ? (
        <section style={{ marginBottom: "22px" }}>
          <div className="chart-head">
            <span className="t">Booking requests to confirm</span>
            <span className="m">{bookingRequests.length} · <Link href="/dashboard/calendar">open calendar →</Link></span>
          </div>
          {bookingRequests.slice(0, 5).map((a) => <BookingRequestCard key={a.id} a={a} />)}
          {bookingRequests.length > 5 ? <p style={{ fontSize: "13px" }}><Link href="/dashboard/calendar">{bookingRequests.length - 5} more in your calendar →</Link></p> : null}
        </section>
      ) : null}

      {live && doctor.tdiId ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-start", marginBottom: "16px" }}>
          <div style={{ flex: "1 1 300px", maxWidth: 420 }}>
            <QrShare tdiId={doctor.tdiId} name={`${displayName(doctor)}`} origin={SITE.origin} />
          </div>
          <div style={{ flex: "1 1 300px", maxWidth: 420 }}>
            <EmbedBadge
              tdiId={doctor.tdiId}
              verified={registrationState(doctor) === "verified"}
              snippet={badgeSnippet({ origin: SITE.origin, slug: doctor.slug, tdiId: doctor.tdiId, name: displayName(doctor), state: registrationState(doctor) === "verified" ? "verified" : "listed" })}
            />
          </div>
        </div>
      ) : null}

      {live ? (
        booking.unlocked ? (
          booking.enabled ? null : (
            <div className="notice good" style={{ marginBottom: "16px" }}>
              <b>Your calendar is unlocked.</b> Set your weekly hours and turn on online booking so patients can book from your profile and Google. <Link href="/dashboard/calendar">Open calendar →</Link>
            </div>
          )
        ) : (
          <div className="notice" style={{ marginBottom: "16px" }}>
            <b>Complete your profile to unlock the calendar</b> — online appointment booking, and the tools that follow. {bookingDone} of {booking.requirements.length} done. <Link href="/dashboard/calendar">See what&rsquo;s left →</Link>
          </div>
        )
      ) : null}

      {live ? <ProfileLinks slug={doctor.slug} origin={SITE.origin} name={displayName(doctor)} bookingEnabled={booking.enabled} /> : null}

      {!doctor.indexable && live ? (
        <div className="notice" style={{ marginBottom: "16px" }}>
          <b>Not in the search index yet.</b>{" "}
          {GATES.profileIndexMode === "all"
            ? `${doctor.practices.length ? "The record is marked retired" : "No practice location is on record"}. Add a practice location and the page enters the sitemap automatically.`
            : `Quality score ${score}/100 against a gate of ${GATES.profileQuality}${doctor.status === "stale" ? ", and a practice needs reconfirmation" : ""}. Complete the checklist on the right and the page enters the sitemap automatically.`}
        </div>
      ) : null}

      <div className="tiles">
        <div className="tile"><div className="l">Profile views · 28d</div><div className="v">{analytics.viewsTotal.toLocaleString("en-IN")}</div><div className={`d ${analytics.viewsTotal >= analytics.viewsPrevTotal ? "up" : "down"}`}>{pct(analytics.viewsTotal, analytics.viewsPrevTotal)}</div></div>
        <div className="tile"><div className="l">Contact actions · 28d</div><div className="v">{actions}</div><div className={`d ${actions >= prevActions ? "up" : "down"}`}>{pct(actions, prevActions)}</div></div>
        <div className="tile"><div className="l">New enquiries</div><div className="v">{enquiries.length}</div><div className="d"><Link href="/dashboard/enquiries">Awaiting a call back</Link></div></div>
        <div className="tile"><div className="l">Profile quality</div><div className="v">{score}/100</div><div className="d">Index gate is {GATES.profileQuality}. Ranking weight rises with completeness.</div></div>
      </div>

      <div className="two" style={{ marginTop: "16px" }}>
        <div className="stack">
          <div>
            <div className="chart-head"><span className="t">Needs your attention</span></div>
            <div className="checklist">
              {enquiries.length > 0 ? (
                <div className="check"><div className="box" /><div><div className="t">{enquiries.length} new appointment enquir{enquiries.length > 1 ? "ies" : "y"}</div><div className="d">Patients waiting for the practice to call back.</div></div><Link href="/dashboard/enquiries" className="pts">Open →</Link></div>
              ) : null}
              {unreplied.length > 0 ? (
                <div className="check"><div className="box" /><div><div className="t">{unreplied.length} review{unreplied.length > 1 ? "s" : ""} without a reply</div><div className="d">One privacy-safe reply per review. Replies raise your completeness score.</div></div><Link href="/dashboard/reviews" className="pts">Reply →</Link></div>
              ) : null}
              {pending.map((c) => (
                <div className="check" key={c.id}><div className="box" /><div><div className="t">Change awaiting verification</div><div className="d">{c.field} · submitted {toDisplay(c.createdAt)}</div></div><Link href="/dashboard/verification" className="pts">Track →</Link></div>
              ))}
              {schedule.filter((r) => r.overdue).map((r) => (
                <div className="check" key={r.what}><div className="box" /><div><div className="t">Overdue: {r.what}</div><div className="d">Last confirmed {toDisplay(r.lastConfirmed)}. Stale details hide the fee and cost ranking weight.</div></div><Link href="/dashboard/practices" className="pts">Confirm →</Link></div>
              ))}
              {checklist.filter((c) => !c.done).map((c) => (
                <div className="check" key={c.label}><div className="box" /><div><div className="t">{c.label}</div><div className="d">{c.detail}</div></div><Link href={c.label.includes("review") ? "/dashboard/reviews" : c.label.includes("Practice") || c.label.includes("fee") ? "/dashboard/practices" : "/dashboard/profile"} className="pts">+{c.points} pts →</Link></div>
              ))}
              {!enquiries.length && !unreplied.length && !pending.length && checklist.every((c) => c.done) && !schedule.some((r) => r.overdue) ? (
                <div className="check done"><div className="box">✓</div><div><div className="t">Nothing outstanding</div><div className="d">Everything is current. Reconfirmation prompts arrive before each due date.</div></div></div>
              ) : null}
            </div>
          </div>

          <div>
            <div className="chart-head"><span className="t">Upcoming reconfirmations</span><span className="m">so your labels keep their dates</span></div>
            <table className="table">
              <thead><tr><th>What</th><th>Last confirmed</th><th>Due by</th></tr></thead>
              <tbody>
                {schedule.map((r) => (
                  <tr key={r.what}><td>{r.what}</td><td className="mono">{toDisplay(r.lastConfirmed)}</td><td className="mono">{toDisplay(r.dueBy)} {r.overdue ? <span className="pill warn">overdue</span> : null}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="stack">
          <div className="panel pad">
            <div className="chart-head"><span className="t">Profile completeness</span><span className="m">{score}/100</span></div>
            <div className="progress"><i style={{ width: `${score}%` }} /></div>
            <div className="checklist" style={{ marginTop: "14px", border: 0 }}>
              {checklist.map((c) => (
                <div className={`check${c.done ? " done" : ""}`} key={c.label} style={{ padding: "8px 0" }}>
                  <div className="box">{c.done ? "✓" : ""}</div>
                  <div><div className="t">{c.label}</div><div className="d">{c.detail}</div></div>
                  <div className="pts">{c.points} pts</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel pad">
            <div className="chart-head"><span className="t">Views · last 28 days</span><span className="m">{analytics.viewsTotal} total</span></div>
            {analytics.viewsTotal ? (
              <div className="spark" aria-label={`Daily profile views, ${analytics.viewsTotal} in total over 28 days`}>
                {analytics.views.map((v, i) => (<i key={i} style={{ height: `${Math.round((v / max) * 100)}%` }} title={`${v} views`} />))}
              </div>
            ) : (
              <p style={{ fontSize: "13px", color: "var(--muted)" }}>No views recorded yet. Counting starts the moment the profile is published.</p>
            )}
            <div className="chart-axis"><span>28 days ago</span><span>today</span></div>
            <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "10px" }}><Link href="/dashboard/analytics">How patients find you →</Link></p>
          </div>

          {TRIBE.enabled && live && !ctx.asManager ? (
            <div className="panel pad">
              <div className="chart-head"><span className="t">Grow your tribe</span><span className="m">Level {tribe.level}</span></div>
              <div className="progress"><i style={{ width: `${tribe.pct}%` }} /></div>
              <p style={{ fontSize: "13.5px", color: "var(--muted)", marginTop: "10px" }}>
                {tribe.verified ? `${tribe.verified} colleague${tribe.verified === 1 ? "" : "s"} verified through your link` : "Your colleagues are already listed here, unclaimed."}
                {tribe.maxed ? "" : ` ${tribe.remaining} more to Level ${tribe.level + 1}${TRIBE.rewardInr ? ` and a ₹${TRIBE.rewardInr.toLocaleString("en-IN")} voucher` : ""}.`}{" "}
                <Link href="/dashboard/tribe">Invite them →</Link>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
