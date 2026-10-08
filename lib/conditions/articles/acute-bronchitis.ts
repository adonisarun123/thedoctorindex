import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "acute-bronchitis",
  title: "Acute bronchitis: symptoms, care and which doctor to see",
  standfirst: "What a chest cold is, why the cough lingers, when antibiotics do and do not help, warning signs of pneumonia, and when to see a chest physician.",
  targetQuery: "acute bronchitis symptoms and treatment",
  department: "pulmonology",
  specialty: "pulmonology",
  alsoSee: ["general-practice", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Cough", "Mucus", "Wheezing", "Chest tightness", "Low fever", "Breathlessness"],
  tests: ["Chest X-ray", "Pulse oximetry"],
  treatments: ["Rest and fluids", "Honey", "Reliever inhaler", "Stopping smoking"],
  body: [
    { k: "h2", text: "What acute bronchitis is" },
    {
      k: "p",
      text: "Acute bronchitis is a short-lived inflammation of the bronchi, the larger tubes that carry air from the windpipe into the lungs. When their lining is irritated it swells and produces extra mucus, and the main result is a cough. Many people call it a chest cold, and that is a fair description: it very often follows a common cold or flu, as the infection moves down from the nose and throat into the chest.",
    },
    {
      k: "p",
      text: "\"Acute\" means it comes on quickly and settles on its own, usually within a few weeks. It is different from [chronic bronchitis](/conditions/chronic-bronchitis), in which a cough with phlegm returns month after month, year after year, most often in smokers or people exposed to smoke and dust for a long time. Chronic bronchitis is part of COPD and needs a different approach.",
    },
    {
      k: "p",
      text: "For most healthy adults and children, acute bronchitis is uncomfortable and tiring but not dangerous. The main things to get right are recognising when it might actually be something else, such as [pneumonia](/conditions/pneumonia), asthma or whooping cough, and not taking antibiotics that will not help.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Symptoms usually begin with a runny nose, sore throat or body ache, and the cough follows a few days later:" },
    {
      k: "ul",
      items: [
        "Cough, at first dry and then bringing up mucus that may be clear, white, yellow or green",
        "Chest tightness or soreness, often from the effort of coughing",
        "Wheezing — a whistling sound when breathing",
        "Mild breathlessness on exertion",
        "Low fever, tiredness and body ache, especially in the first few days",
      ],
    },
    {
      k: "p",
      text: "Yellow or green phlegm on its own does not mean a bacterial infection; the colour comes from the body's own immune cells and is common in viral bronchitis. The fever and aches usually settle within a week, but the cough is stubborn. It is normal for it to last two or three weeks, and in some people longer, because the airways stay sensitive for a while after the infection has gone.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "Most acute bronchitis is caused by viruses — the same ones that cause colds and [flu](/conditions/flu). Bacteria are a less common cause. The infection spreads through droplets when an infected person coughs, sneezes or talks, and through hands that touch the nose or mouth after touching contaminated surfaces. Irritants such as smoke, dust and fumes can inflame the airways too.",
    },
    { k: "p", text: "You are more likely to get it, or to have a harder time with it, if you:" },
    {
      k: "ul",
      items: [
        "Smoke cigarettes or beedis, or live with someone who smokes",
        "Cook over wood, dung or kerosene fires, or work around dust, fumes or chemicals",
        "Live in a city with heavy traffic and construction dust, especially during high-pollution months",
        "Have asthma, COPD, heart disease, diabetes or a weakened immune system",
        "Are very young or elderly",
        "Live or work in crowded spaces during the monsoon and winter, when respiratory infections spread more easily",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Acute bronchitis is usually diagnosed from your story and an examination. The doctor will ask how the illness started, how long the cough has lasted, whether you smoke, and whether you have asthma or other lung or heart problems, and will listen to your chest. In most cases no tests are needed.",
    },
    {
      k: "ul",
      items: [
        "**Pulse oximetry** — a small clip on the finger that measures oxygen in the blood. A low reading points towards something more serious.",
        "**Chest X-ray** — used when pneumonia is suspected, for example with a high fever, fast breathing, crackles heard over one part of the lung, or in older people who are more unwell than expected.",
        "Sputum tests, blood tests or tests for flu, COVID-19 or whooping cough may be done in particular situations, such as during an outbreak or when the cough comes in severe bouts.",
      ],
    },
    {
      k: "p",
      text: "If a cough lasts more than a few weeks, the doctor will look for other causes. In India this includes [tuberculosis](/conditions/tuberculosis), which should be tested for when a cough goes on for a couple of weeks or more, especially with weight loss, night sweats or blood in the sputum. Asthma, reflux, a post-nasal drip and some blood pressure medicines can also cause a long cough.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Because most acute bronchitis is viral, treatment is about easing symptoms while the body clears the infection. The main measures are:",
    },
    {
      k: "ul",
      items: [
        "**Rest and fluids** — warm water, soups and other drinks help loosen mucus and prevent dehydration, especially with fever",
        "**Honey** in warm water or tea can soothe a cough in adults and children older than one year. Never give honey to a baby under one year",
        "Steam from a bowl of hot water or a hot shower may ease a tight chest; take care with boiling water around children",
        "Paracetamol for fever and aches, at the dose on the label or as your doctor advises",
        "A **reliever inhaler** if there is wheezing, particularly in people who already have asthma",
        "**Stopping smoking**, and keeping smoke away from the home, which helps the airways recover",
      ],
    },
    { k: "h3", text: "Why antibiotics are usually not needed" },
    {
      k: "p",
      text: "Antibiotics do not work against viruses, and studies have shown they make little difference to how quickly most people with acute bronchitis get better. They can cause side effects such as diarrhoea and rashes, and unnecessary use adds to antibiotic resistance, which is a serious problem in India. Your doctor may prescribe them when there is a real reason, such as suspected pneumonia, whooping cough, or a person at high risk because of other illnesses. If you are prescribed a course, finish it as instructed.",
    },
    {
      k: "p",
      text: "Cough syrups have limited evidence behind them. Do not give over-the-counter cough and cold medicines to young children unless a doctor has advised it, and check with a pharmacist before combining products, as many contain the same ingredients.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "ul",
      items: [
        "Wash hands often with soap and water, and cover coughs and sneezes with a tissue or elbow",
        "Avoid smoking and second-hand smoke; a cleaner cooking fuel reduces smoke exposure at home",
        "Ask your doctor about a yearly flu vaccine, especially if you are older, pregnant or have a long-term illness",
        "Keep children's vaccines up to date under the national immunisation schedule, which includes protection against whooping cough",
        "Stay home when you are unwell to avoid spreading the infection",
      ],
    },

    { k: "h2", text: "When to see a doctor, and when it is an emergency" },
    { k: "p", text: "See a doctor if:" },
    {
      k: "ul",
      items: [
        "The cough lasts more than three weeks, or keeps coming back",
        "Fever is high, or lasts more than a few days",
        "You cough up blood, or lose weight without trying",
        "You have asthma, COPD, heart disease or diabetes and your symptoms are getting worse",
        "A baby or young child has a cough with fever, or coughs in fits followed by a whoop or vomiting",
      ],
    },
    {
      k: "p",
      text: "Call 112 or 108, or go to the nearest emergency department, if someone is struggling to breathe or cannot speak in full sentences, has blue or grey lips, chest pain, confusion or drowsiness, or if a child is breathing very fast, the skin pulls in between the ribs, or the child cannot feed.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most people with acute bronchitis can be seen by a [general physician](/specialties/general-practice), and children by a paediatrician. A [pulmonologist](/specialties/pulmonology), or chest physician, is the right specialist when a cough lasts longer than expected, keeps returning, comes with wheezing that could be asthma, or when you smoke and want your lungs checked for COPD.",
    },
    {
      k: "p",
      text: "You can [find pulmonologists in Bengaluru](/doctors/karnataka/bengaluru/pulmonologists) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Is acute bronchitis contagious?",
      a: "The viruses that usually cause it are contagious, especially in the first few days when fever and a runny nose are present. Washing hands, covering coughs and staying home while unwell reduce the chance of passing it on to family and colleagues.",
    },
    {
      q: "How long does the cough from bronchitis last?",
      a: "Fever and aches usually settle within a week, but the cough commonly lasts two to three weeks, sometimes longer, while the airways heal. A cough that goes on beyond three weeks, or keeps getting worse, should be checked by a doctor.",
    },
    {
      q: "Do I need antibiotics for bronchitis with yellow or green phlegm?",
      a: "Not usually. Coloured phlegm is common in viral infections and does not by itself mean bacteria are involved. Antibiotics do not help viral bronchitis and can cause side effects. Your doctor will decide whether there is a specific reason to prescribe them.",
    },
    {
      q: "What is the difference between bronchitis and pneumonia?",
      a: "Bronchitis affects the larger airways and usually causes a cough with mild illness. Pneumonia is infection in the tiny air sacs of the lung and tends to cause high fever, fast breathing, chest pain and feeling much sicker. A doctor's examination, and sometimes a chest X-ray, tells them apart.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Acute Bronchitis", url: "https://medlineplus.gov/acutebronchitis.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
