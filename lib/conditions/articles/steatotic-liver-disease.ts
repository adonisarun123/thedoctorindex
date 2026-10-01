import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "steatotic-liver-disease",
  title: "Fatty liver disease (MASLD): symptoms, tests and treatment",
  standfirst: "What fatty liver (now called steatotic liver disease or MASLD) is, why it is often silent, the tests that stage it, and how to slow or reverse it.",
  targetQuery: "fatty liver disease symptoms and treatment",
  department: "hepatology",
  specialty: "gastroenterology",
  alsoSee: ["general-practice", "dietetics", "endocrinology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Tiredness", "Discomfort in the upper right abdomen", "Jaundice", "Swelling of the abdomen or legs"],
  tests: ["Liver function tests", "Ultrasound", "FIB-4", "Transient elastography", "Liver biopsy"],
  treatments: ["Weight loss", "Physical activity", "Avoiding alcohol", "Managing diabetes, blood pressure and cholesterol"],
  body: [
    { k: "h2", text: "What fatty liver disease is" },
    {
      k: "p",
      text: "Fatty liver means fat has built up inside the liver cells. Doctors now call this **steatotic liver disease**. The name changed recently, so you may see several terms on reports: fatty liver, NAFLD (non-alcoholic fatty liver disease) and the newer **MASLD** — metabolic dysfunction-associated steatotic liver disease. They largely describe the same thing.",
    },
    {
      k: "p",
      text: "MASLD is fatty liver linked to the body's metabolism — excess weight, especially around the waist, high blood sugar, high blood pressure or abnormal cholesterol — rather than to heavy drinking. Fatty liver caused by alcohol is called alcohol-related liver disease, and people with both metabolic risk factors and moderate drinking are described as having MetALD.",
    },
    {
      k: "p",
      text: "For many people the fat sits quietly and does little harm. In some, it inflames the liver (a stage called MASH, previously NASH), and over years this can lead to scarring (fibrosis), cirrhosis and, rarely, liver cancer. The amount of scarring, not the amount of fat, is what decides the outlook — which is why staging matters. Fatty liver is also closely linked to heart disease, which is a more common cause of serious illness in people with MASLD than the liver itself.",
    },

    { k: "h2", text: "Symptoms — and why most people have none" },
    {
      k: "p",
      text: "Most people with fatty liver feel completely well. It is usually found by chance on an ultrasound done for another reason, or on a routine blood test. When symptoms occur, they are vague:",
    },
    {
      k: "ul",
      items: [
        "Tiredness",
        "Discomfort in the upper right abdomen, under the ribs",
      ],
    },
    {
      k: "p",
      text: "Symptoms of advanced scarring — **jaundice** (yellow eyes or skin), swelling of the abdomen or legs, easy bruising, confusion, or vomiting blood — appear late. Waiting for symptoms is not a safe strategy.",
    },

    { k: "h2", text: "Who is at higher risk in India" },
    {
      k: "p",
      text: "As with diabetes, people of South Asian background tend to develop fatty liver at a lower body weight, with fat stored around the waist and in the organs. A normal-looking weight does not rule it out. Your risk is higher if you:",
    },
    {
      k: "ul",
      items: [
        "Have type 2 diabetes or prediabetes",
        "Carry extra weight around the waist",
        "Have high blood pressure, high triglycerides or low HDL ('good') cholesterol",
        "Have polycystic ovary syndrome (PCOS) or an underactive thyroid",
        "Are physically inactive and eat a diet high in refined starch, sugar, sweetened drinks and fried snacks",
        "Drink alcohol regularly, even in amounts you consider moderate",
      ],
    },
    {
      k: "p",
      text: "Recognising how common the problem has become, the Union Health Ministry in 2021 issued guidelines to fold fatty liver disease (then called NAFLD) into the national programme for non-communicable diseases, alongside diabetes and heart disease. In practice, it means fatty liver should be thought of whenever diabetes or obesity is being checked.",
    },

    { k: "h2", text: "How it is diagnosed and staged" },
    {
      k: "p",
      text: "Diagnosis has two steps: confirming there is fat in the liver, and then finding out how much scarring there is.",
    },
    {
      k: "ul",
      items: [
        "**Liver function tests** — blood tests of liver enzymes. They can be normal even when the liver is affected, so a normal result does not rule out fatty liver.",
        "**Ultrasound** — the usual way fat is first seen. Reports often grade it, but the grade describes fat, not scarring.",
        "**FIB-4** — a score calculated from your age and routine blood tests that estimates the likelihood of significant scarring.",
        "**Transient elastography** — a quick, painless scan that measures liver stiffness (scarring) and fat. It is often known by a brand name.",
        "**Liver biopsy** — a small sample of liver taken with a needle. It is now needed only when the other tests disagree or another liver disease is suspected.",
      ],
    },
    {
      k: "p",
      text: "Your doctor will also check for other causes of a fatty or inflamed liver, such as hepatitis B and C, alcohol, certain medicines and thyroid problems, and will check your blood sugar, cholesterol and blood pressure.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Fatty liver with low-risk test results is usually looked after by a [general physician](/specialties/general-practice). The directory lists liver specialists (hepatologists) under [gastroenterology](/specialties/gastroenterology). See a gastroenterologist or hepatologist if:",
    },
    {
      k: "ul",
      items: [
        "Your FIB-4 or elastography suggests more than mild scarring",
        "Your liver enzymes stay raised despite lifestyle change",
        "There are signs of cirrhosis, or another liver disease may be involved",
      ],
    },
    {
      k: "p",
      text: "A [dietitian](/specialties/dietetics) can help build a realistic eating plan, and an [endocrinologist](/specialties/endocrinology) is useful when diabetes, obesity or a hormone problem is part of the picture. You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) or [dietitians in Bengaluru](/doctors/karnataka/bengaluru/dietitians) on The Doctor Index.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Liver fat can fall, and early scarring can improve, when the underlying causes are tackled. The core of treatment is the same at every stage.",
    },
    {
      k: "ul",
      items: [
        "**Weight loss**, if you carry extra weight — gradual, steady loss through eating less refined starch and sugar, more vegetables, pulses and protein. Even a modest loss reduces liver fat; larger losses can reduce inflammation and scarring. Crash diets are not advised.",
        "**Physical activity** — regular walking, cycling or other activity most days, plus some strength exercise. It helps the liver even before the scales move.",
        "**Avoiding alcohol** — or keeping it to a minimum on your doctor's advice. If you have significant scarring, the advice is to stop completely.",
        "**Managing diabetes, blood pressure and cholesterol** — some diabetes and weight-loss medicines also reduce liver fat, which may influence which one your doctor chooses. Statins are generally safe in fatty liver and protect the heart.",
      ],
    },
    {
      k: "p",
      text: "Medicines aimed directly at the liver are a fast-moving area. A few have been approved in some countries for MASH with scarring, and some older medicines are used in selected patients. Whether any is suitable or available for you is a question for your hepatologist. Avoid 'liver detox' products and unregulated herbal remedies — some of them injure the liver — and do not stop prescribed medicines without advice.",
    },

    { k: "h2", text: "Follow-up" },
    {
      k: "p",
      text: "Repeat testing tells you whether things are improving. Your doctor will usually repeat blood tests and a scarring assessment such as FIB-4 or elastography every year or few years, depending on your risk. People with cirrhosis need regular checks for liver cancer and for swollen veins in the food pipe. Vaccination against hepatitis A and B may be advised if you are not already protected.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Vomiting blood, or black, tarry stools",
        "New confusion, extreme drowsiness or unusual behaviour in someone with liver disease",
        "Rapidly increasing yellowing of the eyes or skin",
        "A swollen, painful abdomen with fever",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "How much scarring is there, and how do we know?",
        "Is any alcohol safe for me?",
        "What weight and activity goals are realistic for me?",
        "Do any of my medicines need to change?",
        "How often should my liver be retested?",
        "Should my heart risk be checked as well?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is fatty liver serious if I feel fine?",
      a: "Often it is mild, but feeling well does not tell you how much scarring there is. A simple score such as FIB-4 or a liver stiffness scan separates people at low risk from those who need specialist follow-up. Fatty liver also signals higher heart risk.",
    },
    {
      q: "Can fatty liver be reversed?",
      a: "In many people, yes. Liver fat falls with steady weight loss, more activity and less alcohol, and early inflammation and scarring can improve too. Advanced scarring is harder to reverse, which is why acting early matters. Regular testing shows whether it is working.",
    },
    {
      q: "Is MASLD the same as NAFLD?",
      a: "Almost. MASLD is the new name for what was called NAFLD, chosen to describe the cause — metabolic problems — rather than what it is not. Nearly everyone diagnosed with NAFLD under the old definition meets the new one. Your existing reports remain valid.",
    },
    {
      q: "I don't drink and I am not overweight. Can I still have fatty liver?",
      a: "Yes. This is relatively common in South Asians, who can store fat in the liver at a normal body weight, often with raised blood sugar or triglycerides. Your doctor will also look for other causes, such as thyroid problems or certain medicines.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Steatotic Liver Disease", url: "https://medlineplus.gov/steatoticliverdisease.html" },
    { label: "Press Information Bureau, Ministry of Health and Family Welfare — Operational guidelines for integration of NAFLD with NPCDCS", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1699904" },
  ],
};
