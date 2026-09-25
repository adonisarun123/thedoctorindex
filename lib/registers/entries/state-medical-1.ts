import { stateMedicalCouncil } from "@/lib/registers/build";
import type { RegisterEntry } from "@/lib/registers/types";

/**
 * State medical councils, in the order the NMC lists them. Office and website
 * are copied from that list as it read on the `checkedOn` date; the list is
 * the NMC's and is visibly not maintained evenly (Kerala still appears under
 * its pre-2018 name, several councils show no website), so a missing website
 * here means the NMC shows none, not that the council has none.
 */

const CHECKED = "25 Sep 2026";

export const STATE_MEDICAL_COUNCILS: RegisterEntry[] = [
  stateMedicalCouncil({
    slug: "karnataka-medical-council",
    name: "Karnataka Medical Council",
    short: "KMC",
    state: { name: "Karnataka", slug: "karnataka" },
    office: "Vaidyakeeya Bhavan, Miller Tank Bed Area, Vasanthnagar, Bengaluru 560052",
    website: "https://www.karnatakamedicalcouncil.com",
    aliases: ["KMC", "Karnataka State Medical Council"],
    about: [
      "The Karnataka Medical Council registers doctors of modern medicine practising in Karnataka and maintains the Karnataka Medical Register. It sits in Vaidyakeeya Bhavan in Vasanthnagar, Bengaluru, and it is the council most Bengaluru hospital doctors on this site are registered with — which makes it the register this site's own verification worker queries most often after Madhya Pradesh.",
      "The council's site states its functions plainly: to maintain the register and keep it updated, to renew registrations, to award CME credit hours, and to act against erring doctors under the Karnataka Medical Registration Act. It does not, at the time of checking, publish a public name-or-number search on its own site; the NMC register is the public search for KMC numbers.",
    ],
    extra: [
      { k: "h2", text: "Renewal and CME credits" },
      {
        k: "p",
        text: "KMC registration is renewed periodically, and since 15 April 2022 the council has required six CME credit points for a renewal, with CME programmes approved online only from 1 May of that year. A doctor whose registration has lapsed is still on the register historically but is not in good standing; the council's \"good standing\" certificate is the document that says both things at once. On this site a registration is shown as verified when the number matches the register; renewal status is not something the public register exposes, so it is not claimed.",
      },
    ],
    extraFaqs: [
      {
        q: "What does a KMC number look like?",
        a: "Most KMC numbers on this site are plain five- or six-digit serials, sometimes written with a KMC prefix (KMC-12345). Numbers issued to doctors transferring in from other states can carry a state code and a year. The measured formats on this page show the mix as it actually appears on profiles here.",
      },
    ],
    checkedOn: CHECKED,
    extraSources: [{ label: "Karnataka Medical Council — home page", url: "https://www.karnatakamedicalcouncil.com" }],
    related: ["national-medical-commission", "tamil-nadu-medical-council", "karnataka-state-dental-council"],
  }),
  stateMedicalCouncil({
    slug: "madhya-pradesh-medical-council",
    name: "Madhya Pradesh Medical Council",
    short: "MPMC",
    state: { name: "Madhya Pradesh", slug: "madhya-pradesh" },
    office: "F-7, Sanchi Complex, opposite Board Office, Bhopal 462016",
    website: "https://www.mpmedicalcouncil.net",
    search: {
      url: "https://mpmc.mponline.gov.in/Edirectory/Home",
      note: "The MPMC runs a public e-directory on the MPOnline portal where a registered doctor can be searched by name, registration number, qualification and district; doctors registered on or before 27 December 2016 (registration numbers up to 19693) are held in a separate older list reached from the same page.",
    },
    aliases: ["MPMC", "Madhya Pradesh Medical Council of India", "Madhya Pradesh", "Bhopal Medical Council", "Madhya Pradesh Bhopal", "Mahakaushal Medical Council", "Mahakoshal Medical Council"],
    about: [
      "The Madhya Pradesh Medical Council, in Bhopal, is the state council cited by more profiles on this site than any other — a consequence of the source data, which is weighted towards Indore, Jabalpur, Bhopal and Gwalior. It is also the register against which the largest number of profiles here have already been checked, because MPMC numbers are on file for roughly half the Madhya Pradesh records and the verification worker started there.",
      "Unusually among state councils, the MPMC publishes a public search of its own register, on the MPOnline portal, in addition to feeding the NMC's national register. Older records — registrations on or before 27 December 2016, which is registration number 19693 and below — live in a separate list reached from the same page, so a search that returns nothing for an older doctor should be repeated there before it is treated as a miss.",
    ],
    extra: [
      { k: "h2", text: "Names written surname first" },
      {
        k: "p",
        text: "Many Madhya Pradesh records on this site were imported from a council-derived source that writes names surname first — \"Gour Pushpa\" rather than \"Pushpa Gour\". The register itself may hold either order. When a search on the number returns the same two names inverted, that is a match, not a mismatch.",
      },
    ],
    checkedOn: CHECKED,
    extraSources: [{ label: "MPMC e-directory — Search Registered Doctor", url: "https://mpmc.mponline.gov.in/Edirectory/Home" }],
    related: ["national-medical-commission", "chhattisgarh-medical-council", "madhya-pradesh-state-dental-council"],
  }),
  stateMedicalCouncil({
    slug: "gujarat-medical-council",
    name: "Gujarat Medical Council",
    short: "GMC",
    state: { name: "Gujarat", slug: "gujarat" },
    office: "Old Nursing College Building, Civil Hospital Campus, Asarwa, Ahmedabad 380016",
    website: "http://www.gmcgujarat.org",
    aliases: ["GMC", "Gujarat State Medical Council"],
    about: [
      "The Gujarat Medical Council sits inside the Civil Hospital campus at Asarwa, Ahmedabad, and registers doctors of modern medicine for Gujarat. On this site it is the third most-cited council, almost entirely through profiles in Vadodara and Ahmedabad, and nearly every Gujarat registration on file here has already been checked against the NMC register.",
      "The NMC lists the council's site as gmcgujarat.org. This site did not open a public register search there at the time of checking, so the procedure below runs through the NMC register; if the council's own search is in use, it is a second source rather than the first.",
    ],
    checkedOn: CHECKED,
    related: ["national-medical-commission", "maharashtra-medical-council", "rajasthan-medical-council"],
  }),
  stateMedicalCouncil({
    slug: "uttar-pradesh-medical-council",
    name: "Uttar Pradesh Medical Council",
    short: "UPMC",
    state: { name: "Uttar Pradesh", slug: "uttar-pradesh" },
    office: "5 Sarvapalli, Mall Avenue Road, Lucknow 226001",
    website: "https://upmedicalcouncil.org",
    aliases: ["UPMC", "U.P. Medical Council", "UP Medical Council"],
    about: [
      "The Uttar Pradesh Medical Council, in Lucknow, registers modern-medicine doctors for India's most populous state. Its register is one of the largest in the country by headcount; on this site its share is modest because the source data does not yet cover Uttar Pradesh in depth, and most of the UP registrations here belong to doctors practising elsewhere.",
      "The NMC lists the council's website as upmedicalcouncil.org, with correspondence routed through the state medical faculty. The public search for UPMC numbers is the NMC register.",
    ],
    checkedOn: CHECKED,
    related: ["national-medical-commission", "uttarakhand-medical-council", "delhi-medical-council"],
  }),
  stateMedicalCouncil({
    slug: "rajasthan-medical-council",
    name: "Rajasthan Medical Council",
    short: "RMC",
    state: { name: "Rajasthan", slug: "rajasthan" },
    office: "Sardar Patel Marg, opposite Residency, C-Scheme, Jaipur 302001",
    website: "https://www.rmcjaipur.org",
    aliases: ["RMC", "Rajasthan State Medical Council"],
    about: [
      "The Rajasthan Medical Council is in C-Scheme, Jaipur, and registers doctors of modern medicine for Rajasthan. Its website, rmcjaipur.org, is the one the NMC lists. Rajasthan numbers on this site were the source of a lesson worth passing on: bare digits collide across councils, and a Rajasthan number that also exists as a Karnataka or Madhya Pradesh number returns a different doctor on each register.",
      "That is why the procedure below insists on selecting the council before searching. A number alone is not an identity; a number plus its council is.",
    ],
    checkedOn: CHECKED,
    related: ["national-medical-commission", "gujarat-medical-council", "madhya-pradesh-medical-council"],
  }),
  stateMedicalCouncil({
    slug: "maharashtra-medical-council",
    name: "Maharashtra Medical Council",
    short: "MMC",
    state: { name: "Maharashtra", slug: "maharashtra" },
    office: "189-A Anand Complex, Sane Guruji Marg, Arthur Road Naka, Chinchpokli (W), Mumbai 400011",
    website: "https://www.maharashtramedicalcouncil.in",
    aliases: ["MMC", "Maharastra Medical Council", "Maharashtra"],
    about: [
      "The Maharashtra Medical Council, at Arthur Road Naka in Mumbai, is constituted under the Maharashtra Medical Council Act, 1965, and maintains the state's register of modern-medicine practitioners. It is one of the older and better-resourced state councils and is frequently cited by doctors practising in Mumbai, Pune and Nagpur.",
      "On this site Maharashtra registrations are fewer than the state's size would suggest, because the imported supply is thin there; most MMC numbers on file have nonetheless been checked against the NMC register. The council's own site is the one the NMC lists.",
    ],
    checkedOn: CHECKED,
    related: ["national-medical-commission", "gujarat-medical-council", "goa-medical-council"],
  }),
  stateMedicalCouncil({
    slug: "bihar-medical-council",
    name: "Bihar Medical Council",
    short: "BMC",
    state: { name: "Bihar", slug: "bihar" },
    office: "Road No. 11/D, Rajendra Nagar, Patna 800016",
    aliases: ["Bihar", "Bihar Council of Medical Registration", "BMC"],
    about: [
      "The Bihar Medical Council is in Rajendra Nagar, Patna. The NMC's list shows no website for it, so the NMC register is both the public search and, for most people, the only search. A number of profiles on this site record their council simply as \"Bihar\" or as the \"Bihar Council of Medical Registration\"; they are treated here as citing this body.",
    ],
    checkedOn: CHECKED,
    related: ["national-medical-commission", "jharkhand-medical-council", "west-bengal-medical-council"],
  }),
  stateMedicalCouncil({
    slug: "andhra-pradesh-medical-council",
    name: "Andhra Pradesh Medical Council",
    short: "APMC",
    state: { name: "Andhra Pradesh", slug: "andhra-pradesh" },
    office: "2nd Floor, Dr NTR University of Health Sciences, Gunadala, Vijayawada 520008",
    website: "http://www.apmconline.in",
    aliases: ["APMC", "Andhra Pradesh"],
    about: [
      "The Andhra Pradesh Medical Council now sits inside the Dr NTR University of Health Sciences campus at Gunadala, Vijayawada. It registered doctors for the undivided state until 2014; registrations issued to Hyderabad-based doctors before the bifurcation are APMC numbers, and doctors who stayed in Telangana afterwards were re-registered by the new Telangana State Medical Council.",
      "That history matters when checking: an older Hyderabad doctor may legitimately hold an APMC number, a TSMC number, or both. The NMC lists the council's site as apmconline.in.",
    ],
    checkedOn: CHECKED,
    related: ["telangana-state-medical-council", "national-medical-commission", "tamil-nadu-medical-council"],
  }),
  stateMedicalCouncil({
    slug: "delhi-medical-council",
    name: "Delhi Medical Council",
    short: "DMC",
    state: { name: "Delhi", slug: "delhi" },
    office: "Room 308-A, Administrative Block, Maulana Azad Medical College, Bahadur Shah Zafar Marg, New Delhi 110002",
    website: "http://www.delhimedicalcouncil.org",
    aliases: ["DMC"],
    about: [
      "The Delhi Medical Council was constituted under the Delhi Medical Council Act, 1997, and sits in the administrative block of Maulana Azad Medical College. Because Delhi draws doctors from every state, DMC registration is very often a doctor's second registration, taken on moving to the capital; a Delhi doctor whose primary number is from Uttar Pradesh, Haryana or Punjab is the norm rather than the exception.",
      "The council's site is delhimedicalcouncil.org. The NMC register is the public search for DMC numbers.",
    ],
    checkedOn: CHECKED,
    related: ["national-medical-commission", "haryana-medical-council", "uttar-pradesh-medical-council"],
  }),
  stateMedicalCouncil({
    slug: "west-bengal-medical-council",
    name: "West Bengal Medical Council",
    short: "WBMC",
    state: { name: "West Bengal", slug: "west-bengal" },
    office: "IB-196, Sector III, Salt Lake, Kolkata 700106",
    website: "https://www.wbmc.in",
    aliases: ["WBMC"],
    about: [
      "The West Bengal Medical Council is in Salt Lake, Kolkata, and registers doctors of modern medicine for West Bengal. Its site, wbmc.in, is the one the NMC lists. WBMC numbers on this site are few and mostly belong to doctors who trained in Bengal and now practise in Bengaluru or elsewhere; they are checked on the NMC register like any other.",
    ],
    checkedOn: CHECKED,
    related: ["national-medical-commission", "bihar-medical-council", "assam-medical-council"],
  }),
  stateMedicalCouncil({
    slug: "chhattisgarh-medical-council",
    name: "Chhattisgarh Medical Council",
    short: "CGMC",
    state: { name: "Chhattisgarh", slug: "chhattisgarh" },
    office: "Kankalipara, near Nagar Nigam Ayurvedic Hospital, Raipur 492001",
    website: "http://www.cgmedicalcouncil.org",
    aliases: ["Chattisgarh Medical Council", "CGMC", "Chhattisgarh"],
    about: [
      "The Chhattisgarh Medical Council, in Raipur, was formed after the state was carved out of Madhya Pradesh in 2000; doctors registered before then in what is now Chhattisgarh hold Madhya Pradesh Medical Council numbers, and many still cite them. The NMC list spells the council \"Chattisgarh\", and so do most of the profiles on this site — both spellings resolve to this page.",
      "The council's site is cgmedicalcouncil.org. The public search for its numbers is the NMC register.",
    ],
    checkedOn: CHECKED,
    related: ["madhya-pradesh-medical-council", "national-medical-commission", "odisha-council-of-medical-registration"],
  }),
  stateMedicalCouncil({
    slug: "tamil-nadu-medical-council",
    name: "Tamil Nadu Medical Council",
    short: "TNMC",
    state: { name: "Tamil Nadu", slug: "tamil-nadu" },
    office: "No. 914 Poonamallee High Road, Arumbakkam, Chennai 600106",
    website: "http://www.tnmedicalcouncil.org",
    aliases: ["TNMC", "Tamilnadu Medical Council"],
    about: [
      "The Tamil Nadu Medical Council, at Arumbakkam in Chennai, is one of the oldest registering bodies in the country and registers doctors of modern medicine for Tamil Nadu. A large share of Bengaluru's hospital doctors trained in Tamil Nadu, so a TNMC primary number with a later Karnataka transfer registration is a common pattern on this site — one profile here, for instance, carries a TNMC number and a KMC transfer entry that reads \"TMN … KTK\".",
      "The NMC lists the council's site as tnmedicalcouncil.org. The public search for TNMC numbers is the NMC register.",
    ],
    checkedOn: CHECKED,
    related: ["karnataka-medical-council", "national-medical-commission", "kerala-state-medical-council"],
  }),
  stateMedicalCouncil({
    slug: "telangana-state-medical-council",
    name: "Telangana State Medical Council",
    short: "TSMC",
    state: { name: "Telangana", slug: "telangana" },
    office: "P.B. 523, Sultan Bazar, Hyderabad 500095",
    website: "https://www.tsmconline.in",
    aliases: ["TSMC", "Telangana Medical Council"],
    about: [
      "The Telangana State Medical Council was created after the state's formation in 2014 and sits at Sultan Bazar, Hyderabad. Doctors who were on the Andhra Pradesh register and stayed in Telangana were re-registered here, so a Hyderabad doctor may hold an APMC number from before 2014 and a TSMC number from after; both are legitimate.",
      "The NMC lists the council's site as tsmconline.in. The public search for TSMC numbers is the NMC register, under the council's own name.",
    ],
    checkedOn: CHECKED,
    related: ["andhra-pradesh-medical-council", "national-medical-commission", "karnataka-medical-council"],
  }),
];
