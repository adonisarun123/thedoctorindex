import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "transient-ischemic-attack",
  title: "Transient ischaemic attack (mini-stroke): signs and urgent care",
  metaTitle: "TIA (mini-stroke): symptoms, tests and urgent care",
  standfirst: "What a transient ischaemic attack or mini-stroke is, the warning signs, why it needs same-day care, the tests and treatment that help prevent a stroke.",
  targetQuery: "transient ischemic attack mini stroke symptoms",
  department: "neurology",
  specialty: "neurology",
  alsoSee: ["cardiology", "emergency-medicine", "haematology"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Face drooping", "Arm or leg weakness", "Slurred speech", "Sudden loss of vision", "Numbness"],
  tests: ["Brain scan", "Carotid ultrasound", "ECG", "Blood tests", "Echocardiogram"],
  treatments: ["Antiplatelet medicines", "Anticoagulants", "Statins", "Blood pressure control", "Carotid surgery"],
  body: [
    { k: "h2", text: "What a TIA is" },
    {
      k: "p",
      text: "A transient ischaemic attack (TIA), often called a mini-stroke, happens when the blood supply to part of the brain, the eye or the spinal cord is blocked for a short time, usually by a small clot. The symptoms are the same as those of a [stroke](/conditions/stroke), but they go away completely, often within minutes and by definition without leaving lasting damage on brain scans.",
    },
    {
      k: "p",
      text: "Because the symptoms pass, many people ignore a TIA or wait to see a doctor. That is a mistake. A TIA is a warning sign that a full stroke may follow, and the risk is highest in the first few days. Prompt assessment and treatment greatly lower that risk. A TIA should be treated as a medical emergency, just like a stroke.",
    },

    { k: "h2", text: "Symptoms: think BE FAST" },
    {
      k: "p",
      text: "Symptoms come on suddenly. The BE FAST check helps you remember the main signs:",
    },
    {
      k: "ul",
      items: [
        "**B — Balance:** sudden loss of balance, dizziness or difficulty walking",
        "**E — Eyes:** sudden loss of vision in one eye, or double vision; some people describe a curtain coming down over one eye",
        "**F — Face:** face drooping on one side, or an uneven smile",
        "**A — Arm:** arm or leg weakness or numbness, usually on one side of the body",
        "**S — Speech:** slurred speech, or difficulty finding words or understanding others",
        "**T — Time:** call 112 or 108 immediately, and note the time the symptoms began",
      ],
    },
    {
      k: "p",
      text: "Other symptoms can include sudden numbness or tingling on one side, sudden confusion, or trouble swallowing. You cannot tell at the start whether symptoms will pass (a TIA) or stay (a stroke), so never wait to see if they go away.",
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "Most TIAs happen when a small clot or a piece of fatty plaque blocks a blood vessel supplying the brain. The clot may form in a narrowed artery in the neck (the carotid arteries) or the brain, or it may come from the heart. Conditions that raise the risk include:",
    },
    {
      k: "ul",
      items: [
        "[High blood pressure](/conditions/high-blood-pressure), the most important treatable risk factor",
        "Hardening and narrowing of the arteries ([atherosclerosis](/conditions/atherosclerosis)), especially in the neck",
        "[Atrial fibrillation](/conditions/atrial-fibrillation), an irregular heartbeat that allows clots to form in the heart",
        "Diabetes, high cholesterol and smoking or chewing tobacco",
        "Being overweight, physical inactivity, and heavy alcohol use",
        "Older age and a family history of stroke",
        "Heart valve disease or a previous heart attack",
        "Less commonly, blood disorders that make the blood clot more easily, such as some inherited clotting conditions, antiphospholipid syndrome or a very high red cell or platelet count",
      ],
    },
    {
      k: "p",
      text: "In India, high blood pressure and diabetes often go undiagnosed for years. A TIA is sometimes the first sign that these need attention.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Often the symptoms have gone by the time you see a doctor, so a clear description from you or someone who saw what happened is very valuable. Note the time, what the symptoms were, and how long they lasted. Tests look for the cause and help estimate the risk of a stroke:",
    },
    {
      k: "ul",
      items: [
        "**Brain scan** — a CT or MRI scan to rule out bleeding, a small stroke or other causes such as a tumour. MRI can show small areas of damage that CT may miss.",
        "**Carotid ultrasound** — a scan of the arteries in the neck to look for narrowing, or a CT or MR angiogram of the blood vessels",
        "**ECG** — to look for atrial fibrillation or other heart problems; sometimes a longer recording with a Holter monitor",
        "**Echocardiogram** — an ultrasound of the heart to look for a source of clots",
        "**Blood tests** — blood count, blood sugar, cholesterol, kidney function and, in younger people or when no other cause is found, tests for clotting disorders",
      ],
    },
    {
      k: "p",
      text: "Other conditions can mimic a TIA, including low blood sugar ([hypoglycemia](/conditions/hypoglycemia)), [migraine](/conditions/migraine) with aura, seizures and inner-ear problems. The doctor will consider these too.",
    },

    { k: "h2", text: "Treatment to prevent a stroke" },
    {
      k: "p",
      text: "The aim of treatment after a TIA is to prevent a stroke. It usually starts on the same day the TIA is diagnosed and continues long term:",
    },
    {
      k: "ul",
      items: [
        "**Antiplatelet medicines**, such as aspirin or clopidogrel, make platelets less sticky and reduce clot formation. Doctors sometimes use two of these together for a short period after a TIA.",
        "**Anticoagulants** (blood thinners) are used instead when the clot came from the heart, as in atrial fibrillation, or in some clotting disorders.",
        "**Statins** lower cholesterol and help stabilise fatty plaques in the arteries.",
        "**Blood pressure control** with medicines and lifestyle changes.",
        "Good control of blood sugar in diabetes.",
        "**Carotid surgery** (endarterectomy) or a stent may be recommended when an artery in the neck is significantly narrowed, ideally soon after the TIA.",
      ],
    },
    {
      k: "p",
      text: "Take these medicines exactly as prescribed and do not stop them without talking to your doctor. Blood thinners increase the risk of bleeding, so tell any doctor or dentist that you take them, and report black stools, blood in the urine or unusual bruising.",
    },

    { k: "h2", text: "Lifestyle changes after a TIA" },
    {
      k: "ul",
      items: [
        "Stop smoking and chewing tobacco, gutka or paan with tobacco; ask your doctor for help to quit",
        "Eat less salt, fried food and processed food, and more vegetables, fruit, whole grains and pulses",
        "Be active most days, for example with brisk walking, as your doctor advises",
        "Keep to a healthy weight and limit alcohol",
        "Check your blood pressure, blood sugar and cholesterol regularly",
        "Ask your doctor when it is safe to drive again",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "note",
      tone: "alert",
      title: "Do not wait",
      text: "Call 112 or 108, or go to the nearest hospital emergency department with stroke facilities, as soon as any BE FAST sign appears, even if it passes within minutes. Do not drive yourself. Note the time symptoms began. Emergency stroke treatments work best when given quickly, and a TIA needs urgent assessment the same day.",
    },
    {
      k: "p",
      text: "While waiting, keep the person safe and lying on their side if they are drowsy or vomiting. Do not give food, drink or tablets, including aspirin, until a doctor has checked them, because a bleeding stroke can look the same at first.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "In the first hours, an [emergency medicine](/specialties/emergency-medicine) team assesses a TIA. A [neurologist](/specialties/neurology) usually leads the investigation and follow-up. A [cardiologist](/specialties/cardiology) helps when the heart rhythm or valves are involved. A [haematologist](/specialties/haematology) is consulted when a TIA happens at a young age, keeps recurring, or tests suggest a blood clotting disorder, and helps manage long-term blood thinners in those cases. See also our guide to [ischaemic stroke](/conditions/ischemic-stroke).",
    },
    {
      k: "p",
      text: "You can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists), [haematologists in Bengaluru](/doctors/karnataka/bengaluru/haematologists) or [cardiologists in Bengaluru](/doctors/karnataka/bengaluru/cardiologists) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "If my symptoms went away, do I still need to see a doctor?",
      a: "Yes, urgently. A TIA is a warning that a stroke may follow, often within days. Getting assessed the same day means tests can find the cause and treatment can start, which greatly lowers the risk of a disabling stroke.",
    },
    {
      q: "What is the difference between a TIA and a stroke?",
      a: "Both are caused by a blocked blood supply to the brain. In a TIA the blockage clears quickly and symptoms resolve without lasting damage. In a stroke, brain cells are damaged and symptoms may persist. You cannot tell which it is at the start, so treat both as emergencies.",
    },
    {
      q: "Should I take an aspirin if I think I am having a TIA?",
      a: "Do not take aspirin before a doctor has seen you and a brain scan has ruled out bleeding. Some strokes are caused by bleeding, and aspirin could make them worse. Call 112 or 108 and let the emergency team decide.",
    },
    {
      q: "Can a TIA happen again?",
      a: "Yes, TIAs can recur, and each one is a warning sign of stroke. Taking prescribed medicines, controlling blood pressure, blood sugar and cholesterol, and stopping tobacco all reduce the risk. Report any new symptoms immediately.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Transient Ischemic Attack", url: "https://medlineplus.gov/transientischemicattack.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
