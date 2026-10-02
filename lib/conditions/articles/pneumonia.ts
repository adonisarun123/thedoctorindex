import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "pneumonia",
  title: "Pneumonia: symptoms, tests, treatment and danger signs",
  standfirst: "What pneumonia is, the symptoms in adults and the danger signs in children, how it is diagnosed and treated, and how vaccines help prevent it.",
  targetQuery: "pneumonia symptoms and treatment",
  department: "infectious-diseases",
  specialty: "pulmonology",
  alsoSee: ["general-practice", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Fever", "Cough with phlegm", "Breathlessness", "Chest pain", "Fast breathing", "Confusion"],
  tests: ["Chest X-ray", "Pulse oximetry", "Blood tests", "Sputum test"],
  treatments: ["Antibiotics", "Fluids and rest", "Oxygen", "Hospital care", "Vaccination"],
  body: [
    { k: "h2", text: "What pneumonia is" },
    {
      k: "p",
      text: "Pneumonia is an infection of the lungs in which the tiny air sacs fill with fluid and pus, making it harder for oxygen to pass into the blood. It can affect a small part of one lung or large areas of both.",
    },
    {
      k: "p",
      text: "Bacteria are the commonest cause in adults, with *Streptococcus pneumoniae* (pneumococcus) the most frequent. Viruses, including influenza, RSV and the COVID-19 virus, also cause pneumonia, particularly in young children, and fungi cause it mainly in people with weak immunity. Most pneumonia is caught in the community; pneumonia that starts in hospital, or after inhaling food or vomit, is treated differently.",
    },
    {
      k: "p",
      text: "Many people recover at home with treatment, but pneumonia can be serious, especially in young children, older adults and people with other illnesses. It remains a leading cause of death in children under five worldwide.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "In adults, symptoms usually build over a day or a few days:" },
    {
      k: "ul",
      items: [
        "Fever, chills or shivering",
        "Cough with phlegm, which may be yellow, green or blood-streaked",
        "Breathlessness, or fast breathing",
        "Chest pain that is sharp and worse on breathing in or coughing",
        "Tiredness, loss of appetite, muscle aches",
        "Confusion, drowsiness or a fall — sometimes the only sign in older people",
      ],
    },
    {
      k: "p",
      text: "In babies and young children, look for fast breathing, the skin pulling in below the ribs with each breath (chest indrawing), grunting, poor feeding, and unusual sleepiness. Fever may be absent in very young infants.",
    },

    { k: "h2", text: "Who is at higher risk in India" },
    {
      k: "ul",
      items: [
        "Children under two and adults over sixty-five",
        "Smokers, and people exposed to smoke from cooking on wood or dung fires",
        "People with COPD, asthma, heart failure, diabetes, kidney or liver disease",
        "People with weakened immunity, including those with HIV or on long-term steroids",
        "Undernourished children, and babies who are not breastfed",
        "People who have trouble swallowing, such as after a stroke",
        "Anyone recovering from influenza or another viral infection",
      ],
    },
    {
      k: "p",
      text: "In India, tuberculosis can look very like pneumonia. A cough that does not settle with treatment, or that comes with weight loss and night sweats, should be tested for TB.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Pneumonia is suspected from your symptoms and from listening to your chest. Tests confirm it, judge severity and guide treatment:",
    },
    {
      k: "ul",
      items: [
        "**Chest X-ray** — shows the area of infection and complications such as fluid around the lung.",
        "**Pulse oximetry** — a finger clip that measures blood oxygen, an important sign of how unwell you are.",
        "**Blood tests** — a blood count, markers of inflammation, kidney function and sometimes blood cultures.",
        "**Sputum test** — to identify the germ and look for TB, especially if you are admitted or not improving.",
      ],
    },
    {
      k: "p",
      text: "Doctors also check your breathing rate, blood pressure, pulse and mental alertness, and use simple scoring systems to decide whether you can be treated at home or need hospital care.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most adults with pneumonia are first seen by a [general physician](/specialties/general-practice), and children by a [paediatrician](/specialties/paediatrics). A [pulmonologist](/specialties/pulmonology) is involved for severe pneumonia, pneumonia that keeps returning or is slow to clear, complications such as fluid or pus around the lung, or when TB or another lung disease is possible.",
    },
    {
      k: "p",
      text: "You can [find pulmonologists in Bengaluru](/doctors/karnataka/bengaluru/pulmonologists), [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "**Antibiotics** are the main treatment for bacterial pneumonia, chosen according to your age, severity, other illnesses and local patterns of resistance. Take the full course as prescribed, even when you feel better, and do not use leftover antibiotics or buy them without a prescription. Viral pneumonia does not respond to antibiotics, although doctors often give them when a bacterial cause cannot be ruled out, and antiviral medicines are used for influenza in some cases.",
    },
    {
      k: "p",
      text: "At home, **fluids and rest** help recovery. Paracetamol can ease fever and pain; ask your doctor which painkiller suits you. Cough syrups that suppress the cough are generally not recommended, because coughing helps clear the lungs.",
    },
    {
      k: "p",
      text: "**Hospital care** is needed for people with low oxygen, fast breathing, confusion, low blood pressure, or who cannot eat and drink, and for many young infants. There, **oxygen**, antibiotics through a drip and fluids can be given, and complications treated. A small number need intensive care.",
    },
    {
      k: "p",
      text: "Expect fever to settle within a few days of treatment, but cough and tiredness can last for weeks. If you are not improving after a couple of days of antibiotics, contact your doctor. Older adults and smokers are often advised a follow-up chest X-ray some weeks later to make sure the lung has cleared.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "ul",
      items: [
        "**Vaccination** — India's Universal Immunisation Programme includes pneumococcal, pentavalent (which covers Hib and whooping cough) and measles-rubella vaccines, free at government health centres. These protect against important causes of pneumonia in children. Adults over sixty-five and people with long-term illnesses should ask about pneumococcal and yearly influenza vaccines.",
        "Stop smoking and keep children away from tobacco and cooking smoke",
        "Breastfeed babies, ideally exclusively for the first six months",
        "Wash hands regularly, and cover coughs and sneezes",
        "Keep diabetes and other long-term conditions well controlled",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Severe breathlessness, or difficulty speaking in full sentences",
        "Blue or grey lips, face or fingertips",
        "New confusion, drowsiness or collapse",
        "Chest pain with a racing heart or very low blood pressure",
        "In a child: chest indrawing, grunting, inability to drink or breastfeed, fits, or unusual sleepiness",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "How severe is my pneumonia, and is it safe to be treated at home?",
        "What is the likely cause, and which antibiotic am I taking?",
        "When should I expect to feel better, and what should make me come back?",
        "Should I be tested for TB?",
        "Do I need a follow-up X-ray?",
        "Which vaccines should I or my child have?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is pneumonia contagious?",
      a: "The germs that cause pneumonia can spread through coughs and sneezes, but most people exposed to them do not develop pneumonia. Covering coughs, washing hands and staying away from vulnerable people while you are unwell all reduce the spread.",
    },
    {
      q: "How long does it take to recover from pneumonia?",
      a: "Fever usually settles within a few days of treatment. Cough, tiredness and breathlessness can take several weeks to clear, longer in older people. Return to work and exercise gradually, and see your doctor if you stop improving.",
    },
    {
      q: "What is 'walking pneumonia'?",
      a: "It is an informal term for a mild pneumonia in which people feel unwell but not ill enough to stay in bed. It is often caused by bacteria such as Mycoplasma. It still needs a doctor's assessment and often antibiotics.",
    },
    {
      q: "Can adults get a pneumonia vaccine?",
      a: "Yes. Pneumococcal vaccines are recommended for older adults and for people with conditions such as diabetes, heart, lung, kidney or liver disease, or weak immunity. A yearly influenza vaccine also lowers the risk. Your doctor can advise which you need.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Pneumonia", url: "https://medlineplus.gov/pneumonia.html" },
    { label: "World Health Organization — Pneumonia in children fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/pneumonia" },
    { label: "Press Information Bureau, MoHFW — Celebrating the Power of Vaccines (Universal Immunisation Programme schedule)", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2241066" },
  ],
};
