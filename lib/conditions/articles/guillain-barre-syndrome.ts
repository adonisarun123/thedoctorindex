import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "guillain-barre-syndrome",
  title: "Guillain-Barré syndrome (GBS): symptoms, causes and treatment",
  metaTitle: "Guillain-Barré syndrome: symptoms, treatment, doctor",
  standfirst: "What Guillain-Barré syndrome is, the early signs of rising weakness, why it needs hospital care, how it is treated, and what recovery looks like.",
  targetQuery: "guillain barre syndrome symptoms and treatment",
  department: "neurology",
  specialty: "neurology",
  alsoSee: ["emergency-medicine", "critical-care", "physical-medicine-rehabilitation", "physiotherapy"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Tingling", "Leg weakness", "Loss of reflexes", "Difficulty walking", "Facial weakness", "Breathing difficulty"],
  tests: ["Nerve conduction studies", "Lumbar puncture", "Breathing tests", "Stool tests"],
  treatments: ["Immunoglobulin", "Plasma exchange", "Ventilator support", "Physiotherapy", "Rehabilitation"],
  body: [
    { k: "h2", text: "What Guillain-Barré syndrome is" },
    {
      k: "p",
      text: "Guillain-Barré syndrome (GBS) is an uncommon condition in which the body's immune system mistakenly attacks the peripheral nerves, the nerves that run from the brain and spinal cord to the muscles and skin. Damaged nerves cannot carry signals properly, so muscles become weak and sensation changes. It is pronounced roughly \"ghee-YAN bah-RAY\".",
    },
    {
      k: "p",
      text: "GBS usually develops over days to a few weeks, reaches its worst point, levels off, and then slowly improves. In some people it stays mild. In others the weakness spreads to the arms, face and the muscles used for breathing and swallowing, which is life-threatening. Because no one can predict at the start how far it will go, GBS is treated as a medical emergency and people are watched closely in hospital.",
    },
    {
      k: "p",
      text: "There are several forms. The commonest damages the insulating coat of the nerves (myelin). Other forms damage the nerve fibres themselves, and a variant called Miller Fisher syndrome mainly affects eye movements, balance and reflexes.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "The first signs are often in the feet and legs and then climb upwards, usually on both sides of the body at once:",
    },
    {
      k: "ul",
      items: [
        "Tingling, pins and needles or numbness in the toes and fingers",
        "Leg weakness that makes climbing stairs, getting up from the floor or walking harder day by day",
        "Difficulty walking, unsteadiness or frequent falls",
        "Loss of reflexes, which a doctor finds on examination",
        "Deep aching pain in the back, buttocks or legs, which can be severe",
        "Facial weakness, double vision, or trouble speaking, chewing or swallowing",
        "Breathing difficulty in more severe cases",
        "Fast or irregular heartbeat, swings in blood pressure, and bladder or bowel problems, because the nerves that control these can be affected",
      ],
    },
    {
      k: "p",
      text: "Weakness that spreads over days, with tingling and loss of reflexes, should never be put down to tiredness, a vitamin problem or a back strain without a proper examination.",
    },

    { k: "h2", text: "Causes and triggers" },
    {
      k: "p",
      text: "The exact cause is not known. In most people GBS follows an infection a few days to a few weeks earlier, usually a stomach upset with diarrhoea or a respiratory infection. The immune system makes antibodies to fight the germ, and in a small number of people those antibodies also react with parts of the nerves.",
    },
    {
      k: "ul",
      items: [
        "Gut infection with the bacterium Campylobacter, often picked up from contaminated water or undercooked chicken, is one of the best-known triggers. Clusters of GBS linked to contaminated drinking water have been reported in India.",
        "Viral infections such as flu, cytomegalovirus, Epstein-Barr virus, Zika and COVID-19 have also been linked",
        "Rarely, surgery or a vaccination comes before GBS. The link with vaccines is very rare, and for most people the benefit of recommended vaccines is far greater than this risk",
      ],
    },
    {
      k: "p",
      text: "GBS is not contagious and is almost never inherited, although the infection that triggered it may be. Safe drinking water, hand washing, and well-cooked food lower the chance of the [foodborne illness](/conditions/foodborne-illness) and [diarrhoea](/conditions/diarrhea) that can come before it.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Diagnosis rests mainly on the pattern a neurologist sees: weakness on both sides that has been getting worse, and reflexes that are reduced or absent. Tests help confirm it and rule out other causes such as a spinal cord problem, a [stroke](/conditions/stroke), low potassium or other nerve diseases:",
    },
    {
      k: "ul",
      items: [
        "**Nerve conduction studies** — small electrical pulses measure how well the nerves carry signals. Results can be normal in the first days and may be repeated.",
        "**Lumbar puncture** (spinal tap) — a sample of the fluid around the spinal cord. In GBS the protein level is often raised while the cell count stays normal, though this may also take time to appear.",
        "**Breathing tests** at the bedside, repeated regularly, to catch weakening breathing muscles early",
        "Blood tests, **stool tests** for a recent infection, and sometimes an MRI of the spine",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Anyone suspected of having GBS should be admitted to hospital, ideally one with a neurologist and an intensive care unit. Two treatments can speed recovery when given early, usually within the first couple of weeks:",
    },
    {
      k: "ul",
      items: [
        "**Immunoglobulin** (IVIG) — antibodies collected from donated blood, given through a drip over several days, which calm the harmful immune attack",
        "**Plasma exchange** (plasmapheresis) — the blood is passed through a machine that removes the liquid part containing harmful antibodies and replaces it",
      ],
    },
    {
      k: "p",
      text: "Both work about as well as each other; the choice depends on the person and what the hospital can offer. Steroid tablets or injections are not effective for GBS.",
    },
    {
      k: "p",
      text: "Supportive care is just as important. Some people need **ventilator support** in intensive care if breathing weakens, and a feeding tube if swallowing is unsafe. The team watches heart rhythm and blood pressure, treats pain, prevents blood clots and bed sores, and manages the bladder and bowels.",
    },

    { k: "h2", text: "Recovery and rehabilitation" },
    {
      k: "p",
      text: "Most people with GBS recover well, but recovery is slow and can take weeks, months, or for some a year or more. Some are left with weakness, numbness, pain or tiredness. **Physiotherapy** starts early in hospital, and **rehabilitation** continues afterwards with occupational therapy and, where needed, speech and swallowing therapy. GBS returns in only a small minority of people.",
    },
    {
      k: "ul",
      items: [
        "Set small goals and expect good and bad weeks",
        "Ask about aids such as walkers or splints while strength returns",
        "Talk about low mood or anxiety; long illness and sudden loss of independence are hard",
        "Ask your neurologist about timing of future vaccinations",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if weakness or tingling is spreading over hours or days, and especially if there is:" },
    {
      k: "ul",
      items: [
        "Breathlessness, or difficulty taking a deep breath or counting aloud in one breath",
        "Difficulty swallowing, choking on food or saliva, or a weak voice",
        "Inability to stand or walk",
        "A racing heartbeat, fainting, or severe pain with weakness",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Suspected GBS needs an emergency department and a [neurologist](/specialties/neurology) quickly, not a routine clinic appointment. Care in hospital often involves [critical care](/specialties/critical-care) specialists. Afterwards, a [rehabilitation physician](/specialties/physical-medicine-rehabilitation) and a [physiotherapist](/specialties/physiotherapy) guide recovery.",
    },
    {
      k: "p",
      text: "You can [find neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists) or [rehabilitation physicians in Bengaluru](/doctors/karnataka/bengaluru/rehabilitation-physicians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Is Guillain-Barré syndrome contagious?",
      a: "No. GBS itself does not spread from person to person. The infection that sometimes triggers it, such as a stomach bug or flu, can spread, which is why clusters of cases are occasionally seen after contaminated water or food.",
    },
    {
      q: "How long does it take to recover from GBS?",
      a: "It varies widely. Weakness usually peaks within a few weeks, then improvement begins. Many people walk again within months, but full recovery can take a year or longer, and some have lasting weakness or tiredness.",
    },
    {
      q: "Can GBS happen after a vaccine?",
      a: "Very rarely, GBS has been reported after some vaccines. The risk is much smaller than the risk from the infections those vaccines prevent, and infections themselves are a far more common trigger. Discuss future vaccines with your neurologist.",
    },
    {
      q: "Can Guillain-Barré syndrome come back?",
      a: "It returns in only a small number of people. If weakness keeps worsening for more than about two months, or relapses repeatedly, doctors consider a related long-term condition called CIDP, which is treated differently.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Guillain-Barre Syndrome", url: "https://medlineplus.gov/guillainbarresyndrome.html" },
    { label: "MedlinePlus Genetics — Guillain-Barré syndrome", url: "https://medlineplus.gov/genetics/condition/guillain-barre-syndrome" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
