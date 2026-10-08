import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "flu",
  title: "Flu (influenza): symptoms, treatment and which doctor to see",
  metaTitle: "Flu (influenza): symptoms, treatment and doctor to see",
  standfirst: "How flu differs from a cold, who is at higher risk, when antiviral medicines help, the warning signs of complications, and why a yearly vaccine matters.",
  targetQuery: "flu symptoms and treatment",
  department: "infectious-diseases",
  specialty: "general-practice",
  alsoSee: ["paediatrics", "pulmonology", "infectious-diseases"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Fever", "Body ache", "Headache", "Dry cough", "Sore throat", "Tiredness"],
  tests: ["Nasal swab", "RT-PCR", "Rapid antigen test"],
  treatments: ["Rest and fluids", "Paracetamol", "Antiviral medicines", "Flu vaccine"],
  body: [
    { k: "h2", text: "What flu is" },
    {
      k: "p",
      text: "Influenza, usually called flu, is an infection of the nose, throat and lungs caused by influenza viruses. It is not the same as a [common cold](/conditions/common-cold), although the two are often confused. Flu tends to hit suddenly and hard: many people describe going from well to bed-bound within a few hours, with high fever and aches all over.",
    },
    {
      k: "p",
      text: "Most healthy people recover at home within a week or two. But flu can be serious, and sometimes life-threatening, in babies and young children, older people, pregnant women and anyone with long-term illnesses. In India, flu circulates through the year, with seasonal rises that in many regions follow the monsoon and the winter months. The strain known in India as swine flu, H1N1, is one type of influenza A and is now one of the seasonal flu strains.",
    },
    {
      k: "p",
      text: "Flu viruses change a little every year. That is why having had flu before, or a vaccine in an earlier year, does not give lasting protection, and why the vaccine is updated each season.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Flu symptoms usually start suddenly, one to four days after catching the virus:" },
    {
      k: "ul",
      items: [
        "Fever, often high, with chills and shivering",
        "Body ache and muscle pain, often severe",
        "Headache",
        "Dry cough, which can linger for a couple of weeks",
        "Sore throat and a runny or blocked nose",
        "Tiredness and weakness that can last for days after the fever settles",
        "Vomiting and diarrhoea, which are more common in children",
      ],
    },
    {
      k: "p",
      text: "A cold usually builds slowly, with sneezing and a runny nose, and rarely causes high fever or makes you too unwell to get out of bed. Flu, COVID-19 and early [dengue](/conditions/dengue) can look similar in the first days, particularly during the monsoon, so tell your doctor about mosquito bites, travel and contact with anyone ill.",
    },

    { k: "h2", text: "How it spreads and who is at risk" },
    {
      k: "p",
      text: "Flu spreads through droplets when an infected person coughs, sneezes or talks, and less often through touching a contaminated surface and then your eyes, nose or mouth. People are most infectious in the first few days of illness, and can spread it just before symptoms start. Crowded homes, offices, schools and public transport help it spread.",
    },
    { k: "p", text: "People at higher risk of complications include:" },
    {
      k: "ul",
      items: [
        "Children under five, and especially babies",
        "Adults over sixty-five",
        "Pregnant women, and women who have recently given birth",
        "People with asthma, COPD, heart disease, diabetes, kidney or liver disease",
        "People with a weakened immune system from illness or medicines",
        "People who are severely overweight",
      ],
    },
    { k: "h3", text: "Complications" },
    {
      k: "p",
      text: "Flu can lead to [pneumonia](/conditions/pneumonia), from the virus itself or a bacterial infection on top of it, as well as [bronchitis](/conditions/acute-bronchitis), ear and sinus infections and dehydration. It can make long-term conditions worse — for example triggering an [asthma](/conditions/asthma) attack or worsening heart failure — and in rare cases causes inflammation of the heart, brain or muscles.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Most flu is diagnosed from the symptoms, especially when it is going around. Testing is done when the result would change treatment, for people who are very unwell or at high risk, in hospitals, and during outbreaks. A **nasal swab** or throat swab is taken and tested:",
    },
    {
      k: "ul",
      items: [
        "**Rapid antigen test** — results quickly, but can miss some infections",
        "**RT-PCR** — more accurate, takes longer, and can identify the flu type; it is often done together with a COVID-19 test",
      ],
    },
    {
      k: "p",
      text: "A doctor may also check oxygen levels and arrange a chest X-ray or blood tests if pneumonia or another complication is suspected.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Care at home" },
    {
      k: "ul",
      items: [
        "**Rest and fluids** — water, oral rehydration solution, coconut water, soups and dal water help prevent dehydration",
        "**Paracetamol** for fever and aches, at the dose on the label or as advised; do not exceed the daily limit, and remember many cold remedies also contain paracetamol",
        "Never give aspirin to children or teenagers with flu, because of the risk of a rare but serious condition called Reye's syndrome",
        "Stay home until you have been fever-free for at least a day without fever medicines, wear a mask around others, and wash hands often",
      ],
    },
    { k: "h3", text: "Antiviral medicines" },
    {
      k: "p",
      text: "**Antiviral medicines** for flu can shorten the illness and lower the chance of complications. They work best when started early, ideally within the first two days of symptoms, but doctors may still give them later to people who are seriously ill or at high risk. They are prescription medicines; your doctor will decide whether you need one based on your symptoms, risk factors and how unwell you are.",
    },
    {
      k: "p",
      text: "Antibiotics do not work against flu viruses. They are only useful if a bacterial complication such as pneumonia develops. Taking them without need adds to antibiotic resistance and can cause side effects.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "p",
      text: "A **flu vaccine** every year is the most effective way to lower your chance of getting flu and of becoming seriously ill if you do. It is particularly recommended for high-risk groups — older adults, pregnant women, young children and people with long-term illnesses — and for health workers and carers. The vaccine cannot give you flu; a sore arm or mild fever for a day is common. Ask your doctor about the right time of year to take it where you live.",
    },
    {
      k: "ul",
      items: [
        "Wash hands with soap and water often, or use hand sanitiser",
        "Cover coughs and sneezes with a tissue or your elbow, and throw tissues away",
        "Keep sick children home from school, and stay home yourself when unwell",
        "Open windows to keep rooms ventilated, and avoid close contact with people who are ill",
      ],
    },

    { k: "h2", text: "When to see a doctor, and when it is an emergency" },
    {
      k: "p",
      text: "See a doctor early if you are in a high-risk group, if fever lasts more than three days, if symptoms improve and then return with a worse fever or cough, or if a long-term condition is getting worse.",
    },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Difficulty breathing, fast breathing or chest pain",
        "Blue or grey lips, or a low oxygen reading on a pulse oximeter",
        "Confusion, severe drowsiness, a seizure or being hard to wake",
        "Severe weakness, not passing urine, or being unable to keep fluids down",
        "In a child: fast or laboured breathing, skin pulling in between the ribs, not feeding, no tears when crying, or fever with a rash",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most adults with flu can be treated by a [general physician](/specialties/general-practice), and children by a [paediatrician](/specialties/paediatrics). An [infectious disease specialist](/specialties/infectious-diseases) may be involved for severe illness, unusual infections, or people with weakened immunity. A pulmonologist helps when flu leads to pneumonia or worsens lung disease.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians), [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) or [infectious disease specialists in Bengaluru](/doctors/karnataka/bengaluru/infectious-disease-specialists) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "How do I know if it is flu or a cold?",
      a: "Flu usually starts suddenly with high fever, severe body ache, headache and exhaustion. A cold comes on gradually, with sneezing, a runny nose and a mild sore throat, and rarely causes high fever. Only a test can confirm flu, but the pattern is a useful guide.",
    },
    {
      q: "Should I take antibiotics for flu?",
      a: "No. Flu is caused by a virus, and antibiotics do not kill viruses. Your doctor may prescribe an antiviral medicine if you are at high risk or very unwell. Antibiotics are used only if a bacterial complication such as pneumonia develops.",
    },
    {
      q: "Who should get the flu vaccine in India?",
      a: "Anyone can benefit, but it is especially recommended for older adults, pregnant women, young children, health workers and people with diabetes, heart, lung, kidney or liver disease. Ask your doctor or paediatrician whether it is right for you and when to take it.",
    },
    {
      q: "How long am I contagious with flu?",
      a: "People are usually most infectious in the first three to four days of illness, and can spread flu a day before symptoms begin. Children and people with weak immunity may remain infectious longer. Stay home until you have been without fever for at least a day.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Flu", url: "https://medlineplus.gov/flu.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
