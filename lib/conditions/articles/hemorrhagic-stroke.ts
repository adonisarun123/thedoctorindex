import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "hemorrhagic-stroke",
  title: "Haemorrhagic stroke (brain bleed): symptoms, causes and treatment",
  metaTitle: "Haemorrhagic stroke: symptoms, causes and treatment",
  standfirst: "What a haemorrhagic stroke is, the sudden signs to act on, what causes bleeding in the brain, how it is treated in hospital, and recovery afterwards.",
  targetQuery: "hemorrhagic stroke symptoms and treatment",
  department: "neurology",
  specialty: "neurology",
  alsoSee: ["neurosurgery", "emergency-medicine", "physical-medicine-rehabilitation"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Sudden severe headache", "Face drooping", "Arm or leg weakness", "Slurred speech", "Vomiting", "Loss of consciousness"],
  tests: ["CT scan", "MRI", "CT angiography", "Cerebral angiogram"],
  treatments: ["Blood pressure control", "Reversal of blood thinners", "Surgery", "Aneurysm coiling or clipping", "Rehabilitation"],
  body: [
    { k: "h2", text: "What a haemorrhagic stroke is" },
    {
      k: "p",
      text: "A [stroke](/conditions/stroke) happens when part of the brain suddenly loses its blood supply and brain cells begin to die within minutes. There are two main types. In an [ischaemic stroke](/conditions/ischemic-stroke), the more common type, a clot blocks an artery. In a **haemorrhagic stroke**, a blood vessel in or around the brain bursts and bleeds.",
    },
    {
      k: "p",
      text: "The leaking blood damages brain tissue directly and raises pressure inside the skull, which can squeeze other parts of the brain. Haemorrhagic strokes are less common than ischaemic strokes but are often more severe. Fast emergency care improves the chance of survival and of a better recovery.",
    },
    { k: "p", text: "There are two main kinds:" },
    {
      k: "ul",
      items: [
        "**Intracerebral haemorrhage** — bleeding directly into the brain tissue. This is the most common kind, and long-standing high blood pressure is the usual cause.",
        "**Subarachnoid haemorrhage** — bleeding into the space between the brain and the thin membranes covering it, most often from a burst aneurysm (a weak, ballooned spot on an artery).",
      ],
    },

    { k: "h2", text: "Symptoms: think BE FAST" },
    {
      k: "p",
      text: "Stroke symptoms come on suddenly. You cannot tell a bleed from a clot by the symptoms alone — only a brain scan can — so treat any of these as an emergency:",
    },
    {
      k: "ul",
      items: [
        "**Balance** — sudden dizziness, loss of balance or trouble walking",
        "**Eyes** — sudden blurred, double or lost vision in one or both eyes",
        "**Face** — face drooping on one side, especially when trying to smile",
        "**Arm** — arm or leg weakness or numbness, especially on one side; one arm drifts down when both are raised",
        "**Speech** — slurred speech, or trouble finding words or understanding others",
        "**Time** — call 112 or 108 immediately and note the time symptoms started",
      ],
    },
    {
      k: "p",
      text: "A haemorrhagic stroke, especially a subarachnoid haemorrhage, often also causes a sudden severe headache — many people describe it as the worst headache of their life, reaching full strength within seconds or a minute. Vomiting, a stiff neck, seizures, confusion, drowsiness and loss of consciousness are also common.",
    },

    { k: "h2", text: "Causes and risk factors" },
    { k: "p", text: "Common causes of bleeding in the brain include:" },
    {
      k: "ul",
      items: [
        "[High blood pressure](/conditions/high-blood-pressure) — over years it weakens the walls of small arteries in the brain. Uncontrolled blood pressure is the most important preventable cause.",
        "A burst brain aneurysm",
        "An arteriovenous malformation (AVM) — a tangle of abnormal blood vessels, usually present from birth",
        "Head injury",
        "Blood-thinning medicines, or conditions that affect blood clotting",
      ],
    },
    {
      k: "p",
      text: "The risk is also higher with heavy alcohol use, smoking, stimulant drugs such as cocaine, older age, and a family history of aneurysms. Many people have high blood pressure without knowing it, because it rarely causes symptoms, and others stop their medicines once readings improve. Regular checks and taking blood pressure medicines as prescribed are among the most effective ways to prevent a brain bleed.",
    },

    { k: "h2", text: "What to do while waiting for help" },
    {
      k: "ul",
      items: [
        "Call 112 or 108 and say you think it is a stroke",
        "Note the time the symptoms started, or when the person was last seen well",
        "Keep the person lying down with the head slightly raised, or on their side if they are vomiting or drowsy",
        "Do not give food, water or any medicine by mouth — swallowing may be affected",
        "Do not give aspirin; if the stroke is a bleed, it can make bleeding worse",
        "Collect a list of their medicines, especially any blood thinners, to take to hospital",
      ],
    },
    {
      k: "p",
      text: "If possible, go to a hospital that can do an urgent CT scan and has a neurologist and neurosurgeon available. Ambulance staff can often advise on the nearest suitable hospital.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Brain imaging is the key step, because it tells doctors whether the stroke is a bleed or a clot, and treatment for the two is very different. Tests used include:",
    },
    {
      k: "ul",
      items: [
        "**CT scan** of the head — fast and widely available, and shows fresh bleeding well",
        "**MRI** — gives more detail and can help find the cause",
        "**CT angiography** — a CT scan with dye that shows the blood vessels, to look for an aneurysm or AVM",
        "**Cerebral angiogram** — a thin tube is passed through an artery to inject dye into the brain's blood vessels, giving the clearest picture; it can sometimes be combined with treatment",
        "Blood tests for clotting, blood count, kidney function and sugar",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment aims to stop the bleeding, reduce pressure on the brain and prevent complications. It usually happens in an intensive care or stroke unit and may include:",
    },
    {
      k: "ul",
      items: [
        "**Blood pressure control** with medicines, carefully monitored",
        "**Reversal of blood thinners** for people who were taking them",
        "Medicines to control seizures and to manage swelling in the brain",
        "**Surgery** to remove a large clot of blood or relieve pressure, or to drain fluid from the brain",
        "**Aneurysm coiling or clipping** — sealing off a burst aneurysm from inside the blood vessel with tiny coils, or surgically with a small clip, to stop it bleeding again",
        "Treatment of an AVM by surgery, procedures through the blood vessels or focused radiation",
      ],
    },
    {
      k: "p",
      text: "Whether surgery is needed depends on the size and position of the bleed and the person's overall condition. A [neurosurgeon](/specialties/neurosurgery) makes this decision with the neurology and critical care team.",
    },

    { k: "h2", text: "Recovery and rehabilitation" },
    {
      k: "p",
      text: "Recovery depends on how much of the brain was affected. Many people need help with movement, speech, swallowing, memory or mood. **Rehabilitation** starts in hospital once the person is stable and often continues for months, with physiotherapy, speech and swallowing therapy, and occupational therapy. Low mood and anxiety are common after a stroke and can be treated, so mention them to the care team.",
    },
    { k: "p", text: "To lower the risk of another stroke:" },
    {
      k: "ul",
      items: [
        "Take blood pressure medicines every day and check your blood pressure regularly",
        "Stop smoking and avoid alcohol or keep it minimal, as advised",
        "Never restart or stop a blood thinner without your doctor's advice",
        "Manage diabetes and cholesterol, eat less salt and stay active as you are able",
        "Keep follow-up appointments, including any repeat scans",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A suspected stroke goes straight to the emergency department, where an [emergency physician](/specialties/emergency-medicine) starts care. A [neurologist](/specialties/neurology) leads stroke care and long-term prevention, and a [neurosurgeon](/specialties/neurosurgery) is involved when surgery or aneurysm treatment may be needed. A [rehabilitation physician](/specialties/physical-medicine-rehabilitation) and therapists guide recovery afterwards.",
    },
    {
      k: "p",
      text: "For follow-up and rehabilitation, you can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists), [neurosurgeons in Bengaluru](/doctors/karnataka/bengaluru/neurosurgeons) or [rehabilitation physicians in Bengaluru](/doctors/karnataka/bengaluru/rehabilitation-physicians) on The Doctor Index.",
    },

    { k: "h2", text: "Questions to ask the care team" },
    {
      k: "ul",
      items: [
        "What caused the bleed, and is there a risk it will happen again?",
        "Is surgery or another procedure needed now or later?",
        "What blood pressure should we aim for at home?",
        "What rehabilitation is needed, and where can we get it after discharge?",
        "Which warning signs mean we should come back immediately?",
      ],
    },
  ],
  faqs: [
    {
      q: "How is a haemorrhagic stroke different from an ischaemic stroke?",
      a: "An ischaemic stroke is caused by a clot blocking an artery, while a haemorrhagic stroke is caused by a blood vessel bursting and bleeding. The symptoms can look the same, so a brain scan is needed before treatment, because clot-busting medicines used for ischaemic stroke would worsen a bleed.",
    },
    {
      q: "What does a brain haemorrhage headache feel like?",
      a: "A bleed, especially a subarachnoid haemorrhage, often causes a sudden, extremely severe headache that peaks within seconds or a minute, sometimes with vomiting, a stiff neck or fainting. Any sudden headache like this needs emergency care — call 112 or 108.",
    },
    {
      q: "Can high blood pressure alone cause a brain bleed?",
      a: "Yes. Long-standing high blood pressure is the most common cause of bleeding into the brain tissue. It weakens small arteries over years. Keeping blood pressure controlled with regular checks, lifestyle changes and prescribed medicines greatly lowers the risk.",
    },
    {
      q: "Can someone recover after a haemorrhagic stroke?",
      a: "Many people do recover a good deal of function, though recovery can be slow and some disability may remain. Outcome depends on the size and location of the bleed and how quickly treatment began. Early, consistent rehabilitation and family support make a real difference.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Hemorrhagic Stroke", url: "https://medlineplus.gov/hemorrhagicstroke.html" },
    { label: "Emergency Response Support System, Government of India — 112", url: "https://112.gov.in/" },
  ],
};
