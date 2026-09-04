import type { ReactNode } from "react";

/**
 * Trust documents. Every public verification label on the site links to one of
 * these — that linkage is the point of them, and it is a launch acceptance
 * criterion (plan §21).
 */
export interface Policy {
  slug: string;
  title: string;
  /** Short description used for the meta description and the footer. */
  summary: string;
  updatedOn: string;
  body: ReactNode;
}

export const POLICIES: Policy[] = [
  {
    slug: "verification",
    title: "Verification methodology",
    summary:
      "What each verification label on a doctor profile means, which source it was checked against, and how often it is re-checked.",
    updatedOn: "28 Aug 2026",
    body: (
      <>
        <p>
          We verify separate things separately, and we say which. A single &ldquo;verified&rdquo; tick would
          imply we had checked more than we have.
        </p>
        <h2>What each label means</h2>
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Label</th>
                <th>What was checked</th>
                <th>What it does not mean</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Medical registration verified</td>
                <td>Council and registration number matched in the state register, with the check date recorded</td>
                <td>Nothing about clinical skill, outcomes or current employment</td>
              </tr>
              <tr>
                <td>Qualification verified</td>
                <td>The degree was found in the awarding body&rsquo;s official record</td>
                <td>Not a ranking of the institution</td>
              </tr>
              <tr>
                <td>Qualification submitted</td>
                <td>The doctor supplied it; verification is still open</td>
                <td>Not yet confirmed by any source</td>
              </tr>
              <tr>
                <td>Practice location confirmed</td>
                <td>Address, hours and contact reconfirmed with the practice on the stated date</td>
                <td>Not a guarantee the doctor is present today</td>
              </tr>
              <tr>
                <td>HPR ID verified</td>
                <td>A matching entry in the Healthcare Professionals Registry</td>
                <td>Used as a secondary signal, never as the primary match key</td>
              </tr>
              <tr>
                <td>Visit evidence checked</td>
                <td>A reviewer supplied private proof of consultation and a moderator validated it</td>
                <td>Not an endorsement of the review&rsquo;s opinion</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2>Order of sources</h2>
        <ul>
          <li>National and Indian Medical Register</li>
          <li>The relevant State Medical Council</li>
          <li>Healthcare Professionals Registry, as a secondary signal</li>
          <li>Documents and direct confirmation from the council or facility, where records conflict or are incomplete</li>
        </ul>
        <p>
          The match key is council plus registration number. Never name alone &mdash; names repeat, and
          transliterations differ.
        </p>
        <h2>How often we re-check</h2>
        <ul>
          <li>Registration and disciplinary status: at least annually, and on every serious report</li>
          <li>Current practice and contact: every 6 to 12 months</li>
          <li>Fee and consulting hours: reconfirmation prompt every 90 to 180 days</li>
          <li>Any change to name, registration, qualification or speciality: re-verified before it goes public</li>
        </ul>
        <p>
          A profile that goes stale keeps its last-confirmed date on display, loses contactability weight
          in ranking, and is eventually removed from the index until it is reconfirmed.
        </p>
        <h2>What we do not claim</h2>
        <p>
          We do not describe any doctor as government verified, NMC approved, top or best. We are not a
          regulator and we do not certify competence.
        </p>
      </>
    ),
  },
  {
    slug: "ranking",
    title: "Ranking and sorting",
    summary:
      "The published weights behind organic result order, and our commitment that payment is never an input to it.",
    updatedOn: "28 Aug 2026",
    body: (
      <>
        <p>
          Payment is not an input to organic order, and never will be. If sponsored placements are
          introduced they will sit outside the results list, visually separated and labelled Sponsored.
        </p>
        <h2>The starting model</h2>
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Signal</th>
                <th>Weight</th>
                <th>What it measures</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Query, name and speciality relevance</td>
                <td>35</td>
                <td>How well the doctor matches what was asked for</td>
              </tr>
              <tr>
                <td>Location match or distance</td>
                <td>20</td>
                <td>Whether the practice is where the patient is looking</td>
              </tr>
              <tr>
                <td>Registration and active-practice verification</td>
                <td>15</td>
                <td>Whether the credentials and the address are currently confirmed</td>
              </tr>
              <tr>
                <td>Profile completeness</td>
                <td>10</td>
                <td>Whether the page answers the questions a patient will ask</td>
              </tr>
              <tr>
                <td>Freshness and contactability</td>
                <td>10</td>
                <td>How recently the practice details were reconfirmed</td>
              </tr>
              <tr>
                <td>Review confidence</td>
                <td>10</td>
                <td>Rating adjusted for volume &mdash; one five-star review does not outrank sustained feedback</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Every result carries a &ldquo;why this position&rdquo; breakdown showing its own score against these
          weights. The model is a starting point, calibrated on whether patients reach an appropriate and
          contactable doctor &mdash; not a permanent formula.
        </p>
        <h2>Diversity</h2>
        <p>
          Results are adjusted so that one hospital group or one locality cannot occupy an entire first
          page.
        </p>
        <h2>Review scoring</h2>
        <p>
          Scores use a minimum-confidence method. A doctor with two reviews does not sit above a doctor
          with forty consistent ones on average alone.
        </p>
      </>
    ),
  },
  {
    slug: "reviews",
    title: "Review policy",
    summary:
      "What patients may write, what doctors may reply, what we refuse to sell, and our internal moderation targets.",
    updatedOn: "28 Aug 2026",
    body: (
      <>
        <p>
          Reviews describe patient experience: communication, explanation, waiting time and the facility.
          We do not ask patients to rate treatment effectiveness, because a review cannot measure clinical
          outcome or causality.
        </p>
        <h2>Rules we hold to</h2>
        <ul>
          <li>No ratings or review text imported from any other platform.</li>
          <li>No self-reviews by doctors or staff, no competitor reviews, no incentives, no review gating.</li>
          <li>Every policy-compliant review is published, positive or negative.</li>
          <li>No doctor can pay to remove a review or suppress criticism.</li>
          <li>
            &ldquo;Visit evidence checked&rdquo; appears only where private proof was supplied and validated by a
            moderator.
          </li>
          <li>Doctors may post one reply and must not reveal or confirm any health information in it.</li>
          <li>
            Allegations of malpractice, criminal conduct, fraud or threats go to a trained escalation
            queue, not to ordinary moderation.
          </li>
        </ul>
        <h2>Before you write</h2>
        <p>
          Do not include diagnoses, report contents, phone numbers, addresses or anything that identifies
          another patient. Our checks flag this, and a moderator redacts it.
        </p>
        <h2>Internal response targets</h2>
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Case</th>
                <th>Target</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Identity or safety complaint</td><td>Initial assessment within 4 hours</td></tr>
              <tr><td>Ordinary review or report</td><td>Within 48 hours</td></tr>
              <tr><td>Profile correction</td><td>Within 3 business days</td></tr>
              <tr><td>Doctor verification</td><td>Within 2 business days</td></tr>
              <tr><td>General grievance</td><td>Acknowledged within 24 hours</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          These are our internal targets. The published statutory grievance timeline is separate and
          governs.
        </p>
      </>
    ),
  },
  {
    slug: "corrections",
    title: "Corrections, appeals and takedowns",
    summary:
      "How to challenge anything on a public page, how removal and merges are handled, and what provenance we keep.",
    updatedOn: "28 Aug 2026",
    body: (
      <>
        <p>
          Anything on a public page can be challenged, by the doctor it describes or by anyone who can
          show it is wrong.
        </p>
        <h2>Correcting a field</h2>
        <p>
          Every profile carries a &ldquo;suggest a correction&rdquo; control. Corrections to name, registration,
          qualification and speciality return to verification before publication. Everything else is
          targeted within 3 business days.
        </p>
        <h2>Removal</h2>
        <ul>
          <li>
            A doctor who has retired, or whose registration is no longer current, can have the profile
            retired &mdash; it is removed from the index and from search on this site.
          </li>
          <li>
            A removed profile with no successor returns a genuine 404 or 410. We do not redirect removed
            profiles to the homepage.
          </li>
          <li>
            A merged profile redirects permanently to the surviving record, carrying its reviews and
            provenance with it.
          </li>
        </ul>
        <h2>Provenance</h2>
        <p>
          Every field records who supplied it, when it was checked, which source supported it and who
          approved it. Support can answer all four questions for any value on any page.
        </p>
        <h2>Appeals</h2>
        <p>
          A moderation decision can be appealed by either party. Appeals are reviewed by someone who did
          not make the original decision, and the outcome is recorded.
        </p>
      </>
    ),
  },
];

export function policyBySlug(slug: string): Policy | null {
  return POLICIES.find((p) => p.slug === slug) ?? null;
}
