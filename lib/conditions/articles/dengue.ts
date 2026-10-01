import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "dengue",
  title: "Dengue fever: symptoms, warning signs, tests and care",
  standfirst: "What dengue is, the warning signs that matter most as the fever falls, the tests used, safe care at home, and when to go to hospital.",
  targetQuery: "dengue symptoms and warning signs",
  department: "infectious-diseases",
  specialty: "general-practice",
  alsoSee: ["infectious-diseases", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["High fever", "Severe headache", "Pain behind the eyes", "Muscle and joint pains", "Rash", "Nausea and vomiting"],
  tests: ["NS1 antigen test", "IgM antibody test", "Complete blood count"],
  treatments: ["Rest", "Fluids", "Paracetamol", "Hospital care"],
  body: [
    { k: "h2", text: "What dengue is" },
    {
      k: "p",
      text: "Dengue is a viral infection spread by the bite of infected *Aedes* mosquitoes. There are four types of dengue virus, so a person can have dengue more than once. It does not spread directly from person to person through touch, coughing or sharing food.",
    },
    {
      k: "p",
      text: "Most people who are infected have a mild illness or no symptoms. Some develop a high fever with aches that lasts several days and then settles. A smaller number develop **severe dengue**, in which fluid leaks out of the blood vessels, blood pressure can fall and bleeding can occur. Severe dengue can be fatal, but with timely hospital care most people recover. The key is knowing the warning signs and acting on them early.",
    },
    {
      k: "p",
      text: "Dengue is common across India, with cases rising during and after the monsoon, when stagnant water gives mosquitoes places to breed.",
    },

    { k: "h2", text: "Symptoms and the critical phase" },
    { k: "p", text: "Symptoms usually start a few days to two weeks after the bite and may include:" },
    {
      k: "ul",
      items: [
        "High fever that comes on suddenly",
        "Severe headache",
        "Pain behind the eyes",
        "Muscle and joint pains, which gave dengue the name 'breakbone fever'",
        "Rash, often appearing a few days into the illness",
        "Nausea and vomiting, and loss of appetite",
      ],
    },
    {
      k: "p",
      text: "The most important thing to understand about dengue is timing. The dangerous phase often begins **around the time the fever goes down**, usually a few days into the illness. Many families relax when the fever breaks — this is exactly when to watch most closely. Warning signs include:",
    },
    {
      k: "ul",
      items: [
        "Severe or persistent abdominal pain",
        "Vomiting again and again",
        "Bleeding from the gums or nose, blood in vomit or stool, or black stools",
        "Fast breathing",
        "Restlessness, unusual drowsiness or irritability, especially in children",
        "Cold, clammy or pale skin",
        "Passing little or no urine",
        "Extreme thirst or weakness",
      ],
    },
    { k: "p", text: "Anyone with one of these warning signs needs to be seen in hospital the same day." },

    { k: "h2", text: "Who is at higher risk" },
    {
      k: "p",
      text: "Anyone living in or travelling to an area with dengue can be infected. Severe dengue is more likely in people who have had dengue before (a second infection with a different type), infants, pregnant women, older adults, and people with diabetes, high blood pressure, heart or kidney disease, or obesity.",
    },
    {
      k: "p",
      text: "*Aedes* mosquitoes bite mainly during the day, especially early morning and late afternoon, and breed in clean stored or stagnant water close to homes — water coolers, flower pots and their trays, overhead tanks, discarded tyres, coconut shells, buckets and construction sites.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Dengue is suspected from the symptoms and season, and confirmed with blood tests. Which test is used depends on how many days you have been ill:",
    },
    {
      k: "ul",
      items: [
        "**NS1 antigen test** — detects a part of the virus and is most useful in the first few days of fever.",
        "**IgM antibody test** — detects the body's antibody response and is more useful after the first few days. The ELISA method is more reliable than rapid card tests.",
        "**Complete blood count** — repeated during the illness to track the platelet count, the white cell count and the haematocrit, which shows whether fluid is leaking out of the blood vessels.",
      ],
    },
    {
      k: "p",
      text: "Government-designated sentinel surveillance hospitals across the country offer dengue testing, with ELISA test kits supplied by the Government of India. Your doctor may also test for malaria, chikungunya or typhoid, which can look similar.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most people with dengue are diagnosed and monitored by a [general physician](/specialties/general-practice); children should see a [paediatrician](/specialties/paediatrics). An [infectious disease specialist](/specialties/infectious-diseases) may be involved in complicated cases or when the diagnosis is unclear. Severe dengue is managed in hospital.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "There is no antiviral medicine that kills the dengue virus. Treatment supports the body while the infection runs its course, and watches closely for the critical phase.",
    },
    {
      k: "ul",
      items: [
        "**Rest**, and someone to keep an eye on you.",
        "**Fluids** — plenty of water, oral rehydration solution, coconut water, soups or fruit juice, unless your doctor advises otherwise.",
        "**Paracetamol** for fever and pain, in the dose your doctor advises for your age and weight.",
        "**Hospital care** for anyone with warning signs, severe dengue, or a higher-risk condition, where fluids can be given through a drip and blood tests repeated.",
      ],
    },
    {
      k: "note",
      tone: "alert",
      title: "Avoid painkillers that raise bleeding risk",
      text: "Do not take aspirin, ibuprofen or other non-steroidal anti-inflammatory painkillers (NSAIDs) if dengue is possible. They can increase the risk of bleeding. Ask before taking any painkiller, and avoid injections into the muscle unless a doctor says they are necessary.",
    },
    {
      k: "p",
      text: "A falling platelet count is expected in dengue and worries many families. Platelet transfusion is needed only in specific situations; your doctor will decide based on bleeding and your overall condition, not on the count alone. Papaya leaf extract and other home remedies are widely shared, but there is no reliable evidence that they prevent severe dengue, and they must never delay medical care. Do not stop any prescribed medicine on your own — ask your doctor, especially about blood thinners.",
    },

    { k: "h2", text: "Prevention and recovery" },
    {
      k: "ul",
      items: [
        "Empty, scrub and dry water containers, cooler trays and flower-pot saucers at least once a week",
        "Cover stored water and overhead tanks; clear tyres, coconut shells and rubbish that hold rainwater",
        "Wear clothing that covers arms and legs, and use mosquito repellent during the day",
        "Use window screens, mosquito nets — including for daytime naps — and vaporisers",
        "Keep someone who has dengue under a net, so mosquitoes do not carry the virus to others",
      ],
    },
    {
      k: "p",
      text: "Tiredness can last for weeks after dengue. Return to work or school gradually, and keep any follow-up blood test your doctor asks for.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest hospital straight away, for:" },
    {
      k: "ul",
      items: [
        "Any of the warning signs above, especially as the fever is settling",
        "Fainting, confusion, or a child who is unusually sleepy or difficult to wake",
        "Cold hands and feet with a weak or fast pulse",
        "Difficulty breathing",
        "Heavy bleeding of any kind",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Which test should I have, given how many days I have been ill?",
        "How often should my blood count be repeated?",
        "Which warning signs mean I should go to hospital?",
        "Is it safe to be looked after at home?",
        "Which of my usual medicines should I pause or continue?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is a low platelet count always dangerous in dengue?",
      a: "A fall in platelets is expected and on its own is not the most important danger sign. Fluid leaking from the blood vessels causes most severe illness. Your doctor watches the whole picture — warning signs, haematocrit and blood pressure — not just the platelet count.",
    },
    {
      q: "Does papaya leaf juice cure dengue?",
      a: "There is no reliable evidence that papaya leaf or any home remedy treats dengue or prevents severe disease. Some people take it alongside care, but it should never replace monitoring, fluids and timely hospital treatment. Tell your doctor about anything you are taking.",
    },
    {
      q: "Can I get dengue more than once?",
      a: "Yes. There are four types of dengue virus, and infection with one does not protect you well against the others. A second infection with a different type carries a higher chance of severe dengue, so tell your doctor if you have had dengue before.",
    },
    {
      q: "When is it safe to stop worrying after the fever goes down?",
      a: "The riskiest period is usually the day or two around the time the fever falls. If there are no warning signs, you are eating and drinking, passing urine normally and feel steadily better after that, the danger is passing. Follow your doctor's advice on repeat tests.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Dengue", url: "https://medlineplus.gov/dengue.html" },
    { label: "World Health Organization — Dengue and severe dengue fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue" },
    { label: "National Center for Vector Borne Diseases Control (NCVBDC) — Government of India initiatives for dengue and chikungunya", url: "https://ncvbdc.mohfw.gov.in/index4.php?lang=1&level=0&linkid=444&lid=3726" },
  ],
};
