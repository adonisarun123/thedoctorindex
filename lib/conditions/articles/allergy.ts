import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "allergy",
  title: "Allergies: symptoms, tests, treatment and anaphylaxis",
  standfirst: "What an allergy is, the common triggers, how to tell a mild reaction from anaphylaxis, how allergies are tested, and what to do in an emergency.",
  targetQuery: "allergy symptoms and treatment",
  department: "allergy-and-immunology",
  specialty: "internal-medicine",
  alsoSee: ["dermatology", "ent", "pulmonology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Sneezing and runny nose", "Itchy, watery eyes", "Hives", "Swelling of the lips or face", "Wheezing", "Vomiting"],
  tests: ["Skin prick test", "Specific IgE blood test", "Patch test", "Oral food challenge"],
  treatments: ["Allergen avoidance", "Antihistamines", "Steroid nasal sprays", "Adrenaline auto-injector", "Allergen immunotherapy"],
  body: [
    { k: "h2", text: "What an allergy is" },
    {
      k: "p",
      text: "An allergy is an overreaction of the immune system to something that is harmless to most people — such as pollen, dust mites, a food, a medicine or an insect sting. The first time the body meets the substance (the allergen), it may make antibodies against it. Next time, those antibodies trigger the release of chemicals such as histamine, which cause the symptoms of an allergic reaction.",
    },
    {
      k: "p",
      text: "Allergic reactions range from mild — sneezing or a few itchy spots — to **anaphylaxis**, a severe, rapid reaction affecting breathing or circulation that can be life-threatening. Allergies often run in families, and the same person may have several allergic conditions: allergic rhinitis, asthma, eczema and food allergy. Not every reaction to a food or medicine is an allergy; some are intolerances or side effects, which is why proper assessment matters.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Symptoms depend on the allergen and where it enters the body:" },
    {
      k: "ul",
      items: [
        "Sneezing and runny nose, or a blocked nose",
        "Itchy, watery eyes",
        "Hives — raised, itchy red welts on the skin — or an itchy rash",
        "Swelling of the lips or face, eyes or tongue",
        "Wheezing, cough, chest tightness or breathlessness",
        "Vomiting, abdominal pain or diarrhoea, especially with food allergies",
        "A flare of eczema",
      ],
    },
    { k: "p", text: "Anaphylaxis usually develops within minutes to an hour of exposure. Its warning signs are:" },
    {
      k: "ul",
      items: [
        "Difficulty breathing, wheeze, noisy breathing or a hoarse voice",
        "Swelling of the tongue or throat, or difficulty swallowing",
        "Dizziness, fainting, pale or floppy appearance (in children), or collapse",
        "Often, but not always, hives or skin redness",
      ],
    },

    { k: "h2", text: "Common triggers in India" },
    {
      k: "ul",
      items: [
        "House dust mites, cockroaches, mould and pet dander",
        "Pollen from grasses, weeds such as Parthenium, and trees",
        "Foods — peanut, tree nuts, milk, egg, wheat, soy, fish, shellfish and sesame are among the commonest",
        "Medicines — some antibiotics such as penicillins, some painkillers, and contrast dyes used in scans",
        "Insect stings from bees, wasps and ants",
        "Latex in gloves and some medical equipment",
        "Substances in contact with skin — nickel in jewellery, hair dyes, cosmetics and some plants, which cause allergic skin rashes",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The most important part of diagnosis is a detailed history: what you were exposed to, how soon symptoms started, what they were and what helped. Tests are chosen to confirm a suspected allergy, not as a random screen:",
    },
    {
      k: "ul",
      items: [
        "**Skin prick test** — tiny amounts of allergens are pricked into the skin; a raised itchy bump within minutes shows sensitivity",
        "**Specific IgE blood test** — measures antibodies to particular allergens",
        "**Patch test** — allergens are taped to the back for a couple of days to find the cause of contact skin allergies",
        "**Oral food challenge** — eating gradually increasing amounts of a food under medical supervision in a clinic or hospital, to confirm or rule out food allergy",
      ],
    },
    {
      k: "p",
      text: "A positive test shows sensitivity but does not always mean you will react, so results must be interpreted with your history. Commercial 'food intolerance' tests that measure IgG antibodies, and other unproven methods, are not reliable for diagnosing allergy and can lead to unnecessary food restriction.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "An [internal medicine physician](/specialties/internal-medicine) can assess many allergies and arrange tests. Depending on the main problem, a [dermatologist](/specialties/dermatology) treats hives, eczema and contact allergy; an [ENT surgeon](/specialties/ent) treats allergic rhinitis and sinus problems; and a [pulmonologist](/specialties/pulmonology) treats allergic asthma. Anyone who has had anaphylaxis should be referred to a doctor experienced in allergy.",
    },
    {
      k: "p",
      text: "You can [find internal medicine physicians in Bengaluru](/doctors/karnataka/bengaluru/internal-medicine-physicians), [dermatologists in Bengaluru](/doctors/karnataka/bengaluru/dermatologists) or [ENT surgeons in Bengaluru](/doctors/karnataka/bengaluru/ent-surgeons) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "ul",
      items: [
        "**Allergen avoidance** — the foundation: knowing and avoiding your triggers, reading food labels, telling restaurants, schools and every doctor about your allergies, and wearing a medical alert band if you have had a severe reaction.",
        "**Antihistamines** — for itching, hives, sneezing and runny nose. They do not treat anaphylaxis.",
        "**Steroid nasal sprays** — for allergic rhinitis; inhalers for asthma; creams for eczema and contact allergy.",
        "**Adrenaline auto-injector** — people at risk of anaphylaxis may be prescribed an adrenaline injection that they or a carer can give into the outer thigh in an emergency. If you are prescribed one, carry it at all times, check its expiry date, and make sure family, school and colleagues know how to use it.",
        "**Allergen immunotherapy** — for selected people with allergic rhinitis, allergic asthma or insect sting allergy, a supervised course that reduces sensitivity over time. Treatments for some food allergies are offered at specialist centres.",
      ],
    },
    {
      k: "p",
      text: "Do not take steroid tablets or injections for allergies without a prescription, and do not stop prescribed treatment on your own. If you have had a reaction to a medicine, write down its name and show it to every doctor and pharmacist.",
    },

    { k: "h2", text: "Living with allergies" },
    {
      k: "ul",
      items: [
        "Have a written allergy action plan that says what to do for mild and severe reactions",
        "For children with food allergy, share the plan with the school and caregivers",
        "Keep asthma well controlled — uncontrolled asthma increases the risk of severe reactions",
        "Reduce dust mites and mould at home",
        "Review your allergy with your doctor periodically; some childhood allergies are outgrown",
      ],
    },

    { k: "h2", text: "When it is an emergency: anaphylaxis" },
    {
      k: "p",
      text: "Anaphylaxis is a medical emergency. If someone has difficulty breathing, swelling of the throat or tongue, or becomes faint or collapses after a possible allergen:",
    },
    {
      k: "steps",
      items: [
        { title: "Give adrenaline", text: "If the person has a prescribed adrenaline auto-injector, use it straight away into the outer thigh, through clothing if needed. Do not wait to see if symptoms get better." },
        { title: "Call for help", text: "Call 112 or 108 immediately and say 'anaphylaxis', even if adrenaline has been given and the person seems better." },
        { title: "Position the person", text: "Lay them flat with legs raised. If breathing is difficult, let them sit up. Do not make them stand or walk. If they are vomiting or unconscious, turn them on their side." },
        { title: "Repeat if needed", text: "If there is no improvement after a few minutes and a second auto-injector is available, give it as instructed. Stay with the person until help arrives." },
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What exactly am I allergic to, and how sure are we?",
        "Is there a risk of anaphylaxis for me?",
        "Should I carry an adrenaline auto-injector, and how do I use it?",
        "Which foods or medicines must I avoid, and what are safe alternatives?",
        "Would immunotherapy help me?",
        "Is this allergy likely to be outgrown?",
      ],
    },
  ],
  faqs: [
    {
      q: "What is the difference between an allergy and an intolerance?",
      a: "An allergy involves the immune system and can cause hives, swelling, breathing problems or anaphylaxis, sometimes from a tiny amount. An intolerance, such as lactose intolerance, involves digestion, causes discomfort like bloating or diarrhoea, and is not life-threatening.",
    },
    {
      q: "Are antihistamines enough to treat anaphylaxis?",
      a: "No. Antihistamines act too slowly and do not reverse the breathing and circulation problems of anaphylaxis. Adrenaline is the first treatment. If someone shows signs of anaphylaxis, use a prescribed auto-injector if available and call 112 or 108 immediately.",
    },
    {
      q: "Can children outgrow food allergies?",
      a: "Many children outgrow allergies to milk, egg, wheat and soy, often by school age. Allergies to peanuts, tree nuts, fish and shellfish are more likely to persist. A doctor can advise when to retest, and food challenges should be done only under medical supervision.",
    },
    {
      q: "If I had a reaction to a medicine, am I allergic for life?",
      a: "Not always. Some reactions are side effects rather than true allergy, and some allergies fade over time. However, do not take that medicine again until a doctor has assessed you. Some people can be tested safely, which may open up useful treatment options.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Allergy", url: "https://medlineplus.gov/allergy.html" },
    { label: "American Academy of Allergy, Asthma and Immunology — Anaphylaxis", url: "https://www.aaaai.org/tools-for-the-public/conditions-library/allergies/anaphylaxis" },
  ],
};
