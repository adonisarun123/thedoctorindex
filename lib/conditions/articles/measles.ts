import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "measles",
  title: "Measles: symptoms, complications, vaccine and which doctor to see",
  metaTitle: "Measles: symptoms, complications and vaccination",
  standfirst: "How measles spreads, the rash and early signs to look for, the complications that make it serious for children, home care, vitamin A and vaccination.",
  targetQuery: "measles symptoms in children",
  department: "infectious-diseases",
  specialty: "paediatrics",
  alsoSee: ["general-practice", "infectious-diseases"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["High fever", "Cough", "Runny nose", "Red, watery eyes", "White spots inside the mouth", "Rash"],
  tests: ["Measles IgM antibody test", "Throat or nose swab"],
  treatments: ["Vitamin A", "Fluids", "Paracetamol", "Rest", "Hospital care"],
  body: [
    { k: "h2", text: "What measles is" },
    {
      k: "p",
      text: "Measles is a highly contagious viral infection. It is best known for its blotchy red rash, but it is far more than a rash illness: measles can weaken the immune system for some time afterwards and can lead to pneumonia, severe diarrhoea, eye damage and brain inflammation. Young children, especially those who are undernourished, are at the greatest risk of serious illness.",
    },
    {
      k: "p",
      text: "Measles is preventable with vaccination, and the vaccine is part of India's routine childhood immunisation schedule. Measles is sometimes called *khasra* in Hindi. It is different from rubella, which is sometimes called 'German measles', a separate and usually milder infection.",
    },

    { k: "h2", text: "How it spreads" },
    {
      k: "p",
      text: "The virus spreads through the air when an infected person coughs, sneezes or breathes. It can stay active in the air and on surfaces for up to two hours, so a child can catch it in a room the sick person has already left. Almost anyone who is not immune and is exposed will catch it.",
    },
    {
      k: "p",
      text: "A person with measles can spread it from about four days before the rash appears until about four days after. This is why measles moves quickly through homes, schools, crowded neighbourhoods and hospital waiting areas.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Symptoms usually start one to two weeks after exposure. The illness typically follows a pattern:",
    },
    {
      k: "ul",
      items: [
        "**First few days:** high fever, cough, runny nose, and red, watery eyes (conjunctivitis). The child is often miserable, tired and off food.",
        "**Tiny white spots inside the mouth**, on the inner cheeks, may appear shortly before the rash. Doctors call these Koplik spots.",
        "**Rash:** a few days after the fever starts, a flat red rash appears, usually beginning on the face and behind the ears and spreading down over the body over the next few days. The spots may join together.",
        "The fever often peaks as the rash appears. The rash then fades in the order it came, sometimes leaving the skin brownish and flaky.",
      ],
    },
    {
      k: "p",
      text: "Not every fever with a rash is measles. [Chickenpox](/conditions/chickenpox), [dengue](/conditions/dengue) and other viral infections can also cause a rash, so let a doctor examine the child.",
    },

    { k: "h2", text: "Complications" },
    {
      k: "p",
      text: "Most deaths from measles are caused by its complications. These are most common in children under five, in adults, in children who are malnourished or short of vitamin A, and in people with a weakened immune system. They include:",
    },
    {
      k: "ul",
      items: [
        "[Pneumonia](/conditions/pneumonia), the most common serious complication",
        "Severe [diarrhoea](/conditions/diarrhea) and dehydration",
        "Ear infections, which can affect hearing",
        "Eye damage, which can lead to blindness, especially in children short of vitamin A",
        "[Encephalitis](/conditions/encephalitis), or swelling of the brain, which can cause seizures and lasting damage",
        "Worsening malnutrition, and a higher risk of other infections in the weeks after measles",
      ],
    },
    {
      k: "p",
      text: "Measles in pregnancy can harm the mother and may lead to miscarriage or premature birth. A pregnant woman who has been near someone with measles and is not sure of her immunity should contact her doctor promptly.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Doctors often recognise measles from the pattern of fever, cough, red eyes and a spreading rash. Because health authorities track measles to control outbreaks, a test is often done to confirm it:",
    },
    {
      k: "ul",
      items: [
        "**Measles IgM antibody test** — a blood test that shows a recent infection",
        "**Throat or nose swab**, or a urine sample, tested for the virus itself",
      ],
    },
    {
      k: "p",
      text: "Call the clinic or hospital before you arrive and tell them measles is possible, so they can keep your child away from babies, pregnant women and other patients in the waiting area.",
    },

    { k: "h2", text: "Treatment and home care" },
    {
      k: "p",
      text: "There is no antiviral medicine for measles. Care supports the child while the body fights the infection, and watches for complications:",
    },
    {
      k: "ul",
      items: [
        "**Vitamin A** — the World Health Organization recommends vitamin A for children with measles, because it lowers the risk of eye damage and serious illness. Your doctor will decide the dose for your child's age; do not give supplements on your own.",
        "**Fluids** — offer water, breast milk, soups, coconut water or oral rehydration solution often, especially if there is diarrhoea.",
        "**Paracetamol** for fever and discomfort, in the dose your doctor advises for your child's weight. Do not give aspirin to children.",
        "**Rest**, with continued feeding — keep offering nutritious food even if appetite is poor.",
        "Gently clean crusted eyes with clean water, and dim the lights if they bother the child.",
        "**Hospital care** for children with breathing difficulty, dehydration, seizures, eye problems, or who are very young or malnourished.",
      ],
    },
    {
      k: "p",
      text: "Antibiotics do not treat measles, but your doctor may prescribe them if a bacterial complication such as pneumonia or an ear infection develops. Keep the child home from school or crèche until the doctor says they are no longer infectious, usually about four days after the rash appeared.",
    },

    { k: "h2", text: "Prevention: the measles vaccine" },
    {
      k: "p",
      text: "Two doses of a measles-containing vaccine give strong, long-lasting protection. In India, the measles-rubella (MR) vaccine is given free under the Universal Immunisation Programme, with the first dose at around nine months and a second dose in the second year of life. Private clinics may use the MMR vaccine, which also protects against mumps. Check your child's immunisation card, and ask your paediatrician about catch-up doses if any were missed.",
    },
    {
      k: "p",
      text: "Adults who are not sure they are immune, health workers, and people planning travel can ask their doctor whether they need vaccination. The vaccine is not given during pregnancy. If an unvaccinated person is exposed, contact a doctor quickly: a vaccine given soon after exposure, or another protective treatment for those who cannot have the vaccine, may prevent illness or make it milder.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest hospital straight away, if a child with measles has:" },
    {
      k: "ul",
      items: [
        "Fast or difficult breathing, or chest indrawing",
        "Unusual drowsiness, confusion, or a seizure",
        "Signs of dehydration: very little urine, sunken eyes, no tears, or unable to drink",
        "Refusal to feed, or vomiting everything",
        "Eye pain, cloudiness of the eye, or difficulty seeing",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Children with suspected measles should see a [paediatrician](/specialties/paediatrics); adults can see a [general physician](/specialties/general-practice). An [infectious disease specialist](/specialties/infectious-diseases) may be involved for adults with complications, pregnant women, or people with a weakened immune system. Seriously ill children are admitted to hospital.",
    },
    {
      k: "p",
      text: "You can [find paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is this measles, and does it need a test to confirm?",
        "Should my child receive vitamin A?",
        "Which signs mean we should come back or go to hospital?",
        "When can my child return to school, and who else at home needs protection?",
        "Are my child's and family's vaccinations up to date?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can a vaccinated child still get measles?",
      a: "It is uncommon. Two doses of a measles-containing vaccine protect the great majority of children for life. A small number may still catch it, but the illness is usually milder. One dose alone gives less protection, so make sure your child receives both doses on time.",
    },
    {
      q: "How long is a child with measles contagious?",
      a: "A person with measles can spread it from about four days before the rash appears until about four days after. Keep the child at home and away from babies, pregnant women and anyone with a weak immune system during this time, and follow your doctor's advice on returning to school.",
    },
    {
      q: "Is it safe to bathe a child who has measles?",
      a: "Yes. Gentle washing with lukewarm water helps keep the skin clean and the child comfortable, and there is no medical reason to avoid it. Dry the child well and keep them warm. Continue feeding and fluids, as good nutrition helps recovery.",
    },
    {
      q: "What is the difference between measles and rubella?",
      a: "They are caused by different viruses. Measles causes high fever, cough, red eyes and a spreading rash, with serious complications in some children. Rubella is usually milder but is dangerous in pregnancy, as it can harm the unborn baby. The MR vaccine protects against both.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Measles", url: "https://medlineplus.gov/measles.html" },
    { label: "World Health Organization — Measles fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/measles" },
    { label: "Emergency Response Support System, Government of India — 112", url: "https://112.gov.in/" },
  ],
};
