import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "yeast-infections",
  title: "Yeast infections (candidiasis): symptoms, causes, treatment and which doctor to see",
  metaTitle: "Yeast infections: symptoms, treatment, which doctor",
  standfirst: "What yeast infections are, how vaginal thrush, oral thrush and skin candida show up, why they keep coming back, and which doctor to see.",
  targetQuery: "yeast infection symptoms and treatment",
  department: "infectious-diseases",
  specialty: "gynaecology",
  alsoSee: ["dermatology", "general-practice", "infectious-diseases"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Itching", "Thick white discharge", "White patches in the mouth", "Red rash in skin folds", "Burning"],
  tests: ["Swab test", "Microscopy", "Blood sugar", "Blood culture"],
  treatments: ["Antifungal creams", "Antifungal pessaries", "Oral antifungal medicines", "Keeping skin dry"],
  body: [
    { k: "h2", text: "What a yeast infection is" },
    {
      k: "p",
      text: "Yeasts are tiny fungi. One kind, called *Candida*, lives harmlessly in the mouth, gut, vagina and on the skin of most people. Normally the immune system and the body's other microbes keep it in check. When that balance is upset — by antibiotics, high blood sugar, hormonal changes, moisture or a weakened immune system — Candida can multiply and cause an infection called candidiasis, or a yeast infection.",
    },
    { k: "p", text: "Yeast infections affect different parts of the body in different ways:" },
    {
      k: "ul",
      items: [
        "**Vaginal thrush** — itching and discharge; very common in women and not a sign of poor hygiene",
        "**Oral thrush** — white patches in the mouth, common in babies, denture wearers and people using steroid inhalers",
        "**Skin candida** — red, itchy rashes in warm, moist folds such as under the breasts, in the groin, between fingers or under a belly fold; and nappy rash in babies",
        "**Penile thrush (balanitis)** — redness and itching on the head of the penis",
        "**Nail fold infection** — swelling and redness around the nails, common in people whose hands are often wet",
        "**Invasive candidiasis** — a serious infection of the blood or organs, mostly in people who are already very ill in hospital",
      ],
    },
    {
      k: "p",
      text: "Most yeast infections are mild and easy to treat. They are different from the ringworm-type fungal rashes that are very common in India; see [tinea infections](/conditions/tinea-infections) for those.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "h3", text: "Vaginal thrush" },
    {
      k: "ul",
      items: [
        "Itching and soreness around the vagina and vulva",
        "Thick white discharge, often described as curd-like, usually without a strong smell",
        "Burning or stinging when passing urine or during sex",
        "Redness and swelling of the vulva",
      ],
    },
    {
      k: "p",
      text: "A thin grey or green discharge with a fishy or strong smell is more likely to be another infection, such as bacterial vaginosis or an STI. See [vaginitis](/conditions/vaginitis) for the other causes.",
    },
    { k: "h3", text: "Oral thrush" },
    {
      k: "p",
      text: "Oral thrush causes white patches in the mouth on the tongue, inner cheeks or palate that may wipe off to leave red, sore areas. There may be cracks at the corners of the mouth, a cotton-wool feeling or loss of taste. Babies may be fussy while feeding. Pain or difficulty when swallowing can mean the infection has spread into the food pipe, which needs prompt medical care.",
    },
    { k: "h3", text: "Skin and nails" },
    {
      k: "p",
      text: "Skin candida typically causes a red rash in skin folds, with a moist surface, itching or burning, and small red spots around the edge. Nail fold infections cause redness, swelling and tenderness around the nails, sometimes with nail damage.",
    },

    { k: "h2", text: "Causes and risk factors" },
    { k: "p", text: "You are more likely to get a yeast infection if you:" },
    {
      k: "ul",
      items: [
        "Have recently taken antibiotics, which kill the helpful bacteria that keep Candida in check",
        "Have diabetes, especially if blood sugar is high — recurring thrush can be the first sign of [type 2 diabetes](/conditions/diabetes-type-2)",
        "Are pregnant, or taking hormonal medicines",
        "Use steroid medicines, including steroid inhalers without rinsing the mouth afterwards",
        "Have a weakened immune system, for example from untreated [HIV](/conditions/hiv), cancer treatment or transplant medicines",
        "Live in hot, humid weather, sweat a lot, or wear tight, synthetic clothing and damp undergarments",
        "Are overweight, with deep skin folds",
        "Wear dentures, especially if they are not cleaned well or are kept in overnight",
        "Use scented soaps, vaginal washes or douches that disturb the natural balance",
      ],
    },
    {
      k: "p",
      text: "Vaginal thrush is not classed as a sexually transmitted infection, although sex can sometimes trigger symptoms.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "A doctor can often recognise a yeast infection by its appearance and your symptoms. Tests are useful when symptoms are unusual, keep coming back, or do not respond to treatment:",
    },
    {
      k: "ul",
      items: [
        "**Swab test** — a sample from the vagina, mouth or skin is sent to the laboratory to confirm Candida and, if needed, identify the type and which medicines work",
        "**Microscopy** — the sample is examined under a microscope, sometimes in the clinic, to see yeast cells",
        "**Blood sugar** — to check for diabetes, especially with repeated infections",
        "An HIV test, with your consent, if infections are severe, unusual or keep returning",
        "**Blood culture** — in hospital, for suspected invasive candidiasis in someone who is seriously ill",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Yeast infections are treated with antifungal medicines. The type and length of treatment depend on where the infection is and how severe it is.",
    },
    {
      k: "ul",
      items: [
        "**Vaginal thrush** — **antifungal pessaries** (tablets placed in the vagina), vaginal creams, or **oral antifungal medicines**. In pregnancy, doctors usually prefer pessaries and creams, and oral antifungals are generally avoided.",
        "**Oral thrush** — antifungal gels, drops or lozenges, or tablets for more severe infection. Babies are treated with medicines suited to their age, and breastfeeding mothers may need treatment for the nipples at the same time.",
        "**Skin candida** — **antifungal creams**, along with **keeping skin dry** and aired",
        "**Invasive candidiasis** — antifungal medicines given through a drip in hospital",
      ],
    },
    {
      k: "p",
      text: "Be cautious with over-the-counter combination creams that contain a steroid along with an antifungal and antibacterial. Steroid creams can make fungal skin infections spread, come back and become harder to treat, and can thin the skin. Use them only if a doctor has specifically prescribed them for your rash.",
    },
    {
      k: "p",
      text: "Partners of women with vaginal thrush do not usually need treatment unless they have symptoms. Men with penile thrush should be checked for diabetes.",
    },
    { k: "h3", text: "If it keeps coming back" },
    {
      k: "p",
      text: "Some women get vaginal thrush several times a year. If this happens, see a doctor rather than repeatedly self-treating. They will confirm it is really thrush, check for diabetes and other causes, identify the type of yeast (some types respond differently), and may suggest a longer course or a preventive plan.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "ul",
      items: [
        "Wear loose cotton underwear and clothing; change out of sweaty or wet clothes promptly, especially in the monsoon",
        "Dry skin folds carefully after bathing",
        "Wash the genital area with plain water; avoid douches, scented washes and sprays",
        "Take antibiotics only when prescribed",
        "Keep blood sugar well controlled if you have diabetes",
        "Rinse your mouth after using a steroid inhaler",
        "Clean dentures daily and take them out at night",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "p",
      text: "Most yeast infections are not urgent. Call 112 or 108, or go to the nearest emergency department, if someone — particularly a person in hospital recently, with a catheter, on chemotherapy or with a weak immune system — develops a high fever, chills, confusion, fast breathing or very low blood pressure, as these can be signs of a serious bloodstream infection or [sepsis](/conditions/sepsis).",
    },
    {
      k: "p",
      text: "See a doctor soon for pain or difficulty swallowing, thrush with fever or lower abdominal pain, a first episode of thrush in a man or child, thrush in pregnancy, or infections that do not clear after treatment.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can treat most yeast infections. For vaginal thrush, especially if it keeps returning or you are pregnant, see a [gynaecologist](/specialties/gynaecology). A [dermatologist](/specialties/dermatology) is helpful for skin and nail infections that do not clear. An [infectious diseases specialist](/specialties/infectious-diseases) is involved for severe, invasive or drug-resistant infections and for people with weakened immunity.",
    },
    {
      k: "p",
      text: "You can [find gynaecologists in Bengaluru](/doctors/karnataka/bengaluru/gynaecologists), [dermatologists in Bengaluru](/doctors/karnataka/bengaluru/dermatologists) or [infectious disease specialists in Bengaluru](/doctors/karnataka/bengaluru/infectious-disease-specialists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Are you sure this is a yeast infection, or could it be something else?",
        "Which treatment is best for me, and how long should I use it?",
        "Should I be tested for diabetes?",
        "Does my partner need treatment?",
        "What should I do if it comes back?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is a vaginal yeast infection a sexually transmitted disease?",
      a: "No. Vaginal thrush is caused by an overgrowth of yeast that normally lives in the body. It can occur in women who are not sexually active. Sex can sometimes trigger symptoms, but partners usually do not need treatment unless they have symptoms.",
    },
    {
      q: "Why do I keep getting yeast infections?",
      a: "Repeated yeast infections can be linked to diabetes, frequent antibiotics, pregnancy, hormonal changes, tight damp clothing or a less common type of yeast. A doctor can confirm the diagnosis, test for causes and suggest a longer treatment plan.",
    },
    {
      q: "Can I use a steroid cream for a fungal rash?",
      a: "Not unless a doctor has prescribed it for that rash. Steroid-containing creams can make fungal infections spread and return, and long-term use can thin the skin. A plain antifungal cream and keeping the area dry are usually advised.",
    },
    {
      q: "Is oral thrush in babies serious?",
      a: "Oral thrush is common in babies and usually mild. It is easily treated with medicines suitable for infants. See a doctor if the baby is not feeding well, seems unwell, or if the thrush does not clear with treatment.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Yeast Infections", url: "https://medlineplus.gov/yeastinfections.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
