import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "colorectal-cancer",
  title: "Colorectal (bowel) cancer: symptoms, tests and treatment",
  standfirst: "What colon and rectal cancer are, the symptoms that should never be put down to piles, how colonoscopy finds it, and how it is treated.",
  targetQuery: "colon cancer symptoms and treatment",
  department: "oncology",
  specialty: "surgical-oncology",
  alsoSee: ["gastroenterology", "medical-oncology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Blood in the stool", "Change in bowel habit", "Abdominal pain", "Weight loss", "Tiredness", "Anaemia"],
  tests: ["Colonoscopy", "Biopsy", "CT scan", "MRI of the pelvis", "Faecal immunochemical test"],
  treatments: ["Surgery", "Chemotherapy", "Radiotherapy", "Targeted therapy", "Immunotherapy"],
  body: [
    { k: "h2", text: "What colorectal cancer is" },
    {
      k: "p",
      text: "Colorectal cancer — also called bowel cancer — is cancer of the colon (the large bowel) or the rectum (its last part, just above the anus). Most begin as a polyp, a small growth on the inner lining, which over years can turn into cancer. Finding and removing polyps early is one of the most effective ways to prevent this cancer.",
    },
    {
      k: "p",
      text: "When found at an early stage, colorectal cancer can often be removed completely with surgery. When it has spread to nearby lymph glands or to the liver or lungs, a combination of surgery, chemotherapy and other treatments is used, and many people still do well.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Early colorectal cancer often causes no symptoms. Symptoms that should be checked, especially if they last more than a few weeks, include:",
    },
    {
      k: "ul",
      items: [
        "Blood in the stool, or bleeding from the back passage — dark or bright red",
        "A change in bowel habit — looser stools, constipation, more frequent visits, or narrow stools",
        "A feeling of not having emptied the bowel completely",
        "Abdominal pain, cramps or a lump in the abdomen",
        "Weight loss you cannot explain",
        "Tiredness or breathlessness from anaemia (low haemoglobin), sometimes the only sign",
      ],
    },
    {
      k: "p",
      text: "In India, rectal bleeding is very often assumed to be piles, and people treat it themselves for months. Piles are common, but bleeding should be examined by a doctor at least once — especially if you are over forty, the bleeding is new, or it comes with any of the other symptoms above.",
    },

    { k: "h2", text: "Who is at higher risk" },
    {
      k: "ul",
      items: [
        "Increasing age, although younger adults are increasingly affected",
        "A family history of colorectal cancer or polyps, especially in a parent, brother or sister diagnosed young",
        "Inherited conditions such as Lynch syndrome and familial adenomatous polyposis",
        "Long-standing ulcerative colitis or Crohn's disease affecting the colon",
        "A diet high in red and processed meat and low in fibre, fruit and vegetables",
        "Being overweight and physically inactive",
        "Smoking and heavy drinking",
        "Type 2 diabetes",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "ul",
      items: [
        "**Colonoscopy** — a flexible camera passed through the back passage to examine the whole colon, after a bowel-cleansing preparation. Polyps can be removed during the test.",
        "**Biopsy** — small samples taken during colonoscopy to confirm cancer and its type.",
        "**CT scan** of the chest, abdomen and pelvis — shows whether the cancer has spread.",
        "**MRI of the pelvis** — for rectal cancer, shows how deep the tumour has grown and plans surgery and radiotherapy.",
        "**Faecal immunochemical test** (FIT) — a stool test for hidden blood, used to decide who needs colonoscopy and for screening in some places.",
      ],
    },
    {
      k: "p",
      text: "A blood count, liver tests and a blood marker called CEA are also usually done. The biopsy may be tested for genetic features that guide treatment and show whether relatives should be checked for an inherited condition.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [gastroenterologist](/specialties/gastroenterology) usually performs the colonoscopy and biopsy. Surgery is done by a [surgical oncologist](/specialties/surgical-oncology) or a colorectal or GI surgeon, and a [medical oncologist](/specialties/medical-oncology) plans chemotherapy and other medicines. A radiation oncologist is involved for rectal cancer. Ask whether your case will be discussed at a multidisciplinary tumour board.",
    },
    {
      k: "p",
      text: "You can [find surgical oncologists in Bengaluru](/doctors/karnataka/bengaluru/surgical-oncologists), [gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) or [medical oncologists in Bengaluru](/doctors/karnataka/bengaluru/medical-oncologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment depends on where the cancer is, its stage, its genetic features and your general health. Your team will decide based on these, often combining treatments.",
    },
    {
      k: "ul",
      items: [
        "**Surgery** — the main treatment for most colon and rectal cancers. The section of bowel containing the cancer and nearby lymph glands is removed, often by keyhole or robotic surgery. Very early cancers in a polyp can sometimes be removed through the colonoscope.",
        "**Chemotherapy** — after surgery to lower the chance of return, before surgery to shrink a tumour, or to control cancer that has spread.",
        "**Radiotherapy** — mainly for rectal cancer, often with chemotherapy, before surgery.",
        "**Targeted therapy** — medicines that act on specific features of the cancer, usually for advanced disease.",
        "**Immunotherapy** — very effective for a subgroup of tumours with a particular genetic feature (mismatch repair deficiency).",
      ],
    },
    {
      k: "p",
      text: "Some people need a **stoma** — an opening of the bowel on the abdomen into a bag — either temporarily while the join heals, or permanently in some low rectal cancers. A stoma nurse will help you manage it, and most people return to normal activities. When cancer has spread only to the liver or lungs, surgery to remove those deposits is sometimes possible.",
    },
    {
      k: "p",
      text: "Do not replace treatment with unproven remedies, and tell your oncologist about any supplements or herbal products you take.",
    },

    { k: "h2", text: "After treatment, prevention and family screening" },
    {
      k: "ul",
      items: [
        "Keep to the follow-up plan — usually regular blood tests for CEA, scans and colonoscopy for several years",
        "Stay active, eat plenty of fibre, fruit and vegetables, and limit red and processed meat",
        "Stop smoking and cut down alcohol",
        "If you have a parent, brother or sister with colorectal cancer, ask a doctor when you should start colonoscopy — often earlier than usual",
        "Ask whether genetic counselling is advised for your family",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Heavy bleeding from the back passage, or bleeding with dizziness or fainting",
        "Severe abdominal pain with a swollen abdomen and vomiting, and inability to pass stool or wind",
        "Fever or shivering during chemotherapy",
        "Sudden severe abdominal pain with a rigid abdomen",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Where exactly is the cancer, and what stage is it?",
        "Has the biopsy been tested for genetic features such as mismatch repair?",
        "Will I need chemotherapy or radiotherapy before or after surgery?",
        "Will I need a stoma, and will it be temporary?",
        "What follow-up will I need?",
        "Should my family members be screened earlier?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is rectal bleeding always cancer?",
      a: "No. Most rectal bleeding is caused by piles or a small tear called a fissure. But colorectal cancer can bleed in the same way, so new bleeding, especially with a change in bowel habit, weight loss or anaemia, should be examined by a doctor.",
    },
    {
      q: "Can young people get colorectal cancer?",
      a: "Yes. It is more common with age, but it is increasingly seen in adults under fifty. Young people with persistent bleeding, a change in bowel habit or anaemia should not be told it is 'just piles' without an examination, and those with a family history need earlier checks.",
    },
    {
      q: "Will I need a permanent bag?",
      a: "Most people with colon cancer do not need a permanent stoma. Some people with rectal cancer need a temporary one while the bowel heals, and a smaller number, usually with cancers very close to the anus, need a permanent one. Your surgeon will explain your situation.",
    },
    {
      q: "Can colorectal cancer be prevented?",
      a: "Removing polyps during colonoscopy prevents many cancers from developing. Staying active, keeping a healthy weight, eating more fibre and less red and processed meat, not smoking and limiting alcohol also lower the risk. People with a family history should discuss screening with a doctor.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Colorectal Cancer", url: "https://medlineplus.gov/colorectalcancer.html" },
    { label: "World Health Organization — Colorectal cancer fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/colorectal-cancer" },
  ],
};
