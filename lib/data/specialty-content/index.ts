import type { SpecialtyKey } from "@/lib/types";

import { acupuncture } from "./acupuncture";
import { anaesthesiology } from "./anaesthesiology";
import { audiology } from "./audiology";
import { ayush } from "./ayush";
import { cardiology } from "./cardiology";
import { cardiothoracicSurgery } from "./cardiothoracic-surgery";
import { clinicalPsychology } from "./clinical-psychology";
import { cosmetology } from "./cosmetology";
import { criticalCare } from "./critical-care";
import { dentistry } from "./dentistry";
import { dermatology } from "./dermatology";
import { diabetology } from "./diabetology";
import { dietetics } from "./dietetics";
import { emergencyMedicine } from "./emergency-medicine";
import { endocrinology } from "./endocrinology";
import { ent } from "./ent";
import { gastroenterology } from "./gastroenterology";
import { generalPractice } from "./general-practice";
import { generalSurgery } from "./general-surgery";
import { geriatrics } from "./geriatrics";
import { giSurgery } from "./gi-surgery";
import { gynaecology } from "./gynaecology";
import { haematology } from "./haematology";
import { infectiousDiseases } from "./infectious-diseases";
import { internalMedicine } from "./internal-medicine";
import { medicalOncology } from "./medical-oncology";
import { nephrology } from "./nephrology";
import { neurology } from "./neurology";
import { neurosurgery } from "./neurosurgery";
import { nonClinicalMedicine } from "./non-clinical-medicine";
import { nuclearMedicine } from "./nuclear-medicine";
import { occupationalTherapy } from "./occupational-therapy";
import { ophthalmology } from "./ophthalmology";
import { orthopaedics } from "./orthopaedics";
import { paediatricSurgery } from "./paediatric-surgery";
import { paediatrics } from "./paediatrics";
import { pathology } from "./pathology";
import { physicalMedicineRehabilitation } from "./physical-medicine-rehabilitation";
import { physiotherapy } from "./physiotherapy";
import { plasticSurgery } from "./plastic-surgery";
import { psychiatry } from "./psychiatry";
import { pulmonology } from "./pulmonology";
import { radiationOncology } from "./radiation-oncology";
import { radiology } from "./radiology";
import { rheumatology } from "./rheumatology";
import { sexualMedicine } from "./sexual-medicine";
import { surgicalOncology } from "./surgical-oncology";
import { transplantSurgery } from "./transplant-surgery";
import { urology } from "./urology";
import type { SpecialtyContent } from "./types";

export type { SpecialtyContent } from "./types";

const CONTENT: Partial<Record<SpecialtyKey, SpecialtyContent>> = {
  "acupuncture": acupuncture,
  "anaesthesiology": anaesthesiology,
  "audiology": audiology,
  "ayush": ayush,
  "cardiology": cardiology,
  "cardiothoracic-surgery": cardiothoracicSurgery,
  "clinical-psychology": clinicalPsychology,
  "cosmetology": cosmetology,
  "critical-care": criticalCare,
  "dentistry": dentistry,
  "dermatology": dermatology,
  "diabetology": diabetology,
  "dietetics": dietetics,
  "emergency-medicine": emergencyMedicine,
  "endocrinology": endocrinology,
  "ent": ent,
  "gastroenterology": gastroenterology,
  "general-practice": generalPractice,
  "general-surgery": generalSurgery,
  "geriatrics": geriatrics,
  "gi-surgery": giSurgery,
  "gynaecology": gynaecology,
  "haematology": haematology,
  "infectious-diseases": infectiousDiseases,
  "internal-medicine": internalMedicine,
  "medical-oncology": medicalOncology,
  "nephrology": nephrology,
  "neurology": neurology,
  "neurosurgery": neurosurgery,
  "non-clinical-medicine": nonClinicalMedicine,
  "nuclear-medicine": nuclearMedicine,
  "occupational-therapy": occupationalTherapy,
  "ophthalmology": ophthalmology,
  "orthopaedics": orthopaedics,
  "paediatric-surgery": paediatricSurgery,
  "paediatrics": paediatrics,
  "pathology": pathology,
  "physical-medicine-rehabilitation": physicalMedicineRehabilitation,
  "physiotherapy": physiotherapy,
  "plastic-surgery": plasticSurgery,
  "psychiatry": psychiatry,
  "pulmonology": pulmonology,
  "radiation-oncology": radiationOncology,
  "radiology": radiology,
  "rheumatology": rheumatology,
  "sexual-medicine": sexualMedicine,
  "surgical-oncology": surgicalOncology,
  "transplant-surgery": transplantSurgery,
  "urology": urology,
};

export function specialtyContent(key: SpecialtyKey): SpecialtyContent | null {
  return CONTENT[key] ?? null;
}

export const SPECIALTY_CONTENT_KEYS = Object.keys(CONTENT) as SpecialtyKey[];
