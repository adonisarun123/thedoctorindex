import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "polycystic-ovary-syndrome",
  title: "PCOS (polycystic ovary syndrome): symptoms, tests, treatment and which doctor to see",
  metaTitle: "PCOS: symptoms, tests, treatment and which doctor",
  standfirst: "What PCOS is, the symptoms it causes, how it is diagnosed, how it is managed at each stage of life, and which doctor to see.",
  targetQuery: "pcos symptoms and treatment",
  department: "endocrinology",
  specialty: "gynaecology",
  alsoSee: ["endocrinology", "dermatology", "dietetics"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Irregular periods", "Excess facial or body hair", "Acne", "Hair thinning", "Weight gain", "Dark patches of skin", "Difficulty getting pregnant"],
  tests: ["Pelvic ultrasound", "Testosterone", "Thyroid function tests", "Prolactin", "HbA1c", "Lipid profile"],
  treatments: ["Lifestyle changes", "Combined oral contraceptive pill", "Metformin", "Anti-androgen medicines", "Ovulation induction"],
  body: [
    { k: "h2", text: "What PCOS is" },
    {
      k: "p",
      text: "Polycystic ovary syndrome (PCOS) is a common hormonal condition in women and girls of reproductive age. The ovaries make more androgens ('male-type' hormones, which all women have in small amounts) than usual, and eggs are released irregularly or not at all. Many women with PCOS also have insulin resistance, meaning the body needs more insulin to keep blood sugar normal.",
    },
    {
      k: "p",
      text: "The name is misleading. The 'cysts' seen on scans are small follicles — eggs that started to develop but were not released — not true cysts, and they are not harmful in themselves. Some women with PCOS have normal-looking ovaries, and many women with follicles on a scan do not have PCOS.",
    },
    {
      k: "p",
      text: "PCOS cannot be cured, but its symptoms can be managed well, and most women with PCOS who want children are able to conceive, some with help. Because it raises the long-term risk of type 2 diabetes, high blood pressure, abnormal cholesterol and, if periods are very infrequent, thickening of the womb lining, it is worth diagnosing and following up.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Symptoms usually start in the teens or twenties and vary widely between women:" },
    {
      k: "ul",
      items: [
        "Irregular periods — infrequent, unpredictable or absent",
        "Excess facial or body hair, on the chin, upper lip, chest or abdomen",
        "Acne that persists beyond the teens or is hard to treat",
        "Hair thinning on the scalp",
        "Weight gain, especially around the waist, and difficulty losing it",
        "Dark patches of skin on the neck, armpits or groin (acanthosis nigricans), a sign of insulin resistance",
        "Difficulty getting pregnant",
        "Low mood or anxiety, which are more common in women with PCOS",
      ],
    },
    {
      k: "p",
      text: "Not every woman has every symptom, and PCOS also occurs in women of normal weight.",
    },

    { k: "h2", text: "Causes and who is at higher risk in India" },
    {
      k: "p",
      text: "The exact cause is not known. PCOS runs in families, and an interplay of genes, insulin resistance and hormone signalling between the brain and the ovaries is thought to drive it. Weight gain does not cause PCOS, but it can make insulin resistance and symptoms worse.",
    },
    {
      k: "p",
      text: "South Asian women tend to have more insulin resistance at a given weight, and so may develop prediabetes and diabetes earlier. Your risk of PCOS and its complications is higher if your mother or sister has PCOS, if close relatives have type 2 diabetes, and if you are physically inactive or carry weight around the waist. Long hours of sitting, poor sleep and diets high in refined starches and sugar can all worsen insulin resistance.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "There is no single test for PCOS. It is diagnosed when at least two of these three features are present, after other causes have been ruled out: irregular or absent ovulation; signs of high androgens, either on examination (hair, acne) or on a blood test; and polycystic-appearing ovaries on ultrasound. Tests commonly include:",
    },
    {
      k: "ul",
      items: [
        "**Testosterone** and sometimes other androgen tests",
        "**Pelvic ultrasound**, often transvaginal in adult women, to look at the ovaries and the womb lining",
        "**Thyroid function tests** and **prolactin**, to exclude other conditions that disturb periods",
        "Sometimes tests for adrenal conditions, if symptoms are severe or began suddenly",
        "A pregnancy test when periods have stopped",
      ],
    },
    {
      k: "p",
      text: "In teenagers within a few years of their first period, irregular cycles are normal and ultrasound appearances are unreliable, so doctors are cautious about diagnosing PCOS and may watch for a while. Once PCOS is diagnosed, screening for related conditions — blood sugar or **HbA1c**, a **lipid profile** and blood pressure — is recommended and repeated over the years.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [gynaecologist](/specialties/gynaecology) usually diagnoses and manages PCOS, especially when periods or fertility are the main concern. An [endocrinologist](/specialties/endocrinology) helps when insulin resistance, diabetes or unusual hormone results are part of the picture. A [dermatologist](/specialties/dermatology) can treat acne, hair growth and hair thinning, and a [dietitian](/specialties/dietetics) can help with a realistic eating plan.",
    },
    {
      k: "p",
      text: "You can [find gynaecologists in Bengaluru](/doctors/karnataka/bengaluru/gynaecologists) or [endocrinologists in Bengaluru](/doctors/karnataka/bengaluru/endocrinologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment is shaped around your main concerns — periods, skin and hair, weight, fertility or long-term health — and changes as your goals change.",
    },
    { k: "h3", text: "Lifestyle changes" },
    {
      k: "p",
      text: "**Lifestyle changes** are the foundation. Regular physical activity, fewer refined starches and sugary foods, more vegetables, pulses and protein, and better sleep improve insulin resistance. If you carry extra weight, losing even a modest amount can make periods more regular and improve the chance of ovulation. Avoid crash diets and unproven supplements sold for PCOS.",
    },
    { k: "h3", text: "Medicines" },
    {
      k: "ul",
      items: [
        "The **combined oral contraceptive pill** regulates periods, protects the womb lining and reduces acne and hair growth. Progestogen courses or a hormonal coil are alternatives for some women.",
        "**Metformin** improves insulin resistance and is used for some women, particularly those with prediabetes.",
        "**Anti-androgen medicines** reduce unwanted hair and acne. They must not be taken in pregnancy, so reliable contraception is needed while using them.",
        "Skin treatments, laser or other hair removal, and treatment for hair thinning from a dermatologist.",
      ],
    },
    { k: "h3", text: "Help with fertility" },
    {
      k: "p",
      text: "When pregnancy is the goal, **ovulation induction** with tablets such as letrozole is usually the first step, under a gynaecologist's or fertility specialist's care with monitoring. Injections, ovarian drilling and IVF are options if these do not work. Do not take fertility tablets without supervision.",
    },

    { k: "h2", text: "Living with it: follow-up" },
    {
      k: "ul",
      items: [
        "Blood sugar or HbA1c checks at intervals your doctor recommends, and before and during pregnancy",
        "Blood pressure and cholesterol checks",
        "A review if you go without a period for several months, to protect the womb lining",
        "Attention to mood, sleep and snoring, since depression and sleep apnoea are more common with PCOS",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Sudden, severe pain low in the abdomen, especially with vomiting or fainting",
        "Very heavy bleeding — soaking a pad every hour — with dizziness or fainting",
        "During fertility treatment: rapid swelling of the abdomen, severe pain, breathlessness or passing very little urine",
        "Pain or bleeding with a positive pregnancy test",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "How sure are we that this is PCOS, and what else was ruled out?",
        "Which treatment fits my main concern right now?",
        "What are the side effects of the medicine you are suggesting?",
        "Which checks for diabetes, blood pressure and cholesterol do I need, and how often?",
        "What should I do when I want to try for a pregnancy?",
        "Can you refer me to a dietitian or dermatologist?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can I get pregnant if I have PCOS?",
      a: "Yes, most women with PCOS who want children can conceive, though some take longer or need help with ovulation. Planning ahead with a gynaecologist, checking blood sugar and improving overall health before trying can make a real difference.",
    },
    {
      q: "Does PCOS go away after marriage or childbirth?",
      a: "No. Marriage does not treat PCOS, and pregnancy does not cure it, although symptoms can change over the years. Periods often become more regular as women get older, but the higher risk of diabetes and heart disease remains, so checks continue.",
    },
    {
      q: "Do I need to lose weight to manage PCOS?",
      a: "Not every woman with PCOS is overweight. If you do carry extra weight, losing a modest amount can improve periods, ovulation and insulin resistance. Regular activity and a balanced diet help everyone with PCOS, whatever their weight.",
    },
    {
      q: "Are the cysts in PCOS dangerous?",
      a: "No. The so-called cysts are small, immature follicles and do not need to be removed or drained. They are different from larger ovarian cysts, which a gynaecologist assesses separately if they cause symptoms.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Polycystic Ovary Syndrome", url: "https://medlineplus.gov/polycysticovarysyndrome.html" },
    { label: "World Health Organization — Polycystic ovary syndrome fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome" },
  ],
};
