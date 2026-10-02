import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "copd",
  title: "COPD: symptoms, causes, tests and treatment",
  standfirst: "What COPD is, why cooking smoke as well as tobacco causes it in India, the breathing test that confirms it, and how inhalers and rehab help.",
  targetQuery: "COPD symptoms and treatment",
  department: "pulmonology",
  specialty: "pulmonology",
  alsoSee: ["general-practice"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Breathlessness", "Long-lasting cough", "Phlegm", "Wheezing", "Tiredness"],
  tests: ["Spirometry", "Chest X-ray", "Pulse oximetry"],
  treatments: ["Stopping smoking", "Bronchodilator inhalers", "Pulmonary rehabilitation", "Vaccination", "Oxygen therapy"],
  body: [
    { k: "h2", text: "What COPD is" },
    {
      k: "p",
      text: "Chronic obstructive pulmonary disease (COPD) is a long-term lung condition in which the airways become narrowed and inflamed and the tiny air sacs at the ends of the airways are damaged. Air gets trapped in the lungs and breathing out takes effort. Older terms for it — chronic bronchitis and emphysema — describe two parts of the same disease.",
    },
    {
      k: "p",
      text: "COPD develops slowly over many years after the lungs have been exposed to smoke, dust or fumes. The damage already done cannot be undone, but the disease can be slowed, symptoms can be eased considerably, and flare-ups can be made less frequent. People who are treated well often stay active for many years.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Symptoms creep up and are easily blamed on age or a 'smoker's cough':" },
    {
      k: "ul",
      items: [
        "Breathlessness, at first on stairs or slopes and later with everyday activity",
        "A long-lasting cough, often worse in the morning",
        "Phlegm (sputum) brought up most days",
        "Wheezing or a tight chest",
        "Tiredness, and in advanced disease, weight loss and swollen ankles",
        "Chest infections that take longer to clear each time",
      ],
    },
    {
      k: "p",
      text: "A **flare-up** (exacerbation) is a period of days when breathlessness, cough or phlegm get clearly worse, often triggered by a cold or pollution. Flare-ups are a reason to act quickly, and frequent ones speed up the decline in lung function.",
    },

    { k: "h2", text: "Causes and who is at risk in India" },
    {
      k: "p",
      text: "Tobacco smoking — cigarettes, beedis or hookah — is the best-known cause. In India, though, a large share of people with COPD have never smoked. The other major cause is **household air pollution**: years of breathing smoke from cooking on a chulha with wood, dung cakes, crop waste, kerosene or coal, often in a poorly ventilated kitchen. This is why COPD is common in women in rural areas who have cooked on open fires all their lives. Other causes include:",
    },
    {
      k: "ul",
      items: [
        "Second-hand smoke at home or work",
        "Dust, fumes and chemicals at work — in mining, construction, textiles, stone-cutting, farming and factories",
        "Long-term exposure to outdoor air pollution",
        "Past tuberculosis, which can leave lasting airway damage",
        "Repeated severe chest infections in childhood, and poorly controlled asthma",
        "A rare inherited condition called alpha-1 antitrypsin deficiency, suspected in younger people with emphysema",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "ul",
      items: [
        "**Spirometry** — the key test. You blow out as hard and as long as you can into a machine before and after a reliever inhaler. COPD shows a narrowing that does not fully reverse. Without spirometry, COPD cannot be confirmed.",
        "**Chest X-ray** — to rule out other causes such as TB, lung cancer or heart failure.",
        "**Pulse oximetry** — a finger clip that measures oxygen in the blood. Low levels may lead to a blood gas test.",
      ],
    },
    {
      k: "p",
      text: "Depending on your history, the doctor may also arrange a sputum test for TB, a blood count, a heart assessment or a CT scan. COPD and asthma can look alike, and some people have both, so breathing tests help decide which treatment suits you.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can start the assessment and manage stable COPD. A [pulmonologist](/specialties/pulmonology) should be involved to confirm the diagnosis with spirometry, when symptoms are hard to control, after a hospital admission, if you may need oxygen at home, or when the diagnosis is unclear.",
    },
    {
      k: "p",
      text: "You can [find pulmonologists in Bengaluru](/doctors/karnataka/bengaluru/pulmonologists) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Remove the smoke" },
    {
      k: "p",
      text: "**Stopping smoking** is the single most effective step at any stage; it slows the loss of lung function. Counselling and stop-smoking medicines improve your chances, and the National Tobacco Quit Line on 1800-112-356 (toll-free) offers counselling in several languages. Cooking with LPG or another clean fuel, or at least improving kitchen ventilation and keeping others out of the smoke, matters just as much for people exposed to chulha smoke.",
    },
    { k: "h3", text: "Inhalers" },
    {
      k: "p",
      text: "**Bronchodilator inhalers** relax the muscles around the airways and are the main treatment. Short-acting ones relieve symptoms; long-acting ones, used daily, keep the airways open for longer. Some people with frequent flare-ups also benefit from an inhaled steroid added to their inhalers. Your doctor will decide based on your symptoms, flare-ups and blood tests. Inhaler technique matters — ask to have it checked, and use a spacer if advised. Do not stop or change your inhalers on your own.",
    },
    { k: "h3", text: "Rehabilitation, vaccines and oxygen" },
    {
      k: "p",
      text: "**Pulmonary rehabilitation** is a supervised programme of exercise, breathing techniques and education that improves breathlessness and stamina, often more than medicines alone. **Vaccination** against influenza, pneumococcus and other infections your doctor recommends reduces chest infections. **Oxygen therapy** at home is prescribed for people whose blood oxygen stays low; it is not for breathlessness alone. A few people with severe disease are assessed for procedures or surgery.",
    },
    {
      k: "p",
      text: "Flare-ups are usually treated with extra reliever, and sometimes a short course of steroid tablets or antibiotics. Agree an action plan in advance so you know what to do.",
    },

    { k: "h2", text: "Living with COPD" },
    {
      k: "ul",
      items: [
        "Stay active: daily walking, even short distances, keeps muscles and lungs working",
        "Learn pursed-lip breathing and pacing for tasks that make you breathless",
        "Eat well; both being underweight and overweight make breathing harder",
        "Avoid smoke, incense and mosquito coils indoors, and limit time outdoors on high-pollution days",
        "Keep vaccinations up to date and see your doctor early when a cold starts",
        "Review with your doctor at least once a year, and after every flare-up",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Severe breathlessness that your inhalers do not ease, or difficulty speaking",
        "Blue or grey lips or fingertips",
        "Confusion, drowsiness or unusual sleepiness",
        "Chest pain, or coughing up blood",
        "High fever with worsening breathing",
      ],
    },
    {
      k: "p",
      text: "If you use home oxygen, do not increase the flow on your own beyond what you have been prescribed unless the doctor or emergency operator tells you to; too much oxygen can be harmful for some people with COPD.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Has my diagnosis been confirmed with spirometry?",
        "How severe is my COPD, and what is my flare-up risk?",
        "What does each inhaler do, and is my technique right?",
        "Where can I do pulmonary rehabilitation?",
        "Which vaccines should I have?",
        "What should I do when I have a flare-up?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can you get COPD without ever smoking?",
      a: "Yes. In India, long-term exposure to smoke from cooking with wood, dung or crop waste is a major cause, along with workplace dust and fumes, air pollution and past tuberculosis. Anyone with a long-lasting cough or breathlessness should have spirometry, whether or not they have smoked.",
    },
    {
      q: "Is it too late to stop smoking once I have COPD?",
      a: "No. Stopping at any stage slows the loss of lung function, reduces flare-ups and improves how you feel. It is the most effective treatment there is. Counselling and medicines improve the chance of success; ask your doctor or call the quit line.",
    },
    {
      q: "Does COPD always get worse?",
      a: "COPD is a long-term condition, but how fast it progresses varies widely. Avoiding smoke, staying active, using inhalers correctly, keeping up with vaccines and treating flare-ups early all slow it down. Many people remain stable for years.",
    },
    {
      q: "Will I need oxygen at home?",
      a: "Most people with COPD do not. Home oxygen is prescribed only when tests show the blood oxygen level stays low, because it helps those people live longer. Breathlessness without low oxygen is better helped by inhalers and rehabilitation.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — COPD", url: "https://medlineplus.gov/copd.html" },
    { label: "World Health Organization — Chronic obstructive pulmonary disease (COPD) fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/chronic-obstructive-pulmonary-disease-(copd)" },
    { label: "National Tobacco Control Programme, MoHFW — National Tobacco Quit Line Services", url: "https://ntcp.mohfw.gov.in/national_tobacco_quit_line_services" },
  ],
};
