import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "hiv",
  title: "HIV: symptoms, testing, treatment and which doctor to see",
  standfirst: "What HIV and AIDS are, how HIV does and does not spread, where to get tested, how daily treatment keeps people well, and how to prevent infection.",
  targetQuery: "HIV symptoms testing and treatment",
  department: "infectious-diseases",
  specialty: "infectious-diseases",
  alsoSee: ["internal-medicine", "general-practice"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Fever", "Swollen glands", "Weight loss", "Night sweats", "Frequent infections"],
  tests: ["HIV test", "Viral load", "CD4 count"],
  treatments: ["Antiretroviral therapy", "Post-exposure prophylaxis", "Pre-exposure prophylaxis"],
  body: [
    { k: "h2", text: "What HIV and AIDS are" },
    {
      k: "p",
      text: "HIV, the human immunodeficiency virus, attacks the immune system, in particular a type of white blood cell called the CD4 cell, which helps the body fight infections. Without treatment, the virus slowly destroys these cells over years, and the body becomes less able to fight off infections and some cancers.",
    },
    {
      k: "p",
      text: "AIDS, acquired immunodeficiency syndrome, is the most advanced stage of untreated HIV infection, when the immune system is badly damaged and serious infections appear. Having HIV does not mean a person has AIDS. With modern treatment started early, most people with HIV never develop AIDS and can expect to live a long life, work, marry and have children. HIV cannot yet be cured, but it is a manageable long-term condition.",
    },

    { k: "h2", text: "How HIV spreads, and how it does not" },
    { k: "p", text: "HIV is passed on through certain body fluids: blood, semen, vaginal fluids, rectal fluids and breast milk. The main routes are:" },
    {
      k: "ul",
      items: [
        "Sex without a condom with a person who has HIV and is not on effective treatment",
        "Sharing needles, syringes or other injecting equipment",
        "From mother to baby during pregnancy, birth or breastfeeding, if the mother is not on treatment",
        "Rarely, through transfusion of unscreened blood or unsterile medical or tattooing equipment",
      ],
    },
    {
      k: "p",
      text: "HIV does not spread through hugging, shaking hands, sharing food, plates or toilets, coughing, sneezing, mosquito bites, or swimming pools. Caring for, working with or living with someone with HIV is safe. A person with HIV who takes treatment regularly and keeps the virus undetectable in the blood does not pass HIV on through sex — a finding often summarised as undetectable equals untransmittable.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Many people have no symptoms for years, which is why testing matters. Some people develop a short flu-like illness a few weeks after infection, with fever, sore throat, rash, body aches and swollen glands. This passes, and the virus then works silently. Without treatment, later signs can include:",
    },
    {
      k: "ul",
      items: [
        "Fever that keeps returning",
        "Swollen glands in the neck, armpits or groin",
        "Weight loss without trying",
        "Night sweats and tiredness",
        "Diarrhoea lasting weeks",
        "Frequent infections such as oral thrush, shingles or pneumonia",
      ],
    },
    {
      k: "p",
      text: "In India, [tuberculosis](/conditions/tuberculosis) is one of the commonest serious infections in people with HIV, and people diagnosed with TB are routinely offered an HIV test. None of these symptoms is specific to HIV; only a test can tell.",
    },

    { k: "h2", text: "Who should get tested" },
    {
      k: "p",
      text: "Anyone who has had sex without a condom with a partner whose HIV status they do not know, has shared injecting equipment, has had another sexually transmitted infection, hepatitis B or C, or TB, or is pregnant should consider an HIV test. Many doctors suggest that every adult has an HIV test at least once. Couples planning marriage or a pregnancy often test together.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "An **HIV test** is a blood test, and in some settings a finger-prick or oral fluid test. Tests look for antibodies to HIV, and many also look for a part of the virus itself, called p24 antigen. A positive screening test is always confirmed with further tests before a diagnosis is made. There is a window period after infection when tests may not yet be positive, so if you had a recent exposure, a repeat test may be advised.",
    },
    {
      k: "p",
      text: "In India, free and confidential testing with counselling is available at government Integrated Counselling and Testing Centres (ICTCs), found in many government hospitals, as well as in private laboratories. Testing is voluntary and should be done with your informed consent, and results are confidential.",
    },
    {
      k: "p",
      text: "After diagnosis, two tests guide care. The **viral load** measures how much virus is in the blood; on effective treatment it should become undetectable. The **CD4 count** shows how strong the immune system is. Doctors also screen for TB, hepatitis B and C, and other infections.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "**Antiretroviral therapy** (ART) is a combination of medicines, often in a single daily tablet, that stops HIV from multiplying. It is now recommended for everyone with HIV, as soon as possible after diagnosis, whatever their CD4 count. ART lets the immune system recover, prevents AIDS, and stops sexual transmission once the viral load is undetectable.",
    },
    {
      k: "ul",
      items: [
        "ART is lifelong. Taking it every day, at about the same time, is what keeps it working. Missing doses lets the virus come back and become resistant.",
        "In India, ART is provided free at government ART centres, alongside regular monitoring.",
        "Side effects are usually mild with modern regimens; tell your doctor about any problem rather than stopping the medicine.",
        "Your doctor may also prescribe medicines to prevent certain infections, especially TB, until the immune system recovers.",
        "Tell every doctor you see that you take ART, as some medicines interact with it.",
      ],
    },
    {
      k: "p",
      text: "Pregnant women with HIV who take ART and whose babies receive preventive treatment after birth have a very low chance of passing HIV to the baby. Antenatal HIV testing is offered for this reason.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "ul",
      items: [
        "Use condoms correctly every time you have sex with a partner whose status you do not know",
        "Never share needles or syringes; insist on sterile equipment for injections, tattoos and piercings",
        "**Post-exposure prophylaxis** (PEP): a short course of HIV medicines that can prevent infection after a possible exposure, such as condom failure, sexual assault or a needle-stick injury. It must be started as soon as possible and within 72 hours, so go to a hospital emergency department straight away.",
        "**Pre-exposure prophylaxis** (PrEP): HIV medicines taken by people at ongoing high risk to prevent infection. Ask an infectious diseases specialist whether it suits you.",
        "If your partner has HIV, their staying on effective treatment with an undetectable viral load protects you",
      ],
    },

    { k: "h2", text: "Living with HIV" },
    {
      k: "p",
      text: "A positive result can be frightening, and many people worry about stigma at home or at work. Counsellors at testing and ART centres help with telling a partner, protecting family members, and planning ahead. In India, the HIV and AIDS (Prevention and Control) Act, 2017 prohibits discrimination against people with HIV in employment, education, healthcare and housing, and protects the confidentiality of HIV status.",
    },
    {
      k: "ul",
      items: [
        "Keep every follow-up visit and viral load test",
        "Eat well, stay active, avoid tobacco and limit alcohol",
        "Keep up vaccinations your doctor recommends",
        "Get help early for low mood or anxiety, which are common after diagnosis",
        "Talk to your doctor before planning a pregnancy, so that treatment can protect the baby",
      ],
    },

    { k: "h2", text: "When to get urgent help" },
    {
      k: "p",
      text: "Call 112 or 108, or go to the nearest emergency department, if a person with HIV has high fever with confusion, severe headache with a stiff neck, a seizure, serious breathlessness, or cannot keep fluids or medicines down. Go to an emergency department straight away after a possible exposure to HIV, so that PEP can be started in time.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "HIV care is usually led by an [infectious diseases specialist](/specialties/infectious-diseases), an [internal medicine specialist](/specialties/internal-medicine), or the doctors at a government ART centre. A [general physician](/specialties/general-practice) can arrange a test and refer you. Pregnant women are cared for jointly with a [gynaecologist](/specialties/gynaecology).",
    },
    {
      k: "p",
      text: "You can [find infectious disease specialists in Bengaluru](/doctors/karnataka/bengaluru/infectious-disease-specialists) or [internal medicine physicians in Bengaluru](/doctors/karnataka/bengaluru/internal-medicine-physicians) on The Doctor Index, each with a registration you can check. People with HIV may also need care for [hepatitis B](/conditions/hepatitis-b) or [hepatitis C](/conditions/hepatitis-c).",
    },
  ],
  faqs: [
    {
      q: "How soon after exposure can an HIV test detect infection?",
      a: "It depends on the test. Combined antibody and antigen tests can usually detect HIV a few weeks after exposure, while some antibody-only tests take longer. If your first test is negative soon after an exposure, your doctor may advise a repeat test later to be sure.",
    },
    {
      q: "Can a person with HIV live a normal life?",
      a: "Yes. With antiretroviral therapy taken every day, most people with HIV stay well, work, marry and have children, and can expect a near-normal lifespan. Starting treatment early and not missing doses is what makes this possible.",
    },
    {
      q: "Can a person with HIV have a baby without HIV?",
      a: "Yes. When the mother takes ART during pregnancy and breastfeeding and the baby receives preventive medicines after birth, the chance of passing on HIV is very low. Plan the pregnancy with your doctor so treatment is in place early.",
    },
    {
      q: "Is HIV testing in India confidential?",
      a: "Yes. HIV testing should be voluntary, done with informed consent and counselling, and results kept confidential. Government testing centres offer the test free of charge. The law also protects people with HIV from discrimination.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — HIV", url: "https://medlineplus.gov/hiv.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
