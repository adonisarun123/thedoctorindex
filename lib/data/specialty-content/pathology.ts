import type { SpecialtyContent } from "./types";

export const pathology: SpecialtyContent = {
  key: "pathology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A pathologist is a doctor who diagnoses disease by examining samples from the body: blood, urine, other fluids, and tissue removed at a biopsy or operation. In India that usually means an MBBS followed by a postgraduate degree in pathology (MD or DNB). Microbiologists, who identify infections and test which antibiotics will work against them, are listed alongside pathologists here because they work in the same laboratories and patients meet them in the same way.",
    "Pathology covers several kinds of work. Haematology and clinical pathology deal with blood counts, clotting tests and routine fluid tests. Biochemistry measures substances such as sugar, cholesterol and kidney markers. Histopathology and cytology look at tissue and cells under the microscope, which is how most cancers are confirmed. Microbiology grows and identifies bacteria and fungi and tests for viruses.",
    "Most patients never meet their pathologist; the laboratory report carries the signature. The report goes to the treating doctor, who puts it together with the history, examination and scans. It is uncommon to consult a pathologist directly, but a second opinion on a biopsy, where the slides or blocks are reviewed at another laboratory, is sometimes worth asking for when a diagnosis is unusual or a major treatment depends on it.",
  ],
  conditions: [
    { name: "Anaemia and blood count changes", note: "A complete blood count and a blood smear often give the first clue to anaemia, infection or a blood disorder." },
    { name: "Diabetes and metabolic conditions", note: "Blood sugar, HbA1c, cholesterol and related tests are used to diagnose and monitor these conditions." },
    { name: "Kidney and liver disease", note: "Blood and urine tests show how well these organs are working and how that changes over time." },
    { name: "Thyroid and hormone problems", note: "Hormone levels in the blood help the treating doctor diagnose and adjust treatment." },
    { name: "Infections", note: "Cultures identify the organism and show which antibiotics it responds to, which helps avoid unnecessary or ineffective treatment." },
    { name: "Suspected cancer", note: "A biopsy examined by a histopathologist confirms whether a lump is cancer and what type it is." },
    { name: "Clotting and bleeding disorders", note: "Clotting tests help explain easy bruising, heavy bleeding or unexplained clots." },
  ],
  tests: [
    { name: "Complete blood count (CBC)", note: "Measures red cells, white cells and platelets. One of the most common tests of all." },
    { name: "Biochemistry panels", note: "Blood sugar, lipids, kidney and liver function, and electrolytes." },
    { name: "Urine examination", note: "Checks for infection, protein, sugar and blood in the urine." },
    { name: "Culture and sensitivity", note: "A sample of urine, blood, sputum or pus is grown in the laboratory to find the organism and the antibiotics that work on it." },
    { name: "Biopsy (histopathology)", note: "Tissue removed by a surgeon or radiologist is processed into thin slides and examined under the microscope. It usually takes several days." },
    { name: "Fine needle aspiration cytology (FNAC)", note: "A thin needle draws cells from a lump, often in the neck or breast, for examination." },
    { name: "Pap smear", note: "Cells from the cervix are examined for changes that could lead to cancer." },
    { name: "Special stains and immunohistochemistry", note: "Extra tests on a biopsy that help classify a tumour more precisely." },
  ],
  versus: [
    { key: "haematology", text: "A pathologist reports the blood count and smear in the laboratory. A clinical haematologist sees patients with blood disorders and treats them." },
    { key: "radiology", text: "A radiologist finds and images an abnormal area; the pathologist examines the tissue taken from it and gives the diagnosis the treatment plan is based on." },
  ],
  firstVisit: [
    "Ask the laboratory or your doctor whether the test needs fasting, and for how long. Many routine tests do not, but sugar and lipid tests often do.",
    "Keep taking regular medicines unless the doctor who ordered the test has told you otherwise, and tell the collection staff what you take, especially blood thinners.",
    "Bring the doctor's request form and, where possible, earlier reports of the same tests so that trends can be compared.",
    "For a biopsy second opinion, ask the first hospital for the slides, blocks and the original report. These belong to your care and are usually released on written request.",
  ],
  urgent: [
    "Fainting, heavy bleeding or swelling at the site after a blood draw or needle test: tell the staff straight away",
    "A report showing a critically abnormal value is usually phoned to the treating doctor; if a laboratory calls you directly, contact your doctor or go to an emergency department as advised",
    "For any emergency, call 108",
  ],
  faqs: [
    {
      q: "Can I consult a pathologist directly?",
      a: "It is uncommon. Pathologists report samples for your treating doctor rather than running clinics. You can ask a pathologist to explain a report, and you can ask for slides to be reviewed elsewhere for a second opinion, but treatment decisions are made by your treating doctor.",
    },
    {
      q: "Why does a biopsy report take longer than a blood test?",
      a: "Tissue has to be fixed, processed, cut into very thin sections and stained before it can be examined. Extra stains are sometimes needed to reach a firm diagnosis, which adds more time.",
    },
    {
      q: "What does a result outside the reference range mean?",
      a: "Reference ranges are based on most healthy people, so a result slightly outside them is not always a problem. Your doctor interprets it alongside your symptoms and other results; do not change medicines on the basis of a report alone.",
    },
    {
      q: "What qualifications should a pathologist have?",
      a: "An MBBS and a postgraduate degree in pathology or microbiology, usually MD or DNB. The registration number should appear on the NMC's Indian Medical Register or a state medical council register.",
    },
    {
      q: "How do I get a second opinion on a biopsy?",
      a: "Ask the hospital that did the biopsy for the slides, the paraffin blocks and the original report, and take them to the second laboratory. The second pathologist reviews the same tissue rather than a new sample.",
    },
  ],
};
