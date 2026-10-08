import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "rosacea",
  title: "Rosacea: symptoms, triggers, treatment and which doctor to see",
  metaTitle: "Rosacea: symptoms, triggers and treatment",
  standfirst: "Why the face flushes and breaks out in rosacea, how it differs from acne, common triggers, why steroid creams worsen it, and how a dermatologist treats it.",
  targetQuery: "rosacea symptoms and treatment",
  department: "dermatology",
  specialty: "dermatology",
  alsoSee: ["ophthalmology", "cosmetology"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Facial redness", "Flushing", "Visible blood vessels", "Bumps and pimples", "Burning or stinging", "Eye irritation"],
  tests: ["Skin examination", "Eye examination"],
  treatments: ["Gentle skin care", "Sunscreen", "Prescription creams", "Oral antibiotics", "Laser treatment"],
  body: [
    { k: "h2", text: "What rosacea is" },
    {
      k: "p",
      text: "Rosacea is a long-term skin condition that mainly affects the centre of the face — the cheeks, nose, chin and forehead. It causes redness and flushing, and in many people small red bumps and pus-filled spots that look like acne. It usually comes and goes in flares, with weeks or months of calmer skin in between. In some people it also affects the eyes.",
    },
    {
      k: "p",
      text: "Rosacea most often begins in adults between their thirties and fifties and is more often diagnosed in women and in people with fair skin, although men tend to have more severe thickening of the nose. It does occur in people with brown and darker skin; in them the redness can be harder to see, so it may be mistaken for acne, sensitive skin or an allergy, and the diagnosis is sometimes missed.",
    },
    {
      k: "p",
      text: "Rosacea is not infectious and is not caused by poor hygiene. There is no permanent fix, but treatment can control it well, and recognising your triggers makes a real difference.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Facial redness that lasts, especially across the nose and cheeks",
        "Flushing — sudden waves of redness and heat, often set off by heat, sun, spicy food or emotion",
        "Visible blood vessels — fine red lines on the cheeks and nose",
        "Bumps and pimples, sometimes with pus, but usually without the blackheads and whiteheads typical of [acne](/conditions/acne)",
        "Burning or stinging, and skin that reacts to many creams and cosmetics",
        "Dry, rough or swollen skin",
        "Thickened, bumpy skin on the nose (rhinophyma), mostly in men with long-standing rosacea",
        "Eye irritation — gritty, dry, watery or red eyes and swollen eyelids, called ocular rosacea",
      ],
    },
    {
      k: "p",
      text: "Doctors sometimes group rosacea by its main features — redness and visible vessels, bumps and pimples, skin thickening, or eye involvement — but many people have a mix, and the pattern can change over time.",
    },

    { k: "h2", text: "Causes and triggers" },
    {
      k: "p",
      text: "The cause is not fully understood. It appears to involve blood vessels in the face that widen too easily, an overactive immune response in the skin, and a combination of genetic and environmental factors. Rosacea often runs in families. Tiny mites that live normally on everyone's face (Demodex) are found in larger numbers in some people with rosacea and may play a part.",
    },
    { k: "p", text: "Things that commonly set off a flare include:" },
    {
      k: "ul",
      items: [
        "Sun exposure and hot, humid weather",
        "Heat from cooking over a stove, hot baths, saunas or a hot room",
        "Spicy food and hot drinks such as tea and coffee",
        "Alcohol",
        "Stress, embarrassment or strong emotion",
        "Vigorous exercise",
        "Harsh soaps, scrubs, astringents, some cosmetics and fragrances",
        "Cold wind",
      ],
    },
    { k: "h3", text: "A warning about steroid creams" },
    {
      k: "p",
      text: "In India, creams containing steroids are often bought without a prescription and used on the face for redness, pimples or to lighten skin, sometimes in mixed 'fairness' or 'all-in-one' creams. Steroids may calm redness for a short time, but long-term use on the face can cause a rosacea-like rash, thin the skin and make true rosacea much worse, with a flare when the cream is stopped. Do not use steroid creams on your face unless a dermatologist has prescribed them, and show your doctor every cream you have been using.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "There is no single test for rosacea. A dermatologist diagnoses it from a **skin examination** and your history: when the redness started, what triggers it, what creams and medicines you use, and whether your eyes are affected. Occasionally, tests are done to rule out conditions that can look similar, such as acne, seborrhoeic dermatitis, a skin allergy, or [lupus](/conditions/lupus), which can cause a red rash across the cheeks and nose. If you have eye symptoms, an **eye examination** by an ophthalmologist checks for inflammation of the eyelids or the surface of the eye.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment is chosen according to which features bother you most, and usually combines daily care with medicines. It can take several weeks to see a clear improvement, and many people need ongoing treatment to keep rosacea under control.",
    },
    { k: "h3", text: "Daily care" },
    {
      k: "ul",
      items: [
        "**Gentle skin care** — wash with lukewarm water and a mild, fragrance-free cleanser; pat dry rather than rub; avoid scrubs, toners with alcohol and facial steaming",
        "A light, fragrance-free moisturiser to support the skin barrier",
        "**Sunscreen** every day, ideally a broad-spectrum, mineral-based one, with a hat and shade in strong sun",
        "Keep a simple diary of flares to identify your own triggers, then reduce the ones you can",
        "Test any new product on a small patch of skin first",
      ],
    },
    { k: "h3", text: "Medicines" },
    {
      k: "p",
      text: "**Prescription creams** and gels are the first step for bumps and pimples, and some help redness. For more widespread or stubborn spots, a dermatologist may add **oral antibiotics** from the tetracycline group, used for their anti-inflammatory effect, often at low doses and for a limited period. In severe cases that do not respond, other tablets are sometimes used under close supervision. Some creams can reduce persistent redness for a few hours at a time.",
    },
    { k: "h3", text: "Procedures" },
    {
      k: "p",
      text: "**Laser treatment** or intense pulsed light can reduce visible blood vessels and persistent redness. Several sessions are often needed, and results vary. Thickened skin on the nose can be reshaped with laser or surgery. These are usually done by a dermatologist or plastic surgeon with experience of the condition.",
    },
    { k: "h3", text: "Eye care" },
    {
      k: "p",
      text: "Ocular rosacea is helped by warm compresses and gentle eyelid cleaning, lubricating eye drops, and sometimes antibiotic or anti-inflammatory treatment prescribed by an eye doctor.",
    },

    { k: "h2", text: "Living with rosacea" },
    {
      k: "p",
      text: "Rosacea is visible, and many people feel self-conscious, anxious or low because of it. It can help to know that it is a common, recognised medical condition, and that treatment usually improves it. Green-tinted primers and light make-up can be used to cover redness if you wish; choose products labelled non-comedogenic and fragrance-free. If rosacea is affecting your mood or confidence, tell your doctor.",
    },

    { k: "h2", text: "When to see a doctor, and when it is urgent" },
    {
      k: "p",
      text: "See a dermatologist if facial redness or spots do not settle, if you think you might have rosacea, or if over-the-counter acne or steroid creams are making things worse. See an eye doctor if your eyes are often red, gritty or sore.",
    },
    {
      k: "p",
      text: "Seek urgent care the same day for a painful red eye, blurred vision or sensitivity to light, as the surface of the eye can be damaged. Call 112 or 108, or go to the nearest emergency department, if facial redness comes with swelling of the lips, tongue or throat or difficulty breathing — this is a severe allergic reaction, not rosacea.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [dermatologist](/specialties/dermatology) diagnoses and treats rosacea. An [ophthalmologist](/specialties/ophthalmology) treats ocular rosacea. For lasers and procedures, a dermatologist or a [cosmetologist](/specialties/cosmetology) with medical training may be involved.",
    },
    {
      k: "p",
      text: "You can [find dermatologists in Bengaluru](/doctors/karnataka/bengaluru/dermatologists) or [ophthalmologists in Bengaluru](/doctors/karnataka/bengaluru/ophthalmologists) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Is rosacea the same as acne?",
      a: "No. Both can cause pimples, but acne usually has blackheads and whiteheads and often starts in the teens, while rosacea tends to start in adulthood with redness and flushing, and no blackheads. Some acne treatments can irritate rosacea, so getting the diagnosis right matters.",
    },
    {
      q: "Can rosacea go away permanently?",
      a: "Rosacea is a long-term condition that tends to come and go. There is no permanent fix, but most people can control it well with gentle skin care, sun protection, avoiding triggers and treatment from a dermatologist. Periods of clear skin are common.",
    },
    {
      q: "Does spicy food cause rosacea?",
      a: "Spicy food does not cause rosacea, but in some people it triggers flushing and flares. Triggers vary from person to person. Keeping a simple diary helps you find yours; you may not need to give up every food that is commonly listed.",
    },
    {
      q: "Can I use a steroid cream for redness on my face?",
      a: "Not without a dermatologist's advice. Steroid creams used on the face for weeks or months can thin the skin and cause or worsen a rosacea-like rash, which flares when the cream is stopped. If you have been using one, tell your doctor rather than stopping suddenly on your own.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Rosacea", url: "https://medlineplus.gov/rosacea.html" },
    { label: "MedlinePlus Genetics — Rosacea", url: "https://medlineplus.gov/genetics/condition/rosacea" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
