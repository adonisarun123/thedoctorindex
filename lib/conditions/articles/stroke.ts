import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "stroke",
  title: "Stroke: warning signs (BE-FAST), emergency treatment and recovery",
  metaTitle: "Stroke: BE-FAST warning signs, treatment and recovery",
  standfirst: "How to recognise a stroke with BE-FAST, why every minute matters, how stroke is treated in hospital, and what recovery and prevention involve.",
  targetQuery: "stroke symptoms and treatment",
  department: "neurology",
  specialty: "neurology",
  alsoSee: ["emergency-medicine", "physiotherapy"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Face drooping", "Arm or leg weakness", "Slurred speech", "Loss of balance", "Sudden vision loss", "Sudden severe headache"],
  tests: ["CT scan", "MRI", "ECG", "Carotid ultrasound", "Echocardiogram"],
  treatments: ["Clot-busting medicine", "Thrombectomy", "Antiplatelet medicines", "Rehabilitation"],
  body: [
    {
      k: "note",
      text: "**Every minute matters.** If you think someone is having a stroke, call 112 or 108 straight away and ask to be taken to a hospital that can treat stroke. Note the time the symptoms started, or the time the person was last seen well. Do not wait to see if it settles, and do not give food, drink or medicines by mouth.",
    },
    { k: "h2", text: "What a stroke is" },
    {
      k: "p",
      text: "A stroke happens when the blood supply to part of the brain is suddenly cut off or when a blood vessel in the brain bursts. Without blood, brain cells are starved of oxygen and begin to die within minutes. The part of the body controlled by that area of the brain — movement, speech, vision, balance or thinking — stops working properly.",
    },
    {
      k: "p",
      text: "There are two main types. An *ischaemic stroke*, the more common kind, is caused by a clot blocking an artery to the brain. A *haemorrhagic stroke* is caused by bleeding into or around the brain. The two need opposite treatments, which is why a scan is done before treatment starts.",
    },
    {
      k: "p",
      text: "A transient ischaemic attack (TIA), sometimes called a mini-stroke, causes the same symptoms but they go away, often within minutes. A TIA is a warning: the risk of a full stroke in the following days is high, so it needs the same urgent assessment.",
    },

    { k: "h2", text: "Warning signs: BE-FAST" },
    { k: "p", text: "Stroke symptoms come on suddenly. Use BE-FAST to recognise them:" },
    {
      k: "ul",
      items: [
        "**B — Balance:** sudden loss of balance, dizziness or difficulty walking",
        "**E — Eyes:** sudden vision loss in one or both eyes, or double vision",
        "**F — Face:** face drooping on one side; the smile looks uneven",
        "**A — Arm:** arm or leg weakness or numbness on one side; one arm drifts down when both are raised",
        "**S — Speech:** slurred speech, difficulty finding words or understanding others",
        "**T — Time:** time to call 112 or 108 immediately",
      ],
    },
    {
      k: "p",
      text: "Other signs include a sudden severe headache unlike any before, especially with vomiting, sudden confusion, and trouble swallowing. Symptoms may come and go, and the person may not realise anything is wrong. Act even if you are unsure.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "Stroke can happen at a younger age than many people expect, and most strokes are linked to risk factors that can be treated. The most important is high blood pressure, which often has no symptoms. Your risk is higher if you have:",
    },
    {
      k: "ul",
      items: [
        "High blood pressure",
        "Diabetes or high cholesterol",
        "An irregular heartbeat called atrial fibrillation, or other heart disease",
        "A habit of smoking, chewing tobacco or drinking heavily",
        "Excess weight, little physical activity or a diet high in salt",
        "A previous stroke or TIA, or a family history of stroke",
        "Increasing age, although stroke can happen at any age",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "In the emergency department the team will examine the person quickly, check blood sugar (low sugar can mimic a stroke) and arrange an urgent brain scan. A **CT scan** shows whether there is bleeding and is usually the first scan. An **MRI** shows smaller or very early areas of damage. Scans of the blood vessels in the neck and brain may be done at the same time to look for a blocked artery.",
    },
    {
      k: "p",
      text: "Further tests look for the cause, so that another stroke can be prevented. These usually include an **ECG** and heart rhythm monitoring to find atrial fibrillation, a **carotid ultrasound** of the neck arteries, an **echocardiogram** (heart ultrasound), and blood tests for sugar, cholesterol and clotting.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A suspected stroke is a job for an emergency department, not a clinic appointment. [Emergency physicians](/specialties/emergency-medicine) and [neurologists](/specialties/neurology) work together in the first hours. After that, a neurologist usually leads care and prevention. It helps to know in advance which hospitals near you can scan and treat stroke at any hour.",
    },
    {
      k: "p",
      text: "Recovery involves a team. [Physiotherapists](/specialties/physiotherapy), who are allied-health professionals, help with movement and walking; occupational therapists and speech and language therapists help with daily tasks, speech and swallowing. You can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists), [emergency physicians](/doctors/karnataka/bengaluru/emergency-physicians) and [physiotherapists](/doctors/karnataka/bengaluru/physiotherapists) on The Doctor Index.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "In the first hours" },
    {
      k: "p",
      text: "For an ischaemic stroke, **clot-busting medicine** given into a vein can dissolve the clot and restore blood flow, but it works only within a short window after symptoms begin, and only after a scan has ruled out bleeding. For a large clot in a major artery, **thrombectomy** — removing the clot with a thin tube passed through an artery — can be done in specialist centres, sometimes alongside clot-busting medicine. The sooner either is given, the more brain can be saved.",
    },
    {
      k: "p",
      text: "For a haemorrhagic stroke, treatment focuses on controlling blood pressure, reversing any blood-thinning medicines and, in some cases, surgery to relieve pressure or repair the bleeding vessel. A neurosurgeon may be involved.",
    },
    { k: "h3", text: "Preventing another stroke" },
    {
      k: "p",
      text: "After an ischaemic stroke or TIA, **antiplatelet medicines** such as aspirin or clopidogrel are usually started to reduce clotting, or anticoagulants if atrial fibrillation is found. Medicines to lower blood pressure and cholesterol are important for almost everyone. Some people with a severely narrowed neck artery benefit from surgery or a stent. Take these medicines every day and do not stop them on your own.",
    },
    { k: "h3", text: "Rehabilitation" },
    {
      k: "p",
      text: "**Rehabilitation** starts as soon as the person is stable. Much of the recovery happens in the first months, but improvement can continue for much longer with steady practice. Families play a big part in helping with exercises at home.",
    },

    { k: "h2", text: "Living after a stroke" },
    {
      k: "p",
      text: "Recovery is different for everyone. Some people recover fully; others live with weakness, speech difficulty or tiredness. Depression is common after a stroke and is treatable, so mention low mood to the doctor. Keep blood pressure, sugar and cholesterol under control, stop tobacco in all forms, cut down salt and alcohol, and stay as active as you safely can. Attend follow-up appointments and ask about driving and returning to work before doing either.",
    },
    {
      k: "p",
      text: "Carers need support too. Learn how to help safely with moving, eating and medicines, and ask the team what help is available.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108 immediately for:" },
    {
      k: "ul",
      items: [
        "Any BE-FAST sign, even if it lasts only a few minutes",
        "A sudden, severe headache that is the worst ever",
        "New symptoms or sudden worsening in someone recovering from a stroke",
        "Choking, coughing with every swallow or breathlessness after a stroke",
        "A fit (seizure) in someone who has had a stroke",
      ],
    },
    {
      k: "p",
      text: "While you wait, keep the person safe and lying on their side if they are drowsy or vomiting, and do not give anything by mouth, because swallowing may be affected.",
    },

    { k: "h2", text: "Questions to ask the care team" },
    {
      k: "ul",
      items: [
        "What type of stroke was it, and what caused it?",
        "Which parts of the brain were affected, and what recovery can we expect?",
        "Which medicines must be taken long term, and why?",
        "What are the blood pressure and cholesterol targets?",
        "What rehabilitation is needed, and who will provide it?",
        "What signs should make us call for help again?",
      ],
    },
  ],
  faqs: [
    {
      q: "What should I do if stroke symptoms go away on their own?",
      a: "Still get emergency help. Symptoms that go away may be a transient ischaemic attack, which carries a high risk of a full stroke soon afterwards. Urgent assessment and treatment can greatly reduce that risk, so do not wait for an appointment.",
    },
    {
      q: "Can a stroke happen to young people?",
      a: "Yes. Although stroke is more common with age, it can happen at any age, including in people of working age and, rarely, in children. High blood pressure, diabetes, smoking and some heart conditions are common causes in younger adults.",
    },
    {
      q: "Should I give aspirin to someone having a stroke?",
      a: "No. Do not give aspirin or any other medicine before a scan. If the stroke is caused by bleeding, aspirin can make it worse, and the person may not be able to swallow safely. Call 112 or 108 and let the hospital decide.",
    },
    {
      q: "How long does recovery take after a stroke?",
      a: "It varies widely. The fastest improvement usually happens in the first weeks and months, but many people keep improving for a long time with regular rehabilitation. The care team can give a better idea once they have assessed the effects of the stroke.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Stroke", url: "https://medlineplus.gov/stroke.html" },
    { label: "NHS — Stroke symptoms", url: "https://www.nhs.uk/conditions/stroke/symptoms/" },
  ],
};
