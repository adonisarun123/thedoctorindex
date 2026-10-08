import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "meningitis",
  title: "Meningitis: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Meningitis: symptoms, treatment and which doctor to see",
  standfirst: "What meningitis is, the warning signs in adults and babies, why bacterial meningitis is an emergency, how it is treated, and vaccines that protect.",
  targetQuery: "meningitis symptoms and treatment",
  department: "infectious-diseases",
  specialty: "infectious-diseases",
  alsoSee: ["neurology", "paediatrics", "emergency-medicine"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Fever", "Severe headache", "Stiff neck", "Vomiting", "Sensitivity to light", "Confusion", "Rash"],
  tests: ["Lumbar puncture", "Blood culture", "CT scan", "MRI"],
  treatments: ["Antibiotics", "Antiviral medicines", "Antifungal medicines", "Corticosteroids", "Vaccination"],
  body: [
    { k: "h2", text: "What meningitis is" },
    {
      k: "p",
      text: "Meningitis is inflammation of the meninges, the thin protective layers that cover the brain and spinal cord. It is usually caused by an infection. The type of germ matters a great deal, because it decides how serious the illness is and how it is treated.",
    },
    {
      k: "ul",
      items: [
        "**Viral meningitis** is the commonest type. It is usually milder, and most people recover fully with supportive care.",
        "**Bacterial meningitis** is less common but can be life-threatening within hours. Pneumococcus and meningococcus are among the main causes, and Hib in unvaccinated children. It needs emergency antibiotics.",
        "**Tuberculous meningitis** develops more slowly, over days to weeks, and is an important cause in India. See [tuberculosis](/conditions/tuberculosis).",
        "**Fungal meningitis** mainly affects people with weakened immunity, for example from untreated [HIV](/conditions/hiv).",
      ],
    },
    {
      k: "p",
      text: "Meningitis is different from [encephalitis](/conditions/encephalitis), which is inflammation of the brain itself, though the two can overlap and some symptoms are shared. Because it is impossible to tell viral from bacterial meningitis at home, every suspected case should be treated as an emergency until a doctor says otherwise.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "In older children and adults, symptoms can include:" },
    {
      k: "ul",
      items: [
        "Fever, often high",
        "Severe headache, unlike a usual headache",
        "Stiff neck — pain or difficulty bending the chin to the chest",
        "Vomiting",
        "Sensitivity to light",
        "Confusion, drowsiness or difficulty waking",
        "Seizures (fits)",
        "A rash that does not fade when a glass is pressed against it — a sign of meningococcal infection and [sepsis](/conditions/sepsis)",
        "Cold hands and feet, and aching limbs",
      ],
    },
    {
      k: "p",
      text: "Babies and young children may not show the classic signs. Watch for fever or a low temperature, being unusually floppy or stiff, refusing feeds, high-pitched crying, irritability when held, unusual sleepiness, and a bulging soft spot on the top of the head. Older adults may simply become confused or drowsy.",
    },
    {
      k: "p",
      text: "Not everyone gets every symptom, and they can appear in any order. A rash appears late, if at all, so do not wait for one. On darker skin, a rash can be harder to see; check the palms, soles, inside the eyelids and the roof of the mouth.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "p",
      text: "The germs that cause meningitis spread in different ways. Many bacteria and viruses spread through coughs, sneezes and close contact, then reach the meninges through the blood. Some viruses spread through contaminated hands, food or water. Meningitis can also follow a head injury, ear or sinus infection, or brain surgery. Anyone can get it, but risk is higher for:",
    },
    {
      k: "ul",
      items: [
        "Babies and young children, and older adults",
        "Teenagers and young adults living in crowded settings such as hostels",
        "People with weakened immunity — HIV, cancer treatment, long-term steroids, no spleen, or alcohol dependence",
        "Children who have missed routine vaccines",
        "People in close contact with someone who has bacterial meningitis",
        "People with a close contact who has active tuberculosis",
      ],
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "If bacterial meningitis is suspected, doctors will usually start antibiotics straight away, often before tests are complete, because delay is dangerous. Tests then confirm the type:",
    },
    {
      k: "ul",
      items: [
        "**Lumbar puncture** — a thin needle is passed between the bones of the lower back to take a small sample of the fluid around the spinal cord. This is the key test: it shows whether there is infection and what kind. The procedure is done under local anaesthetic and does not damage the spinal cord.",
        "**Blood culture** and other blood tests — to look for bacteria in the blood and signs of infection",
        "**CT scan** or **MRI** of the brain — sometimes done before the lumbar puncture, for example if the person is drowsy, has had a seizure or has signs of raised pressure in the brain",
      ],
    },
    {
      k: "p",
      text: "Tests for tuberculosis, HIV and specific viruses may also be done depending on the situation.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Anyone with suspected bacterial meningitis is treated in hospital, often in a high-dependency or intensive care unit. Treatment depends on the cause:",
    },
    {
      k: "ul",
      items: [
        "**Antibiotics** given through a drip, started as early as possible, for bacterial meningitis. The choice may be adjusted once laboratory results show which germ is responsible.",
        "**Corticosteroids** are often given alongside antibiotics in some types of bacterial meningitis and in tuberculous meningitis to reduce inflammation and the risk of complications such as hearing loss.",
        "**Antiviral medicines** are used for some viral causes, particularly when herpes viruses are suspected. Many other viral cases need only rest, fluids and pain relief.",
        "**Antifungal medicines** treat fungal meningitis, usually for a long course.",
        "Tuberculous meningitis is treated with a combination of TB medicines for many months, along with steroids.",
      ],
    },
    {
      k: "p",
      text: "Supportive care — fluids, oxygen, control of seizures and close monitoring — is just as important. People in close contact with someone who has meningococcal meningitis, or certain other types, may be offered preventive antibiotics; the hospital or public health team will advise who needs them.",
    },

    { k: "h2", text: "Complications and recovery" },
    {
      k: "p",
      text: "Many people recover fully, especially from viral meningitis. Bacterial and tuberculous meningitis can leave lasting effects, including hearing loss, memory and concentration problems, seizures, weakness, or learning difficulties in children. Meningococcal sepsis can damage the skin and limbs. Everyone who has had bacterial meningitis, particularly children, should have a hearing test after recovery, and follow-up can pick up other problems early so that therapy can start.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "p",
      text: "**Vaccination** is the most effective protection against several kinds of bacterial meningitis:",
    },
    {
      k: "ul",
      items: [
        "The Hib vaccine, given to infants in India as part of the pentavalent vaccine on the national immunisation schedule",
        "Pneumococcal conjugate vaccine, which has been added to India's national immunisation schedule; ask your paediatrician whether your child has received it",
        "BCG at birth, which helps protect young children against severe forms of tuberculosis, including TB meningitis",
        "Meningococcal vaccines, recommended for some groups and required for certain travel, such as Hajj and Umrah",
      ],
    },
    {
      k: "p",
      text: "Keep your child's vaccination card up to date and ask your paediatrician about any missed doses. Adults with no spleen, certain immune problems or cochlear implants may need extra vaccines; ask your doctor. Good hand-washing, covering coughs and early treatment of TB in the family also reduce risk.",
    },

    { k: "h2", text: "When it is an emergency" },
    {
      k: "p",
      text: "Suspected meningitis is always an emergency. Call 112 or 108, or go straight to the nearest emergency department, if someone has fever with any of: severe headache, stiff neck, confusion or drowsiness, a seizure, or a rash that does not fade under a glass. For a baby, go immediately for fever with floppiness, a bulging soft spot, refusal to feed or unusual crying. Do not wait for all the symptoms, and do not wait for a rash.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Meningitis is managed in hospital, starting with the [emergency medicine](/specialties/emergency-medicine) team. Care is then often led by an [infectious diseases specialist](/specialties/infectious-diseases), a physician or a [neurologist](/specialties/neurology), and for children by a [paediatrician](/specialties/paediatrics). After discharge, follow-up may involve an ENT specialist or audiologist for hearing, and rehabilitation if needed.",
    },
    {
      k: "p",
      text: "For follow-up care you can [find infectious disease specialists in Bengaluru](/doctors/karnataka/bengaluru/infectious-disease-specialists), [neurologists in Bengaluru](/doctors/karnataka/bengaluru/neurologists) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index. For suspected meningitis, do not book an appointment — go to an emergency department.",
    },

    { k: "h2", text: "Questions to ask the care team" },
    {
      k: "ul",
      items: [
        "What type of meningitis is this, and which germ caused it?",
        "Do family members or other close contacts need preventive treatment or vaccines?",
        "How long will treatment last?",
        "When should hearing be tested, and what follow-up is needed?",
        "What problems should we watch for after going home?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is meningitis contagious?",
      a: "The germs that cause meningitis can spread between people, mainly through coughs, sneezes and close contact, but most people who pick them up do not develop meningitis. Close contacts of bacterial meningitis may be given preventive antibiotics.",
    },
    {
      q: "What is the glass test for meningitis?",
      a: "Press the side of a clear glass firmly against a rash. If the spots do not fade under the pressure, it may be a sign of meningococcal sepsis and needs emergency care. A rash that fades does not rule out meningitis.",
    },
    {
      q: "Can viral meningitis be serious?",
      a: "Most viral meningitis is milder than bacterial meningitis and people usually recover fully. But early symptoms look the same, so it must be checked in hospital, and some viruses, such as herpes viruses, need specific treatment.",
    },
    {
      q: "Is a lumbar puncture dangerous?",
      a: "A lumbar puncture is a common, safe procedure. The needle goes below the end of the spinal cord, so it does not damage it. Some people get a headache or back soreness afterwards, which usually settles with rest.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Meningitis", url: "https://medlineplus.gov/meningitis.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
