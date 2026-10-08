import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "infectious-mononucleosis",
  title: "Infectious mononucleosis (glandular fever): symptoms and care",
  metaTitle: "Glandular fever (mono): symptoms, tests and care",
  standfirst: "What mono, or glandular fever, is, how it spreads, the symptoms and tests, why rest matters for the spleen, and when to see a doctor urgently.",
  targetQuery: "infectious mononucleosis symptoms and treatment",
  department: "infectious-diseases",
  specialty: "general-practice",
  alsoSee: ["infectious-diseases", "paediatrics", "ent"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Extreme tiredness", "Fever", "Sore throat", "Swollen glands", "Body aches", "Rash"],
  tests: ["Monospot test", "EBV antibody tests", "Complete blood count", "Liver function tests"],
  treatments: ["Rest", "Fluids", "Paracetamol", "Avoiding contact sports"],
  body: [
    { k: "h2", text: "What infectious mononucleosis is" },
    {
      k: "p",
      text: "Infectious mononucleosis, often called **mono** or **glandular fever**, is a viral illness that causes fever, a sore throat, swollen glands and marked tiredness. It is most often caused by the **Epstein-Barr virus (EBV)**, a member of the herpes virus family. Other viruses can occasionally cause a similar illness.",
    },
    {
      k: "p",
      text: "EBV is found worldwide, and most people catch it at some point. When young children are infected, they usually have no symptoms or only a mild illness that looks like any other childhood fever. Teenagers and young adults who catch it for the first time are more likely to develop the typical symptoms of mono, which is why it is often seen in college students.",
    },
    {
      k: "p",
      text: "Most people recover fully within a few weeks, though tiredness can linger. Once you have had EBV, the virus stays in the body in an inactive form for life, but it rarely causes illness again in people with a healthy immune system.",
    },

    { k: "h2", text: "How it spreads" },
    {
      k: "p",
      text: "EBV spreads mainly through saliva, which is why mono is sometimes called 'the kissing disease'. It can also pass on through sharing food, glasses, water bottles, spoons, toothbrushes or lip balm. Less commonly it spreads through blood transfusion, organ transplant or sexual contact.",
    },
    {
      k: "p",
      text: "Symptoms usually appear four to six weeks after infection, so people often cannot tell where they caught it. The virus can be present in saliva for some time after recovery, so there is no need to isolate strictly, but avoid kissing and sharing utensils and bottles while you are unwell.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Symptoms often develop slowly and may not all appear together. They include:" },
    {
      k: "ul",
      items: [
        "Extreme tiredness, which can be the most troublesome symptom",
        "Fever",
        "Sore throat, sometimes severe, with swollen tonsils that may be coated white",
        "Swollen glands (lymph nodes) in the neck, and sometimes in the armpits",
        "Headache and body aches",
        "Rash, especially if certain antibiotics have been taken",
        "A swollen spleen or liver, which a doctor may feel on examination; the liver can sometimes cause mild [jaundice](/conditions/jaundice)",
      ],
    },
    {
      k: "p",
      text: "Most people feel better in two to four weeks. Tiredness may last several more weeks, and occasionally for months. Because the sore throat can look like [tonsillitis](/conditions/tonsillitis) from bacteria, mono is easily mistaken for a 'throat infection' at first.",
    },

    { k: "h2", text: "Possible complications" },
    {
      k: "p",
      text: "Complications are uncommon, but it helps to know about them:",
    },
    {
      k: "ul",
      items: [
        "**Enlarged spleen** — the spleen can swell and, rarely, rupture after a blow to the abdomen or heavy straining. This causes sudden, sharp pain in the upper left abdomen and is an emergency.",
        "**Airway narrowing** — very swollen tonsils can occasionally make breathing or swallowing difficult.",
        "**Liver inflammation** (hepatitis), usually mild and temporary.",
        "Rarely, effects on the blood, nerves, brain or heart.",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "A doctor often suspects mono from the symptoms and an examination of the throat, glands, liver and spleen. Blood tests can confirm it and rule out other causes:",
    },
    {
      k: "ul",
      items: [
        "**Monospot test** — a quick blood test for antibodies that appear in mono. It can be negative early in the illness and is less reliable in young children.",
        "**EBV antibody tests** — more specific tests that show whether the infection is recent or past.",
        "**Complete blood count** — mono often shows a raised number of a type of white blood cell, some of which look unusual under the microscope.",
        "**Liver function tests** — to check whether the liver is affected.",
      ],
    },
    {
      k: "p",
      text: "A throat swab may be taken to check for a bacterial throat infection, which can occur alongside mono. Your doctor may also consider other infections that cause fever and swollen glands, which can sometimes look similar.",
    },

    { k: "h2", text: "Treatment and self-care" },
    {
      k: "p",
      text: "There is no specific medicine for mono, and antibiotics do not work against viruses. The body clears the infection on its own; treatment eases symptoms and protects against complications:",
    },
    {
      k: "ul",
      items: [
        "**Rest** — follow your energy levels and return to studies or work gradually.",
        "**Fluids** — drink plenty of water, soups, juices or oral rehydration solution, especially with fever and a sore throat.",
        "**Paracetamol** for fever, sore throat and aches, in the dose your doctor advises. Ask before using other painkillers.",
        "Warm salt-water gargles and soft, cool foods can soothe the throat.",
        "**Avoiding contact sports**, heavy lifting and strenuous exercise until your doctor says it is safe, usually for at least a month, to protect a swollen spleen.",
      ],
    },
    {
      k: "note",
      tone: "alert",
      title: "Medicines to be careful with",
      text: "Do not give aspirin to children or teenagers, because it can cause Reye syndrome, a rare but serious illness affecting the brain and liver. Some antibiotics, especially ampicillin and amoxicillin, often cause an itchy rash in people with mono. If you need an antibiotic for a bacterial infection alongside mono, your doctor will choose one that suits.",
    },
    {
      k: "p",
      text: "If the tonsils are so swollen that breathing or swallowing is affected, doctors may use steroids or admit the person to hospital. Avoid alcohol while recovering if your liver tests are abnormal, and ask your doctor before restarting it.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "p",
      text: "There is no vaccine for EBV. To lower the chance of catching or spreading mono, do not share food, drinks, bottles, utensils, toothbrushes or lip balm, avoid kissing someone who is unwell with it, and wash hands often with soap and water.",
    },

    { k: "h2", text: "When to see a doctor" },
    {
      k: "p",
      text: "See a doctor if a sore throat with fever and swollen glands lasts more than a few days, if tiredness is severe or does not improve, if you notice yellow eyes or skin, or if you cannot eat or drink enough.",
    },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department straight away, for:" },
    {
      k: "ul",
      items: [
        "Sudden, severe pain in the upper left part of the abdomen, which may spread to the left shoulder — a possible ruptured spleen",
        "Difficulty breathing, noisy breathing, or being unable to swallow saliva",
        "Fainting, confusion or a racing heartbeat",
        "Severe headache with a stiff neck, or a seizure",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can diagnose and manage most cases; children and teenagers can see a [paediatrician](/specialties/paediatrics). An [ENT specialist](/specialties/ent) may help when throat and tonsil swelling is severe, and an [infectious disease specialist](/specialties/infectious-diseases) when the illness is prolonged, unusual or affects someone with a weakened immune system.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Do I need a blood test to confirm mono, or to rule out something else?",
        "Is my spleen or liver enlarged?",
        "When can I return to college, work, the gym or sport?",
        "Which painkillers are safe for me to take?",
        "What should make me come back sooner?",
      ],
    },
  ],
  faqs: [
    {
      q: "How long does glandular fever last?",
      a: "Most people feel much better within two to four weeks, but tiredness can continue for several more weeks and occasionally for months. Return to normal activities gradually, and speak to your doctor if exhaustion is not improving or is affecting studies or work.",
    },
    {
      q: "Do antibiotics help mono?",
      a: "No. Mono is caused by a virus, and antibiotics only work against bacteria. Some antibiotics, such as amoxicillin, can trigger a rash in people with mono. Your doctor may still prescribe a suitable antibiotic if a bacterial throat infection is present at the same time.",
    },
    {
      q: "When can I go back to the gym or play sport after mono?",
      a: "Avoid contact sports, heavy lifting and strenuous exercise until your doctor says it is safe, usually at least a month after symptoms start, because a swollen spleen can rupture. Your doctor may examine you, or occasionally arrange a scan, before clearing you.",
    },
    {
      q: "Can I get mono more than once?",
      a: "Mono caused by EBV usually happens only once, because the body develops lasting immunity. The virus stays inactive in the body, and in people with a weakened immune system it can occasionally become active again. A similar illness can sometimes be caused by other viruses.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Infectious Mononucleosis", url: "https://medlineplus.gov/infectiousmononucleosis.html" },
    { label: "Emergency Response Support System, Government of India — 112", url: "https://112.gov.in/" },
  ],
};
