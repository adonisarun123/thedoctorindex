import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "lupus",
  title: "Lupus (SLE): symptoms, causes, treatment and which doctor to see",
  metaTitle: "Lupus (SLE): symptoms, tests and treatment",
  standfirst: "What lupus is, the symptoms that come and go, how it is diagnosed with blood and urine tests, treatments that control it, and why a rheumatologist matters.",
  targetQuery: "lupus symptoms and treatment",
  department: "rheumatology",
  specialty: "rheumatology",
  alsoSee: ["dermatology", "nephrology", "internal-medicine"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Joint pain", "Skin rash", "Fatigue", "Fever", "Mouth ulcers", "Hair loss"],
  tests: ["ANA test", "Anti-dsDNA", "Urine test", "Kidney biopsy"],
  treatments: ["Hydroxychloroquine", "Corticosteroids", "Immunosuppressants", "Biologic medicines", "Sun protection"],
  body: [
    { k: "h2", text: "What lupus is" },
    {
      k: "p",
      text: "Lupus is a long-term autoimmune disease. Normally the immune system protects the body against infections. In lupus it becomes overactive and attacks the body's own healthy tissues, causing inflammation that can affect the joints, skin, kidneys, blood cells, brain, heart and lungs.",
    },
    {
      k: "p",
      text: "There are several types. Systemic lupus erythematosus (SLE) is the most common and the most serious, because it can affect many organs. Cutaneous lupus, including discoid lupus, mainly affects the skin. Drug-induced lupus is caused by certain medicines and usually settles once the medicine is stopped. Neonatal lupus is a rare condition in babies of mothers who carry certain lupus antibodies.",
    },
    {
      k: "p",
      text: "Lupus typically comes and goes, with flares when symptoms worsen and periods of remission when they settle. It cannot be cured, but with modern treatment and regular follow-up, most people with lupus can work, study, raise families and lead full lives. Early diagnosis and treatment help protect organs, particularly the kidneys, from lasting damage.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Lupus is sometimes called a great imitator because its symptoms vary so much from person to person and can look like many other illnesses. Common symptoms include:",
    },
    {
      k: "ul",
      items: [
        "Joint pain, stiffness and swelling, often in the hands, wrists and knees",
        "A skin rash, such as a butterfly-shaped redness across the cheeks and nose, or scaly round patches",
        "A rash or worsening of symptoms after time in the sun",
        "Extreme fatigue that does not improve with rest",
        "Fever without an obvious infection",
        "Mouth ulcers or nose ulcers, often painless",
        "Hair loss, sometimes in patches",
        "Chest pain on breathing deeply, from inflammation of the lining of the lungs or heart",
        "Fingers or toes that turn white or blue in the cold",
        "Swelling of the legs or around the eyes, or frothy urine, which can be signs of kidney involvement",
      ],
    },
    {
      k: "p",
      text: "Kidney inflammation, called lupus nephritis, often causes no symptoms at first, which is why regular urine and blood tests are an essential part of care.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "The exact cause of lupus is not known. It is thought to result from a combination of genes, hormones and environmental triggers. It is not contagious, and you cannot catch it from or give it to anyone. Lupus is more likely in:",
    },
    {
      k: "ul",
      items: [
        "Women, particularly between the teenage years and middle age; it is far more common in women than in men",
        "People with a family member who has lupus or another autoimmune disease",
        "People of Asian, African and Hispanic descent, who tend to develop it more often and sometimes more severely",
      ],
    },
    {
      k: "p",
      text: "Known triggers for symptoms or flares include sunlight and other ultraviolet light, infections, physical or emotional stress, pregnancy and the weeks after delivery, and certain medicines.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "No single test confirms lupus. A doctor puts together your symptoms, a physical examination and test results, often over time, because symptoms may appear one by one. Tests commonly used include:",
    },
    {
      k: "ul",
      items: [
        "**ANA test** (antinuclear antibody) — positive in almost everyone with SLE, but also positive in many people who do not have lupus, so a positive result alone does not mean you have it",
        "**Anti-dsDNA** and other more specific antibodies, along with complement levels, which can also help track disease activity",
        "A complete blood count to look for anaemia and low white cells or platelets",
        "A **urine test** for protein and blood, and kidney function blood tests",
        "A skin biopsy for rashes, and a **kidney biopsy** if kidney involvement is suspected, to guide treatment",
        "Chest X-ray, ECG or echocardiogram if the heart or lungs may be involved",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment is tailored to which organs are affected and how active the disease is. The aims are to control symptoms, prevent flares, protect organs and keep side effects to a minimum.",
    },
    {
      k: "p",
      text: "**Hydroxychloroquine**, an antimalarial medicine, is the foundation of treatment for most people with SLE. It reduces flares and helps protect organs, and is usually continued long term, including during pregnancy when your doctor advises. Regular eye checks are recommended while taking it.",
    },
    {
      k: "p",
      text: "**Corticosteroids** act quickly to control inflammation during flares, but long-term use carries side effects, so doctors aim to use the lowest effective dose for the shortest time. **Immunosuppressants**, which calm the overactive immune system, are added for moderate or severe disease, especially kidney or brain involvement, and to reduce the need for steroids. **Biologic medicines**, targeted treatments given by drip or injection, are used for some people whose disease remains active despite standard treatment. Painkillers may help joint pain, but should be used only as advised because some can affect the kidneys.",
    },
    {
      k: "p",
      text: "**Sun protection** is part of treatment, not just advice: covering up, using a broad-spectrum sunscreen and avoiding the midday sun help prevent rashes and flares. Do not stop or change any lupus medicine on your own, even when you feel well, as this can trigger a serious flare.",
    },

    { k: "h2", text: "Living with lupus" },
    {
      k: "ul",
      items: [
        "Keep regular follow-up appointments and blood and urine tests, even when you feel well",
        "Learn your early signs of a flare, such as increased tiredness, joint pain, rash or fever, and contact your doctor early",
        "Balance activity with rest; gentle regular exercise helps fatigue, joints and mood",
        "Do not smoke, as smoking worsens lupus and raises heart risk",
        "Ask about vaccinations, as lupus and its treatment can increase the risk of infections",
        "Plan pregnancy with your rheumatologist: pregnancy is usually safest when lupus has been quiet for some months, and some medicines must be changed beforehand",
        "Seek support for low mood or anxiety, which are common with a long-term illness",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if you have lupus and develop:" },
    {
      k: "ul",
      items: [
        "Chest pain or severe breathlessness",
        "A seizure, sudden confusion, severe headache, or weakness on one side of the body",
        "A high fever, especially while on steroids or immunosuppressants, as infections can become serious quickly",
        "Sudden swelling of the legs with very little urine",
        "A painful, swollen leg, or bleeding that will not stop",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [rheumatologist](/specialties/rheumatology) is the specialist who diagnoses lupus and leads its treatment. A [general physician](/specialties/general-practice) or [internal medicine specialist](/specialties/internal-medicine) may first suspect it and order tests. Depending on the organs involved, care is often shared with a [dermatologist](/specialties/dermatology) for skin lupus, a [nephrologist](/specialties/nephrology) for kidney involvement, and an obstetrician during pregnancy.",
    },
    {
      k: "p",
      text: "You can [find rheumatologists in Bengaluru](/doctors/karnataka/bengaluru/rheumatologists), [dermatologists in Bengaluru](/doctors/karnataka/bengaluru/dermatologists) or [nephrologists in Bengaluru](/doctors/karnataka/bengaluru/nephrologists) on The Doctor Index, each with a registration you can check. Joint symptoms in lupus can resemble [rheumatoid arthritis](/conditions/rheumatoid-arthritis), and kidney involvement can lead to [chronic kidney disease](/conditions/chronic-kidney-disease) if not controlled.",
    },
  ],
  faqs: [
    {
      q: "Is lupus contagious?",
      a: "No. Lupus is an autoimmune disease, not an infection, so it cannot be passed to another person through touch, food, sharing utensils or sexual contact. Family members may have a slightly higher chance of autoimmune disease because of shared genes.",
    },
    {
      q: "Can women with lupus have a healthy pregnancy?",
      a: "Yes, many women with lupus have healthy pregnancies. The safest time is when the disease has been under control for some months. Pregnancy should be planned with your rheumatologist and obstetrician, because some medicines need changing and closer monitoring is needed throughout.",
    },
    {
      q: "My ANA test is positive. Do I have lupus?",
      a: "Not necessarily. A positive ANA test is found in many healthy people and in several other conditions. Lupus is diagnosed only when a positive test is combined with typical symptoms, examination findings and other test results. A rheumatologist can interpret the result for you.",
    },
    {
      q: "Is hydroxychloroquine safe to take long term?",
      a: "For most people, yes. It is one of the most important lupus medicines and is generally well tolerated. Because it can rarely affect the retina, regular eye examinations are recommended while you take it. Your doctor will decide the right dose for you.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Lupus", url: "https://medlineplus.gov/lupus.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
