import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "sleep-apnea",
  title: "Sleep apnoea (sleep apnea): symptoms, tests and treatment",
  standfirst: "What obstructive sleep apnoea is, why loud snoring and daytime sleepiness matter, the sleep study that confirms it, and how CPAP and other treatments help.",
  targetQuery: "sleep apnea symptoms and treatment",
  department: "pulmonology",
  specialty: "pulmonology",
  alsoSee: ["ent", "cardiology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Loud snoring", "Pauses in breathing", "Gasping or choking at night", "Daytime sleepiness", "Morning headaches", "Poor concentration"],
  tests: ["Polysomnography", "Home sleep apnoea test"],
  treatments: ["CPAP", "Weight loss", "Oral appliance", "Positional therapy", "Surgery"],
  body: [
    { k: "h2", text: "What sleep apnoea is" },
    {
      k: "p",
      text: "In obstructive sleep apnoea (OSA), the muscles of the throat relax too much during sleep and the airway narrows or closes. Breathing becomes shallow or stops for a few seconds or longer, oxygen levels fall, and the brain briefly wakes the person to restart breathing — often without them knowing. This can happen many times an hour, all night.",
    },
    {
      k: "p",
      text: "The result is broken, unrefreshing sleep and repeated strain on the heart and blood vessels. Untreated sleep apnoea is linked to high blood pressure, heart disease, irregular heartbeat, stroke, type 2 diabetes and road accidents caused by falling asleep at the wheel. It is very treatable, and treatment often transforms how people feel. A less common form, central sleep apnoea, happens when the brain does not send the signal to breathe; it is linked to heart failure, stroke and some medicines, and is treated differently.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Often a bed partner notices first. Common signs are:" },
    {
      k: "ul",
      items: [
        "Loud snoring, most nights",
        "Pauses in breathing during sleep, noticed by others",
        "Gasping or choking at night",
        "Daytime sleepiness — dozing off while reading, watching television, in meetings or while driving",
        "Morning headaches and a dry mouth",
        "Poor concentration, memory problems, irritability or low mood",
        "Waking often to pass urine at night",
      ],
    },
    {
      k: "p",
      text: "Not everyone who snores has sleep apnoea, and not everyone with sleep apnoea snores loudly. In children, sleep apnoea may show as snoring, restless sleep, bedwetting, behaviour problems or poor school performance rather than sleepiness.",
    },

    { k: "h2", text: "Causes and who is at risk in India" },
    {
      k: "ul",
      items: [
        "Excess weight, particularly around the neck and abdomen",
        "A large neck size, a small or set-back lower jaw, or a large tongue",
        "Enlarged tonsils and adenoids — the commonest cause in children",
        "A blocked nose from a deviated septum, polyps or allergy",
        "Being male, older age, and women after menopause",
        "Alcohol, sedatives and sleeping tablets, which relax the throat muscles",
        "Smoking",
        "An underactive thyroid",
      ],
    },
    {
      k: "p",
      text: "People of South Asian background can develop sleep apnoea at a lower body weight than people of European background, partly because of differences in face and jaw shape. Many people in India are never diagnosed, as loud snoring is often seen as normal or a sign of deep sleep.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The doctor will ask about your sleep and daytime sleepiness, often using a short questionnaire, and examine your nose, throat, neck and jaw. The diagnosis is confirmed with a sleep study:",
    },
    {
      k: "ul",
      items: [
        "**Polysomnography** — an overnight study in a sleep laboratory recording breathing, oxygen levels, heart rhythm, brain waves, leg movements and sleep position. It is the most complete test.",
        "**Home sleep apnoea test** — a simpler portable device worn overnight at home that records breathing and oxygen. It suits many adults with a high likelihood of sleep apnoea and no other major medical problems.",
      ],
    },
    {
      k: "p",
      text: "The study counts how often breathing stops or becomes shallow, which tells the doctor how severe the sleep apnoea is. Blood pressure, blood sugar and thyroid tests may also be checked.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [pulmonologist](/specialties/pulmonology) with an interest in sleep medicine usually diagnoses and manages sleep apnoea. An [ENT surgeon](/specialties/ent) assesses the nose and throat, particularly in children with large tonsils and in adults considering surgery. A [cardiologist](/specialties/cardiology) is involved when there is high blood pressure that is hard to control, irregular heartbeat or heart failure. Dentists trained in sleep medicine fit oral appliances.",
    },
    {
      k: "p",
      text: "You can [find pulmonologists in Bengaluru](/doctors/karnataka/bengaluru/pulmonologists), [ENT surgeons in Bengaluru](/doctors/karnataka/bengaluru/ent-surgeons) or [cardiologists in Bengaluru](/doctors/karnataka/bengaluru/cardiologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "CPAP" },
    {
      k: "p",
      text: "**CPAP** (continuous positive airway pressure) is the main treatment for moderate and severe sleep apnoea. A small machine blows air through a mask worn over the nose or nose and mouth, keeping the airway open. Many people feel more alert within days. Getting used to it takes time — a well-fitting mask, a humidifier, and follow-up with your sleep team help a great deal. CPAP works only while you use it, so regular nightly use matters.",
    },
    { k: "h3", text: "Other treatments" },
    {
      k: "ul",
      items: [
        "**Weight loss**, if you carry extra weight, can reduce sleep apnoea substantially and sometimes resolve mild cases. Some weight-loss medicines are now also used for this.",
        "**Oral appliance** — a custom-made mouthguard that holds the lower jaw forward. It suits mild to moderate sleep apnoea and people who cannot use CPAP.",
        "**Positional therapy** — devices or techniques that keep you off your back, for people whose apnoea happens mainly when lying on the back.",
        "**Surgery** — removing tonsils and adenoids is often the main treatment in children. In adults, nose, throat or jaw surgery, or an implanted nerve stimulator, may help selected people.",
      ],
    },
    {
      k: "p",
      text: "Treating a blocked nose, avoiding alcohol and sedatives in the evening, and stopping smoking all help. Do not take sleeping tablets for poor sleep without telling your doctor about your sleep apnoea, and do not stop prescribed treatment without advice.",
    },

    { k: "h2", text: "Living with sleep apnoea" },
    {
      k: "ul",
      items: [
        "Do not drive or operate machinery when you feel sleepy; tell your doctor if you drive for work",
        "Use CPAP every night, including naps and when travelling, and clean the mask and tubing regularly",
        "Tell your anaesthetist before any surgery, and bring your CPAP machine to hospital",
        "Keep blood pressure, blood sugar and weight checked",
        "Return for review if snoring or sleepiness comes back",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "p",
      text: "Sleep apnoea itself is rarely an emergency, but its complications can be. Call 112 or 108, or go to the nearest emergency department, for:",
    },
    {
      k: "ul",
      items: [
        "Chest pain, or a racing or irregular heartbeat with breathlessness or fainting",
        "Sudden weakness of the face, arm or leg, or difficulty speaking",
        "Severe breathlessness, or blue lips",
        "A person who cannot be woken normally",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Do I need a sleep study, and should it be at home or in a lab?",
        "How severe is my sleep apnoea?",
        "Which treatment suits me — CPAP, an oral appliance or surgery?",
        "How can I make CPAP more comfortable?",
        "Is it safe for me to drive?",
        "Could my nose, tonsils or weight be part of the problem?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is snoring always a sign of sleep apnoea?",
      a: "No. Many people snore without having sleep apnoea. Snoring is more concerning when it is loud and happens most nights, or comes with pauses in breathing, gasping, daytime sleepiness or high blood pressure. A sleep study can tell the difference.",
    },
    {
      q: "Will I need CPAP for life?",
      a: "CPAP controls sleep apnoea rather than removing the cause, so many people use it long-term. If you lose a lot of weight or have surgery that fixes the cause, your doctor may repeat the sleep study and the need for CPAP may change.",
    },
    {
      q: "Can children have sleep apnoea?",
      a: "Yes. In children it is often caused by enlarged tonsils and adenoids. Signs include loud snoring, restless sleep, mouth breathing, bedwetting and behaviour or learning problems. An ENT surgeon or paediatrician can assess, and removing the tonsils and adenoids often helps.",
    },
    {
      q: "Can sleep apnoea affect my heart?",
      a: "Yes. Repeated drops in oxygen and sudden awakenings strain the heart and raise blood pressure. Untreated sleep apnoea is linked to high blood pressure, irregular heartbeat, heart failure and stroke. Treatment can help control blood pressure and reduce these risks.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Sleep Apnea", url: "https://medlineplus.gov/sleepapnea.html" },
    { label: "American Academy of Sleep Medicine (Sleep Education) — Obstructive Sleep Apnea", url: "https://sleepeducation.org/sleep-disorders/obstructive-sleep-apnea/" },
  ],
};
