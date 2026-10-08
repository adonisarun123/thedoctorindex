import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "covid-19-coronavirus-disease-2019",
  title: "COVID-19: symptoms, tests, treatment and which doctor to see",
  standfirst: "What COVID-19 is today, the symptoms, when to test, how to care for yourself at home, the warning signs that need hospital, and which doctor to see.",
  targetQuery: "covid 19 symptoms and treatment",
  department: "infectious-diseases",
  specialty: "general-practice",
  alsoSee: ["infectious-diseases", "pulmonology", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Fever", "Cough", "Sore throat", "Tiredness", "Loss of smell or taste", "Breathlessness"],
  tests: ["Rapid antigen test", "RT-PCR", "Pulse oximeter", "Chest X-ray"],
  treatments: ["Rest and fluids", "Fever medicines", "Antiviral medicines", "Oxygen", "Vaccination"],
  body: [
    { k: "h2", text: "What COVID-19 is" },
    {
      k: "p",
      text: "COVID-19 is an infection caused by a coronavirus called SARS-CoV-2. It spreads from person to person through droplets and much smaller particles in the air when an infected person breathes, talks, coughs or sneezes, especially indoors and in crowded, poorly ventilated places. It can also spread before a person knows they are ill.",
    },
    {
      k: "p",
      text: "Since the pandemic years, most people have built up some protection from vaccination, past infection or both. For most healthy people COVID-19 now feels like a cold or [flu](/conditions/flu) and settles within a week or two. But it can still cause serious illness, particularly in older people, people with long-term conditions and people with weakened immunity. New variants continue to appear, so advice on testing and vaccination may change; follow your doctor and current official guidance.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually start a few days after exposure. They vary from person to person and from one variant to another. Common ones include:",
    },
    {
      k: "ul",
      items: [
        "Fever or chills",
        "Cough",
        "Sore throat, runny or blocked nose",
        "Tiredness, body ache and headache",
        "Loss of smell or taste, which is less common than it was early in the pandemic",
        "Breathlessness",
        "Nausea, vomiting or loose stools in some people",
      ],
    },
    {
      k: "p",
      text: "Because these symptoms overlap with flu, the [common cold](/conditions/common-cold), and in India with [dengue](/conditions/dengue) and other monsoon fevers, you cannot tell COVID-19 apart by symptoms alone. A fever that lasts more than a few days, or comes with severe body pain, rash or bleeding, needs a doctor's assessment whatever the cause.",
    },

    { k: "h2", text: "Who is at higher risk of severe illness" },
    {
      k: "ul",
      items: [
        "Older adults, with the risk rising with age",
        "People with diabetes, heart disease, high blood pressure, chronic lung disease, kidney or liver disease, or obesity",
        "People with weakened immunity, for example from cancer treatment, an organ transplant, uncontrolled HIV or long-term steroids",
        "Pregnant women",
        "People who are not up to date with recommended vaccination",
      ],
    },
    {
      k: "p",
      text: "If you are in one of these groups, contact a doctor early in the illness, because some treatments work best when started within the first few days of symptoms.",
    },

    { k: "h2", text: "Testing" },
    {
      k: "ul",
      items: [
        "**Rapid antigen test** — a nose swab with a result in minutes. Home kits are available at pharmacies. A negative result early in the illness can be wrong, so repeating it after a day or two is often advised.",
        "**RT-PCR** — a laboratory test on a nose or throat swab. It is more sensitive and is used when an accurate answer matters, such as before treatment, surgery or travel.",
        "**Pulse oximeter** — a small clip on the finger that measures oxygen level. It is useful for monitoring at home, especially for higher-risk people. Readings can be less accurate with cold fingers, nail polish and in some people with darker skin, so treat symptoms as seriously as numbers.",
        "**Chest X-ray** and blood tests if a doctor suspects pneumonia or is assessing how unwell you are.",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Most people recover at home. The usual care is **rest and fluids**: drink enough water, coconut water, soups or oral rehydration solution, eat light food, and rest until you feel better. **Fever medicines** such as paracetamol can ease fever and aches; check with a doctor or pharmacist about what is safe for you, especially if you have liver or kidney disease.",
    },
    {
      k: "p",
      text: "For people at higher risk of severe illness, a doctor may prescribe **antiviral medicines** early in the infection to lower the chance of hospital admission. These need a prescription, are not suitable for everyone and can interact with other medicines, so do not buy or start them on your own. Antibiotics do not treat COVID-19 and should only be used if a doctor finds a bacterial infection as well. Avoid taking steroids unless a doctor prescribes them, because at the wrong time they can do harm and raise blood sugar.",
    },
    {
      k: "p",
      text: "People with severe illness are treated in hospital, where they may need **oxygen**, treatment for [pneumonia](/conditions/pneumonia) or blood clots, and in the most serious cases intensive care.",
    },

    { k: "h2", text: "Preventing spread and protecting yourself" },
    {
      k: "ul",
      items: [
        "**Vaccination** reduces the risk of severe illness and death. Ask your doctor whether a further dose is advised for you, especially if you are older or have a long-term condition.",
        "Stay home while you have fever or feel unwell, and keep away from older and vulnerable family members as far as you can in a shared home",
        "Wear a well-fitting mask around others while you are ill, and in crowded indoor places if you are high-risk",
        "Open windows to improve ventilation, cover coughs and sneezes, and wash hands often",
        "Keep diabetes, blood pressure and other long-term conditions well controlled",
      ],
    },

    { k: "h2", text: "Long COVID" },
    {
      k: "p",
      text: "Some people have symptoms that last for weeks or months after the infection, even after a mild illness. These include tiredness, breathlessness, brain fog, poor sleep, palpitations, and a worsening of symptoms after effort. This is often called long COVID or post-COVID condition. There is no single test for it. A doctor will check for other causes such as anaemia, thyroid problems, heart or lung damage, and diabetes, and can help you pace your activity and arrange rehabilitation.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if you or someone you are caring for has:" },
    {
      k: "ul",
      items: [
        "Difficulty breathing, or breathlessness at rest or while talking",
        "Pain or pressure in the chest that does not go away",
        "New confusion, or difficulty waking or staying awake",
        "Bluish or grey lips, face or nail beds",
        "A low oxygen reading on a pulse oximeter, along with feeling unwell",
        "In a child: fast breathing, chest drawing in, refusing feeds, or unusual drowsiness",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "For most people, a [general physician](/specialties/general-practice) or family doctor is the right first contact, including by phone or teleconsultation. Children should see a [paediatrician](/specialties/paediatrics). An [infectious disease specialist](/specialties/infectious-diseases) may be involved for people with weakened immunity or complicated illness, and a [pulmonologist](/specialties/pulmonology) for lung problems or breathlessness that lasts after recovery.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) or [pulmonologists in Bengaluru](/doctors/karnataka/bengaluru/pulmonologists) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "How long am I contagious with COVID-19?",
      a: "People are usually most infectious in the first few days of symptoms, and sometimes just before they start. Staying home until the fever has settled and you feel better, then wearing a mask around others for a few more days, lowers the risk to others.",
    },
    {
      q: "Is a home rapid test reliable?",
      a: "A positive home test is usually correct. A negative test early in the illness can miss the infection, so repeat it after a day or two if symptoms continue. Your doctor may advise an RT-PCR test if the result will change treatment.",
    },
    {
      q: "Can I get COVID-19 more than once?",
      a: "Yes. Protection from vaccination and past infection fades over time, and new variants can partly escape it. Reinfections are usually milder, but older and high-risk people can still become seriously ill, which is why vaccination advice is updated.",
    },
    {
      q: "Should I take antibiotics for COVID-19?",
      a: "No, not routinely. COVID-19 is caused by a virus and antibiotics do not act on viruses. A doctor may prescribe them only if there are signs of a bacterial infection such as some kinds of pneumonia. Unnecessary antibiotics add side effects and resistance.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — COVID-19 (Coronavirus Disease 2019)", url: "https://medlineplus.gov/covid19coronavirusdisease2019.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
