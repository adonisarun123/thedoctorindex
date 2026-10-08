import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "tetanus",
  title: "Tetanus: symptoms, wound care, vaccines and treatment",
  standfirst: "How tetanus enters through wounds, the early signs such as lockjaw, when you need a tetanus injection after an injury, and why it is a medical emergency.",
  targetQuery: "tetanus symptoms and tetanus injection after wound",
  department: "infectious-diseases",
  specialty: "emergency-medicine",
  alsoSee: ["critical-care", "infectious-diseases", "general-practice", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Lockjaw", "Stiff neck", "Difficulty swallowing", "Muscle spasms", "Fever and sweating"],
  tests: ["Clinical examination", "Vaccination history"],
  treatments: ["Tetanus vaccine", "Tetanus immunoglobulin", "Wound cleaning", "Intensive care"],
  body: [
    { k: "h2", text: "What tetanus is" },
    {
      k: "p",
      text: "Tetanus is a serious, often life-threatening illness caused by a toxin made by bacteria called Clostridium tetani. The bacteria live as hardy spores in soil, dust and animal dung, and can survive for years. When they get into the body through a wound, they can multiply in damaged tissue where there is little oxygen and release a poison that acts on the nerves controlling the muscles. The result is painful muscle stiffness and spasms, which can make it impossible to open the mouth, swallow or breathe.",
    },
    {
      k: "p",
      text: "Tetanus does not spread from person to person. It is almost completely preventable with vaccination, which is why it has become much less common in India than in the past. But anyone who is not fully vaccinated, or whose protection has lapsed, can still get it, and it remains a risk after injuries in fields, gardens, construction sites and roads.",
    },
    {
      k: "p",
      text: "A common belief is that only rusty nails cause tetanus. Rust itself is not the problem; a rusty nail is simply likely to be dirty and to make a deep wound. Any wound contaminated with soil, dust or dung can carry the spores.",
    },

    { k: "h2", text: "How people get tetanus" },
    { k: "p", text: "Wounds with a higher risk include:" },
    {
      k: "ul",
      items: [
        "Deep puncture wounds — stepping on a nail or thorn, or a splinter",
        "Wounds contaminated with soil, dust or dung, including road and farm injuries",
        "Crush injuries, burns and wounds with dead tissue",
        "Animal bites",
        "Injuries that have been left untreated or have become infected",
        "Unsterile injections, tattoos, piercings or ear-piercing",
        "In newborns, infection of the umbilical cord stump when it is cut or dressed with unclean instruments or materials",
      ],
    },
    {
      k: "p",
      text: "Sometimes the wound is so small that it is forgotten by the time symptoms start. People with diabetes, chronic leg ulcers and older adults who were never fully vaccinated are among those at higher risk.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually appear a few days to about three weeks after the injury, though it can be shorter or longer. The shorter the gap, the more severe the illness tends to be.",
    },
    {
      k: "ul",
      items: [
        "Lockjaw — stiffness and spasm of the jaw muscles, making it hard to open the mouth; often the first sign",
        "Stiff neck and stiffness of the back and abdominal muscles",
        "Difficulty swallowing, and a fixed, strained facial expression",
        "Muscle spasms — sudden, very painful tightening of muscles across the body, often set off by noise, light or touch",
        "Fever and sweating, a racing heart and swings in blood pressure",
        "Difficulty breathing when spasms affect the throat or chest",
      ],
    },
    {
      k: "p",
      text: "In newborns, tetanus usually shows a few days after birth as a baby who was feeding well and then stops sucking, becomes stiff and has spasms.",
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "p",
      text: "Tetanus is always a medical emergency. Call 112 or 108, or go to the nearest emergency department, if after any wound — even a minor or forgotten one — someone develops jaw stiffness, difficulty opening the mouth or swallowing, a stiff neck or back, or muscle spasms. Do the same for a newborn who stops feeding, becomes stiff or has spasms. Do not wait to see whether it improves.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "There is no quick blood test that confirms tetanus. Doctors diagnose it from a **clinical examination** — the typical pattern of stiffness and spasms — together with a history of a wound and the person's **vaccination history**. Tests may be done to rule out other causes such as reactions to certain medicines, infections of the brain, low calcium, or a dental abscess causing jaw stiffness.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Tetanus is treated in hospital, usually in an intensive care unit, and recovery can take weeks. Treatment aims to stop more toxin being made, neutralise toxin that is still circulating, and support the body while the nerves recover:",
    },
    {
      k: "ul",
      items: [
        "**Tetanus immunoglobulin** — antibodies given by injection to neutralise toxin that has not yet attached to nerves",
        "**Wound cleaning** — thorough cleaning and removal of dead or contaminated tissue",
        "Antibiotics to kill the bacteria in the wound",
        "Medicines to control spasms and relax muscles, and to manage swings in heart rate and blood pressure",
        "**Intensive care** with a quiet, dimly lit room to reduce triggers, feeding support, and a breathing machine (ventilator) if the breathing muscles are affected",
        "A course of **tetanus vaccine**, because having the illness does not give lasting protection",
      ],
    },
    {
      k: "p",
      text: "Toxin that has already bound to nerves cannot be removed; recovery depends on the nerves slowly repairing themselves. That is why early treatment and, above all, prevention matter so much.",
    },

    { k: "h2", text: "Prevention and the tetanus injection" },
    { k: "h3", text: "Vaccination" },
    {
      k: "p",
      text: "Tetanus vaccine is given to children in India as part of combination vaccines under the national immunisation schedule, with booster doses later in childhood and adolescence. Pregnant women are offered a tetanus-containing vaccine during antenatal care; this protects the mother and passes protection to the newborn baby. Protection fades over the years, so adults need boosters. Keep your vaccination card, and ask your doctor whether you are due.",
    },
    { k: "h3", text: "After a wound" },
    {
      k: "ul",
      items: [
        "Wash the wound straight away with clean running water and soap, and remove dirt you can see",
        "Cover it with a clean dressing; avoid applying mud, ash, cow dung, turmeric pastes or other home remedies to wounds",
        "See a doctor for deep, dirty or puncture wounds, bites, burns, or wounds that will not stop bleeding",
        "The doctor will decide, based on the wound and your vaccination history, whether you need a tetanus booster (the 'TT' or Td injection most people know), and whether tetanus immunoglobulin is also needed if you were never fully vaccinated",
        "Watch for signs of infection — increasing pain, redness, swelling, pus or fever",
      ],
    },
    {
      k: "p",
      text: "A tetanus injection given after an injury does not protect against other infections such as [rabies](/conditions/rabies). After an animal bite, ask the doctor about rabies prevention as well.",
    },
    { k: "h3", text: "Clean births" },
    {
      k: "p",
      text: "Giving birth in a health facility or with a trained birth attendant, cutting the cord with a sterile blade, and keeping the cord stump clean and dry, without applying any substance to it, protects newborns from tetanus.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Suspected tetanus needs the emergency department straight away, where [emergency physicians](/specialties/emergency-medicine) and then [critical care](/specialties/critical-care) teams take over. An [infectious disease specialist](/specialties/infectious-diseases) may be involved in treatment. For wounds and vaccine boosters, a [general physician](/specialties/general-practice) is the right first contact; children's vaccinations are given by a paediatrician or at government health centres. Related vaccine-preventable illnesses include [diphtheria](/conditions/diphtheria) and [whooping cough](/conditions/whooping-cough).",
    },
    {
      k: "p",
      text: "You can [find emergency physicians in Bengaluru](/doctors/karnataka/bengaluru/emergency-physicians) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Do I need a tetanus injection after every cut?",
      a: "Not always. It depends on how dirty or deep the wound is and how long it has been since your last tetanus dose. Clean, minor cuts in a fully vaccinated person often need no injection. For deep, dirty or puncture wounds, or if you are unsure of your vaccination status, see a doctor.",
    },
    {
      q: "How long after an injury can tetanus symptoms appear?",
      a: "Symptoms usually start between a few days and about three weeks after the injury, though they can appear earlier or later. Jaw stiffness is often the first sign. Anyone who develops stiffness or spasms after a wound should go to an emergency department immediately.",
    },
    {
      q: "Is tetanus contagious?",
      a: "No. Tetanus cannot spread from one person to another. It comes from bacterial spores in soil, dust and dung that enter through a wound. Family members caring for someone with tetanus are not at risk, but they should check that their own vaccinations are up to date.",
    },
    {
      q: "If I had tetanus once, am I protected?",
      a: "No. The amount of toxin that causes illness is too small to build lasting immunity. People who recover from tetanus still need a full course of tetanus vaccine, and boosters later, to be protected in future.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Tetanus", url: "https://medlineplus.gov/tetanus.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
