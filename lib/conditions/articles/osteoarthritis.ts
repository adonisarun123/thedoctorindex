import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "osteoarthritis",
  title: "Osteoarthritis: symptoms, tests, treatment and which doctor to see",
  metaTitle: "Osteoarthritis: symptoms, treatment and which doctor to see",
  standfirst: "What osteoarthritis is, why knees and hips are most affected, how it is diagnosed, what helps the pain, and when to see an orthopaedic surgeon.",
  targetQuery: "osteoarthritis knee symptoms and treatment",
  department: "rheumatology",
  specialty: "orthopaedics",
  alsoSee: ["rheumatology", "physiotherapy"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Joint pain", "Stiffness", "Swelling", "Grating or cracking sensation", "Reduced movement"],
  tests: ["Physical examination", "X-ray", "Blood tests"],
  treatments: ["Exercise and physiotherapy", "Weight loss", "Pain relievers", "Joint injections", "Joint replacement"],
  body: [
    { k: "h2", text: "What osteoarthritis is" },
    {
      k: "p",
      text: "Osteoarthritis is the most common form of arthritis. It affects the whole joint: the smooth cartilage that covers the ends of the bones gradually thins and roughens, the bone underneath thickens and can form small bony outgrowths called spurs, and the lining and surrounding tissues become irritated. The result is pain and stiffness that tend to build up slowly over years.",
    },
    {
      k: "p",
      text: "It is often called wear-and-tear arthritis, but that description is not quite right. Osteoarthritis is an active process in which the joint is constantly trying to repair itself, and how much it hurts does not always match what an X-ray shows. It most often affects the knees, hips, hands, neck and lower back.",
    },
    {
      k: "p",
      text: "It is different from rheumatoid arthritis, in which the immune system attacks the lining of the joints. That condition usually affects many small joints on both sides of the body and needs different treatment.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Symptoms usually come on gradually and may come and go. The common ones are:" },
    {
      k: "ul",
      items: [
        "Joint pain that is worse with use — walking, climbing stairs or getting up from the floor — and eases with rest",
        "Stiffness in the morning or after sitting, which usually loosens within half an hour",
        "Swelling around the joint, sometimes after a busy day",
        "A grating or cracking sensation when the joint moves",
        "Reduced movement, so that bending the knee fully or sitting cross-legged becomes difficult",
        "A feeling that the knee is giving way, or bony knobs on the finger joints",
      ],
    },
    {
      k: "p",
      text: "Many people find that kneeling, squatting, sitting on the floor and using an Indian-style toilet become hard first. These are useful details to tell the doctor, because they show how the condition is affecting daily life.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    { k: "p", text: "There is rarely a single cause. Several factors add up:" },
    {
      k: "ul",
      items: [
        "Age — it becomes more common from middle age onwards",
        "Being a woman, particularly after menopause",
        "Extra body weight, which loads the knees and hips and also affects joints through inflammation",
        "An old joint injury, such as a ligament or meniscus tear, or a fracture near a joint",
        "Bow legs or knock knees, which put more load on one side of the knee",
        "Work or sport involving repeated heavy kneeling, squatting or lifting",
        "A family history of osteoarthritis",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The diagnosis is usually made from your symptoms and a **physical examination**. The doctor will look at how you walk, check the joint for swelling, tenderness, grating and range of movement, and look at the alignment of your legs.",
    },
    {
      k: "p",
      text: "An **X-ray** can show narrowing of the joint space and bone spurs, and is useful when surgery is being considered or the diagnosis is uncertain. It does not always need to be done straight away. **Blood tests** cannot show osteoarthritis, but the doctor may order them to rule out other causes such as rheumatoid arthritis or gout. An MRI is seldom needed unless a different problem, such as a torn meniscus, is suspected.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A general physician can assess joint pain and start treatment. An [orthopaedic surgeon](/specialties/orthopaedics) is usually the next step for knee and hip osteoarthritis, and is the doctor who decides whether surgery would help. A [rheumatologist](/specialties/rheumatology) is the right choice when the pattern is unusual, many joints are involved, or an inflammatory arthritis needs to be ruled out.",
    },
    {
      k: "p",
      text: "[Physiotherapists](/specialties/physiotherapy) are allied-health professionals rather than doctors, but they are central to osteoarthritis care: they design and supervise the exercises that make the biggest difference. You can [find orthopaedic surgeons in Bengaluru](/doctors/karnataka/bengaluru/orthopaedic-surgeons), [rheumatologists](/doctors/karnataka/bengaluru/rheumatologists) and [physiotherapists](/doctors/karnataka/bengaluru/physiotherapists) on The Doctor Index.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "There is no treatment that regrows lost cartilage, but most people can reduce pain and stay active. Treatment is built in steps, and the first steps remain important even if later ones are needed.",
    },
    { k: "h3", text: "Exercise and physiotherapy" },
    {
      k: "p",
      text: "**Exercise and physiotherapy** are the foundation. Strengthening the muscles around the joint, especially the thigh muscles for the knee, takes load off the cartilage. Walking, cycling and water exercise keep joints moving. It is normal to feel some discomfort at first; a physiotherapist can set a level that is safe and gradually build it up.",
    },
    { k: "h3", text: "Weight loss" },
    {
      k: "p",
      text: "If you carry extra weight, **weight loss** reduces the load on knees and hips with every step and often eases pain noticeably. Even a modest loss can help.",
    },
    { k: "h3", text: "Medicines and injections" },
    {
      k: "p",
      text: "**Pain relievers** include anti-inflammatory gels rubbed on the joint, paracetamol, and anti-inflammatory tablets for short periods. Anti-inflammatory tablets can affect the stomach, kidneys and heart, so do not take them regularly without a doctor's advice, particularly if you are older or have other conditions. **Joint injections** of a steroid can relieve a bad flare for a while. Other injections are offered by some doctors; the evidence for them is mixed, and your doctor will decide based on your joint and symptoms. Supplements such as glucosamine have not been shown to help most people.",
    },
    { k: "h3", text: "Surgery" },
    {
      k: "p",
      text: "**Joint replacement** of the knee or hip is considered when pain and disability remain severe despite the steps above. It is a planned operation, and the decision depends on how much the condition limits your life, not on the X-ray alone. Keyhole washout of the knee is not usually recommended for osteoarthritis.",
    },
    {
      k: "p",
      text: "Walking sticks, supportive footwear and knee braces can help in daily life. Be wary of any clinic that promises to reverse osteoarthritis or regrow cartilage.",
    },

    { k: "h2", text: "Living with osteoarthritis" },
    {
      k: "p",
      text: "Osteoarthritis often has good and bad spells. Keep active on most days, pace heavier tasks, and use a chair or a western-style toilet if squatting is painful. Raising the height of a bed or chair can make standing up easier. Review your treatment with your doctor if pain is getting worse, if you are relying on painkillers, or if you are falling.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Osteoarthritis itself is not an emergency. Call 112 or 108, or go to an emergency department, for:" },
    {
      k: "ul",
      items: [
        "A hot, red, very swollen joint with fever — this can be a joint infection",
        "A fall followed by being unable to stand or put weight on the leg",
        "Sudden calf pain and swelling, especially after joint surgery",
        "Chest pain or breathlessness after joint surgery",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is this osteoarthritis, or could it be another type of arthritis?",
        "Do I need an X-ray or any other test?",
        "Which exercises should I do, and should I see a physiotherapist?",
        "Which pain relievers are safe for me, and for how long?",
        "Would an injection help, and what is the evidence for it?",
        "At what point would joint replacement be worth discussing?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can osteoarthritis be reversed?",
      a: "No treatment has been shown to regrow worn cartilage. However, exercise, weight loss and good pain control can reduce symptoms a great deal, and many people with osteoarthritis on an X-ray have little pain once these are in place.",
    },
    {
      q: "Should I stop walking if my knees hurt?",
      a: "Usually not. Rest during a flare is fine, but regular movement keeps the joint healthier and the muscles stronger. If walking is too painful, a physiotherapist can suggest other forms of exercise, such as cycling or water exercise, that load the knee less.",
    },
    {
      q: "Is knee replacement my only option?",
      a: "No. Most people with knee osteoarthritis never need surgery. Replacement is considered when pain and loss of function remain severe after a fair trial of exercise, weight management, medicines and other measures. Your orthopaedic surgeon will discuss the likely benefits and risks for you.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Osteoarthritis", url: "https://medlineplus.gov/osteoarthritis.html" },
    { label: "World Health Organization — Osteoarthritis fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/osteoarthritis" },
  ],
};
