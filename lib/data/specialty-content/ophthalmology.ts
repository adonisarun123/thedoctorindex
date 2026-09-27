import type { SpecialtyContent } from "./types";

export const ophthalmology: SpecialtyContent = {
  key: "ophthalmology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "An ophthalmologist is a medical doctor who specialises in the eyes: diagnosing eye disease, treating it with medicines, lasers and surgery, and prescribing glasses. In India the usual training is an MBBS followed by an MS or MD in ophthalmology, a DNB, or the older diploma DOMS. Many go on to focus on one area, such as the retina, glaucoma, the cornea, squint and children's eyes, or oculoplasty (the eyelids and tissues around the eye).",
    "Ophthalmologists are different from optometrists. Optometrists are trained to test vision, prescribe and fit glasses and contact lenses, and screen for common eye problems, but they are not medical doctors and do not operate. Opticians make and dispense glasses. For a routine change of glasses an optometrist may be enough; for pain, redness, sudden change in vision, or any eye disease, see an ophthalmologist.",
    "Cataract surgery is one of the most common operations in India, and many eye hospitals run high-volume, well-organised services. Several eye diseases, especially glaucoma and diabetic eye disease, cause no symptoms until damage is advanced, which is why regular eye checks matter for people with diabetes, a family history of glaucoma, or those over forty. Sudden loss of vision is an emergency and should not wait for a routine appointment.",
  ],
  conditions: [
    { name: "Cataract", note: "Clouding of the lens causing blurred or dim vision; treated with surgery when it affects daily life." },
    { name: "Glaucoma", note: "Damage to the optic nerve, often with raised eye pressure; usually painless and silent until advanced, so regular checks matter." },
    { name: "Diabetic retinopathy", note: "Damage to the retina from diabetes; yearly eye checks are usually advised for people with diabetes." },
    { name: "Refractive errors", note: "Short sight, long sight, astigmatism and the need for reading glasses with age." },
    { name: "Conjunctivitis and eye infections", note: "Red, sticky or watery eyes; most settle, but some infections need prompt treatment." },
    { name: "Dry eye", note: "Gritty, burning or tired eyes, common with screen use, age and some medical conditions." },
    { name: "Retinal detachment and macular disease", note: "Conditions of the back of the eye that can threaten sight and need specialist care." },
    { name: "Squint and lazy eye", note: "Misaligned eyes or reduced vision in one eye, best treated early in childhood." },
    { name: "Eye injuries", note: "Foreign bodies, chemical splashes and blows to the eye." },
  ],
  tests: [
    { name: "Vision test", note: "Reading letters on a chart to measure how well each eye sees." },
    { name: "Refraction", note: "Finding the right lens power for glasses." },
    { name: "Slit-lamp examination", note: "A microscope with a light to examine the front of the eye in detail." },
    { name: "Eye pressure measurement", note: "A quick check used in screening for glaucoma." },
    { name: "Dilated eye examination", note: "Drops widen the pupils so the retina can be seen. Vision may be blurred for a few hours, so do not drive yourself home." },
    { name: "OCT scan and visual field test", note: "A scan of the retina and optic nerve, and a test of side vision, used for glaucoma and retinal disease." },
    { name: "Cataract surgery", note: "The cloudy lens is removed and replaced with an artificial lens, usually as a day-care procedure." },
    { name: "Laser treatments and injections", note: "Used for diabetic eye disease, glaucoma, retinal tears and some macular conditions." },
  ],
  versus: [
    { key: "neurology", text: "Some vision problems, such as double vision, sudden loss of part of the visual field, or optic nerve problems, can come from the brain or nerves. The ophthalmologist may involve a neurologist." },
    { key: "diabetology", text: "A diabetologist manages blood sugar; an ophthalmologist checks and treats the effects of diabetes on the eyes. Both matter, and eye checks should continue even when sugars are well controlled." },
    { key: "paediatrics", text: "A paediatrician may notice a squint or a vision problem first. Children's eye conditions are treated by an ophthalmologist, ideally one with an interest in children's eyes." },
  ],
  firstVisit: [
    "Bring your current glasses, contact lens details and any earlier eye prescriptions or reports.",
    "List your medicines and conditions such as diabetes or high blood pressure, and any family history of glaucoma.",
    "If your eyes may be dilated, bring someone to accompany you or plan not to drive for a few hours afterwards. Sunglasses help with the glare.",
    "Do not wear contact lenses on the day if the doctor has asked you not to, and avoid eye make-up.",
    "Expect a vision test, an eye pressure check and an examination with a microscope; the visit may take longer if drops are used.",
  ],
  urgent: [
    "Sudden loss or dimming of vision in one or both eyes, or a curtain or shadow across your sight",
    "A sudden shower of new floaters or flashes of light",
    "A chemical splash in the eye: rinse with plenty of clean water straight away and go to an emergency department",
    "Severe eye pain with redness, nausea or haloes around lights, or a penetrating eye injury: seek emergency care or call 108",
  ],
  faqs: [
    {
      q: "What is the difference between an ophthalmologist and an optometrist?",
      a: "An ophthalmologist is a medical doctor who diagnoses and treats eye disease and performs surgery. An optometrist tests vision and prescribes glasses and lenses but is not a medical doctor and does not operate.",
    },
    {
      q: "When should cataract surgery be done?",
      a: "Usually when the cataract affects your daily life, such as reading, driving or recognising faces. It does not usually need to be done early, unless the doctor has a specific reason.",
    },
    {
      q: "How often should I have my eyes checked?",
      a: "People with diabetes, a family history of glaucoma, or those over forty benefit from regular checks. Your ophthalmologist will advise the interval that suits you.",
    },
    {
      q: "Can glaucoma be cured?",
      a: "Damage already done by glaucoma cannot be reversed, but treatment with drops, laser or surgery can slow or stop further loss. That is why early detection matters.",
    },
    {
      q: "What qualifications should an ophthalmologist have?",
      a: "An MBBS and a postgraduate qualification in ophthalmology, such as MS or MD, DNB, or the diploma DOMS. Registration should be on the NMC's register or a state medical council register.",
    },
  ],
};
