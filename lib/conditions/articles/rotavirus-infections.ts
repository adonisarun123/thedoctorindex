import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "rotavirus-infections",
  title: "Rotavirus: symptoms, dehydration, vaccine and which doctor",
  standfirst: "How rotavirus causes severe diarrhoea and vomiting in young children, the signs of dehydration, home care with ORS and zinc, and the rotavirus vaccine.",
  targetQuery: "rotavirus symptoms treatment and vaccine",
  department: "infectious-diseases",
  specialty: "paediatrics",
  alsoSee: ["general-practice", "infectious-diseases"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Watery diarrhoea", "Vomiting", "Fever", "Stomach pain", "Dehydration"],
  tests: ["Stool test"],
  treatments: ["Oral rehydration solution", "Zinc", "Continued feeding", "Intravenous fluids", "Rotavirus vaccine"],
  body: [
    { k: "h2", text: "What rotavirus infection is" },
    {
      k: "p",
      text: "Rotavirus is a highly infectious virus that inflames the stomach and intestines, causing [gastroenteritis](/conditions/gastroenteritis). It is one of the most common causes of severe [diarrhoea](/conditions/diarrhea) in babies and young children worldwide, and before vaccines became widely used, almost every child caught it at least once before the age of five. Adults can be infected too, usually from a sick child, but their illness is generally milder.",
    },
    {
      k: "p",
      text: "The danger of rotavirus is dehydration. A young child can lose a large amount of water and salts through repeated watery stools and vomiting in a short time. With prompt fluids most children recover fully within a week, but severe dehydration can need hospital care and can be life-threatening. The good news is that a safe, effective vaccine is available, and in India it is part of the routine childhood immunisation schedule.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually start about two days after a child is exposed to the virus. Vomiting and fever often come first, followed by diarrhoea:",
    },
    {
      k: "ul",
      items: [
        "Watery diarrhoea, often frequent and sometimes very large in amount, lasting from three days to about a week",
        "Vomiting, which can make it hard to keep fluids down",
        "Fever",
        "Stomach pain or cramps",
        "Tiredness, irritability and loss of appetite",
      ],
    },
    { k: "h3", text: "Signs of dehydration" },
    {
      k: "p",
      text: "**Dehydration** is the most important thing to watch for. Signs in babies and young children include:",
    },
    {
      k: "ul",
      items: [
        "Fewer wet nappies or passing very little urine, or dark urine",
        "Dry mouth and tongue, and crying without tears",
        "Sunken eyes, and in babies a sunken soft spot on the top of the head",
        "Unusual sleepiness, floppiness or irritability",
        "Skin that goes back slowly when gently pinched",
        "Cold hands and feet",
      ],
    },

    { k: "h2", text: "How rotavirus spreads" },
    {
      k: "p",
      text: "Rotavirus spreads mainly through the faecal-oral route: tiny amounts of virus from an infected person's stool get onto hands, toys, surfaces, food or water, and then into another person's mouth. The virus survives a long time on surfaces and on hands, and only a very small amount is needed to cause infection. Children can spread it before symptoms start and for some days after they get better.",
    },
    {
      k: "p",
      text: "Because the virus spreads so easily, clean water and handwashing help but are not enough to prevent rotavirus on their own. Outbreaks are common in homes, crèches, day-care centres and hospital wards. Rotavirus can occur at any time of year, although in many places it peaks in the cooler, drier months.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Doctors usually diagnose gastroenteritis from the child's symptoms and examination, and the most important part of the visit is assessing how dehydrated the child is. Knowing that the cause is specifically rotavirus does not usually change treatment, so testing is not always done. In hospitals or during outbreaks, a **stool test** can confirm rotavirus. Blood tests may be done in a very unwell child to check salts and kidney function.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "There is no medicine that kills rotavirus, and antibiotics do not help because it is a virus. Treatment is about replacing lost fluids and salts until the illness passes:",
    },
    {
      k: "ul",
      items: [
        "**Oral rehydration solution** (ORS), made from WHO-formula ORS packets mixed exactly as directed in clean drinking water, is the mainstay. Give small sips often, by spoon or cup if the child is vomiting, and offer more after each loose stool. Use a fresh batch each day.",
        "**Zinc** — WHO and paediatric guidance recommend a short course of zinc for children with diarrhoea, alongside ORS. Your doctor or health worker will advise the amount for your child's age.",
        "**Continued feeding** — keep breastfeeding, more often than usual. Older babies and children should keep eating their usual light foods, such as rice, khichdi, curd and banana, as soon as they want to eat.",
        "Avoid sugary drinks, packaged juices and soft drinks, which can make diarrhoea worse.",
        "Do not give anti-diarrhoea or anti-vomiting medicines to children unless a doctor prescribes them.",
      ],
    },
    {
      k: "p",
      text: "A child who is moderately or severely dehydrated, keeps vomiting, or will not drink may need fluids through a tube into the stomach or **intravenous fluids** given through a drip in hospital. Most children recover fully within a few days of treatment.",
    },

    { k: "h2", text: "The rotavirus vaccine and other prevention" },
    {
      k: "p",
      text: "The **rotavirus vaccine** is the most effective way to protect children from severe rotavirus disease. It is given as oral drops, not an injection, in early infancy alongside other routine vaccines. In India it is included in the Universal Immunisation Programme and is available free at government health centres; it is also offered at private clinics. The vaccine doses must be started and completed within age limits set by the schedule, so take your baby for vaccination on time and ask your paediatrician or health worker if a dose has been missed.",
    },
    {
      k: "p",
      text: "Vaccinated children can still occasionally catch rotavirus, but the illness is usually much milder. The vaccine is very safe. A rare side effect is a type of bowel blockage called intussusception, in which part of the intestine folds into itself. Seek urgent care if, in the days or weeks after the vaccine, your baby has bouts of severe crying with drawing up of the legs, repeated vomiting, or blood in the stool.",
    },
    { k: "p", text: "Other steps that help reduce spread:" },
    {
      k: "ul",
      items: [
        "Wash hands with soap and water after changing nappies, after using the toilet and before preparing food or feeding a child",
        "Clean nappy-changing areas, toilets and toys that may be contaminated",
        "Keep a child with diarrhoea at home and away from crèche or school until at least two days after the diarrhoea stops",
        "Use safe drinking water, and breastfeed babies",
      ],
    },

    { k: "h2", text: "When to see a doctor" },
    {
      k: "p",
      text: "See a doctor or paediatrician the same day if your child is under six months old and has diarrhoea or vomiting, cannot keep fluids down, has a high fever, has blood in the stool, has diarrhoea lasting more than a few days, or shows any sign of dehydration.",
    },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if your child:" },
    {
      k: "ul",
      items: [
        "Is very drowsy, difficult to wake, floppy or unresponsive",
        "Has not passed urine for many hours, has sunken eyes and a very dry mouth",
        "Has cold, mottled hands and feet or is breathing fast",
        "Has green vomit, severe stomach pain, or a swollen belly",
        "Has a seizure",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [paediatrician](/specialties/paediatrics) is the right doctor for babies and children with rotavirus, and a [general physician](/specialties/general-practice) can treat older children and adults. An [infectious disease specialist](/specialties/infectious-diseases) may be involved for children or adults with weakened immunity, in whom rotavirus can last longer.",
    },
    {
      k: "p",
      text: "You can [find paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians), [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) or [infectious disease specialists in Bengaluru](/doctors/karnataka/bengaluru/infectious-disease-specialists) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Can my child get rotavirus even after the vaccine?",
      a: "Yes, but it is usually much milder. The vaccine is designed mainly to prevent severe diarrhoea, dehydration and hospital admission. A vaccinated child who has diarrhoea still needs ORS and should be checked by a doctor if there are signs of dehydration.",
    },
    {
      q: "How long does rotavirus diarrhoea last?",
      a: "Vomiting usually settles in a day or two, and diarrhoea typically lasts three to eight days. Keep giving ORS and food throughout. If the diarrhoea lasts longer, or the child is not drinking or seems to be getting worse, see a doctor.",
    },
    {
      q: "Should I stop milk or breastfeeding during rotavirus?",
      a: "No. Continue breastfeeding, more often than usual, because breast milk helps the baby recover and provides fluid. Most children can continue their usual milk and food. Your doctor will tell you if a temporary change is needed.",
    },
    {
      q: "Can adults get rotavirus?",
      a: "Yes. Adults, especially parents and carers of infected children, can catch rotavirus. It is usually milder than in children, but older people and those with weak immunity can become dehydrated and should drink ORS and seek help if unwell.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Rotavirus Infections", url: "https://medlineplus.gov/rotavirusinfections.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
