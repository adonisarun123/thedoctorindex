import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "hepatitis-b",
  title: "Hepatitis B: symptoms, tests, treatment and vaccination",
  standfirst: "What hepatitis B is, how it spreads, why many people do not know they have it, the tests and treatment, and the vaccine every newborn should get.",
  targetQuery: "hepatitis B symptoms test and treatment",
  department: "hepatology",
  specialty: "gastroenterology",
  alsoSee: ["infectious-diseases"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Tiredness", "Jaundice", "Dark urine", "Loss of appetite", "Nausea", "Abdominal pain"],
  tests: ["HBsAg", "HBV DNA", "Liver function tests", "Ultrasound", "Transient elastography"],
  treatments: ["Regular monitoring", "Antiviral tablets", "Tenofovir", "Entecavir", "Hepatitis B vaccine"],
  body: [
    { k: "h2", text: "What hepatitis B is" },
    {
      k: "p",
      text: "Hepatitis B is an infection of the liver caused by the hepatitis B virus. In adults, the infection usually clears by itself within a few months (acute hepatitis B). In babies and young children infected early in life, it usually stays for life (chronic hepatitis B). Many adults living with chronic hepatitis B in India were infected at birth or in early childhood.",
    },
    {
      k: "p",
      text: "Chronic hepatitis B often causes no symptoms for decades while slowly damaging the liver. In some people it leads to scarring (cirrhosis), liver failure or liver cancer. With regular monitoring and, when needed, treatment, most people with hepatitis B live long, healthy lives. A safe and effective vaccine prevents it.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Most people with chronic hepatitis B feel well and have no symptoms. When acute infection causes symptoms, they appear weeks to months after exposure and may include:",
    },
    {
      k: "ul",
      items: [
        "Tiredness",
        "Jaundice — yellow eyes and skin",
        "Dark urine and pale stools",
        "Loss of appetite and nausea",
        "Abdominal pain, joint pains and fever",
      ],
    },
    {
      k: "p",
      text: "Because symptoms are so often absent, hepatitis B is usually found on a blood test — during pregnancy, before surgery, when donating blood or at a health check.",
    },

    { k: "h2", text: "How it spreads and who is at risk" },
    { k: "p", text: "Hepatitis B spreads through blood and some body fluids. The main routes are:" },
    {
      k: "ul",
      items: [
        "From mother to baby around the time of birth — the main route in India",
        "Among young children in a household, through cuts, sores and shared items",
        "Unsterile needles, syringes, dental or surgical instruments, tattooing, piercing and shaving by roadside barbers",
        "Unprotected sex with an infected partner",
        "Blood transfusion where blood has not been screened",
        "Sharing razors or toothbrushes",
      ],
    },
    {
      k: "p",
      text: "It does not spread through food, water, sharing utensils, hugging, coughing or breastfeeding. People at higher risk include household contacts and sexual partners of someone with hepatitis B, healthcare workers, people on dialysis, people who inject drugs, and people with HIV.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "ul",
      items: [
        "**HBsAg** — the screening blood test. If positive, you have hepatitis B infection. A repeat test after six months shows whether it is chronic.",
        "Other markers (such as HBeAg and antibodies) — show the phase of the infection and whether you are immune.",
        "**HBV DNA** — measures the amount of virus in the blood, which helps decide on treatment.",
        "**Liver function tests** — show liver inflammation.",
        "**Ultrasound** and **transient elastography** — assess liver scarring and screen for liver cancer.",
      ],
    },
    {
      k: "p",
      text: "Hepatitis B can be in different phases over a lifetime, so a single set of results is not enough. Your doctor will usually repeat tests over time before deciding on treatment.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Chronic hepatitis B is managed by a liver specialist or gastroenterologist — the directory lists hepatologists under [gastroenterology](/specialties/gastroenterology). An [infectious disease specialist](/specialties/infectious-diseases) may be involved, particularly with HIV or hepatitis C co-infection. Pregnant women with hepatitis B should be seen early so the baby can be protected.",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) or [infectious disease specialists in Bengaluru](/doctors/karnataka/bengaluru/infectious-disease-specialists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment, and free care in India" },
    {
      k: "p",
      text: "Acute hepatitis B usually needs only rest, fluids and monitoring. Not everyone with chronic hepatitis B needs medicine straight away — many need **regular monitoring** with blood tests and scans every six to twelve months. Treatment is advised when tests show active liver inflammation, a high virus level, significant scarring or cirrhosis, during some pregnancies, and before chemotherapy or other treatment that suppresses immunity.",
    },
    {
      k: "p",
      text: "**Antiviral tablets** — mainly **tenofovir** or **entecavir** — keep the virus suppressed, lower the risk of cirrhosis and liver cancer, and improve survival. They do not usually remove the virus completely, so most people take them long-term. Never stop them on your own: stopping suddenly can cause a dangerous flare of hepatitis.",
    },
    {
      k: "p",
      text: "Under India's National Viral Hepatitis Control Programme, free screening, diagnosis and treatment of hepatitis B and C are being made available at government health facilities, in a phased manner. Ask at your district hospital or government medical college about the nearest treatment centre.",
    },

    { k: "h2", text: "Vaccination and prevention" },
    {
      k: "p",
      text: "The **hepatitis B vaccine** is the most effective protection. Under the national immunisation schedule, babies get a birth dose at birth or as early as possible within 24 hours, followed by further doses in the pentavalent vaccine. These vaccines are free at government health centres and hospitals. Babies born to mothers with hepatitis B may also be given an antibody injection at birth; this is why testing in pregnancy matters.",
    },
    {
      k: "ul",
      items: [
        "Adults who were never vaccinated, especially household members, partners and healthcare workers, should ask about vaccination",
        "Insist on new or properly sterilised needles and instruments",
        "Do not share razors, toothbrushes or nail clippers",
        "Use condoms with partners whose status is unknown",
        "If you have hepatitis B, ask that your household contacts are tested and vaccinated",
      ],
    },

    { k: "h2", text: "Living with hepatitis B" },
    {
      k: "ul",
      items: [
        "Keep every monitoring appointment, even when you feel well",
        "Avoid alcohol, and keep a healthy weight to protect the liver",
        "Ask before taking any new medicine, supplement or herbal product",
        "Get vaccinated against hepatitis A",
        "You can work, eat with others and share a home normally",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Rapidly deepening jaundice with vomiting",
        "Confusion, extreme drowsiness or unusual behaviour",
        "Vomiting blood, or black, tarry stools",
        "A swollen, painful abdomen with fever",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is my hepatitis B acute or chronic, and which phase is it in?",
        "Do I need treatment now, or monitoring?",
        "How much scarring does my liver have?",
        "How often should I have liver cancer screening?",
        "Who in my family should be tested and vaccinated?",
        "Where can I get free tests or treatment near me?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can hepatitis B be cured?",
      a: "Acute hepatitis B usually clears by itself in adults. Chronic hepatitis B can be controlled very well with antiviral tablets, which lower the risk of cirrhosis and liver cancer, but the virus is rarely removed completely. Research into treatments that clear it is ongoing.",
    },
    {
      q: "Can a mother with hepatitis B breastfeed?",
      a: "Yes. Hepatitis B is not spread through breastfeeding. What matters is that the baby gets the hepatitis B vaccine at birth, and often an antibody injection too, followed by the remaining doses on schedule. Some mothers are also given antiviral tablets late in pregnancy.",
    },
    {
      q: "Can I marry or have children if I have hepatitis B?",
      a: "Yes. Your partner should be tested and vaccinated if not already immune. With vaccination of the newborn at birth and good antenatal care, the chance of passing the virus to your baby is very low. Discuss your plans with your liver doctor.",
    },
    {
      q: "Do adults need the hepatitis B vaccine?",
      a: "Adults who have never been vaccinated and are not already infected or immune should consider it, especially healthcare workers, people on dialysis, people with diabetes or liver disease, and household contacts or partners of someone with hepatitis B. A blood test can show whether you are protected.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Hepatitis B", url: "https://medlineplus.gov/hepatitisb.html" },
    { label: "World Health Organization — Hepatitis B fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/hepatitis-b" },
    { label: "National Viral Hepatitis Control Program, MoHFW — About the programme", url: "https://nvhcp.mohfw.gov.in/about_us" },
    { label: "Press Information Bureau, MoHFW — Celebrating the Power of Vaccines (Universal Immunisation Programme schedule)", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2241066" },
  ],
};
