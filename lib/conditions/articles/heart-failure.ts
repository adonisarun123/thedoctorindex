import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "heart-failure",
  title: "Heart failure: symptoms, tests, treatment and which doctor to see",
  metaTitle: "Heart failure: symptoms, tests and treatment",
  standfirst: "What heart failure means, the symptoms to watch for, the tests that confirm it, how modern treatment helps, and when to seek urgent care.",
  targetQuery: "heart failure symptoms and treatment",
  department: "cardiology",
  specialty: "cardiology",
  alsoSee: ["nephrology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Breathlessness", "Swelling of the ankles and legs", "Tiredness", "Waking up breathless at night", "Cough", "Sudden weight gain"],
  tests: ["Echocardiogram", "NT-proBNP", "ECG", "Chest X-ray", "Kidney function tests"],
  treatments: ["Diuretics", "ACE inhibitors", "ARNI", "Beta blockers", "SGLT2 inhibitors", "Mineralocorticoid receptor antagonists", "Implantable devices"],
  body: [
    { k: "h2", text: "What heart failure is" },
    {
      k: "p",
      text: "Heart failure does not mean the heart has stopped. It means the heart cannot pump blood around the body as well as it should, either because the muscle has become weak or because it has become stiff and does not fill properly. Fluid then backs up into the lungs, legs and abdomen, and the body's organs get less blood than they need.",
    },
    {
      k: "p",
      text: "Doctors describe heart failure partly by the ejection fraction, a measure on the echocardiogram of how much blood the main pumping chamber pushes out with each beat. Heart failure with reduced ejection fraction (a weak pump) and heart failure with preserved ejection fraction (a stiff pump) are treated somewhat differently.",
    },
    {
      k: "p",
      text: "Heart failure is a long-term condition, but treatment has improved greatly. The right combination of medicines can relieve symptoms, keep people out of hospital and help them live longer, and in some people the heart's pumping recovers substantially.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Breathlessness on exertion, and later at rest",
        "Swelling of the ankles and legs (oedema), and sometimes of the abdomen",
        "Tiredness and weakness, even with light activity",
        "Needing extra pillows to breathe at night, or waking up breathless at night and having to sit up",
        "A persistent cough or wheeze, sometimes with frothy sputum",
        "Sudden weight gain over a few days from fluid build-up",
        "Loss of appetite, feeling full quickly, or palpitations",
      ],
    },
    {
      k: "p",
      text: "Older people sometimes put breathlessness and swollen ankles down to age. Both are worth a check, especially if they are new or getting worse.",
    },

    { k: "h2", text: "Causes and who is at higher risk in India" },
    { k: "p", text: "Heart failure is the end result of other conditions that damage or overload the heart:" },
    {
      k: "ul",
      items: [
        "Coronary artery disease and previous heart attacks — the most common cause",
        "Long-standing high blood pressure",
        "Diabetes, which affects the heart muscle and arteries",
        "Heart valve disease, including valves damaged by rheumatic fever in childhood, which still affects many younger adults in India",
        "Diseases of the heart muscle (cardiomyopathy), some inherited, some from alcohol, viral infection or pregnancy",
        "A persistently fast or irregular rhythm such as atrial fibrillation",
        "Severe anaemia, thyroid disease or chronic kidney disease",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Your doctor will examine you for fluid in the lungs and legs and ask about your symptoms. The key tests are:",
    },
    {
      k: "ul",
      items: [
        "**Echocardiogram** — an ultrasound of the heart that shows the pumping strength, the ejection fraction and the valves. It is the central test.",
        "**NT-proBNP** (or BNP) — a blood test for a hormone released by a strained heart. A normal result makes heart failure unlikely.",
        "**ECG** — shows rhythm problems and signs of past heart attacks.",
        "**Chest X-ray** — shows fluid in the lungs and the size of the heart.",
        "**Kidney function tests**, salts, blood count, sugar and thyroid tests.",
      ],
    },
    {
      k: "p",
      text: "Further tests, such as coronary angiography or a cardiac MRI, look for the underlying cause, because treating the cause can improve the heart.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [cardiologist](/specialties/cardiology) diagnoses heart failure, finds its cause and sets up treatment, and many hospitals have heart failure clinics. A [general physician](/specialties/general-practice) often shares follow-up. A [nephrologist](/specialties/nephrology) is involved when the kidneys are also affected, which is common and affects which medicines can be used.",
    },
    {
      k: "p",
      text: "You can [find cardiologists in Bengaluru](/doctors/karnataka/bengaluru/cardiologists) or [nephrologists in Bengaluru](/doctors/karnataka/bengaluru/nephrologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "For heart failure with a weak pump, several families of medicine each lower the risk of hospital admission and death, and they are usually combined:",
    },
    {
      k: "ul",
      items: [
        "**ACE inhibitors**, angiotensin receptor blockers or an **ARNI** (angiotensin receptor–neprilysin inhibitor)",
        "**Beta blockers** suited to heart failure",
        "**Mineralocorticoid receptor antagonists**",
        "**SGLT2 inhibitors**, originally diabetes medicines, now used in people with or without diabetes",
      ],
    },
    {
      k: "p",
      text: "**Diuretics** ('water tablets') remove excess fluid and ease breathlessness and swelling. Doses are started low and raised gradually, with blood tests for kidney function and potassium. Treatment for a stiff pump focuses on diuretics, SGLT2 inhibitors and controlling blood pressure, rhythm and other conditions. Your cardiologist will decide which combination suits you.",
    },
    {
      k: "p",
      text: "Do not stop or change these medicines on your own, even if you feel better. Avoid painkillers from the NSAID family (such as ibuprofen or diclofenac) unless your doctor approves them, as they can cause fluid retention and harm the kidneys.",
    },
    { k: "h3", text: "Devices and procedures" },
    {
      k: "p",
      text: "Some people benefit from **implantable devices**: a defibrillator (ICD) to correct dangerous rhythms, or a special pacemaker (CRT) that coordinates the heart's chambers. Valve repair or replacement, angioplasty or bypass surgery may treat the cause. In advanced heart failure, a heart pump or transplant may be discussed at a specialist centre.",
    },

    { k: "h2", text: "Living with it: daily habits and follow-up" },
    {
      k: "ul",
      items: [
        "Weigh yourself every morning after passing urine, and report a sudden gain over a few days",
        "Cut down on salt, including pickles, papad and packaged foods",
        "Follow any fluid limit your doctor sets — do not restrict or increase fluids on your own",
        "Stay active within your limits; ask about cardiac rehabilitation",
        "Stop tobacco and avoid alcohol",
        "Get yearly influenza and other vaccines your doctor recommends",
        "Keep regular reviews and blood tests, especially when doses change",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Severe breathlessness, or being unable to lie down or speak in full sentences",
        "Coughing up pink, frothy sputum",
        "Chest pain, fainting, or a very fast or irregular heartbeat",
        "Confusion, or bluish lips",
      ],
    },
    {
      k: "p",
      text: "Contact your doctor the same day for rapid weight gain, increasing swelling, worsening breathlessness or passing much less urine than usual.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What type of heart failure do I have, and what is my ejection fraction?",
        "What caused it, and can the cause be treated?",
        "Am I on all the medicines that could help me?",
        "How much salt and fluid should I have?",
        "What weight gain should make me call you?",
        "Would a device help me?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is heart failure the same as a heart attack?",
      a: "No. A heart attack is a sudden blockage of a coronary artery. Heart failure is a longer-term problem with the heart's pumping, which can be caused by a heart attack but also by high blood pressure, valve disease and other conditions.",
    },
    {
      q: "Can heart failure get better?",
      a: "It can be controlled, and sometimes the heart improves substantially, especially when the cause is treated and the right medicines are taken consistently. Even when it does not improve, treatment usually relieves symptoms and reduces hospital stays.",
    },
    {
      q: "Should I drink less water if I have heart failure?",
      a: "Only if your doctor advises it. Some people with heart failure need a fluid limit, while others do not, and too little fluid can harm the kidneys. Follow the specific advice your cardiologist gives you, and check it again if your medicines change.",
    },
    {
      q: "Why do I need to weigh myself every day?",
      a: "A rise in weight over a few days is often the first sign that fluid is building up, before you feel breathless. Catching it early lets your doctor adjust your diuretic and may prevent a hospital admission.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Heart Failure", url: "https://medlineplus.gov/heartfailure.html" },
    { label: "American Heart Association — Heart Failure", url: "https://www.heart.org/en/health-topics/heart-failure" },
    { label: "World Health Organization — Cardiovascular diseases fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)" },
  ],
};
