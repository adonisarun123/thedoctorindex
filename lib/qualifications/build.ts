import type { Block, Faq } from "@/lib/blog/types";
import type { RegisterSource } from "@/lib/registers/types";
import { abbrWithArticle, type QualificationEntry, type QualificationKind, type System } from "@/lib/qualifications/types";
import type { SpecialtyKey } from "@/lib/types";

/**
 * Builders. Every qualification of a given system is checked the same way,
 * so that procedure is written once per system and parametrised; each entry
 * supplies what is particular to it — what it is, who awards it, how long it
 * takes, what it does and does not make its holder.
 */

export const NMC_IMR_URL = "https://www.nmc.org.in/information-desk/indian-medical-register/";
export const NMC_COURSE_SEARCH_URL = "https://nmc.org.in/information-desk-college-and-course-search";
export const NMC_PG_REGULATIONS_LABEL = "National Medical Commission — Post-Graduate Medical Education Regulations, 2023";
export const NMC_PG_REGULATIONS_URL = "https://www.nmc.org.in/rules-regulations-nmc/";

export const SOURCE_NMC_IMR: RegisterSource = { label: "National Medical Commission — Indian Medical Register search", url: NMC_IMR_URL };
export const SOURCE_NMC_COURSES: RegisterSource = { label: "National Medical Commission — College and Course Search", url: NMC_COURSE_SEARCH_URL };
export const SOURCE_NMC_PGMER: RegisterSource = { label: NMC_PG_REGULATIONS_LABEL, url: NMC_PG_REGULATIONS_URL };
export const SOURCE_NDC: RegisterSource = { label: "National Dental Commission — home page (dciindia.gov.in)", url: "https://dciindia.gov.in/" };
export const SOURCE_NCISM: RegisterSource = { label: "National Commission for Indian System of Medicine — home page", url: "https://ncismindia.org/" };

export interface QualificationInput {
  slug: string;
  abbr: string;
  name: string;
  kind: QualificationKind;
  system: System;
  awardedBy: string;
  duration?: string;
  entry?: string;
  registerSlug: string;
  pattern: string;
  parent?: string;
  specialty?: SpecialtyKey;
  standfirst: string;
  /** Two or three paragraphs particular to this qualification. */
  about: string[];
  /** Blocks after the shared check procedure. */
  extra?: Block[];
  extraFaqs?: Faq[];
  checkedOn: string;
  sources?: RegisterSource[];
  related?: string[];
}

function checkSection(abbr: string, system: System, kind: QualificationKind): Block[] {
  const a = abbrWithArticle(abbr);
  if (system === "modern") {
    const items: Array<{ title: string; text: string }> = [
      {
        title: "Read the register entry",
        text: `A doctor's record on the [Indian Medical Register](${NMC_IMR_URL}) names the qualification the state medical council recorded at registration, and further qualifications where the doctor has had them added. If the doctor says they hold ${a} and the register shows only the primary degree, the ${abbr} has not been registered — which is common and not by itself a warning, but it does mean the register cannot confirm it.`,
      },
      {
        title: "Check the college was recognised for the course",
        text: `The NMC's [College and Course Search](${NMC_COURSE_SEARCH_URL}) lists which institutions are recognised for which courses. ${kind === "fellowship" || kind === "membership" ? "This applies to degrees and diplomas; a fellowship or membership awarded by a society is not a course the NMC recognises, and will not appear there." : `${a} from a college not recognised for it on the year in question is a qualification the NMC does not recognise, whatever the certificate says.`}`,
      },
      {
        title: "Ask the awarding body when it matters",
        text: `${kind === "fellowship" || kind === "membership" ? "The society or college that awarded it can confirm a fellowship or membership; that is the only check available, and this site says so on the profile." : "Universities verify degrees on request, usually for a fee; a hospital credentialing a doctor does this, and a patient can ask whether it has been done."} On this site a qualification is marked verified only when it has been checked against the awarding body and the date is shown; otherwise it is marked as supplied.`,
      },
    ];
    return [{ k: "h2", text: `How to check whether a doctor holds ${a}` }, { k: "steps", items }];
  }
  if (system === "dental") {
    return [
      { k: "h2", text: `How to check whether a dentist holds ${a}` },
      {
        k: "p",
        text: `Dental qualifications are recognised by the [National Dental Commission](/registers/national-dental-commission) — the Dental Council of India until 19 March 2026 — and the Indian Dentists Register records the qualification each state dental council registered. Search the dentist there, and confirm the college was recognised for the course; the awarding university can verify the certificate itself. On this site a dental qualification is marked as supplied until a person has checked it, because the automated worker reads only the NMC's medical register.`,
      },
    ];
  }
  if (system === "ayush") {
    return [
      { k: "h2", text: `How to check whether a practitioner holds ${a}` },
      {
        k: "p",
        text: `The qualification is recognised under the [National Commission for Indian System of Medicine](/registers/national-commission-for-indian-system-of-medicine) or the [National Commission for Homoeopathy](/registers/national-commission-for-homoeopathy), and the state board that registered the practitioner recorded it. Ask which board issued the registration and check with it; the awarding university can verify the certificate. On this site AYUSH qualifications are marked as supplied until a person has checked them.`,
      },
    ];
  }
  return [
    { k: "h2", text: `How to check whether someone holds ${a}` },
    {
      k: "p",
      text: `Allied-health qualifications are awarded by universities and recognised, where a statutory body exists, by that body — the [Rehabilitation Council of India](/registers/rehabilitation-council-of-india) for the rehabilitation professions, and the state councils being set up under the [National Commission for Allied and Healthcare Professions](/registers/national-commission-for-allied-and-healthcare-professions) Act for the rest. The awarding university can verify the certificate. On this site these qualifications are marked as supplied until a person has checked them.`,
    },
  ];
}

function recognitionFaq(abbr: string, kind: QualificationKind, system: System): Faq {
  const a = abbrWithArticle(abbr);
  const body = system === "modern" ? "National Medical Commission" : system === "dental" ? "National Dental Commission" : system === "ayush" ? "NCISM or National Commission for Homoeopathy" : "relevant council";
  if (kind === "fellowship" || kind === "membership") {
    return {
      q: `Is ${a} a recognised medical qualification in India?`,
      a: `Not in the statutory sense. It is awarded by a college or society rather than a university, and it is not on the schedules of recognised qualifications the ${body} maintains. It may still represent real training or examination; what it cannot do is stand in for a recognised degree or diploma, and on this site it is shown alongside the qualifications, never in place of them.`,
    };
  }
  return {
    q: `Is ${a} a recognised qualification in India?`,
    a: `Yes, when awarded by an institution recognised for it. The ${body} maintains the list of recognised qualifications and of the institutions permitted to award each; ${a} from a college that was not recognised for the course in that year is not a recognised qualification, and a registering body can refuse to enter it on the register.`,
  };
}

export function qualification(input: QualificationInput): QualificationEntry {
  const body: Block[] = [
    ...input.about.map((text): Block => ({ k: "p", text })),
    ...checkSection(input.abbr, input.system, input.kind),
    ...(input.extra ?? []),
  ];
  const faqs: Faq[] = [recognitionFaq(input.abbr, input.kind, input.system), ...(input.extraFaqs ?? [])];
  const sources: RegisterSource[] =
    input.sources ?? (input.system === "modern" ? [SOURCE_NMC_IMR, SOURCE_NMC_COURSES] : input.system === "dental" ? [SOURCE_NDC] : input.system === "ayush" ? [SOURCE_NCISM] : []);
  return {
    slug: input.slug,
    abbr: input.abbr,
    name: input.name,
    kind: input.kind,
    system: input.system,
    awardedBy: input.awardedBy,
    duration: input.duration,
    entry: input.entry,
    registerSlug: input.registerSlug,
    pattern: input.pattern,
    parent: input.parent,
    specialty: input.specialty,
    standfirst: input.standfirst,
    body,
    faqs,
    checkedOn: input.checkedOn,
    sources,
    related: input.related,
  };
}

export interface BranchInput {
  slug: string;
  /** "MD (General Medicine)" */
  abbr: string;
  name: string;
  parent: "md" | "ms" | "dm" | "mch" | "mds" | "dnb";
  specialty: SpecialtyKey;
  pattern: string;
  /** One or two paragraphs on what this branch trains for and what its holders do. */
  about: string[];
  extraFaqs?: Faq[];
  checkedOn: string;
  related?: string[];
}

const PARENT: Record<BranchInput["parent"], { abbr: string; name: string; kind: QualificationKind; duration: string; entry: string; awardedBy: string; system: System }> = {
  md: { abbr: "MD", name: "Doctor of Medicine", kind: "postgraduate", duration: "3 years after MBBS", entry: "NEET-PG", awardedBy: "Universities, under NMC regulations", system: "modern" },
  ms: { abbr: "MS", name: "Master of Surgery", kind: "postgraduate", duration: "3 years after MBBS", entry: "NEET-PG", awardedBy: "Universities, under NMC regulations", system: "modern" },
  dnb: { abbr: "DNB", name: "Diplomate of National Board", kind: "postgraduate", duration: "3 years after MBBS", entry: "NEET-PG", awardedBy: "National Board of Examinations in Medical Sciences", system: "modern" },
  dm: { abbr: "DM", name: "Doctorate of Medicine", kind: "superspecialty", duration: "3 years after MD or DNB", entry: "NEET-SS", awardedBy: "Universities, under NMC regulations", system: "modern" },
  mch: { abbr: "MCh", name: "Magister Chirurgiae", kind: "superspecialty", duration: "3 years after MS or DNB", entry: "NEET-SS", awardedBy: "Universities, under NMC regulations", system: "modern" },
  mds: { abbr: "MDS", name: "Master of Dental Surgery", kind: "postgraduate", duration: "3 years after BDS", entry: "NEET-MDS", awardedBy: "Universities, under National Dental Commission regulations", system: "dental" },
};

/** A branch of a postgraduate or super-speciality degree: MD (General Medicine), MCh (Urology). */
export function branch(input: BranchInput): QualificationEntry {
  const p = PARENT[input.parent];
  return qualification({
    slug: input.slug,
    abbr: input.abbr,
    name: input.name,
    kind: p.kind,
    system: p.system,
    awardedBy: p.awardedBy,
    duration: p.duration,
    entry: p.entry,
    registerSlug: p.system === "dental" ? "national-dental-commission" : "national-medical-commission",
    pattern: input.pattern,
    parent: input.parent,
    specialty: input.specialty,
    standfirst: `What ${input.abbr} is, who awards it, what it qualifies a doctor to do, and how many doctors on this site hold it.`,
    about: [
      ...input.about,
      `${input.abbr} is one branch of the ${p.abbr} — the [${p.name}](/qualifications/${input.parent}) page covers the degree itself: its length, its entry examination, and how it sits beside the other postgraduate routes. Everything there applies here; this page is about what this branch trains for and what its holders do.`,
    ],
    extraFaqs: [
      {
        q: `Does ${input.abbr} make a doctor a specialist?`,
        a: `Yes. ${input.abbr} is a recognised ${p.kind === "superspecialty" ? "super-speciality" : "postgraduate"} qualification, and its holder is a specialist in that branch in the sense the ${p.system === "dental" ? "National Dental Commission" : "National Medical Commission"} uses. The [speciality page](/specialties/${input.specialty}) on this site lists the doctors who practise it, with the qualification each one records and whether it has been checked.`,
      },
      ...(input.extraFaqs ?? []),
    ],
    checkedOn: input.checkedOn,
    related: input.related ?? [input.parent],
  });
}
