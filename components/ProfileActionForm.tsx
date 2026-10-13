"use client";

import Link from "next/link";
import { useActionState } from "react";

import { correctionAction, enquiryAction, reportAction, submitReviewAction, type ActionState } from "@/app/doctor/[slug]/actions";
import { PlacePicker } from "@/components/PlacePicker";
import { paths } from "@/lib/site";
import { displayName } from "@/lib/display-name";
import { MIN_CORE_RATED, type ReviewQuestion } from "@/lib/reviews/score";

export type ActionKind = "review" | "report" | "correct" | "enquire";

interface DoctorSummary {
  slug: string;
  name: string;
  specialtyOne: string;
  practices: Array<{ id?: string; facility: string; locality: string }>;
  /** What an enquiry shares with the practice — the signed-in account's name and mobile. */
  contact?: { name: string; phone: string } | null;
  reviews?: Array<{ id: string; author: string; visitMonth: string }>;
}

const ACTIONS = { review: submitReviewAction, report: reportAction, correct: correctionAction, enquire: enquiryAction } as const;

/** What the review form still needs from a new account, and the booking it is tied to (kind="review"). */
export interface ReviewContext {
  /** Name, contact and area not yet on the account: asked on this form, below the ratings. */
  needsDetails: boolean;
  phoneKnown: boolean;
  emailKnown: boolean;
  /** The reviewer's TDi booking with this doctor that has passed: the review is "Verified visit" with nothing to upload. */
  booking: { ref: string; when: string; month: string } | null;
}

/**
 * The four public actions on a profile. Each posts to a server action that
 * writes the real row; success renders the next step the back office takes.
 */
export function ProfileActionForm({
  kind,
  doctor,
  initialPractice = 0,
  about,
  signedIn,
  questions = [],
  review = null,
}: {
  kind: ActionKind;
  doctor: DoctorSummary;
  initialPractice?: number;
  about?: string;
  signedIn: boolean;
  /** The review questionnaire for this doctor's speciality (kind="review" only). */
  questions?: ReviewQuestion[];
  review?: ReviewContext | null;
}) {
  const [state, act, pending] = useActionState<ActionState, FormData>(ACTIONS[kind], {});

  if (state.ok) {
    return (
      <div className="panel pad">
        <div className="notice good" style={{ marginBottom: "16px" }}>
          <b>Done.</b> {state.message}
        </div>
        <div className="flowacts">
          <Link className="btn quiet" href={paths.doctor(doctor.slug)}>
            Back to {displayName(doctor)}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="panel pad" action={act}>
      <input type="hidden" name="slug" value={doctor.slug} />
      {state.error ? (
        <div className="notice alert" style={{ marginBottom: "16px" }}>
          {state.error}
        </div>
      ) : null}

      {kind === "review" ? <ReviewFields signedIn={signedIn} questions={questions} ctx={review} /> : null}
      {kind === "report" ? <ReportFields about={about} reviews={doctor.reviews ?? []} /> : null}
      {kind === "correct" ? <CorrectFields /> : null}
      {kind === "enquire" ? <EnquireFields doctor={doctor} initialPractice={initialPractice} signedIn={signedIn} /> : null}

      <div className="flowacts">
        <Link className="btn quiet" href={paths.doctor(doctor.slug)}>
          Cancel
        </Link>
        <button type="submit" className="btn solid" style={{ flex: 1 }} disabled={pending}>
          {pending
            ? "Sending…"
            : kind === "review"
              ? "Submit for moderation"
              : kind === "report"
                ? "Send report"
                : kind === "correct"
                  ? "Submit correction"
                  : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------------- */

function Stars({ name, label }: { name: string; label: string }) {
  return (
    <div className="stars" role="radiogroup" aria-label={label}>
      {[5, 4, 3, 2, 1].map((n) => (
        <label key={n} title={`${n} of 5`}>
          <input type="radio" name={name} value={n} />★
        </label>
      ))}
    </div>
  );
}

/** Last twelve months by name, then a catch-all. Visit month is approximate on purpose. */
function recentMonths(): string[] {
  const now = new Date();
  const out: string[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(d.toLocaleString("en-IN", { month: "long", year: "numeric" }));
  }
  out.push("More than a year ago");
  return out;
}

function QuestionRow({ q }: { q: ReviewQuestion }) {
  return (
    <div className="dimrow" style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ flex: "1 1 220px", minWidth: 0 }}>
        <div className="l">{q.label}</div>
        {q.help ? <div className="h">{q.help}</div> : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "0 0 auto" }}>
        <Stars name={`q:${q.key}`} label={q.label} />
        <label style={{ fontSize: "12px", color: "var(--muted)", display: "inline-flex", gap: "4px", alignItems: "center" }}>
          <input type="radio" name={`q:${q.key}`} value="na" />
          N/A
        </label>
      </div>
    </div>
  );
}

function ReviewFields({ signedIn, questions, ctx }: { signedIn: boolean; questions: ReviewQuestion[]; ctx: ReviewContext | null }) {
  const months = recentMonths();
  const core = questions.filter((q) => q.specialtyKey === null);
  const specific = questions.filter((q) => q.specialtyKey !== null);
  const booking = ctx?.booking ?? null;
  const defaultMonth = booking && months.includes(booking.month) ? booking.month : months[0];
  return (
    <>
      {booking ? <input type="hidden" name="booking" value={booking.ref} /> : null}
      <div className="eyebrow" style={{ marginBottom: "10px" }}>{signedIn ? "Step 2 of 2 · Your experience" : "Sign in first"}</div>
      {booking ? (
        <div className="notice good" style={{ marginBottom: "18px" }}>
          <b>Verified visit.</b> This review is tied to your booking <span className="mono">{booking.ref}</span> on {booking.when}, so it carries the badge
          automatically — nothing to upload. Rate the visit and add a line if you like; a person reads every review before it appears.
        </div>
      ) : (
        <div className="notice" style={{ marginBottom: "18px" }}>
          <b>Two minutes.</b> Rate the visit and add a line if you like. A person reads every review before it appears. You are shown as your
          first name and initial (&ldquo;Anita S.&rdquo;) unless you choose to hide it. Add your prescription or bill if you have it and the review carries a <b>Verified visit</b> badge.
        </div>
      )}

      <div className="field">
        <label>Who was the consultation for?</label>
        <div className="seg">
          <label><input type="radio" name="who" value="self" defaultChecked />Myself</label>
          <label><input type="radio" name="who" value="family" />A family member</label>
        </div>
      </div>
      <div className="two">
        <div className="field">
          <label>Consultation mode</label>
          <div className="seg">
            <label><input type="radio" name="mode" value="In person" defaultChecked />In person</label>
            <label><input type="radio" name="mode" value="Online" />Online</label>
          </div>
        </div>
        <div className="field">
          <label htmlFor="month">Approximate month of visit</label>
          <select id="month" name="month" defaultValue={defaultMonth}>
            {months.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label>Rate your visit</label>
        <div className="panel" style={{ padding: "4px 14px" }}>
          {core.map((q) => (
            <QuestionRow key={q.key} q={q} />
          ))}
        </div>
        <div className="hint">
          Rate at least {Math.min(MIN_CORE_RATED, core.length)} of these. Choose N/A where a question does not apply, for example hygiene after an online consultation.
        </div>
      </div>

      {specific.length ? (
        <div className="field">
          <label>For this speciality (optional)</label>
          <div className="panel" style={{ padding: "4px 14px" }}>
            {specific.map((q) => (
              <QuestionRow key={q.key} q={q} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="text">Anything else? (optional)</label>
        <textarea id="text" name="text" maxLength={2000} placeholder="A sentence or two about your visit. First-hand only. Please leave out diagnoses, report contents, phone numbers and addresses." />
      </div>

      {!booking ? (
        <div className="field">
          <label htmlFor="evidence">Prescription or bill from this visit (optional, private) — earns the Verified visit badge</label>
          <input id="evidence" name="evidence" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" />
          <div className="hint">
            A photo or PDF showing the doctor&rsquo;s name and the date; cover the medicines and any diagnosis. A bill or appointment
            confirmation works too. One moderator sees it, it is deleted as soon as your review is decided, and it is never published.
            Skip it and your review still goes up after moderation, without the badge. Visits booked through The Doctor Index are verified automatically.
          </div>
        </div>
      ) : null}

      {ctx?.needsDetails ? <ReviewerDetails phoneKnown={ctx.phoneKnown} emailKnown={ctx.emailKnown} /> : null}

      <label className="consent">
        <input type="checkbox" name="anonymous" />
        Hide my name — show me as &ldquo;Reviewer A.S.&rdquo; instead of my first name and initial. (A moderator still sees your account; the doctor never sees your full name either way.)
      </label>

      <label className="consent">
        <input type="checkbox" name="attest" required />
        This is my own first-hand experience. I am not the doctor, their staff, or a competitor, and I was not
        offered anything for this review.
      </label>
    </>
  );
}

/**
 * Asked once, on the same page as the ratings, when the account is new:
 * name (what the public label is made from), a way to reach the person about
 * the review, and where they live. Never shown on the site.
 */
function ReviewerDetails({ phoneKnown, emailKnown }: { phoneKnown: boolean; emailKnown: boolean }) {
  return (
    <div className="panel" style={{ padding: "14px 16px", marginBottom: "16px" }}>
      <div className="eyebrow" style={{ marginBottom: "8px" }}>About you · asked once, never published</div>
      <div className="field">
        <label htmlFor="fullName">Your full name</label>
        <input id="fullName" name="fullName" type="text" autoComplete="name" required minLength={3} maxLength={80} placeholder="As on your ID" />
        <div className="hint">Shown as first name and initial only, e.g. &ldquo;Anita S.&rdquo;</div>
      </div>
      <div className="two">
        {!phoneKnown ? (
          <div className="field">
            <label htmlFor="phone">Mobile number</label>
            <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+91 98765 43210" />
            <div className="hint">Only if a moderator needs to reach you about this review.</div>
          </div>
        ) : null}
        {!emailKnown ? (
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
            <div className="hint">To tell you when the review is published.</div>
          </div>
        ) : null}
      </div>
      <div className="field">
        <PlacePicker level="locality" idPrefix="home" labels={{ state: "Your state", city: "Your city / district", locality: "Your locality (optional)" }} />
        <div className="hint">Where you live. Used to order results near you; never shown.</div>
      </div>
      <label className="consent" style={{ marginBottom: 0 }}>
        <input type="checkbox" name="terms" required />
        I accept the <Link href={paths.policy("terms")} target="_blank">terms of use</Link> and <Link href={paths.policy("privacy")} target="_blank">privacy notice</Link>.
      </label>
    </div>
  );
}

function ReportFields({ about, reviews }: { about?: string; reviews: Array<{ id: string; author: string; visitMonth: string }> }) {
  const isReview = about === "review";
  // "takedown": the doctor on the page wants it unpublished. No account needed;
  // a verification officer confirms with them directly and takes it down.
  const takedown = about === "takedown";
  return (
    <>
      <input type="hidden" name="about" value={isReview ? "review" : "profile"} />
      <div className="eyebrow" style={{ marginBottom: "10px" }}>{isReview ? "Report a review" : takedown ? "This page is about you" : "Report this profile"}</div>
      {takedown ? (
        <div className="notice" style={{ marginBottom: "16px" }}>
          <b>You do not need an account for this.</b> Tell us how to reach you and a verification officer confirms it is you — usually by calling the practice number on the register or on this page — and unpublishes the profile. Identity reports get a first look within 4 hours. If you would rather keep the page and correct it, claiming it takes one confirmation against the council register.
        </div>
      ) : null}
      {isReview ? (
        <div className="field">
          <label htmlFor="reviewId">Which review?</label>
          <select id="reviewId" name="reviewId" required defaultValue="">
            <option value="" disabled>Choose the review</option>
            {reviews.map((r) => (
              <option key={r.id} value={r.id}>
                {r.author} · {r.visitMonth}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div className="field">
        <label htmlFor="reason">What is wrong?</label>
        <select id="reason" name="reason" required defaultValue={takedown ? "This page is about me — unpublish it" : ""}>
          <option value="" disabled>Choose one</option>
          {isReview ? (
            <>
              <option>It reveals health or personal information</option>
              <option>It is not first-hand (staff, competitor, incentivised)</option>
              <option>It contains a serious allegation that needs escalation</option>
              <option>It is abusive or threatening</option>
              <option>Something else</option>
            </>
          ) : (
            <>
              <option>This profile impersonates someone</option>
              <option>The doctor has retired or is no longer practising</option>
              <option>The doctor is deceased</option>
              <option>Registration or qualification details are wrong</option>
              <option>The practice address or contact is wrong</option>
              {takedown ? (
                <>
                  <option>This page is about me — unpublish it</option>
                  <option>This page is about me — correct it (I will claim it)</option>
                </>
              ) : (
                <option>This page is about me and I want it reviewed</option>
              )}
            </>
          )}
        </select>
        <div className="hint">Identity and safety reports get an initial assessment within 4 hours; ordinary reports within 48 hours.</div>
      </div>
      <div className="field">
        <label htmlFor="detail">Details</label>
        <textarea id="detail" name="detail" placeholder="What you saw, and anything that helps us verify it." />
      </div>
      <div className="field">
        <label htmlFor="contact">How can we reach you?{takedown ? "" : " (optional)"}</label>
        <input id="contact" name="contact" type="text" required={takedown} placeholder={takedown ? "Your mobile or email — an officer calls or writes to confirm it is you" : "Email or mobile — for follow-up only, never published"} />
      </div>
    </>
  );
}

function CorrectFields() {
  return (
    <>
      <div className="eyebrow" style={{ marginBottom: "10px" }}>Suggest a correction</div>
      <div className="notice good" style={{ marginBottom: "18px" }}>
        <b>Corrections are targeted within 3 business days.</b> Changes to name, registration, qualification or
        speciality go back through verification before publication.
      </div>
      <div className="field">
        <label htmlFor="field">Which field?</label>
        <select id="field" name="field" required defaultValue="">
          <option value="" disabled>Choose one</option>
          <option>Practice address</option>
          <option>Consulting hours</option>
          <option>Phone number</option>
          <option>Consultation fee</option>
          <option>Languages</option>
          <option>Services listed</option>
          <option>Name, registration, qualification or speciality (re-verified)</option>
          <option>Something else</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="current">What it currently says</label>
        <input id="current" name="current" type="text" placeholder="Copy the incorrect value" />
      </div>
      <div className="field">
        <label htmlFor="proposed">What it should say</label>
        <input id="proposed" name="proposed" type="text" required placeholder="The correct value" />
      </div>
      <div className="field">
        <label htmlFor="source">How do you know? (optional)</label>
        <textarea id="source" name="source" placeholder="A visit, a call to the practice, a document — anything that helps us confirm it." />
      </div>
      <div className="field">
        <label>Are you the doctor or their staff?</label>
        <div className="seg">
          <label><input type="radio" name="isdoc" value="no" defaultChecked />No, a patient or member of the public</label>
          <label><input type="radio" name="isdoc" value="yes" />Yes</label>
        </div>
        <div className="hint">
          If yes, <Link href={paths.claimProfile()}>claiming the profile</Link> lets you edit these fields directly.
        </div>
      </div>
      <div className="field">
        <label htmlFor="contact">How can we reach you? (optional)</label>
        <input id="contact" name="contact" type="text" placeholder="Email or mobile — never published" />
      </div>
    </>
  );
}

function EnquireFields({ doctor, initialPractice, signedIn }: { doctor: DoctorSummary; initialPractice: number; signedIn: boolean }) {
  return (
    <>
      <div className="eyebrow" style={{ marginBottom: "10px" }}>{signedIn ? "Appointment enquiry" : "Sign in first"}</div>
      <div className="notice" style={{ marginBottom: "18px" }}>
        <b>This is an enquiry, not a booking.</b> The practice receives it and contacts you to confirm a time. We do
        not hold the practice&rsquo;s live calendar.
      </div>
      <div className="field">
        <label htmlFor="practice">Practice</label>
        <select id="practice" name="practice" defaultValue={doctor.practices[initialPractice]?.id ?? doctor.practices[0]?.id ?? ""}>
          {doctor.practices.map((p) => (
            <option key={p.id ?? p.facility} value={p.id ?? ""}>
              {p.facility}, {p.locality}
            </option>
          ))}
        </select>
      </div>
      <div className="two">
        <div className="field">
          <label htmlFor="day">Preferred day</label>
          <select id="day" name="day" defaultValue="Any day this week">
            {["Any day this week", "Weekday morning", "Weekday evening", "Saturday"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>For</label>
          <div className="seg">
            <label><input type="radio" name="for" value="self" defaultChecked />Myself</label>
            <label><input type="radio" name="for" value="other" />Someone else</label>
          </div>
        </div>
      </div>
      <div className="field">
        <label htmlFor="note">Reason for visit (optional)</label>
        <input id="note" name="note" type="text" placeholder="One line is enough. Please do not include reports or diagnoses." />
      </div>
      {doctor.contact ? (
        <div className="notice" style={{ marginBottom: "12px" }}>
          The practice will receive <b>{doctor.contact.name}</b>, <span className="mono">{doctor.contact.phone}</span> and your preferred day — nothing else. Wrong number? <Link href="/account">Update your details</Link> first.
        </div>
      ) : null}
      <label className="consent">
        <input type="checkbox" name="consent" required />
        Share my name and mobile number with this practice so they can reach me about this enquiry.
      </label>
    </>
  );
}
