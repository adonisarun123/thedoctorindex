import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "constipation",
  title: "Constipation: causes, relief and when to see a doctor",
  standfirst: "What counts as constipation, common causes in adults and children, what helps, how laxatives should be used, and the warning signs that need a check.",
  targetQuery: "constipation causes and treatment",
  department: "gastroenterology",
  specialty: "general-practice",
  alsoSee: ["gastroenterology", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Infrequent stools", "Hard or lumpy stools", "Straining", "Feeling of incomplete emptying", "Bloating"],
  tests: ["Abdominal examination", "Blood tests", "Colonoscopy", "Anorectal manometry"],
  treatments: ["Fibre and fluids", "Physical activity", "Bulk-forming laxatives", "Osmotic laxatives", "Biofeedback therapy"],
  body: [
    { k: "h2", text: "What constipation is" },
    {
      k: "p",
      text: "Constipation means passing stools less often than is normal for you, or having stools that are hard, dry and difficult to pass. There is no single normal: healthy bowel habits range widely, from more than once a day to a few times a week. What matters is a change from your usual pattern, or difficulty and discomfort.",
    },
    {
      k: "p",
      text: "Most constipation is short-lived and caused by everyday factors such as diet, fluids, travel or a change in routine. When it lasts for several months it is called chronic constipation. In most people no serious cause is found, but persistent or new constipation in an adult should not be ignored, because occasionally it is a sign of another condition.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Infrequent stools — fewer than you usually pass",
        "Hard or lumpy stools",
        "Straining, or needing to sit on the toilet for a long time",
        "A feeling of incomplete emptying, or of a blockage in the back passage",
        "Bloating, wind and abdominal discomfort",
        "Needing to press around the anus or vagina to pass stool",
      ],
    },
    {
      k: "p",
      text: "Long-standing constipation can lead to piles, anal fissures (small, painful tears), and in older people, a hard mass of stool stuck in the rectum (faecal impaction), which can paradoxically cause leakage of liquid stool.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "ul",
      items: [
        "A diet low in fibre — refined flour, polished rice, and few vegetables, fruit, whole grains and pulses",
        "Not drinking enough, particularly in hot weather",
        "Little physical activity, long hours of sitting, or being confined to bed",
        "Ignoring the urge to go, often because of busy mornings, travel or unclean toilets",
        "Pregnancy and older age",
        "Medicines, including iron and calcium supplements, some painkillers (especially opioids), some antidepressants, antacids containing aluminium and some blood pressure medicines — do not stop a prescribed medicine on your own, but ask about it",
        "Conditions such as an underactive thyroid, diabetes, Parkinson's disease, depression and irritable bowel syndrome",
        "Problems coordinating the pelvic floor muscles when passing stool",
      ],
    },
    {
      k: "p",
      text: "In children, constipation is very common, often starting at toilet training, on starting school, or after a painful stool makes the child hold back. Holding back makes stools harder, which makes the next one more painful — a cycle that needs breaking early.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Constipation is usually diagnosed from your description and an **abdominal examination**, often with a rectal examination. Many people need no tests. Depending on your age and symptoms, a doctor may order:",
    },
    {
      k: "ul",
      items: [
        "**Blood tests** — blood count for anaemia, thyroid function, calcium and blood sugar",
        "**Colonoscopy** — a camera test of the large bowel, if there are warning signs or you are at the age for bowel cancer screening",
        "**Anorectal manometry** — measures how the muscles of the rectum and anus work together, for long-standing constipation with straining that does not respond to treatment",
      ],
    },
    {
      k: "p",
      text: "Other specialised tests, such as studies that track how fast stool moves through the bowel, are used only in a few people with severe constipation.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most constipation is managed by a [general physician](/specialties/general-practice). Children should see a [paediatrician](/specialties/paediatrics), particularly if constipation started in the first weeks of life or comes with poor growth. A [gastroenterologist](/specialties/gastroenterology) is the right choice for warning signs, constipation that does not respond to treatment, or when tests such as colonoscopy or manometry are needed.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians), [gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Everyday changes" },
    {
      k: "p",
      text: "**Fibre and fluids** come first: more vegetables, fruit such as guava, papaya and pears, whole grains, pulses and seeds, increased gradually to avoid bloating, with enough water through the day. **Physical activity** such as daily walking helps the bowel move. Set aside unhurried time after breakfast, when the bowel is naturally most active, and do not ignore the urge. A small footstool to raise the knees while sitting on a Western toilet can make passing stool easier.",
    },
    { k: "h3", text: "Laxatives" },
    {
      k: "p",
      text: "If these changes are not enough, laxatives can help, ideally chosen with a doctor or pharmacist. **Bulk-forming laxatives**, such as psyllium (isabgol), add fibre and need plenty of water. **Osmotic laxatives** draw water into the bowel to soften stool and are often used for children and longer-term use. Stimulant laxatives make the bowel contract and are generally for short-term use or when others have failed. Stool softeners and suppositories have specific uses.",
    },
    {
      k: "p",
      text: "Herbal 'churans' and repeated self-treatment with strong laxatives are widely used. Some contain stimulant ingredients, and relying on them for months without advice is not recommended. Tell your doctor what you are using. For chronic constipation that does not respond, prescription medicines are available, and pelvic floor problems are treated with **biofeedback therapy**, which retrains the muscles used to pass stool.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "ul",
      items: [
        "Build fibre into every meal rather than relying on supplements alone",
        "Drink regularly, more in hot weather and during exercise",
        "Keep active, especially if you sit for long hours",
        "Keep a regular toilet routine and do not delay",
        "For children: offer fibre-rich food and water, avoid excess milk in toddlers, and make toilet time relaxed rather than a battle",
      ],
    },

    { k: "h2", text: "Warning signs and emergencies" },
    {
      k: "p",
      text: "See a doctor soon if constipation is new and persistent in an adult, or comes with blood in the stool, weight loss, anaemia, a family history of bowel cancer, or alternating constipation and diarrhoea. Call 112 or 108, or go to the nearest emergency department, for:",
    },
    {
      k: "ul",
      items: [
        "Severe abdominal pain with a swollen abdomen",
        "Vomiting, especially green or brown vomit",
        "Being unable to pass stool or wind at all",
        "Heavy bleeding from the back passage",
        "A baby with constipation who is vomiting, has a swollen tummy or is not feeding",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Could any of my medicines be causing this?",
        "Do I need any tests, or a colonoscopy?",
        "Which laxative suits me, and for how long?",
        "Is it safe to use a laxative every day?",
        "Could my pelvic floor muscles be involved?",
        "What can I change in my child's diet and routine?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is it harmful not to pass stool every day?",
      a: "No. Normal ranges from more than once a day to a few times a week. If your stools are soft, easy to pass and your pattern has not changed, there is no need to worry. A change from your usual habit is more important.",
    },
    {
      q: "Are laxatives safe to use regularly?",
      a: "Bulk-forming and osmotic laxatives are generally considered safe for longer-term use when a doctor advises them, including in children. Stimulant laxatives are best kept for short-term use. Discuss regular laxative use with your doctor rather than relying on them without advice.",
    },
    {
      q: "Does drinking hot water or milk help constipation?",
      a: "Enough fluid helps, and a warm drink in the morning can encourage the bowel to move. Milk does not help and, in toddlers drinking a lot of it, can make constipation worse. Fibre, fluids, activity and routine matter most.",
    },
    {
      q: "When should a child with constipation see a doctor?",
      a: "See a doctor if constipation lasts more than a couple of weeks, the child has pain, blood in the stool, a swollen tummy, vomiting, poor growth, or soiling of underwear. Constipation from the first days of life also needs assessment.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Constipation", url: "https://medlineplus.gov/constipation.html" },
    { label: "American College of Gastroenterology — Constipation and Defecation Problems", url: "https://gi.org/topics/constipation-and-defection-problems/" },
  ],
};
