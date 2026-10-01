import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "rheumatoid-arthritis",
  title: "Rheumatoid arthritis: symptoms, tests, treatment and which doctor to see",
  metaTitle: "Rheumatoid arthritis: tests, treatment and which doctor",
  standfirst: "What rheumatoid arthritis is, the early signs, the tests a rheumatologist uses, why early treatment protects your joints, and how it is managed.",
  targetQuery: "rheumatoid arthritis symptoms and treatment",
  department: "rheumatology",
  specialty: "rheumatology",
  alsoSee: ["orthopaedics", "physiotherapy"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Joint pain", "Joint swelling", "Morning stiffness", "Tiredness", "Rheumatoid nodules"],
  tests: ["Rheumatoid factor", "Anti-CCP antibodies", "ESR", "CRP", "X-ray", "Ultrasound"],
  treatments: ["DMARDs", "Methotrexate", "Biologic medicines", "Steroids", "Physiotherapy"],
  body: [
    { k: "h2", text: "What rheumatoid arthritis is" },
    {
      k: "p",
      text: "Rheumatoid arthritis (RA) is a long-term autoimmune condition. The immune system, which normally fights infection, attacks the thin lining of the joints. The lining becomes inflamed and thickened, and if this continues untreated it can damage the cartilage and bone and change the shape of the joints.",
    },
    {
      k: "p",
      text: "RA is not the same as osteoarthritis. It usually starts earlier in life, typically affects the small joints of the hands and feet on both sides of the body, and involves the whole body: it can cause tiredness and affect the lungs, eyes, blood vessels and heart. The good news is that modern treatment, started early, can control it well in many people.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "RA often begins gradually over weeks to months. The common symptoms are:" },
    {
      k: "ul",
      items: [
        "Joint pain and joint swelling, most often in the knuckles, the middle finger joints, the wrists and the balls of the feet",
        "The same joints affected on both sides of the body",
        "Morning stiffness that lasts well over half an hour, sometimes for hours",
        "Tiredness, a mild fever, loss of appetite or weight loss",
        "Rheumatoid nodules — firm, painless lumps under the skin, often near the elbows",
        "Difficulty making a fist, opening jars or buttoning clothes",
      ],
    },
    {
      k: "p",
      text: "Larger joints such as knees, shoulders and ankles can also be involved. Symptoms may flare and settle, which can make it tempting to wait. Swelling in several joints that lasts more than a few weeks should be checked.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "The exact cause is not known. It is thought to result from a mix of inherited tendency and something in the environment that switches on the immune response. Your risk is higher if you:",
    },
    {
      k: "ul",
      items: [
        "Are a woman — RA is more common in women than in men",
        "Have a close relative with RA or another autoimmune condition",
        "Smoke now or have smoked in the past",
        "Have gum disease or carry excess weight",
      ],
    },
    {
      k: "p",
      text: "Smoking is the most important risk you can change. It makes RA more likely, makes it more severe and makes some treatments work less well.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "No single test proves or rules out RA. A rheumatologist puts together your history, an examination of each joint and a set of tests:",
    },
    {
      k: "ul",
      items: [
        "**Rheumatoid factor** and **anti-CCP antibodies** — blood tests for antibodies linked to RA. Anti-CCP is more specific. Some people with RA test negative, and some healthy people test positive for rheumatoid factor, so the result is read alongside the examination.",
        "**ESR** and **CRP** — blood tests that measure inflammation and help track how active the disease is.",
        "A blood count, liver and kidney tests — to look for anaemia and to check it is safe to start medicines.",
        "**X-ray** of the hands and feet — to look for early damage and to set a baseline.",
        "**Ultrasound** or sometimes MRI — to show inflammation in a joint that is not obvious on examination.",
      ],
    },
    {
      k: "p",
      text: "Doctors aim to diagnose RA early because the first months are when treatment does the most to prevent permanent joint damage.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "If you have swollen, painful joints for more than a few weeks, see a general physician promptly and ask to be referred to a [rheumatologist](/specialties/rheumatology). A rheumatologist confirms the diagnosis, chooses the long-term medicines and monitors them.",
    },
    {
      k: "p",
      text: "Others often share care. [Physiotherapists](/specialties/physiotherapy), who are allied-health professionals, help keep joints moving and muscles strong. An [orthopaedic surgeon](/specialties/orthopaedics) is involved if a damaged joint needs surgery. You can [find rheumatologists in Bengaluru](/doctors/karnataka/bengaluru/rheumatologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "There is no cure, but the aim of treatment today is remission or very low disease activity — swelling settled, blood markers improved and joints protected. Your rheumatologist will set the target with you and adjust treatment until it is reached.",
    },
    { k: "h3", text: "Disease-modifying medicines" },
    {
      k: "p",
      text: "**DMARDs** (disease-modifying anti-rheumatic drugs) are the core of treatment because they calm the immune attack itself, not just the pain. **Methotrexate** is usually the first choice; others include hydroxychloroquine, sulfasalazine and leflunomide, often in combination. They take several weeks to work. Regular blood tests are needed to check for side effects on the blood count and liver, so keep every monitoring appointment.",
    },
    {
      k: "p",
      text: "**Biologic medicines** and newer targeted tablets are used when standard DMARDs do not control the disease. Because they affect the immune system, you will be screened for infections such as tuberculosis and hepatitis B before starting them, which matters particularly in India.",
    },
    { k: "h3", text: "Steroids and pain relief" },
    {
      k: "p",
      text: "**Steroids** work quickly and are useful for a short period while DMARDs take effect, or for a flare. Long-term use has serious side effects, so they are tapered off when possible. Never stop steroids suddenly on your own. Anti-inflammatory painkillers ease symptoms but do not prevent joint damage.",
    },
    { k: "h3", text: "Physiotherapy and self-care" },
    {
      k: "p",
      text: "**Physiotherapy** and regular exercise keep joints flexible and muscles strong. Occupational therapy can suggest splints and aids for daily tasks. Stopping smoking, keeping a healthy weight and looking after your teeth and gums all help.",
    },

    { k: "h2", text: "Living with rheumatoid arthritis" },
    {
      k: "p",
      text: "RA is a long-term condition, and follow-up is how it stays controlled. Expect regular reviews and blood tests, more often in the early months. RA increases the risk of heart disease and osteoporosis, so blood pressure, cholesterol and bone health should be checked. Ask about vaccinations, such as against influenza and pneumonia, before or soon after starting treatment. If you are planning a pregnancy, talk to your rheumatologist well in advance, because some medicines, including methotrexate, must be stopped beforehand.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Fever, chills or feeling very unwell while on DMARDs, biologics or steroids — infections can become serious quickly",
        "A single joint that suddenly becomes hot, red and very painful",
        "Sudden breathlessness, chest pain or coughing blood",
        "New weakness or numbness in the arms or legs, or neck pain with tingling — RA can rarely affect the neck joints",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "How sure are we that this is rheumatoid arthritis?",
        "What is our treatment target, and how will we measure it?",
        "Which blood tests do I need while on these medicines, and how often?",
        "Which side effects should make me call you?",
        "Which vaccinations should I have?",
        "What should I do if I am planning a pregnancy?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is rheumatoid arthritis the same as osteoarthritis?",
      a: "No. Rheumatoid arthritis is an autoimmune disease in which the immune system attacks the joint lining, and it needs medicines that calm the immune system. Osteoarthritis is a slow change in the joint itself and is treated mainly with exercise, weight control and pain relief.",
    },
    {
      q: "Is methotrexate a cancer drug?",
      a: "Methotrexate is also used in cancer, but at much higher strength. In rheumatoid arthritis it is given at a low dose, usually once a week, and is one of the most widely used and well-studied treatments. Regular blood tests keep it safe.",
    },
    {
      q: "My rheumatoid factor is positive. Do I have RA?",
      a: "Not necessarily. Rheumatoid factor can be positive in healthy people, older adults and people with other conditions, and it can be negative in people with RA. The diagnosis depends on the pattern of joint swelling and the full set of tests, which is why a rheumatologist should interpret it.",
    },
    {
      q: "Will I need to take medicines for life?",
      a: "Most people need long-term treatment to keep RA under control. When the disease has been in remission for a long time, some people can reduce their medicines under close supervision. Never cut down or stop on your own, because flares can cause lasting joint damage.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Rheumatoid Arthritis", url: "https://medlineplus.gov/rheumatoidarthritis.html" },
    { label: "World Health Organization — Rheumatoid arthritis fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/rheumatoid-arthritis" },
  ],
};
