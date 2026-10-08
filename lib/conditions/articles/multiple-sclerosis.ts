import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "multiple-sclerosis",
  title: "Multiple sclerosis (MS): symptoms, MRI, treatment and doctors",
  metaTitle: "Multiple sclerosis (MS): symptoms, MRI and treatment",
  standfirst: "What multiple sclerosis is, early symptoms such as vision loss and numbness, how MRI confirms it, and how disease-modifying treatment and rehab help.",
  targetQuery: "multiple sclerosis symptoms and treatment",
  department: "neurology",
  specialty: "neurology",
  alsoSee: ["ophthalmology", "physical-medicine-rehabilitation", "physiotherapy"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Blurred vision", "Numbness", "Weakness", "Fatigue", "Balance problems", "Bladder problems"],
  tests: ["MRI", "Lumbar puncture", "Evoked potentials", "Blood tests"],
  treatments: ["Disease-modifying therapies", "Steroids for relapses", "Rehabilitation"],
  body: [
    { k: "h2", text: "What multiple sclerosis is" },
    {
      k: "p",
      text: "Multiple sclerosis, usually called MS, is a long-term condition of the brain and spinal cord. Nerve fibres in these areas are wrapped in a protective coating called myelin, which helps signals travel quickly. In MS, the immune system mistakenly attacks this coating, causing patches of inflammation. Where the myelin is damaged, signals slow down or are blocked, and over time the nerve fibres themselves can be damaged. Healing leaves scar-like areas, the sclerosis that gives the condition its name.",
    },
    {
      k: "p",
      text: "MS most often starts between the ages of twenty and forty, and it affects women more often than men. It is not contagious and is not directly inherited. Its course varies widely. Some people have occasional mild attacks and live with little disability for decades; others have steady progression. Modern treatments have changed the outlook considerably, especially when started early.",
    },

    { k: "h2", text: "Types of MS" },
    {
      k: "ul",
      items: [
        "Clinically isolated syndrome — a first episode of symptoms that may or may not go on to become MS",
        "Relapsing-remitting MS — the most common form at diagnosis, with attacks (relapses) followed by partial or full recovery",
        "Secondary progressive MS — after years of relapsing-remitting disease, disability gradually increases, with or without relapses",
        "Primary progressive MS — steady worsening from the start, without clear attacks",
      ],
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms depend on which part of the brain or spinal cord is affected, and they differ from person to person. A relapse usually develops over hours to days and lasts at least a day, often weeks. Common symptoms include:",
    },
    {
      k: "ul",
      items: [
        "Blurred vision or loss of vision in one eye, often with pain on moving the eye (optic neuritis), or double vision",
        "Numbness, tingling or a band-like feeling in the limbs or trunk",
        "Weakness or stiffness in the arms or legs",
        "Fatigue that is out of proportion to activity",
        "Balance problems, dizziness and clumsiness",
        "Bladder problems such as urgency or frequency, and bowel or sexual difficulties",
        "An electric-shock feeling down the back when bending the neck forward",
        "Problems with memory, concentration, or low mood",
      ],
    },
    {
      k: "p",
      text: "Heat, such as a hot bath or the Indian summer, and fever can temporarily make existing symptoms worse. This is not a new relapse and settles when the body cools.",
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "The exact cause is not known. It is thought to result from a combination of genetic make-up and environmental factors. Many genes each add a small amount of risk, the most important being in the HLA region that controls the immune system. Having a close relative with MS raises the risk somewhat, though most people with MS have no affected relatives. Other factors linked to MS include previous infection with the Epstein-Barr virus (the cause of [glandular fever](/conditions/infectious-mononucleosis)), low vitamin D levels, smoking and obesity in adolescence.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "There is no single test for MS. A neurologist puts together your history, a neurological examination and test results, and looks for evidence of damage in different parts of the nervous system at different times, while ruling out conditions that can look similar.",
    },
    {
      k: "ul",
      items: [
        "**MRI** of the brain and spinal cord — the most important test. It shows areas of damage (lesions), and a contrast injection can show which are active. MRI is repeated over time to monitor the disease.",
        "**Lumbar puncture** — a sample of spinal fluid is taken from the lower back with a thin needle and checked for signs of inflammation, such as oligoclonal bands.",
        "**Evoked potentials** — measure how quickly the nerves carry signals from the eyes or limbs to the brain.",
        "**Blood tests** — to rule out mimics such as vitamin B12 deficiency, thyroid problems, infections and other autoimmune conditions. Tests for neuromyelitis optica spectrum disorder (NMOSD) and related antibody conditions are important, because they can look like MS but need different treatment.",
        "Eye examination and optical coherence tomography, often with an ophthalmologist, when vision is affected.",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "MS cannot be cured, but treatment can reduce relapses, slow the build-up of disability, and ease symptoms. Plans are tailored to the type of MS, how active it is, and your circumstances, including pregnancy plans.",
    },
    { k: "h3", text: "Disease-modifying therapies" },
    {
      k: "p",
      text: "**Disease-modifying therapies** act on the immune system to reduce attacks and new lesions. They include injections, tablets and infusions, with differing strengths and side effects. Starting early in relapsing MS gives the best chance of limiting long-term damage. A few treatments are also used in some forms of progressive MS. Your neurologist will discuss options, monitoring blood tests and MRI scans, and cost and availability.",
    },
    { k: "h3", text: "Steroids for relapses" },
    {
      k: "p",
      text: "A significant relapse may be treated with a short course of high-dose **steroids for relapses**, given by drip or tablets. They speed recovery from the attack but do not change the long-term course. Before treating, doctors check for infection, such as a urine infection, that can make symptoms flare.",
    },
    { k: "h3", text: "Rehabilitation and symptom care" },
    {
      k: "p",
      text: "**Rehabilitation** with physiotherapy and occupational therapy helps with strength, balance, walking, fatigue and daily tasks. Specific treatments help muscle stiffness and spasms, bladder urgency, nerve pain, low mood and fatigue. Counselling and support groups help many people adjust after diagnosis.",
    },

    { k: "h2", text: "Living with MS" },
    {
      k: "ul",
      items: [
        "Take disease-modifying treatment regularly and keep MRI and blood test appointments",
        "Stay active; regular exercise suited to your ability helps fitness, mood and fatigue",
        "Stop smoking, which is linked to faster progression",
        "Ask your doctor whether your vitamin D level needs checking",
        "Pace your day and plan rest to manage fatigue; keep cool in hot weather",
        "Plan pregnancy with your neurologist, as some medicines must be stopped beforehand; many women with MS have healthy pregnancies",
      ],
    },

    { k: "h2", text: "When to get urgent help" },
    {
      k: "p",
      text: "Contact your neurologist promptly if you have new symptoms lasting more than a day, as this may be a relapse. Call 112 or 108, or go to the nearest emergency department, if you have sudden weakness of one side of the face or body, sudden loss of speech, sudden severe vision loss, difficulty swallowing or breathing, a seizure, or cannot pass urine. Sudden symptoms can also be a [stroke](/conditions/stroke), which needs emergency care.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [neurologist](/specialties/neurology), ideally one with experience in MS and related conditions, makes the diagnosis and leads treatment. An [ophthalmologist](/specialties/ophthalmology) helps assess vision problems. A [rehabilitation physician](/specialties/physical-medicine-rehabilitation), [physiotherapist](/specialties/physiotherapy) and occupational therapist support daily function.",
    },
    {
      k: "p",
      text: "You can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists), [rehabilitation physicians in Bengaluru](/doctors/karnataka/bengaluru/rehabilitation-physicians) or [physiotherapists in Bengaluru](/doctors/karnataka/bengaluru/physiotherapists) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Does MS always lead to a wheelchair?",
      a: "No. Many people with MS never need a wheelchair, and modern disease-modifying therapies have improved the outlook further. The course varies widely from person to person. Starting treatment early and staying active give the best chance of staying independent.",
    },
    {
      q: "Is multiple sclerosis hereditary?",
      a: "MS is not passed on directly like some genetic diseases. Many genes each add a small amount of risk, so children and siblings of someone with MS have a somewhat higher chance than the general population, but most will never develop it.",
    },
    {
      q: "Is MS found in India?",
      a: "Yes. MS is diagnosed in India, though it has traditionally been reported less often than in Europe and North America. Conditions that mimic MS, such as neuromyelitis optica spectrum disorder, also occur, so specialist evaluation and the right tests matter.",
    },
    {
      q: "Can women with MS have children?",
      a: "Yes. Many women with MS have healthy pregnancies and babies. Relapses often become less frequent during pregnancy and may increase for a few months after delivery. Plan ahead with your neurologist, because some treatments need to be stopped before conception.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Multiple Sclerosis", url: "https://medlineplus.gov/multiplesclerosis.html" },
    { label: "MedlinePlus Genetics — Multiple sclerosis", url: "https://medlineplus.gov/genetics/condition/multiple-sclerosis" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
