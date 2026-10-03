import Link from "next/link";

import { paths } from "@/lib/site";

/**
 * The disclaimer every condition article carries until a named registered
 * doctor has signed it off. It replaces a review, it does not pretend to be
 * one: it says plainly who wrote the page, that no doctor has checked it, and
 * what the reader should and should not do with it.
 *
 * `compact` is the short version shown under the title; the full version sits
 * above the sources at the end of the article.
 */
export function ConditionDisclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="notice alert" role="note" aria-label="Medical disclaimer">
        <b>Not yet reviewed by a doctor.</b> This article was written by The Doctor Index from the sources listed at the end. It is general information, not medical advice: do not start, stop or change any treatment because of it. In an emergency call 112, or 108 for an ambulance.{" "}
        <a href="#disclaimer">Read the full disclaimer</a>.
      </div>
    );
  }
  return (
    <section id="disclaimer" className="panel pad" style={{ marginTop: "30px" }} aria-labelledby="disclaimer-h">
      <h2 id="disclaimer-h" style={{ marginTop: 0 }}>Medical disclaimer</h2>
      <p>
        <b>Who wrote this.</b> This article was researched and written by The Doctor Index editorial team from the published sources listed below. It has not yet been reviewed by a registered medical practitioner. When a doctor reviews it, their name, qualification and registration number will appear at the top of the page with the date of review.
      </p>
      <p>
        <b>What it is for.</b> It is general information to help you understand a condition, know which kind of doctor to see and prepare questions for the appointment. It is not a diagnosis, it does not describe your situation, and it is not a substitute for advice from a doctor who has examined you.
      </p>
      <p>
        <b>What not to do with it.</b> Do not start, stop or change any medicine or treatment because of something you read here — speak to your doctor first. Medicines named are examples of what doctors may consider, not recommendations, and no doses are given on purpose.
      </p>
      <p>
        <b>Emergencies.</b> If symptoms are severe, sudden or getting worse, call 112, or 108 for an ambulance, or go to the nearest emergency department. For mental health support, Tele-MANAS is free on 14416.
      </p>
      <p style={{ marginBottom: 0 }}>
        <b>Errors.</b> If you find something wrong or out of date, report it through the <Link href={paths.policy("corrections")}>corrections process</Link>. How we write and review health content is set out in our <Link href={paths.policy("editorial")}>editorial and medical review policy</Link>.
      </p>
    </section>
  );
}
