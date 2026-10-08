import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "kidney-failure",
  title: "Kidney failure: symptoms, dialysis, transplant and doctors",
  standfirst: "What kidney failure is, acute versus end-stage kidney disease, the warning signs, the tests used, and how dialysis and a kidney transplant work.",
  targetQuery: "kidney failure symptoms and treatment",
  department: "nephrology",
  specialty: "nephrology",
  alsoSee: ["urology", "transplant-surgery", "diabetology"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Swelling of the feet and face", "Passing less urine", "Breathlessness", "Nausea", "Itching", "Tiredness"],
  tests: ["Serum creatinine", "eGFR", "Urine test", "Kidney ultrasound"],
  treatments: ["Haemodialysis", "Peritoneal dialysis", "Kidney transplant", "Conservative care"],
  body: [
    { k: "h2", text: "What kidney failure is" },
    {
      k: "p",
      text: "The kidneys filter waste and extra water from the blood to make urine. They also balance salts such as potassium and sodium, help control blood pressure, keep bones healthy, and help the body make red blood cells. Kidney failure, also called renal failure, means the kidneys can no longer do enough of this work to keep you well. Waste products and fluid build up in the body.",
    },
    {
      k: "p",
      text: "There are two broad kinds. Acute kidney injury comes on over hours or days, often during a serious illness, and the kidneys may recover if the cause is treated quickly. End-stage kidney disease (ESRD, or kidney failure in the long-term sense) is the final stage of [chronic kidney disease](/conditions/chronic-kidney-disease), after months or years of gradual loss of function. At that stage the damage is permanent, and dialysis or a kidney transplant is needed to stay alive.",
    },

    { k: "h2", text: "Causes and risk factors" },
    { k: "h3", text: "Long-term kidney failure" },
    {
      k: "ul",
      items: [
        "Diabetes, which damages the kidney's filters over many years; see [diabetic kidney problems](/conditions/diabetic-kidney-problems)",
        "[High blood pressure](/conditions/high-blood-pressure), which is both a cause and a result of kidney disease",
        "Glomerulonephritis — inflammation of the kidney filters, from immune conditions or infections",
        "Polycystic kidney disease and other inherited conditions",
        "Long-standing blockage of urine flow, such as from [kidney stones](/conditions/kidney-stones) or an enlarged prostate",
        "Long-term regular use of some painkillers, and some unregulated herbal or traditional preparations that may contain substances harmful to the kidneys",
      ],
    },
    { k: "h3", text: "Acute kidney injury" },
    {
      k: "p",
      text: "Common triggers include severe dehydration from vomiting and diarrhoea, serious infections and [sepsis](/conditions/sepsis), major surgery, heavy blood loss, some medicines and contrast dyes, snake bite, and severe infections seen in India such as [malaria](/conditions/malaria), leptospirosis and [dengue](/conditions/dengue). People who already have chronic kidney disease, diabetes or heart failure, and older adults, are at higher risk.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Chronic kidney disease often causes no symptoms until it is advanced, which is why people with diabetes and high blood pressure need regular kidney tests. As kidney failure develops, symptoms may include:",
    },
    {
      k: "ul",
      items: [
        "Swelling of the feet and face, ankles or around the eyes",
        "Passing less urine, or in some people more urine at night",
        "Breathlessness from fluid building up in the lungs",
        "Nausea, vomiting and loss of appetite, sometimes with a metallic taste",
        "Itching all over the body",
        "Tiredness, weakness and pale skin from anaemia",
        "Muscle cramps, poor sleep and difficulty concentrating",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "ul",
      items: [
        "**Serum creatinine** — a blood test for a waste product that builds up when the kidneys are not filtering well.",
        "**eGFR** — an estimate of how well the kidneys filter, calculated from creatinine, age and sex. It is used to stage chronic kidney disease; the lowest stage is kidney failure.",
        "**Urine test** — looks for protein (albumin), blood and infection. Protein in the urine is an early sign of damage.",
        "**Kidney ultrasound** — shows the size and shape of the kidneys and any blockage, stones or cysts. Small, shrunken kidneys suggest long-standing disease.",
        "Blood tests for potassium, sodium, haemoglobin, calcium, phosphate and acid balance, which guide urgent treatment.",
        "Sometimes a kidney biopsy, where a small sample of kidney tissue is taken with a needle, to find the exact cause.",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "For acute kidney injury, the focus is on treating the cause — fluids for dehydration, treating infection, stopping harmful medicines, relieving a blockage — and supporting the body while the kidneys recover. Some people need dialysis for a period.",
    },
    {
      k: "p",
      text: "For end-stage kidney disease, the nephrologist will discuss the options well before they are needed, so that you can choose and prepare. The main options are:",
    },
    { k: "h3", text: "Haemodialysis" },
    {
      k: "p",
      text: "In **haemodialysis**, blood is pumped through a machine that filters it and returns it to the body. It is usually done at a dialysis centre a few times a week, each session taking several hours. A fistula — a joined artery and vein in the arm made by a small operation — is the preferred access, and it needs some weeks to mature, so it is made in advance. Under the Pradhan Mantri National Dialysis Programme, dialysis services are available at many government district hospitals; ask locally about eligibility.",
    },
    { k: "h3", text: "Peritoneal dialysis" },
    {
      k: "p",
      text: "In **peritoneal dialysis**, a soft tube is placed in the tummy, and special fluid is run in and out several times a day, using the lining of the abdomen as a filter. It is done at home after training, which suits some people who live far from a dialysis centre or want more flexibility. Careful hygiene is needed to avoid infection.",
    },
    { k: "h3", text: "Kidney transplant" },
    {
      k: "p",
      text: "A **kidney transplant** from a living donor, usually a close relative, or from a deceased donor offers most suitable patients better quality of life than dialysis. It needs a major operation and lifelong medicines to stop the body rejecting the kidney. Organ donation and transplantation in India are regulated by law, and buying or selling organs is illegal.",
    },
    { k: "h3", text: "Conservative care" },
    {
      k: "p",
      text: "Some people, particularly older adults with other serious illnesses, choose **conservative care** without dialysis. This focuses on controlling symptoms, managing fluid and diet, and quality of life, with support from the kidney and palliative care teams.",
    },
    { k: "h3", text: "Day-to-day care" },
    {
      k: "p",
      text: "Whatever the treatment, people with kidney failure usually need to limit salt, fluid, potassium (found in foods such as coconut water, bananas and some fruits) and phosphorus, guided by a renal dietitian. Medicines treat blood pressure, anaemia, bone problems and acid levels. Avoid over-the-counter painkillers and unprescribed herbal remedies unless your nephrologist approves them.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if a person with kidney disease, or someone who is seriously ill, has:" },
    {
      k: "ul",
      items: [
        "Severe breathlessness, especially when lying flat",
        "Very little or no urine for many hours",
        "Chest pain, palpitations or an irregular heartbeat, which can be a sign of dangerously high potassium",
        "Confusion, extreme drowsiness, or a seizure",
        "Severe swelling with rapid weight gain over a few days",
        "For people on dialysis: a missed session with any of these symptoms, bleeding from the fistula that will not stop, or fever with cloudy peritoneal fluid",
      ],
    },

    { k: "h2", text: "Protecting your kidneys" },
    {
      k: "ul",
      items: [
        "If you have diabetes or high blood pressure, get a creatinine test and a urine albumin test at least once a year",
        "Keep blood sugar and blood pressure at the targets your doctor sets",
        "Avoid regular use of painkillers without medical advice",
        "Drink enough fluid in hot weather and during diarrhoea, and use ORS when you are losing fluids",
        "Do not take unlabelled herbal or bhasma preparations",
        "Stop smoking",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [nephrologist](/specialties/nephrology) is the specialist for kidney failure, dialysis and transplant planning. A [urologist](/specialties/urology) treats blockages such as stones or an enlarged prostate. Transplant surgery is done by a [transplant surgeon](/specialties/transplant-surgery). Your [diabetologist](/specialties/diabetology) or physician plays a key role in slowing kidney damage.",
    },
    {
      k: "p",
      text: "You can [find nephrologists in Bengaluru](/doctors/karnataka/bengaluru/nephrologists), [urologists in Bengaluru](/doctors/karnataka/bengaluru/urologists) or [transplant specialists in Bengaluru](/doctors/karnataka/bengaluru/transplant-specialists) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Can kidneys recover after kidney failure?",
      a: "It depends on the type. Acute kidney injury often improves, partly or fully, once the cause is treated, even if dialysis was needed for a while. End-stage kidney disease after years of chronic damage does not recover, and dialysis or a transplant is needed.",
    },
    {
      q: "Is dialysis lifelong?",
      a: "For end-stage kidney disease, dialysis continues unless the person receives a kidney transplant. For acute kidney injury, dialysis may be temporary. Your nephrologist will explain which applies to you and how it will be reviewed.",
    },
    {
      q: "Who can donate a kidney to me?",
      a: "Living donors are usually close relatives, such as a parent, sibling, child or spouse, who are healthy and a suitable match. Kidneys can also come from deceased donors through state organ-sharing programmes. Donation is regulated by law and must be voluntary.",
    },
    {
      q: "What should I eat if I have kidney failure?",
      a: "There is no single diet for everyone; it depends on your blood tests and treatment. Most people need to limit salt and fluids and watch potassium and phosphorus. A renal dietitian can adapt your usual Indian meals so that they are safe.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Kidney Failure", url: "https://medlineplus.gov/kidneyfailure.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
