import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "urinary-tract-infections",
  title: "Urinary tract infection (UTI): symptoms, tests, treatment and which doctor to see",
  metaTitle: "UTI: symptoms, urine tests, treatment and which doctor",
  standfirst: "What a urinary tract infection is, the symptoms to watch for, the urine tests that confirm it, how it is treated, and when it is serious.",
  targetQuery: "urine infection symptoms and treatment",
  department: "urology",
  specialty: "general-practice",
  alsoSee: ["urology", "gynaecology", "nephrology"],
  author: "The Doctor Index",
  writtenOn: "01 Oct 2026",
  updatedOn: "01 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Burning while passing urine", "Frequent urination", "Urgency", "Cloudy or smelly urine", "Blood in urine", "Lower abdominal pain", "Fever", "Pain in the back or side"],
  tests: ["Urine routine and microscopy", "Urine culture", "Ultrasound of the kidneys and bladder", "Blood tests"],
  treatments: ["Antibiotics", "Drinking enough fluids"],
  body: [
    { k: "h2", text: "What a urinary tract infection is" },
    {
      k: "p",
      text: "The urinary tract is made up of the kidneys, the ureters that carry urine down from them, the bladder and the urethra, the tube through which urine leaves the body. A urinary tract infection (UTI), often called a urine infection, happens when bacteria — usually from the bowel — enter the urethra and multiply.",
    },
    {
      k: "p",
      text: "Most UTIs affect the bladder (cystitis). These are uncomfortable but usually settle quickly with treatment. If the infection travels up to the kidneys (pyelonephritis), it is more serious and can spread to the bloodstream. UTIs are much more common in women, because the urethra is shorter and close to the back passage, but men, children and older people get them too.",
    },

    { k: "h2", text: "Symptoms" },
    { k: "p", text: "A bladder infection typically causes:" },
    {
      k: "ul",
      items: [
        "Burning while passing urine",
        "Frequent urination, often passing only small amounts",
        "Urgency — a sudden need to go that is hard to hold",
        "Cloudy or smelly urine",
        "Blood in urine, which may look pink, red or brown",
        "Lower abdominal pain or pressure",
      ],
    },
    { k: "p", text: "A kidney infection is more likely when there is also:" },
    {
      k: "ul",
      items: [
        "Fever, often with shivering or chills",
        "Pain in the back or side, just below the ribs",
        "Nausea or vomiting, and feeling generally unwell",
      ],
    },
    {
      k: "p",
      text: "Older people may have few of these and instead become confused, drowsy or start falling. Young children may have only fever, vomiting, poor feeding or irritability. In men, a UTI can involve the prostate.",
    },

    { k: "h2", text: "Causes and who is at higher risk in India" },
    {
      k: "p",
      text: "Anything that lets bacteria in, or stops the bladder emptying fully, raises the risk. Hot weather and not drinking enough water make urine more concentrated, and many people — especially women at work, while travelling or at school — hold urine for long periods because clean toilets are not available. Your risk is also higher if you:",
    },
    {
      k: "ul",
      items: [
        "Are a woman, particularly if sexually active, pregnant or past menopause",
        "Have diabetes, especially if sugar is poorly controlled",
        "Have kidney stones, an enlarged prostate or another blockage to urine flow",
        "Use a urinary catheter",
        "Have had a UTI before",
        "Have a weakened immune system",
      ],
    },
    {
      k: "p",
      text: "Antibiotic resistance is a growing concern in India, and many urine infections no longer respond to commonly used antibiotics. Overuse and self-medication drive this. The Health Ministry has urged people not to use medicines marked with a red vertical line on the pack, including antibiotics, without a doctor's prescription.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Your doctor will ask about your symptoms and examine you. For a straightforward bladder infection in a young, non-pregnant woman with typical symptoms, that may be enough. Otherwise, the main tests are:",
    },
    {
      k: "ul",
      items: [
        "**Urine routine and microscopy** — checks for pus cells, blood, nitrites and other signs of infection. A dipstick gives a quick result in the clinic.",
        "**Urine culture** — grows the bacteria from a clean-catch sample and shows which antibiotics will work. It takes a day or two, and ideally the sample is given before antibiotics are started.",
        "**Blood tests** — a blood count, kidney function and sugar when a kidney infection is suspected or you are unwell; sometimes blood cultures.",
        "**Ultrasound of the kidneys and bladder** — for repeated infections, infections in men or children, kidney infections, or when stones or a blockage are possible.",
      ],
    },
    {
      k: "p",
      text: "To give a clean-catch sample, wash the area with water, start passing urine into the toilet, and collect the middle part of the stream in the sterile container.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) can diagnose and treat most UTIs. A [urologist](/specialties/urology) is worth seeing for repeated infections, infections in men, blood in the urine, kidney stones or problems emptying the bladder. A [gynaecologist](/specialties/gynaecology) helps with infections in pregnancy and after menopause, and a [nephrologist](/specialties/nephrology) when infections affect kidney function.",
    },
    {
      k: "p",
      text: "You can [find general physicians in Bengaluru](/doctors/karnataka/bengaluru/general-physicians) or [urologists in Bengaluru](/doctors/karnataka/bengaluru/urologists) on The Doctor Index, each with a registration you can check.",
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "**Antibiotics** are the treatment for a bacterial UTI. The choice and the length of the course depend on whether it is a simple bladder infection or a kidney infection, whether you are pregnant, local resistance patterns and, where available, your culture result. A kidney infection may need a longer course, and some people need antibiotics through a drip in hospital.",
    },
    {
      k: "ul",
      items: [
        "Take the antibiotic exactly as prescribed, for the number of days your doctor sets, even if you feel better sooner",
        "Do not use leftover antibiotics, or ones bought without a prescription or suggested by a friend",
        "If you are not improving after a couple of days, or feel worse, go back to your doctor",
        "Tell your doctor if you are pregnant, have kidney disease or are allergic to any medicine",
      ],
    },
    {
      k: "p",
      text: "**Drinking enough fluids** helps flush the bladder, and paracetamol can ease pain and fever. Urine alkalisers sold over the counter may ease burning but do not treat the infection. Do not stop any prescribed medicine on your own.",
    },
    { k: "h3", text: "Repeated infections" },
    {
      k: "p",
      text: "If infections keep coming back, your doctor will look for an underlying cause, such as diabetes, stones or incomplete emptying. Options then include changes in habits, vaginal oestrogen for women after menopause, and in some cases a preventive antibiotic plan. These decisions belong with your doctor, based on your culture results and history.",
    },

    { k: "h2", text: "Living with it: preventing the next one" },
    {
      k: "ul",
      items: [
        "Drink enough water through the day, more in hot weather",
        "Do not hold urine for long; empty the bladder fully",
        "Pass urine soon after sex",
        "Wipe from front to back after using the toilet",
        "Keep diabetes well controlled",
        "Avoid scented washes and douches in the genital area",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, for:" },
    {
      k: "ul",
      items: [
        "High fever with shaking chills, back or side pain, and vomiting",
        "Confusion, drowsiness, fast breathing or a fast heartbeat with a urine infection — signs that infection may have reached the blood",
        "Being unable to pass urine at all",
        "Urine infection symptoms with fever in pregnancy, in a baby or young child, or in someone with diabetes who is very unwell",
      ],
    },

    { k: "h2", text: "Questions to ask at your appointment" },
    {
      k: "ul",
      items: [
        "Is this a bladder or kidney infection?",
        "Do I need a urine culture before starting antibiotics?",
        "How long should I take the antibiotic, and what side effects should I watch for?",
        "What should I do if I am not better in a couple of days?",
        "Why do I keep getting infections, and do I need a scan?",
        "What can I do to prevent the next one?",
      ],
    },
  ],
  faqs: [
    {
      q: "Can a UTI go away without antibiotics?",
      a: "Some mild bladder infections in otherwise healthy women do settle on their own, but there is a risk the infection spreads to the kidneys. Pregnant women, men, children and anyone with fever or back pain should always see a doctor promptly.",
    },
    {
      q: "Does cranberry juice prevent urine infections?",
      a: "The evidence is mixed. Some women with repeated infections find cranberry products helpful, but they do not treat an active infection. Packaged juices can also contain a lot of sugar, which matters if you have diabetes. Discuss it with your doctor.",
    },
    {
      q: "Why did my doctor ask for a urine culture?",
      a: "A culture identifies the bacteria and shows which antibiotics will work against them. Because resistance to common antibiotics is widespread in India, a culture helps choose the right treatment, especially for repeated, complicated or kidney infections.",
    },
    {
      q: "Can men get urinary tract infections?",
      a: "Yes, though less often than women. In men a UTI is usually treated as complicated, because it may involve the prostate or point to a blockage such as an enlarged prostate or stone. A urologist may need to investigate.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Urinary Tract Infections", url: "https://medlineplus.gov/urinarytractinfections.html" },
    { label: "Press Information Bureau, MoHFW — Update on overuse of antimicrobials and the Red Line campaign", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1897988" },
  ],
};
