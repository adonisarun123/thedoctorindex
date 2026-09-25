import { SOURCE_NMC_COURSES, SOURCE_NMC_IMR, SOURCE_NMC_PGMER, qualification, type QualificationInput } from "@/lib/qualifications/build";
import type { QualificationEntry } from "@/lib/qualifications/types";

const CHECKED = "25 Sep 2026";

/**
 * The two-year postgraduate diplomas of modern medicine. One builder for the
 * shared facts (two years after MBBS, NEET-PG, universities, PGMER-2023),
 * each entry saying what the diploma trains for and where it sits beside the
 * three-year degree in the same branch.
 */
function diploma(input: Omit<QualificationInput, "kind" | "system" | "awardedBy" | "duration" | "entry" | "registerSlug" | "checkedOn" | "sources"> & { degree: string; degreeSlug: string }): QualificationEntry {
  const { degree, degreeSlug, ...rest } = input;
  return qualification({
    ...rest,
    kind: "diploma",
    system: "modern",
    awardedBy: "Universities, under the NMC's Post-Graduate Medical Education Regulations",
    duration: "2 years after MBBS",
    entry: "NEET-PG",
    registerSlug: "national-medical-commission",
    about: [
      ...rest.about,
      `A postgraduate diploma is two years of training after the MBBS, entered through NEET-PG and awarded by a university under the same regulations as the degrees; the National Medical Commission's Post-Graduate Medical Education Regulations, 2023 set two years as its length against three for a broad-speciality degree. A diploma holder is a trained specialist in the branch, and may go on to complete the [${degree}](/qualifications/${degreeSlug}) or a [DNB](/qualifications/dnb) with the diploma counted towards it. Many profiles here record both — the diploma first, the degree later.`,
    ],
    extraFaqs: [
      {
        q: `Is ${input.abbr} enough to practise as a specialist?`,
        a: `Yes. A postgraduate diploma is a recognised specialist qualification in its branch, and diploma holders practise as specialists across India. It is shorter than the three-year degree in the same branch and does not by itself qualify the holder for super-speciality training, which is entered from an MD, MS or DNB.`,
      },
      ...(rest.extraFaqs ?? []),
    ],
    checkedOn: CHECKED,
    sources: [SOURCE_NMC_PGMER, SOURCE_NMC_IMR, SOURCE_NMC_COURSES],
  });
}

export const DIPLOMAS: QualificationEntry[] = [
  diploma({
    slug: "dgo",
    abbr: "DGO",
    name: "Diploma in Gynaecology and Obstetrics",
    degree: "MS or MD in Obstetrics and Gynaecology",
    degreeSlug: "md-ms-obstetrics-gynaecology",
    pattern: "^DGO$",
    standfirst: "The DGO is the two-year postgraduate diploma in obstetrics and gynaecology — the commonest specialist diploma on this site, held mainly by gynaecologists.",
    about: [
      "The DGO is the two-year postgraduate diploma in obstetrics and gynaecology, and it is the most widely held specialist diploma among the doctors on this site: a large share of the gynaecologists here, especially in Madhya Pradesh and Gujarat, record a DGO either alone or alongside a later MS or MD. A DGO holder is a qualified gynaecologist and obstetrician who delivers babies, performs caesarean sections and manages gynaecological illness; what the diploma does not carry is the third year of training and the dissertation of the degree.",
    ],
    related: ["md-ms-obstetrics-gynaecology", "dch", "md"],
  }),
  diploma({
    slug: "dch",
    abbr: "DCH",
    name: "Diploma in Child Health",
    degree: "MD in Paediatrics",
    degreeSlug: "md-paediatrics",
    pattern: "^DCH$",
    standfirst: "The DCH is the two-year postgraduate diploma in paediatrics; a DCH holder is a qualified children's doctor, many of whom later add the MD.",
    about: [
      "The DCH is the two-year postgraduate diploma in paediatrics, and after the DGO it is the diploma most often recorded on this site — chiefly by paediatricians in Madhya Pradesh, Gujarat and Rajasthan, a good number of whom also record a later MD (Paediatrics). A DCH holder is a qualified paediatrician: they run children's outpatient practices, manage newborns and admit sick children. The MD adds a year and a dissertation, and is the route into neonatology and the other paediatric super-specialities.",
    ],
    related: ["md-paediatrics", "dgo", "md"],
  }),
  diploma({
    slug: "da",
    abbr: "DA",
    name: "Diploma in Anaesthesiology",
    degree: "MD in Anaesthesiology",
    degreeSlug: "md-anaesthesiology",
    pattern: "^DA$",
    standfirst: "The DA is the two-year postgraduate diploma in anaesthesiology, held by anaesthetists who give anaesthesia in operating theatres and run pain clinics.",
    about: [
      "The DA is the two-year postgraduate diploma in anaesthesiology. Its holders give general and regional anaesthesia, manage patients through surgery and in intensive care, and increasingly run pain clinics; a DA is a full anaesthetist's qualification for hospital work, and anaesthetists on this site record it in numbers second only to the DGO and DCH. Because anaesthesia is a hospital speciality with little outpatient practice, DA holders are less visible to patients than their numbers suggest — you meet them on the day of surgery.",
    ],
    related: ["md-anaesthesiology", "md", "dnb"],
  }),
  diploma({
    slug: "doms",
    abbr: "DOMS",
    name: "Diploma in Ophthalmic Medicine and Surgery (also written DO)",
    degree: "MS in Ophthalmology",
    degreeSlug: "ms-ophthalmology",
    pattern: "^(DOMS|DO)$",
    standfirst: "The DOMS, also written DO, is the two-year postgraduate diploma in ophthalmology; its holders are eye specialists who treat and operate.",
    about: [
      "The DOMS — Diploma in Ophthalmic Medicine and Surgery, written DO by some universities — is the two-year postgraduate diploma in ophthalmology. A DOMS holder is an eye specialist who diagnoses and treats eye disease and performs the common eye operations, including cataract surgery; the MS (Ophthalmology) is the three-year degree in the same branch. Profiles on this site record the diploma under both abbreviations, and both are counted on this page.",
    ],
    related: ["ms-ophthalmology", "dlo", "ms"],
  }),
  diploma({
    slug: "dlo",
    abbr: "DLO",
    name: "Diploma in Oto-Rhino-Laryngology",
    degree: "MS in ENT",
    degreeSlug: "ms-ent",
    pattern: "^DLO$",
    standfirst: "The DLO is the two-year postgraduate diploma in ear, nose and throat surgery, the diploma route into ENT practice.",
    about: [
      "The DLO is the two-year postgraduate diploma in otorhinolaryngology — ear, nose and throat. A DLO holder is an ENT specialist who treats hearing loss, sinus disease, tonsils and throat conditions and performs the routine ENT operations; the MS (ENT) is the three-year degree in the same branch. ENT surgeons on this site record the DLO in fair numbers, often alongside a later MS.",
    ],
    related: ["ms-ent", "doms", "ms"],
  }),
  diploma({
    slug: "d-ortho",
    abbr: "D.Ortho",
    name: "Diploma in Orthopaedics",
    degree: "MS in Orthopaedics",
    degreeSlug: "ms-orthopaedics",
    pattern: "^DORTH(O)?$",
    standfirst: "The D.Ortho is the two-year postgraduate diploma in orthopaedics; a D.Ortho holder is a qualified bone-and-joint surgeon.",
    about: [
      "The D.Ortho — written D.Orth by some universities — is the two-year postgraduate diploma in orthopaedics. Its holders treat fractures, joint and spine problems and sports injuries, and perform orthopaedic surgery; the MS (Orthopaedics) is the three-year degree in the same branch and the entry to joint-replacement and spine fellowships. Orthopaedic surgeons on this site record the diploma under both spellings, and both are counted here.",
    ],
    related: ["ms-orthopaedics", "ms", "dnb"],
  }),
  diploma({
    slug: "dcp",
    abbr: "DCP",
    name: "Diploma in Clinical Pathology (also DPB, Diploma in Pathology and Bacteriology)",
    degree: "MD in Pathology",
    degreeSlug: "md-pathology",
    pattern: "^(DCP|DPB)$",
    standfirst: "The DCP is the two-year postgraduate diploma in pathology, held by the doctors who run laboratories and report on blood tests and biopsies.",
    about: [
      "The DCP — and the older DPB, Diploma in Pathology and Bacteriology, which this page also counts — is the two-year postgraduate diploma in pathology. Its holders run diagnostic laboratories and blood banks and report on blood tests, tissue biopsies and cytology; they are specialists a patient rarely meets but whose reports every other specialist depends on. The MD (Pathology) is the three-year degree in the same branch. Pathologists on this site are listed under a laboratory speciality, not as treating doctors.",
    ],
    related: ["md-pathology", "dmrd", "md"],
  }),
  diploma({
    slug: "dmrd",
    abbr: "DMRD",
    name: "Diploma in Medical Radio-Diagnosis",
    degree: "MD in Radiodiagnosis",
    degreeSlug: "md-radiodiagnosis",
    pattern: "^DMRD$",
    standfirst: "The DMRD is the two-year postgraduate diploma in radiodiagnosis — the diploma held by radiologists who read X-rays, ultrasound, CT and MRI.",
    about: [
      "The DMRD is the two-year postgraduate diploma in radiodiagnosis. A DMRD holder is a radiologist: the specialist who performs and reports ultrasound, X-ray, CT and MRI examinations, and who is registered under the PC-PNDT Act to run an ultrasound machine. The MD (Radiodiagnosis) is the three-year degree in the same branch. Radiologists on this site are listed under radiology, and the DMRD is recorded mainly by those in Madhya Pradesh and Gujarat.",
    ],
    related: ["md-radiodiagnosis", "dcp", "md"],
  }),
  diploma({
    slug: "dtcd",
    abbr: "DTCD",
    name: "Diploma in Tuberculosis and Chest Diseases",
    degree: "MD in Pulmonary Medicine",
    degreeSlug: "md",
    pattern: "^DTCD$",
    standfirst: "The DTCD is the two-year postgraduate diploma in tuberculosis and chest diseases, the diploma route into pulmonology.",
    about: [
      "The DTCD is the two-year postgraduate diploma in tuberculosis and chest diseases — the older name for what is now called pulmonary or respiratory medicine. A DTCD holder is a chest physician: asthma, COPD, tuberculosis, pneumonia and sleep-disordered breathing are their field, and many run the district TB programmes. The three-year degree in the same branch is the MD in Pulmonary Medicine (older certificates read MD in Tuberculosis and Chest Diseases). Pulmonologists on this site record the DTCD in modest numbers.",
    ],
    related: ["md", "da", "dnb"],
  }),
  diploma({
    slug: "dvd",
    abbr: "DVD",
    name: "Diploma in Venereology and Dermatology (also DDVL)",
    degree: "MD in Dermatology",
    degreeSlug: "md-dermatology",
    pattern: "^(DVD|DDVL)$",
    standfirst: "The DVD, also written DDVL, is the two-year postgraduate diploma in dermatology and venereology, the diploma route into skin practice.",
    about: [
      "The DVD — Diploma in Venereology and Dermatology, written DDVL (Dermatology, Venereology and Leprosy) by many universities — is the two-year postgraduate diploma in skin, sexually transmitted infections and leprosy. A DVD holder is a dermatologist who treats skin disease and, increasingly, runs cosmetic procedures; the MD (Dermatology) is the three-year degree in the same branch. Both abbreviations are counted here. A dermatologist's qualification is worth checking because the cosmetic market attracts practitioners with no dermatology training at all.",
    ],
    related: ["md-dermatology", "md", "dnb"],
  }),
  diploma({
    slug: "dpm",
    abbr: "DPM",
    name: "Diploma in Psychological Medicine",
    degree: "MD in Psychiatry",
    degreeSlug: "md-psychiatry",
    pattern: "^DPM$",
    standfirst: "The DPM is the two-year postgraduate diploma in psychiatry; a DPM holder is a psychiatrist — a medical doctor who can prescribe.",
    about: [
      "The DPM is the two-year postgraduate diploma in psychiatry. A DPM holder is a psychiatrist: a medical doctor with the MBBS underneath, registered with a medical council, who diagnoses mental illness and prescribes for it. That distinguishes the DPM from the qualifications of a clinical psychologist, who is registered with the [Rehabilitation Council of India](/registers/rehabilitation-council-of-india) and does not prescribe. The MD (Psychiatry) is the three-year degree in the same branch and is far more common on this site than the diploma.",
    ],
    related: ["md-psychiatry", "md", "dnb"],
  }),
];
