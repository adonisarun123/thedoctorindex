import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "pancreatitis",
  title: "Pancreatitis: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Pancreatitis: symptoms, causes and treatment",
  standfirst: "Acute and chronic pancreatitis explained: the severe abdominal pain to act on, common causes such as gallstones and alcohol, tests and treatment.",
  targetQuery: "pancreatitis symptoms and treatment",
  department: "gastroenterology",
  specialty: "gastroenterology",
  alsoSee: ["general-surgery", "gi-surgery", "emergency-medicine"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Upper abdominal pain", "Pain spreading to the back", "Nausea", "Vomiting", "Fever", "Oily stools"],
  tests: ["Lipase", "Amylase", "Ultrasound", "CT scan", "MRCP"],
  treatments: ["Intravenous fluids", "Pain relief", "Gallbladder removal", "ERCP", "Pancreatic enzyme supplements"],
  body: [
    { k: "h2", text: "What pancreatitis is" },
    {
      k: "p",
      text: "The pancreas is a gland that lies behind the stomach. It makes digestive enzymes that help break down food in the intestine, and hormones such as insulin that control blood sugar. Pancreatitis is inflammation of the pancreas. It happens when the digestive enzymes become active while still inside the gland and start to damage it.",
    },
    {
      k: "p",
      text: "There are two main forms. **Acute pancreatitis** comes on suddenly, usually over hours, and most people recover within a week or so with hospital treatment. Some, however, develop severe disease in which part of the pancreas dies (necrotising pancreatitis), infection sets in, or other organs such as the lungs and kidneys are affected, and this can be life-threatening. **Chronic pancreatitis** is long-lasting inflammation that slowly and permanently damages the pancreas, so it can no longer make enough enzymes or insulin. Repeated attacks of acute pancreatitis can lead to the chronic form.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "h3", text: "Acute pancreatitis" },
    {
      k: "ul",
      items: [
        "Sudden, severe upper abdominal pain, often in the centre or upper left side",
        "Pain spreading to the back, which may be worse after eating or lying flat and a little easier when leaning forward",
        "Nausea and vomiting",
        "Fever and a fast pulse",
        "A swollen, tender abdomen",
      ],
    },
    { k: "h3", text: "Chronic pancreatitis" },
    {
      k: "ul",
      items: [
        "Recurring or constant upper abdominal pain, though some people have little pain",
        "Weight loss even when eating normally",
        "Oily stools that are pale, bulky, foul-smelling and hard to flush, because fat is not being digested",
        "High blood sugar or diabetes, as insulin-producing cells are lost",
      ],
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "The two most common causes of acute pancreatitis are [gallstones](/conditions/gallstones), which can block the duct the pancreas shares with the bile duct, and heavy alcohol use. Other causes include:",
    },
    {
      k: "ul",
      items: [
        "Very high levels of triglycerides, a type of fat in the blood",
        "High blood calcium",
        "Certain medicines",
        "Injury to the abdomen, or a complication of ERCP, a procedure on the bile and pancreatic ducts",
        "Infections such as mumps in some cases",
        "Inherited conditions and abnormalities of the pancreatic duct",
        "Autoimmune pancreatitis, and rarely a tumour blocking the duct",
      ],
    },
    {
      k: "p",
      text: "Chronic pancreatitis is most often linked to long-term heavy drinking and smoking. In India, doctors also see a form of chronic pancreatitis in younger people who do not drink alcohol, sometimes called idiopathic or tropical pancreatitis, which has been described particularly in southern states. Its causes are still being studied, and genetic factors are thought to play a role. In some people no cause is found.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "For acute pancreatitis, the diagnosis is based on typical pain together with blood tests and, where needed, imaging:",
    },
    {
      k: "ul",
      items: [
        "**Lipase** and **amylase** — enzymes from the pancreas that rise in the blood during an attack",
        "Other blood tests for liver function, triglycerides, calcium, kidney function and signs of severity",
        "**Ultrasound** of the abdomen, mainly to look for gallstones",
        "**CT scan** — used when the diagnosis is unclear or to assess severity and complications, usually a few days into the illness",
        "**MRCP** — a type of MRI scan that shows the bile and pancreatic ducts in detail without a procedure",
      ],
    },
    {
      k: "p",
      text: "Chronic pancreatitis is diagnosed mainly with imaging, which may show calcium deposits, a shrunken pancreas or an irregular duct, along with stool tests that check how well fat is digested and blood sugar tests. Endoscopic ultrasound is used at some centres.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Acute pancreatitis" },
    {
      k: "p",
      text: "Acute pancreatitis needs hospital admission. Treatment focuses on supporting the body while the pancreas recovers: **intravenous fluids** to prevent dehydration and protect the kidneys, **pain relief**, oxygen if needed, and close monitoring. Many people can start eating again once the pain and nausea settle; others are given nutrition through a feeding tube. People with severe disease may need intensive care.",
    },
    {
      k: "p",
      text: "Treating the cause prevents repeat attacks. If gallstones are responsible, **gallbladder removal**, usually by keyhole surgery, is generally advised once you have recovered, often during the same admission or soon after. **ERCP** may be used to remove a stone stuck in the bile duct. Alcohol should be stopped completely. Collections of fluid or dead tissue that develop later are sometimes drained using endoscopic, radiological or surgical procedures.",
    },
    { k: "h3", text: "Chronic pancreatitis" },
    {
      k: "p",
      text: "Treatment aims to control pain, replace what the pancreas can no longer make and prevent further damage. **Pancreatic enzyme supplements**, taken with meals, help digest food and reduce oily stools. Diabetes caused by pancreatitis is treated with medicines, often insulin. Stopping alcohol and smoking is essential. Endoscopic procedures or surgery can help some people with blocked ducts or severe pain.",
    },

    { k: "h2", text: "Living with it and preventing attacks" },
    {
      k: "ul",
      items: [
        "Avoid alcohol after an attack of pancreatitis, and stop completely if alcohol was the cause; ask your doctor what is safe for you",
        "Stop smoking, which speeds up damage in chronic pancreatitis",
        "If gallstones were the cause, do not delay the advised surgery",
        "Eat regular, balanced meals; a dietitian can advise on fat intake and nutrition if you have chronic pancreatitis",
        "Take enzyme supplements with every meal and snack as prescribed",
        "Have your blood sugar checked regularly, and keep follow-up appointments",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if you have:" },
    {
      k: "ul",
      items: [
        "Sudden, severe abdominal pain that does not ease, especially if it spreads to the back",
        "Persistent vomiting, so that you cannot keep fluids down",
        "Fever with abdominal pain, or yellowing of the eyes or skin",
        "Fast breathing, a racing heartbeat, dizziness or confusion",
        "Very little urine",
      ],
    },
    {
      k: "p",
      text: "Do not try to manage severe abdominal pain at home with painkillers or antacids. Early hospital care, particularly fluids, makes a difference in acute pancreatitis.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Acute pancreatitis is usually first treated in an emergency department, then by a [gastroenterologist](/specialties/gastroenterology) or a [general surgeon](/specialties/general-surgery). A [GI surgeon](/specialties/gi-surgery) may be involved for gallbladder removal or complications. Chronic pancreatitis is followed by a gastroenterologist, often together with an [endocrinologist](/specialties/endocrinology) for diabetes and a [dietitian](/specialties/dietetics).",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) or [GI surgeons in Bengaluru](/doctors/karnataka/bengaluru/gi-surgeons) on The Doctor Index, each with a registration you can check. Pain from pancreatitis is sometimes mistaken for [indigestion](/conditions/indigestion), and diabetes from pancreatitis can cause [high blood sugar](/conditions/hyperglycemia).",
    },
  ],
  faqs: [
    {
      q: "Can I drink alcohol again after pancreatitis?",
      a: "Doctors usually advise avoiding alcohol after pancreatitis. If alcohol caused the attack, drinking again greatly raises the risk of further attacks and chronic pancreatitis. Even when gallstones were the cause, alcohol can irritate a pancreas that is recovering. Ask for support if stopping is difficult.",
    },
    {
      q: "Is pancreatitis the same as pancreatic cancer?",
      a: "No. Pancreatitis is inflammation of the pancreas. However, long-standing chronic pancreatitis does increase the risk of pancreatic cancer over time, which is one reason regular follow-up with your gastroenterologist is important.",
    },
    {
      q: "Why do I need my gallbladder removed after gallstone pancreatitis?",
      a: "If gallstones caused the attack, more stones are likely to pass and trigger further attacks, which can be more severe. Removing the gallbladder greatly reduces this risk. People live normally without a gallbladder, as bile still flows from the liver into the intestine.",
    },
    {
      q: "What should I eat after an attack of pancreatitis?",
      a: "Most people start with light, low-fat meals as soon as they can eat comfortably, then return to a balanced diet. People with chronic pancreatitis may need enzyme supplements and advice from a dietitian. Your doctor will guide you based on how severe the attack was.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Pancreatitis", url: "https://medlineplus.gov/pancreatitis.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
