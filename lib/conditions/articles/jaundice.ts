import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "jaundice",
  title: "Jaundice: symptoms, causes, tests and which doctor to see",
  standfirst: "Why skin and eyes turn yellow, common causes in adults and newborns in India, the tests that find the cause, and the warning signs that need urgent care.",
  targetQuery: "jaundice symptoms causes and treatment",
  department: "gastroenterology",
  specialty: "gastroenterology",
  alsoSee: ["paediatrics", "internal-medicine", "general-practice"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Yellow eyes", "Yellow skin", "Dark urine", "Pale stools", "Itching", "Loss of appetite"],
  tests: ["Liver function tests", "Serum bilirubin", "Ultrasound abdomen", "Hepatitis tests"],
  treatments: ["Treating the cause", "Phototherapy", "Rest and fluids"],
  body: [
    { k: "h2", text: "What jaundice is" },
    {
      k: "p",
      text: "Jaundice is the yellow colour of the skin and the whites of the eyes caused by too much bilirubin in the blood. Bilirubin is a yellow pigment made when old red blood cells are broken down. Normally the liver takes it up, processes it and passes it into bile, which flows through the bile ducts into the gut and leaves the body in the stool. If any step in this chain is overloaded or blocked, bilirubin builds up and the body turns yellow.",
    },
    {
      k: "p",
      text: "Jaundice is therefore a sign, not a disease in itself. In India it is very often called 'jaundice' as if it were one illness, usually meaning viral hepatitis, but the yellow colour can come from many different problems — some mild and temporary, others serious. Finding the cause is what decides the treatment.",
    },
    { k: "h3", text: "Three broad groups of causes" },
    {
      k: "ul",
      items: [
        "**Before the liver** — red blood cells breaking down too fast, as in [malaria](/conditions/malaria), [thalassaemia](/conditions/thalassemia), sickle cell disease and G6PD deficiency",
        "**In the liver** — liver cells are inflamed or damaged and cannot process bilirubin, as in viral hepatitis, alcohol-related liver disease, fatty liver disease, [cirrhosis](/conditions/cirrhosis) and reactions to medicines",
        "**After the liver** — bile cannot drain because a bile duct is blocked, most often by [gallstones](/conditions/gallstones), and less often by a narrowing, [pancreatitis](/conditions/pancreatitis) or a tumour of the pancreas or bile ducts",
      ],
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "ul",
      items: [
        "Yellow eyes — usually the first place it shows, best seen in daylight",
        "Yellow skin, which can be harder to notice on darker skin; look at the palms, tongue and inside the lower eyelid",
        "Dark urine, the colour of strong tea",
        "Pale stools that look clay-coloured, especially when a bile duct is blocked",
        "Itching all over the body",
        "Loss of appetite, nausea, tiredness, fever and pain in the upper right side of the abdomen, depending on the cause",
      ],
    },
    {
      k: "p",
      text: "The other symptoms give clues. Fever, body ache and nausea a few days before the yellow colour suggest viral hepatitis. Severe pain under the right ribs with fever and shivering points towards a stone blocking the bile duct. Painless, slowly deepening jaundice with weight loss and itching, especially in an older adult, needs investigation quickly.",
    },

    { k: "h2", text: "Common causes in India" },
    {
      k: "p",
      text: "[Hepatitis A](/conditions/hepatitis-a) and hepatitis E viruses spread through contaminated water and food, and outbreaks are more common during the monsoon when drinking water can get contaminated. Most people recover fully, but hepatitis E can be severe in pregnancy, so a pregnant woman with jaundice should be seen promptly. [Hepatitis B](/conditions/hepatitis-b) and [hepatitis C](/conditions/hepatitis-c) spread through blood and body fluids and can cause long-term liver damage.",
    },
    {
      k: "p",
      text: "Other common causes are alcohol, fatty liver disease, gallstones, malaria and some medicines — including certain tuberculosis medicines, which is why people on TB treatment are monitored. Herbal and 'liver tonic' preparations can also damage the liver. Gilbert's syndrome, an inherited and harmless difference in how the liver handles bilirubin, causes mild yellowing of the eyes during fasting, illness or stress and needs no treatment.",
    },
    { k: "h3", text: "Jaundice in newborns" },
    {
      k: "p",
      text: "Many newborn babies develop mild jaundice in the first week, because their livers are still maturing. It usually appears after the first day and fades on its own. But very high bilirubin in a newborn can damage the brain (kernicterus), so jaundice in a baby should always be checked by a doctor or nurse. Jaundice in the first day of life, jaundice that spreads to the legs and feet, or jaundice in a baby who is sleepy or feeding poorly needs urgent assessment.",
    },

    { k: "h2", text: "How the cause is found" },
    {
      k: "p",
      text: "The doctor will ask about recent fever, travel, drinking water, alcohol, medicines and herbal remedies, blood transfusions, injections, tattoos and family history, and examine the abdomen. Tests usually include:",
    },
    {
      k: "ul",
      items: [
        "**Serum bilirubin** — confirms jaundice and shows which form of bilirubin is raised, pointing to a cause before, in or after the liver",
        "**Liver function tests** — liver enzymes, albumin and clotting show how inflamed the liver is and how well it is working",
        "**Hepatitis tests** — blood tests for hepatitis A, B, C and E",
        "A complete blood count, and tests for malaria or red cell breakdown when relevant",
        "**Ultrasound abdomen** — looks for gallstones, a dilated bile duct, fatty liver, cirrhosis or a mass",
        "In some cases, a CT or MRI scan (MRCP) of the bile ducts, or ERCP — an endoscopic test that can also remove stones or place a stent",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "There is no single treatment for jaundice; the answer is **treating the cause**. The yellow colour fades as the underlying problem improves.",
    },
    {
      k: "ul",
      items: [
        "**Viral hepatitis A or E** — usually settles on its own over weeks. Care involves **rest and fluids**, small, nourishing meals, avoiding alcohol and any medicine not prescribed, and blood tests to check recovery",
        "**Hepatitis B or C** — may need long-term antiviral treatment under a specialist",
        "**Gallstones or a blocked bile duct** — stones may be removed by ERCP and the gallbladder taken out by surgery; tumours are treated by specialist teams",
        "**Malaria and blood disorders** — treated by treating the infection or the blood condition",
        "**Medicine or alcohol-related damage** — the doctor will stop or change the responsible medicine; stopping alcohol completely is essential",
        "**Newborn jaundice** — most needs only monitoring and good feeding; **phototherapy** (treatment under special blue light) lowers bilirubin when levels are high",
      ],
    },
    {
      k: "p",
      text: "There is no need to follow a very restricted diet or avoid all oil, turmeric or salt unless your doctor advises it; the body needs adequate nutrition to recover. Avoid unproven 'jaundice cures', local herbal preparations and amulets that delay proper tests, and never take paracetamol or other medicines in large amounts without asking your doctor.",
    },

    { k: "h2", text: "Prevention" },
    {
      k: "ul",
      items: [
        "Drink boiled or safely filtered water, especially during the monsoon, and avoid uncovered street food and cut fruit",
        "Wash hands with soap after using the toilet and before eating or cooking",
        "Make sure children receive the hepatitis B vaccine under the national immunisation schedule, and ask your doctor whether you or your family need hepatitis A or B vaccination",
        "Do not share razors, toothbrushes or needles; insist on sterile equipment for injections, tattoos and piercings",
        "Limit alcohol, keep a healthy weight, and take any medicine only as prescribed",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if jaundice comes with:" },
    {
      k: "ul",
      items: [
        "Confusion, drowsiness, unusual behaviour or difficulty waking",
        "Vomiting blood, or black, tarry stools",
        "Severe abdominal pain, especially with high fever and shivering",
        "Swelling of the abdomen with breathlessness, or bleeding and bruising easily",
        "Jaundice in pregnancy with vomiting, abdominal pain or bleeding",
        "A newborn who is yellow in the first day, very yellow, very sleepy, not feeding, or has a high-pitched cry or stiff body",
      ],
    },
    {
      k: "p",
      text: "Any new yellowing of the eyes or skin should be seen by a doctor within a day or two, even if you otherwise feel well.",
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "A [general physician](/specialties/general-practice) or [internal medicine doctor](/specialties/internal-medicine) can begin tests and manage straightforward hepatitis A or E. A [gastroenterologist](/specialties/gastroenterology), including liver specialists (hepatologists), handles severe or prolonged jaundice, hepatitis B and C, cirrhosis and bile duct problems, and performs ERCP. Babies are seen by a [paediatrician](/specialties/paediatrics).",
    },
    {
      k: "p",
      text: "You can [find gastroenterologists in Bengaluru](/doctors/karnataka/bengaluru/gastroenterologists) or [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Is jaundice contagious?",
      a: "Jaundice itself is not contagious, but some of its causes are. Hepatitis A and E spread through contaminated food and water, and hepatitis B and C through blood and body fluids. Jaundice from gallstones, blood disorders or medicines cannot be passed on.",
    },
    {
      q: "What should I eat when I have jaundice?",
      a: "Eat light, balanced, home-cooked meals in small portions, with plenty of safe fluids. A very restricted diet is usually unnecessary and can slow recovery. Avoid alcohol completely. If you have liver disease, your doctor may give specific advice about salt or protein.",
    },
    {
      q: "How long does jaundice take to go away?",
      a: "It depends on the cause. Jaundice from hepatitis A or E usually fades over a few weeks, while jaundice from a blocked bile duct improves once the blockage is cleared. Newborn jaundice usually clears within the first couple of weeks. Your doctor will track recovery with blood tests.",
    },
    {
      q: "Is newborn jaundice dangerous?",
      a: "Mild jaundice in the first week is common and usually harmless. Very high bilirubin can damage a baby's brain, so every yellow baby should be checked. Jaundice in the first day of life, or in a baby who is sleepy or not feeding, needs urgent medical care.",
    },
  ],
  sources: [
    { label: "MedlinePlus, National Library of Medicine — Jaundice", url: "https://medlineplus.gov/jaundice.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
