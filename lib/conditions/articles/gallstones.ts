import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "gallstones",
  title: "Gallstones: symptoms, tests, surgery and which doctor to see",
  standfirst: "What gallstones are, the pain they cause, when they need no treatment, how gallbladder removal works, and the warning signs of complications.",
  targetQuery: "gallstones symptoms and treatment",
  department: "gastroenterology",
  specialty: "general-surgery",
  alsoSee: ["gastroenterology", "gi-surgery"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Pain in the upper right abdomen", "Nausea and vomiting", "Fever", "Jaundice", "Indigestion"],
  tests: ["Ultrasound", "Liver function tests", "MRCP", "Endoscopic ultrasound"],
  treatments: ["Watchful waiting", "Laparoscopic cholecystectomy", "ERCP", "Bile acid tablets"],
  body: [
    { k: "h2", text: "What gallstones are" },
    {
      k: "p",
      text: "The gallbladder is a small pouch under the liver that stores bile, a digestive fluid made by the liver. After a meal, especially a fatty one, the gallbladder squeezes bile through a tube (the bile duct) into the intestine. Gallstones form when substances in bile — mostly cholesterol, or sometimes a pigment called bilirubin — harden into stones. They range from grains of sand to the size of a golf ball.",
    },
    {
      k: "p",
      text: "Most people with gallstones never know they have them. Stones are often found by chance on an ultrasound done for another reason. Problems arise when a stone blocks the outlet of the gallbladder or slips into the bile duct.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "A gallstone attack (biliary colic) happens when a stone blocks the gallbladder outlet for a while. Typically:",
    },
    {
      k: "ul",
      items: [
        "Pain in the upper right abdomen or the centre just below the breastbone, steady rather than cramping, lasting from half an hour to several hours",
        "Pain that may spread to the right shoulder blade or back",
        "Nausea and vomiting",
        "Attacks that often come after a heavy meal or at night",
      ],
    },
    {
      k: "p",
      text: "Pain that lasts longer, with fever, suggests an inflamed gallbladder (cholecystitis). Jaundice — yellow eyes, dark urine and pale stools — suggests a stone in the bile duct. Severe pain spreading to the back with vomiting can mean pancreatitis. Vague indigestion, bloating and burping are often blamed on gallstones but are frequently due to something else, and removing the gallbladder may not help them.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "ul",
      items: [
        "Women, especially during and after pregnancy, and those taking oestrogen-containing medicines",
        "Increasing age",
        "Carrying extra weight, and also losing weight very quickly, including after weight-loss surgery",
        "Diabetes and high triglycerides",
        "A family history of gallstones",
        "Conditions that break down red blood cells, such as sickle cell disease or thalassaemia, which cause pigment stones",
        "Liver cirrhosis",
      ],
    },
    {
      k: "p",
      text: "Gallstones are seen across India. Doctors note that gallbladder cancer, although uncommon overall, is more frequent in some parts of north and north-east India, and long-standing gallstones are one of its risk factors. This is one of the things your doctor will weigh when deciding whether stones without symptoms should be removed.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "ul",
      items: [
        "**Ultrasound** of the abdomen — the main test. It shows stones in the gallbladder and signs of inflammation, and is quick and painless.",
        "**Liver function tests** and blood count — raised levels suggest a stone in the bile duct or infection. Blood tests for pancreatic enzymes check for pancreatitis.",
        "**MRCP** — a type of MRI scan that shows the bile ducts in detail, used when a duct stone is suspected.",
        "**Endoscopic ultrasound** — a camera with an ultrasound probe passed through the mouth, which can find small duct stones.",
      ],
    },
    {
      k: "p",
      text: "A CT scan is sometimes used when the diagnosis is unclear or a complication is suspected. Your doctor will also want to rule out other causes of upper abdominal pain, such as an ulcer, reflux or a heart problem.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Gallbladder removal is done by a [general surgeon](/specialties/general-surgery) or a [GI surgeon](/specialties/gi-surgery). A [gastroenterologist](/specialties/gastroenterology) is involved for stones in the bile duct, which are often removed by endoscopy, and when the cause of symptoms is uncertain. Complicated or repeat surgery, and suspicion of cancer, are usually handled by GI surgeons.",
    },
    {
      k: "p",
      text: "You can [find general surgeons in Bengaluru](/doctors/karnataka/bengaluru/general-surgeons), [GI surgeons in Bengaluru](/doctors/karnataka/bengaluru/gi-surgeons) or [gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Stones without symptoms" },
    {
      k: "p",
      text: "**Watchful waiting** is usually advised for gallstones that cause no symptoms, because many people never develop problems. Your surgeon may recommend removal anyway in particular situations — for example, very large stones, a porcelain-like gallbladder wall, a polyp, some blood disorders, or other factors that raise the risk of cancer or complications. Your doctor will decide based on your scan and history.",
    },
    { k: "h3", text: "Stones that cause symptoms" },
    {
      k: "p",
      text: "Once gallstones have caused pain or a complication, attacks tend to recur, and the usual treatment is to remove the gallbladder. **Laparoscopic cholecystectomy** — keyhole surgery through a few small cuts — is the standard operation. Most people go home within a day or two and return to normal activities within a couple of weeks. Occasionally the surgeon needs to convert to an open operation for safety.",
    },
    {
      k: "p",
      text: "You can live normally without a gallbladder; bile flows directly from the liver into the intestine. Some people notice looser stools for a while after surgery. A strict fat-free diet is not usually needed afterwards.",
    },
    { k: "h3", text: "Stones in the bile duct" },
    {
      k: "p",
      text: "**ERCP** — an endoscopic procedure through the mouth — is commonly used to remove stones from the bile duct, and the gallbladder is then usually removed as well. Inflamed gallbladders and pancreatitis are treated in hospital with fluids, pain relief and often antibiotics before or along with surgery.",
    },
    { k: "h3", text: "Non-surgical options" },
    {
      k: "p",
      text: "**Bile acid tablets** can slowly dissolve small cholesterol stones in a few people who cannot have surgery, but they take many months, often fail, and stones usually come back when they are stopped. Home remedies and 'stone-flush' drinks do not dissolve gallstones and can delay needed care.",
    },

    { k: "h2", text: "Living with gallstones and recovering from surgery" },
    {
      k: "ul",
      items: [
        "Smaller, regular meals and less heavily fried food may reduce attacks while you wait for surgery",
        "Avoid crash diets; lose weight gradually if you need to",
        "After surgery, walk early, follow wound-care advice and keep your follow-up appointment",
        "Ask what the gallbladder report (histopathology) showed after removal",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Severe abdominal pain that lasts more than a few hours or keeps getting worse",
        "Pain with fever, shivering or rigors",
        "Yellow eyes or skin, especially with fever",
        "Severe pain going through to the back with repeated vomiting",
        "Feeling faint, confused or very unwell",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Are my symptoms definitely caused by the gallstones?",
        "Do my stones need to be removed, or is it safe to wait?",
        "Is there any sign of a stone in the bile duct?",
        "Will the operation be keyhole, and how long is recovery?",
        "Will the removed gallbladder be sent for examination?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can gallstones go away on their own?",
      a: "Gallstones rarely disappear by themselves, although small ones can pass through the bile duct, sometimes causing problems on the way. Stones that cause no symptoms can usually be left alone. Stones that cause attacks tend to keep doing so.",
    },
    {
      q: "Can I live normally without a gallbladder?",
      a: "Yes. The liver keeps making bile, which flows straight into the intestine. Most people eat normally after recovery. Some have looser stools or mild indigestion for a while, which usually settles; tell your doctor if it does not.",
    },
    {
      q: "Can the stones be removed and the gallbladder kept?",
      a: "Removing only the stones is not usually advised, because the gallbladder that made them tends to form new ones. Removing the whole gallbladder is the standard treatment. Bile acid tablets are an option only for a few people.",
    },
    {
      q: "Is gallbladder surgery safe?",
      a: "Laparoscopic cholecystectomy is one of the most commonly performed operations and is generally safe. Like any surgery it carries risks, including bleeding, infection and, rarely, injury to the bile duct. Ask your surgeon about their experience and what to expect.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Gallstones", url: "https://medlineplus.gov/gallstones.html" },
    { label: "American College of Gastroenterology — Gallstones in Women", url: "https://gi.org/topics/gallstones/" },
  ],
};
