import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "gout",
  title: "Gout: symptoms, uric acid, treatment and which doctor to see",
  metaTitle: "Gout: symptoms, treatment and which doctor to see",
  standfirst: "What gout is, why uric acid matters, how an attack is treated, how long-term medicine prevents flares and joint damage, and when to see a rheumatologist.",
  targetQuery: "gout symptoms and treatment",
  department: "rheumatology",
  specialty: "rheumatology",
  alsoSee: ["general-practice"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Sudden severe joint pain", "Swelling", "Redness", "Warmth over the joint", "Tophi"],
  tests: ["Joint fluid test", "Uric acid blood test", "Ultrasound", "X-ray"],
  treatments: ["Anti-inflammatory medicines", "Colchicine", "Steroids", "Urate-lowering medicines", "Allopurinol"],
  body: [
    { k: "h2", text: "What gout is" },
    {
      k: "p",
      text: "Gout is a type of inflammatory arthritis caused by crystals of uric acid forming in and around the joints. Uric acid is a normal waste product made when the body breaks down substances called purines, found in our own cells and in some foods. It is usually removed by the kidneys. When the level in the blood stays high for a long time, needle-shaped crystals can build up in joints.",
    },
    {
      k: "p",
      text: "The immune system reacts to these crystals with sudden, intense inflammation — a gout attack or flare. Between attacks the joint may feel normal, but the crystals remain. Without treatment, flares tend to become more frequent and can eventually damage joints and kidneys.",
    },
    {
      k: "p",
      text: "Gout is one of the most treatable forms of arthritis. Long-term medicine that lowers uric acid can dissolve the crystals and stop attacks.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Sudden severe joint pain, often starting at night or early morning",
        "Swelling of the affected joint",
        "Redness and shiny skin over the joint",
        "Warmth over the joint, and tenderness so severe that even a bedsheet hurts",
        "The big toe is the classic site, but the ankle, knee, foot, wrist, fingers and elbow can be affected",
        "Tophi — firm lumps of crystals under the skin, on the ears, fingers, elbows or toes, after years of high uric acid",
      ],
    },
    {
      k: "p",
      text: "An attack usually builds over hours, peaks within a day and settles over one to two weeks. Mild fever is possible. A hot, swollen joint can also be caused by infection, so a first episode should be checked by a doctor.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "Gout is more common in men, and in women after menopause. A high uric acid level is necessary for gout, but many people with high uric acid never get it. Risk is higher with:",
    },
    {
      k: "ul",
      items: [
        "Excess weight, high blood pressure, diabetes and high cholesterol",
        "Kidney disease, which reduces uric acid removal",
        "Alcohol, especially beer and spirits",
        "Sugary drinks and packaged fruit juices sweetened with fructose",
        "Large amounts of red meat, organ meats such as liver, and some seafood",
        "Some medicines, including water tablets (diuretics) and low-dose aspirin",
        "A family history of gout",
      ],
    },
    {
      k: "p",
      text: "Attacks can be triggered by a heavy meal or a drinking binge, dehydration, illness, surgery, or by starting or changing a uric acid-lowering medicine.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The most reliable test is a **joint fluid test**: a small sample of fluid is drawn from the swollen joint with a needle and examined under a microscope for uric acid crystals. This also rules out infection.",
    },
    {
      k: "p",
      text: "A **uric acid blood test** is useful, but the level can be normal during an attack, and a high level alone does not prove gout. Blood tests for kidney function, sugar and cholesterol are also done. **Ultrasound** can show crystal deposits in joints, and an **X-ray** can show joint damage in long-standing gout. A specialised CT scan that detects crystals is used in some centres.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can diagnose and treat most gout, including starting long-term medicine. A [rheumatologist](/specialties/rheumatology) is the right choice when the diagnosis is uncertain, attacks keep coming despite treatment, tophi are present, kidney disease complicates treatment, or medicine side effects are a problem.",
    },
    {
      k: "p",
      text: "You can [find rheumatologists in Bengaluru](/doctors/karnataka/bengaluru/rheumatologists) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Treating an attack" },
    {
      k: "p",
      text: "The aim is to reduce pain and inflammation quickly. Options include **anti-inflammatory medicines**, **colchicine**, and **steroids** as tablets or an injection into the joint. Treatment works best when started early in the attack. Your doctor will choose based on your kidneys, stomach, heart and other medicines. Resting and raising the joint, and applying a cold pack wrapped in cloth, also help.",
    },
    { k: "h3", text: "Preventing attacks" },
    {
      k: "p",
      text: "**Urate-lowering medicines** reduce the uric acid level so that crystals dissolve over time. **Allopurinol** is usually the first choice; febuxostat is an alternative. They are recommended for people with repeated attacks, tophi, joint damage on X-ray, kidney stones from uric acid, or sometimes after a first attack. The dose is increased step by step, with blood tests, until a target uric acid level set by your doctor is reached.",
    },
    {
      k: "note",
      text: "Attacks can become more frequent in the first months after starting urate-lowering medicine, as crystals start to dissolve. This is a sign the medicine is working, not failing. Your doctor will usually prescribe low-dose colchicine or another medicine for protection during this time. Do not stop your uric acid medicine during an attack unless your doctor tells you to. If you develop a rash after starting allopurinol, stop it and see your doctor straight away.",
    },
    { k: "h3", text: "Lifestyle" },
    {
      k: "p",
      text: "Diet alone rarely controls gout, but it helps. Lose excess weight gradually, cut down alcohol and sugary drinks, eat less red and organ meat, drink plenty of water, and keep active. Vegetables, pulses and dairy are generally fine. Extreme diets and fasting can trigger attacks.",
    },

    { k: "h2", text: "Living with gout" },
    {
      k: "p",
      text: "Gout is a long-term condition, but with steady uric acid control most people stop having attacks. Usually urate-lowering medicine is continued long term. Keep regular blood tests and appointments, and have your blood pressure, sugar, cholesterol and kidney function checked, because gout often comes with these conditions. Keep a supply of your attack medicine and know when to take it.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "A hot, swollen joint with high fever, shivering or feeling very unwell — this could be a joint infection",
        "A widespread rash, blistering, mouth ulcers or fever after starting allopurinol",
        "Severe pain in the side or back with blood in the urine, which may be a kidney stone",
        "Chest pain or sudden breathlessness",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "How sure are we that this is gout?",
        "What should I take when an attack starts?",
        "Should I start long-term uric acid medicine?",
        "What uric acid level are we aiming for, and how often will you check it?",
        "Are any of my current medicines raising my uric acid?",
        "What changes to food and drink would help me most?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is high uric acid the same as gout?",
      a: "No. Many people have a high uric acid level and never develop gout. Gout is diagnosed when crystals cause joint inflammation. A high level without symptoms usually does not need uric acid-lowering medicine, but your doctor may look for related conditions such as kidney disease and diabetes.",
    },
    {
      q: "Can I control gout with diet alone?",
      a: "Diet changes help, but they usually lower uric acid only a little. People with repeated attacks, tophi or joint damage generally need long-term urate-lowering medicine as well. Weight loss, less alcohol and fewer sugary drinks support the treatment.",
    },
    {
      q: "Do I have to avoid all dal and vegetables?",
      a: "No. Pulses, beans and vegetables, including spinach and mushrooms, do not raise gout risk the way meat, seafood, alcohol and sugary drinks do. A balanced diet with plenty of vegetables and adequate protein is suitable for most people with gout.",
    },
    {
      q: "How long will I need to take allopurinol?",
      a: "Most people need it long term, because uric acid rises again when it is stopped and attacks return. Some people with well-controlled gout over many years may be able to reduce it under medical supervision. Do not stop it on your own.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Gout", url: "https://medlineplus.gov/gout.html" },
    { label: "NHS — Gout", url: "https://www.nhs.uk/conditions/gout/" },
  ],
};
