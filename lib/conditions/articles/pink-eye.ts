import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "pink-eye",
  title: "Pink eye (conjunctivitis): symptoms, causes and treatment",
  standfirst: "What conjunctivitis is, how viral, bacterial and allergic types differ, how to stop spread, why steroid drops are risky, and when a red eye is serious.",
  targetQuery: "conjunctivitis pink eye symptoms and treatment",
  department: "ophthalmology",
  specialty: "ophthalmology",
  alsoSee: ["general-practice"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Red eye", "Watery discharge", "Sticky discharge", "Itching", "Gritty feeling", "Swollen eyelids"],
  tests: ["Eye examination", "Slit-lamp examination", "Eye swab"],
  treatments: ["Cold compresses", "Lubricating eye drops", "Antibiotic eye drops", "Anti-allergy eye drops"],
  body: [
    { k: "h2", text: "What pink eye is" },
    {
      k: "p",
      text: "Pink eye, or conjunctivitis — often called 'eye flu' in India — is inflammation of the conjunctiva, the thin clear layer that covers the white of the eye and lines the inside of the eyelids. Its small blood vessels swell, making the eye look pink or red.",
    },
    {
      k: "p",
      text: "There are three main types. **Viral conjunctivitis** is the most common and very contagious; it often comes in outbreaks, especially during the monsoon, and usually settles within one to two weeks. **Bacterial conjunctivitis** is also contagious and causes thick, sticky discharge. **Allergic conjunctivitis** is caused by pollen, dust or pets, affects both eyes, itches a lot and is not contagious. Most conjunctivitis does not harm vision, but some serious eye conditions also cause a red eye and need to be ruled out.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Red eye, in one or both eyes",
        "Watery discharge — typical of viral and allergic types",
        "Sticky discharge, yellow or green, with eyelids stuck together in the morning — typical of bacterial",
        "Itching — the main symptom of allergic conjunctivitis",
        "A gritty feeling, as if sand is in the eye",
        "Swollen eyelids",
        "A tender lump in front of the ear, and a cold or sore throat, with viral conjunctivitis",
      ],
    },
    {
      k: "p",
      text: "Vision should be normal or only slightly blurred by discharge that clears on blinking. Pain, real loss of vision or strong sensitivity to light suggest something other than simple conjunctivitis.",
    },

    { k: "h2", text: "Causes and how it spreads" },
    {
      k: "ul",
      items: [
        "Viruses, often the same ones that cause colds",
        "Bacteria, including from touching the eyes with unwashed hands",
        "Allergies to pollen, dust mites, pets or cosmetics",
        "Irritants such as smoke, chlorine in swimming pools or chemicals",
        "Contact lenses, especially if worn too long or cleaned poorly",
        "In newborns, infections passed on during birth — this needs urgent treatment",
      ],
    },
    {
      k: "p",
      text: "Infectious conjunctivitis spreads through hands, towels, pillows, eye drops and make-up shared between people, and in crowded classrooms, hostels and workplaces. Simply looking at someone with conjunctivitis does not spread it.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Conjunctivitis is usually diagnosed from the symptoms and an **eye examination**. If the diagnosis is unclear, symptoms are severe, or you wear contact lenses, an eye doctor may use:",
    },
    {
      k: "ul",
      items: [
        "**Slit-lamp examination** — a microscope to examine the cornea and check for ulcers or inflammation inside the eye; a dye may be used to show scratches",
        "**Eye swab** — to identify the germ in severe, repeated or newborn infections",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Mild conjunctivitis can be assessed by a [general physician](/specialties/general-practice). See an [ophthalmologist](/specialties/ophthalmology) if you wear contact lenses, have pain, light sensitivity or reduced vision, if it does not improve within about a week, if it keeps returning, or if a newborn is affected.",
    },
    {
      k: "p",
      text: "You can [find ophthalmologists in Bengaluru](/doctors/karnataka/bengaluru/ophthalmologists) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "ul",
      items: [
        "**Viral conjunctivitis** — no medicine kills the virus. **Cold compresses** and **lubricating eye drops** (artificial tears) ease discomfort while it settles. Antibiotic drops do not help viral conjunctivitis.",
        "**Bacterial conjunctivitis** — often clears by itself, but **antibiotic eye drops** or ointment prescribed by a doctor can speed recovery.",
        "**Allergic conjunctivitis** — avoiding the trigger, cold compresses and **anti-allergy eye drops** help. Rubbing makes itching worse.",
        "Clean discharge gently with cooled boiled water and clean cotton, using a fresh piece for each eye.",
        "Stop wearing contact lenses until the eye has fully recovered, and replace the lenses and case.",
      ],
    },
    {
      k: "note",
      tone: "alert",
      title: "Do not use steroid eye drops without an eye examination",
      text: "Combination drops containing a steroid are often sold over the counter for red eyes. Used without an eye doctor's examination, steroid drops can make some infections — such as herpes or fungal infections of the cornea — much worse, and long-term use can cause glaucoma and cataract. Use steroid drops only when an eye doctor prescribes them and checks you.",
    },
    {
      k: "p",
      text: "Do not put breast milk, rose water, honey, herbal drops or other home remedies into the eye, and do not use someone else's drops. If drops are prescribed, finish the course and do not stop prescribed treatment early on your own.",
    },

    { k: "h2", text: "Preventing spread" },
    {
      k: "ul",
      items: [
        "Wash hands often, especially after touching the eyes or putting in drops",
        "Do not share towels, pillows, eye drops, cosmetics or glasses",
        "Keep children with infectious conjunctivitis home from school until the discharge has settled, or as their doctor advises",
        "Change pillowcases and towels frequently",
        "Avoid swimming pools until the infection has cleared",
        "Dark glasses do not stop spread, though they may ease light sensitivity",
      ],
    },
    {
      k: "p",
      text: "During outbreaks, schools and workplaces often see many cases at once. Hand washing, keeping hands away from the face and staying home while the eye is discharging do more to protect others than any medicine. People with allergic conjunctivitis can carry on as normal, as it does not spread.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Go to an eye hospital or emergency department the same day — call 112 or 108 if you cannot get there — for a red eye with:" },
    {
      k: "ul",
      items: [
        "Moderate or severe eye pain",
        "Reduced vision that does not clear with blinking",
        "Strong sensitivity to light",
        "A white spot on the cornea, especially in contact lens wearers",
        "A chemical splash or injury",
        "Fever with swelling and redness of the eyelids and skin around the eye",
        "Discharge in a newborn baby",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is this viral, bacterial or allergic conjunctivitis?",
        "Do I need drops, and which ones?",
        "How long will I be contagious?",
        "When can I go back to school or work?",
        "When can I wear contact lenses again?",
        "Which signs mean I should come back urgently?",
      ],
    },
  ],
  faqs: [
    {
      q: "How long does pink eye last?",
      a: "Viral conjunctivitis usually improves within one to two weeks, sometimes longer. Bacterial conjunctivitis often settles within a week, faster with antibiotic drops. Allergic conjunctivitis continues as long as you are exposed to the trigger. See a doctor if it is not improving.",
    },
    {
      q: "Can I catch conjunctivitis by looking at someone?",
      a: "No. Conjunctivitis spreads through contact — hands touching the eyes, shared towels, pillows, drops or cosmetics — not by looking at someone. Good hand washing and not sharing personal items are the most effective ways to prevent spread.",
    },
    {
      q: "Are antibiotic eye drops always needed?",
      a: "No. Most conjunctivitis is viral, and antibiotic drops do not help it. Bacterial conjunctivitis often clears on its own too, though antibiotics can speed recovery. A doctor can tell which type you have and whether drops are needed.",
    },
    {
      q: "Why shouldn't I use steroid eye drops from the chemist?",
      a: "Steroid drops can make some eye infections, particularly herpes and fungal infections, much worse and can damage the cornea. Long-term use can also cause glaucoma and cataract. They should be used only when an eye doctor has examined you and prescribed them.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Pink Eye", url: "https://medlineplus.gov/pinkeye.html" },
    { label: "American Academy of Ophthalmology — Conjunctivitis: What Is Pink Eye?", url: "https://www.aao.org/eye-health/diseases/pink-eye-conjunctivitis" },
  ],
};
