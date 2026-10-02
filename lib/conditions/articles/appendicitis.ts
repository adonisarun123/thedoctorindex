import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "appendicitis",
  title: "Appendicitis: symptoms, what to do, tests, treatment and recovery",
  metaTitle: "Appendicitis: symptoms, what to do and treatment",
  standfirst: "How to recognise appendicitis and what to do at once, the tests that confirm it, surgery and other treatment, and recovery.",
  targetQuery: "appendicitis symptoms what to do",
  department: "general-surgery",
  specialty: "general-surgery",
  alsoSee: ["emergency-medicine", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Abdominal pain", "Loss of appetite", "Nausea", "Vomiting", "Fever", "Pain when walking or coughing"],
  tests: ["Physical examination", "Blood tests", "Urine test", "Ultrasound", "CT scan", "Pregnancy test"],
  treatments: ["Appendicectomy", "Laparoscopic appendicectomy", "Antibiotics"],
  body: [
    {
      k: "note",
      tone: "alert",
      title: "Suspect appendicitis?",
      text: "Go to an emergency department, or call 112 or 108, if you have abdominal pain that moves to the lower right side and keeps getting worse, especially with vomiting or fever. Do not eat or drink while waiting to be seen, and do not take laxatives, enemas or strong painkillers before a doctor examines you.",
    },

    { k: "h2", text: "What appendicitis is" },
    {
      k: "p",
      text: "The appendix is a small, finger-shaped pouch attached to the large bowel in the lower right side of the abdomen. In appendicitis it becomes blocked and inflamed, and bacteria multiply inside it. Without treatment, the swollen appendix can burst (perforate) within a day or two, spilling infection into the abdomen and causing peritonitis or an abscess, which are serious.",
    },
    {
      k: "p",
      text: "Appendicitis can happen at any age but is most common in older children, teenagers and young adults. It is one of the commonest reasons for emergency abdominal surgery.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Abdominal pain that often starts around the navel and then moves to the lower right side, becoming sharper and constant",
        "Pain when walking or coughing, or when going over bumps in a vehicle",
        "Loss of appetite",
        "Nausea and vomiting, usually after the pain begins",
        "Mild fever",
        "Constipation, diarrhoea, or being unable to pass wind",
      ],
    },
    {
      k: "p",
      text: "Symptoms are not always typical. Young children may only be irritable, off their food and vomiting. In pregnancy the pain may be higher up. Older people may have milder pain and little fever. In India, appendicitis is sometimes mistaken for gastritis, food poisoning or a urine infection and treated at home, which can delay surgery. Pain that keeps worsening over hours needs to be seen.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "The appendix is usually blocked by hardened stool, swollen lymph tissue after an infection, or occasionally worms or a growth. Often no clear cause is found. Appendicitis cannot reliably be prevented, and it is not caused by eating seeds or particular foods.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Diagnosis is based mainly on the history and a **physical examination**, with tests to support it and rule out other causes:",
    },
    {
      k: "ul",
      items: [
        "**Blood tests** for signs of infection and inflammation",
        "**Urine test** to rule out a urine infection or stone",
        "**Pregnancy test** in women of child-bearing age, because an ectopic pregnancy can cause similar pain",
        "**Ultrasound**, especially in children and pregnant women",
        "**CT scan** in adults when the diagnosis is unclear",
      ],
    },
    {
      k: "p",
      text: "In women, ovarian cysts and pelvic infections can mimic appendicitis, and in children, swollen lymph glands in the abdomen after a viral infection. Sometimes the team observes you for a few hours and re-examines you before deciding.",
    },

    {
      k: "p",
      text: "Blood tests and scans can be normal early on, and no single test rules appendicitis in or out. That is why repeated examination by the same team, as symptoms develop, is so valuable.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Suspected appendicitis needs an emergency department, where [emergency physicians](/specialties/emergency-medicine) assess you and call a [general surgeon](/specialties/general-surgery). Children are assessed with a [paediatrician](/specialties/paediatrics) or paediatric surgeon. Do not wait for a routine clinic appointment.",
    },
    {
      k: "p",
      text: "You can [find general surgeons in Bengaluru](/doctors/karnataka/bengaluru/general-surgeons) or [emergency physicians in Bengaluru](/doctors/karnataka/bengaluru/emergency-physicians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Surgery" },
    {
      k: "p",
      text: "The usual treatment is **appendicectomy**, removal of the appendix, along with antibiotics. Most are done as **laparoscopic appendicectomy** (keyhole surgery) through small cuts, which usually means less pain and a quicker recovery. Open surgery through a cut in the lower right abdomen is used in some situations. People live normally without an appendix.",
    },
    { k: "h3", text: "Antibiotics alone" },
    {
      k: "p",
      text: "For some adults with mild, uncomplicated appendicitis confirmed on a scan, treatment with **antibiotics** alone is an option. It avoids an operation, but appendicitis can come back later and surgery may then be needed. Your surgeon will decide based on your scan, your health and your preference. Antibiotics alone are not suitable when the appendix has burst.",
    },
    { k: "h3", text: "If the appendix has burst" },
    {
      k: "p",
      text: "A perforated appendix needs surgery to remove it and wash out the abdomen, or drainage of an abscess followed by antibiotics. Recovery takes longer and a longer hospital stay may be needed.",
    },

    {
      k: "p",
      text: "While you are being assessed, you may be given fluids through a drip, pain relief and antibiotics, and asked not to eat or drink. If the diagnosis is uncertain, a period of observation with repeated examinations is a safe and common approach; it does not mean your pain is being ignored. If you are sent home, return straight away if the pain worsens, moves or you start vomiting or develop a fever.",
    },

    { k: "h2", text: "Recovery and follow-up" },
    {
      k: "ul",
      items: [
        "Most people go home within a day or two after uncomplicated keyhole surgery",
        "Light activity within days; avoid heavy lifting for a few weeks, as advised",
        "Take any prescribed antibiotics for the full course",
        "Keep the wounds clean and dry, and watch for redness or discharge",
        "Return to school or work when your surgeon advises",
      ],
    },

    { k: "h2", text: "When to seek urgent help" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Abdominal pain that is severe, spreading across the whole abdomen, or getting steadily worse",
        "Pain with high fever, repeated vomiting or a rigid, very tender abdomen",
        "After surgery: fever, worsening abdominal pain, vomiting, or redness and pus at a wound",
        "A child with abdominal pain who is drowsy, will not walk, or keeps vomiting",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "How sure are you that this is appendicitis?",
        "Do I need a scan?",
        "Do I need surgery, or could antibiotics alone be considered?",
        "Will the operation be keyhole or open?",
        "How long will I be in hospital, and when can I return to work or school?",
        "What signs after discharge should bring me back?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can appendicitis go away on its own?",
      a: "Occasionally mild inflammation settles, but appendicitis usually worsens and can burst, causing a dangerous infection. It should always be assessed in hospital. Some adults with mild, uncomplicated appendicitis can be treated with antibiotics instead of surgery, under a surgeon's care.",
    },
    {
      q: "Should I take a painkiller for suspected appendicitis?",
      a: "Do not take strong painkillers, laxatives or an enema before you have been examined, and do not eat or drink in case surgery is needed. Get to an emergency department; doctors can give pain relief safely once they have assessed you.",
    },
    {
      q: "Do I need my appendix?",
      a: "You can live a normal, healthy life without your appendix. It may play a small role in immunity and gut bacteria, but removing it when it is inflamed is far safer than leaving it to burst.",
    },
    {
      q: "How long does recovery take after appendix surgery?",
      a: "After uncomplicated keyhole surgery, most people go home within a day or two and return to normal activities within a couple of weeks. Recovery takes longer if the appendix had burst. Your surgeon will advise on lifting and exercise.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Appendicitis", url: "https://medlineplus.gov/appendicitis.html" },
    { label: "NIDDK, US National Institutes of Health — Appendicitis", url: "https://www.niddk.nih.gov/health-information/digestive-diseases/appendicitis" },
  ],
};
