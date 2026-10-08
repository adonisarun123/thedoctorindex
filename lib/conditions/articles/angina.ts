import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "angina",
  title: "Angina: symptoms, causes, treatment and which doctor to see",
  standfirst: "What angina chest pain is, stable versus unstable angina, the tests a cardiologist uses, how it is treated, and when chest pain is an emergency.",
  targetQuery: "angina symptoms and treatment",
  department: "cardiology",
  specialty: "cardiology",
  alsoSee: ["general-practice", "internal-medicine"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Chest pain", "Chest pressure", "Breathlessness", "Pain spreading to the arm, jaw or back"],
  tests: ["ECG", "Treadmill test", "Echocardiogram", "Coronary angiogram"],
  treatments: ["Nitrate spray", "Lifestyle changes", "Angioplasty", "Bypass surgery"],
  body: [
    { k: "h2", text: "What angina is" },
    {
      k: "p",
      text: "Angina is chest pain or discomfort that happens when the heart muscle is not getting enough oxygen-rich blood. It is not a disease in itself but a warning sign, most often of [coronary artery disease](/conditions/coronary-artery-disease), in which fatty deposits narrow the arteries that supply the heart. When you are resting, a narrowed artery may carry enough blood. When the heart has to work harder, for example climbing stairs, walking fast after a meal or during anger or stress, the supply cannot keep up and the muscle complains.",
    },
    {
      k: "p",
      text: "Doctors describe a few types. Stable angina follows a predictable pattern: it comes on with a similar amount of effort and settles within minutes of rest or medicine. Unstable angina is new, more frequent, more severe, or comes on at rest. It means a plaque in an artery may have cracked and a clot is forming, and it can lead to a [heart attack](/conditions/heart-attack). Less common types include angina caused by spasm of a coronary artery, and microvascular angina, where the problem lies in the tiny blood vessels of the heart rather than the large arteries. The microvascular type was once called cardiac syndrome X and is found more often in women.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "People describe angina in many ways, and some never use the word pain at all. Common features are:" },
    {
      k: "ul",
      items: [
        "Chest pain or discomfort behind the breastbone",
        "Chest pressure, heaviness, squeezing or tightness, as if a weight is sitting on the chest",
        "Pain spreading to the arm, jaw or back, the neck or the shoulders",
        "Breathlessness with effort",
        "A burning feeling that can be mistaken for acidity or gas",
        "Tiredness, sweating or nausea with the discomfort",
      ],
    },
    {
      k: "p",
      text: "Women, older people and people with diabetes are more likely to have less typical symptoms, such as breathlessness, unusual tiredness, or discomfort in the upper abdomen, without obvious chest pain. In India, many people first treat chest discomfort as gas and reach for an antacid. If discomfort comes on with exertion and eases with rest, treat it as possible angina until a doctor says otherwise.",
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "The usual cause is narrowing of the coronary arteries by atherosclerosis, a slow build-up of cholesterol and other material in the artery wall. Things that raise the risk include:",
    },
    {
      k: "ul",
      items: [
        "[High blood pressure](/conditions/high-blood-pressure)",
        "[Type 2 diabetes](/conditions/diabetes-type-2) and prediabetes",
        "High LDL cholesterol or high triglycerides",
        "Smoking or chewing tobacco, including beedis and gutka",
        "Being overweight, especially extra fat around the waist",
        "Little physical activity",
        "A family history of heart disease at a young age",
        "Increasing age; men tend to be affected earlier than women",
        "Long-term kidney disease",
      ],
    },
    {
      k: "p",
      text: "Heart disease is known to start at a younger age in many South Asians than in people of European background, so a young or middle-aged adult in India should not dismiss exertional chest discomfort because of age. Less often, angina is caused or worsened by severe anaemia, an overactive thyroid, a very fast heart rhythm or a narrowed heart valve, which is one reason a doctor will examine you and check blood tests rather than assume.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The most useful information is your own description: what the discomfort feels like, what brings it on, how long it lasts and what relieves it. The doctor will check your blood pressure, pulse, weight and heart sounds, and usually order blood tests for sugar, cholesterol, kidney function and haemoglobin. Tests that look at the heart itself include:",
    },
    {
      k: "ul",
      items: [
        "**ECG** — a quick recording of the heart's electrical activity. It is often normal between episodes, so a normal ECG does not rule out angina.",
        "**Treadmill test** (exercise stress test) — an ECG recorded while you walk on a treadmill at increasing speed and slope, to see whether effort brings on changes or symptoms.",
        "**Echocardiogram** — an ultrasound scan that shows how the heart muscle and valves are working.",
        "Stress imaging, such as a stress echo or a nuclear scan, when a treadmill test is not possible or not clear.",
        "CT coronary angiography — a scan with contrast dye that shows the coronary arteries without a catheter.",
        "**Coronary angiogram** — a thin tube is passed through an artery in the wrist or groin to the heart, and dye shows any narrowing on X-ray. It is used when the picture suggests significant blockages that may need a stent or surgery.",
      ],
    },
    {
      k: "p",
      text: "Which tests you need depends on your symptoms and risk. If your symptoms are new, worsening or happening at rest, you may be assessed urgently in hospital rather than in a clinic.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment has two aims: to relieve the symptoms so you can live normally, and to lower the risk of a heart attack. Most people need a combination of medicines and **lifestyle changes**, and some also need a procedure.",
    },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "A short-acting nitrate, used as a **nitrate spray** or a tablet under the tongue, widens blood vessels and relieves an episode within minutes. Your doctor will explain exactly how to use it and when to call for help. Medicines taken every day to prevent episodes may include beta blockers, calcium channel blockers or long-acting nitrates. To protect the arteries, doctors commonly prescribe an antiplatelet medicine such as low-dose aspirin, a statin to lower cholesterol, and treatment for blood pressure and diabetes. Do not start aspirin on your own without asking your doctor, and do not take nitrates with medicines for erectile dysfunction, as the combination can drop blood pressure dangerously.",
    },
    { k: "h3", text: "Procedures" },
    {
      k: "p",
      text: "When angina is not controlled by medicines, or tests show severe narrowing in important arteries, the cardiologist may recommend **angioplasty**, in which a balloon opens the narrowed artery and a stent is usually placed to keep it open, or **bypass surgery** (CABG), in which a cardiothoracic surgeon uses a blood vessel from elsewhere in the body to route blood around the blockages. The choice depends on how many arteries are affected, where the narrowing is, whether you have diabetes, and your overall health. A stent relieves symptoms but does not remove the need for daily medicines and risk-factor control.",
    },
    { k: "h3", text: "Lifestyle changes" },
    {
      k: "ul",
      items: [
        "Stop smoking and chewing tobacco completely; ask for help if you have tried before and relapsed",
        "Eat more vegetables, pulses, whole grains and fruit, and cut down on fried snacks, ghee-heavy food, sweets and salt",
        "Build up regular walking as your doctor advises; cardiac rehabilitation programmes help many people exercise safely",
        "Keep blood pressure, sugar and cholesterol at the targets your doctor sets",
        "Limit alcohol, and manage stress and sleep",
      ],
    },

    { k: "h2", text: "When chest pain is an emergency" },
    { k: "p", text: "Call 112 or 108, or get to the nearest emergency department straight away, if:" },
    {
      k: "ul",
      items: [
        "Chest pain or pressure lasts more than a few minutes, or comes back, and does not settle with rest or your prescribed nitrate",
        "Chest discomfort comes on at rest or wakes you from sleep",
        "Your usual angina is suddenly more frequent, more severe, or brought on by much less effort",
        "Chest discomfort comes with sweating, breathlessness, nausea, fainting or a feeling of doom",
      ],
    },
    {
      k: "p",
      text: "These can be signs of unstable angina or a heart attack, where every minute of delay costs heart muscle. Do not drive yourself, and do not wait to see whether an antacid works. Stop what you are doing, sit down, and follow the emergency operator's advice.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [cardiologist](/specialties/cardiology) diagnoses and treats angina and performs angiograms and angioplasty. A [general physician](/specialties/general-practice) or [internal medicine specialist](/specialties/internal-medicine) is often the first doctor you see and manages blood pressure, diabetes and cholesterol over the long term. If bypass surgery is advised, you will be referred to a [cardiothoracic surgeon](/specialties/cardiothoracic-surgery).",
    },
    {
      k: "p",
      text: "You can [find cardiologists in Bengaluru](/doctors/karnataka/bengaluru/cardiologists) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check. For new chest pain at rest, go to an emergency department rather than booking a clinic slot.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is this stable angina, or do I need urgent tests?",
        "Which tests do I need, and what will each one tell us?",
        "How should I use my nitrate, and at what point should I call 112?",
        "What targets should I aim for with blood pressure, sugar and cholesterol?",
        "Would I benefit from a stent or surgery, or is medicine enough for now?",
        "How much exercise is safe for me, and is cardiac rehabilitation available?",
      ],
    },
  ],
  faqs: [
    {
      q: "How can I tell angina from gas or acidity?",
      a: "It can be hard, even for doctors, without tests. Discomfort that comes on with walking, climbing stairs or stress and eases within minutes of rest points towards angina. Any new chest discomfort with effort deserves a medical check rather than an antacid.",
    },
    {
      q: "Is angina the same as a heart attack?",
      a: "No. In angina the heart muscle is short of blood for a while but is not permanently damaged. In a heart attack an artery is blocked long enough for muscle to die. Unstable angina can turn into a heart attack, so it is treated as an emergency.",
    },
    {
      q: "Will I need a stent if I have angina?",
      a: "Not always. Many people with stable angina are treated well with medicines and lifestyle changes alone. A stent or bypass is considered when symptoms persist despite medicines or when tests show severe narrowing in important arteries. Your cardiologist will explain the reasons for their advice.",
    },
    {
      q: "Can I exercise if I have angina?",
      a: "Most people with stable angina are encouraged to stay active, but the amount and type of exercise should be agreed with your doctor. Cardiac rehabilitation programmes teach you how to build up safely. Stop and rest if chest discomfort starts.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Angina", url: "https://medlineplus.gov/angina.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
