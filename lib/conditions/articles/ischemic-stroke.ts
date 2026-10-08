import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "ischemic-stroke",
  title: "Ischaemic stroke: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Ischaemic stroke: symptoms, treatment and which doctor",
  standfirst: "What an ischaemic stroke is, the BE FAST signs to act on, why every minute counts for clot-busting treatment, and how recovery and prevention work.",
  targetQuery: "ischemic stroke symptoms and treatment",
  department: "neurology",
  specialty: "neurology",
  alsoSee: ["emergency-medicine", "physical-medicine-rehabilitation", "cardiology"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Face drooping", "Arm weakness", "Slurred speech", "Loss of balance", "Vision loss"],
  tests: ["CT scan", "MRI", "CT angiography", "ECG", "Carotid Doppler", "Echocardiogram"],
  treatments: ["Thrombolysis", "Mechanical thrombectomy", "Antiplatelet medicines", "Anticoagulants", "Statins", "Rehabilitation"],
  body: [
    { k: "h2", text: "What an ischaemic stroke is" },
    {
      k: "p",
      text: "A stroke happens when part of the brain suddenly loses its blood supply. Brain cells need a constant flow of oxygen and sugar, and they begin to die within minutes without it. An ischaemic stroke — the commonest type — is caused by a blockage, usually a blood clot, in an artery supplying the brain. The other main type, a [haemorrhagic stroke](/conditions/hemorrhagic-stroke), is caused by bleeding into or around the brain.",
    },
    {
      k: "p",
      text: "An ischaemic stroke is a medical emergency. Modern treatments can dissolve or remove the clot and limit the damage, but they work only within hours of the first symptoms, and the earlier they are given the better the outcome. Doctors say 'time is brain'. Recognising the signs and getting to the right hospital quickly is the single most important thing a family can do.",
    },
    {
      k: "p",
      text: "A [transient ischaemic attack](/conditions/transient-ischemic-attack) (TIA, or 'mini-stroke') causes the same symptoms but they disappear, usually within minutes. A TIA is a serious warning that a full stroke may follow, often within days, and needs urgent assessment on the same day.",
    },

    { k: "h2", text: "Symptoms: think BE FAST" },
    {
      k: "p",
      text: "Stroke symptoms start suddenly. The BE FAST checklist helps you spot them:",
    },
    {
      k: "ul",
      items: [
        "**B — Balance:** sudden loss of balance, dizziness or difficulty walking",
        "**E — Eyes:** sudden vision loss or double vision in one or both eyes",
        "**F — Face:** face drooping on one side; the smile looks uneven",
        "**A — Arms:** arm weakness or numbness; one arm drifts down when both are raised",
        "**S — Speech:** slurred speech, or difficulty speaking or understanding",
        "**T — Time:** call 112 or 108 immediately and note the time symptoms started",
      ],
    },
    {
      k: "p",
      text: "Other signs include sudden numbness of one side of the body, sudden confusion and, less often with ischaemic stroke, a sudden severe headache. Do not wait to see if symptoms settle, do not give food, water or tablets by mouth (swallowing may be affected), and do not take the person to a clinic that cannot do an urgent brain scan.",
    },

    { k: "h2", text: "Causes and risk factors" },
    { k: "p", text: "Ischaemic strokes usually happen in one of these ways:" },
    {
      k: "ul",
      items: [
        "**Narrowed arteries:** [atherosclerosis](/conditions/atherosclerosis) — fatty plaque in the arteries of the neck or brain — narrows the vessel, and a clot forms on the plaque",
        "**Clots from the heart:** [atrial fibrillation](/conditions/atrial-fibrillation), an irregular heart rhythm, lets clots form in the heart that travel to the brain; heart valve disease and recent heart attack can do the same",
        "**Small-vessel disease:** long-standing high blood pressure and diabetes damage the tiny arteries deep in the brain",
        "**Less common causes**, especially in younger people: a tear in a neck artery, blood clotting disorders, sickle cell disease, or infections affecting brain vessels",
      ],
    },
    {
      k: "p",
      text: "Major risk factors you can do something about include [high blood pressure](/conditions/high-blood-pressure) — the biggest single one — diabetes, smoking and chewing tobacco, high cholesterol, obesity, physical inactivity and heavy drinking. Age, a family history of stroke and a previous stroke or TIA also raise risk. In India, strokes often occur at a younger age than in many Western countries, partly because high blood pressure and diabetes frequently go undiagnosed or untreated.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "At the hospital the team will quickly examine the person, check blood sugar (low sugar can mimic a stroke) and arrange urgent brain imaging:",
    },
    {
      k: "ul",
      items: [
        "**CT scan** — done immediately to rule out bleeding, because clot-busting medicine must not be given for a haemorrhagic stroke",
        "**CT angiography** — shows the blood vessels and whether a large artery is blocked, which decides whether clot removal is possible",
        "**MRI** — more sensitive for small or early strokes, often done later",
      ],
    },
    {
      k: "p",
      text: "Once the person is stable, doctors look for the cause: an **ECG** and heart monitoring for atrial fibrillation, an **echocardiogram** (heart ultrasound) for clots or valve problems, a **carotid Doppler** ultrasound of the neck arteries for narrowing, and blood tests for cholesterol, diabetes and clotting.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Emergency treatment" },
    {
      k: "p",
      text: "**Thrombolysis** means giving a clot-dissolving medicine through a drip. It can restore blood flow and reduce disability, but it is only given within a few hours of the stroke starting, after a scan has ruled out bleeding, and only if there are no reasons it would be unsafe. That is why knowing the exact time symptoms began — or when the person was last seen well — matters so much.",
    },
    {
      k: "p",
      text: "**Mechanical thrombectomy** is a procedure in which a specialist threads a thin tube from an artery in the groin or wrist up to the brain and pulls the clot out. It is used for strokes caused by a blockage in a large brain artery and, in selected patients, can be done later than thrombolysis. It is available only at hospitals with a specialist neuro-intervention team, so emergency services may take the person directly to such a centre.",
    },
    { k: "h3", text: "Preventing another stroke" },
    {
      k: "p",
      text: "After the emergency phase, treatment focuses on lowering the risk of another stroke. Depending on the cause, this may include **antiplatelet medicines** to stop clots forming on plaques, **anticoagulants** (blood thinners) for atrial fibrillation, **statins** to lower cholesterol and stabilise plaque, and medicines to control blood pressure and diabetes. If a neck artery is badly narrowed, an operation to clear it (carotid endarterectomy) or a stent may be recommended. Never stop these medicines without talking to your doctor.",
    },
    { k: "h3", text: "Rehabilitation" },
    {
      k: "p",
      text: "**Rehabilitation** starts in hospital, often within a day or two, and continues for months. Physiotherapy helps with walking and strength, occupational therapy with daily tasks such as dressing and cooking, and speech and language therapy with talking and swallowing. Much recovery happens in the first few months, but improvement can continue for much longer with practice. Depression, tiredness and memory problems after a stroke are common and treatable, so mention them.",
    },

    { k: "h2", text: "Lowering your risk" },
    {
      k: "ul",
      items: [
        "Check your blood pressure regularly, even if you feel well, and take treatment as prescribed",
        "Keep diabetes and cholesterol under control",
        "Stop smoking and chewing tobacco, gutka or paan masala",
        "Be active most days — brisk walking counts",
        "Eat more vegetables, fruit, pulses and whole grains, and less salt, fried and packaged food",
        "Limit alcohol",
        "If you have an irregular pulse or palpitations, ask to be checked for atrial fibrillation",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "p",
      text: "Any sudden BE FAST sign is an emergency, even if it lasts only a few minutes or goes away. Call 112 or 108 at once, tell the operator you suspect a stroke, and ask to be taken to a hospital that can do an urgent CT scan and give stroke treatment. Note the time symptoms began. Keep the person lying on their side if they are drowsy or vomiting, and do not give anything by mouth.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "In the emergency, care is led by the [emergency medicine](/specialties/emergency-medicine) team and a [neurologist](/specialties/neurology). After a stroke or TIA, a neurologist usually oversees investigations and prevention, often with a [cardiologist](/specialties/cardiology) if the heart is the source. A [rehabilitation physician](/specialties/physical-medicine-rehabilitation), physiotherapists and speech therapists guide recovery, while your [general physician](/specialties/general-practice) helps keep blood pressure, diabetes and cholesterol on target over the long term.",
    },
    {
      k: "p",
      text: "You can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists), [rehabilitation physicians in Bengaluru](/doctors/karnataka/bengaluru/rehabilitation-physicians) or [physiotherapists in Bengaluru](/doctors/karnataka/bengaluru/physiotherapists) on The Doctor Index, each with a registration you can check. For a suspected stroke, do not search for a doctor — call 112 or 108.",
    },

    { k: "h2", text: "Questions to ask the care team" },
    {
      k: "ul",
      items: [
        "What caused this stroke, and what tests are still needed?",
        "Which medicines must be taken long term, and what are they for?",
        "What are the blood pressure, sugar and cholesterol targets?",
        "What rehabilitation is planned, and what can we do at home?",
        "Is it safe to drive, return to work or travel, and when?",
        "What signs should make us call an ambulance again?",
      ],
    },
  ],
  faqs: [
    {
      q: "What is the difference between an ischaemic and a haemorrhagic stroke?",
      a: "An ischaemic stroke is caused by a blocked artery, usually by a clot. A haemorrhagic stroke is caused by bleeding in or around the brain. They need opposite emergency treatments, which is why a brain scan is done before any clot-busting medicine.",
    },
    {
      q: "Can someone recover fully after an ischaemic stroke?",
      a: "Some people recover completely, especially after a small stroke or fast treatment. Others are left with weakness, speech or memory problems. Rehabilitation helps most people regain function, and improvement can continue for many months after the stroke.",
    },
    {
      q: "My symptoms went away after a few minutes. Do I still need to go to hospital?",
      a: "Yes. Symptoms that disappear may be a transient ischaemic attack, a warning that a major stroke could follow soon. You should be assessed urgently the same day so that the cause can be found and preventive treatment started.",
    },
    {
      q: "How can I tell whether a hospital can treat stroke?",
      a: "A hospital that treats acute stroke needs round-the-clock CT scanning, a neurologist or stroke team, and clot-busting medicine. Emergency operators on 112 or 108 can guide you. Calling ahead, or asking your doctor now about nearby stroke-ready hospitals, saves time later.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Ischemic Stroke", url: "https://medlineplus.gov/ischemicstroke.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
