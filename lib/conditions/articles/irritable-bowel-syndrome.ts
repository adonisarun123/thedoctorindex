import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "irritable-bowel-syndrome",
  title: "Irritable bowel syndrome (IBS): symptoms, tests and treatment",
  metaTitle: "IBS (irritable bowel syndrome): symptoms and treatment",
  standfirst: "What IBS is, the symptoms that fit it and the warning signs that do not, how doctors confirm it, and the diet, mind and medicine approaches that help.",
  targetQuery: "IBS symptoms and treatment",
  department: "gastroenterology",
  specialty: "gastroenterology",
  alsoSee: ["dietetics", "psychiatry"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Abdominal pain", "Bloating", "Diarrhoea", "Constipation", "Mucus in the stool"],
  tests: ["Blood count", "Coeliac disease blood test", "Stool tests", "Colonoscopy"],
  treatments: ["Dietary changes", "Low-FODMAP diet", "Soluble fibre", "Gut-directed psychological therapy", "Antispasmodics"],
  body: [
    { k: "h2", text: "What IBS is" },
    {
      k: "p",
      text: "Irritable bowel syndrome (IBS) is a common, long-term condition of the gut in which recurring abdominal pain goes together with a change in bowel habit — diarrhoea, constipation, or both at different times. The bowel looks normal on tests; the problem lies in how it works.",
    },
    {
      k: "p",
      text: "Doctors now describe IBS as a disorder of gut–brain interaction. The nerves of the gut are more sensitive than usual, the muscles of the bowel may move food too fast or too slowly, and signals between the brain and the gut are amplified. Gut bacteria, previous infections and stress all play a part. IBS is real and can be very disruptive, but it does not damage the bowel, does not turn into cancer and does not shorten life.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Abdominal pain or cramps, often eased or changed by opening the bowels",
        "Bloating and a swollen-feeling tummy, often worse through the day",
        "Diarrhoea, often urgent and in the morning or after meals",
        "Constipation, with hard stools and straining",
        "A feeling of not having emptied the bowel completely",
        "Mucus in the stool",
      ],
    },
    {
      k: "p",
      text: "Doctors classify IBS by the main bowel pattern — mostly diarrhoea, mostly constipation, or mixed — because treatment differs. Many people also have tiredness, back pain, heartburn or bladder symptoms, and anxiety or low mood are common alongside IBS.",
    },

    { k: "h2", text: "Causes, triggers and who is at risk" },
    {
      k: "ul",
      items: [
        "A bout of gut infection or food poisoning, after which IBS can start (post-infectious IBS)",
        "Stress, anxiety, depression and difficult life events",
        "Certain foods — for example wheat, onions, garlic, beans, some fruit and milk in some people — and large or rich meals",
        "Courses of antibiotics that change gut bacteria",
        "A family history of IBS",
        "Hormonal changes; symptoms often vary with the menstrual cycle",
      ],
    },
    {
      k: "p",
      text: "In India, repeated gut infections from contaminated food and water are common, and it is important that infections and conditions such as coeliac disease, lactose intolerance, intestinal TB and inflammatory bowel disease are considered before a label of IBS is given.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "IBS is diagnosed from a typical pattern of symptoms over months, with a careful examination, a few targeted tests and no warning signs. It is not simply a diagnosis made by excluding everything else. Common tests are:",
    },
    {
      k: "ul",
      items: [
        "**Blood count** — to look for anaemia, which does not fit IBS",
        "**Coeliac disease blood test** — coeliac disease can mimic IBS",
        "**Stool tests** — for infections, parasites and a marker of bowel inflammation (calprotectin), when diarrhoea is the main symptom",
        "Thyroid tests or others, depending on your symptoms",
      ],
    },
    {
      k: "p",
      text: "A **colonoscopy** is not routinely needed for IBS. It is advised if you have warning signs — bleeding from the back passage, weight loss you cannot explain, anaemia, symptoms that wake you at night, fever, a family history of bowel cancer or inflammatory bowel disease, or new bowel symptoms starting in later life.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Many people with IBS are diagnosed and managed by a [general physician](/specialties/general-practice). A [gastroenterologist](/specialties/gastroenterology) helps when the diagnosis is uncertain, warning signs are present, or treatment has not worked. A [dietitian](/specialties/dietetics) is valuable for guided diet changes such as the low-FODMAP diet, and a [psychiatrist](/specialties/psychiatry) or psychologist can help when anxiety, depression or stress are a large part of the picture, or for gut-directed therapies.",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists), [dietitians in Bengaluru](/doctors/karnataka/bengaluru/dietitians) or [psychiatrists in Bengaluru](/doctors/karnataka/bengaluru/psychiatrists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "There is no single treatment that works for everyone, but most people find a combination that brings symptoms under control. Understanding the condition — that it is real, not dangerous and manageable — is itself part of the treatment.",
    },
    { k: "h3", text: "Diet and lifestyle" },
    {
      k: "p",
      text: "**Dietary changes** come first: regular meals, not eating late, eating slowly, and cutting down on caffeine, alcohol, fizzy drinks, spicy or very rich food if they trouble you. **Soluble fibre**, such as psyllium (isabgol), helps many people, especially with constipation; insoluble fibre like bran can make bloating worse. Regular physical activity and good sleep help too.",
    },
    {
      k: "p",
      text: "If symptoms persist, a **low-FODMAP diet** — which temporarily reduces certain fermentable carbohydrates found in foods such as wheat, onion, garlic, legumes, some fruits and milk — helps many people. It is best done with a dietitian, because it involves a strict phase followed by reintroducing foods, and it is not meant to be followed long-term in its strict form.",
    },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "Medicines are chosen to match the main symptom. **Antispasmodics** relieve cramping pain. Laxatives help constipation, and anti-diarrhoeal medicines can be taken before situations where urgency is a worry. Low doses of some antidepressants are used as gut nerve modulators to reduce pain, even in people who are not depressed. Some newer medicines target diarrhoea or constipation-predominant IBS specifically. Your doctor will decide based on your pattern of symptoms. Avoid repeated courses of antibiotics or 'gut cleanse' products without a doctor's advice.",
    },
    { k: "h3", text: "Mind and gut" },
    {
      k: "p",
      text: "**Gut-directed psychological therapy**, such as cognitive behavioural therapy or gut-directed hypnotherapy, has good evidence in IBS. Recommending it does not mean the symptoms are 'in your head' — it works on the gut–brain connection that drives them.",
    },

    { k: "h2", text: "Living with IBS" },
    {
      k: "ul",
      items: [
        "Keep a food and symptom diary for a few weeks to spot patterns",
        "Do not cut out whole food groups on your own; restrictive diets can lead to poor nutrition",
        "Plan ahead for travel and work, and know where toilets are if urgency is a problem",
        "Look after sleep, activity and stress",
        "Do not stop prescribed medicines suddenly; discuss changes with your doctor",
      ],
    },

    { k: "h2", text: "Warning signs and emergencies" },
    {
      k: "p",
      text: "See a doctor promptly if IBS-like symptoms come with bleeding, weight loss, anaemia, fever, night-time symptoms or a family history of bowel cancer. Call 112 or 108, or go to the nearest emergency department, for:",
    },
    {
      k: "ul",
      items: [
        "Severe abdominal pain that is constant and getting worse",
        "Heavy bleeding from the back passage, or black stools",
        "Vomiting with a swollen abdomen and inability to pass wind or stool",
        "Severe diarrhoea with signs of dehydration, such as dizziness or passing little urine",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What makes you confident this is IBS, and not something else?",
        "Which type of IBS do I have?",
        "Do I need any more tests, such as a colonoscopy?",
        "Should I try a low-FODMAP diet, and can you refer me to a dietitian?",
        "Which medicine suits my main symptom?",
        "Would psychological therapy help me?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can IBS turn into cancer?",
      a: "No. IBS does not damage the bowel and does not increase the risk of bowel cancer. However, bowel cancer and other conditions can cause similar symptoms, which is why warning signs such as bleeding, weight loss or anaemia need to be checked.",
    },
    {
      q: "Is IBS caused by stress?",
      a: "Stress does not cause IBS on its own, but it can trigger flares and make symptoms worse, because the gut and brain are closely connected. Managing stress, along with diet and medicine, is often an important part of feeling better.",
    },
    {
      q: "Do probiotics help IBS?",
      a: "Some people find certain probiotics helpful, but the evidence is mixed and different products contain different bacteria. If you try one, give it about a month and stop if there is no benefit. Your doctor can advise whether it is worth trying.",
    },
    {
      q: "Will I have IBS for life?",
      a: "IBS is long-term for many people, but symptoms often come and go, and they can improve considerably with the right combination of diet, lifestyle, psychological and medical treatment. Some people find their symptoms settle for long periods.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Irritable Bowel Syndrome", url: "https://medlineplus.gov/irritablebowelsyndrome.html" },
    { label: "American College of Gastroenterology — Irritable Bowel Syndrome", url: "https://gi.org/topics/irritable-bowel-syndrome/" },
  ],
};
