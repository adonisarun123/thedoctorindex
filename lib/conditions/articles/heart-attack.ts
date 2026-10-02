import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "heart-attack",
  title: "Heart attack: warning signs, what to do, treatment and recovery",
  metaTitle: "Heart attack: warning signs, what to do and treatment",
  standfirst: "How to recognise a heart attack and what to do at once, how it is diagnosed and treated, and how to recover and prevent another.",
  targetQuery: "heart attack symptoms what to do",
  department: "cardiology",
  specialty: "cardiology",
  alsoSee: ["emergency-medicine"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Chest pain", "Pain in the arm, jaw, neck or back", "Breathlessness", "Cold sweat", "Nausea", "Light-headedness"],
  tests: ["ECG", "Troponin", "Echocardiogram", "Coronary angiography"],
  treatments: ["Primary angioplasty", "Thrombolysis", "Antiplatelet medicines", "Statins", "Beta blockers", "Coronary artery bypass surgery", "Cardiac rehabilitation"],
  body: [
    {
      k: "note",
      tone: "alert",
      title: "Think it might be a heart attack?",
      text: "Call 112 or 108 at once. Do not drive yourself, and do not wait to see if it settles. Sit down and rest. If the emergency operator or a doctor advises you to chew aspirin, follow their instructions. If the person collapses and is not breathing normally, start chest compressions — the operator can guide you.",
    },

    { k: "h2", text: "What a heart attack is" },
    {
      k: "p",
      text: "A heart attack (myocardial infarction) happens when a coronary artery, one of the vessels that supply the heart muscle, is suddenly blocked. Usually a fatty plaque in the artery wall cracks and a blood clot forms over it. The heart muscle beyond the blockage is starved of oxygen and begins to die within minutes.",
    },
    {
      k: "p",
      text: "The sooner blood flow is restored, the more muscle is saved. Fast treatment reduces the risk of death and of long-term heart failure, which is why every minute matters and why the first step is always to call for emergency help rather than see a doctor the next day.",
    },

    { k: "h2", text: "Symptoms: how to recognise it" },
    { k: "p", text: "Symptoms can be sudden and severe, or build over minutes. The classic signs are:" },
    {
      k: "ul",
      items: [
        "Chest pain, pressure, squeezing or heaviness, usually in the centre or left of the chest, lasting more than a few minutes or coming and going",
        "Pain in the arm, jaw, neck or back, or in the upper abdomen",
        "Breathlessness, with or without chest pain",
        "Cold sweat",
        "Nausea or vomiting, or a feeling of severe indigestion",
        "Light-headedness, fainting or a sense of doom",
      ],
    },
    {
      k: "p",
      text: "Women, older people and people with diabetes are more likely to have less typical symptoms — breathlessness, unusual tiredness, upper abdominal discomfort or 'gas' — and less chest pain. Many heart attacks in India are first treated at home as acidity, losing precious time. If in doubt, treat it as a heart attack and call for help.",
    },

    { k: "h2", text: "Who is at higher risk in India" },
    {
      k: "p",
      text: "South Asians tend to have heart attacks at a younger age than people of European background. Your risk is higher if you:",
    },
    {
      k: "ul",
      items: [
        "Smoke cigarettes or bidis, or chew tobacco, gutka or paan masala",
        "Have diabetes, high blood pressure or high cholesterol",
        "Carry extra weight around the waist, or are inactive",
        "Have a close relative who had heart disease at a young age",
        "Have chronic kidney disease, or have already had angina or a heart attack",
      ],
    },
    {
      k: "p",
      text: "Heavy alcohol use, chronic stress, poor sleep and air pollution add to the risk.",
    },

    { k: "h2", text: "How it is diagnosed" },
    { k: "p", text: "In the emergency department, diagnosis and treatment happen together:" },
    {
      k: "ul",
      items: [
        "**ECG** — recorded within minutes of arrival, and often by the ambulance team. It shows whether the artery is fully blocked (a STEMI), which needs immediate treatment to reopen it.",
        "**Troponin** — a blood test for a protein released by damaged heart muscle, usually repeated after a few hours.",
        "**Echocardiogram** — an ultrasound that shows how well the heart is pumping and whether a part of the muscle has been damaged.",
        "**Coronary angiography** — dye is injected through a thin tube passed from the wrist or groin to show the blocked artery, often followed straight away by angioplasty.",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "In an emergency, go to a hospital with an emergency department, ideally one that has a catheterisation (cath) lab and can perform angioplasty at any hour. [Emergency physicians](/specialties/emergency-medicine) assess and stabilise you, and a [cardiologist](/specialties/cardiology) performs angiography and angioplasty and leads your care afterwards. A cardiothoracic surgeon is involved if bypass surgery is needed.",
    },
    {
      k: "p",
      text: "For follow-up and prevention, you can [find cardiologists in Bengaluru](/doctors/karnataka/bengaluru/cardiologists) on The Doctor Index, each with a registration you can check. It is worth knowing in advance which hospital near your home can treat a heart attack.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Opening the artery" },
    {
      k: "p",
      text: "For a fully blocked artery, **primary angioplasty** is the preferred treatment where it can be done quickly: a balloon opens the artery and a stent is placed to keep it open. Where a cath lab is not quickly available, **thrombolysis** — a clot-dissolving medicine given into a vein — is used, ideally followed by transfer to a hospital that can do angiography. For some people, especially with several blocked arteries, **coronary artery bypass surgery** is advised.",
    },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "Almost everyone needs long-term medicines after a heart attack: **antiplatelet medicines** (often two together for a period, especially after a stent) to prevent clots; **statins** to lower cholesterol and stabilise plaque; **beta blockers**; and often ACE inhibitors or related medicines to protect the heart muscle. Others are added for diabetes or heart failure.",
    },
    {
      k: "p",
      text: "Do not stop any of these on your own. Stopping antiplatelet medicines early after a stent can cause the stent to block suddenly, which can be fatal. If a dentist or another doctor asks you to stop them before a procedure, check with your cardiologist first.",
    },

    { k: "h2", text: "Recovery and living with it" },
    {
      k: "p",
      text: "**Cardiac rehabilitation** is a structured programme of supervised exercise, education and emotional support. It speeds recovery, helps people return to work and lowers the chance of another heart attack. Ask your hospital whether it offers one.",
    },
    {
      k: "ul",
      items: [
        "Stop tobacco completely — the National Tobacco Quit Line (1800-112-356) offers free counselling",
        "Eat more vegetables, fruit, pulses and whole grains, with less fried food, salt and sugar",
        "Increase activity gradually, as your team advises",
        "Keep blood pressure, cholesterol and sugar in the ranges your doctor sets",
        "Ask when you can drive, travel, return to work and resume sex",
        "Mention low mood or anxiety — both are common after a heart attack and are treatable",
      ],
    },

    { k: "h2", text: "When to call for help again" },
    { k: "p", text: "Call 112 or 108 straight away if you have:" },
    {
      k: "ul",
      items: [
        "Chest pain like before, or chest pain that does not settle with rest or your prescribed spray or tablet",
        "Sudden severe breathlessness, fainting or a very fast or irregular heartbeat",
        "Sudden weakness of the face, arm or leg, or difficulty speaking",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "How much of my heart muscle was damaged, and how well is it pumping?",
        "Are any other arteries narrowed, and do they need treatment?",
        "What is each medicine for, and how long must I take it?",
        "What should I do if chest pain comes back?",
        "When can I return to work, exercise and driving?",
        "Is there a cardiac rehabilitation programme I can join?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is a heart attack the same as a cardiac arrest?",
      a: "No. A heart attack is a blocked artery starving part of the heart muscle. A cardiac arrest is when the heart suddenly stops pumping effectively, and the person collapses and stops breathing normally. A heart attack can trigger a cardiac arrest, which needs immediate CPR.",
    },
    {
      q: "Can young people have heart attacks?",
      a: "Yes. In India, heart attacks are increasingly seen in people in their thirties and forties, especially those who use tobacco, have diabetes, high cholesterol or a strong family history. Chest pain should never be dismissed because of age.",
    },
    {
      q: "Should I take aspirin if I think I am having a heart attack?",
      a: "Call 112 or 108 first. The emergency operator or a doctor will tell you whether to chew aspirin, depending on your history and allergies. Do not let finding a tablet delay calling for help or getting to hospital.",
    },
    {
      q: "Can I live a normal life after a heart attack?",
      a: "Most people return to work, exercise and family life after recovery, especially if they join cardiac rehabilitation, stop tobacco and take their medicines regularly. Your cardiologist will tell you how quickly to build up activity.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Heart Attack", url: "https://medlineplus.gov/heartattack.html" },
    { label: "World Health Organization — Cardiovascular diseases fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)" },
    { label: "National Tobacco Control Programme, MoHFW — National Tobacco Quit Line Services", url: "https://ntcp.mohfw.gov.in/national_tobacco_quit_line_services" },
  ],
};
