import { nameTokens } from "@/lib/enrich/names";

/**
 * Reading an NMC register entry. Pure functions, unit-tested.
 *
 * The register records a name, a council, a number, a primary qualification
 * and (for a quarter of entries) further qualifications. It records no
 * speciality, no city and no clinic. Everything here is the site's reading of
 * those strings — the speciality is *inferred from the degree*, and every
 * profile built from it says so.
 */

/** Register council code → the council's name as the site's register pages spell it, and the state it serves. */
export const REGISTER_COUNCILS: Record<string, { name: string; stateSlug: string | null }> = {
  AND: { name: "Andhra Pradesh Medical Council", stateSlug: "andhra-pradesh" },
  ARU: { name: "Arunachal Pradesh Medical Council", stateSlug: "arunachal-pradesh" },
  ASS: { name: "Assam Medical Council", stateSlug: "assam" },
  BIH: { name: "Bihar Medical Council", stateSlug: "bihar" },
  CHA: { name: "Chattisgarh Medical Council", stateSlug: "chhattisgarh" },
  DEL: { name: "Delhi Medical Council", stateSlug: "delhi" },
  GOA: { name: "Goa Medical Council", stateSlug: "goa" },
  GUJ: { name: "Gujarat Medical Council", stateSlug: "gujarat" },
  HAR: { name: "Haryana Medical Council", stateSlug: "haryana" },
  HIM: { name: "Himachal Pradesh Medical Council", stateSlug: "himachal-pradesh" },
  JAM: { name: "Jammu & Kashmir Medical Council", stateSlug: "jammu-and-kashmir" },
  JHA: { name: "Jharkhand Medical Council", stateSlug: "jharkhand" },
  KAR: { name: "Karnataka Medical Council", stateSlug: "karnataka" },
  MAD: { name: "Madhya Pradesh Medical Council", stateSlug: "madhya-pradesh" },
  MAH: { name: "Maharashtra Medical Council", stateSlug: "maharashtra" },
  MAN: { name: "Manipur Medical Council", stateSlug: "manipur" },
  MCI: { name: "Medical Council of India", stateSlug: null },
  MIZ: { name: "Mizoram Medical Council", stateSlug: "mizoram" },
  NAG: { name: "Nagaland Medical Council", stateSlug: "nagaland" },
  ORI: { name: "Orissa Council of Medical Registration", stateSlug: "odisha" },
  PUN: { name: "Punjab Medical Council", stateSlug: "punjab" },
  RAJ: { name: "Rajasthan Medical Council", stateSlug: "rajasthan" },
  SIK: { name: "Sikkim Medical Council", stateSlug: "sikkim" },
  TAM: { name: "Tamil Nadu Medical Council", stateSlug: "tamil-nadu" },
  TEL: { name: "Telangana State Medical Council", stateSlug: "telangana" },
  TC: { name: "Kerala State Medical Council", stateSlug: "kerala" },
  TRI: { name: "Tripura State Medical Council", stateSlug: "tripura" },
  UP: { name: "Uttar Pradesh Medical Council", stateSlug: "uttar-pradesh" },
  UTT: { name: "Uttarakhand Medical Council", stateSlug: "uttarakhand" },
  WES: { name: "West Bengal Medical Council", stateSlug: "west-bengal" },
};

export const STATE_NAMES: Record<string, string> = {
  "andhra-pradesh": "Andhra Pradesh", "arunachal-pradesh": "Arunachal Pradesh", assam: "Assam", bihar: "Bihar", chhattisgarh: "Chhattisgarh", delhi: "Delhi", goa: "Goa", gujarat: "Gujarat", haryana: "Haryana", "himachal-pradesh": "Himachal Pradesh", "jammu-and-kashmir": "Jammu and Kashmir", jharkhand: "Jharkhand", karnataka: "Karnataka", kerala: "Kerala", "madhya-pradesh": "Madhya Pradesh", maharashtra: "Maharashtra", manipur: "Manipur", mizoram: "Mizoram", nagaland: "Nagaland", odisha: "Odisha", punjab: "Punjab", rajasthan: "Rajasthan", sikkim: "Sikkim", "tamil-nadu": "Tamil Nadu", telangana: "Telangana", tripura: "Tripura", "uttar-pradesh": "Uttar Pradesh", uttarakhand: "Uttarakhand", "west-bengal": "West Bengal",
};

export const CURRENT_YEAR = 2026;
/** A qualification before this year: the entry is kept in the register table but no profile is built from it. */
export const ACTIVE_ERA_FROM = 1980;

/* ------------------------------------------------------------------------ */
/* Names                                                                     */
/* ------------------------------------------------------------------------ */

const SMALL = new Set(["de", "da", "van", "von", "bin", "al"]);

/**
 * "JAISWAL KAMDNAYA RAMCTION ." → "Jaiswal Kamdnaya Ramction";
 * "NILKANTA (SMT.)SHIVAKAMU ." → "Nilkanta Shivakamu"; "DAVE,SOMNATH" → "Dave Somnath".
 * Token order is left as the register has it (several councils list the
 * surname first); nothing here can tell which order a given council used.
 * Returns null when what is left is not a plausible personal name.
 */
export function cleanName(raw: string): string | null {
  let s = raw
    .replace(/\([^)]*\)/g, " ")
    .replace(/[,;/]/g, " ")
    .replace(/\s*\.\s*$/g, " ")
    .replace(/^\s*(dr|prof|late|smt|shri|sri|mr|mrs|ms|kumari|ku)\.?\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
  // Drop honorific tokens anywhere ("Kaur (Ku) Harjeet" already lost the bracket; "SMT. NEENA" keeps SMT).
  s = s
    .split(" ")
    .filter((t) => !/^(dr|prof|late|smt|shri|sri|mr|mrs|miss|ms|kumari|ku|km|kum|sr|jr)\.?$/i.test(t))
    .join(" ");
  s = s.replace(/\s+\.\s*/g, " ").replace(/\.{2,}/g, ".").replace(/\s+/g, " ").trim();
  if (!s) return null;
  // All caps or all lower-case: the council typed it that way; mixed case is left as written ("G. Mc. Subbe Gowda").
  if (!/[a-z]/.test(s) || !/[A-Z]/.test(s)) s = titleCase(s);
  // "K.P.Bhaskara" → "K.P. Bhaskara": a dot followed by a run of ≥3 letters needs a space.
  s = s.replace(/\.(?=[A-Za-z]{3,})/g, ". ");
  if (!/^[\p{L}][\p{L} .'-]{1,79}$/u.test(s)) return null;
  const tokens = nameTokens(s);
  if (tokens.length === 0 || !tokens.some((t) => t.length >= 3)) return null;
  if (/\b(unknown|nil|null|test|error|not available)\b/i.test(s)) return null;
  return s;
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(" ")
    .map((w) =>
      w
        .split(/([.'-])/)
        .map((p) => (p.length > 1 && !SMALL.has(p) ? p[0].toUpperCase() + p.slice(1) : p.length === 1 && /[a-z]/.test(p) ? p.toUpperCase() : p))
        .join(""),
    )
    .join(" ");
}

/** Sorted core tokens joined with spaces — the key for "same person" checks across councils. */
export function nameSortedKey(name: string): string {
  return nameTokens(name)
    .filter((t) => t.length >= 2)
    .sort()
    .join(" ");
}

/* ------------------------------------------------------------------------ */
/* Speciality from degree                                                    */
/* ------------------------------------------------------------------------ */

export type Rank = 0 | 1 | 2 | 3; // 0 none · 1 diploma · 2 MD/MS/DNB · 3 DM/MCh/DrNB

export interface SpecialtyReading {
  key: string;
  rank: Rank;
  basis: string;
}

/** Degree strings the register uses for a primary, MBBS-equivalent qualification (many are foreign). */
const PRIMARY_EQUIVALENT = /\b(M\.? ?B\.? ?B\.? ?S|BACHELOR OF MEDICINE|M\.?D\.? ?\(?'?PHYSICIAN|DOCTOR (OF|IN) (GENERAL )?MEDICINE|EQUIVALEN|L\.? ?M\.? ?P|L\.? ?M\.? ?F|L\.? ?C\.? ?P\.? ?S|L\.? ?S\.? ?M|L\.? ?R\.? ?C\.? ?P|M\.? ?B\.? ?B\.? ?CH|M\.? ?B\.? ?CH\.? ?B|M\.? ?B\.? ?B\.? ?CH|DMS|LMS|BMS|MEDICAL DIPLOMA|MEDICAL DOCTOR|GENERAL MEDICAL|BASIC MEDICAL|DIPLOMA OF (A )?PHYSICIAN|LICENTIATE)\b/;

const RULES: Array<[RegExp, string]> = [
  // Super-specialities and surgical branches first: "DM (Cardiology)" also contains "cardio", "MCh Neurosurgery" contains "neuro".
  [/NEURO ?SURG/, "neurosurgery"],
  [/CARDIO ?THORAC|CAR\.? ?THORA|THORA\w*\.? ?(VAS|SURG)|CARDIAC ?SURG|CARDIO ?VASC\w* ?(AND |&)? ?THORAC|\bC ?T ?V ?S\b|\bCVTS\b|THORACIC ?SURG|VASCULAR ?SURG|CARDIAC ?VASCULAR/, "cardiothoracic-surgery"],
  [/PAED\w* ?SURG|PEDIA\w* ?SURG|CHILD\w* ?SURG/, "paediatric-surgery"],
  [/PLASTIC|RECONSTRUCT|\bBURNS?\b/, "plastic-surgery"],
  [/SURG\w* ?ONCO|ONCO\w* ?SURG|CANCER ?SURG/, "surgical-oncology"],
  [/RADIATION ?ONCO|RADIO ?THERAP|\bDMRT\b|\bMDRT\b|RADIOTHERAPEUT/, "radiation-oncology"],
  [/MEDICAL ?ONCO|ONCOLOGY|\bONCO\b|CANCER/, "medical-oncology"],
  [/\bG\.? ?I\.? ?SURG|GASTRO\w* ?SURG|SURGICAL ?GASTRO|HEPATO\w* ?(PANCREAT\w* )?(AND |&)? ?BILIARY ?SURG|\bHPB\b|SURG\w* GASTRO/, "gi-surgery"],
  [/GASTRO|HEPATO/, "gastroenterology"],
  [/\bUROL|GENITO ?URIN/, "urology"],
  [/NEPHRO/, "nephrology"],
  [/NEURO/, "neurology"],
  [/CARDIO/, "cardiology"],
  [/ENDOCRIN/, "endocrinology"],
  [/DIABET/, "diabetology"],
  [/PULMON|CHEST|RESPIRAT|TUBERC|\bT\.? ?B\.?\b|\bDTCD\b|\bTDD\b|\bDTD\b/, "pulmonology"],
  [/RHEUMAT/, "rheumatology"],
  [/TRANSFUSION|BLOOD ?BANK/, "pathology"],
  [/HAEMAT|HEMAT/, "haematology"],
  [/CRITICAL|INTENSIVE/, "critical-care"],
  [/EMERGENCY|ACCIDENT/, "emergency-medicine"],
  [/INFECT|TROPICAL|\bDTM/, "infectious-diseases"],
  [/GERIAT/, "geriatrics"],
  [/NUCLEAR/, "nuclear-medicine"],
  [/PHYSICAL ?MED|REHAB|\bP\.? ?M\.? ?(AND |&)? ?R\b|PHYSIATR/, "physical-medicine-rehabilitation"],
  [/TRANSPLANT/, "transplant-surgery"],
  // Broad specialities.
  [/ANAES|ANESTH|\bD\.? ?A\.?\b(?![A-Z])|DIPLOMA IN ANAE/, "anaesthesiology"],
  [/ORTHO(?!DONT)|\bD\.? ?ORTH/, "orthopaedics"],
  [/PAED|PEDIA|CHILD|\bD\.? ?C\.? ?H\.?\b/, "paediatrics"],
  [/OBST|GYN|\bOBG\b|\bD\.? ?G\.? ?O\.?\b|MIDWIF/, "gynaecology"],
  [/OPHTH|\bD\.? ?O\.? ?M\.? ?S\.?\b|\bEYE\b|\bD\.? ?O\.?\b(?![A-Z])/, "ophthalmology"],
  [/\bOTO|\bE\.? ?N\.? ?T\.?\b|RHINO|LARYNG|\bD\.? ?L\.? ?O\.?\b/, "ent"],
  [/DERM|\bSKIN\b|VENER|LEPRO|\bD\.? ?V\.? ?D\.?\b|\bDDVL\b|\bD\.? ?D\.? ?V\.?\b/, "dermatology"],
  [/PSYCH|MENTAL|\bD\.? ?P\.? ?M\.?\b/, "psychiatry"],
  [/RADIO ?DIAG|\bDMRD\b|\bDMRE\b|RADIOLOG|IMAGING|ROENTGEN|\bD\.? ?M\.? ?R\.? ?D\.?\b/, "radiology"],
  [/\bPATH|MICROBIO|BIOCHEM|\bD\.? ?C\.? ?P\.?\b|\bDPB\b|LAB\w* ?MED|IMMUNOLOG|VIROLOG|CYTOLOG|HISTO/, "pathology"],
  [/COMMUNITY|\bCOMM\b|PREVENT|SOCIAL ?(AND |&)? ?PREV|PUBLIC ?HEALTH|\bD\.? ?P\.? ?H\.?\b|\bPSM\b|\bSPM\b|\bMPH\b|HEALTH ?ADMIN|EPIDEMIOL|INDUSTRIAL ?HEALTH|OCCUPATIONAL|\bDIH\b|HOSPITAL ?ADMIN|\bMHA\b|MATERNITY (AND |&)? ?CHILD ?WELFARE|\bDMCW\b/, "non-clinical-medicine"],
  [/PHARMACOL|PHYSIOLOG|ANATOM|FORENSIC|LEGAL ?MED|\bD\.? ?F\.? ?M\.?\b|MEDICAL ?JURIS|BIOPHYS|GENETIC/, "non-clinical-medicine"],
  [/FAMILY ?MED|GENERAL ?PRACTI|FAMILY ?WELFARE|\bDFM\b|\bDNB ?\(?FM\)?/, "general-practice"],
  [/GEN\w*\.? ?MED|GENERAL ?MEDICINE|INTERNAL ?MED|\bMEDICINE\b|\bMED\.?\)|\(MED\b|\bDNB ?\(?MED/, "internal-medicine"],
  [/GEN\w*\.? ?SURG|GENERAL ?SURGERY|\bSURGERY\b|\bSURG\.?\)|\bSURG\b/, "general-surgery"],
];

const SUPER = /^\s*(D\.? ?M\b|M\.? ?CH\b|DR\.? ?N\.? ?B|DNB ?\(?SUPER|POST ?DOCTORAL|FELLOW)/;
const PG = /^\s*(M\.? ?D\b|M\.? ?S\b|D\.? ?N\.? ?B|DIPLOMATE|DOCTOR OF MEDICINE|MASTER OF SURGERY|M\.? ?SC|MDS)/;
const DIPLOMA = /^\s*(DIP|D\.? ?[A-Z]\.? ?[A-Z]|P\.? ?G\.? ?D|POST ?GRAD\w* DIP)/;
const JUNK = /^\s*(-+|#N\/A|NULL|NA|N\.A\.?|NIL|NONE|0)?\s*$/i;

function normalizeDegree(raw: string): string {
  return raw
    .toUpperCase()
    // As an additional qualification, "Doctor of Medicine - General Medicine" is an MD in that branch (Kerala's spelling), not a foreign primary.
    .replace(/^\s*DOCTOR OF MEDICINE\b/, "MD")
    .replace(/^\s*MASTER OF SURGERY\b/, "MS")
    .replace(/[‘’'"`]/g, "")
    .replace(/[^A-Z0-9().&/\- ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function rankOf(u: string): Rank {
  if (SUPER.test(u)) return 3;
  if (PG.test(u)) return 2;
  if (DIPLOMA.test(u)) return 1;
  return 0;
}

/** Read one degree string. `pgUnspecified` = a PG degree whose branch is not recorded ("MD", "M.S", "DNB"). */
export function readDegree(raw: string, slot: "primary" | "additional" = "additional"): { key: string | null; rank: Rank; pgUnspecified: boolean } {
  if (JUNK.test(raw)) return { key: null, rank: 0, pgUnspecified: false };
  if (slot === "primary" && PRIMARY_EQUIVALENT.test(raw.toUpperCase())) return { key: null, rank: 0, pgUnspecified: false };
  const u = normalizeDegree(raw);
  if (!u || PRIMARY_EQUIVALENT.test(u)) return { key: null, rank: 0, pgUnspecified: false };
  const rank = rankOf(u);
  for (const [re, key] of RULES) if (re.test(u)) return { key, rank: rank === 0 ? 1 : rank, pgUnspecified: false };
  return { key: null, rank, pgUnspecified: rank >= 2 };
}

/**
 * The speciality for an entry: the highest-ranked readable degree, ties to
 * the earliest listed. `primary` is considered too, for the rare entries whose
 * primary qualification is itself a branch PG degree.
 */
export function readSpecialty(primary: string | null, additional: string[]): { reading: SpecialtyReading | null; pgUnspecified: boolean } {
  let best: SpecialtyReading | null = null;
  let pgUnspecified = false;
  for (const [i, d] of [primary ?? "", ...additional].entries()) {
    if (!d.trim()) continue;
    const r = readDegree(d, i === 0 ? "primary" : "additional");
    if (r.pgUnspecified) pgUnspecified = true;
    if (r.key && (!best || r.rank > best.rank)) best = { key: r.key, rank: r.rank, basis: d.trim() };
  }
  return { reading: best, pgUnspecified };
}

/* ------------------------------------------------------------------------ */
/* Category                                                                  */
/* ------------------------------------------------------------------------ */

export type Category = "superspecialist" | "specialist" | "diploma-specialist" | "pg-unspecified" | "mbbs-only" | "pre-1980" | "struck-off" | "name-unusable" | "no-number";

export interface RegisterInput {
  name: string;
  number: string;
  removed: boolean;
  primaryQualification: string | null;
  primaryYear: number | null;
  registrationYear: number | null;
  additional: Array<{ degree: string; year: number | null }>;
}

export interface Classified {
  nameClean: string | null;
  category: Category;
  specialty: SpecialtyReading | null;
  eraYear: number | null;
}

export function plausibleYear(y: number | null | undefined): number | null {
  return y != null && Number.isInteger(y) && y >= 1880 && y <= CURRENT_YEAR ? y : null;
}

/** Latest plausible qualification year; the registration date only when no qualification carries a year. */
export function eraYearOf(input: Pick<RegisterInput, "primaryYear" | "registrationYear" | "additional">): number | null {
  const years = [plausibleYear(input.primaryYear), ...input.additional.map((a) => plausibleYear(a.year))].filter((y): y is number => y !== null);
  if (years.length) return Math.max(...years);
  return plausibleYear(input.registrationYear);
}

export function classify(input: RegisterInput): Classified {
  const nameClean = cleanName(input.name);
  const eraYear = eraYearOf(input);
  const { reading, pgUnspecified } = readSpecialty(input.primaryQualification, input.additional.map((a) => a.degree));
  let category: Category;
  if (input.removed) category = "struck-off";
  else if (!input.number.trim() || /^(0|-|n\/?a|nil|null)$/i.test(input.number.trim())) category = "no-number";
  else if (!nameClean) category = "name-unusable";
  else if (eraYear !== null && eraYear < ACTIVE_ERA_FROM) category = "pre-1980";
  else if (reading && reading.rank === 3) category = "superspecialist";
  else if (reading && reading.rank === 2) category = "specialist";
  else if (reading) category = "diploma-specialist";
  else if (pgUnspecified) category = "pg-unspecified";
  else category = "mbbs-only";
  return { nameClean, category, specialty: reading, eraYear };
}

/** Categories from which a profile is built. */
export const PROFILE_CATEGORIES: Category[] = ["superspecialist", "specialist", "diploma-specialist"];
