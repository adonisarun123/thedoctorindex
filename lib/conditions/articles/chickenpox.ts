import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "chickenpox",
  title: "Chickenpox: symptoms, spread, treatment and which doctor to see",
  metaTitle: "Chickenpox: symptoms, treatment and which doctor to see",
  standfirst: "How chickenpox spreads, what the rash looks like, safe home care, who needs antiviral medicine, the warning signs and when to see a doctor.",
  targetQuery: "chickenpox symptoms and treatment",
  department: "infectious-diseases",
  specialty: "general-practice",
  alsoSee: ["paediatrics", "infectious-diseases", "dermatology"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Itchy rash", "Blisters", "Fever", "Tiredness", "Loss of appetite"],
  tests: ["Clinical examination", "PCR test"],
  treatments: ["Calamine lotion", "Paracetamol", "Antiviral medicine", "Chickenpox vaccine"],
  body: [
    { k: "h2", text: "What chickenpox is" },
    {
      k: "p",
      text: "Chickenpox (varicella) is an infection caused by the varicella-zoster virus. It causes an itchy rash of spots that turn into small fluid-filled blisters and then scabs. In many Indian homes it is known as choti mata, and it spreads easily through schools, hostels and crowded homes.",
    },
    {
      k: "p",
      text: "Most children have a mild illness and recover fully at home within one to two weeks. Chickenpox can be more serious in babies, teenagers, adults, pregnant women and anyone whose immune system is weak. After the illness the virus stays quietly in the nerves for life, and years later it can reawaken as [shingles](/conditions/shingles). Most people get chickenpox only once.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually start between one and three weeks after contact with an infected person. A day or two of feeling unwell often comes first:",
    },
    {
      k: "ul",
      items: [
        "Fever, usually mild in children and higher in adults",
        "Tiredness and headache",
        "Loss of appetite",
        "An itchy rash of red spots, often starting on the chest, back or face and spreading over the body, including the scalp and sometimes inside the mouth",
        "Blisters that form on the spots, break, and crust over into scabs within a few days",
      ],
    },
    {
      k: "p",
      text: "New crops of spots keep appearing for several days, so spots, blisters and scabs are seen together. This mixture helps doctors tell chickenpox apart from other rashes. Children who have had the vaccine can still get chickenpox occasionally, but usually with fewer spots and a milder illness.",
    },

    { k: "h2", text: "How it spreads" },
    {
      k: "p",
      text: "Chickenpox is one of the most contagious infections. It spreads through the air when an infected person coughs, sneezes or breathes, and by touching fluid from the blisters. A person can pass it on from a day or two before the rash appears until all the blisters have crusted over, which usually takes about five days after the rash starts.",
    },
    {
      k: "p",
      text: "Keep a child with chickenpox at home from school or day care, and keep an adult away from work, until every blister has scabbed. During this time, avoid contact with pregnant women who have not had chickenpox, newborn babies and people with weak immunity, such as those on cancer treatment or long-term steroids. Someone with shingles can also pass the virus on to a person who has never had chickenpox, through contact with the blisters.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "A doctor can usually recognise chickenpox from a **clinical examination** of the rash and the story of contact with someone who had it. Tests are seldom needed. When the picture is unclear, or the patient is a pregnant woman, a newborn or someone with weak immunity, a swab from a blister can be sent for a **PCR test**, which detects the virus. Blood tests can show whether a person is already immune, which can matter for pregnant women and health workers after an exposure.",
    },

    { k: "h2", text: "Treatment and home care" },
    {
      k: "p",
      text: "For most healthy children, care at home is all that is needed. The aim is to ease the itch and fever, prevent scratching and keep fluids up while the body clears the virus.",
    },
    {
      k: "ul",
      items: [
        "**Calamine lotion** dabbed on the spots, cool baths and loose cotton clothes ease the itch",
        "Keep fingernails short and clean; put cotton socks or mittens on a small child's hands at night to limit scratching",
        "**Paracetamol** can bring down fever and ease discomfort, at the dose your doctor or pharmacist advises for the person's age and weight",
        "Plenty of fluids; soft, cool, bland food if there are spots in the mouth",
        "An antihistamine for sleep, if your doctor suggests one",
      ],
    },
    {
      k: "note",
      tone: "alert",
      title: "Medicines to avoid",
      text: "Never give aspirin to a child or teenager with chickenpox; it is linked to Reye syndrome, a rare but dangerous illness affecting the liver and brain. Many doctors also advise avoiding ibuprofen and other anti-inflammatory painkillers during chickenpox unless a doctor recommends them, because they have been linked to serious skin infections. Paracetamol is the usual choice.",
    },
    {
      k: "p",
      text: "**Antiviral medicine** such as acyclovir can shorten the illness and lower the risk of complications. It works best when started early, ideally within a day of the rash appearing, and is usually advised for adults, teenagers, pregnant women, newborns, people with long-term skin or lung conditions and anyone with weak immunity. Ask a doctor promptly if you or your child falls in one of these groups. Pregnant women and people with weak immunity who are exposed may also be offered a protective antibody injection.",
    },
    {
      k: "p",
      text: "Families sometimes follow traditional customs during chickenpox, such as neem leaves or keeping the patient indoors. Rest and hygiene are sensible, but customs should never delay medical care, bathing or food and fluids, especially for an adult or a baby.",
    },

    { k: "h2", text: "Complications" },
    {
      k: "p",
      text: "Most people recover without problems, and the spots usually heal without scars unless they are scratched or become infected. Complications are more likely in adults, babies and people with weak immunity. They include:",
    },
    {
      k: "ul",
      items: [
        "Bacterial skin infection of scratched spots, such as [impetigo](/conditions/impetigo) or cellulitis, with spreading redness, pain and pus",
        "[Pneumonia](/conditions/pneumonia), especially in adults and smokers",
        "Inflammation of the brain ([encephalitis](/conditions/encephalitis)) or problems with balance and walking, which are rare",
        "Dehydration in young children who stop drinking",
        "Harm to the baby if a pregnant woman catches chickenpox, particularly early in pregnancy or close to delivery",
      ],
    },

    { k: "h2", text: "Prevention and the vaccine" },
    {
      k: "p",
      text: "The **chickenpox vaccine** prevents most cases and makes the illness milder in those who still catch it. It is given as two doses. In India it is not part of the free government immunisation schedule, but it is widely available at private clinics and hospitals, and the Indian Academy of Pediatrics includes it in its recommended schedule. Ask your paediatrician when your child should have it. Teenagers and adults who have never had chickenpox, especially health workers and women planning a pregnancy, can also be vaccinated. The vaccine contains a weakened live virus, so it is not given during pregnancy or to people with seriously weakened immunity.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if a person with chickenpox:" },
    {
      k: "ul",
      items: [
        "Has difficulty breathing, chest pain or a cough with blood",
        "Is very drowsy, confused, has a stiff neck, a severe headache, a fit (seizure) or cannot walk steadily",
        "Has spots that bleed, or bruise-like patches appear on the skin",
        "Is a baby under a few months old with a fever or rash",
        "Stops drinking, or passes very little urine",
      ],
    },
    {
      k: "p",
      text: "See a doctor the same day if the skin around spots becomes very red, hot, swollen or painful, if the fever returns after starting to settle, if a pregnant woman or someone with weak immunity is exposed or develops a rash, or if an adult develops chickenpox.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most chickenpox is managed by a [general physician](/specialties/general-practice) or, for children, a [paediatrician](/specialties/paediatrics). It helps to phone the clinic before you go, so staff can keep you away from pregnant women and other vulnerable patients in the waiting area. An [infectious diseases specialist](/specialties/infectious-diseases) may be involved for people with weak immunity or severe complications, and a [dermatologist](/specialties/dermatology) can advise on scarring after healing.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is this definitely chickenpox, and does it need any tests?",
        "Should we start antiviral medicine?",
        "Which medicine is safe for fever and itching at this age?",
        "When can my child go back to school?",
        "Does anyone at home need protection, such as a pregnant family member?",
        "Should other family members be vaccinated?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can you get chickenpox twice?",
      a: "It is uncommon. Most people are immune for life after one infection. The virus does stay in the body, though, and can return years later as shingles, a painful band of rash usually on one side of the body. A second episode of chickenpox occasionally happens in people with weak immunity.",
    },
    {
      q: "Can a child with chickenpox have a bath?",
      a: "Yes. Bathing in cool or lukewarm water keeps the skin clean, eases the itch and helps prevent the spots from getting infected. Pat the skin dry gently with a clean towel rather than rubbing, and keep towels separate from the rest of the family.",
    },
    {
      q: "When can my child go back to school after chickenpox?",
      a: "Once all the blisters have dried and crusted over, usually around five days after the rash first appears, the child is no longer infectious and can return to school. Scabs may take longer to fall off, but they do not spread the infection.",
    },
    {
      q: "Is chickenpox dangerous in pregnancy?",
      a: "It can be. Pregnant women who catch chickenpox are more likely to develop pneumonia, and the infection can occasionally harm the baby. If you are pregnant and have been near someone with chickenpox or shingles and are not sure you have had it, contact your doctor straight away, without waiting for a rash.",
    },
    {
      q: "Should adults who never had chickenpox get vaccinated?",
      a: "Many doctors recommend it, because chickenpox tends to be more severe in adults. A blood test can check immunity if you are unsure. The vaccine is especially useful for health workers, teachers and women planning a pregnancy, who should have it before they conceive.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Chickenpox", url: "https://medlineplus.gov/chickenpox.html" },
    { label: "Emergency Response Support System, Government of India — 112", url: "https://112.gov.in/" },
  ],
};
