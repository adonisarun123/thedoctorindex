import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "hyperthyroidism",
  title: "Hyperthyroidism (overactive thyroid): symptoms, tests, treatment and which doctor to see",
  metaTitle: "Hyperthyroidism: symptoms, thyroid tests and treatment",
  standfirst: "What an overactive thyroid is, the symptoms it causes, the tests that find the cause, the treatment options, and which doctor to see.",
  targetQuery: "hyperthyroidism symptoms and treatment",
  department: "endocrinology",
  specialty: "endocrinology",
  alsoSee: ["general-practice", "ophthalmology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Weight loss", "Palpitations", "Tremor", "Heat intolerance", "Sweating", "Anxiety", "Frequent bowel movements", "Bulging eyes"],
  tests: ["TSH", "Free T4", "Free T3", "TSH receptor antibodies", "Thyroid uptake scan", "Thyroid ultrasound"],
  treatments: ["Antithyroid medicines", "Beta blockers", "Radioactive iodine", "Thyroid surgery"],
  body: [
    { k: "h2", text: "What hyperthyroidism is" },
    {
      k: "p",
      text: "The thyroid is a small gland at the front of the neck whose hormones set the pace of the body's metabolism. In hyperthyroidism the gland makes too much hormone, and many systems speed up: the heart beats faster, weight drops, the hands shake and you may feel hot, restless and unable to sleep.",
    },
    {
      k: "p",
      text: "Left untreated, an overactive thyroid strains the heart, can trigger an irregular heartbeat called atrial fibrillation, thins the bones and causes problems in pregnancy. It is very treatable, but the right treatment depends on the cause, so finding the cause is part of the diagnosis.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Symptoms usually build up over weeks or months. The common ones are:" },
    {
      k: "ul",
      items: [
        "Weight loss despite a normal or increased appetite",
        "Palpitations or a racing heartbeat, even at rest",
        "Tremor of the hands",
        "Heat intolerance and sweating more than usual",
        "Anxiety, irritability, restlessness and difficulty sleeping",
        "Frequent bowel movements or loose stools",
        "Muscle weakness, especially in the thighs and upper arms",
        "Lighter or less frequent periods",
        "A swelling in the neck (goitre)",
        "In Graves' disease: gritty, red or bulging eyes, or double vision",
      ],
    },
    {
      k: "p",
      text: "Older people may have few of these and instead feel tired, lose weight or develop an irregular heartbeat. Because anxiety, weight loss and palpitations have many causes, a blood test is needed to confirm the thyroid is responsible.",
    },

    { k: "h2", text: "Causes and who is at higher risk" },
    { k: "p", text: "The main causes are:" },
    {
      k: "ul",
      items: [
        "**Graves' disease** — the most common cause. The immune system makes antibodies that switch the thyroid on continuously. It can also affect the eyes and, rarely, the skin of the shins.",
        "**Toxic nodules** — one or more lumps in the thyroid that make hormone on their own, more common in older people.",
        "**Thyroiditis** — inflammation of the gland, after a viral infection, after pregnancy or with some medicines. Stored hormone leaks out, and the overactivity is usually temporary.",
        "**Too much thyroid hormone medicine**, or too much iodine from some medicines and contrast dyes.",
      ],
    },
    {
      k: "p",
      text: "Women are affected far more often than men. Your risk is higher with a family history of thyroid disease, other autoimmune conditions such as type 1 diabetes or vitiligo, and in the year after childbirth. Smoking raises the risk of Graves' eye disease and makes it worse.",
    },

    { k: "h2", text: "How it is diagnosed" },
    { k: "p", text: "Blood tests confirm the diagnosis, and further tests show the cause:" },
    {
      k: "ul",
      items: [
        "**TSH** (thyroid-stimulating hormone) — usually very low in hyperthyroidism, because the pituitary gland stops signalling to an overactive thyroid.",
        "**Free T4** and **Free T3** — the thyroid hormones themselves, which are raised.",
        "**TSH receptor antibodies** — point to Graves' disease.",
        "**Thyroid uptake scan** — a small amount of a radioactive tracer shows whether the whole gland, a single nodule or nothing is overactive. It helps tell Graves' disease and nodules from thyroiditis. It is not done in pregnancy or while breastfeeding.",
        "**Thyroid ultrasound** — shows nodules and blood flow in the gland.",
      ],
    },
    {
      k: "p",
      text: "Your doctor may also check a blood count and liver tests before starting treatment, and an ECG if your pulse is fast or irregular. Biotin supplements can interfere with thyroid results, so mention any supplements you take.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can make the first diagnosis and start symptom relief. Because the treatment choices are more involved than for an underactive thyroid, most people benefit from seeing an [endocrinologist](/specialties/endocrinology), and this is particularly important in pregnancy, in Graves' disease and when the cause is unclear.",
    },
    {
      k: "p",
      text: "If your eyes are affected, see an [ophthalmologist](/specialties/ophthalmology), ideally one experienced in thyroid eye disease. A thyroid surgeon operates when surgery is chosen. You can [find endocrinologists in Bengaluru](/doctors/karnataka/bengaluru/endocrinologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment calms symptoms quickly and then controls hormone levels. Which long-term option suits you depends on the cause, your age, whether you plan a pregnancy, your eyes and your own preference.",
    },
    {
      k: "ul",
      items: [
        "**Beta blockers** ease palpitations, tremor and anxiety within days while other treatment takes effect. They do not change hormone levels.",
        "**Antithyroid medicines** — carbimazole, its relative methimazole, and propylthiouracil — reduce hormone production. In Graves' disease they are usually given for a long course, after which some people stay in remission. Propylthiouracil is often used in early pregnancy.",
        "**Radioactive iodine**, taken by mouth as a capsule or drink, gradually shrinks the overactive tissue. It often leads to an underactive thyroid later, which is treated with daily thyroxine. It is not used in pregnancy or breastfeeding, and pregnancy is delayed for a period afterwards.",
        "**Thyroid surgery** removes all or part of the gland. It suits people with a large goitre, suspicious nodules or significant eye disease, or those who cannot take other treatments.",
      ],
    },
    {
      k: "p",
      text: "Thyroiditis usually needs only symptom relief, because it settles on its own; antithyroid medicines do not help it. Do not stop or change antithyroid medicines on your own, even when you feel better.",
    },
    {
      k: "note",
      tone: "alert",
      text: "Rarely, antithyroid medicines lower the white blood cell count. If you get a sore throat, mouth ulcers or fever while taking them, get a blood count the same day and ask your doctor whether to pause the tablet.",
    },

    { k: "h2", text: "Living with it: follow-up" },
    {
      k: "ul",
      items: [
        "Thyroid blood tests every few weeks at first, then less often as levels settle",
        "Regular checks after stopping antithyroid medicines, because Graves' disease can come back",
        "Lifelong yearly checks after radioactive iodine or surgery, to catch an underactive thyroid",
        "Telling your doctor early if you plan a pregnancy or become pregnant",
        "Stopping smoking, which protects your eyes",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "High fever with a very fast heartbeat, agitation, confusion, vomiting or diarrhoea — signs of a rare but dangerous 'thyroid storm', often after an infection or surgery",
        "Chest pain, fainting or severe breathlessness",
        "Sudden loss of vision or severe eye pain",
      ],
    },
    {
      k: "p",
      text: "A sore throat or fever on antithyroid medicines needs same-day medical attention, as above.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What is causing my overactive thyroid?",
        "Which treatment options suit me, and what are the pros and cons of each?",
        "How long will I need medicines, and what are the chances of remission?",
        "What side effects should I watch for?",
        "Do my eyes need checking?",
        "How does this affect pregnancy planning?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can hyperthyroidism be treated permanently?",
      a: "Radioactive iodine and surgery usually end the overactivity for good, though many people then need lifelong thyroxine. Antithyroid medicines can lead to lasting remission in Graves' disease for some people, but it can return, so follow-up continues.",
    },
    {
      q: "Is weight loss from an overactive thyroid healthy?",
      a: "No. The weight lost includes muscle and bone, and the heart is under strain. Most people regain some weight once the thyroid is controlled; a dietitian can help if this becomes a concern. Thyroid hormone should never be taken to lose weight.",
    },
    {
      q: "Can I get pregnant if I have hyperthyroidism?",
      a: "Yes, but plan with your endocrinologist. Uncontrolled hyperthyroidism raises the risk of miscarriage and other complications, and some treatments are unsuitable in pregnancy. Your doctor may switch your medicine before or early in pregnancy.",
    },
    {
      q: "Does iodised salt make hyperthyroidism worse?",
      a: "For most people, normal amounts of iodised salt are not a problem. Large doses of iodine from some supplements, medicines or contrast dyes can affect the thyroid, so tell your doctor about these before tests or treatment.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Hyperthyroidism", url: "https://medlineplus.gov/hyperthyroidism.html" },
    { label: "American Thyroid Association — Hyperthyroidism", url: "https://www.thyroid.org/hyperthyroidism/" },
  ],
};
