import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "sudden-cardiac-arrest",
  title: "Sudden cardiac arrest: signs, CPR, causes and prevention",
  standfirst: "What sudden cardiac arrest is, how it differs from a heart attack, how to give hands-only CPR and use an AED, the causes, and protecting those at risk.",
  targetQuery: "sudden cardiac arrest what to do",
  department: "cardiology",
  specialty: "cardiology",
  alsoSee: ["emergency-medicine", "critical-care"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Sudden collapse", "No breathing or abnormal gasping", "No response", "Palpitations", "Fainting"],
  tests: ["ECG", "Echocardiogram", "Coronary angiogram", "Cardiac MRI", "Genetic testing"],
  treatments: ["CPR", "Defibrillation", "Implantable cardioverter defibrillator", "Angioplasty", "Bypass surgery"],
  body: [
    { k: "h2", text: "What sudden cardiac arrest is" },
    {
      k: "p",
      text: "Sudden cardiac arrest (SCA) happens when the heart suddenly stops pumping blood. It is usually caused by a dangerous problem with the heart's electrical system that makes the lower chambers quiver chaotically instead of beating. Blood stops reaching the brain and other organs, the person collapses within seconds, and without immediate help death follows within minutes.",
    },
    {
      k: "p",
      text: "Survival depends on what bystanders do in the first few minutes. Starting **CPR** (cardiopulmonary resuscitation) straight away and using a defibrillator to shock the heart back into a normal rhythm can save a life. Waiting for the ambulance without starting CPR greatly lowers the chance of survival.",
    },

    { k: "h2", text: "Cardiac arrest is not the same as a heart attack" },
    {
      k: "p",
      text: "The two are often confused. A [heart attack](/conditions/heart-attack) is a blockage of blood flow to part of the heart muscle — a plumbing problem. The person is usually awake and breathing, often with chest pain, and needs urgent hospital treatment. A cardiac arrest is an electrical problem — the heart stops pumping, and the person is unconscious and not breathing normally.",
    },
    {
      k: "p",
      text: "A heart attack can trigger a cardiac arrest, which is one reason why chest pain should always be treated as an emergency. Both need a call to 112 or 108, but only cardiac arrest needs CPR.",
    },

    { k: "h2", text: "Signs of cardiac arrest" },
    {
      k: "ul",
      items: [
        "Sudden collapse",
        "No response when you tap the shoulders and shout",
        "No breathing or abnormal gasping — occasional gasps are not normal breathing and are a sign of cardiac arrest",
      ],
    },
    {
      k: "p",
      text: "Some people have warning symptoms in the minutes or hour before, such as chest pain, breathlessness, nausea, a racing heartbeat or feeling dizzy. Others collapse with no warning. Unexplained fainting, especially during exercise, or palpitations with dizziness, should be checked by a doctor because they can be early clues to a rhythm problem.",
    },

    { k: "h2", text: "What to do: call, push, shock" },
    {
      k: "ol",
      items: [
        "**Check for danger**, then check whether the person responds and is breathing normally.",
        "**Call 112 or 108** at once, or ask someone else to call. Put the phone on speaker so your hands are free.",
        "**Start hands-only CPR**: kneel beside the person, place the heel of one hand in the centre of the chest with the other hand on top, keep your arms straight, and push hard and fast — about 5 cm deep, at a rate of 100 to 120 pushes a minute, letting the chest rise fully between pushes. Do not stop.",
        "**Send someone to find an AED** (automated external defibrillator). Switch it on and follow the voice instructions. It will analyse the rhythm and only advise a shock if one is needed.",
        "**Keep going** with CPR until the ambulance team takes over, the AED tells you to pause, or the person starts breathing normally. If others are present, take turns every couple of minutes, as CPR is tiring.",
      ],
    },
    {
      k: "p",
      text: "You cannot make things worse by trying. Without CPR the person is very likely to die; pushing on the chest keeps some blood flowing to the brain until the heart can be restarted. If you have been trained and are willing, you can add rescue breaths; if not, hands-only CPR is still very effective for adults. Some public places, such as airports, offices and malls, keep an AED — find out whether there is one at your workplace or housing society and where it is kept.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "Most cardiac arrests are caused by **ventricular fibrillation**, a chaotic rhythm in which the heart's lower chambers quiver instead of pumping. This and other dangerous [arrhythmias](/conditions/arrhythmia) usually arise because of an underlying heart problem:",
    },
    {
      k: "ul",
      items: [
        "[Coronary artery disease](/conditions/coronary-artery-disease) — the most common underlying cause in adults, often without previous symptoms",
        "A current or previous heart attack, which can leave scarring that disturbs the heart's rhythm",
        "[Heart failure](/conditions/heart-failure) or a weak heart muscle",
        "[Cardiomyopathy](/conditions/cardiomyopathy), including inherited forms that thicken the heart muscle",
        "Inherited rhythm disorders, such as long QT syndrome, which can affect young, apparently healthy people",
        "Heart valve disease or heart defects present from birth",
        "Other triggers, such as severe electrolyte imbalance, drug misuse, some medicines, a strong blow to the chest, drowning or electrocution",
      ],
    },
    {
      k: "p",
      text: "The risk is higher with increasing age, in men, in people with a personal or family history of cardiac arrest or unexplained sudden death, after a heart attack, with heart failure, and with heavy alcohol or drug use. Smoking, diabetes, high blood pressure and high cholesterol raise the risk indirectly by causing coronary artery disease.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "The immediate treatment is CPR and **defibrillation** — an electric shock that resets the heart's rhythm — given as early as possible. Ambulance teams and hospital emergency departments continue resuscitation, give medicines, and support breathing.",
    },
    {
      k: "p",
      text: "People who survive are cared for in an intensive care unit, where the team protects the brain and other organs and looks for the cause. Tests may include:",
    },
    {
      k: "ul",
      items: [
        "**ECG** and continuous heart-rhythm monitoring",
        "**Echocardiogram** to see how well the heart pumps",
        "**Coronary angiogram** to look for blocked arteries",
        "**Cardiac MRI** to look for scarring or disease of the heart muscle",
        "**Genetic testing** when an inherited heart condition is suspected, especially in younger people",
      ],
    },
    { k: "p", text: "Depending on the cause, treatment to prevent another arrest may include:" },
    {
      k: "ul",
      items: [
        "**Angioplasty** with a stent, or **bypass surgery**, to restore blood flow if coronary arteries are blocked",
        "An **implantable cardioverter defibrillator** (ICD) — a small device placed under the skin of the chest that watches the heart rhythm and delivers a shock if a dangerous rhythm starts",
        "Medicines to control heart rhythm and treat heart failure or other heart disease",
        "Cardiac rehabilitation, and support for the anxiety and memory or concentration problems that some survivors experience",
      ],
    },

    { k: "h2", text: "Prevention and protecting people at risk" },
    {
      k: "ul",
      items: [
        "Look after your heart: avoid tobacco, keep blood pressure, sugar and cholesterol under control, stay active and keep a healthy weight",
        "Take heart medicines exactly as prescribed, and keep follow-up visits",
        "See a doctor about fainting during exercise, unexplained fainting, or palpitations with dizziness",
        "If a relative died suddenly and unexpectedly at a young age, ask a cardiologist whether family members should be checked",
        "Learn CPR — workplaces, schools and housing societies can arrange training — and find out where the nearest AED is",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A cardiac arrest is treated first by ambulance teams, an [emergency physician](/specialties/emergency-medicine) and an [intensivist](/specialties/critical-care). A [cardiologist](/specialties/cardiology) finds the cause, decides on angiography, an ICD or other treatment, and follows survivors long term. A cardiologist is also the right doctor if you have fainted unexpectedly, have palpitations with dizziness, or have a family history of sudden death.",
    },
    {
      k: "p",
      text: "You can [find cardiologists in Bengaluru](/doctors/karnataka/bengaluru/cardiologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask a cardiologist" },
    {
      k: "ul",
      items: [
        "What caused the cardiac arrest, or what puts me at risk of one?",
        "Do I need an ICD, and what is living with one like?",
        "Should my family members be tested for an inherited heart condition?",
        "Which activities, sports and driving are safe for me now?",
        "What symptoms should make me call for help straight away?",
      ],
    },
  ],
  faqs: [
    {
      q: "What is the difference between a cardiac arrest and a heart attack?",
      a: "A heart attack is a blockage of blood flow to the heart muscle; the person is usually awake and may have chest pain. A cardiac arrest is when the heart suddenly stops pumping; the person collapses and stops breathing normally. A heart attack can lead to cardiac arrest.",
    },
    {
      q: "Can I hurt someone by doing CPR?",
      a: "CPR can sometimes bruise or crack ribs, but a person in cardiac arrest will very likely die without it. The benefit far outweighs the risk. If someone is unresponsive and not breathing normally, call 112 or 108 and start pushing hard and fast in the centre of the chest.",
    },
    {
      q: "Is it safe for an untrained person to use an AED?",
      a: "Yes. AEDs are designed for the public. Once switched on, they give spoken instructions, check the heart rhythm themselves, and only deliver a shock if it is needed. Make sure nobody is touching the person when the shock is given, then continue CPR as instructed.",
    },
    {
      q: "Why do young, fit people sometimes have a cardiac arrest?",
      a: "In younger people, cardiac arrest is often linked to an inherited heart muscle or rhythm condition, a heart defect present from birth, inflammation of the heart, or drug use. Unexplained fainting during exercise or a family history of sudden death should be checked by a cardiologist.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Sudden Cardiac Arrest", url: "https://medlineplus.gov/suddencardiacarrest.html" },
    { label: "Emergency Response Support System, Government of India — 112", url: "https://112.gov.in/" },
  ],
};
