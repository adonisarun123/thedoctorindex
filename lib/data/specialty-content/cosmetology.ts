import type { SpecialtyContent } from "./types";

export const cosmetology: SpecialtyContent = {
  key: "cosmetology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "Cosmetologists and trichologists work on the appearance and care of the skin, hair and scalp. The work includes facials and skin care routines, chemical peels, laser hair reduction, treatments for pigmentation and acne scars, and hair-fall and scalp care. Cosmetology itself is not a medical speciality, and a cosmetologist is not registered with the medical councils. Training ranges from short certificate courses to longer diplomas, so it is worth asking what qualification a practitioner holds.",
    "The line that matters most is between appearance and disease. A rash, a changing mole, sudden or patchy hair loss, severe acne, or a skin infection is a medical problem and belongs with a dermatologist, who is a doctor. Hair fall, for example, can come from thyroid disease, anaemia or other illnesses that a salon treatment will not fix. Many dermatologists also offer cosmetic procedures, so one clinic can often handle both.",
    "Some cosmetic procedures, such as lasers, deeper chemical peels and injections, carry real risks of burns, scarring and pigment change, especially on darker Indian skin types. These should be done by, or under the supervision of, a qualified doctor. Before any procedure, ask who will do it, what training they have, which doctor supervises, and what happens if something goes wrong.",
  ],
  conditions: [
    { name: "Hair fall and thinning", note: "Scalp and hair care advice; a dermatologist should assess sudden, patchy or heavy hair loss for medical causes." },
    { name: "Dandruff and scalp flaking", note: "Often manageable with scalp care; persistent redness or thick scaling may be a skin condition for a dermatologist." },
    { name: "Pigmentation and uneven skin tone", note: "Sun-related darkening and marks; melasma and other patches are best diagnosed by a dermatologist first." },
    { name: "Acne scars and marks", note: "Treatments to improve texture once active acne is under control. Active acne is treated medically." },
    { name: "Unwanted hair", note: "Laser hair reduction; new or excessive hair growth in women may need a hormonal check first." },
    { name: "Skin texture and ageing", note: "Fine lines, dullness and large pores, addressed with routines, peels and procedures." },
    { name: "Dark circles and tanning", note: "Cosmetic care and sun protection." },
    { name: "Skin care routines", note: "Advice on cleansers, moisturisers and sunscreen suited to your skin type." },
  ],
  tests: [
    { name: "Skin and scalp assessment", note: "An examination of skin type, pigmentation and scalp to plan care." },
    { name: "Hair pull test and scalp magnification", note: "Simple checks of how much hair is shedding and how the scalp looks." },
    { name: "Patch test", note: "A small test application before a peel or product, to check for a reaction." },
    { name: "Chemical peels", note: "Acids applied to the skin to improve texture and pigmentation; depth varies, and deeper peels carry more risk." },
    { name: "Laser hair reduction", note: "Repeated sessions of laser light to reduce hair growth; settings must suit the skin type." },
    { name: "Microneedling and similar procedures", note: "Used for acne scars and texture; should be done under proper hygiene and supervision." },
    { name: "Facials and hydration treatments", note: "Cleansing and skin care procedures with little medical risk." },
  ],
  versus: [
    { key: "dermatology", text: "A dermatologist is a doctor who diagnoses and treats skin, hair and nail disease and can also do cosmetic procedures. See a dermatologist first for rashes, infections, severe acne, changing moles or sudden hair loss; a cosmetologist is for appearance and care once disease is ruled out." },
    { key: "plastic-surgery", text: "Cosmetic surgery, such as operations on the nose, eyelids or body contour, and hair transplantation are surgical procedures done by qualified surgeons, usually plastic surgeons or dermatologists with surgical training." },
    { key: "endocrinology", text: "Hair loss, acne and excess hair can come from thyroid or other hormonal problems. An endocrinologist or physician treats the cause; cosmetic care alone will not." },
  ],
  firstVisit: [
    "Ask what qualification the practitioner holds and, for any laser, peel or injection, which doctor supervises the procedure.",
    "Bring the products you use on your skin and hair, or photos of their labels, and any prescriptions from a doctor.",
    "Mention any skin condition, allergies, pregnancy, recent sun exposure and medicines you take; some affect how skin reacts to procedures.",
    "Ask how many sessions are likely, what side effects can occur, and what aftercare is needed.",
    "If you are told a medical problem is present, ask to be referred to a dermatologist rather than treated with a cosmetic package.",
  ],
  urgent: [
    "Blistering, severe burning or rapidly spreading redness after a peel, laser or new product",
    "Swelling of the face, lips or tongue, or difficulty breathing after a treatment: call 108",
    "Signs of infection after a procedure, such as increasing pain, pus or fever",
    "A widespread rash with blisters or sores in the mouth or eyes",
  ],
  faqs: [
    {
      q: "Is a cosmetologist a doctor?",
      a: "Not necessarily. Cosmetology is not a medical speciality and cosmetologists do not register with the medical councils. Some doctors, especially dermatologists, offer cosmetic treatments, so always ask about the practitioner's qualification.",
    },
    {
      q: "Should I see a cosmetologist or a dermatologist for hair fall?",
      a: "For sudden, heavy or patchy hair loss, see a dermatologist first, because medical causes such as thyroid disease, anaemia or scalp conditions need to be ruled out. Cosmetic hair and scalp care can help alongside or afterwards.",
    },
    {
      q: "Are laser treatments safe on Indian skin?",
      a: "They can be, when settings are chosen for your skin type and the procedure is done by trained staff under a doctor's supervision. Darker skin is more prone to burns and pigment changes if this is not done carefully.",
    },
    {
      q: "What is a trichologist?",
      a: "A trichologist focuses on hair and scalp care. Like cosmetology, trichology is not a medical speciality; medical causes of hair loss should be assessed by a dermatologist.",
    },
    {
      q: "Can a cosmetologist treat acne?",
      a: "Mild acne may improve with good skin care. Moderate or severe acne, acne that scars, or acne that has not responded to simple measures should be treated by a dermatologist.",
    },
  ],
};
