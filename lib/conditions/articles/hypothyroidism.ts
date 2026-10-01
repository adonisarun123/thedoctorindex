import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "hypothyroidism",
  title: "Hypothyroidism (underactive thyroid): symptoms, tests, treatment and which doctor to see",
  metaTitle: "Hypothyroidism: symptoms, thyroid tests and treatment",
  standfirst: "What an underactive thyroid is, the symptoms it causes, the blood tests that confirm it, how thyroxine treatment works, and which doctor to see.",
  targetQuery: "hypothyroidism symptoms and treatment",
  department: "endocrinology",
  specialty: "endocrinology",
  alsoSee: ["general-practice", "gynaecology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Tiredness", "Weight gain", "Feeling cold", "Constipation", "Dry skin", "Hair thinning", "Low mood", "Heavy or irregular periods"],
  tests: ["TSH", "Free T4", "Thyroid antibodies"],
  treatments: ["Levothyroxine"],
  body: [
    { k: "h2", text: "What hypothyroidism is" },
    {
      k: "p",
      text: "The thyroid is a small, butterfly-shaped gland at the front of the neck. Its hormones set the pace at which the body uses energy — they affect the heart rate, body temperature, digestion, mood, the skin and hair, periods and fertility. In hypothyroidism the gland does not make enough hormone, and many of these processes slow down.",
    },
    {
      k: "p",
      text: "It usually develops gradually, over months or years, so the changes are easy to put down to age, stress or a busy life. It is far more common in women than in men, and it is very treatable: once the hormone is replaced, most people feel back to normal.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Symptoms vary a great deal, and some people have none. The common ones are:" },
    {
      k: "ul",
      items: [
        "Tiredness and sluggishness that rest does not fix",
        "Weight gain, often modest, with puffiness of the face",
        "Feeling cold when others are comfortable",
        "Constipation",
        "Dry skin and brittle nails",
        "Hair thinning or hair fall",
        "Low mood, poor concentration or slowed thinking",
        "Heavy or irregular periods, or difficulty getting pregnant",
        "Muscle aches, a hoarse voice or a swelling in the neck (goitre)",
      ],
    },
    {
      k: "p",
      text: "None of these is specific to the thyroid. Tiredness and hair fall, for example, are also common with anaemia and vitamin deficiencies. A blood test is the only way to know.",
    },

    { k: "h2", text: "Causes and who is at higher risk" },
    {
      k: "p",
      text: "The most common cause today is **Hashimoto's thyroiditis**, an autoimmune condition in which the immune system gradually damages the thyroid. Other causes include:",
    },
    {
      k: "ul",
      items: [
        "Surgery to remove part or all of the thyroid, or radioactive iodine treatment for an overactive thyroid",
        "Radiation to the neck for cancer",
        "Inflammation of the thyroid after pregnancy (postpartum thyroiditis), which is often temporary",
        "Some medicines, including lithium and amiodarone",
        "Iodine deficiency",
        "Rarely, a problem with the pituitary gland, which controls the thyroid",
      ],
    },
    {
      k: "p",
      text: "Your risk is higher if you are a woman, are older, have a family history of thyroid disease, or have another autoimmune condition such as type 1 diabetes, vitiligo or rheumatoid arthritis. India has long run a national programme to prevent iodine deficiency through iodised salt; using iodised salt at home remains sensible unless your doctor advises otherwise.",
    },

    { k: "h2", text: "How it is diagnosed" },
    { k: "p", text: "Hypothyroidism is diagnosed with blood tests:" },
    {
      k: "ul",
      items: [
        "**TSH** (thyroid-stimulating hormone) — made by the pituitary to drive the thyroid. When the thyroid is underactive, TSH usually rises. It is the main screening test.",
        "**Free T4** — the amount of thyroid hormone circulating in the blood. A low free T4 with a high TSH confirms hypothyroidism.",
        "**Thyroid antibodies** — anti-TPO antibodies point to Hashimoto's thyroiditis and help predict whether mild changes will progress.",
      ],
    },
    {
      k: "p",
      text: "A raised TSH with a normal free T4 is called subclinical hypothyroidism. Whether it needs treatment depends on the TSH level, your symptoms, your age, whether you are pregnant or planning pregnancy, and your antibody result; your doctor will usually repeat the tests after a few weeks before deciding. A recent illness, some medicines and biotin supplements can disturb thyroid results, so mention anything you take.",
    },
    {
      k: "p",
      text: "An ultrasound of the neck is done if there is a lump or the gland is enlarged, but it is not needed to diagnose hypothyroidism itself.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most people with hypothyroidism are diagnosed and treated well by a [general physician](/specialties/general-practice). An [endocrinologist](/specialties/endocrinology) is worth seeing when:",
    },
    {
      k: "ul",
      items: [
        "You are pregnant or planning pregnancy",
        "Your results are unusual, for example a low TSH with a low free T4",
        "You still feel unwell despite normal results on treatment",
        "You have a goitre, a thyroid lump or heart disease",
        "Your levels keep swinging despite taking your tablet regularly",
      ],
    },
    {
      k: "p",
      text: "A [gynaecologist](/specialties/gynaecology) often picks up thyroid problems in women with period problems or difficulty conceiving, and works with the endocrinologist during pregnancy. You can [find endocrinologists in Bengaluru](/doctors/karnataka/bengaluru/endocrinologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment replaces the missing hormone with **levothyroxine** (thyroxine), a synthetic form of the hormone the thyroid normally makes. It is a single daily tablet. The dose is worked out from your weight, age, heart health and blood tests, and is adjusted in small steps. Older people and people with heart disease usually start on a lower dose that is increased slowly.",
    },
    {
      k: "p",
      text: "How you take it matters. It is usually taken on an empty stomach, at the same time each day, with water, waiting before breakfast or tea; ask your doctor or pharmacist for the exact gap. Calcium and iron supplements, antacids and some other medicines reduce its absorption and should be taken at a different time of day. If you switch brands, get your levels checked again, because brands can behave slightly differently.",
    },
    {
      k: "p",
      text: "Most people need treatment for life. Do not stop or change the dose on your own, and do not take extra tablets to lose weight — too much thyroxine strains the heart and weakens the bones. Thyroid hormone is not a weight-loss medicine.",
    },

    { k: "h2", text: "Living with it: follow-up" },
    {
      k: "ul",
      items: [
        "A TSH check six to eight weeks after starting or changing the dose",
        "Once stable, a check every year or as your doctor advises",
        "An earlier check if symptoms return, if you start or stop medicines such as calcium, iron or oral contraceptives, or if your weight changes a lot",
        "As soon as you know you are pregnant, tell your doctor: the dose often needs increasing, and levels are checked more often",
      ],
    },
    {
      k: "p",
      text: "Some symptoms, such as weight gain and hair fall, may take several months to improve after levels become normal. If they persist, ask about other causes rather than assuming the thyroid dose is wrong.",
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "p",
      text: "Severe, untreated hypothyroidism can rarely lead to a life-threatening state called myxoedema coma, usually in older people after an infection, cold exposure or surgery. Call 112 or 108 if someone with known or suspected hypothyroidism has:",
    },
    {
      k: "ul",
      items: [
        "Increasing drowsiness, confusion or unresponsiveness",
        "A very low body temperature, or feels cold to touch",
        "Slow, shallow breathing or a very slow pulse",
      ],
    },
    {
      k: "p",
      text: "Also seek urgent care for chest pain, a racing heart or severe breathlessness after starting or increasing thyroxine, especially if you have heart disease.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What is causing my hypothyroidism, and is it likely to be permanent?",
        "Do I need treatment now, or should we repeat the tests?",
        "How and when should I take my tablet, and what should I avoid taking with it?",
        "When should my next blood test be?",
        "What should I do before and during pregnancy?",
        "Should anyone in my family be tested?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is hypothyroidism lifelong?",
      a: "Usually, especially when it is caused by Hashimoto's thyroiditis, surgery or radioactive iodine. Some forms, such as thyroiditis after pregnancy or hypothyroidism caused by a medicine, can be temporary. Your doctor will tell you which applies to you.",
    },
    {
      q: "Can I get pregnant if I have hypothyroidism?",
      a: "Yes. Well-controlled hypothyroidism does not usually prevent pregnancy. Tell your doctor when you are planning to conceive and as soon as you are pregnant, because the dose of thyroxine usually needs to go up and levels need closer monitoring.",
    },
    {
      q: "Will thyroxine help me lose weight?",
      a: "Treatment may help you lose some of the weight gained because of an underactive thyroid, mostly fluid. It is not a weight-loss medicine, and taking more than prescribed is harmful to the heart and bones.",
    },
    {
      q: "Should I avoid cabbage, cauliflower or soya?",
      a: "For most people eating a normal mixed diet with iodised salt, ordinary amounts of these foods are fine. Soya and fibre can affect how thyroxine is absorbed, so keep your tablet routine consistent and ask your doctor if you eat them in large amounts.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Hypothyroidism", url: "https://medlineplus.gov/hypothyroidism.html" },
    { label: "American Thyroid Association — Hypothyroidism", url: "https://www.thyroid.org/hypothyroidism/" },
    { label: "National Health Mission, MoHFW — National Iodine Deficiency Disorders Control Programme", url: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=1054&lid=230" },
  ],
};
