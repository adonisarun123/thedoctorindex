import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "diabetic-kidney-problems",
  title: "Diabetic kidney disease: symptoms, tests, treatment and which doctor to see",
  metaTitle: "Diabetic kidney disease: tests, treatment, which doctor",
  standfirst: "How diabetes damages the kidneys, why it is silent for years, the yearly urine and blood tests that catch it early, and how to slow it down.",
  targetQuery: "diabetic kidney disease symptoms and treatment",
  department: "diabetology",
  specialty: "diabetology",
  alsoSee: ["nephrology", "endocrinology", "general-practice"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Swelling of the feet", "Foamy urine", "Tiredness", "Breathlessness", "Nausea"],
  tests: ["Urine albumin", "eGFR", "Serum creatinine", "Blood pressure"],
  treatments: ["Blood sugar control", "Blood pressure control", "ACE inhibitors", "SGLT2 inhibitors", "Dialysis", "Kidney transplant"],
  body: [
    { k: "h2", text: "What diabetic kidney disease is" },
    {
      k: "p",
      text: "Each kidney contains a huge number of tiny filters that clean the blood, removing waste and extra water as urine while keeping protein and blood cells in. Over years, high blood sugar — and the high blood pressure that often comes with diabetes — damages these filters. They start to leak protein into the urine, and gradually lose their ability to clean the blood. This is diabetic kidney disease, also called diabetic nephropathy.",
    },
    {
      k: "p",
      text: "It develops slowly and causes no symptoms for a long time. By the time someone feels unwell, a lot of kidney function may already be lost. That is why people with diabetes are advised to have simple kidney tests at least once a year, even when they feel completely well. Caught early, the damage can often be slowed considerably, and in some people early changes can be reversed.",
    },
    {
      k: "p",
      text: "Diabetic kidney disease is one of the leading causes of [chronic kidney disease](/conditions/chronic-kidney-disease) and of kidney failure needing dialysis in India. It can occur in both [type 1](/conditions/diabetes-type-1) and [type 2 diabetes](/conditions/diabetes-type-2). People with kidney damage from diabetes also have a much higher risk of heart attack and stroke, so protecting the kidneys protects the heart too.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "In the early stages there are usually no symptoms at all. Symptoms tend to appear only when kidney function is quite reduced:",
    },
    {
      k: "ul",
      items: [
        "Swelling of the feet, ankles or around the eyes, especially in the morning",
        "Foamy urine, which can be a sign of protein leaking into it",
        "Tiredness and weakness, sometimes due to anaemia caused by kidney disease",
        "Breathlessness, from fluid building up in the body",
        "Nausea, loss of appetite, a metallic taste or vomiting",
        "Itchy skin and muscle cramps",
        "Needing less diabetes medicine than before, or more frequent low sugars, because the kidneys clear some medicines more slowly",
      ],
    },
    {
      k: "p",
      text: "None of these is specific to kidney disease, and waiting for symptoms means missing the best time to act. Rely on the tests below rather than on how you feel.",
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "Not everyone with diabetes develops kidney damage. The risk is higher if you:",
    },
    {
      k: "ul",
      items: [
        "Have had diabetes for many years, or had high sugars for long periods before diagnosis",
        "Have blood sugar that is often above your target",
        "Have [high blood pressure](/conditions/high-blood-pressure)",
        "Smoke or chew tobacco",
        "Are overweight, or have high cholesterol",
        "Have a family history of kidney disease",
        "Already have diabetes damage to the eyes or nerves",
        "Take painkillers such as anti-inflammatory tablets regularly, which can strain the kidneys",
      ],
    },
    {
      k: "p",
      text: "Type 2 diabetes in India often starts at a younger age and may go undiagnosed for years, so some people already have kidney changes when their diabetes is first found. Kidney tests should be done at diagnosis of type 2 diabetes, not years later.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Two simple tests, usually done together at least once a year, pick up kidney damage early:",
    },
    {
      k: "ul",
      items: [
        "**Urine albumin** — a urine sample is checked for albumin, a protein that should not leak through healthy filters. The result is often reported as a urine albumin-to-creatinine ratio (UACR). A raised level is the earliest sign of damage and is usually confirmed on repeat testing, because exercise, fever or a urine infection can raise it temporarily.",
        "**eGFR** — calculated from a **serum creatinine** blood test, your age and sex, it estimates how well the kidneys are filtering. It is used to stage kidney disease and to adjust medicine doses.",
      ],
    },
    {
      k: "p",
      text: "Your doctor will also check your **blood pressure** at every visit, and may arrange an ultrasound of the kidneys, blood tests for haemoglobin, potassium and other minerals, and an eye check. If the picture is unusual — for example blood in the urine, very rapid decline, or kidney disease without eye changes — they may look for another cause and refer you to a nephrologist.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment aims to slow or stop the damage, protect the heart, and deal with complications. Several approaches are usually combined, and your doctor will tailor targets to your age and other health problems.",
    },
    { k: "h3", text: "Blood sugar and blood pressure control" },
    {
      k: "p",
      text: "Good **blood sugar control** reduces the chance of kidney damage starting and slows it once it has begun. Your doctor will set an HbA1c target with you. **Blood pressure control** is just as important; most people with diabetic kidney disease need medicines to keep their pressure in the target range, along with less salt in their food.",
    },
    { k: "h3", text: "Kidney-protecting medicines" },
    {
      k: "p",
      text: "Some medicines protect the kidneys beyond simply lowering sugar or pressure. **ACE inhibitors** or the closely related angiotensin receptor blockers (ARBs) reduce protein leakage and slow decline. **SGLT2 inhibitors**, a group of diabetes medicines, have been shown to protect the kidneys and heart in many people with type 2 diabetes and kidney disease. Your doctor may also suggest a cholesterol-lowering statin and, in some cases, newer kidney-protecting medicines. These medicines need regular blood tests to check kidney function and potassium, especially when they are started.",
    },
    {
      k: "p",
      text: "As kidney function falls, some diabetes medicines need to be reduced, changed or stopped. Never adjust them yourself, but do remind every doctor you see that you have kidney disease, including before any scan with contrast dye.",
    },
    { k: "h3", text: "Advanced kidney disease" },
    {
      k: "p",
      text: "If the kidneys fail, they can no longer keep a person well on their own. The options then are **dialysis**, which filters the blood using a machine (haemodialysis) or the lining of the abdomen (peritoneal dialysis), or a **kidney transplant**. Some people, especially older people with other serious illnesses, choose supportive care without dialysis. A nephrologist will discuss these choices well before they are needed. See [kidney failure](/conditions/kidney-failure) for more.",
    },

    { k: "h2", text: "Living with diabetic kidney disease" },
    {
      k: "ul",
      items: [
        "Keep every yearly urine and blood test, and ask to see your results and what they mean",
        "Cut down on added salt, pickles, papads and packaged snacks",
        "Ask a dietitian how much protein suits your stage of kidney disease — very high-protein diets are not advised, but cutting too much can cause weakness",
        "If you are told your potassium is high, ask which fruits, vegetables and coconut water to limit",
        "Avoid regular use of anti-inflammatory painkillers and unlabelled herbal products",
        "Stop smoking and tobacco chewing",
        "Stay active and keep a healthy weight",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if you have diabetes and kidney disease and:" },
    {
      k: "ul",
      items: [
        "You are suddenly very breathless, especially when lying flat",
        "You pass very little or no urine for a day",
        "You have chest pain, palpitations or severe muscle weakness, which can be signs of a dangerous potassium level",
        "You become confused, very drowsy or have a fit",
        "Blood sugar is very low and not responding to sugar, or very high with vomiting and drowsiness",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Your regular [diabetologist](/specialties/diabetology), [endocrinologist](/specialties/endocrinology) or [general physician](/specialties/general-practice) should check your kidneys every year and start kidney-protecting treatment. A [nephrologist](/specialties/nephrology) should be involved when eGFR is falling quickly or is significantly reduced, when protein leakage is heavy or rising despite treatment, when potassium or blood pressure is hard to control, or when the cause of the kidney disease is uncertain.",
    },
    {
      k: "p",
      text: "You can [find diabetologists in Bengaluru](/doctors/karnataka/bengaluru/diabetologists), [nephrologists in Bengaluru](/doctors/karnataka/bengaluru/nephrologists) or [dietitians in Bengaluru](/doctors/karnataka/bengaluru/dietitians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What are my latest urine albumin and eGFR results, and how have they changed?",
        "What stage of kidney disease do I have?",
        "Am I on medicines that protect my kidneys?",
        "Do any of my diabetes medicines need to change because of my kidneys?",
        "What should I eat, and should I see a dietitian?",
        "When should I see a nephrologist?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can diabetic kidney damage be reversed?",
      a: "Early protein leakage can sometimes improve with good sugar and blood pressure control and kidney-protecting medicines. Once a lot of filtering function is lost it usually cannot be restored, but further decline can often be slowed considerably.",
    },
    {
      q: "Does every person with diabetes get kidney disease?",
      a: "No. Many people with diabetes never develop significant kidney damage. Keeping blood sugar and blood pressure near target, not smoking and having yearly kidney tests greatly improve the chances of protecting your kidneys.",
    },
    {
      q: "Is foamy urine always a sign of kidney damage?",
      a: "No. Urine can look foamy after passing it quickly or when it is concentrated. Persistent foamy urine can be a sign of protein leakage, though, so mention it to your doctor and ask for a urine albumin test.",
    },
    {
      q: "Should I reduce protein in my diet if I have diabetic kidney disease?",
      a: "Very high-protein diets are not advised, but cutting protein too much can cause weakness and muscle loss. The right amount depends on your stage of kidney disease, so ask your doctor or a dietitian before changing your diet.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Diabetic Kidney Problems", url: "https://medlineplus.gov/diabetickidneyproblems.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
