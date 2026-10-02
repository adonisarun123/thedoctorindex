import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "lung-cancer",
  title: "Lung cancer: symptoms, causes, tests and treatment",
  standfirst: "What lung cancer is, the symptoms that need a scan, why non-smokers get it too, how it is diagnosed and staged, and the treatments now available.",
  targetQuery: "lung cancer symptoms and treatment",
  department: "oncology",
  specialty: "medical-oncology",
  alsoSee: ["pulmonology", "surgical-oncology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Persistent cough", "Coughing up blood", "Breathlessness", "Chest pain", "Hoarseness", "Weight loss"],
  tests: ["Chest X-ray", "CT scan", "Biopsy", "PET-CT", "Molecular testing"],
  treatments: ["Surgery", "Radiotherapy", "Chemotherapy", "Targeted therapy", "Immunotherapy", "Palliative care"],
  body: [
    { k: "h2", text: "What lung cancer is" },
    {
      k: "p",
      text: "Lung cancer starts when cells in the lining of the airways or lungs grow out of control and form a tumour. It can spread to nearby lymph glands and to other parts of the body, such as the bones, brain, liver and adrenal glands.",
    },
    {
      k: "p",
      text: "There are two main groups. **Non-small cell lung cancer** is the more common; its main types are adenocarcinoma and squamous cell carcinoma. **Small cell lung cancer** grows faster and is closely linked to smoking. The type, the stage and, increasingly, the genetic changes inside the tumour decide treatment. Lung cancer found early can sometimes be removed completely; even when it is advanced, newer treatments help many people live longer and better.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Early lung cancer often causes no symptoms. When symptoms appear, they may include:" },
    {
      k: "ul",
      items: [
        "A persistent cough, or a change in a long-standing cough",
        "Coughing up blood, even a small streak",
        "Breathlessness",
        "Chest pain, or shoulder or back pain",
        "Hoarseness that does not settle",
        "Weight loss, loss of appetite and tiredness",
        "Repeated chest infections, or one that does not clear",
      ],
    },
    {
      k: "p",
      text: "Spread to other organs can cause bone pain, headaches, fits, or swelling of the face and neck. Any cough lasting more than a few weeks, or any coughing of blood, needs a doctor's assessment.",
    },

    { k: "h2", text: "Causes and who is at risk in India" },
    {
      k: "p",
      text: "Smoking — cigarettes, beedis, hookah — is the biggest single cause, and the risk rises with how much and how long a person has smoked. But **people who have never smoked also get lung cancer**, doctors in India regularly see it in women and men who have never smoked. Other risks include:",
    },
    {
      k: "ul",
      items: [
        "Second-hand smoke at home or work",
        "Outdoor air pollution and household smoke from cooking with wood, dung or coal",
        "Workplace exposure to asbestos, silica, diesel exhaust and some chemicals",
        "Radon, a natural radioactive gas, in some buildings",
        "A family history of lung cancer",
        "Previous lung damage, such as from tuberculosis or COPD",
      ],
    },
    {
      k: "note",
      tone: "info",
      title: "When TB treatment is not working",
      text: "Lung cancer and tuberculosis can look alike on a chest X-ray, and Indian doctors have reported patients with lung cancer being treated for TB for months before the cancer was found. If you are on TB treatment that was started without a positive test, and you are not improving, ask your doctor whether further tests such as a CT scan or biopsy are needed. Do not stop TB medicines on your own.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "ul",
      items: [
        "**Chest X-ray** — often the first test, but it can miss small tumours.",
        "**CT scan** of the chest — shows the size and position of a tumour and enlarged lymph glands.",
        "**Biopsy** — a sample of tissue, taken with a bronchoscope through the airways, a needle through the chest wall guided by CT, or an endoscopic ultrasound. A biopsy is needed to confirm cancer and its type.",
        "**PET-CT** — a scan that shows whether and where the cancer has spread, which decides the stage.",
        "**Molecular testing** — tests on the biopsy for genetic changes (such as EGFR, ALK and others) and a marker called PD-L1, which guide targeted therapy and immunotherapy.",
      ],
    },
    {
      k: "p",
      text: "An MRI of the brain, breathing tests and blood tests are also often needed to plan treatment. Stage runs from 1, where cancer is small and confined to the lung, to 4, where it has spread elsewhere.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [pulmonologist](/specialties/pulmonology) usually investigates a suspicious cough or scan and performs bronchoscopy. Treatment is planned by a team: a [medical oncologist](/specialties/medical-oncology) for chemotherapy, targeted therapy and immunotherapy; a [surgical oncologist](/specialties/surgical-oncology) or thoracic surgeon for operations; and a radiation oncologist for radiotherapy. Ask whether your case will be discussed at a multidisciplinary tumour board.",
    },
    {
      k: "p",
      text: "You can [find medical oncologists in Bengaluru](/doctors/karnataka/bengaluru/medical-oncologists), [surgical oncologists in Bengaluru](/doctors/karnataka/bengaluru/surgical-oncologists) or [pulmonologists in Bengaluru](/doctors/karnataka/bengaluru/pulmonologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment depends on the type and stage of cancer, the tumour's genetic profile, your lung function and your general health. Your team will decide based on all of these, and treatments are often combined.",
    },
    {
      k: "ul",
      items: [
        "**Surgery** — removing the tumour and part of the lung, for early-stage non-small cell cancer in people fit enough. Keyhole techniques are often used.",
        "**Radiotherapy** — high-energy X-rays aimed at the tumour. Highly focused radiotherapy can treat small early tumours in people who cannot have surgery; it is also used with chemotherapy and to ease symptoms.",
        "**Chemotherapy** — medicines given by drip in cycles, often combined with other treatments.",
        "**Targeted therapy** — tablets or drips that act on specific genetic changes found in the tumour. They can work very well when the matching change is present.",
        "**Immunotherapy** — medicines that help the immune system recognise and attack cancer cells.",
        "**Palliative care** — specialist support for pain, breathlessness and other symptoms, alongside cancer treatment at any stage, not only at the end of life.",
      ],
    },
    {
      k: "p",
      text: "Ask about side effects before starting, and report fever, breathlessness or severe diarrhoea during treatment promptly. Do not take unproven alternative remedies in place of treatment, and tell your oncologist about any supplements or herbal products, as some interact with cancer medicines.",
    },

    { k: "h2", text: "Living with lung cancer and follow-up" },
    {
      k: "ul",
      items: [
        "Stop smoking — it improves treatment results and recovery at every stage. The National Tobacco Quit Line on 1800-112-356 (toll-free) can help",
        "Stay as active as you can, and eat enough protein and calories",
        "Keep every follow-up scan and appointment after treatment",
        "Ask about counselling and support groups for you and your family",
        "Ask about financial support schemes your hospital can help you apply for",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Coughing up more than a small amount of blood",
        "Sudden or severe breathlessness",
        "Fever or shivering during chemotherapy or immunotherapy",
        "New weakness or numbness of the legs, or loss of bladder or bowel control",
        "Sudden swelling of the face, neck or arms, confusion or fits",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What type and stage of lung cancer do I have?",
        "Has my tumour been tested for genetic changes and PD-L1?",
        "What is the aim of treatment — to remove the cancer, control it or relieve symptoms?",
        "What are the side effects, and how will they be managed?",
        "Will my case be discussed by a tumour board?",
        "Who do I call if I become unwell during treatment?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can non-smokers get lung cancer?",
      a: "Yes. A significant number of people with lung cancer have never smoked. Second-hand smoke, air pollution, household cooking smoke, workplace exposures and genetic factors all contribute. Non-smokers are more likely to have tumours with genetic changes that can be treated with targeted medicines.",
    },
    {
      q: "Is lung cancer curable?",
      a: "Lung cancer found at an early stage can sometimes be removed completely with surgery or treated with focused radiotherapy. Advanced lung cancer is usually not curable, but targeted therapy and immunotherapy now control it for much longer than before in many people.",
    },
    {
      q: "Should I have a screening CT scan?",
      a: "Low-dose CT screening can find lung cancer early in people at high risk, mainly older long-term heavy smokers. Whether it suits you depends on your age and smoking history, and the possibility of false alarms. Discuss it with a pulmonologist before booking a scan.",
    },
    {
      q: "Does a biopsy make cancer spread?",
      a: "No. This is a common fear, but biopsies are safe and do not cause cancer to spread in any meaningful way. A biopsy is essential: it confirms the diagnosis and shows the type and genetic changes of the cancer, which decide the right treatment.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Lung Cancer", url: "https://medlineplus.gov/lungcancer.html" },
    { label: "World Health Organization — Lung cancer fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/lung-cancer" },
    { label: "Asian Pacific Journal of Cancer Prevention (2009) — A common medical error: lung cancer misdiagnosed as sputum-negative tuberculosis", url: "https://journal.waocp.org/article_24925_97c0cee6a7937225077292d4244f02ae.pdf" },
    { label: "National Tobacco Control Programme, MoHFW — National Tobacco Quit Line Services", url: "https://ntcp.mohfw.gov.in/national_tobacco_quit_line_services" },
  ],
};
