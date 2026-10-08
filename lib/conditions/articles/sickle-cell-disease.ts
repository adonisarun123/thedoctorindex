import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "sickle-cell-disease",
  title: "Sickle cell disease: symptoms, tests, treatment and care",
  standfirst: "How sickle cell disease is inherited, the pain crises and other symptoms, screening in India, treatment, emergency signs and which doctor to see.",
  targetQuery: "sickle cell disease symptoms and treatment",
  department: "haematology",
  specialty: "haematology",
  alsoSee: ["paediatrics", "general-practice"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Pain crises", "Anaemia", "Jaundice", "Swelling of the hands and feet", "Frequent infections"],
  tests: ["Haemoglobin electrophoresis", "HPLC", "Solubility test", "Transcranial Doppler"],
  treatments: ["Hydroxyurea", "Pain relief", "Blood transfusion", "Vaccines and antibiotics", "Stem cell transplant"],
  body: [
    { k: "h2", text: "What sickle cell disease is" },
    {
      k: "p",
      text: "Sickle cell disease is an inherited blood disorder. It affects haemoglobin, the protein in red blood cells that carries oxygen. In sickle cell disease, the body makes an abnormal form called haemoglobin S. When oxygen levels drop, this haemoglobin clumps together and bends the normally round, soft red cells into a stiff, curved sickle or crescent shape.",
    },
    {
      k: "p",
      text: "Sickle cells cause two main problems. They break down much faster than normal red cells, leading to long-term [anaemia](/conditions/anemia). And they get stuck in small blood vessels, blocking blood flow, which causes sudden bouts of severe pain and, over time, damage to organs such as the spleen, lungs, brain, kidneys, eyes and bones. It is a lifelong condition, but with good care many people study, work, marry and have families.",
    },

    { k: "h2", text: "How it is inherited, and sickle cell trait" },
    {
      k: "p",
      text: "A child gets sickle cell disease only when they inherit an abnormal haemoglobin gene from both parents. Someone who inherits one sickle gene and one normal gene has **sickle cell trait**. People with the trait are carriers; they are usually healthy and do not develop the disease, though they can pass the gene on.",
    },
    {
      k: "p",
      text: "When both parents carry the trait, each pregnancy has a one-in-four chance of a child with sickle cell disease, a two-in-four chance of a child with the trait, and a one-in-four chance of a child with neither. A similar risk applies when one parent has the sickle gene and the other carries beta [thalassaemia](/conditions/thalassemia) trait. This is why carrier testing before marriage or pregnancy is so useful.",
    },
    {
      k: "p",
      text: "In India, sickle cell disease is more common in some tribal and other communities, particularly in central, western, eastern and parts of southern India, but it can occur in any community. India's Ministry of Health and Family Welfare runs a National Sickle Cell Anaemia Elimination Mission, which includes genetic counselling. Ask at your nearest government hospital or health centre what testing and support is available in your area.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually begin in the first year of life, once the baby's protective fetal haemoglobin declines. They vary a great deal between people, from mild to severe:",
    },
    {
      k: "ul",
      items: [
        "**Pain crises** — sudden episodes of severe pain in the bones, back, chest, joints or abdomen, lasting hours to days. They can be set off by cold, dehydration, infection, stress, heavy exertion or high altitude, or come without a clear trigger",
        "**Anaemia** — tiredness, weakness, breathlessness on exertion and pale skin",
        "**Jaundice** — yellowing of the eyes and skin from the rapid breakdown of red cells",
        "**Swelling of the hands and feet** in babies and young children, which is painful and often the first sign",
        "**Frequent infections**, because the spleen is damaged early in life and cannot fight certain bacteria well",
        "Slow growth and delayed puberty",
        "Vision problems from damage to the blood vessels of the eye",
      ],
    },

    { k: "h2", text: "Complications" },
    {
      k: "p",
      text: "Knowing the complications helps families act quickly. The serious ones include:",
    },
    {
      k: "ul",
      items: [
        "**Acute chest syndrome** — chest pain, fever, cough and breathlessness from blocked vessels or infection in the lungs. It is a medical emergency",
        "**Stroke** — even in children; sudden weakness, difficulty speaking or a seizure",
        "**Splenic sequestration** — in young children, blood pools suddenly in the spleen, which swells, and the child becomes very pale and weak",
        "**Severe infections** such as pneumonia, meningitis and bloodstream infection; [malaria](/conditions/malaria) can also be especially dangerous",
        "**Aplastic crisis** — a sudden fall in blood count, often after a viral infection",
        "A painful erection that will not go away (priapism)",
        "Gallstones, leg ulcers, kidney damage, and damage to the hip and shoulder joints",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "A simple blood test can diagnose sickle cell disease and tell it apart from sickle cell trait:",
    },
    {
      k: "ul",
      items: [
        "**Solubility test** — a quick, low-cost screening test that shows whether sickle haemoglobin is present, but cannot distinguish disease from trait",
        "**Haemoglobin electrophoresis** or **HPLC** — laboratory tests that identify the exact types of haemoglobin and confirm the diagnosis",
        "A complete blood count, and tests of the parents and siblings",
        "Testing in pregnancy — when both parents are carriers, a sample from the placenta or the fluid around the baby can show whether the baby is affected",
        "**Transcranial Doppler** — an ultrasound scan of blood flow in the brain, recommended regularly for children to identify those at higher risk of stroke, where available",
      ],
    },
    {
      k: "p",
      text: "Newborn screening, where available, allows care to start before the first serious crisis. If you belong to a community where sickle cell is common, or someone in the family has it, ask for testing of the baby.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Regular care with a haematologist reduces crises, prevents complications and helps people live longer, healthier lives. The main parts of treatment are:",
    },
    {
      k: "ul",
      items: [
        "**Hydroxyurea** (also called hydroxycarbamide) — a daily medicine that raises fetal haemoglobin, which protects red cells from sickling. It reduces pain crises, acute chest syndrome and the need for transfusions, and is used for both children and adults. It needs regular blood count checks",
        "**Pain relief** — from medicines your doctor advises for mild pain at home, to stronger pain relief in hospital for severe crises, along with fluids and warmth",
        "**Blood transfusion** — for severe anaemia, acute chest syndrome, stroke and before some operations. Some people need regular transfusions, which can cause iron overload and require medicines to remove extra iron",
        "**Vaccines and antibiotics** — all routine childhood vaccines plus pneumococcal and other vaccines advised by your doctor, and daily antibiotics in young children to prevent serious infection, as prescribed",
        "Folic acid, which the body needs to make new red cells, is commonly prescribed",
        "**Stem cell transplant** — a bone marrow transplant from a matched donor, usually a brother or sister, can cure the disease in some children and young adults, but it carries serious risks and is offered only in selected cases at specialist centres",
      ],
    },
    {
      k: "p",
      text: "Newer medicines and gene-based treatments have been developed in recent years and approved in some countries. Your haematologist can tell you what is suitable and available in India.",
    },

    { k: "h2", text: "Living with sickle cell disease" },
    {
      k: "ul",
      items: [
        "Drink plenty of water every day, more in hot weather and during illness",
        "Keep warm, and avoid sudden cold such as swimming in cold water or sitting under a direct air-conditioner draft",
        "Exercise regularly but avoid extreme exertion; rest and drink fluids during activity",
        "Use mosquito nets and repellents, and get fever tested promptly for malaria",
        "Keep vaccinations and regular check-ups, including eye and kidney checks, up to date",
        "Carry a card or note with your diagnosis, haemoglobin type, usual blood count and haematologist's contact",
        "Plan pregnancy with your haematologist and gynaecologist, and offer carrier testing to your partner",
        "Tell your child's school about the condition, the need for water and toilet breaks, and what to do in a crisis",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "note",
      tone: "alert",
      title: "Call 112 or 108, or go to the nearest emergency department",
      text: "For a person with sickle cell disease, get emergency care for: fever, especially in a child; chest pain, cough or breathlessness; sudden weakness, numbness, drooping of the face, difficulty speaking, a seizure or severe headache; a child who suddenly becomes very pale, weak or has a swollen tummy; severe pain not relieved by the usual home treatment; an erection lasting more than a couple of hours; or sudden loss of vision.",
    },
    {
      k: "p",
      text: "Fever in a child with sickle cell disease is always urgent, because a serious bacterial infection can progress very fast. Do not wait to see whether it settles overnight.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Sickle cell disease is managed by a [haematologist](/specialties/haematology). Children are usually cared for by a [paediatrician](/specialties/paediatrics) together with a haematologist, and a [general physician](/specialties/general-practice) can help with day-to-day problems and know when to refer. Other specialists — eye, kidney, orthopaedic and obstetric — join in as needed. Genetic counselling is helpful for couples where both partners carry the trait.",
    },
    {
      k: "p",
      text: "You can [find haematologists in Bengaluru](/doctors/karnataka/bengaluru/haematologists) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Which type of sickle cell disease do I or my child have?",
        "Is hydroxyurea suitable, and what monitoring does it need?",
        "Which vaccines and preventive antibiotics are needed?",
        "What should we do at home for a pain crisis, and when should we come to hospital?",
        "Should my child have a transcranial Doppler scan?",
        "Should other family members be tested?",
      ],
    },
  ],
  faqs: [
    {
      q: "What is the difference between sickle cell trait and sickle cell disease?",
      a: "Sickle cell trait means you carry one sickle gene and one normal gene. People with the trait are usually healthy and do not get pain crises. Sickle cell disease means both genes are abnormal, which causes the illness. Two carriers can have a child with the disease.",
    },
    {
      q: "Should we test for sickle cell before marriage or pregnancy?",
      a: "Carrier testing is useful, especially in communities where sickle cell is common or when someone in the family is affected. If both partners are carriers, genetic counselling explains the chances for each pregnancy and the options for testing the baby during pregnancy.",
    },
    {
      q: "Can people with sickle cell disease live a normal life?",
      a: "Many do. With regular care, hydroxyurea where suitable, vaccinations, prompt treatment of fever and crises, and plenty of fluids, many people with sickle cell disease study, work and have families. The condition varies a lot, so care is planned for each person.",
    },
    {
      q: "Is a bone marrow transplant the only cure?",
      a: "A stem cell or bone marrow transplant can cure sickle cell disease in some people, usually children with a matched sibling donor, but it has serious risks. Newer gene-based treatments are being used in some countries. Your haematologist can discuss whether either is suitable.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Sickle Cell Disease", url: "https://medlineplus.gov/sicklecelldisease.html" },
    { label: "National Sickle Cell Anaemia Elimination Mission, Ministry of Health and Family Welfare", url: "https://sickle.nhm.gov.in/" },
    { label: "Emergency Response Support System, Government of India — 112", url: "https://112.gov.in/" },
  ],
};
