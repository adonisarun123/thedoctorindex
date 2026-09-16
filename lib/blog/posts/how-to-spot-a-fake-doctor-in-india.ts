import type { BlogPost } from "@/lib/blog/types";

export const post: BlogPost = {
  slug: "how-to-spot-a-fake-doctor-in-india",
  title: "How to spot a fake doctor in India: seven checks that catch almost all of them",
  metaTitle: "How to spot a fake doctor in India: seven checks",
  standfirst:
    "Most people who should not be treating you are not forgers. They rely on nobody looking. Here is what to look at, in the order that catches the most.",
  category: "checking",
  targetQuery: "how to check if a doctor is genuine in india",
  author: "The Doctor Index editorial team",
  publishedOn: "17 Sep 2026",
  updatedOn: "17 Sep 2026",
  related: ["how-to-choose-a-doctor-in-india", "healthcare-professionals-registry-hpr-explained", "how-to-complain-about-a-doctor-in-india"],
  body: [
    {
      k: "p",
      text: "The phrase fake doctor conjures someone with no medical training at all, running a clinic on nerve. Those people exist and they make the news. But they are the smallest and least interesting part of the problem, and a check designed only to catch them will miss almost everything else.",
    },
    {
      k: "p",
      text: "In practice, the situations where the person in front of you is not entitled to be treating your problem fall into five distinct categories, and they need different checks. Sorting them out first is what makes the rest of this quick.",
    },
    { k: "h2", text: "Five different things people mean by a fake doctor" },
    {
      k: "table",
      caption: "The five cases, and what catches each",
      head: ["What is actually going on", "How common", "The check that catches it"],
      rows: [
        ["No medical qualification of any kind", "Rare, and usually a compounder or assistant who took over a practice", "The register search — the name simply is not there"],
        ["A real qualification in another system, practising modern medicine", "Common, and legally contested rather than criminal", "Read the degree letters and the council name"],
        ["A registration number that belongs to someone else", "More common than most people expect", "Search by number, then check the name that comes back"],
        ["A genuine doctor whose registration has lapsed or been removed", "Uncommon but consequential", "Check the currency of the registration, not just its existence"],
        ["A real Dr who is not a physician at all", "Very common and often entirely honest", "Ask what the doctorate is in — a PhD, a physiotherapy or a dental qualification is a Dr too"],
      ],
    },
    {
      k: "p",
      text: "Only the first case is fraud in the everyday sense. The others range from a regulatory grey area to a simple misreading of a title. But from the patient's side the practical question is the same: is this person qualified and entitled to treat this problem. The seven checks below answer it.",
    },
    { k: "h2", text: "Check one: search the register, by number and by name" },
    {
      k: "p",
      text: "Every practitioner of modern medicine in India must hold a current registration with a state medical council or the national register maintained by the National Medical Commission. The registers are public and searchable. This is the single highest-yield check available to a patient and it takes a couple of minutes.",
    },
    {
      k: "p",
      text: "Do it in both directions. Search the name to confirm a record exists, and search the number to confirm the record it returns is the same person. A number that resolves to a different name is the commonest failure mode we see, and searching only by name will never reveal it. Our guide to [checking a doctor's registration](/health-guides/how-to-check-a-doctors-registration-in-india) walks through the search screens council by council.",
    },
    {
      k: "note",
      tone: "alert",
      title: "Numbers on websites are frequently wrong",
      text: "When we ran roughly 3,700 registration numbers from directory listings against the register, a substantial share came back attached to a different doctor. Most of that is sloppy data entry by directories rather than deception by doctors — but it means a printed number on any listing, including ours, is a claim until somebody has checked it against the source.",
    },
    { k: "h2", text: "Check two: read the degree letters, then the council name" },
    {
      k: "p",
      text: "India has several parallel systems of medicine, each with its own qualification, its own council and its own register. The letters tell you which one you are dealing with.",
    },
    {
      k: "ul",
      items: [
        "**MBBS** — the basic modern-medicine qualification. Registered with a state medical council or the NMC.",
        "**MD, MS** — postgraduate speciality qualifications in modern medicine. **DNB** is the National Board equivalent. **DM, MCh** are super-specialities on top of those.",
        "**BDS, MDS** — dentistry. Registered with the Dental Council of India and state dental councils, not the medical councils.",
        "**BAMS, BHMS, BUMS, BSMS, BNYS** — Ayurveda, homoeopathy, Unani, Siddha and naturopathy. Registered under the AYUSH councils.",
        "**BPT, MPT** — physiotherapy. **PhD** — a research doctorate in any subject at all.",
      ],
    },
    {
      k: "p",
      text: "None of these is fake. All of them are legitimate qualifications held by people who are entitled to the title Dr in ordinary usage. The question is scope: whether that qualification entitles the holder to diagnose and prescribe for the problem you have brought. [What the letters after an Indian doctor's name mean](/health-guides/medical-degrees-in-india-explained) sets out the pathways in detail, and [which council registered your doctor](/health-guides/medical-councils-of-india) explains which register to search for each.",
    },
    { k: "h2", text: "Check three: confirm the registration is current" },
    {
      k: "p",
      text: "Registration is not permanent in the way a degree is. Several state councils operate periodic renewal, and a registration can be suspended or removed following disciplinary proceedings. A register entry therefore carries a status and often a validity date, and those are the parts worth reading — an entry that exists is not the same as an entry that is live.",
    },
    {
      k: "p",
      text: "This is also the check most often failed by accident rather than design, by doctors who have simply not renewed. It is not evidence of bad practice on its own. It is a reason to ask.",
    },
    { k: "h2", text: "Check four: look at what is on the wall" },
    {
      k: "p",
      text: "Under the professional conduct regulations that govern doctors in India, a practitioner is expected to display their registration number, and clinical establishments are expected to be registered under the applicable state rules made under the Clinical Establishments Act or its state equivalent. In a well-run clinic the registration certificate, the establishment registration and the rate list are on the wall in reception because somebody has told them to put them there.",
    },
    {
      k: "p",
      text: "Absence is not proof of anything — plenty of perfectly good practices are careless about paperwork on walls. Presence, though, is cheap reassurance, and a clinic that reacts badly to your reading the certificate has answered a question you did not have to ask.",
    },
    { k: "h2", text: "Check five: ask the scope question directly" },
    {
      k: "p",
      text: "The single most useful sentence a patient can say is: which council are you registered with, and what is your registration number. It is a neutral question. Every genuinely registered practitioner answers it without difficulty, because the number is on their prescription pad and often on their door.",
    },
    {
      k: "p",
      text: "What you are listening for is not the number itself, which you will check later, but the ease of the answer. Discomfort, a change of subject, an appeal to how long they have been practising, or a suggestion that the question is insulting are all far more informative than the digits.",
    },
    { k: "h2", text: "Check six: the prescription tells you a great deal" },
    {
      k: "p",
      text: "A prescription is a document with conventions, and departures from those conventions are visible without any medical knowledge. Things worth noticing:",
    },
    {
      k: "ul",
      items: [
        "No registration number printed on the letterhead, when the regulations expect one.",
        "A qualification printed in a form that does not exist — degree abbreviations that no Indian university awards, or a string of initials with no council behind them.",
        "Membership of associations presented where a qualification should be. A fellowship of a private society is not a degree and not a registration.",
        "Injections or infusions given routinely at the clinic for complaints that do not usually need them.",
        "A refusal to write down what was given, or a refusal to give you a copy at all. You have a right to your records — see [how to get your medical records](/blog/how-to-get-your-medical-records-in-india).",
      ],
    },
    { k: "h2", text: "Check seven: cross-check the identity, not just the credential" },
    {
      k: "p",
      text: "The subtlest case is a real registration belonging to a real doctor, used by somebody else — a relative running the practice while the registered doctor is elsewhere, or a clinic operating on a rented licence. The credential checks all pass because the credential is genuine.",
    },
    {
      k: "p",
      text: "What catches this is matching the person to the record: the name on the register entry against the name on the door and the prescription, the qualification on the register against the qualification claimed, and the council's stated place of registration against where they say they trained. The [Healthcare Professionals Registry](/blog/healthcare-professionals-registry-hpr-explained) being built under the national digital health programme is designed to make exactly this kind of identity check routine, though it is not yet complete enough to rely on alone.",
    },
    { k: "h2", text: "What to do if the checks fail" },
    {
      k: "p",
      text: "Do not confront anyone in the clinic. You gain nothing and you may lose the documentation you would need later. Do these four things instead:",
    },
    {
      k: "ol",
      items: [
        "Keep everything in paper form — prescriptions, receipts, test reports, the card, a photograph of the board outside.",
        "Note dates, the name used, and anything said about qualifications.",
        "Stop the treatment and see a registered practitioner, taking the paperwork with you.",
        "Complain to the state medical council that would have registered the person, and, where money was taken for a service not competently provided, consider the consumer forum route. [How to complain about a doctor in India](/blog/how-to-complain-about-a-doctor-in-india) sets out both.",
      ],
    },
    {
      k: "note",
      tone: "info",
      title: "Where the criminal line sits",
      text: "Practising modern medicine without registration is an offence, and so is impersonating a registered practitioner. A qualified practitioner of another system working outside their scope is a regulatory matter for their own council, not usually a police matter. The distinction decides who you complain to.",
    },
    { k: "h2", text: "The honest limits of all of this" },
    {
      k: "p",
      text: "Everything above tests entitlement, not competence. A practitioner can pass all seven checks and still be careless, out of date, or wrong about your problem, and the register has nothing to say about it. Competence is judged over time, from whether the plan gets reviewed, whether questions get straight answers, and whether anything is ever stopped rather than added.",
    },
    {
      k: "p",
      text: "What the checks do is remove the small category of outcomes that no amount of patient judgement can recover from. That is worth ten minutes. On this site, every profile shows which of these checks has been done, against which source, on what date — and says plainly where nothing has been verified yet, because an unchecked claim presented as a verified one is the problem, not the solution. You can [browse doctors by city and speciality](/doctors) or read [how our verification works](/policies/verification).",
    },
  ],
  faqs: [
    {
      q: "How can I check if a doctor is real in India?",
      a: "Search the state medical council register or the National Medical Commission's national register, both by the doctor's name and by the registration number they give you. If the number returns a different name, or no record exists at all, that is the answer. Read the degree letters as well, because they tell you which system of medicine and which council apply.",
    },
    {
      q: "Is a BAMS or BHMS practitioner a fake doctor?",
      a: "No. Those are genuine qualifications registered under the AYUSH councils, and the holders are entitled to practise their own system. The question is scope, not authenticity: whether that registration permits them to diagnose and prescribe modern medicine for your problem, which is governed by their council's rules and by state-level regulation.",
    },
    {
      q: "Does every doctor have to display a registration number?",
      a: "The professional conduct regulations applying to registered medical practitioners require the registration number to be shown on prescriptions and documents, and clinical establishments are separately required to be registered under state rules. In practice, display is uneven — its absence is a reason to ask rather than proof of anything.",
    },
    {
      q: "What should I do if I think my doctor is not qualified?",
      a: "Keep the prescriptions, receipts and reports, stop the treatment, and see a registered practitioner. Then complain to the state medical council that would have registered the person. Where an unregistered person has been practising modern medicine, that is an offence and can be reported to the police as well as to the council.",
    },
    {
      q: "Can I check a doctor's registration online for free?",
      a: "Yes. The state council registers and the national register maintained by the National Medical Commission are public and free to search. No directory, including this one, is a substitute for the council's own record, which is why we show the source and the date of every check rather than only the result.",
    },
    {
      q: "Is someone with a PhD allowed to call themselves Dr?",
      a: "Yes, and it is not deceptive in itself. A PhD, a dental qualification, a physiotherapy qualification and an AYUSH qualification all carry the title in ordinary usage. It becomes a problem only when the title is used in a clinical setting in a way that implies a medical registration the holder does not have.",
    },
  ],
};
