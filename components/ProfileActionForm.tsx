"use client";

import Link from "next/link";
import { useActionState } from "react";

import { correctionAction, enquiryAction, reportAction, submitReviewAction, type ActionState } from "@/app/doctor/[slug]/actions";
import { paths } from "@/lib/site";

export type ActionKind = "review" | "report" | "correct" | "enquire";

interface DoctorSummary {
  slug: string;
  name: string;
  specialtyOne: string;
  practices: Array<{ id?: string; facility: string; locality: string }>;
  reviews?: Array<{ id: string; author: string; visitMonth: string }>;
}

const ACTIONS = { review: submitReviewAction, report: reportAction, correct: correctionAction, enquire: enquiryAction } as const;

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
}: {
  kind: ActionKind;
  doctor: DoctorSummary;
  initialPractice?: number;
  about?: string;
  signedIn: boolean;
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
            Back to Dr {doctor.name}
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

      {kind === "review" ? <ReviewFields signedIn={signedIn} /> : null}
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

function Stars({ name }: { name: string }) {
  return (
    <div className="stars" role="radiogroup" aria-label={name}>
      {[5, 4, 3, 2, 1].map((n) => (
        <label key={n} title={`${n} of 5`}>
          <input type="radio" name={name} value={n} required />★
        </label>
      ))}
    </div>
  );
}

function ReviewFields({ signedIn }: { signedIn: boolean }) {
  return (
    <>
      <div className="eyebrow" style={{ marginBottom: "10px" }}>{signedIn ? "Your experience" : "Sign in first"}</div>
      <div className="notice" style={{ marginBottom: "18px" }}>
        <b>Before you write.</b> Do not include a diagnosis, report contents, phone numbers, addresses
        or anything that identifies another patient. Automated checks flag this and a moderator will redact it.
      </div>

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
          <select id="month" name="month" defaultValue="August 2026">
            {["September 2026", "August 2026", "July 2026", "June 2026", "May 2026", "April 2026", "Earlier in 2026", "2025 or earlier"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label>Rate the experience</label>
        <div className="panel" style={{ padding: "4px 14px" }}>
          {[
            ["communication", "Communication", "Did the doctor listen and treat you with respect?"],
            ["explanation", "Explanation", "Did you leave understanding what is going on and what happens next?"],
            ["wait", "Waiting time", "How long past your appointment time were you seen?"],
            ["facility", "Facility", "Cleanliness, ease of finding the clinic, front-desk experience."],
          ].map(([key, label, hint]) => (
            <div className="dimrow" key={key}>
              <div>
                <div className="l">{label}</div>
                <div className="h">{hint}</div>
              </div>
              <Stars name={key} />
            </div>
          ))}
        </div>
        <div className="hint">We do not ask you to rate treatment effectiveness. A review cannot measure clinical outcome.</div>
      </div>

      <div className="field">
        <label htmlFor="text">In your own words</label>
        <textarea id="text" name="text" required minLength={40} placeholder="What happened, what was good, what could have been better. First-hand only. At least 40 characters." />
      </div>

      <div className="field">
        <label htmlFor="evidence">Proof of visit (optional, private)</label>
        <input id="evidence" name="evidence" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" />
        <div className="hint">
          A receipt, prescription header or appointment confirmation. Seen only by a moderator, deleted 90 days
          after moderation, never published. If validated, your review carries the “visit evidence checked” label.
        </div>
      </div>

      <label className="consent">
        <input type="checkbox" name="attest" required />
        This is my own first-hand experience. I am not the doctor, their staff, or a competitor, and I was not
        offered anything for this review.
      </label>
    </>
  );
}

function ReportFields({ about, reviews }: { about?: string; reviews: Array<{ id: string; author: string; visitMonth: string }> }) {
  const isReview = about === "review";
  return (
    <>
      <input type="hidden" name="about" value={isReview ? "review" : "profile"} />
      <div className="eyebrow" style={{ marginBottom: "10px" }}>{isReview ? "Report a review" : "Report this profile"}</div>
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
        <select id="reason" name="reason" required defaultValue="">
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
              <option>This page is about me and I want it reviewed</option>
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
        <label htmlFor="contact">How can we reach you? (optional)</label>
        <input id="contact" name="contact" type="text" placeholder="Email or mobile — for follow-up only, never published" />
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
      <label className="consent">
        <input type="checkbox" name="consent" required />
        Share my verified contact with this practice so they can reach me about this enquiry.
      </label>
    </>
  );
}
