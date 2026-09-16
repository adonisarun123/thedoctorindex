import type { BlogPost } from "@/lib/blog/types";

export const post: BlogPost = {
  slug: "healthcare-professionals-registry-hpr-explained",
  title: "India's doctor registries, explained: state councils, the NMR and the HPR",
  metaTitle: "HPR and NMR: India's doctor registries explained",
  standfirst:
    "Three registries, built at different times for different purposes, and only one of them reliably answers the question a patient is actually asking.",
  category: "checking",
  targetQuery: "healthcare professionals registry hpr india",
  author: "The Doctor Index editorial team",
  publishedOn: "17 Sep 2026",
  updatedOn: "17 Sep 2026",
  related: ["how-to-spot-a-fake-doctor-in-india", "how-to-choose-a-doctor-in-india", "how-to-complain-about-a-doctor-in-india"],
  body: [
    {
      k: "p",
      text: "If you try to check an Indian doctor's credentials today, you will run into three different registries with overlapping names, built in different decades, for different reasons, by different authorities. Knowing which is which saves a great deal of confusion, because only one of them currently gives a reliable answer, and it is not the newest one.",
    },
    {
      k: "p",
      text: "The three are the state medical registers and the Indian Medical Register compiled from them; the National Medical Register, launched in 2024; and the Healthcare Professionals Registry, part of the national digital health programme. Here is what each is for, what it can tell you now, and where it is heading.",
    },
    { k: "h2", text: "The state registers: the ones that actually govern practice" },
    {
      k: "p",
      text: "India regulates medical practice at the state level. A doctor qualifies, then enrols on the register of a state medical council, and that enrolment is what entitles them to practise. The registration number people quote is a state council number, and the council that issued it is the body that can discipline the holder — which is why a complaint goes to the council that registered the doctor rather than the state where you were treated. [Which council registered your doctor](/health-guides/medical-councils-of-india) sets out how the map works.",
    },
    {
      k: "p",
      text: "The Indian Medical Register is the national compilation of those state registers, historically maintained by the Medical Council of India and now under the National Medical Commission. It is searchable, it is free, and for the purposes of checking whether a named person holds a medical registration, it remains the thing that works.",
    },
    {
      k: "note",
      tone: "info",
      title: "This is the check worth doing",
      text: "Search by the registration number as well as by the name. A number that returns a different person is the most common failure we see in directory data — including in the records we imported before we started checking them against the source. The mechanics are in [how to check a doctor's registration](/health-guides/how-to-check-a-doctors-registration-in-india).",
    },
    { k: "h2", text: "The National Medical Register: the intended replacement" },
    {
      k: "p",
      text: "The National Medical Commission launched the National Medical Register portal on 23 August 2024. The design intent is a genuine improvement on what came before: one national record per doctor, identity verified against Aadhaar, a unique identification number that stays with the practitioner, live status showing whether the licence to practise is active or inactive, and a field recording disciplinary action — with state and national registers kept in step automatically.",
    },
    {
      k: "p",
      text: "That last pair of features is the important one. The historical weakness of the Indian system is not that registration is unrecorded; it is that a suspension in one state, a lapsed renewal, or a removal following disciplinary proceedings has been hard to see from outside. A register carrying live status and disciplinary history answers a question the old one could not.",
    },
    {
      k: "p",
      text: "The difficulty has been uptake. Registration was framed as voluntary, and by May 2025 the portal had received only a little over ten thousand applications, of which the overwhelming majority were still unapproved. Against a registered medical workforce of well over a million, that is not a national register yet — it is a pilot.",
    },
    {
      k: "p",
      text: "A draft amendment to the registration regulations circulated in 2026 proposes to change that by making it mandatory, with a unique identification number generated centrally by the Ethics and Medical Registration Board on state registration, so that enrolment happens automatically rather than by application. Doctors' bodies have raised implementation concerns. As a draft, it is a statement of direction rather than a rule in force, and that distinction matters if you are relying on it today.",
    },
    { k: "h2", text: "The Healthcare Professionals Registry: a wider net" },
    {
      k: "p",
      text: "The Healthcare Professionals Registry sits inside the national digital health programme, alongside the ABHA health account that patients hold and the facility registry that lists establishments. Its scope is deliberately broader than the medical registers: it is designed to cover healthcare professionals across systems of medicine and across roles — modern medicine, AYUSH, dentistry, nursing, allied and healthcare professions — each with a verified digital identity that can be used to sign records, authenticate teleconsultations and link into the digital health ecosystem.",
    },
    {
      k: "p",
      text: "For a patient, the eventual value is that the person consulting you online has a verified identity attached to their record, rather than a name typed into an app. For a practitioner, it is the identity that lets them issue records into a system where records travel with the patient.",
    },
    {
      k: "p",
      text: "Its limit today is the same as the NMR's: coverage. A registry that not everyone is on cannot be used to conclude that an absent person is unregistered. It supports a positive finding, not a negative one.",
    },
    { k: "h2", text: "What each one can tell you today" },
    {
      k: "table",
      caption: "The three registries compared",
      head: ["Registry", "Run by", "Covers", "Useful for a patient today"],
      rows: [
        ["State medical registers and the Indian Medical Register", "State medical councils, compiled nationally", "Practitioners of modern medicine", "Yes — this is the check that works"],
        ["National Medical Register (NMR)", "National Medical Commission", "Practitioners of modern medicine, on enrolment", "Partially — coverage is still thin"],
        ["Healthcare Professionals Registry (HPR)", "The national digital health programme", "All systems of medicine and allied roles", "Emerging — useful where present, not conclusive when absent"],
        ["Dental and AYUSH council registers", "Dental Council and the AYUSH councils", "Dentists, Ayurveda, homoeopathy, Unani, Siddha", "Yes, for practitioners of those systems"],
      ],
    },
    {
      k: "p",
      text: "The practical rule follows directly from that table: check the state register first, treat a presence on the NMR or HPR as useful corroboration, and never treat an absence from either of the newer registries as evidence of anything at all.",
    },
    { k: "h2", text: "Why the new registries matter anyway" },
    {
      k: "p",
      text: "It would be easy to read the uptake numbers and conclude the exercise is not working. That misses what changes when it does.",
    },
    {
      k: "ul",
      items: [
        "**Status becomes visible.** A register that shows active or inactive answers a question that a certificate of registration never could.",
        "**Disciplinary history stops being invisible.** Today, an action taken by one state council is effectively unknowable to a patient in another state.",
        "**Identity gets separated from credential.** A unique identification number attached to a verified identity is what defeats a genuine registration used by somebody else — the hardest case for any credential check to catch.",
        "**Teleconsultation gets a verifiable doctor.** The [telemedicine rules](/blog/online-doctor-consultation-rules-in-india) require an identifiable, registered practitioner, and a verified digital identity is how that stops depending on the platform's honesty.",
      ],
    },
    { k: "h2", text: "For doctors: is it worth enrolling now" },
    {
      k: "p",
      text: "For practitioners reading this: the case for enrolling on the NMR and obtaining an HPR identity is not primarily compliance, it is provenance. The steady direction of travel is that anything written about a doctor — a directory listing, a hospital profile, a teleconsultation record — will be expected to point back to a verifiable identity, and being absent from the registries that do the verifying leaves your own record to be assembled by other people from whatever they can find.",
    },
    {
      k: "p",
      text: "That is a problem we see daily. Most profiles in any Indian doctor directory, this one included, were compiled from sources the doctor never saw. Where a practitioner confirms their own details, the record improves immediately and stays right. If that is you, you can [claim your profile](/claim-profile) or read [what a profile here does for a doctor](/why-the-doctor-index).",
    },
    { k: "h2", text: "What this site does with all of this" },
    {
      k: "p",
      text: "We check registration numbers against the register rather than reprinting what a source claimed, and we record which source was used and on what date. When a number comes back attached to a different name — which happens more often than anyone would like — the profile says the registration is unverified rather than quietly showing the number anyway.",
    },
    {
      k: "p",
      text: "That is a deliberately unglamorous position, and it means a large share of our profiles show less than a competitor's would. We wrote up what we found when we ran several thousand numbers through the register in [checking registration numbers against the register](/health-guides/checking-registration-numbers-against-the-register), and the method is set out in [how verification works](/policies/verification).",
    },
    { k: "h2", text: "What to do today" },
    {
      k: "ol",
      items: [
        "Ask the doctor for their registration number and the council that issued it.",
        "Search that number on the state register or the national compilation, and check that the name returned matches.",
        "Read the qualification on the register entry and confirm it matches what is claimed on the door.",
        "Check the status on the entry, not merely its existence.",
        "If they hold an NMR or HPR identity, treat it as corroboration — and if they do not, treat it as telling you nothing.",
      ],
    },
    {
      k: "p",
      text: "You can [browse doctors by city and speciality](/doctors) here, and every profile shows what was checked, against what, and when — including the things that were not.",
    },
  ],
  faqs: [
    {
      q: "What is the Healthcare Professionals Registry (HPR)?",
      a: "It is a national registry of healthcare professionals under India's digital health programme, covering practitioners across systems of medicine and allied roles, each with a verified digital identity. It works alongside the ABHA patient account and the facility registry, and is intended to let a professional sign records and authenticate teleconsultations.",
    },
    {
      q: "What is the difference between the NMR and the Indian Medical Register?",
      a: "The Indian Medical Register is the national compilation of the state medical council registers and is what has historically been searched. The National Medical Register, launched in August 2024, is intended to replace it with one national record per doctor, identity verified against Aadhaar, a unique identification number, live licence status and a record of disciplinary action.",
    },
    {
      q: "Is NMR registration mandatory for doctors in India?",
      a: "It was introduced as voluntary and uptake was low. A draft amendment to the registration regulations circulated in 2026 proposes making it mandatory, with the unique identification number generated centrally on state registration rather than by application. As a draft it indicates direction rather than an obligation currently in force.",
    },
    {
      q: "Can I check if a doctor is registered using the HPR?",
      a: "Only partially. Coverage is still being built, so a professional appearing on the registry is useful corroboration, but an absence proves nothing. For a definitive check today, search the state medical council register or the national compilation of those registers.",
    },
    {
      q: "Does the HPR cover AYUSH practitioners and dentists?",
      a: "Yes. Its scope is deliberately wider than the medical registers and is designed to cover practitioners across systems of medicine and allied health roles. The statutory registers for those professions remain separate — dentists with the dental councils, and AYUSH practitioners with the AYUSH councils.",
    },
    {
      q: "Why do some directories show registration numbers that turn out to be wrong?",
      a: "Because most directories print whatever a source supplied without checking it against the register. When numbers from listing data are run against the register, a substantial share come back attached to a different doctor. Look for a listing that names its source and shows the date the check was made, rather than one that simply displays digits.",
    },
  ],
};
