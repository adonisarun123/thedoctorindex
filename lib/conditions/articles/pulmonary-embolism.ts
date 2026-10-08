import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "pulmonary-embolism",
  title: "Pulmonary embolism: symptoms, causes, treatment and which doctor",
  metaTitle: "Pulmonary embolism: symptoms, causes and treatment",
  standfirst: "What a pulmonary embolism (blood clot in the lung) is, the symptoms that need emergency care, who is at risk, how it is diagnosed and treated.",
  targetQuery: "pulmonary embolism symptoms and treatment",
  department: "pulmonology",
  specialty: "pulmonology",
  alsoSee: ["emergency-medicine", "cardiology", "critical-care", "haematology"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Sudden breathlessness", "Chest pain", "Fast heartbeat", "Coughing up blood", "Fainting", "Leg swelling"],
  tests: ["CT pulmonary angiogram", "D-dimer", "Leg ultrasound", "Echocardiogram", "ECG"],
  treatments: ["Anticoagulants", "Thrombolytics", "Catheter-directed treatment", "Compression and early movement"],
  body: [
    { k: "h2", text: "What a pulmonary embolism is" },
    {
      k: "p",
      text: "A pulmonary embolism (PE) is a sudden blockage of an artery in the lungs. In almost all cases the blockage is a blood clot that formed somewhere else, usually in a deep vein of the leg or pelvis, broke loose and travelled through the bloodstream to the lungs. A clot in a deep vein is called [deep vein thrombosis](/conditions/deep-vein-thrombosis) (DVT); doctors often think of DVT and PE as one condition, venous thromboembolism.",
    },
    {
      k: "p",
      text: "When a clot blocks blood flow in the lungs, less oxygen gets into the blood and the right side of the heart has to pump against the blockage. A small clot may cause only mild symptoms; a large clot, or many clots, can cause collapse and sudden death. PE is a medical emergency, but it is treatable, and prompt treatment greatly improves the outlook.",
    },
    {
      k: "p",
      text: "Rarely, the blockage is caused by something other than a clot, such as fat after a major bone fracture, air, or tumour cells.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms depend on the size of the clot and on how healthy the heart and lungs were beforehand. They often come on suddenly:",
    },
    {
      k: "ul",
      items: [
        "Sudden breathlessness, at rest or on slight exertion",
        "Chest pain, often sharp and worse when breathing in deeply or coughing",
        "Fast heartbeat and fast breathing",
        "Coughing up blood",
        "Light-headedness, low blood pressure or fainting",
        "Anxiety, sweating or a feeling that something is very wrong",
      ],
    },
    {
      k: "p",
      text: "Many people also have signs of a DVT in one leg beforehand or at the same time: leg swelling, pain or tenderness in the calf or thigh, warmth, and redness or discolouration. Some people have few or no symptoms, and PE can be mistaken for a [heart attack](/conditions/heart-attack), a chest infection or anxiety. That is why doctors ask about risk factors.",
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "Clots form when blood flows slowly, when the vein wall is injured, or when the blood clots more easily than usual. Risk factors include:",
    },
    {
      k: "ul",
      items: [
        "Recent surgery, especially hip or knee replacement and other major operations",
        "Long periods without moving: bed rest, a leg in plaster, illness at home or in hospital, or long journeys by air, train, bus or car",
        "A fracture of the hip or leg, or other major injury",
        "Cancer and some cancer treatments",
        "Pregnancy and the weeks after childbirth, including after a caesarean section",
        "Hormone-containing medicines such as combined birth control pills and some menopause hormone therapy",
        "Heart failure, chronic lung disease and some inflammatory conditions",
        "Increasing age, obesity and smoking",
        "A past clot, a family history of clots, or an inherited clotting tendency",
        "Severe infections, including COVID-19, which can raise clotting risk",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "p",
      text: "Call 112 or 108, or go to the nearest emergency department straight away, if you have sudden breathlessness, chest pain that is worse on breathing in, coughing up blood, or fainting — especially if you have recently had surgery, been immobile, given birth, or have a swollen, painful leg. Do not drive yourself. If the person collapses and is not breathing normally, start chest compressions and ask for an AED.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "PE can be hard to diagnose because its symptoms overlap with many other conditions. Doctors combine your symptoms and risk factors to judge how likely PE is, and then choose tests:",
    },
    {
      k: "ul",
      items: [
        "**D-dimer** — a blood test. A normal result in someone at low risk makes a clot unlikely. A raised result is not specific, because it also rises with infection, pregnancy, surgery and age.",
        "**CT pulmonary angiogram** — a CT scan with contrast dye injected into a vein, which shows clots in the lung arteries. It is the main test for confirming PE.",
        "A ventilation-perfusion (V/Q) scan, used in some centres when CT dye is unsuitable, for example with kidney problems",
        "**Leg ultrasound** — a Doppler scan to look for a DVT in the legs",
        "**ECG** and chest X-ray, mainly to rule out other causes such as a heart attack or pneumonia",
        "**Echocardiogram** — an ultrasound of the heart to see whether the right side is under strain",
        "Blood tests for oxygen level, kidney function and heart strain",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment starts as soon as PE is strongly suspected, sometimes before the scan result, because delay is dangerous. The aims are to stop the clot growing, prevent new clots, and in severe cases remove or dissolve the clot.",
    },
    {
      k: "ul",
      items: [
        "**Anticoagulants** (blood thinners) are the main treatment. They do not dissolve the existing clot directly but stop it growing and allow the body to break it down. They may be given as injections, tablets or through a drip, and are usually continued for at least a few months; some people need them long term.",
        "**Thrombolytics** (clot-busting medicines) are given for large clots causing low blood pressure or shock. They work quickly but carry a real risk of serious bleeding, so they are reserved for life-threatening PE.",
        "**Catheter-directed treatment** — a thin tube passed through a vein to the lungs to break up or suck out the clot, available at some specialist centres. Rarely, open surgery is needed.",
        "A filter placed in the main vein of the abdomen to catch clots, used only in people who cannot take blood thinners.",
        "Oxygen and intensive care support when needed.",
      ],
    },
    {
      k: "p",
      text: "Blood thinners raise the risk of bleeding. While taking them, tell every doctor and dentist, avoid painkillers of the NSAID group and aspirin unless prescribed, and report black stools, blood in urine, heavy periods or unusual bruising. If you are on the older blood thinner that needs INR blood tests, keep those tests, and check with your doctor before starting new medicines or herbal products.",
    },

    { k: "h2", text: "Recovery and prevention" },
    {
      k: "p",
      text: "Most people improve over days to weeks once treatment starts. Some have breathlessness or tiredness for several months. A small number develop long-term high blood pressure in the lungs, called chronic thromboembolic [pulmonary hypertension](/conditions/pulmonary-hypertension), so tell your doctor if breathlessness persists. Steps to prevent clots include:",
    },
    {
      k: "ul",
      items: [
        "Take blood thinners exactly as prescribed, and do not stop them early without advice",
        "Get up and walk as soon as you are allowed after surgery or illness; ask the hospital team about clot prevention injections and stockings",
        "**Compression and early movement**: on journeys of several hours, walk around when you can, flex your ankles often, drink water, and use compression stockings if advised",
        "Ask about clot risk before starting hormone pills, and around pregnancy and delivery if you have had a clot before",
        "Stay active, keep a healthy weight and stop smoking",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Suspected PE needs an emergency department, where [emergency physicians](/specialties/emergency-medicine) start treatment. Ongoing care is usually led by a [pulmonologist](/specialties/pulmonology) or physician, with a [cardiologist](/specialties/cardiology) when the heart is strained and a [haematologist](/specialties/haematology) to look for clotting disorders after unexplained or repeated clots.",
    },
    {
      k: "p",
      text: "You can [find pulmonologists in Bengaluru](/doctors/karnataka/bengaluru/pulmonologists) or [haematologists in Bengaluru](/doctors/karnataka/bengaluru/haematologists) on The Doctor Index for follow-up care, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Can you survive a pulmonary embolism?",
      a: "Yes. Most people who are diagnosed and treated promptly survive and recover well. PE is most dangerous when it is large or when treatment is delayed, which is why sudden breathlessness or chest pain after surgery or immobility needs emergency care.",
    },
    {
      q: "How long will I need blood thinners?",
      a: "Usually at least a few months. If the clot had a clear temporary cause, such as surgery, treatment may stop after that. If there was no clear cause, or clots keep returning, your doctor may advise longer or lifelong treatment.",
    },
    {
      q: "Can I fly after a pulmonary embolism?",
      a: "Many people can fly once they are stable and on treatment, but timing depends on your recovery and oxygen levels. Ask your doctor before travelling, and on long journeys keep moving, drink water and use compression stockings if advised.",
    },
    {
      q: "Is pulmonary embolism the same as a heart attack?",
      a: "No. A heart attack is a blockage of an artery supplying the heart muscle, while a pulmonary embolism is a clot blocking an artery in the lungs. Both can cause chest pain and breathlessness and both need emergency care.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Pulmonary Embolism", url: "https://medlineplus.gov/pulmonaryembolism.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
