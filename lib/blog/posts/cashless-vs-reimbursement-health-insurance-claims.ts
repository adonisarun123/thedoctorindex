import type { BlogPost } from "@/lib/blog/types";

export const post: BlogPost = {
  slug: "cashless-vs-reimbursement-health-insurance-claims",
  title: "Cashless or reimbursement: how a health insurance claim actually gets paid",
  metaTitle: "Cashless vs reimbursement claims in India",
  standfirst:
    "Two routes to the same money, with different paperwork and different ways to go wrong. How each works, what the rules require, and where to complain.",
  category: "choosing",
  targetQuery: "cashless vs reimbursement claim india",
  author: "The Doctor Index editorial team",
  publishedOn: "8 Oct 2026",
  updatedOn: "8 Oct 2026",
  related: ["how-to-read-a-hospital-bill-in-india", "patient-rights-in-india", "ayushman-bharat-pm-jay-explained"],
  body: [
    {
      k: "p",
      text: "A health insurance policy in India pays out in one of two ways. Either the insurer settles the hospital's bill directly, and you pay only what the policy does not cover, or you pay the hospital yourself and claim the money back afterwards. The first is called cashless and the second reimbursement. The policy, the premium and the cover are the same in both cases. What differs is who carries the cash in the meantime, who handles the paperwork, and at which point a dispute surfaces.",
    },
    {
      k: "p",
      text: "Most people learn the difference at a hospital desk, during an admission, which is the worst possible moment. This piece explains how each route works, what the insurance regulator now requires of insurers on timelines and documents, the usual reasons a claim comes back smaller than the bill, and the order in which to escalate when it does. It is about the mechanics of the claim, not about which policy to buy.",
    },
    { k: "h2", text: "The two routes, side by side" },
    {
      k: "p",
      text: "Cashless treatment is available only at a hospital in the insurer's network: hospitals with which the insurer, usually through a third-party administrator, has an agreement on rates and procedures. Reimbursement is available anywhere, including at a network hospital if the cashless request is refused or never made. Insurers are required to publish their list of network hospitals on their websites, and to state plainly that treatment elsewhere means filing a reimbursement claim.",
    },
    {
      k: "table",
      caption: "Cashless and reimbursement compared",
      head: ["", "Cashless", "Reimbursement"],
      rows: [
        ["Where it works", "Network hospitals only", "Any hospital that meets the policy's definition"],
        ["Who pays the hospital", "The insurer, directly, for the approved amount", "You, in full, at discharge"],
        ["Who handles the paperwork", "Mostly the hospital's insurance desk and the TPA", "Mostly you, after discharge"],
        ["When disputes surface", "At pre-authorisation or at final discharge approval", "Weeks later, when the claim is assessed"],
        ["What you pay out of pocket", "Non-payable items, deductions, co-payment", "Everything, until the claim is settled"],
      ],
    },
    {
      k: "p",
      text: "A third-party administrator, or TPA, is a licensed company that processes claims on the insurer's behalf. Many insurers use one; some handle claims in-house. The TPA does not decide what your policy covers. It applies the policy wording on the insurer's behalf, and the insurer remains answerable for its decisions.",
    },
    { k: "h2", text: "How a cashless claim works" },
    {
      k: "steps",
      items: [
        {
          title: "Pre-authorisation request",
          text: "For a planned admission, the hospital's insurance desk sends a pre-authorisation request to the insurer or TPA before you are admitted, with the doctor's diagnosis, the proposed treatment and an estimate. For an emergency, the request goes as soon as practicable after admission. You will be asked for the policy or member card and photo identification.",
        },
        {
          title: "Initial approval",
          text: "The insurer approves an amount, asks for more information, or declines. The IRDAI Master Circular on health insurance, issued on 29 May 2024, requires insurers to decide on a cashless request immediately and in no more than one hour of receiving it. An approval is for a stated sum, not an open cheque; the hospital can ask for an enhancement if the treatment changes.",
        },
        {
          title: "Treatment and enhancement",
          text: "If the stay runs longer or the procedure changes, the hospital sends an enhancement request. This is where many surprises begin, because the first approved amount is often well below the final bill and patients assume it was a ceiling the hospital would respect.",
        },
        {
          title: "Final authorisation at discharge",
          text: "When you are ready to leave, the hospital sends the final bill and discharge summary for final authorisation. The same circular requires the insurer to grant it within three hours of the request, says the patient is not to be kept waiting for discharge, and puts any extra amount the hospital charges because of a delay beyond three hours on the insurer, paid from its shareholders' funds.",
        },
        {
          title: "Settling the difference",
          text: "You pay the hospital whatever the insurer has not approved: items the policy does not pay for, any co-payment, deductions, and anything above the sum insured. Ask for the insurer's approval letter showing the amount approved and the amount disallowed, with reasons. That letter is the document you will need if you dispute anything later.",
        },
      ],
    },
    {
      k: "note",
      tone: "info",
      title: "Cashless refused is not claim refused",
      text: "An insurer may decline a cashless request because the information is incomplete or the case needs more scrutiny, and still pay a reimbursement claim later. A refusal at the desk is a decision about the route, not always about the claim. Keep every paper, pay the bill, and file for reimbursement.",
    },
    { k: "h2", text: "What a reimbursement claim needs" },
    {
      k: "p",
      text: "Reimbursement puts the work on you. Intimate the claim to the insurer as early as possible, ideally on admission, because most policies set a deadline for intimation and another for submitting documents, and a late claim is an easy one to query. The deadlines are in your policy wording, not in a general rule, so read them before you need them.",
    },
    {
      k: "p",
      text: "The usual set of documents is long, and each item exists because its absence is a common reason for a query:",
    },
    {
      k: "ul",
      items: [
        "The insurer's claim form, signed, with the hospital section completed and stamped.",
        "The original final bill, itemised, with a payment receipt. A package bill without a break-up invites questions.",
        "The discharge summary, showing diagnosis, treatment, dates of admission and discharge.",
        "Investigation reports, with the doctor's prescriptions or advice that ordered them.",
        "Pharmacy bills, matched to prescriptions.",
        "For surgery involving an implant, the implant's sticker or invoice showing make and batch.",
        "For an accident, a medico-legal case record or first information report where one was made.",
        "Know-your-customer documents and a cancelled cheque or bank details for payment.",
      ],
    },
    {
      k: "p",
      text: "Photocopy everything before you send it, and send it in a way that produces a dated acknowledgement. The records themselves are yours to ask for: [how to get your medical records](/blog/how-to-get-your-medical-records-in-india) covers the timelines a hospital is expected to meet. The 2024 Master Circular also says that, once a claim is intimated, insurers and TPAs are to collect the required documents from the hospital rather than requiring them of the policyholder. In practice, reimbursement claims still run on what you submit, so assemble the file yourself and treat any document the insurer fetches as a bonus.",
    },
    { k: "h2", text: "Why the payment comes in below the bill" },
    {
      k: "p",
      text: "Very few claims are paid at exactly the amount on the hospital bill. The gap usually has one of five explanations, and each can be checked against the policy wording.",
    },
    { k: "h3", text: "Non-payable items" },
    {
      k: "p",
      text: "Policies list items they will not pay for even during a covered admission: typically registration and admission charges, toiletries, attendant and visitor charges, food for relatives, and some consumables such as gloves, masks and disposable kits. On a long stay these add up to a noticeable sum. Some insurers sell an add-on that covers consumables; if you do not have it, expect to pay them.",
    },
    { k: "h3", text: "Room rent limits and proportionate deduction" },
    {
      k: "p",
      text: "This is the deduction that most surprises people. Many policies cap the room rent they will pay per day, either as a rupee figure or a percentage of the sum insured, or by room category. If you stay in a costlier room, the insurer does not simply refuse the difference in rent. It may scale down other charges that hospitals price by room category, such as doctors' visit fees and nursing charges, in the same proportion. A room costing twice the limit can mean roughly half of those associated charges is disallowed.",
    },
    {
      k: "p",
      text: "IRDAI has moved to narrow this through its product guidelines, and many policy wordings now keep items such as pharmacy, implants and diagnostics out of the calculation, or apply it only where the hospital actually prices by room category. The exact rule that applies is the one written into your policy, so read the room rent clause before choosing a room, and ask the hospital which room category falls within it.",
    },
    { k: "h3", text: "Sub-limits, co-payment and deductibles" },
    {
      k: "p",
      text: "Some policies cap what they will pay for named procedures, such as cataract surgery, regardless of the sum insured. Others require you to pay a fixed percentage of every claim, often for older insured members, or a fixed first amount. All of these must appear in the Customer Information Sheet, a short summary the circular requires insurers to give with every policy, listing sub-limits, deductibles, waiting periods and exclusions in plain words.",
    },
    { k: "h3", text: "Waiting periods and exclusions" },
    {
      k: "p",
      text: "Pre-existing conditions and certain named treatments are not covered until a waiting period has passed. A claim within the waiting period is not a mistake on the insurer's part. It is the contract, and the place to argue about it was the proposal form.",
    },
    { k: "h3", text: "Non-disclosure" },
    {
      k: "p",
      text: "An insurer may reject a claim on the ground that a condition was not disclosed when the policy was bought. The circular sets a limit on this: after 60 months of continuous cover, called the moratorium period, a policy or claim cannot be contested on grounds of non-disclosure or misrepresentation, except for established fraud. Credits from ported or migrated policies count towards the 60 months.",
    },
    { k: "h2", text: "What the insurer is now required to do" },
    {
      k: "p",
      text: "The Master Circular of May 2024 set out a number of obligations that change the balance of a claim dispute. They are worth knowing by heart, because hospital staff and TPA executives do not always volunteer them.",
    },
    {
      k: "table",
      caption: "Selected obligations under the IRDAI Master Circular on health insurance, 29 May 2024",
      head: ["Obligation", "What it says"],
      rows: [
        ["Cashless decision", "Immediately, and within one hour of the request"],
        ["Final discharge authorisation", "Within three hours of the hospital's request; extra hospital charges caused by delay beyond that are borne by the insurer"],
        ["Death during treatment", "Claim to be processed immediately and the body released from the hospital immediately"],
        ["Rejection", "No claim to be repudiated without approval of the insurer's Claims Review Committee"],
        ["Reasons", "A rejected or partly disallowed claim must be explained with reference to the specific policy terms"],
        ["Documents", "Insurers and TPAs to collect required documents from the hospital, not from the policyholder"],
        ["Ombudsman awards", "To be complied with within 30 days, failing which Rs 5,000 a day is payable to the complainant"],
      ],
    },
    {
      k: "p",
      text: "Insurers must also display on their websites the turnaround times they have set for cashless approval and for reimbursement settlement. Look these up for your own insurer, because they are the yardstick for a complaint about delay. A government reply in the Lok Sabha in December 2025 said the cashless timelines took effect on 1 August 2024.",
    },
    { k: "h2", text: "Choosing a route before an admission" },
    {
      k: "p",
      text: "For a planned procedure, the route is a choice you can make in advance. Confirm that the hospital is in your insurer's network for your specific policy, not just for the insurer in general. Ask the hospital's insurance desk for the pre-authorisation to be sent several days before the admission date, and get a written estimate with exclusions named; [how to read a hospital bill](/blog/how-to-read-a-hospital-bill-in-india) explains what to look for in it. Check the room rent limit and choose a room within it, unless you have decided the difference is worth paying in full.",
    },
    {
      k: "p",
      text: "If the doctor you want operates at a hospital outside the network, reimbursement is not a lesser option, only a slower and more paper-heavy one. Ask the hospital whether its bills are itemised as a matter of course, because a package figure without a break-up is harder to claim. You can [find doctors by city and speciality](/doctors) here and check which hospitals they are attached to, then match those against your insurer's list. For the difference between the types of establishment, see [clinic, nursing home or hospital](/blog/clinic-nursing-home-or-hospital-in-india).",
    },
    {
      k: "p",
      text: "In an emergency, none of this comes first. Treatment comes first, and the claim can be sorted out afterwards; [your rights in a medical emergency](/blog/emergency-treatment-rights-in-india) sets out what a hospital may and may not demand before treating.",
    },
    { k: "h2", text: "When a claim is refused or cut: the order of escalation" },
    {
      k: "steps",
      items: [
        {
          title: "Write to the insurer's grievance officer",
          text: "Every insurer has a grievance redressal officer. Write to them, attach the approval or rejection letter and the bill, and say precisely which deduction you dispute and which clause you rely on. Keep the dated acknowledgement. The insurer's reply must give the contact details of the Insurance Ombudsman you can escalate to.",
        },
        {
          title: "Register on Bima Bharosa if it is not resolved",
          text: "IRDAI runs the Bima Bharosa grievance portal, which passes a complaint to the insurer's system and records it with the regulator. The portal states complaints will be attended to within 14 days. You can also call IRDAI's toll-free number, 155255, or write to complaints@irdai.gov.in. Bima Bharosa is not linked to the Ombudsman, so registering there does not escalate the complaint automatically.",
        },
        {
          title: "Take it to the Insurance Ombudsman",
          text: "If the insurer rejects your complaint, does not reply within a month, or replies unsatisfactorily, you can complain to the Insurance Ombudsman with jurisdiction over your area, within one year. The Council for Insurance Ombudsmen states that there is no fee, no lawyer is needed, and the relief sought must not exceed Rs 50 lakh. Complaints can be filed online at cioins.co.in.",
        },
        {
          title: "Consider the consumer commission",
          text: "A consumer complaint before the District Consumer Disputes Redressal Commission is the other formal route, and can be filed online through the e-Daakhil portal. It is slower and more formal than the Ombudsman, and worth it mainly where the sum or the principle is large.",
        },
      ],
    },
    {
      k: "p",
      text: "Throughout, the strength of a complaint depends on paper: the policy wording, the Customer Information Sheet, the approval letter with its reasons, the itemised bill and the discharge summary. If your complaint is about the doctor rather than the insurer, the route is different; see [how to complain about a doctor](/blog/how-to-complain-about-a-doctor-in-india). The wider entitlements that apply in any hospital are set out in [your rights as a patient](/blog/patient-rights-in-india).",
    },
  ],
  faqs: [
    {
      q: "Which is better, cashless or reimbursement?",
      a: "Neither pays more. The policy covers the same things either way. Cashless spares you the upfront payment and most of the paperwork, but works only at network hospitals. Reimbursement works anywhere but means paying in full first and assembling a document file. Where a choice exists, cashless at a network hospital is usually the less stressful route.",
    },
    {
      q: "How long does an insurer have to approve a cashless request?",
      a: "Under the IRDAI Master Circular on health insurance of 29 May 2024, insurers must decide on a cashless authorisation request immediately and within one hour of receiving it, and grant final authorisation at discharge within three hours of the hospital's request. A government reply to Parliament said these timelines took effect on 1 August 2024.",
    },
    {
      q: "What is proportionate deduction in a health insurance claim?",
      a: "If you stay in a room costlier than your policy's room rent limit, some policies reduce not only the rent but other charges that hospitals price by room category, such as visit fees and nursing, in the same proportion. Regulator guidance has sought to limit which charges this applies to. Your policy wording sets out the exact rule.",
    },
    {
      q: "Can a hospital refuse to discharge me while the insurer approves the claim?",
      a: "The 2024 Master Circular says a policyholder should not be made to wait for discharge, requires final authorisation within three hours, and makes the insurer bear extra hospital charges caused by a delay beyond that. Separately, the Charter of Patients' Rights says a patient cannot be detained on procedural grounds such as a dispute over payment.",
    },
    {
      q: "My claim was rejected for non-disclosure. Can the insurer do that?",
      a: "It can, within limits. After 60 months of continuous cover, the moratorium period, a health policy or claim cannot be contested for non-disclosure or misrepresentation except where fraud is established. Before that, the insurer must explain the rejection with reference to specific policy terms, and you can dispute it with the grievance officer and then the Ombudsman.",
    },
    {
      q: "Where do I complain if my insurer will not settle a claim fairly?",
      a: "Start with the insurer's grievance redressal officer, in writing. If that fails, register on IRDAI's Bima Bharosa portal or call 155255. If the insurer rejects your complaint or does not reply within a month, approach the Insurance Ombudsman within one year; there is no fee, no lawyer is needed, and claims up to Rs 50 lakh are covered.",
    },
  ],
};
