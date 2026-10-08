import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "hypoglycemia",
  title: "Hypoglycaemia (low blood sugar): symptoms, causes and what to do",
  metaTitle: "Low blood sugar (hypoglycaemia): symptoms and treatment",
  standfirst: "What low blood sugar is, the warning signs, how to treat a hypo quickly, how to prevent it with diabetes, and when to see a diabetologist.",
  targetQuery: "low blood sugar symptoms and treatment",
  department: "diabetology",
  specialty: "diabetology",
  alsoSee: ["endocrinology", "general-practice", "emergency-medicine"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Shaking", "Sweating", "Hunger", "Palpitations", "Confusion", "Dizziness"],
  tests: ["Glucose meter", "Continuous glucose monitoring", "Blood glucose test"],
  treatments: ["Fast-acting sugar", "Glucagon", "Medicine review", "Regular meals"],
  body: [
    { k: "h2", text: "What hypoglycaemia is" },
    {
      k: "p",
      text: "Glucose is the main sugar in the blood and the body's chief fuel, especially for the brain. It comes from the food we eat, and the hormone insulin helps move it from the blood into the cells. Hypoglycaemia, often called a \"hypo\" or low sugar, means the glucose level has dropped too low for the body to work properly.",
    },
    {
      k: "p",
      text: "Most hypos happen in people with diabetes who take insulin or certain tablets that make the pancreas release more insulin. In people without diabetes, true hypoglycaemia is uncommon and needs investigation. The level that counts as too low differs between people, so ask your own diabetes team what your target range is and at what reading you should act.",
    },
    {
      k: "p",
      text: "Low blood sugar is the opposite of [hyperglycaemia](/conditions/hyperglycemia), or high blood sugar. Both can occur in the same person on different days, and both are reasons to review the diabetes plan.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually come on quickly, over minutes. Early warning signs include:",
    },
    {
      k: "ul",
      items: [
        "Shaking or trembling",
        "Sweating, often cold and clammy",
        "Sudden hunger",
        "Palpitations or a pounding heart",
        "Anxiety, nervousness or irritability",
        "Tingling around the lips",
        "Dizziness or light-headedness",
      ],
    },
    {
      k: "p",
      text: "If the sugar keeps falling, the brain is affected: confusion, difficulty concentrating, blurred vision, slurred speech, unusual behaviour that can look like drunkenness, drowsiness, and finally seizures or loss of consciousness. Hypos during sleep can cause nightmares, sweating through the sheets, or a headache and tiredness in the morning.",
    },
    {
      k: "p",
      text: "Some people who have had diabetes for many years, or who have frequent hypos, lose the early warning signs. This is called hypo unawareness and makes severe episodes more likely. Tell your doctor if you have found low readings without feeling anything.",
    },

    { k: "h2", text: "Causes" },
    { k: "h3", text: "In people with diabetes" },
    {
      k: "ul",
      items: [
        "Taking too much insulin, or taking it at the wrong time in relation to food",
        "Some diabetes tablets that push the pancreas to release insulin; ask your doctor whether yours is one of them",
        "Skipping or delaying meals, or eating fewer carbohydrates than usual",
        "Fasting for religious or other reasons without adjusting medicines",
        "More physical activity than usual, including long walks, sport, or heavy housework",
        "Drinking alcohol, especially without food",
        "Illness with vomiting or poor appetite",
        "Worsening kidney function, which makes some diabetes medicines last longer in the body",
      ],
    },
    { k: "h3", text: "In people without diabetes" },
    {
      k: "p",
      text: "Low sugar without diabetes is rare. Possible causes include heavy alcohol use, serious liver or kidney disease, severe infection, some hormone deficiencies, certain medicines, after some types of weight-loss surgery, and, very rarely, a tumour that makes insulin. Some people feel shaky a few hours after a meal without a truly low reading. Anyone with repeated symptoms should be assessed rather than self-treating.",
    },

    { k: "h2", text: "Checking for a low" },
    {
      k: "ul",
      items: [
        "**Glucose meter** — a finger-prick test at home. If you feel symptoms of a hypo, check if you can, but do not delay treatment if a meter is not at hand.",
        "**Continuous glucose monitoring** (CGM) — a small sensor worn on the skin that tracks glucose through the day and night and can alert you to falling levels. It is especially useful for people on insulin or with hypo unawareness.",
        "**Blood glucose test** in a laboratory or hospital, which is used to confirm a low reading, and in people without diabetes along with other tests to find the cause.",
      ],
    },

    { k: "h2", text: "What to do during a hypo" },
    {
      k: "p",
      text: "If the person is awake and able to swallow safely, act at once:",
    },
    {
      k: "ul",
      items: [
        "Take a **fast-acting sugar**: glucose tablets or powder, a glass of fruit juice, a regular (not diet or sugar-free) soft drink, or a few teaspoons of sugar or glucose dissolved in water",
        "Rest, and recheck the sugar after about fifteen minutes. If it is still low or symptoms continue, repeat the sugary drink",
        "Once you feel better, eat a snack or your next meal, such as a chapati, idli, bread or fruit, to stop the sugar dropping again",
        "Chocolate and biscuits act more slowly because of their fat, so they are not the first choice for treating a low",
      ],
    },
    {
      k: "p",
      text: "If the person is very drowsy, confused, having a seizure or unconscious, do not put food or drink in their mouth, because they may choke. Turn them on their side and call 112 or 108. If they have been prescribed **glucagon** (an injection or nasal spray that raises blood sugar) and someone has been trained to use it, give it as instructed. Hypos caused by long-acting tablets can return after initial recovery, so emergency doctors may keep the person under observation.",
    },

    { k: "h2", text: "Preventing hypos" },
    {
      k: "ul",
      items: [
        "Eat **regular meals** and do not skip meals after taking insulin or sugar-lowering tablets",
        "Always carry a source of fast-acting sugar, and make sure family, colleagues and school staff know what to do",
        "Check your sugar before driving, and do not drive if it is low; treat it and wait until you have fully recovered",
        "Check before and after exercise, and plan a snack or a medicine change with your doctor",
        "Do not drink alcohol on an empty stomach, and be aware that alcohol can cause lows hours later",
        "Before festivals and religious fasts such as Ramadan, Navratri or Ekadashi, discuss a plan with your doctor; medicines and timing often need changing",
        "Ask for a **medicine review** if you have more than the occasional hypo, if you are older, or if your kidney function has changed; the dose or type of medicine may need adjusting",
        "Wear or carry something that says you have diabetes",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if:" },
    {
      k: "ul",
      items: [
        "The person is unconscious, having a seizure, or too drowsy or confused to swallow",
        "Symptoms do not improve after treating with sugar twice",
        "The person has taken more insulin or diabetes tablets than prescribed, accidentally or otherwise",
        "A child or adult without known diabetes has symptoms of a low with drowsiness or confusion",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "If you have diabetes and are getting hypos, see the doctor who manages your diabetes, often a [diabetologist](/specialties/diabetology), [endocrinologist](/specialties/endocrinology) or [general physician](/specialties/general-practice). If you get low sugar symptoms without diabetes, an endocrinologist can investigate the cause. Read more about [type 1 diabetes](/conditions/diabetes-type-1) and [type 2 diabetes](/conditions/diabetes-type-2).",
    },
    {
      k: "p",
      text: "You can [find diabetologists in Bengaluru](/doctors/karnataka/bengaluru/diabetologists) or [endocrinologists in Bengaluru](/doctors/karnataka/bengaluru/endocrinologists) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Can low blood sugar happen without diabetes?",
      a: "Yes, but it is uncommon. Causes include heavy drinking, liver or kidney disease, severe infection, some hormone problems and certain medicines. Repeated episodes need tests by a doctor, usually an endocrinologist, rather than simply eating more often.",
    },
    {
      q: "What should I eat when my sugar is low?",
      a: "First take something that raises sugar quickly, such as glucose tablets, fruit juice, a regular soft drink or sugar dissolved in water. Once you recover, eat a snack or meal with starch, such as a chapati or idli, so the sugar stays up.",
    },
    {
      q: "Is a hypo dangerous?",
      a: "Mild hypos treated quickly are usually not harmful. Severe hypos can cause falls, accidents, seizures and loss of consciousness, and can be dangerous for older people and those with heart disease. Frequent hypos are a signal to review your treatment.",
    },
    {
      q: "Can I fast during festivals if I take insulin?",
      a: "Many people do fast safely with planning, but fasting while on insulin or some tablets raises the risk of hypos. Talk to your doctor well before the fast about medicine timing, glucose checks and when to break the fast.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Hypoglycemia", url: "https://medlineplus.gov/hypoglycemia.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
