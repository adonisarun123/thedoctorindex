import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "acne",
  title: "Acne: causes, treatment, scars and when to see a dermatologist",
  metaTitle: "Acne: causes, treatment and when to see a dermatologist",
  standfirst: "What causes acne, what helps and what makes it worse, the treatments a dermatologist uses, how to prevent scars, and why steroid creams are risky.",
  targetQuery: "acne treatment and causes",
  department: "dermatology",
  specialty: "dermatology",
  alsoSee: ["gynaecology", "endocrinology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Blackheads", "Whiteheads", "Pimples", "Cysts", "Dark marks", "Scarring"],
  tests: ["Skin examination", "Hormone tests"],
  treatments: ["Benzoyl peroxide", "Topical retinoids", "Antibiotics", "Isotretinoin", "Hormonal treatment"],
  body: [
    { k: "h2", text: "What acne is" },
    {
      k: "p",
      text: "Acne is a common skin condition of the hair follicles and the oil glands attached to them. It shows up as blackheads, whiteheads and pimples, mainly on the face, but also on the chest, back and shoulders, where oil glands are most active.",
    },
    {
      k: "p",
      text: "Four things come together. The glands make more oil (sebum), often in response to hormones; dead skin cells block the opening of the follicle; bacteria that normally live on the skin multiply in the blocked pore; and the skin reacts with inflammation. Treatments work by targeting one or more of these steps.",
    },
    {
      k: "p",
      text: "Acne is most common in teenagers but often continues into, or starts in, adulthood, especially in women. It is not caused by dirt, and it is not a sign of poor hygiene. It is very treatable, and treating it early is the best way to prevent scars.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Blackheads — open pores plugged with dark material, which is oxidised oil, not dirt",
        "Whiteheads — small closed bumps under the skin surface",
        "Pimples — red, tender bumps, some with a yellow or white top",
        "Nodules and cysts — large, deep, painful lumps that can last weeks",
        "Dark marks left after spots heal, which are very common on brown skin",
        "Scarring — pitted or raised scars, mostly after deep or picked spots",
      ],
    },
    {
      k: "p",
      text: "The dark marks, called post-inflammatory hyperpigmentation, are not true scars and usually fade over months once the acne is controlled. Real scars change the texture of the skin and are permanent without procedures, which is why deep acne should be treated promptly.",
    },

    { k: "h2", text: "Causes and who is at risk" },
    { k: "p", text: "Things that can cause or worsen acne include:" },
    {
      k: "ul",
      items: [
        "Hormonal changes at puberty, before periods and in pregnancy",
        "Polycystic ovary syndrome (PCOS), which can cause acne along with irregular periods and extra facial or body hair",
        "A family history of acne",
        "Heavy, oily creams, hair oils that run onto the forehead, and thick make-up",
        "Some medicines, including steroids taken by mouth or applied to the face, and some body-building supplements",
        "Friction from helmets, masks, straps or a phone held against the face",
        "Squeezing or picking spots, which pushes inflammation deeper",
      ],
    },
    {
      k: "p",
      text: "Stress does not cause acne but can make it worse. The link with food is weaker than many people believe; for some, high-sugar foods and dairy may play a part, and a dermatologist can help you judge whether it is worth changing your diet.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Acne is diagnosed with a **skin examination**. The dermatologist will look at the types of spots, where they are, how severe they are and whether there is scarring or dark marking. They will ask about the products and medicines you use.",
    },
    {
      k: "p",
      text: "Most people need no tests. In women whose acne comes with irregular periods, excess hair growth, scalp hair thinning or sudden onset in adulthood, **hormone tests** and sometimes a pelvic ultrasound may be advised to look for PCOS or another hormonal cause. Blood tests are also needed before and during some treatments, such as isotretinoin.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [dermatologist](/specialties/dermatology) is the specialist for acne. See one if over-the-counter washes and gels have not helped after a couple of months, if you have painful deep spots, if spots are leaving scars or dark marks, or if acne is affecting your confidence. If PCOS or another hormonal problem is suspected, a [gynaecologist](/specialties/gynaecology) or [endocrinologist](/specialties/endocrinology) may share your care.",
    },
    {
      k: "p",
      text: "You can [find dermatologists in Bengaluru](/doctors/karnataka/bengaluru/dermatologists), [gynaecologists](/doctors/karnataka/bengaluru/gynaecologists) and [endocrinologists](/doctors/karnataka/bengaluru/endocrinologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Most acne treatments take six to eight weeks to show clear results, and acne often looks a little worse at first. Keep going unless your doctor advises otherwise. Treatment is chosen by severity and type.",
    },
    { k: "h3", text: "Creams and gels" },
    {
      k: "p",
      text: "**Benzoyl peroxide** reduces bacteria and inflammation. **Topical retinoids**, such as adapalene and tretinoin, unblock pores and prevent new spots, and are the backbone of long-term control. Azelaic acid helps both acne and dark marks. These can cause dryness and irritation at the start, so dermatologists usually suggest a small amount, used gradually, with a light non-oily moisturiser and sunscreen. Retinoids are generally avoided in pregnancy.",
    },
    { k: "h3", text: "Tablets" },
    {
      k: "p",
      text: "For moderate or widespread acne, **antibiotics** by mouth may be added for a limited period, always together with a cream such as benzoyl peroxide to reduce the chance of resistant bacteria. In women, **hormonal treatment**, such as certain combined contraceptive pills or spironolactone, can help when acne is linked to hormones.",
    },
    {
      k: "p",
      text: "**Isotretinoin** is a powerful tablet for severe, scarring or stubborn acne. It works well but needs a prescription and regular monitoring. It causes serious birth defects, so pregnancy must be avoided during treatment and for a period afterwards. Your dermatologist will discuss mood changes and other side effects before you start.",
    },
    {
      k: "note",
      text: "Do not use steroid creams, or mixed creams combining a steroid with antibiotic and antifungal ingredients, on acne. They are often sold without a prescription, but they cause steroid acne, thin the skin and make the face red and sensitive. Also avoid applying toothpaste, lemon or other home remedies that burn the skin.",
    },
    { k: "h3", text: "Scars and marks" },
    {
      k: "p",
      text: "Once acne is controlled, dermatologists can treat scars with procedures such as chemical peels, microneedling, lasers and subcision. These work best after active acne has settled.",
    },

    { k: "h2", text: "Living with acne" },
    {
      k: "p",
      text: "Wash your face twice a day with a gentle cleanser, avoid scrubbing, and choose products labelled non-comedogenic. Keep hair oil off the face, clean phone screens and helmet pads, and avoid picking. Use a sunscreen daily, because many treatments make skin sensitive and sun exposure darkens marks. Once your skin is clear, a maintenance cream, often a retinoid, helps keep it that way. Acne can affect mood and self-esteem; if it is getting you down, say so.",
    },

    { k: "h2", text: "When it is urgent" },
    {
      k: "p",
      text: "Acne itself is not an emergency. Call 112 or 108, or go to an emergency department, if you develop swelling of the face, lips or throat or difficulty breathing after starting a new medicine, or a widespread blistering or peeling rash with fever. If you notice low mood while on any acne treatment, including isotretinoin, contact your dermatologist the same day. Thoughts of harming yourself need urgent help: call 112, or the free Tele-MANAS mental health helpline on 14416.",
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "What type and severity of acne do I have?",
        "How should I use each cream, and what irritation is normal?",
        "How long before I should expect improvement?",
        "Could a hormonal problem such as PCOS be involved?",
        "Is isotretinoin an option for me, and what monitoring would I need?",
        "What can be done for the marks and scars once the acne is controlled?",
      ],
    },
  ],
  faqs: [
    {
      q: "Does eating oily food or chocolate cause acne?",
      a: "There is little evidence that oily food or chocolate causes acne in most people. Some studies suggest high-sugar foods and dairy may worsen it in some individuals. A balanced diet is sensible, but treatment of the skin itself makes the biggest difference.",
    },
    {
      q: "Why are my pimples leaving dark spots?",
      a: "Brown or dark marks after a pimple are caused by inflammation stimulating pigment, which is common on Indian skin. They usually fade over months once acne is controlled. Daily sunscreen and avoiding picking help, and a dermatologist can prescribe creams to speed fading.",
    },
    {
      q: "Is isotretinoin safe?",
      a: "Isotretinoin is very effective and widely used, but it must be prescribed and monitored by a doctor. It causes birth defects, so pregnancy must be avoided during and after treatment as advised, and it can cause dryness, blood test changes and, uncommonly, mood changes.",
    },
    {
      q: "Can I use a fairness or steroid cream to clear my pimples?",
      a: "No. Many fairness and mixed creams contain steroids, which can trigger acne, thin the skin and cause redness that is hard to reverse. Use only creams your dermatologist has recommended, and check the label for steroid ingredients before applying anything to your face.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Acne", url: "https://medlineplus.gov/acne.html" },
    { label: "American Academy of Dermatology — Acne resource centre", url: "https://www.aad.org/public/diseases/acne" },
    { label: "Press Information Bureau, Government of India — Tele-MANAS launched with 24/7 toll-free helpline 14416", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1866498" },
  ],
};
