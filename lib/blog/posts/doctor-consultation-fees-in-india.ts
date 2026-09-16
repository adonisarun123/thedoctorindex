import type { BlogPost } from "@/lib/blog/types";

export const post: BlogPost = {
  slug: "doctor-consultation-fees-in-india",
  title: "What doctors charge in India, and what the fee should actually include",
  metaTitle: "Doctor consultation fees in India: what you pay for",
  standfirst:
    "Consultation fees vary more by address than by ability. Here is what sets the price, what the fee covers, and the questions that prevent a surprise.",
  category: "choosing",
  targetQuery: "doctor consultation fees in india",
  author: "The Doctor Index editorial team",
  publishedOn: "17 Sep 2026",
  updatedOn: "17 Sep 2026",
  related: ["how-to-choose-a-doctor-in-india", "patient-rights-in-india", "clinic-nursing-home-or-hospital-in-india"],
  body: [
    {
      k: "p",
      text: "There is no schedule of doctors' fees in India. Private practitioners set their own, and the same consultation with a comparably qualified doctor can differ by a factor of ten across two neighbourhoods of the same city. That is not a scandal, and it is not a secret. It is the predictable result of a market with no published prices, and the only real defence is knowing what drives the number before you are standing at the counter.",
    },
    {
      k: "p",
      text: "This piece sets out the five things that actually move a consultation fee, the parts of the visit that are usually not in it, and the three questions that resolve almost every billing surprise. None of it is about haggling. It is about knowing what you have agreed to.",
    },
    { k: "h2", text: "What the fee is, in principle" },
    {
      k: "p",
      text: "A consultation fee buys a block of a doctor's time, their judgement about your problem, and a written record of it — usually a prescription or an advice note. On a first visit that block is typically longer, because there is a history to take. On a review visit it may be a few minutes.",
    },
    {
      k: "p",
      text: "Almost everything else is separate. Investigations, procedures done in the room, dressings, injections, physiotherapy, and any consumable used are usually charged on top, sometimes by a different entity at the same address. The single most common billing surprise in Indian outpatient care is not an inflated consultation fee; it is the assumption that the consultation fee covered the ECG.",
    },
    { k: "h2", text: "The five things that set the price" },
    {
      k: "steps",
      items: [
        {
          title: "The address",
          text: "Rent, fit-out and the staff needed to run a reception dominate the cost base of a private clinic. A consulting room in a premium commercial district of a metro carries a fixed cost per hour that a room in a district town does not, and the fee has to cover it before anything else. This is why fee differences between cities, and between neighbourhoods within a city, are far larger than differences between doctors of similar experience.",
        },
        {
          title: "The setting",
          text: "A government hospital OPD charges a nominal registration fee or nothing. A charitable trust hospital charges modestly and often on a sliding scale. A solo private practice charges what the local market bears. A corporate hospital's outpatient department charges a fee set by the institution, of which the doctor receives a share. The same doctor can appear in two of these settings at very different prices on different days of the week.",
        },
        {
          title: "Seniority and scarcity",
          text: "A super-specialist with a DM or MCh in a field with few practitioners in that city commands more than a general physician, for the ordinary reason that there are fewer of them. Within a speciality, years in practice and institutional reputation move the number. Neither is a reliable guide to whether this is the right doctor for your particular problem.",
        },
        {
          title: "What is bundled",
          text: "Some practices include a review visit within a stated window in the first fee. Some include a basic test done in the room. Some include nothing at all. This is the variable with the greatest effect on what a course of treatment actually costs, and it is almost never displayed.",
        },
        {
          title: "Who is collecting",
          text: "In a hospital OPD the fee goes to the institution. In a solo clinic it goes to the doctor. In a polyclinic or a chain, it may be split. This matters mainly because it determines who can answer a question about the bill, and who can waive or adjust anything.",
        },
      ],
    },
    { k: "h2", text: "The settings, compared" },
    {
      k: "table",
      caption: "Where the same consultation costs different amounts",
      head: ["Setting", "Typical fee position", "What you trade"],
      rows: [
        ["Government hospital OPD", "Nominal or free", "Long waits, little continuity, but often the deepest clinical experience in the city"],
        ["Charitable or trust hospital", "Low to moderate, sometimes means-tested", "Variable specialist availability"],
        ["Solo or small private clinic", "Moderate, set locally", "Continuity is best here; facilities are limited"],
        ["Corporate hospital OPD", "Highest, set by the institution", "Convenience, tests under one roof, least continuity"],
        ["Online consultation", "Often below the in-person fee", "No examination; limits on what can be prescribed"],
      ],
    },
    {
      k: "p",
      text: "We publish a fee on a profile only where a practice has confirmed it and we can show the date of that confirmation. A fee without a date is not information — practices revise them, and a number scraped from a listing two years ago is worse than no number, because it looks like a fact.",
    },
    { k: "h2", text: "The review visit is the variable that matters" },
    {
      k: "p",
      text: "For anything that is not a single-visit problem, the total cost of getting treated is the first fee plus however many review visits the plan requires. Practices handle this in three different ways, and they rarely announce which.",
    },
    {
      k: "ul",
      items: [
        "**Free within a window.** A review within seven, ten or fifteen days of the first visit for the same complaint is not charged. Common in solo practice.",
        "**Reduced.** A review is charged at a fraction of the first consultation. Common in hospital OPDs.",
        "**Full fee every time.** Each visit is a new consultation. Common where the doctor is paid per consultation by an institution.",
      ],
    },
    {
      k: "p",
      text: "Asking which of the three applies takes one sentence at the reception desk before you pay, and it changes the arithmetic of a three-month treatment plan far more than the headline fee does.",
    },
    { k: "h2", text: "What is not in the consultation fee" },
    {
      k: "p",
      text: "Treat the following as chargeable unless you are told otherwise, in writing or at the desk:",
    },
    {
      k: "ul",
      items: [
        "Blood tests, imaging and any other investigation, whether done in the building or sent out.",
        "An ECG, a lung function test, a dressing, a nebulisation or an injection given during the visit.",
        "Anything used up: syringes, dressings, sutures, local anaesthetic.",
        "A procedure performed in the consulting room, however minor.",
        "A certificate, a report for insurance, or a fitness letter.",
        "A repeat prescription issued without a visit, in practices that charge for it.",
      ],
    },
    {
      k: "note",
      tone: "info",
      title: "The in-house laboratory question",
      text: "Where tests are done in the same establishment, ask whether you may take the prescription elsewhere. You almost always may. The convenience of testing on the spot is real, and so is the fact that it removes the price comparison you would otherwise make.",
    },
    { k: "h2", text: "Estimates, and your right to ask for one" },
    {
      k: "p",
      text: "For anything beyond a consultation — a procedure, an admission, a package — you are entitled to know what it is expected to cost. The Charter of Patients' Rights, drafted by the National Human Rights Commission and circulated to states by the health ministry, treats information about the cost of treatment and the display of rates as a patient right rather than a courtesy. The state rules made under the Clinical Establishments Act and its state equivalents likewise contemplate establishments displaying their rates.",
    },
    {
      k: "p",
      text: "In practice, what makes an estimate useful is asking what is excluded from it. A package price for a procedure commonly excludes implants, consumables above a stated limit, higher-category rooms, and the cost of managing a complication. A written estimate with the exclusions named is a document you can hold somebody to. A verbal figure is not. More on the underlying entitlements in [your rights as a patient in India](/blog/patient-rights-in-india).",
    },
    { k: "h2", text: "Online consultations and what they cost" },
    {
      k: "p",
      text: "Teleconsultation fees are usually set below the in-person fee for the same doctor, and the platform typically takes a share. What changes is not only the price but what the consultation can produce: the Telemedicine Practice Guidelines limit which categories of medicine may be prescribed remotely, and a first consultation carries tighter limits than a follow-up for a condition already seen in person. If the consultation ends in a referral to come in anyway, you have paid twice. [The rules on online consultations](/blog/online-doctor-consultation-rules-in-india) explain when that is likely.",
    },
    { k: "h2", text: "Receipts, cash and insurance" },
    {
      k: "p",
      text: "Ask for a receipt every time, including for a cash consultation. Three reasons, none of them about suspicion: outpatient consultations and tests are reimbursable under many policies and under employer schemes; a receipt is the only proof of the date of a consultation if a claim or a dispute follows; and a practice that issues receipts as a matter of routine is a practice that keeps records, which is the same habit that produces a usable case file when you need one.",
    },
    {
      k: "p",
      text: "If you are using insurance, establish before the consultation whether the establishment is on your insurer's network, whether outpatient care is covered at all under your policy, and who files the paperwork. Cashless arrangements generally apply to admissions rather than outpatient visits, which surprises people every day.",
    },
    { k: "h2", text: "The four questions, verbatim" },
    {
      k: "ol",
      items: [
        "What is the consultation fee, and is a review within two weeks charged again?",
        "Is anything you are likely to do today — an ECG, a dressing, an injection — billed separately?",
        "If you order tests, roughly what will they cost, and may I have them done elsewhere?",
        "If a procedure is needed, may I have a written estimate showing what it excludes?",
      ],
    },
    {
      k: "p",
      text: "None of these is a difficult question and none of them is impolite. A practice that answers them without friction is telling you something about how it is run, which is information you were not otherwise going to get. You can [browse doctors by city and speciality](/doctors) here; where a practice has confirmed its fee to us, the profile shows the figure and the date it was confirmed, and where it has not, the profile says so instead of guessing.",
    },
  ],
  faqs: [
    {
      q: "What is the average doctor consultation fee in India?",
      a: "There is no national average that means much, because fees are set practice by practice and vary by an order of magnitude between a government OPD and a corporate hospital in a metro. The useful comparison is within your own city and setting: ask two or three practices of the same type, and you will map the local range in a few minutes.",
    },
    {
      q: "Is a follow-up visit charged the same as the first consultation?",
      a: "It depends on the practice, and there are three common patterns: free within a stated window for the same complaint, charged at a reduced rate, or charged in full each time. Ask at reception before you pay the first fee, because over a three-month treatment plan this matters more than the headline consultation fee.",
    },
    {
      q: "Are doctors in India required to display their fees?",
      a: "State rules made under the Clinical Establishments Act and its state equivalents contemplate clinical establishments displaying their rates, and the Charter of Patients' Rights treats information about treatment costs as a patient entitlement. Compliance is uneven, so asking directly remains the reliable method.",
    },
    {
      q: "Does the consultation fee include tests done at the clinic?",
      a: "Usually not. Blood tests, imaging, an ECG, a dressing, an injection or any consumable used are normally charged separately, sometimes by a different entity at the same address. Assume anything beyond the doctor's time and advice is billed on top unless you are told otherwise.",
    },
    {
      q: "Can I ask for a written estimate before a procedure?",
      a: "Yes, and you should. Ask specifically what the estimate excludes — implants, consumables above a limit, room category upgrades and the cost of managing a complication are the usual exclusions. A written estimate naming its exclusions is a document; a verbal figure is not.",
    },
    {
      q: "Are online consultations cheaper than in-person ones?",
      a: "Generally yes, for the same doctor, though a platform usually takes a share. Weigh it against what a remote consultation can produce: there is no physical examination, and the Telemedicine Practice Guidelines restrict which categories of medicine may be prescribed remotely, more tightly on a first consultation than on a follow-up.",
    },
  ],
};
