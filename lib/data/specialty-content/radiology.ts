import type { SpecialtyContent } from "./types";

export const radiology: SpecialtyContent = {
  key: "radiology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A radiologist is a doctor who specialises in medical imaging. In India that usually means an MBBS followed by a postgraduate degree in radiodiagnosis (MD or DNB). Radiologists supervise and interpret X-rays, ultrasound, CT, MRI and mammography, and write the report that goes back to the doctor who asked for the scan. The images on their own are rarely enough for a treating doctor to act on; the radiologist's written interpretation is what carries the findings.",
    "Some radiologists go on to interventional radiology, where imaging is used to guide a needle or a thin catheter inside the body. That makes it possible to take a biopsy, drain a collection of fluid, open a narrowed blood vessel or block one that is bleeding, often without an open operation. Others concentrate on one area, such as breast, neurological, musculoskeletal or paediatric imaging.",
    "Most people meet a radiologist because another doctor has asked for a scan, not through a consultation of their own. It is still reasonable to ask a radiologist to compare a new scan with an older one, or to request a second reading of a complex CT or MRI. Keeping your earlier images and reports together, whether on disc, film or a hospital portal, makes both of these far more useful.",
  ],
  conditions: [
    { name: "Injuries and fractures", note: "X-ray is usually the first test; CT or MRI is added when a fracture or soft-tissue injury needs a closer look." },
    { name: "Abdominal and pelvic symptoms", note: "Ultrasound is often the starting point for pain, gallstones, kidney stones and pelvic problems, with CT when more detail is needed." },
    { name: "Headache, stroke and nerve symptoms", note: "CT and MRI of the brain and spine help the neurologist or neurosurgeon decide what is going on." },
    { name: "Chest and lung conditions", note: "Chest X-ray and CT are used for infections, persistent cough, and nodules that need follow-up." },
    { name: "Breast symptoms and screening", note: "Mammography and breast ultrasound are used to look at lumps and changes, with image-guided biopsy when a sample is needed." },
    { name: "Pregnancy", note: "Ultrasound is used through pregnancy to check the baby's growth and development." },
    { name: "Suspected cancer and staging", note: "Imaging helps find where a tumour is, how far it has spread, and how it responds to treatment." },
    { name: "Blood vessel problems", note: "Doppler ultrasound, CT and MR angiography show narrowed or blocked vessels; interventional radiologists may treat some of them." },
  ],
  tests: [
    { name: "X-ray", note: "A quick picture using a small dose of radiation, most useful for bones and the chest." },
    { name: "Ultrasound and Doppler", note: "Sound waves create images of soft organs and blood flow. No radiation, and usually no special preparation beyond what the centre advises." },
    { name: "CT scan", note: "A series of X-ray images combined into detailed cross-sections. Sometimes a contrast injection or drink is given to show vessels and organs more clearly." },
    { name: "MRI scan", note: "Uses a strong magnet and radio waves instead of radiation. It takes longer, is noisy, and needs a safety check for metal in the body." },
    { name: "Mammography", note: "A low-dose X-ray of the breast, used for screening and for looking at symptoms." },
    { name: "Image-guided biopsy", note: "A needle guided by ultrasound or CT takes a small tissue sample for the pathologist to examine." },
    { name: "Image-guided drainage", note: "A thin tube placed under imaging drains an abscess or fluid collection." },
    { name: "Angiography and embolisation", note: "Interventional radiologists pass a catheter into blood vessels to see them, open them, or block a bleeding vessel." },
  ],
  versus: [
    { key: "nuclear-medicine", text: "Radiology mainly shows structure: the shape and size of organs and tissues. Nuclear medicine uses radioactive tracers to show how organs are working. A PET-CT combines both, and is usually reported by a nuclear medicine physician." },
    { key: "pathology", text: "A radiologist can see a suspicious area on a scan and may take a biopsy from it. The pathologist examines that sample under the microscope and gives the tissue diagnosis." },
  ],
  firstVisit: [
    "Follow the preparation instructions from the scanning centre. Fasting, a full bladder, or stopping certain medicines before a contrast scan depend on the test, and the centre will tell you what applies.",
    "Bring the doctor's request form and any earlier scans and reports of the same area. A comparison with an older scan often makes the new report more useful.",
    "Tell the staff if you are or might be pregnant, if you have had a reaction to contrast before, or if you have kidney disease or diabetes.",
    "For an MRI, mention any pacemaker, implant, metal clip, shrapnel or metal work history, and leave jewellery and cards outside the scanner room.",
    "Ask when and how the report will be ready and who will explain it. Usually it is the doctor who requested the scan.",
  ],
  urgent: [
    "Sudden severe headache, weakness of one side, or difficulty speaking: call 108 and go to an emergency department, where urgent scanning is arranged",
    "Breathing difficulty, hives or swelling after a contrast injection: tell the staff at once",
    "Heavy bleeding, fever or severe pain after an image-guided procedure",
  ],
  faqs: [
    {
      q: "Can I book an appointment directly with a radiologist?",
      a: "Most scans in India are done on a doctor's request, and the radiologist reports them rather than seeing you in a clinic. You can usually ask to speak to the radiologist about your scan, or request a second reading of a CT or MRI, but decisions about treatment are made by your treating doctor.",
    },
    {
      q: "Is a CT scan safe?",
      a: "A CT scan uses X-rays, so it involves a small radiation dose. Doctors request it when the information it gives is worth that dose. Tell the staff if you might be pregnant, and ask your doctor if you are unsure why a scan has been advised.",
    },
    {
      q: "Why was I asked about metal before an MRI?",
      a: "MRI uses a strong magnet. Some pacemakers, implants, clips and metal fragments are not safe in the scanner or need special settings, so the centre checks before every scan.",
    },
    {
      q: "What qualifications should a radiologist have?",
      a: "An MBBS and a postgraduate degree in radiodiagnosis, usually MD or DNB. The registration number should appear on the NMC's Indian Medical Register or a state medical council register.",
    },
    {
      q: "What is interventional radiology?",
      a: "It is the part of radiology that treats as well as diagnoses, using imaging to guide needles and catheters for biopsies, drainages and procedures on blood vessels. These are often alternatives to open surgery.",
    },
  ],
};
