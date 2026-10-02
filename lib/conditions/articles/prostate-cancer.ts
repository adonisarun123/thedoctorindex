import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "prostate-cancer",
  title: "Prostate cancer: symptoms, PSA test, treatment and which doctor to see",
  metaTitle: "Prostate cancer: symptoms, PSA test and treatment",
  standfirst: "What prostate cancer is, its symptoms, the pros and cons of PSA testing, how it is diagnosed, the treatment options, and which doctors to see.",
  targetQuery: "prostate cancer symptoms and treatment",
  department: "oncology",
  specialty: "urology",
  alsoSee: ["radiation-oncology", "medical-oncology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Weak urine stream", "Passing urine at night", "Blood in urine", "Blood in semen", "Bone pain", "Unexplained weight loss"],
  tests: ["PSA", "Digital rectal examination", "MRI", "Prostate biopsy", "Bone scan", "PSMA PET scan"],
  treatments: ["Active surveillance", "Radical prostatectomy", "Radiotherapy", "Hormone therapy", "Chemotherapy"],
  body: [
    { k: "h2", text: "What prostate cancer is" },
    {
      k: "p",
      text: "The prostate is a gland below the bladder in men that makes part of the fluid in semen. Prostate cancer begins when cells in the gland grow out of control. It is mainly a disease of older men.",
    },
    {
      k: "p",
      text: "Prostate cancers behave very differently. Many grow so slowly that they would never cause harm in a man's lifetime, while others are aggressive and spread to bones and lymph nodes. A large part of good care is telling the two apart, so that men with low-risk cancer are spared unnecessary treatment and men with significant cancer are treated promptly.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Early prostate cancer usually causes no symptoms. Urinary symptoms are more often due to a benign enlarged prostate (BPH), but they should be checked:",
    },
    {
      k: "ul",
      items: [
        "Weak urine stream, or difficulty starting or stopping",
        "Passing urine at night more often",
        "Blood in urine or blood in semen",
        "Pain or burning when passing urine or ejaculating",
        "Erection problems",
        "In advanced cancer: bone pain in the back, hips or ribs, unexplained weight loss and tiredness",
      ],
    },

    { k: "h2", text: "Who is at higher risk" },
    {
      k: "p",
      text: "Risk rises with age and is uncommon in young men. It is higher if your father or brother had prostate cancer, especially at a younger age, and in men who carry inherited gene changes such as BRCA2; a family history of breast or ovarian cancer can be relevant too. Men of African ancestry have a higher risk. Obesity and smoking are linked to more aggressive disease.",
    },

    { k: "h2", text: "How it is diagnosed" },
    { k: "h3", text: "The PSA test" },
    {
      k: "p",
      text: "**PSA** (prostate-specific antigen) is a blood test. A raised level can be a sign of cancer, but it is also raised by BPH, infection, recent ejaculation or cycling, and some cancers do not raise it much. Routine PSA testing of men without symptoms is debated: it can find significant cancers early, but it also finds many slow cancers that would never cause harm, leading to biopsies and treatment that carry side effects. Your doctor will discuss whether testing makes sense for you, based on your age, health and family history. Tell your doctor if you take finasteride or dutasteride, which lower PSA.",
    },
    { k: "h3", text: "Further tests" },
    {
      k: "ul",
      items: [
        "**Digital rectal examination** — a gloved finger feels the prostate for hard or irregular areas",
        "**MRI** of the prostate — now commonly done before biopsy to find suspicious areas and avoid unnecessary biopsies",
        "**Prostate biopsy** — small samples taken with a needle through the rectum or the skin behind the scrotum, which confirms cancer and shows how aggressive it is (the Gleason score or grade group)",
        "**Bone scan**, CT or **PSMA PET scan** — to check for spread in men with higher-risk cancer",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [urologist](/specialties/urology) investigates raised PSA and urinary symptoms, performs biopsies and surgery, and leads care for many men. A [radiation oncologist](/specialties/radiation-oncology) plans radiotherapy, and a [medical oncologist](/specialties/medical-oncology) manages advanced cancer with hormone therapy, chemotherapy and newer medicines. Decisions are best made by a team, and it is reasonable to hear the view of both a surgeon and a radiation oncologist before choosing treatment.",
    },
    {
      k: "p",
      text: "You can [find urologists in Bengaluru](/doctors/karnataka/bengaluru/urologists) or [radiation oncologists in Bengaluru](/doctors/karnataka/bengaluru/radiation-oncologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment depends on the grade and stage of the cancer, your PSA, your age and general health, and what matters most to you.",
    },
    {
      k: "ul",
      items: [
        "**Active surveillance** — for low-risk cancer, regular PSA tests, MRI and sometimes repeat biopsies, with treatment only if the cancer shows signs of growing. This avoids or delays side effects without giving up the chance of treatment.",
        "Watchful waiting — for older men or those with other serious illnesses, treating symptoms if they arise.",
        "**Radical prostatectomy** — surgery to remove the prostate, by open, laparoscopic or robotic methods.",
        "**Radiotherapy** — external beam radiotherapy or brachytherapy (internal radiation seeds), often with a period of hormone therapy for higher-risk cancer.",
        "**Hormone therapy** — medicines or injections that lower testosterone, which most prostate cancers need to grow; used for advanced cancer and with radiotherapy.",
        "**Chemotherapy**, newer hormone medicines and other treatments for cancer that has spread.",
      ],
    },
    {
      k: "p",
      text: "Surgery and radiotherapy can affect erections, bladder control and bowel function. Ask your team how likely these are for you and what help is available. Do not stop hormone treatment on your own.",
    },

    {
      k: "p",
      text: "Choosing between treatments can feel overwhelming, because several options may give similar control of the cancer while differing in side effects, recovery time and the number of hospital visits. Take time to decide unless your team advises urgency, bring a family member to appointments, and write down what matters most to you — for example, avoiding incontinence, keeping erections, or finishing treatment quickly.",
    },

    { k: "h2", text: "Living with it: follow-up" },
    {
      k: "ul",
      items: [
        "Regular PSA tests after treatment, at intervals your team sets",
        "Pelvic floor exercises to help bladder control after surgery",
        "Treatment for erection problems",
        "Bone health checks, exercise and heart risk checks on long-term hormone therapy",
        "Telling brothers and sons about your diagnosis, so they can discuss testing with their doctors",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "New weakness, numbness or tingling in the legs, or loss of bladder or bowel control — this can mean cancer is pressing on the spinal cord",
        "Being unable to pass urine",
        "Fever with chills after a prostate biopsy",
        "Heavy bleeding in the urine with clots",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What do my PSA and MRI results mean?",
        "What is the grade and stage of my cancer?",
        "Is active surveillance an option for me?",
        "What are the side effects of surgery compared with radiotherapy?",
        "How will treatment affect my bladder, bowel and sex life?",
        "Should my family members consider testing?",
      ],
    },
  ],
  faqs: [
    {
      q: "Should every man have a PSA test?",
      a: "Not necessarily. PSA testing can find cancer early but also finds slow cancers that would never cause harm, leading to unnecessary biopsies and treatment. Discuss the pros and cons with your doctor, especially if you have a family history or symptoms.",
    },
    {
      q: "Does a high PSA mean I have cancer?",
      a: "No. PSA can be raised by an enlarged prostate, infection, recent ejaculation or cycling. Your doctor may repeat the test and recommend an MRI before deciding whether a biopsy is needed to look for cancer.",
    },
    {
      q: "Do all prostate cancers need treatment?",
      a: "No. Many low-risk prostate cancers grow so slowly that active surveillance, with regular checks, is safer than immediate treatment. Treatment is started if the cancer shows signs of change. Higher-risk cancers do need prompt treatment.",
    },
    {
      q: "Are urinary symptoms a sign of prostate cancer?",
      a: "Usually not. Most urinary symptoms in older men come from a benign enlarged prostate. Early prostate cancer often causes no symptoms. However, urinary symptoms should still be checked, because the causes can only be told apart by a doctor.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Prostate Cancer", url: "https://medlineplus.gov/prostatecancer.html" },
    { label: "National Cancer Institute (NIH) — Prostate Cancer, Patient Version", url: "https://www.cancer.gov/types/prostate" },
  ],
};
