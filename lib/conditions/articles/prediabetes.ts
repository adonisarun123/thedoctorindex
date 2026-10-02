import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "prediabetes",
  title: "Prediabetes: what it means, tests, how to reverse it and which doctor to see",
  metaTitle: "Prediabetes: tests, what it means and how to reverse it",
  standfirst: "What prediabetes is, why it usually has no symptoms, the blood tests that find it, and the changes that can stop it becoming type 2 diabetes.",
  targetQuery: "prediabetes symptoms and treatment",
  department: "diabetology",
  specialty: "general-practice",
  alsoSee: ["diabetology", "dietetics"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Dark patches of skin", "Skin tags"],
  tests: ["HbA1c", "Fasting plasma glucose", "Oral glucose tolerance test"],
  treatments: ["Diet and physical activity", "Weight loss", "Metformin"],
  body: [
    { k: "h2", text: "What prediabetes is" },
    {
      k: "p",
      text: "Prediabetes means your blood sugar is higher than normal but not yet high enough to be called diabetes. It is a sign that the body is starting to struggle to use insulin, the hormone that moves glucose from the blood into the cells. Doctors also call it impaired fasting glucose or impaired glucose tolerance, depending on which test showed it.",
    },
    {
      k: "p",
      text: "Prediabetes matters for two reasons. Many people with it go on to develop type 2 diabetes within a few years, and even at this stage the risk of heart disease and stroke is higher than normal. The encouraging part is that this is the stage when change works best: many people bring their sugar back to normal, and others delay diabetes for years.",
    },

    { k: "h2", text: "Symptoms — usually none" },
    {
      k: "p",
      text: "Most people with prediabetes feel completely well. It is usually found on a routine blood test, a health camp or a pre-employment check. A few people notice signs of insulin resistance:",
    },
    {
      k: "ul",
      items: [
        "Dark patches of skin, velvety in texture, on the back of the neck, in the armpits or groin (acanthosis nigricans)",
        "Skin tags, small soft growths, around the neck or armpits",
        "Weight gain around the waist that is hard to shift",
      ],
    },
    {
      k: "p",
      text: "If you develop increased thirst, frequent urination, blurred vision or unexplained weight loss, your sugar may already have reached the diabetes range — get tested promptly.",
    },

    { k: "h2", text: "Who is at higher risk in India" },
    {
      k: "p",
      text: "South Asians tend to develop insulin resistance at a younger age and a lower body weight than many other populations, and fat around the waist is a particular warning sign even in people who look slim. Your risk is higher if you:",
    },
    {
      k: "ul",
      items: [
        "Have a parent, brother or sister with type 2 diabetes",
        "Carry extra weight around the waist",
        "Sit for most of the day and rarely exercise",
        "Eat large portions of rice, refined flour, sweets and sugary drinks",
        "Had diabetes during pregnancy, or have polycystic ovary syndrome (PCOS)",
        "Have high blood pressure, high triglycerides or low HDL ('good') cholesterol",
        "Sleep poorly, or have sleep apnoea",
      ],
    },
    {
      k: "p",
      text: "Under the national programme for non-communicable diseases, people aged 30 and above can be screened for diabetes and high blood pressure at government health facilities, including Ayushman Arogya Mandirs.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Prediabetes is diagnosed with laboratory blood tests, not a home glucometer. Your doctor will use one or more of these:",
    },
    {
      k: "ul",
      items: [
        "**HbA1c** — shows your average blood sugar over the past two to three months; no fasting is needed.",
        "**Fasting plasma glucose** — taken after an overnight fast.",
        "**Oral glucose tolerance test** — blood is taken before and two hours after a measured glucose drink. It can detect problems that the fasting test misses.",
      ],
    },
    {
      k: "p",
      text: "Each test has set ranges for normal, prediabetes and diabetes, and a borderline result is usually repeated. HbA1c can be misleading in anaemia and in inherited haemoglobin variants such as thalassaemia trait, which are common in India; your doctor may prefer a glucose test in these cases. Blood pressure, cholesterol and sometimes a liver scan for fatty liver are usually checked at the same time.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can diagnose prediabetes, check your other risk factors and support you through the changes. A [dietitian](/specialties/dietetics) can build an eating plan around your usual foods, family meals and working hours, which makes it far more likely to last. A [diabetologist](/specialties/diabetology) is worth seeing if your sugar keeps rising despite changes, if you had diabetes in pregnancy, or if you have other conditions that make treatment more complex.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians), [diabetologists in Bengaluru](/doctors/karnataka/bengaluru/diabetologists) or [dietitians in Bengaluru](/doctors/karnataka/bengaluru/dietitians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment: bringing your sugar back down" },
    { k: "h3", text: "Diet and physical activity" },
    {
      k: "p",
      text: "**Diet and physical activity** are the main treatment, and they work. In practice this means:",
    },
    {
      k: "ul",
      items: [
        "Smaller portions of rice, rotis, idli, dosa and other starches, with half the plate filled with vegetables",
        "More pulses, dal, sprouts, eggs, fish, paneer or curd for protein",
        "Whole grains and millets in place of refined flour and polished rice where you can",
        "Cutting back sharply on sugar, sweets, bakery items, fruit juices and sugary drinks, including sweetened tea and coffee",
        "Brisk walking or other activity on most days, plus muscle-strengthening exercise a couple of times a week",
        "Breaking up long periods of sitting, even with a few minutes of movement",
      ],
    },
    { k: "h3", text: "Weight loss" },
    {
      k: "p",
      text: "If you carry extra weight, **weight loss** of even a modest amount significantly lowers the chance of progressing to diabetes. Steady loss through habits you can keep is better than crash diets. Good sleep, less stress and stopping tobacco also help.",
    },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "For some people at particularly high risk — for example after diabetes in pregnancy, or when sugar keeps rising despite changes — a doctor may suggest **metformin**. It is an addition to lifestyle change, not a replacement for it. Do not start diabetes medicines on your own, and be wary of supplements and powders marketed to 'reverse' prediabetes.",
    },

    { k: "h2", text: "Living with it: the checks that matter" },
    {
      k: "ul",
      items: [
        "A repeat HbA1c or glucose test at least once a year, or as your doctor advises",
        "Blood pressure and cholesterol checks",
        "Waist measurement and weight, as a simple guide to progress",
        "Testing early in any future pregnancy",
      ],
    },
    {
      k: "p",
      text: "Encourage family members to get tested too: prediabetes often runs in families, and households that change their cooking together find it easier to stick with.",
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "p",
      text: "Prediabetes itself does not cause emergencies, but its partners — heart disease and stroke — do. Call 112 or 108 for chest pain or pressure, sudden weakness of the face, arm or leg, difficulty speaking, or severe breathlessness. See a doctor urgently if you develop great thirst, frequent urination, vomiting or drowsiness, which can mean sugar has risen into the diabetes range.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Which test showed prediabetes, and should it be repeated?",
        "How much weight, if any, should I aim to lose?",
        "What changes to my diet would make the most difference?",
        "Do I need medicine at this stage?",
        "How often should I be tested?",
        "Should my blood pressure, cholesterol or liver be checked?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can prediabetes be reversed?",
      a: "Yes, for many people. Changes to diet and physical activity, and losing weight if you carry extra, can bring blood sugar back into the normal range. The tendency remains, so keep up the changes and have regular tests to make sure it stays there.",
    },
    {
      q: "Do I need to stop eating rice?",
      a: "Not necessarily. Smaller portions, combined with more vegetables, dal and protein, and choosing less refined grains where you can, usually matter more than cutting out a food entirely. A dietitian can help you plan meals that suit your family.",
    },
    {
      q: "Is prediabetes the same as borderline diabetes?",
      a: "Yes, 'borderline diabetes' and 'borderline sugar' are common names for prediabetes. They should not be taken lightly. This is the stage when changes are most likely to prevent type 2 diabetes and its complications.",
    },
    {
      q: "Should I check my sugar at home with a glucometer?",
      a: "Home glucometers are useful for people already diagnosed with diabetes, but they are not accurate enough to diagnose or track prediabetes. Laboratory HbA1c or glucose tests, repeated as your doctor advises, are the better guide.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Prediabetes", url: "https://medlineplus.gov/prediabetes.html" },
    { label: "World Health Organization — Diabetes fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/diabetes" },
    { label: "DD News — Government launches intensified NCD screening campaign for all citizens aged 30 and above", url: "https://ddnews.gov.in/en/government-launches-intensified-ncd-screening-campaign-to-cover-all-citizens-aged-30-and-above/" },
  ],
};
