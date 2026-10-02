import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "hepatitis-c",
  title: "Hepatitis C: symptoms, tests and treatment",
  standfirst: "What hepatitis C is, how it spreads, why it is often silent, the two-step blood test, and the tablet treatment that clears the virus in most people.",
  targetQuery: "hepatitis C symptoms test and treatment",
  department: "hepatology",
  specialty: "gastroenterology",
  alsoSee: ["infectious-diseases"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Tiredness", "Jaundice", "Dark urine", "Nausea", "Abdominal discomfort"],
  tests: ["Anti-HCV antibody test", "HCV RNA test", "Liver function tests", "Transient elastography"],
  treatments: ["Direct-acting antivirals", "Liver cancer screening", "Avoiding alcohol"],
  body: [
    { k: "h2", text: "What hepatitis C is" },
    {
      k: "p",
      text: "Hepatitis C is an infection of the liver caused by the hepatitis C virus, which spreads through blood. Some people clear the virus by themselves soon after infection, but in most it stays and becomes chronic hepatitis C.",
    },
    {
      k: "p",
      text: "Chronic hepatitis C usually causes no symptoms for many years while it inflames the liver. Over decades it can lead to scarring (cirrhosis), liver failure and liver cancer, particularly in people who also drink alcohol, have fatty liver or have hepatitis B or HIV. The good news is that modern tablet treatment, taken for a few months, clears the virus in the large majority of people who complete it. There is no vaccine against hepatitis C.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Most people have no symptoms and feel well until the liver is badly scarred. When symptoms do occur, they may include:",
    },
    {
      k: "ul",
      items: [
        "Tiredness",
        "Jaundice — yellow eyes and skin",
        "Dark urine",
        "Nausea and poor appetite",
        "Abdominal discomfort in the upper right side",
        "Joint pains, or skin and kidney problems in some people",
      ],
    },
    {
      k: "p",
      text: "Signs of advanced liver disease — swelling of the abdomen or legs, confusion, vomiting blood — are late. That is why testing people at risk matters, rather than waiting for symptoms.",
    },

    { k: "h2", text: "How it spreads and who is at risk in India" },
    { k: "p", text: "Hepatitis C spreads when infected blood enters another person's body. Common routes include:" },
    {
      k: "ul",
      items: [
        "Reused or poorly sterilised needles, syringes and medical or dental instruments, including unnecessary injections",
        "Blood transfusions before blood was routinely screened, or from unscreened sources",
        "Sharing needles or equipment for injecting drugs",
        "Long-term dialysis",
        "Tattooing, piercing or shaving with unsterile equipment",
        "Less commonly, from mother to baby, or through sex",
      ],
    },
    {
      k: "p",
      text: "It does not spread through hugging, kissing, sharing food or water, coughing or breastfeeding. Consider testing if you have ever injected drugs, had a transfusion or major surgery years ago, are on dialysis, have HIV, have had many injections in informal settings, or have raised liver enzymes.",
    },

    { k: "h2", text: "How it is diagnosed" },
    { k: "p", text: "Testing is done in two steps:" },
    {
      k: "ul",
      items: [
        "**Anti-HCV antibody test** — a screening blood test, also available as a rapid test. A positive result means you have been infected at some point, but not necessarily now.",
        "**HCV RNA test** — detects the virus itself. If it is positive, you have current infection and need treatment. If it is negative, you have cleared the virus.",
      ],
    },
    {
      k: "p",
      text: "Rapid antibody tests can be done at many health centres and screening camps. A negative antibody test usually rules out infection, but very recent exposure can be missed, so your doctor may repeat it if you were exposed in the last few months. Babies born to mothers with hepatitis C are tested after birth on a schedule the paediatrician will explain.",
    },
    {
      k: "p",
      text: "Once infection is confirmed, **liver function tests**, a blood count and a scarring assessment such as **transient elastography** or a blood-based score decide how closely the liver needs to be followed. You will usually also be tested for hepatitis B and HIV.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Hepatitis C is treated by gastroenterologists and liver specialists — the directory lists hepatologists under [gastroenterology](/specialties/gastroenterology) — and by trained physicians at government treatment centres. An [infectious disease specialist](/specialties/infectious-diseases) may be involved, particularly with HIV co-infection. People with cirrhosis need ongoing specialist care even after the virus is cleared.",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) or [infectious disease specialists in Bengaluru](/doctors/karnataka/bengaluru/infectious-disease-specialists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment, and free care in India" },
    {
      k: "p",
      text: "Hepatitis C is treated with **direct-acting antivirals** — tablets taken daily, usually for about two to three months, with few side effects. Several combinations exist; your doctor will choose based on whether you have cirrhosis, previous treatment, other medicines and kidney function. Take every dose, and do not stop early or change the course on your own. Tell your doctor about all your other medicines, because some interact with these antivirals.",
    },
    {
      k: "p",
      text: "Some weeks after the course ends, an HCV RNA test checks that the virus has gone. If it has, the infection is considered cleared. You can, however, be infected again, so avoiding re-exposure matters.",
    },
    {
      k: "p",
      text: "Under India's National Viral Hepatitis Control Programme, free screening, diagnosis and treatment of hepatitis B and C are being made available at government health facilities, in a phased manner. Ask at your district hospital or government medical college about the nearest treatment centre.",
    },

    { k: "h2", text: "After treatment and prevention" },
    {
      k: "ul",
      items: [
        "If you had cirrhosis, continue **liver cancer screening** every few months even after the virus has cleared, as the risk does not disappear",
        "**Avoiding alcohol** protects the liver, during and after treatment",
        "Get vaccinated against hepatitis A and B if you are not immune",
        "Never share needles, razors or toothbrushes",
        "Insist on new or properly sterilised needles for injections, dental work, tattoos and piercing",
        "Avoid unnecessary injections — many illnesses can be treated with tablets",
      ],
    },
    {
      k: "p",
      text: "Hepatitis C is not a reason to stop working, cooking for your family or sharing meals. Cover cuts, clean up blood spills with bleach, and tell your dentist and doctors so that they can take normal precautions.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Vomiting blood, or black, tarry stools",
        "New confusion, extreme drowsiness or unusual behaviour",
        "Rapidly deepening jaundice",
        "A swollen, painful abdomen with fever",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Do I have current infection, or have I cleared it?",
        "How much scarring does my liver have?",
        "Which treatment will I take, and for how long?",
        "Do any of my medicines interact with it?",
        "When will we test to confirm the virus has gone?",
        "Do I need follow-up after treatment, and for how long?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can hepatitis C be cured?",
      a: "Modern tablet treatment, taken for a few months, clears the virus in the large majority of people who complete the course; doctors confirm this with a blood test afterwards. Liver damage that has already occurred may remain, so follow-up is still needed in people with cirrhosis.",
    },
    {
      q: "Is there a vaccine for hepatitis C?",
      a: "No. There is currently no vaccine against hepatitis C. Prevention depends on avoiding contact with infected blood, especially through needles, syringes and unsterile instruments. Vaccines do exist for hepatitis A and B, and people with hepatitis C are usually advised to have them.",
    },
    {
      q: "If my antibody test is positive, do I definitely have hepatitis C?",
      a: "Not necessarily. A positive antibody test shows past or current infection. Some people clear the virus naturally but stay antibody-positive for life. An HCV RNA test shows whether the virus is still present and whether treatment is needed.",
    },
    {
      q: "Can I get hepatitis C again after treatment?",
      a: "Yes. Clearing the virus does not make you immune, so you can be reinfected if exposed to infected blood again. Avoid sharing needles and other equipment, and ask for a repeat test if you have been at risk since your treatment.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Hepatitis C", url: "https://medlineplus.gov/hepatitisc.html" },
    { label: "World Health Organization — Hepatitis C fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/hepatitis-c" },
    { label: "National Viral Hepatitis Control Program, MoHFW — About the programme", url: "https://nvhcp.mohfw.gov.in/about_us" },
  ],
};
