import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "foodborne-illness",
  title: "Food poisoning: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Food poisoning: symptoms, causes and treatment",
  standfirst: "What causes food poisoning, the symptoms and warning signs, how to treat it at home with ORS, who is at higher risk, and how to keep food safe.",
  targetQuery: "food poisoning symptoms and treatment",
  department: "gastroenterology",
  specialty: "gastroenterology",
  alsoSee: ["general-practice", "emergency-medicine", "infectious-diseases"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Nausea", "Vomiting", "Diarrhoea", "Stomach cramps", "Fever"],
  tests: ["Stool test", "Blood tests"],
  treatments: ["Oral rehydration solution", "Rest", "Intravenous fluids", "Antibiotics"],
  body: [
    { k: "h2", text: "What food poisoning is" },
    {
      k: "p",
      text: "Foodborne illness, commonly called food poisoning, is an illness caused by eating or drinking something contaminated with germs, the toxins they make, or harmful chemicals. Bacteria, viruses and parasites are the usual culprits. Most people recover within a few days without special treatment, but food poisoning can be serious, even life-threatening, for babies, pregnant women, older adults and people with weakened immunity.",
    },
    {
      k: "p",
      text: "Food can become contaminated at any point: on the farm, during transport, in a shop or kitchen, or when cooked food is left at room temperature. Contaminated food usually looks, smells and tastes normal, which is why food safety habits matter more than relying on your senses.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms can start within an hour or two of eating, or take days or even weeks to appear, depending on the germ. Common symptoms are:",
    },
    {
      k: "ul",
      items: [
        "Nausea and vomiting",
        "Diarrhoea, which may be watery or, with some infections, bloody",
        "Stomach cramps and pain",
        "Fever, chills and body ache",
        "Weakness and loss of appetite",
      ],
    },
    {
      k: "p",
      text: "When several people who shared a meal at a wedding, party, canteen or hostel fall ill with similar symptoms around the same time, food poisoning is the likely cause. Some foodborne infections, such as [hepatitis A](/conditions/hepatitis-a) and typhoid, cause illness that develops more slowly and is not limited to the stomach.",
    },

    { k: "h2", text: "Common causes" },
    {
      k: "ul",
      items: [
        "**Toxins from bacteria** such as Staphylococcus aureus, which can grow in food handled with unwashed hands and then left out, and Bacillus cereus, which can grow in cooked rice kept warm for long periods. These cause sudden vomiting within hours.",
        "**Bacterial infections** such as Salmonella from undercooked eggs and chicken, Campylobacter from poultry, harmful strains of E. coli from contaminated water, raw vegetables or undercooked meat, and Yersinia from undercooked pork.",
        "**Viruses** such as norovirus, which spreads easily in groups, and hepatitis A.",
        "**Parasites** such as Giardia and amoeba, usually from contaminated water.",
        "**Listeria**, found in unpasteurised milk and soft cheeses and some ready-to-eat foods, which is particularly risky in pregnancy.",
        "**Chemicals and natural toxins**, including pesticide residues, toxins in some spoiled fish and shellfish, and wild mushrooms.",
      ],
    },
    {
      k: "p",
      text: "In India, risk rises in the hot months and the monsoon, when food spoils quickly and water supplies can become contaminated. Common sources include street food made with unsafe water, chutneys and cut fruit left uncovered, food cooked in bulk for functions and held for hours before serving, undercooked meat and eggs, and unpasteurised milk. Rarely, home-canned or preserved foods can cause botulism, a serious illness that affects the nerves.",
    },

    { k: "h2", text: "Who is at higher risk" },
    {
      k: "ul",
      items: [
        "Babies and young children, who dehydrate quickly",
        "Pregnant women, because some infections such as Listeria can harm the baby",
        "Older adults",
        "People with diabetes, kidney or liver disease, cancer, HIV, or those taking medicines that weaken the immune system",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Most food poisoning is diagnosed from the story: what you ate, when symptoms began, and whether others who ate the same food are ill. Tests are not needed for mild illness that is getting better. A doctor may order them if symptoms are severe, last more than a few days, include blood in the stool or high fever, or if you are in a higher-risk group:",
    },
    {
      k: "ul",
      items: [
        "**Stool test** — to identify bacteria, parasites or their toxins, which can guide treatment",
        "**Blood tests** — to check for dehydration, kidney function, salt levels and infection that has spread into the blood",
      ],
    },
    {
      k: "p",
      text: "When an outbreak affects many people, for example after a community meal, local health authorities may investigate the food and water to find the source.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Most people get better within a few days. The main job is to prevent dehydration while the body clears the infection:",
    },
    {
      k: "ul",
      items: [
        "Sip **oral rehydration solution** (ORS) often, in small amounts if you are vomiting, and take more after each loose stool or vomit",
        "**Rest**, and return to light, simple food such as rice, khichdi, curd rice or banana as soon as you can keep it down",
        "Avoid alcohol, caffeine, very oily food and sugary soft drinks until you recover",
        "Keep breastfeeding babies who are unwell",
      ],
    },
    {
      k: "p",
      text: "Do not take anti-vomiting or anti-diarrhoea tablets without medical advice, especially if there is blood in the stool or a high fever, and never give them to young children. **Antibiotics** are not needed for most food poisoning and can be harmful with some types of E. coli; your doctor will prescribe them only for particular bacterial or parasitic infections or for people at high risk. People who are severely dehydrated or cannot keep fluids down may need **intravenous fluids** in hospital. Botulism and some chemical poisonings need emergency hospital treatment.",
    },

    { k: "h2", text: "Preventing food poisoning at home and outside" },
    {
      k: "p",
      text: "Four simple habits — keep clean, separate raw and cooked food, cook thoroughly, and keep food at safe temperatures — prevent most foodborne illness:",
    },
    {
      k: "ul",
      items: [
        "Wash hands with soap before cooking and eating, and after handling raw meat, fish or eggs",
        "Use separate knives and chopping boards for raw meat and for vegetables or cooked food",
        "Cook chicken, meat and eggs thoroughly, until juices run clear and yolks are firm",
        "Do not leave cooked food, especially rice, dals and meat dishes, at room temperature for long; refrigerate leftovers promptly and reheat until steaming hot",
        "Use boiled or purified water for drinking, and wash fruits and vegetables in clean water",
        "Choose freshly cooked, hot food when eating out, and be cautious with cut fruit, chutneys and ice of unknown origin",
        "Boil milk unless it is pasteurised, and avoid unpasteurised dairy during pregnancy",
        "Throw away bulging or leaking cans and food that smells or looks spoiled",
      ],
    },

    { k: "h2", text: "When to see a doctor" },
    {
      k: "p",
      text: "See a doctor if vomiting or diarrhoea lasts more than two days, if you have a high fever, blood in your stool, severe stomach pain, or signs of dehydration such as very little urine, a dry mouth and dizziness. Pregnant women, older adults, young children and people with long-term illness should seek advice early.",
    },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if:" },
    {
      k: "ul",
      items: [
        "Someone cannot keep any fluids down, is confused, very drowsy or faints",
        "There is blurred or double vision, drooping eyelids, difficulty swallowing or speaking, or weakness spreading through the body — possible signs of botulism",
        "A child shows signs of severe dehydration, such as no urine for many hours, sunken eyes or floppiness",
        "Someone may have eaten poisonous mushrooms, or a chemical or pesticide",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can manage most cases, and a [paediatrician](/specialties/paediatrics) should see children. An [emergency medicine](/specialties/emergency-medicine) doctor handles severe dehydration and suspected poisoning. A [gastroenterologist](/specialties/gastroenterology) is worth seeing if bowel symptoms continue for weeks after an episode, and an [infectious disease specialist](/specialties/infectious-diseases) may help with unusual or severe infections. See also our guides to [diarrhoea](/conditions/diarrhea) and [gastroenteritis](/conditions/gastroenteritis).",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists), [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) or [emergency physicians in Bengaluru](/doctors/karnataka/bengaluru/emergency-physicians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "How soon after eating does food poisoning start?",
      a: "It depends on the cause. Toxins from bacteria can cause vomiting within one to six hours. Many bacterial and viral infections take a day or two. Some, like hepatitis A or Listeria, can take weeks, which makes the source harder to pin down.",
    },
    {
      q: "How long does food poisoning last?",
      a: "Most cases improve within one to three days. Some infections last a week or longer. If symptoms are not improving after two days, are getting worse, or include blood in the stool or high fever, see a doctor.",
    },
    {
      q: "Can reheated rice cause food poisoning?",
      a: "Yes, if cooked rice has been left at room temperature for a long time. Bacteria can grow and make toxins that reheating does not destroy. Cool leftover rice quickly, keep it in the fridge, and eat it soon, reheated until steaming hot.",
    },
    {
      q: "Should I take an antibiotic for food poisoning?",
      a: "Usually not. Most food poisoning settles on its own with fluids and rest, and antibiotics can make some infections worse. A doctor may prescribe them for specific bacterial or parasitic infections, severe illness, or people at higher risk.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Foodborne Illness", url: "https://medlineplus.gov/foodborneillness.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
