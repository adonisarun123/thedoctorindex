import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "arthritis",
  title: "Arthritis: symptoms, types, treatment and which doctor to see",
  metaTitle: "Arthritis: symptoms, types, treatment and the doctor to see",
  standfirst: "What arthritis means, the main types, the warning signs, how it is diagnosed and treated, and when to see a rheumatologist or orthopaedic surgeon.",
  targetQuery: "arthritis symptoms and treatment",
  department: "rheumatology",
  specialty: "rheumatology",
  alsoSee: ["orthopaedics", "general-practice", "physiotherapy"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Joint pain", "Swelling", "Stiffness", "Reduced movement"],
  tests: ["Blood tests", "X-ray", "Joint fluid test"],
  treatments: ["Exercise and physiotherapy", "Pain relief", "Disease-modifying medicines", "Joint replacement"],
  body: [
    { k: "h2", text: "What arthritis is" },
    {
      k: "p",
      text: "Arthritis is not one disease. It is a word for pain, swelling or damage in a joint — the place where two bones meet, such as the knee, hip, wrist or the small joints of the fingers. There are many kinds of arthritis, and they behave very differently. Some come from years of wear on the cartilage that cushions the ends of the bones. Others happen because the immune system attacks the lining of the joint by mistake. A few are caused by crystals or by infection.",
    },
    {
      k: "p",
      text: "This matters because the treatment depends on the type. Knee pain in a sixty-year-old and swollen finger joints in a thirty-year-old woman may both be called arthritis at home, but they need different tests, different medicines and often a different doctor. Getting the type right early can protect the joints from lasting damage.",
    },

    { k: "h2", text: "The main types" },
    {
      k: "ul",
      items: [
        "**[Osteoarthritis](/conditions/osteoarthritis)** — the commonest type. The cartilage thins over time, often in the knees, hips, hands and spine. It is linked to age, past injury and extra body weight.",
        "**[Rheumatoid arthritis](/conditions/rheumatoid-arthritis)** — an autoimmune arthritis. It usually affects the small joints of the hands and feet on both sides, with morning stiffness that lasts a long time.",
        "**[Gout](/conditions/gout)** — sudden, very painful attacks caused by uric acid crystals, often starting in the big toe.",
        "**[Psoriatic arthritis](/conditions/psoriatic-arthritis)** — arthritis in some people who have the skin condition psoriasis.",
        "**Ankylosing spondylitis** — inflammation mainly of the spine and the joints of the pelvis, often starting in young adults as back pain and stiffness that improves with movement.",
        "**[Juvenile arthritis](/conditions/juvenile-arthritis)** — arthritis that starts in childhood.",
        "**Infectious (septic) arthritis** — a joint infected by germs. It is uncommon but urgent.",
        "**Reactive arthritis** — joint inflammation that follows an infection elsewhere in the body, such as in the gut or urinary tract.",
      ],
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "The common symptoms across most types are:" },
    {
      k: "ul",
      items: [
        "Joint pain, which may be worse with use (typical of wear-and-tear arthritis) or worse after rest (typical of inflammatory arthritis)",
        "Swelling of the joint, sometimes with warmth or redness",
        "Stiffness, especially in the morning or after sitting for a while",
        "Reduced movement — difficulty bending the knee fully, making a fist, squatting or climbing stairs",
      ],
    },
    {
      k: "p",
      text: "Some types affect more than the joints. Inflammatory arthritis can come with tiredness, low-grade fever, weight loss, a rash, dry or red eyes, or mouth ulcers. Pain that wakes you at night, stiffness that lasts more than about an hour every morning, or swelling of several joints at once points towards an inflammatory type and should be checked sooner rather than later.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "Different types have different causes, but a few things raise the risk of arthritis in general:",
    },
    {
      k: "ul",
      items: [
        "Age — wear-and-tear arthritis becomes more common as people grow older",
        "Family history — rheumatoid arthritis, ankylosing spondylitis and gout can run in families",
        "Sex — rheumatoid arthritis and lupus are more common in women; gout is more common in men",
        "Extra body weight, which puts more load on the knees and hips",
        "A past joint injury, such as a sports injury or fracture near a joint",
        "Work that involves heavy lifting, kneeling or squatting for long hours",
        "Other illnesses such as psoriasis, lupus or inflammatory bowel disease",
      ],
    },
    {
      k: "p",
      text: "In India, knee pain from osteoarthritis is a very common reason for older adults to see a doctor, and daily habits like squatting, sitting cross-legged on the floor and using Indian-style toilets can become hard. These habits do not by themselves cause arthritis, but they are often the first things that become painful.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The doctor will ask which joints hurt, when the pain started, how long morning stiffness lasts, and about skin problems, eye problems, bowel symptoms and family history. Examining the joints often tells the doctor more than any single test. Depending on what they find, they may suggest:",
    },
    {
      k: "ul",
      items: [
        "**Blood tests** — markers of inflammation, and specific antibodies such as rheumatoid factor and anti-CCP for rheumatoid arthritis, or uric acid for gout. A positive antibody test alone does not mean you have arthritis, and a normal result does not rule it out.",
        "**X-ray** — shows narrowing of the joint space and bone changes in long-standing arthritis, though early inflammatory arthritis may look normal.",
        "**Ultrasound or MRI** — can show inflammation of the joint lining earlier than an X-ray.",
        "**Joint fluid test** — fluid drawn from a swollen joint with a needle and checked for crystals or infection. This is essential when septic arthritis is possible.",
      ],
    },
    {
      k: "p",
      text: "Avoid ordering a large panel of arthritis blood tests on your own. Many healthy people have mildly positive results, which can cause worry and wrong treatment. Tests are most useful when chosen by a doctor who has examined you.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Most kinds of arthritis cannot be cured, but treatment can control pain, keep joints moving and, in inflammatory arthritis, prevent damage. The plan depends on the type.",
    },
    { k: "h3", text: "For almost everyone" },
    {
      k: "p",
      text: "**Exercise and physiotherapy** are the foundation. Strengthening the muscles around a joint — the thigh muscles for knee arthritis, for example — takes load off the joint and often reduces pain more than people expect. A physiotherapist can design a programme that suits your joints. Losing extra weight helps knee and hip arthritis. Hot or cold packs, splints or braces, a walking stick on the opposite side to a painful hip or knee, and a Western-style toilet or raised seat can all make daily life easier.",
    },
    {
      k: "p",
      text: "**Pain relief** may include paracetamol, anti-inflammatory gels rubbed on the joint, or anti-inflammatory tablets for short periods. Anti-inflammatory tablets can harm the stomach, kidneys and heart in some people, so do not take them regularly from a chemist without a doctor's advice, especially if you are older or have kidney disease, high blood pressure or a past stomach ulcer.",
    },
    { k: "h3", text: "For inflammatory arthritis" },
    {
      k: "p",
      text: "Rheumatoid arthritis, psoriatic arthritis and similar conditions are treated with **disease-modifying medicines**, which calm the immune system and slow or stop joint damage. They are usually started as early as possible. Newer biological and targeted medicines are used when standard ones are not enough. These medicines need regular blood tests, and some lower resistance to infection, so they are prescribed and monitored by a rheumatologist. Steroid tablets or injections into a joint may be used to settle a flare quickly.",
    },
    { k: "h3", text: "For gout and infection" },
    {
      k: "p",
      text: "Gout attacks are treated with anti-inflammatory medicines, and people with repeated attacks may need long-term medicine to lower uric acid. Septic arthritis needs hospital treatment with antibiotics and often draining of the joint.",
    },
    { k: "h3", text: "Surgery" },
    {
      k: "p",
      text: "When a hip or knee is badly damaged and pain stops you walking or sleeping despite other treatment, an orthopaedic surgeon may discuss **joint replacement**. Other operations can repair or realign joints in selected cases.",
    },
    {
      k: "note",
      tone: "alert",
      title: "Be careful with unproven treatments",
      text: "Many oils, powders and injections are sold as arthritis remedies. Unlabelled tablets or powders sold for joint pain may contain undeclared steroids, which can cause serious harm when taken for months. Tell your doctor about everything you take.",
    },

    { k: "h2", text: "Living with arthritis" },
    {
      k: "ul",
      items: [
        "Keep moving: walking, cycling, swimming and gentle strengthening are usually safe; pain during exercise that settles within a day or so is not a sign of harm",
        "Pace your day and rest a flaring joint, but avoid long periods of inactivity",
        "Wear comfortable, supportive footwear",
        "Keep a symptom diary of flares, swelling and what helps — it makes follow-up visits more useful",
        "If you take disease-modifying medicines, keep blood-test appointments and ask which vaccines you should have",
        "Look after mood and sleep; long-term pain often affects both, and both can be helped",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "p",
      text: "Go to a hospital the same day, or call 112 or 108, if a single joint suddenly becomes hot, red, very swollen and too painful to move, especially with fever or chills. This can be septic arthritis, which can destroy a joint within days. Also seek urgent help for a joint that is badly swollen after an injury, or if you take medicines that lower immunity and develop a fever.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can assess most joint pain first. A [rheumatologist](/specialties/rheumatology) specialises in inflammatory and autoimmune arthritis and in gout that is hard to control — see one if you have several swollen joints, long morning stiffness, a positive antibody test, or arthritis with skin, eye or bowel symptoms. An [orthopaedic surgeon](/specialties/orthopaedics) deals with joint injuries, advanced osteoarthritis and joint replacement, and a [physiotherapist](/specialties/physiotherapy) helps with exercise and function for almost every type. Children with joint swelling should see a [paediatrician](/specialties/paediatrics).",
    },
    {
      k: "p",
      text: "You can [find rheumatologists in Bengaluru](/doctors/karnataka/bengaluru/rheumatologists) or [orthopaedic surgeons in Bengaluru](/doctors/karnataka/bengaluru/orthopaedic-surgeons) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Which type of arthritis do I have, and how sure are we?",
        "Is this inflammatory, and is there a risk of joint damage if we wait?",
        "Which exercises are safe for me, and should I see a physiotherapist?",
        "What are the side effects of my medicines, and what monitoring do they need?",
        "Which symptoms mean I should come back early?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is arthritis only a disease of old age?",
      a: "No. Osteoarthritis is more common with age, but rheumatoid arthritis often starts between young adulthood and middle age, ankylosing spondylitis usually begins in the late teens or twenties, and children can get juvenile arthritis. Joint swelling at any age deserves a proper check.",
    },
    {
      q: "Does eating curd, rice or sour food make arthritis worse?",
      a: "There is no good evidence that curd, rice or sour foods cause arthritis or flares in most types. Gout is the exception where diet matters: alcohol, sugary drinks and large amounts of meat and seafood can trigger attacks. A balanced diet that helps keep a healthy weight is useful for everyone.",
    },
    {
      q: "Will I need a knee replacement?",
      a: "Most people with knee osteoarthritis never need surgery. Exercise, weight loss, physiotherapy and pain relief control symptoms for many years. Replacement is considered when the joint is badly damaged and pain seriously limits walking or sleep despite these measures.",
    },
    {
      q: "Are rheumatoid arthritis medicines dangerous to take long term?",
      a: "Disease-modifying medicines do have side effects, which is why they need regular blood tests and review. For most people the risk of uncontrolled inflammation, which permanently damages joints, is greater. Your rheumatologist will weigh the benefits and risks with you.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Arthritis", url: "https://medlineplus.gov/arthritis.html" },
    { label: "Emergency Response Support System, Government of India — 112", url: "https://112.gov.in/" },
  ],
};
