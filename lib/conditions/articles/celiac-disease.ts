import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "celiac-disease",
  title: "Celiac disease: symptoms, tests, diet and which doctor to see",
  metaTitle: "Celiac disease: symptoms, tests, diet and who to see",
  standfirst: "What celiac (coeliac) disease is, its gut and non-gut symptoms, the blood test and biopsy that confirm it, and living gluten-free on an Indian diet.",
  targetQuery: "celiac disease symptoms and treatment",
  department: "gastroenterology",
  specialty: "gastroenterology",
  alsoSee: ["paediatrics", "dietetics"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Diarrhoea", "Bloating", "Weight loss", "Anaemia", "Poor growth"],
  tests: ["tTG antibody test", "Endoscopy with biopsy", "Genetic test"],
  treatments: ["Gluten-free diet", "Dietitian support", "Vitamin and iron replacement"],
  body: [
    { k: "h2", text: "What celiac disease is" },
    {
      k: "p",
      text: "Celiac disease, spelt coeliac disease in British usage and sometimes called celiac sprue or gluten-sensitive enteropathy, is an immune condition in which eating gluten damages the lining of the small intestine. Gluten is a protein found in wheat, barley and rye. In a person with celiac disease, the immune system reacts to gluten and attacks the small finger-like projections, called villi, that line the gut and absorb nutrients. As the villi flatten, the body absorbs less iron, calcium, vitamins and calories, even if the person eats well.",
    },
    {
      k: "p",
      text: "It is a lifelong condition. It is different from a wheat allergy, which is a rapid allergic reaction, and from non-celiac gluten sensitivity, in which people feel unwell with gluten but do not have the same gut damage or antibodies. The good news is that once gluten is removed from the diet, the gut lining usually heals and most symptoms settle.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Celiac disease can look very different from one person to the next. Some people have obvious gut symptoms; others have almost none and are found only because of anaemia or a blood test. Possible symptoms include:",
    },
    {
      k: "ul",
      items: [
        "Diarrhoea that keeps coming back, or pale, bulky, foul-smelling stools",
        "Bloating, wind and tummy pain; some people have [constipation](/conditions/constipation) instead",
        "Weight loss or difficulty gaining weight",
        "Tiredness and [anaemia](/conditions/anemia) from low iron or folate that does not improve with tablets",
        "In children: poor growth, short height for age, delayed puberty, irritability and a swollen tummy",
        "An itchy blistering rash on the elbows, knees or buttocks, called dermatitis herpetiformis",
        "Mouth ulcers, tingling in the hands and feet, or thinning bones",
      ],
    },
    {
      k: "p",
      text: "Because the symptoms overlap with [irritable bowel syndrome](/conditions/irritable-bowel-syndrome), [lactose intolerance](/conditions/lactose-intolerance) and gut infections, many people go years before the right test is done.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "Celiac disease develops when a person with a particular genetic make-up eats gluten. Most people with the condition carry one of two immune system gene types, known as HLA-DQ2 and HLA-DQ8. These genes are common in the general population, however, and most people who carry them never develop celiac disease, so other factors that are not fully understood must also play a part.",
    },
    {
      k: "p",
      text: "You are more likely to have celiac disease if a parent, child, brother or sister has it, or if you have [type 1 diabetes](/conditions/diabetes-type-1), autoimmune thyroid disease, Down syndrome or Turner syndrome. In India, celiac disease has been described more often in regions where wheat is the main staple, such as the north, but it can occur in anyone who eats gluten, including people whose diet is based mainly on rice.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The single most important rule is to keep eating gluten until testing is complete. If you cut out wheat first, the blood test and biopsy can come back normal and the diagnosis can be missed. Testing usually involves:",
    },
    {
      k: "ul",
      items: [
        "**tTG antibody test** — a blood test for tissue transglutaminase antibodies, usually checked together with total IgA levels because some people naturally make little IgA. Other antibody tests may be added.",
        "**Endoscopy with biopsy** — a gastroenterologist passes a thin camera through the mouth into the small intestine under sedation and takes tiny samples of the lining. A pathologist looks for flattened villi and other changes. In adults this is usually needed to confirm the diagnosis.",
        "**Genetic test** — checks for HLA-DQ2 and HLA-DQ8. A negative result makes celiac disease very unlikely, but a positive result does not prove it. It is useful when the diagnosis is unclear or when someone is already gluten-free.",
        "Blood tests for haemoglobin, iron, vitamin B12, folate, vitamin D, calcium and liver function, to look for deficiencies.",
      ],
    },
    {
      k: "p",
      text: "In some children with very high antibody levels, paediatric gastroenterologists may confirm the diagnosis without a biopsy, following specialist guidelines. If you have already stopped gluten, talk to your doctor before restarting it for testing.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "The treatment is a strict, lifelong **gluten-free diet**. There is no medicine that lets a person with celiac disease eat gluten safely. Even small amounts, such as crumbs from a shared toaster or wheat flour used to thicken a gravy, can keep the gut inflamed, even if they do not cause obvious symptoms.",
    },
    { k: "h3", text: "What to avoid in an Indian kitchen" },
    {
      k: "ul",
      items: [
        "Wheat in any form: atta, maida, suji or rava, dalia, sevai, wheat-based noodles, pasta, bread, rusks, biscuits and most bakery items",
        "Barley (jau) and rye, and malt made from barley",
        "Packaged hing (asafoetida), which is often mixed with wheat flour; look for a version labelled gluten-free",
        "Ready-made spice mixes, soup powders, sauces and namkeens unless the label confirms they are gluten-free",
        "Oats, unless labelled gluten-free, because they are often contaminated with wheat during processing",
      ],
    },
    { k: "h3", text: "What is naturally gluten-free" },
    {
      k: "p",
      text: "Rice, poha, millets such as ragi, jowar and bajra, maize, besan and other dals, pulses, milk and curd, eggs, meat, fish, vegetables and fruit are naturally gluten-free. Many South Indian staples such as idli, dosa and plain rice dishes are suitable if made at home without added wheat or contaminated hing. Keep separate tawas, sieves and flour containers if others in the house eat wheat.",
    },
    { k: "h3", text: "Support and follow-up" },
    {
      k: "p",
      text: "**Dietitian support** makes a large difference, because the diet is hard to learn alone and it is easy to end up short of fibre and nutrients. Your doctor may advise **vitamin and iron replacement** for a period, and sometimes a bone density scan. Follow-up visits usually include a repeat antibody test to check that levels are coming down. If symptoms continue despite the diet, the commonest reason is hidden gluten, but your gastroenterologist will also look for other causes.",
    },

    { k: "h2", text: "Living with celiac disease" },
    {
      k: "ul",
      items: [
        "Read every label, every time; manufacturers change recipes",
        "When eating out, explain that you cannot have wheat, maida, suji or hing with wheat, and ask how food is fried and thickened",
        "Tell your child's school and carry safe snacks when travelling",
        "Ask your doctor whether close family members should be tested",
        "Keep up regular reviews so that growth in children, iron levels and bone health are monitored",
      ],
    },
    {
      k: "p",
      text: "Untreated celiac disease over many years is linked to thin bones, infertility and, rarely, some cancers of the gut. Sticking to the diet lowers these risks, which is why doctors recommend it even when symptoms are mild.",
    },

    { k: "h2", text: "When to get urgent help" },
    {
      k: "p",
      text: "Celiac disease is rarely an emergency, but call 112 or 108, or go to the nearest emergency department, if you or your child has severe diarrhoea with signs of dehydration such as very little urine, dizziness or drowsiness, vomiting that will not stop, blood in the stool, or severe tummy pain. See your doctor soon if you are losing weight without trying.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [gastroenterologist](/specialties/gastroenterology) confirms the diagnosis with endoscopy and supervises follow-up. Children are usually seen by a [paediatrician](/specialties/paediatrics) and a paediatric gastroenterologist. A [dietitian](/specialties/dietetics) helps you plan a safe, balanced gluten-free diet.",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) or [dietitians in Bengaluru](/doctors/karnataka/bengaluru/dietitians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Is celiac disease the same as gluten intolerance?",
      a: "Not quite. People often use gluten intolerance loosely, but celiac disease is a specific immune condition that damages the small intestine and shows up on antibody tests and biopsy. Non-celiac gluten sensitivity causes symptoms without that damage. The difference matters for how strict the diet must be.",
    },
    {
      q: "Can I stop wheat first and see if I feel better?",
      a: "It is better not to. Stopping gluten before testing can make the blood test and biopsy look normal, and then you may never get a clear answer. Get tested first while still eating wheat, then start the diet if the diagnosis is confirmed.",
    },
    {
      q: "Can I eat rice, ragi and dosa?",
      a: "Yes. Rice, ragi, jowar, bajra, maize and dals are naturally gluten-free, and homemade idli and dosa are usually safe. Watch for wheat flour added to batters, hing mixed with wheat, and shared frying oil or utensils.",
    },
    {
      q: "Will my child grow out of celiac disease?",
      a: "No. Celiac disease is lifelong, and gluten will damage the gut again if it is reintroduced, even if the child feels fine. With a strict gluten-free diet, most children catch up on growth and do well.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Celiac Disease", url: "https://medlineplus.gov/celiacdisease.html" },
    { label: "MedlinePlus Genetics — Celiac disease", url: "https://medlineplus.gov/genetics/condition/celiac-disease" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
