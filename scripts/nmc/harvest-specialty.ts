import { resolveSpecialtyQuery, specialtyByKey, specialtyBySlug } from "../../lib/data/taxonomy";

/**
 * Hospital department → site speciality. Shared by scripts/build-import.ts
 * (the September harvest pipeline) and scripts/nmc/harvest-publish.ts.
 */

export interface RosterRecord {
  specialty?: string | null;
  qualifications?: string[] | null;
  source_url?: string | null;
}

/** Hospital department names → taxonomy keys. Only mappings that are true, not convenient. */
const SPECIALTY_ALIASES: Record<string, string> = {
  "paediatric and child care": "paediatrics",
  "paediatric care": "paediatrics",
  "pediatric care": "paediatrics",
  neonatology: "paediatrics",
  "neonatology & nicu": "paediatrics",
  "paediatric critical care medicine": "paediatrics",
  "child development": "paediatrics",
  "cardiac sciences": "cardiology",
  "adult cardiac surgery": "cardiothoracic-surgery",
  "cardiac surgery": "cardiothoracic-surgery",
  "cardiothoracic and vascular surgery": "cardiothoracic-surgery",
  "vascular and endovascular surgery": "cardiothoracic-surgery",
  "vascular & endovascular surgery": "cardiothoracic-surgery",
  "thoracic surgery": "cardiothoracic-surgery",
  "gastrointestinal science": "gastroenterology",
  "gastro science": "gastroenterology",
  "integrated liver care": "gastroenterology",
  "liver transplantation surgery": "gi-surgery",
  "liver transplantation and hepatobiliary surgery": "gi-surgery",
  "hepatobiliary surgery": "gi-surgery",
  "cancer care": "medical-oncology",
  "cancer care/oncology": "medical-oncology",
  "comprehensive cancer care": "medical-oncology",
  "adult haemato-oncology & bmt": "haematology",
  "head & neck oncology": "surgical-oncology",
  "gynaecologic oncology": "surgical-oncology",
  fertility: "gynaecology",
  "fertility/ ivf": "gynaecology",
  "fetal medicine": "gynaecology",
  maternity: "gynaecology",
  "pregnancy care/ obstetrics": "gynaecology",
  "obstetrics & gynecology & reproductive medicine": "gynaecology",
  "reproductive medicine": "gynaecology",
  "e.n.t": "ent",
  "ear nose throat": "ent",
  "dental medicine": "dentistry",
  "dental sciences & maxillofacial surgery": "dentistry",
  "cranio-maxillo facial surgery": "plastic-surgery",
  "plastic, reconstructive and cosmetic surgery": "plastic-surgery",
  "cosmetology & plastic surgery": "plastic-surgery",
  "institute of cosmetology and cosmetic surgery": "cosmetology",
  neuroscience: "neurology",
  neurosciences: "neurology",
  "laboratory medicine": "pathology",
  "lab medicine": "pathology",
  "nuclear medicine": "nuclear-medicine",
  "family medicine": "general-practice",
  "community health": "general-practice",
  "nutrition and diet science": "dietetics",
  "kidney transplant": "nephrology",
  "organ transplant": "transplant-surgery",
  transplant: "transplant-surgery",
  "transplant surgery": "transplant-surgery",
  "multi organ transplant": "transplant-surgery",
  "emergency medicine": "emergency-medicine",
  emergency: "emergency-medicine",
  "emergency & trauma care": "emergency-medicine",
  "emergency and trauma care": "emergency-medicine",
  "accident & emergency": "emergency-medicine",
  "emergency care": "emergency-medicine",
  "critical care": "critical-care",
  "critical care medicine": "critical-care",
  "intensive care": "critical-care",
  "anaesthesia and critical care": "critical-care",
  "physical medicine and rehabilitation": "physical-medicine-rehabilitation",
  "physical medicine & rehabilitation": "physical-medicine-rehabilitation",
  "physical medicine": "physical-medicine-rehabilitation",
  "rehabilitation medicine": "physical-medicine-rehabilitation",
  pmr: "physical-medicine-rehabilitation",
  "infectious diseases": "infectious-diseases",
  "infectious disease": "infectious-diseases",
  "infectious diseases & hiv": "infectious-diseases",
  "prosthodontics and implantology": "dentistry",
  "periodontist and implantologist": "dentistry",
  radiodiagnosis: "radiology",
  "renal sciences": "nephrology",
  "rani raju institute of renal sciences": "nephrology",
  "otorhinology & cochlear implant": "ent",
  "fertility services": "gynaecology",
  "orbit and oculoplasty for": "ophthalmology",
};

/** Departments that name no single speciality. The doctor's degrees decide instead. */
const AMBIGUOUS = new Set(["allied services", "support specialties", "other", "others", "general", "medical services", "clinical services"]);

/** Degrees → speciality, used only when the department is ambiguous or absent. */
const DEGREE_HINTS: Array<[RegExp, string]> = [
  [/\bMDS\b|\bBDS\b/i, "dentistry"],
  [/\bDNB\s*\(?\s*(paed|ped)|\bMD\s*\(?\s*(paed|ped)|\bDCH\b/i, "paediatrics"],
  [/\bMS\s*\(?\s*ortho|\bD\.?Ortho\b/i, "orthopaedics"],
  [/\bMS\s*\(?\s*(obg|obst)|\bDGO\b|\bMRCOG\b/i, "gynaecology"],
  [/\bMS\s*\(?\s*ent|\bDLO\b/i, "ent"],
  [/\bMS\s*\(?\s*oph|\bDO\b\s*\(?\s*oph|\bDNB\s*\(?\s*oph/i, "ophthalmology"],
  [/\bMD\s*\(?\s*derm|\bDDVL\b|\bDVD\b/i, "dermatology"],
  [/\bMD\s*\(?\s*(psych)|\bDPM\b/i, "psychiatry"],
  [/\bMD\s*\(?\s*(radio|radiodiag)|\bDMRD\b/i, "radiology"],
  [/\bMD\s*\(?\s*anaes|\bDA\b/i, "anaesthesiology"],
  [/\bMD\s*\(?\s*path|\bDCP\b/i, "pathology"],
  [/\bDM\s*\(?\s*cardio/i, "cardiology"],
  // MCh Neuro is a neurosurgeon; DM Neuro is a neurologist. Order matters.
  [/\bMCh\s*\(?\s*neuro|\bM\.?Ch\b.*neurosurg/i, "neurosurgery"],
  [/\bDM\s*\(?\s*neuro/i, "neurology"],
  [/\bDM\s*\(?\s*nephro/i, "nephrology"],
  [/\bDM\s*\(?\s*gastro/i, "gastroenterology"],
  [/\bMCh\s*\(?\s*uro|\bDNB\s*\(?\s*uro/i, "urology"],
  [/\bMPT\b|\bBPT\b/i, "physiotherapy"],
  // Only an explicit general-surgery degree. A bare "MS" says nothing: it is the
  // degree an orthopaedic, ENT, eye and general surgeon all hold.
  [/\bMS\s*\(?\s*(gen|general)\s*surg/i, "general-surgery"],
  [/\bMD\s*\(?\s*(gen|general)\s*med|\bMD\s*\(?\s*medicine/i, "internal-medicine"],
];

/**
 * Hospitals file physiotherapists under "Physical Medicine & Rehabilitation"
 * and paediatric intensivists under "Critical Care". When a department maps
 * to one of these broad specialities, the role the hospital's own page names
 * for the person wins: a physiotherapist is never labelled a physician.
 */
export const BROAD = new Set(["physical-medicine-rehabilitation", "critical-care", "emergency-medicine", "infectious-diseases", "nuclear-medicine", "transplant-surgery"]);
export const ROLE_IN_URL: Array<[RegExp, string]> = [
  [/physiotherapist/i, "physiotherapy"],
  [/occupational-therapist/i, "occupational-therapy"],
  [/speech|audiolog/i, "audiology"],
  [/p(a)?ediatric|neonatolog|pediatrician|paediatrician/i, "paediatrics"],
  [/emergency|accident/i, "emergency-medicine"],
  [/critical-care|icu|intensiv/i, "critical-care"],
  [/physiatrist|physical-medicine/i, "physical-medicine-rehabilitation"],
  [/infectious/i, "infectious-diseases"],
  [/nuclear-medicine/i, "nuclear-medicine"],
];
export const resolveSpecialty = (r: RosterRecord): string | null => {
  const key = resolveSpecialtyRaw(r);
  if (key && BROAD.has(key)) {
    const slug = (r.source_url ?? "").split("/").filter(Boolean).pop() ?? "";
    for (const [re, k] of ROLE_IN_URL) if (re.test(slug)) return k;
    // All six are physician specialities: without a medical degree on the
    // hospital's own page, the record is not labelled a physician.
    const q = (r.qualifications ?? []).join(" ");
    if (/\b(BPT|MPT)\b/i.test(q) && !/\bMBBS\b/i.test(q)) return "physiotherapy";
    if (!/\bMBBS\b|\bM\.?\s?D\b|\bDNB\b|\bD\.?M\b|\bFRCS|\bMRCP|\bIDCCM|\bEDIC|\bFNB\b/i.test(q)) return null;
    if (/p(a)?ed|\bDCH\b|neonat/i.test(q)) return "paediatrics";
    if (key === "physical-medicine-rehabilitation" && /an(a)?esth/i.test(q) && !/physical med|rehab/i.test(q)) return "anaesthesiology";
  }
  return key;
};
export function resolveSpecialtyRaw(r: RosterRecord): string | null {
  const raw = (r.specialty ?? "").trim().toLowerCase();
  if (raw && !AMBIGUOUS.has(raw)) {
    const alias = SPECIALTY_ALIASES[raw];
    if (alias) return alias;
    const hit = specialtyByKey(raw) ?? specialtyBySlug(raw) ?? resolveSpecialtyQuery(raw);
    if (hit) return hit.key;
  }
  const quals = (r.qualifications ?? []).join(" ");
  for (const [re, key] of DEGREE_HINTS) if (re.test(quals)) return key;
  if (raw) {
    // Last chance: a department like "Institute of Renal Sciences" often still
    // contains the speciality word the resolver knows.
    for (const word of raw.split(/[^a-z]+/).filter((w) => w.length > 4)) {
      const hit = resolveSpecialtyQuery(word);
      if (hit) return hit.key;
    }
  }
  return null;
}

