import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "asthma",
  title: "Asthma: symptoms, tests, inhalers and which doctor to see",
  standfirst: "What asthma is, the symptoms and triggers to watch for, how it is confirmed, why inhalers work, and when to see a pulmonologist.",
  targetQuery: "asthma symptoms and treatment",
  department: "pulmonology",
  specialty: "pulmonology",
  alsoSee: ["paediatrics", "general-practice"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Wheezing", "Breathlessness", "Chest tightness", "Cough"],
  tests: ["Spirometry", "Peak flow", "FeNO"],
  treatments: ["Reliever inhaler", "Inhaled corticosteroids", "Spacer", "Trigger avoidance"],
  body: [
    { k: "h2", text: "What asthma is" },
    {
      k: "p",
      text: "Asthma is a long-term condition of the airways, the tubes that carry air in and out of the lungs. In a person with asthma these airways are sensitive and often mildly inflamed even on good days. When they meet a trigger, such as dust, smoke or a cold, the muscle around them tightens, the lining swells and extra mucus is made. The airway narrows and breathing becomes hard work.",
    },
    {
      k: "p",
      text: "Asthma can start at any age. Many children who wheeze with colds outgrow it, but some do not, and some adults develop it for the first time later in life. It cannot be cured, but for most people it can be controlled well enough that they sleep, work, play sport and travel normally. Poorly controlled asthma, on the other hand, causes missed school and work, and attacks that can be life-threatening.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "The typical symptoms come and go, and are often worse at night, early in the morning, with exercise or after a cold:" },
    {
      k: "ul",
      items: [
        "Wheezing — a whistling sound when breathing out",
        "Breathlessness, sometimes out of proportion to what you are doing",
        "Chest tightness, as if a band is around the chest",
        "Cough, especially a dry cough at night or after exercise",
      ],
    },
    {
      k: "p",
      text: "Some people, especially children, have only a long-lasting night cough. Not every wheeze is asthma: heart problems, a foreign body in a child's airway, chronic obstructive pulmonary disease (COPD) in smokers and some infections can sound similar. That is why the diagnosis should be confirmed rather than assumed.",
    },

    { k: "h2", text: "Triggers and who is at risk in India" },
    {
      k: "p",
      text: "Asthma often runs in families and is more common in people who have allergies, eczema or hay fever. What sets off symptoms varies from person to person. Common triggers in Indian homes and cities include:",
    },
    {
      k: "ul",
      items: [
        "House dust mites, cockroaches, mould on damp walls and pet fur",
        "Smoke from cigarettes, beedis, wood or dung cooking fires, mosquito coils and incense",
        "Traffic and construction dust, and the smoke and haze around festivals and crop-burning season",
        "Pollen during flowering seasons",
        "Colds and flu, which are among the most common triggers of attacks",
        "Fumes, flour, wood dust or chemicals at work",
        "Cold air and exercise",
        "Some painkillers in a small group of people — tell your doctor if a painkiller has ever made your breathing worse",
      ],
    },
    {
      k: "p",
      text: "Knowing your own triggers is useful, but you will rarely avoid all of them. Treatment is what keeps the airways calm enough that unavoidable triggers do less harm.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The doctor will ask about your symptoms, what brings them on, your family history and your work, and will listen to your chest. Breathing tests then look for airways that narrow and open up again:",
    },
    {
      k: "ul",
      items: [
        "**Spirometry** — you blow out as hard and fast as you can into a machine. It is often repeated after a reliever inhaler to see whether the airways open up.",
        "**Peak flow** — a simple hand-held meter. Readings recorded at home over a couple of weeks can show the ups and downs typical of asthma.",
        "**FeNO** — measures a gas in your breath that rises with a particular type of airway inflammation. It is available at some centres.",
      ],
    },
    {
      k: "p",
      text: "Tests can be normal on a good day, so the doctor may repeat them, try a course of treatment and review, or arrange a challenge test at a specialist centre. A chest X-ray, blood tests or allergy tests are sometimes used to rule out other conditions or to look for allergies, but none of them diagnoses asthma by itself.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Many adults with asthma are diagnosed and treated by a [general physician](/specialties/general-practice), and children by a [paediatrician](/specialties/paediatrics). A [pulmonologist](/specialties/pulmonology) is worth seeing when:",
    },
    {
      k: "ul",
      items: [
        "The diagnosis is uncertain, or you also smoke and COPD is possible",
        "You still have symptoms most weeks despite using your inhalers correctly",
        "You have needed oral steroid courses or a hospital visit for an attack",
        "Your asthma seems linked to your job",
        "You are pregnant, or planning pregnancy, and your asthma is not well controlled",
      ],
    },
    {
      k: "p",
      text: "You can [find pulmonologists in Bengaluru](/doctors/karnataka/bengaluru/pulmonologists) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "The aim is to have few or no symptoms, no attacks, and normal activity. Most treatment is inhaled, because that delivers medicine straight to the airways at a small dose with fewer side effects than tablets.",
    },
    { k: "h3", text: "Inhalers" },
    {
      k: "p",
      text: "A **reliever inhaler** opens the airways within minutes and is used for symptoms. A preventer, usually **inhaled corticosteroids**, calms the inflammation underneath and is taken every day, even when you feel well. Many people now use a combination inhaler that contains both a steroid and a long-acting airway opener; for some, the same combination inhaler is used both daily and as the reliever. Your doctor will decide on the plan based on how often you have symptoms and attacks.",
    },
    {
      k: "p",
      text: "Inhaled steroids are not the same as the steroids misused for body-building, and at the usual inhaled doses they are safe for long-term use in adults and children. Relying on a reliever alone, without a preventer, is linked to more severe attacks.",
    },
    { k: "h3", text: "Technique and a spacer" },
    {
      k: "p",
      text: "Poor inhaler technique is one of the commonest reasons asthma stays uncontrolled. A **spacer** — a plastic chamber that fits a puffer inhaler — makes it much easier to get the medicine into the lungs and is recommended for children and for many adults. Ask the doctor, nurse or pharmacist to watch you use your inhaler at every visit.",
    },
    { k: "h3", text: "Other treatment" },
    {
      k: "p",
      text: "**Trigger avoidance** where it is realistic, treating a blocked or allergic nose, stopping smoking and keeping vaccinations up to date all help. For severe asthma that stays uncontrolled despite all this, specialists may add tablets or injectable biological medicines. Do not stop your preventer or change your doses on your own, even when you feel well.",
    },

    { k: "h2", text: "Living with asthma" },
    {
      k: "ul",
      items: [
        "Ask for a written asthma action plan that says what to take every day, what to do when symptoms increase, and when to get help",
        "Review with your doctor at least once a year, and after any attack",
        "Keep a reliever with you, and check it has not run out or expired",
        "Damp-dust and wash bedding in hot water to reduce dust mites; keep smoke out of the home",
        "On high-pollution days, limit hard exercise outdoors and keep windows shut when the air is worst",
        "Tell your child's school about the asthma and the reliever",
      ],
    },
    {
      k: "p",
      text: "Needing your reliever more than usual, or waking at night with symptoms, is a sign that your asthma is not controlled. That is the time to see the doctor, not after an attack.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if:" },
    {
      k: "ul",
      items: [
        "The reliever is not helping, or the effect lasts only a short time",
        "You are too breathless to speak in full sentences, eat or sleep",
        "Lips or fingertips look blue or grey",
        "You feel drowsy, confused or exhausted from the effort of breathing",
        "A child is breathing very fast, the skin pulls in between or below the ribs, or the child is too breathless to feed or talk",
      ],
    },
    {
      k: "p",
      text: "While you wait for help, sit upright, stay as calm as you can, and keep using the reliever as your action plan or the emergency operator advises. Do not lie down.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "How sure are we that this is asthma?",
        "Which of my inhalers is the preventer, and which is the reliever?",
        "Could you check my inhaler technique, and would a spacer help?",
        "What should my action plan say, and when should I go to hospital?",
        "What seem to be my triggers, and which are worth avoiding?",
        "When should we review my treatment, and could it be reduced if I stay well?",
      ],
    },
  ],
  faqs: [
    {
      q: "Are inhalers addictive or harmful in the long run?",
      a: "No. Inhalers are not addictive. Inhaled steroids reach the airways directly at a small dose, which is why they are considered safe for long-term use in adults and children. Your doctor will aim for the lowest dose that keeps you well.",
    },
    {
      q: "Can a child outgrow asthma?",
      a: "Many young children who wheeze only with colds stop wheezing as they grow. Others continue to have asthma into adulthood, and symptoms can return later. Regular review with a paediatrician helps decide when treatment can be reduced safely.",
    },
    {
      q: "Can I exercise if I have asthma?",
      a: "Yes. Regular exercise is good for people with asthma. If exercise brings on symptoms, it usually means the asthma needs better control. Your doctor may suggest using your reliever before exercise and warming up gradually.",
    },
    {
      q: "Is asthma the same as COPD?",
      a: "No. COPD is lung damage, usually from smoking or long exposure to smoke and dust, and it tends to be progressive. Asthma airways narrow and open again. Some people have features of both, which is one reason breathing tests matter.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Asthma", url: "https://medlineplus.gov/asthma.html" },
    { label: "World Health Organization — Asthma fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/asthma" },
  ],
};
