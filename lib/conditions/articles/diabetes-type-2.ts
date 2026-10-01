import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "diabetes-type-2",
  title: "Type 2 diabetes: signs, tests, treatment and which doctor to see",
  metaTitle: "Type 2 diabetes: tests, treatment and which doctor to see",
  standfirst: "What type 2 diabetes is, why it often has no symptoms, the tests that confirm it, how it is treated, and when to see a diabetologist.",
  targetQuery: "type 2 diabetes symptoms and treatment",
  department: "diabetology",
  specialty: "diabetology",
  alsoSee: ["endocrinology", "general-practice", "ophthalmology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Increased thirst", "Frequent urination", "Tiredness", "Blurred vision", "Slow-healing wounds", "Unexplained weight loss"],
  tests: ["HbA1c", "Fasting plasma glucose", "Oral glucose tolerance test"],
  treatments: ["Diet and physical activity", "Metformin", "Insulin"],
  body: [
    { k: "h2", text: "What type 2 diabetes is" },
    {
      k: "p",
      text: "Type 2 diabetes is a long-term condition in which the level of glucose (sugar) in the blood stays higher than it should. Normally the hormone insulin, made by the pancreas, moves glucose out of the blood and into the body's cells. In type 2 diabetes the body becomes less responsive to insulin, and over time the pancreas cannot make enough to keep up.",
    },
    {
      k: "p",
      text: "It is different from type 1 diabetes, in which the immune system destroys the cells that make insulin, usually early in life. Type 2 is by far the more common form and usually develops in adults, although it is now seen in younger people too.",
    },
    {
      k: "p",
      text: "High blood sugar does damage slowly and quietly. Left uncontrolled for years, it affects the small blood vessels of the eyes, kidneys and nerves, and the large arteries of the heart, brain and legs. Most of that harm can be reduced or delayed with good control, which is why diagnosis and regular follow-up matter even when you feel well.",
    },

    { k: "h2", text: "Symptoms — and why many people have none" },
    {
      k: "p",
      text: "Many people with type 2 diabetes have no symptoms at all for years. It is often found on a routine blood test, a pre-operative check or a health camp. When symptoms do appear, the common ones are:",
    },
    {
      k: "ul",
      items: [
        "Increased thirst and a dry mouth",
        "Frequent urination, including waking at night to pass urine",
        "Tiredness that does not match how much you are doing",
        "Blurred vision that comes and goes",
        "Slow-healing wounds, or repeated skin, gum or urine infections",
        "Tingling, burning or numbness in the feet",
        "Unexplained weight loss, usually when sugar is very high",
      ],
    },
    {
      k: "p",
      text: "None of these is specific to diabetes, and their absence does not rule it out. The only way to know is a blood test.",
    },

    { k: "h2", text: "Who is at higher risk in India" },
    {
      k: "p",
      text: "People of South Asian background tend to develop type 2 diabetes at a younger age and at a lower body weight than people of European background. Fat carried around the waist matters more than overall weight. That is why doctors in India often advise testing earlier than guidance written for other countries suggests.",
    },
    { k: "p", text: "Your risk is higher if you:" },
    {
      k: "ul",
      items: [
        "Have a parent, brother or sister with type 2 diabetes",
        "Carry extra weight around the waist, even if your weight looks normal",
        "Are physically inactive for most of the day",
        "Had diabetes during a pregnancy (gestational diabetes), or had a baby who was large at birth",
        "Have polycystic ovary syndrome (PCOS)",
        "Have high blood pressure or abnormal cholesterol",
        "Have been told you have prediabetes",
      ],
    },
    {
      k: "p",
      text: "The national programme for non-communicable diseases offers screening for diabetes and high blood pressure to people aged 30 and above through government health centres, including Ayushman Arogya Mandirs. Ask at your nearest centre if you have not been checked.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Diabetes is diagnosed with blood tests, not with a home glucometer reading or a urine strip. Your doctor will usually use one or more of these:",
    },
    {
      k: "ul",
      items: [
        "**HbA1c** — reflects your average blood sugar over the previous two to three months. No fasting is needed.",
        "**Fasting plasma glucose** — a blood sample taken after an overnight fast.",
        "**Oral glucose tolerance test** — blood is taken before and two hours after drinking a measured glucose drink.",
      ],
    },
    {
      k: "p",
      text: "Each test has standard cut-offs for normal, prediabetes and diabetes, and the doctor will usually confirm an abnormal result with a repeat test unless the reading is clearly high and you have symptoms. HbA1c can read falsely high or low in some conditions, including anaemia and certain inherited haemoglobin variants such as thalassaemia trait, which are common in India. If you have one of these, tell the doctor.",
    },
    {
      k: "p",
      text: "Once diabetes is confirmed, a first assessment usually includes blood pressure, a cholesterol test, kidney function and a urine test for protein, an eye examination and a foot check. These set a baseline for the years ahead.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most people with type 2 diabetes are diagnosed and looked after by a [general physician](/specialties/general-practice) or an internal medicine physician. A [diabetologist](/specialties/diabetology) or [endocrinologist](/specialties/endocrinology) is worth seeing when:",
    },
    {
      k: "ul",
      items: [
        "Your sugar stays high despite treatment",
        "You are starting or adjusting insulin",
        "You have frequent low-sugar episodes",
        "You are planning a pregnancy, or are pregnant",
        "The diagnosis is uncertain — for example, you are young and slim, and type 1 or another form of diabetes is possible",
      ],
    },
    {
      k: "p",
      text: "Diabetes care is shared. An [ophthalmologist](/specialties/ophthalmology) checks the retina, a [nephrologist](/specialties/nephrology) sees people whose kidneys are affected, and a [dietitian](/specialties/dietetics) can help build an eating plan that fits your food and routine. You can [find diabetologists in Bengaluru](/doctors/karnataka/bengaluru/diabetologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment aims to keep blood sugar, blood pressure and cholesterol in a range agreed with your doctor, so as to prevent complications. Targets are set for the individual: they are usually less strict for older people and for people prone to low sugar.",
    },
    { k: "h3", text: "Diet and physical activity" },
    {
      k: "p",
      text: "Diet and physical activity are the foundation at every stage, not just at the beginning. In practice this usually means smaller portions of rice, rotis and other refined starches, more vegetables, pulses and protein, fewer sweetened drinks and sweets, and regular activity such as brisk walking on most days. Losing even a modest amount of weight, if you carry extra, can improve control noticeably. Some people early in the condition can bring their sugar into the normal range this way; whether that is realistic for you is a question for your doctor.",
    },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "**Metformin** is the usual first medicine. Several other families of tablets and injections are available, and some also protect the heart or kidneys, which can decide which one a doctor chooses. **Insulin** is not a sign of failure: it is needed when other treatment no longer keeps sugar in range, during some illnesses and surgery, and often in pregnancy.",
    },
    {
      k: "p",
      text: "Do not stop, start or change the dose of a diabetes medicine on your own, including on the advice of a relative or an online forum. Some combinations cause dangerously low sugar. If cost is a barrier, say so — there are usually effective lower-cost options, including through government schemes.",
    },

    { k: "h2", text: "Living with it: the checks that matter" },
    { k: "p", text: "Regular review is how complications are caught early. A typical pattern, which your doctor will adjust, includes:" },
    {
      k: "ul",
      items: [
        "HbA1c every three to six months",
        "Blood pressure at every visit",
        "Cholesterol, kidney function and a urine protein test at least yearly",
        "A dilated eye examination at least yearly",
        "A foot examination at least yearly — and your own check of your feet every day",
      ],
    },
    {
      k: "p",
      text: "Stopping tobacco in any form is one of the most effective things you can do for your heart and circulation. Keep a simple record of your readings and medicines, and bring it to each appointment.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Confusion, drowsiness, fits or unconsciousness — low sugar can cause these, and so can very high sugar",
        "Vomiting that will not stop, deep rapid breathing or severe abdominal pain with high sugar readings",
        "Chest pain, sudden weakness of the face, arm or leg, or difficulty speaking",
        "A foot wound that is spreading, smells, turns black or comes with fever",
      ],
    },
    {
      k: "p",
      text: "If someone with diabetes is shaky, sweaty and confused but awake and able to swallow, give glucose, sugar or a sweet drink straight away and get help if they do not improve quickly. Never give food or drink to someone who is drowsy or unconscious.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Which type of diabetes do I have, and how sure are we?",
        "What range should my HbA1c and home readings be in?",
        "What does each of my medicines do, and what side effects should I watch for?",
        "How do I recognise and treat low sugar?",
        "Which checks are due this year, and who does them?",
        "Should anyone in my family be tested?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can type 2 diabetes go away?",
      a: "Some people, particularly early in the condition and after substantial weight loss, bring their blood sugar back into the normal range without medicines. Doctors call this remission rather than cure, because the tendency remains and sugar can rise again. Regular checks are still needed.",
    },
    {
      q: "Is a glucometer reading enough to diagnose diabetes?",
      a: "No. Home glucometers are for monitoring once diabetes is known. Diagnosis needs a laboratory blood test such as HbA1c, fasting plasma glucose or a glucose tolerance test, usually confirmed with a repeat test.",
    },
    {
      q: "Should I see a diabetologist or an endocrinologist?",
      a: "Either can manage type 2 diabetes. A diabetologist focuses on diabetes; an endocrinologist trains in all hormone conditions and is the better choice when another gland problem, such as thyroid or adrenal disease, is also involved. Many people are well looked after by a general physician.",
    },
    {
      q: "Does starting insulin mean my diabetes is severe?",
      a: "Not necessarily. Type 2 diabetes changes over time, and many people eventually need insulin to keep sugar in range. It is also used for short periods during illness, surgery or pregnancy. Starting it is a treatment decision, not a judgement.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Diabetes Type 2", url: "https://medlineplus.gov/diabetestype2.html" },
    { label: "World Health Organization — Diabetes fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/diabetes" },
    { label: "DD News — Government launches intensified NCD screening campaign for all citizens aged 30 and above", url: "https://ddnews.gov.in/en/government-launches-intensified-ncd-screening-campaign-to-cover-all-citizens-aged-30-and-above/" },
  ],
};
