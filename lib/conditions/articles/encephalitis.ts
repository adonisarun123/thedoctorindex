import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "encephalitis",
  title: "Encephalitis: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Encephalitis: symptoms, causes and treatment",
  standfirst: "What encephalitis is, the warning signs in adults and babies, common causes in India including Japanese encephalitis, how it is treated and prevented.",
  targetQuery: "encephalitis symptoms and causes",
  department: "neurology",
  specialty: "neurology",
  alsoSee: ["infectious-diseases", "critical-care", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Fever", "Severe headache", "Confusion", "Seizures", "Drowsiness", "Stiff neck", "Vomiting"],
  tests: ["MRI", "CT scan", "Lumbar puncture", "EEG", "Blood tests"],
  treatments: ["Antiviral medicines", "Antibiotics", "Corticosteroids", "Intensive care", "Rehabilitation"],
  body: [
    { k: "h2", text: "What encephalitis is" },
    {
      k: "p",
      text: "Encephalitis is inflammation of the brain. It happens when an infection reaches the brain, or when the body's immune system mistakenly attacks brain tissue. The swelling can disturb how the brain works, causing confusion, seizures and changes in behaviour, and in severe cases it can lead to lasting brain damage, coma or death.",
    },
    {
      k: "p",
      text: "Encephalitis is a medical emergency. Some forms can be treated, and outcomes are better when treatment starts early. It is closely related to [meningitis](/conditions/meningitis), which is inflammation of the membranes around the brain; the two can occur together and early symptoms can look alike.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Some infections cause only a mild, flu-like illness or no symptoms at all. When encephalitis develops, symptoms often start with fever, headache, tiredness and body aches, then worsen over hours to days. Signs that the brain is affected include:",
    },
    {
      k: "ul",
      items: [
        "Fever with a severe headache",
        "Confusion, disorientation or behaviour that is out of character",
        "Seizures (fits)",
        "Drowsiness, or difficulty waking up",
        "Stiff neck and sensitivity to light",
        "Vomiting",
        "Weakness or paralysis of part of the body, or trouble speaking",
        "Hallucinations or memory problems",
        "Loss of consciousness",
      ],
    },
    { k: "p", text: "In babies and young children, look for:" },
    {
      k: "ul",
      items: [
        "Fever, poor feeding and vomiting",
        "Unusual sleepiness, floppiness or body stiffness",
        "Constant irritability or high-pitched crying",
        "A bulging soft spot (fontanelle) on top of the head",
        "Fits, which may look like twitching or staring spells",
      ],
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "There are two main groups of encephalitis. **Infectious encephalitis** is most often caused by viruses. **Autoimmune encephalitis** happens when the immune system attacks the brain, sometimes triggered by an infection or a tumour, and sometimes without a clear cause.",
    },
    { k: "p", text: "Viral causes include:" },
    {
      k: "ul",
      items: [
        "Herpes simplex virus, the virus behind cold sores, which can cause a severe but treatable encephalitis",
        "Varicella-zoster virus, which causes [chickenpox](/conditions/chickenpox) and shingles",
        "Mosquito-borne viruses, including Japanese encephalitis virus",
        "Enteroviruses and other common viruses",
        "[Measles](/conditions/measles) and [rabies](/conditions/rabies), both preventable by vaccination",
      ],
    },
    {
      k: "p",
      text: "**Japanese encephalitis** is an important cause in parts of India. It is spread by *Culex* mosquitoes, with pigs and water birds carrying the virus, and is commonest in rural areas near rice fields, often during and after the rainy season. Most infections are mild, but a small number become severe, and children are commonly affected. Bacteria, fungi and parasites can also cause encephalitis, but this is less common.",
    },
    {
      k: "p",
      text: "Anyone can get encephalitis, but it is more likely in young children and older adults, in people with a weakened immune system, such as those with HIV or taking medicines that suppress immunity, and in people living where disease-carrying mosquitoes are common.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Encephalitis is diagnosed in hospital. The doctor will examine the nervous system and ask about recent illness, travel, mosquito or animal bites, and vaccinations. Tests commonly include:",
    },
    {
      k: "ul",
      items: [
        "**MRI** of the brain, which shows inflammation most clearly, or a **CT scan** when MRI is not immediately available or to rule out bleeding or other causes",
        "**Lumbar puncture** (spinal tap) — a small sample of the fluid around the brain and spinal cord is taken from the lower back with a needle and tested for infection and inflammation",
        "**EEG** — sensors on the scalp record the brain's electrical activity and can show seizure activity that is not obvious",
        "**Blood tests**, including tests for specific viruses, and sometimes tests for antibodies that cause autoimmune encephalitis",
      ],
    },
    {
      k: "p",
      text: "Your doctor may also test for conditions that can look similar, such as malaria, low blood sugar or severe dengue. Finding the exact cause can take time, so treatment often begins before all results are back.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Most people with encephalitis need to be treated in hospital, and some need **intensive care** to support breathing, control seizures and manage pressure in the brain. Treatment depends on the cause:",
    },
    {
      k: "ul",
      items: [
        "**Antiviral medicines** are often started straight away if herpes simplex encephalitis is possible, because early treatment makes a real difference.",
        "**Antibiotics** may be given until a bacterial infection has been ruled out.",
        "**Corticosteroids** and other treatments that calm the immune system are used for autoimmune encephalitis and some other types.",
        "Medicines to stop seizures, fluids, nutrition and careful nursing care.",
      ],
    },
    {
      k: "p",
      text: "For many viral causes, including Japanese encephalitis, there is no specific antiviral medicine. Care then focuses on supporting the body and protecting the brain while the illness runs its course.",
    },
    {
      k: "p",
      text: "Recovery can be slow. Some people have lasting problems with memory, concentration, mood, speech, movement or seizures. **Rehabilitation** — physiotherapy, speech therapy and occupational therapy — helps people regain skills, and a [rehabilitation physician](/specialties/physical-medicine-rehabilitation) may coordinate this.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "ul",
      items: [
        "Keep your child's vaccinations up to date as per the national immunisation schedule, including measles vaccination",
        "Japanese encephalitis vaccine is given in areas where the disease is common; ask your paediatrician or doctor whether it applies where you live or are travelling to",
        "Protect against mosquito bites with nets, window screens, repellents and clothing that covers arms and legs, especially in rural areas and in the rainy season",
        "Wash hands often, and do not share cups, plates or utensils during illness",
        "After any animal bite or scratch, wash the wound and seek rabies prevention the same day",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department straight away, if someone has:" },
    {
      k: "ul",
      items: [
        "Fever with confusion, unusual behaviour or a stiff neck",
        "A seizure, especially for the first time",
        "Drowsiness, or is difficult to wake",
        "Sudden weakness, loss of speech or loss of consciousness",
        "In a baby: a bulging soft spot, floppiness, refusing feeds or a fit",
      ],
    },
    { k: "p", text: "Do not wait to see whether these symptoms settle at home." },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Suspected encephalitis needs emergency hospital care first, often with an [emergency physician](/specialties/emergency-medicine) and an [intensivist](/specialties/critical-care). A [neurologist](/specialties/neurology) leads diagnosis and treatment of the brain inflammation and follows up seizures and recovery. An [infectious disease specialist](/specialties/infectious-diseases) is often involved when an infection is the cause, and children are cared for by a [paediatrician](/specialties/paediatrics).",
    },
    {
      k: "p",
      text: "For follow-up care, you can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists) or [rehabilitation physicians in Bengaluru](/doctors/karnataka/bengaluru/rehabilitation-physicians) on The Doctor Index.",
    },

    { k: "h2", text: "Questions to ask the care team" },
    {
      k: "ul",
      items: [
        "What do you think is causing the encephalitis, and which tests are still pending?",
        "Is there a specific treatment for this cause?",
        "What problems might continue after discharge, and what rehabilitation is needed?",
        "Does my family member need medicine to prevent seizures, and for how long?",
        "When should we come back, and whom do we call if symptoms return?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is encephalitis contagious?",
      a: "Encephalitis itself does not spread from person to person, but some of the viruses that cause it can. Others, such as Japanese encephalitis, spread only through mosquito bites. Good hand hygiene, vaccination and mosquito protection lower the risk for family members.",
    },
    {
      q: "What is the difference between encephalitis and meningitis?",
      a: "Encephalitis is inflammation of the brain tissue itself, while meningitis is inflammation of the membranes that cover the brain and spinal cord. They can happen together and early symptoms overlap, so both are treated as emergencies until doctors know which one it is.",
    },
    {
      q: "Can someone fully recover from encephalitis?",
      a: "Many people recover well, especially with mild illness or early treatment. Others are left with problems such as memory difficulties, fatigue, mood changes or seizures. Recovery can continue for months, and rehabilitation and follow-up with a neurologist help people regain as much function as possible.",
    },
    {
      q: "Is there a vaccine for Japanese encephalitis?",
      a: "Yes. Safe and effective Japanese encephalitis vaccines exist and are used in areas where the disease is common. Ask your paediatrician whether it is part of the schedule where you live, and ask a doctor before long stays in rural areas where it occurs.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Encephalitis", url: "https://medlineplus.gov/encephalitis.html" },
    { label: "World Health Organization — Japanese encephalitis fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/japanese-encephalitis" },
    { label: "Emergency Response Support System, Government of India — 112", url: "https://112.gov.in/" },
  ],
};
