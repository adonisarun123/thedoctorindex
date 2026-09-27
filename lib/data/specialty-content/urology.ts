import type { SpecialtyContent } from "./types";

export const urology: SpecialtyContent = {
  key: "urology",
  writtenOn: "27 Sep 2026",
  reviewedOn: "",
  overview: [
    "A urologist is a surgeon who treats the urinary tract in men and women (kidneys, ureters, bladder and urethra) and the male reproductive organs. In India the usual route is an MBBS, MS General Surgery or DNB, and then a super-speciality degree such as MCh Urology or DrNB Urology. Some urologists concentrate on stones, cancer, children, female urology, male infertility, or kidney transplantation.",
    "Urology combines medical treatment with procedures. Many problems, such as mild prostate enlargement or a urinary infection, are managed with medicines and advice. Others are treated with endoscopic surgery, in which thin instruments are passed up the urethra so that stones can be broken and removed, or the prostate trimmed, without an external cut. Laparoscopic and robotic surgery are used for many kidney, bladder and prostate operations.",
    "People see a urologist for symptoms such as difficulty passing urine, blood in the urine or pain from a stone, and often after an ultrasound or blood test has found something. Kidney function itself, meaning how well the kidneys filter the blood, is usually looked after by a nephrologist, and the two specialities refer to each other often. Embarrassment keeps many people from mentioning urinary or sexual symptoms; urologists hear them every day.",
  ],
  conditions: [
    { name: "Kidney and ureteric stones", note: "Hard deposits that can cause severe pain, blood in the urine or blockage, treated by waiting, medicines or procedures." },
    { name: "Enlarged prostate (BPH)", note: "A common non-cancerous enlargement in older men, causing a weak stream, frequency and getting up at night." },
    { name: "Urinary tract infections", note: "Infections of the bladder or kidneys; repeated or complicated infections need investigation." },
    { name: "Blood in the urine", note: "Always worth investigating, as causes range from infection and stones to tumours." },
    { name: "Urinary incontinence", note: "Leaking urine, common in women after childbirth and in older adults, with several treatment options." },
    { name: "Prostate, bladder and kidney cancer", note: "Cancers of the urinary and male reproductive organs, treated with surgery and other therapies." },
    { name: "Male infertility", note: "Assessment of sperm problems and treatable causes such as a varicocele or blockage." },
    { name: "Erectile difficulty", note: "Problems with erections, which can also be an early sign of heart disease or diabetes." },
    { name: "Urethral stricture", note: "Narrowing of the urethra causing a thin stream and difficulty passing urine." },
  ],
  tests: [
    { name: "Urine tests", note: "Check for infection, blood and crystals." },
    { name: "Ultrasound of the kidneys, bladder and prostate", note: "A painless scan that shows stones, blockage, prostate size and urine left after passing water." },
    { name: "CT scan (KUB or urogram)", note: "Detailed imaging to find stones and look at the kidneys and urinary tract." },
    { name: "PSA blood test", note: "A prostate test; a raised result has several possible causes and is interpreted with other findings." },
    { name: "Uroflowmetry", note: "Passing urine into a special device that measures the strength of the stream." },
    { name: "Cystoscopy", note: "A thin camera passed into the bladder through the urethra to look inside." },
    { name: "Stone procedures", note: "Shock-wave treatment from outside the body, or breaking stones with a laser through an endoscope." },
    { name: "TURP and prostate procedures", note: "Removing part of an enlarged prostate from inside the urethra, without an external cut." },
    { name: "Semen analysis", note: "The first test in assessing male fertility." },
  ],
  versus: [
    { key: "nephrology", text: "A urologist deals with the plumbing of the urinary tract (stones, blockage, the prostate and bladder) and operates. A nephrologist treats how well the kidneys filter the blood, manages kidney disease with medicines and runs dialysis. They refer to each other often." },
    { key: "gynaecology", text: "Women with urinary leakage or prolapse may see a gynaecologist or a urologist; some specialise in both as urogynaecology or female urology. Recurrent infections or blood in the urine are usually for a urologist." },
    { key: "sexual-medicine", text: "Erectile and sexual health problems may be seen by a urologist, particularly when a physical cause needs investigation or surgery, or by a sexual medicine specialist who also addresses psychological and relationship factors." },
  ],
  firstVisit: [
    "Bring earlier urine, blood and PSA reports, ultrasound and CT reports and images, with dates.",
    "Note how often you pass urine during the day and at night, and whether the stream is weak or stops and starts. A simple diary for two or three days helps.",
    "Bring a list of medicines, including any blood thinners.",
    "You may be asked to arrive with a comfortably full bladder for a flow test or scan.",
    "Expect questions about urinary and sometimes sexual symptoms; answer frankly, as they guide the diagnosis. Men may have a prostate examination.",
  ],
  urgent: [
    "Being completely unable to pass urine, with a painful, swollen lower abdomen",
    "Severe loin pain with fever and shivering, which can mean an infected, blocked kidney: call 108",
    "Sudden severe pain and swelling in a testicle, especially in a boy or young man, which needs surgery within hours",
    "Heavy bleeding in the urine with clots, or with difficulty passing urine",
  ],
  faqs: [
    {
      q: "What is the difference between a urologist and a nephrologist?",
      a: "A urologist is a surgeon who treats structural problems of the urinary tract and male reproductive organs, such as stones, prostate enlargement and cancers. A nephrologist is a physician who treats kidney function, kidney disease and dialysis.",
    },
    {
      q: "Do all kidney stones need surgery?",
      a: "No. Small stones often pass on their own with fluids and pain relief. Larger stones, or stones causing blockage, infection or repeated pain, may need a procedure.",
    },
    {
      q: "Do women see urologists?",
      a: "Yes. Urologists treat urinary infections, stones, incontinence and bladder problems in women as well as men.",
    },
    {
      q: "What qualifications should a urologist have?",
      a: "An MBBS, MS General Surgery or DNB, and then a super-speciality degree such as MCh Urology or DrNB Urology. Registration can be checked with the NMC or a state medical council.",
    },
    {
      q: "Does a raised PSA mean prostate cancer?",
      a: "Not necessarily. PSA can be raised by an enlarged prostate, infection and other causes. A urologist interprets it with an examination and, where needed, further tests.",
    },
  ],
};
