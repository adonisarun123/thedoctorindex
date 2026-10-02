import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "breast-cancer",
  title: "Breast cancer: signs, screening, tests, treatment and which doctor to see",
  metaTitle: "Breast cancer: signs, screening, tests and treatment",
  standfirst: "The early signs of breast cancer, screening available in India, the tests that confirm it, how it is treated, and which doctors to see.",
  targetQuery: "breast cancer symptoms and treatment",
  department: "oncology",
  specialty: "surgical-oncology",
  alsoSee: ["medical-oncology", "radiation-oncology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Breast lump", "Change in breast size or shape", "Skin dimpling", "Nipple discharge", "Inverted nipple", "Lump in the armpit"],
  tests: ["Clinical breast examination", "Mammogram", "Breast ultrasound", "Biopsy", "Hormone receptor testing", "HER2 testing"],
  treatments: ["Surgery", "Radiotherapy", "Chemotherapy", "Hormone therapy", "Targeted therapy"],
  body: [
    { k: "h2", text: "What breast cancer is" },
    {
      k: "p",
      text: "Breast cancer begins when cells in the breast grow out of control, usually in the milk ducts or the lobules that make milk. It can stay in place or spread to the lymph nodes in the armpit and, later, to other parts of the body. It mostly affects women but can occur in men.",
    },
    {
      k: "p",
      text: "Breast cancers differ. Some grow in response to the hormones oestrogen or progesterone (hormone receptor-positive), some carry extra HER2 protein, and some have neither (triple-negative). These features, along with the size and spread, decide the treatment.",
    },
    {
      k: "p",
      text: "In India, many women are diagnosed when the cancer is already advanced, often because a painless lump was ignored or treatment was delayed. Breast cancer found early is far easier to treat, often with less extensive surgery.",
    },

    { k: "h2", text: "Signs and symptoms" },
    { k: "p", text: "See a doctor promptly if you notice:" },
    {
      k: "ul",
      items: [
        "A breast lump or thickening, often painless",
        "A change in breast size or shape",
        "Skin dimpling, puckering, redness or an 'orange peel' look",
        "Nipple discharge, especially if bloody or from one nipple",
        "An inverted nipple that was not inverted before, or a rash or crusting on the nipple",
        "A lump in the armpit",
      ],
    },
    {
      k: "p",
      text: "Most breast lumps are not cancer — many are cysts or fibroadenomas — but every new lump needs checking. A lump that does not hurt is not reassuring; most breast cancers are painless.",
    },

    { k: "h2", text: "Who is at higher risk in India" },
    {
      k: "p",
      text: "Risk rises with age, but breast cancer in India often appears at a younger age than in Western countries. Your risk is higher if you:",
    },
    {
      k: "ul",
      items: [
        "Have a mother, sister or daughter with breast or ovarian cancer, especially at a young age",
        "Carry a BRCA1, BRCA2 or another inherited gene change",
        "Started periods early or reached menopause late",
        "Had your first child late, had no children or did not breastfeed",
        "Carry extra weight after menopause, are inactive or drink alcohol",
        "Took long-term hormone replacement therapy, or had chest radiotherapy when young",
      ],
    },
    {
      k: "p",
      text: "Many women with breast cancer have none of these risk factors, so awareness matters for everyone.",
    },

    { k: "h2", text: "Screening and diagnosis" },
    { k: "h3", text: "Screening" },
    {
      k: "p",
      text: "Under the national programme for non-communicable diseases, people aged 30 and above can be screened for breast, cervical and oral cancers, along with diabetes and blood pressure, at government health facilities including Ayushman Arogya Mandirs. A **clinical breast examination** by a trained health worker or doctor is the usual first step. A **mammogram** — a low-dose X-ray of the breast — is used for screening in older women; your doctor will advise when to start and how often, based on your age and family history. Get to know how your breasts normally look and feel, and report changes.",
    },
    { k: "h3", text: "Tests if a problem is found" },
    {
      k: "ul",
      items: [
        "**Mammogram** and **breast ultrasound** to look at the lump; ultrasound is often used first in younger women",
        "**Biopsy** — a core needle sample, usually guided by ultrasound, which is the only way to confirm cancer",
        "**Hormone receptor testing** and **HER2 testing** on the biopsy, which guide treatment",
        "Scans such as CT, bone scan or PET-CT to check for spread in some women",
        "Genetic testing for women with a strong family history or certain cancer types",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [surgical oncologist](/specialties/surgical-oncology) or breast surgeon assesses breast lumps and performs cancer surgery. A [medical oncologist](/specialties/medical-oncology) plans chemotherapy, hormone therapy and targeted therapy, and a [radiation oncologist](/specialties/radiation-oncology) plans radiotherapy. Care is best decided by a team (a tumour board) that also includes radiologists and pathologists. Your gynaecologist or physician can examine a lump and refer you quickly.",
    },
    {
      k: "p",
      text: "You can [find surgical oncologists in Bengaluru](/doctors/karnataka/bengaluru/surgical-oncologists) or [medical oncologists in Bengaluru](/doctors/karnataka/bengaluru/medical-oncologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment is planned around the stage and type of cancer, your age and general health, and your preferences. Most women receive a combination:",
    },
    {
      k: "ul",
      items: [
        "**Surgery** — breast-conserving surgery (removing the lump with a margin of healthy tissue) or mastectomy (removing the breast), with removal of some lymph nodes. Breast reconstruction can often be done at the same time or later.",
        "**Radiotherapy** — after breast-conserving surgery and in some women after mastectomy, to lower the chance of the cancer returning.",
        "**Chemotherapy** — before or after surgery, depending on the cancer's type and stage.",
        "**Hormone therapy** — tablets taken for several years for hormone receptor-positive cancers.",
        "**Targeted therapy** — medicines aimed at HER2 or other features of the cancer, and immunotherapy for some types.",
      ],
    },
    {
      k: "p",
      text: "Ask your team to explain why each treatment is recommended. A second opinion before starting treatment is reasonable and should not delay care for long. Do not replace or delay treatment with unproven remedies, and tell your team about any supplements you take.",
    },

    { k: "h2", text: "Living with it: follow-up" },
    {
      k: "ul",
      items: [
        "Regular follow-up visits and a mammogram at intervals your team sets",
        "Support for side effects of hormone therapy, including bone health",
        "Arm care and exercises to reduce the risk of lymphoedema after lymph node surgery",
        "Emotional support, counselling and patient support groups",
        "Genetic counselling for relatives if you carry an inherited gene change",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Fever or chills during chemotherapy — this can be a serious infection and needs immediate care",
        "Sudden breathlessness, chest pain, or a swollen, painful leg",
        "New weakness or numbness in the legs, or loss of bladder or bowel control",
        "Severe vomiting or dehydration during treatment",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What type and stage of breast cancer do I have?",
        "Is breast-conserving surgery possible for me?",
        "What treatments do you recommend, and in what order?",
        "What are the side effects, and how will they be managed?",
        "Should I or my family have genetic testing?",
        "How will this affect my work, fertility and daily life?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is a painless breast lump safe to ignore?",
      a: "No. Most breast cancers are painless, so the absence of pain is not reassuring. Most lumps turn out to be harmless, but every new lump or change should be examined by a doctor, and a scan or biopsy may be needed.",
    },
    {
      q: "Can men get breast cancer?",
      a: "Yes, though it is uncommon. Men should see a doctor about a lump behind the nipple, nipple discharge or a change in the nipple. Men with a BRCA gene change or a strong family history have a higher risk.",
    },
    {
      q: "Does a biopsy make cancer spread?",
      a: "No. A biopsy is the only way to confirm breast cancer and to find out its type, which decides treatment. Fear of spread is a common reason for delay, but a properly performed biopsy does not cause cancer to spread.",
    },
    {
      q: "Will I lose my breast if I have breast cancer?",
      a: "Not necessarily. Many women, particularly when the cancer is found early, can have breast-conserving surgery followed by radiotherapy. When a mastectomy is needed, breast reconstruction is often possible. Your surgeon will discuss the options.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Breast Cancer", url: "https://medlineplus.gov/breastcancer.html" },
    { label: "World Health Organization — Breast cancer fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/breast-cancer" },
    { label: "DD News — Government launches intensified NCD screening campaign for all citizens aged 30 and above", url: "https://ddnews.gov.in/en/government-launches-intensified-ncd-screening-campaign-to-cover-all-citizens-aged-30-and-above/" },
  ],
};
