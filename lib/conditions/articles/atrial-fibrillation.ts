import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "atrial-fibrillation",
  title: "Atrial fibrillation (AFib): symptoms, tests, treatment and stroke prevention",
  metaTitle: "Atrial fibrillation: symptoms, tests and treatment",
  standfirst: "What atrial fibrillation is, why it raises stroke risk, the tests that confirm it, how it is treated, and when to seek emergency help.",
  targetQuery: "atrial fibrillation symptoms and treatment",
  department: "cardiology",
  specialty: "cardiology",
  alsoSee: ["neurology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Palpitations", "Breathlessness", "Tiredness", "Dizziness", "Chest discomfort"],
  tests: ["ECG", "Holter monitor", "Echocardiogram", "Thyroid function tests"],
  treatments: ["Anticoagulants", "Rate control", "Rhythm control", "Cardioversion", "Catheter ablation"],
  body: [
    { k: "h2", text: "What atrial fibrillation is" },
    {
      k: "p",
      text: "Atrial fibrillation (AF or AFib) is the most common lasting heart rhythm problem. Normally each heartbeat starts with a regular electrical signal in the upper chambers of the heart (the atria). In AF those signals become chaotic, the atria quiver instead of contracting properly, and the lower chambers beat irregularly and often fast.",
    },
    {
      k: "p",
      text: "AF itself is rarely immediately dangerous, but it matters for two reasons. Blood can pool in the quivering atria and form clots, which can travel to the brain and cause a stroke. And a fast, irregular rhythm over time can weaken the heart and lead to heart failure. Treatment addresses both.",
    },
    {
      k: "p",
      text: "AF can come and go (paroxysmal), last for longer periods (persistent) or become permanent. It tends to progress over time, especially if its triggers are not treated.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Some people have no symptoms and AF is found on a routine pulse check or ECG. Others notice:" },
    {
      k: "ul",
      items: [
        "Palpitations — a fluttering, racing, pounding or irregular heartbeat",
        "Breathlessness, especially on exertion",
        "Tiredness and reduced ability to exercise",
        "Dizziness, light-headedness or fainting",
        "Chest discomfort",
      ],
    },
    {
      k: "p",
      text: "Feeling your own pulse at the wrist can be useful: an irregularly irregular pulse is a reason to see a doctor. Some smartwatches flag possible AF; a positive alert needs an ECG to confirm it.",
    },

    { k: "h2", text: "Causes and who is at higher risk in India" },
    { k: "p", text: "AF becomes more common with age. Other causes and triggers include:" },
    {
      k: "ul",
      items: [
        "High blood pressure",
        "Coronary artery disease and heart failure",
        "Heart valve disease, especially narrowing of the mitral valve after rheumatic fever, which is an important cause in younger people in India",
        "Diabetes, obesity and sleep apnoea",
        "An overactive thyroid",
        "Heavy alcohol drinking, including binge drinking",
        "Lung disease, a recent major operation or a serious infection",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "AF is confirmed by a recording of the heart rhythm while it is happening:",
    },
    {
      k: "ul",
      items: [
        "**ECG** — a standard recording that shows AF if it is present at the time.",
        "**Holter monitor** — a portable ECG worn for one or more days, or a longer patch or event recorder, to catch AF that comes and goes.",
        "**Echocardiogram** — an ultrasound to check the valves, the size of the atria and how well the heart pumps.",
        "**Thyroid function tests**, kidney and liver tests, blood count and sugar, to look for causes and guide medicine choice.",
      ],
    },
    {
      k: "p",
      text: "Your doctor will also estimate your stroke risk from your age, sex and conditions such as high blood pressure, diabetes, heart failure and previous stroke. This score helps decide whether you need blood-thinning treatment.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [cardiologist](/specialties/cardiology) diagnoses and manages AF. An electrophysiologist — a cardiologist specialising in heart rhythm — performs ablation and advises when rhythm control is difficult. A [neurologist](/specialties/neurology) is involved if you have had a stroke or a mini-stroke. Your [general physician](/specialties/general-practice) often shares follow-up and blood-thinner monitoring.",
    },
    {
      k: "p",
      text: "You can [find cardiologists in Bengaluru](/doctors/karnataka/bengaluru/cardiologists) or [neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Preventing stroke" },
    {
      k: "p",
      text: "**Anticoagulants** (blood thinners) greatly reduce the risk of stroke in people at moderate or high risk. Options include warfarin, which needs regular INR blood tests and steady eating habits, and newer direct oral anticoagulants that do not need routine INR checks. People with significant mitral valve narrowing or a mechanical valve usually need warfarin. Aspirin is not an effective substitute for stroke prevention in AF. Bleeding is the main risk, and your doctor will weigh it against your stroke risk.",
    },
    { k: "h3", text: "Controlling the heart" },
    {
      k: "ul",
      items: [
        "**Rate control** — medicines such as beta blockers or certain calcium channel blockers slow the heart so it pumps efficiently, even if the rhythm stays irregular.",
        "**Rhythm control** — medicines to restore and keep a normal rhythm.",
        "**Cardioversion** — a controlled electric shock under short sedation, or medicines, to reset the rhythm. Blood thinners are needed before and after.",
        "**Catheter ablation** — thin wires passed through a vein to the heart create small scars that block the faulty signals. It suits selected people, particularly those with troublesome symptoms.",
      ],
    },
    {
      k: "p",
      text: "Treating the triggers — blood pressure, weight, sleep apnoea, alcohol, thyroid disease and diabetes — makes AF less frequent and other treatments more effective. Do not stop blood thinners or rhythm medicines on your own.",
    },

    { k: "h2", text: "Living with it: follow-up" },
    {
      k: "ul",
      items: [
        "Regular INR tests if you take warfarin, and kidney tests if you take a newer anticoagulant",
        "Telling every doctor and dentist you see that you take a blood thinner",
        "Checking with your doctor before taking any new medicine, painkiller or herbal remedy, as many interact with blood thinners",
        "Keeping your intake of green leafy vegetables steady if you take warfarin, rather than avoiding them",
        "Cutting down on alcohol and keeping active",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Signs of stroke: sudden drooping of the face, weakness of an arm or leg, slurred speech, sudden loss of vision or severe imbalance — note the time they started",
        "Chest pain, fainting or severe breathlessness with a fast heartbeat",
        "Serious bleeding on blood thinners: vomiting blood, black stools, blood in urine that does not stop, or a head injury",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What type of AF do I have, and what is causing it?",
        "What is my stroke risk, and do I need a blood thinner?",
        "Which blood thinner suits me, and what should I watch for?",
        "Should we aim to control my rate or restore a normal rhythm?",
        "Am I a candidate for ablation?",
        "What can I change myself to make AF less likely?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is atrial fibrillation life-threatening?",
      a: "AF itself is usually not immediately life-threatening, but untreated it raises the risk of stroke and heart failure. With blood thinners where needed and control of the heart rate or rhythm, most people with AF live full lives.",
    },
    {
      q: "Why do I need a blood thinner if I feel fine?",
      a: "The stroke risk in AF does not depend on symptoms. Clots can form in the heart even when you feel well or the AF comes and goes. Your doctor recommends a blood thinner based on your stroke risk, not on how you feel.",
    },
    {
      q: "Can atrial fibrillation go away?",
      a: "AF can stop on its own, particularly early on or after a trigger such as an infection or heavy drinking, but it often returns. Treatments such as ablation and treating triggers can keep many people in normal rhythm for long periods.",
    },
    {
      q: "Can I eat green vegetables while taking warfarin?",
      a: "Yes. Green leafy vegetables contain vitamin K, which affects warfarin, but the answer is to eat them in steady amounts rather than avoid them. Large sudden changes in diet can upset your INR, so mention them to your doctor.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Atrial Fibrillation", url: "https://medlineplus.gov/atrialfibrillation.html" },
    { label: "American Heart Association — Atrial Fibrillation", url: "https://www.heart.org/en/health-topics/atrial-fibrillation" },
  ],
};
