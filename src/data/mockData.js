// Seha SportsMed Platform - Mock Data & Deterministic Generator

export const CFG = {
  org: {
    ar: "منظومة «صحة» للرياضيين",
    en: "Seha SportsMed Platform",
    sub: {
      ar: "الحجز الإلكتروني والشهادات الطبية الموثقة",
      en: "e-Booking & verified medical certificates"
    },
    decree: {
      ar: "قرار 1642 / 2024",
      en: "Decree 1642 / 2024"
    },
    owner: {
      ar: "المؤسسة العلاجية · إدارة نظم المعلومات والتحول الرقمي",
      en: "Curative Organization · IT & Digital Transformation"
    },
    author: {
      ar: "م. أشرف طلعت · مدير إدارة نظم المعلومات والتحول الرقمي",
      en: "Eng. Ashraf Talaat · Director, IT & Digital Transformation"
    }
  },
  levels: [
    {
      id: 1,
      ar: "المستوى الأول — الممارسة العامة",
      en: "Level 1 — General Practice",
      fee: 250,
      ex: ["اشتراطات سلامة عامة"]
    },
    {
      id: 2,
      ar: "المستوى الثاني — الأكاديميات",
      en: "Level 2 — Academies",
      fee: 250,
      ex: ["تاريخ مرضي", "كشف إكلينيكي وباطنة", "رسم قلب ECG", "صورة دم كاملة"]
    },
    {
      id: 3,
      ar: "المستوى الثالث — بطولات الجمهورية",
      en: "Level 3 — National Championships",
      fee: 500,
      ex: ["كل فحوصات المستوى الثاني", "إيكو (موجات صوتية على القلب)"]
    },
    {
      id: 4,
      ar: "المستوى الرابع — المنتخبات القومية",
      en: "Level 4 — National Teams",
      fee: 800,
      ex: ["كل فحوصات المستوى الثالث", "رسم قلب بالمجهود"]
    }
  ],
  autoFee: 100,
  valid: 12,
  govs: [
    "القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "الدقهلية",
    "أسيوط", "الشرقية", "الغربية", "المنوفية", "البحيرة"
  ],
  sports: [
    "كرة القدم", "كرة اليد", "السباحة", "كرة السلة", "ألعاب القوى",
    "الكرة الطائرة", "الجمباز", "التايكوندو", "الإسكواش", "الملاكمة"
  ],
  parts: [
    ["ممارسة عامة", "General practice"],
    ["أكاديمية", "Academy"],
    ["بطولات جمهورية", "National championships"],
    ["منتخب قومي", "National team"]
  ],
  shifts: [
    { d: "السبت", f: "09:00", t: "15:00", c: 40 },
    { d: "الأحد", f: "09:00", t: "15:00", c: 40 },
    { d: "الاثنين", f: "09:00", t: "15:00", c: 40 },
    { d: "الثلاثاء", f: "09:00", t: "15:00", c: 40 },
    { d: "الأربعاء", f: "09:00", t: "15:00", c: 40 },
    { d: "الخميس", f: "09:00", t: "13:00", c: 24 }
  ],
  pay: [
    ["بطاقة بنكية", "Bank card"],
    ["محفظة إلكترونية", "e-Wallet"],
    ["فوري", "Fawry"],
    ["نقدي بالمستشفى", "Cash at hospital"]
  ],
  scopes: [
    ["النتيجة والشهادة فقط", "Outcome & certificate only"],
    ["مع تفاصيل طبية", "With medical details"]
  ],
  durs: [
    ["24 ساعة", "24 hours"],
    ["7 أيام", "7 days"],
    ["30 يومًا", "30 days"],
    ["نهاية الموسم", "End of season"]
  ],
  ref: [
    ["لغط قلبي", "Cardiac murmur"],
    ["ارتفاع ضغط", "Hypertension"],
    ["ربو", "Asthma"],
    ["إصابة عظام", "Orthopedic"],
    ["أنيميا", "Anemia"],
    ["اضطراب رسم قلب", "ECG anomaly"]
  ],
  stages: [
    ["تم التحويل", "Referred"],
    ["استشارة تخصصية", "Specialist consult"],
    ["فحوص إضافية", "Further tests"],
    ["علاج ومتابعة", "Treatment"],
    ["أعيد التقييم", "Re-assessed"]
  ]
};

export const GOV_EN = {
  "القاهرة": "Cairo",
  "الجيزة": "Giza",
  "الإسكندرية": "Alexandria",
  "القليوبية": "Qalyubia",
  "الدقهلية": "Dakahlia",
  "أسيوط": "Assiut",
  "الشرقية": "Sharqia",
  "الغربية": "Gharbia",
  "المنوفية": "Monufia",
  "البحيرة": "Beheira"
};

export const SP_EN = {
  "كرة القدم": "Football",
  "كرة اليد": "Handball",
  "السباحة": "Swimming",
  "كرة السلة": "Basketball",
  "ألعاب القوى": "Athletics",
  "الكرة الطائرة": "Volleyball",
  "الجمباز": "Gymnastics",
  "التايكوندو": "Taekwondo",
  "الإسكواش": "Squash",
  "الملاكمة": "Boxing"
};

export const MON_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
export const MON_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(o, lang = 'ar') {
  if (!o || !o.d) return '—';
  return `${o.d} ${lang === 'ar' ? MON_AR[o.m - 1] : MON_EN[o.m - 1]} ${o.y}`;
}

export function todayFormatted() {
  const d = new Date();
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

// Deterministic generator functions
let _s = 20261015;
function rnd(n) {
  _s = (_s * 1103515245 + 12345) & 0x7fffffff;
  return _s % n;
}

function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

function quota(pairs) {
  const out = [];
  pairs.forEach(p => {
    for (let i = 0; i < p[1]; i++) out.push(p[0]);
  });
  return shuffle(out);
}

export function generateSeedData() {
  const players = [
    {
      id: "P-1001",
      nid: "30408150104829",
      name: "أحمد يوسف السيد",
      g: "M",
      age: 16,
      gov: "القاهرة",
      sp: 0, // كرة القدم
      lv: 3,
      bk: "BK-26-018245",
      st: "fit",
      ct: "SH-26-004517",
      ch: "app",
      hs: 0,
      cl: 0,
      gd: "يوسف عبدالله السيد",
      rel: { ar: "الابن (حساب رياضي)", en: "Son (Athlete Profile)", isPrimary: true },
      iss: { y: 2026, m: 10, d: 15 },
      exp: { y: 2027, m: 10, d: 14 },
      dobm: 5,
      dobd: 12,
      doby: 2010,
      bp: "118/74",
      hr: 68,
      fp: "4A8B 90C1 0E2F 33B9",
      tm: "10:30",
      verificationStatus: "verified",
      medicalHistory: [
        {
          id: "MH-P-1001-1",
          date: "15/10/2026",
          dateEn: "15 Oct 2026",
          season: "2026 / 2027",
          level: 3,
          levelNameAr: "المستوى الثالث — بطولات الجمهورية",
          levelNameEn: "Level 3 — National Championships",
          hospitalAr: "مستشفى هليوبوليس التخصصي",
          hospitalEn: "Heliopolis Specialized Hospital",
          doctorAr: "د. طارق محمود المنشاوي · استشاري طب القلب الرياضي",
          doctorEn: "Dr. Tarek El-Menshawy · Sports Cardiology Consultant",
          status: "fit",
          statusLabelAr: "لائق طبيًا للمنافسات",
          statusLabelEn: "Medically Fit for Sports",
          vitals: {
            bp: "118/74",
            hr: 68,
            bmi: "21.2",
            height: 165,
            weight: 58
          },
          tests: [
            { nameAr: "الفحص السريري والباطني الشامل", nameEn: "Clinical & Internal Exam", resultAr: "سليم تمامًا دون لغط قلبي أو تضخم", resultEn: "Normal clinical evaluation", normal: true },
            { nameAr: "تخطيط رسم القلب الكهربائي (Resting ECG)", nameEn: "Resting ECG", resultAr: "نظم جيبي طبيعي سليم (Sinus Rhythm) - التوصيل سليم", resultEn: "Normal Sinus Rhythm", normal: true },
            { nameAr: "الموجات الصوتية للقلب (ECHO)", nameEn: "Echocardiogram (ECHO)", resultAr: "كفاءة العضلة 64% والصمامات طبيعية دون عيوب خلقية", resultEn: "Normal EF 64%, no valvular defects", normal: true },
            { nameAr: "تحليل صورة الدم الكاملة (CBC)", nameEn: "Complete Blood Count (CBC)", resultAr: "الهيموجلوبين 14.2 g/dL وكرات الدم بالحدود الطبيعية", resultEn: "Hemoglobin 14.2 g/dL, normal parameters", normal: true }
          ],
          notesAr: "تم الفحص واعتماد الشهادة بنجاح؛ الرياضي مؤهل تمامًا للمشاركة الرياضية والتنافسية المعتمدة.",
          notesEn: "Exam completed and certified; athlete is cleared for competitive sports participation.",
          digitalSign: "SHA256-SEHA-MED-2026-P-1001"
        }
      ]
    },
    {
      id: "P-1002",
      nid: "30806120104829",
      name: "مريم أحمد يوسف",
      g: "F",
      age: 14,
      gov: "القاهرة",
      sp: 4, // ألعاب القوى
      lv: 2,
      bk: "BK-26-018246",
      st: "fit",
      ct: "SH-26-004518",
      ch: "app",
      hs: 0,
      cl: 0,
      gd: "يوسف عبدالله السيد",
      rel: { ar: "الابنة (تابع عائلي)", en: "Daughter (Dependent)", isPrimary: false },
      iss: { y: 2026, m: 10, d: 18 },
      exp: { y: 2027, m: 10, d: 17 },
      dobm: 8,
      dobd: 20,
      doby: 2012,
      bp: "112/70",
      hr: 72,
      fp: "7B2C 11D4 2F9A 88E1",
      tm: "11:15",
      verificationStatus: "verified",
      medicalHistory: [
        {
          id: "MH-P-1002-1",
          date: "18/10/2026",
          dateEn: "18 Oct 2026",
          season: "2026 / 2027",
          level: 2,
          levelNameAr: "المستوى الثاني — الأكاديميات",
          levelNameEn: "Level 2 — Academies",
          hospitalAr: "مستشفى هليوبوليس التخصصي",
          hospitalEn: "Heliopolis Specialized Hospital",
          doctorAr: "د. سارة كامل · استشاري الطب الرياضي",
          doctorEn: "Dr. Sarah Kamel · Sports Medicine Consultant",
          status: "fit",
          statusLabelAr: "لائق طبيًا للمنافسات",
          statusLabelEn: "Medically Fit for Sports",
          vitals: {
            bp: "112/70",
            hr: 72,
            bmi: "19.8",
            height: 158,
            weight: 49
          },
          tests: [
            { nameAr: "الفحص الإكلينيكي الشامل", nameEn: "Clinical Exam", resultAr: "سليم ولائق للمنافسات", resultEn: "Normal", normal: true },
            { nameAr: "رسم القلب الكهربائي ECG", nameEn: "Resting ECG", resultAr: "نظم جيبي طبيعي سليم", resultEn: "Normal Sinus Rhythm", normal: true },
            { nameAr: "تحاليل معملية وصورة دم", nameEn: "CBC Lab", resultAr: "ضمن المعدلات الطبيعية", resultEn: "Normal", normal: true }
          ],
          notesAr: "فحص طبي رياضي معتمد لألعاب القوى للناشئين؛ لائقة تمامًا.",
          notesEn: "Approved sports medical examination for youth athletics.",
          digitalSign: "SHA256-SEHA-MED-2026-P-1002"
        }
      ]
    }
  ];

  const clubs = [
    {
      id: "CL-101",
      n: "نادي المستقبل الرياضي",
      nEn: "Al-Mostakbal Sports Club",
      type: "نادي",
      typeEn: "Club",
      gov: "القاهرة",
      ph: "01012345678",
      mgr: "م. خالد حمدي",
      mgrEn: "Eng. Khaled Hamdi",
      players: 2,
      st: "on"
    }
  ];

  const hosps = [
    {
      id: "HS-201",
      n: "مستشفى هليوبوليس التخصصي",
      nEn: "Heliopolis Specialized Hospital",
      gov: "القاهرة",
      lv: [2, 3, 4],
      cap: 40,
      dir: "د. سارة كامل",
      dirEn: "Dr. Sarah Kamel",
      ph: "02-22446688",
      st: "on"
    }
  ];

  const consents = [
    { p: players[0], to: "نادي المستقبل الرياضي", sc: 0, du: 3, st: "ok" },
    { p: players[1], to: "نادي المستقبل الرياضي", sc: 0, du: 3, st: "ok" }
  ];

  const audit = [
    ["09:12", "HS-201", "مسح حجز BK-26-018245 ومطابقة هوية أحمد يوسف السيد", "Scanned BK-26-018245 & matched ID"],
    ["09:40", "د. سارة كامل", "اعتماد نتيجة: لائق — SH-26-004517 (أحمد يوسف السيد)", "Approved: Fit — SH-26-004517"],
    ["10:15", "ولي الأمر", "الاطلاع على الملف الطبي المعتمد لمريم أحمد يوسف", "Viewed certified medical profile for Maryam"],
    ["10:30", "نظام صحة", "إصدار شهادة SH-26-004518 وتوثيقها بختم إلكتروني", "Issued e-signed certificate SH-26-004518"]
  ];

  const ash = [];

  return { players, clubs, hosps, consents, audit, ash, cfg: JSON.parse(JSON.stringify(CFG)) };
}
