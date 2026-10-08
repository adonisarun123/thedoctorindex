import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "sepsis",
  title: "Sepsis: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Sepsis: warning signs, causes and treatment",
  standfirst: "What sepsis is, the warning signs in adults and children, who is most at risk, how it is treated in hospital, and why you should call 112 without delay.",
  targetQuery: "sepsis symptoms and treatment",
  department: "emergency-medicine",
  specialty: "emergency-medicine",
  alsoSee: ["critical-care", "infectious-diseases", "internal-medicine"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Fast breathing", "Rapid heart rate", "Confusion", "Fever or feeling very cold", "Clammy skin", "Passing little urine"],
  tests: ["Blood tests", "Blood cultures", "Urine test", "Chest X-ray", "CT scan"],
  treatments: ["Antibiotics", "Intravenous fluids", "Oxygen", "Medicines to raise blood pressure", "Treating the source of infection"],
  body: [
    { k: "note", tone: "alert", title: "Sepsis is a medical emergency", text: "If you think someone has sepsis, call 112 or 108 for an ambulance, or go to the nearest emergency department now, and say: I think this could be sepsis." },
    { k: "h2", text: "What sepsis is" },
    {
      k: "p",
      text: "Sepsis is the body's extreme, overwhelming response to an infection. Normally the immune system fights an infection where it is. In sepsis, the response spreads through the whole body and starts to damage the body's own tissues and organs. Blood pressure can fall, blood flow to vital organs such as the kidneys, brain and lungs drops, and organs begin to fail.",
    },
    {
      k: "p",
      text: "Sepsis is life-threatening, and it can progress within hours. The most severe form, septic shock, happens when blood pressure falls dangerously low despite fluids. The single most important thing anyone can do is recognise the warning signs and get the person to hospital quickly, because early treatment greatly improves the chance of survival and recovery.",
    },
    {
      k: "p",
      text: "Older terms such as septicaemia or blood poisoning are still used, but sepsis is not the same as an infection in the blood: it is the body's harmful reaction to an infection anywhere.",
    },

    { k: "h2", text: "Symptoms and warning signs" },
    { k: "h3", text: "In adults" },
    {
      k: "ul",
      items: [
        "Fast breathing, or feeling very short of breath",
        "Rapid heart rate or a weak pulse",
        "Confusion, disorientation, slurred speech, or being unusually drowsy",
        "Fever or feeling very cold, with shivering — some people, especially older adults, have a low temperature rather than a fever",
        "Clammy skin or sweating; skin that looks pale, blotchy, mottled or bluish, especially on the lips, tongue or nail beds",
        "Passing little urine, or none, over a day",
        "Extreme pain or discomfort, or a feeling that something is seriously wrong",
      ],
    },
    { k: "h3", text: "In babies and children" },
    {
      k: "ul",
      items: [
        "Very fast breathing, grunting, or pauses in breathing",
        "Being floppy, very sleepy, hard to wake, or not responding normally",
        "Mottled, very pale or bluish skin, or a rash that does not fade when a glass is pressed against it",
        "Not feeding, repeated vomiting, or no wet nappies for many hours",
        "Feeling cold to touch, or a fit (seizure)",
      ],
    },
    {
      k: "p",
      text: "Many of these signs can have other causes, which is why sepsis can be hard to spot early. The key is the combination of a possible infection with a person who is getting worse rather than better.",
    },

    { k: "h2", text: "Causes and who is most at risk" },
    {
      k: "p",
      text: "Sepsis can start from almost any infection, most often bacterial, but viral and fungal infections can also cause it. Common starting points include [pneumonia](/conditions/pneumonia), [urinary tract infections](/conditions/urinary-tract-infections) and kidney infections, abdominal infections such as a burst appendix, skin infections such as [cellulitis](/conditions/cellulitis) or an infected wound, and infections after surgery or childbirth. Sometimes the original infection was not noticed. Anyone can get sepsis, but the risk is higher in:",
    },
    {
      k: "ul",
      items: [
        "Newborn babies and children under one year",
        "Older adults",
        "Pregnant women and women who have recently given birth or had a miscarriage or abortion",
        "People with long-term conditions such as diabetes, kidney disease, liver disease, lung disease or cancer",
        "People with weakened immune systems, including those on chemotherapy, steroids or other immune-suppressing medicines, and people with untreated HIV",
        "People in hospital, with urinary catheters, drips or recent surgery, and people with serious wounds or burns",
      ],
    },
    {
      k: "p",
      text: "Infections with bacteria that resist common antibiotics are harder to treat and can make sepsis more dangerous. Using antibiotics only when a doctor prescribes them, and taking them as directed, helps slow this resistance.",
    },

    { k: "h2", text: "When to get help" },
    {
      k: "p",
      text: "Call 112 or 108, or go to the nearest emergency department immediately, if a person with an infection — or who has recently had surgery, a wound, a delivery or an illness — shows any of the warning signs above, especially confusion, fast breathing, mottled or bluish skin, passing very little urine, or rapidly getting worse. Do not wait to see whether a fever settles.",
    },
    {
      k: "p",
      text: "If you are already on treatment for an infection and are not improving, or feel worse, see a doctor the same day. Tell them about any recent infection, surgery or hospital stay, and any medicines that affect immunity.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Doctors check vital signs — temperature, heart rate, breathing rate, blood pressure, oxygen level and alertness — and examine you to look for the source of infection. Treatment is usually started while tests are under way. Tests may include:",
    },
    {
      k: "ul",
      items: [
        "**Blood tests** for signs of infection, lactate (a marker of poor blood flow to tissues), kidney and liver function, clotting and blood sugar",
        "**Blood cultures** to grow and identify the germ and test which antibiotics work against it",
        "A **urine test**, and samples from wounds, sputum or other fluids",
        "A **chest X-ray** to look for pneumonia",
        "Ultrasound or a **CT scan** to find an abscess or other hidden source of infection",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Sepsis is treated in hospital, often in an emergency department and then an intensive care unit. The aim is to fight the infection quickly and support the organs while the body recovers:",
    },
    {
      k: "ul",
      items: [
        "**Antibiotics** through a drip, started as soon as possible — first broad-spectrum antibiotics, then adjusted once tests show the germ involved; antiviral or antifungal medicines if those are the cause",
        "**Intravenous fluids** to restore blood volume and blood pressure",
        "**Oxygen**, and a breathing machine (ventilator) if the lungs are failing",
        "**Medicines to raise blood pressure** when fluids alone are not enough",
        "**Treating the source of infection** — for example draining an abscess, removing an infected catheter, or surgery to remove infected or dead tissue",
        "Dialysis if the kidneys stop working, and other support such as blood transfusion when needed",
      ],
    },

    { k: "h2", text: "Recovery after sepsis" },
    {
      k: "p",
      text: "Many people recover fully, but recovery can take weeks to months. Some people have ongoing tiredness, muscle weakness, poor sleep, low appetite, difficulty concentrating or remembering, hair loss, or feelings of anxiety and low mood, sometimes called post-sepsis syndrome. Organ damage, for example to the kidneys, may need follow-up. A gradual return to activity, good nutrition, and follow-up with your doctor help. Having had sepsis can make another infection more serious, so seek care early if you become unwell again.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "ul",
      items: [
        "Keep vaccinations up to date, including the childhood schedule and, for adults at risk, vaccines your doctor recommends such as flu and pneumococcal vaccines",
        "Wash hands with soap and water, especially before eating and after using the toilet",
        "Clean cuts and wounds, keep them covered, and watch for spreading redness, swelling or pus",
        "Manage long-term conditions well, especially diabetes",
        "Get infections treated early, and take antibiotics only as prescribed",
        "Plan deliveries with a trained birth attendant or at a health facility, and seek care quickly for fever after childbirth",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Suspected sepsis needs an emergency department, not a routine clinic appointment. It is managed by [emergency medicine](/specialties/emergency-medicine) doctors and then [critical care](/specialties/critical-care) specialists (intensivists) in the ICU, with input from an [infectious diseases specialist](/specialties/infectious-diseases) for difficult or resistant infections, and surgeons when the source needs removing. After discharge, follow-up is usually with an [internal medicine specialist](/specialties/internal-medicine) or your family doctor.",
    },
    {
      k: "p",
      text: "You can find [emergency physicians in Bengaluru](/doctors/karnataka/bengaluru/emergency-physicians), [intensivists in Bengaluru](/doctors/karnataka/bengaluru/intensivists) or [infectious disease specialists in Bengaluru](/doctors/karnataka/bengaluru/infectious-disease-specialists) on The Doctor Index, each with a registration you can check. In an emergency, do not search — call 112.",
    },
  ],
  faqs: [
    {
      q: "Is sepsis contagious?",
      a: "Sepsis itself does not spread from person to person. However, some of the infections that lead to sepsis, such as flu, pneumonia or meningitis, can spread. Handwashing, vaccination and good hygiene help protect others.",
    },
    {
      q: "How quickly does sepsis develop?",
      a: "Sepsis can develop and worsen within hours, sometimes in a person who seemed to have only a mild infection. That is why rapidly worsening symptoms, confusion, fast breathing or mottled skin during an infection should be treated as an emergency.",
    },
    {
      q: "Can sepsis be treated at home?",
      a: "No. Sepsis needs hospital treatment with antibiotics through a drip, fluids and close monitoring, and often intensive care. An ordinary infection may be treated at home, but if signs of sepsis appear, call 112 or go to an emergency department.",
    },
    {
      q: "Can you get sepsis more than once?",
      a: "Yes. People who have had sepsis, and those with long-term illnesses or weak immunity, can develop it again. Getting infections treated early, staying up to date with vaccines and knowing the warning signs all help.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Sepsis", url: "https://medlineplus.gov/sepsis.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
