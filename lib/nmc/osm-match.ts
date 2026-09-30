import { nameTokens } from "@/lib/enrich/names";

/**
 * Does an OpenStreetMap place name denote this doctor's own practice? Pure,
 * unit-tested. Stricter than the listing rule because an OSM name is all the
 * evidence there is: every token of the doctor's name must be in the place
 * name, the place name may carry no other person-like token, and a
 * speciality word in the place name must fit the doctor's speciality.
 */

const GENERIC = new Set(["dr", "hospital", "hospitals", "clinic", "clinics", "centre", "center", "nursing", "home", "medical", "eye", "ent", "skin", "children", "childrens", "child", "care", "health", "healthcare", "poly", "polyclinic", "speciality", "specialty", "specialist", "specialists", "multi", "multispeciality", "super", "superspeciality", "institute", "and", "the", "sri", "shri", "smt", "new", "memorial", "general", "maternity", "dental", "diagnostic", "diagnostics", "lab", "laboratory", "for", "of", "nagar", "road", "cross", "main", "layout", "colony", "heart", "kidney", "cancer", "women", "womens", "mental", "ortho", "orthopaedic", "orthopedic", "neuro", "cardiac", "chest", "fertility", "ivf", "trust", "foundation", "mission", "charitable", "government", "govt", "district", "city", "scan", "scans", "imaging", "x-ray", "xray", "ultrasound", "blood", "bank", "pharmacy", "medicals", "physiotherapy", "physio", "wellness", "cosmetology", "cosmetic", "cosmetics", "aesthetic", "aesthetics", "laser", "hair", "family", "life", "care", "mother", "baby", "kids", "sight", "vision", "smile", "dr.", "prof"]);

/** Speciality words in a place name → the specialities they fit. Anything else in the name is neutral. */
const NAME_SPECIALTY: Array<[RegExp, string[]]> = [
  [/\b(eye|vision|sight|netra|retina|optical)\b/i, ["ophthalmology"]],
  [/\bent\b/i, ["ent"]],
  [/\b(skin|derma|cosmet|hair)\b/i, ["dermatology", "cosmetology", "plastic-surgery"]],
  [/\b(child|children|childrens|kids|paediatric|pediatric|baby)\b/i, ["paediatrics", "paediatric-surgery"]],
  [/\b(dental|dentist|teeth|smile|orthodont|mds|bds)\b/i, ["dentistry"]],
  [/\b(ortho|orthopaedic|orthopedic|bone|joint|spine)\b/i, ["orthopaedics", "physical-medicine-rehabilitation", "neurosurgery"]],
  [/\b(heart|cardiac|cardio)\b/i, ["cardiology", "cardiothoracic-surgery"]],
  [/\b(kidney|renal|dialysis|uro|urology)\b/i, ["nephrology", "urology"]],
  [/\b(cancer|onco|oncology)\b/i, ["medical-oncology", "surgical-oncology", "radiation-oncology", "haematology"]],
  [/\b(maternity|women|womens|gyn|fertility|ivf|mother)\b/i, ["gynaecology"]],
  [/\b(mental|mind|psychiatr|neuro ?psych)\b/i, ["psychiatry", "clinical-psychology"]],
  [/\b(neuro|brain)\b/i, ["neurology", "neurosurgery"]],
  [/\b(chest|lung|pulmon|asthma)\b/i, ["pulmonology"]],
  [/\b(diabet|sugar|thyroid|endocrin)\b/i, ["diabetology", "endocrinology", "internal-medicine", "general-practice"]],
  [/\b(gastro|liver|digest)\b/i, ["gastroenterology", "gi-surgery"]],
  [/\b(scan|scans|imaging|x-?ray|ultrasound|radiolog|diagnostic|diagnostics|lab|laboratory|pathology)\b/i, ["radiology", "pathology"]],
  [/\b(physio|physiotherapy|rehab)\b/i, ["physiotherapy", "physical-medicine-rehabilitation"]],
];

export function osmNamesDoctor(placeName: string, doctorName: string, specialtyKey: string): { ok: boolean; reason: string } {
  const doc = nameTokens(doctorName);
  const docCore = doc.filter((t) => t.length >= 3);
  if (docCore.length < 2) return { ok: false, reason: "name too short" };
  const place = nameTokens(placeName);
  const placeSet = new Set(place);
  if (!docCore.every((t) => placeSet.has(t))) return { ok: false, reason: "not every name token in the place name" };
  // "Ravi Kumar Hospital" is as likely named after a founder, a son or a deity as after this Ravi Kumar; a two-token name needs the "Dr" on the signboard.
  if (docCore.length === 2 && !/\bdr\b/i.test(placeName.replace(/\./g, " "))) return { ok: false, reason: "two-token name and no Dr in the place name" };
  // Initials on the register ("Balarami Reddy K") are not expected on a signboard; but "Dr. E. Sai Prasad" is not "G. Sai Prasad".
  const docInitials = doc.filter((t) => t.length < 3);
  const placeInitials = place.filter((t) => t.length < 3 && t !== "dr");
  if (docInitials.length && placeInitials.length && !placeInitials.some((p) => docInitials.includes(p))) return { ok: false, reason: `initials differ: ${placeInitials.join(" ")} vs ${docInitials.join(" ")}` };
  const docSet = new Set(doc);
  const extras = place.filter((t) => t.length >= 3 && !docSet.has(t) && !GENERIC.has(t) && !NAME_SPECIALTY.some(([re]) => re.test(t)));
  if (extras.length) return { ok: false, reason: `other name in the place: ${extras.join(" ")}` };
  const undotted = placeName.replace(/\./g, "");
  for (const [re, keys] of NAME_SPECIALTY) if ((re.test(placeName) || re.test(undotted)) && !keys.includes(specialtyKey)) return { ok: false, reason: `place is a ${re.source.slice(3, 20)}… practice, doctor is ${specialtyKey}` };
  return { ok: true, reason: "place named after the doctor" };
}
