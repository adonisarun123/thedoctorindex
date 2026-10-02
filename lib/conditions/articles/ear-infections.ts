import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "ear-infections",
  title: "Ear infections: symptoms, treatment and when to see an ENT",
  standfirst: "Middle and outer ear infections: the signs in children, when antibiotics are needed, why a discharging ear needs an ENT, and what not to put in the ear.",
  targetQuery: "ear infection symptoms and treatment",
  department: "ent",
  specialty: "ent",
  alsoSee: ["paediatrics"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Ear pain", "Fever", "Ear discharge", "Hearing loss", "Tugging at the ear", "Irritability"],
  tests: ["Otoscopy", "Tympanometry", "Hearing test"],
  treatments: ["Pain relief", "Watchful waiting", "Antibiotics", "Ear tubes", "Tympanoplasty"],
  body: [
    { k: "h2", text: "What ear infections are" },
    {
      k: "p",
      text: "Most ear infections affect the **middle ear** — the air-filled space behind the eardrum, connected to the back of the nose by a narrow channel called the Eustachian tube. After a cold, this tube can swell and block, fluid builds up behind the eardrum, and bacteria or viruses multiply. This is acute otitis media. It is very common in young children, whose tubes are shorter and more horizontal.",
    },
    {
      k: "p",
      text: "Other kinds include **glue ear** (fluid behind the eardrum without infection, which can dull hearing for weeks), **outer ear infection** or swimmer's ear (infection of the ear canal skin), and **chronic suppurative otitis media** — a long-standing infection with a hole in the eardrum and repeated discharge, which is an important, preventable cause of hearing loss in children.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Ear pain, often worse lying down or at night",
        "Fever",
        "Ear discharge — pus or fluid, sometimes after the pain eases because the eardrum has burst",
        "Hearing loss or a blocked feeling in the ear",
        "In babies and toddlers: tugging at the ear, irritability, crying, poor sleep and poor feeding",
        "Dizziness or loss of balance",
      ],
    },
    {
      k: "p",
      text: "Outer ear infections cause pain on touching or pulling the ear, itching, and a swollen, discharging canal. Glue ear may cause no pain at all, only poor hearing, inattention or slow speech development in a child.",
    },

    { k: "h2", text: "Causes and who is at risk in India" },
    {
      k: "ul",
      items: [
        "Colds and other upper respiratory infections",
        "Young age, especially between six months and two years",
        "Exposure to tobacco smoke and cooking smoke at home",
        "Bottle-feeding a baby lying flat",
        "Enlarged adenoids, allergies or a cleft palate",
        "Crowded living conditions and day-care, where colds spread easily",
        "Putting oil, water, ear buds, hairpins or keys into the ear — a common cause of outer ear infections and eardrum injury",
        "Swimming or bathing in ponds and dirty water, for outer ear infections",
      ],
    },
    {
      k: "p",
      text: "Repeated ear discharge is often accepted as normal in children, or treated with home drops for years. A hole in the eardrum that keeps discharging can damage hearing and, rarely, lead to serious complications, so it needs an ENT assessment.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "ul",
      items: [
        "**Otoscopy** — the doctor looks at the eardrum with a lighted instrument. A red, bulging eardrum, fluid or a perforation can be seen.",
        "**Tympanometry** — a quick, painless test that measures how the eardrum moves and shows fluid behind it.",
        "**Hearing test** — for glue ear, repeated infections, chronic discharge, or a child with speech or school problems. It may be carried out by an [audiologist](/specialties/audiology).",
      ],
    },
    {
      k: "p",
      text: "For chronic discharge, a swab may be sent to identify the germ, and a CT scan is used if a complication or a skin cyst behind the eardrum (cholesteatoma) is suspected.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most ear infections in children are seen first by a [paediatrician](/specialties/paediatrics) or a [general physician](/specialties/general-practice). See an [ENT surgeon](/specialties/ent) for an ear that keeps discharging, repeated infections, glue ear lasting more than a few months, a perforated eardrum that has not healed, hearing loss, or any complication.",
    },
    {
      k: "p",
      text: "You can [find ENT surgeons in Bengaluru](/doctors/karnataka/bengaluru/ent-surgeons) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Acute middle ear infections" },
    {
      k: "p",
      text: "Many acute ear infections get better by themselves within a few days. **Pain relief** with paracetamol, or another painkiller your doctor advises, is the most important first step. In older children with mild symptoms, doctors often recommend **watchful waiting** for a day or two before starting medicine. **Antibiotics** are usually given to babies under six months, children with high fever, severe pain, discharge or infections in both ears, and when symptoms do not improve. If antibiotics are prescribed, complete the course.",
    },
    { k: "h3", text: "Outer ear infections" },
    {
      k: "p",
      text: "These are usually treated with prescribed ear drops after the canal is cleaned. Keep the ear dry while it heals.",
    },
    { k: "h3", text: "Glue ear and repeated infections" },
    {
      k: "p",
      text: "Glue ear often clears by itself within a few months and is watched with hearing tests. If it persists and affects hearing, or infections keep returning, an ENT surgeon may recommend **ear tubes** (grommets) — tiny tubes placed in the eardrum to let air in and fluid out — sometimes with removal of the adenoids. Hearing aids are an option for some children.",
    },
    { k: "h3", text: "Chronic discharging ears" },
    {
      k: "p",
      text: "The ear is cleaned and treated with drops to dry it. A hole that does not heal can be repaired with an operation called **tympanoplasty**, which closes the eardrum and can improve hearing. Cholesteatoma always needs surgery. Do not use leftover or borrowed ear drops, and do not stop prescribed treatment on your own.",
    },

    { k: "h2", text: "Prevention and ear care" },
    {
      k: "ul",
      items: [
        "Do not put oil, water, cotton buds or any object into the ear",
        "Keep children away from tobacco and cooking smoke",
        "Breastfeed, and feed babies in an upright position",
        "Keep up with routine childhood vaccinations, which protect against some germs that cause ear infections",
        "Keep a discharging or perforated ear dry while bathing, and avoid swimming until a doctor says it is safe",
        "Have a child's hearing checked if they seem inattentive or speech is slow",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Painful swelling or redness behind the ear, pushing the ear forward",
        "Severe headache, stiff neck, confusion, drowsiness or fits",
        "Weakness of one side of the face",
        "Severe dizziness with vomiting",
        "A baby under three months with fever",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Which part of the ear is infected?",
        "Does my child need antibiotics now, or can we wait?",
        "Is the eardrum perforated, and will it heal?",
        "Do we need a hearing test?",
        "When would ear tubes or surgery be considered?",
        "How should we keep the ear dry and clean?",
      ],
    },
  ],
  faqs: [
    {
      q: "Should I put oil in my child's ear for ear pain?",
      a: "No. Oil, garlic juice and other home drops can worsen infection, especially if the eardrum has a hole, and can hide what the doctor needs to see. Give pain relief your doctor advises and have the ear examined.",
    },
    {
      q: "Do all ear infections need antibiotics?",
      a: "No. Many ear infections improve on their own within a few days, and pain relief is the main treatment at first. Antibiotics are used for young babies, severe or bilateral infections, ear discharge, or infections that do not improve. Your doctor will decide.",
    },
    {
      q: "Can ear infections cause permanent hearing loss?",
      a: "Most do not. Hearing usually returns once fluid clears. But repeated infections, long-lasting glue ear and chronic discharge from a perforated eardrum can damage hearing, which is why they need an ENT assessment and a hearing test.",
    },
    {
      q: "Is it safe to clean ears with cotton buds?",
      a: "No. Ears clean themselves. Cotton buds push wax deeper, can scratch the canal and cause infection, and can even perforate the eardrum. Clean only the outer ear with a cloth, and see a doctor if wax blocks hearing.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Ear Infections", url: "https://medlineplus.gov/earinfections.html" },
    { label: "National Institute on Deafness and Other Communication Disorders (NIH) — Ear infections in children", url: "https://www.nidcd.nih.gov/health/ear-infections-children" },
    { label: "World Health Organization — Deafness and hearing loss fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/deafness-and-hearing-loss" },
  ],
};
