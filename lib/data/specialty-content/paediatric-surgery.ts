import type { SpecialtyContent } from "./types";

export const paediatricSurgery: SpecialtyContent = {
  key: "paediatric-surgery",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A paediatric surgeon operates on children, from newborn babies to adolescents. In India the training is long: an MBBS, a postgraduate degree in general surgery (MS or DNB), and then a super-speciality degree in paediatric surgery, the MCh or DrNB. Paediatric surgeons deal with problems of the abdomen, chest, bladder and kidneys, and birth defects, among others. Some children's operations are also done by other surgeons with a children's interest, such as paediatric orthopaedic surgeons or neurosurgeons.",
    "Children are not small adults. A newborn's body handles fluids, temperature, pain and anaesthesia differently from an adult's, and many conditions seen in children, especially birth defects, rarely appear in adults. Paediatric surgeons work closely with paediatricians, children's anaesthetists and neonatal teams, and many operations in children can be done through small cuts or as day-care procedures.",
    "Families usually reach a paediatric surgeon through a paediatrician, sometimes before birth, when a scan in pregnancy has found a problem that will need surgery. Some conditions are urgent, while others are best operated on at a particular age. The surgeon will explain the timing, what the operation involves, and what recovery at home will look like.",
  ],
  conditions: [
    { name: "Inguinal hernia and hydrocele", note: "A bulge or swelling in the groin or scrotum; common in infants, and hernias usually need an operation." },
    { name: "Undescended testis", note: "A testis that has not come down into the scrotum; usually corrected in early childhood." },
    { name: "Appendicitis", note: "Inflammation of the appendix causing abdominal pain; usually treated with surgery." },
    { name: "Birth defects of the gut", note: "Blockages or malformations of the oesophagus, intestine or anus found at or soon after birth." },
    { name: "Hypospadias", note: "The opening of the urinary tube is not at the tip of the penis; corrected with surgery." },
    { name: "Kidney and bladder problems", note: "Blockages of urine flow and urine reflux, often found on scans in pregnancy or after infections." },
    { name: "Childhood tumours", note: "Masses in the abdomen, chest or elsewhere, treated with a children's cancer team." },
    { name: "Swallowed objects and injuries", note: "Button batteries, coins and other objects, and injuries needing surgical care." },
    { name: "Intussusception and bowel obstruction", note: "The bowel folds into itself or is blocked; causes vomiting and pain, and is an emergency." },
  ],
  tests: [
    { name: "Ultrasound", note: "The first scan for most children's abdominal, groin and kidney problems; no radiation." },
    { name: "X-rays and contrast studies", note: "Pictures of the gut or urinary tract, sometimes with a liquid that shows up on X-ray." },
    { name: "CT or MRI scans", note: "Used for tumours and complex problems; young children may need sedation to lie still." },
    { name: "Blood tests", note: "Checks for infection, blood count and fitness for anaesthesia." },
    { name: "Laparoscopic surgery", note: "Keyhole surgery through small cuts, often with quicker recovery." },
    { name: "Hernia repair and orchidopexy", note: "Common day-care operations to repair a hernia or bring down an undescended testis." },
    { name: "Endoscopy and cystoscopy", note: "A thin camera to look inside the gut or bladder, and to remove swallowed objects." },
  ],
  versus: [
    { key: "paediatrics", text: "A paediatrician treats children's illnesses with medicines and care. When a child needs an operation, a paediatric surgeon takes over, usually still working with the paediatrician." },
    { key: "general-surgery", text: "General surgeons operate mainly on adults. Paediatric surgeons have further training in children's surgery, and are preferred especially for newborns, infants and birth defects." },
    { key: "urology", text: "Many children's urinary problems, such as hypospadias and urine reflux, are treated by paediatric surgeons; some centres have paediatric urologists for this work." },
  ],
  firstVisit: [
    "Bring all scans and reports, including any pregnancy scans that showed a problem, and the birth or discharge summary for a baby.",
    "Bring the vaccination card and a list of any medicines and allergies.",
    "Note when a swelling appears, whether it comes and goes, and whether it is painful. A photo of a swelling that appears only at times can be helpful.",
    "Ask what the operation involves, when it should be done, how long the child will be in hospital, and how to care for them at home afterwards.",
    "Before any operation, you will be told how long the child must go without food and drink. Follow this exactly; it is for your child's safety under anaesthesia.",
  ],
  urgent: [
    "A swollen, painful groin or scrotum, or a hernia that becomes hard, painful or will not go back",
    "Green or bloody vomiting, a swollen tummy, or blood in the stool of a baby or young child",
    "Severe abdominal pain, or a child who is unusually drowsy, floppy or has difficulty breathing",
    "A swallowed button battery or magnet, or signs of dehydration such as no wet nappies: go to an emergency department or call 108",
  ],
  faqs: [
    {
      q: "Why should my child see a paediatric surgeon rather than a general surgeon?",
      a: "Paediatric surgeons have specific training in children's anatomy, anaesthesia, fluids and recovery, and in conditions seen mainly in children. For newborns and infants in particular, this experience matters.",
    },
    {
      q: "Is surgery safe for very young babies?",
      a: "Operations on newborns and infants are routinely done in specialist centres with children's anaesthetists and neonatal teams. Your surgeon will explain the risks and benefits for your child's particular condition.",
    },
    {
      q: "Does a hernia in a child always need an operation?",
      a: "An inguinal hernia in a child usually needs repair, because of the risk that the bowel gets trapped. A hydrocele in an infant may settle on its own and is often watched first.",
    },
    {
      q: "What qualifications should a paediatric surgeon have?",
      a: "An MBBS, a postgraduate degree in general surgery, and a super-speciality degree in paediatric surgery such as MCh or DrNB. Registration should be on the NMC's register or a state medical council register.",
    },
    {
      q: "Will my child need to stay in hospital?",
      a: "Many common operations such as hernia repair are done as day-care procedures. Larger operations and those in newborns usually need a hospital stay; the surgeon will tell you what to expect.",
    },
  ],
};
