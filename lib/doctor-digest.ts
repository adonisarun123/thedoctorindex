import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Monthly doctor digest — the pure half: what the email says and which
 * suggestions a doctor gets. The database side is lib/services/doctor-digest.ts.
 *
 * Rules:
 *  - Plain text, counts only. Never a patient's identity or enquiry content.
 *  - Never "you are ranked #n" or comparisons with named colleagues.
 *  - At most three next steps, in a fixed order of value, and only ones the
 *    doctor can act on from the dashboard in a few minutes.
 *  - A month with no views still sends (that is the most useful month to hear
 *    from us), but says so plainly instead of dressing it up.
 */

export interface DigestFacts {
  displayName: string;
  viewsTotal: number;
  viewsPrevTotal: number;
  actionsTotal: number;
  actionsPrevTotal: number;
  enquiries: number;
  newEnquiries: number;
  topTerms: string[];
  hasPhoto: boolean;
  aboutWords: number;
  publications: number;
  articles: number;
  pendingReviewReplies: number;
  hasTdiId: boolean;
}

export interface DigestLinks {
  dashboard: string;
  profile: string;
  unsubscribe: string;
}

function delta(now: number, before: number): string {
  if (!before) return "";
  const d = now - before;
  if (d === 0) return " (same as the 28 days before)";
  return ` (${d > 0 ? "up" : "down"} ${Math.abs(d)} on the 28 days before)`;
}

/** Up to three things worth doing next, most valuable first. */
export function nextSteps(f: DigestFacts, links: Pick<DigestLinks, "dashboard">): string[] {
  const d = links.dashboard.replace(/\/$/, "");
  const out: string[] = [];
  if (f.newEnquiries) out.push(`Reply to ${f.newEnquiries} appointment ${f.newEnquiries === 1 ? "enquiry" : "enquiries"} waiting for you: ${d}/enquiries`);
  if (f.pendingReviewReplies) out.push(`Reply to ${f.pendingReviewReplies} patient ${f.pendingReviewReplies === 1 ? "review" : "reviews"}: ${d}/reviews`);
  if (!f.hasPhoto) out.push(`Add a photograph so patients recognise you at the clinic: ${d}/profile`);
  if (f.aboutWords < 40) out.push(`Write two or three lines about what you treat and how you work: ${d}/profile`);
  if (!f.articles) out.push(`Write your first article for patients — it is published under your name with your registration number: ${d}/articles/new`);
  if (!f.publications) out.push(`Add your papers from PubMed or ORCID in a couple of clicks: ${d}/publications`);
  if (f.hasTdiId) out.push(`Put the "verified" badge on your clinic website: ${d}`);
  return out.slice(0, 3);
}

export function composeDigest(f: DigestFacts, links: DigestLinks, monthLabel: string): { subject: string; text: string } {
  const views = f.viewsTotal;
  const subject = views
    ? `Your profile was viewed ${views.toLocaleString("en-IN")} ${views === 1 ? "time" : "times"} — ${monthLabel}`
    : `Your Doctor Index profile — ${monthLabel}`;
  const lines: string[] = [`Hello ${f.displayName},`, ""];
  if (views) {
    lines.push(`In the last 28 days your profile was viewed ${views.toLocaleString("en-IN")} ${views === 1 ? "time" : "times"}${delta(views, f.viewsPrevTotal)}.`);
    lines.push(`${f.actionsTotal} ${f.actionsTotal === 1 ? "visitor" : "visitors"} called, asked for directions, sent an enquiry or opened your website${delta(f.actionsTotal, f.actionsPrevTotal)}.`);
    if (f.enquiries) lines.push(`${f.enquiries} appointment ${f.enquiries === 1 ? "enquiry" : "enquiries"} came through the site.`);
    if (f.topTerms.length) lines.push(`People found you searching for: ${f.topTerms.slice(0, 4).join(", ")}.`);
  } else {
    lines.push("Nobody opened your profile in the last 28 days. A fuller profile gives search engines and patients more to find; the steps below take a few minutes each.");
  }
  const steps = nextSteps(f, links);
  if (steps.length) {
    lines.push("", "Worth doing next:");
    steps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  }
  lines.push(
    "",
    `Full numbers: ${links.dashboard.replace(/\/$/, "")}/analytics`,
    `Your public profile: ${links.profile}`,
    "",
    "Counts only — we never record who viewed your profile.",
    "",
    "— The Doctor Index",
    "",
    `Stop these monthly emails: ${links.unsubscribe}`,
  );
  return { subject, text: lines.join("\n") };
}

/** "October 2026" for a date in India. */
export function monthLabel(now: Date): string {
  return now.toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
}

/** "2026-10" — one digest per doctor per period. */
export function periodKey(now: Date): string {
  const ist = new Date(now.getTime() + 330 * 60_000);
  return `${ist.getUTCFullYear()}-${String(ist.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function digestToken(userId: string, secret: string): string {
  return createHmac("sha256", secret).update(`doctor-digest:${userId}`).digest("base64url").slice(0, 32);
}

export function verifyDigestToken(userId: string, token: string, secret: string): boolean {
  const want = Buffer.from(digestToken(userId, secret));
  const got = Buffer.from(token);
  return want.length === got.length && timingSafeEqual(want, got);
}

export function digestUnsubscribeUrl(siteUrl: string, userId: string, secret: string): string {
  return `${siteUrl.replace(/\/$/, "")}/reminders/digest?u=${userId}&t=${digestToken(userId, secret)}`;
}
