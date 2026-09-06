import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signOutAction } from "@/app/sign-in/actions";
import { ProfileDetailsForm } from "@/components/ProfileDetailsForm";
import { RouteMeta } from "@/components/RouteMeta";
import { requireUser } from "@/lib/auth/session";
import { userPlace } from "@/lib/data/geo";
import { getDb } from "@/lib/db/client";
import { toDisplay } from "@/lib/db/dates";
import * as s from "@/lib/db/schema";
import { absoluteUrl, paths } from "@/lib/site";

export const metadata: Metadata = { title: "My account", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const pill = (st: string) => (st === "published" || st === "approved" || st === "applied" || st === "contacted" ? "ok" : st === "rejected" || st === "removed" ? "warn" : st === "pending" || st === "submitted" || st === "in_review" || st === "new" || st === "sent" || st === "open" ? "wait" : "neut");

/**
 * The patient / general account page. Doctors and staff have their own
 * areas; this one shows a person what they have submitted and where it
 * stands, and is the only place their own contact details appear.
 */
export default async function AccountPage() {
  if (!process.env.DATABASE_URL) redirect("/sign-in");
  const user = await requireUser("/account");
  const db = getDb();
  const [reviews, enquiries, submissions, claims, corrections, managed, extra] = await Promise.all([
    db.query.reviews.findMany({ where: eq(s.reviews.authorUserId, user.id), with: { doctor: true }, orderBy: [desc(s.reviews.submittedAt)], limit: 50 }),
    db.query.enquiries.findMany({ where: eq(s.enquiries.userId, user.id), with: { doctor: true }, orderBy: [desc(s.enquiries.createdAt)], limit: 50 }),
    db.query.doctorSubmissions.findMany({ where: eq(s.doctorSubmissions.userId, user.id), orderBy: [desc(s.doctorSubmissions.createdAt)] }),
    db.query.doctorClaims.findMany({ where: eq(s.doctorClaims.userId, user.id), with: { doctor: true }, orderBy: [desc(s.doctorClaims.createdAt)] }),
    db.query.corrections.findMany({ where: eq(s.corrections.submittedByUserId, user.id), with: { doctor: true }, orderBy: [desc(s.corrections.createdAt)], limit: 50 }),
    db.select({ id: s.doctors.id }).from(s.doctors).where(eq(s.doctors.claimedByUserId, user.id)).limit(1),
    db.select({ city: s.users.city, marketingOptIn: s.users.marketingOptIn, termsAcceptedAt: s.users.termsAcceptedAt }).from(s.users).where(eq(s.users.id, user.id)).limit(1),
  ]);
  const profileRow = extra[0];
  const homePlace = await userPlace(user.localityKey, profileRow?.city ?? null);
  const isDoctor = user.role === "doctor" || managed.length > 0;
  const isStaff = user.role === "staff" && user.staffRoles.length > 0;

  return (
    <>
      <RouteMeta data={{ route: "Account (authenticated)", title: "My account", canonical: absoluteUrl(paths.account()), index: false, structuredData: "None" }} />
      <div className="wrap" style={{ paddingTop: "28px", paddingBottom: "50px", maxWidth: "860px" }}>
        <div className="dash-head">
          <div>
            <h1>My account</h1>
            <div className="sub">{user.displayName} · <span className="mono">{user.email}</span> · <span className="mono">{user.phone}</span>. Your contact details are never shown on the site.</div>
          </div>
          <form action={signOutAction}><button type="submit" className="btn quiet">Sign out</button></form>
        </div>

        {isStaff || isDoctor ? (
          <div className="notice good" style={{ marginBottom: "18px" }}>
            {isStaff ? <><b>Staff account.</b> <Link href="/admin">Open the admin console →</Link></> : null}
            {isDoctor ? <><b>Doctor account.</b> <Link href="/dashboard">Open your dashboard →</Link></> : null}
          </div>
        ) : (
          <div className="notice" style={{ marginBottom: "18px" }}>
            Are you a doctor? <Link href={paths.addDoctor()}>Create your profile</Link> or <Link href={paths.claimProfile()}>claim an existing one</Link>. Approved profiles unlock the doctor dashboard on this same account.
          </div>
        )}

        <section style={{ marginBottom: "22px" }}>
          <div className="chart-head"><span className="t">Your details</span><span className="m">{profileRow?.termsAcceptedAt ? `terms accepted ${toDisplay(profileRow.termsAcceptedAt)}` : ""}</span></div>
          <ProfileDetailsForm user={{ ...user, city: profileRow?.city ?? null, ...homePlace, marketingOptIn: profileRow?.marketingOptIn ?? false }} />
        </section>

        <section style={{ marginBottom: "22px" }}>
          <div className="chart-head"><span className="t">Your reviews</span><span className="m">{reviews.length}</span></div>
          {reviews.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)", fontSize: "13.5px" }}>None yet. Reviews can be written from any doctor&rsquo;s profile page after a consultation.</div> : null}
          {reviews.map((r) => (
            <div className="qcard" key={r.id}>
              <div className="qh">
                <div><div className="qt"><Link href={paths.doctor(r.doctor.slug)}>Dr {r.doctor.name}</Link></div><div className="qm">{r.visitMonth} · submitted {toDisplay(r.submittedAt)} · evidence {r.evidence}</div></div>
                <span className={`pill ${pill(r.status)}`}>{r.status === "redacted" ? "published (redacted)" : r.status}</span>
              </div>
              <div className="qb">“{r.status === "redacted" && r.publishedText ? r.publishedText : r.text}”</div>
              {r.status === "rejected" && r.moderationReason ? <div className="qm" style={{ marginTop: "6px" }}>Not published: {r.moderationReason}</div> : null}
            </div>
          ))}
        </section>

        <section style={{ marginBottom: "22px" }}>
          <div className="chart-head"><span className="t">Appointment enquiries</span><span className="m">{enquiries.length}</span></div>
          {enquiries.length === 0 ? <div className="panel pad" style={{ color: "var(--muted)", fontSize: "13.5px" }}>None yet.</div> : (
            <table className="table">
              <thead><tr><th>Sent</th><th>Doctor</th><th>Preferred</th><th>Status</th></tr></thead>
              <tbody>{enquiries.map((e) => <tr key={e.id}><td className="mono">{toDisplay(e.createdAt)}</td><td><Link href={paths.doctor(e.doctor.slug)}>Dr {e.doctor.name}</Link></td><td>{e.preferredDay ?? "—"}</td><td><span className={`pill ${pill(e.status)}`}>{e.status === "sent" ? "sent to practice" : e.status}</span></td></tr>)}</tbody>
            </table>
          )}
        </section>

        {submissions.length || claims.length ? (
          <section style={{ marginBottom: "22px" }}>
            <div className="chart-head"><span className="t">Profile submissions and claims</span><span className="m">{submissions.length + claims.length}</span></div>
            <table className="table">
              <thead><tr><th>When</th><th>What</th><th>Registration</th><th>Status</th></tr></thead>
              <tbody>
                {submissions.map((x) => <tr key={x.id}><td className="mono">{toDisplay(x.createdAt)}</td><td>New profile · {(x.payload as { name?: string }).name}</td><td className="mono">{x.council} {x.registrationNumber}</td><td><span className={`pill ${pill(x.status)}`}>{x.status.replace("_", " ")}</span>{x.reviewerNote ? <div style={{ fontSize: "12px", color: "var(--muted)" }}>{x.reviewerNote}</div> : null}</td></tr>)}
                {claims.map((x) => <tr key={x.id}><td className="mono">{toDisplay(x.createdAt)}</td><td>Claim · <Link href={paths.doctor(x.doctor.slug)}>Dr {x.doctor.name}</Link></td><td className="mono">{x.registrationNumber}</td><td><span className={`pill ${pill(x.status)}`}>{x.status}</span></td></tr>)}
              </tbody>
            </table>
          </section>
        ) : null}

        {corrections.length ? (
          <section>
            <div className="chart-head"><span className="t">Corrections you suggested</span><span className="m">{corrections.length}</span></div>
            <table className="table">
              <thead><tr><th>When</th><th>Doctor</th><th>Field</th><th>Status</th></tr></thead>
              <tbody>{corrections.map((c) => <tr key={c.id}><td className="mono">{toDisplay(c.createdAt)}</td><td><Link href={paths.doctor(c.doctor.slug)}>Dr {c.doctor.name}</Link></td><td>{c.field}</td><td><span className={`pill ${pill(c.status)}`}>{c.status}</span></td></tr>)}</tbody>
            </table>
          </section>
        ) : null}
      </div>
    </>
  );
}
