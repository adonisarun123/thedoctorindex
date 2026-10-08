import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "common-cold",
  title: "Common cold: symptoms, home care and when to see a doctor",
  standfirst: "What causes the common cold, how to ease the symptoms at home, why antibiotics do not help, and the warning signs that need a doctor.",
  targetQuery: "common cold symptoms and treatment",
  department: "infectious-diseases",
  specialty: "general-practice",
  alsoSee: ["paediatrics", "ent", "infectious-diseases"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Runny nose", "Blocked nose", "Sneezing", "Sore throat", "Cough", "Mild fever"],
  tests: ["Physical examination"],
  treatments: ["Rest", "Fluids", "Steam inhalation", "Saline nasal drops", "Paracetamol"],
  body: [
    { k: "h2", text: "What the common cold is" },
    {
      k: "p",
      text: "The common cold is a mild viral infection of the nose and throat. More than a hundred different viruses can cause it, rhinoviruses being the most frequent. That is why you can catch a cold again and again, and why there is no single vaccine against it. Adults typically have a few colds a year, and young children, especially those starting playschool or school, have many more.",
    },
    {
      k: "p",
      text: "A cold is uncomfortable but usually harmless. It settles by itself, typically within a week to ten days, although a cough can linger for longer. Treatment is about easing symptoms while the body clears the virus. The main reasons to see a doctor are to rule out something more serious, or to manage a complication such as an ear or sinus infection.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually start one to three days after contact with the virus, often beginning with a scratchy throat:",
    },
    {
      k: "ul",
      items: [
        "Runny nose, with watery discharge that may become thicker and yellow or green after a few days — this colour change alone does not mean a bacterial infection",
        "Blocked nose and sneezing",
        "Sore throat",
        "Cough",
        "Mild fever, more common in children",
        "Headache, body ache and feeling tired",
        "Watery eyes and a reduced sense of smell or taste",
      ],
    },
    {
      k: "p",
      text: "A cold is different from [flu](/conditions/flu). Flu tends to start suddenly with high fever, chills, severe body ache and exhaustion that can keep you in bed for days. A cold builds up more gradually and is milder. [COVID-19](/conditions/covid-19-coronavirus-disease-2019) can look like either, and in a season when it is circulating, testing may be advised. A runny nose with itchy eyes and sneezing that comes back every season, without fever, may instead be an allergy such as [hay fever](/conditions/hay-fever).",
    },

    { k: "h2", text: "How colds spread and who is at risk" },
    {
      k: "p",
      text: "Cold viruses spread through droplets when an infected person coughs, sneezes or talks, and through hands. If you touch a contaminated surface such as a door handle, phone or bus rail and then touch your nose or eyes, the virus can enter. People are most infectious in the first few days of symptoms.",
    },
    {
      k: "p",
      text: "Colds occur all year round in India, but many families notice more of them during the monsoon and in the cooler months, when people spend more time indoors together. Going out in the rain or sleeping under a fan does not by itself cause a cold; a virus is needed. Young children, people in crowded homes, hostels and offices, smokers and people under stress or short of sleep tend to catch colds more often.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "A cold is usually diagnosed from the symptoms and a simple **physical examination** of the throat, ears, nose and chest. No laboratory test is needed for an ordinary cold. A doctor may suggest tests only when the illness does not fit the usual pattern: for example a throat swab if a bacterial throat infection is suspected, tests for flu or COVID-19 when they are circulating, a blood test if fever is high or prolonged, or a chest X-ray if pneumonia is a concern.",
    },

    { k: "h2", text: "Treatment and home care" },
    {
      k: "p",
      text: "There is no medicine that kills cold viruses, and **antibiotics do not help** a cold. They work only against bacteria, and taking them when they are not needed causes side effects and adds to antibiotic resistance, a serious problem in India. Instead, simple measures help you feel better while the cold runs its course:",
    },
    {
      k: "ul",
      items: [
        "**Rest**, and stay home from work or school for the first few days if you can, to recover and avoid spreading it",
        "**Fluids** — water, warm soups, rasam, dal water, coconut water or warm drinks with honey and lemon help with a sore throat and prevent dehydration",
        "**Steam inhalation** from a bowl of hot water can ease a blocked nose; take care to avoid burns, and do not use this for young children",
        "**Saline nasal drops** or sprays loosen mucus and are safe for infants and children",
        "Gargling with warm salt water for a sore throat",
        "**Paracetamol** for fever, headache or body ache, at the dose on the label or as advised by your doctor or pharmacist",
      ],
    },
    {
      k: "p",
      text: "Many combination cough and cold syrups and tablets are sold over the counter. Check labels carefully so you do not take two products containing the same ingredient, especially paracetamol. Cough and cold medicines are not advised for young children; ask a paediatrician before giving any. Honey can soothe a cough in children over one year old but must never be given to babies under one. Decongestant nasal sprays should be used only for a few days, because longer use can make the blockage worse.",
    },
    {
      k: "p",
      text: "Be cautious about products claiming to prevent or shorten colds. Evidence for most remedies is limited or mixed, and they are not a substitute for rest and fluids.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "ul",
      items: [
        "Wash hands often with soap and water, especially before eating and after blowing your nose",
        "Avoid touching your eyes, nose and mouth with unwashed hands",
        "Cough or sneeze into a tissue or your elbow, and throw tissues away",
        "Keep a sick child home from school or day care while they are feverish and unwell",
        "Do not share cups, towels or utensils with someone who has a cold",
        "Stop smoking and keep smoke away from children",
        "Ask your doctor about the yearly flu vaccine, especially for older adults, pregnant women and people with long-term illness; it protects against flu, not colds",
      ],
    },

    { k: "h2", text: "Complications" },
    {
      k: "p",
      text: "Most colds clear without trouble, but sometimes a cold is followed by a bacterial infection or worsens another condition. Watch for [ear infections](/conditions/ear-infections) in young children, [sinusitis](/conditions/sinusitis) with face pain and symptoms that last beyond ten days or get worse after improving, a flare of [asthma](/conditions/asthma) or COPD, or a chest infection such as [pneumonia](/conditions/pneumonia).",
    },

    { k: "h2", text: "When to see a doctor" },
    {
      k: "p",
      text: "See a doctor if symptoms last more than ten days or get worse after first getting better, if fever is high or lasts more than three days, if there is severe throat pain, ear pain, face pain or swelling, or if you have asthma, heart or lung disease, diabetes or a weak immune system. A baby under three months with any fever should be seen by a doctor the same day.",
    },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if there is:" },
    {
      k: "ul",
      items: [
        "Difficulty breathing, very fast breathing, or the skin pulling in between the ribs in a child",
        "Chest pain, bluish lips or confusion",
        "A child who is very drowsy, floppy, will not feed, or has signs of dehydration such as few wet nappies",
        "A stiff neck, severe headache or a rash that does not fade when pressed",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) or family doctor can manage almost all colds, and a [paediatrician](/specialties/paediatrics) is the right first stop for children. An [ENT specialist](/specialties/ent) helps with repeated ear or sinus problems. An [infectious disease specialist](/specialties/infectious-diseases) is rarely needed for a cold, but may be involved when infections are frequent, unusual or occur in someone with a weakened immune system.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians), [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) or [ENT surgeons in Bengaluru](/doctors/karnataka/bengaluru/ent-surgeons) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Should I take antibiotics for a cold?",
      a: "No. Colds are caused by viruses, and antibiotics act only on bacteria. They will not make a cold go away faster and can cause side effects. Your doctor will prescribe an antibiotic only if a bacterial complication such as a sinus or ear infection is found.",
    },
    {
      q: "Can eating cold food, ice cream or getting wet in the rain cause a cold?",
      a: "A cold is caused by a virus, so cold food or getting wet does not cause one by itself. Colds are more common in the monsoon and cooler months mainly because people gather indoors, where viruses pass easily from person to person.",
    },
    {
      q: "How long is a cold contagious?",
      a: "A person is most contagious in the first two to three days of symptoms, though they can spread the virus for longer. Washing hands, covering coughs and staying home while feverish help protect family members and colleagues.",
    },
    {
      q: "How many colds a year are normal for a child?",
      a: "Young children can catch several colds a year, more so in their first years at playschool or school, because their immune systems are meeting many viruses for the first time. See a paediatrician if a child seems unusually unwell or is not growing well.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Common Cold", url: "https://medlineplus.gov/commoncold.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
