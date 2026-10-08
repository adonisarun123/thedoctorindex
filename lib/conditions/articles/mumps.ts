import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "mumps",
  title: "Mumps: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Mumps: symptoms, spread, care and vaccination",
  standfirst: "What mumps is, the swollen cheeks and other symptoms, how it spreads, how to care for someone at home, the complications to watch for, and the vaccine.",
  targetQuery: "mumps symptoms and treatment",
  department: "paediatrics",
  specialty: "paediatrics",
  alsoSee: ["general-practice", "infectious-diseases"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Swollen salivary glands", "Fever", "Headache", "Muscle aches", "Tiredness", "Loss of appetite"],
  tests: ["Clinical examination", "Saliva swab test", "Blood test for antibodies"],
  treatments: ["Rest and fluids", "Fever and pain relief", "Isolation", "MMR vaccine"],
  body: [
    { k: "h2", text: "What mumps is" },
    {
      k: "p",
      text: "Mumps is a contagious illness caused by the mumps virus. It is best known for causing painful swelling of the parotid glands — the salivary glands just in front of and below the ears — which gives the face a puffy, hamster-like look along the jaw.",
    },
    {
      k: "p",
      text: "Mumps mostly affects children and young adults who have not been vaccinated. In most people it is a mild illness that gets better on its own within one to two weeks. A minority develop complications, which are more common in teenagers and adults than in young children. Once you have had mumps, you are usually protected for life.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually appear about two to three weeks after contact with someone who has mumps. The illness often starts like a flu:",
    },
    {
      k: "ul",
      items: [
        "Fever",
        "Headache",
        "Muscle aches",
        "Tiredness",
        "Loss of appetite",
      ],
    },
    {
      k: "p",
      text: "Within a day or two, the salivary glands on one or both sides of the face become swollen and tender. Swollen salivary glands can make the jaw ache, and chewing, swallowing, talking and sour foods often make it worse. The swelling usually peaks over a few days and settles within about a week to ten days.",
    },
    {
      k: "p",
      text: "Some people, especially young children, have very mild symptoms or none at all, but can still spread the virus. Swelling of the cheek can also be caused by a bacterial infection of the gland, a blocked salivary duct, a dental abscess or swollen lymph nodes, so it is worth having a doctor take a look.",
    },

    { k: "h2", text: "How mumps spreads" },
    {
      k: "p",
      text: "The virus spreads through droplets from the nose and mouth when an infected person coughs, sneezes or talks, through saliva (for example by sharing cups, spoons or water bottles), and by touching contaminated surfaces and then the face. A person is infectious from a few days before the swelling starts until about five days after. Crowded settings — schools, hostels, colleges and households — make outbreaks more likely.",
    },
    {
      k: "ul",
      items: [
        "Keep a child with mumps at home from school, and an adult from work or college, for about five days after the swelling begins, or as your doctor advises",
        "Cover coughs and sneezes, and wash hands often with soap",
        "Do not share utensils, cups or bottles",
        "Keep the person away from pregnant women and from anyone with a weakened immune system who has not been vaccinated",
      ],
    },

    { k: "h2", text: "Complications" },
    {
      k: "p",
      text: "Serious complications are uncommon, but it helps to know the signs:",
    },
    {
      k: "ul",
      items: [
        "Painful swelling of one or both testicles (orchitis) in males who have gone through puberty; it usually settles, and loss of fertility is rare",
        "Swelling of the ovaries or breasts in females, causing lower abdominal or breast pain",
        "[Meningitis](/conditions/meningitis) — inflammation of the coverings of the brain, with a severe headache, stiff neck and dislike of bright light",
        "[Encephalitis](/conditions/encephalitis) — inflammation of the brain itself, which is rare but serious",
        "[Pancreatitis](/conditions/pancreatitis), causing pain in the upper abdomen and vomiting",
        "Hearing loss, usually in one ear, which is rare but can be permanent",
      ],
    },
    {
      k: "p",
      text: "If you are pregnant and have been exposed to mumps or develop symptoms, tell your obstetrician.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "A doctor can often recognise mumps from a **clinical examination** — the typical swelling, fever and history of contact. Because other infections can cause similar swelling, and because confirming cases helps track outbreaks, your doctor may also arrange:",
    },
    {
      k: "ul",
      items: [
        "A **saliva swab test** — a swab rubbed inside the cheek near the gland opening, tested for the virus",
        "A **blood test for antibodies** to the mumps virus",
        "Other tests, such as a lumbar puncture or ultrasound, only if complications are suspected",
      ],
    },

    { k: "h2", text: "Treatment and home care" },
    {
      k: "p",
      text: "There is no antiviral medicine for mumps, and antibiotics do not help because it is caused by a virus. Treatment is about easing symptoms while the body clears the infection:",
    },
    {
      k: "ul",
      items: [
        "**Rest and fluids** — plenty of water, soups, coconut water or oral rehydration solution, especially if eating is painful",
        "**Fever and pain relief** with paracetamol or another medicine your doctor or pharmacist recommends; do not give aspirin to children or teenagers",
        "Soft foods that need little chewing, such as khichdi, idli, porridge or curd rice; avoid sour and citrus foods, which make the glands ache",
        "A warm or cool compress on the swollen glands, whichever feels better",
        "For painful testicles, supportive underwear, a cool compress and rest, and a doctor's review",
        "**Isolation** at home for the infectious period, to protect others",
      ],
    },

    { k: "h2", text: "Prevention and vaccination" },
    {
      k: "p",
      text: "Mumps is preventable with vaccination. The **MMR vaccine** protects against measles, mumps and rubella, and is given as two doses in childhood. Two doses give good protection, although outbreaks can still occasionally occur in vaccinated groups, usually with milder illness.",
    },
    {
      k: "p",
      text: "Note that the MR (measles-rubella) vaccine protects against [measles](/conditions/measles) and rubella but not mumps. Check your child's vaccination card and ask your paediatrician whether they have received a mumps-containing vaccine. Older children and adults who have never had mumps or the vaccine can ask their doctor about catching up. MMR is a live vaccine and is not given during pregnancy.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if someone with mumps has:" },
    {
      k: "ul",
      items: [
        "A severe headache with a stiff neck, dislike of bright light, or repeated vomiting",
        "Confusion, unusual drowsiness, difficulty waking, or a seizure (fit)",
        "Severe abdominal pain",
        "Signs of dehydration, such as very little urine, a very dry mouth or extreme weakness",
      ],
    },
    {
      k: "p",
      text: "See a doctor promptly, rather than as an emergency, for painful testicular swelling, sudden hearing loss, or a fever that lasts more than a few days.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Children with mumps are usually cared for by a [paediatrician](/specialties/paediatrics), and adults by a [general physician](/specialties/general-practice). An [infectious diseases specialist](/specialties/infectious-diseases) may be consulted for complicated cases or outbreaks, and other specialists, such as a urologist or ENT surgeon, if specific complications occur.",
    },
    {
      k: "p",
      text: "You can [find paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "How long is a person with mumps contagious?",
      a: "A person with mumps can spread the virus from a few days before the cheek swelling begins until about five days after. Staying home from school, college or work during this time, and not sharing utensils, helps protect others.",
    },
    {
      q: "Can you get mumps twice?",
      a: "It is uncommon. Having had mumps usually gives lasting protection. Some people who think they had mumps actually had swelling from another cause, so if you are unsure, ask your doctor about vaccination.",
    },
    {
      q: "Does mumps cause infertility in men?",
      a: "Mumps can cause painful swelling of the testicles in males after puberty. This usually settles completely, and loss of fertility is rare. If testicular pain or swelling develops, see a doctor so it can be assessed and managed.",
    },
    {
      q: "Can a vaccinated child still get mumps?",
      a: "Yes, but it is less likely and usually milder. Two doses of the MMR vaccine give good protection, but no vaccine is perfect, and outbreaks can occasionally happen in close-contact groups such as hostels and colleges.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Mumps", url: "https://medlineplus.gov/mumps.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
