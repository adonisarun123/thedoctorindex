import type { SpecialtyContent } from "./types";

export const gastroenterology: SpecialtyContent = {
  key: "gastroenterology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A gastroenterologist is a physician who specialises in the digestive system: the oesophagus, stomach, intestines, liver, gallbladder, bile ducts and pancreas. In India the usual route is an MBBS, a postgraduate degree in general medicine, and then a super-speciality degree such as DM Gastroenterology or DrNB Gastroenterology. Those who concentrate on liver disease are often called hepatologists.",
    "Gastroenterologists diagnose and treat with medicines, diet advice and endoscopy, which means looking inside the gut with a thin flexible camera. Many procedures that once needed an operation, such as removing polyps, stopping some kinds of bleeding, or clearing stones from the bile duct, can now be done through an endoscope. When a condition needs an operation, the gastroenterologist refers to a GI surgeon or general surgeon.",
    "Most digestive complaints, such as occasional acidity or a short bout of loose motions, are handled well by a general physician. A gastroenterologist is worth seeing when symptoms persist despite treatment, when there are warning signs such as bleeding, weight loss or difficulty swallowing, or when liver tests are abnormal. Fatty liver disease and hepatitis are common reasons for referral in India, and many liver conditions can be slowed or managed if found early.",
  ],
  conditions: [
    { name: "Acid reflux (GERD)", note: "Heartburn and acid coming back up, which becomes a concern when it persists or causes difficulty swallowing." },
    { name: "Peptic ulcers and gastritis", note: "Sores or inflammation in the stomach or duodenum, often linked to a bacterial infection or painkillers." },
    { name: "Irritable bowel syndrome", note: "Recurring abdominal pain with changes in bowel habit, without damage to the bowel." },
    { name: "Inflammatory bowel disease", note: "Crohn's disease and ulcerative colitis, long-term inflammation of the gut causing diarrhoea, pain and bleeding." },
    { name: "Fatty liver disease", note: "Fat build-up in the liver, often linked to weight, diabetes or alcohol, which can progress to scarring." },
    { name: "Viral hepatitis", note: "Liver inflammation from hepatitis A, B, C or E, some forms of which are long-term and treatable." },
    { name: "Cirrhosis", note: "Advanced scarring of the liver, needing monitoring for complications." },
    { name: "Pancreatitis", note: "Inflammation of the pancreas, often due to gallstones or alcohol, which can be sudden or long-term." },
    { name: "Gastrointestinal bleeding", note: "Bleeding from anywhere in the gut, seen as vomiting blood, black stools or blood in the stool." },
  ],
  tests: [
    { name: "Upper GI endoscopy", note: "A camera passed through the mouth to examine the oesophagus, stomach and duodenum, and take small samples if needed." },
    { name: "Colonoscopy", note: "A camera passed through the back passage to examine the large bowel; polyps can often be removed at the same time." },
    { name: "Liver function tests", note: "Blood tests showing how the liver is working and whether it is inflamed." },
    { name: "Ultrasound of the abdomen", note: "A painless scan of the liver, gallbladder, pancreas and kidneys." },
    { name: "FibroScan (liver elastography)", note: "An ultrasound-based test that measures liver stiffness, a sign of scarring." },
    { name: "Stool tests", note: "Check for infection, hidden blood or inflammation in the bowel." },
    { name: "Hepatitis blood tests", note: "Identify viral hepatitis and guide treatment." },
    { name: "ERCP", note: "An endoscopic procedure to reach the bile and pancreatic ducts, used to remove stones or place stents." },
    { name: "Endoscopic ultrasound (EUS)", note: "An endoscope with an ultrasound probe, giving close views of the pancreas and nearby organs." },
  ],
  versus: [
    { key: "gi-surgery", text: "A gastroenterologist diagnoses and treats digestive and liver disease with medicines and endoscopy. A GI surgeon operates, for example to remove part of the bowel, the gallbladder or a tumour. Usually the gastroenterologist investigates first." },
    { key: "general-practice", text: "A general physician can manage most short-lived acidity, indigestion and loose motions. See a gastroenterologist when symptoms persist, keep coming back, or come with warning signs." },
  ],
  firstVisit: [
    "Bring earlier endoscopy, colonoscopy, ultrasound and blood test reports, with dates, and a list of all medicines including antacids and painkillers.",
    "Note what the symptoms are, when they happen in relation to meals, and any change in weight or bowel habit.",
    "Be honest about alcohol intake, as it matters for liver and pancreatic disease.",
    "Mention any family history of bowel cancer, liver disease or inflammatory bowel disease.",
    "If an endoscopy is planned, you will be asked not to eat for several hours before it; colonoscopy needs bowel preparation the day before.",
  ],
  urgent: [
    "Vomiting blood, or material that looks like coffee grounds: call 108",
    "Black, tarry stools or a large amount of blood from the back passage, especially with dizziness or fainting",
    "Severe abdominal pain that does not settle, particularly with a rigid abdomen or persistent vomiting",
    "Yellowing of the eyes or skin with confusion, drowsiness or high fever",
  ],
  faqs: [
    {
      q: "What does a gastroenterologist treat?",
      a: "Conditions of the digestive system and liver, including reflux, ulcers, irritable bowel syndrome, inflammatory bowel disease, hepatitis, fatty liver, cirrhosis and pancreatitis.",
    },
    {
      q: "Is endoscopy painful?",
      a: "Most people find it uncomfortable rather than painful. A throat spray or sedation is usually offered, and the test itself takes a short time.",
    },
    {
      q: "What is the difference between a gastroenterologist and a GI surgeon?",
      a: "A gastroenterologist treats with medicines and endoscopic procedures. A GI surgeon operates on the digestive organs. They often work together on the same patient.",
    },
    {
      q: "What qualifications should a gastroenterologist have?",
      a: "An MBBS, a postgraduate degree usually in general medicine, and then a super-speciality degree such as DM Gastroenterology or DrNB Gastroenterology. Registration can be checked with the NMC or a state medical council.",
    },
    {
      q: "Is fatty liver serious?",
      a: "It is common and often silent, but in some people it progresses to scarring of the liver. A gastroenterologist can assess how much damage there is and advise on weight, diet, exercise and related conditions such as diabetes.",
    },
  ],
};
