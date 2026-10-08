import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "restless-legs",
  title: "Restless legs syndrome: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Restless legs syndrome: causes, treatment, which doctor",
  standfirst: "What restless legs syndrome is, why it strikes at night, the iron and other tests worth doing, and treatments that help you sleep again.",
  targetQuery: "restless legs syndrome symptoms and treatment",
  department: "neurology",
  specialty: "neurology",
  alsoSee: ["general-practice", "nephrology"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Urge to move the legs", "Crawling sensation", "Worse at night", "Poor sleep", "Leg jerks during sleep"],
  tests: ["Ferritin", "Blood count", "Kidney function", "Blood sugar"],
  treatments: ["Iron replacement", "Sleep routine", "Leg stretching", "Dopamine agonists", "Alpha-2-delta ligands"],
  body: [
    { k: "h2", text: "What restless legs syndrome is" },
    {
      k: "p",
      text: "Restless legs syndrome (RLS), also called Willis-Ekbom disease, is a nervous system condition that causes an irresistible urge to move the legs, usually with unpleasant sensations deep inside them. It comes on when you are resting — sitting in the evening, on a long bus or train journey, or lying in bed — and moving the legs brings relief, but only for as long as you keep moving.",
    },
    {
      k: "p",
      text: "Because symptoms peak in the evening and at night, RLS can make it very hard to fall asleep and stay asleep. Over time the lost sleep causes daytime tiredness, irritability, poor concentration and low mood. Many people live with it for years without a name for it, or are told it is 'just weakness' or nerves.",
    },
    {
      k: "p",
      text: "RLS can be mild and occasional, or severe enough to disturb sleep almost every night. The good news is that it is usually treatable, and finding and correcting a cause such as low iron can make a big difference.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Doctors look for four core features, all of which need to be present:",
    },
    {
      k: "ul",
      items: [
        "An urge to move the legs, usually with uncomfortable sensations in them",
        "Symptoms start or get worse during rest or inactivity",
        "Movement — walking, stretching, shaking the legs — relieves them, at least while it continues",
        "Symptoms are worse at night, or happen only in the evening and night",
      ],
    },
    {
      k: "p",
      text: "People describe the feeling in many ways: a crawling sensation, creeping, pulling, itching deep inside, tingling, throbbing or an ache. It is usually in the calves but can affect the thighs, feet and sometimes the arms. Many people with RLS also have leg jerks during sleep — repeated twitching or kicking that a bed partner may notice. These can disturb sleep further.",
    },
    {
      k: "p",
      text: "Poor sleep is often the main complaint. Leg cramps, varicose veins, arthritis and nerve damage can cause leg discomfort too, but they do not usually produce the same urge to move that is relieved by moving. See [muscle cramps](/conditions/muscle-cramps) and [diabetic nerve problems](/conditions/diabetic-nerve-problems) for those conditions.",
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "In many people no underlying cause is found. This 'primary' RLS often runs in families and may start earlier in life. Research points to problems with how the brain uses iron and the chemical messenger dopamine. In other people RLS is linked to another condition, or 'secondary':",
    },
    {
      k: "ul",
      items: [
        "Low iron stores, with or without [anaemia](/conditions/anemia) — common in India, especially in women",
        "Pregnancy, particularly in the later months; symptoms usually settle after delivery",
        "Chronic kidney disease and [kidney failure](/conditions/kidney-failure), especially in people on dialysis",
        "Nerve damage in the legs, for example from diabetes",
        "Some medicines, including certain antihistamines found in cold and allergy remedies, some anti-sickness medicines, some antidepressants and some antipsychotics",
      ],
    },
    {
      k: "p",
      text: "Caffeine (tea, coffee, colas and energy drinks), alcohol, smoking and lack of sleep can all make symptoms worse.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "RLS is diagnosed from your description of the symptoms, so it helps to explain exactly what you feel, when it happens and what relieves it. Your doctor will examine your legs and nerves, review your medicines, and usually arrange blood tests to look for treatable causes:",
    },
    {
      k: "ul",
      items: [
        "**Ferritin** — a measure of the body's iron stores; low or low-normal levels are an important, treatable cause, even when haemoglobin is normal",
        "**Blood count** — to look for anaemia",
        "**Kidney function** — to check for kidney disease",
        "**Blood sugar** — to check for diabetes, which can damage the nerves",
      ],
    },
    {
      k: "p",
      text: "A sleep study is not usually needed, but may be suggested if the diagnosis is unclear or another sleep disorder such as [sleep apnoea](/conditions/sleep-apnea) is suspected.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment depends on how often symptoms occur, how much they disturb sleep, and whether there is an underlying cause.",
    },
    { k: "h3", text: "Treating the cause" },
    {
      k: "p",
      text: "If iron stores are low, **iron replacement** is often the first step and can greatly improve or even settle symptoms. Your doctor may prescribe tablets or, when tablets do not work or are not tolerated, an iron infusion. Iron should be taken only under medical advice, because too much iron is harmful. If a medicine is making RLS worse, your doctor may suggest an alternative. Treating kidney disease or diabetes properly also helps.",
    },
    { k: "h3", text: "Habits that help" },
    {
      k: "ul",
      items: [
        "A regular **sleep routine**, going to bed and getting up at the same times",
        "Cutting down tea, coffee and colas, especially after the afternoon, and avoiding alcohol and tobacco",
        "Gentle **leg stretching**, a short walk or a massage in the evening",
        "A warm bath or a warm or cool pack on the legs before bed",
        "Regular moderate exercise during the day, but not hard exercise late in the evening",
        "Keeping the mind busy with a puzzle or reading when you have to sit for a long time, and choosing an aisle seat when travelling",
      ],
    },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "For frequent or severe symptoms, a doctor may prescribe medicine. Options include **alpha-2-delta ligands**, a group of medicines that calm nerve signalling and help sleep, and **dopamine agonists**, which act on the brain's dopamine system. Dopamine medicines can work well at first, but over time some people develop 'augmentation', where symptoms start earlier in the day, become stronger or spread to the arms. If you notice this, tell your doctor rather than increasing the dose yourself. For severe RLS that does not respond, specialists may consider other options.",
    },
    {
      k: "p",
      text: "During pregnancy, many medicines are avoided. Doctors usually focus on iron levels and simple measures, and symptoms generally fade after the baby is born.",
    },

    { k: "h2", text: "Living with restless legs" },
    {
      k: "p",
      text: "RLS can be frustrating, but most people find a combination that keeps it under control. Keep a short diary of symptoms, sleep, caffeine and medicines for a couple of weeks to share with your doctor. Let your family know what is happening, as a bed partner may also be losing sleep. If tiredness or low mood is affecting your work or relationships, mention it — treating the sleep problem often helps both. See [insomnia](/conditions/insomnia) for more on sleep habits.",
    },

    { k: "h2", text: "When to seek urgent help" },
    {
      k: "p",
      text: "Restless legs syndrome itself is not an emergency. But some leg symptoms need urgent care. Call 112 or 108, or go to the nearest emergency department, if you have:",
    },
    {
      k: "ul",
      items: [
        "Sudden weakness or numbness in one leg or one side of the body, or difficulty speaking — possible signs of stroke",
        "A painful, swollen, warm calf, especially with breathlessness or chest pain — possible signs of a blood clot",
        "Sudden loss of feeling in both legs with loss of bladder or bowel control",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can diagnose most cases of RLS, check iron and other blood tests, and start treatment. A [neurologist](/specialties/neurology) is worth seeing if the diagnosis is uncertain, symptoms are severe, treatment is not working, or augmentation develops. People on dialysis should discuss symptoms with their [nephrologist](/specialties/nephrology), and pregnant women with their [gynaecologist](/specialties/gynaecology).",
    },
    {
      k: "p",
      text: "You can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Could my symptoms be restless legs syndrome, or something else?",
        "What is my ferritin level, and do I need iron?",
        "Could any of my current medicines be making it worse?",
        "Do I need medicine, and what side effects should I watch for?",
        "What should I do if symptoms start earlier in the day or get stronger?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is restless legs syndrome caused by weakness or a vitamin deficiency?",
      a: "Low iron stores are a well-known, treatable cause of restless legs, and doctors check ferritin for this reason. General 'weakness' is not a cause. Do not start iron or other supplements on your own; test first and follow your doctor's advice.",
    },
    {
      q: "Why are restless legs worse at night?",
      a: "Symptoms follow a daily rhythm and are linked to rest and inactivity, both of which peak in the evening. Changes in brain dopamine activity through the day are thought to play a part, which is why symptoms often ease in the early morning.",
    },
    {
      q: "Will restless legs go away after pregnancy?",
      a: "For most women, restless legs that start in pregnancy settle within weeks after delivery. Iron levels are often checked during pregnancy. If symptoms continue after the baby is born, see a doctor to look for another cause.",
    },
    {
      q: "Can restless legs syndrome be serious?",
      a: "It does not damage the body directly, but long-term sleep loss can affect mood, concentration, work and safety, such as driving while drowsy. That is why it is worth treating, even when it seems like a minor complaint.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Restless Legs", url: "https://medlineplus.gov/restlesslegs.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
