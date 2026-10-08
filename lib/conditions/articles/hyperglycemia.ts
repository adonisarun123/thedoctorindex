import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "hyperglycemia",
  title: "High blood sugar (hyperglycaemia): symptoms, causes and treatment",
  metaTitle: "High blood sugar: symptoms, causes and treatment",
  standfirst: "What high blood sugar means, why it happens with and without diabetes, how it is checked and lowered, and the DKA warning signs that need hospital care.",
  targetQuery: "high blood sugar symptoms and treatment",
  department: "diabetology",
  specialty: "diabetology",
  alsoSee: ["endocrinology", "general-practice", "emergency-medicine"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Thirst", "Frequent urination", "Tiredness", "Blurred vision", "Headache"],
  tests: ["Blood glucose meter", "Continuous glucose monitoring", "HbA1c", "Ketone test"],
  treatments: ["Meal plan", "Physical activity", "Diabetes medicines", "Insulin", "Intravenous fluids"],
  body: [
    { k: "h2", text: "What hyperglycaemia is" },
    {
      k: "p",
      text: "Hyperglycaemia simply means high blood sugar (blood glucose). Glucose comes from the food we eat and is the body's main fuel. A hormone called insulin, made by the pancreas, moves glucose out of the blood and into the cells that use it. When the body does not make enough insulin, or cannot use it properly, glucose builds up in the blood instead.",
    },
    {
      k: "p",
      text: "High blood sugar is most common in people with diabetes, both [type 1](/conditions/diabetes-type-1) and [type 2](/conditions/diabetes-type-2). It can also happen in people who do not know they have diabetes, in people with [prediabetes](/conditions/prediabetes), and occasionally in people without diabetes during a severe illness or on certain medicines.",
    },
    {
      k: "p",
      text: "A single high reading after a heavy meal is not usually dangerous. The concern is blood sugar that stays high over months, which slowly damages blood vessels and nerves, and blood sugar that climbs very high over hours or days, which can become an emergency.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Mildly raised blood sugar often causes no symptoms at all, which is why many people in India live with undiagnosed diabetes for years. As levels rise, you may notice:",
    },
    {
      k: "ul",
      items: [
        "Thirst and a dry mouth",
        "Frequent urination, including getting up at night to pass urine",
        "Tiredness and weakness",
        "Blurred vision",
        "Headache",
        "Weight loss without trying, and repeated infections such as thrush, boils, or urine infections, when it has been high for a while",
        "Cuts and wounds that heal slowly",
      ],
    },

    { k: "h2", text: "Causes" },
    { k: "h3", text: "In people with diabetes" },
    { k: "p", text: "Blood sugar control is a balance between food, activity and medicine. It can tip towards high when:" },
    {
      k: "ul",
      items: [
        "Meals are larger, or contain more sweets and refined carbohydrates, than usual — festivals, weddings and travel are common times",
        "Diabetes tablets or insulin are missed, taken at the wrong time, or no longer enough",
        "You are less active than usual",
        "You are unwell with an infection such as flu, a urine infection or a foot infection, or recovering from an injury or operation",
        "You are under emotional stress",
        "You are taking certain other medicines, especially steroids",
        "Insulin has been stored in heat and has lost its strength, or an insulin pen or pump is not working properly",
      ],
    },
    { k: "h3", text: "In people without known diabetes" },
    {
      k: "p",
      text: "High blood sugar may be the first sign of diabetes. Less commonly it is caused by problems with the pancreas (such as pancreatitis), hormone disorders of the adrenal or other glands, certain medicines such as steroids, or severe illness such as a major infection, heart attack or stroke. High blood sugar first found in pregnancy needs its own assessment and care by your obstetrician.",
    },

    { k: "h2", text: "Why it matters: short-term and long-term problems" },
    {
      k: "p",
      text: "Blood sugar that runs high for months or years damages small and large blood vessels and nerves. Over time this can lead to [diabetic eye problems](/conditions/diabetic-eye-problems), kidney disease, nerve damage and foot ulcers, heart attacks and strokes. Keeping blood sugar in the target range your doctor sets lowers these risks.",
    },
    {
      k: "p",
      text: "Very high blood sugar can also cause two emergencies:",
    },
    {
      k: "ul",
      items: [
        "**Diabetic ketoacidosis (DKA)** — when the body does not have enough insulin, it breaks down fat for fuel and produces acids called ketones. It is most common in type 1 diabetes but can occur in type 2. Signs include nausea, vomiting, abdominal pain, deep or fast breathing, a fruity smell on the breath, confusion and drowsiness.",
        "**Hyperosmolar hyperglycaemic state (HHS)** — more common in older people with type 2 diabetes, often during an infection. Blood sugar becomes extremely high and causes severe dehydration, confusion and drowsiness, developing over days.",
      ],
    },

    { k: "h2", text: "How it is checked and diagnosed" },
    {
      k: "ul",
      items: [
        "A **blood glucose meter** — a finger-prick test at home, the most common way people with diabetes check their levels",
        "**Continuous glucose monitoring** (CGM) — a small sensor worn on the skin that tracks glucose day and night and shows trends",
        "**HbA1c** — a blood test that reflects your average blood sugar over the past two to three months, used both to diagnose diabetes and to judge control",
        "Fasting and post-meal blood sugar tests done in a laboratory",
        "A **ketone test** of blood or urine, which people with type 1 diabetes are often advised to do when blood sugar is high or they are unwell",
      ],
    },
    {
      k: "p",
      text: "Your doctor will tell you what range to aim for, because targets differ between people, for example in older adults or in pregnancy. If you keep getting high readings, note the times, what you ate and any illness, and share the record with your doctor.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "If you have diabetes and your readings are often high, your care team will look at the whole picture. Changes may include:",
    },
    {
      k: "ul",
      items: [
        "Adjusting your **meal plan** — portion sizes, timing, and swapping refined foods for whole grains, pulses, vegetables and protein",
        "Building in regular **physical activity**, such as brisk walking, which helps the body use insulin",
        "Changing the type, timing or dose of your **diabetes medicines**",
        "Starting or adjusting **insulin**, and checking your injection technique and how insulin is stored",
      ],
    },
    {
      k: "p",
      text: "Do not change medicine or insulin doses on your own unless your doctor has given you a written plan for doing so. DKA and HHS are treated in hospital with **intravenous fluids**, insulin through a drip, and close monitoring of salts such as potassium, along with treatment of whatever triggered the episode.",
    },
    { k: "h3", text: "When you are unwell" },
    {
      k: "p",
      text: "Illness often pushes blood sugar up even if you are eating less. Ask your doctor for sick-day guidance before you need it. In general, people on insulin should not stop it during illness without medical advice, should check blood sugar more often, should keep drinking fluids, and should seek help early if they cannot keep fluids down.",
    },

    { k: "h2", text: "Preventing high blood sugar" },
    {
      k: "ul",
      items: [
        "Take diabetes medicines as prescribed and keep a supply when travelling",
        "Check your blood sugar as often as your doctor recommends, and more often when ill",
        "Follow a regular eating pattern and stay active",
        "Get HbA1c, eye, kidney and foot checks as advised",
        "If you have a family history of diabetes, are overweight, or had diabetes in pregnancy, ask your doctor about screening for diabetes",
      ],
    },
    {
      k: "p",
      text: "Treating high blood sugar too aggressively can cause [low blood sugar (hypoglycaemia)](/conditions/hypoglycemia), which is also dangerous. That is another reason to adjust treatment with your doctor rather than on your own.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if high blood sugar comes with:" },
    {
      k: "ul",
      items: [
        "Vomiting, or being unable to keep fluids down",
        "Abdominal pain, deep or fast breathing, or a fruity smell on the breath",
        "Moderate or high ketones on a home test",
        "Confusion, extreme drowsiness, or difficulty waking",
        "Signs of severe dehydration, such as very little urine or a racing heart",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most people with diabetes are looked after by a [general physician](/specialties/general-practice) or a [diabetologist](/specialties/diabetology). An [endocrinologist](/specialties/endocrinology) is useful for type 1 diabetes, diabetes in pregnancy, hard-to-control blood sugar, or when a hormone disorder is suspected. Children with high blood sugar or new thirst, frequent urination and weight loss should be seen by a doctor the same day, as type 1 diabetes can progress quickly to DKA.",
    },
    {
      k: "p",
      text: "You can [find diabetologists in Bengaluru](/doctors/karnataka/bengaluru/diabetologists) or [endocrinologists in Bengaluru](/doctors/karnataka/bengaluru/endocrinologists) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Can high blood sugar happen without diabetes?",
      a: "Yes, though less commonly. Severe illness, major stress on the body, steroids and some other medicines, pancreatitis and certain hormone disorders can raise blood sugar. Sometimes a high reading is the first sign of diabetes, so it should be checked by a doctor.",
    },
    {
      q: "Should I stop eating if my blood sugar is high?",
      a: "No. Skipping meals can make control harder and, if you take insulin or some tablets, can cause low sugar later. Keep to your meal plan, drink water, check your levels and contact your doctor if readings stay high.",
    },
    {
      q: "Does stress raise blood sugar?",
      a: "Yes. Stress hormones can push blood sugar up, and stress can also disrupt sleep, eating and activity. Managing stress, keeping a routine and discussing persistent high readings with your doctor all help.",
    },
    {
      q: "What is HbA1c and why does it matter?",
      a: "HbA1c is a blood test that reflects your average blood sugar over roughly the past two to three months. It helps diagnose diabetes and shows how well treatment is working. Your doctor will set a target that suits your age and health.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Hyperglycemia", url: "https://medlineplus.gov/hyperglycemia.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
