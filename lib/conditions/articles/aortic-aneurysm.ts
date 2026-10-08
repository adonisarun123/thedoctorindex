import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "aortic-aneurysm",
  title: "Aortic aneurysm: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Aortic aneurysm: symptoms, tests and treatment",
  standfirst: "What an aortic aneurysm is, who is at risk, how it is found and monitored, when repair is needed, and the warning signs of a rupture or dissection.",
  targetQuery: "aortic aneurysm symptoms and treatment",
  department: "vascular-medicine",
  specialty: "cardiology",
  alsoSee: ["cardiothoracic-surgery", "general-surgery", "emergency-medicine"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Abdominal pain", "Back pain", "Chest pain", "Pulsing feeling in the belly"],
  tests: ["Abdominal ultrasound", "CT scan", "Echocardiogram", "MRI"],
  treatments: ["Regular monitoring", "Blood pressure control", "Endovascular repair", "Open surgical repair"],
  body: [
    { k: "h2", text: "What an aortic aneurysm is" },
    {
      k: "p",
      text: "The aorta is the largest artery in the body. It leaves the heart, arches over in the chest and runs down through the abdomen, where it splits into the arteries that supply the legs. An aneurysm is a weak area in the wall of an artery that bulges outwards like a balloon. Because the aorta carries blood under high pressure straight from the heart, a large aneurysm here can tear or burst and cause severe internal bleeding, which is often fatal.",
    },
    {
      k: "p",
      text: "Doctors describe aortic aneurysms by where they are. An **abdominal aortic aneurysm** (AAA) is in the part of the aorta that runs through the belly and is the more common type. A **thoracic aortic aneurysm** (TAA) is in the part that runs through the chest. A related emergency, **aortic dissection**, happens when the inner layer of the aortic wall tears and blood forces its way between the layers. A dissection can happen with or without an existing aneurysm.",
    },
    {
      k: "p",
      text: "Most aneurysms grow slowly over years and never cause symptoms until they are large. Many are found by chance on an ultrasound or scan done for something else. The good news is that once an aneurysm is known about, it can be watched and, if it grows to a size where the risk of bursting outweighs the risk of an operation, repaired in a planned way.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "A small or medium aneurysm usually causes no symptoms at all. When symptoms do appear, they depend on where the aneurysm is and whether it is pressing on nearby structures:",
    },
    {
      k: "ul",
      items: [
        "Abdominal aneurysm: abdominal pain, often a deep, constant ache, or lower back pain, or a pulsing feeling in the belly near the navel, like a second heartbeat",
        "Thoracic aneurysm: chest pain or upper back pain, a hoarse voice, cough, breathlessness or difficulty swallowing if it presses on nearby structures",
        "Sometimes, small clots form inside the aneurysm and travel to the legs or feet, causing pain, coldness or discoloured toes",
      ],
    },
    {
      k: "p",
      text: "A rupture or dissection is different. It usually causes sudden, severe pain in the chest, back or abdomen, often described as tearing or ripping, and may spread to the neck, jaw, back or legs. The person may become pale, sweaty, dizzy, breathless or faint, or lose consciousness. This is an emergency: see the section on urgent signs below.",
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "An aneurysm forms when the wall of the aorta weakens over time. Several things make that more likely:",
    },
    {
      k: "ul",
      items: [
        "Smoking, including beedis and other tobacco — the strongest avoidable risk factor for abdominal aneurysms",
        "Increasing age, especially over 65",
        "Being male; abdominal aneurysms are more common in men, although women can get them too",
        "Long-standing [high blood pressure](/conditions/high-blood-pressure), which strains the arterial wall",
        "[Atherosclerosis](/conditions/atherosclerosis), the build-up of fatty plaque in the arteries",
        "A parent, brother or sister who has had an aortic aneurysm",
        "Inherited connective tissue conditions such as Marfan syndrome, and a heart valve problem called a bicuspid aortic valve, which are linked to thoracic aneurysms, sometimes at a young age",
        "Less commonly, injury to the chest or abdomen, inflammation of the arteries, or infection of the artery wall",
      ],
    },
    {
      k: "p",
      text: "In India, tobacco use and high blood pressure that has never been checked are common, and many people only learn their blood pressure is high when something goes wrong. Having your blood pressure checked regularly as an adult is one of the simplest ways to protect the aorta as well as the heart, brain and kidneys.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Sometimes a doctor feels a pulsating swelling while examining the abdomen, but in many people, especially those with a larger waist, an aneurysm cannot be felt. Imaging is what confirms it and measures its size:",
    },
    {
      k: "ul",
      items: [
        "**Abdominal ultrasound** — quick, painless and without radiation; the usual first test for an abdominal aneurysm and the usual way to keep watch on a small one",
        "**CT scan** — often with contrast dye (CT angiography); gives a detailed picture of the size, shape and position of the aneurysm and is used to plan repair",
        "**Echocardiogram** — an ultrasound of the heart that can show the first part of the aorta and the aortic valve",
        "**MRI** — an alternative to CT for some people, especially for repeated scans of the chest aorta",
      ],
    },
    {
      k: "p",
      text: "Some countries offer a one-time ultrasound screening to people at higher risk, such as older men who have smoked or people with a close relative who had an aneurysm. If that describes you, ask your doctor whether a screening scan makes sense. If one relative has a thoracic aneurysm or a connective tissue condition, your doctor may suggest checking other family members as well.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment depends mainly on the size of the aneurysm, how fast it is growing, where it is, whether it is causing symptoms, and your overall health. The decision is a balance between the risk of the aneurysm bursting and the risk of the operation itself.",
    },
    { k: "h3", text: "Watching and protecting the aorta" },
    {
      k: "p",
      text: "Small aneurysms are usually managed with **regular monitoring** — repeat ultrasound or CT scans at intervals your doctor sets. Alongside this, the aim is to slow growth and protect your heart and arteries. **Blood pressure control** is central, and your doctor may prescribe blood pressure medicines and cholesterol-lowering medicines. Stopping smoking is the single most useful thing you can do. Do not stop or change prescribed medicines without talking to your doctor.",
    },
    { k: "h3", text: "Repair" },
    {
      k: "p",
      text: "If an aneurysm is large, growing quickly or causing symptoms, repair is usually advised. There are two main approaches:",
    },
    {
      k: "ul",
      items: [
        "**Endovascular repair** — a fabric-covered tube on a metal frame (a stent graft) is passed up through the arteries from the groin and opened inside the aneurysm, so blood flows through the tube rather than pressing on the weak wall. Recovery is usually quicker, but regular follow-up scans are needed for life.",
        "**Open surgical repair** — the surgeon opens the abdomen or chest and replaces the weakened section of aorta with a synthetic tube. It is a bigger operation with a longer recovery, but tends to need less long-term checking.",
      ],
    },
    {
      k: "p",
      text: "Which option suits you depends on the shape and position of the aneurysm, your age and your other health conditions. A ruptured aneurysm or an aortic dissection needs emergency treatment, often surgery, in a hospital with the right team.",
    },

    { k: "h2", text: "Living with an aneurysm" },
    {
      k: "ul",
      items: [
        "Stop smoking and avoid all tobacco; ask your doctor for help if you have tried before and found it hard",
        "Take blood pressure and cholesterol medicines as prescribed, and check your blood pressure at home if your doctor suggests it",
        "Keep every scan appointment, even when you feel well — the scans are how growth is caught early",
        "Stay active with walking and other moderate exercise; ask your doctor whether you should avoid very heavy lifting or straining",
        "Carry a note or keep a phone record of your diagnosis and the size of the aneurysm, so emergency staff know immediately",
        "Tell any doctor who prescribes new medicines that you have an aortic aneurysm",
      ],
    },
    {
      k: "p",
      text: "Knowing you have an aneurysm can be worrying. Most small aneurysms grow slowly, and many people live for years with one under watch. Ask your doctor what size would trigger a discussion about repair, so you understand the plan.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108 for an ambulance immediately if you, or someone with a known aneurysm, has:" },
    {
      k: "ul",
      items: [
        "Sudden, severe pain in the chest, back, abdomen or flank, especially a tearing or ripping pain",
        "Pain that spreads to the neck, jaw, arms or legs",
        "Fainting, collapse, sudden dizziness, a racing pulse, or cold and clammy skin",
        "Sudden breathlessness, or sudden weakness or numbness of one side of the body or the legs",
      ],
    },
    {
      k: "p",
      text: "Do not drive yourself to hospital. Keep the person lying still and calm while you wait, and do not give food or drink, because emergency surgery may be needed. Sudden chest pain can also be a [heart attack](/conditions/heart-attack); in either case, the right step is the same — get emergency help at once.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "If an aneurysm is found by chance, your [general physician](/specialties/general-practice) will usually refer you on. Aortic aneurysms are managed by vascular surgeons, often together with a [cardiologist](/specialties/cardiology), and aneurysms of the chest aorta are often treated by a [cardiothoracic surgeon](/specialties/cardiothoracic-surgery). A cardiologist also looks after the blood pressure, cholesterol and heart checks that go with it, and can assess related conditions such as [peripheral arterial disease](/conditions/peripheral-arterial-disease).",
    },
    {
      k: "p",
      text: "You can [find cardiologists in Bengaluru](/doctors/karnataka/bengaluru/cardiologists) or [cardiothoracic surgeons in Bengaluru](/doctors/karnataka/bengaluru/cardiothoracic-surgeons) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Where exactly is my aneurysm, and how big is it?",
        "How often do I need scans, and which type?",
        "At what size or rate of growth would you recommend repair?",
        "Am I suitable for endovascular repair, open surgery, or both?",
        "Should my brothers, sisters or children be checked?",
        "Which symptoms mean I should go straight to an emergency department?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can an aortic aneurysm go away on its own?",
      a: "No. An aneurysm does not shrink back to normal on its own. It may stay stable for years or grow slowly. Controlling blood pressure and stopping smoking can help slow growth, and regular scans show whether repair is needed.",
    },
    {
      q: "Is an aortic aneurysm the same as a brain aneurysm?",
      a: "No. Both are bulges in an artery wall, but a brain aneurysm affects the small arteries supplying the brain, while an aortic aneurysm affects the body's main artery in the chest or abdomen. They have different causes, tests and treatments.",
    },
    {
      q: "Can I exercise with an aortic aneurysm?",
      a: "Most people are encouraged to stay active with walking, cycling or other moderate exercise. Very heavy lifting and intense straining may not be advisable for some people. Ask your doctor what is safe for you, based on the size and position of the aneurysm.",
    },
    {
      q: "What is the difference between an aneurysm and an aortic dissection?",
      a: "An aneurysm is a bulge where the aortic wall has weakened and widened. A dissection is a tear in the inner layer of the wall that lets blood split the layers apart. A dissection is always an emergency and needs immediate hospital care.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Aortic Aneurysm", url: "https://medlineplus.gov/aorticaneurysm.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
