import type { SpecialtyContent } from "./types";

export const plasticSurgery: SpecialtyContent = {
  key: "plastic-surgery",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A plastic surgeon restores and reshapes the body's form and function. The word plastic comes from the Greek for moulding, not from the material. In India the usual route is an MBBS, MS General Surgery or DNB, and then a super-speciality degree, most often MCh Plastic Surgery or DrNB Plastic Surgery. Training covers both reconstructive and cosmetic surgery.",
    "Reconstructive work is the larger part of the speciality: treating burns and their scars, repairing injuries to the face and hands, reattaching nerves and tendons, correcting cleft lip and palate, and rebuilding the breast or face after cancer surgery. It often uses skin grafts and flaps, where tissue is moved from one part of the body to another, sometimes with microsurgery to join tiny blood vessels. Cosmetic surgery aims to change appearance by choice, for example the nose, eyelids, breasts or body contour.",
    "Reconstructive surgery is often done in hospital teams alongside cancer, trauma and burns specialists, and may be covered by insurance. Cosmetic surgery is usually not. Many different practitioners offer cosmetic procedures, so it is worth checking a surgeon's qualifications and registration, asking where the procedure will be done, and taking time to understand the expected result, the recovery and the risks before agreeing.",
  ],
  conditions: [
    { name: "Burns and burn scars", note: "Acute burn care, skin grafting, and later release of tight scars that limit movement." },
    { name: "Cleft lip and palate", note: "Surgery in infancy and childhood to repair the lip and palate and support speech and feeding." },
    { name: "Hand injuries and conditions", note: "Tendon, nerve and bone injuries of the hand, and conditions such as carpal tunnel syndrome." },
    { name: "Facial injuries", note: "Repair of cuts and fractures of the face and jaw." },
    { name: "Reconstruction after cancer surgery", note: "Rebuilding the breast, head and neck, or other areas after a tumour is removed." },
    { name: "Chronic wounds and pressure sores", note: "Wounds that will not heal, closed with grafts or flaps once infection is controlled." },
    { name: "Congenital differences", note: "Conditions present from birth, such as ear or hand differences." },
    { name: "Scars and keloids", note: "Revision of prominent or tight scars." },
    { name: "Cosmetic concerns", note: "Elective procedures on the face, breast or body, after careful discussion of expectations and risks." },
  ],
  tests: [
    { name: "Clinical assessment and photographs", note: "Careful examination and photographs to plan surgery and record the starting point." },
    { name: "Blood tests before surgery", note: "Checks on blood count, sugar and clotting." },
    { name: "Imaging", note: "X-rays or CT scans for facial and hand fractures, and scans to plan some reconstructions." },
    { name: "Skin grafts", note: "Thin layers of skin taken from one area to cover a wound or burn elsewhere." },
    { name: "Flap surgery", note: "Moving tissue with its own blood supply to cover a larger or deeper defect." },
    { name: "Microsurgery", note: "Joining tiny blood vessels and nerves under a microscope, for replantation and complex reconstruction." },
    { name: "Scar revision", note: "Procedures to make a scar flatter, narrower or less tight." },
    { name: "Cosmetic procedures", note: "Operations such as rhinoplasty, eyelid surgery or liposuction, chosen for appearance." },
  ],
  versus: [
    { key: "cosmetology", text: "Cosmetologists and dermatologists offer non-surgical skin and appearance treatments. A plastic surgeon performs surgery, both reconstructive and cosmetic. For any operation, check that the person doing it is surgically qualified." },
    { key: "general-surgery", text: "A general surgeon treats many wounds, lumps and abscesses. A plastic surgeon is involved when the aim is to restore shape and function, for example after burns, major injury or cancer surgery." },
    { key: "orthopaedics", text: "Hand injuries are treated by both plastic and orthopaedic surgeons. Plastic surgeons often lead on tendon, nerve and soft-tissue repair; orthopaedic surgeons on bone and joint problems." },
  ],
  firstVisit: [
    "Bring reports and photographs of the injury, burn or earlier surgery, and letters from the referring doctor.",
    "Bring a list of medicines, and mention smoking, diabetes and blood thinners, which affect wound healing and surgical risk.",
    "For cosmetic surgery, think clearly about what you want to change and why, and ask what result is realistic.",
    "Ask where the operation will be done, who will give the anaesthetic, how long recovery usually takes, and what happens if the result is not as expected.",
    "Expect photographs to be taken; they are part of your medical record.",
  ],
  urgent: [
    "Serious burns, burns to the face, hands or genitals, or burns in a child or older adult: cool with running water and call 108",
    "A severed finger or limb: keep the part cool in a clean covered bag, without placing it directly on ice, and go to hospital at once",
    "A deep cut with numbness or inability to move a finger, which may mean a cut nerve or tendon",
    "Spreading redness, fever or severe swelling after any cosmetic or reconstructive procedure",
  ],
  faqs: [
    {
      q: "Is plastic surgery only cosmetic?",
      a: "No. Much of plastic surgery is reconstructive: treating burns, hand injuries, cleft lip and palate, and rebuilding after cancer surgery. Cosmetic surgery is one part of the speciality.",
    },
    {
      q: "What qualifications should a plastic surgeon have?",
      a: "An MBBS, MS General Surgery or DNB, and then a super-speciality degree, usually MCh Plastic Surgery or DrNB Plastic Surgery. Registration can be checked with the NMC or a state medical council.",
    },
    {
      q: "Is reconstructive surgery covered by insurance?",
      a: "Reconstruction after injury, burns or cancer is often covered, depending on the policy. Purely cosmetic surgery usually is not. Check with your insurer before surgery.",
    },
    {
      q: "Can scars be removed completely?",
      a: "No scar can be removed entirely. A plastic surgeon can often make a scar less noticeable, flatter or less tight.",
    },
    {
      q: "How do I choose a cosmetic surgeon?",
      a: "Check the surgeon's qualifications and registration, ask how often they perform the procedure you want, where it will be done, and what the risks and recovery involve. Do not feel rushed into a decision.",
    },
  ],
};
