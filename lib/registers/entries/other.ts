import { normalizeCouncil, type RegisterEntry } from "@/lib/registers/types";

const CHECKED = "25 Sep 2026";

/** Dental, AYUSH and allied-health registers. None of these is on the NMC register. */
export const OTHER_REGISTERS: RegisterEntry[] = [
  {
    slug: "national-dental-commission",
    name: "National Dental Commission",
    short: "NDC",
    kind: "dental",
    profession: "dentists",
    office: "Plot No. 14, Sector 9, R.K. Puram, New Delhi 110022",
    website: "https://dciindia.gov.in",
    search: {
      url: "https://dciindia.gov.in/StateDentalCouncilList.aspx",
      note: "The commission's site carries an \"Indian Dentists Register\" search by dentist name, and links to a National Dental Register at ndr.abdm.gov.in.",
    },
    onNmcRegister: false,
    match: [
      normalizeCouncil("Dental Council of India"),
      normalizeCouncil("Indian Dental Council"),
      normalizeCouncil("National Dental Commission"),
      "DCI",
      "NDC",
    ],
    standfirst: "Dentists are not on the NMC register. The National Dental Commission — the Dental Council of India until March 2026 — keeps the Indian Dentists Register.",
    body: [
      {
        k: "p",
        text: "Dentistry in India is regulated separately from medicine. The Dental Council of India, constituted under the Dentists Act, 1948, was dissolved with effect from **19 March 2026** and replaced by the National Dental Commission under the National Dental Commission Act, 2023; the commission's own site says communications may still be issued in the DCI's name during the transition. Registration itself is done by **state dental councils**, and the national body compiles their registers into the Indian Dentists Register.",
      },
      {
        k: "p",
        text: "Profiles on this site record dental registrations under several names — \"Dental Council of India\", \"Indian Dental Council\", and the state councils — and all of them are dental, not medical: a BDS or MDS holder's number will not be found on the NMC's Indian Medical Register, and this site's automated register check does not run for them. Dental registrations here are checked by staff or stay marked as supplied.",
      },
      { k: "h2", text: "How to check a dentist's registration" },
      {
        k: "steps",
        items: [
          {
            title: "Search the Indian Dentists Register",
            text: "The commission's site at dciindia.gov.in offers an [Indian Dentists Register](https://dciindia.gov.in/StateDentalCouncilList.aspx) search by dentist name, reached from the home page. At the time of checking the home page also reported 405,913 registered dentists in the national data.",
          },
          {
            title: "Identify the state dental council",
            text: "A dentist's number is issued by a state dental council — Karnataka, Madhya Pradesh, Tamil Nadu and so on — and is unique only within that council. Ask which council issued it; the same digits will exist in other states.",
          },
          {
            title: "Try the National Dental Register",
            text: "The commission links to a [National Dental Register](https://ndr.abdm.gov.in/) on the ABDM platform. It is newer than the state registers and may not yet hold every dentist, so a missing record there is not by itself a warning sign.",
          },
        ],
      },
      { k: "h2", text: "What a dental registration proves" },
      {
        k: "p",
        text: "That the dentist holds a recognised dental qualification and is entered on a state register — the legal condition for practising dentistry. Specialist status (an MDS in orthodontics, say) is a qualification, not a separate registration, and is checked separately on this site.",
      },
    ],
    faqs: [
      {
        q: "Why can't I find a dentist on the NMC register?",
        a: "Because dentists are registered under the Dentists Act with state dental councils, and compiled into the Indian Dentists Register by the National Dental Commission — a different body from the NMC. Search there instead.",
      },
      {
        q: "Is the Dental Council of India still the right name?",
        a: "The DCI was dissolved on 19 March 2026 and the National Dental Commission took over the same day. Certificates and older listings will carry the DCI name for years; the register they refer to is the same one.",
      },
      {
        q: "Are dental registrations on this site verified?",
        a: "Only where staff have checked them by hand. The automated worker that verifies medical registrations reads the NMC register, which does not cover dentists, so a dental number here is marked as supplied until a person checks it.",
      },
    ],
    checkedOn: CHECKED,
    sources: [
      { label: "National Dental Commission — home page (dciindia.gov.in)", url: "https://dciindia.gov.in/" },
      { label: "National Dental Commission — Indian Dentists Register", url: "https://dciindia.gov.in/StateDentalCouncilList.aspx" },
    ],
    related: ["karnataka-state-dental-council", "madhya-pradesh-state-dental-council", "national-medical-commission"],
  },
  {
    slug: "karnataka-state-dental-council",
    name: "Karnataka State Dental Council",
    kind: "dental",
    profession: "dentists",
    state: { name: "Karnataka", slug: "karnataka" },
    onNmcRegister: false,
    match: [normalizeCouncil("Karnataka State Dental Council"), normalizeCouncil("Karnataka Dental Council")],
    standfirst: "Karnataka's dentists register with the state dental council, whose entries feed the national Indian Dentists Register — not the NMC register.",
    body: [
      {
        k: "p",
        text: "Dentists practising in Karnataka register with the Karnataka State Dental Council, which keeps the state dental register under the Dentists Act, 1948 and now under the National Dental Commission's oversight. A Bengaluru dentist's registration number is therefore a Karnataka dental number, unique within that register, and it is searched on the national [Indian Dentists Register](/registers/national-dental-commission), not on the NMC's medical register.",
      },
      {
        k: "p",
        text: "This site did not open a public search on the council's own site at the time of checking, so the procedure on the [National Dental Commission](/registers/national-dental-commission) page is the one to follow, selecting Karnataka where the search asks for a state council. Dental registrations on this site are not checked by the automated worker and stay marked as supplied until a person checks them.",
      },
      { k: "h2", text: "Transfers, and who else is on a dental register" },
      {
        k: "p",
        text: "A dentist who moves to Karnataka from another state transfers their registration: the National Dental Commission runs an online no-objection process for transfer of registration between state councils, so a Bengaluru dentist who trained in Tamil Nadu or Kerala may hold a Karnataka number issued on transfer rather than on first registration, with an earlier year on the original certificate. The state register also lists dental auxiliaries — dental hygienists, dental mechanics and dental operating room assistants — under a separate part; a circular of 24 September 2026 from the commission to every state dental council concerned their transfer and registration across states. An auxiliary registration is a real registration, but it is not a dentist's, and the record says which it is.",
      },
      { k: "h2", text: "What the number cannot tell you" },
      {
        k: "p",
        text: "A dental registration number confirms qualification and entry on the register. It does not say whether a dentist holds a specialist MDS, whether a clinic is licensed under the Karnataka Private Medical Establishments Act, or whether renewal is current — three separate questions, of which only the first can be answered from the profile here, and only when the MDS has been checked against the awarding university.",
      },
    ],
    faqs: [
      {
        q: "How do I check a Karnataka dentist's registration?",
        a: "Search the dentist's name on the Indian Dentists Register on the National Dental Commission's site, and match the state council and number on the record to the ones the clinic gives you. The council's own office is the fallback for a missing record.",
      },
      {
        q: "Is a BDS enough to practise dentistry in Karnataka?",
        a: "A BDS from a recognised college is the primary dental qualification and, with registration, is what the law requires to practise. An MDS is a postgraduate specialist qualification on top of it.",
      },
    ],
    checkedOn: CHECKED,
    sources: [{ label: "National Dental Commission — Indian Dentists Register", url: "https://dciindia.gov.in/StateDentalCouncilList.aspx" }],
    related: ["national-dental-commission", "karnataka-medical-council"],
  },
  {
    slug: "madhya-pradesh-state-dental-council",
    name: "Madhya Pradesh State Dental Council",
    kind: "dental",
    profession: "dentists",
    state: { name: "Madhya Pradesh", slug: "madhya-pradesh" },
    onNmcRegister: false,
    match: [
      normalizeCouncil("Madhya Pradesh State Dental Council"),
      normalizeCouncil("Madhya Pradesh Dental Council"),
      normalizeCouncil("MP State Dental Council"),
      normalizeCouncil("M.P. State Dental Council of India"),
    ],
    standfirst: "Madhya Pradesh dentists register with the state dental council; their numbers are checked on the Indian Dentists Register, not the NMC register.",
    body: [
      {
        k: "p",
        text: "Dentists in Madhya Pradesh register with the Madhya Pradesh State Dental Council in Bhopal, which keeps the state dental register under the Dentists Act, 1948. Profiles on this site cite it under four spellings, including \"M.P. State Dental Council of India\", which conflates the state council with the national body; all of them resolve to this page, and all of them are dental registrations that the NMC's medical register does not hold.",
      },
      {
        k: "p",
        text: "Follow the procedure on the [National Dental Commission](/registers/national-dental-commission) page, selecting Madhya Pradesh where a state council is asked for. The automated register check on this site does not cover dental numbers, so these registrations stay marked as supplied until staff check them.",
      },
      { k: "h2", text: "Why Madhya Pradesh dental numbers matter on this site" },
      {
        k: "p",
        text: "Madhya Pradesh supplies more profiles to this site than any other state, and a large share of the dentists here practise there. Where the source data carried a number but no year of registration or no specialist qualification, those gaps are stated on the profile rather than filled. A dentist who moved into the state transfers a registration through the National Dental Commission's no-objection process, so a Bhopal or Indore dentist may hold a Madhya Pradesh number issued on transfer, with the original year on a certificate from elsewhere.",
      },
      { k: "h2", text: "What the number cannot tell you" },
      {
        k: "p",
        text: "A dental registration confirms qualification and entry on the register. It does not confirm a specialist MDS, whether renewal is current, or whether the clinic itself is registered under the state's clinical-establishments law — three separate questions, of which only the first can be answered from the profile here, and only once the MDS has been checked against the awarding university.",
      },
    ],
    faqs: [
      {
        q: "How do I check a Madhya Pradesh dentist's registration?",
        a: "Search the dentist's name on the Indian Dentists Register on the National Dental Commission's site and match the Madhya Pradesh council and number to the ones the clinic gives you.",
      },
      {
        q: "Why do some profiles say \"M.P. State Dental Council of India\"?",
        a: "Because that is how the source data recorded it. There is no such body; the state council is the Madhya Pradesh State Dental Council and the national body is the National Dental Commission. This site treats the string as the state council.",
      },
    ],
    checkedOn: CHECKED,
    sources: [{ label: "National Dental Commission — Indian Dentists Register", url: "https://dciindia.gov.in/StateDentalCouncilList.aspx" }],
    related: ["national-dental-commission", "madhya-pradesh-medical-council"],
  },
  {
    slug: "national-commission-for-indian-system-of-medicine",
    name: "National Commission for Indian System of Medicine",
    short: "NCISM",
    kind: "ayush",
    profession: "AYUSH practitioners",
    website: "https://ncismindia.org",
    onNmcRegister: false,
    match: [
      normalizeCouncil("National Commission for Indian System of Medicine"),
      normalizeCouncil("Central Council of Indian Medicine"),
      normalizeCouncil("Central Council of Indian Medicine (historic)"),
      "NCISM",
      "CCIM",
    ],
    standfirst: "Ayurveda, Unani, Siddha and Sowa-Rigpa practitioners are regulated by the NCISM, which replaced the CCIM in 2021, and registered by state boards.",
    body: [
      {
        k: "p",
        text: "The National Commission for Indian System of Medicine regulates Ayurveda, Unani, Siddha and Sowa-Rigpa. Its own site states the basis: the NCISM Act, 2020 (14 of 2020) repealed the Indian Medicine Central Council Act, 1970, and the commission and its four autonomous boards came into force on **11 June 2021**, replacing the Central Council of Indian Medicine. Standards made under the 1970 Act continue until replaced. Among its stated aims is to maintain a national register of AUS&SR practitioners.",
      },
      {
        k: "p",
        text: "Registration of individual practitioners is done by **state boards and councils** — the Karnataka Ayurvedic and Unani Practitioners Board, the Maharashtra Council of Indian Medicine and their counterparts — and it is their numbers that a BAMS, BUMS or BSMS holder cites. Profiles on this site that record \"Central Council of Indian Medicine\" as the council are recorded here under the NCISM. None of these registrations is on the NMC's medical register, and this site's automated check does not cover them.",
      },
      { k: "h2", text: "How to check an AYUSH practitioner's registration" },
      {
        k: "p",
        text: "Ask which state board issued the number and search or write to that board; the NCISM site did not, at the time of checking, offer a public practitioner search on its home page. A practitioner registered under an Indian system of medicine is registered to practise that system; the [online consultation rules](/blog/online-doctor-consultation-rules-in-india) and the [how to spot a fake doctor](/blog/how-to-spot-a-fake-doctor-in-india) guide explain why the system named on the certificate matters.",
      },
    ],
    faqs: [
      {
        q: "Is a BAMS doctor on the NMC register?",
        a: "No. Ayurveda practitioners are registered by state boards under the NCISM's framework, not by state medical councils, and do not appear on the NMC's Indian Medical Register.",
      },
      {
        q: "What happened to the CCIM?",
        a: "The Central Council of Indian Medicine was replaced by the National Commission for Indian System of Medicine when the NCISM Act, 2020 came into force on 11 June 2021. Certificates and profiles still carry the CCIM name; the register they refer to is now the NCISM's.",
      },
      {
        q: "Are AYUSH registrations on this site verified?",
        a: "Only where staff have checked them by hand. The automated worker reads the NMC register, which does not cover AYUSH practitioners, so these registrations stay marked as supplied until a person checks them.",
      },
    ],
    checkedOn: CHECKED,
    sources: [{ label: "National Commission for Indian System of Medicine — home page", url: "https://ncismindia.org/" }],
    related: ["national-commission-for-homoeopathy", "national-medical-commission"],
  },
  {
    slug: "national-commission-for-homoeopathy",
    name: "National Commission for Homoeopathy",
    short: "NCH",
    kind: "ayush",
    profession: "AYUSH practitioners",
    onNmcRegister: false,
    match: [
      normalizeCouncil("National Commission for Homoeopathy"),
      normalizeCouncil("Central Council of Homoeopathy"),
      normalizeCouncil("Central Council of Homoeopathy (historic)"),
      "NCH",
      "CCH",
    ],
    standfirst: "Homoeopaths are regulated by the National Commission for Homoeopathy, which replaced the Central Council of Homoeopathy, and registered by state boards.",
    body: [
      {
        k: "p",
        text: "Homoeopathy is regulated separately from both modern medicine and the Indian systems of medicine. The National Commission for Homoeopathy was set up under the National Commission for Homoeopathy Act, 2020, replacing the Central Council of Homoeopathy that the Homoeopathy Central Council Act, 1973 had created. As with the NCISM, the commission sets standards and maintains a national register while **state homoeopathy boards and councils** register individual practitioners.",
      },
      {
        k: "p",
        text: "A BHMS holder's registration number is therefore a state board number — the Karnataka Board of Homoeopathic System of Medicine, the Madhya Pradesh State Council of Homoeopathy and so on. Profiles on this site record these under a variety of names; only the national body's names resolve to this page, and a state board that is not yet listed is still accepted as written on the profile. None of these registrations appears on the NMC register.",
      },
      { k: "h2", text: "How to check a homoeopath's registration" },
      {
        k: "p",
        text: "Ask which state board issued the number and search or write to that board. A homoeopathy registration licenses the practice of homoeopathy; it does not license the prescription of modern-medicine drugs, which is the distinction the [how to spot a fake doctor](/blog/how-to-spot-a-fake-doctor-in-india) guide turns on.",
      },
      { k: "h2", text: "What the qualifications mean" },
      {
        k: "p",
        text: "The primary homoeopathy degree is the BHMS, a five-and-a-half-year course including internship; the MD (Homoeopathy) is the postgraduate degree. Older practitioners may hold a DHMS, a diploma that predates the degree course, and it appears on a number of profiles here as the recorded qualification. All three are qualifications in homoeopathy, registrable with a state homoeopathy board; none is a qualification in modern medicine, and a profile on this site that shows one of them with a state medical council registration is carrying a contradiction worth reporting.",
      },
      { k: "h2", text: "On this site" },
      {
        k: "p",
        text: "Homoeopathy profiles here are listed under their own speciality, with the system of medicine stated in the \"On record\" block, so a search for a homoeopath does not return a physician and the reverse. Registrations are shown as supplied unless staff have checked them; the automated worker reads the NMC register only, which does not hold homoeopaths, and the page says so rather than implying a check that never ran.",
      },
    ],
    faqs: [
      {
        q: "Is a BHMS doctor on the NMC register?",
        a: "No. Homoeopathy practitioners are registered by state homoeopathy boards under the National Commission for Homoeopathy, and do not appear on the NMC's Indian Medical Register.",
      },
      {
        q: "What happened to the Central Council of Homoeopathy?",
        a: "It was replaced by the National Commission for Homoeopathy under the 2020 Act. Older certificates carry the CCH name.",
      },
    ],
    checkedOn: CHECKED,
    sources: [{ label: "National Commission for Indian System of Medicine — home page (parallel statute)", url: "https://ncismindia.org/" }],
    related: ["national-commission-for-indian-system-of-medicine", "national-medical-commission"],
  },
  {
    slug: "rehabilitation-council-of-india",
    name: "Rehabilitation Council of India",
    short: "RCI",
    kind: "allied",
    profession: "rehabilitation professionals",
    website: "https://rehabcouncil.nic.in",
    search: {
      url: "https://rciregistration.nic.in/rehabcouncil/Select_Search.jsp",
      note: "The RCI's site links a \"CRR Register\" search on its e-registration portal, alongside the norms, the categories of professional under section 19 of the Act, and online CRR application.",
    },
    onNmcRegister: false,
    match: [normalizeCouncil("Rehabilitation Council of India"), "RCI"],
    standfirst: "Clinical psychologists, audiologists, speech therapists and special educators register with the RCI, which keeps the Central Rehabilitation Register.",
    body: [
      {
        k: "p",
        text: "The Rehabilitation Council of India is a statutory body under the Rehabilitation Council of India Act, 1992. It regulates training in the rehabilitation professions and keeps the **Central Rehabilitation Register**, on which clinical psychologists, rehabilitation psychologists, audiologists and speech-language pathologists, special educators and several other rehabilitation professions must be registered to practise. On this site RCI numbers appear on profiles of clinical psychologists and audiologists, and on a small number of other allied-health profiles; they are not on the NMC register and the automated check does not cover them.",
      },
      {
        k: "p",
        text: "RCI registration numbers on profiles here are typically prefixed with a letter (an \"A\" number for audiology, for example). The measured formats below show what the profiles on this site actually carry.",
      },
      { k: "h2", text: "How to check an RCI registration" },
      {
        k: "p",
        text: "The Central Rehabilitation Register is searchable online: the RCI's site links a [CRR Register](https://rciregistration.nic.in/rehabcouncil/Select_Search.jsp) search on its e-registration portal. Search by the registration number or the professional's name, and check that the category on the record is the profession the person practises — the Act's section 19 categories are listed on the same site, and a special-education registration does not make someone a clinical psychologist.",
      },
      { k: "h2", text: "What the RCI is, and is not" },
      {
        k: "p",
        text: "The council's own account of itself is worth quoting in substance: set up as a registered society in 1986, made a statutory body when the 1992 Act came into force on 22 June 1993, and broadened by the 2000 amendment; its mandate is to regulate and monitor services for persons with disabilities, to standardise syllabi, and to keep a Central Rehabilitation Register of qualified professionals and personnel in rehabilitation and special education. The Act also provides for action against unqualified persons delivering such services. It sits under the Department of Empowerment of Persons with Disabilities in the Ministry of Social Justice and Empowerment — not under the health ministry — which is why its register is separate from the medical, dental and AYUSH registers and is searched separately.",
      },
      {
        k: "p",
        text: "Two things the RCI does not do: it does not register psychiatrists, who are medical doctors on a state medical council register, and it does not register physiotherapists, who fall under the [allied and healthcare professions](/registers/national-commission-for-allied-and-healthcare-professions) framework. A profile here that names the RCI as the registering body is therefore an allied or rehabilitation professional, and the speciality on the profile will say which.",
      },
    ],
    faqs: [
      {
        q: "Is a clinical psychologist a doctor?",
        a: "Not in the registration sense. A clinical psychologist holds an MPhil or PsyD-level qualification and an RCI registration, not a medical degree or a medical council registration. A psychiatrist is a medical doctor registered with a state medical council. Both can appear on this site; the registering body on the profile tells you which.",
      },
      {
        q: "Are RCI registrations on this site verified?",
        a: "Only where staff have checked them by hand. The automated worker reads the NMC register, which does not cover RCI professions.",
      },
    ],
    checkedOn: CHECKED,
    sources: [
      { label: "Rehabilitation Council of India — home page", url: "https://rehabcouncil.nic.in/" },
      { label: "RCI — CRR Register search", url: "https://rciregistration.nic.in/rehabcouncil/Select_Search.jsp" },
    ],
    related: ["national-commission-for-allied-and-healthcare-professions", "indian-association-of-physiotherapists"],
  },
  {
    slug: "national-commission-for-allied-and-healthcare-professions",
    name: "National Commission for Allied and Healthcare Professions",
    short: "NCAHP",
    kind: "allied",
    profession: "allied health professionals",
    onNmcRegister: false,
    match: [normalizeCouncil("National Commission for Allied and Healthcare Professions"), "NCAHP"],
    standfirst: "The NCAHP Act, 2021 created a regulator for physiotherapists and 50-odd allied professions; the state councils that register them are still being set up.",
    body: [
      {
        k: "p",
        text: "The National Commission for Allied and Healthcare Professions Act, 2021 is the first national statute to regulate physiotherapy, occupational therapy, medical laboratory science, radiography, nutrition, optometry and the other allied and healthcare professions. It provides for a national commission, professional councils under it, and **state allied and healthcare councils** that register individual professionals — the same three-tier shape as medicine and dentistry.",
      },
      {
        k: "p",
        text: "The difference is time. State councils under the Act are still being constituted, and in most states a physiotherapist today holds either a registration with an older state council (Maharashtra, Gujarat and Delhi have had physiotherapy councils for years) or a membership of a professional body such as the [Indian Association of Physiotherapists](/registers/indian-association-of-physiotherapists), which is not a statutory register. On this site, a physiotherapist's registration is shown with the body named on the profile, and it is not on the NMC register.",
      },
      { k: "h2", text: "How to check an allied-health professional's registration" },
      {
        k: "p",
        text: "Ask which body issued the number. If it is a state council — an allied and healthcare council under the 2021 Act, or an older state physiotherapy council — that council's register is the authoritative source. If it is a professional body, what you can verify is membership, which is a weaker claim than statutory registration; say so to yourself and weigh the qualification (a BPT or MPT from a recognised university) accordingly.",
      },
      {
        k: "p",
        text: "On this site the registering body is shown exactly as the profile supplied it, labelled \"professional registration\" rather than \"medical registration\", and the automated register check — which reads the NMC register only — does not run for it. A physiotherapist's page therefore stays marked as supplied until a person checks the number with the issuing body.",
      },
    ],
    faqs: [
      {
        q: "Do physiotherapists have to register anywhere?",
        a: "Under the NCAHP Act, 2021, yes — with a state allied and healthcare council once one exists in their state. Until then, practice rests on the qualification and, in some states, an older state council; in others, only a professional-body membership is available.",
      },
      {
        q: "Should a physiotherapist be called \"Dr\"?",
        a: "It is contested. Physiotherapists are not medical doctors and are not on a medical register; some use the title on the strength of a doctoral-style degree and some professional bodies endorse it, while medical councils have objected. This site records the registering body and the qualification and leaves the title question to the reader.",
      },
    ],
    checkedOn: CHECKED,
    sources: [{ label: "National Commission for Allied and Healthcare Professions Act, 2021 (statute)", url: "https://www.indiacode.nic.in/" }],
    related: ["indian-association-of-physiotherapists", "rehabilitation-council-of-india"],
  },
  {
    slug: "indian-association-of-physiotherapists",
    name: "Indian Association of Physiotherapists",
    short: "IAP",
    kind: "allied",
    profession: "physiotherapists",
    onNmcRegister: false,
    match: [normalizeCouncil("Indian Association of Physiotherapists"), "IAP", "MIAP"],
    standfirst: "The IAP is a professional association, not a statutory register. An IAP or MIAP number on a physiotherapist profile is a membership, and this site says so.",
    body: [
      {
        k: "p",
        text: "The Indian Association of Physiotherapists is the profession's national association. Many physiotherapists cite an IAP life-membership number — often written MIAP, or as an \"L-\" number — where a doctor would cite a council registration. It is worth being precise about what that is: a membership of an association, which the association can confirm, and not an entry on a statutory register created by law. This site shows it as a professional-body membership and never as a medical registration; it is not on the NMC register and the automated check does not cover it.",
      },
      {
        k: "p",
        text: "The statutory register that will eventually replace this arrangement is the state council under the [National Commission for Allied and Healthcare Professions](/registers/national-commission-for-allied-and-healthcare-professions) Act, 2021; where a state already has a physiotherapy council, that council's registration is the stronger fact. The first physiotherapist on this site to be marked verified holds an IAP number supplied by the practice, and the profile says the check rests on that instruction rather than on a register search — because there is no register to search.",
      },
      { k: "h2", text: "How to check an IAP membership" },
      {
        k: "p",
        text: "Ask the physiotherapist for the membership number and contact the association to confirm it. Then look at the qualification: a BPT or MPT from a university recognised for the course is the fact that matters most while statutory registration is being rolled out.",
      },
      {
        k: "p",
        text: "Where a state physiotherapy council already exists — Maharashtra, Gujarat and Delhi have had one for years — ask for that registration as well, and prefer it: a council can strike a name off its register, an association can only cancel a membership. On this site the two are labelled differently for the same reason, and the measured block below shows what the membership numbers on physiotherapist profiles here look like.",
      },
    ],
    faqs: [
      {
        q: "Is IAP membership the same as registration?",
        a: "No. Registration is an entry on a register created by statute; IAP membership is membership of a professional association. Both are recorded on this site, and they are labelled differently.",
      },
      {
        q: "Why does a physiotherapist's profile here say \"professional registration\" rather than \"medical registration\"?",
        a: "Because the body named is not a medical council. This site uses \"medical registration\" only for state medical councils and the NMC, and \"professional registration\" for everything else, so a reader cannot mistake one for the other.",
      },
    ],
    checkedOn: CHECKED,
    sources: [],
    related: ["national-commission-for-allied-and-healthcare-professions", "rehabilitation-council-of-india"],
  },
];
