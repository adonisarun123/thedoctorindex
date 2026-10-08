import type { BlogPost } from "@/lib/blog/types";

export const post: BlogPost = {
  slug: "abha-health-id-explained",
  title: "ABHA, the health ID: what it is, what it does, and what it does not",
  metaTitle: "ABHA health ID explained: what it does",
  standfirst:
    "ABHA is a key to your health records, not a store of them. How the number and address differ, how consent works, and what it cannot do for you.",
  category: "rights",
  targetQuery: "what is abha health id",
  author: "The Doctor Index editorial team",
  publishedOn: "8 Oct 2026",
  updatedOn: "8 Oct 2026",
  related: ["how-to-get-your-medical-records-in-india", "healthcare-professionals-registry-hpr-explained", "ayushman-bharat-pm-jay-explained"],
  body: [
    {
      k: "p",
      text: "ABHA, the Ayushman Bharat Health Account, is a health identifier issued under the government's digital health programme. Hospitals, labs, pharmacies and insurers increasingly ask for it at registration, and many people now have one without being entirely sure what it is. The short version is that it is an identifier and a set of permissions, not a medical file. It lets records held by different providers be linked to you, and lets you decide who may see them.",
    },
    {
      k: "p",
      text: "This piece explains the difference between an ABHA number and an ABHA address, how consent-based sharing actually works, what ABHA does not do, how to create one, the privacy points worth understanding, and how it sits alongside the registries of doctors and facilities. It describes the system as the government documents it; where the system's promises depend on providers behaving well, it says so.",
    },
    { k: "h2", text: "ABDM, and where ABHA fits" },
    {
      k: "p",
      text: "The Ayushman Bharat Digital Mission, ABDM, was launched in September 2021 to build a national digital health network. It is run by the National Health Authority, the same body that runs the PM-JAY hospital cover, though the two are separate programmes; having an ABHA does not make you eligible for [PM-JAY](/blog/ayushman-bharat-pm-jay-explained), and being eligible for PM-JAY does not require one.",
    },
    {
      k: "p",
      text: "ABDM has several parts. ABHA identifies patients. The Healthcare Professionals Registry identifies doctors, nurses and other professionals. The Health Facility Registry identifies hospitals, clinics, labs and pharmacies. On top of these sit the rules and software that let a record created at one registered facility be found and shared, with the patient's consent, at another. A government document published in July 2026 said that over 104 crore health records had been linked to over 93 crore ABHA accounts.",
    },
    { k: "h2", text: "The ABHA number and the ABHA address" },
    {
      k: "p",
      text: "These two are often confused, and the difference matters.",
    },
    {
      k: "table",
      caption: "Two identifiers, two jobs",
      head: ["", "ABHA number", "ABHA address"],
      rows: [
        ["What it is", "A 14-digit unique health identifier", "A username you choose, written in a form resembling an email address"],
        ["What it does", "Identifies you uniquely across the network", "Lets you log in to an app and manage records and consents"],
        ["How it is created", "Through identity verification", "Through registration on an ABDM app or website"],
        ["Where you will see it", "On the ABHA card and in official records", "In apps, at sign-in, and when you share details at a facility"],
      ],
    },
    {
      k: "p",
      text: "In daily use, you give a facility either your number or your address so that it can link the record it is about to create to you. The address is the friendlier of the two, and it is what most apps ask for when you sign in.",
    },
    { k: "h2", text: "How consent-based sharing works" },
    {
      k: "p",
      text: "The design principle is that records stay where they were created, and move only when you agree. A government explainer in July 2026 put it plainly: the data stays with whoever created it, whether hospital, lab or insurer, and there is no central government server storing it all. Records are shared within the ABDM network only when the patient consents, and the consent is revocable and time-bound.",
    },
    {
      k: "steps",
      items: [
        {
          title: "A record is created and linked",
          text: "You visit a facility that uses ABDM-enabled software and share your ABHA number or address. The prescription, report or discharge summary it creates is linked to your ABHA. The record itself stays in the facility's system.",
        },
        {
          title: "Someone asks to see your records",
          text: "A doctor at another facility, or an insurer, sends a consent request through the network, saying what records it wants, for what purpose, and for how long.",
        },
        {
          title: "You approve, narrow or refuse",
          text: "The request appears in your ABHA app or another health records app. You can approve it, limit it to particular records or dates, or refuse it.",
        },
        {
          title: "Records are shared for the period agreed",
          text: "If you approve, the records are sent from the facility that holds them to the one that asked. When the consent expires, or you revoke it, access ends. The ABHA app's privacy policy describes revoking consent from a 'My consent' tab.",
        },
      ],
    },
    {
      k: "p",
      text: "Insurance is one place where this shows up. The IRDAI Master Circular on health insurance of May 2024 allows insurers to help a policyholder create an ABHA, with specific consent, and requires express consent in every instance for sharing medical records. That last point is worth remembering if an insurer's form asks you to agree to blanket sharing; [cashless and reimbursement claims](/blog/cashless-vs-reimbursement-health-insurance-claims) explains what the insurer actually needs to settle a claim.",
    },
    { k: "h2", text: "What ABHA does not do" },
    {
      k: "p",
      text: "Most misunderstandings about ABHA come from expecting it to do more than it does.",
    },
    {
      k: "ul",
      items: [
        "**It does not hold your old records.** Only records created or uploaded by facilities connected to ABDM, or uploaded by you, are linked. Paper files from a hospital that is not on the network are not in it.",
        "**It does not replace asking for records.** A hospital that is not connected still owes you your records on request; [how to get your medical records](/blog/how-to-get-your-medical-records-in-india) covers the timelines.",
        "**It does not make records complete or accurate.** A record linked to your ABHA is exactly as good as the facility that wrote it. Errors travel with it.",
        "**It is not insurance.** An ABHA does not pay for anything. PM-JAY and private insurance are separate.",
        "**It does not verify your doctor.** Checking that a doctor is registered is a different job, done through the medical registers.",
        "**It does not guarantee anyone will read the records.** A doctor still has to ask for them and take the time to look.",
      ],
    },
    {
      k: "p",
      text: "A sensible way to think about it is as an index card rather than a filing cabinet. The index card tells a connected facility where your records are and lets you decide who may open the drawer. If most of your care so far has been at small clinics with paper prescriptions, the drawer will be nearly empty for some time, and the identifier will add little until the places you visit begin linking what they create. If you are treated regularly at a large hospital that has connected its systems, the benefit arrives much sooner. Either way, keep your own copies of anything important. An index is only as useful as what has been filed against it.",
    },
    { k: "h2", text: "How to create one" },
    {
      k: "p",
      text: "You can create an ABHA on the ABDM website or in an ABDM-linked app, including the ABHA app and the revamped Aarogya Setu, which the government relaunched in June 2026 as a citizen-facing health app offering ABHA creation and record management. Many hospitals will also help you create one at registration, often through a QR code at the desk.",
    },
    {
      k: "ol",
      items: [
        "Choose the method. Aadhaar-based verification with a one-time password sent to the linked mobile number is the most common route; ABDM also supports creation using a driving licence.",
        "Verify your details and confirm the mobile number you want linked.",
        "Create an ABHA address you will remember.",
        "Download or save the ABHA card, which shows the number and a QR code.",
        "Set a password or other login in the app so you can see and manage consent requests.",
      ],
    },
    {
      k: "p",
      text: "The ABHA app's privacy policy also describes registering with a mobile or email one-time password and self-declared details, or fetching details from an existing ABHA number. If you are creating one for an elderly parent, do it with them, and make sure the linked mobile number is one that will receive consent requests and that someone in the family checks.",
    },
    {
      k: "note",
      tone: "info",
      title: "Scan and share at the hospital",
      text: "Some facilities let you scan a QR code at registration to share your ABHA details and receive a queue token, instead of filling in a form. The government says this service issued over 23 crore ABHA-linked tokens by June 2026. It is a convenience; it shares your registration details with that facility, not your medical history.",
    },
    { k: "h2", text: "Privacy: what to understand" },
    {
      k: "p",
      text: "The system's privacy design is reasonable on paper: records are not centralised, and sharing requires consent. In practice, privacy depends on three things you control and two you do not.",
    },
    {
      k: "p",
      text: "What you control: which facilities you give your ABHA to, which consent requests you approve, and how long you approve them for. Read each request before tapping approve. A request for all records for an indefinite period is not the same as a request for one discharge summary for a week.",
    },
    {
      k: "p",
      text: "What you do not control: how well each facility secures the records it holds, and whether staff at a facility you have consented to treat the records responsibly. ABDM requires new apps to pass testing and a security audit before going live, according to the government, but a facility's own systems remain that facility's responsibility.",
    },
    {
      k: "p",
      text: "The ABHA app's privacy policy lists the rights it gives users: confirmation and access, correction and erasure, restricting or objecting to disclosure, data portability, withdrawing consent, and complaining to ABDM's grievance redressal officer. Grievances can be raised through ABDM's grievance portal, grievance.abdm.gov.in, or on the toll-free numbers 1800-11-4477 and 14477. The app's policy also describes participation as opt-in, with the option to opt out.",
    },
    { k: "h2", text: "ABHA, HPR and checking who treats you" },
    {
      k: "p",
      text: "ABHA identifies the patient. The [Healthcare Professionals Registry](/blog/healthcare-professionals-registry-hpr-explained) identifies the professional, and the Health Facility Registry identifies the facility. When the system works as designed, the record you receive was created by a registered professional at a registered facility, and linked to you. That is a real improvement on a loose sheet of paper with an unreadable stamp.",
    },
    {
      k: "p",
      text: "It is not, however, a substitute for checking a doctor's registration yourself. HPR enrolment is not the same thing as registration with a medical council, and a doctor who is not on HPR may be fully registered. The authoritative check remains the register: [how to check a doctor's registration](/health-guides/how-to-check-a-doctors-registration-in-india) walks through it. Our [verification policy](/policies/verification) explains what we check before showing a doctor's registration on a profile, and you can [search the directory](/doctors) by city and speciality.",
    },
    {
      k: "p",
      text: "Used sensibly, ABHA is useful in two situations above all: when you see a new doctor and want them to see what has already been done, and when you want a [second opinion](/blog/getting-a-second-opinion-in-india) without carrying a folder across the city. In both, the value depends on the records having been linked in the first place, which is a reason to give your ABHA at facilities you expect to return to, and to keep your own copies regardless.",
    },
  ],
  faqs: [
    {
      q: "What is an ABHA health ID?",
      a: "ABHA, the Ayushman Bharat Health Account, is a health identifier issued under the Ayushman Bharat Digital Mission. It has two parts: a 14-digit ABHA number that identifies you uniquely, and an ABHA address you choose for logging in. It lets records held by connected facilities be linked to you and shared with your consent.",
    },
    {
      q: "What is the difference between an ABHA number and an ABHA address?",
      a: "The ABHA number is a 14-digit unique identifier created through identity verification. The ABHA address is a username you choose, written in a form resembling an email address, used to sign in to health apps and manage records and consents. Facilities accept either to link the records they create to you.",
    },
    {
      q: "Does the government store my medical records under ABHA?",
      a: "According to the government, no. Records stay with whoever created them, such as the hospital, lab or insurer, and there is no central government server holding them all. They are shared within the ABDM network only with your consent, which is time-bound and can be revoked.",
    },
    {
      q: "Is an ABHA the same as an Ayushman card?",
      a: "No. The Ayushman card is for PM-JAY, the government hospital cover for eligible families and people aged 70 and over. ABHA is a health records identifier available to anyone. Both are run by the National Health Authority, which is why they are confused, but one pays for treatment and the other links records.",
    },
    {
      q: "Can I withdraw consent or correct my ABHA data?",
      a: "Yes. The ABHA app's privacy policy lets you revoke a consent you have granted from its consent section, and lists rights to access, correction and erasure, restricting disclosure, and data portability. Complaints go to ABDM's grievance redressal officer through grievance.abdm.gov.in or the toll-free numbers 1800-11-4477 and 14477.",
    },
    {
      q: "Does having an ABHA mean my doctor is verified?",
      a: "No. ABHA identifies patients. Doctors are identified through the Healthcare Professionals Registry, but enrolment there is not the same as registration with a medical council. To confirm a doctor is entitled to practise, check the relevant medical register, which remains the authoritative source.",
    },
  ],
};
