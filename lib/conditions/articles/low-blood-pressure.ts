import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "low-blood-pressure",
  title: "Low blood pressure: symptoms, causes and which doctor to see",
  standfirst: "When low blood pressure is harmless and when it is not, common causes such as dehydration and medicines, tests, treatment and the warning signs.",
  targetQuery: "low blood pressure symptoms and causes",
  department: "cardiology",
  specialty: "internal-medicine",
  alsoSee: ["cardiology", "general-practice", "endocrinology"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Dizziness", "Light-headedness", "Fainting", "Blurred vision", "Fatigue"],
  tests: ["Lying and standing blood pressure", "ECG", "Blood tests", "Echocardiogram", "Tilt-table test"],
  treatments: ["Fluids and salt", "Medicine review", "Compression stockings", "Medicines to raise blood pressure"],
  body: [
    { k: "h2", text: "What low blood pressure is" },
    {
      k: "p",
      text: "Blood pressure is the force of blood pushing against the walls of the arteries as the heart pumps. It is written as two numbers: the upper (systolic) number when the heart beats, and the lower (diastolic) number when it rests between beats. Low blood pressure, or hypotension, generally means a reading lower than about 90/60 mmHg.",
    },
    {
      k: "p",
      text: "Low blood pressure on its own is not a disease. Many healthy people — often young, slim and active — have readings on the low side all their lives and feel perfectly well; for them it is normal, and in some ways protective. Low blood pressure matters when it causes symptoms, when it drops suddenly, or when it is a sign of another problem, such as dehydration, a medicine side effect, heart disease, a hormone problem or a serious infection.",
    },
    {
      k: "p",
      text: "In India, people often describe feeling dizzy or weak as having BP low, and some reach for salty drinks or glucose. A drink can help with dehydration, but repeated dizziness or fainting needs a doctor to find the cause rather than a home fix.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Dizziness or light-headedness, especially on standing up quickly",
        "Fainting or nearly fainting",
        "Blurred vision, or vision that dims or greys out",
        "Nausea",
        "Fatigue and weakness",
        "Difficulty concentrating or confusion, particularly in older people",
        "Cold, clammy, pale skin and fast, shallow breathing when blood pressure falls very low (shock)",
      ],
    },

    { k: "h2", text: "Types and causes" },
    { k: "h3", text: "Postural (orthostatic) hypotension" },
    {
      k: "p",
      text: "Blood pressure drops when you stand up from lying or sitting, causing dizziness for a few seconds or minutes. It is common in older adults and is an important cause of falls. It can be caused by dehydration, long bed rest, some medicines, and conditions that affect the nerves controlling blood pressure, such as diabetes and [Parkinson's disease](/conditions/parkinson-s-disease).",
    },
    { k: "h3", text: "After meals" },
    {
      k: "p",
      text: "Some people, mostly older adults, feel dizzy after a large meal, because blood flows to the gut and the body does not compensate well enough.",
    },
    { k: "h3", text: "Fainting caused by a nerve reflex" },
    {
      k: "p",
      text: "In some people, often young adults and teenagers, standing for a long time, heat, pain, fear or the sight of blood triggers a reflex that slows the heart and widens the blood vessels, leading to a faint. This is called vasovagal syncope. It is usually harmless, though the fall can cause injury.",
    },
    { k: "h3", text: "Other common causes" },
    {
      k: "ul",
      items: [
        "Dehydration from heat, heavy sweating, not drinking enough, fasting, or loss of fluid in [diarrhoea](/conditions/diarrhea) and vomiting",
        "Medicines — blood pressure tablets, water tablets (diuretics), some prostate, heart, erectile dysfunction, Parkinson's and mental health medicines, and taking more than one of these together",
        "Heart problems — a very slow heart rate, valve disease, [heart failure](/conditions/heart-failure) or a heart attack",
        "Blood loss, from injury or internal bleeding, and severe [anaemia](/conditions/anemia)",
        "Hormone problems — underactive adrenal glands, thyroid disease or low blood sugar",
        "Pregnancy — blood pressure normally falls in the first half of pregnancy",
        "Serious infection spreading in the blood ([sepsis](/conditions/sepsis)) or a severe allergic reaction (anaphylaxis), both of which can cause shock",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The doctor will ask when the symptoms happen — on standing, after meals, in heat, with exercise — and what medicines you take, then examine you. Tests depend on the likely cause:",
    },
    {
      k: "ul",
      items: [
        "**Lying and standing blood pressure** — measured after you lie down for a few minutes and again after standing, to look for a postural drop",
        "**ECG** — a tracing of the heart's electrical activity, to look for rhythm problems",
        "**Blood tests** — for anaemia, blood sugar, kidney function, salts, and hormone levels when an adrenal or thyroid problem is suspected",
        "**Echocardiogram** — an ultrasound of the heart, if a heart problem is suspected",
        "**Tilt-table test** — you lie on a table that tilts upright while your blood pressure and heart rate are monitored, used for unexplained fainting",
        "A 24-hour heart rhythm or blood pressure recording in some cases",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "If your blood pressure is low but you feel well, you usually do not need any treatment. When there are symptoms, the doctor treats the cause where possible:",
    },
    {
      k: "ul",
      items: [
        "**Fluids and salt** — drinking enough water, especially in hot weather and during illness; some people are advised to add a little more salt to their diet. Do not increase salt without a doctor's advice if you have heart, kidney or liver disease or high blood pressure at other times",
        "**Medicine review** — reducing, changing or re-timing blood pressure or other medicines that cause dizziness. Do not stop a prescribed medicine on your own",
        "**Compression stockings** — firm stockings that reduce blood pooling in the legs, for some people with postural hypotension",
        "Treating anaemia, heart rhythm problems, diabetes or hormone problems",
        "**Medicines to raise blood pressure** — used by specialists for a small number of people with persistent, troublesome postural hypotension",
      ],
    },

    { k: "h2", text: "Self-care tips" },
    {
      k: "ul",
      items: [
        "Get up slowly: sit on the edge of the bed for a minute before standing, especially at night or first thing in the morning",
        "Before standing, flex your feet and calves a few times to push blood back towards the heart",
        "If you feel faint, sit or lie down at once, with your legs raised if possible",
        "Eat smaller, more frequent meals if you get dizzy after eating, and limit alcohol",
        "Avoid standing still for long periods and very hot baths",
        "Older adults: make the home safer against falls — good lighting at night, grab rails and non-slip mats in the bathroom",
        "If you check blood pressure at home, note the readings with the time and what you were doing, and take the record to your doctor",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if low blood pressure or fainting comes with:" },
    {
      k: "ul",
      items: [
        "Chest pain, a racing or very slow heartbeat, or breathlessness",
        "Fainting during exercise, or fainting that causes an injury",
        "Cold, clammy, pale or bluish skin, fast shallow breathing, confusion or drowsiness — signs of shock",
        "Fever with confusion or a very unwell feeling, which could be sepsis",
        "Black stools, vomiting blood or heavy bleeding",
        "Swelling of the face or lips, or difficulty breathing after a sting, food or medicine",
        "Weakness of the face, arm or leg, or difficulty speaking",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "For repeated dizziness, low readings with symptoms, or a faint without an obvious trigger, start with a [general physician](/specialties/general-practice) or an [internal medicine specialist](/specialties/internal-medicine), who can check your medicines, look for dehydration, anaemia, diabetes and hormone problems, and decide on further tests. A [cardiologist](/specialties/cardiology) is the right next step if fainting happens during exercise, comes with palpitations or chest pain, or tests suggest a heart rhythm or valve problem. An [endocrinologist](/specialties/endocrinology) may be involved if an adrenal or thyroid problem is suspected.",
    },
    {
      k: "p",
      text: "You can [find internal medicine physicians in Bengaluru](/doctors/karnataka/bengaluru/internal-medicine-physicians) or [cardiologists in Bengaluru](/doctors/karnataka/bengaluru/cardiologists) on The Doctor Index, each with a registration you can check. If you also have [high blood pressure](/conditions/high-blood-pressure) treated with medicines, mention any dizziness at your next visit.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is my blood pressure actually too low, or normal for me?",
        "Could any of my medicines be causing this?",
        "Do I need tests for my heart, blood sugar or hormones?",
        "Should I drink more fluids or take more salt, and how much is safe for me?",
        "Is it safe for me to drive?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is low blood pressure dangerous?",
      a: "Often not. Many healthy people have low readings and no symptoms, and do not need treatment. It becomes a concern when it causes dizziness, fainting or falls, when it drops suddenly, or when it comes with other symptoms that point to dehydration, heart problems, bleeding or infection.",
    },
    {
      q: "What should I do immediately when I feel BP low?",
      a: "Sit or lie down straight away, with your legs raised if possible, so you do not fall. If you have been sweating, have had diarrhoea or have not drunk enough, sip water or an oral rehydration solution once you feel steady. If symptoms do not settle, or come with chest pain or breathlessness, get help.",
    },
    {
      q: "Can dehydration in summer cause low blood pressure?",
      a: "Yes. Losing fluid through sweat in hot weather, especially when you are working outdoors, fasting, ill with diarrhoea or not drinking enough, reduces the volume of blood and can lower blood pressure. Older adults and people on water tablets are particularly at risk.",
    },
    {
      q: "Is it normal to have low blood pressure in pregnancy?",
      a: "Blood pressure normally falls in the first half of pregnancy, which can cause dizziness, especially on standing quickly. Lying on your left side and getting up slowly can help. Tell your gynaecologist about fainting, severe dizziness or any bleeding.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Low Blood Pressure", url: "https://medlineplus.gov/lowbloodpressure.html" },
    { label: "Emergency Response Support System, Government of India — 112", url: "https://112.gov.in/" },
  ],
};
