import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "chronic-pain",
  title: "Chronic pain: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Chronic pain: causes, treatment and which doctor to see",
  standfirst: "What chronic pain is, why it can continue after an injury heals, how it is assessed, the treatments that help, and which pain specialist to see.",
  targetQuery: "chronic pain treatment",
  department: "neurology",
  specialty: "general-practice",
  alsoSee: ["anaesthesiology", "neurology", "physical-medicine-rehabilitation", "clinical-psychology"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Persistent pain", "Fatigue", "Poor sleep", "Low mood", "Stiffness"],
  tests: ["Physical examination", "Blood tests", "X-ray", "MRI"],
  treatments: ["Physiotherapy", "Pain-relieving medicines", "Cognitive behavioural therapy", "Nerve blocks", "Graded activity"],
  body: [
    { k: "h2", text: "What chronic pain is" },
    {
      k: "p",
      text: "Pain is the nervous system's alarm. Acute pain — from a cut, a sprain or an operation — is a useful warning that fades as the body heals. Chronic pain is pain that lasts three months or longer, or that carries on after the original injury should have healed. At that point the alarm itself has often become part of the problem: the nerves, spinal cord and brain can become more sensitive, so that pain signals are amplified and keep firing.",
    },
    {
      k: "p",
      text: "Chronic pain is not a single disease. It is a long-term problem that can arise from many conditions, and it can affect almost any part of the body — the lower back, neck, joints, head, abdomen, pelvis or nerves in the feet. It is common, especially in older adults and in women, and some people live with more than one type at once.",
    },
    {
      k: "p",
      text: "Pain that you cannot see on a scan is still real. Two people with the same X-ray can have very different pain, because how much it hurts depends on the nervous system as well as on the tissues. Understanding this is often the first step to getting better help.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Chronic pain may be constant or come and go. People describe it as aching, burning, shooting, stabbing, throbbing or like pins and needles. Alongside the pain itself, many people notice:",
    },
    {
      k: "ul",
      items: [
        "Persistent pain that limits work, housework, walking or sleep",
        "Stiffness and reduced movement in the affected area",
        "Fatigue, partly from the pain and partly from poor sleep",
        "Poor sleep, which in turn makes pain harder to cope with",
        "Low mood, irritability, worry or a feeling of hopelessness",
        "Difficulty concentrating and remembering",
      ],
    },
    {
      k: "p",
      text: "These effects feed one another. Pain disturbs sleep, tiredness lowers the pain threshold, and stress or [depression](/conditions/depression) make pain feel worse. Good treatment usually tackles several parts of this cycle together.",
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "Sometimes chronic pain begins with an injury, an operation or an infection such as [shingles](/conditions/shingles). Sometimes there is an ongoing cause. Common ones include:",
    },
    {
      k: "ul",
      items: [
        "Back and neck problems, including disc and spine conditions",
        "Arthritis, such as [osteoarthritis](/conditions/osteoarthritis) of the knees and hips",
        "Nerve damage, for example from diabetes — see [diabetic nerve problems](/conditions/diabetic-nerve-problems)",
        "Headache disorders such as migraine",
        "[Fibromyalgia](/conditions/fibromyalgia), which causes widespread pain and tiredness",
        "Cancer and its treatment",
        "Long-standing pelvic or abdominal pain conditions",
      ],
    },
    {
      k: "p",
      text: "In some people no single cause is found. Factors that make chronic pain more likely or harder to shift include older age, previous injury, physically demanding work, long hours sitting without breaks, smoking, being overweight, poor sleep, and stress, anxiety or depression.",
    },

    { k: "h2", text: "How it is assessed" },
    {
      k: "p",
      text: "The doctor's aim is twofold: to find any cause that needs specific treatment, and to understand how the pain is affecting your life. Expect to be asked where it hurts, what it feels like, what makes it better or worse, how it affects your sleep, work and mood, and what you have already tried. A **physical examination** checks movement, strength, sensation and reflexes.",
    },
    {
      k: "p",
      text: "Depending on what is found, your doctor may order **blood tests** (for example for inflammation, diabetes, thyroid problems or vitamin deficiencies), an **X-ray**, an **MRI** or nerve tests. Scans are useful when they can change treatment, but they often show age-related changes that are not the cause of the pain. Repeating scans without a clear reason rarely helps and can add worry.",
    },
    {
      k: "p",
      text: "Keeping a simple pain diary for a week or two — when the pain is worse, what you were doing, how you slept — can make the appointment much more productive.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Chronic pain is not always fully curable, but most people can reduce it and get back more of their life. The most effective plans combine several approaches rather than relying on tablets alone.",
    },
    { k: "h3", text: "Physical treatment and graded activity" },
    {
      k: "p",
      text: "**Physiotherapy** builds strength, flexibility and confidence in movement. **Graded activity** means increasing what you do in small, planned steps — walking a little further each week, for example — rather than doing too much on good days and then crashing. Regular gentle exercise such as walking, swimming, yoga or stretching is one of the most consistently helpful treatments for many pain conditions, even though it can feel counter-intuitive at first.",
    },
    { k: "h3", text: "Pain-relieving medicines" },
    {
      k: "p",
      text: "**Pain-relieving medicines** have a place, but their role is usually smaller in chronic pain than in acute pain. Depending on the type of pain, your doctor may suggest simple painkillers, anti-inflammatory medicines, or medicines originally developed for depression or epilepsy that calm overactive nerves. Strong opioid painkillers are generally not recommended for long-term use in most chronic pain because benefits often fade while risks such as dependence grow. Avoid buying painkillers over the counter for months on end: some can damage the stomach, kidneys or liver, and frequent use of headache tablets can itself cause daily headaches.",
    },
    { k: "h3", text: "Psychological approaches" },
    {
      k: "p",
      text: "**Cognitive behavioural therapy** (CBT) and related talking therapies help people change how they respond to pain, pace activity, manage stress and sleep better. Being referred to a psychologist does not mean the doctor thinks the pain is 'in your head'; it is a standard part of modern pain care. Relaxation, breathing techniques and mindfulness can also help some people.",
    },
    { k: "h3", text: "Procedures" },
    {
      k: "p",
      text: "For some specific pain problems, a pain specialist may offer injections such as **nerve blocks**, which numb or calm a particular nerve, or other targeted procedures. Surgery helps when there is a clear, correctable cause, such as a badly worn joint or a nerve trapped by a disc. Your doctor can explain whether you are likely to benefit and what the risks are.",
    },
    {
      k: "p",
      text: "Many people also try acupuncture, massage or traditional therapies. Some find these helpful as additions, but tell your doctor about anything you are taking, as some herbal or unlabelled products can contain hidden steroids or painkillers.",
    },

    { k: "h2", text: "Living with chronic pain" },
    {
      k: "ul",
      items: [
        "Set small, realistic goals that matter to you — such as walking to the temple or market, or playing with grandchildren — and build up to them",
        "Keep a regular sleep routine and limit tea, coffee and screens late in the evening",
        "Plan your day so heavy tasks are spread out, with short breaks",
        "Stay connected with family and friends; isolation tends to make pain worse",
        "Avoid smoking and drinking alcohol to cope with pain",
        "Ask for help early if your mood is low or you feel you cannot cope",
      ],
    },

    { k: "h2", text: "When to seek urgent help" },
    {
      k: "p",
      text: "Long-standing pain that changes suddenly needs prompt review. Call 112 or 108, or go to the nearest emergency department, if you have:",
    },
    {
      k: "ul",
      items: [
        "New back pain with numbness around the genitals or buttocks, loss of bladder or bowel control, or weakness in both legs",
        "Sudden severe headache, or headache with fever, stiff neck, confusion or weakness",
        "Chest pain, or pain with breathlessness, sweating or fainting",
        "Severe abdominal pain with vomiting, fever or a rigid abdomen",
        "Thoughts of harming yourself or of ending your life",
      ],
    },
    {
      k: "p",
      text: "If pain is wearing you down and you are struggling emotionally but not in immediate danger, you can also call Tele-MANAS on 14416, India's national mental health helpline. See a doctor soon, rather than as an emergency, for pain with unexplained weight loss, fever, night sweats, a history of cancer, or pain that wakes you every night.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Start with a [general physician](/specialties/general-practice), who can look for a cause and coordinate care. Depending on the source of the pain, you may then see a [neurologist](/specialties/neurology) for nerve pain or headache, an [orthopaedic surgeon](/specialties/orthopaedics) for joint and spine problems, or a [rheumatologist](/specialties/rheumatology) for inflammatory or widespread pain. In India, many pain clinics are led by [anaesthesiologists](/specialties/anaesthesiology) trained in pain medicine, and a [rehabilitation physician](/specialties/physical-medicine-rehabilitation) or [clinical psychologist](/specialties/clinical-psychology) often forms part of the team.",
    },
    {
      k: "p",
      text: "You can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists), [anaesthesiologists in Bengaluru](/doctors/karnataka/bengaluru/anaesthesiologists) or [rehabilitation physicians in Bengaluru](/doctors/karnataka/bengaluru/rehabilitation-physicians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What do you think is driving my pain, and is there anything that needs a specific treatment?",
        "Do I need any more tests, and how would they change what we do?",
        "What can I do myself, starting this week?",
        "Which medicines are worth trying, and how long until we judge whether they work?",
        "Would physiotherapy, a psychologist or a pain clinic help me?",
      ],
    },
  ],
  faqs: [
    {
      q: "Why does my pain continue when my scans are normal?",
      a: "In chronic pain the nervous system often becomes over-sensitive, so it keeps sending pain signals even when tissues have healed. Normal scans can be reassuring because they rule out serious damage, and treatment can still reduce the pain.",
    },
    {
      q: "Should I rest until the pain goes away?",
      a: "Short rest can help a fresh injury, but long rest usually makes chronic pain worse by weakening muscles and stiffening joints. Gradually increasing gentle activity, with guidance from a physiotherapist, is usually more helpful.",
    },
    {
      q: "What is a pain clinic?",
      a: "A pain clinic is a service focused on long-term pain, often led by an anaesthesiologist with pain training and supported by physiotherapists and psychologists. It offers assessment, medicine review, procedures such as nerve blocks, and self-management programmes.",
    },
    {
      q: "Can stress make pain worse?",
      a: "Yes. Stress, anxiety and low mood change how the brain processes pain signals and disturb sleep, which lowers pain tolerance. Treating stress and mood is a recognised part of managing chronic pain, not a sign the pain is imaginary.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Chronic Pain", url: "https://medlineplus.gov/chronicpain.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
