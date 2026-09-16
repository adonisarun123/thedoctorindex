import type { BlogPost } from "@/lib/blog/types";

export const post: BlogPost = {
  slug: "how-to-complain-about-a-doctor-in-india",
  title: "How to complain about a doctor in India, and what each route can actually do",
  metaTitle: "How to file a complaint against a doctor in India",
  standfirst:
    "Four forums, four different outcomes. Picking the wrong one costs a year. Here is which does what, and what none of them will give you.",
  category: "checking",
  targetQuery: "how to file complaint against doctor in india",
  author: "The Doctor Index editorial team",
  publishedOn: "17 Sep 2026",
  updatedOn: "17 Sep 2026",
  related: ["how-to-get-your-medical-records-in-india", "patient-rights-in-india", "how-to-spot-a-fake-doctor-in-india"],
  body: [
    {
      k: "p",
      text: "The first question to settle is not where to complain but what you want to happen. India has four broadly separate mechanisms for grievances about medical care, and they produce genuinely different things. A state medical council can discipline a doctor but cannot pay you a rupee. A consumer commission can award compensation but cannot strike anyone off. The hospital's own grievance officer can fix the problem this week, which is often the only outcome anyone actually wanted.",
    },
    {
      k: "p",
      text: "People lose years by taking a compensation claim to a regulator or a licensing complaint to a consumer forum. Match the forum to the outcome first, and the rest of the process is mechanical.",
    },
    { k: "h2", text: "Four routes, and what each produces" },
    {
      k: "table",
      caption: "Choosing the forum",
      head: ["You want", "Go to", "It can", "It cannot"],
      rows: [
        ["The problem fixed, a correction, an explanation", "The establishment's grievance officer", "Act within days; correct records; waive or adjust charges", "Discipline the doctor or award compensation"],
        ["The doctor held professionally accountable", "The state medical council that registered them", "Warn, censure, suspend or remove a registration", "Award you money"],
        ["Compensation for a loss", "The district, state or national consumer commission", "Award compensation for deficiency in service", "Take away a licence"],
        ["A criminal consequence", "The police", "Prosecute unregistered practice, impersonation, or gross negligence", "Resolve a difference of clinical opinion"],
      ],
    },
    {
      k: "p",
      text: "Nothing stops you using more than one, and complaints to a council and a consumer commission commonly run in parallel. But start with the one that produces the outcome you actually want.",
    },
    { k: "h2", text: "Before anything else: assemble the record" },
    {
      k: "p",
      text: "Every route below turns on documents, and the single most common reason a complaint fails is that it rests on an account of events rather than evidence of them. Get the file first. [How to get your medical records in India](/blog/how-to-get-your-medical-records-in-india) sets out the request and the timelines; the short version is that a written, dated, acknowledged request is what makes the rest work.",
    },
    {
      k: "ul",
      items: [
        "The complete case record: discharge summary, indoor case papers, progress notes, investigation reports, operative and anaesthesia notes, nursing charts.",
        "All prescriptions, in date order.",
        "The itemised bill and every receipt.",
        "The consent forms you signed.",
        "Imaging on a disc, not only the reports.",
        "A dated timeline you write yourself: what happened, when, who said what. Write it now, while you remember it.",
        "Any correspondence — messages, emails, the grievance you already sent.",
      ],
    },
    {
      k: "note",
      tone: "alert",
      title: "Do not wait to see how it goes",
      text: "A consumer complaint must generally be filed within two years of the cause of action arising. Records also become harder to obtain as retention periods run out. Collecting the file early costs nothing and preserves every option.",
    },
    { k: "h2", text: "Route one: the establishment's grievance officer" },
    {
      k: "p",
      text: "Undervalued, and the fastest thing available. State rules made under the Clinical Establishments Act and its state equivalents expect a clinical establishment to display a grievance mechanism, and any hospital of size has a named officer.",
    },
    {
      k: "p",
      text: "Write, do not telephone. One page: what happened, dated; what you are asking for; what you enclose. Ask for a written reply within a stated period, say fifteen days. Keep a copy. A large share of disputes about billing, records, staff conduct and cancelled procedures end here, because the establishment would rather resolve it than have it escalate — and a documented, ignored grievance is itself useful evidence in every other forum.",
    },
    { k: "h2", text: "Route two: the state medical council" },
    {
      k: "p",
      text: "This is the professional-conduct forum. It handles the behaviour of a registered doctor measured against the code that binds them: consent not taken, records refused, confidentiality breached, fees misrepresented, practice outside the scope of registration, misconduct.",
    },
    {
      k: "steps",
      items: [
        {
          title: "Identify the right council",
          text: "Complain to the council that registered the doctor, which is not always the state you were treated in. The registration number and council appear on the prescription and on the register entry. If you are unsure which register to search, [which council registered your doctor](/health-guides/medical-councils-of-india) explains how the system is divided.",
        },
        {
          title: "File in the council's format",
          text: "Most councils publish a complaint form and require an affidavit or a notarised declaration. Attach the record, the timeline and any prior correspondence. Keep the narrative factual and short; the annexures do the work.",
        },
        {
          title: "Expect an inquiry, not a hearing you attend",
          text: "The council seeks the doctor's response, may refer the case to an ethics committee, and may call both sides. Timelines vary widely between councils, and a year or more is common.",
        },
        {
          title: "Know the appeal position",
          text: "Under the National Medical Commission Act, an appeal against a state council's action lies to the Ethics and Medical Registration Board, and from the Board to the Commission within sixty days of the decision being communicated. The Act frames that right in terms of an aggrieved medical practitioner, and whether a complaining patient may appeal has been contested rather than settled — worth knowing before you plan on it.",
        },
      ],
    },
    {
      k: "p",
      text: "What the council can do at the end is warn, censure, suspend a registration for a period, or remove it. Those are real sanctions with real consequences for a practitioner. What it will not do is compensate you, and it will not adjudicate a difference of clinical opinion where the care fell within a range a reasonable practitioner might have chosen.",
    },
    { k: "h2", text: "Route three: the consumer commission" },
    {
      k: "p",
      text: "Medical services provided for a fee are services under consumer law, and deficiency in service is actionable. This is the route that produces compensation, and it is more accessible than people assume: you may file yourself, a lawyer is not compulsory, filing fees are modest, and complaints can be filed online.",
    },
    {
      k: "p",
      text: "Which commission hears it depends on the value of the goods or services paid for together with the compensation claimed. Under the rules notified in 2021, the district commission hears up to fifty lakh rupees, the state commission above fifty lakh and up to two crore, and the national commission above two crore.",
    },
    {
      k: "ul",
      items: [
        "**Limitation** — generally two years from when the cause of action arose.",
        "**Where to file** — ordinarily where you live or work, or where the opposite party operates, which is a real convenience in medical cases.",
        "**What you must show** — a duty, a breach of the standard a reasonably competent practitioner would have met, and a loss caused by that breach. Not every bad outcome is a breach, and this is the point most complaints turn on.",
        "**Who to name** — the doctor and the establishment are commonly named together, since the hospital may be vicariously liable.",
      ],
    },
    {
      k: "note",
      tone: "info",
      title: "A poor outcome is not by itself negligence",
      text: "Indian courts have been consistent that a doctor is not liable merely because a treatment failed or because another practitioner would have chosen differently. The question is whether the care fell below the standard of a reasonably competent practitioner in that field. Expert opinion usually decides it.",
    },
    { k: "h2", text: "Route four: the police, and where the criminal line sits" },
    {
      k: "p",
      text: "Criminal complaints against doctors are narrow, and the courts have deliberately kept them so in order to prevent prosecution being used as leverage in what is really a civil dispute. Criminal negligence requires gross negligence, not an error of judgement, and the safeguards built up in case law mean an independent medical opinion is normally required before a doctor is charged.",
    },
    {
      k: "p",
      text: "Two situations are different, and straightforwardly criminal: practising modern medicine without registration, and impersonating a registered practitioner. If that is what you are dealing with, it is a police matter as well as a council matter. [How to spot a fake doctor in India](/blog/how-to-spot-a-fake-doctor-in-india) covers how to establish it before you act.",
    },
    { k: "h2", text: "If the problem is the hospital rather than the doctor" },
    {
      k: "p",
      text: "Refusal of emergency care, rates not displayed, a patient detained over a bill, a body withheld, unsanitary conditions, unqualified staff — these are establishment matters. The forum is the registering authority under the state's clinical establishments rules, usually within the state health department, alongside the consumer route. [Your rights as a patient in India](/blog/patient-rights-in-india) sets out which entitlement each of those breaches.",
    },
    { k: "h2", text: "What to expect, honestly" },
    {
      k: "ul",
      items: [
        "**Time.** Grievance officers answer in weeks. Councils and consumer commissions take months to years.",
        "**Documents decide it.** A well-documented modest claim beats a serious poorly-documented one, every time.",
        "**An apology is rarely an outcome any forum can order.** If that is what you want, the grievance officer is the only realistic route.",
        "**Nothing here reverses the harm.** The honest reasons to complain are to get a specific remedy, and to put a record on file that affects what happens to the next patient.",
      ],
    },
    {
      k: "p",
      text: "If the outcome you want is simply a different doctor, that is a legitimate choice and needs no justification to anybody. You can [browse doctors by city and speciality](/doctors) here, and ask the new practice to request your records — the transfer is routine and your consent is all it needs.",
    },
    {
      k: "p",
      text: "One last thing about this site. If the complaint concerns something we published — a wrong registration number, a wrong qualification, a profile that should not exist — that is our error to fix, not the doctor's, and the [corrections process](/policies/corrections) is the route. We publish what was checked, against which source, with the date, precisely so a mistake is attributable rather than anonymous.",
    },
  ],
  faqs: [
    {
      q: "Where do I file a complaint against a doctor in India?",
      a: "It depends on the outcome you want. For a fix or an explanation, the establishment's grievance officer. For professional discipline, the state medical council that registered the doctor. For compensation, the district, state or national consumer commission depending on the amount. For unregistered practice or impersonation, the police.",
    },
    {
      q: "Can a state medical council award me compensation?",
      a: "No. A council's powers are disciplinary — it can warn, censure, suspend a registration or remove it from the register. Compensation for a loss comes from the consumer commissions or a civil court, which is why the two routes are often pursued in parallel.",
    },
    {
      q: "How long do I have to file a medical negligence case in India?",
      a: "A consumer complaint must generally be filed within two years of the cause of action arising. Because medical records also become harder to obtain over time, collecting the complete file early is what preserves your options, whichever route you eventually take.",
    },
    {
      q: "Which consumer commission hears a medical complaint?",
      a: "Under the rules notified in 2021, the district commission hears matters up to fifty lakh rupees, the state commission above fifty lakh and up to two crore, and the national commission above two crore, reckoned on the value paid together with the compensation claimed. You can usually file where you live or work.",
    },
    {
      q: "Do I need a lawyer to complain about a doctor?",
      a: "Not to file. Consumer complaints can be filed by the complainant in person and online, and council complaints use the council's own form, usually with an affidavit. A lawyer helps where the medical evidence is contested or the claim is large, but the absence of one is not a barrier to starting.",
    },
    {
      q: "Is a bad outcome enough to prove medical negligence?",
      a: "No. Indian courts have consistently held that a doctor is not liable merely because treatment failed or because another practitioner would have done it differently. The test is whether the care fell below the standard of a reasonably competent practitioner in that field, and independent expert opinion usually decides it.",
    },
  ],
};
