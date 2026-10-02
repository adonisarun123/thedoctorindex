import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "diabetes-type-1",
  title: "Type 1 diabetes: symptoms, tests, insulin treatment and which doctor to see",
  metaTitle: "Type 1 diabetes: symptoms, tests and insulin treatment",
  standfirst: "What type 1 diabetes is, the warning signs in children and adults, how it is diagnosed, how insulin treatment works, and when it is an emergency.",
  targetQuery: "type 1 diabetes symptoms and treatment",
  department: "diabetology",
  specialty: "endocrinology",
  alsoSee: ["diabetology", "paediatrics"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Increased thirst", "Frequent urination", "Bedwetting", "Unexplained weight loss", "Tiredness", "Blurred vision", "Vomiting"],
  tests: ["Blood glucose", "HbA1c", "Ketones", "Islet autoantibodies", "C-peptide"],
  treatments: ["Insulin", "Insulin pump", "Continuous glucose monitoring", "Carbohydrate counting"],
  body: [
    { k: "h2", text: "What type 1 diabetes is" },
    {
      k: "p",
      text: "Type 1 diabetes is an autoimmune condition. The immune system destroys the cells in the pancreas that make insulin, the hormone that lets glucose move from the blood into the body's cells. Without insulin, sugar builds up in the blood while the cells starve, and the body begins breaking down fat for fuel, producing acids called ketones.",
    },
    {
      k: "p",
      text: "It most often starts in childhood or the teenage years, but it can appear at any age, including in adults who are sometimes first thought to have type 2 diabetes. It is not caused by eating sugar or by anything the parents did, and it cannot be prevented with current knowledge.",
    },
    {
      k: "p",
      text: "Type 1 diabetes always needs insulin. With good insulin treatment, monitoring and support, children with type 1 diabetes go to school, play sport, work, marry and have families like anyone else.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Symptoms usually develop over a few weeks, faster in young children:" },
    {
      k: "ul",
      items: [
        "Increased thirst and a dry mouth",
        "Frequent urination, including at night",
        "Bedwetting in a child who was previously dry",
        "Unexplained weight loss despite eating well",
        "Tiredness, weakness and irritability",
        "Blurred vision",
        "Repeated skin infections or thrush",
        "Later: tummy pain, nausea and vomiting, deep or rapid breathing and a fruity smell on the breath — signs of ketoacidosis",
      ],
    },
    {
      k: "p",
      text: "In India, children are sometimes treated for a stomach infection, a chest infection or worms before diabetes is considered. If a child has thirst, frequent urination and weight loss, ask for a blood sugar test the same day.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "Type 1 diabetes results from a mix of genetic tendency and environmental triggers that are not fully understood; viral infections are thought to play a part in some people. Your risk is higher if a parent, brother or sister has type 1 diabetes, and if you have another autoimmune condition, such as thyroid disease or coeliac disease. Most children diagnosed have no family history at all.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Diagnosis starts with a **blood glucose** test, which is usually clearly high when symptoms are present. Other tests help confirm the type and check for complications:",
    },
    {
      k: "ul",
      items: [
        "**HbA1c**, showing average sugar over recent months",
        "**Ketones** in the blood or urine, to check for ketoacidosis",
        "**Islet autoantibodies**, which point to type 1 rather than type 2 diabetes",
        "**C-peptide**, a measure of how much insulin the body still makes",
        "Blood salts, kidney function and a blood gas test if the person is unwell",
      ],
    },
    {
      k: "p",
      text: "Telling type 1 from type 2 and from rarer inherited forms of diabetes matters, because treatment differs. This is especially important in young adults and in slim adults who need insulin soon after diagnosis. Once type 1 is diagnosed, thyroid and coeliac screening are usually done at intervals.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Children are best looked after by a [paediatrician](/specialties/paediatrics) with experience in diabetes or a paediatric endocrinologist. Adults are usually managed by an [endocrinologist](/specialties/endocrinology) or a [diabetologist](/specialties/diabetology). Good care is a team: a diabetes educator, a dietitian and, in time, eye, kidney and foot checks.",
    },
    {
      k: "p",
      text: "You can [find endocrinologists in Bengaluru](/doctors/karnataka/bengaluru/endocrinologists), [diabetologists in Bengaluru](/doctors/karnataka/bengaluru/diabetologists) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Insulin" },
    {
      k: "p",
      text: "**Insulin** replaces what the pancreas no longer makes. Most people use a long-acting (basal) insulin once or twice a day plus a rapid-acting insulin with meals, given by pen or syringe. An **insulin pump** delivers insulin continuously through a small tube under the skin and suits some people. Your team will teach you how to inject, store insulin in the heat (in a fridge or a cooling pouch when travelling), rotate injection sites and adjust doses.",
    },
    {
      k: "note",
      tone: "alert",
      text: "Never stop insulin in type 1 diabetes, even if you are ill and not eating, and do not replace it with herbal or alternative remedies sold as a cure. Without insulin, ketoacidosis can develop within hours to days and can be fatal. On sick days, keep taking insulin and follow the sick-day plan your team gives you.",
    },
    { k: "h3", text: "Monitoring" },
    {
      k: "p",
      text: "Blood sugar is checked several times a day with a finger-prick glucometer, or around the clock with **continuous glucose monitoring**, a small sensor worn on the skin that sends readings to a reader or phone. Regular readings let you match insulin to food, activity and illness.",
    },
    { k: "h3", text: "Food and activity" },
    {
      k: "p",
      text: "There is no special 'diabetic diet'. **Carbohydrate counting** — estimating the carbohydrate in a meal of rice, roti, dosa or sweets — helps match the mealtime insulin dose. Exercise is encouraged, with checks before and after, because it lowers sugar. A dietitian can help fit this around family meals, fasting and festivals.",
    },

    { k: "h2", text: "Living with it: daily life and follow-up" },
    {
      k: "ul",
      items: [
        "Clinic review every few months, with HbA1c and a check of your readings",
        "Yearly checks of eyes, kidneys (urine protein), feet, blood pressure, cholesterol and thyroid",
        "A written plan for school or college: teachers should know the signs of low sugar and where glucose is kept",
        "Always carrying glucose or sugar, and wearing an identity card or bracelet",
        "Support for the whole family — low mood and burnout are common and worth discussing",
        "Planning pregnancy with your team, as tighter control is needed beforehand",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Vomiting, tummy pain, deep rapid breathing, drowsiness or confusion, especially with high sugar or ketones — possible ketoacidosis",
        "Low sugar that causes fits or unconsciousness, or does not improve after treatment",
        "Vomiting so that insulin, food and fluids cannot be kept down",
      ],
    },
    {
      k: "p",
      text: "If someone is shaky, sweaty or confused from low sugar but awake and able to swallow, give glucose, sugar or a sweet drink straight away, then recheck. Never put food or drink in the mouth of someone who is drowsy or unconscious; call for help and, if you have been trained and have it, use glucagon.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "How sure are we that this is type 1 diabetes?",
        "What range should my sugar readings and HbA1c be in?",
        "How do I adjust insulin for food, exercise and illness?",
        "What is my sick-day plan, and when should I check ketones?",
        "Would a pump or continuous glucose monitoring help me?",
        "Who do I call out of hours?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can type 1 diabetes be cured or outgrown?",
      a: "No. Type 1 diabetes is lifelong, and insulin is always needed. Some people have a 'honeymoon' period soon after diagnosis when they need less insulin, but this is temporary. Any product claiming to cure type 1 diabetes or replace insulin is dangerous.",
    },
    {
      q: "Can a child with type 1 diabetes eat sweets?",
      a: "Occasionally, yes, with insulin adjusted for them, as for any carbohydrate. Children with type 1 diabetes can enjoy festivals and birthdays. Regular sugary drinks and snacks make control harder, as they would for anyone's health, so plan them with the care team.",
    },
    {
      q: "Is type 1 diabetes different from type 2?",
      a: "Yes. Type 1 is autoimmune and the body makes little or no insulin, so insulin is essential from the start. Type 2 is driven by insulin resistance, often linked to weight and lifestyle, and is usually treated first with lifestyle change and tablets.",
    },
    {
      q: "Can people with type 1 diabetes have children?",
      a: "Yes. Women with type 1 diabetes can have healthy pregnancies with careful planning, good sugar control before conception and close monitoring throughout. Children of a parent with type 1 have a somewhat higher chance of developing it, but most do not.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Diabetes Type 1", url: "https://medlineplus.gov/diabetestype1.html" },
    { label: "World Health Organization — Diabetes fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/diabetes" },
  ],
};
