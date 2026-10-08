import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "indigestion",
  title: "Indigestion: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Indigestion (dyspepsia): symptoms, causes and treatment",
  standfirst: "What indigestion is, common triggers, warning signs that need a check-up, the tests a doctor may do, treatments that help, and which doctor to see.",
  targetQuery: "indigestion symptoms and treatment",
  department: "gastroenterology",
  specialty: "gastroenterology",
  alsoSee: ["general-practice", "internal-medicine"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Upper abdominal pain", "Bloating", "Early fullness", "Nausea", "Burping"],
  tests: ["H. pylori test", "Endoscopy", "Ultrasound", "Blood tests"],
  treatments: ["Diet and lifestyle changes", "Antacids", "Acid-reducing medicines", "H. pylori treatment"],
  body: [
    { k: "h2", text: "What indigestion is" },
    {
      k: "p",
      text: "Indigestion, which doctors call dyspepsia, is a general term for discomfort or pain in the upper part of the abdomen, usually during or after eating. Many people in India describe it as gas, acidity or an upset stomach. It is not a disease in itself but a group of symptoms, and almost everyone has it now and then, for example after a large, rich or late meal.",
    },
    {
      k: "p",
      text: "Occasional indigestion is usually harmless and settles by itself. Indigestion that keeps coming back, that wakes you at night, or that comes with warning signs such as weight loss or vomiting deserves a proper medical check, because it can sometimes be a sign of an ulcer, an infection, gallbladder disease or, rarely, cancer. In many people with long-standing indigestion, no structural cause is found; this is called functional dyspepsia and is real and treatable.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Upper abdominal pain or a burning feeling between the bottom of the breastbone and the navel",
        "Bloating, or a tight, uncomfortable feeling in the upper abdomen",
        "Early fullness — feeling full soon after starting a meal",
        "Uncomfortable fullness that lasts long after eating",
        "Nausea, and sometimes vomiting",
        "Burping or belching",
      ],
    },
    {
      k: "p",
      text: "Heartburn, a burning feeling that rises up behind the breastbone, and sour fluid coming into the mouth are features of acid reflux. They often occur with indigestion; see our page on [GERD](/conditions/gerd) if these are your main symptoms.",
    },
    {
      k: "p",
      text: "Pain in the upper abdomen or chest is not always from the stomach. A heart attack can feel like indigestion, especially in people with diabetes, women and older adults. If the discomfort comes on with exertion, spreads to the arm, jaw or back, or comes with sweating or breathlessness, treat it as an emergency.",
    },

    { k: "h2", text: "Causes and triggers" },
    {
      k: "p",
      text: "Indigestion can come from everyday habits or from an underlying condition. Common causes and triggers include:",
    },
    {
      k: "ul",
      items: [
        "Eating too much, too fast, or late at night shortly before lying down",
        "Fatty, fried or very spicy food, in people who notice it worsens their symptoms",
        "Too much tea, coffee, aerated drinks or alcohol",
        "Smoking and chewing tobacco",
        "Stress and anxiety",
        "Medicines such as painkillers like ibuprofen, diclofenac and aspirin, some antibiotics and iron tablets",
        "[H. pylori infection](/conditions/helicobacter-pylori-infections), gastritis and [peptic ulcers](/conditions/peptic-ulcer)",
        "Acid reflux, [gallstones](/conditions/gallstones) and, less often, pancreatitis",
        "Rarely, stomach or oesophageal cancer",
      ],
    },
    {
      k: "p",
      text: "Indigestion is also common during pregnancy, as hormones relax the valve at the top of the stomach and the growing baby presses upward.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Most people with mild, occasional indigestion do not need tests. If symptoms are frequent or persistent, your doctor will ask about your diet, medicines, alcohol and smoking, check for warning signs and examine your abdomen. Depending on what they find, they may suggest:",
    },
    {
      k: "ul",
      items: [
        "An **H. pylori test**, using a breath test or a stool sample",
        "**Blood tests** to check for anaemia, which can point to hidden bleeding, and for liver and other problems",
        "An abdominal **ultrasound** if gallstones or a liver or pancreas problem is suspected",
        "An **endoscopy**, in which a thin camera is passed through the mouth to look at the food pipe, stomach and the first part of the small intestine, with biopsies if needed",
      ],
    },
    {
      k: "p",
      text: "Endoscopy is usually advised if you have warning signs, if new symptoms start in later adult life, if there is a family history of stomach cancer, or if symptoms do not respond to treatment. The exact age at which doctors recommend it varies, so ask your own doctor.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment depends on the cause. When no specific cause is found, the aim is to relieve symptoms and reduce flare-ups.",
    },
    {
      k: "p",
      text: "**Diet and lifestyle changes** come first: eating smaller, regular meals, eating slowly, avoiding foods and drinks you notice make it worse, not lying down for a few hours after eating, stopping smoking, cutting down on alcohol and managing stress. Losing weight helps if you are overweight.",
    },
    {
      k: "p",
      text: "**Antacids** give quick, short-term relief for occasional symptoms. **Acid-reducing medicines**, such as H2 blockers and proton pump inhibitors, are used for more persistent symptoms, usually for a limited course followed by a review. Long-term use without supervision is not advisable, so do not keep taking acidity tablets bought over the counter for weeks without seeing a doctor. If the test for H. pylori is positive, **H. pylori treatment** with a combination of antibiotics and acid-reducing medicine is given.",
    },
    {
      k: "p",
      text: "For functional dyspepsia, doctors may also use medicines that help the stomach empty, or low doses of medicines that calm gut nerve signals, and psychological therapies can help when stress is a big factor. Gallstones, ulcers and other causes are treated specifically.",
    },

    { k: "h2", text: "Warning signs and emergencies" },
    {
      k: "p",
      text: "See a doctor soon, within days rather than weeks, if indigestion comes with any of these:",
    },
    {
      k: "ul",
      items: [
        "Unexplained weight loss or loss of appetite",
        "Difficulty or pain when swallowing, or food sticking",
        "Repeated vomiting",
        "Signs of anaemia, such as unusual tiredness, breathlessness or pale skin",
        "A lump in the abdomen",
        "New, persistent symptoms starting in later adult life",
      ],
    },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department immediately, if you have:" },
    {
      k: "ul",
      items: [
        "Chest pain or pressure, especially with sweating, breathlessness, or pain spreading to the arm, jaw or back",
        "Vomiting blood or material that looks like coffee grounds",
        "Black, tarry stools",
        "Sudden, severe abdominal pain",
        "Yellowing of the eyes or skin with pain and fever",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "For most people, a [general physician](/specialties/general-practice) or an [internal medicine specialist](/specialties/internal-medicine) is the right first doctor for indigestion. A [gastroenterologist](/specialties/gastroenterology) is the specialist to see if you have warning signs, need an endoscopy, have symptoms that keep returning despite treatment, or have a confirmed ulcer or H. pylori infection that has not cleared.",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What do you think is causing my symptoms?",
        "Do I need a test for H. pylori, or an endoscopy?",
        "Could any of my current medicines be making this worse?",
        "How long should I take acid-reducing medicine, and when do we review it?",
        "Which symptoms should make me come back sooner?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is gas and acidity the same as indigestion?",
      a: "People often use these words for the same thing: discomfort, burning, bloating or burping in the upper abdomen after meals. Doctors separate indigestion, which is centred in the upper abdomen, from heartburn caused by acid reflux, which burns behind the breastbone. Both are common and often occur together.",
    },
    {
      q: "Can I keep taking antacids every day?",
      a: "Antacids are fine for occasional relief, but needing them most days is a reason to see a doctor. Persistent symptoms may have a treatable cause such as an ulcer or H. pylori, and frequent self-treatment can hide warning signs that need investigation.",
    },
    {
      q: "Can stress cause indigestion?",
      a: "Yes. Stress and anxiety can make the gut more sensitive and are linked to functional dyspepsia, where no structural cause is found. Managing stress, regular meals and sleep can help. Even so, persistent symptoms should be checked by a doctor before being put down to stress.",
    },
    {
      q: "How can I tell if chest discomfort is indigestion or a heart problem?",
      a: "It can be difficult to tell them apart, even for doctors without tests. Discomfort that comes with exertion, spreads to the arm, jaw or back, or occurs with sweating, breathlessness or dizziness should be treated as a possible heart attack. Call 112 or 108 straight away.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Indigestion", url: "https://medlineplus.gov/indigestion.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
