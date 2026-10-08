import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "rabies",
  title: "Rabies: what to do after a dog bite, symptoms and prevention",
  metaTitle: "Rabies: what to do after a dog bite, and prevention",
  standfirst: "Rabies is almost always fatal once symptoms start, but fully preventable after a bite. What to do at once, how vaccination works, and who to see.",
  targetQuery: "what to do after dog bite rabies",
  department: "infectious-diseases",
  specialty: "emergency-medicine",
  alsoSee: ["general-practice", "infectious-diseases", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Fever", "Tingling or pain at the bite site", "Fear of water", "Agitation", "Confusion", "Paralysis"],
  tests: ["Wound assessment", "Saliva and skin tests"],
  treatments: ["Wound washing", "Rabies vaccine", "Rabies immunoglobulin", "Tetanus vaccination"],
  body: [
    { k: "h2", text: "What rabies is" },
    {
      k: "p",
      text: "Rabies is a viral infection of the brain and nerves, a form of [encephalitis](/conditions/encephalitis). It spreads to people through the saliva of an infected animal, usually by a bite or scratch, or when saliva touches broken skin, the eyes, nose or mouth. Once symptoms of rabies appear, the disease is almost always fatal.",
    },
    {
      k: "p",
      text: "The crucial point is this: **rabies can be prevented after a bite**, if the wound is washed straight away and the right vaccine — and, when needed, rabies immunoglobulin — is given promptly. Prompt, complete care after an exposure is highly effective.",
    },
    {
      k: "p",
      text: "In India, almost all human rabies follows bites or scratches from dogs, often stray dogs, and children are frequently bitten on the face, head and hands. Cats, monkeys, mongooses, jackals, foxes and farm animals such as cattle can also carry rabies. Animals with rabies may be aggressive and bite without reason, or may seem unusually quiet, weak or unable to swallow — but an animal that looks healthy can still transmit it.",
    },

    { k: "h2", text: "What to do immediately after a bite or scratch" },
    {
      k: "ul",
      items: [
        "**Wash the wound straight away** with soap and plenty of running water for at least 15 minutes. This removes much of the virus and is the single most important first-aid step. Then apply an antiseptic if available.",
        "Do not apply chilli, turmeric, oil, lime, herbs, coffee powder or other substances to the wound",
        "Do not cover the wound tightly or have it stitched straight away unless a doctor decides it is necessary",
        "Go to a hospital or clinic that gives anti-rabies treatment the **same day** — government hospitals and many health centres provide it. Do not wait to see whether the animal falls ill.",
        "Note what animal it was, whether it was a pet with known vaccination, and whether it can be observed",
      ],
    },
    {
      k: "p",
      text: "Even a minor scratch or a lick on broken skin from a dog, cat or monkey needs medical advice. Do not rely on traditional healers or home remedies — they do not prevent rabies.",
    },

    { k: "h2", text: "How doctors decide on treatment" },
    {
      k: "p",
      text: "The doctor will make a **wound assessment** and place the exposure in one of three categories, which follow World Health Organization guidance:",
    },
    {
      k: "ul",
      items: [
        "**Category I** — touching or feeding an animal, or a lick on unbroken skin. This is not an exposure; washing the skin is enough.",
        "**Category II** — nibbling of uncovered skin, or minor scratches or grazes without bleeding. Wound washing and a course of rabies vaccine are needed.",
        "**Category III** — one or more bites or scratches that break the skin, saliva on broken skin or on the eyes, mouth or nose, or any contact with bats. Wound washing, rabies vaccine and rabies immunoglobulin are needed.",
      ],
    },

    { k: "h2", text: "Post-exposure treatment" },
    {
      k: "p",
      text: "Treatment after a possible exposure is called post-exposure prophylaxis (PEP). It has three parts:",
    },
    {
      k: "ul",
      items: [
        "**Wound washing** and cleaning, repeated by the health team even if you washed it at home.",
        "**Rabies vaccine** — a course of injections given on a set schedule over a few weeks. The vaccine may be given into the muscle of the upper arm or into the skin, depending on the schedule your hospital uses. Modern rabies vaccines are safe for children, pregnant women and people of any age, and are not given in the stomach.",
        "**Rabies immunoglobulin** — ready-made antibodies injected into and around the wound for Category III exposures, to protect you during the days before the vaccine starts working.",
      ],
    },
    {
      k: "p",
      text: "The doctor will also check your **tetanus vaccination** status and give a booster if needed to prevent [tetanus](/conditions/tetanus), and may prescribe antibiotics if the wound is deep or likely to become infected. People who have had a full course of rabies vaccine before need a shorter booster course and usually do not need immunoglobulin, so keep your vaccination record safe.",
    },
    {
      k: "note",
      tone: "alert",
      title: "Complete every dose on time",
      text: "Do not stop the vaccine course early because the wound has healed or the animal seems well, unless your doctor tells you to. Keep your vaccination card and set reminders for each date. If you miss a dose, contact the clinic straight away rather than starting again on your own.",
    },
    {
      k: "p",
      text: "If the biting animal was a pet dog or cat that can be watched, your doctor may ask you to observe it. Treatment should still start immediately; the doctor will decide whether the course can be changed based on what happens to the animal.",
    },

    { k: "h2", text: "Symptoms of rabies" },
    {
      k: "p",
      text: "The time between a bite and the first symptoms is usually one to three months, but it can be as short as a week or longer than a year. Bites on the face, head and hands, and deep or multiple bites, can lead to symptoms sooner. This is why treatment is still worth seeking even if some time has passed since the bite. Symptoms include:",
    },
    {
      k: "ul",
      items: [
        "Fever, headache and tiredness at first",
        "Tingling or pain at the bite site, or a prickling or itching feeling there",
        "Fear of water (hydrophobia) — painful spasms of the throat when trying to drink, so that even the sight of water causes distress",
        "Fear of draughts or moving air",
        "Agitation, anxiety, hallucinations and confusion",
        "Excess saliva and difficulty swallowing",
        "Paralysis, which may spread slowly from the bitten limb, followed by coma",
      ],
    },

    { k: "h2", text: "How rabies is diagnosed" },
    {
      k: "p",
      text: "Decisions about vaccination after a bite are based on the wound assessment and the type of exposure, not on any test — there is no test that can show whether you have been infected before symptoms start. When rabies is suspected in a person who is already ill, doctors recognise it from the symptoms and history of an animal bite, and specialised laboratories can confirm it with **saliva and skin tests**, along with tests on spinal fluid or blood. These tests do not change the need to prevent the disease early.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "ul",
      items: [
        "Vaccinate pet dogs and cats against rabies and keep their vaccinations up to date",
        "Teach children not to tease, feed or touch stray dogs, monkeys or other animals, and to tell an adult about any bite or scratch, however small",
        "Do not approach animals that are behaving strangely, and do not handle bats",
        "Report stray dogs that seem unwell or aggressive to your local municipal authority",
        "People at high risk — such as veterinarians, animal handlers and laboratory staff — can ask about pre-exposure vaccination",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "p",
      text: "Every animal bite or scratch that breaks the skin should be seen the same day. Call 112 or 108, or go to the nearest emergency department, for heavy bleeding, deep or multiple bites, bites to the face, head or neck, or a child who has been attacked. Anyone who develops fever, confusion, difficulty swallowing, fear of water or weakness after an animal bite needs emergency hospital care immediately.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "After a bite, go to the nearest hospital emergency department or anti-rabies clinic, where an [emergency physician](/specialties/emergency-medicine) or a [general physician](/specialties/general-practice) can clean the wound and start treatment the same day. Children can be taken to a [paediatrician](/specialties/paediatrics), but do not delay if one is not immediately available. An [infectious disease specialist](/specialties/infectious-diseases) may advise on complex exposures, interrupted vaccine courses or people with a weakened immune system. Severe wounds may need a surgeon.",
    },
    {
      k: "p",
      text: "You can [find emergency physicians in Bengaluru](/doctors/karnataka/bengaluru/emergency-physicians) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at the clinic" },
    {
      k: "ul",
      items: [
        "Which category of exposure is this, and do I need rabies immunoglobulin?",
        "What are the dates for the remaining vaccine doses?",
        "Is my tetanus protection up to date?",
        "Should the animal be observed, and what should I report back?",
        "What should I do if I miss a dose or the wound becomes infected?",
      ],
    },
  ],
  faqs: [
    {
      q: "Do I need rabies injections after a small scratch from a dog?",
      a: "Usually yes. A scratch or graze that breaks the skin, even without bleeding, counts as an exposure and needs wound washing and a rabies vaccine course. Only touching an animal or a lick on unbroken skin does not need vaccination. Let a doctor assess it the same day.",
    },
    {
      q: "My pet dog is vaccinated. Do I still need treatment after a bite?",
      a: "Tell the doctor about the dog's vaccination record. A well-vaccinated pet is much less likely to carry rabies, but vaccination is not always complete or effective, so the doctor may still start treatment and ask you to watch the dog. Do not decide on your own to skip care.",
    },
    {
      q: "Is it too late to get the rabies vaccine if the bite was some days ago?",
      a: "No. Seek treatment as soon as you can, even if days or weeks have passed, as long as there are no symptoms of rabies. The time before symptoms can be long, and starting the vaccine late is much better than not starting it.",
    },
    {
      q: "Can rabies be treated once symptoms appear?",
      a: "Sadly, once symptoms of rabies begin, the disease is almost always fatal, and treatment focuses on comfort and care. This is why washing the wound and getting the vaccine promptly after any bite or scratch matters so much. Prevention works when it is started in time.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Rabies", url: "https://medlineplus.gov/rabies.html" },
    { label: "World Health Organization — Rabies fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/rabies" },
    { label: "Emergency Response Support System, Government of India — 112", url: "https://112.gov.in/" },
  ],
};
