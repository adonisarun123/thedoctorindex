import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "lactose-intolerance",
  title: "Lactose intolerance: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Lactose intolerance: symptoms, tests and diet",
  standfirst: "Why milk upsets some people's stomachs, how lactose intolerance differs from milk allergy, how it is tested, and how to eat well and get enough calcium.",
  targetQuery: "lactose intolerance symptoms and treatment",
  department: "gastroenterology",
  specialty: "gastroenterology",
  alsoSee: ["dietetics", "general-practice", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Bloating", "Gas", "Diarrhoea", "Stomach cramps", "Nausea"],
  tests: ["Hydrogen breath test", "Stool acidity test", "Trial without lactose"],
  treatments: ["Reducing lactose", "Lactose-free milk", "Lactase enzyme", "Calcium-rich foods"],
  body: [
    { k: "h2", text: "What lactose intolerance is" },
    {
      k: "p",
      text: "Lactose is the natural sugar in milk and in foods made from milk. To digest it, the small intestine makes an enzyme called lactase, which splits lactose into simpler sugars that can be absorbed. If there is not enough lactase, undigested lactose passes into the large intestine, where gut bacteria ferment it. That produces gas and draws water into the bowel, causing the familiar bloating and loose motions.",
    },
    {
      k: "p",
      text: "Lactose intolerance is uncomfortable but not dangerous, and it does not damage the gut. Most people with it do not need to give up dairy completely; they need to find how much lactose they can handle and which foods suit them.",
    },
    {
      k: "p",
      text: "It is not the same as a milk allergy. A cow's milk allergy is a reaction of the immune system to milk proteins, is most common in babies and young children, and can cause rashes, swelling of the lips, vomiting, wheezing, or occasionally a severe allergic reaction. Lactose intolerance is a digestive problem and does not cause those allergic signs. If you are unsure which one you or your child has, ask a doctor before changing the diet.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually start from about half an hour to a couple of hours after having milk or milk products, and are worse with larger amounts:",
    },
    {
      k: "ul",
      items: [
        "Bloating and a swollen, full feeling in the stomach",
        "Gas and rumbling noises",
        "Diarrhoea or loose, frothy stools",
        "Stomach cramps or pain",
        "Nausea, and sometimes vomiting",
      ],
    },
    {
      k: "p",
      text: "These symptoms overlap with many other gut problems, including [irritable bowel syndrome](/conditions/irritable-bowel-syndrome) and [coeliac disease](/conditions/celiac-disease). Weight loss, blood in the stool, symptoms that wake you at night, or symptoms that continue even without dairy point to something other than lactose intolerance and need a doctor.",
    },

    { k: "h2", text: "Causes and who gets it" },
    {
      k: "ul",
      items: [
        "**Lactase decreasing with age** — the most common type. In many people, lactase production falls gradually after early childhood. This is normal and is particularly common in adults in Asia, including South Asia, and Africa. It runs in families and usually shows up in older children, teenagers or adults.",
        "**After an illness of the gut** — an infection such as [gastroenteritis](/conditions/gastroenteritis), coeliac disease, Crohn's disease, or some medical treatments can damage the lining of the small intestine and temporarily reduce lactase. This often improves once the underlying problem is treated and the gut heals.",
        "**Premature birth** — babies born early may have low lactase for a while, which usually improves.",
        "**Congenital lactase deficiency** — a rare inherited condition in which a newborn makes little or no lactase from birth, causing severe diarrhoea from the first feeds. It needs specialist care.",
      ],
    },
    {
      k: "p",
      text: "After a bout of diarrhoea, especially in children, a short period of milk-related loose stools is common. Do not stop breastfeeding a baby because of this; talk to your paediatrician about feeding.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Often the history is enough: symptoms that reliably follow milk and settle when it is cut out. Your doctor may suggest:",
    },
    {
      k: "ul",
      items: [
        "A **trial without lactose** — avoiding milk and milk products for a short period, then reintroducing them to see whether symptoms go and come back",
        "A **hydrogen breath test** — you drink a lactose solution and breathe into a bag at intervals; a rise in hydrogen in the breath shows lactose is being fermented in the bowel rather than absorbed",
        "A **stool acidity test** — sometimes used in infants and young children, in whom breath tests are difficult",
        "Blood tests or other investigations to rule out coeliac disease, infection or inflammatory bowel disease if there are warning signs",
      ],
    },

    { k: "h2", text: "Treatment and diet" },
    {
      k: "p",
      text: "There is no medicine that makes the body produce more lactase permanently, but symptoms can be well controlled by adjusting the diet. The aim is to keep symptoms away while still getting enough calcium, protein and vitamin D.",
    },
    {
      k: "ul",
      items: [
        "**Reducing lactose** rather than cutting it out completely — many people tolerate a small glass of milk, especially with food, spread across the day",
        "Choosing curd and yoghurt with live cultures, which many people tolerate better than milk because the bacteria break down some of the lactose",
        "Hard, aged cheeses and ghee contain very little lactose; paneer contains less than milk, but tolerance varies",
        "Using **lactose-free milk** and lactose-free dairy products, now available in many Indian cities",
        "Taking a **lactase enzyme** product — drops added to milk or tablets taken with dairy food — which some people find helpful",
        "Reading labels for hidden milk ingredients such as milk solids, whey and milk powder in sweets, biscuits, bakery items and ready mixes",
      ],
    },
    { k: "h3", text: "Getting enough calcium" },
    {
      k: "p",
      text: "Milk is the main source of calcium for many Indians, so cutting dairy without replacing it can weaken bones over time. **Calcium-rich foods** that do not depend on milk include ragi (finger millet), sesame seeds, green leafy vegetables, rajma and other pulses, soy and tofu, almonds, and small fish eaten with their bones. Fortified plant milks can help too. Vitamin D, mainly from sunlight on the skin, is needed to absorb calcium. If your diet still falls short, your doctor may suggest a calcium or vitamin D supplement; take it only on medical advice, especially if you have kidney problems.",
    },
    {
      k: "p",
      text: "A [dietitian](/specialties/dietetics) can help plan meals that suit your family's food habits while keeping your intake balanced. This matters particularly for children, teenagers, pregnant and breastfeeding women, and older adults at risk of [osteoporosis](/conditions/osteoporosis).",
    },

    { k: "h2", text: "When to see a doctor" },
    {
      k: "p",
      text: "See a doctor if digestive symptoms are new, persistent or troubling, before cutting out whole food groups, and especially if a baby or child has diarrhoea, poor weight gain or symptoms after feeds. Seek prompt care for:",
    },
    {
      k: "ul",
      items: [
        "Blood in the stool, weight loss, or symptoms that wake you at night",
        "Diarrhoea that continues for more than a few days, or signs of dehydration such as very little urine, dizziness or a dry mouth",
        "Symptoms that continue even after stopping milk products",
      ],
    },
    {
      k: "p",
      text: "Call 112 or 108 if someone has swelling of the lips, tongue or throat, difficulty breathing or collapse after having milk — that is an allergic emergency, not lactose intolerance.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can usually diagnose and advise on lactose intolerance, and a [paediatrician](/specialties/paediatrics) for children. A [gastroenterologist](/specialties/gastroenterology) is the right specialist when symptoms are severe or unclear, when other gut conditions need to be ruled out, or when lactose intolerance follows another digestive disease. A dietitian helps with practical meal planning.",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) or [dietitians in Bengaluru](/doctors/karnataka/bengaluru/dietitians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Can I eat curd if I am lactose intolerant?",
      a: "Many people with lactose intolerance tolerate curd and yoghurt better than milk, because the live bacteria in them break down some of the lactose. Start with small portions and see how you feel. Tolerance varies from person to person.",
    },
    {
      q: "Is lactose intolerance the same as a milk allergy?",
      a: "No. A milk allergy is an immune reaction to milk proteins and can cause rashes, swelling, wheezing or a severe reaction. Lactose intolerance is a digestive problem from not breaking down milk sugar. The two are managed differently, so get the right diagnosis.",
    },
    {
      q: "Can lactose intolerance develop in adulthood?",
      a: "Yes. Lactase levels naturally fall with age in many people, so someone who drank milk comfortably as a child may develop symptoms as a teenager or adult. It can also appear after a gut infection or another digestive illness.",
    },
    {
      q: "Will I need to give up dairy completely?",
      a: "Usually not. Most people can handle small amounts of lactose, especially with meals, and can use curd, aged cheese, lactose-free milk or lactase products. A doctor or dietitian can help you find your level and keep calcium intake adequate.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Lactose Intolerance", url: "https://medlineplus.gov/lactoseintolerance.html" },
    { label: "MedlinePlus Genetics — Lactose intolerance", url: "https://medlineplus.gov/genetics/condition/lactose-intolerance" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
