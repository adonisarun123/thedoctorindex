import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "cervical-cancer",
  title: "Cervical cancer: symptoms, screening, HPV vaccine, treatment and which doctor to see",
  metaTitle: "Cervical cancer: symptoms, screening and HPV vaccine",
  standfirst: "How cervical cancer develops, the symptoms, free screening and HPV vaccination in India, the tests that confirm it, and how it is treated.",
  targetQuery: "cervical cancer symptoms screening and treatment",
  department: "oncology",
  specialty: "gynaecology",
  alsoSee: ["radiation-oncology", "surgical-oncology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Bleeding after sex", "Bleeding between periods", "Bleeding after menopause", "Unusual vaginal discharge", "Pelvic pain"],
  tests: ["VIA", "Pap smear", "HPV test", "Colposcopy", "Biopsy", "MRI"],
  treatments: ["Treatment of precancer", "Surgery", "Radiotherapy", "Chemoradiation", "HPV vaccination"],
  body: [
    { k: "h2", text: "What cervical cancer is" },
    {
      k: "p",
      text: "The cervix is the neck of the womb, opening into the vagina. Almost all cervical cancers are caused by long-lasting infection with high-risk types of human papillomavirus (HPV), a very common virus passed on through sexual contact. In most people the body clears HPV naturally. When it persists, it can slowly cause abnormal cell changes — precancer — which can become cancer over many years.",
    },
    {
      k: "p",
      text: "That slow course is what makes cervical cancer one of the most preventable cancers. HPV vaccination prevents the infection, screening finds precancer before it becomes cancer, and precancer can be treated simply. Cervical cancer remains a major cancer among women in India, largely because screening has not reached everyone.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Precancer and early cancer usually cause no symptoms, which is why screening matters. When symptoms appear, they may include:",
    },
    {
      k: "ul",
      items: [
        "Bleeding after sex",
        "Bleeding between periods",
        "Bleeding after menopause",
        "Unusual vaginal discharge, which may be watery, bloody or foul-smelling",
        "Pelvic pain or pain during sex",
        "In advanced disease: back or leg pain, swelling of the legs, or problems passing urine or stools",
      ],
    },
    {
      k: "p",
      text: "These symptoms are often caused by infections or other conditions, but any bleeding after menopause or after sex should be checked.",
    },

    { k: "h2", text: "Who is at higher risk" },
    { k: "p", text: "Any woman who has ever been sexually active can develop cervical cancer. Risk is higher with:" },
    {
      k: "ul",
      items: [
        "Never having been screened, or long gaps between screenings",
        "Starting sexual activity young, or multiple partners (yours or your partner's)",
        "HIV or another condition or medicine that weakens the immune system",
        "Smoking or chewing tobacco",
        "Many pregnancies, or long-term use of the contraceptive pill",
      ],
    },

    { k: "h2", text: "Prevention, screening and diagnosis" },
    { k: "h3", text: "HPV vaccination" },
    {
      k: "p",
      text: "**HPV vaccination** prevents infection with the HPV types that cause most cervical cancers and works best before any exposure to the virus. India launched a nationwide HPV vaccination campaign on 28 February 2026, offering a single dose free of charge to girls aged 14 at government health facilities, including primary health centres, district hospitals and Ayushman Arogya Mandirs. After the initial campaign the vaccine continues to be available on routine immunisation days. Vaccination is voluntary and needs a parent's consent. For other ages, ask your doctor whether vaccination is advisable; vaccinated women still need screening.",
    },
    { k: "h3", text: "Screening" },
    {
      k: "p",
      text: "Under the national programme for non-communicable diseases, women aged 30 and above can be screened for cervical cancer at government health facilities. Screening tests include:",
    },
    {
      k: "ul",
      items: [
        "**VIA** (visual inspection with acetic acid) — a health worker applies dilute vinegar to the cervix and looks for changes; results are immediate",
        "**Pap smear** — cells from the cervix are examined under a microscope",
        "**HPV test** — checks for high-risk HPV, which can sometimes be done on a self-collected sample",
      ],
    },
    {
      k: "p",
      text: "Your doctor will advise how often to be screened based on the test used and your results.",
    },
    { k: "h3", text: "Tests if a problem is found" },
    {
      k: "p",
      text: "**Colposcopy** uses a magnifying instrument to examine the cervix closely, and a **biopsy** confirms precancer or cancer. If cancer is found, an **MRI** of the pelvis, and sometimes CT or PET-CT, shows how far it has spread, which sets the stage.",
    },

    {
      k: "p",
      text: "Many women avoid screening out of embarrassment, fear of the result or because they feel well. The test takes only a few minutes, is usually done by a woman health worker if you ask, and is meant for women without symptoms. A normal result is reassuring; an abnormal one usually means precancer that can be treated simply. Ask your health centre when the next screening day is.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [gynaecologist](/specialties/gynaecology) performs screening, colposcopy and treatment of precancer. Cervical cancer is treated by a team: a gynaecological oncologist or [surgical oncologist](/specialties/surgical-oncology) for surgery, and a [radiation oncologist](/specialties/radiation-oncology) for radiotherapy and chemoradiation, with a medical oncologist when chemotherapy is needed.",
    },
    {
      k: "p",
      text: "You can [find gynaecologists in Bengaluru](/doctors/karnataka/bengaluru/gynaecologists) or [radiation oncologists in Bengaluru](/doctors/karnataka/bengaluru/radiation-oncologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "ul",
      items: [
        "**Treatment of precancer** — thermal ablation or cryotherapy (destroying abnormal cells), or LEEP/cone biopsy (removing them). These are quick and usually done as outpatient procedures. In some screening programmes, women with a positive test are treated at the same visit.",
        "**Surgery** — for early cancer, ranging from removing a cone of the cervix in very early disease to radical hysterectomy with lymph node removal. Fertility-sparing surgery is possible for some young women with small tumours.",
        "**Radiotherapy** — external beam radiotherapy plus brachytherapy (internal radiotherapy).",
        "**Chemoradiation** — chemotherapy given alongside radiotherapy, the usual treatment for locally advanced cancer.",
        "Chemotherapy, targeted therapy and immunotherapy for cancer that has spread or come back.",
      ],
    },
    {
      k: "p",
      text: "Complete the full course of treatment your team recommends; stopping radiotherapy early reduces its effect. Ask about side effects such as early menopause and vaginal narrowing, and how they can be managed.",
    },

    { k: "h2", text: "Living with it: follow-up" },
    {
      k: "ul",
      items: [
        "Regular follow-up examinations, more often in the first years",
        "Repeat screening after treatment of precancer, as your doctor advises",
        "Support for sexual health, menopause symptoms and bladder or bowel changes after radiotherapy",
        "Stopping tobacco",
        "Making sure daughters and other family members know about HPV vaccination and screening",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Heavy vaginal bleeding, or bleeding with dizziness or fainting",
        "Fever or chills during chemotherapy",
        "Being unable to pass urine, or passing very little",
        "Severe abdominal pain or vomiting during treatment",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What did my screening test show, and what happens next?",
        "Is this precancer or cancer, and what stage?",
        "Which treatment do you recommend, and why?",
        "Can my fertility be preserved?",
        "What side effects should I expect?",
        "Should my daughter be vaccinated against HPV?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can cervical cancer be prevented?",
      a: "Largely, yes. HPV vaccination prevents infection with the virus types that cause most cervical cancers, and regular screening finds precancer that can be treated before it becomes cancer. Using both together gives the strongest protection.",
    },
    {
      q: "Is the HPV vaccine free in India?",
      a: "Yes, for girls aged 14 under the national campaign launched in February 2026, which gives a single dose free at government health facilities. Outside the programme, the vaccine is available privately; ask your doctor whether it is advisable for other ages.",
    },
    {
      q: "Do I still need screening if I have had the HPV vaccine?",
      a: "Yes. The vaccine protects against the HPV types responsible for most, but not all, cervical cancers, and it does not treat an existing infection. Vaccinated women should still have screening as advised from the age of 30.",
    },
    {
      q: "Does a positive HPV test mean I have cancer?",
      a: "No. HPV is very common and usually clears on its own. A positive test means you need further checks or follow-up, such as VIA, colposcopy or a repeat test, to look for precancer that may need simple treatment.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Cervical Cancer", url: "https://medlineplus.gov/cervicalcancer.html" },
    { label: "World Health Organization — Cervical cancer fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/cervical-cancer" },
    { label: "Press Information Bureau, MoHFW — Update on National HPV Vaccination Programme", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2241079" },
    { label: "DD News — Government launches intensified NCD screening campaign for all citizens aged 30 and above", url: "https://ddnews.gov.in/en/government-launches-intensified-ncd-screening-campaign-to-cover-all-citizens-aged-30-and-above/" },
  ],
};
