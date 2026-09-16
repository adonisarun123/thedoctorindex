import type { BlogPost } from "@/lib/blog/types";

export const post: BlogPost = {
  slug: "online-doctor-consultation-rules-in-india",
  title: "Online doctor consultations in India: what the telemedicine rules actually allow",
  metaTitle: "Online doctor consultation rules in India, explained",
  standfirst:
    "Video, audio or chat — the mode decides what a doctor may prescribe. A plain reading of the Telemedicine Practice Guidelines, from the patient's side.",
  category: "rights",
  targetQuery: "online doctor consultation rules india",
  author: "The Doctor Index editorial team",
  publishedOn: "17 Sep 2026",
  updatedOn: "17 Sep 2026",
  related: ["patient-rights-in-india", "doctor-consultation-fees-in-india", "how-to-get-your-medical-records-in-india"],
  body: [
    {
      k: "p",
      text: "Teleconsultation in India went from a legal grey area to a regulated activity almost overnight in March 2020, when the health ministry issued the Telemedicine Practice Guidelines. They were brought in as an appendix to the professional conduct regulations governing registered medical practitioners, which is the detail that gives them teeth: a doctor who ignores them is not breaking a new telemedicine law, they are committing professional misconduct under the rules that already governed them.",
    },
    {
      k: "p",
      text: "Most patients never read them, and the result is a set of predictable frustrations — the prescription that did not arrive, the doctor who insisted on video, the medicine the platform would not issue. Almost all of those are the rules working as designed. Here is what they say, in the order it affects you.",
    },
    { k: "h2", text: "Who the rules apply to" },
    {
      k: "p",
      text: "They apply to registered medical practitioners — practitioners of modern medicine enrolled on a state medical council register or the national register. They do not create a separate cadre of online doctors, and they do not extend anyone's scope: a doctor may do remotely only what they are qualified and registered to do in person.",
    },
    {
      k: "p",
      text: "They also apply to the platform. An app or website that connects you to a doctor carries obligations of its own, including ensuring that the practitioners it lists are registered and that their credentials are available to you. If a platform cannot tell you the registration number of the doctor you are about to consult, that is a failure on the platform's side, not an oversight.",
    },
    {
      k: "note",
      tone: "info",
      title: "A software system cannot be the doctor",
      text: "The guidelines are explicit that artificial intelligence and machine-learning systems may support a registered practitioner but may not themselves counsel patients or prescribe. A symptom checker that ends in a prescription with no named, registered doctor behind it is outside the rules.",
    },
    { k: "h2", text: "Three modes, and why the mode matters" },
    {
      k: "p",
      text: "The guidelines recognise three channels: video, audio, and text — the last covering chat, email, messaging and any other asynchronous exchange. They are not interchangeable. Video comes closest to an in-person consultation because the doctor can see you, observe how you look, and inspect something visible. Audio carries the history but no observation. Text carries neither and loses tone as well.",
    },
    {
      k: "p",
      text: "Because the modes differ in what the doctor can actually perceive, the guidelines make the mode a factor in what may be prescribed. This is the single most useful thing for a patient to understand, because it explains most refusals.",
    },
    { k: "h2", text: "First consultation or follow-up" },
    {
      k: "p",
      text: "The second factor is whether this is a first consultation or a follow-up for a condition the same doctor has already seen. A follow-up rests on an examination that has already happened, so more is permitted. A first consultation over text, with no examination and no prior record, is the most constrained situation in the framework — which is why a chat consultation for a new problem so often ends in advice to come in.",
    },
    {
      k: "p",
      text: "A practitioner may also decide at any point that the case is not suitable for telemedicine at all and require an in-person visit. That is a clinical judgement the guidelines expressly preserve, and it is not a way of extracting a second fee.",
    },
    { k: "h2", text: "The four medicine lists" },
    {
      k: "p",
      text: "Prescribing is governed by four categories. A patient does not need to memorise which drug sits where, but knowing the structure explains what is going on.",
    },
    {
      k: "table",
      caption: "What may be prescribed remotely",
      head: ["List", "What it covers", "When it may be prescribed"],
      rows: [
        ["List O", "Medicines regarded as safe, broadly the over-the-counter category", "Any mode of consultation, including a first consultation"],
        ["List A", "Medicines considered relatively safe with low potential for abuse", "A first consultation conducted by video, and follow-ups for a condition already seen in person"],
        ["List B", "An add-on to an existing prescription", "Follow-up consultations, for the same condition previously treated in person"],
        ["Prohibited list", "Schedule X drugs and narcotic and psychotropic substances under the 1985 Act", "Never by telemedicine, in any mode"],
      ],
    },
    {
      k: "p",
      text: "So when an online doctor declines to prescribe something and asks you to come in, the usual reason is that the medicine is not in a list that the mode and the consultation type permit. It is not obstruction. A practitioner who prescribes outside these limits is the one taking the risk.",
    },
    { k: "h2", text: "Consent: who started the conversation decides" },
    {
      k: "p",
      text: "Consent is treated straightforwardly. If you initiate the consultation, your consent to it is implied — you rang the doctor, that is the consent. If the doctor, a health worker or a caregiver initiates it, explicit consent is required, and it should be recorded. Explicit consent is also required before a prescription is transmitted directly to a pharmacy, precisely so that the choice of pharmacy remains yours.",
    },
    {
      k: "p",
      text: "Nobody can be required to accept a teleconsultation instead of an in-person one, and the guidelines are clear that the patient may decline telemedicine at any stage. Equally, the practitioner is not obliged to consult remotely.",
    },
    { k: "h2", text: "What you should receive" },
    {
      k: "ul",
      items: [
        "**The doctor's identity and registration number.** Practitioners are expected to show their registration number on prescriptions and on fee receipts, remote consultations included. An anonymous consultation is not a consultation under these rules.",
        "**A prescription in a usable form**, where one is issued — legible, naming the medicine, the dose and the duration, and carrying the practitioner's identification. A photographed signed prescription or a properly generated digital one both qualify.",
        "**A record of the exchange.** The practitioner is expected to keep a log of the consultation. You should keep your side too: the chat, the prescription file, the receipt.",
        "**A clear statement of what happens next** — whether a review is needed, in what timeframe, and what should bring you in sooner.",
      ],
    },
    {
      k: "p",
      text: "Those records are worth keeping for the same reason any medical record is. If you later need them formally, see [how to get your medical records in India](/blog/how-to-get-your-medical-records-in-india).",
    },
    { k: "h2", text: "Emergencies are not a telemedicine matter" },
    {
      k: "note",
      tone: "alert",
      title: "In an emergency, do not consult online",
      text: "The guidelines confine telemedicine in an emergency to first-aid advice, counselling, and helping the patient reach a facility as quickly as possible. Chest pain, breathlessness, a head injury, uncontrolled bleeding, a seizure, a collapse, sudden weakness on one side or sudden loss of speech: call 108 or go to the nearest emergency department now. This site is a directory and is not for emergencies.",
    },
    { k: "h2", text: "Where teleconsultation genuinely works well" },
    {
      k: "p",
      text: "It is worth saying plainly that the constraints are not a reason to avoid it. The situations where a remote consultation is as good as or better than travelling are easy to recognise:",
    },
    {
      k: "ul",
      items: [
        "Reviewing test results with the doctor who ordered them.",
        "Routine follow-up of a stable long-term condition, where the question is whether to continue as before.",
        "A repeat of an established prescription for a condition the same doctor has already examined.",
        "A second opinion on a written record — reports, imaging and a discharge summary travel perfectly well.",
        "A first triage of whether a problem needs a specialist at all, and which one.",
        "Anything at all when travel is the obstacle: a patient who cannot easily move, a town with no specialist, a caregiver ringing on behalf of an elderly parent.",
      ],
    },
    {
      k: "p",
      text: "The cases that go badly are the mirror image: a new problem that needs examination, anything involving a lump, a rash whose texture matters, abdominal pain, a child who is unwell, or any situation where the honest answer requires touching the patient.",
    },
    { k: "h2", text: "The prescription, the pharmacy and the chemist who refuses it" },
    {
      k: "p",
      text: "A prescription issued in a teleconsultation is a prescription. It does not become a lesser document because it arrived as a file, and a pharmacy is entitled to dispense against it in the ordinary way provided it carries what any prescription must — the patient, the medicine, the dose, the duration, and an identifiable registered practitioner with their registration number.",
    },
    {
      k: "p",
      text: "In practice chemists do sometimes refuse, usually for one of three reasons: the document has no registration number on it, the medicine is one that requires a physical prescription to be retained, or the shop has a blanket policy. The first is a real defect and worth going back to the doctor about. The second is the law working correctly — certain categories may not be dispensed against a remote prescription at all. The third is worth walking to the next chemist over.",
    },
    {
      k: "p",
      text: "One point of principle is worth knowing. A prescription may be sent directly to a pharmacy only with your explicit consent, precisely so that the choice of where to buy stays with you. A platform that routes your prescription to its own pharmacy by default, without asking, has taken a decision that was yours to make — and the choice of pharmacy is separately treated as a patient right. If that happens, ask for the prescription in your own hands instead.",
    },
    { k: "h2", text: "Before you book: five checks" },
    {
      k: "ol",
      items: [
        "Confirm the doctor's registration number and council, and check it on the register. The mechanics are in [how to check a doctor's registration](/health-guides/how-to-check-a-doctors-registration-in-india).",
        "Check which mode the fee buys. A text consultation at a video price is a poor trade given what text cannot produce.",
        "Ask whether a follow-up within a stated window is included.",
        "Have your history ready in one message: current medicines with doses, previous reports, and when the problem started.",
        "Ask at the outset whether your problem is one that can be handled remotely at all — a straight answer at the start is worth more than a refund later.",
      ],
    },
    {
      k: "p",
      text: "If the outcome is that you need to be seen in person, you can [browse doctors by city and speciality](/doctors) here and see what has been verified about each of them, with the date of the check.",
    },
  ],
  faqs: [
    {
      q: "Is online doctor consultation legal in India?",
      a: "Yes. The Telemedicine Practice Guidelines, issued by the health ministry in March 2020 as an appendix to the professional conduct regulations for registered medical practitioners, set out how a registered doctor may consult remotely. They apply to practitioners registered with a state medical council or the national register, and to the platforms that connect them to patients.",
    },
    {
      q: "Can a doctor prescribe any medicine in an online consultation?",
      a: "No. Prescribing is limited by four categories. List O medicines may be prescribed in any mode; List A in a first consultation conducted by video or in a follow-up; List B as an add-on in a follow-up for a condition previously seen in person. Schedule X drugs and narcotic and psychotropic substances may never be prescribed by telemedicine.",
    },
    {
      q: "Why does an online doctor insist on a video call?",
      a: "Because the mode determines what may be prescribed and what the doctor can observe. A first consultation by video permits a wider range of medicines than one by audio or text, and video is the only remote mode in which the doctor can actually see you. It is usually about staying within the rules, not about the fee.",
    },
    {
      q: "Does an online prescription have to show the doctor's registration number?",
      a: "Yes. Registered practitioners are expected to show their registration number on prescriptions and fee receipts, and telemedicine does not change that. A prescription with no identifiable, registered doctor behind it is outside the guidelines, and a platform should be able to give you the number before the consultation.",
    },
    {
      q: "Can I be made to accept a teleconsultation instead of seeing a doctor?",
      a: "No. Consent is required, and the patient may decline telemedicine at any stage and ask for an in-person consultation. The practitioner may equally decide that a case is unsuitable for remote consultation and require you to come in, which is a clinical judgement the guidelines expressly preserve.",
    },
    {
      q: "Is telemedicine allowed in an emergency?",
      a: "Only to give first-aid advice, counselling, and help in reaching a facility quickly. It is not a substitute for emergency care. For chest pain, breathlessness, serious bleeding, a head injury, a seizure, sudden weakness or a collapse, call 108 or go straight to the nearest emergency department.",
    },
  ],
};
