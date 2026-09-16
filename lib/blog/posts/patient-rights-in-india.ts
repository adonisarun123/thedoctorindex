import type { BlogPost } from "@/lib/blog/types";

export const post: BlogPost = {
  slug: "patient-rights-in-india",
  title: "Your rights as a patient in India, and how to actually use them",
  metaTitle: "Patient rights in India: the Charter, and how to use it",
  standfirst:
    "The Charter of Patients' Rights lists what you are owed. Knowing where each right comes from turns a poster on the wall into something you can insist on.",
  category: "rights",
  targetQuery: "patient rights in india",
  author: "The Doctor Index editorial team",
  publishedOn: "17 Sep 2026",
  updatedOn: "17 Sep 2026",
  related: ["how-to-get-your-medical-records-in-india", "how-to-complain-about-a-doctor-in-india", "getting-a-second-opinion-in-india"],
  body: [
    {
      k: "p",
      text: "In 2018 the National Human Rights Commission drafted a Charter of Patients' Rights, setting out seventeen rights drawn from existing law, court judgments and regulation. The health ministry circulated a version to the states the following year and asked them to adopt it. Many hospitals now print it on a board in the lobby, usually in a font nobody reads.",
    },
    {
      k: "p",
      text: "The Charter itself is not a statute. It is a consolidation — a list of things that were already true, gathered in one place. That sounds like a weakness and is actually the point: almost every line in it is enforceable somewhere else, under the Consumer Protection Act, under the Clinical Establishments Act and the corresponding state rules, under the professional conduct regulations that bind registered doctors, or under the Constitution itself. Knowing which one applies is the difference between being told no and getting a different answer.",
    },
    { k: "h2", text: "The rights that come up most, and where they come from" },
    {
      k: "table",
      caption: "What you are owed, and the source behind it",
      head: ["Right", "In practice", "Where it bites"],
      rows: [
        ["Emergency care", "A hospital must stabilise an emergency case before anything about money is discussed", "Constitutional, via Supreme Court rulings; and the Clinical Establishments Act"],
        ["Information", "Your condition, the proposed treatment, and the alternatives, explained in a language you follow", "Professional conduct regulations; consumer law"],
        ["Informed consent", "Written consent after explanation for any procedure carrying material risk", "Professional conduct regulations; case law on consent"],
        ["Records and reports", "Copies of your case papers, investigation reports and discharge summary", "Professional conduct regulations; the Charter's stated timelines"],
        ["Cost information", "Rates displayed, and an estimate of what treatment will cost", "State rules under the Clinical Establishments Act; consumer law"],
        ["Second opinion", "The right to take your records to another doctor without obstruction", "The Charter; professional conduct regulations"],
        ["Choice of pharmacy and laboratory", "You may fill a prescription or have a test done where you choose", "The Charter; competition and consumer principles"],
        ["Non-discrimination", "Care cannot be refused on grounds of illness, HIV status, gender, caste, religion or origin", "The HIV and AIDS Act 2017; constitutional guarantees"],
        ["Confidentiality", "Your information is not disclosed without consent, with narrow legal exceptions", "Professional conduct regulations; privacy law"],
        ["Discharge", "You cannot be detained, nor a body withheld, over an unpaid bill", "The Charter; a bill is a civil debt, recoverable by ordinary means"],
      ],
    },
    { k: "h2", text: "Emergency care is the strongest right you have" },
    {
      k: "p",
      text: "It is also the one most often waived by patients who do not know they hold it. The position in Indian law is that a person in an emergency is entitled to immediate care, and a hospital — public or private — may not make that care conditional on a deposit, on police formalities in a medico-legal case, or on the patient being at the right kind of establishment. The obligation is to stabilise, and to transfer safely if the facility genuinely cannot manage the case.",
    },
    {
      k: "p",
      text: "What this means in a corridor at two in the morning is that the sentence we cannot start until the deposit is paid is not the law. Say, in those words, that this is an emergency and you are asking for the patient to be stabilised. Write down the time, the name of the person you spoke to, and what was said. That note is what a complaint is built from later.",
    },
    { k: "h2", text: "Information and consent" },
    {
      k: "p",
      text: "Consent in Indian practice is often reduced to a signature on a form handed over by an orderly. The entitlement is broader than the form. You are owed an explanation of what is proposed, what it is expected to achieve, what can go wrong, and what the alternatives are, including doing nothing for now — and it should be given in a language you actually follow.",
    },
    {
      k: "p",
      text: "For anything significant, three questions are worth asking before signing anything: what are the alternatives, what happens if we wait, and who will be performing the procedure. The last one matters more than people expect, because consent given for one surgeon does not extend automatically to another.",
    },
    {
      k: "note",
      tone: "info",
      title: "Consent is specific, and revocable",
      text: "A consent form covers the procedure it names. It is not blanket authority for whatever is found on the way. And a patient with capacity may withdraw consent at any point before a procedure begins, without giving a reason.",
    },
    { k: "h2", text: "Records, and the timelines the Charter states" },
    {
      k: "p",
      text: "You are entitled to copies of your own records. The Charter sets out the expectation in terms of investigation reports being made available within 24 hours of admission or 72 hours of discharge, and the professional conduct regulations separately require a practitioner to supply documents on request within a stated period. Note the two words that do most of the work: copies, and your own.",
    },
    {
      k: "p",
      text: "The hospital keeps the original file; you are entitled to a copy of it, and you can be charged a reasonable copying cost. Records are also the practical precondition for every other right on this list — you cannot get a useful second opinion, question a bill, or make a complaint stand up without them. The mechanics, including what to ask for by name, are in [how to get your medical records in India](/blog/how-to-get-your-medical-records-in-india).",
    },
    { k: "h2", text: "Money: rates, estimates and the bill" },
    {
      k: "p",
      text: "State rules made under the Clinical Establishments Act and its state equivalents contemplate establishments displaying their rates, and the Charter treats information about the cost of treatment as a right rather than a favour. For any admission or procedure, ask for a written estimate and ask specifically what it excludes — implants, consumables above a stated limit, room upgrades and the management of complications are the usual omissions.",
    },
    {
      k: "p",
      text: "On the final bill, you are entitled to an itemised account. Ask for it as a matter of course rather than as an accusation: an itemised bill is also what an insurer and an employer's scheme need. More on what consultations and procedures typically cost, and why the numbers vary so much, in [what doctors charge in India](/blog/doctor-consultation-fees-in-india).",
    },
    { k: "h2", text: "The second opinion, and the right to leave" },
    {
      k: "p",
      text: "You may seek a second opinion from a doctor or hospital of your choice, and the Charter is explicit that a provider must respect that decision and must not withhold your records to frustrate it. In practice, obstruction is rarely outright — it is usually delay at the records counter. A written request with a date solves most of it.",
    },
    {
      k: "p",
      text: "You may also leave. A patient who chooses to discharge against medical advice is entitled to do so, and to take their records with them. What you should not do is leave without a written discharge summary, whatever the circumstances of your going, because the next doctor will need it. See [getting a second opinion in India](/blog/getting-a-second-opinion-in-india) for how to make that visit count.",
    },
    { k: "h2", text: "Non-discrimination is a legal duty, not a policy" },
    {
      k: "p",
      text: "Refusal of care or differential treatment on grounds of illness, HIV status, gender, gender identity, sexual orientation, age, caste, religion, ethnicity, language or social origin is unlawful, and for HIV status the prohibition is written into a dedicated statute. This is not a matter of the establishment's own policy and it is not a discretion that any individual member of staff holds.",
    },
    { k: "h2", text: "Where the Charter gets teeth: four routes" },
    {
      k: "steps",
      items: [
        {
          title: "The establishment's own grievance officer",
          text: "Every clinical establishment of any size has one, and state rules require a displayed grievance mechanism. Start here, in writing, keeping a copy. A surprising share of disputes end at this step because the establishment would rather fix it than escalate it.",
        },
        {
          title: "The state medical council",
          text: "For the conduct of a registered doctor — refusal to provide records, breach of confidentiality, failure to obtain consent, professional misconduct — the council that registered the doctor is the forum. It can discipline the practitioner but it cannot award you compensation.",
        },
        {
          title: "The consumer commission",
          text: "Medical services provided for a fee are services under consumer law, and a deficiency in service can be taken to the district, state or national commission depending on the amount involved. This is the route that produces compensation.",
        },
        {
          title: "The state regulator, and the courts",
          text: "For an establishment's conduct — rates not displayed, an emergency case refused, a body withheld — the registering authority under the state's clinical establishments rules is the correct destination. The constitutional routes exist above all of these but are rarely the sensible first move.",
        },
      ],
    },
    {
      k: "p",
      text: "Which one to use depends on what you want: a correction, a sanction, or compensation. [How to complain about a doctor in India](/blog/how-to-complain-about-a-doctor-in-india) sets out the procedures and the realistic timelines for each.",
    },
    { k: "h2", text: "Rights you exercise best before anything goes wrong" },
    {
      k: "ul",
      items: [
        "Ask for the estimate in writing before an admission, not after it.",
        "Collect reports as they are produced rather than at the end.",
        "Keep the discharge summary somewhere you can find it in a year.",
        "Record the name of the consultant actually responsible for the case, not only the department.",
        "Note the grievance officer's name from the board on the wall while you are calm.",
      ],
    },
    {
      k: "p",
      text: "None of this is adversarial and none of it makes you a difficult patient. It is the ordinary paperwork of a transaction that happens to be about your body. You can [browse doctors by city and speciality](/doctors) here, and read [how we verify what appears on a profile](/policies/verification) — including what we have not checked.",
    },
  ],
  faqs: [
    {
      q: "Is the Charter of Patients' Rights legally binding in India?",
      a: "The Charter itself is a consolidation rather than a statute — it was drafted by the National Human Rights Commission and circulated to states by the health ministry. Nearly every right in it is enforceable through some other instrument: consumer law, the Clinical Establishments Act and state rules, the professional conduct regulations binding registered doctors, or constitutional guarantees.",
    },
    {
      q: "Can a hospital refuse emergency treatment if I cannot pay a deposit?",
      a: "No. A person in an emergency is entitled to immediate care, and Indian courts have held that this obligation falls on private hospitals as well as public ones. The duty is to stabilise the patient, and to arrange a safe transfer if the facility genuinely cannot manage the case. Note the time, the names and what was said if you are refused.",
    },
    {
      q: "Can a hospital stop me from leaving, or keep a body, over an unpaid bill?",
      a: "No. An unpaid bill is a civil debt and the establishment must recover it by ordinary legal means. Detaining a patient, or withholding the body of someone who has died, is not a permitted method and is addressed directly in the Charter of Patients' Rights.",
    },
    {
      q: "Am I allowed to get medicines or tests somewhere other than the hospital?",
      a: "Yes. Choice of pharmacy and of diagnostic laboratory sits with the patient. An establishment may prefer that you use its own, and may point out the convenience, but it cannot make it a condition of treatment.",
    },
    {
      q: "What can I do if my rights as a patient are ignored?",
      a: "Start with the establishment's grievance officer, in writing. For the conduct of a registered doctor, complain to the state medical council that registered them. For compensation, the consumer commission is the route. For the establishment itself, the registering authority under the state's clinical establishments rules is the correct forum.",
    },
    {
      q: "Do I have a right to a second opinion?",
      a: "Yes, and the Charter states that providers must respect the decision and must not withhold your records to obstruct it. Ask for your records in writing, keep a copy of the request with its date, and take the originals of your imaging with you where you can.",
    },
  ],
};
