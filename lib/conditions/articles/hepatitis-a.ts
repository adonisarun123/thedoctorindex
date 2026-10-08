import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "hepatitis-a",
  title: "Hepatitis A: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Hepatitis A: symptoms, treatment and which doctor to see",
  standfirst: "How hepatitis A spreads through food and water, the jaundice symptoms to watch, how recovery is managed at home, and the warning signs of liver failure.",
  targetQuery: "hepatitis a symptoms and treatment",
  department: "hepatology",
  specialty: "gastroenterology",
  alsoSee: ["general-practice", "paediatrics", "infectious-diseases"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Jaundice", "Dark urine", "Fatigue", "Nausea", "Fever", "Pale stools"],
  tests: ["Liver function tests", "IgM anti-HAV", "Prothrombin time"],
  treatments: ["Rest", "Fluids", "Hepatitis A vaccine", "Hospital care"],
  body: [
    { k: "h2", text: "What hepatitis A is" },
    {
      k: "p",
      text: "Hepatitis means inflammation of the liver. Hepatitis A is a liver infection caused by the hepatitis A virus. It is one of the commonest causes of jaundice — 'peeliya' or 'kamala' — in India, and it often appears in clusters after the monsoon or when a local water supply becomes contaminated.",
    },
    {
      k: "p",
      text: "Hepatitis A causes a short-term (acute) infection. Unlike [hepatitis B](/conditions/hepatitis-b) and [hepatitis C](/conditions/hepatitis-c), it does not become a long-term infection and does not cause cirrhosis. Most people recover fully within weeks to a few months, and after recovery they are protected for life. In a small number of people, mostly adults who are older or already have liver disease, it can cause sudden liver failure, which is a medical emergency.",
    },
    {
      k: "p",
      text: "In young children the infection is often mild or unnoticed. Adults are much more likely to become visibly ill with jaundice. As living conditions and sanitation improve, more children grow up without catching the virus, which means more people are first infected as teenagers or adults, when the illness tends to be more severe.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually appear a few weeks after infection. Many people first feel as if they have a flu or stomach upset, and jaundice follows a few days later:",
    },
    {
      k: "ul",
      items: [
        "Fever, tiredness and body aches, often in the first days",
        "Loss of appetite, nausea and vomiting",
        "Pain or discomfort in the upper right side of the abdomen",
        "Dark urine, the colour of strong tea",
        "Pale stools, grey or clay-coloured",
        "Jaundice — yellowing of the eyes and skin",
        "Itchy skin",
        "Diarrhoea or joint pains in some people",
      ],
    },
    {
      k: "p",
      text: "Fatigue can last for weeks after the jaundice fades. A few people have a relapse, with symptoms returning after they seemed to recover, but they still go on to get better. Jaundice has many causes, so see a doctor rather than assuming it is hepatitis A — read more on [jaundice](/conditions/jaundice).",
    },

    { k: "h2", text: "How it spreads and who is at risk" },
    {
      k: "p",
      text: "The virus is passed out in the stool of an infected person and spreads when tiny amounts get into another person's mouth. This happens through:",
    },
    {
      k: "ul",
      items: [
        "Drinking contaminated water, including water from leaking pipes that mix with sewage during the rains",
        "Eating food prepared by someone with the virus who has not washed their hands well after using the toilet",
        "Raw salads, cut fruit, chutneys, pani puri water, ice and juices made with unsafe water",
        "Shellfish from contaminated water",
        "Close contact at home, in hostels, crèches or schools, and sexual contact",
      ],
    },
    {
      k: "p",
      text: "An infected person is most contagious in the week or two before jaundice appears, which is why the virus can spread before anyone knows it is there. Anyone who has not had hepatitis A or the vaccine can catch it. People who already have another liver disease are at higher risk of severe illness.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The doctor will ask about your symptoms, food and water, travel and contacts, and examine you for jaundice and liver tenderness. Blood tests then confirm the diagnosis and show how the liver is coping:",
    },
    {
      k: "ul",
      items: [
        "**Liver function tests** — show raised liver enzymes and bilirubin (the yellow pigment that causes jaundice)",
        "**IgM anti-HAV** — an antibody that shows a recent hepatitis A infection",
        "**Prothrombin time** (or INR) — checks whether the liver is making enough clotting proteins; an abnormal result is a warning sign of severe disease",
      ],
    },
    {
      k: "p",
      text: "Your doctor may also test for hepatitis E, which spreads the same way and is also common in India, and for hepatitis B and C. An ultrasound may be done to rule out other causes of jaundice, such as gallstones.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "There is no medicine that kills the hepatitis A virus. The body clears it by itself, and treatment supports the liver while it recovers. Most people can be looked after at home with regular check-ups.",
    },
    {
      k: "ul",
      items: [
        "**Rest** as much as you need; return to work or school gradually as energy comes back",
        "**Fluids** — drink plenty of safe water, oral rehydration solution, soups, coconut water and juices, especially if you are vomiting",
        "Eat small, frequent meals of whatever you can manage. There is no need to avoid oil, turmeric or particular foods completely; a normal balanced diet supports recovery",
        "Avoid alcohol completely until your doctor says your liver tests are back to normal",
        "Do not take any medicine, including paracetamol, painkillers or herbal 'jaundice remedies', without asking your doctor; some can harm a recovering liver",
      ],
    },
    {
      k: "p",
      text: "Some people need **hospital care**, for example if they cannot keep fluids down, are elderly, pregnant or have other liver disease, or if blood tests show the liver is struggling. A very small number develop acute liver failure and need intensive care at a centre with liver specialists; occasionally a liver transplant is needed.",
    },

    { k: "h2", text: "Prevention" },
    { k: "h3", text: "Vaccination" },
    {
      k: "p",
      text: "The **hepatitis A vaccine** is safe and gives long-lasting protection. In India it is commonly given to children in the second year of life, as recommended by many paediatricians, and it is available at private clinics and hospitals. Ask your paediatrician whether it suits your child. Adults who have never had hepatitis A — especially those with chronic liver disease, and people who work in food handling — can ask their doctor about vaccination or a blood test to check immunity.",
    },
    { k: "h3", text: "Food and water hygiene" },
    {
      k: "ul",
      items: [
        "Wash hands with soap after using the toilet, changing nappies and before cooking or eating",
        "Drink boiled, filtered or safely treated water, especially during and after the rains",
        "Avoid raw salads, cut fruit, ice and street drinks when you are not sure the water used is safe",
        "Cook shellfish thoroughly",
        "If someone at home has hepatitis A, keep a separate towel, clean the toilet often and avoid sharing food from the same plate",
      ],
    },
    {
      k: "p",
      text: "Close contacts of someone with hepatitis A who have not been vaccinated may be offered a vaccine dose soon after exposure; ask your doctor promptly.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if someone with hepatitis A or jaundice has:" },
    {
      k: "ul",
      items: [
        "Confusion, unusual sleepiness, odd behaviour or difficulty waking up",
        "Bleeding from the gums or nose, blood in vomit, black stools or easy bruising",
        "Vomiting so much that they cannot keep any fluids down",
        "Very little urine, or severe weakness and dizziness",
        "Jaundice that keeps getting deeper, with worsening abdominal swelling",
      ],
    },
    {
      k: "p",
      text: "Pregnant women and anyone with existing liver disease should be seen by a doctor early, even with mild symptoms.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most people with hepatitis A are managed by a [general physician](/specialties/general-practice), and children by a [paediatrician](/specialties/paediatrics). A [gastroenterologist or hepatologist](/specialties/gastroenterology) should be involved if jaundice is deep or prolonged, if clotting tests are abnormal, if you have another liver disease, or if the diagnosis is uncertain.",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists), [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is this hepatitis A, or could it be hepatitis E or another cause?",
        "How often should my liver tests be repeated?",
        "Which medicines are safe for me to take while I recover?",
        "When can I go back to work, college or cooking for others?",
        "Should my family members be vaccinated?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can you get hepatitis A twice?",
      a: "No. Once you have recovered from hepatitis A, your body makes antibodies that protect you for life. You can still get other types of hepatitis, such as hepatitis E, B or C, which can also cause jaundice.",
    },
    {
      q: "What should I eat when I have hepatitis A?",
      a: "Eat small, frequent meals of normal home food that you can tolerate, and drink plenty of safe fluids. There is no need for a special bland diet. Avoid alcohol completely and check with your doctor before taking any medicine or herbal remedy.",
    },
    {
      q: "How long is a person with hepatitis A contagious?",
      a: "People are most contagious in the one to two weeks before jaundice appears, and remain infectious for some days after. Your doctor will advise when it is safe to return to school, work or food handling.",
    },
    {
      q: "Is the hepatitis A vaccine necessary for adults?",
      a: "Many Indian adults are already immune from a childhood infection. Adults who are not immune, especially those with chronic liver disease or who handle food, may benefit from the vaccine. A doctor can advise whether to test first.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Hepatitis A", url: "https://medlineplus.gov/hepatitisa.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
