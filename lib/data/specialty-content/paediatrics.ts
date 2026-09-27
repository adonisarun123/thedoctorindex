import type { SpecialtyContent } from "./types";

export const paediatrics: SpecialtyContent = {
  key: "paediatrics",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A paediatrician is a doctor who specialises in the health of infants, children and adolescents. In India the usual training is an MBBS followed by an MD in paediatrics, a DNB, or the diploma DCH. Paediatricians look after the whole child: illness, growth, development, nutrition, vaccination and behaviour, from the newborn period into the teenage years.",
    "Children are not small adults. Their illnesses, medicine doses and warning signs differ, and a child can become unwell quickly. A paediatrician is trained to judge how sick a child is, often from small signs, and to explain things to both parents and child. Some go on to super-specialise in newborn care (neonatology), or in children's heart, kidney, brain, lung or blood conditions.",
    "Most families benefit from one paediatrician they return to, ideally close to home. That doctor keeps track of vaccinations and growth over years and knows what is normal for your child. The vaccination card and growth record are worth bringing to every visit. When a child needs an operation, a paediatric surgeon usually does it, working with the paediatrician.",
  ],
  conditions: [
    { name: "Fever and common infections", note: "Colds, coughs, ear and throat infections, and seasonal fevers such as dengue and malaria." },
    { name: "Diarrhoea and vomiting", note: "Usually viral; the main risk is dehydration, which needs close watching in young children." },
    { name: "Chest infections and wheezing", note: "Bronchiolitis in infants, pneumonia, and asthma in older children." },
    { name: "Growth and weight concerns", note: "Children who are not gaining weight or height as expected, or who are gaining too fast." },
    { name: "Developmental delay", note: "Late walking, talking or other milestones; early assessment helps." },
    { name: "Newborn problems", note: "Jaundice, feeding difficulties and weight gain in the first weeks." },
    { name: "Anaemia and nutrition", note: "Iron deficiency and other nutritional problems common in Indian children." },
    { name: "Skin rashes and allergies", note: "Eczema, hives and food allergies." },
    { name: "Behaviour and adolescent health", note: "Sleep, attention, school difficulties and the changes of puberty." },
  ],
  tests: [
    { name: "Growth charts", note: "Height, weight and head size plotted over time, which shows far more than a single measurement." },
    { name: "Developmental screening", note: "Checks of movement, speech, play and social skills against expected milestones." },
    { name: "Vaccination review", note: "Checking the vaccination card and planning due and missed doses." },
    { name: "Blood tests", note: "Blood count, and tests for infections, anaemia or other problems when needed." },
    { name: "Urine tests", note: "An important check for infection in young children with an unexplained fever." },
    { name: "Chest X-ray and ultrasound", note: "Used when a chest infection or an abdominal problem needs a closer look." },
    { name: "Newborn screening", note: "Tests after birth for certain conditions, including hearing checks, that are easier to treat when found early." },
  ],
  versus: [
    { key: "general-practice", text: "A family doctor can treat many simple illnesses in children. A paediatrician is trained specifically in children, and is the better choice for newborns, infants, vaccinations, growth concerns and a child who seems very unwell." },
    { key: "paediatric-surgery", text: "Paediatricians diagnose and treat children with medicines and care. When a child needs an operation, such as for a hernia, an undescended testis or appendicitis, a paediatric surgeon does it." },
    { key: "clinical-psychology", text: "For learning, behaviour or emotional difficulties, a paediatrician often makes the first assessment. A clinical psychologist can carry out detailed testing and provide therapy." },
  ],
  firstVisit: [
    "Bring the vaccination card, the growth record, and any earlier prescriptions or reports, including the birth or discharge summary for a young baby.",
    "Note the child's temperature readings, how much they are drinking, how many wet nappies or visits to the toilet, and any change in activity.",
    "List any medicines already given, with the amounts and times.",
    "Bring a favourite toy or snack, and let an older child answer some questions themselves. Adolescents may appreciate part of the visit on their own.",
    "Expect the child to be weighed and measured and examined. Tell the doctor what worries you most, even if it seems small.",
  ],
  urgent: [
    "Difficulty breathing, fast breathing, or the skin between the ribs pulling in with each breath",
    "A child who is unusually drowsy, floppy, difficult to wake, or has a fit",
    "Signs of dehydration: very few wet nappies, no tears, a dry mouth, or sunken eyes",
    "A rash that does not fade when pressed, or a swollen, painful groin or scrotum: call 108 or go to the nearest emergency department",
  ],
  faqs: [
    {
      q: "Up to what age does a paediatrician see children?",
      a: "Paediatricians usually see children from birth into the teenage years. Many continue to see adolescents until they are ready to move to an adult doctor.",
    },
    {
      q: "Should every fever be seen by a doctor?",
      a: "Not every fever needs a visit, but a doctor should see a young baby with any fever, a fever that lasts more than a couple of days, or a child who seems very unwell, drowsy or is not drinking.",
    },
    {
      q: "What if my child has missed some vaccinations?",
      a: "Missed vaccinations can usually be caught up. Take the vaccination card to your paediatrician, who will plan the remaining doses.",
    },
    {
      q: "What qualifications should a paediatrician have?",
      a: "An MBBS and a postgraduate qualification in paediatrics, such as MD, DNB or the diploma DCH. Registration should be on the NMC's register or a state medical council register.",
    },
    {
      q: "My child is behind with speech. When should I worry?",
      a: "Children develop at different speeds, but if your child is clearly behind others of the same age or has lost skills they had, see a paediatrician. Early assessment and support make a difference.",
    },
  ],
};
