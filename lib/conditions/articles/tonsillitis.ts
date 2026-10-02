import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "tonsillitis",
  title: "Tonsillitis: symptoms, treatment and when to remove tonsils",
  standfirst: "What tonsillitis is, viral versus bacterial causes, when antibiotics help, the warning signs of a throat abscess, and when tonsil surgery is advised.",
  targetQuery: "tonsillitis symptoms and treatment",
  department: "ent",
  specialty: "ent",
  alsoSee: ["paediatrics", "general-practice"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Sore throat", "Pain on swallowing", "Fever", "Swollen tonsils", "White patches on the tonsils", "Swollen neck glands"],
  tests: ["Throat examination", "Throat swab", "Rapid strep test", "Blood tests"],
  treatments: ["Rest and fluids", "Pain relief", "Antibiotics", "Tonsillectomy"],
  body: [
    { k: "h2", text: "What tonsillitis is" },
    {
      k: "p",
      text: "The tonsils are two pads of tissue at the back of the throat, one on each side. They are part of the immune system and help catch germs entering through the mouth and nose. Tonsillitis is infection and inflammation of the tonsils.",
    },
    {
      k: "p",
      text: "Most tonsillitis is caused by **viruses**, such as those that cause colds and flu, and gets better by itself within a week. Some is caused by **bacteria**, most often group A streptococcus ('strep throat'), which is commonest in school-age children. Treating strep throat matters, because in a small number of people it can lead to rheumatic fever, which can damage the heart valves. Tonsillitis is common in children and teenagers and less common in adults.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Sore throat",
        "Pain on swallowing, sometimes felt in the ears",
        "Fever, headache and tiredness",
        "Swollen tonsils that look red",
        "White patches on the tonsils, or yellow pus",
        "Swollen neck glands that are tender",
        "Bad breath and a muffled voice",
        "In young children: refusing to eat or drink, drooling, tummy pain or vomiting",
      ],
    },
    {
      k: "p",
      text: "A cough, runny nose, hoarse voice and red eyes point more towards a virus. Fever, swollen tender glands, pus on the tonsils and no cough make a bacterial cause more likely, but symptoms alone cannot always tell them apart.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    {
      k: "ul",
      items: [
        "Children aged roughly five to fifteen, especially once they start school",
        "Close contact with someone who has a sore throat — in classrooms, hostels and crowded homes",
        "Seasonal colds and flu",
        "Tobacco smoke, which irritates the throat",
      ],
    },
    {
      k: "p",
      text: "Glandular fever (infectious mononucleosis), caused by the Epstein–Barr virus, can cause severe tonsillitis with extreme tiredness, mainly in teenagers and young adults. Diphtheria, now uncommon because of vaccination, can also cause a sore throat with a grey membrane over the tonsils and is an emergency; keep children's vaccinations up to date.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Tonsillitis is usually diagnosed from your symptoms and a **throat examination**, with a look at the neck glands and ears. Depending on the picture, the doctor may use:",
    },
    {
      k: "ul",
      items: [
        "**Throat swab** — a cotton swab of the tonsils sent to the laboratory to grow bacteria",
        "**Rapid strep test** — a swab that gives a result within minutes",
        "**Blood tests** — a blood count and a test for glandular fever if that is suspected",
      ],
    },
    {
      k: "p",
      text: "If one tonsil is pushed towards the middle, with severe pain and difficulty opening the mouth, a peritonsillar abscess (quinsy) is suspected and an ENT surgeon is needed urgently.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Most tonsillitis is managed by a [general physician](/specialties/general-practice), or a [paediatrician](/specialties/paediatrics) for children. See an [ENT surgeon](/specialties/ent) for repeated attacks, a suspected abscess, tonsils so large that they cause snoring or pauses in breathing during sleep, a tonsil that is enlarged on one side only, or tonsillitis that is not improving.",
    },
    {
      k: "p",
      text: "You can [find ENT surgeons in Bengaluru](/doctors/karnataka/bengaluru/ent-surgeons), [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) or [general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    { k: "h3", text: "Care at home" },
    {
      k: "p",
      text: "**Rest and fluids** — water, warm soups, and cold drinks or ice lollies for children — help most. Soft foods are easier to swallow. **Pain relief** with paracetamol, or another painkiller your doctor advises for your age, eases pain and fever; give it regularly so that children can drink. Warm salt-water gargles and lozenges help older children and adults.",
    },
    { k: "h3", text: "Antibiotics" },
    {
      k: "p",
      text: "**Antibiotics** help only bacterial tonsillitis. They are prescribed when strep throat is confirmed or likely. Take the full course, even when the throat feels better after a day or two, because stopping early raises the risk of complications. Antibiotics do not help viral tonsillitis, and taking them unnecessarily causes side effects and adds to antibiotic resistance. Do not use leftover antibiotics or buy them without a prescription.",
    },
    { k: "h3", text: "Tonsillectomy" },
    {
      k: "p",
      text: "A **tonsillectomy** — surgery to remove the tonsils — is considered when attacks are frequent and severe enough to disrupt school or work over several years, when there has been a peritonsillar abscess more than once, or when large tonsils block breathing during sleep. ENT surgeons follow guidelines on how many attacks justify surgery, and many children's attacks become less frequent as they grow, so waiting is often reasonable. Recovery takes about two weeks, and bleeding after the operation, though uncommon, needs urgent attention.",
    },

    { k: "h2", text: "Living with tonsillitis and preventing spread" },
    {
      k: "ul",
      items: [
        "Keep children home until fever has settled and they feel better, or for a day after starting antibiotics for strep throat",
        "Wash hands often, and do not share cups, spoons or toothbrushes",
        "Keep a note of attacks — dates, school days missed and treatment — if they keep coming back; it helps the ENT surgeon decide",
        "Keep up with routine vaccinations",
      ],
    },
    {
      k: "p",
      text: "Replace a toothbrush after a bout of tonsillitis, and avoid smoking around children with frequent sore throats.",
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "Difficulty breathing, noisy breathing or drooling because swallowing is impossible",
        "Inability to open the mouth fully, with severe one-sided throat pain",
        "Signs of dehydration — very little urine, a dry mouth, or a child who is drowsy",
        "Bleeding from the throat after tonsil surgery",
        "A grey or white membrane over the throat in a child who is very unwell",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is this viral or bacterial tonsillitis?",
        "Does it need antibiotics, and for how long?",
        "When can my child go back to school?",
        "Which signs mean we should come back urgently?",
        "Do the number of attacks justify removing the tonsils?",
        "What are the risks and recovery after tonsillectomy?",
      ],
    },
  ],
  faqs: [
    {
      q: "Is tonsillitis contagious?",
      a: "The viruses and bacteria that cause tonsillitis spread through coughs, sneezes and shared utensils, so it can pass to others. Washing hands, covering coughs and not sharing cups help. People with strep throat are much less infectious about a day after starting antibiotics.",
    },
    {
      q: "Does removing the tonsils weaken immunity?",
      a: "No. The tonsils are a small part of a large immune system, and studies have not shown a meaningful effect on immunity after tonsillectomy. Surgery is advised only when the benefits — fewer infections or better breathing during sleep — clearly outweigh the risks.",
    },
    {
      q: "Should I avoid cold drinks and ice cream with tonsillitis?",
      a: "Cold drinks and ice lollies do not cause or worsen tonsillitis, and many children find them soothing when swallowing hurts. What matters most is drinking enough. Warm drinks and soups are fine too if they are more comfortable.",
    },
    {
      q: "Can adults get tonsillitis?",
      a: "Yes, although it is less common than in children. Adults with severe or recurring tonsillitis, a tonsil that is bigger on one side, or a sore throat lasting more than a couple of weeks should see a doctor, as other conditions need to be ruled out.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Tonsillitis", url: "https://medlineplus.gov/tonsillitis.html" },
    { label: "American Academy of Otolaryngology–Head and Neck Surgery (ENT Health) — Tonsillitis", url: "https://www.enthealth.org/conditions/tonsillitis/" },
  ],
};
