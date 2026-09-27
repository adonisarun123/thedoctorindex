import type { SpecialtyContent } from "./types";

export const dermatology: SpecialtyContent = {
  key: "dermatology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A dermatologist is a doctor who specialises in the skin, hair and nails. In India the usual training is an MBBS followed by an MD in dermatology, venereology and leprosy, or an equivalent DNB. Some older practitioners hold a postgraduate diploma instead. As the degree name shows, Indian dermatologists are also trained in sexually transmitted infections and in leprosy, which is still seen in parts of the country.",
    "Dermatologists diagnose and treat a very wide range of conditions, from acne, eczema, psoriasis, fungal infections and pigment changes to hair loss, nail problems and skin growths. Much of the diagnosis is made by looking carefully at the skin, sometimes with a handheld magnifier, and many conditions are settled in one or two visits. Some need longer treatment and follow-up.",
    "Many dermatologists also offer cosmetic procedures such as chemical peels, lasers and treatments for acne scars. That is a legitimate part of the speciality, but skin disease comes first: a rash, a changing mole or sudden hair loss should be assessed by a dermatologist rather than a salon or a cosmetic clinic. Using strong steroid creams bought without a prescription is a common cause of skin problems in India, and it is worth mentioning any cream you have used.",
  ],
  conditions: [
    { name: "Acne", note: "From mild spots to deep, scarring acne that needs prescription treatment." },
    { name: "Eczema and dermatitis", note: "Itchy, dry or inflamed skin, including reactions to things that touch the skin." },
    { name: "Psoriasis", note: "Scaly patches that come and go; a long-term condition that can also affect joints." },
    { name: "Fungal infections", note: "Ringworm and other fungal infections, which are common in hot, humid weather and can become hard to clear." },
    { name: "Pigment disorders", note: "Vitiligo, melasma and other patches that are lighter or darker than the surrounding skin." },
    { name: "Hair loss", note: "Patchy, diffuse or pattern hair loss, with a search for causes such as thyroid disease, anaemia or stress." },
    { name: "Hives and allergic rashes", note: "Itchy welts that come and go, sometimes linked to food, medicines or infections." },
    { name: "Moles and skin growths", note: "Assessment of moles, warts, cysts and growths, especially any that change." },
    { name: "Nail problems and sexually transmitted infections", note: "Nail infections and changes, and assessment of genital sores, warts or discharge." },
  ],
  tests: [
    { name: "Clinical examination", note: "A close look at the skin, hair and nails, often all over the body." },
    { name: "Dermoscopy", note: "A handheld magnifier with a light to examine moles, hair and scalp in detail." },
    { name: "Skin scrapings", note: "A painless scrape tested for fungus." },
    { name: "Skin biopsy", note: "A small sample of skin taken under local anaesthetic for testing in a laboratory." },
    { name: "Patch testing", note: "Small amounts of common substances placed on the back to find the cause of an allergic rash." },
    { name: "Blood tests", note: "For causes of hair loss and itching, and to monitor some long-term treatments." },
    { name: "Minor procedures", note: "Removing warts, cysts and growths by freezing, burning or cutting." },
    { name: "Phototherapy", note: "Controlled ultraviolet light treatment for conditions such as psoriasis and vitiligo." },
  ],
  versus: [
    { key: "cosmetology", text: "Dermatologists are medical doctors who treat skin, hair and nail disease and can also do cosmetic procedures. Cosmetologists work on appearance and are not trained to diagnose or treat skin disease." },
    { key: "plastic-surgery", text: "Dermatologists remove small skin growths and treat scars with procedures. Larger operations, reconstruction after skin cancer surgery, and cosmetic surgery are usually done by plastic surgeons." },
    { key: "rheumatology", text: "Some skin conditions such as psoriasis and lupus also affect joints and internal organs. A rheumatologist looks after that side, often working with the dermatologist." },
  ],
  firstVisit: [
    "Bring every cream, ointment, soap and medicine you have used on the skin, or photos of their labels, including ones bought without a prescription.",
    "If a rash comes and goes, take photos when it is at its worst.",
    "Avoid make-up, nail polish or new creams on the affected area before the visit so the doctor can see it clearly.",
    "Note when the problem started, what makes it better or worse, and whether anyone else at home has something similar.",
    "Expect the doctor to examine more than just the area you mention; skin conditions often show clues elsewhere.",
  ],
  urgent: [
    "A widespread rash with blisters, peeling skin, or sores in the mouth or eyes, especially after starting a new medicine",
    "Swelling of the lips, tongue or throat, or difficulty breathing with a rash: call 108",
    "A rash that does not fade when pressed, with fever or feeling unwell",
    "A rapidly spreading red, hot, painful area of skin with fever",
  ],
  faqs: [
    {
      q: "Is a dermatologist the same as a cosmetologist?",
      a: "No. A dermatologist is a medical doctor with postgraduate training in skin, hair and nail disease. A cosmetologist works on appearance and is not a medical specialist. Many dermatologists also offer cosmetic treatments.",
    },
    {
      q: "Can I use steroid creams for rashes?",
      a: "Only as prescribed. Steroid creams are useful for some conditions but can make fungal infections worse and thin the skin if misused. Many skin problems seen in Indian clinics are made worse by creams bought without a prescription.",
    },
    {
      q: "When should a mole be checked?",
      a: "See a dermatologist if a mole changes in size, shape or colour, bleeds, itches, or looks different from your other moles.",
    },
    {
      q: "Why does my fungal infection keep coming back?",
      a: "Stopping treatment too early, using steroid-containing creams, sharing towels, and damp clothing can all bring it back. A dermatologist can confirm the diagnosis and plan a full course of treatment.",
    },
    {
      q: "What qualifications should a dermatologist have?",
      a: "An MBBS and a postgraduate qualification in dermatology, usually an MD or DNB in dermatology, venereology and leprosy. Registration should be on the NMC's register or a state medical council register.",
    },
  ],
};
