import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "diphtheria",
  title: "Diphtheria: symptoms, treatment, vaccine and which doctor to see",
  metaTitle: "Diphtheria: symptoms, treatment, vaccine and who to see",
  standfirst: "What diphtheria is, the throat membrane and other warning signs, why it needs hospital treatment, and how DPT and Td vaccines prevent it.",
  targetQuery: "diphtheria symptoms and treatment",
  department: "infectious-diseases",
  specialty: "infectious-diseases",
  alsoSee: ["paediatrics", "ent", "general-practice"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Sore throat", "Fever", "Grey membrane in the throat", "Swollen neck", "Difficulty breathing"],
  tests: ["Throat swab", "Culture", "ECG"],
  treatments: ["Diphtheria antitoxin", "Antibiotics", "Isolation", "Vaccination"],
  body: [
    { k: "h2", text: "What diphtheria is" },
    {
      k: "p",
      text: "Diphtheria is a serious bacterial infection, usually of the nose and throat, caused by Corynebacterium diphtheriae. The danger comes from a toxin that some strains of the bacteria make. In the throat, the toxin kills the lining cells, which form a thick, tough coating called a membrane. This can block the airway. The toxin can also travel in the blood and damage the heart, the nerves and the kidneys.",
    },
    {
      k: "p",
      text: "Diphtheria is almost entirely preventable with vaccination, and it has become rare in countries with high vaccine coverage. In India, cases and outbreaks are still reported, mostly in children who were never vaccinated or did not complete their doses, and sometimes in adults whose protection has faded. It is a notifiable disease, which means doctors report cases to public health authorities so that contacts can be traced and protected.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually start a few days after exposure. Early on, diphtheria can look like an ordinary throat infection, which is why it is sometimes missed:",
    },
    {
      k: "ul",
      items: [
        "Sore throat and pain on swallowing",
        "Fever, usually not very high, with tiredness and weakness",
        "A grey membrane in the throat or on the tonsils — a thick grey or whitish coating that sticks firmly and may bleed if scraped",
        "A swollen neck from enlarged glands, sometimes called a bull neck",
        "Difficulty breathing, noisy breathing or a hoarse, barking voice if the membrane spreads to the voice box",
        "A runny nose with blood-stained discharge in nasal diphtheria",
      ],
    },
    {
      k: "p",
      text: "Diphtheria can also infect the skin, causing sores or shallow ulcers that heal slowly. Skin diphtheria is usually less severe but can still spread the bacteria to others. A throat with a firmly stuck membrane is different from the loose white spots of common [tonsillitis](/conditions/tonsillitis); if in doubt, see a doctor the same day.",
    },

    { k: "h2", text: "How it spreads and who is at risk" },
    {
      k: "p",
      text: "Diphtheria spreads through droplets when an infected person coughs or sneezes, through close contact, and less often by touching infected skin sores or items contaminated with discharge. Some people carry the bacteria in their throat without being ill and can still pass it on.",
    },
    {
      k: "ul",
      items: [
        "Children who have missed some or all of their routine vaccines",
        "Adults who have not had booster doses since childhood",
        "People living in crowded housing or with limited access to health services",
        "Close household contacts of someone with diphtheria",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "p",
      text: "Diphtheria is treated in hospital. Call 112 or 108, or go to the nearest emergency department, if someone with a sore throat:",
    },
    {
      k: "ul",
      items: [
        "Has noisy breathing, struggles to breathe, or the skin pulls in at the neck or between the ribs",
        "Cannot swallow saliva and is drooling",
        "Has a grey membrane in the throat, or a markedly swollen neck",
        "Becomes very weak, pale, drowsy, or has a fast or irregular heartbeat",
      ],
    },
    {
      k: "p",
      text: "Tell the hospital staff if diphtheria is suspected or if the person has been near someone with diphtheria, so that they can take precautions and start treatment quickly.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Because delay is dangerous, doctors start treatment based on the clinical picture, without waiting for results. To confirm the diagnosis, a **throat swab** is taken from the membrane or nose. The sample is sent for **culture**, in which the bacteria are grown in the laboratory, and for tests that show whether the strain produces the toxin. Some laboratories also use molecular tests. An **ECG** and blood tests help check whether the toxin is affecting the heart and kidneys, and they are often repeated during the illness.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "ul",
      items: [
        "**Diphtheria antitoxin** — the most important treatment. It neutralises toxin that has not yet attached to tissues, so it is given as early as possible. It is supplied through hospitals and public health authorities.",
        "**Antibiotics** — such as penicillin or erythromycin-type medicines, to kill the bacteria and stop the person spreading them.",
        "**Isolation** — the patient is cared for separately until tests show the bacteria have cleared.",
        "Airway support — some patients need the membrane removed, a breathing tube or a tracheostomy, and intensive care.",
        "Heart monitoring and bed rest, because the toxin can inflame the heart muscle, sometimes a week or more after the throat starts to improve.",
      ],
    },
    {
      k: "p",
      text: "Having diphtheria does not reliably give lasting immunity, so patients are given **vaccination** as part of recovery. Close contacts are traced, checked, swabbed, offered preventive antibiotics, and given a vaccine dose if they are not up to date.",
    },

    { k: "h2", text: "Prevention: the vaccine" },
    {
      k: "p",
      text: "Diphtheria vaccine is part of India's national immunisation schedule, given free at government health centres. Babies receive it as part of the combined pentavalent vaccine in their first months, followed by DPT boosters in early childhood. Older children and adolescents are given Td (tetanus and adult diphtheria) boosters, and Td is also given in pregnancy. Adults benefit from Td boosters as advised by their doctor, as protection fades over time.",
    },
    {
      k: "p",
      text: "If your child has missed doses, it is not too late. Take the immunisation card to your paediatrician or the nearest government health centre, and ask how to catch up. The childhood pentavalent and DPT vaccines also protect against [tetanus](/conditions/tetanus) and [whooping cough](/conditions/whooping-cough).",
    },

    { k: "h2", text: "Recovery" },
    {
      k: "p",
      text: "Recovery can be slow. Some people develop weakness of the palate, causing nasal speech or fluid coming back through the nose, or weakness in the eyes, arms or legs some weeks after the throat infection. Heart problems can also appear late. These complications usually improve with time and supportive care, but they are the reason doctors advise rest and follow-up visits even after the patient seems better.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Suspected diphtheria needs hospital care straight away. In hospital, care is led by an [infectious diseases specialist](/specialties/infectious-diseases), a [paediatrician](/specialties/paediatrics) for children, or a physician, often with an [ENT surgeon](/specialties/ent) for the airway and critical care teams. For vaccine questions and catch-up doses, see your paediatrician or a [general physician](/specialties/general-practice).",
    },
    {
      k: "p",
      text: "You can [find infectious disease specialists in Bengaluru](/doctors/karnataka/bengaluru/infectious-disease-specialists) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Is diphtheria still found in India?",
      a: "Yes. It has become much less common because of vaccination, but cases and outbreaks are still reported in India, mostly among children who were not vaccinated or missed doses. Keeping every child's vaccines up to date is the main protection.",
    },
    {
      q: "My child missed DPT boosters. What should I do?",
      a: "Take your child's immunisation card to a paediatrician or the nearest government health centre. Missed doses can usually be caught up; there is no need to restart the whole schedule. The doctor will tell you which vaccine and how many doses are needed.",
    },
    {
      q: "How is diphtheria different from tonsillitis?",
      a: "Both cause a sore throat and fever. In diphtheria there is often a grey membrane that sticks firmly to the throat and bleeds when touched, with marked neck swelling. White spots in tonsillitis tend to wipe away more easily. Only a doctor and a throat swab can tell for sure.",
    },
    {
      q: "Should family members be treated if someone has diphtheria?",
      a: "Yes. Close contacts are usually checked, swabbed, given preventive antibiotics and offered a vaccine dose if they are not up to date. Public health teams often help with this. Follow the advice of the treating hospital.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Diphtheria", url: "https://medlineplus.gov/diphtheria.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
