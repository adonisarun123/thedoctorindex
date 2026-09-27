import type { SpecialtyContent } from "./types";

export const giSurgery: SpecialtyContent = {
  key: "gi-surgery",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A gastrointestinal (GI) surgeon, also called a surgical gastroenterologist, operates on the digestive tract and the organs that serve it: the oesophagus, stomach, small and large intestine, rectum, liver, gallbladder, bile ducts and pancreas. In India the usual route is an MBBS, MS General Surgery or DNB, and then a super-speciality degree such as MCh Surgical Gastroenterology or DrNB in the subject.",
    "GI surgeons take on the more complex digestive operations: cancers of the stomach, bowel, liver and pancreas, complicated gallstone and bile duct disease, surgery for inflammatory bowel disease, and weight-loss (bariatric) surgery. Much of this is now done by laparoscopy, or keyhole surgery, and some centres use robotic assistance. Some GI surgeons concentrate on the liver and pancreas, on colorectal surgery, or on liver transplantation.",
    "Most patients come on referral from a gastroenterologist, general surgeon or oncologist, after tests such as endoscopy or a CT scan have found the problem. The line with general surgery is not sharp: many general surgeons perform gallbladder and hernia surgery routinely, and a GI surgeon is usually sought for the harder cases. For cancer surgery, decisions are often made in a team with oncologists, and treatment may include chemotherapy or radiotherapy as well as the operation.",
  ],
  conditions: [
    { name: "Gallstones and their complications", note: "Stones in the gallbladder or bile duct causing pain, infection, jaundice or pancreatitis." },
    { name: "Stomach and oesophageal cancer", note: "Tumours of the upper digestive tract, often treated with surgery alongside chemotherapy." },
    { name: "Colorectal cancer", note: "Cancer of the colon or rectum, usually treated by removing the affected section of bowel." },
    { name: "Liver tumours and cysts", note: "Growths in the liver, some of which can be removed by operating on part of the liver." },
    { name: "Pancreatic tumours and cysts", note: "Growths in the pancreas that may need major surgery after careful assessment." },
    { name: "Chronic pancreatitis", note: "Long-term inflammation of the pancreas with pain, sometimes helped by surgery or drainage." },
    { name: "Inflammatory bowel disease needing surgery", note: "Crohn's disease or ulcerative colitis that has not responded to medicines or has caused complications." },
    { name: "Achalasia and hiatus hernia", note: "Swallowing problems and reflux caused by the junction of the oesophagus and stomach." },
    { name: "Severe obesity", note: "Assessment for bariatric surgery when other approaches have not worked and weight affects health." },
  ],
  tests: [
    { name: "CT scan of the abdomen", note: "Detailed imaging used to diagnose and plan most GI operations." },
    { name: "MRI and MRCP", note: "MRI scans that show the liver, pancreas and bile ducts in detail." },
    { name: "Endoscopy and colonoscopy", note: "Camera examinations of the gut, usually done by a gastroenterologist before surgery." },
    { name: "Endoscopic ultrasound (EUS)", note: "Close-up ultrasound from inside the gut, used to assess tumours of the pancreas and oesophagus." },
    { name: "Tumour markers and blood tests", note: "Blood tests that support diagnosis and check fitness for surgery." },
    { name: "Laparoscopic surgery", note: "Keyhole surgery through small cuts using a camera, with a quicker recovery for many operations." },
    { name: "Open surgery", note: "A larger incision, still needed for some complex or emergency operations." },
    { name: "Bariatric surgery", note: "Operations such as sleeve gastrectomy or gastric bypass that reduce stomach size or change digestion." },
  ],
  versus: [
    { key: "gastroenterology", text: "A gastroenterologist investigates and treats digestive disease with medicines and endoscopy. A GI surgeon operates. Usually the gastroenterologist sees you first and refers when surgery is the right answer." },
    { key: "general-surgery", text: "General surgeons perform many common abdominal operations, including gallbladder removal, appendix and hernia surgery. GI surgeons have further super-speciality training and usually handle complex cancers and liver, pancreas and oesophageal surgery." },
    { key: "surgical-oncology", text: "Surgical oncologists operate on cancers throughout the body. Digestive cancers may be treated by either a surgical oncologist or a GI surgeon, depending on the hospital." },
  ],
  firstVisit: [
    "Bring all scan images and reports, endoscopy and biopsy reports, and any letters from the referring doctor.",
    "Bring a list of your medicines, especially blood thinners and diabetes medicines, which may need adjusting before surgery.",
    "Mention earlier abdominal operations, as they affect how surgery is planned.",
    "Ask what the operation involves, whether it can be done by keyhole surgery, the main risks, and how long recovery usually takes.",
    "For cancer, expect the plan to be discussed with oncologists, and more tests to be ordered before a date is fixed.",
  ],
  urgent: [
    "Severe abdominal pain that does not settle, especially with a hard, tender abdomen: call 108",
    "Vomiting blood, or passing black or bloody stools with dizziness",
    "Repeated vomiting with a swollen abdomen and inability to pass wind or stool",
    "Jaundice with fever and shivering, which can mean a blocked, infected bile duct",
  ],
  faqs: [
    {
      q: "What is the difference between a GI surgeon and a general surgeon?",
      a: "Both operate on the abdomen. A GI surgeon has additional super-speciality training and usually handles more complex digestive operations, such as cancer surgery of the pancreas, liver or oesophagus.",
    },
    {
      q: "Can gallbladder surgery be done by keyhole surgery?",
      a: "Most gallbladder operations are done laparoscopically. Sometimes the surgeon needs to change to an open operation during surgery for safety.",
    },
    {
      q: "What qualifications should a GI surgeon have?",
      a: "An MBBS, MS General Surgery or DNB, and then a super-speciality degree such as MCh Surgical Gastroenterology or DrNB. Registration can be checked with the NMC or a state medical council.",
    },
    {
      q: "Who is suitable for bariatric surgery?",
      a: "It is usually considered for people with severe obesity, particularly with related conditions such as diabetes, when diet and lifestyle measures have not worked. Assessment involves several specialists and long-term follow-up afterwards.",
    },
    {
      q: "Should I get a second opinion before major abdominal surgery?",
      a: "For planned surgery, a second opinion is reasonable and common. Bring the scan images and biopsy reports so the second surgeon can review them.",
    },
  ],
};
