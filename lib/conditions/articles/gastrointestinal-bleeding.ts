import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "gastrointestinal-bleeding",
  title: "GI bleeding: symptoms, causes, treatment and which doctor to see",
  metaTitle: "GI bleeding: symptoms, causes and treatment",
  standfirst: "What blood in vomit or stool can mean, the common causes of bleeding in the digestive tract, how endoscopy finds and treats it, and when to call 112.",
  targetQuery: "gastrointestinal bleeding symptoms causes and treatment",
  department: "gastroenterology",
  specialty: "gastroenterology",
  alsoSee: ["emergency-medicine", "gi-surgery", "general-surgery"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Vomiting blood", "Black, tarry stools", "Blood in the stool", "Tiredness", "Dizziness"],
  tests: ["Blood tests", "Stool test", "Upper GI endoscopy", "Colonoscopy", "CT scan"],
  treatments: ["Fluids and blood transfusion", "Endoscopic treatment", "Acid-reducing medicines", "Surgery"],
  body: [
    { k: "h2", text: "What GI bleeding is" },
    {
      k: "p",
      text: "Gastrointestinal (GI) bleeding means bleeding anywhere along the digestive tract — the food pipe (oesophagus), stomach, small intestine, large intestine (colon), rectum or anus. It is not a disease in itself but a sign that something is wrong. The bleeding can be sudden and heavy, or so slow and small that it is found only on a blood or stool test.",
    },
    {
      k: "p",
      text: "Doctors divide it into upper GI bleeding, from the oesophagus, stomach or the first part of the small intestine, and lower GI bleeding, from the rest of the bowel. The difference matters because the likely causes, the tests and the treatment are different. Any unexplained bleeding from the gut deserves a medical opinion, even if it has stopped.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "h3", text: "Signs of bleeding from the upper digestive tract" },
    {
      k: "ul",
      items: [
        "Vomiting blood, which may be bright red or dark and grainy like coffee grounds",
        "Black, tarry stools that are sticky and have a strong smell (melaena) — blood that has been digested on its way through the gut",
      ],
    },
    { k: "h3", text: "Signs of bleeding from the lower digestive tract" },
    {
      k: "ul",
      items: [
        "Blood in the stool — bright red or maroon blood mixed with or coating the stool",
        "Bleeding from the back passage, or blood on the toilet paper or in the pan",
      ],
    },
    { k: "h3", text: "Signs of blood loss" },
    {
      k: "p",
      text: "Slow, hidden bleeding over weeks can cause anaemia, with tiredness, weakness, breathlessness on walking, pale skin, and a fast heartbeat. Heavy bleeding can cause dizziness or fainting, especially on standing up, sweating, cold clammy skin, confusion, and a rapid pulse — signs of shock that need emergency care.",
    },
    {
      k: "p",
      text: "Not every dark stool means bleeding. Iron tablets and some medicines turn stools dark, and beetroot can turn them red. If you are not sure, it is safer to get checked.",
    },

    { k: "h2", text: "Common causes" },
    { k: "p", text: "Upper GI bleeding is often caused by:" },
    {
      k: "ul",
      items: [
        "[Peptic ulcers](/conditions/peptic-ulcer) in the stomach or duodenum, often linked to Helicobacter pylori infection or to painkillers such as non-steroidal anti-inflammatory drugs (NSAIDs) and aspirin",
        "Swollen veins in the food pipe or stomach (varices) in people with [cirrhosis](/conditions/cirrhosis) of the liver, for example from long-term alcohol use or hepatitis B or C — this bleeding can be very heavy",
        "Inflammation of the food pipe or stomach lining, and tears in the food pipe after forceful or repeated vomiting",
        "Less often, cancers of the oesophagus or stomach",
      ],
    },
    { k: "p", text: "Lower GI bleeding is often caused by:" },
    {
      k: "ul",
      items: [
        "[Haemorrhoids (piles)](/conditions/hemorrhoids) and anal fissures, usually with bright red blood on the paper or in the pan",
        "Diverticular disease — small pouches in the colon wall that can bleed",
        "Inflammatory bowel disease such as [ulcerative colitis](/conditions/ulcerative-colitis) and Crohn's disease",
        "Bowel infections causing bloody diarrhoea (dysentery)",
        "Polyps and [colorectal cancer](/conditions/colorectal-cancer), which may bleed slowly and silently",
      ],
    },
    {
      k: "p",
      text: "Blood-thinning medicines and some painkillers make any bleeding more likely and heavier. Never stop a prescribed blood thinner on your own; tell the doctor you take it.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go straight to the nearest emergency department, if you or someone with you:" },
    {
      k: "ul",
      items: [
        "Vomits blood or material that looks like coffee grounds",
        "Passes black, tarry stools or a large amount of blood from the back passage",
        "Feels faint, dizzy, confused, cold and clammy, or collapses",
        "Has severe abdominal pain with the bleeding",
        "Has known liver disease or takes blood thinners and starts bleeding",
      ],
    },
    {
      k: "p",
      text: "Do not drive yourself. If you feel faint, lie down on your side, especially if you are vomiting, and do not eat or drink until you have been assessed, because an endoscopy may be needed.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "In an emergency, the first priority is to check blood pressure and pulse and to stabilise you. The doctor then works out where the bleeding is coming from. Tests may include:",
    },
    {
      k: "ul",
      items: [
        "**Blood tests** — haemoglobin to see how much blood has been lost, clotting tests, liver and kidney function, and blood group in case a transfusion is needed",
        "A **stool test** for hidden blood when bleeding is not visible",
        "**Upper GI endoscopy** — a thin, flexible camera passed through the mouth to look at the oesophagus, stomach and duodenum; it can often treat the bleeding at the same time",
        "**Colonoscopy** — a camera passed through the back passage to examine the colon, usually after bowel preparation; sigmoidoscopy looks at the lower part only",
        "**CT scan** with contrast (CT angiography) to locate active bleeding",
        "Capsule endoscopy — a swallowed camera pill — for bleeding from the small intestine that the other tests miss",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment depends on the cause and how heavy the bleeding is. Many episodes stop on their own, but the cause still needs to be found and treated.",
    },
    {
      k: "ul",
      items: [
        "**Fluids and blood transfusion** — through a drip, to restore blood volume in heavy bleeding",
        "**Endoscopic treatment** — during endoscopy or colonoscopy the doctor can stop bleeding with clips, heat, injections, or rubber bands placed around varices",
        "**Acid-reducing medicines** — for ulcers and inflammation in the stomach and food pipe; if Helicobacter pylori is found, a course of antibiotics with acid-reducing medicine",
        "Other medicines for bleeding varices in liver disease, and a review of painkillers and blood thinners",
        "Interventional radiology — blocking the bleeding vessel through a fine tube passed through an artery",
        "**Surgery** — when bleeding cannot be controlled in other ways, or to remove a tumour or diseased part of the bowel",
      ],
    },
    {
      k: "p",
      text: "Slow bleeding with anaemia is usually investigated as an outpatient, and iron may be given while the cause is treated.",
    },

    { k: "h2", text: "Reducing the risk" },
    {
      k: "ul",
      items: [
        "Avoid regular use of over-the-counter painkillers for aches; ask your doctor for safer options, especially if you are older or have had an ulcer",
        "Limit alcohol, and get tested and treated for hepatitis B and C if you are at risk",
        "Get indigestion, upper abdominal pain or a change in bowel habit checked rather than self-treating for months",
        "If you have cirrhosis, follow your doctor's plan for checking and treating varices",
        "Eat enough fibre and drink enough water to avoid constipation and straining, which aggravate piles and fissures",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Heavy or sudden bleeding is first handled in an emergency department by [emergency medicine](/specialties/emergency-medicine) doctors. A [gastroenterologist](/specialties/gastroenterology) performs endoscopy and colonoscopy and manages most causes. A [GI surgeon](/specialties/gi-surgery) or [general surgeon](/specialties/general-surgery) is involved when an operation is needed or for piles and fissures. For small amounts of bright red blood with piles, a general physician or general surgeon is a reasonable first stop.",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) or [emergency physicians in Bengaluru](/doctors/karnataka/bengaluru/emergency-physicians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Is a little blood in the stool always piles?",
      a: "Piles and fissures are common causes of small amounts of bright red blood, but other conditions, including inflammatory bowel disease, polyps and bowel cancer, can cause similar bleeding. Bleeding that is new, keeps happening, or comes with weight loss or bowel changes needs a doctor's check.",
    },
    {
      q: "Why are my stools black?",
      a: "Black, sticky, tarry stools can mean bleeding higher up in the digestive tract, which needs urgent attention. Iron tablets and some medicines can also turn stools dark, but they are usually not sticky. If you are unsure, see a doctor the same day.",
    },
    {
      q: "Is endoscopy painful?",
      a: "Endoscopy is usually done with a throat spray and often a sedative, so most people feel only mild discomfort or pressure. It is generally quick, and you will be advised not to drive for the rest of the day if you have had sedation.",
    },
    {
      q: "Can painkillers cause stomach bleeding?",
      a: "Yes. Non-steroidal anti-inflammatory painkillers and aspirin can damage the stomach lining and cause ulcers that bleed, especially in older people, with regular use, or together with blood thinners or steroids. Ask your doctor before taking them regularly.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Gastrointestinal Bleeding", url: "https://medlineplus.gov/gastrointestinalbleeding.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
