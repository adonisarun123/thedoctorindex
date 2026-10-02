import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "ovarian-cysts",
  title: "Ovarian cysts: types, symptoms, tests, treatment and which doctor to see",
  metaTitle: "Ovarian cysts: symptoms, scans and treatment",
  standfirst: "What ovarian cysts are, why most are harmless, the symptoms that need attention, how they are checked, and when surgery is needed.",
  targetQuery: "ovarian cyst symptoms and treatment",
  department: "obstetrics-and-gynaecology",
  specialty: "gynaecology",
  alsoSee: ["radiology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Pelvic pain", "Bloating", "Pressure in the lower abdomen", "Pain during sex", "Irregular periods"],
  tests: ["Pelvic ultrasound", "Transvaginal ultrasound", "Pregnancy test", "CA-125", "MRI"],
  treatments: ["Watchful waiting", "Hormonal contraceptives", "Laparoscopic cystectomy", "Oophorectomy"],
  body: [
    { k: "h2", text: "What ovarian cysts are" },
    {
      k: "p",
      text: "An ovarian cyst is a fluid-filled sac in or on an ovary. Most women develop one at some point, and most are harmless and disappear on their own without anyone knowing.",
    },
    {
      k: "p",
      text: "The commonest are **functional cysts**, part of the normal monthly cycle. A follicle cyst forms when the follicle that holds a developing egg does not release it and keeps growing; a corpus luteum cyst forms when the follicle seals over after releasing the egg. Both usually shrink within a few cycles.",
    },
    { k: "p", text: "Other, less common types do not usually go away on their own:" },
    {
      k: "ul",
      items: [
        "**Endometriomas** ('chocolate cysts'), caused by endometriosis",
        "**Dermoid cysts**, which contain tissues such as hair, fat or teeth and are present from birth",
        "**Cystadenomas**, which grow from the surface of the ovary and can become large",
        "Rarely, cysts that are cancerous or borderline, more likely after menopause",
      ],
    },
    {
      k: "p",
      text: "Polycystic ovary syndrome (PCOS) is different: the many small 'cysts' seen on its scans are follicles, and the condition is a hormonal one.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Most cysts cause no symptoms and are found on a scan done for another reason. Larger cysts may cause:" },
    {
      k: "ul",
      items: [
        "Pelvic pain, often a dull ache on one side",
        "Bloating or a swollen abdomen",
        "Pressure in the lower abdomen, or needing to pass urine often",
        "Pain during sex",
        "Irregular periods or spotting",
        "Feeling full quickly",
      ],
    },
    {
      k: "p",
      text: "Persistent bloating, feeling full quickly and pelvic pain, especially in women over 50, can also be symptoms of ovarian cancer and should be checked promptly.",
    },

    { k: "h2", text: "Who is at risk" },
    {
      k: "p",
      text: "Functional cysts are most common during the reproductive years and in women taking some fertility medicines. Endometriosis, pregnancy, and previous cysts also raise the chance. After menopause, functional cysts are uncommon, so any cyst is looked at more carefully. A family history of ovarian or breast cancer, or a known BRCA gene change, raises the risk of ovarian cancer.",
    },

    { k: "h2", text: "How they are diagnosed" },
    {
      k: "ul",
      items: [
        "**Pelvic ultrasound** — the main test, through the abdomen and usually as a **transvaginal ultrasound**, which gives clearer detail. The appearance of the cyst — simple fluid or more complex — guides what happens next.",
        "**Pregnancy test** — to rule out an ectopic pregnancy, which can look similar.",
        "**CA-125** — a blood test sometimes used, mainly after menopause or when a cyst looks complex. It can be raised by endometriosis, fibroids, periods and infections, so it is interpreted with care.",
        "**MRI** — when ultrasound does not give a clear answer.",
      ],
    },
    {
      k: "p",
      text: "A simple cyst in a woman of reproductive age is often rechecked with another scan after a few cycles to see whether it has gone.",
    },

    {
      k: "p",
      text: "Timing matters. A scan done just before or during ovulation can show a normal follicle or corpus luteum that looks like a cyst, so a single report of a 'cyst' in a young woman is often nothing to worry about. Bring earlier scan reports to your appointment, because comparing them shows whether a cyst is new, growing or shrinking. If you are told you have a dermoid cyst or an endometrioma, ask what the plan is, since these do not usually disappear with time.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [gynaecologist](/specialties/gynaecology) assesses and treats ovarian cysts. A [radiologist](/specialties/radiology) performs and reports the scans. If a cyst looks suspicious for cancer, care is usually transferred to a gynaecological oncologist.",
    },
    {
      k: "p",
      text: "You can [find gynaecologists in Bengaluru](/doctors/karnataka/bengaluru/gynaecologists) or [radiologists in Bengaluru](/doctors/karnataka/bengaluru/radiologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment depends on the type and size of the cyst, your symptoms, your age and whether you have been through menopause.",
    },
    {
      k: "ul",
      items: [
        "**Watchful waiting** — most functional cysts need nothing more than a repeat scan to confirm they have gone.",
        "Painkillers for discomfort, as advised by your doctor.",
        "**Hormonal contraceptives** — can reduce the formation of new functional cysts in women who get them repeatedly, though they do not shrink existing cysts.",
        "**Laparoscopic cystectomy** — keyhole surgery to remove a cyst while keeping the ovary, for cysts that persist, grow, cause pain or look like dermoids, endometriomas or cystadenomas.",
        "**Oophorectomy** — removal of the ovary, considered for some cysts after menopause or when cancer is suspected.",
      ],
    },
    {
      k: "p",
      text: "If you hope to become pregnant, ask how surgery might affect your egg reserve. Do not take hormonal treatment or herbal products to 'dissolve' a cyst without a diagnosis.",
    },

    { k: "h3", text: "Cysts in pregnancy" },
    {
      k: "p",
      text: "Cysts are sometimes found on an early pregnancy scan. Most are corpus luteum cysts that support the pregnancy and fade by the middle of it. Larger or unusual cysts are monitored, and surgery during pregnancy is reserved for complications such as torsion or a cyst that looks suspicious. Your obstetrician will plan this with you.",
    },

    { k: "h2", text: "Living with it: follow-up" },
    {
      k: "ul",
      items: [
        "A repeat scan at the interval your doctor recommends",
        "Reporting new or worsening pain, bloating or changes in your periods",
        "Extra care with any cyst found after menopause",
        "Follow-up for endometriosis if you have endometriomas",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Sudden, severe pain on one side of the lower abdomen, especially with nausea and vomiting — the ovary may have twisted (torsion), which needs surgery quickly to save it",
        "Severe pain with fever, fainting, cold clammy skin or rapid breathing — a cyst may have burst and be bleeding",
        "Pain or bleeding with a positive pregnancy test",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What type of cyst do I have, and how big is it?",
        "Is it likely to go away on its own?",
        "When should I have another scan?",
        "Do I need surgery, and can my ovary be kept?",
        "Could this affect my fertility?",
        "Which symptoms mean I should come back urgently?",
      ],
    },
  ],
  faqs: [
    {
      q: "Are ovarian cysts cancerous?",
      a: "Most are not, especially in women who still have periods. Functional cysts are part of the normal cycle. The risk of cancer is higher after menopause and when a cyst looks complex on a scan, which is why these are investigated more thoroughly.",
    },
    {
      q: "Can an ovarian cyst affect my fertility?",
      a: "Functional cysts do not usually affect fertility. Endometriomas and the endometriosis behind them can, and surgery on the ovary can reduce egg reserve. Discuss the options with your gynaecologist before surgery if you want children.",
    },
    {
      q: "Will I need surgery for an ovarian cyst?",
      a: "Most cysts need no surgery and go away on their own. Surgery is considered for cysts that persist, grow, cause symptoms, look unusual on a scan, or appear after menopause, and for emergencies such as torsion.",
    },
    {
      q: "Is an ovarian cyst the same as PCOS?",
      a: "No. An ovarian cyst is a single fluid-filled sac. In PCOS the ovaries contain many small follicles, and the condition involves hormones, periods and ovulation. The two are diagnosed and treated differently.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Ovarian Cysts", url: "https://medlineplus.gov/ovariancysts.html" },
    { label: "Office on Women's Health, US Department of Health and Human Services — Ovarian cysts", url: "https://www.womenshealth.gov/a-z-topics/ovarian-cysts" },
  ],
};
