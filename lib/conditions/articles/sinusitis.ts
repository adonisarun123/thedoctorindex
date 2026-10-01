import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "sinusitis",
  title: "Sinusitis: symptoms, treatment and which doctor to see",
  standfirst: "What sinusitis is, how to tell it from a cold, why antibiotics are often not needed, how chronic sinusitis is treated, and when to see an ENT.",
  targetQuery: "sinusitis symptoms and treatment",
  department: "ent",
  specialty: "ent",
  alsoSee: ["general-practice"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Blocked nose", "Thick nasal discharge", "Facial pain or pressure", "Reduced sense of smell", "Postnasal drip"],
  tests: ["Nasal endoscopy", "CT scan of the sinuses"],
  treatments: ["Saline nasal irrigation", "Steroid nasal sprays", "Antibiotics", "Endoscopic sinus surgery"],
  body: [
    { k: "h2", text: "What sinusitis is" },
    {
      k: "p",
      text: "The sinuses are air-filled spaces in the bones of the face — behind the cheeks, between the eyes and above the eyebrows — that open into the nose through small channels. Their lining makes mucus that normally drains away unnoticed. When the lining swells, these channels block, mucus collects and the area becomes inflamed. This is sinusitis, also called rhinosinusitis because the nose is always involved too.",
    },
    {
      k: "p",
      text: "**Acute sinusitis** lasts up to about four weeks and usually follows a cold. Most cases are caused by viruses and settle by themselves. A smaller number become bacterial infections. **Chronic sinusitis** lasts twelve weeks or more, despite treatment. It is a long-term inflammatory condition rather than a simple infection, and is often linked to allergies, asthma or nasal polyps — soft, painless swellings of the nasal lining.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Blocked nose, often on one or both sides",
        "Thick nasal discharge, yellow or green, from the front of the nose",
        "Postnasal drip — mucus running down the back of the throat, causing throat clearing or cough",
        "Facial pain or pressure around the cheeks, eyes or forehead, often worse bending forward",
        "Reduced sense of smell",
        "Fever, tiredness, toothache in the upper jaw, or bad breath",
      ],
    },
    {
      k: "p",
      text: "Coloured mucus by itself does not mean a bacterial infection. Signs that a bacterial infection may have developed include symptoms lasting more than about ten days without improvement, severe symptoms with a high fever, or getting better and then suddenly worse. Headache without nasal symptoms is rarely due to sinusitis, and is often a migraine or tension-type headache.",
    },

    { k: "h2", text: "Causes and who is at risk in India" },
    { k: "p", text: "Anything that swells the nasal lining or blocks drainage can lead to sinusitis:" },
    {
      k: "ul",
      items: [
        "Colds and other viral infections",
        "Allergic rhinitis — to dust mites, pollen, mould or pets — which is very common",
        "Air pollution, road and construction dust, and smoke from tobacco, cooking fuel or incense",
        "A deviated nasal septum or nasal polyps",
        "Asthma, which often coexists with chronic sinusitis",
        "Dental infections in the upper teeth",
        "Weakened immunity, including poorly controlled diabetes and long-term steroid use",
      ],
    },
    {
      k: "p",
      text: "In people with uncontrolled diabetes, or whose immunity is suppressed, fungal infections of the sinuses can occur and spread quickly. India saw many cases of one such infection, mucormycosis ('black fungus'), during the COVID-19 pandemic. This is rare but is an emergency, and its signs are listed below.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Acute sinusitis is diagnosed from your symptoms and a look inside the nose; tests are usually not needed. For chronic or repeated sinusitis, or when a complication is suspected, an ENT surgeon may use:",
    },
    {
      k: "ul",
      items: [
        "**Nasal endoscopy** — a thin camera passed into the nose in the clinic, after a numbing spray, to look at the drainage channels, polyps and pus.",
        "**CT scan of the sinuses** — shows the anatomy of the sinuses and how blocked they are. It is mainly used for chronic sinusitis, before surgery, or when a complication is suspected, not for a routine cold.",
      ],
    },
    {
      k: "p",
      text: "Allergy tests may help if allergic rhinitis is suspected, and an MRI is sometimes used if infection may have spread around the eye or brain. Plain X-rays of the sinuses are now rarely helpful.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most acute sinusitis can be managed by a [general physician](/specialties/general-practice). See an [ENT surgeon](/specialties/ent) if:",
    },
    {
      k: "ul",
      items: [
        "Symptoms last more than twelve weeks, or keep coming back",
        "One side of the nose is always blocked, bleeds, or has a foul-smelling discharge",
        "Your sense of smell has gone and does not return",
        "Treatment has not helped and surgery may be an option",
      ],
    },
    {
      k: "p",
      text: "You can [find ENT surgeons in Bengaluru](/doctors/karnataka/bengaluru/ent-surgeons) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Acute sinusitis" },
    {
      k: "p",
      text: "Most acute sinusitis gets better within a week or two with simple measures: rest, fluids, a painkiller suitable for you, and **saline nasal irrigation** — rinsing the nose with salt water using a bottle or pot, made with boiled and cooled or sterile water. **Steroid nasal sprays** can reduce swelling. Decongestant sprays may help for a few days but cause rebound blockage if used longer.",
    },
    {
      k: "p",
      text: "**Antibiotics** do not help viral sinusitis, and using them when they are not needed adds side effects and contributes to antibiotic resistance. A doctor may prescribe them when bacterial infection is likely. Do not take leftover antibiotics or buy them without a prescription, and if you are prescribed a course, take it as directed.",
    },
    {
      k: "p",
      text: "Steam inhalation is widely used in Indian homes and some people find it soothing, but take care: bowls of boiling water cause serious scalds, particularly in children.",
    },
    { k: "h3", text: "Chronic sinusitis" },
    {
      k: "p",
      text: "Daily saline nasal irrigation and steroid nasal sprays are the mainstay, used regularly for weeks to months. Treating allergies and asthma helps. A short course of oral steroids or antibiotics is sometimes added for flare-ups or large polyps. For severe polyps that keep returning, newer biological injections are an option at specialist centres.",
    },
    {
      k: "p",
      text: "If medicines do not control symptoms, **endoscopic sinus surgery** widens the natural drainage channels and removes polyps, working through the nostrils without external cuts. A deviated septum may be corrected at the same time. Surgery helps many people, but chronic sinusitis can return, so sprays and rinses usually continue afterwards. Do not stop your prescribed sprays without talking to your doctor.",
    },

    { k: "h2", text: "Living with chronic sinusitis" },
    {
      k: "ul",
      items: [
        "Make nasal rinsing part of your daily routine, and clean the bottle regularly",
        "Learn the right technique for nasal sprays — aim away from the middle of the nose",
        "Reduce dust and smoke at home, and wear a mask in heavy dust or pollution",
        "Keep diabetes well controlled",
        "Stop smoking",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Rarely, sinus infection spreads to the eye, bone or brain. Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Swelling or redness around the eye, a bulging eye, double vision or reduced vision",
        "Severe headache, a stiff neck, confusion or drowsiness",
        "Swelling of the forehead or face, or numbness of the face",
        "Black crusts in the nose or on the palate, especially with diabetes or after steroid treatment",
        "High fever with a person who seems very unwell",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is this sinusitis, a cold or an allergy?",
        "Do I need antibiotics, and why?",
        "How should I rinse my nose and use my spray?",
        "Do I need a nasal endoscopy or CT scan?",
        "Could allergies, asthma or a deviated septum be part of the problem?",
        "Would surgery help me, and what are the chances of it coming back?",
      ],
    },
  ],
  faqs: [
    {
      q: "Do I need antibiotics for sinusitis?",
      a: "Usually not. Most acute sinusitis is caused by viruses and settles in a week or two with rinses, sprays and rest. Your doctor may prescribe antibiotics when symptoms are severe, last more than about ten days, or improve and then get worse.",
    },
    {
      q: "Is sinusitis contagious?",
      a: "Sinusitis itself is not passed on, but the cold virus that often triggers it can be. Washing hands, covering coughs and sneezes and staying home when unwell reduce the spread of colds, which in turn reduces sinusitis.",
    },
    {
      q: "Will sinus surgery fix the problem permanently?",
      a: "Endoscopic sinus surgery improves symptoms for many people with chronic sinusitis, especially when medicines have failed. But the underlying inflammation can continue, and polyps can grow back, so most people still need regular sprays and rinses afterwards. Your ENT surgeon will discuss realistic expectations.",
    },
    {
      q: "Can steroid nasal sprays be used for a long time?",
      a: "Yes, for most people. Very little of the steroid is absorbed into the body, which is why these sprays are used long term in allergy and chronic sinusitis. Your doctor will review whether you still need them and check for nosebleeds or irritation.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Sinusitis", url: "https://medlineplus.gov/sinusitis.html" },
    { label: "American Academy of Otolaryngology–Head and Neck Surgery (ENT Health) — Sinusitis", url: "https://www.enthealth.org/conditions/sinusitis/" },
  ],
};
