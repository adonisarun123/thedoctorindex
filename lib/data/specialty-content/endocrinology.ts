import type { SpecialtyContent } from "./types";

export const endocrinology: SpecialtyContent = {
  key: "endocrinology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "An endocrinologist is a physician who specialises in hormones and the glands that make them: the thyroid, pituitary, adrenal and parathyroid glands, the pancreas, the ovaries and the testes. Hormones control growth, metabolism, blood sugar, bone strength, fertility and much else, so endocrine problems can show up in many different ways. In India the usual route is an MBBS, a postgraduate degree in general medicine or paediatrics, and then a super-speciality degree such as DM Endocrinology or DrNB Endocrinology.",
    "Endocrinologists treat with medicines, hormone replacement and careful monitoring; they do not operate. When a gland needs surgery, for example a thyroid nodule or a pituitary tumour, they work with general, ENT or endocrine surgeons and neurosurgeons. Diabetes is a large part of the work in India, but endocrinologists also see thyroid disease, hormonal causes of irregular periods and infertility, bone and calcium problems, and growth and puberty in children.",
    "Many common hormone problems, such as an underactive thyroid or uncomplicated type 2 diabetes, are managed well by a general physician. An endocrinologist is usually involved when the diagnosis is unclear, when treatment is not working, when a gland is enlarged or has a lump, or when a rarer condition is suspected. Hormone results can be affected by the time of day, medicines and pregnancy, so tests are often repeated or timed carefully.",
  ],
  conditions: [
    { name: "Hypothyroidism and hyperthyroidism", note: "An underactive or overactive thyroid, causing tiredness and weight gain, or weight loss, palpitations and anxiety." },
    { name: "Thyroid nodules and goitre", note: "Lumps or swelling in the thyroid, assessed to decide whether they need treatment." },
    { name: "Diabetes that is complex or hard to control", note: "Type 1 diabetes, diabetes with complications, or type 2 diabetes not settling on treatment." },
    { name: "Polycystic ovary syndrome (PCOS)", note: "Irregular periods, excess hair growth and acne linked to hormone imbalance, often with weight and insulin resistance." },
    { name: "Pituitary disorders", note: "Tumours or underactivity of the pituitary gland, which controls several other glands." },
    { name: "Adrenal disorders", note: "Too much or too little cortisol or other adrenal hormones, which can affect blood pressure, weight and energy." },
    { name: "Calcium and parathyroid disorders", note: "High or low calcium levels, often due to the parathyroid glands or vitamin D." },
    { name: "Osteoporosis and bone metabolism", note: "Weak bones, especially where a hormonal cause is suspected." },
    { name: "Growth and puberty problems", note: "Short stature or early or late puberty in children, seen by paediatric endocrinologists." },
  ],
  tests: [
    { name: "Thyroid function tests (TSH, T4, T3)", note: "Blood tests showing whether the thyroid is under- or overactive." },
    { name: "Thyroid antibodies", note: "Help identify autoimmune causes of thyroid disease." },
    { name: "HbA1c and blood sugar tests", note: "Show average and current blood sugar levels in diabetes." },
    { name: "Hormone blood tests", note: "Measure hormones such as cortisol, prolactin, testosterone and others, often at a set time of day." },
    { name: "Dynamic function tests", note: "Hormone levels measured before and after a stimulus, to see how a gland responds." },
    { name: "Thyroid ultrasound and fine-needle aspiration", note: "A scan of the thyroid, and a thin-needle sample of a nodule if needed." },
    { name: "Calcium, vitamin D and parathyroid hormone", note: "Blood tests for bone and calcium disorders." },
    { name: "MRI of the pituitary", note: "Detailed imaging of the pituitary gland at the base of the brain." },
    { name: "Bone density scan (DEXA)", note: "Measures bone strength in osteoporosis." },
  ],
  versus: [
    { key: "diabetology", text: "A diabetologist concentrates on diabetes and its complications. An endocrinologist covers all the hormone glands, diabetes included, and is the right choice for thyroid, pituitary, adrenal, calcium or fertility hormone problems." },
    { key: "gynaecology", text: "Irregular periods and PCOS are seen by both. A gynaecologist leads on periods, fertility treatment and pregnancy; an endocrinologist helps when hormone levels, weight or metabolism need closer attention." },
    { key: "general-surgery", text: "An endocrinologist diagnoses and manages gland disorders with medicines. When a thyroid or parathyroid gland needs removing, a surgeon, often a general, ENT or endocrine surgeon, operates." },
  ],
  firstVisit: [
    "Bring every thyroid, sugar, hormone and scan report you have, with dates; the pattern over time is often key.",
    "Bring a list of medicines and supplements, including biotin, steroids and contraceptive pills, which can affect hormone results.",
    "Note changes in weight, energy, periods, sleep, hair and skin, and how long they have been going on.",
    "For children, bring the growth record or earlier height and weight measurements.",
    "Ask whether any test needs fasting or a particular time of day, as some hormone tests are timed.",
  ],
  urgent: [
    "Confusion, sweating, shaking or drowsiness in someone on diabetes treatment, which can mean low blood sugar; if they cannot swallow safely, call 108",
    "Vomiting, abdominal pain, deep rapid breathing and drowsiness in someone with diabetes",
    "Severe weakness, vomiting, low blood pressure or collapse in someone who takes steroid or adrenal replacement",
    "A very fast heartbeat, high fever and agitation in someone with an overactive thyroid",
  ],
  faqs: [
    {
      q: "What is the difference between an endocrinologist and a diabetologist?",
      a: "A diabetologist focuses on diabetes. An endocrinologist treats disorders of all the hormone glands, including diabetes, thyroid, pituitary, adrenal and calcium problems.",
    },
    {
      q: "Do I need an endocrinologist for a thyroid problem?",
      a: "Many thyroid problems are managed well by a general physician. An endocrinologist is useful when the diagnosis is unclear, treatment is not working, there is a lump or swelling, or during pregnancy.",
    },
    {
      q: "What qualifications should an endocrinologist have?",
      a: "An MBBS, a postgraduate degree usually in general medicine or paediatrics, and then a super-speciality degree such as DM Endocrinology or DrNB Endocrinology. Registration can be checked with the NMC or a state medical council.",
    },
    {
      q: "Can an endocrinologist help with PCOS?",
      a: "Yes, particularly with the hormonal and metabolic side, such as weight, blood sugar and excess hair growth. Care is often shared with a gynaecologist.",
    },
    {
      q: "Why do hormone tests sometimes need repeating?",
      a: "Hormone levels vary with the time of day, stress, illness, medicines and pregnancy. Repeating a test, or doing it at a set time, helps confirm the result before treatment is decided.",
    },
  ],
};
