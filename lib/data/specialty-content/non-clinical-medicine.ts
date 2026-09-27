import type { SpecialtyContent } from "./types";

export const nonClinicalMedicine: SpecialtyContent = {
  key: "non-clinical-medicine",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "Non-clinical doctors hold a medical qualification, usually an MBBS and often a postgraduate degree (MD or DNB), but their work does not involve treating patients. They teach in medical colleges, carry out research, work in public health, run hospitals, or provide expert evidence in legal matters. The disciplines include anatomy, physiology, biochemistry, pharmacology, forensic medicine and community medicine.",
    "They appear in The Doctor Index because they are qualified practitioners who are on the same medical registers as clinical doctors. A listing here is a record of qualification and registration. It is not an invitation to book a consultation, and a non-clinical doctor is not the right person to diagnose or treat an illness.",
    "Their work still matters to patients indirectly. The doctors who treat you were trained by them, the medicines you take were studied by them, and public health programmes, disease surveillance and hospital systems are often run by them.",
  ],
  conditions: [
    { name: "Anatomy", note: "The structure of the human body; anatomists teach medical students and support surgical training." },
    { name: "Physiology", note: "How the body's systems work; the foundation of understanding disease." },
    { name: "Biochemistry", note: "The chemistry of the body; some biochemists also oversee clinical laboratory testing." },
    { name: "Pharmacology", note: "How medicines work and their safety; pharmacologists teach, research, and work in drug safety monitoring." },
    { name: "Forensic medicine", note: "Medicine applied to the law, including post-mortem examinations and medico-legal reports." },
    { name: "Community medicine", note: "Public health, disease prevention, epidemiology and health programmes for populations." },
    { name: "Hospital administration and health policy", note: "Running hospitals and health systems, quality and planning." },
  ],
  tests: [
    { name: "Medical education", note: "Teaching and assessing medical and nursing students." },
    { name: "Research", note: "Laboratory, clinical and population research, including drug trials and safety studies." },
    { name: "Public health work", note: "Disease surveillance, outbreak investigation, vaccination and health programmes." },
    { name: "Medico-legal work", note: "Post-mortem examinations, injury reports and expert opinion for courts and police, done by forensic medicine specialists." },
    { name: "Health administration", note: "Managing hospitals, insurance medical review, and health policy." },
  ],
  versus: [
    { key: "general-practice", text: "For any symptom or illness, see a clinical doctor such as a general physician, who examines, diagnoses and treats patients." },
    { key: "pathology", text: "Pathologists and microbiologists are sometimes grouped with non-clinical subjects in medical colleges, but their laboratory reports feed directly into patient care and they are listed separately here." },
  ],
  firstVisit: [
    "Use a non-clinical doctor's listing to confirm their qualification and registration, or for academic, research or medico-legal contact.",
    "For treatment, a second opinion on symptoms, or a prescription, choose a clinical doctor in the relevant speciality instead.",
    "For a medico-legal matter such as an injury report or post-mortem, contact usually goes through the hospital, police or court rather than directly to the doctor.",
  ],
  urgent: [
    "Non-clinical doctors do not provide emergency care. In an emergency, call 108 or go to the nearest emergency department.",
  ],
  faqs: [
    {
      q: "Can I consult a non-clinical doctor for treatment?",
      a: "No. Non-clinical doctors do not see patients for diagnosis or treatment. For any health problem, see a clinical doctor such as a general physician or the relevant specialist.",
    },
    {
      q: "Why are non-clinical doctors listed in The Doctor Index?",
      a: "They are qualified and registered medical practitioners who appear on the same registers the index is built from. The listing records their qualification and registration.",
    },
    {
      q: "What does a forensic medicine specialist do?",
      a: "They apply medical knowledge to legal questions, including post-mortem examinations, injury assessment and expert evidence in court.",
    },
    {
      q: "What is community medicine?",
      a: "The branch of medicine concerned with the health of populations: prevention, epidemiology, and planning and running public health programmes.",
    },
    {
      q: "How can I check a non-clinical doctor's registration?",
      a: "The registration number should appear on the NMC's Indian Medical Register or a state medical council register, in the same way as for a clinical doctor.",
    },
  ],
};
