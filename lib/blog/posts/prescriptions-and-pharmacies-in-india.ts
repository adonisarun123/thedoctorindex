import type { BlogPost } from "@/lib/blog/types";

export const post: BlogPost = {
  slug: "prescriptions-and-pharmacies-in-india",
  title: "What a prescription should contain in India, and what the pharmacy must check",
  metaTitle: "What should a prescription contain?",
  standfirst:
    "A prescription is a legal document. What it must show, what Schedule H, H1 and X mean at the counter, and where online pharmacies stand.",
  category: "rights",
  targetQuery: "what should a prescription contain india",
  author: "The Doctor Index editorial team",
  publishedOn: "8 Oct 2026",
  updatedOn: "8 Oct 2026",
  related: ["generic-medicines-and-jan-aushadhi", "online-doctor-consultation-rules-in-india", "how-to-spot-a-fake-doctor-in-india"],
  body: [
    {
      k: "p",
      text: "A prescription in India is often a few lines on a printed letterhead, sometimes half-legible, sometimes a WhatsApp photograph of the same. It gets handed to a chemist, who reads what they can, finds something on the shelf that matches, and hands the slip back or keeps it. The whole exchange takes a minute and nobody thinks of it as a legal transaction.",
    },
    {
      k: "p",
      text: "It is one. A prescription is the instrument that lets a pharmacy lawfully sell you a medicine it is otherwise forbidden to sell, and it is the record of a registered doctor's decision about your treatment. The rules say what it must contain, which medicines need one, who may dispense them, and what the pharmacy must record. This post sets those rules out from the patient's side. It says nothing about doses or what any medicine is for; that belongs to the doctor who wrote the prescription.",
    },
    { k: "h2", text: "What a valid prescription must show" },
    {
      k: "p",
      text: "The professional conduct regulations that bind registered doctors, issued in 2002 and still the operative rules, set out several requirements that touch the prescription directly. Read together, they produce a short checklist.",
    },
    {
      k: "table",
      caption: "What a prescription from a registered doctor should carry",
      head: ["Item", "What the rule says", "Why it matters to you"],
      rows: [
        ["The doctor's name and qualifications", "The doctor's name and designation in full, with recognised degrees only", "Lets you check that the qualifications are real and match the register"],
        ["Registration number", "Every physician must show the registration number given by their medical council on prescriptions, certificates and receipts", "The single most useful item: it is how you look the doctor up"],
        ["Generic names, legibly", "Drugs to be prescribed with generic names, legibly and preferably in capital letters (amendment of 2016)", "Lets a pharmacist dispense accurately and lets you compare equivalent products"],
        ["Whether the doctor dispensed", "A prescription should make clear if the physician dispensed any medicine", "Distinguishes what you were given in the clinic from what you are to buy"],
        ["Patient details and date", "Standard practice and needed by the pharmacy for its records", "Ties the prescription to you and to a particular consultation"],
        ["Signature", "Standard practice; a prescription is the doctor's authenticated instruction", "An unsigned slip is not something a pharmacy should rely on for a prescription-only medicine"],
      ],
    },
    {
      k: "p",
      text: "The registration number deserves emphasis. It should be on the slip itself, not only on a board in the clinic. With it you can check the doctor on the relevant state medical council register or the national register, which the [guide to checking a doctor's registration](/health-guides/how-to-check-a-doctors-registration-in-india) walks through step by step. A prescription without one, or with one that does not match the name on the register, is a warning sign; [how to spot a fake doctor in India](/blog/how-to-spot-a-fake-doctor-in-india) explains what to do next.",
    },
    {
      k: "p",
      text: "The degrees printed after a name are also checkable. The regulations allow only recognised medical qualifications to be displayed as suffixes. What the common Indian degrees mean, and which are not medical qualifications at all, is in [medical degrees in India explained](/health-guides/medical-degrees-in-india-explained).",
    },
    {
      k: "note",
      tone: "info",
      title: "Prescriptions from a teleconsultation",
      text: "A doctor consulting by video, audio or chat may issue a prescription, but the Telemedicine Practice Guidelines restrict which categories of medicine may be prescribed remotely and require the same identifying details, including the registration number. The details are in [online doctor consultation rules in India](/blog/online-doctor-consultation-rules-in-india).",
    },
    { k: "h2", text: "Schedule H, H1 and X: what the labels mean at the counter" },
    {
      k: "p",
      text: "The Drugs and Cosmetics Rules, 1945 sort medicines into schedules. Three of them decide what happens when you try to buy a medicine, and each is marked on the pack. You do not need to memorise which medicine sits where; you need to recognise the label and know what the pharmacy is supposed to do.",
    },
    {
      k: "table",
      caption: "The three schedules a patient is most likely to meet",
      head: ["Schedule", "Label on the pack", "What it means for buying"],
      rows: [
        ["Schedule H", "Rx symbol at the top left, with a warning that it is to be sold by retail only on the prescription of a registered medical practitioner", "A prescription is required. Most prescription-only medicines fall here."],
        ["Schedule H1", "Rx symbol and a warning inside a box with a red border", "A prescription is required and the pharmacy must record the sale — patient, prescriber, medicine and quantity — in a separate register kept for three years. Introduced in 2013 for certain antibiotics, anti-tuberculosis medicines and habit-forming drugs."],
        ["Schedule X", "XRx symbol at the top left", "Narcotic and psychotropic medicines under the tightest controls. The pharmacy keeps a copy of the prescription for two years, so ask for a photocopy of your own."],
      ],
    },
    {
      k: "p",
      text: "Medicines outside these schedules — many common painkillers, antacids and similar products — may be sold without a prescription, although the pharmacist may still ask questions. The point of the schedules is not to inconvenience you. It is to keep medicines with real risks of misuse, resistance or harm tied to a doctor's assessment.",
    },
    {
      k: "p",
      text: "In practice, enforcement is patchy and many pharmacies sell scheduled medicines without a prescription. That is a breach by the pharmacy, not a loophole you can rely on. It also leaves no record of who decided you needed the medicine, which matters if something goes wrong.",
    },
    { k: "h2", text: "Who may dispense: the pharmacist and the licence" },
    {
      k: "p",
      text: "A chemist shop is a licensed premises. To sell medicines by retail it needs a drug licence from the state drug control department, and prescription medicines are to be dispensed by, or under the supervision of, a registered pharmacist. Pharmacists are registered with the state pharmacy council under the Pharmacy Act, 1948, much as doctors are registered with a medical council.",
    },
    {
      k: "ul",
      items: [
        "Look for the drug licence, usually framed on the wall near the counter, and note the licence number and the name of the registered pharmacist.",
        "Ask who the pharmacist on duty is if the person serving you seems unsure about what they are dispensing.",
        "Under the Pharmacy Council of India's Pharmacy Practice Regulations, 2015, a registered pharmacist is expected to maintain records of prescriptions dispensed.",
        "Ask for a bill. It shows the batch number, expiry date and the manufacturer, which you will need if there is ever a problem with the medicine.",
      ],
    },
    {
      k: "p",
      text: "A pharmacist is entitled to query a prescription that looks incomplete, illegible or inconsistent, and a good one will. That is not obstruction. If a pharmacist refuses to dispense, ask why, and if the problem is with the prescription, go back to the doctor for a corrected one rather than shopping around for someone less careful.",
    },
    { k: "h2", text: "Online pharmacies: where the law stands" },
    {
      k: "p",
      text: "Online medicine sales in India sit in an unresolved space. The Drugs and Cosmetics Act was written for physical shops and does not deal with online sale directly. In August 2018 the health ministry published draft rules to regulate e-pharmacies, including registration, prescription verification and data protection. Those draft rules have not been finalised.",
    },
    {
      k: "p",
      text: "The courts have been asked to fill the gap. In December 2018 the Delhi High Court, hearing a public interest petition, ordered a halt to online sales by unlicensed e-pharmacies; that litigation has continued for years without a final settlement of the question. In 2024 the Madras High Court directed the central government to expedite and finalise a policy on online sale of medicines. In the meantime, many online platforms operate through licensed physical pharmacies, which fulfil orders under their existing retail licences.",
    },
    {
      k: "p",
      text: "For a patient, the practical rules are the same as at a shop counter. A legitimate platform will ask you to upload a valid prescription for any scheduled medicine, will show the licence of the pharmacy dispensing your order, and will give you a proper bill with batch and expiry details. A site that will sell you a Schedule H1 or X medicine without a prescription is breaking the law, and has no reason to care about anything else either.",
    },
    { k: "h2", text: "Keeping copies, and why it matters" },
    {
      k: "p",
      text: "A prescription is part of your medical record, and in many households it is the only record of a consultation that exists. Keep it. If the pharmacy retains the original — as it must for some medicines — ask for a photocopy, or photograph it before you hand it over.",
    },
    {
      k: "steps",
      items: [
        {
          title: "Photograph every prescription",
          text: "Before handing it to a pharmacy, photograph it clearly, front and back. Store the photographs in one place, by date. This alone solves most of the problems people have when they see a new doctor.",
        },
        {
          title: "Keep the pharmacy bills",
          text: "Bills show exactly which product was dispensed, by which manufacturer, with batch and expiry. If a medicine is recalled or you have a reaction, this is what the doctor and the regulator will ask for.",
        },
        {
          title: "Keep a running list of current medicines",
          text: "One sheet with the generic name, strength and the prescribing doctor for everything you take. Bring it to every appointment. It is the single most useful document you can carry.",
        },
        {
          title: "Link records digitally if you want to",
          text: "The government's digital health records system lets you link prescriptions and reports to a health ID. It is optional; [the ABHA health ID explained](/blog/abha-health-id-explained) covers what it does and does not do. For records held by a hospital, see [how to get your medical records in India](/blog/how-to-get-your-medical-records-in-india).",
        },
      ],
    },
    { k: "h2", text: "When something is wrong with a prescription" },
    {
      k: "p",
      text: "If a prescription is illegible, take it back to the doctor and ask for it to be rewritten; a pharmacist guessing at a word is a risk you do not need. If it has no registration number, ask for it to be added. If the doctor will not provide one, or the number does not match the register, treat that as a serious question about who you have been seeing.",
    },
    {
      k: "p",
      text: "If you were sold the wrong medicine, or a pharmacy dispensed a scheduled medicine without a prescription, the state drug control department is the regulator for the shop and the state pharmacy council for the pharmacist. Complaints about the doctor's conduct go to the state medical council; [how to complain about a doctor in India](/blog/how-to-complain-about-a-doctor-in-india) sets out each route. If cost is part of the question, [generic vs branded medicines in India](/blog/generic-medicines-and-jan-aushadhi) explains why the same molecule can carry very different prices.",
    },
    {
      k: "p",
      text: "And if you are looking for a doctor whose registration you can check before you go, every profile in [the directory](/doctors) shows what we have verified and what we have not; [our verification policy](/policies/verification) explains how.",
    },
  ],
  faqs: [
    {
      q: "What details must a doctor's prescription have in India?",
      a: "Under the professional conduct regulations, the doctor's name, qualifications and medical council registration number should appear on the prescription, medicines should be written by generic name legibly and preferably in capitals, and it should state whether the doctor dispensed anything. Patient details, date and signature are standard and needed by the pharmacy.",
    },
    {
      q: "Can a chemist sell Schedule H medicines without a prescription?",
      a: "No. Schedule H medicines carry an Rx symbol and a warning that they are to be sold by retail only on the prescription of a registered medical practitioner. Many shops ignore this in practice, but that is a breach by the pharmacy, and it leaves no record of a doctor having decided you needed the medicine.",
    },
    {
      q: "What does a red box on a medicine pack mean?",
      a: "A warning inside a red-bordered box marks a Schedule H1 medicine, a category introduced in 2013 for certain antibiotics, anti-tuberculosis medicines and habit-forming drugs. It needs a prescription, and the pharmacy must record the patient, prescriber, medicine and quantity in a separate register kept for three years.",
    },
    {
      q: "Are online pharmacies legal in India?",
      a: "The position is unsettled. Draft e-pharmacy rules published in 2018 have not been finalised, and the question has been in litigation before the Delhi and Madras High Courts. Many platforms fulfil orders through licensed physical pharmacies. A legitimate one will insist on a valid prescription for scheduled medicines and issue a proper bill.",
    },
    {
      q: "Should I let the pharmacy keep my prescription?",
      a: "For some medicines the pharmacy must retain a copy, particularly Schedule X, where it is kept for two years. Before handing it over, photograph it or ask for a photocopy. A prescription is often the only record of a consultation, and the next doctor you see will want it.",
    },
    {
      q: "How do I check the registration number on a prescription?",
      a: "Look the number up on the register of the state medical council named on the prescription, or on the national register maintained by the National Medical Commission. The name, qualifications and council should match. If they do not, or the number is missing, ask the doctor and treat a refusal as a warning sign.",
    },
  ],
};
