import type { SpecialtyKey } from "@/lib/types";

/**
 * Condition departments → the directory's specialities.
 *
 * The compiled drafts route each condition to one of 31 clinical departments.
 * The directory lists doctors by speciality key, so each department maps to
 * the speciality a reader can actually book. `basis` says how honest that
 * mapping is, and the page words the link accordingly:
 *
 *   exact    — the department is the speciality.
 *   nearest  — the directory has no such speciality; this is the closest one
 *              that sees these patients (hepatology → gastroenterology).
 *   none     — nothing on the directory is a fair stand-in (clinical
 *              genetics). The page says so and points to a first-contact
 *              doctor instead of pretending.
 *
 * Every department in the import must be listed; the importer refuses one
 * that is not, and tests/unit/conditions.test.ts checks the table.
 */

export interface DepartmentInfo {
  name: string;
  slug: string;
  specialty: SpecialtyKey | null;
  basis: "exact" | "nearest" | "none";
  /** One line for the hub card. Plain, non-clinical orientation. */
  blurb: string;
}

const D = (name: string, specialty: SpecialtyKey | null, basis: DepartmentInfo["basis"], blurb: string): DepartmentInfo => ({
  name,
  slug: departmentSlug(name),
  specialty,
  basis,
  blurb,
});

export function departmentSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const DEPARTMENTS: DepartmentInfo[] = [
  D("Allergy and Immunology", "internal-medicine", "nearest", "Allergies, immune deficiencies and conditions of an overactive or underactive immune system."),
  D("Cardiology", "cardiology", "exact", "Conditions of the heart, its rhythm and its valves."),
  D("Clinical Genetics", null, "none", "Inherited and chromosomal conditions, most of them rare, usually assessed by a clinical geneticist."),
  D("Dentistry", "dentistry", "exact", "Conditions of the teeth, gums and mouth."),
  D("Dermatology", "dermatology", "exact", "Conditions of the skin, hair and nails."),
  D("Diabetology", "diabetology", "exact", "Diabetes and conditions closely linked to blood sugar control."),
  D("ENT", "ent", "exact", "Conditions of the ear, nose, throat, sinuses and voice."),
  D("Emergency Medicine", "emergency-medicine", "exact", "Injuries, poisonings and conditions that need urgent care first."),
  D("Endocrinology", "endocrinology", "exact", "Hormone and gland conditions — thyroid, adrenal, pituitary and others."),
  D("Gastroenterology", "gastroenterology", "exact", "Conditions of the stomach, intestines, pancreas and digestion."),
  D("General Medicine", "internal-medicine", "exact", "Conditions usually assessed first by a physician."),
  D("General Surgery", "general-surgery", "exact", "Conditions commonly managed by a general surgeon."),
  D("Haematology", "haematology", "exact", "Conditions of the blood, bone marrow, bleeding and clotting."),
  D("Hepatology", "gastroenterology", "nearest", "Conditions of the liver and bile ducts."),
  D("Infectious Diseases", "infectious-diseases", "exact", "Infections caused by bacteria, viruses, fungi and parasites."),
  D("Metabolic Medicine", null, "none", "Inherited metabolic conditions, usually assessed by a metabolic specialist or clinical geneticist."),
  D("Nephrology", "nephrology", "exact", "Conditions of the kidneys."),
  D("Neurology", "neurology", "exact", "Conditions of the brain, spinal cord, nerves and muscles."),
  D("Neurosurgery", "neurosurgery", "exact", "Conditions of the brain and spine that may need surgical assessment."),
  D("Obstetrics and Gynaecology", "gynaecology", "exact", "Conditions of pregnancy and the female reproductive system."),
  D("Oncology", "medical-oncology", "nearest", "Cancers, assessed by an oncologist alongside the relevant organ specialist."),
  D("Ophthalmology", "ophthalmology", "exact", "Conditions of the eye and vision."),
  D("Oral and Maxillofacial Surgery", "dentistry", "nearest", "Conditions of the jaw, face and mouth that may need surgery."),
  D("Orthopaedics", "orthopaedics", "exact", "Conditions of the bones, joints, ligaments and spine."),
  D("Paediatrics", "paediatrics", "exact", "Conditions that begin in, or mainly affect, children."),
  D("Psychiatry", "psychiatry", "exact", "Mental health conditions."),
  D("Pulmonology", "pulmonology", "exact", "Conditions of the lungs and breathing."),
  D("Reproductive Medicine", "gynaecology", "nearest", "Fertility and reproductive conditions."),
  D("Rheumatology", "rheumatology", "exact", "Arthritis, autoimmune and connective-tissue conditions."),
  D("Urology", "urology", "exact", "Conditions of the urinary tract and male reproductive organs."),
  D("Vascular Medicine", "cardiology", "nearest", "Conditions of the arteries, veins and circulation."),
];

const BY_NAME = new Map(DEPARTMENTS.map((d) => [d.name, d]));
const BY_SLUG = new Map(DEPARTMENTS.map((d) => [d.slug, d]));

export function departmentByName(name: string): DepartmentInfo | null {
  return BY_NAME.get(name) ?? null;
}
export function departmentBySlug(slug: string): DepartmentInfo | null {
  return BY_SLUG.get(slug) ?? null;
}

/**
 * Where a reader goes when the department has no speciality on the directory:
 * a first-contact doctor who can refer. Children first to a paediatrician.
 */
export const FIRST_CONTACT: SpecialtyKey[] = ["general-practice", "paediatrics"];
