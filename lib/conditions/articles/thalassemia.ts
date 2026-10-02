import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "thalassemia",
  title: "Thalassaemia (thalassemia): symptoms, carrier testing, treatment and which doctor to see",
  metaTitle: "Thalassaemia: symptoms, carrier tests and treatment",
  standfirst: "What thalassaemia and thalassaemia trait are, how carrier testing before marriage or pregnancy works, how the disease is treated, and who to see.",
  targetQuery: "thalassemia symptoms test and treatment",
  department: "haematology",
  specialty: "haematology",
  alsoSee: ["paediatrics"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Pale skin", "Tiredness", "Poor feeding", "Poor growth", "Jaundice", "Swollen abdomen"],
  tests: ["Complete blood count", "Haemoglobin electrophoresis", "HPLC", "DNA testing", "Chorionic villus sampling", "Serum ferritin"],
  treatments: ["Blood transfusion", "Iron chelation", "Bone marrow transplant", "Folic acid"],
  body: [
    { k: "h2", text: "What thalassaemia is" },
    {
      k: "p",
      text: "Thalassaemia is a group of inherited blood conditions in which the body makes too little of one of the protein chains that form haemoglobin, the oxygen-carrying substance in red blood cells. The red cells are small and fragile, and the result is anaemia that ranges from very mild to severe.",
    },
    {
      k: "p",
      text: "Beta thalassaemia is the form most often discussed in India. A person who inherits one altered gene has **thalassaemia trait** (minor, or carrier): they are healthy, perhaps with mild anaemia, and need no treatment. A child who inherits altered genes from both parents can have **thalassaemia major**, a serious condition that needs regular blood transfusions from early childhood, or a milder form called thalassaemia intermedia (non-transfusion-dependent thalassaemia).",
    },
    {
      k: "p",
      text: "When both parents are carriers, each pregnancy has a chance of a child with thalassaemia major, a chance of a carrier child and a chance of an unaffected child. This is why carrier testing matters so much.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Carriers usually have no symptoms. In thalassaemia major, symptoms usually appear in the first one or two years of life:",
    },
    {
      k: "ul",
      items: [
        "Pale skin and increasing tiredness or irritability",
        "Poor feeding and poor growth",
        "Jaundice — yellowing of the skin and eyes",
        "A swollen abdomen from an enlarged spleen and liver",
        "Changes in the bones of the face and skull if untreated",
        "Delayed puberty in older children",
      ],
    },
    {
      k: "p",
      text: "People with thalassaemia intermedia may have milder anaemia that appears later and may need transfusions only at times.",
    },

    { k: "h2", text: "Who is at risk in India" },
    {
      k: "p",
      text: "Thalassaemia trait is found across India and is more common in some communities and regions. Because carriers feel well, most do not know their status until they are tested or have an affected child. Marriage within the extended family raises the chance that both partners carry the same gene.",
    },
    {
      k: "p",
      text: "National Health Mission guidelines on haemoglobin disorders recommend that thalassaemia screening be offered to all pregnant women early in pregnancy, to adolescents through schools, and to individuals or couples who ask for it before marriage, with prenatal diagnosis offered to carrier couples and testing extended to relatives of carriers.",
    },

    { k: "h2", text: "How it is diagnosed, and carrier testing" },
    { k: "p", text: "Thalassaemia and thalassaemia trait are found with blood tests:" },
    {
      k: "ul",
      items: [
        "**Complete blood count** — carriers often have small red cells and a mildly low or normal haemoglobin.",
        "**Haemoglobin electrophoresis** or **HPLC** (high-performance liquid chromatography) — measures the types of haemoglobin and identifies beta thalassaemia trait and other variants such as sickle cell.",
        "**DNA testing** — identifies the exact gene change, needed for alpha thalassaemia and before prenatal diagnosis.",
        "**Serum ferritin** — checks iron levels, because iron deficiency can mask or mimic the carrier picture.",
      ],
    },
    {
      k: "p",
      text: "Thalassaemia trait is often mistaken for iron deficiency because both cause small red cells. Taking iron does not help a carrier who is not iron-deficient. Ask for a carrier test if you have small red cells that do not improve with iron.",
    },
    { k: "h3", text: "Testing before marriage or pregnancy" },
    {
      k: "p",
      text: "The best time to test is before marriage or before planning a pregnancy. If one partner is a carrier, the other should be tested. If both are carriers, a genetic counsellor or haematologist can explain the options.",
    },
    { k: "h3", text: "Testing during pregnancy" },
    {
      k: "p",
      text: "If a pregnant woman is found to be a carrier, her partner should be tested promptly. If both are carriers, prenatal diagnosis can show whether the baby is affected, usually by **chorionic villus sampling** (a small sample from the placenta) early in pregnancy, or by amniocentesis later. Testing early gives couples time to make informed decisions with their doctors.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [haematologist](/specialties/haematology) diagnoses thalassaemia, interprets carrier tests and leads care. Children are looked after jointly with a [paediatrician](/specialties/paediatrics), ideally at a thalassaemia day-care centre with a blood bank. An obstetrician and genetic counsellor help carrier couples during pregnancy. Heart, liver and hormone specialists join the team as children grow.",
    },
    {
      k: "p",
      text: "You can [find haematologists in Bengaluru](/doctors/karnataka/bengaluru/haematologists) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "ul",
      items: [
        "**Blood transfusion** — children with thalassaemia major need safe, screened blood every few weeks for life, keeping haemoglobin at a level that allows normal growth and activity.",
        "**Iron chelation** — repeated transfusions build up iron in the heart, liver and glands. Chelation medicines, taken by mouth or as infusions, remove it and are essential to long-term health.",
        "**Folic acid** — sometimes prescribed, especially in thalassaemia intermedia.",
        "**Bone marrow transplant** — a stem cell transplant from a matched donor, usually a brother or sister, can cure thalassaemia major in suitable children, best done early. It carries significant risks, which the transplant team will discuss.",
      ],
    },
    {
      k: "p",
      text: "Gene therapies have been developed abroad but are not widely available. Never stop chelation on your own, and do not take iron tablets unless a haematologist prescribes them.",
    },

    { k: "h2", text: "Living with it: follow-up" },
    {
      k: "ul",
      items: [
        "Regular blood counts and serum ferritin, with heart and liver iron scans (MRI) when advised",
        "Yearly checks of growth, puberty, thyroid, sugar, bones, hearing and eyes",
        "Vaccinations, including hepatitis B, and extra vaccines if the spleen has been removed",
        "School and psychological support for children and families",
        "Carrier testing for brothers, sisters and other relatives",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "High fever in someone with thalassaemia, especially if the spleen has been removed",
        "Breathlessness, chest pain, palpitations or swelling of the legs, which can signal heart strain from iron overload or severe anaemia",
        "Fever, chills, rash, back pain or breathlessness during or after a transfusion",
        "A child who is very pale, drowsy or unusually breathless",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Am I a carrier, or do I have a form of thalassaemia?",
        "Should my partner and family be tested?",
        "What are our chances of having an affected child, and what are our options?",
        "How often will my child need transfusions, and which chelation medicine is best for them?",
        "Is a bone marrow transplant possible, and are any siblings a match?",
        "Which checks are due this year?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is thalassaemia trait a disease?",
      a: "No. Carriers are usually healthy and need no treatment, though they may have mild anaemia. The importance lies in family planning: if both partners are carriers, each pregnancy has a chance of a child with thalassaemia major, so testing the partner is essential.",
    },
    {
      q: "When should couples get tested for thalassaemia?",
      a: "Ideally before marriage or before planning a pregnancy. If that has not happened, testing early in pregnancy, followed by testing the partner if the woman is a carrier, still allows time for prenatal diagnosis and informed decisions.",
    },
    {
      q: "Can thalassaemia major be cured?",
      a: "A bone marrow transplant from a well-matched donor can cure thalassaemia major in suitable children, particularly when done early. For others, regular transfusions and iron chelation allow people to grow, study, work and have families.",
    },
    {
      q: "Should carriers take iron tablets?",
      a: "Only if tests show they are also iron-deficient. Thalassaemia trait causes small red cells that look like iron deficiency on a blood count, but iron does not correct them and unnecessary iron can build up. A ferritin test helps your doctor decide.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Thalassemia", url: "https://medlineplus.gov/thalassemia.html" },
    { label: "National Health Mission, MoHFW — Guidelines on Hemoglobinopathies in India", url: "https://sickle.nhm.gov.in/uploads/guidelines/NHM_Guidelines_on_Hemoglobinopathies_in_India.pdf" },
  ],
};
