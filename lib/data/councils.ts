/**
 * Registering bodies a profile may cite. One list for every form that asks for
 * a registration (public add-doctor flow, admin create), grouped the way the
 * profession is regulated in India.
 *
 * The site verifies modern-medicine registrations against the NMC Indian
 * Medical Register (lib/enrich/nmc.ts). Dental, AYUSH and allied-health
 * registrations sit on other registers the worker does not read; they are
 * accepted here, stored as supplied, and checked by staff by hand. A body
 * that is not listed can be typed in — the list is a convenience, never a gate.
 */

export type CouncilKind = "medical" | "dental" | "ayush" | "allied" | "other";

export interface CouncilGroup {
  kind: CouncilKind;
  label: string;
  /** Short note shown under the select when a body in this group is chosen. */
  note: string;
  councils: string[];
}

/** Sentinel value for the free-text option. Never stored. */
export const OTHER_COUNCIL = "__other__";

export const COUNCIL_GROUPS: CouncilGroup[] = [
  {
    kind: "medical",
    label: "State medical councils (modern medicine)",
    note: "Matched automatically against the NMC Indian Medical Register.",
    councils: [
      "Karnataka Medical Council",
      "Tamil Nadu Medical Council",
      "Maharashtra Medical Council",
      "Delhi Medical Council",
      "Telangana State Medical Council",
      "Kerala State Medical Council",
      "Andhra Pradesh Medical Council",
      "Gujarat Medical Council",
      "West Bengal Medical Council",
      "Uttar Pradesh Medical Council",
      "Arunachal Pradesh Medical Council",
      "Assam Medical Council",
      "Bihar Medical Council",
      "Chhattisgarh Medical Council",
      "Goa Medical Council",
      "Haryana Medical Council",
      "Himachal Pradesh Medical Council",
      "Jammu & Kashmir Medical Council",
      "Jharkhand Medical Council",
      "Madhya Pradesh Medical Council",
      "Manipur Medical Council",
      "Meghalaya Medical Council",
      "Mizoram Medical Council",
      "Nagaland Medical Council",
      "Odisha Council of Medical Registration",
      "Punjab Medical Council",
      "Rajasthan Medical Council",
      "Sikkim Medical Council",
      "Tripura State Medical Council",
      "Uttarakhand Medical Council",
      "Chandigarh Medical Council",
      "Pondicherry Medical Council",
      "National Medical Commission",
      "Medical Council of India (historic)",
    ],
  },
  {
    kind: "dental",
    label: "Dental councils",
    note: "Dental registrations are on the DCI and state dental registers, not the NMC register. Checked by staff.",
    councils: [
      "Dental Council of India",
      "Karnataka State Dental Council",
      "Tamil Nadu State Dental Council",
      "Maharashtra State Dental Council",
      "Delhi Dental Council",
      "Kerala State Dental Council",
      "Andhra Pradesh State Dental Council",
      "Telangana State Dental Council",
      "Gujarat State Dental Council",
      "West Bengal Dental Council",
      "Uttar Pradesh State Dental Council",
    ],
  },
  {
    kind: "ayush",
    label: "AYUSH councils and boards",
    note: "Ayurveda, Unani, Siddha, Sowa-Rigpa and Homoeopathy registrations are on the NCISM/NCH and state board registers. Checked by staff.",
    councils: [
      "National Commission for Indian System of Medicine",
      "National Commission for Homoeopathy",
      "Central Council of Indian Medicine (historic)",
      "Central Council of Homoeopathy (historic)",
      "Karnataka Ayurvedic and Unani Practitioners Board",
      "Karnataka Board of Homoeopathic System of Medicine",
      "Tamil Nadu Board of Indian Medicine",
      "Tamil Nadu Homoeopathy Medical Council",
      "Maharashtra Council of Indian Medicine",
      "Maharashtra Council of Homoeopathy",
      "Board of Ayurvedic and Unani Systems of Medicine, Delhi",
      "Board of Homoeopathic System of Medicine, Delhi",
      "Kerala State Homoeopathic Medical Council",
      "Travancore-Cochin Medical Council (Indian medicine)",
    ],
  },
  {
    kind: "allied",
    label: "Physiotherapy and allied health",
    note: "Physiotherapists and other allied professionals register with a state allied-health council where one exists, or hold a professional-body membership. Checked by staff.",
    councils: [
      "National Commission for Allied and Healthcare Professions",
      "Maharashtra State Council for Occupational Therapy and Physiotherapy",
      "Gujarat State Council for Physiotherapy",
      "Delhi Council for Physiotherapy and Occupational Therapy",
      "Indian Association of Physiotherapists",
      "Indian Nursing Council",
      "Karnataka State Nursing Council",
      "Pharmacy Council of India",
      "Karnataka State Pharmacy Council",
      "Rehabilitation Council of India",
    ],
  },
];

export const COUNCIL_NAMES: string[] = COUNCIL_GROUPS.flatMap((g) => g.councils);

/** Classify a council name as written on a profile. Unknown names fall to "other" and are still accepted. */
export function councilKind(name: string | null | undefined): CouncilKind {
  if (!name) return "other";
  const n = name.toLowerCase();
  for (const g of COUNCIL_GROUPS) if (g.councils.some((c) => c.toLowerCase() === n)) return g.kind;
  if (/dental/.test(n)) return "dental";
  if (/homoeo|homeo|ayur|unani|siddha|sowa|naturopath|indian medicine|indian system|ayush/.test(n)) return "ayush";
  if (/physio|occupational|allied|nursing|pharmac|rehabilitation|paramedic|optometr|dietet|speech|audiolog/.test(n)) return "allied";
  if (/medical council|medical commission|council of medical registration|nmc\b|mci\b/.test(n)) return "medical";
  return "other";
}

/** Whether the NMC register is the right place to check this council's numbers. */
export function isMedicalCouncil(name: string | null | undefined): boolean {
  return councilKind(name) === "medical";
}

/** Noun for the register a reader should search. */
export function registerName(name: string | null | undefined): string {
  switch (councilKind(name)) {
    case "medical":
      return "the National Medical Commission register";
    case "dental":
      return "the Dental Council of India register";
    case "ayush":
      return "the NCISM or NCH register";
    case "allied":
      return "the registering council or professional body";
    default:
      return "the registering body";
  }
}

/** "Medical registration" for a medical council, "Professional registration" otherwise. */
export function registrationNoun(name: string | null | undefined): string {
  return councilKind(name) === "medical" ? "Medical registration" : "Professional registration";
}
