import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "diarrhea",
  title: "Diarrhoea: symptoms, causes, ORS and which doctor to see",
  standfirst: "What causes diarrhoea, how to prevent dehydration with ORS, the warning signs in children and adults, and when to see a gastroenterologist.",
  targetQuery: "diarrhoea causes and treatment",
  department: "gastroenterology",
  specialty: "gastroenterology",
  alsoSee: ["general-practice", "paediatrics", "infectious-diseases"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Loose or watery stools", "Stomach cramps", "Bloating", "Blood in the stool", "Dehydration"],
  tests: ["Stool test", "Blood tests", "Colonoscopy"],
  treatments: ["Oral rehydration solution", "Zinc", "Continued feeding", "Intravenous fluids"],
  body: [
    { k: "h2", text: "What diarrhoea is" },
    {
      k: "p",
      text: "Diarrhoea means passing loose or watery stools, usually three or more times in a day, or more often than is normal for you. It is not a disease in itself but a symptom of something irritating or infecting the gut. Most episodes are short, lasting a day or two, and get better on their own. The main danger is not the diarrhoea but the loss of water and salts from the body, called dehydration, which can become serious quickly in babies, young children, older people and anyone already unwell.",
    },
    {
      k: "p",
      text: "Doctors divide diarrhoea by how long it lasts. Acute diarrhoea lasts a few days and is usually due to an infection. Persistent diarrhoea lasts two to four weeks, and chronic diarrhoea lasts longer than four weeks and needs to be looked into. When there is blood in the stool, it is often called dysentery and usually needs medical attention.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Loose or watery stools, often with urgency to reach the toilet",
        "Stomach cramps or pain",
        "Bloating and a rumbling stomach",
        "Nausea, vomiting or fever, depending on the cause",
        "Blood in the stool or mucus, which suggests infection or inflammation of the bowel",
      ],
    },
    {
      k: "p",
      text: "Signs of **dehydration** to watch for include feeling very thirsty, a dry mouth, passing little or dark urine, dizziness when standing, and tiredness. In babies and young children, look for no wet nappy for several hours, crying without tears, sunken eyes, a sunken soft spot on the head, unusual drowsiness or irritability, and skin that goes back slowly when pinched.",
    },

    { k: "h2", text: "Causes" },
    { k: "h3", text: "Short-term diarrhoea" },
    {
      k: "ul",
      items: [
        "Viral infections such as rotavirus and norovirus, which commonly cause [gastroenteritis](/conditions/gastroenteritis); see [rotavirus infections](/conditions/rotavirus-infections) for young children",
        "Bacteria in contaminated food or water, causing [food poisoning](/conditions/foodborne-illness) or, in outbreaks, [cholera](/conditions/cholera)",
        "Parasites such as Giardia and amoeba, often picked up from unsafe drinking water",
        "Side effects of medicines, especially antibiotics",
        "Travellers' diarrhoea from unfamiliar food and water",
      ],
    },
    {
      k: "p",
      text: "In India, diarrhoeal illness rises during the monsoon and summer, when flooding, contaminated water supplies and food spoiling in the heat make infection easier to catch. Street food, cut fruit left uncovered, unboiled water and ice made from untreated water are common sources.",
    },
    { k: "h3", text: "Long-term or recurring diarrhoea" },
    {
      k: "ul",
      items: [
        "[Irritable bowel syndrome](/conditions/irritable-bowel-syndrome), where bowel habits change without visible damage to the gut",
        "[Lactose intolerance](/conditions/lactose-intolerance) and [celiac disease](/conditions/celiac-disease)",
        "Inflammatory bowel disease, such as Crohn's disease and ulcerative colitis",
        "Long-lasting infections, including intestinal tuberculosis and parasites",
        "An overactive thyroid, diabetes affecting the nerves of the gut, and some medicines",
        "Less commonly, bowel cancer, especially in older adults with weight loss or bleeding",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "For a short bout of diarrhoea in an otherwise well person, no tests are usually needed. The doctor will ask how long it has lasted, what the stools look like, what you have eaten and drunk, whether others are ill, any travel and any medicines, and will check for dehydration. Tests are used when diarrhoea is severe, bloody, lasting or recurring, or when the person is very young, old or has a weak immune system:",
    },
    {
      k: "ul",
      items: [
        "**Stool test** — to look for bacteria, parasites, blood or signs of inflammation",
        "**Blood tests** — to check salts, kidney function, blood count, thyroid and markers of celiac disease or inflammation",
        "**Colonoscopy** — a thin camera passed into the large bowel to look at the lining and take small samples, used mainly for chronic or bloody diarrhoea",
        "Breath tests, an endoscopy of the upper gut, or scans in selected cases",
      ],
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Replace fluids first" },
    {
      k: "p",
      text: "The most important treatment for diarrhoea at any age is replacing lost water and salts. **Oral rehydration solution** (ORS), made from WHO-formula ORS packets available at pharmacies and government health centres, is absorbed far better than plain water. Mix it exactly as the packet says, in clean drinking water, and sip it frequently, giving more after each loose stool. Use a fresh batch each day. If ORS is not available, home fluids such as rice water, thin dal water, salted buttermilk, lemon water with a pinch of salt and sugar, or coconut water help until you can get it.",
    },
    {
      k: "p",
      text: "Avoid sugary soft drinks, packaged fruit juices and energy drinks, which can make diarrhoea worse.",
    },
    { k: "h3", text: "Keep eating" },
    {
      k: "p",
      text: "**Continued feeding** helps the gut recover. Breastfed babies should keep breastfeeding, more often than usual. Children and adults can eat light, familiar foods such as rice, khichdi, curd rice, idli, banana and toast as soon as they feel like eating. Starving during diarrhoea is an old belief that can weaken a child.",
    },
    { k: "h3", text: "Zinc for children" },
    {
      k: "p",
      text: "For children with diarrhoea, WHO and paediatric guidance recommend a short course of **zinc** alongside ORS, which can shorten the episode and reduce the chance of another soon. Your doctor or health worker will tell you the right amount for your child's age.",
    },
    { k: "h3", text: "Medicines and hospital care" },
    {
      k: "p",
      text: "Most diarrhoea does not need antibiotics. Doctors prescribe them only for certain causes, such as some bloody diarrhoea, cholera or specific parasites. Anti-diarrhoeal tablets that slow the gut may help some adults with watery diarrhoea but should not be used for bloody diarrhoea or high fever, and should not be given to young children. Chronic diarrhoea is treated according to its cause. Someone who is severely dehydrated, keeps vomiting or cannot drink needs **intravenous fluids** in a clinic or hospital.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "ul",
      items: [
        "Drink boiled, filtered or properly purified water, especially during the monsoon",
        "Wash hands with soap after using the toilet, after changing nappies and before cooking or eating",
        "Eat food that is freshly cooked and hot; avoid cut fruit and salads left open at roadside stalls",
        "Keep cooked food covered and refrigerated, and do not keep leftovers for long",
        "Breastfeed babies exclusively for the first six months where possible",
        "Make sure children receive the rotavirus vaccine and other vaccines on the national immunisation schedule",
      ],
    },

    { k: "h2", text: "When to see a doctor" },
    {
      k: "p",
      text: "See a doctor if diarrhoea lasts more than two days in an adult or more than a day in a young child, if there is blood or black stool, high fever, severe stomach pain, signs of dehydration, or if diarrhoea keeps coming back or is accompanied by weight loss.",
    },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if:" },
    {
      k: "ul",
      items: [
        "A baby or child is very drowsy, floppy, has sunken eyes, is not passing urine, or cannot drink",
        "Anyone is confused, faint, or unable to keep any fluid down",
        "There is a lot of blood in the stool, or severe constant stomach pain",
        "Large volumes of watery, rice-water-like stool are causing rapid weakness",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can treat most short bouts of diarrhoea in adults, and a [paediatrician](/specialties/paediatrics) should see babies and children. A [gastroenterologist](/specialties/gastroenterology) investigates diarrhoea that lasts more than a few weeks, keeps returning, contains blood, or comes with weight loss or anaemia. An [infectious disease specialist](/specialties/infectious-diseases) may help with unusual infections or diarrhoea in people with weak immunity.",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists), [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "What should I eat during diarrhoea?",
      a: "Keep drinking ORS and eat light, familiar food as soon as you can, such as rice, khichdi, curd rice, idli, banana or toast. Avoid very oily, spicy food, sugary drinks and alcohol until you recover. Babies should continue breastfeeding.",
    },
    {
      q: "Is ORS better than water or electrolyte drinks?",
      a: "Yes. ORS made from WHO-formula packets has the right balance of salts and sugar for the gut to absorb water efficiently. Plain water does not replace salts, and many packaged sports or energy drinks contain too much sugar.",
    },
    {
      q: "Do I need an antibiotic for loose motions?",
      a: "Usually not. Most diarrhoea is caused by viruses or settles by itself. Antibiotics are needed only for certain bacterial or parasitic causes. Taking them without need can cause side effects and make future infections harder to treat. Let a doctor decide.",
    },
    {
      q: "When is diarrhoea in a child dangerous?",
      a: "Watch for signs of dehydration: no urine for several hours, no tears, sunken eyes, unusual sleepiness or refusing to drink. Also seek help for blood in the stool, repeated vomiting or high fever. Young babies can become dehydrated very quickly.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Diarrhea", url: "https://medlineplus.gov/diarrhea.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
