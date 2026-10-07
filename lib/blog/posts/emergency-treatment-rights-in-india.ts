import type { BlogPost } from "@/lib/blog/types";

export const post: BlogPost = {
  slug: "emergency-treatment-rights-in-india",
  title: "Can a hospital refuse emergency treatment in India? What the law actually says",
  metaTitle: "Can hospitals refuse emergency treatment?",
  standfirst:
    "No hospital may make emergency care wait on a deposit or a police report. Where that rule comes from, and how to use it when it matters.",
  category: "rights",
  targetQuery: "can hospital refuse emergency treatment india",
  author: "The Doctor Index editorial team",
  publishedOn: "8 Oct 2026",
  updatedOn: "8 Oct 2026",
  related: ["patient-rights-in-india", "how-to-complain-about-a-doctor-in-india", "clinic-nursing-home-or-hospital-in-india"],
  body: [
    {
      k: "p",
      text: "The question usually arrives at the worst possible moment: at a casualty counter, late at night, with someone bleeding or breathless on a stretcher and a clerk asking for a deposit, an insurance card, or a police report before anyone will touch them. It is the moment when people are least able to argue and most likely to pay whatever is asked.",
    },
    {
      k: "p",
      text: "The law on this is older and clearer than most people realise. The Supreme Court settled the basic duty in 1989, Parliament has since protected bystanders who help, and a national scheme now pays for the first days of treatment after a road accident. What follows is how those pieces fit together, what a hospital can and cannot ask for, and where the system still fails. It is not first-aid guidance; for that, call for help and follow the instructions of the people trained to give it.",
    },
    { k: "h2", text: "The short answer" },
    {
      k: "p",
      text: "No hospital in India, public or private, may refuse to begin treatment of a person in a medical emergency because a deposit has not been paid, because a police case has not been registered, or because the patient has no documents. The duty is to examine the patient and stabilise them within the staff and facilities the hospital has. If the hospital genuinely cannot manage the case, it should stabilise and arrange a safe transfer, not turn the patient away at the door.",
    },
    {
      k: "p",
      text: "That duty has limits, and pretending otherwise does not help anyone. It is a duty to stabilise, not a promise of free treatment for the whole admission. A small clinic is not obliged to perform surgery it has no theatre for. And the right is only as strong as the person willing to say it out loud at the counter.",
    },
    { k: "h2", text: "Where the rule comes from: Parmanand Katara" },
    {
      k: "p",
      text: "In *Pt Parmanand Katara v Union of India*, decided on 28 August 1989, the Supreme Court considered the case of an injured scooterist who had been turned away by a hospital and told to go to another one authorised to handle medico-legal cases. He died on the way. The court held that preserving human life is of paramount importance, and that every doctor, at a government hospital or otherwise, has a professional obligation to extend their services to protect life.",
    },
    {
      k: "p",
      text: "The court went further. It said that no law or state action could intervene to delay that obligation, and that zonal rules or the classification of a hospital as authorised or not for police cases could not be used to postpone treatment. Medico-legal formalities can follow; they cannot come first. The court also said doctors should not be needlessly harassed by police or courts for having treated an injured person, which removed one of the reasons hospitals gave for refusing.",
    },
    {
      k: "p",
      text: "Seven years later, in *Paschim Banga Khet Mazdoor Samity v State of West Bengal* (6 May 1996), the court considered a man with a head injury who was turned away by several government hospitals for want of a bed. It held that a government hospital's failure to provide timely treatment to a person in need violates the right to life under Article 21, and awarded compensation. Together, these two judgments are the constitutional foundation of emergency care in India.",
    },
    { k: "h2", text: "Where the duty is written down" },
    {
      k: "p",
      text: "The court judgments are the foundation. Three other instruments put the duty into ordinary rules that a regulator can enforce.",
    },
    {
      k: "table",
      caption: "Emergency care: the duty and its source",
      head: ["Instrument", "What it says", "Who it binds"],
      rows: [
        ["Supreme Court judgments (1989, 1996)", "Treatment of an emergency must not be delayed by legal or procedural formalities; failure by a government hospital violates Article 21", "All doctors and hospitals, and the state"],
        ["Clinical Establishments (Registration and Regulation) Act, 2010, section 12(2)", "An establishment shall provide, within its staff and facilities, the examination and treatment required to stabilise the emergency medical condition of anyone who comes or is brought to it", "Clinical establishments in the states and union territories that have adopted the Act; other states have their own laws"],
        ["Professional conduct regulations for doctors (2002)", "In an emergency a physician must treat the patient, and should respond to any request for assistance in an emergency", "Every registered medical practitioner"],
        ["Charter of Patients' Rights (2018–19)", "Lists emergency care without demand for advance payment as a patient's right", "Advisory consolidation; enforced through the instruments above"],
      ],
    },
    {
      k: "p",
      text: "The second row is the one that reaches private hospitals most directly, because it is a condition of registration. A hospital that refuses to stabilise an emergency is not just being unkind; it is breaching a condition on which it holds its licence to operate, in the states where that Act or an equivalent state law applies. The broader set of entitlements is in [your rights as a patient in India](/blog/patient-rights-in-india).",
    },
    { k: "h2", text: "What a hospital can and cannot demand before stabilising" },
    {
      k: "p",
      text: "Most disputes at the casualty counter are about sequence. The hospital is entitled to ask for some things eventually. It is not entitled to make treatment wait for them.",
    },
    {
      k: "table",
      caption: "Before the patient is stable",
      head: ["The hospital asks for", "Can it make treatment wait?", "Notes"],
      rows: [
        ["An advance deposit", "No", "Payment can be discussed once the patient is stable. Refusing to begin emergency care until money is paid is the central thing the law forbids."],
        ["A police report or FIR", "No", "A medico-legal case is registered by the hospital itself. The police can be informed in parallel; treatment does not wait for them."],
        ["ID, insurance card or Aadhaar", "No", "Identity can be established later. An unconscious patient with no documents is still a patient."],
        ["The name and details of the person who brought the patient in", "No, for road accidents", "A Good Samaritan cannot be compelled to give personal details or pay — see below."],
        ["A signature on a consent form", "Not where the patient cannot consent and delay would cause harm", "Consent is sought from the patient or relatives where possible, but a genuine emergency does not wait for it."],
        ["Transfer to another hospital", "Only after stabilisation", "A hospital that cannot manage a case should stabilise first and arrange a safe transfer, ideally with a summary of what was done."],
      ],
    },
    {
      k: "note",
      tone: "alert",
      title: "Stabilisation is not the whole bill",
      text: "Once the patient is stable, a private hospital may ask for payment for further treatment, and may discuss transfer to a government hospital or a scheme-empanelled one. What it may not do is detain a patient or withhold a body over an unpaid bill. If insurance is involved, [cashless versus reimbursement claims](/blog/cashless-vs-reimbursement-health-insurance-claims) explains what to ask the desk.",
    },
    { k: "h2", text: "Road accidents: protection for the person who helps" },
    {
      k: "p",
      text: "For years, bystanders in India hesitated to help accident victims for fear of being held at the hospital, questioned repeatedly by the police, or made to pay. The Motor Vehicles (Amendment) Act, 2019 addressed this by inserting section 134A into the Motor Vehicles Act, which came into force on 1 October 2020.",
    },
    {
      k: "p",
      text: "Under section 134A, a Good Samaritan — someone who in good faith, voluntarily and without expecting reward, gives emergency care or assistance at the scene of an accident or takes the victim to hospital — is not liable to any civil or criminal action for injury or death of the victim resulting from their negligence in acting or failing to act while helping. Rules notified by the road transport ministry in 2020 add practical protections.",
    },
    {
      k: "ul",
      items: [
        "A Good Samaritan cannot be compelled to give their name, address or other personal details; they may do so voluntarily.",
        "A person who takes a victim to hospital cannot be required to complete admission formalities or pay for the victim's treatment.",
        "A Good Samaritan who chooses to be a witness is to be examined at a time and place of their convenience, and may give evidence by affidavit.",
        "Hospitals are expected to display a charter of these rights in Hindi, English and the local language.",
      ],
    },
    { k: "h2", text: "Cashless treatment for road accident victims" },
    {
      k: "p",
      text: "The road transport ministry notified the Cashless Treatment of Road Accident Victims Scheme, 2025, in force from 5 May 2025. In February 2026 the government launched it nationally under the name PM RAHAT. The core terms are the same in both: any victim of a road accident involving a motor vehicle, on any road, is entitled to cashless treatment of up to ₹1.5 lakh per person, for up to seven days from the date of the accident.",
    },
    {
      k: "p",
      text: "The scheme is implemented with the National Health Authority, the same body that runs Ayushman Bharat PM-JAY, and hospitals are reimbursed from the Motor Vehicle Accident Fund. Full cashless treatment is available at designated hospitals. At a hospital that is not designated, the scheme covers stabilisation, after which the patient may be moved. Police confirmation of the accident is part of the process, but it is the hospital's and the police's job to complete, not the family's precondition for treatment.",
    },
    {
      k: "p",
      text: "Two cautions. ₹1.5 lakh is a ceiling, not an assurance that the whole stay will be covered, and serious trauma can exceed it within days. And the scheme sits alongside, not instead of, other cover: if the victim has health insurance or is eligible for [Ayushman Bharat PM-JAY](/blog/ayushman-bharat-pm-jay-explained), ask how the hospital intends to use each once the seven days or the ceiling are reached.",
    },
    { k: "h2", text: "Getting an ambulance: 108 and 112" },
    {
      k: "p",
      text: "In most states, 108 is the toll-free emergency ambulance number, run under the National Health Mission, usually through a contracted operator. It is meant for critical care, trauma and accident cases. A separate number, 102, is used in many states for basic patient transport, particularly for pregnant women and children. 112 is the national emergency response number, which can dispatch police, fire or ambulance and, under the road accident scheme, help locate the nearest designated hospital.",
    },
    {
      k: "p",
      text: "Coverage, response times and the quality of ambulances vary widely by state and between cities and rural districts. Calling 108 or 112 is still the right first move in most places, because the operator knows which hospitals nearby can receive the case. If a private ambulance is used, the hospital's duty to stabilise on arrival is exactly the same.",
    },
    { k: "h2", text: "If you are refused at the counter" },
    {
      k: "steps",
      items: [
        {
          title: "Say the words",
          text: "Tell the duty doctor, not only the billing clerk, that this is an emergency and that you are asking for the patient to be examined and stabilised. Calm, specific and loud enough for others to hear works better than argument.",
        },
        {
          title: "Offer the sequence, not a refusal to pay",
          text: "Say that payment will be discussed once the patient is stable. That puts the hospital on notice that it is the sequence you are insisting on, not free care, which removes its easiest reason to dig in.",
        },
        {
          title: "Ask for the casualty medical officer or administrator",
          text: "Most hospitals have a medical officer in charge of casualty and an administrator on call. Ask for them by title. Note names and the time.",
        },
        {
          title: "Write it down",
          text: "Record the time you arrived, who you spoke to, what was asked for, and what was said. If you are moved to another hospital, ask for a note of what was done. Those notes are what any later complaint is built from.",
        },
        {
          title: "Complain afterwards, to the right body",
          text: "A refusal by a doctor can go to the state medical council. A refusal by the establishment can go to the registering authority under the state's clinical establishments law, and a claim for compensation to a consumer commission. The routes are set out in [how to complain about a doctor in India](/blog/how-to-complain-about-a-doctor-in-india).",
        },
      ],
    },
    { k: "h2", text: "Where the system still fails" },
    {
      k: "p",
      text: "The law is clear; enforcement is not. Several large states have not adopted the central Clinical Establishments Act and rely on their own laws, which differ in what they say and how actively they are enforced. State registering authorities are often understaffed. Consumer cases take years. And the people most likely to be turned away — the uninsured, those far from home, those without anyone to argue for them — are the least likely to complain later.",
    },
    {
      k: "p",
      text: "There is also a real difference between a hospital that cannot help and one that will not. A small nursing home without a critical care unit cannot manage a major head injury, and sending the patient on quickly, after stabilisation, may be the right call. [Clinic, nursing home or hospital](/blog/clinic-nursing-home-or-hospital-in-india) explains what each kind of establishment is equipped to do, and it is worth knowing which hospitals near you have a round-the-clock emergency department before you need one. Emergency medicine and critical care are recognised specialties; the [specialties index](/specialties) lists them, and you can [browse doctors by city](/doctors).",
    },
    {
      k: "p",
      text: "Once the emergency is over, the patient's ordinary rights apply in full — to an explanation, to [informed consent for any planned procedure](/blog/informed-consent-before-surgery-in-india), and to copies of the records, which are set out in [how to get your medical records in India](/blog/how-to-get-your-medical-records-in-india).",
    },
  ],
  faqs: [
    {
      q: "Can a private hospital refuse emergency treatment in India?",
      a: "No. The Supreme Court held in Parmanand Katara v Union of India (1989) that every doctor, government or otherwise, has an obligation to extend services to protect life, and that procedural formalities cannot delay it. The Clinical Establishments Act also makes stabilising emergencies a condition of registration in the states that have adopted it.",
    },
    {
      q: "Can a hospital ask for a deposit before treating an emergency?",
      a: "It can ask for payment once the patient is stable, but it cannot make emergency examination and stabilisation wait for a deposit. If you are asked, say clearly that this is an emergency, ask for the patient to be stabilised, and say that payment will be discussed afterwards. Note names and times.",
    },
    {
      q: "Does a hospital need a police FIR before treating an accident victim?",
      a: "No. The Supreme Court said in 1989 that medico-legal formalities must not delay treatment. The hospital registers a medico-legal case itself and informs the police. A Good Samaritan who brought the victim in cannot be compelled to give personal details or complete admission formalities.",
    },
    {
      q: "How much does the cashless scheme for road accident victims cover?",
      a: "Up to ₹1.5 lakh per victim, for up to seven days from the date of the accident, under the scheme notified in May 2025 and launched nationally as PM RAHAT in February 2026. Full cashless treatment is at designated hospitals; other hospitals are covered for stabilisation. Serious trauma can exceed the ceiling.",
    },
    {
      q: "Will I get into trouble for taking an accident victim to hospital?",
      a: "Section 134A of the Motor Vehicles Act, in force since October 2020, protects a Good Samaritan from civil or criminal liability for injury or death resulting from negligence while helping. You cannot be made to give your details, pay the bill or complete admission formalities, and if you agree to be a witness, examination is at your convenience.",
    },
    {
      q: "What is the difference between 108, 102 and 112?",
      a: "In most states, 108 is the toll-free emergency ambulance service for critical, trauma and accident cases, run under the National Health Mission. 102 is commonly a basic patient transport service, mainly for pregnant women and children. 112 is the national emergency response number that can dispatch police, fire or ambulance.",
    },
  ],
};
