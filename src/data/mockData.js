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
  _s = 20261015;
  const players = [];
  const clubs = [];
  const hosps = [];
  const consents = [];
  const audit = [];
  const ash = [];

  const fm = ["أحمد", "محمد", "عمر", "كريم", "مصطفى", "يوسف", "مالك", "زياد", "حمزة", "سلمى", "فاطمة", "جنى", "ملك", "هنا", "مريم", "نور"];
  const ln = ["السيد", "إبراهيم", "حسن", "عادل", "خليل", "فرج", "رمضان", "صبري", "عبدالله", "منصور"];

  const govs = quota([
    ["القاهرة", 71], ["الجيزة", 44], ["الإسكندرية", 29], ["القليوبية", 17],
    ["الدقهلية", 11], ["أسيوط", 8], ["الشرقية", 6], ["الغربية", 5],
    ["المنوفية", 5], ["البحيرة", 4]
  ]);

  const sports = quota([
    [0, 70], [1, 26], [2, 18], [3, 17], [4, 16],
    [5, 15], [6, 12], [7, 10], [8, 9], [9, 7]
  ]);

  const ages = quota([["a", 60], ["b", 55], ["c", 48], ["d", 27], ["e", 10]]);
  const gender = quota([["M", 135], ["F", 65]]);
  const status = quota([["fit", 128], ["cond", 29], ["exp", 28], ["book", 15]]);
  const chan = quota([["app", 100], ["club", 100]]);

  for (let i = 0; i < 200; i++) {
    const band = ages[i];
    const a = band === "a" ? 9 + rnd(4) : band === "b" ? 13 + rnd(3) : band === "c" ? 16 + rnd(3) : band === "d" ? 19 + rnd(5) : 24 + rnd(8);
    const g = gender[i];
    const name = (g === "M" ? fm[rnd(9)] : fm[9 + rnd(7)]) + " " + ln[rnd(ln.length)] + " " + ln[rnd(ln.length)];
    const padded = String(4000 + i).padStart(6, '0');
    
    players.push({
      id: "P-" + (1001 + i),
      nid: "3" + String(1000000000000 + rnd(899999999) * 1000 + rnd(999)),
      name: name,
      g: g,
      age: a,
      gov: govs[i],
      sp: sports[i],
      lv: a < 13 ? 2 : (rnd(10) < 6 ? 3 : 2),
      bk: "BK-26-" + (10000 + rnd(89999)),
      st: status[i],
      ct: "SH-26-" + padded,
      ch: chan[i],
      hs: rnd(4)
    });
  }

  players.forEach((p, i) => {
    const nm = p.name.split(" ");
    p.gd = nm[1] + " " + nm[2] + " " + ln[rnd(ln.length)];
    p.cl = rnd(5);
    p.hs = rnd(4);
    const y = p.st === "exp" ? 2025 : 2026;
    const m = p.st === "exp" ? 5 + rnd(5) : 6 + rnd(5);
    const d = 1 + rnd(28);
    p.iss = { y: y, m: m, d: d };
    p.exp = { y: y + 1, m: m, d: d };
    p.dobm = 1 + rnd(12);
    p.dobd = 1 + rnd(28);
    p.doby = 2026 - p.age;
    p.bp = (108 + rnd(16)) + "/" + (66 + rnd(14));
    p.hr = 58 + rnd(24);

    let h = 0;
    const t = p.ct + p.nid;
    for (let k = 0; k < t.length; k++) h = (h * 33 + t.charCodeAt(k)) >>> 0;
    let fp = ("0000000" + h.toString(16)).slice(-8).toUpperCase();
    p.fp = fp.slice(0, 4) + " " + fp.slice(4) + " " + ("000" + (h % 4096).toString(16)).slice(-4).toUpperCase() + " " + ("000" + ((h >> 5) % 4096).toString(16)).slice(-4).toUpperCase();
    p.tm = (9 + rnd(5)) + ":" + ("0" + rnd(60)).slice(-2);
    if (p.st === "cond") p.rf = rnd(6);
  });

  // Deterministic Family Group anchor (Ahmad Youssef El-Sayed & Family Dependents)
  players[0].name = "أحمد يوسف السيد";
  players[0].g = "M";
  players[0].gd = "يوسف عبدالله السيد";
  players[0].rel = { ar: "الحساب الرئيسي", en: "Primary Profile", isPrimary: true };
  players[0].cl = 0;
  players[0].hs = 0;
  players[0].iss = { y: 2026, m: 10, d: 15 };
  players[0].exp = { y: 2027, m: 10, d: 14 };
  players[0].doby = 2010;
  players[0].dobm = 5;
  players[0].dobd = 12;
  players[0].st = "fit";
  players[0].sp = 0; // كرة القدم
  players[0].age = 16;
  players[0].lv = 3;
  players[0].ct = "SH-26-004517";
  players[0].bk = "BK-26-018245";
  players[0].gov = "القاهرة";

  // Family Dependent 1 (Daughter - Gymnastics)
  if (players[1]) {
    players[1].name = "مريم أحمد يوسف";
    players[1].g = "F";
    players[1].gd = "أحمد يوسف السيد";
    players[1].rel = { ar: "الابنة (تابع عائلي)", en: "Daughter (Dependent)", isPrimary: false };
    players[1].age = 12;
    players[1].sp = 4; // جمباز
    players[1].st = "fit";
    players[1].lv = 2;
    players[1].ct = "SH-26-004518";
    players[1].bk = "BK-26-018246";
  }

  // Family Dependent 2 (Son - Taekwondo)
  if (players[2]) {
    players[2].name = "عمر أحمد يوسف";
    players[2].g = "M";
    players[2].gd = "أحمد يوسف السيد";
    players[2].rel = { ar: "الابن (تابع عائلي)", en: "Son (Dependent)", isPrimary: false };
    players[2].age = 14;
    players[2].sp = 3; // تايكوندو
    players[2].st = "fit";
    players[2].lv = 2;
    players[2].ct = "SH-26-004519";
    players[2].bk = "BK-26-018247";
  }

  // Family Dependent 3 (Son - Swimming)
  if (players[3]) {
    players[3].name = "ياسين أحمد يوسف";
    players[3].g = "M";
    players[3].gd = "أحمد يوسف السيد";
    players[3].rel = { ar: "الابن (تابع عائلي)", en: "Son (Dependent)", isPrimary: false };
    players[3].age = 10;
    players[3].sp = 2; // سباحة
    players[3].st = "cond";
    players[3].lv = 1;
    players[3].ct = "SH-26-004520";
    players[3].bk = "BK-26-018248";
  }

  // Family Dependent 4 (Daughter - Karate)
  if (players[4]) {
    players[4].name = "نور أحمد يوسف";
    players[4].g = "F";
    players[4].gd = "أحمد يوسف السيد";
    players[4].rel = { ar: "الابنة (تابع عائلي)", en: "Daughter (Dependent)", isPrimary: false };
    players[4].age = 8;
    players[4].sp = 5; // كاراتيه
    players[4].st = "fit";
    players[4].lv = 1;
    players[4].ct = "SH-26-004521";
    players[4].bk = "BK-26-018249";
  }

  const cn = [
    { ar: "نادي المستقبل الرياضي", en: "Al-Mostakbal Sports Club", typeAr: "نادي", typeEn: "Club", mgrAr: "م. خالد حمدي", mgrEn: "Eng. Khaled Hamdi" },
    { ar: "أكاديمية النيل لكرة القدم", en: "Nile Football Academy", typeAr: "أكاديمية", typeEn: "Academy", mgrAr: "أ. منى عبدالرحمن", mgrEn: "Ms. Mona Abdulrahman" },
    { ar: "نادي الصيد", en: "Shooting Club (Al-Seid)", typeAr: "نادي", typeEn: "Club", mgrAr: "ك. طارق سعيد", mgrEn: "Coach Tarek Saeed" },
    { ar: "مركز شباب سموحة", en: "Smouha Youth Center", typeAr: "مركز شباب", typeEn: "Youth Center", mgrAr: "أ. هاني فتحي", mgrEn: "Mr. Hany Fathy" },
    { ar: "أكاديمية الأهرام للسباحة", en: "Al-Ahram Swimming Academy", typeAr: "أكاديمية", typeEn: "Academy", mgrAr: "د. ريم عاطف", mgrEn: "Dr. Reem Atef" }
  ];
  cn.forEach((c, i) => {
    clubs.push({
      id: "CL-" + (101 + i),
      n: c.ar,
      nEn: c.en,
      type: c.typeAr,
      typeEn: c.typeEn,
      gov: CFG.govs[i % 4],
      ph: "010" + (10000000 + rnd(89999999)),
      mgr: c.mgrAr,
      mgrEn: c.mgrEn,
      players: [42, 38, 27, 22, 19][i],
      st: i < 4 ? "on" : "pend"
    });
  });

  const hn = [
    { ar: "مستشفى هليوبوليس التخصصي", en: "Heliopolis Specialized Hospital", gov: "القاهرة", lv: [2, 3, 4], cap: 40, dirAr: "د. سارة كامل", dirEn: "Dr. Sarah Kamel" },
    { ar: "مستشفى النيل بدر", en: "Nile Badr Hospital", gov: "القاهرة", lv: [2, 3], cap: 30, dirAr: "د. وليد منير", dirEn: "Dr. Walid Mounir" },
    { ar: "وحدة الطب الرياضي — المعادي", en: "Sports Medicine Unit — Maadi", gov: "القاهرة", lv: [2, 3, 4], cap: 36, dirAr: "د. ياسر الشافعي", dirEn: "Dr. Yasser El-Shafei" },
    { ar: "مستشفى الإسكندرية الدولي", en: "Alexandria International Hospital", gov: "الإسكندرية", lv: [2, 3], cap: 28, dirAr: "د. نهى رشاد", dirEn: "Dr. Noha Rashad" }
  ];
  hn.forEach((h, i) => {
    hosps.push({
      id: "HS-" + (201 + i),
      n: h.ar,
      nEn: h.en,
      gov: h.gov,
      lv: h.lv,
      cap: h.cap,
      dir: h.dirAr,
      dirEn: h.dirEn,
      ph: "02-2" + (1000000 + rnd(8999999)),
      st: i < 3 ? "on" : "pend"
    });
  });

  consents.push(
    { p: players[0], to: "نادي المستقبل الرياضي", sc: 0, du: 3, st: "ok" },
    { p: players[3], to: "الاتحاد المصري لكرة القدم", sc: 0, du: 2, st: "ok" },
    { p: players[6], to: "أكاديمية النيل لكرة القدم", sc: 1, du: 0, st: "rej" }
  );

  audit.push(
    ["09:12", "HS-201", "مسح حجز BK-26-018245 ومطابقة الهوية", "Scanned BK-26-018245 & matched ID"],
    ["09:40", "د. سارة كامل", "اعتماد نتيجة: لائق — SH-26-004517", "Approved: Fit — SH-26-004517"],
    ["10:05", "CL-101", "طلب حجز جماعي — 22 لاعبًا", "Bulk booking request — 22 players"],
    ["10:31", "مواطن", "منح موافقة اطلاع — 30 يومًا", "Access consent granted — 30 days"]
  );

  const reasons = quota([[0, 8], [1, 5], [2, 5], [3, 5], [4, 4], [5, 2]]);
  const stages = quota([[0, 8], [1, 5], [2, 4], [3, 5], [4, 7]]);
  players.filter(p => p.st === "cond").forEach((p, i) => {
    ash.push({
      p: p,
      r: reasons[i],
      s: stages[i],
      d: "2026-" + (9 + rnd(2)) + "-" + (10 + rnd(18))
    });
  });

  return { players, clubs, hosps, consents, audit, ash, cfg: JSON.parse(JSON.stringify(CFG)) };
}
