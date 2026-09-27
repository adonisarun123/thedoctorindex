import type { SpecialtyContent } from "./types";

export const nuclearMedicine: SpecialtyContent = {
  key: "nuclear-medicine",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A nuclear medicine physician uses very small amounts of radioactive substances, called tracers or radiopharmaceuticals, to see how organs are working and, for some conditions, to treat them. In India the usual route is an MBBS followed by a postgraduate degree in nuclear medicine (MD or DNB). The work is done in licensed departments with specialised cameras and strict radiation safety rules.",
    "The difference from ordinary radiology is what the picture shows. A CT or MRI mainly shows structure: shape, size and position. A nuclear medicine scan shows function: where the tracer collects and how quickly, which reflects how active a tissue is. That is why these scans are used to look at thyroid activity, kidney function, blood flow to the heart muscle, bone turnover, and how active a tumour is. A PET-CT combines both kinds of picture in one sitting.",
    "Most people reach a nuclear medicine department on referral, for a scan requested by an oncologist, endocrinologist, cardiologist or nephrologist, and the report goes back to that doctor. Nuclear medicine physicians also see patients directly for treatments such as radioiodine for an overactive thyroid or for some thyroid cancers, where they explain the preparation, the precautions afterwards, and the follow-up.",
  ],
  conditions: [
    { name: "Cancer staging and response", note: "PET-CT is often used to see how far a cancer has spread and how it is responding to treatment." },
    { name: "Overactive thyroid", note: "Thyroid scans help find the cause, and radioiodine is one of the treatment options the endocrinologist may discuss." },
    { name: "Thyroid cancer", note: "After surgery, radioiodine is used in some patients, with scans to check for remaining thyroid tissue." },
    { name: "Bone pain or suspected spread to bone", note: "A bone scan shows areas of increased bone activity across the whole skeleton." },
    { name: "Kidney function questions", note: "Kidney scans measure how much each kidney contributes and whether urine drains properly, which matters in children and before surgery." },
    { name: "Coronary artery disease", note: "Myocardial perfusion scans show whether parts of the heart muscle get too little blood during stress." },
    { name: "Some neurological questions", note: "Certain brain scans are used in selected cases of epilepsy, dementia or movement disorders, usually at a neurologist's request." },
  ],
  tests: [
    { name: "PET-CT", note: "A tracer injection followed by a scan that combines metabolic activity with CT anatomy. Fasting and sugar control before the scan are usually required." },
    { name: "Bone scan", note: "A tracer injection, a wait of a few hours, then images of the whole skeleton." },
    { name: "Thyroid scan and uptake", note: "Shows how the thyroid takes up tracer, which helps distinguish different causes of an overactive thyroid." },
    { name: "Renal scan (DTPA or DMSA)", note: "Measures kidney function and drainage, or looks for scarring in the kidneys." },
    { name: "Myocardial perfusion imaging", note: "Pictures of the heart at rest and under stress, from exercise or a medicine, to look at blood supply to the muscle." },
    { name: "Radioiodine therapy", note: "A capsule or drink of radioactive iodine for some thyroid conditions, with specific precautions afterwards that the department explains." },
    { name: "Other targeted radionuclide therapies", note: "Used for selected cancers in specialised centres, as part of a plan agreed with the oncology team." },
  ],
  versus: [
    { key: "radiology", text: "Radiologists report X-ray, ultrasound, CT and MRI, which mainly show structure. Nuclear medicine physicians use tracers to show function, and report PET-CT, bone, thyroid, kidney and heart scans." },
    { key: "endocrinology", text: "An endocrinologist diagnoses and manages thyroid disease overall. When radioiodine or a thyroid scan is part of the plan, the nuclear medicine physician carries out that part." },
  ],
  firstVisit: [
    "Follow the department's instructions exactly. PET-CT usually needs fasting and a blood sugar check, and some thyroid tests need certain medicines, iodine-rich foods or recent contrast scans to be avoided beforehand.",
    "Tell the staff if you are or might be pregnant, or are breastfeeding, before any tracer is given.",
    "Bring the request form, earlier scans (especially earlier PET-CTs for comparison), and recent reports. For diabetes, ask how to manage your medicines on the scan day.",
    "Expect a wait between the injection and the images; bring something to read. Drinking water afterwards is often advised to help clear the tracer.",
    "After radioiodine treatment you will be given specific precautions about contact with children and pregnant women for a period. Follow them as given.",
  ],
  urgent: [
    "Breathing difficulty, rash or swelling after an injection: tell the staff immediately",
    "Chest pain or collapse during or after a stress test: staff will manage it on site; outside the department call 108",
    "The scan itself is not an emergency test; symptoms such as sudden chest pain or stroke signs need 108 and an emergency department",
  ],
  faqs: [
    {
      q: "Is a nuclear medicine scan dangerous?",
      a: "The tracer doses used for scans are small and chosen for the question being asked. Some precautions may be advised for a short time afterwards, particularly around pregnant women and young children, and the department will tell you if they apply.",
    },
    {
      q: "What is the difference between a PET-CT and a CT scan?",
      a: "A CT scan shows the structure of organs and tissues. A PET-CT adds a tracer that shows how metabolically active tissues are, and combines the two pictures, which helps with cancer staging and follow-up.",
    },
    {
      q: "Why do I need to fast before a PET-CT?",
      a: "The most common PET tracer behaves like sugar in the body. Eating or a high blood sugar changes where it goes and can make the scan harder to read, so the department gives specific instructions.",
    },
    {
      q: "What qualifications should a nuclear medicine physician have?",
      a: "An MBBS and a postgraduate degree in nuclear medicine, usually MD or DNB. The registration number should appear on the NMC's Indian Medical Register or a state medical council register.",
    },
    {
      q: "Do I need a referral?",
      a: "Scans are usually done on another doctor's request, because the choice of scan depends on the clinical question. For radioiodine treatment you will usually be referred by an endocrinologist, surgeon or oncologist.",
    },
  ],
};
