import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "obesity",
  title: "Obesity: health effects, assessment, treatment and which doctor to see",
  metaTitle: "Obesity: health effects, assessment and treatment",
  standfirst: "What obesity is, why waist size matters in India, how it is assessed, the treatment options from lifestyle to medicines and surgery, and who can help.",
  targetQuery: "obesity treatment india",
  department: "endocrinology",
  specialty: "general-practice",
  alsoSee: ["endocrinology", "dietetics", "gi-surgery"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Breathlessness", "Snoring", "Joint pain", "Tiredness"],
  tests: ["BMI", "Waist circumference", "HbA1c", "Lipid profile", "Thyroid function tests", "Liver function tests"],
  treatments: ["Diet and physical activity", "Behavioural support", "GLP-1 receptor agonists", "Bariatric surgery"],
  body: [
    { k: "h2", text: "What obesity is" },
    {
      k: "p",
      text: "Obesity means carrying excess body fat to a degree that harms health or raises the risk of illness. It is a long-term medical condition, not a failure of willpower. Genes, hormones, sleep, stress, medicines, the food around us and how our days are organised all shape body weight, and the body actively resists weight loss once fat has been gained.",
    },
    {
      k: "p",
      text: "Where fat is stored matters as much as how much there is. Fat around the waist and inside the abdomen, around the liver and other organs, is most closely linked to type 2 diabetes, high blood pressure, heart disease and fatty liver.",
    },

    { k: "h2", text: "Health effects and signs" },
    {
      k: "p",
      text: "Obesity may cause no symptoms for years, but it raises the risk of many conditions. Signs that it is affecting your health include:",
    },
    {
      k: "ul",
      items: [
        "Breathlessness on mild exertion",
        "Snoring, pauses in breathing at night and daytime sleepiness, which suggest sleep apnoea",
        "Joint pain, particularly in the knees, hips and lower back",
        "Tiredness and low energy",
        "Dark, velvety skin on the neck or armpits, a sign of insulin resistance",
        "Irregular periods or difficulty conceiving",
        "Heartburn and reflux",
      ],
    },
    {
      k: "p",
      text: "Obesity is linked to type 2 diabetes, high blood pressure, heart disease, stroke, fatty liver disease, gallstones, osteoarthritis, some cancers and depression. Many of these improve when weight falls.",
    },

    { k: "h2", text: "Causes and why it matters in India" },
    {
      k: "p",
      text: "Asian Indians tend to carry more body fat, and more of it around the abdomen, at a given body weight than people of European background, and develop diabetes and heart disease at lower weights. For this reason, Indian expert guidance uses lower cut-offs for overweight and obesity in Asian Indians than the global ones, and places weight on waist size. A person who looks 'healthy' by international charts may still be at risk.",
    },
    { k: "p", text: "Contributing factors include:" },
    {
      k: "ul",
      items: [
        "Diets high in refined starches, fried snacks, sweets and sugary drinks, with large portions",
        "Long hours of sitting at work, in traffic and in front of screens",
        "Short or poor-quality sleep and chronic stress",
        "A family history of obesity or diabetes",
        "Some medicines, including certain steroids, antidepressants and diabetes medicines",
        "Medical conditions such as hypothyroidism, PCOS and, rarely, hormonal or genetic disorders",
      ],
    },

    { k: "h2", text: "How it is assessed" },
    { k: "p", text: "Your doctor will look at more than the scale:" },
    {
      k: "ul",
      items: [
        "**BMI** (body mass index), calculated from height and weight, interpreted using the cut-offs for Asian Indians",
        "**Waist circumference**, measured at the level your doctor shows you, as a guide to abdominal fat",
        "Blood pressure",
        "**HbA1c** or fasting glucose, and a **lipid profile**",
        "**Liver function tests**, and sometimes an ultrasound for fatty liver",
        "**Thyroid function tests** and other hormone tests when symptoms suggest them",
        "Questions about sleep, joints, mood, eating patterns and medicines",
      ],
    },
    {
      k: "p",
      text: "Doctors increasingly judge obesity by its effects on health, not just by weight, which helps decide how intensive treatment should be.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) is a good first step: they can assess your health, check for complications and plan treatment. A [dietitian](/specialties/dietetics) can build an eating plan around your foods, culture and schedule. An [endocrinologist](/specialties/endocrinology) helps when hormonal causes are suspected, when diabetes is present or when medicines are being considered. A bariatric or [GI surgeon](/specialties/gi-surgery) assesses people for weight-loss surgery.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians), [dietitians in Bengaluru](/doctors/karnataka/bengaluru/dietitians) or [GI surgeons in Bengaluru](/doctors/karnataka/bengaluru/gi-surgeons) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Even modest, sustained weight loss improves blood sugar, blood pressure, joint pain and fatty liver. The goal is better health, not a particular number.",
    },
    { k: "h3", text: "Diet and physical activity" },
    {
      k: "p",
      text: "**Diet and physical activity** underpin every other treatment. Practical steps: smaller portions of rice, rotis and other starches; more vegetables, pulses and protein; fewer sweets, fried snacks, bakery items and sugary drinks; regular meals rather than grazing; and activity built into the day, aiming for more over time, with strength exercise to protect muscle. Crash diets and 'detox' plans rarely last and can harm health.",
    },
    { k: "h3", text: "Behavioural support" },
    {
      k: "p",
      text: "**Behavioural support** — regular contact with a dietitian, doctor or structured programme, food and activity records, and help with stress, sleep and emotional eating — makes changes more likely to stick.",
    },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "For people whose weight is affecting their health, a doctor may suggest medicine alongside lifestyle change. **GLP-1 receptor agonists** and related medicines, given as injections or tablets, reduce appetite and can lead to substantial weight loss; weight usually returns if they are stopped. They have side effects and are not suitable for everyone. Use them only on prescription and under supervision, and avoid unregulated or 'compounded' versions and weight-loss products sold online.",
    },
    { k: "h3", text: "Bariatric surgery" },
    {
      k: "p",
      text: "For people with severe obesity, or obesity with serious complications such as diabetes, a specialist may discuss **bariatric surgery**, such as sleeve gastrectomy or gastric bypass. It can lead to large, lasting weight loss and remission of diabetes in many people, but it is major surgery that needs lifelong follow-up, vitamin supplements and dietary changes. Your doctor will decide based on your health, your weight history and the cut-offs used for Asian Indians.",
    },

    { k: "h2", text: "Living with it: follow-up" },
    {
      k: "ul",
      items: [
        "Regular checks of weight, waist, blood pressure, sugar and cholesterol",
        "Support during plateaus — they are expected, not a sign of failure",
        "Mood and sleep checks",
        "Long-term follow-up after surgery or on medicines, including blood tests for vitamins and minerals",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108 for:" },
    {
      k: "ul",
      items: [
        "Chest pain, sudden weakness of the face, arm or leg, or difficulty speaking",
        "Severe breathlessness, or a painful swollen calf with breathlessness, which can mean a blood clot",
        "After bariatric surgery: severe abdominal pain, persistent vomiting, fever or a fast heartbeat",
        "On weight-loss medicines: severe abdominal pain spreading to the back, or persistent vomiting with dehydration",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "How is my weight affecting my health right now?",
        "What waist size and weight goals are realistic for me?",
        "Could any of my medicines or a hormone problem be contributing?",
        "Would a dietitian or a structured programme help?",
        "Am I a candidate for medicines or surgery, and what are the trade-offs?",
        "How often should I have check-ups?",
      ],
    },
  ],
  faqs: [
    {
      q: "Why do doctors use different cut-offs for Indians?",
      a: "Asian Indians tend to have more body fat, especially around the abdomen, at a given weight, and develop diabetes and heart disease at lower body weights. So Indian guidance uses lower BMI cut-offs and gives importance to waist size when judging risk.",
    },
    {
      q: "Is obesity caused by eating too much?",
      a: "Eating more energy than the body uses plays a part, but genes, sleep, stress, medicines, hormones, work patterns and the food environment all contribute. Treating obesity as a medical condition, rather than a matter of willpower, leads to better outcomes.",
    },
    {
      q: "Are weight-loss injections safe?",
      a: "Prescribed GLP-1 medicines are effective for many people but have side effects, such as nausea and, rarely, pancreatitis or gallstones, and need medical supervision. Avoid unregulated versions bought online, and do not share or self-adjust doses.",
    },
    {
      q: "Is bariatric surgery a quick fix?",
      a: "No. It is a powerful treatment for selected people with severe obesity or serious complications, but it is major surgery that needs lasting changes in eating, lifelong vitamin supplements and regular follow-up. A specialist assessment is the first step.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Obesity", url: "https://medlineplus.gov/obesity.html" },
    { label: "World Health Organization — Obesity and overweight fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" },
    { label: "Misra A et al., India Obesity Commission — Revised definition of obesity in Asian Indians living in India (Diabetes & Metabolic Syndrome, 2025)", url: "https://www.sciencedirect.com/science/article/abs/pii/S187140212400050X" },
  ],
};
