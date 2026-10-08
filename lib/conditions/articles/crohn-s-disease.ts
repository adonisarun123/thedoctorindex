import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "crohn-s-disease",
  title: "Crohn's disease: symptoms, tests, treatment and which doctor to see",
  metaTitle: "Crohn's disease: symptoms, tests and treatment",
  standfirst: "What Crohn's disease is, its symptoms, why it can be mistaken for intestinal TB, how it is treated and when to see a gastroenterologist.",
  targetQuery: "crohn's disease symptoms and treatment",
  department: "gastroenterology",
  specialty: "gastroenterology",
  alsoSee: ["gi-surgery", "dietetics", "general-practice"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Diarrhoea", "Abdominal pain", "Weight loss", "Fatigue", "Fever"],
  tests: ["Blood and stool tests", "Colonoscopy", "CT or MRI enterography"],
  treatments: ["Anti-inflammatory medicines", "Immune-suppressing medicines", "Biological therapy", "Nutritional support", "Surgery"],
  body: [
    { k: "h2", text: "What Crohn's disease is" },
    {
      k: "p",
      text: "Crohn's disease is a long-term condition in which parts of the digestive tract become inflamed. It can affect any part from the mouth to the anus, but it most often involves the end of the small intestine (the ileum) and the start of the large intestine. The inflammation can go deep into the bowel wall and may come in patches, with healthy bowel in between.",
    },
    {
      k: "p",
      text: "Crohn's disease is one of the two main types of inflammatory bowel disease (IBD); the other is [ulcerative colitis](/conditions/ulcerative-colitis). It is different from [irritable bowel syndrome](/conditions/irritable-bowel-syndrome), which causes symptoms without visible inflammation or damage. Crohn's usually begins in teenagers and young adults, though it can start at any age. It tends to come and go, with flares and quieter periods. It cannot yet be cured, but many people live full lives with good treatment.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms depend on which part of the gut is inflamed and how badly. The common ones are:",
    },
    {
      k: "ul",
      items: [
        "Diarrhoea that lasts for weeks, sometimes with blood or mucus",
        "Abdominal pain and cramps, often in the lower right side of the tummy and after meals",
        "Weight loss and poor appetite",
        "Fatigue, often linked to [anaemia](/conditions/anemia) from blood loss or poor absorption",
        "Fever during flares",
        "Painful swellings, discharge or cracks around the anus",
        "Mouth ulcers",
      ],
    },
    {
      k: "p",
      text: "Crohn's can also affect other parts of the body, with joint pain, red and painful eyes, or tender red lumps on the shins. In children, slow growth or delayed puberty may be the first clue. Long-standing diarrhoea, weight loss or blood in the stool always deserves a proper check, whatever the cause turns out to be.",
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "The exact cause is not known. The current understanding is that in people with certain genes, the immune system reacts wrongly to the normal bacteria in the gut, and this keeps the bowel inflamed. Several genes linked to Crohn's affect how the gut lining senses and handles bacteria. No single gene causes it, and most people with a relative who has Crohn's never develop it.",
    },
    {
      k: "ul",
      items: [
        "**Family history** — having a parent, brother, sister or child with IBD raises the risk",
        "**Smoking** — increases the risk of Crohn's and makes it more severe; stopping is one of the most useful things a smoker with Crohn's can do",
        "**Some medicines** — anti-inflammatory painkillers can trigger flares in some people",
        "**Diet and lifestyle** — a Westernised diet high in processed food has been linked to a slightly higher risk, though diet alone does not cause the disease",
      ],
    },
    {
      k: "p",
      text: "Stress and particular foods do not cause Crohn's, but they can make symptoms worse during a flare. IBD was once thought rare in India, but doctors here now diagnose it far more often than before.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "No single test confirms Crohn's disease. A gastroenterologist puts together the history, examination and several investigations:",
    },
    {
      k: "ul",
      items: [
        "**Blood and stool tests** — look for anaemia, inflammation, low protein and vitamin levels, and infections. A stool test called faecal calprotectin helps show whether there is inflammation in the bowel.",
        "**Colonoscopy** — a thin camera passed through the back passage to look at the large bowel and the end of the small bowel, with small tissue samples (biopsies) taken for the laboratory.",
        "**Upper GI endoscopy** — a camera through the mouth, if there are symptoms higher up.",
        "**CT or MRI enterography** — scans that show the small intestine, thickened bowel, narrowings, abscesses and abnormal tunnels (fistulas). Capsule endoscopy, where you swallow a tiny camera, is sometimes used.",
      ],
    },
    {
      k: "note",
      tone: "info",
      title: "Crohn's or intestinal tuberculosis?",
      text: "In India, [tuberculosis](/conditions/tuberculosis) of the intestine can look almost identical to Crohn's disease on colonoscopy and scans. The two need very different treatment, and the medicines used for Crohn's can make TB much worse. Doctors therefore look carefully for TB with biopsies, cultures, chest imaging and other tests before starting treatment. Sometimes a trial of TB treatment is given first. Do not start strong immune-suppressing treatment on your own or from a chemist.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment aims to settle a flare, keep the disease quiet for as long as possible, prevent complications and allow normal growth and life. No single plan suits everyone; it depends on where the disease is, how active it is and how it has behaved so far.",
    },
    { k: "h3", text: "Medicines" },
    {
      k: "ul",
      items: [
        "**Anti-inflammatory medicines** — steroid courses are used to calm a flare, but they are not suitable for long-term use because of their side effects",
        "**Immune-suppressing medicines** — taken long term to keep the disease in remission and reduce the need for steroids",
        "**Biological therapy** — injections or drips that block specific parts of the immune response; used for moderate to severe disease or when other medicines have not worked",
        "Antibiotics for abscesses or infection around the anus, and medicines to ease diarrhoea or cramps where safe",
      ],
    },
    {
      k: "p",
      text: "Medicines that suppress the immune system need screening for TB and hepatitis before starting, regular blood tests, and advice on vaccines. Always tell your doctor about fever, cough or new symptoms while taking them.",
    },
    { k: "h3", text: "Nutrition" },
    {
      k: "p",
      text: "**Nutritional support** matters because inflammation and diarrhoea make it hard to absorb food. A dietitian can help you eat enough during flares, correct iron, vitamin and other deficiencies, and avoid unnecessary food restrictions. In children especially, a period of a special liquid diet may be used as treatment for a flare. People with narrowed bowel may be advised to avoid hard, fibrous food. During a severe flare, the bowel may need to be rested in hospital, with nutrition given by liquid feeds or a drip.",
    },
    { k: "h3", text: "Surgery" },
    {
      k: "p",
      text: "Many people with Crohn's need an operation at some point. **Surgery** may remove a badly diseased or narrowed section of bowel, drain an abscess or treat a fistula. Surgery does not remove the disease for good, as it can return elsewhere, but it can give long periods of good health. Surgeons try to remove as little bowel as possible.",
    },

    { k: "h2", text: "Living with Crohn's disease" },
    {
      k: "ul",
      items: [
        "Stop smoking — it is one of the strongest things you can do to reduce flares",
        "Keep taking maintenance medicines even when you feel well; stopping is a common cause of flares",
        "Avoid anti-inflammatory painkillers unless your gastroenterologist agrees; paracetamol is usually preferred",
        "Keep a food and symptom diary to find personal triggers, rather than cutting out whole food groups",
        "Ask about bone health, vaccines and, after many years, regular colonoscopy checks",
        "Women planning pregnancy should discuss it in advance, as it is best to conceive when the disease is quiet",
        "Talk about mood and stress; living with a long-term bowel condition is hard, and support helps",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if you have:" },
    {
      k: "ul",
      items: [
        "Severe, constant abdominal pain, or a swollen, hard tummy",
        "Repeated vomiting with no stools or wind passing, which can mean the bowel is blocked",
        "Heavy bleeding from the back passage, or black stools with dizziness",
        "High fever with a painful, swollen area near the anus or in the abdomen",
        "Signs of dehydration — very little urine, dizziness on standing, extreme weakness",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can start the check-up for long-lasting diarrhoea or weight loss, but Crohn's disease is diagnosed and managed by a [gastroenterologist](/specialties/gastroenterology). A [GI surgeon](/specialties/gi-surgery) joins the team for narrowings, abscesses and fistulas, and a [dietitian](/specialties/dietetics) helps with nutrition. Children should be seen by a paediatrician with access to a paediatric gastroenterology service.",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) or [GI surgeons in Bengaluru](/doctors/karnataka/bengaluru/gi-surgeons) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "How sure are we that this is Crohn's and not intestinal TB?",
        "Which part of my bowel is affected, and how active is it?",
        "What is the plan for this flare, and for keeping it quiet afterwards?",
        "What side effects and blood tests come with my medicines?",
        "Should I see a dietitian, and do I need any supplements?",
        "What symptoms mean I should contact you urgently?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is Crohn's disease the same as IBS?",
      a: "No. Irritable bowel syndrome causes pain, bloating and changed bowel habits, but the bowel is not inflamed or damaged. Crohn's disease is an inflammatory condition that shows up on blood tests, colonoscopy and scans, and it needs medicines that control inflammation.",
    },
    {
      q: "What should I eat if I have Crohn's disease?",
      a: "There is no single Crohn's diet. Most people do best with a balanced diet, eating smaller meals more often during flares and avoiding foods that clearly upset them. If you have a narrowed bowel, your doctor may advise low-fibre food. A dietitian can tailor advice to you.",
    },
    {
      q: "Can Crohn's disease turn into cancer?",
      a: "Long-standing Crohn's disease affecting much of the large bowel slightly raises the risk of bowel cancer over many years. That is why gastroenterologists usually recommend regular colonoscopy checks after a number of years. Good control of inflammation is thought to help lower this risk.",
    },
    {
      q: "Can I have children if I have Crohn's disease?",
      a: "Yes. Most people with Crohn's disease can have healthy pregnancies. The best time to conceive is when the disease has been quiet for a while. Some medicines need to be changed before pregnancy, so plan ahead with your gastroenterologist and gynaecologist.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Crohn's Disease", url: "https://medlineplus.gov/crohnsdisease.html" },
    { label: "MedlinePlus Genetics — Crohn's disease", url: "https://medlineplus.gov/genetics/condition/crohns-disease" },
    { label: "Emergency Response Support System, Government of India — 112", url: "https://112.gov.in/" },
  ],
};
