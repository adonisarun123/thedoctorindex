import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "leishmaniasis",
  title: "Leishmaniasis and kala-azar: symptoms, tests and treatment",
  standfirst: "What leishmaniasis and kala-azar are, how sand flies spread them, the symptoms of the skin and internal forms, the tests used in India, and treatment.",
  targetQuery: "kala azar symptoms and treatment",
  department: "infectious-diseases",
  specialty: "infectious-diseases",
  alsoSee: ["general-practice", "dermatology", "internal-medicine"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Long-lasting fever", "Weight loss", "Enlarged spleen", "Darkening of the skin", "Skin sores"],
  tests: ["rK39 rapid test", "Blood count", "Bone marrow or spleen sample", "Skin scraping or biopsy"],
  treatments: ["Antiparasitic medicines", "Liposomal amphotericin B", "Nutritional support", "Bed net"],
  body: [
    { k: "h2", text: "What leishmaniasis is" },
    {
      k: "p",
      text: "Leishmaniasis is an infection caused by a tiny parasite called Leishmania. It is spread by the bite of infected female sand flies, small insects much smaller than mosquitoes that bite mostly between dusk and dawn and breed in cracks in mud walls, damp soil and cattle sheds. It is a disease of poverty, linked to poor housing, undernutrition and weak immunity.",
    },
    { k: "p", text: "There are three main forms:" },
    {
      k: "ul",
      items: [
        "**Visceral leishmaniasis**, known in India as **kala-azar** (\"black fever\"), affects internal organs such as the spleen, liver and bone marrow. Without treatment it is usually fatal.",
        "**Cutaneous leishmaniasis** causes skin sores, usually where a sand fly bit.",
        "**Mucocutaneous leishmaniasis** damages the lining of the nose and mouth; it is very rare in India.",
      ],
    },
    {
      k: "p",
      text: "A further condition, **post-kala-azar dermal leishmaniasis** (PKDL), can appear months or years after kala-azar treatment, as pale or raised patches and bumps on the face and body. People with PKDL can carry the parasite in their skin, so it is important to treat it even though it is not painful.",
    },

    { k: "h2", text: "Where it occurs in India" },
    {
      k: "p",
      text: "In India, kala-azar has mainly been found in parts of Bihar, Jharkhand, West Bengal and Uttar Pradesh, and sporadic cases are reported elsewhere. Public health teams in affected districts carry out indoor spraying against sand flies and active searches for cases, and the number of cases has fallen a great deal over the years. Cutaneous leishmaniasis is seen in some dry areas of north-western India, such as parts of Rajasthan, and in some hilly areas. People who have lived in or travelled to these areas, or abroad to parts of the Middle East, Africa or South America, should mention it to their doctor.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "h3", text: "Kala-azar (visceral leishmaniasis)" },
    {
      k: "p",
      text: "Symptoms build up slowly over weeks to months after infection:",
    },
    {
      k: "ul",
      items: [
        "Long-lasting fever, often irregular, that does not settle with usual treatment for malaria or typhoid",
        "Weight loss and weakness, while appetite may stay fairly normal",
        "Enlarged spleen, and often liver, causing a swollen, heavy abdomen",
        "Paleness and tiredness from [anaemia](/conditions/anemia)",
        "Darkening of the skin, especially of the face, hands and abdomen, which gave the disease its name",
        "Bleeding from the nose or gums, and frequent infections, because blood counts fall",
      ],
    },
    { k: "h3", text: "Cutaneous leishmaniasis" },
    {
      k: "p",
      text: "Skin sores start as a small red bump at the bite site, slowly grow into a painless ulcer or crusted nodule, and may take months to heal, leaving a scar. They are often on exposed areas like the face, arms and legs. A slow-healing skin sore in someone from or returning from an affected area should be checked.",
    },

    { k: "h2", text: "Who is at higher risk" },
    {
      k: "ul",
      items: [
        "People living in affected villages, especially in mud houses with damp floors near animal sheds",
        "Children and adults with undernutrition",
        "People with weakened immunity, particularly those living with [HIV](/conditions/hiv), in whom kala-azar can be more severe and more likely to return",
        "Migrant workers returning to or from affected districts",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Kala-azar can be mistaken for [malaria](/conditions/malaria), [tuberculosis](/conditions/tuberculosis), typhoid or blood cancers, which also cause long fever, weight loss and a large spleen. The doctor will ask where you have lived and travelled, examine your abdomen, and arrange tests:",
    },
    {
      k: "ul",
      items: [
        "**rK39 rapid test** — a finger-prick blood test that detects antibodies and is widely used in India for people with suspected kala-azar. A positive result together with typical symptoms supports the diagnosis.",
        "**Blood count** — low red cells, white cells and platelets are common.",
        "**Bone marrow or spleen sample** — looking for the parasite under the microscope, used when the diagnosis is uncertain, in relapse, or in people with HIV, where antibody tests can be less reliable.",
        "**Skin scraping or biopsy** for skin sores and PKDL.",
        "An HIV test is usually advised, because the two infections affect each other's treatment.",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Kala-azar is treatable, and treatment should start soon after diagnosis. It is given under medical supervision, usually in a hospital or treatment centre, because the medicines need monitoring for side effects.",
    },
    {
      k: "ul",
      items: [
        "**Antiparasitic medicines** kill the parasite. In India, **liposomal amphotericin B**, given through a drip, is widely used; some people receive other medicines or combinations depending on their situation. The doctor chooses the medicine and duration.",
        "Older antimony-based medicines are now used much less in India, because the parasite in some areas became resistant to them.",
        "**Nutritional support**, treatment of anaemia and of any bleeding or other infections are part of care.",
        "PKDL and cutaneous leishmaniasis are treated too, sometimes with different medicines or local treatment for skin sores.",
      ],
    },
    {
      k: "p",
      text: "Some antiparasitic medicines must not be taken in pregnancy and need reliable contraception during and after the course; ask your doctor. After treatment, follow-up visits are needed to make sure the fever, spleen and blood counts settle and to watch for relapse or PKDL.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "p",
      text: "There is no vaccine. Prevention depends on avoiding sand fly bites and on early treatment of people who are infected, which stops them spreading the parasite to sand flies:",
    },
    {
      k: "ul",
      items: [
        "Sleep under a bed net, ideally an insecticide-treated one",
        "Cover arms and legs and use insect repellent between dusk and dawn",
        "Allow indoor spraying teams into the house, and do not re-plaster walls soon after spraying",
        "Fill cracks in mud walls and floors, and keep animal sheds away from sleeping areas where possible",
        "See a doctor early for any fever lasting more than two weeks in an affected area",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if someone with suspected or diagnosed kala-azar has:" },
    {
      k: "ul",
      items: [
        "Heavy bleeding from the nose, gums, or in vomit or stool",
        "Severe breathlessness, extreme paleness or fainting",
        "High fever with confusion or drowsiness",
        "Sudden severe abdominal pain",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) or internal medicine doctor is usually the first to see a long fever. Kala-azar is managed by physicians and [infectious disease specialists](/specialties/infectious-diseases), often at government hospitals and designated treatment centres in affected areas. Skin sores and PKDL may also be seen by a [dermatologist](/specialties/dermatology).",
    },
    {
      k: "p",
      text: "You can [find infectious disease specialists in Bengaluru](/doctors/karnataka/bengaluru/infectious-disease-specialists) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Is kala-azar contagious from person to person?",
      a: "Not through ordinary contact. It spreads through the bite of an infected sand fly. Because sand flies can pick up the parasite from an infected person, early treatment of everyone with kala-azar or PKDL helps protect the rest of the village.",
    },
    {
      q: "Can kala-azar be treated completely?",
      a: "With proper treatment most people recover well. Some relapse, particularly people with HIV or poor nutrition, and a few develop PKDL later. That is why follow-up visits after the course matter, and why any new fever or skin patch should be reported.",
    },
    {
      q: "How is kala-azar different from malaria?",
      a: "Both cause fever and a large spleen, but malaria is spread by mosquitoes and usually causes fever over days, while kala-azar is spread by sand flies and causes fever, weight loss and skin darkening over weeks to months. Blood tests tell them apart.",
    },
    {
      q: "What is PKDL?",
      a: "Post-kala-azar dermal leishmaniasis is a skin condition that can appear after kala-azar treatment, with pale patches or bumps, often on the face. It is usually painless but should be treated, because the parasite in the skin can spread to sand flies.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Leishmaniasis", url: "https://medlineplus.gov/leishmaniasis.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
