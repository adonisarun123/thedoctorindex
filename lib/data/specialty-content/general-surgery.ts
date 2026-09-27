import type { SpecialtyContent } from "./types";

export const generalSurgery: SpecialtyContent = {
  key: "general-surgery",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A general surgeon is trained to operate on a wide range of conditions, mainly of the abdomen and its organs, but also the breast, thyroid, skin and soft tissues, and to manage surgical emergencies. In India the usual route is an MBBS followed by a three-year postgraduate degree, MS General Surgery or DNB General Surgery. Many surgical super-specialists, such as GI surgeons, urologists, plastic surgeons and neurosurgeons, first qualify in general surgery.",
    "The everyday work includes hernias, gallstones, appendicitis, piles, fissures and fistulas, breast lumps, thyroid swellings, lumps under the skin, wounds and abscesses. A great deal of this is now done by laparoscopy, or keyhole surgery, which usually means smaller scars and a quicker return home. General surgeons also look after many emergencies, such as acute abdominal pain and injuries, especially in district and smaller hospitals.",
    "Most people see a general surgeon after a physician's assessment or a scan, though many clinics take direct appointments. A surgical opinion is not the same as a decision to operate: small hernias, silent gallstones and many lumps can be watched safely, and a good surgeon explains both options. For planned operations, it is reasonable to ask why surgery is advised now, what the operation involves, and what recovery usually looks like.",
  ],
  conditions: [
    { name: "Hernias", note: "A bulge where tissue pushes through a weak spot in the abdominal wall, commonly in the groin or at the navel." },
    { name: "Gallstones", note: "Stones in the gallbladder that can cause pain after meals, infection or jaundice." },
    { name: "Appendicitis", note: "Inflammation of the appendix, usually needing urgent surgery." },
    { name: "Piles, fissures and fistulas", note: "Common problems around the back passage causing pain, bleeding or discharge." },
    { name: "Breast lumps", note: "Most are not cancer, but every new lump should be assessed." },
    { name: "Thyroid swellings", note: "Goitre and thyroid nodules that may need removal after tests." },
    { name: "Lumps and bumps", note: "Cysts, lipomas and other lumps under the skin, removed if troublesome or uncertain." },
    { name: "Abscesses and infected wounds", note: "Collections of pus that usually need draining, and wounds that are slow to heal." },
    { name: "Varicose veins and diabetic foot", note: "Often treated by general surgeons, especially where vascular surgeons are not available." },
  ],
  tests: [
    { name: "Ultrasound", note: "The first scan for many lumps, hernias, gallstones and abdominal pain." },
    { name: "CT scan of the abdomen", note: "Detailed imaging for abdominal pain, masses and planning operations." },
    { name: "Mammogram and breast ultrasound", note: "Imaging of breast lumps, often followed by a needle biopsy." },
    { name: "Fine-needle aspiration or core biopsy", note: "A small sample taken with a needle to find out what a lump is." },
    { name: "Blood tests before surgery", note: "Checks on blood count, sugar, kidney function and clotting, to make surgery safer." },
    { name: "Proctoscopy", note: "A short look inside the back passage in the clinic, for piles and fissures." },
    { name: "Laparoscopic surgery", note: "Keyhole surgery for gallbladder removal, hernia repair, appendix removal and more." },
    { name: "Open surgery", note: "A traditional incision, still the right choice for some operations and emergencies." },
  ],
  versus: [
    { key: "gi-surgery", text: "General surgeons perform most common abdominal operations. GI surgeons have further super-speciality training and usually take on complex surgery of the oesophagus, stomach, liver, pancreas and bowel cancers." },
    { key: "gastroenterology", text: "For persistent indigestion, abdominal pain or bowel changes without a clear surgical problem, a gastroenterologist investigates first. A general surgeon is the right choice when a problem such as a hernia or gallstones needs an operation." },
    { key: "surgical-oncology", text: "Many general surgeons treat breast and thyroid lumps and some cancers. Surgical oncologists concentrate on cancer surgery and work closely with medical and radiation oncologists." },
  ],
  firstVisit: [
    "Bring ultrasound, CT and biopsy reports, with the images if possible, and any letter from the referring doctor.",
    "Bring a list of medicines, especially blood thinners, diabetes medicines and steroids, which may need changing before an operation.",
    "Describe when you first noticed the lump or pain, whether it is changing, and what makes it worse.",
    "Mention earlier operations, anaesthetic problems and allergies.",
    "Expect an examination of the area concerned; further scans or blood tests may be ordered before any decision on surgery.",
  ],
  urgent: [
    "Severe abdominal pain that is getting worse, especially with vomiting, fever or a hard tender abdomen: call 108 or go to an emergency department",
    "A hernia that becomes painful, tense and cannot be pushed back, especially with vomiting",
    "Vomiting blood or passing large amounts of blood from the back passage",
    "A rapidly spreading red, hot, painful swelling of the skin with fever",
  ],
  faqs: [
    {
      q: "What does a general surgeon do?",
      a: "Operates on a wide range of conditions, mostly in the abdomen, such as hernias, gallstones and appendicitis, and also on breast and thyroid lumps, skin lumps, piles and abscesses, as well as handling surgical emergencies.",
    },
    {
      q: "Does every hernia need surgery?",
      a: "Not always. Small hernias with few symptoms can sometimes be watched. Surgery is usually advised if a hernia is painful, growing, or at risk of getting stuck.",
    },
    {
      q: "Is laparoscopic surgery always better?",
      a: "It often means smaller scars and a quicker recovery, but it is not suitable for every patient or operation. The surgeon will explain which approach is safer for you.",
    },
    {
      q: "What qualifications should a general surgeon have?",
      a: "An MBBS followed by MS General Surgery or DNB General Surgery. Registration can be checked on the NMC's Indian Medical Register or a state medical council register.",
    },
    {
      q: "Do gallstones always need an operation?",
      a: "Gallstones found by chance and causing no symptoms are often left alone. Surgery is usually advised when they cause pain, infection, jaundice or pancreatitis.",
    },
  ],
};
