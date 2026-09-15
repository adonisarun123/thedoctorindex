import type { Guide } from "@/lib/data/guides";

/**
 * Credential guides: how Indian medical registration and qualifications work,
 * and how a patient checks them without taking anyone's word for it.
 *
 * These are deliberately non-clinical. They describe registers, councils and
 * degree abbreviations — they name no symptom, condition or treatment — so
 * they carry `clinical: false` and need no medical reviewer to be honest.
 * That is also why they can be published now: the directory's own value
 * proposition is verification, and these are the only pages on the site that
 * teach the reader to check us as well as the doctor.
 *
 * Every factual claim here should be re-checked against nmc.org.in and the
 * relevant state council before a major edit. Registration rules, portals and
 * renewal periods change, and a stale instruction is worse than none.
 */
export const CREDENTIAL_GUIDES: Guide[] = [
  {
    slug: "how-to-check-a-doctors-registration-in-india",
    title: "How to check a doctor's registration in India",
    standfirst:
      "Any patient can look up whether a doctor is on the medical register, for free, in about two minutes. Here is exactly how, and what the result does and does not prove.",
    specialty: null,
    author: "The Doctor Index editorial team",
    reviewer: null,
    clinical: false,
    publishedOn: "9 Sep 2026",
    reviewedOn: "9 Sep 2026",
    readingMinutes: 7,
    body: (
      <>
        <p>
          In India, a person may practise modern medicine only if they hold a recognised medical
          qualification <i>and</i> are registered with a State Medical Council or the National Medical
          Commission. Registration is the single check that separates a doctor from someone calling
          themselves one, and it is the one check that is public, free and available to you directly.
        </p>
        <p>
          You do not need to ask the clinic, and you do not need to trust a directory — including this
          one. You can read the register yourself.
        </p>

        <h2>What you need before you start</h2>
        <ul>
          <li>
            <b>The doctor&rsquo;s full name as registered.</b> This is often not the name on the clinic
            board. Registers hold the name as it appeared on the degree certificate, which may include
            initials, a fuller surname, or a different transliteration.
          </li>
          <li>
            <b>Their registration number, if you have it.</b> Clinics frequently print it on the
            prescription pad, the signboard, or the receipt. Searching by number is far more reliable
            than searching by name.
          </li>
          <li>
            <b>The council that registered them</b> &mdash; usually the state where they first
            registered after graduating, which is not necessarily the state they practise in today.
          </li>
        </ul>

        <h2>Looking a doctor up</h2>
        <p>
          The National Medical Commission publishes the national register of doctors holding recognised
          modern-medicine qualifications, at <b>nmc.org.in</b>. It aggregates entries supplied by the
          state medical councils. Search by registration number and council where you can; fall back to
          name search only when you must.
        </p>
        <p>
          The NMC has been migrating this register onto a newer National Medical Register platform with
          identity-linked entries, so the exact search screen you land on may differ from the one
          described in older articles. Start at nmc.org.in and follow the register or search link from
          there rather than from a bookmarked deep link, which may be out of date.
        </p>
        <p>
          Some state medical councils also publish their own searchable register, and a state register
          is sometimes more current than the national aggregate &mdash; a recent registration or a recent
          disciplinary action can appear with the council before it appears nationally. If the national
          search comes up empty for a doctor you have good reason to believe is registered, the state
          council is the second place to look.
        </p>

        <h2>Reading the result</h2>
        <p>A register entry typically shows:</p>
        <ul>
          <li>
            <b>Name</b> as registered. Small differences from the clinic&rsquo;s spelling are common and
            usually mean nothing; a completely different name means you have the wrong entry.
          </li>
          <li>
            <b>Registration number and council.</b> Numbers are only unique within a council, so a
            number without its council is ambiguous &mdash; two doctors in different states can hold the
            same number.
          </li>
          <li>
            <b>Year of registration.</b> This is when they first joined that register, which is a
            reasonable proxy for how long they have been qualified. It is <i>not</i> the same as a
            renewal date, and the two are often confused: a profile claiming &ldquo;registered
            2018&rdquo; for a doctor first registered in 1999 has usually picked up a renewal year.
          </li>
          <li>
            <b>The qualification the council registered them on</b> &mdash; usually the primary degree,
            sometimes with the university and year. Postgraduate and foreign qualifications may or may
            not appear.
          </li>
        </ul>

        <h2>What registration proves &mdash; and what it does not</h2>
        <div className="notice good">
          <b>It proves</b> that a recognised authority accepted this person&rsquo;s primary medical
          qualification and admitted them to the register, and that they were not struck off as at the
          date the register was last updated.
        </div>
        <p>It does not prove any of the following, and no register is designed to:</p>
        <ul>
          <li>
            <b>That they are good at their job.</b> Registration is a floor, not a ranking. It says
            qualified, not skilled, current, or right for you.
          </li>
          <li>
            <b>That they hold the speciality they advertise.</b> Many registers record only the primary
            qualification. A doctor listed with MBBS may well hold an MD; the register simply may not
            show it. Equally, a register entry showing only MBBS is not confirmation of a
            specialist&rsquo;s postgraduate training &mdash; you would need the degree certificate or the
            awarding body for that.
          </li>
          <li>
            <b>That the entry is current today.</b> Registers are updated in batches. Several states
            require periodic renewal, and a lapsed renewal does not always show immediately.
          </li>
          <li>
            <b>Anything about the clinic.</b> Registration attaches to the person, not the premises. A
            registered doctor can work at an unregistered facility.
          </li>
        </ul>

        <h2>If you cannot find them</h2>
        <p>
          A blank result is a reason to ask, not a verdict. In order of likelihood: the name is spelled
          differently on the register; you are searching the wrong council; the entry has not been
          migrated to the platform you are searching; or the doctor practises a system of medicine that
          the NMC does not register at all (see below). Genuine absence &mdash; someone practising modern
          medicine with no registration anywhere &mdash; does happen, and is the reason this check is
          worth two minutes.
        </p>
        <p>
          The straightforward next step is to ask the doctor or the clinic for the registration number
          and council. A registered doctor will have it to hand; in several states they are required to
          display it.
        </p>

        <h2>Doctors the NMC does not register</h2>
        <p>
          The NMC register covers modern medicine only. Practitioners of Ayurveda, Homoeopathy, Unani,
          Siddha and Yoga &amp; Naturopathy are registered under separate statutory councils, and will
          not appear on the NMC register no matter how correctly you search. Dentists are registered
          separately again, with the Dental Council of India and its state counterparts. Physiotherapists,
          clinical psychologists, dietitians and audiologists fall under different arrangements again,
          some of which have no single national public register at all.
        </p>
        <p>
          None of that makes such a practitioner unqualified. It means the check is a different check,
          against a different body.
        </p>

        <h2>How we use this</h2>
        <p>
          Every profile on this site shows what we have actually checked and when. Where we have
          confirmed a registration against the register, the profile says so and carries the date. Where
          we have not, it says that too, in plain words, rather than displaying a badge that means
          nothing. A profile that says a registration is unverified is telling you the truth about our
          work, not about the doctor &mdash; they may well be registered and we simply have not confirmed
          it yet.
        </p>
        <p>
          If you check a doctor yourself and find something our profile gets wrong, tell us. Corrections
          to a profile are the fastest way this directory gets more accurate.
        </p>
      </>
    ),
  },
  {
    slug: "medical-degrees-in-india-explained",
    title: "What the letters after an Indian doctor's name mean",
    standfirst:
      "MBBS, MD, MS, DNB, DM, MCh, DGO, FRCS — what each qualification actually is, how long it takes, and which ones indicate a specialist.",
    specialty: null,
    author: "The Doctor Index editorial team",
    reviewer: null,
    clinical: false,
    publishedOn: "9 Sep 2026",
    reviewedOn: "9 Sep 2026",
    readingMinutes: 8,
    body: (
      <>
        <p>
          Indian doctors carry long strings of post-nominals, and clinics rarely explain them. Most of
          the confusion is avoidable: there are only about six categories, and knowing which category a
          qualification falls into tells you most of what you need &mdash; whether the person is a
          generalist, a specialist, or a super-specialist.
        </p>
        <p>
          This page describes what the qualifications are. It does not tell you which one you need for a
          given problem, and a longer list is not a better doctor.
        </p>

        <h2>The primary degree</h2>
        <h3>MBBS</h3>
        <p>
          Bachelor of Medicine, Bachelor of Surgery. The undergraduate medical degree and the entry
          point to modern medicine in India &mdash; roughly five and a half years including a compulsory
          rotating internship. Every doctor practising modern medicine holds this or a recognised
          foreign equivalent. On its own it means a general practitioner, not a specialist.
        </p>
        <p>
          Someone whose only qualification is MBBS is fully qualified to practise. &ldquo;Only
          MBBS&rdquo; is not a criticism; a great many excellent family physicians hold exactly that.
        </p>

        <h2>Postgraduate specialisation</h2>
        <p>
          Three routes lead to the same place. A specialist will hold one of them, and they are broadly
          equivalent &mdash; the route says more about where someone trained than about their standard.
        </p>
        <h3>MD &mdash; Doctor of Medicine</h3>
        <p>
          A three-year postgraduate degree in a mainly non-surgical speciality: general medicine,
          paediatrics, dermatology, psychiatry, radiology, anaesthesia, pathology and others. Awarded by
          a university.
        </p>
        <h3>MS &mdash; Master of Surgery</h3>
        <p>
          The surgical counterpart, also three years: general surgery, orthopaedics, ENT, ophthalmology,
          obstetrics and gynaecology. Also awarded by a university.
        </p>
        <h3>DNB &mdash; Diplomate of National Board</h3>
        <p>
          Awarded by the National Board of Examinations in Medical Sciences rather than a university,
          usually after training at an accredited hospital instead of a medical college. It is
          recognised as equivalent to MD or MS in the corresponding speciality. A doctor may write
          &ldquo;MD&rdquo; or &ldquo;DNB&rdquo; depending on which route they took; both are specialists.
        </p>

        <h2>Super-speciality</h2>
        <p>
          A further three years <i>after</i> an MD or MS, in a narrow field. These are the qualifications
          that indicate the deepest training, and they always sit on top of a postgraduate degree &mdash;
          nobody holds one without an MD or MS first.
        </p>
        <h3>DM &mdash; Doctorate of Medicine</h3>
        <p>
          The medical super-specialities, following an MD: cardiology, neurology, nephrology,
          gastroenterology, endocrinology, medical oncology, clinical immunology and others.
        </p>
        <h3>MCh &mdash; Magister Chirurgiae</h3>
        <p>
          The surgical super-specialities, following an MS: cardiothoracic surgery, neurosurgery,
          urology, plastic surgery, paediatric surgery, surgical oncology and others.
        </p>
        <h3>DrNB and FNB</h3>
        <p>
          The National Board&rsquo;s equivalents. DrNB is its super-speciality qualification, comparable
          to DM or MCh. FNB is a fellowship in a narrower area, typically one to two years, and is a
          post-doctoral add-on rather than a route to specialist status by itself.
        </p>

        <h2>Postgraduate diplomas</h2>
        <p>
          Two-year qualifications, shorter than an MD or MS, in a defined speciality. You will see them
          on doctors who trained some years ago: <b>DGO</b> (obstetrics and gynaecology), <b>DCH</b>{" "}
          (child health), <b>DLO</b> (ENT), <b>DA</b> (anaesthesia), <b>DOMS</b> (ophthalmology),{" "}
          <b>DDVL</b> (dermatology), <b>DPM</b> (psychiatry), <b>DORTHO</b> (orthopaedics).
        </p>
        <p>
          These sit between MBBS and a full postgraduate degree. Diploma courses were progressively
          discontinued and their seats converted to degree seats after the National Medical Commission
          replaced the Medical Council of India, so they are increasingly a marker of an experienced
          doctor rather than a recent graduate.
        </p>

        <h2>Foreign qualifications</h2>
        <p>
          British and Irish royal college qualifications appear often on Indian profiles, particularly
          among doctors who trained or worked in the UK:
        </p>
        <ul>
          <li>
            <b>MRCP</b> &mdash; Member of the Royal College of Physicians. A postgraduate examination in
            internal medicine.
          </li>
          <li>
            <b>MRCS</b> &mdash; Member of the Royal College of Surgeons. The surgical counterpart, taken
            in early surgical training.
          </li>
          <li>
            <b>FRCS</b> &mdash; Fellow of the Royal College of Surgeons. A senior surgical qualification,
            usually with the speciality named after it.
          </li>
          <li>
            <b>MRCOG</b>, <b>MRCPCH</b>, <b>FRCR</b>, <b>FRCA</b> &mdash; the same idea in obstetrics and
            gynaecology, paediatrics, radiology and anaesthesia.
          </li>
          <li>
            <b>FEBOT</b> and similar &ldquo;FEB&rdquo; titles &mdash; Fellow of the European Board in a
            speciality, awarded on a European examination.
          </li>
        </ul>
        <p>
          These are genuine qualifications, and a doctor holding one has usually trained abroad. But
          note two things: a foreign qualification does not by itself permit practice in India &mdash;
          registration with an Indian council is still required &mdash; and these awards are generally
          not recorded on the Indian register, so they are the hardest qualifications for anyone,
          including us, to verify independently. If a foreign qualification matters to your decision,
          the awarding college is the body that can confirm it.
        </p>

        <h2>Other systems of medicine</h2>
        <p>
          Different councils, different degrees, and not interchangeable with the above:
        </p>
        <ul>
          <li>
            <b>BAMS</b> &mdash; Bachelor of Ayurvedic Medicine and Surgery. Postgraduate: <b>MD (Ayu)</b>{" "}
            or <b>MS (Ayu)</b>.
          </li>
          <li>
            <b>BHMS</b> &mdash; Bachelor of Homoeopathic Medicine and Surgery. Postgraduate:{" "}
            <b>MD (Hom)</b>.
          </li>
          <li>
            <b>BUMS</b> &mdash; Unani. <b>BSMS</b> &mdash; Siddha. <b>BNYS</b> &mdash; Naturopathy and
            Yogic Sciences.
          </li>
          <li>
            <b>BDS</b> and <b>MDS</b> &mdash; dentistry, registered with the Dental Council of India.
          </li>
          <li>
            <b>BPT</b> and <b>MPT</b> &mdash; physiotherapy.
          </li>
        </ul>

        <h2>Two things worth knowing</h2>
        <div className="notice">
          <b>A longer list is not a better doctor.</b> Post-nominals accumulate with fellowships,
          memberships, courses and society affiliations, some of which are examined qualifications and
          some of which are paid memberships. The qualifications that indicate training are the ones
          above; the rest are context.
        </div>
        <p>
          And a practical one: the qualification that determines what someone is trained to treat is the
          <i>highest relevant</i> one, not the total count. A doctor with MBBS, MD and DM in cardiology
          is a cardiologist. A doctor with MBBS and five fellowships in unrelated areas is a
          general practitioner with five fellowships.
        </p>

        <h2>How we show this</h2>
        <p>
          Each profile lists the qualifications on the record and marks each one verified or unverified.
          A qualification is marked verified only when we have matched it against a register or the
          awarding body &mdash; in practice this usually means the primary degree the medical council
          registered the doctor on. Postgraduate and foreign degrees are usually shown as stated but
          unverified, because there is no register we can read that carries them.
        </p>
      </>
    ),
  },
  {
    slug: "checking-registration-numbers-against-the-register",
    title: "We checked 3,700 registration numbers against the national register",
    standfirst:
      "Of the records where the number on file could be judged conclusively, about three in five did not belong to the doctor listed beside them. What we found, how we checked, and what it means if you are reading a doctor listing anywhere.",
    specialty: null,
    author: "The Doctor Index editorial team",
    reviewer: null,
    clinical: false,
    publishedOn: "10 Sep 2026",
    reviewedOn: "10 Sep 2026",
    readingMinutes: 8,
    body: (
      <>
        <p>
          Every doctor listing site in India shows registration numbers. Almost none of them say
          whether the number has been checked. We built a worker that checks ours against the National
          Medical Commission&rsquo;s register, ran it across our directory, and the results were worse
          than we expected.
        </p>
        <div className="notice">
          <b>Snapshot, not a finished study.</b> The run is still going as this is published. The
          figures below cover the 3,739 modern-medicine records checked so far that had a registration
          number on file. We will update this page rather than write a second one.
        </div>

        <h2>What we found</h2>
        <p>
          For 2,471 records the check was conclusive &mdash; the number either belonged to the doctor
          listed beside it or it did not:
        </p>
        <ul>
          <li>
            <b>994 confirmed.</b> The number, searched under its council, returned a register entry
            whose name covers the doctor on the listing.
          </li>
          <li>
            <b>1,477 mismatched.</b> The number returned a register entry belonging to somebody with a
            different name. About three in five.
          </li>
        </ul>
        <p>The rest were inconclusive rather than wrong:</p>
        <ul>
          <li>
            <b>787 matched by name instead.</b> The number on file led nowhere, but exactly one entry in
            the state&rsquo;s councils matched the doctor&rsquo;s name closely enough to be certain. Those
            profiles now carry a number they did not have before.
          </li>
          <li>
            <b>335 ambiguous</b> &mdash; several plausible entries, so a person has to choose. They sit
            in a queue rather than on the profile.
          </li>
          <li>
            <b>143 not found</b> under either the number or the name in that state&rsquo;s councils.
          </li>
          <li>
            <b>4 struck off.</b> Entries the register itself marks as removed. Rare, and exactly what a
            check like this is for.
          </li>
        </ul>

        <h2>How we checked</h2>
        <p>
          For each profile: search the register for the registration number on file, restricted to the
          council on file. Registration numbers are only unique within a council, so searching a bare
          number across the whole register is meaningless. Councils write the same number differently
          &mdash; &ldquo;MP-3037&rdquo; and &ldquo;3037&rdquo; are the same registration &mdash; so both
          forms are tried before concluding anything.
        </p>
        <p>
          If exactly one returned entry has a name that covers the doctor&rsquo;s name, the registration
          is confirmed and dated. If entries come back but none of the names match, the number is
          recorded as belonging to someone else, and the profile falls through to a name search across
          that state&rsquo;s councils. Anything with more than one plausible answer goes to a human.
        </p>

        <h2>What &ldquo;mismatch&rdquo; does and does not mean</h2>
        <div className="notice alert">
          <b>It does not mean 1,477 doctors are unregistered.</b> It means the number printed next to
          their name is not theirs. Almost all of these doctors are registered; the digits travelled
          badly.
        </div>
        <p>Reading the mismatches, the causes look like this, in rough order of frequency:</p>
        <ul>
          <li>
            <b>Transcription.</b> A number typed from a prescription pad, a signboard or an old
            directory, with a digit dropped or transposed. It then lands on somebody else&rsquo;s
            registration, because register numbers are dense &mdash; most short numbers belong to
            someone.
          </li>
          <li>
            <b>Wrong council.</b> The right digits filed under the wrong council. A doctor who
            registered in Madhya Pradesh and now practises in Karnataka is often recorded against
            Karnataka, and the number then resolves to a different person entirely.
          </li>
          <li>
            <b>Historic councils.</b> Madhya Pradesh alone has three council identities in the register
            &mdash; the state council plus the older Mahakoshal and Bhopal councils. Uttar Pradesh has
            two. A number registered under a predecessor council will not be found under the modern one.
          </li>
          <li>
            <b>Our own strictness.</b> Some share of these are ours: a name written differently on the
            register than on the listing can defeat the match. We would rather report a mismatch and
            queue it than confirm a registration we are not sure of, so this number is a ceiling on the
            error rate, not a floor.
          </li>
        </ul>

        <h2>What this means if you are reading any doctor listing</h2>
        <p>
          A registration number displayed without a checked date is decoration. It tells you the site
          holds a number, not that the number is right, and on this evidence a displayed number is a
          coin flip. That applies to our unchecked profiles exactly as much as to anyone else&rsquo;s.
        </p>
        <p>
          The number is still worth having, because it lets you do the check yourself in about two
          minutes. Our guide on{" "}
          <a href="/health-guides/how-to-check-a-doctors-registration-in-india">
            how to check a doctor&rsquo;s registration
          </a>{" "}
          walks through it, and{" "}
          <a href="/health-guides/medical-councils-of-india">which council to search</a> explains why the
          council matters as much as the digits.
        </p>

        <h2>What we did about ours</h2>
        <p>
          A mismatched number is removed from the profile as the primary registration and kept only in
          the audit trail. It is not displayed, and the profile says the registration is unverified.
          Confirmed registrations carry the council, the number and the date they were checked. Where
          the register recorded the degree it registered the doctor on, that qualification is marked
          verified too, and only that one.
        </p>
        <p>
          None of this makes a profile good. It makes the claim on it honest, which is a lower bar than
          most of this industry currently clears, including us before we ran this.
        </p>
      </>
    ),
  },
  {
    slug: "medical-councils-of-india",
    title: "Which medical council registered your doctor",
    standfirst:
      "Registration numbers are unique within a council, not across India. Why that matters when you check a doctor, and how to work out which council to search.",
    specialty: null,
    author: "The Doctor Index editorial team",
    reviewer: null,
    clinical: false,
    publishedOn: "10 Sep 2026",
    reviewedOn: "10 Sep 2026",
    readingMinutes: 6,
    body: (
      <>
        <p>
          People treat a medical registration number the way they treat a passport number &mdash; as one
          identifier, nationally unique, that either checks out or does not. It is not that. Understanding
          why is most of what you need to check a doctor successfully, and it is why so many published
          numbers cannot be verified as written.
        </p>

        <h2>The structure</h2>
        <p>
          Doctors are registered by <b>State Medical Councils</b>, not centrally. A doctor registers with
          the council of the state where they qualify or first practise. The National Medical Commission
          maintains the national register, which aggregates what the state councils supply &mdash; but the
          registration itself belongs to a council.
        </p>
        <div className="notice">
          <b>A number is unique within its council, not across India.</b> Registration 3037 exists in many
          states, held by a different doctor in each. A number quoted without its council does not identify
          anybody.
        </div>

        <h2>Three things that catch people out</h2>
        <h3>1. The council is often not the state they practise in</h3>
        <p>
          Registration attaches to where a doctor qualified or first registered, and it does not move when
          they do. A physician who studied in Madhya Pradesh and has practised in Bengaluru for fifteen
          years still holds a Madhya Pradesh registration. Searching Karnataka&rsquo;s council for that
          number returns either nothing or, worse, a different doctor who happens to hold that number in
          Karnataka.
        </p>
        <h3>2. Several states have more than one council in the register</h3>
        <p>
          Councils have been created, renamed and merged across the decades, and the register keeps the
          older identities so that registrations made under them stay findable. A doctor registered in
          1985 is on the council that existed in 1985, under the name it had then.
        </p>
        <ul>
          <li>
            <b>Madhya Pradesh</b> &mdash; the state council, plus the historic <b>Mahakoshal</b> and{" "}
            <b>Bhopal</b> councils.
          </li>
          <li>
            <b>Maharashtra</b> &mdash; the state council, plus <b>Bombay</b> and <b>Vidarbha</b>.
          </li>
          <li>
            <b>Karnataka</b> &mdash; the state council, plus <b>Mysore</b>.
          </li>
          <li>
            <b>Tamil Nadu</b> &mdash; the state council, plus <b>Madras</b>. Puducherry registrations also
            sit under Madras, so the same council serves both.
          </li>
          <li>
            <b>Kerala</b> &mdash; the state council, plus <b>Travancore</b>.
          </li>
          <li>
            <b>Uttar Pradesh</b> &mdash; the state council, plus <b>Bareilly</b>.
          </li>
          <li>
            <b>Andhra Pradesh and Telangana</b> &mdash; share the <b>Andhra</b> and <b>Hyderabad</b>
            councils for anyone registered before the 2014 split.
          </li>
          <li>
            <b>Punjab&rsquo;s</b> council also holds registrations for doctors in Chandigarh, Haryana and
            Himachal Pradesh.
          </li>
        </ul>
        <p>
          So an empty result from the obvious council is not evidence that a doctor is unregistered. The
          predecessor council, or the neighbour, is the next place to look.
        </p>
        <h3>3. The same number is written several ways</h3>
        <p>
          Councils prefix numbers inconsistently, and so do the people copying them. &ldquo;MP-3037&rdquo;,
          &ldquo;MP 3037&rdquo; and &ldquo;3037&rdquo; are one registration. Some councils use a letter
          prefix that is part of the number and some use one that is merely the state&rsquo;s initials. When
          a search fails, stripping the prefix and searching the digits alone is worth trying before
          concluding anything.
        </p>

        <h2>Councils the NMC register does not cover</h2>
        <p>
          The NMC register is modern medicine only. Ayurveda, Homoeopathy, Unani and Siddha practitioners
          are registered under their own statutory councils and will never appear on it, however correctly
          you search. Dentists are registered with the Dental Council of India and its state counterparts.
          This is the single most common reason a search &ldquo;fails&rdquo; for a perfectly well-qualified
          practitioner &mdash; the search was aimed at the wrong register.
        </p>

        <h2>Finding the right council</h2>
        <p>
          The register&rsquo;s own search carries the authoritative council list in its dropdown, and that
          list is the one to trust &mdash; councils change, and any list republished elsewhere, including
          this page, goes stale. Start at nmc.org.in, open the register search, and read the council names
          there.
        </p>
        <p>Practically, in order:</p>
        <ul>
          <li>Search the number under the council printed on the prescription or the profile.</li>
          <li>If nothing, search the same number with the prefix stripped.</li>
          <li>If still nothing, try the council of the state where they studied, not where they practise.</li>
          <li>If still nothing, try that state&rsquo;s historic councils.</li>
          <li>Failing all of that, search by name within the state&rsquo;s councils and read the entries.</li>
          <li>If the practitioner is a dentist or works in an AYUSH system, use the relevant council instead.</li>
        </ul>
        <p>
          We ran exactly this sequence across our own directory, and{" "}
          <a href="/health-guides/checking-registration-numbers-against-the-register">
            what came back
          </a>{" "}
          is worth reading before you trust a registration number printed anywhere, ours included.
        </p>
      </>
    ),
  },
];
