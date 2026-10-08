import type { ConditionArticle } from "@/lib/conditions/article";

export const article: ConditionArticle = {
  slug: "congenital-heart-defects",
  title: "Congenital heart defects: symptoms, causes, treatment and which doctor to see",
  metaTitle: "Congenital heart defects: signs, tests and treatment",
  standfirst: "What congenital heart defects are, the signs in babies and older children, how they are found, the treatments available, and why follow-up lasts for life.",
  targetQuery: "congenital heart defects symptoms and treatment",
  department: "cardiology",
  specialty: "cardiology",
  alsoSee: ["paediatrics", "cardiothoracic-surgery"],
  author: "The Doctor Index",
  writtenOn: "08 Oct 2026",
  updatedOn: "08 Oct 2026",
  reviewer: null,
  reviewedOn: "",
  symptoms: ["Bluish skin", "Fast breathing", "Poor feeding", "Heart murmur", "Tiring easily"],
  tests: ["Pulse oximetry", "Echocardiogram", "ECG", "Chest X-ray", "Cardiac catheterisation"],
  treatments: ["Regular monitoring", "Medicines", "Catheter procedures", "Heart surgery"],
  body: [
    { k: "h2", text: "What congenital heart defects are" },
    {
      k: "p",
      text: "A congenital heart defect is a problem with the structure of the heart that is present from birth. It happens because the heart did not form in the usual way while the baby was developing in the womb. Congenital heart defects are the most common kind of birth defect.",
    },
    {
      k: "p",
      text: "There are many different types, and they range from small problems that never need treatment to complex conditions that need surgery soon after birth. The main groups are:",
    },
    {
      k: "ul",
      items: [
        "**Holes in the heart** (septal defects) — an opening in the wall between the left and right sides of the heart, such as an atrial septal defect (ASD) or ventricular septal defect (VSD)",
        "**Valve problems** — a heart valve that is narrowed, leaky or formed differently, such as pulmonary or aortic valve stenosis",
        "**Problems with the large blood vessels** — for example a blood vessel that should close after birth staying open (patent ductus arteriosus, PDA), or a narrowing of the aorta (coarctation)",
        "**Complex defects** that combine several of these, such as tetralogy of Fallot",
      ],
    },
    {
      k: "p",
      text: "These defects can make blood flow too slowly, go the wrong way, or be blocked. Some allow blood that is low in oxygen to reach the body, which is why some babies look blue. The most serious ones, called critical congenital heart disease, usually need surgery or a procedure in the first year of life. Milder defects may not be noticed until later childhood, or even adulthood.",
    },

    { k: "h2", text: "Symptoms" },
    {
      k: "p",
      text: "Many small defects cause no symptoms and are found only because a doctor hears a heart murmur — an extra sound made by blood flowing through the heart in an unusual way. Not every murmur means a heart defect; many children have harmless murmurs. When a defect does cause symptoms, they depend on the type and the child's age.",
    },
    { k: "h3", text: "In newborns and babies" },
    {
      k: "ul",
      items: [
        "Bluish skin, lips or nails (cyanosis); on darker skin, look at the lips, tongue and nail beds",
        "Fast breathing or grunting, even at rest",
        "Poor feeding — tiring, sweating or getting breathless during feeds",
        "Slow weight gain",
        "Pale, cold or clammy skin, or unusual sleepiness",
      ],
    },
    { k: "h3", text: "In older children and adults" },
    {
      k: "ul",
      items: [
        "Tiring easily or getting breathless during play, sport or exercise",
        "Fainting or dizziness during exercise",
        "Palpitations, or an irregular heartbeat ([arrhythmia](/conditions/arrhythmia))",
        "Swelling of the legs, feet or abdomen",
      ],
    },

    { k: "h2", text: "Causes and risk factors" },
    {
      k: "p",
      text: "In most cases no single cause is found, and nothing the parents did caused the defect. Changes in a baby's genes play a part in some cases, and heart defects are more common in children with certain genetic conditions, such as Down syndrome. Things known to raise the chance include:",
    },
    {
      k: "ul",
      items: [
        "Diabetes in the mother that is present before pregnancy or develops in the first three months; good blood sugar control before and during early pregnancy lowers the risk",
        "Rubella (German measles) infection during pregnancy",
        "Smoking or exposure to second-hand smoke during pregnancy",
        "Certain medicines during pregnancy, including some blood pressure medicines (ACE inhibitors) and retinoid medicines used for acne",
        "Phenylketonuria (PKU) in the mother that is not controlled with diet",
        "A parent or brother or sister with a congenital heart defect",
      ],
    },
    {
      k: "p",
      text: "If you are planning a pregnancy and take regular medicines, have diabetes, or have a family history of heart defects, talk to your doctor beforehand.",
    },

    { k: "h2", text: "How it is diagnosed" },
    {
      k: "p",
      text: "Some defects are seen before birth on a routine pregnancy ultrasound, and a specialised scan of the baby's heart (fetal echocardiography) may then be arranged. After birth, a doctor may notice a murmur, blue colouring or breathing problems. Tests include:",
    },
    {
      k: "ul",
      items: [
        "**Pulse oximetry** — a painless sensor on the hand and foot measures oxygen in the blood; some hospitals use it to screen newborns before discharge",
        "**Echocardiogram** — an ultrasound of the heart, the main test for confirming the type of defect",
        "**ECG** — records the heart's electrical activity and rhythm",
        "**Chest X-ray** — shows the size and shape of the heart and fluid in the lungs",
        "**Cardiac catheterisation** — a thin tube passed through a blood vessel into the heart to measure pressures and take pictures; sometimes used to treat the defect at the same time",
        "MRI or CT scans of the heart in some older children and adults",
      ],
    },

    { k: "h2", text: "Treatment" },
    {
      k: "p",
      text: "Treatment depends on the type and severity of the defect. Your child's doctors will explain which option fits and why.",
    },
    {
      k: "ul",
      items: [
        "**Regular monitoring** — many small holes and mild valve problems are simply watched; some small holes close on their own in the first years of life",
        "**Medicines** — to help the heart pump, remove extra fluid, or control the heart rhythm; they manage symptoms but do not repair the defect",
        "**Catheter procedures** — some holes can be closed with a device, and some narrowed valves or vessels widened with a balloon, through a tube passed from a vein or artery in the groin, without opening the chest",
        "**Heart surgery** — open surgery to close holes, repair or replace valves, or reroute blood flow; complex defects may need several operations at different ages",
        "A heart transplant, rarely, for the most severe conditions",
      ],
    },
    {
      k: "p",
      text: "Babies with heart defects may need extra calories and help with feeding to grow well. A paediatrician and dietitian can help with this.",
    },

    { k: "h2", text: "Living with a congenital heart defect" },
    {
      k: "p",
      text: "Thanks to better surgery and care, many children with heart defects now grow into adulthood. But a repaired heart is not always a normal heart, and problems such as [heart failure](/conditions/heart-failure), rhythm disturbances, [pulmonary hypertension](/conditions/pulmonary-hypertension) or a valve needing further treatment can appear years later. That is why follow-up with a cardiologist should continue for life, including after moving from children's to adult services.",
    },
    {
      k: "ul",
      items: [
        "Keep follow-up appointments and copies of all surgery reports and echo results",
        "Look after teeth and gums and see a dentist regularly; some people with heart defects are at higher risk of a heart infection called endocarditis, and your cardiologist will tell you if you need antibiotics before dental procedures",
        "Ask the cardiologist what sports and activities are safe; most children can be active",
        "Keep vaccinations up to date as per the national immunisation schedule",
        "Women with a congenital heart defect should see their cardiologist before planning pregnancy",
      ],
    },

    { k: "h2", text: "When it is an emergency" },
    { k: "p", text: "Call 112 or 108, or go to the nearest emergency department, if a baby or child:" },
    {
      k: "ul",
      items: [
        "Has blue or grey lips, tongue or skin that is new or getting worse",
        "Is breathing very fast, struggling to breathe, or the skin pulls in between the ribs",
        "Is too breathless or sleepy to feed, is floppy, or is hard to wake",
        "Faints, has chest pain, or collapses",
      ],
    },

    { k: "h2", text: "Which doctor to see" },
    {
      k: "p",
      text: "Babies and children are usually first assessed by a [paediatrician](/specialties/paediatrics), who refers them to a [cardiologist](/specialties/cardiology) with experience in children's hearts (a paediatric cardiologist). If surgery is needed, a [cardiothoracic surgeon](/specialties/cardiothoracic-surgery) carries it out. Adults with a congenital heart defect should be followed by a cardiologist familiar with adult congenital heart disease.",
    },
    {
      k: "p",
      text: "You can [find cardiologists in Bengaluru](/doctors/karnataka/bengaluru/cardiologists), [paediatricians in Bengaluru](/doctors/karnataka/bengaluru/paediatricians) or [cardiothoracic surgeons in Bengaluru](/doctors/karnataka/bengaluru/cardiothoracic-surgeons) on The Doctor Index, each with a registration you can check.",
    },
  ],
  faqs: [
    {
      q: "Can a hole in the heart close on its own?",
      a: "Some small holes, especially certain ventricular septal defects and small openings between the upper chambers, can close on their own during the first years of life. Your child's cardiologist will check with echocardiograms and advise whether a procedure is needed.",
    },
    {
      q: "Did I do something wrong during pregnancy to cause my baby's heart defect?",
      a: "In most cases, no cause is found and parents could not have prevented it. A few known factors, such as uncontrolled diabetes or rubella in early pregnancy, raise the chance, but most heart defects happen without any identifiable reason.",
    },
    {
      q: "Can my child play sports after heart surgery?",
      a: "Many children can play and take part in sport after treatment. The right level of activity depends on the type of defect and how well the heart works afterwards. Ask the cardiologist for specific advice before competitive or very strenuous sport.",
    },
    {
      q: "Can adults have a congenital heart defect without knowing?",
      a: "Yes. Some defects, such as certain holes between the upper chambers or a bicuspid aortic valve, may cause no symptoms for years and are found only in adulthood when a murmur is heard or symptoms such as breathlessness appear.",
    },
  ],
  sources: [
    { label: "MedlinePlus, US National Library of Medicine — Congenital Heart Defects", url: "https://medlineplus.gov/congenitalheartdefects.html" },
    { label: "Government of India — Emergency Response Support System (112)", url: "https://112.gov.in/" },
  ],
};
