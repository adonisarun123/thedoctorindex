import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "chronic-kidney-disease",
  title: "Chronic kidney disease (CKD): symptoms, tests, treatment and which doctor to see",
  metaTitle: "Chronic kidney disease: symptoms, tests and treatment",
  standfirst: "What chronic kidney disease is, why it is often silent, the blood and urine tests that find it, how to slow it, and when to see a nephrologist.",
  targetQuery: "chronic kidney disease symptoms and treatment",
  department: "nephrology",
  specialty: "nephrology",
  alsoSee: ["diabetology", "cardiology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Swelling of the feet", "Tiredness", "Foamy urine", "Passing urine at night", "Loss of appetite", "Itching", "Breathlessness"],
  tests: ["Serum creatinine", "eGFR", "Urine albumin-to-creatinine ratio", "Urine routine", "Kidney ultrasound"],
  treatments: ["Blood pressure control", "ACE inhibitors", "SGLT2 inhibitors", "Dialysis", "Kidney transplant"],
  body: [
    { k: "h2", text: "What chronic kidney disease is" },
    {
      k: "p",
      text: "The kidneys filter waste and extra water from the blood to make urine, and they help control blood pressure, salt balance, red blood cell production and bone health. In chronic kidney disease (CKD), the kidneys are damaged and their filtering slowly falls over months or years.",
    },
    {
      k: "p",
      text: "Doctors describe CKD in stages, based on how well the kidneys filter and how much protein leaks into the urine. Most people never reach kidney failure; many stay at an early stage for years, especially with good treatment. But CKD also raises the risk of heart attack and stroke at every stage, which is why it deserves attention even when it causes no symptoms.",
    },

    { k: "h2", text: "Symptoms — often none until late" },
    {
      k: "p",
      text: "The kidneys have a large reserve, so early CKD usually causes no symptoms at all. It is found through blood and urine tests. As it advances, people may notice:",
    },
    {
      k: "ul",
      items: [
        "Swelling of the feet, ankles or around the eyes",
        "Tiredness and weakness, often from anaemia",
        "Foamy urine, a sign of protein leaking",
        "Passing urine at night more often",
        "Loss of appetite, nausea or a metallic taste",
        "Itching and dry skin",
        "Breathlessness, muscle cramps or difficulty sleeping",
      ],
    },
    {
      k: "p",
      text: "By the time these appear, kidney function is often substantially reduced. That is why people at risk should be tested regularly rather than waiting for symptoms.",
    },

    { k: "h2", text: "Causes and who is at higher risk in India" },
    { k: "p", text: "Diabetes and high blood pressure are the commonest causes. Others include:" },
    {
      k: "ul",
      items: [
        "Glomerulonephritis — inflammation of the kidney's filters",
        "Kidney stones or an enlarged prostate blocking urine flow for long periods",
        "Repeated kidney infections",
        "Inherited conditions such as polycystic kidney disease",
        "Long-term use of painkillers from the NSAID family, and some unregulated herbal or traditional preparations that may contain heavy metals",
        "In some farming regions, kidney disease of uncertain cause is seen in people without diabetes or high blood pressure",
      ],
    },
    {
      k: "p",
      text: "Your risk is higher if you have diabetes, high blood pressure, heart disease, a family history of kidney disease, obesity, or were born with a low birth weight. If any of these apply, ask for a yearly kidney check.",
    },

    { k: "h2", text: "How it is diagnosed" },
    { k: "p", text: "Two simple tests find most CKD:" },
    {
      k: "ul",
      items: [
        "**Serum creatinine** — a blood test used to calculate the **eGFR** (estimated glomerular filtration rate), which shows how well the kidneys filter.",
        "**Urine albumin-to-creatinine ratio** — a spot urine test for protein leaking through damaged filters, often the earliest sign in diabetes.",
      ],
    },
    {
      k: "p",
      text: "CKD is diagnosed when these remain abnormal for at least three months, because a single abnormal result can be caused by dehydration, an infection or a medicine. Other tests include a **urine routine** for blood and protein, a **kidney ultrasound** to look at size, structure, stones or blockage, blood count, salts, calcium, phosphate and sometimes a kidney biopsy to find the exact cause.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Your [general physician](/specialties/general-practice) or [diabetologist](/specialties/diabetology) can test for and manage early CKD. A [nephrologist](/specialties/nephrology) should be involved when kidney function is moderately or severely reduced or falling quickly, when there is a lot of protein or blood in the urine, when blood pressure is hard to control, or when the cause is unclear. A [cardiologist](/specialties/cardiology) helps manage the higher heart risk.",
    },
    {
      k: "p",
      text: "You can [find nephrologists in Bengaluru](/doctors/karnataka/bengaluru/nephrologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment cannot undo established damage, but it can slow CKD considerably, protect the heart and treat complications.",
    },
    { k: "h3", text: "Slowing the disease" },
    {
      k: "ul",
      items: [
        "**Blood pressure control** to a target your doctor sets — the single most important step",
        "**ACE inhibitors** or angiotensin receptor blockers, which also reduce protein leakage",
        "**SGLT2 inhibitors**, which slow kidney decline in many people with or without diabetes",
        "Good sugar control if you have diabetes",
        "Statins to lower heart risk",
        "Less salt, no tobacco, and staying active",
      ],
    },
    {
      k: "p",
      text: "Avoid NSAID painkillers such as ibuprofen and diclofenac, and check with your doctor before taking any new medicine, supplement or herbal product. Many medicines need lower doses in CKD. Do not stop prescribed medicines on your own.",
    },
    { k: "h3", text: "Treating complications" },
    {
      k: "p",
      text: "As CKD advances, your team may treat anaemia, high potassium, bone and mineral problems and fluid build-up. A dietitian can advise on protein, potassium and phosphate — the right advice depends on your stage and blood tests, so avoid generic 'kidney diets'.",
    },
    { k: "h3", text: "Kidney failure" },
    {
      k: "p",
      text: "If the kidneys fail, **dialysis** or a **kidney transplant** is needed. Haemodialysis filters the blood through a machine, usually several times a week at a centre; peritoneal dialysis uses the lining of the abdomen and can be done at home. Under the Pradhan Mantri National Dialysis Programme, dialysis is provided at district hospitals, with the cost covered for poor patients. A transplant, from a living related or deceased donor, offers the best long-term outcome for suitable people. Planning ahead gives time to choose.",
    },

    { k: "h2", text: "Living with it: follow-up" },
    {
      k: "ul",
      items: [
        "Blood and urine tests at intervals your doctor sets, more often in later stages",
        "Blood pressure checks at every visit, and at home if advised",
        "Vaccines your doctor recommends, including hepatitis B if dialysis may be needed",
        "Protecting the veins in one arm if a dialysis fistula may be needed later",
        "Telling every doctor, dentist and pharmacist that you have CKD",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Severe breathlessness, or being unable to lie flat",
        "Chest pain, palpitations or severe muscle weakness, which can be caused by high potassium",
        "Confusion, drowsiness or fits",
        "Passing very little or no urine",
        "Fever with chills if you have a dialysis catheter",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What stage is my CKD, and what is causing it?",
        "Is it stable or getting worse?",
        "What blood pressure should I aim for?",
        "Which medicines should I avoid or have adjusted?",
        "What should I eat, and should I see a dietitian?",
        "When should we start planning for dialysis or a transplant?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can chronic kidney disease be reversed?",
      a: "Established damage usually cannot be reversed, but its progress can often be slowed substantially with blood pressure and sugar control, the right medicines and avoiding harmful painkillers. Many people with early CKD never need dialysis.",
    },
    {
      q: "Does high creatinine always mean kidney disease?",
      a: "Not always. Creatinine can rise temporarily with dehydration, infection, some medicines or a high-protein meal, and varies with muscle mass. CKD is diagnosed only when abnormal results persist for months, alongside urine tests and the eGFR.",
    },
    {
      q: "Should I drink more water to protect my kidneys?",
      a: "Drinking enough to avoid dehydration is sensible, especially in hot weather. Drinking large amounts does not treat CKD, and in later stages or with heart failure your doctor may limit fluids. Follow the advice you are given for your stage.",
    },
    {
      q: "Are herbal remedies safe for kidney disease?",
      a: "Some are not. Certain herbal and traditional preparations contain heavy metals or substances that damage the kidneys, and others interact with medicines. Always discuss any remedy with your nephrologist before taking it.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Chronic Kidney Disease", url: "https://medlineplus.gov/chronickidneydisease.html" },
    { label: "NIDDK, US National Institutes of Health — Chronic Kidney Disease (CKD)", url: "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd" },
    { label: "National Health Portal, MoHFW — Pradhan Mantri National Dialysis Programme", url: "https://www.nhp.gov.in/pradhan-mantri-national-dialysis-programme_pg" },
  ],
};
