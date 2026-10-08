import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "abscess",
  title: "Abscess: symptoms, causes, treatment and which doctor to see",
  standfirst: "What an abscess is, how to tell a boil from something more serious, why most need draining rather than only tablets, and when to see a surgeon.",
  targetQuery: "abscess symptoms and treatment",
  department: "general-surgery",
  specialty: "general-surgery",
  alsoSee: ["general-practice", "dentistry"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Swelling", "Pain", "Redness", "Fever", "Pus"],
  tests: ["Ultrasound", "Blood sugar", "Pus culture", "CT scan"],
  treatments: ["Incision and drainage", "Antibiotics", "Warm compresses", "Wound dressing"],
  body: [
    { k: "h2", text: "What an abscess is" },
    {
      k: "p",
      text: "An abscess is a pocket of pus that forms inside the body's tissues. When germs, usually bacteria, get into an area, the immune system sends white blood cells to fight them. The battle leaves behind a thick fluid made of white cells, germs and broken-down tissue. That fluid is pus, and when the body walls it off into a closed pocket, the result is an abscess.",
    },
    {
      k: "p",
      text: "Abscesses can form almost anywhere. The ones most people meet are on the skin: a large boil (often called a 'pus boil' or, in Hindi, a 'phoda'), an infected hair root in the armpit or groin, or a painful lump near the anus. Others form in the gums around a tooth, in the breast during breastfeeding, or deep inside the body in organs such as the liver, or in the abdomen after appendicitis or surgery. Skin abscesses are common and usually simple to treat. Deep abscesses are less common, harder to spot, and need hospital care.",
    },
    {
      k: "p",
      text: "The wall around the pus is the reason an abscess behaves differently from other infections. Antibiotic tablets travel in the blood, and they do not get into a walled-off pocket of pus very well. That is why most abscesses that are more than small need to be opened and drained.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "A skin abscess usually builds up over a few days. Typical signs are:" },
    {
      k: "ul",
      items: [
        "A tender lump with swelling under the skin, which may feel soft or 'fluid-filled' in the centre",
        "Pain that throbs and gets steadily worse",
        "Redness and warmth of the surrounding skin",
        "A white or yellow head, through which pus may burst out",
        "Fever, chills or feeling generally unwell, especially with larger abscesses",
      ],
    },
    {
      k: "p",
      text: "A dental abscess causes throbbing toothache, a swollen gum or cheek, a bad taste and pain on biting. An abscess near the anus causes constant pain in the area that is worse on sitting or passing stool. A deep abscess inside the body may cause only fever, tiredness, weight loss or pain in one area, which is why it can be missed for some time.",
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "Most skin abscesses are caused by bacteria that normally live on the skin, especially *Staphylococcus aureus*. They get in through a small cut, an insect bite, an injection site, a shaving nick or an inflamed hair root. Abscesses elsewhere have their own causes: tooth decay and gum disease for dental abscesses, a blocked gland for anal abscesses, and a burst appendix or bowel infection for abscesses in the abdomen. In India, an amoebic liver abscess can follow infection with an intestinal parasite spread through contaminated food and water.",
    },
    { k: "p", text: "You are more likely to get abscesses, or to get them again and again, if you:" },
    {
      k: "ul",
      items: [
        "Have diabetes, particularly if your blood sugar is not well controlled",
        "Have a weakened immune system, for example from steroid medicines, chemotherapy or untreated HIV",
        "Have skin conditions that break the skin, such as eczema or scabies",
        "Live in hot, humid weather and wear tight clothing that rubs the skin",
        "Share razors, towels or close living space with someone who has recurring boils",
        "Inject drugs, or have a wound that is not kept clean",
      ],
    },
    {
      k: "p",
      text: "Anyone who gets repeated boils should have their blood sugar checked, because recurring skin infections are sometimes the first clue to [type 2 diabetes](/conditions/diabetes-type-2).",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "A skin abscess is usually diagnosed simply by looking and feeling. The doctor will check how big it is, whether there is a soft collection of pus, and whether redness is spreading beyond it, which could mean [cellulitis](/conditions/cellulitis). Depending on the situation, they may arrange:",
    },
    {
      k: "ul",
      items: [
        "**Ultrasound** — shows whether there is a pocket of pus, how big it is, and whether it is deeper than it looks. It is also used for breast and many deep abscesses.",
        "**Blood sugar** — a simple check for diabetes, especially with large or repeated abscesses.",
        "**Pus culture** — a sample of the pus is sent to the laboratory to identify the germ and which antibiotics work against it. This is useful for repeated, unusual or severe infections.",
        "**CT scan** — used when an abscess is suspected inside the abdomen, chest or another deep organ.",
        "Blood tests to look for signs of infection, and a dental X-ray for a tooth abscess.",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment depends on the size and site of the abscess and on your general health. The guiding idea is that pus needs a way out.",
    },
    { k: "h3", text: "Small skin abscesses" },
    {
      k: "p",
      text: "A very small boil may come to a head and drain on its own. **Warm compresses** — a clean cloth soaked in warm water and held on the area several times a day — can ease pain and help it drain. Keep the area clean and covered, and wash your hands after touching it. Do not squeeze, prick or cut a boil yourself, and do not use a needle at home: this can push the infection deeper into the skin or the bloodstream.",
    },
    { k: "h3", text: "Incision and drainage" },
    {
      k: "p",
      text: "Most abscesses that are larger, very painful or not settling need **incision and drainage**. After numbing the skin with a local anaesthetic, the doctor makes a small cut, lets the pus out, and cleans the cavity. Larger or awkwardly placed abscesses, such as those near the anus or in the breast, may be drained in an operation theatre under anaesthesia. Some deep abscesses can be drained through a thin tube placed under ultrasound or CT guidance, avoiding open surgery.",
    },
    {
      k: "p",
      text: "Afterwards the wound is usually left open to heal from the inside out, sometimes with a gauze pack inside for the first days. Regular **wound dressing** changes, at a clinic or at home once you have been shown how, keep it clean while it closes.",
    },
    { k: "h3", text: "Antibiotics" },
    {
      k: "p",
      text: "**Antibiotics** are not always needed once a simple skin abscess has been drained. Your doctor is more likely to prescribe them if there is spreading redness, fever, an abscess on the face or hand, diabetes or a weak immune system, or an abscess deep inside the body. If they are prescribed, take the full course. Do not take leftover antibiotics or buy them over the counter without a prescription: the wrong drug delays proper treatment and adds to antibiotic resistance.",
    },
    {
      k: "p",
      text: "A dental abscess is treated by a dentist, who drains it and deals with the cause, usually with root canal treatment or removing the tooth. Antibiotics alone only quieten a dental abscess for a while. An amoebic liver abscess is treated mainly with medicines that kill the parasite, sometimes with drainage.",
    },

    { k: "h2", text: "Preventing abscesses from coming back" },
    {
      k: "ul",
      items: [
        "Wash minor cuts, bites and scratches with soap and clean water and keep them covered until healed",
        "Do not share razors, towels or bedding, especially if anyone at home has had boils",
        "If you have diabetes, keeping blood sugar in range is one of the most useful things you can do",
        "Keep skin folds dry in hot weather and choose loose cotton clothing",
        "See a dentist for toothache rather than waiting for swelling, and keep up regular dental check-ups",
        "If boils keep returning, ask your doctor whether you or your family carry the bacteria on the skin and whether a decolonisation routine would help",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if an abscess comes with:" },
    {
      k: "ul",
      items: [
        "High fever with shivering, a fast heartbeat, fast breathing, confusion or feeling faint — possible signs of [sepsis](/conditions/sepsis)",
        "Redness or swelling that is spreading quickly, or skin that turns dark, blistered or numb",
        "Swelling in the mouth, jaw or neck that makes it hard to swallow, breathe or open the mouth",
        "An abscess on the face near the nose or eye, with headache, eye swelling or blurred vision",
        "Severe pain in the abdomen with fever, especially after recent surgery or appendicitis",
      ],
    },
    {
      k: "p",
      text: "People with diabetes, the elderly, babies and anyone on treatment that lowers immunity can become seriously ill faster, so they should seek care earlier for any abscess.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "For a first boil or small abscess, a [general physician](/specialties/general-practice) can assess it and drain a simple one. A [general surgeon](/specialties/general-surgery) is the right doctor for abscesses that need draining under anaesthesia, those near the anus or in the breast, abscesses that keep returning, and abscesses inside the abdomen. A [dentist](/specialties/dentistry) should see any abscess related to a tooth or gum.",
    },
    {
      k: "p",
      text: "You can [find general surgeons in Bengaluru](/doctors/karnataka/bengaluru/general-surgeons), [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) or [dentists in Bengaluru](/doctors/karnataka/bengaluru/dentists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Does this abscess need draining, or can it be managed without?",
        "Do I need antibiotics, and if so, why?",
        "How do I look after the wound, and how often should the dressing be changed?",
        "Should my blood sugar be checked?",
        "What signs mean I should come back sooner?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can an abscess go away without draining?",
      a: "A very small boil sometimes bursts and heals by itself, helped by warm compresses. Larger, painful or deep abscesses usually do not settle until the pus is let out, and antibiotics alone often only delay healing.",
    },
    {
      q: "Is draining an abscess painful?",
      a: "The skin is numbed with a local anaesthetic first, so most people feel pressure rather than sharp pain. Larger abscesses may be drained under anaesthesia. Many people feel relief soon afterwards because the pressure of the pus is gone.",
    },
    {
      q: "Why do I keep getting boils?",
      a: "Repeated boils can be linked to diabetes, carrying staphylococcus bacteria on the skin or in the nose, close contact with someone who has boils, or friction and sweat. A doctor can check your blood sugar and suggest ways to break the cycle.",
    },
    {
      q: "Is a dental abscess dangerous?",
      a: "It can be. An untreated dental abscess can spread into the jaw, face and neck. Swelling that affects swallowing or breathing is an emergency. See a dentist early for toothache with swelling, rather than relying on painkillers or antibiotics alone.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Abscess", url: "https://medlineplus.gov/abscess.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
