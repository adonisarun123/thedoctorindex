import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "epilepsy",
  title: "Epilepsy: seizures, first aid, tests, treatment and which doctor to see",
  metaTitle: "Epilepsy: seizure first aid, treatment and which doctor",
  standfirst: "What epilepsy is, the different kinds of seizure, seizure first aid, the tests a neurologist uses, how it is treated, and when a seizure is an emergency.",
  targetQuery: "epilepsy seizure symptoms and treatment",
  department: "neurology",
  specialty: "neurology",
  alsoSee: ["paediatrics"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Convulsions", "Staring spells", "Sudden jerks", "Loss of awareness", "Confusion after a seizure"],
  tests: ["EEG", "MRI", "Blood tests"],
  treatments: ["Anti-seizure medicines", "Epilepsy surgery", "Vagus nerve stimulation", "Ketogenic diet"],
  body: [
    { k: "h2", text: "What epilepsy is" },
    {
      k: "p",
      text: "Epilepsy is a condition of the brain in which a person has repeated seizures. A seizure is a sudden burst of abnormal electrical activity in the brain that briefly changes how a person moves, feels, behaves or is aware of their surroundings.",
    },
    {
      k: "p",
      text: "A single seizure does not always mean epilepsy. Seizures can be triggered by fever in young children, very low blood sugar, alcohol withdrawal, or a head injury. Doctors usually diagnose epilepsy after two or more unprovoked seizures, or after one seizure when tests show a high chance of more.",
    },
    {
      k: "p",
      text: "Epilepsy is a medical condition. It is not contagious, it is not caused by spirits or bad behaviour, and it does not affect a person's intelligence in most cases. Most people with epilepsy can study, work, marry and have children, and many become seizure-free with treatment.",
    },

    { k: "h2", text: "Types of seizure and symptoms" },
    {
      k: "p",
      text: "Seizures look different depending on where in the brain they start and how far they spread. Common types are:",
    },
    {
      k: "ul",
      items: [
        "**Convulsions** (tonic-clonic seizures) — the person stiffens, falls, and their arms and legs jerk rhythmically; they may bite their tongue or wet themselves",
        "**Staring spells** (absence seizures) — a few seconds of blank staring, most common in children, often mistaken for daydreaming",
        "**Sudden jerks** (myoclonic seizures) — brief jerks of the arms or body, often soon after waking",
        "**Focal seizures** — starting in one part of the brain; there may be a strange feeling, smell or taste, twitching of one side, or loss of awareness with chewing or fiddling movements",
        "**Atonic seizures** — sudden loss of muscle tone, causing a drop to the floor",
      ],
    },
    {
      k: "p",
      text: "After a seizure, confusion after a seizure, sleepiness, headache and aching muscles are common for minutes to hours. Some people have a warning feeling, called an aura, just before.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "Epilepsy can start at any age, but it most often begins in childhood or later life. In many people no cause is found. Known causes include:",
    },
    {
      k: "ul",
      items: [
        "Brain injury around birth, or problems with brain development",
        "Head injury",
        "Stroke, which is a common cause in older adults",
        "Brain infections such as meningitis and encephalitis, and neurocysticercosis — tapeworm cysts in the brain, an important cause in India",
        "Brain tumours",
        "Inherited (genetic) conditions",
      ],
    },
    {
      k: "p",
      text: "In someone with epilepsy, seizures can be triggered by missed medicines, lack of sleep, alcohol, illness with fever, stress, and, for a few people, flashing lights.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The most important part of the diagnosis is a clear description of what happened. Because the person often does not remember, a description from someone who saw it is very helpful. A video of an episode on a phone, taken safely, can help the doctor a great deal.",
    },
    {
      k: "ul",
      items: [
        "**EEG** (electroencephalogram) — records the brain's electrical activity through small sensors on the scalp. A normal EEG does not rule out epilepsy; sometimes a sleep EEG or longer video EEG recording is needed.",
        "**MRI** of the brain — looks for a structural cause such as scarring, a tumour or a cyst. A CT scan may be used in an emergency.",
        "**Blood tests** — check sugar, salts and other causes of seizures, and are used to monitor some medicines.",
      ],
    },
    {
      k: "p",
      text: "Fainting, panic attacks and some heart rhythm problems can look like seizures, so an ECG may also be done.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [neurologist](/specialties/neurology) diagnoses and treats epilepsy in adults. Children are usually seen by a [paediatrician](/specialties/paediatrics) and a paediatric neurologist. If seizures continue despite trying two suitable medicines, ask to be referred to a comprehensive epilepsy centre, where surgery and other options can be assessed.",
    },
    {
      k: "p",
      text: "You can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists) and [paediatricians](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "**Anti-seizure medicines** are the main treatment and control seizures in most people. Common ones include levetiracetam, sodium valproate, carbamazepine, lamotrigine and others. The neurologist chooses based on the seizure type, age, other illnesses, and whether pregnancy is possible. Usually one medicine is started and adjusted slowly.",
    },
    {
      k: "note",
      text: "Take anti-seizure medicines every day, at the same times, and never stop them suddenly — this can cause severe, prolonged seizures. Do not switch brands or change the dose without asking your doctor. Sodium valproate can harm an unborn baby, so women and girls who could become pregnant should discuss this with their neurologist before starting or stopping it, and plan any pregnancy in advance.",
    },
    { k: "h3", text: "When medicines are not enough" },
    {
      k: "p",
      text: "If seizures continue, **epilepsy surgery** to remove or disconnect the area where seizures start can stop or greatly reduce them in suitable people. **Vagus nerve stimulation**, using a small device placed under the skin of the chest, can reduce seizures. A **ketogenic diet**, a strict high-fat, low-carbohydrate diet supervised by doctors and dietitians, helps some children with difficult epilepsy.",
    },

    { k: "h2", text: "Seizure first aid" },
    { k: "p", text: "Most seizures stop on their own. If you see someone having a convulsion:" },
    {
      k: "ul",
      items: [
        "Stay calm, stay with them and note the time it started",
        "Move hard or sharp objects away, and cushion their head with something soft",
        "Loosen anything tight around the neck and remove spectacles",
        "When the jerking stops, turn them gently on their side so saliva can drain and they can breathe",
        "Stay with them, speak calmly, until they are fully awake",
      ],
    },
    { k: "p", text: "Do **not**:" },
    {
      k: "ul",
      items: [
        "Put anything in their mouth — not a spoon, cloth or your fingers. They cannot swallow their tongue.",
        "Hold them down or try to stop the movements",
        "Put keys or metal in their hand, or hold a shoe or onion to their nose — these do not help",
        "Give water, food or medicines by mouth until they are fully alert",
      ],
    },

    { k: "h2", text: "Living with epilepsy and when it is an emergency" },
    {
      k: "p",
      text: "Keep a seizure diary, take medicines regularly, get enough sleep and limit alcohol. Shower rather than bathe, never swim alone, and ask your doctor about driving, cooking on an open flame, and work at heights or near machinery. Tell your school, college or workplace what to do if you have a seizure. Depression and anxiety are common with epilepsy and are treatable.",
    },
    { k: "p", text: "Call 112 or 108 if:" },
    {
      k: "ul",
      items: [
        "A seizure lasts longer than five minutes, or seizures follow one another without the person waking in between",
        "It is the person's first seizure",
        "They are injured, have trouble breathing or do not wake up afterwards",
        "The seizure happened in water",
        "They are pregnant or have diabetes",
      ],
    },
    {
      k: "p",
      text: "A seizure that goes on too long, called status epilepticus, can damage the brain and needs emergency treatment. If your doctor has given you an emergency rescue medicine and shown you how to use it, follow that plan.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What type of seizures do I have, and what is the likely cause?",
        "What are the side effects of this medicine, and what should I do if I miss a dose?",
        "What should my family do if I have a seizure?",
        "Is it safe for me to drive, swim or do my job?",
        "How does this medicine affect contraception and pregnancy?",
        "When could we think about reducing medicines if I stay seizure-free?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is epilepsy curable?",
      a: "Many people become seizure-free with medicines, and some can later stop treatment under a neurologist's supervision after a long seizure-free period. Some childhood epilepsies are outgrown. Surgery can stop seizures in suitable people. Never stop medicines on your own, even after years without seizures.",
    },
    {
      q: "Can people with epilepsy marry and have children?",
      a: "Yes. Most people with epilepsy marry, have healthy children and live full lives. Women should plan pregnancy with their neurologist, because some medicines need to be changed beforehand and folic acid is usually advised before conception.",
    },
    {
      q: "Should I put a spoon in the mouth during a seizure?",
      a: "No. Never put anything in the mouth of someone having a seizure. It can break teeth, injure the jaw or block the airway, and a person cannot swallow their tongue. Turn them on their side once the jerking stops.",
    },
    {
      q: "Is a normal EEG proof that I do not have epilepsy?",
      a: "No. Many people with epilepsy have a normal EEG between seizures. The diagnosis depends mainly on a clear description of the episodes. Your neurologist may repeat the EEG, do it during sleep or use longer video recording if needed.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Epilepsy", url: "https://medlineplus.gov/epilepsy.html" },
    { label: "World Health Organization — Epilepsy fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/epilepsy" },
    { label: "US Centers for Disease Control and Prevention — First aid for seizures", url: "https://www.cdc.gov/epilepsy/first-aid-for-seizures/index.html" },
    { label: "Parasitology Research — Neurocysticercosis: a review on status in India, management, and current therapeutic interventions", url: "https://link.springer.com/article/10.1007/s00436-016-5278-9" },
  ],
};
