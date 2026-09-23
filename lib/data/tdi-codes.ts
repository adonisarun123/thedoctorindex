import type { SpecialtyKey } from "@/lib/types";

/**
 * Three-letter speciality codes used in TDI IDs (`TDI-CAR-00412`).
 *
 * A code is frozen the day the first ID carrying it is issued. Never rename or
 * reuse one: printed cards and QR codes carry it, and an ID is permanent even
 * if the doctor's speciality is later corrected (the code records the
 * speciality at issue, not now). A new speciality needs a new, unused code —
 * the Record type makes a missing one a compile error, and the database
 * trigger refuses to publish a doctor whose speciality has none.
 *
 * Mirrored into `specialties.tdi_code` by `npm run db:taxonomy`.
 */
export const TDI_CODES: Record<SpecialtyKey, string> = {
  acupuncture: "ACU",
  anaesthesiology: "ANE",
  audiology: "AUD",
  ayush: "AYU",
  cardiology: "CAR",
  "cardiothoracic-surgery": "CTS",
  "clinical-psychology": "CPS",
  cosmetology: "COS",
  dentistry: "DEN",
  dermatology: "DRM",
  diabetology: "DIA",
  dietetics: "DIE",
  endocrinology: "END",
  ent: "ENT",
  gastroenterology: "GAS",
  "general-practice": "GPR",
  "general-surgery": "GSU",
  geriatrics: "GER",
  "gi-surgery": "GIS",
  gynaecology: "GYN",
  haematology: "HAE",
  "internal-medicine": "IMD",
  "medical-oncology": "MON",
  nephrology: "NEP",
  neurology: "NEU",
  neurosurgery: "NSU",
  "non-clinical-medicine": "NCM",
  "occupational-therapy": "OCT",
  ophthalmology: "OPH",
  orthopaedics: "ORT",
  "paediatric-surgery": "PSU",
  paediatrics: "PAE",
  pathology: "PAT",
  physiotherapy: "PHY",
  "plastic-surgery": "PLS",
  psychiatry: "PSY",
  pulmonology: "PUL",
  "radiation-oncology": "ROC",
  radiology: "RAD",
  rheumatology: "RHE",
  "sexual-medicine": "SXM",
  "surgical-oncology": "SON",
  urology: "URO",
  // Added 23 Sep 2026.
  "emergency-medicine": "EMR",
  "critical-care": "CCM",
  "physical-medicine-rehabilitation": "PMR",
  "infectious-diseases": "INF",
  "nuclear-medicine": "NUC",
  "transplant-surgery": "TRS",
};

/** `TDI-CAR-00412`. Case-insensitive on input; always stored upper-case. */
export const TDI_ID_RE = /^TDI-[A-Z]{3}-\d{5,}$/;

export function normaliseTdiId(raw: string): string | null {
  const v = raw.trim().toUpperCase();
  return TDI_ID_RE.test(v) ? v : null;
}

export function formatTdiId(code: string, n: number): string {
  return `TDI-${code}-${String(n).padStart(5, "0")}`;
}
