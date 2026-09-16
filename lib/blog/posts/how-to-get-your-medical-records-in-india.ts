import type { BlogPost } from "@/lib/blog/types";

export const post: BlogPost = {
  slug: "how-to-get-your-medical-records-in-india",
  title: "How to get your medical records in India, and what to ask for by name",
  metaTitle: "How to get your medical records from a hospital in India",
  standfirst:
    "A written request, the right words, and a date. Most refusals are not refusals at all — they are the records department not knowing which file you mean.",
  category: "rights",
  targetQuery: "how to get medical records from hospital india",
  author: "The Doctor Index editorial team",
  publishedOn: "17 Sep 2026",
  updatedOn: "17 Sep 2026",
  related: ["patient-rights-in-india", "getting-a-second-opinion-in-india", "how-to-complain-about-a-doctor-in-india"],
  body: [
    {
      k: "p",
      text: "Almost everything a patient might want to do next depends on paper. A second opinion without the previous reports is guesswork. An insurance claim without the discharge summary is a claim that will be queried. A complaint without the case sheet is an argument between two memories. And continuity of care — the ordinary business of a new doctor understanding what has already been tried — collapses entirely without it.",
    },
    {
      k: "p",
      text: "The good news is that the entitlement is not in doubt and the process is short. Most of the difficulty people run into comes from asking for my records at a counter, which is not a request anybody can act on, rather than from any real objection to handing them over.",
    },
    { k: "h2", text: "What the rules say" },
    {
      k: "p",
      text: "Two instruments matter. The professional conduct regulations that govern registered medical practitioners require a doctor to maintain indoor patient records and, where the patient or an authorised attendant asks for them, to acknowledge the request and issue the documents within 72 hours. The Charter of Patients' Rights states the expectation in the other direction, that investigation reports be made available within 24 hours of admission or 72 hours of discharge.",
    },
    {
      k: "p",
      text: "Two consequences follow, and both are useful. First, the clock starts when the request is made, which is a reason to make it in writing with a date on it. Second, the duty is to provide copies — the establishment keeps the original file, and may charge a reasonable copying cost. Neither of those is a refusal.",
    },
    {
      k: "note",
      tone: "info",
      title: "Government hospitals have a second route",
      text: "A public hospital is a public authority. Where an ordinary request stalls, an application under the Right to Information Act to the hospital's public information officer is available, carries a statutory timeline of its own, and costs very little.",
    },
    { k: "h2", text: "Ask for the documents by name" },
    {
      k: "p",
      text: "This is the step that decides how long the whole thing takes. A records clerk can locate a named document. They cannot locate everything. List what you want:",
    },
    {
      k: "ul",
      items: [
        "**Discharge summary** — the single most valuable document, and the one most often the only one people keep.",
        "**Indoor case papers** or the case sheet for the admission, including the daily progress notes.",
        "**Investigation reports** — blood work, cultures, histopathology, biopsy reports.",
        "**Imaging reports and the images themselves** — ask for films or, better, a DICOM copy on a disc or drive. A radiologist's report is not a substitute for the images when a second opinion is the purpose.",
        "**Operative notes and the anaesthesia record**, where surgery was involved.",
        "**Nursing notes and the vitals chart**, which matter in any question about what happened when.",
        "**Consent forms** you signed.",
        "**The itemised bill**, and the implant sticker or invoice where a device was used.",
        "**OPD notes and prescriptions**, if the care was outpatient.",
      ],
    },
    {
      k: "p",
      text: "If you do not know what exists, ask for the complete medical record for the admission from the date of admission to the date of discharge, listing the items above as included. That phrasing is specific enough to act on and broad enough not to miss anything.",
    },
    { k: "h2", text: "The request, step by step" },
    {
      k: "steps",
      items: [
        {
          title: "Write it down",
          text: "A short letter or a form from the medical records department. Include the patient's full name, the hospital registration or UHID number, the admission and discharge dates, the treating consultant's name and department, your contact details, and the list of documents. Sign and date it.",
        },
        {
          title: "Carry identification",
          text: "Your own photo identification if the records are yours. If you are asking on someone else's behalf, a signed authorisation from the patient along with copies of both identifications. For a minor or a patient without capacity, identification establishing the relationship.",
        },
        {
          title: "Get an acknowledgement",
          text: "Ask for the request to be stamped and dated, or emailed with a reference number. This is the single most important piece of paper in the exchange, because it is what starts the clock and what a complaint later rests on. If the counter will not stamp it, send the same letter by email and keep the sent copy.",
        },
        {
          title: "Ask what it costs and when it will be ready",
          text: "Copying charges are legitimate. Ask for the amount and a collection date at the time of the request rather than discovering both later, and get a receipt when you pay.",
        },
        {
          title: "Check the file before you leave the counter",
          text: "Count the pages against your list. Missing operative notes or a missing vitals chart are far easier to raise while you are standing there than by telephone a week later.",
        },
      ],
    },
    { k: "h2", text: "Who holds what" },
    {
      k: "table",
      caption: "Where each document actually lives",
      head: ["Document", "Who holds it", "Typical wait"],
      rows: [
        ["Discharge summary", "Medical records department", "Often same day; it was generated at discharge"],
        ["Indoor case papers", "Medical records department", "Within the 72-hour expectation, longer if archived off site"],
        ["Laboratory reports", "The laboratory, and the hospital file", "Same day from the lab with the receipt number"],
        ["Imaging and DICOM files", "The radiology department", "Same day, usually on a disc or drive you provide"],
        ["OPD prescriptions and notes", "The consulting doctor's own clinic", "Immediately, but retention is shorter than for admissions"],
        ["Itemised bill and implant invoice", "Billing", "Same day"],
      ],
    },
    { k: "h2", text: "Records for someone else" },
    {
      k: "p",
      text: "Records are confidential, so the establishment is right to ask who you are. For a competent adult patient, bring a signed authorisation from them. For a child, a parent or guardian may ask. For a patient who lacks capacity, the next of kin or a legally authorised person, with identification showing the relationship.",
    },
    {
      k: "p",
      text: "For a patient who has died, the next of kin may request the records, and this is a common and entirely proper request — for an insurance claim, for a pending legal question, or simply to understand what happened. Take the death certificate and proof of relationship. Expect more procedure than usual, and put the request in writing from the outset.",
    },
    { k: "h2", text: "Digital records, and what they do not yet replace" },
    {
      k: "p",
      text: "Under the national digital health programme, a patient can hold an ABHA health account and link records from participating hospitals, laboratories and clinics, retrieving them through an app with consent. Where it works, it works well and removes the counter entirely.",
    },
    {
      k: "p",
      text: "Its limit is coverage: a record only appears if the establishment that created it participates and has linked it. Older admissions, smaller clinics and most imaging are not there. Treat digital records as a convenience layer over the paper process, not a replacement for it — and keep your own copies regardless, because a hospital's retention period is finite and an app is a view onto somebody else's system.",
    },
    { k: "h2", text: "If you are refused, or simply ignored" },
    {
      k: "ol",
      items: [
        "Send the request again in writing, referring to the date of the first one, and address it to the medical superintendent or the grievance officer rather than the counter.",
        "Cite the 72-hour expectation in the professional conduct regulations and the Charter of Patients' Rights. Naming the source changes the conversation more than annoyance does.",
        "For a government hospital, file a Right to Information application with the public information officer.",
        "For a registered doctor refusing to supply records, complain to the state medical council that registered them — failure to provide records on request is a matter for the council.",
        "Where the refusal has cost you something — a claim rejected, treatment delayed — the consumer commission treats deficiency in service as actionable. [How to complain about a doctor in India](/blog/how-to-complain-about-a-doctor-in-india) sets out both routes.",
      ],
    },
    {
      k: "note",
      tone: "alert",
      title: "Do not let an unpaid bill become the reason",
      text: "Records are sometimes held pending settlement of a bill. A bill is a civil debt to be recovered like any other, and the Charter of Patients' Rights is explicit that a patient may not be detained nor a body withheld over one. Settle the dispute about money as a separate matter from the request for records, and keep the two in separate letters.",
    },
    { k: "h2", text: "Keep your own file" },
    {
      k: "p",
      text: "The habit that saves the most trouble is the least dramatic one. Keep a single folder, physical or scanned, in date order, with the discharge summaries at the front. Photograph every prescription before it goes into a bag. Ask for imaging on a disc at the time rather than a year later, when the department may no longer hold it.",
    },
    {
      k: "p",
      text: "Records are also the one asset that makes a second opinion genuinely useful — a specialist reading your actual reports is doing something different from a specialist hearing your account of them. If you are at that stage, [getting a second opinion in India](/blog/getting-a-second-opinion-in-india) covers what to take and what to ask, and you can [find doctors by city and speciality](/doctors) here.",
    },
  ],
  faqs: [
    {
      q: "Do I have a legal right to my medical records in India?",
      a: "Yes. The professional conduct regulations binding registered medical practitioners require records to be maintained and supplied on request from the patient or an authorised attendant, with the request acknowledged and documents issued within 72 hours. The Charter of Patients' Rights states the expectation that investigation reports are available within 24 hours of admission or 72 hours of discharge.",
    },
    {
      q: "How long does a hospital take to give medical records?",
      a: "The stated expectation is 72 hours from a written request. A discharge summary and laboratory reports are often available the same day; indoor case papers from an older admission can take longer if the file has been archived off site. Getting the request stamped and dated is what makes the timeline enforceable.",
    },
    {
      q: "Can a hospital charge for copies of medical records?",
      a: "Yes, a reasonable copying charge is legitimate, and you should ask for the amount and the collection date at the time of the request. What is not legitimate is refusing the records altogether, or making them conditional on settling a disputed bill.",
    },
    {
      q: "Can I get the medical records of a relative who has died?",
      a: "Yes. The next of kin may request the records, typically for an insurance claim, a legal question or simply to understand what happened. Take the death certificate and proof of your relationship, expect more procedure than a routine request, and put it in writing from the start.",
    },
    {
      q: "What documents should I ask for by name?",
      a: "The discharge summary, the indoor case papers including daily progress notes, all investigation reports, imaging reports along with the images themselves on a disc, operative notes and the anaesthesia record where there was surgery, nursing notes and the vitals chart, the consent forms, and the itemised bill with any implant invoice.",
    },
    {
      q: "What can I do if a hospital refuses to give my records?",
      a: "Write again to the medical superintendent or grievance officer citing the 72-hour expectation. For a government hospital, file a Right to Information application. For a registered doctor, complain to the state medical council that registered them. Where the refusal caused you a loss, the consumer commission treats deficiency in service as actionable.",
    },
  ],
};
