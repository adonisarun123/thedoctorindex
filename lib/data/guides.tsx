import type { ReactNode } from "react";

import type { SpecialtyKey } from "@/lib/types";

/**
 * Health guides (plan §11.7).
 *
 * Every guide names an author and a separate medical reviewer, shows its
 * publication and last-review dates, and is written individually. There is no
 * template that swaps a condition name into boilerplate. Guides never name or
 * recommend a specific doctor — guidance and directory stay separate.
 *
 * The author and reviewer credits below are placeholders for the editorial
 * roles the plan staffs; they are not real people.
 */
export interface Guide {
  slug: string;
  title: string;
  /** One-line standfirst, also the meta description. */
  standfirst: string;
  specialty: SpecialtyKey | null;
  author: string;
  reviewer: string;
  publishedOn: string;
  reviewedOn: string;
  readingMinutes: number;
  body: ReactNode;
}

export const GUIDES: Guide[] = [
  {
    slug: "when-to-consult-a-cardiologist",
    title: "When to consult a cardiologist",
    standfirst:
      "Which symptoms warrant a cardiology consultation, what a first appointment involves, and what to bring.",
    specialty: "cardiology",
    author: "Editorial team",
    reviewer: "Medical reviewer, cardiology (registration on file)",
    publishedOn: "12 Aug 2026",
    reviewedOn: "12 Aug 2026",
    readingMinutes: 4,
    body: (
      <>
        <p>
          A cardiologist treats the heart and blood vessels. Most people are referred by a physician
          after a symptom or an abnormal test, but a referral is not required and many cardiology
          practices see patients directly.
        </p>
        <div className="notice alert">
          <b>Emergency chest pain is not a directory matter.</b> Chest pain with sweating, breathlessness,
          pain spreading to the arm or jaw, or collapse: call 108 or go to the nearest emergency
          department now.
        </div>
        <h2>Reasons to book</h2>
        <ul>
          <li>Chest discomfort, pressure or tightness that comes on with exertion and settles with rest.</li>
          <li>Palpitations, a racing or irregular heartbeat, especially with dizziness.</li>
          <li>Breathlessness that is new, worsening, or wakes you at night.</li>
          <li>Blood pressure that stays high despite treatment.</li>
          <li>Fainting or near-fainting without an obvious cause.</li>
          <li>A family history of heart disease before 55 in men or 65 in women, and you want a risk assessment.</li>
          <li>Follow-up after a heart attack, angioplasty, bypass or valve procedure.</li>
        </ul>
        <h2>What a first consultation involves</h2>
        <p>
          Expect a detailed history &mdash; your symptoms, when they happen, medicines, family history &mdash;
          followed by a physical examination and usually an ECG. Depending on what is found, the doctor
          may arrange an echocardiogram, a stress test, a Holter monitor or blood tests before deciding
          anything. It is normal for a first visit to end with tests rather than a diagnosis.
        </p>
        <h2>What to bring</h2>
        <ul>
          <li>Every current medicine, including supplements, with doses.</li>
          <li>Previous ECGs, echo reports or hospital discharge summaries.</li>
          <li>A note of your blood pressure readings if you have been recording them.</li>
          <li>The questions you want answered, written down.</li>
        </ul>
        <h2>Subspecialities</h2>
        <p>
          Interventional cardiologists perform angiography and stenting. Electrophysiologists treat
          rhythm problems and manage pacemakers. Heart failure specialists run structured follow-up for
          weakened hearts. Preventive cardiologists focus on risk factors before disease develops. Your
          referring doctor can point you to the right one; if you are choosing directly, the
          subspeciality is shown on each profile.
        </p>
      </>
    ),
  },
  {
    slug: "when-to-consult-a-dermatologist",
    title: "When to consult a dermatologist",
    standfirst:
      "Skin, hair and nail problems that need a specialist, what can wait, and the one symptom never to sit on.",
    specialty: "dermatology",
    author: "Editorial team",
    reviewer: "Medical reviewer, dermatology (registration on file)",
    publishedOn: "12 Aug 2026",
    reviewedOn: "12 Aug 2026",
    readingMinutes: 3,
    body: (
      <>
        <p>
          Dermatologists diagnose and treat conditions of the skin, hair and nails. Many problems
          resolve in one or two consultations; some, like eczema or psoriasis, are managed over years.
        </p>
        <h2>See a dermatologist promptly for</h2>
        <ul>
          <li>A mole or spot that is changing in size, shape or colour, bleeding, or looks different from the others.</li>
          <li>A sore that has not healed in four weeks.</li>
          <li>A rash with fever, blistering, or that spreads rapidly.</li>
        </ul>
        <h2>Book a routine consultation for</h2>
        <ul>
          <li>Acne that has not responded to over-the-counter treatment after eight to twelve weeks.</li>
          <li>Persistent itching, scaling, dryness or discolouration.</li>
          <li>Sudden or patchy hair loss, or nail changes.</li>
          <li>Recurring fungal or bacterial skin infections.</li>
          <li>Any skin condition affecting a child that is not settling.</li>
        </ul>
        <h2>Medical versus cosmetic</h2>
        <p>
          Some dermatology practices offer cosmetic procedures alongside medical care and some do not.
          Each profile on this site lists the services the doctor actually provides, drawn from a
          controlled list, so you can see before you book.
        </p>
        <h2>What to bring</h2>
        <p>
          Photographs of the problem taken in daylight, especially if it comes and goes. A list of
          everything you have already tried, including creams and home remedies. Your medicine list
          &mdash; several common medicines cause skin reactions.
        </p>
      </>
    ),
  },
  {
    slug: "when-to-consult-an-orthopaedic-surgeon",
    title: "When to consult an orthopaedic surgeon",
    standfirst:
      "Bone, joint and spine problems that need a specialist — and why seeing a surgeon does not mean having surgery.",
    specialty: "orthopaedics",
    author: "Editorial team",
    reviewer: "Medical reviewer, orthopaedics (registration on file)",
    publishedOn: "12 Aug 2026",
    reviewedOn: "12 Aug 2026",
    readingMinutes: 4,
    body: (
      <>
        <p>
          Orthopaedic surgeons treat bones, joints, ligaments, tendons and the spine. The title is
          misleading in one respect: a large share of orthopaedic care is not surgery. Physiotherapy,
          activity modification, injections and bracing come first for most conditions.
        </p>
        <h2>Go to an emergency department for</h2>
        <ul>
          <li>A suspected fracture &mdash; deformity, inability to bear weight, or a bone through the skin.</li>
          <li>Sudden severe back pain with numbness in the legs or loss of bladder or bowel control.</li>
        </ul>
        <h2>Book a consultation for</h2>
        <ul>
          <li>Joint pain that limits walking, standing, sleep or work for more than a few weeks.</li>
          <li>An injury that is swollen, unstable or not improving after two weeks of rest.</li>
          <li>Back or neck pain radiating into an arm or leg.</li>
          <li>Sports injuries that keep recurring.</li>
          <li>A second opinion before a planned joint replacement or spine operation.</li>
          <li>A child with a limp, gait concern or limb alignment that worries you.</li>
        </ul>
        <h2>Subspecialities</h2>
        <p>
          Joint replacement, sports injury and arthroscopy, spine, hand and wrist, trauma, and
          paediatric orthopaedics are distinct practices. Profiles on this site show the subspeciality so
          a shoulder problem reaches a shoulder surgeon.
        </p>
        <h2>Asking about alternatives to surgery</h2>
        <p>
          It is reasonable to ask any surgeon: what happens if we do nothing; what non-surgical options
          exist; and what the recovery actually involves. A good consultation answers all three
          before any decision is made.
        </p>
      </>
    ),
  },
  {
    slug: "when-to-consult-a-paediatrician",
    title: "When to consult a paediatrician",
    standfirst:
      "Routine care, warning signs in infants and children, and how to choose a paediatrician you will see for years.",
    specialty: "paediatrics",
    author: "Editorial team",
    reviewer: "Medical reviewer, paediatrics (registration on file)",
    publishedOn: "12 Aug 2026",
    reviewedOn: "12 Aug 2026",
    readingMinutes: 4,
    body: (
      <>
        <p>
          A paediatrician cares for children from birth to adolescence &mdash; routine immunisation and
          growth monitoring, common illness, and long-term childhood conditions. Continuity matters more
          in paediatrics than in almost any other speciality, so most families choose someone close to
          home.
        </p>
        <h2>Seek urgent care for</h2>
        <ul>
          <li>A baby under three months with any fever.</li>
          <li>Difficulty breathing, blue lips, or a child who is unusually drowsy or hard to wake.</li>
          <li>Signs of dehydration &mdash; no urine for eight hours, sunken eyes, no tears.</li>
          <li>A rash that does not fade when pressed with a glass.</li>
          <li>A seizure.</li>
        </ul>
        <h2>Book a routine consultation for</h2>
        <ul>
          <li>Immunisation and scheduled growth and development checks.</li>
          <li>Fever, cough or a stomach upset that is not settling after a few days.</li>
          <li>Concerns about feeding, weight gain or milestones.</li>
          <li>Recurrent ear, throat or chest infections.</li>
          <li>Adolescent health, school concerns, or behaviour that worries you.</li>
        </ul>
        <h2>Choosing a paediatrician</h2>
        <p>
          Look for evening or weekend hours if you work, a practice that offers a way to ask a quick
          question between visits, and languages your family is comfortable in. Profiles here show
          languages, consultation modes and hours as confirmed with the practice, with the date they
          were checked.
        </p>
      </>
    ),
  },
  {
    slug: "how-to-choose-a-specialist",
    title: "How to choose a specialist",
    standfirst:
      "What a verification label proves and what it does not, how to read a profile, and the questions worth asking before you book.",
    specialty: null,
    author: "Editorial team",
    reviewer: "Medical reviewer, general medicine (registration on file)",
    publishedOn: "12 Aug 2026",
    reviewedOn: "12 Aug 2026",
    readingMinutes: 5,
    body: (
      <>
        <p>
          A directory can tell you who is registered, what they are qualified in, where they practise
          and what other patients experienced. It cannot tell you who is the best doctor for you. This
          guide is about using the first set of facts well.
        </p>
        <h2>Read the verification record first</h2>
        <p>
          Every profile shows a verification record with a line per checked claim. &ldquo;Registration
          verified&rdquo; means the council and registration number were matched in the state register on
          the date shown. &ldquo;Qualification verified&rdquo; means the degree was found in the awarding
          body&rsquo;s record. &ldquo;Practice location confirmed&rdquo; means someone at the practice reconfirmed
          the address and hours. Each is a separate fact with its own date. None of them measures clinical
          skill.
        </p>
        <h2>Check the subspeciality</h2>
        <p>
          A cardiologist who does angioplasty and one who manages rhythm disorders are different
          practices. Profiles list the subspeciality and the services actually offered, drawn from a
          controlled list.
        </p>
        <h2>Read reviews for patterns, not scores</h2>
        <p>
          We show the score distribution, not only the average, and we mark reviews where the reviewer
          supplied proof of a visit. Look for repeated themes &mdash; explains clearly, runs late, listens
          &mdash; rather than a single number. Reviews describe experience; they cannot tell you about
          outcomes.
        </p>
        <h2>Questions worth asking</h2>
        <ul>
          <li>What do you think is going on, and what else could it be?</li>
          <li>What happens if we wait?</li>
          <li>What are the non-surgical or non-drug options?</li>
          <li>How will we know if the treatment is working, and when?</li>
          <li>What should make me come back sooner?</li>
        </ul>
        <h2>Confirm before you travel</h2>
        <p>
          Hours and fees are shown with the date they were last confirmed. If that date is more than a
          few months old, call the practice first.
        </p>
      </>
    ),
  },
];

export function guideBySlug(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}

export function guideForSpecialty(specialty: SpecialtyKey): Guide | null {
  return GUIDES.find((g) => g.specialty === specialty) ?? null;
}
