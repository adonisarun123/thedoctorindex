import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "malaria",
  title: "Malaria: symptoms, testing, treatment and prevention",
  standfirst: "What malaria is, the fever pattern to watch for, why you must test before treating, how it is treated in India, and how to prevent mosquito bites.",
  targetQuery: "malaria symptoms test and treatment",
  department: "infectious-diseases",
  specialty: "general-practice",
  alsoSee: ["infectious-diseases", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Fever", "Chills and shivering", "Sweating", "Headache", "Body aches", "Vomiting"],
  tests: ["Rapid diagnostic test", "Blood smear microscopy", "G6PD test"],
  treatments: ["Artemisinin-based combination therapy", "Primaquine", "Hospital care"],
  body: [
    { k: "h2", text: "What malaria is" },
    {
      k: "p",
      text: "Malaria is an infection caused by *Plasmodium* parasites, spread by the bite of infected female *Anopheles* mosquitoes, which bite mainly from dusk to dawn. The parasites travel to the liver, multiply, and then invade red blood cells, causing fever and illness. Malaria does not spread directly from person to person, though rarely it passes through blood transfusion or from mother to baby.",
    },
    {
      k: "p",
      text: "In India, the two main types are *Plasmodium vivax* and *Plasmodium falciparum*. **Falciparum malaria** can become severe within a day or two and affect the brain, kidneys and lungs; it can be fatal if treatment is delayed. **Vivax malaria** is usually less severe but can hide in the liver and cause repeated attacks months later unless a specific medicine is given. Both are treatable when diagnosed early.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually start one to several weeks after an infected bite, or longer with vivax. They include:",
    },
    {
      k: "ul",
      items: [
        "Fever, which may come in bouts",
        "Chills and shivering, followed by sweating as the fever breaks",
        "Headache",
        "Body aches and tiredness",
        "Nausea, vomiting, or loss of appetite",
      ],
    },
    {
      k: "p",
      text: "The textbook pattern of fever every second or third day is often absent, so malaria cannot be recognised from the fever pattern alone. It looks very similar to dengue, typhoid, chikungunya and other infections. In children, malaria may show as fever with drowsiness, poor feeding or fits.",
    },

    { k: "h2", text: "Who is at higher risk in India" },
    {
      k: "p",
      text: "Malaria occurs in many parts of India, especially forested and tribal areas, parts of the north-east and central India, and some cities, with more cases during and after the monsoon. Severe malaria is more likely in:",
    },
    {
      k: "ul",
      items: [
        "Young children",
        "Pregnant women, in whom malaria also harms the baby",
        "People with weakened immunity, including those with HIV",
        "Travellers and migrants from areas with little malaria, who have no partial immunity",
        "Anyone whose treatment is delayed",
      ],
    },
    {
      k: "p",
      text: "*Anopheles* mosquitoes breed in clean or slightly dirty standing water — puddles, ponds, rice fields, wells, water tanks and construction sites.",
    },

    { k: "h2", text: "How it is diagnosed: always test first" },
    {
      k: "p",
      text: "Malaria must be confirmed with a blood test before treatment. Under India's national programme, every suspected case is meant to be confirmed with a rapid test or microscopy, and treated according to national guidelines.",
    },
    {
      k: "ul",
      items: [
        "**Rapid diagnostic test** (RDT) — a finger-prick test that gives a result in minutes and can tell falciparum from vivax. The Government of India supplies these kits free of cost to the public health system, and in many areas ASHAs and health workers carry them.",
        "**Blood smear microscopy** — a drop of blood examined under a microscope. It confirms the type of parasite and how many there are, which helps judge severity and follow-up.",
        "**G6PD test** — checks for an inherited enzyme deficiency before primaquine is given, because the medicine can break down red blood cells in people who lack it.",
      ],
    },
    {
      k: "p",
      text: "A negative test does not always rule out malaria early on; if fever continues, the test may be repeated. Blood count, kidney and liver tests, and blood sugar are checked when malaria is severe.",
    },
    {
      k: "note",
      tone: "alert",
      title: "Never treat malaria on a guess",
      text: "Do not take antimalarial tablets just because you have fever, or because they worked for someone else. Taking them without a test can hide the real cause of your fever, give the wrong medicine for the type of malaria, and help parasites become resistant. Get tested first.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most malaria is diagnosed and treated by a [general physician](/specialties/general-practice) or at a government health centre, and children by a [paediatrician](/specialties/paediatrics). An [infectious disease specialist](/specialties/infectious-diseases) may be involved for severe or complicated malaria, malaria in pregnancy, or repeated attacks. Severe malaria is treated in hospital.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians), [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) or [infectious disease specialists in Bengaluru](/doctors/karnataka/bengaluru/infectious-disease-specialists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment depends on the type of malaria, its severity, your age, and whether you are pregnant. Your doctor follows national guidelines.",
    },
    {
      k: "ul",
      items: [
        "**Falciparum malaria** is treated with **artemisinin-based combination therapy** — an artemisinin medicine combined with a partner drug, taken over a few days.",
        "**Vivax malaria** is treated with a medicine to clear the blood, followed by **primaquine** to clear the hidden liver stage and prevent relapse. Primaquine is not given to pregnant women, young infants or people with severe G6PD deficiency.",
        "**Hospital care** is needed for severe malaria — confusion, fits, breathing difficulty, jaundice, very little urine, severe anaemia, repeated vomiting or inability to take tablets. Injectable treatment is given there.",
      ],
    },
    {
      k: "p",
      text: "Take every dose for the full course, even when the fever has gone. Stopping early can let the infection return. Paracetamol can be used for fever on your doctor's advice. Do not stop or change your medicines on your own, and report back if fever continues or returns.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "ul",
      items: [
        "Sleep under an insecticide-treated bed net (long-lasting insecticidal net), especially children and pregnant women",
        "Use mosquito repellent and wear clothing that covers arms and legs in the evening and at night",
        "Fit screens on windows and doors",
        "Remove standing water around the home, and cooperate with indoor spraying where it is carried out",
        "Travellers to high-malaria areas should ask a doctor before travel whether preventive medicine is advised",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest hospital straight away, for fever in someone with possible malaria plus:" },
    {
      k: "ul",
      items: [
        "Confusion, extreme drowsiness or fits",
        "Difficulty breathing",
        "Yellow eyes or skin, or very dark urine",
        "Passing very little urine",
        "Repeated vomiting or inability to drink",
        "Unusual bleeding, severe weakness or collapse",
        "A young child who is very sleepy, will not feed or has a fit",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Has malaria been confirmed with a test, and which type is it?",
        "Is this severe malaria, and do I need to be admitted?",
        "How long do I take the medicine, and what if I vomit a dose?",
        "Do I need primaquine, and have I been tested for G6PD?",
        "When should I return if the fever does not settle?",
        "How can my family avoid malaria?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can I take malaria tablets just in case when I have fever?",
      a: "No. Fever has many causes, and antimalarials taken without a test can hide the real illness, give the wrong treatment for the type of malaria, and encourage resistance. A rapid test or blood smear takes little time and should come first.",
    },
    {
      q: "Why can vivax malaria come back months later?",
      a: "Vivax parasites can stay dormant in the liver after the blood infection has been treated, and later reawaken. A course of primaquine clears this liver stage. Completing it, after a G6PD test, reduces the chance of relapse.",
    },
    {
      q: "Can I get malaria more than once?",
      a: "Yes. Having malaria does not give lasting protection, and you can be infected again by another mosquito bite. People living in malaria areas should keep using bed nets and repellents and get tested each time they develop fever.",
    },
    {
      q: "Is malaria dangerous in pregnancy?",
      a: "Yes. Malaria in pregnancy can cause severe illness in the mother, anaemia, miscarriage, early birth and low birth weight. Pregnant women with fever should be tested promptly, and treatment is chosen to be safe for the stage of pregnancy.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Malaria", url: "https://medlineplus.gov/malaria.html" },
    { label: "World Health Organization — Malaria fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/malaria" },
    { label: "National Center for Vector Borne Diseases Control (NCVBDC) — Malaria control strategies", url: "https://ncvbdc.mohfw.gov.in/index4.php?lang=1&level=0&linkid=421&lid=3707" },
    { label: "NCVBDC — How to detect, treat and prevent malaria (guide for ASHAs)", url: "https://ncvbdc.mohfw.gov.in/WriteReadData/l892s/Detect-Treat-prevent-malaria.pdf" },
  ],
};
