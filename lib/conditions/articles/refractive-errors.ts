import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "refractive-errors",
  title: "Refractive errors: myopia, glasses, lenses and LASIK",
  standfirst: "What short sight, long sight, astigmatism and presbyopia are, the signs in children, how eyes are tested, and the options from glasses to laser surgery.",
  targetQuery: "myopia hypermetropia astigmatism treatment",
  department: "ophthalmology",
  specialty: "ophthalmology",
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Blurred distance vision", "Blurred near vision", "Eye strain", "Headaches", "Squinting"],
  tests: ["Visual acuity test", "Refraction test", "Cycloplegic refraction", "Dilated eye examination"],
  treatments: ["Glasses", "Contact lenses", "Myopia control", "LASIK", "Implantable lenses"],
  body: [
    { k: "h2", text: "What refractive errors are" },
    {
      k: "p",
      text: "For clear sight, the cornea (the clear front window of the eye) and the lens must bend light so that it focuses exactly on the retina at the back. A refractive error means the light focuses in the wrong place, usually because of the shape or length of the eye. The result is blurred vision. Refractive errors are the commonest eye problem worldwide and a leading cause of poor vision — yet almost all can be corrected simply.",
    },
    { k: "p", text: "The main types are:" },
    {
      k: "ul",
      items: [
        "**Myopia** (short sight or near-sightedness) — distant objects are blurred; near vision is clear",
        "**Hypermetropia** (long sight) — near objects are blurred, and in higher degrees distance too; it causes strain in children",
        "**Astigmatism** — an unevenly curved cornea causes blur or distortion at all distances",
        "**Presbyopia** — the natural loss of near focusing with age, usually noticed in the forties, when reading small print becomes hard",
      ],
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Blurred distance vision — difficulty reading the board at school, road signs or the television",
        "Blurred near vision — difficulty reading, sewing or using a phone",
        "Eye strain, tired or watery eyes",
        "Headaches after reading or screen work",
        "Squinting, sitting close to the TV or holding books very close",
        "In children: rubbing the eyes, losing interest in reading, poor school performance, or one eye turning in or out",
      ],
    },
    {
      k: "p",
      text: "Children rarely complain of blurred vision because they assume everyone sees the way they do, so routine eye checks matter.",
    },

    { k: "h2", text: "Causes and who is at risk in India" },
    {
      k: "p",
      text: "Refractive errors often run in families. **Myopia** in children is becoming more common in many parts of the world, including Indian cities. Long hours of close work — reading, screens and phones — and too little time outdoors in daylight are thought to contribute. Presbyopia affects almost everyone with age. Diabetes can cause vision to fluctuate when sugar levels change.",
    },
    {
      k: "p",
      text: "A child with a large uncorrected difference between the two eyes, or a squint, can develop a 'lazy eye' (amblyopia), in which vision does not develop properly. This is treatable when found early in childhood, but much harder later.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "ul",
      items: [
        "**Visual acuity test** — reading letters or pictures on a chart at a distance and close up",
        "**Refraction test** — lenses are placed in front of the eyes, or a machine measures the eye, to find the prescription that gives the clearest vision",
        "**Cycloplegic refraction** — for children, drops temporarily relax the focusing muscle so the true prescription can be measured",
        "**Dilated eye examination** — checks the health of the retina and optic nerve, especially in high myopia, which increases the risk of retinal problems",
      ],
    },
    {
      k: "p",
      text: "Eye tests are usually advised for children before starting school and regularly after that, and for adults every year or two, or sooner if vision changes.",
    },

    { k: "h2", text: "Who to see" },
    {
      k: "p",
      text: "Optometrists test vision and prescribe glasses and contact lenses. An [ophthalmologist](/specialties/ophthalmology) — an eye doctor and surgeon — should examine children with squint, suspected lazy eye or rapidly increasing myopia, adults with high prescriptions, sudden changes in vision, or anyone considering laser surgery.",
    },
    {
      k: "p",
      text: "Under India's National Programme for Control of Blindness and Visual Impairment, eye screening and free spectacles are provided to school children and older people. Ask at your child's school or nearest government hospital. You can also [find ophthalmologists in Bengaluru](/doctors/karnataka/bengaluru/ophthalmologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "ul",
      items: [
        "**Glasses** — the simplest and safest correction for all ages. Wearing glasses does not make the eyes weaker or dependent on them. Children should wear them as prescribed.",
        "**Contact lenses** — suit many teenagers and adults. They need careful hygiene: never sleep or swim in them unless designed for it, never rinse them with tap water, and replace them on schedule, because infections can threaten sight.",
        "**Myopia control** — for children whose myopia is increasing, eye doctors may suggest special low-dose eye drops, special spectacle or contact lenses, together with more time outdoors. Your doctor will decide based on the child's age and how fast the myopia is changing.",
        "**LASIK** and related laser surgeries — reshape the cornea to correct myopia, hypermetropia and astigmatism in adults whose prescription has been stable. Not everyone is suitable; thin corneas and some eye conditions rule it out.",
        "**Implantable lenses** — a lens placed inside the eye, for high prescriptions or people unsuitable for laser surgery.",
      ],
    },
    {
      k: "p",
      text: "Presbyopia is usually corrected with reading glasses or multifocal or progressive lenses. Ready-made reading glasses from a shop can help some people, but they do not replace an eye examination, which also checks for glaucoma, cataract and other conditions.",
    },

    { k: "h2", text: "Protecting children's eyes" },
    {
      k: "ul",
      items: [
        "Encourage at least a couple of hours outdoors in daylight every day",
        "Take regular breaks from close work: look into the distance for a short while every twenty minutes or so",
        "Limit recreational screen time, especially for young children",
        "Ensure good lighting for reading and homework",
        "Check children's vision before school and regularly afterwards",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Go to an eye hospital or emergency department urgently — call 112 or 108 if you cannot get there — for:" },
    {
      k: "ul",
      items: [
        "Sudden loss or blurring of vision in one or both eyes",
        "A shower of new floaters, flashes of light, or a curtain over part of the vision — especially if you are highly short-sighted, as this can mean a retinal detachment",
        "A painful red eye in a contact lens wearer",
        "An eye injury or chemical splash",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What is my prescription, and is it stable?",
        "Does my child need glasses full-time?",
        "Is my child's myopia increasing, and is myopia control suitable?",
        "Is there any sign of lazy eye or squint?",
        "Am I suitable for laser surgery, and what are the risks?",
        "How often should we have eye tests?",
      ],
    },
  ],
  faqs: [
    {
      q: "Will wearing glasses make my eyes weaker?",
      a: "No. Glasses correct the blur but do not change the shape of the eye or make it weaker. Children's prescriptions often change as they grow, which is natural. Not wearing prescribed glasses can cause strain and, in young children, lazy eye.",
    },
    {
      q: "Can eye exercises or diet cure short sight?",
      a: "No. Exercises, diets and supplements have not been shown to reverse myopia. Spending time outdoors may help slow its onset in children, and specific treatments can slow its progression, but correction with glasses, lenses or surgery is still needed.",
    },
    {
      q: "At what age can I have LASIK?",
      a: "Laser surgery is usually considered for adults whose prescription has been stable for at least a year, often from the early twenties. A detailed eye examination decides whether your corneas and eyes are suitable. Your eye surgeon will explain the risks and expected results.",
    },
    {
      q: "Why does my child need eye drops for an eye test?",
      a: "Children's focusing muscles are very strong and can hide the true prescription. Drops relax them for a few hours so the eye can be measured accurately. Vision is blurred and the eyes are sensitive to light until the drops wear off.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Refractive Errors", url: "https://medlineplus.gov/refractiveerrors.html" },
    { label: "World Health Organization — Blindness and vision impairment fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/blindness-and-visual-impairment" },
    { label: "Ministry of Health and Family Welfare — National Programme for Control of Blindness and Visual Impairment", url: "https://www.mohfw-dohfw.gov.in/static/uploads/2026/05/66d3b490caef1e37d7ed1d783ed93ff4.pdf" },
  ],
};
