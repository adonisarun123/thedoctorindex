import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "arrhythmia",
  title: "Arrhythmia: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Arrhythmia: symptoms, tests, treatment and doctor",
  standfirst: "What an irregular heartbeat is, the symptoms to notice, how an ECG and heart monitors find it, the treatment options, and when to see a cardiologist.",
  targetQuery: "arrhythmia symptoms and treatment",
  department: "cardiology",
  specialty: "cardiology",
  alsoSee: ["general-practice", "emergency-medicine"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Palpitations", "Dizziness", "Fainting", "Breathlessness", "Chest discomfort", "Tiredness"],
  tests: ["ECG", "Holter monitor", "Echocardiogram", "Blood tests"],
  treatments: ["Medicines", "Pacemaker", "Implantable cardioverter-defibrillator", "Catheter ablation", "Cardioversion"],
  body: [
    { k: "h2", text: "What an arrhythmia is" },
    {
      k: "p",
      text: "Your heart has its own electrical wiring. A small cluster of cells in the upper right chamber sends out a regular signal, which travels down through the heart and makes the chambers squeeze in the right order. An arrhythmia is any problem with that signal, so the heart beats too fast, too slowly, or in an irregular pattern.",
    },
    {
      k: "p",
      text: "The word covers many different conditions, from the harmless to the dangerous. Doctors usually group them by speed and by where they start:",
    },
    {
      k: "ul",
      items: [
        "**Tachycardia** — a heartbeat that is faster than normal at rest",
        "**Bradycardia** — a heartbeat that is slower than the body needs",
        "**Extra or premature beats** — a beat that comes early, often felt as a skip, thud or flutter",
        "Arrhythmias that start in the upper chambers (the atria), such as [atrial fibrillation](/conditions/atrial-fibrillation), and those that start in the lower chambers (the ventricles), which tend to be more serious",
      ],
    },
    {
      k: "p",
      text: "Not every change in rhythm is a disease. Your heart speeds up when you climb stairs, are anxious or have a fever, and slows down when you sleep. Occasional extra beats are very common in healthy people. What matters is how often the rhythm changes, what type it is, whether you have symptoms, and whether the heart itself is healthy.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Some people have no symptoms at all, and the arrhythmia is found on a routine check or an ECG done for another reason. When symptoms do occur, they can include:",
    },
    {
      k: "ul",
      items: [
        "Palpitations — a racing, pounding, fluttering or skipping heartbeat",
        "Dizziness or light-headedness",
        "Fainting, or nearly fainting",
        "Breathlessness, especially on exertion",
        "Chest discomfort or pain",
        "Tiredness or weakness, sometimes with sweating",
      ],
    },
    {
      k: "p",
      text: "A slow rhythm more often causes tiredness, dizziness and fainting. A fast rhythm more often causes palpitations, breathlessness and chest discomfort. Fainting without warning, especially during exercise, should always be checked by a doctor promptly.",
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "Anything that damages or strains the heart's tissue, or disturbs the chemistry that the electrical system depends on, can lead to an arrhythmia. Common causes and risk factors include:",
    },
    {
      k: "ul",
      items: [
        "A previous [heart attack](/conditions/heart-attack) or coronary artery disease, which can leave scar tissue",
        "High blood pressure, heart valve disease, heart failure and heart muscle disease",
        "Heart defects present from birth",
        "An overactive thyroid ([hyperthyroidism](/conditions/hyperthyroidism))",
        "Lung disease, kidney disease, obesity and [sleep apnoea](/conditions/sleep-apnea)",
        "Older age, and a family history of arrhythmias or sudden death at a young age",
        "Recent surgery on the heart, lungs or throat",
        "Smoking, heavy drinking, recreational drugs, and in some people large amounts of caffeine or energy drinks",
        "Some prescription and over-the-counter medicines — always tell your doctor everything you take",
      ],
    },
    {
      k: "p",
      text: "In India, uncontrolled diabetes and high blood pressure are common partners of heart disease, and both raise the chance of rhythm problems over time. Rheumatic heart disease, which can follow untreated throat infections in childhood, still damages heart valves in many Indian adults and is a known cause of atrial fibrillation. Stress, a heavy meal, alcohol or exertion can trigger an episode in someone who already has an underlying tendency.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The doctor will ask what you feel, how long episodes last, what brings them on and how they stop, and will check your pulse, blood pressure and heart sounds. It helps a great deal to note the date and time of each episode, and to check your pulse during one if you can. A smartwatch reading is useful as a clue, but it does not replace a proper recording.",
    },
    {
      k: "ul",
      items: [
        "**ECG** (electrocardiogram) — a quick, painless recording of the heart's electrical activity through stickers on the chest. It is the main test, but it only shows the rhythm during the few seconds it runs.",
        "**Holter monitor** — a small recorder worn for one or more days to catch rhythms that come and go. For rarer episodes, a longer event recorder or a small implanted loop recorder may be used.",
        "**Echocardiogram** — an ultrasound scan that shows the heart's size, pumping strength and valves.",
        "**Blood tests** — for thyroid function, salts such as potassium, blood count and kidney function.",
        "Sometimes a treadmill stress test, or an electrophysiology study, in which thin wires are passed into the heart to map the electrical pathways.",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Many arrhythmias, such as occasional extra beats in a healthy heart, need only reassurance and attention to triggers. When treatment is needed, the goals are to control symptoms, restore or control the rhythm, protect the heart, and prevent complications such as stroke. Options include:",
    },
    {
      k: "ul",
      items: [
        "**Medicines** to slow a fast heart rate or keep a normal rhythm. People with atrial fibrillation are often also advised blood thinners to lower the risk of stroke.",
        "**Cardioversion** — a controlled electric shock under short sedation, or medicines, to reset the heart into a normal rhythm.",
        "**Catheter ablation** — a procedure in which a thin tube is passed through a vein to the heart and a small area causing the abnormal rhythm is treated with heat or cold.",
        "**Pacemaker** — a small device placed under the skin that prevents the heart from beating too slowly.",
        "**Implantable cardioverter-defibrillator** (ICD) — a device for people at risk of dangerous fast rhythms from the lower chambers; it can deliver a shock to restore a normal beat.",
      ],
    },
    {
      k: "p",
      text: "Treating the underlying cause matters as much as treating the rhythm: controlling thyroid disease, blood pressure, diabetes and sleep apnoea, cutting down on alcohol, and stopping smoking. Do not stop or change heart medicines, especially blood thinners, without speaking to your doctor.",
    },

    { k: "h2", text: "Living with an arrhythmia" },
    {
      k: "ul",
      items: [
        "Keep a short diary of episodes, with what you were doing at the time",
        "Learn to check your own pulse at the wrist or neck",
        "Limit alcohol, avoid smoking and recreational drugs, and notice whether caffeine affects you",
        "Ask your doctor what level of exercise is safe for your rhythm problem",
        "If you have a pacemaker or ICD, carry its card, keep follow-up checks, and ask about precautions with phones, security gates and scans",
        "Tell any doctor or dentist treating you which heart medicines you take",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if a fast, slow or irregular heartbeat comes with:" },
    {
      k: "ul",
      items: [
        "Chest pain or pressure, or symptoms you think may be a heart attack",
        "Severe breathlessness",
        "Fainting, or feeling you are about to collapse",
        "Sudden weakness of the face, arm or leg, slurred speech or confusion, which can be signs of a stroke",
      ],
    },
    {
      k: "p",
      text: "If someone collapses, is unresponsive and is not breathing normally, call 112 at once and start chest compressions; this may be [sudden cardiac arrest](/conditions/sudden-cardiac-arrest). Use an automated defibrillator (AED) if one is available.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can check your pulse, arrange an ECG and basic blood tests, and look for causes such as thyroid problems. A [cardiologist](/specialties/cardiology) should see you if the ECG is abnormal, if you faint, if you have heart disease, or if palpitations keep coming back. Some cardiologists specialise in rhythm problems and carry out ablation and device procedures; they are called electrophysiologists.",
    },
    {
      k: "p",
      text: "You can [find cardiologists in Bengaluru](/doctors/karnataka/bengaluru/cardiologists) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Is a skipped heartbeat dangerous?",
      a: "Occasional skipped or extra beats are very common and usually harmless in a healthy heart. See a doctor if they are frequent, getting worse, or come with dizziness, fainting, chest pain or breathlessness, or if you already have heart disease.",
    },
    {
      q: "Can anxiety cause palpitations?",
      a: "Yes. Anxiety and stress can make the heart race and make you more aware of normal beats. But anxiety should not be assumed to be the cause; an ECG and a doctor's assessment help rule out a true rhythm problem first.",
    },
    {
      q: "Will I need a pacemaker?",
      a: "Only some people do. A pacemaker is used mainly when the heart beats too slowly and causes symptoms or risk. Many arrhythmias are managed with medicines, ablation or treating the underlying cause. Your cardiologist will explain why a device is or is not advised.",
    },
    {
      q: "Can an arrhythmia be treated permanently?",
      a: "Some rhythm problems, such as certain extra electrical pathways, can often be fixed by catheter ablation. Others are long-term conditions that are controlled rather than removed. Ask your cardiologist what is realistic for your exact type of arrhythmia.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Arrhythmia", url: "https://medlineplus.gov/arrhythmia.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
