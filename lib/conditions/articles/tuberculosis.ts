import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "tuberculosis",
  title: "Tuberculosis (TB): symptoms, tests, free treatment in India",
  standfirst: "What TB is, the symptoms that should prompt a test, how it is diagnosed, why the full course matters, and the free care available in India.",
  targetQuery: "tuberculosis symptoms and treatment India",
  department: "infectious-diseases",
  specialty: "pulmonology",
  alsoSee: ["infectious-diseases", "general-practice"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Cough lasting more than two weeks", "Fever", "Night sweats", "Weight loss", "Loss of appetite", "Coughing up blood"],
  tests: ["Sputum test", "NAAT", "Chest X-ray", "Drug-susceptibility testing"],
  treatments: ["Combination antibiotics", "Treatment for drug-resistant TB", "TB preventive treatment"],
  body: [
    { k: "h2", text: "What tuberculosis is" },
    {
      k: "p",
      text: "Tuberculosis (TB) is an infection caused by a bacterium, *Mycobacterium tuberculosis*. It most often affects the lungs, but it can affect almost any part of the body — the lymph glands, spine, abdomen, kidneys, the covering of the brain and more.",
    },
    {
      k: "p",
      text: "TB of the lungs spreads through the air when a person with active disease coughs, sneezes or talks and others breathe in the bacteria. It does not spread through handshakes, shared utensils, clothes or food. People usually catch it from someone they spend a lot of time with, such as family members or co-workers.",
    },
    {
      k: "p",
      text: "Not everyone who breathes in the bacteria becomes ill. Many people carry a **TB infection** that is kept in check by the immune system: they feel well and cannot pass it on. In some, often years later, the infection becomes active **TB disease**. TB disease can be treated successfully when the full course of medicines is completed.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "Symptoms usually build up slowly over weeks. The common ones are:" },
    {
      k: "ul",
      items: [
        "Cough lasting more than two weeks, with or without phlegm",
        "Fever, often in the evening",
        "Night sweats",
        "Weight loss and loss of appetite",
        "Tiredness and weakness",
        "Coughing up blood, or chest pain",
      ],
    },
    {
      k: "p",
      text: "TB outside the lungs causes symptoms depending on where it is: a painless swelling in the neck, back pain, abdominal swelling, or headache and drowsiness. Children may simply fail to gain weight. Some people with TB, particularly early on, have few or no symptoms. A cough that does not settle in a couple of weeks should be tested, not treated with repeated cough syrups or antibiotics.",
    },

    { k: "h2", text: "Who is at higher risk in India" },
    {
      k: "p",
      text: "TB remains common in India, so many people will be exposed to it at some point. Infection turns into disease more easily in people whose immunity is weaker. Your risk is higher if you:",
    },
    {
      k: "ul",
      items: [
        "Live with or care for someone with TB of the lungs",
        "Have diabetes, especially if it is poorly controlled",
        "Have HIV, or take medicines that suppress the immune system, including long-term steroids",
        "Are undernourished or underweight",
        "Smoke, chew tobacco or drink heavily",
        "Have had TB before, particularly if treatment was not completed",
        "Live or work in crowded, poorly ventilated places",
      ],
    },
    { k: "p", text: "Young children and older adults are also more vulnerable to serious forms of TB." },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "ul",
      items: [
        "**Sputum test** — phlegm coughed up from deep in the chest, usually early in the morning, is examined for TB bacteria under a microscope.",
        "**NAAT** — a rapid molecular test on sputum or other samples, such as CBNAAT or Truenat, which detects TB and also shows whether it is resistant to rifampicin, one of the main TB medicines.",
        "**Chest X-ray** — shows changes in the lungs and helps decide who needs testing, but cannot confirm TB alone.",
        "**Drug-susceptibility testing** — further tests to see which medicines will work, especially when resistance is found or suspected.",
      ],
    },
    {
      k: "p",
      text: "TB outside the lungs may need a scan and a sample from the affected area, such as fluid or a biopsy. Skin and blood tests can show TB infection, but they cannot tell infection from active disease. Anyone diagnosed with TB should also be tested for HIV and diabetes, because both change how TB is managed.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) or a government health centre can start the tests. A [pulmonologist](/specialties/pulmonology) treats TB of the lungs and complicated cases, and an [infectious disease specialist](/specialties/infectious-diseases) helps with drug-resistant TB, TB with HIV and TB outside the lungs. Other specialists are involved depending on the organ affected.",
    },
    {
      k: "p",
      text: "You can [find pulmonologists in Bengaluru](/doctors/karnataka/bengaluru/pulmonologists) or [infectious disease specialists in Bengaluru](/doctors/karnataka/bengaluru/infectious-disease-specialists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment, and free care in India" },
    {
      k: "p",
      text: "TB is treated with **combination antibiotics** — several medicines taken together, every day, for a number of months. For drug-sensitive TB, treatment usually lasts around six months, and some forms need longer. **Treatment for drug-resistant TB** uses different medicines and usually takes longer; newer all-oral regimens have made it more manageable than before.",
    },
    {
      k: "p",
      text: "Most people feel much better within a few weeks. This is the dangerous point at which some stop. Stopping early, or taking medicines irregularly, lets the bacteria come back and can make them resistant, which is harder to treat for you and for anyone you infect. Never stop or change TB medicines on your own. If you have side effects — such as nausea, yellow eyes, a rash, tingling in the feet or problems with vision — tell your doctor straight away rather than stopping.",
    },
    { k: "h3", text: "What the national programme provides" },
    {
      k: "p",
      text: "Under India's National TB Elimination Programme (NTEP), diagnosis and quality-assured TB medicines are free at government facilities. TB patients are registered on **Ni-kshay**, the programme's online case-management system, which is used by both government and private providers. Patients notified to the programme receive monthly nutrition support paid directly into their bank account under the Ni-kshay Poshan Yojana. You can call the national TB helpline, Ni-kshay Sampark, on 1800-11-6666 for information. If you are treated by a private doctor, ask whether your case has been notified so that you can use these services.",
    },
    { k: "h3", text: "Protecting the family" },
    {
      k: "p",
      text: "People living with someone who has TB of the lungs should be checked for symptoms and may be offered tests. Some, especially young children and people with weak immunity, are offered **TB preventive treatment** to stop infection becoming disease. After a few weeks of effective treatment, most people with drug-sensitive TB are much less infectious.",
    },

    { k: "h2", text: "Living with TB" },
    {
      k: "ul",
      items: [
        "Take every dose; use a pill box, phone reminder or a treatment supporter",
        "Cover your mouth when coughing, especially in the early weeks, and keep rooms airy",
        "Eat well — nutrition helps recovery",
        "Stop smoking and avoid alcohol, which also raises the risk of liver side effects",
        "Keep diabetes well controlled",
        "Attend every follow-up visit and repeat test, including at the end of treatment",
      ],
    },
    {
      k: "p",
      text: "TB still carries stigma. It is an infection like any other, it is treatable, and people return to work, school and family life. You are not required to tell your employer your diagnosis, but your doctor can advise when it is safe to go back.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Coughing up a large amount of blood",
        "Severe breathlessness or chest pain",
        "Confusion, severe headache with neck stiffness, fits or unusual drowsiness",
        "Yellow eyes with vomiting or abdominal pain while on TB medicines",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is this TB disease or TB infection, and where is it?",
        "Has a test checked for drug resistance?",
        "How long will treatment last, and what side effects should I report?",
        "Has my case been notified on Ni-kshay, and how do I get nutrition support?",
        "When will I stop being infectious?",
        "Who in my family should be tested or treated?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can TB be treated completely?",
      a: "Yes. TB can be treated successfully when the full course of medicines is taken regularly, even though it lasts months. Drug-resistant TB takes longer and needs different medicines, but it too is treatable. Stopping early is the main reason treatment fails.",
    },
    {
      q: "Is TB treatment really free in India?",
      a: "Yes. Under the National TB Elimination Programme, TB tests and quality-assured medicines are provided free at government health facilities, and notified patients receive monthly nutrition support through the Ni-kshay Poshan Yojana. The Ni-kshay Sampark helpline, 1800-11-6666, can tell you where to go.",
    },
    {
      q: "Can I live with my family while I have TB?",
      a: "Usually yes. Infectiousness falls quickly once effective treatment starts. Cover coughs, keep rooms well ventilated and follow your doctor's advice about the early weeks. Household members should be checked, and some may be offered preventive treatment.",
    },
    {
      q: "Can TB come back after treatment?",
      a: "It can, particularly if treatment was incomplete, if immunity is weak, or through a new infection. Report any return of cough, fever or weight loss promptly. Completing the full course and keeping follow-up appointments gives you the best chance of staying well.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Tuberculosis", url: "https://medlineplus.gov/tuberculosis.html" },
    { label: "World Health Organization — Tuberculosis fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/tuberculosis" },
    { label: "Directorate General of Health Services, MoHFW — National Tuberculosis Elimination Programme", url: "https://dghs.mohfw.gov.in/national-tuberculosis-elimination-programme.php" },
    { label: "Central TB Division — Ni-kshay Poshan Yojana and TB helpline (Ni-kshay Sampark)", url: "https://tbcindia.nikshay.in/ni-kshay-poshan-yojana/" },
  ],
};
