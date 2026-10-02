import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "ankylosing-spondylitis",
  title: "Ankylosing spondylitis: inflammatory back pain, tests and treatment",
  metaTitle: "Ankylosing spondylitis: symptoms, tests and treatment",
  standfirst: "How ankylosing spondylitis differs from ordinary back pain, the tests a rheumatologist uses, how exercise and medicines control it, and what to watch for.",
  targetQuery: "ankylosing spondylitis symptoms and treatment",
  department: "rheumatology",
  specialty: "rheumatology",
  alsoSee: ["physiotherapy"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Inflammatory back pain", "Morning stiffness", "Buttock pain", "Heel pain", "Tiredness", "Red painful eye"],
  tests: ["HLA-B27", "ESR", "CRP", "X-ray", "MRI"],
  treatments: ["Exercise", "Physiotherapy", "Anti-inflammatory medicines", "Biologic medicines"],
  body: [
    { k: "h2", text: "What ankylosing spondylitis is" },
    {
      k: "p",
      text: "Ankylosing spondylitis (AS) is a long-term inflammatory condition that mainly affects the spine and the sacroiliac joints, where the spine meets the pelvis. It belongs to a group called axial spondyloarthritis. The immune system causes inflammation where ligaments and tendons attach to bone.",
    },
    {
      k: "p",
      text: "Over time, the body can respond to this inflammation by forming new bone, and in some people sections of the spine gradually fuse, reducing flexibility. Not everyone reaches this stage, and modern treatment, regular exercise and early diagnosis help keep the spine moving.",
    },
    {
      k: "p",
      text: "AS usually starts in the late teens or twenties, and the diagnosis is often delayed for years because it is mistaken for ordinary back strain. Recognising the pattern of inflammatory back pain is the key.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Inflammatory back pain — lower back pain that comes on gradually, lasts more than a few months, and starts before middle age",
        "Morning stiffness that lasts a long time and improves with exercise rather than rest",
        "Back pain that wakes you in the second half of the night",
        "Buttock pain that may switch from side to side",
        "Heel pain, or pain where tendons attach, such as at the back of the heel or under the foot",
        "Pain and swelling in other joints such as hips, knees or ankles",
        "Tiredness, often significant",
        "A red painful eye with blurred vision and sensitivity to light (uveitis)",
      ],
    },
    {
      k: "p",
      text: "AS can also be linked to psoriasis and inflammatory bowel disease. Mention any skin, bowel or eye problems to your doctor.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "The exact cause is unknown, but genes play a large part. Many people with AS carry a gene variant called HLA-B27, although most people with this gene never develop the condition. Risk is higher with:",
    },
    {
      k: "ul",
      items: [
        "A family history of AS, psoriasis or inflammatory bowel disease",
        "Being male, although women are affected too and are more often missed",
        "Being a young adult when symptoms start",
        "Smoking, which is linked to more severe disease",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "No single test confirms AS. A rheumatologist combines your history, an examination of spinal movement, chest expansion and joints, and tests:",
    },
    {
      k: "ul",
      items: [
        "**HLA-B27** — a blood test for the gene variant; a positive result supports the diagnosis but does not prove it, and a negative result does not rule it out",
        "**ESR** and **CRP** — blood tests for inflammation, which can be normal even in active disease",
        "**X-ray** of the pelvis — shows changes in the sacroiliac joints, but these may take years to appear",
        "**MRI** of the sacroiliac joints and spine — can show early inflammation before X-ray changes",
      ],
    },
    {
      k: "p",
      text: "Doctors may also check for tuberculosis and hepatitis before starting some medicines, because these infections can reactivate with treatment.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "If you are under middle age with back pain that has lasted several months and has the inflammatory pattern above, ask your general physician about seeing a [rheumatologist](/specialties/rheumatology). A rheumatologist diagnoses AS and manages long-term treatment.",
    },
    {
      k: "p",
      text: "[Physiotherapists](/specialties/physiotherapy), who are allied-health professionals, are central to care. An ophthalmologist treats eye inflammation. You can [find rheumatologists in Bengaluru](/doctors/karnataka/bengaluru/rheumatologists) and [physiotherapists](/doctors/karnataka/bengaluru/physiotherapists) on The Doctor Index.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "There is no cure, but treatment can relieve pain and stiffness, keep the spine flexible and maintain good posture.",
    },
    { k: "h3", text: "Exercise and physiotherapy" },
    {
      k: "p",
      text: "Daily **exercise** is essential: stretching, posture and breathing exercises, and activities such as swimming and walking. **Physiotherapy** teaches a programme to maintain mobility and posture, and many people find group or supervised sessions help them keep it up. Exercise works best alongside medicines, not instead of them.",
    },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "**Anti-inflammatory medicines** (NSAIDs) are the first medicine for back pain and stiffness, and many people improve considerably with them. Your doctor will check for stomach, kidney and heart side effects with long-term use. If symptoms remain active despite these, **biologic medicines** that block TNF or IL-17, or newer targeted tablets, can greatly reduce symptoms. They need screening for infections first and regular monitoring.",
    },
    {
      k: "p",
      text: "Some medicines used for other types of arthritis, such as sulfasalazine, help joints in the arms and legs but not the spine. Steroid tablets are usually not used long term, though steroid injections may help a single painful joint or tendon.",
    },
    { k: "h3", text: "Surgery" },
    {
      k: "p",
      text: "Surgery is rarely needed. Hip replacement may help when a hip is badly damaged, and spinal surgery is reserved for severe deformity or fractures.",
    },

    { k: "h2", text: "Living with ankylosing spondylitis" },
    {
      k: "p",
      text: "Do your exercises every day, take breaks from sitting, and pay attention to posture at a desk and in bed. Stop smoking, which worsens AS and affects breathing. Keep up follow-up appointments and blood tests. AS increases the risk of weakened bones, so ask about bone health. A stiff spine is more prone to fractures, even after a minor fall. Many people with AS work, travel and live full lives; let your workplace know if you need adjustments.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "New neck or back pain after a fall or injury, even a minor one — a fused spine can break more easily",
        "New numbness, weakness, or loss of bladder or bowel control",
        "High fever or signs of serious infection while on biologic medicines",
        "Chest pain or sudden breathlessness",
      ],
    },
    {
      k: "p",
      text: "See an eye doctor the same day for a red, painful eye with blurred vision, as uveitis needs prompt treatment to protect sight.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "How sure are we that this is ankylosing spondylitis?",
        "Which exercises should I do every day?",
        "Which medicine should I start with, and how will we know if it works?",
        "When would a biologic medicine be considered?",
        "What should I do if my eye becomes red and painful?",
        "Do I need tests for bone strength?",
      ],
    },
  ],
  faqs: [
    {
      q: "How is ankylosing spondylitis different from ordinary back pain?",
      a: "Ordinary mechanical back pain usually gets worse with activity and better with rest. AS typically starts in young adults, comes on gradually, is worst in the morning or at night, and improves with exercise. It also tends to last for months rather than weeks.",
    },
    {
      q: "If I am HLA-B27 positive, will I get AS?",
      a: "Not necessarily. Many people carry HLA-B27 and never develop ankylosing spondylitis. The test is only one part of the picture. A rheumatologist makes the diagnosis by combining your symptoms, examination, blood tests and imaging.",
    },
    {
      q: "Will my spine become completely stiff?",
      a: "Not everyone develops spinal fusion, and with early diagnosis, regular exercise and modern medicines many people keep good movement. The course varies, so regular follow-up with your rheumatologist helps adjust treatment over time.",
    },
    {
      q: "Can I exercise or play sports with AS?",
      a: "Yes, and you should. Regular exercise is one of the most effective treatments. Swimming, walking, cycling and stretching are especially helpful. People with significant spinal fusion should avoid high-impact contact sports because of the risk of fractures.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Ankylosing Spondylitis", url: "https://medlineplus.gov/ankylosingspondylitis.html" },
    { label: "NHS — Ankylosing spondylitis", url: "https://www.nhs.uk/conditions/ankylosing-spondylitis/" },
  ],
};
