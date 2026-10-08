import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "deep-vein-thrombosis",
  title: "Deep vein thrombosis (DVT): symptoms, causes and treatment",
  standfirst: "What a DVT is, the leg symptoms to take seriously, who is at risk, how it is confirmed with an ultrasound, blood thinner treatment and the emergency signs.",
  targetQuery: "deep vein thrombosis symptoms and treatment",
  department: "vascular-medicine",
  specialty: "cardiology",
  alsoSee: ["general-surgery", "internal-medicine", "emergency-medicine"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Leg swelling", "Leg pain", "Warmth", "Redness"],
  tests: ["Doppler ultrasound", "D-dimer"],
  treatments: ["Blood thinners", "Compression stockings", "Clot-dissolving treatment", "Vena cava filter"],
  body: [
    { k: "h2", text: "What deep vein thrombosis is" },
    {
      k: "p",
      text: "Deep vein thrombosis, usually shortened to DVT, is a blood clot that forms in one of the deep veins of the body, most often in the calf or thigh, and sometimes in the pelvis or arm. Deep veins run within the muscles and carry blood back to the heart. They are different from the visible veins just under the skin.",
    },
    {
      k: "p",
      text: "A DVT matters for two reasons. First, part of the clot can break off, travel through the heart and lodge in the arteries of the lungs. This is called a [pulmonary embolism](/conditions/pulmonary-embolism) and can be life-threatening. Second, a clot can damage the valves inside the vein, leaving the leg swollen, aching and discoloured for years afterwards, a problem known as post-thrombotic syndrome. Prompt diagnosis and treatment lower the risk of both.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "A DVT usually affects one leg. Many clots cause few or no symptoms, but when symptoms occur they may include:",
    },
    {
      k: "ul",
      items: [
        "Leg swelling, often of the calf, ankle or whole leg on one side",
        "Leg pain, cramping or tenderness, frequently starting in the calf and worse on standing or walking",
        "Warmth over the affected area",
        "Redness or a bluish or darker change in skin colour",
        "Veins near the surface that look more prominent than usual",
      ],
    },
    {
      k: "p",
      text: "A swollen, painful leg can also be due to a muscle strain, [cellulitis](/conditions/cellulitis), a burst cyst behind the knee or heart or kidney problems. Because these can look alike, a new, one-sided swollen and painful leg should always be checked by a doctor the same day rather than treated with massage, oil or a crepe bandage at home. Massage in particular should be avoided if a clot is possible.",
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "Clots form when blood flows slowly, when the vein wall is injured, or when the blood clots more easily than normal. Often more than one of these is present. Common risk factors include:",
    },
    {
      k: "ul",
      items: [
        "Being immobile for long periods: a hospital stay, bed rest after illness, a leg in plaster, or long journeys by bus, train, car or plane without moving",
        "Recent surgery, especially hip, knee, abdominal or cancer operations",
        "Injury to a leg, such as a fracture",
        "Cancer and some cancer treatments",
        "Pregnancy and the weeks after delivery, and hormonal medicines such as some birth control pills and hormone therapy",
        "A previous DVT or a family history of clots, or an inherited clotting tendency",
        "Older age, being overweight and smoking",
        "Heart failure, inflammatory bowel disease and some other long-term illnesses",
        "Severe dehydration, which thickens the blood",
      ],
    },
    {
      k: "p",
      text: "Sometimes a DVT appears with no clear trigger. In that case your doctor may look more carefully for an underlying cause.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "The doctor will examine both legs, compare their size and ask about recent surgery, travel, illness, pregnancy and medicines. They often use a scoring system to judge how likely a clot is before choosing tests:",
    },
    {
      k: "ul",
      items: [
        "**Doppler ultrasound** — the main test. A painless scan of the leg veins shows whether a clot is present and how far it extends. It may be repeated after a few days if the first scan is normal but suspicion remains.",
        "**D-dimer** — a blood test for a substance released when clots break down. A normal result helps rule out a clot in people at low risk. A raised result is not specific, because surgery, infection, pregnancy and older age can raise it too.",
        "Other imaging, such as CT or MRI venography, for clots in the pelvis or abdomen, and a CT scan of the chest if a pulmonary embolism is suspected",
        "Blood tests before treatment, including kidney and liver function and a blood count, and sometimes tests for a clotting tendency",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "The goals of treatment are to stop the clot getting bigger, prevent it from travelling to the lungs, and lower the chance of another clot. Many people with an uncomplicated DVT are treated as outpatients.",
    },
    {
      k: "p",
      text: "**Blood thinners** (anticoagulants) are the main treatment. They do not dissolve the existing clot, but they stop it growing while the body slowly breaks it down. They may be started as injections, as tablets, or both. Treatment usually continues for at least a few months, and longer in some people; your doctor will decide based on what caused the clot and your bleeding risk. Some blood thinners need regular blood tests, and some interact with other medicines and foods, so always tell any doctor or dentist that you take one.",
    },
    {
      k: "p",
      text: "**Compression stockings** may be advised to relieve swelling and aching. Your doctor will tell you whether they suit you and how to wear them. For large clots causing severe symptoms, specialists may consider **clot-dissolving treatment** delivered through a thin tube into the vein, or a procedure to remove the clot. A **vena cava filter**, a small device placed in the main vein of the abdomen to catch clots, is reserved for people who cannot take blood thinners.",
    },

    { k: "h2", text: "Prevention and living with it" },
    {
      k: "ul",
      items: [
        "After surgery or during a hospital stay, ask whether you need preventive blood thinners or stockings, and get up and walk as soon as you are allowed",
        "On long journeys, walk around when you can, flex and point your feet regularly while seated, and drink enough water",
        "Keep active, stay at a healthy weight and stop smoking",
        "If you are on blood thinners, take them exactly as prescribed, carry a note saying so, and report unusual bleeding or bruising",
        "Before starting hormonal birth control or hormone therapy, tell the doctor if you have had a clot before",
        "Walking and leg elevation when resting can ease swelling as the leg recovers",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "p",
      text: "A clot that has travelled to the lungs needs emergency treatment. Call 112 or 108, or go to the nearest emergency department immediately, if you have:",
    },
    {
      k: "ul",
      items: [
        "Sudden breathlessness or fast breathing",
        "Chest pain that is sharp and worse on breathing in or coughing",
        "Coughing up blood",
        "A fast heartbeat, fainting, light-headedness or collapse",
      ],
    },
    {
      k: "p",
      text: "Also seek urgent medical care, the same day, for a newly swollen, painful leg, or if you are on blood thinners and have black stools, vomit blood, have a severe headache or any bleeding that will not stop.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A suspected DVT is usually first assessed by a [general physician](/specialties/general-practice), an [internal medicine specialist](/specialties/internal-medicine) or in an emergency department. Ongoing care may be with a vascular surgeon, a [cardiologist](/specialties/cardiology) or a physician, depending on the hospital. A [haematologist](/specialties/haematology) may be involved if clots recur or a clotting disorder is suspected, and pregnant women are managed together with their [gynaecologist](/specialties/gynaecology).",
    },
    {
      k: "p",
      text: "You can [find cardiologists in Bengaluru](/doctors/karnataka/bengaluru/cardiologists), [internal medicine physicians in Bengaluru](/doctors/karnataka/bengaluru/internal-medicine-physicians) or [general surgeons in Bengaluru](/doctors/karnataka/bengaluru/general-surgeons) on The Doctor Index, each with a registration you can check. If a clot develops in a leg with long-standing swollen veins, our page on [varicose veins](/conditions/varicose-veins) may also help.",
    },
  ],
  faqs: [
    {
      q: "Can I walk if I have a DVT?",
      a: "For most people, yes. Once treatment with blood thinners has started, doctors usually encourage walking, as bed rest does not help and may slow recovery. Follow the advice of your own doctor, who knows the size and position of your clot.",
    },
    {
      q: "How long will I need to take blood thinners?",
      a: "It varies. Many people take them for a few months, but those with an unprovoked clot, a repeat clot, cancer or a clotting disorder may need them for longer. Your doctor weighs the chance of another clot against the risk of bleeding.",
    },
    {
      q: "Is a DVT the same as varicose veins?",
      a: "No. Varicose veins are swollen, twisted veins just under the skin. A DVT is a clot in a deep vein inside the muscles and can be dangerous. Varicose veins can occasionally be linked with clots, so any sudden new pain or swelling should be checked.",
    },
    {
      q: "Does a long flight or bus journey really cause clots?",
      a: "Sitting still for many hours slows blood flow in the legs and slightly raises the risk, mostly in people who already have other risk factors. Moving your legs, walking when possible and drinking enough water help. Ask your doctor before travel if you have had a clot before.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Deep Vein Thrombosis", url: "https://medlineplus.gov/deepveinthrombosis.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
