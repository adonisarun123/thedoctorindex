import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "chikungunya",
  title: "Chikungunya: symptoms, joint pain, tests and treatment",
  standfirst: "What chikungunya is, why the joint pain can last for months, how it is told apart from dengue, safe treatment at home, and when to see a rheumatologist.",
  targetQuery: "chikungunya symptoms and treatment",
  department: "infectious-diseases",
  specialty: "general-practice",
  alsoSee: ["rheumatology", "infectious-diseases"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Sudden high fever", "Severe joint pain", "Joint swelling", "Rash", "Headache", "Muscle pain"],
  tests: ["RT-PCR", "IgM antibody test", "Complete blood count"],
  treatments: ["Rest", "Fluids", "Paracetamol", "Physiotherapy"],
  body: [
    { k: "h2", text: "What chikungunya is" },
    {
      k: "p",
      text: "Chikungunya is a viral infection spread by the bite of infected *Aedes* mosquitoes — the same day-biting mosquitoes that spread dengue. The name comes from an East African language and means 'that which bends up', describing the stooped posture of people in severe joint pain.",
    },
    {
      k: "p",
      text: "The illness starts suddenly with fever and intense joint pain. Most people feel better within a week or two, and the infection is rarely fatal. But joint pain and stiffness can last for weeks, months or occasionally longer, and this is what makes chikungunya so disabling. Once you have had it, you are usually protected against it in future.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Symptoms usually start a few days to a week after the bite:" },
    {
      k: "ul",
      items: [
        "Sudden high fever",
        "Severe joint pain, often in both hands, wrists, ankles and feet, sometimes the knees and shoulders",
        "Joint swelling and morning stiffness",
        "Rash, often a few days into the illness",
        "Headache and muscle pain",
        "Tiredness, nausea, and sometimes red eyes",
      ],
    },
    {
      k: "p",
      text: "After the fever settles, some people develop long-lasting joint pain, swelling and stiffness that comes and goes. This is more common in older people and those with existing joint problems. Rarely, chikungunya affects the nerves, eyes, heart or liver, and it can be severe in newborns and in older adults with other illnesses.",
    },

    { k: "h2", text: "Who is at risk in India" },
    {
      k: "p",
      text: "Chikungunya occurs across India, often in outbreaks, and cases rise during and after the monsoon. *Aedes* mosquitoes breed in clean stored or standing water close to homes — coolers, flower-pot trays, overhead tanks, tyres, buckets and construction sites — and bite mainly during the day. Anyone can be infected. Severe illness and long-term joint problems are more likely in:",
    },
    {
      k: "ul",
      items: [
        "Newborns infected around the time of birth",
        "Adults over sixty-five",
        "People with diabetes, high blood pressure, heart disease or kidney disease",
        "People with existing arthritis",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Chikungunya is suspected from sudden fever with severe joint pain during an outbreak. Because dengue and chikungunya are spread by the same mosquito and look alike early on, doctors usually test for both, and often for malaria too.",
    },
    {
      k: "ul",
      items: [
        "**RT-PCR** — detects the virus in blood during the first few days of illness.",
        "**IgM antibody test** — detects the body's response from about the end of the first week.",
        "**Complete blood count** — the platelet count is usually less affected than in dengue, which helps tell them apart.",
      ],
    },
    {
      k: "p",
      text: "For joint pain that lasts more than a few weeks, blood tests for inflammation and for other types of arthritis, such as rheumatoid arthritis, may be done.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most people with chikungunya are diagnosed and treated by a [general physician](/specialties/general-practice). An [infectious disease specialist](/specialties/infectious-diseases) may help in complicated cases. A [rheumatologist](/specialties/rheumatology) is the right specialist when joint pain and swelling continue for more than a few weeks or months, or when the joints are being damaged.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) or [rheumatologists in Bengaluru](/doctors/karnataka/bengaluru/rheumatologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "There is no antiviral medicine for chikungunya. Treatment eases symptoms while the body clears the virus.",
    },
    {
      k: "ul",
      items: [
        "**Rest** during the fever, with gentle movement of the joints as pain allows.",
        "**Fluids** — water, oral rehydration solution, soups and juices.",
        "**Paracetamol** for fever and pain, in the dose your doctor advises.",
        "Cold packs on swollen joints may ease pain.",
      ],
    },
    {
      k: "note",
      tone: "alert",
      title: "Avoid some painkillers until dengue is ruled out",
      text: "Do not take aspirin, ibuprofen or other non-steroidal anti-inflammatory painkillers (NSAIDs) in the early days of a fever with joint pain unless a doctor has ruled out dengue. These medicines can increase the risk of bleeding in dengue. Once dengue has been excluded, your doctor may suggest an anti-inflammatory for joint pain.",
    },
    { k: "h3", text: "Long-lasting joint pain" },
    {
      k: "p",
      text: "For joint pain that persists, doctors may use anti-inflammatory medicines, a short course of steroids, or in a few people with chronic inflammatory arthritis, medicines used for rheumatoid arthritis. **Physiotherapy** and regular exercise help keep joints moving and reduce stiffness. Your doctor will decide based on how long the pain has lasted and whether there is joint swelling. Do not take steroids or other medicines without a prescription, and do not stop prescribed medicines on your own.",
    },
    {
      k: "p",
      text: "Vaccines against chikungunya have been approved in some countries, but they are not widely available or in routine use. Ask your doctor about current availability.",
    },

    { k: "h2", text: "Prevention and recovery" },
    {
      k: "ul",
      items: [
        "Empty, scrub and dry water containers, cooler trays and flower-pot saucers at least once a week",
        "Cover stored water; clear tyres, coconut shells and rubbish that hold rainwater",
        "Use mosquito repellent and wear clothing that covers arms and legs during the day",
        "Use window screens, nets — including for daytime naps — and vaporisers",
        "Keep someone with chikungunya under a net in the first week, so mosquitoes do not spread it",
        "Return to work and exercise gradually; persistent tiredness is common",
      ],
    },
    {
      k: "p",
      text: "Gentle daily stretching, warm water baths for stiff joints in the morning, and staying active within the limits of pain all help recovery. Massage oils and home remedies may feel soothing but do not shorten the illness.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest hospital, for:" },
    {
      k: "ul",
      items: [
        "Bleeding from the gums or nose, blood in vomit or stool, or severe abdominal pain — possible dengue",
        "Confusion, severe headache, fits, weakness or numbness of the limbs",
        "Difficulty breathing or chest pain",
        "Passing very little urine, or signs of dehydration",
        "A newborn or young baby with fever",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is this chikungunya, dengue or something else?",
        "Which painkiller is safe for me now?",
        "How long is the joint pain likely to last?",
        "What exercises or physiotherapy should I do?",
        "When should I see a rheumatologist?",
      ],
    },
  ],
  faqs: [
    {
      q: "How long does chikungunya joint pain last?",
      a: "For most people, joint pain improves within a few weeks. In some, especially older adults and people with existing joint problems, pain and stiffness can come and go for months or longer. Persistent pain should be assessed, as treatment and physiotherapy can help.",
    },
    {
      q: "Can I get chikungunya twice?",
      a: "It is thought that one infection gives long-lasting protection, so getting chikungunya again is uncommon. You can still catch dengue and other mosquito-borne infections, so keep protecting yourself and your family from mosquito bites.",
    },
    {
      q: "How is chikungunya different from dengue?",
      a: "Both cause sudden fever and are spread by the same mosquito. Chikungunya usually causes more severe joint pain and swelling, while dengue more often causes a low platelet count, bleeding and fluid leakage. Doctors often test for both, because dengue needs closer monitoring.",
    },
    {
      q: "Is chikungunya dangerous?",
      a: "It is rarely fatal, but it can be severe in newborns, older people and those with other illnesses. The main problem for most people is painful, long-lasting joint symptoms. Seek urgent help for bleeding, confusion, breathing difficulty or signs of dehydration.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Chikungunya", url: "https://medlineplus.gov/chikungunya.html" },
    { label: "World Health Organization — Chikungunya fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/chikungunya" },
  ],
};
