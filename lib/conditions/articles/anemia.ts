import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "anemia",
  title: "Anaemia (anemia): symptoms, causes, tests, treatment and which doctor to see",
  metaTitle: "Anaemia (anemia): symptoms, causes, tests and treatment",
  standfirst: "What anaemia is, why it is so common in India, the tests that find its cause, how it is treated, and when to see a doctor.",
  targetQuery: "anemia symptoms causes and treatment",
  department: "haematology",
  specialty: "internal-medicine",
  alsoSee: ["haematology", "gynaecology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Tiredness", "Breathlessness", "Pale skin", "Dizziness", "Palpitations", "Headache", "Brittle nails"],
  tests: ["Complete blood count", "Haemoglobin", "Serum ferritin", "Peripheral smear", "Vitamin B12", "Haemoglobin electrophoresis", "Stool test"],
  treatments: ["Iron tablets", "Intravenous iron", "Vitamin B12", "Folic acid", "Blood transfusion", "Deworming"],
  body: [
    { k: "h2", text: "What anaemia is" },
    {
      k: "p",
      text: "Anaemia means the blood has fewer healthy red blood cells, or less haemoglobin, than it should. Haemoglobin is the iron-rich protein in red cells that carries oxygen from the lungs to every part of the body. When it is low, the tissues get less oxygen, and you feel it as tiredness, breathlessness and a lack of stamina.",
    },
    {
      k: "p",
      text: "Anaemia is not a single disease but a sign that something else is going on. It happens in three broad ways: the body loses blood, it does not make enough red cells, or it destroys them faster than it replaces them. Finding which of these is happening, and why, is the key to treating it properly.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Mild anaemia often causes no symptoms. As it worsens, people notice:" },
    {
      k: "ul",
      items: [
        "Tiredness and weakness, and less stamina than before",
        "Breathlessness on exertion, such as climbing stairs",
        "Pale skin, pale inner eyelids or pale nails",
        "Dizziness or light-headedness",
        "Palpitations or a fast heartbeat",
        "Headache and difficulty concentrating",
        "Brittle nails, hair fall, or a sore tongue and cracks at the corners of the mouth",
        "Cravings for ice, raw rice, chalk or mud, which can be a sign of iron deficiency",
      ],
    },
    {
      k: "p",
      text: "Anaemia that develops slowly can become quite severe before it is noticed, because the body adapts. In children it can affect growth, learning and concentration, and in pregnancy it affects both mother and baby.",
    },

    { k: "h2", text: "Causes and who is at risk in India" },
    {
      k: "p",
      text: "Iron deficiency is the most common cause in India, but it is not the only one. Common causes include:",
    },
    {
      k: "ul",
      items: [
        "**Low iron intake or absorption** — diets low in iron-rich foods, and drinking tea or coffee with meals, which reduces absorption",
        "**Blood loss** — heavy periods, bleeding piles, stomach ulcers, regular use of painkillers that irritate the stomach, and bowel conditions including cancer in older adults",
        "**Hookworm and other worm infections**, especially where people walk barefoot or sanitation is poor",
        "**Pregnancy and breastfeeding**, which raise the body's need for iron and folate",
        "**Vitamin B12 deficiency**, common in people on vegetarian diets, and **folate deficiency**",
        "**Inherited conditions** — thalassaemia trait and sickle cell disease, which are more common in some communities and regions",
        "**Long-term illness** — kidney disease, tuberculosis, rheumatoid arthritis and other inflammatory conditions",
      ],
    },
    {
      k: "p",
      text: "Women of reproductive age, pregnant women, adolescents and young children are at highest risk. The government's Anaemia Mukt Bharat programme provides iron and folic acid supplements, deworming and haemoglobin testing for these groups through schools, anganwadis and government health centres. Under the National Sickle Cell Anaemia Elimination Mission, people up to the age of 40 in high-focus districts are being screened for sickle cell disease and given a card showing their genetic status.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Anaemia is confirmed with a blood test. The next step — finding the cause — matters just as much. Tests commonly include:",
    },
    {
      k: "ul",
      items: [
        "**Complete blood count** — measures **haemoglobin**, the number of red cells and their size. Small red cells suggest iron deficiency or thalassaemia; large ones suggest vitamin B12 or folate deficiency.",
        "**Serum ferritin** — reflects the body's iron stores. It can read falsely normal during infection or inflammation.",
        "**Peripheral smear** — a doctor looks at the blood cells under a microscope.",
        "**Vitamin B12** and folate levels.",
        "**Haemoglobin electrophoresis** or a similar test, to look for thalassaemia trait or sickle cell disease.",
        "A **stool test** for hidden blood or worm eggs, and kidney and liver function tests.",
      ],
    },
    {
      k: "p",
      text: "Men and women past menopause with iron deficiency usually need an endoscopy or colonoscopy to look for bleeding in the gut, because no other source is obvious. Women with heavy periods may need a pelvic examination and ultrasound.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "An [internal medicine physician](/specialties/internal-medicine) or a [general physician](/specialties/general-practice) can investigate and treat most anaemia. A [haematologist](/specialties/haematology) is involved when the cause is unclear, when other blood counts are also abnormal, when an inherited condition such as thalassaemia or sickle cell disease is found, or when anaemia does not respond to treatment.",
    },
    {
      k: "p",
      text: "A [gynaecologist](/specialties/gynaecology) treats heavy periods and anaemia in pregnancy, and a gastroenterologist investigates bleeding from the gut. You can [find internal medicine physicians in Bengaluru](/doctors/karnataka/bengaluru/internal-medicine-physicians) or [haematologists in Bengaluru](/doctors/karnataka/bengaluru/haematologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment corrects the anaemia and, just as importantly, the reason for it. Taking iron without knowing the cause can delay the diagnosis of bleeding, and it does not help — and can harm — people with thalassaemia trait who are not iron deficient.",
    },
    {
      k: "ul",
      items: [
        "**Iron tablets** or syrup for iron deficiency, usually for some months after haemoglobin recovers, to rebuild stores. Stomach upset and dark stools are common; tell your doctor if they bother you, as the schedule can be changed.",
        "**Intravenous iron**, given in hospital or a day-care setting, when tablets are not tolerated or absorbed, in later pregnancy, or when faster correction is needed.",
        "**Vitamin B12** as tablets or injections, and **folic acid** tablets, for those deficiencies.",
        "**Deworming** medicine when worms are a likely cause.",
        "Treatment of the source of bleeding, such as heavy periods or a stomach ulcer.",
        "**Blood transfusion** for severe anaemia with symptoms, or in some inherited conditions, under specialist care.",
      ],
    },
    { k: "h3", text: "Food that helps" },
    {
      k: "p",
      text: "Food alone rarely corrects established iron deficiency, but it helps prevent it. Good sources include green leafy vegetables, pulses, ragi and other millets, jaggery, dates, eggs, meat, fish and liver. Vitamin C from amla, guava, citrus fruit or lemon squeezed on food improves iron absorption, while tea and coffee are best kept away from mealtimes.",
    },

    { k: "h2", text: "Living with it: follow-up" },
    {
      k: "ul",
      items: [
        "A repeat blood count a few weeks after starting treatment, to check it is working",
        "A further check after the course ends, as your doctor advises",
        "Regular checks during pregnancy",
        "Family testing and counselling before marriage or pregnancy if thalassaemia trait or sickle cell disease is found",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Chest pain, severe breathlessness or fainting",
        "Black, tarry stools or vomiting blood",
        "Very heavy bleeding from any site",
        "In someone with sickle cell disease: severe pain, fever, breathlessness, chest pain, sudden weakness or a painful erection that will not go away",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What type of anaemia do I have, and what is causing it?",
        "Do I need tests to look for bleeding?",
        "Should I be tested for thalassaemia or sickle cell disease?",
        "How should I take my iron or other treatment, and for how long?",
        "When should my blood count be rechecked?",
        "Should my family members be tested?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can I take iron tablets on my own if I feel tired?",
      a: "It is better not to. Tiredness has many causes, and not all anaemia is due to iron deficiency. Taking iron unnecessarily can hide bleeding that needs investigation and is harmful in some inherited blood conditions. Get a blood test and a doctor's advice first.",
    },
    {
      q: "Is thalassaemia trait the same as iron deficiency?",
      a: "No. Both cause small red blood cells, so they are often confused on a blood count. Thalassaemia trait is inherited and usually needs no treatment, but it matters when planning a family. A haemoglobin electrophoresis test tells the two apart.",
    },
    {
      q: "Can vegetarians get enough iron and vitamin B12?",
      a: "Iron, yes, with planning — pulses, greens, millets and jaggery, eaten with a source of vitamin C. Vitamin B12 is mostly found in animal foods, so vegetarians who eat little dairy may need supplements. Your doctor can check your levels.",
    },
    {
      q: "How long does it take to recover from anaemia?",
      a: "With the right treatment, haemoglobin usually starts to rise within a few weeks, and energy improves gradually. Iron stores take longer to refill, which is why iron treatment often continues for some months after the blood count looks normal.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Anemia", url: "https://medlineplus.gov/anemia.html" },
    { label: "World Health Organization — Anaemia fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/anaemia" },
    { label: "Press Information Bureau, MoHFW — Details of Anemia Mukt Bharat", url: "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2042053" },
    { label: "Press Information Bureau — National Sickle Cell Anaemia Elimination Mission launched", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1936735" },
  ],
};
