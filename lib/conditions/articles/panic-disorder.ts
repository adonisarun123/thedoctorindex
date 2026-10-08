import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "panic-disorder",
  title: "Panic disorder: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Panic disorder and panic attacks: symptoms and treatment",
  standfirst: "What panic attacks and panic disorder are, why they feel like a heart attack, how they are diagnosed, the treatments that work, and where to get help.",
  targetQuery: "panic attack symptoms and treatment",
  department: "psychiatry",
  specialty: "psychiatry",
  alsoSee: ["clinical-psychology", "general-practice"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Racing heartbeat", "Sweating", "Trembling", "Shortness of breath", "Chest pain", "Dizziness", "Fear of dying"],
  tests: ["Physical examination", "ECG", "Thyroid tests"],
  treatments: ["Cognitive behavioural therapy", "Antidepressants", "Anti-anxiety medicines", "Breathing techniques"],
  body: [
    { k: "h2", text: "What panic disorder is" },
    {
      k: "p",
      text: "A **panic attack** is a sudden wave of intense fear or discomfort, with strong physical symptoms, that comes on even though there is no real danger. It usually peaks within minutes. Many people have one or two panic attacks in their lives, often at a stressful time, and never have another.",
    },
    {
      k: "p",
      text: "**Panic disorder** is when panic attacks keep happening and a person starts to live in fear of the next one — worrying about it, changing routines, or avoiding places where an attack happened before. It is a type of [anxiety](/conditions/anxiety) disorder. It is not a sign of weakness or of 'imagining things'; the physical symptoms are real, produced by the body's normal fear response switching on when there is no danger. Panic disorder is not life-threatening, and it is very treatable.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "During a panic attack, a person may have several of these at once:" },
    {
      k: "ul",
      items: [
        "Racing heartbeat, pounding heart or palpitations",
        "Sweating, chills or hot flushes",
        "Trembling or shaking",
        "Shortness of breath, or a feeling of being smothered",
        "A choking feeling",
        "Chest pain or discomfort",
        "Dizziness, light-headedness or feeling faint",
        "Nausea or stomach upset",
        "Numbness or tingling in the hands, feet or around the mouth",
        "A sense of unreality, or of being detached from oneself",
        "Fear of losing control, 'going mad', or fear of dying",
      ],
    },
    {
      k: "p",
      text: "Attacks can strike at any time, even from sleep, and usually last a few minutes, though the after-effects and exhaustion can last longer. Between attacks, people with panic disorder often feel on edge, scan their bodies for symptoms, and may begin to avoid travelling, crowded places, driving or being alone.",
    },
    {
      k: "p",
      text: "Because the symptoms feel physical, many people first go to an emergency department or a cardiologist convinced they are having a heart attack. That is a sensible thing to do the first time; once a doctor has checked you and found no heart problem, panic disorder becomes a likely explanation.",
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "The exact cause is not known. It is thought to involve a mix of factors:",
    },
    {
      k: "ul",
      items: [
        "Genes — panic disorder can run in families",
        "Differences in how the brain handles fear and stress signals",
        "Major stress, such as a bereavement, exam pressure, job loss, relationship problems or a serious illness",
        "Trauma, especially in childhood",
      ],
    },
    {
      k: "p",
      text: "It often starts in the late teens or early adulthood and is more common in women. Heavy caffeine use, alcohol, and some drugs can trigger or worsen attacks. Panic disorder often occurs alongside [depression](/conditions/depression) or other anxiety problems, and without treatment some people turn to alcohol or other substances to cope.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "There is no single test for panic disorder. A doctor will ask about your attacks — what happens, how often, and how they affect your life — and about sleep, mood, stress, caffeine, alcohol and any medicines. Because some physical conditions can cause similar symptoms, your doctor may first check for them with:",
    },
    {
      k: "ul",
      items: [
        "A **physical examination**, including pulse and blood pressure",
        "An **ECG** to look at the heart's rhythm, and sometimes further heart tests",
        "**Thyroid tests**, as an overactive thyroid can cause palpitations and anxiety",
        "Other blood tests, such as blood sugar and haemoglobin, when relevant",
      ],
    },
    {
      k: "p",
      text: "A psychiatrist or clinical psychologist can then make the diagnosis through a careful conversation, sometimes using standard questionnaires. Being told your heart is normal is not the same as being told 'nothing is wrong' — it is the first step to the right treatment.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Most people with panic disorder improve a great deal with treatment. The main options, often used together, are:",
    },
    {
      k: "ul",
      items: [
        "**Cognitive behavioural therapy** (CBT) — a structured talking therapy that helps you understand the cycle of panic, change frightening thoughts about bodily sensations, and gradually face situations you have been avoiding. It is one of the most effective treatments for panic disorder.",
        "**Antidepressants**, mainly of the SSRI or SNRI types, which reduce how often and how strongly attacks occur. They take a few weeks to work and should be stopped only gradually, with your doctor's guidance.",
        "**Anti-anxiety medicines**, sometimes used for a short time while other treatment takes effect. Some carry a risk of dependence, so they should be taken only as prescribed and not for long periods without review.",
      ],
    },
    {
      k: "p",
      text: "Your doctor will help you choose based on your symptoms, other health conditions, pregnancy plans and preferences. Do not buy anti-anxiety tablets without a prescription or take someone else's.",
    },

    { k: "h2", text: "Coping with an attack and living well" },
    {
      k: "ul",
      items: [
        "**Breathing techniques**: breathe in slowly through the nose, pause, and breathe out even more slowly through the mouth. Slowing the out-breath calms the body's alarm response.",
        "Remind yourself that the attack will peak and pass, and that it is frightening but not dangerous",
        "Stay where you are if it is safe, rather than escaping; leaving can teach the brain that the place was dangerous",
        "Cut down on tea, coffee, energy drinks and cola, and avoid alcohol and recreational drugs",
        "Sleep regular hours, eat regular meals and stay physically active; yoga or relaxation practice can help some people alongside treatment",
        "Talk to family or friends, or join a support group, so you are not coping alone",
      ],
    },

    { k: "h2", text: "When to get urgent help" },
    {
      k: "p",
      text: "If you have chest pain or breathlessness for the first time, or symptoms that feel different from your usual attacks — especially if you are older, or have diabetes, high blood pressure or heart disease — call 112 or 108 or go to the nearest emergency department so that a [heart attack](/conditions/heart-attack) or other emergency can be ruled out.",
    },
    {
      k: "note",
      tone: "alert",
      title: "If you are thinking of harming yourself",
      text: "Thoughts of self-harm or suicide are an emergency. Call 112 or go to the nearest emergency department now. You can also call Tele-MANAS, India's national mental health helpline, on 14416 at any time to speak to a trained counsellor.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can check for physical causes and start treatment. A [psychiatrist](/specialties/psychiatry) diagnoses panic disorder, prescribes and monitors medicines, and manages severe or complex cases. A [clinical psychologist](/specialties/clinical-psychology) provides CBT and other talking therapies. Many people do best seeing both.",
    },
    {
      k: "p",
      text: "You can [find psychiatrists in Bengaluru](/doctors/karnataka/bengaluru/psychiatrists) or [clinical psychologists in Bengaluru](/doctors/karnataka/bengaluru/clinical-psychologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Have physical causes for my symptoms been ruled out?",
        "Would CBT, medicine or both suit me best?",
        "How long will treatment take before I notice a difference?",
        "What side effects should I watch for, and how will we stop the medicine later?",
        "What should I do during an attack, and when should I seek urgent help?",
      ],
    },
  ],
  faqs: [
    {
      q: "How can I tell a panic attack from a heart attack?",
      a: "You often cannot be sure on your own, because both can cause chest pain, breathlessness, sweating and fear. If it is your first episode, or it feels different from your usual attacks, call 112 or 108 or go to an emergency department. Once your heart has been checked, your doctor can help you recognise your pattern.",
    },
    {
      q: "Can a panic attack kill you or make you faint?",
      a: "A panic attack feels terrifying but is not dangerous in itself and does not damage the heart. Actually fainting during a panic attack is uncommon, though feeling faint is not. The symptoms peak and settle on their own, usually within minutes, even though it may not feel that way.",
    },
    {
      q: "Will I need to take medicine for life?",
      a: "Usually not. Many people take an antidepressant for some months after they feel well and then reduce it gradually with their doctor. CBT teaches skills that last after therapy ends, which lowers the chance of attacks returning. Your doctor will review the plan with you regularly.",
    },
    {
      q: "Is panic disorder a sign that I am 'mad' or weak?",
      a: "No. Panic disorder is a common, recognised health condition, not a sign of weakness or a flaw in character. Seeking help early is sensible, and with treatment most people return to the activities they had been avoiding.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Panic Disorder", url: "https://medlineplus.gov/panicdisorder.html" },
    { label: "Emergency Response Support System, Government of India — 112", url: "https://112.gov.in/" },
  ],
};
