import { NMC_BLACKLIST_URL, NMC_COUNCIL_LIST_URL, NMC_IMR_SOURCE, NMC_IMR_URL, NMC_LIST_SOURCE } from "@/lib/registers/build";
import { normalizeCouncil, type RegisterEntry } from "@/lib/registers/types";

const CHECKED = "25 Sep 2026";

/** National bodies for modern medicine. */
export const NATIONAL_MEDICAL: RegisterEntry[] = [
  {
    slug: "national-medical-commission",
    name: "National Medical Commission",
    short: "NMC",
    kind: "medical",
    profession: "doctors",
    website: "https://www.nmc.org.in",
    search: {
      url: NMC_IMR_URL,
      note: "The Indian Medical Register search on nmc.org.in accepts a doctor's name, year of registration, registration number or state medical council, and an advance search that combines them.",
    },
    onNmcRegister: true,
    match: [normalizeCouncil("National Medical Commission"), "NMC"],
    standfirst: "The NMC keeps the Indian Medical Register — the one public search that covers every state medical council — and the list of doctors removed from it.",
    body: [
      {
        k: "p",
        text: "The National Medical Commission is the statutory regulator of modern medicine in India, constituted under the National Medical Commission Act, 2019, which replaced the Medical Council of India. It does not itself register practising doctors — state medical councils do that — but it publishes the **Indian Medical Register**, a compiled copy of every state register, and that compiled copy is the single public search a patient can use to check a doctor anywhere in the country.",
      },
      {
        k: "p",
        text: "This site's own verification runs against the same register. When a profile here says a registration was \"checked against the register\" with a date, the register meant is the NMC's, and the date is when the search was run. The register page itself carries the note \"This data is being updated\": it is compiled from what the councils send in, so a recent registration can lag.",
      },
      { k: "h2", text: "How to search the Indian Medical Register" },
      {
        k: "steps",
        items: [
          {
            title: "Choose a way in",
            text: `The [search page](${NMC_IMR_URL}) offers five: **Name**, **Year of Registration**, **Registration Number**, **State Medical Council**, and **Advance Search**, which combines name, number, year and council. Number alone is fastest; number plus council is the one that cannot return the wrong doctor.`,
          },
          {
            title: "Read the whole record",
            text: "A result shows the doctor's name, the council, the year, the registration number and the primary qualification the council recorded. Match all of them to the doctor in front of you, not the number alone — bare numbers repeat across councils.",
          },
          {
            title: "Check the removed list",
            text: `The same section publishes a [Black List Doctor](${NMC_BLACKLIST_URL}) page for names removed from or suspended on a register. A clean search result and a black-list entry are not mutually exclusive.`,
          },
          {
            title: "If nothing comes back, try the council",
            text: `Use the NMC's [list of state medical councils](${NMC_COUNCIL_LIST_URL}) to find the issuing council's office and, where one exists, its own site. Ask with the number and the exact name on the certificate.`,
          },
        ],
      },
      { k: "h2", text: "What the NMC does and does not decide" },
      {
        k: "p",
        text: "The NMC's Ethics and Medical Registration Board hears appeals from state council decisions and sets the professional-conduct regulations every registered doctor is bound by. Complaints about a doctor start at the state council, not at the NMC; the [how to complain about a doctor](/blog/how-to-complain-about-a-doctor-in-india) guide sets out the route. The NMC also runs the National Medical Register under the 2019 Act, intended as a single live register with a unique ID per doctor; while it is being populated, the compiled Indian Medical Register described above remains the search that works.",
      },
    ],
    faqs: [
      {
        q: "Is the NMC register the same as a state medical council's register?",
        a: "No. Each state council keeps its own register and issues its own numbers. The NMC's Indian Medical Register is a compiled copy of all of them, which is what makes it searchable in one place — and why it can lag a council's own record by weeks or months.",
      },
      {
        q: "What does \"checked against the register\" mean on a profile here?",
        a: "That the registration number on the profile was searched on the NMC's Indian Medical Register, under the council named on the profile, on the date shown, and that the record returned matched the doctor's name. It does not mean the doctor's renewal is current, which the public register does not show.",
      },
      {
        q: "Can I check a dentist, an Ayurveda practitioner or a physiotherapist on the NMC register?",
        a: "No. The NMC register covers modern medicine only. Dentists are on the dental register, AYUSH practitioners on the NCISM and NCH registers and state boards, and physiotherapists and other allied professionals on state councils or professional bodies. Each has its own page on this site.",
      },
    ],
    checkedOn: CHECKED,
    sources: [NMC_IMR_SOURCE, NMC_LIST_SOURCE],
    related: ["medical-council-of-india", "karnataka-medical-council", "madhya-pradesh-medical-council"],
  },
  {
    slug: "medical-council-of-india",
    name: "Medical Council of India (historic)",
    short: "MCI",
    kind: "medical",
    profession: "doctors",
    onNmcRegister: true,
    match: [normalizeCouncil("Medical Council of India"), normalizeCouncil("Medical Council of India (historic)"), "MCI"],
    standfirst: "The MCI was replaced by the National Medical Commission in 2020. An MCI number is an old certificate, and it is still searchable on the NMC register.",
    body: [
      {
        k: "p",
        text: "The Medical Council of India was the regulator of modern medicine from 1934 until the National Medical Commission Act, 2019 dissolved it and the NMC took over. It was also, for some doctors, a registering body in its own right: doctors who qualified abroad and passed the screening test, and some who registered directly with the MCI rather than a state council, hold MCI registration numbers. Those certificates remain valid; they are simply issued by a body that no longer exists.",
      },
      {
        k: "p",
        text: "On this site a registration recorded against the \"Medical Council of India\" is treated as a modern-medicine registration and searched on the NMC register like any other. Some profiles cite the MCI when the number was in fact issued by a state council — the certificate carried the MCI's name alongside the council's — so a number that does not resolve under MCI is worth trying under the doctor's home state.",
      },
      { k: "h2", text: "Why some doctors hold MCI numbers at all" },
      {
        k: "p",
        text: "Under the Indian Medical Council Act, 1956 a doctor could be registered either with a state council or, in some circumstances, directly with the MCI. The commonest of those was the foreign medical graduate: a doctor who qualified outside India and passed the screening test that the MCI's Screening Test Regulations, 2002 introduced, and who then registered with the MCI itself or with a state council. Older doctors who registered before some state councils existed, and doctors who worked in central institutions, are the other groups. None of this changes what the number is — an entry on the Indian Medical Register — only which body's name is on the certificate.",
      },
      { k: "h2", text: "Checking an MCI number" },
      {
        k: "p",
        text: `Search the number on the [Indian Medical Register](${NMC_IMR_URL}) by **Registration Number** without selecting a council. If several records return, pick the one whose council reads MCI or whose name matches. A doctor whose only registration is an old MCI one and who practises in a state today will often have taken a state registration since; ask which council the current registration is with.`,
      },
    ],
    faqs: [
      {
        q: "Is an MCI registration still valid?",
        a: "Yes. Registrations the MCI issued before it was dissolved remain on the Indian Medical Register. The body that issued them no longer exists, but the entry does.",
      },
      {
        q: "Why does a doctor's certificate say MCI when the number is from a state council?",
        a: "Because state councils registered doctors under the Indian Medical Council Act, 1956, and certificates often carried the Act's name, or the MCI's, alongside the council's. The issuing council is the one to search under.",
      },
    ],
    checkedOn: CHECKED,
    sources: [NMC_IMR_SOURCE],
    related: ["national-medical-commission"],
  },
];
