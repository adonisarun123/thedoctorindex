import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "gastroenteritis",
  title: "Gastroenteritis: symptoms, ORS, treatment and which doctor to see",
  metaTitle: "Gastroenteritis (stomach flu): symptoms, ORS, treatment",
  standfirst: "What gastroenteritis or stomach flu is, the signs of dehydration to watch for, how ORS treats it, and when vomiting and loose motions need a doctor.",
  targetQuery: "gastroenteritis symptoms and treatment",
  department: "gastroenterology",
  specialty: "gastroenterology",
  alsoSee: ["general-practice", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Diarrhoea", "Vomiting", "Stomach cramps", "Fever", "Dehydration"],
  tests: ["Stool test", "Blood tests"],
  treatments: ["ORS", "Zinc", "Intravenous fluids", "Antibiotics"],
  body: [
    { k: "h2", text: "What gastroenteritis is" },
    {
      k: "p",
      text: "Gastroenteritis is inflammation of the lining of the stomach and intestines, usually caused by an infection. People often call it stomach flu, loose motions or a stomach upset, though it has nothing to do with influenza. It causes [diarrhoea](/conditions/diarrhea), vomiting and tummy cramps, and in most healthy adults it settles on its own within a few days.",
    },
    {
      k: "p",
      text: "The main danger is dehydration — losing more water and salts than you take in. Babies, young children, older people, pregnant women and people with other illnesses can become dehydrated quickly. In India, gastroenteritis is particularly common in the monsoon and summer months, when water supplies are more easily contaminated and food spoils faster.",
    },

    { k: "h2", text: "Causes" },
    {
      k: "ul",
      items: [
        "Viruses, the commonest cause. Norovirus affects all ages and spreads fast in homes, hostels and hospitals; [rotavirus](/conditions/rotavirus-infections) is a major cause of severe diarrhoea in babies and young children.",
        "Bacteria such as Salmonella, Shigella, Campylobacter and some types of E. coli, often from undercooked meat, eggs, street food or contaminated water. [Cholera](/conditions/cholera) causes very watery diarrhoea and rapid dehydration.",
        "Parasites such as Giardia and Entamoeba, usually from contaminated water.",
        "Toxins made by bacteria in food left out too long, which cause sudden vomiting within hours of eating — a form of [foodborne illness](/conditions/foodborne-illness).",
      ],
    },
    {
      k: "p",
      text: "Infection spreads through water or food contaminated by stool, through unwashed hands, and from close contact with someone who is ill. Some medicines, especially antibiotics, can also cause loose motions, but that is not usually called gastroenteritis.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Watery diarrhoea, sometimes many times a day",
        "Nausea and vomiting",
        "Stomach cramps and bloating",
        "Fever, headache and body aches",
        "Loss of appetite and tiredness",
      ],
    },
    {
      k: "p",
      text: "Signs of **dehydration** include thirst, a dry mouth, passing little or dark urine, dizziness when standing up, and tiredness. In babies and young children, look for fewer wet nappies, no tears when crying, sunken eyes, a sunken soft spot on the head, unusual sleepiness or irritability, and skin that stays tented when gently pinched.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Most of the time, a doctor diagnoses gastroenteritis from the symptoms and an examination, which focuses on how dehydrated you are. Tests are not needed for a short, typical illness. They are used when symptoms are severe, last more than a few days, include blood in the stool or high fever, or when the person is very young, elderly or has a weak immune system:",
    },
    {
      k: "ul",
      items: [
        "**Stool test** — to look for bacteria, parasites, some viruses, or blood and pus cells",
        "**Blood tests** — to check salts such as sodium and potassium, kidney function and signs of a serious infection",
      ],
    },
    {
      k: "p",
      text: "Diarrhoea that lasts for weeks is not usual gastroenteritis. It needs proper evaluation for other causes, such as [irritable bowel syndrome](/conditions/irritable-bowel-syndrome), [celiac disease](/conditions/celiac-disease) or inflammatory bowel disease.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "The cornerstone of treatment is replacing lost fluid and salts. Most people can do this safely at home.",
    },
    { k: "h3", text: "Oral rehydration solution" },
    {
      k: "p",
      text: "**ORS** (oral rehydration solution) contains the right balance of salts and sugar to help the gut absorb water. It is widely available as sachets from pharmacies and is supplied free at government health centres. Mix one sachet exactly as the packet says, in clean drinking water, and use it within the time stated. Take small, frequent sips, especially if you are vomiting; a spoon works well for small children. Plain water alone does not replace lost salts, and sugary drinks, soft drinks and fruit juices are not a substitute and can make diarrhoea worse.",
    },
    { k: "h3", text: "Zinc for children" },
    {
      k: "p",
      text: "For children with diarrhoea, Indian and WHO guidance recommends **zinc** for a short course along with ORS, as it can shorten the illness. Your paediatrician or health worker will tell you the right amount for your child's age.",
    },
    { k: "h3", text: "Eating" },
    {
      k: "p",
      text: "Keep eating once vomiting settles. Breastfed babies should keep breastfeeding throughout. Light, familiar foods such as rice, khichdi, curd rice, idli, bananas and dal water are easy on the stomach. There is no need to starve the gut.",
    },
    { k: "h3", text: "Medicines and hospital care" },
    {
      k: "p",
      text: "**Antibiotics** do not help viral gastroenteritis, which is the most common type, and taking them unnecessarily can cause side effects and resistance. Doctors reserve them for specific situations, such as suspected cholera, dysentery with blood in the stool, or certain parasites. Do not give anti-diarrhoea or anti-vomiting medicines to children unless a doctor prescribes them. People who are severely dehydrated or cannot keep fluids down may need **intravenous fluids** through a drip in hospital.",
    },

    { k: "h2", text: "When to see a doctor or go to hospital" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if:" },
    {
      k: "ul",
      items: [
        "There are signs of severe dehydration: no urine for many hours, very dry mouth, sunken eyes, fainting, confusion or unusual drowsiness",
        "A baby or young child is floppy, very sleepy, will not drink, or has not had a wet nappy for many hours",
        "Vomiting is so frequent that no fluid stays down",
        "There is a lot of blood in the stool or vomit, or the vomit is green",
        "There is severe, constant tummy pain, especially if it is in one place",
      ],
    },
    {
      k: "p",
      text: "See a doctor soon if diarrhoea lasts more than a few days in an adult or more than a day or so in a young child, if fever is high, if there is any blood in the stool, if you are pregnant, elderly or have diabetes, kidney disease or a weak immune system, or if you have recently travelled and fallen ill.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "ul",
      items: [
        "Wash hands with soap and water after using the toilet, after changing nappies and before cooking or eating; sanitiser does not reliably kill norovirus",
        "Drink boiled, filtered or safely treated water, especially during the monsoon",
        "Eat food that is freshly cooked and served hot; be careful with cut fruit, chutneys and salads from street stalls",
        "Store leftovers in the fridge promptly and reheat until steaming hot",
        "Keep a sick person away from cooking for others until a couple of days after symptoms stop",
        "Make sure babies receive the rotavirus vaccine, which is part of India's national immunisation schedule",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most episodes can be handled by a [general physician](/specialties/general-practice), and children by a [paediatrician](/specialties/paediatrics). A [gastroenterologist](/specialties/gastroenterology) is worth seeing if diarrhoea lasts for weeks, keeps coming back, or comes with weight loss or blood in the stool.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians), [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) or [gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "How long does stomach flu last?",
      a: "Most viral gastroenteritis settles within one to three days, though tiredness and loose motions can linger a little longer. Bacterial infections can last longer. If symptoms go on for more than a few days, or a young child is not improving, see a doctor.",
    },
    {
      q: "Can I make ORS at home?",
      a: "Packaged ORS is preferred because the balance of salt and sugar is exact, and too much salt can be harmful, especially for babies. If you truly cannot get ORS, give fluids such as rice water, dal water or buttermilk and seek medical help soon.",
    },
    {
      q: "Should I take an antibiotic for loose motions?",
      a: "Usually not. Most gastroenteritis is caused by viruses, which antibiotics do not treat. Doctors prescribe antibiotics only for specific causes such as cholera, dysentery or some parasites. Taking them unnecessarily can cause side effects and resistance.",
    },
    {
      q: "Is gastroenteritis contagious?",
      a: "Yes. Viral and bacterial gastroenteritis spread easily through unwashed hands, shared food and contaminated surfaces. Good handwashing, separate towels and cleaning toilets and door handles help protect the rest of the household while someone is ill.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Gastroenteritis", url: "https://medlineplus.gov/gastroenteritis.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
