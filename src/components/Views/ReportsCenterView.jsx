import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { IC, ECG_SVG } from '../../data/icons';
import { todayFormatted } from '../../data/mockData';
import { 
  BarChart3, 
  Building2, 
  Users, 
  HeartHandshake, 
  TrendingUp, 
  Milestone, 
  Printer, 
  Download, 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  Eye, 
  CheckCircle2, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';

export const ReportsCenterView = () => {
  const { isRTL, L } = useLanguage();
  const {
    selectedReport,
    setSelectedReport,
    stats,
    countBy,
    bands,
    ash,
    hosps,
    clubs,
    cfg,
    players,
    showToast,
    GOV_EN,
    SP_EN
  } = useSeha();

  // Slide scaling
  useEffect(() => {
    const fitSlides = () => {
      const ws = document.querySelectorAll('.slidewrap');
      for (let i = 0; i < ws.length; i++) {
        const w = ws[i];
        const s = Math.min(1, (w.clientWidth || 1120) / 1120);
        w.style.height = `${630 * s}px`;
        if (w.firstElementChild) {
          w.firstElementChild.style.transform = `scale(${s})`;
          w.firstElementChild.style.transformOrigin = 'top left';
        }
      }
    };
    fitSlides();
    window.addEventListener('resize', fitSlides);
    return () => window.removeEventListener('resize', fitSlides);
  }, [selectedReport]);

  const s = stats;
  const gl = countBy(p => (isRTL ? p.gov : GOV_EN[p.gov] || p.gov), 6);
  const sl = countBy(p => {
    const sp = cfg.sports[p.sp] || '';
    return isRTL ? sp : SP_EN[sp] || sp;
  }, 6);
  const bList = bands;

  const male = players.filter(p => p.g === 'M').length;
  const app = players.filter(p => p.ch === 'app').length;

  const stg = [0, 0, 0, 0, 0];
  const rs = [0, 0, 0, 0, 0, 0];
  ash.forEach(a => {
    if (stg[a.s] !== undefined) stg[a.s]++;
    if (rs[a.r] !== undefined) rs[a.r]++;
  });

  const topGovPct = gl.length >= 3 ? Math.round(((gl[0][1] + gl[1][1] + gl[2][1]) / s.total) * 100) : 70;
  const u16 = bList[0]?.n + bList[1]?.n;

  // Slide building helpers with Clinical Confidence styling
  const statCard = (v, l, cls) => (
    <div className={`sc stat ${cls || ''}`}>
      <b>{v}</b>
      <span>{l}</span>
    </div>
  );

  const numCard = (n, t, p) => (
    <div className="scard" style={{ border: '1px solid var(--line)', background: '#FFFFFF' }}>
      <div className="n" style={{ background: 'var(--brand)', color: '#FFFFFF', fontWeight: 800 }}>{n}</div>
      <b style={{ color: 'var(--brand)', fontSize: '14px' }}>{t}</b>
      <p style={{ color: 'var(--muted)', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>{p}</p>
    </div>
  );

  const icCard = (ic, t, p) => (
    <div className="scard" style={{ border: '1px solid var(--line)', background: '#FFFFFF' }}>
      <div style={{ color: 'var(--primary)', marginBottom: '8px' }}>
        {IC[ic]}
      </div>
      <b style={{ color: 'var(--brand)', fontSize: '14.5px' }}>{t}</b>
      <p style={{ color: 'var(--muted)', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>{p}</p>
    </div>
  );

  const sBars = (list, cls, cp) => {
    if (!list || !list.length) return null;
    const mx = list[0][1] || 1;
    return list.map((g, idx) => (
      <div key={idx} className="bar" style={{ fontSize: '13px', marginBottom: cp ? '7px' : '11px' }}>
        <b style={{ width: '130px', color: 'var(--brand)', fontWeight: 700 }}>{g[0]}</b>
        <span className="tr" style={{ height: cp ? '14px' : '18px', background: 'var(--teal-soft)', borderRadius: '5px' }}>
          <span
            className={`fl ${cls || ''}`}
            style={{
              width: `${Math.max(3, Math.round((g[1] / mx) * 100))}%`,
              background: cls === 'r' ? 'var(--error)' : 'var(--primary)',
              borderRadius: '5px'
            }}
          />
        </span>
        <i style={{ width: '44px', fontSize: '14px', color: 'var(--brand)', fontFeatureSettings: '"tnum"' }}>{g[1]}</i>
      </div>
    ));
  };

  const sTable = (heads, rows) => (
    <table className="st" style={{ border: '1px solid var(--line)', borderRadius: '10px', overflow: 'hidden' }}>
      <thead>
        <tr>
          {heads.map((h, i) => (
            <th key={i} style={{ background: 'var(--brand)', color: '#FFFFFF', padding: '10px 14px', fontWeight: 700, fontSize: '12.5px' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 1 ? 'rgba(244, 247, 250, 0.7)' : '#FFFFFF' }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)', fontSize: '12.5px' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const todayFin = players.filter(p => p.hs === 0 && (p.st === 'fit' || p.st === 'cond')).slice(0, 8);
  const todayBk = players.filter(p => p.st === 'book').slice(0, 4);
  const hospTodayList = [...todayFin, ...todayBk];
  const hospDone = hospTodayList.filter(p => p.st !== 'book').length;

  const clubRoster = players.slice(0, 10);
  const clubValid = clubRoster.filter(p => p.st === 'fit').length;

  // Reports data definition
  const REPORTS = {
    exec: {
      ic: BarChart3,
      tag: ['القيادة التنفيذية', 'Executive Leadership'],
      t: ['التقرير التنفيذي — لوحة المؤشرات', 'Executive report — dashboard'],
      d: ['ملخص المتقدمين والشهادات والتوزيع الجغرافي والرياضي ومسار «أشبالنا».', 'Applicants, certificates, geographic & sport mix and the Ashbalna track.'],
      build: () => [
        // Slide 1: Cover
        <div className="slide dk" style={{ justifyContent: 'center', background: 'var(--brand)' }}>
          {ECG_SVG}
          <div className="cv-org">{L(cfg.org.owner.ar, cfg.org.owner.en)}</div>
          <h2 className="cv-title">{L('التقرير التنفيذي', 'Executive Report')}</h2>
          <div className="cv-sub">{L('منظومة «صحة» — الحجز الإلكتروني والشهادات الطبية الموثقة للرياضيين', 'Seha — e-booking and verified medical certificates for athletes')}</div>
          <div className="cv-meta">{L('لوحة المؤشرات · بيانات تجريبية', 'Dashboard · pilot data')} · {todayFormatted()}</div>
        </div>,
        // Slide 2
        <div className="slide dk" style={{ background: 'var(--brand)' }}>
          <div className="lbl">{L('لوحة المؤشرات — بيانات تجريبية', 'Dashboard — pilot data')}</div>
          <h2 className="hl">{s.total} {L('لاعب تقدموا، و', 'applicants, and ')}{s.issued} {L('شهادة صدرت', 'certificates issued')}</h2>
          <div className="sb">
            <div className="sgrid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {statCard(s.total, L('إجمالي المتقدمين', 'Total applicants'))}
              {statCard(s.issued, L('شهادة صادرة', 'Certificates issued'))}
              {statCard(s.fit, L('لائق — شهادة سارية', 'Fit — valid certificate'), 'gn')}
              {statCard(s.cond, L('محوّلون إلى «أشبالنا»', 'Ashbalna referrals'), 'am')}
              {statCard(s.exp, L('شهادة تحتاج تجديدًا', 'Due for renewal'))}
              {statCard(s.book, L('حجز مؤكد بانتظار الكشف', 'Booked, awaiting exam'), 'bl')}
            </div>
          </div>
          <div className="sf">
            <span>{L('الرسوم: 250 / 500 / 800 ج.م حسب المستوى + 100 ج.م رسم ميكنة · صلاحية 12 شهرًا', 'Fees: 250 / 500 / 800 EGP by level + 100 EGP automation · 12-month validity')}</span>
            <span className="pn">2 / 7</span>
          </div>
        </div>,
        // Slide 3
        <div className="slide">
          <div className="lbl">{L('التوزيع الجغرافي والرياضي', 'Geographic & sport distribution')}</div>
          <h2 className="hl">{topGovPct}% {L('من المتقدمين من القاهرة الكبرى والإسكندرية، وكرة القدم تتصدر', 'of applicants come from Greater Cairo & Alexandria; football leads')}</h2>
          <div className="sb">
            <div className="sgrid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="sc">
                <b style={{ display: 'block', marginBottom: '12px', fontSize: '14px', color: 'var(--brand)' }}>{L('حسب المحافظة', 'By governorate')}</b>
                {sBars(gl)}
              </div>
              <div className="sc">
                <b style={{ display: 'block', marginBottom: '12px', fontSize: '14px', color: 'var(--brand)' }}>{L('حسب اللعبة', 'By sport')}</b>
                {sBars(sl)}
              </div>
            </div>
          </div>
          <div className="sf">
            <span>{L('المصدر: سجل الحجوزات — ', 'Source: booking registry — ')}{todayFormatted()}</span>
            <span className="pn">3 / 7</span>
          </div>
        </div>,
        // Slide 4
        <div className="slide">
          <div className="lbl">{L('الفئات العمرية والقنوات', 'Age bands & channels')}</div>
          <h2 className="hl">{Math.round((u16 / s.total) * 100)}% {L('من المتقدمين دون 16 سنة — ونسبة اللياقة مرتفعة في كل الفئات', 'of applicants are under 16 — fitness rates are high across bands')}</h2>
          <div className="sb">
            <div className="sgrid" style={{ gridTemplateColumns: 'repeat(5,1fr)', gap: '14px', marginBottom: '18px' }}>
              {bList.map((x, i) => (
                <div key={i} className="sc" style={{ textAlign: 'center', border: '1px solid var(--line)' }}>
                  <b style={{ fontSize: '36px', color: 'var(--brand)', display: 'block', fontFeatureSettings: '"tnum"' }}>{x.n}</b>
                  <span className="mut" style={{ fontSize: '12px' }}>{isRTL ? x.lAr : x.lEn}</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--positive)', marginTop: '6px' }}>
                    {x.pct}% {L('لائق', 'fit')}
                  </div>
                </div>
              ))}
            </div>
            <div className="sgrid" style={{ gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="sc" style={{ border: '1px solid var(--line)' }}>
                <b style={{ fontSize: '14px', color: 'var(--brand)' }}>{L('النوع', 'Gender')}</b>
                <div className="bar" style={{ marginTop: '10px', fontSize: '13px' }}>
                  <b style={{ width: '70px', color: 'var(--brand)' }}>{L('ذكور', 'Male')}</b>
                  <span className="tr" style={{ height: '16px', background: 'var(--teal-soft)' }}>
                    <span className="fl" style={{ width: `${Math.round((male / s.total) * 100)}%`, background: 'var(--primary)' }}></span>
                  </span>
                  <i style={{ color: 'var(--brand)' }}>{male}</i>
                </div>
                <div className="bar" style={{ fontSize: '13px' }}>
                  <b style={{ width: '70px', color: 'var(--brand)' }}>{L('إناث', 'Female')}</b>
                  <span className="tr" style={{ height: '16px', background: 'var(--teal-soft)' }}>
                    <span className="fl" style={{ width: `${Math.round(((s.total - male) / s.total) * 100)}%`, background: 'var(--positive)' }}></span>
                  </span>
                  <i style={{ color: 'var(--brand)' }}>{s.total - male}</i>
                </div>
              </div>
              <div className="sc" style={{ border: '1px solid var(--line)' }}>
                <b style={{ fontSize: '14px', color: 'var(--brand)' }}>{L('قناة الحجز', 'Booking channel')}</b>
                <div className="bar" style={{ marginTop: '10px', fontSize: '13px' }}>
                  <b style={{ width: '110px', color: 'var(--brand)' }}>{L('تطبيق المواطن', 'Citizen app')}</b>
                  <span className="tr" style={{ height: '16px', background: 'var(--teal-soft)' }}>
                    <span className="fl" style={{ width: `${Math.round((app / s.total) * 100)}%`, background: 'var(--primary)' }}></span>
                  </span>
                  <i style={{ color: 'var(--brand)' }}>{app}</i>
                </div>
                <div className="bar" style={{ fontSize: '13px' }}>
                  <b style={{ width: '110px', color: 'var(--brand)' }}>{L('حجز جماعي (نادي)', 'Club bulk')}</b>
                  <span className="tr" style={{ height: '16px', background: 'var(--teal-soft)' }}>
                    <span className="fl" style={{ width: `${Math.round(((s.total - app) / s.total) * 100)}%`, background: 'var(--positive)' }}></span>
                  </span>
                  <i style={{ color: 'var(--brand)' }}>{s.total - app}</i>
                </div>
              </div>
            </div>
          </div>
          <div className="sf">
            <span>{L('نسبة اللياقة = الشهادات الصادرة بنتيجة «لائق» ÷ متقدمي الفئة', 'Fitness rate = certificates issued as Fit ÷ band applicants')}</span>
            <span className="pn">4 / 7</span>
          </div>
        </div>,
        // Slide 5
        <div className="slide">
          <div className="lbl">{L('مبادرة «أشبالنا» — ', 'Ashbalna initiative — ')}{s.cond} {L('حالة', 'cases')}</div>
          <h2 className="hl">{L('ثلث الحالات قلبية، ولم يُستبعد أحد دون متابعة', 'A third of cases are cardiac — nobody was excluded without follow-up')}</h2>
          <div className="sb">
            <div className="sgrid" style={{ gridTemplateColumns: 'repeat(5,1fr)', gap: '12px', marginBottom: '14px' }}>
              {cfg.stages.map((st, i) => (
                <div key={i} className="sc" style={{ textAlign: 'center', padding: '12px 14px', border: '1px solid var(--line)', ...(i === 4 ? { background: 'rgba(22, 160, 133, 0.1)', borderColor: 'rgba(22, 160, 133, 0.3)' } : {}) }}>
                  <span className="mut" style={{ fontSize: '12px' }}>{L('المرحلة', 'Stage')} {i + 1}</span>
                  <b style={{ display: 'block', fontSize: '13.5px', color: 'var(--brand)', margin: '3px 0' }}>{L(st[0], st[1])}</b>
                  <b style={{ fontSize: '30px', lineHeight: 1.1, color: i === 4 ? 'var(--positive)' : 'var(--error)', fontFeatureSettings: '"tnum"' }}>{stg[i]}</b>
                </div>
              ))}
            </div>
            <div className="sgrid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="sc" style={{ border: '1px solid var(--line)' }}>
                <b style={{ display: 'block', marginBottom: '10px', fontSize: '14px', color: 'var(--brand)' }}>{L('سبب التحويل', 'Referral reason')}</b>
                {sBars(cfg.ref.map((r, i) => [L(r[0], r[1]), rs[i]]).sort((a, b) => b[1] - a[1]), 'r', true)}
              </div>
              <div className="nt rd" style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.9, alignSelf: 'start', borderRadius: '12px' }}>
                {L(
                  'نتيجة «غير لائق مؤقتًا» أو «لائق بشروط» تفتح حالة متابعة تلقائيًا حتى إعادة التقييم. يرى النادي النتيجة فقط دون التشخيص، ويتابع ولي الأمر المراحل من التطبيق.',
                  'A “temporarily unfit” or “conditionally fit” outcome opens a follow-up case until re-assessment. Clubs see outcome only; guardians track stages in the app.'
                )}
              </div>
            </div>
          </div>
          <div className="sf">
            <span>{L('التشخيص سري — يُعرض للطبيب المعالج وولي الأمر فقط', 'Diagnosis is confidential — visible to treating physician and guardian only')}</span>
            <span className="pn">5 / 7</span>
          </div>
        </div>,
        // Slide 6
        <div className="slide">
          <div className="lbl">{L('دورة العمل', 'Operating cycle')}</div>
          <h2 className="hl">{L('من الحجز إلى الشهادة في ثماني خطوات', 'From booking to certificate in eight steps')}</h2>
          <div className="sb">
            <div className="sgrid" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
              {[
                [L('التسجيل بالرقم القومي', 'National-ID sign-up'), L('المواطن أو ولي الأمر', 'Citizen or guardian')],
                [L('الحجز والموعد', 'Booking & slot'), L('الهاتف أو النادي', 'Phone or club')],
                [L('الاستبيان والدفع', 'Questionnaire & payment'), L('إلكترونيًا بالكامل', 'Fully online')],
                [L('الاستقبال بالرمز', 'Code-based reception'), L('مطابقة هوية بضغطة', 'One-tap ID match')],
                [L('الكشف وتسجيل النتيجة', 'Exam & result entry'), L('جهاز لوحي ومتصفح', 'Tablet & browser')],
                [L('الاعتماد والإصدار', 'Approval & issuance'), L('طبيب معتمد · توقيع إلكتروني', 'Certifier · e-signature')],
                [L('اطلاع بموافقة اللاعب', 'Consent-based access'), L('النادي والاتحاد', 'Club & federation')],
                [L('التحقق بمسح الرمز', 'QR verification'), L('أي جهة مستلمة', 'Any recipient')]
              ].map((x, i) => (
                <div key={i}>{numCard(i + 1, x[0], x[1])}</div>
              ))}
            </div>
          </div>
          <div className="sf">
            <span>{L('يكفي جهاز لوحي ومتصفح للتشغيل داخل المستشفى — دون تركيبات', 'A tablet and browser are enough in-hospital — no installations')}</span>
            <span className="pn">6 / 7</span>
          </div>
        </div>,
        // Slide 7: Close
        <div className="slide dk" style={{ justifyContent: 'center', background: 'var(--brand)' }}>
          {ECG_SVG}
          <h2 className="cv-title" style={{ fontSize: '42px' }}>
            {L('شهادة واحدة، رقمية، موثقة، يملكها المواطن', 'One certificate — digital, verified, owned by the citizen')}
          </h2>
          <div className="cv-sub">
            {L('النموذج التفاعلي متاح للتجربة · تمثّل الشاشات بيانات ', 'Interactive prototype available · screens reflect ')}{s.total}{L(' لاعب', ' demo players')}
          </div>
          <div className="cv-meta">{L(cfg.org.author.ar, cfg.org.author.en)} · {L(cfg.org.owner.ar, cfg.org.owner.en)}</div>
        </div>
      ]
    },

    hosp: {
      ic: Building2,
      tag: ['إدارة المستشفيات', 'Hospital Management'],
      t: ['تقرير التشغيل اليومي — المستشفى', 'Daily operations report — hospital'],
      d: ['كشوفات اليوم، الطاقة والإشغال، والاعتماد والإصدار لمستشفى محددة.', "Today's exams, capacity & utilisation, approvals and issuance for one hospital."],
      build: () => [
        <div className="slide dk" style={{ justifyContent: 'center', background: 'var(--brand)' }}>
          {ECG_SVG}
          <div className="cv-org">{hosps[0]?.n} · {isRTL ? hosps[0]?.gov : GOV_EN[hosps[0]?.gov] || hosps[0]?.gov}</div>
          <h2 className="cv-title">{L('تقرير التشغيل اليومي', 'Daily Operations Report')}</h2>
          <div className="cv-sub">{L('بوابة المستشفى · ', 'Hospital portal · ')}{todayFormatted()}</div>
          <div className="cv-meta">{L(cfg.org.owner.ar, cfg.org.owner.en)}</div>
        </div>,
        <div className="slide dk" style={{ background: 'var(--brand)' }}>
          <div className="lbl">{L('مؤشرات اليوم', "Today's indicators")}</div>
          <h2 className="hl">{hospDone} {L('كشفًا اكتمل من ', 'exams completed out of ')}{hospTodayList.length}{L(' — والإصدار خلال المهلة المستهدفة', ' — issuance within target SLA')}</h2>
          <div className="sb">
            <div className="sgrid" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '18px' }}>
              {statCard(hospTodayList.length, L('كشوفات اليوم', 'Exams today'))}
              {statCard(hospDone, L('مكتمل', 'Completed'), 'gn')}
              {statCard(hospTodayList.length - hospDone, L('بانتظار الحضور', 'Awaiting arrival'), 'bl')}
              {statCard(`7 ${L('س', 'h')}`, L('متوسط زمن الإصدار', 'Avg issuance time'), 'am')}
            </div>
            <div className="sgrid" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
              {statCard(23, L('شهادات صدرت', 'Certificates issued'), 'gn')}
              {statCard(6, L('بانتظار الطبيب المعتمد', 'Awaiting certifier'), 'am')}
              {statCard(2, L('حالات «أشبالنا» جديدة', 'New Ashbalna cases'))}
              {statCard('2,300', L('رسوم ميكنة (ج.م)', 'Automation fees (EGP)'))}
            </div>
          </div>
          <div className="sf">
            <span>{L('المدير الطبي: ', 'Medical director: ')}{hosps[0]?.dir}</span>
            <span className="pn">2 / 4</span>
          </div>
        </div>,
        <div className="slide">
          <div className="lbl">{L('كشوفات اليوم', "Today's list")}</div>
          <h2 className="hl">{L('قائمة الحضور والنتائج — ', 'Attendance and outcomes — ')}{todayFormatted()}</h2>
          <div className="sb">
            {sTable(
              [L('رقم الحجز', 'Booking'), L('اللاعب', 'Player'), L('السن', 'Age'), L('اللعبة', 'Sport'), L('المستوى', 'Level'), L('الموعد', 'Slot'), L('الحالة', 'Status')],
              hospTodayList.map((p, i) => [
                <span className="mono" key="bk">{p.bk}</span>,
                <b key="name">{p.name}</b>,
                p.age,
                isRTL ? cfg.sports[p.sp] : SP_EN[cfg.sports[p.sp]] || cfg.sports[p.sp],
                p.lv,
                <span dir="ltr" key="slot">{9 + Math.floor(i / 2)}:{i % 2 ? '30' : '00'}</span>,
                <span key="st" className={`tag ${p.st === 'fit' ? 'tg' : p.st === 'cond' ? 'tw' : p.st === 'exp' ? 'tgy' : 'ti'}`}>
                  {p.st === 'fit' ? L('لائق', 'Fit') : p.st === 'cond' ? L('أشبالنا', 'Ashbalna') : p.st === 'exp' ? L('منتهية', 'Expired') : L('حجز مؤكد', 'Booked')}
                </span>
              ])
            )}
          </div>
          <div className="sf">
            <span>{L('الصفحة تعرض 12 حجزًا — القائمة الكاملة في بوابة المستشفى', 'Page shows 12 bookings — full list in the hospital portal')}</span>
            <span className="pn">3 / 4</span>
          </div>
        </div>,
        <div className="slide">
          <div className="lbl">{L('الجداول والطاقة', 'Schedule & capacity')}</div>
          <h2 className="hl">{L('متوسط إشغال 60% — نافذة الخميس الأعلى طلبًا', 'Average utilisation 60% — Thursday window is most demanded')}</h2>
          <div className="sb">
            {sTable(
              [L('اليوم', 'Day'), L('من', 'From'), L('إلى', 'To'), L('الطاقة', 'Capacity'), L('محجوز', 'Booked'), L('متاح', 'Available'), L('الإشغال', 'Utilisation')],
              cfg.shifts.map((shift, i) => {
                const bVal = Math.floor(shift.c * [0.72, 0.55, 0.48, 0.6, 0.42, 0.8][i % 6]);
                const pct = Math.round((bVal / shift.c) * 100);
                return [
                  <b key="d">{shift.d}</b>,
                  <span dir="ltr" key="f">{shift.f}</span>,
                  <span dir="ltr" key="t">{shift.t}</span>,
                  shift.c,
                  bVal,
                  <span key="av" className="tag tg">{shift.c - bVal}</span>,
                  <div key="bar" className="bar" style={{ margin: 0, minWidth: '160px' }}>
                    <span className="tr" style={{ background: 'var(--teal-soft)' }}><span className="fl" style={{ width: `${pct}%`, background: 'var(--primary)' }}></span></span>
                    <i>{pct}%</i>
                  </div>
                ];
              })
            )}
          </div>
          <div className="sf">
            <span>{L('الطاقة تُدار من شاشة الإعداد وتنعكس فورًا على مواعيد التطبيق', 'Capacity is managed in configuration and reflected instantly in the app')}</span>
            <span className="pn">4 / 4</span>
          </div>
        </div>
      ]
    },

    club: {
      ic: Users,
      tag: ['الأندية والاتحادات', 'Clubs & Federations'],
      t: ['تقرير اللاعبين — النادي', 'Roster report — club'],
      d: ['حالة شهادات اللاعبين، الإجراءات القائمة، وطلبات الاطلاع.', "Players' certificate status, open actions and access requests."],
      build: () => [
        <div className="slide dk" style={{ justifyContent: 'center', background: 'var(--brand)' }}>
          {ECG_SVG}
          <div className="cv-org">{clubs[0]?.n} · {isRTL ? clubs[0]?.gov : GOV_EN[clubs[0]?.gov] || clubs[0]?.gov}</div>
          <h2 className="cv-title">{L('تقرير حالة اللاعبين', 'Player Status Report')}</h2>
          <div className="cv-sub">{L('بوابة النادي · ', 'Club portal · ')}{todayFormatted()}</div>
          <div className="cv-meta">{L(cfg.org.owner.ar, cfg.org.owner.en)}</div>
        </div>,
        <div className="slide dk" style={{ background: 'var(--brand)' }}>
          <div className="lbl">{L('ملخص النادي', 'Club summary')}</div>
          <h2 className="hl">{clubValid} {L('من ', 'of ')}{clubRoster.length} {L('لاعبًا يحملون شهادة سارية', 'players hold a valid certificate')}</h2>
          <div className="sb">
            <div className="sgrid" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' }}>
              {statCard(clubRoster.length, L('لاعبون مسجلون', 'Registered players'))}
              {statCard(clubValid, L('شهادة سارية', 'Valid certificate'), 'gn')}
              {statCard(clubRoster.filter(p => p.st === 'book' || p.st === 'cond').length, L('إجراء قائم', 'In progress'), 'am')}
              {statCard(clubRoster.filter(p => p.st === 'exp').length, L('تحتاج تجديدًا', 'Renewal due'))}
            </div>
            <div className="nt" style={{ fontSize: '13.5px', lineHeight: 1.9, margin: 0, borderRadius: '12px' }}>
              {L(
                'يرى النادي نتيجة الشهادة فقط (لائق / لائق بشروط / منتهية) بموافقة اللاعب أو ولي الأمر — ولا يظهر أي تشخيص أو تفصيل طبي.',
                'The club sees outcome only (fit / conditionally fit / expired) with player or guardian consent — no diagnosis or medical detail is shown.'
              )}
            </div>
          </div>
          <div className="sf">
            <span>{L('مسؤول الملفات الطبية: ', 'Medical-records officer: ')}{clubs[0]?.mgr}</span>
            <span className="pn">2 / 4</span>
          </div>
        </div>,
        <div className="slide">
          <div className="lbl">{L('قائمة اللاعبين', 'Roster')}</div>
          <h2 className="hl">{L('حالة الشهادة لكل لاعب', 'Certificate status per player')}</h2>
          <div className="sb">
            {sTable(
              [L('اللاعب', 'Player'), L('اللعبة', 'Sport'), L('السن', 'Age'), L('المستوى', 'Level'), L('الحالة', 'Status'), L('رقم الشهادة', 'Certificate no.'), L('سارية حتى', 'Valid until')],
              clubRoster.map((p, idx) => [
                <b key="n">{p.name}</b>,
                isRTL ? cfg.sports[p.sp] : SP_EN[cfg.sports[p.sp]] || cfg.sports[p.sp],
                p.age,
                p.lv,
                <span key="st" className={`tag ${p.st === 'fit' ? 'tg' : p.st === 'cond' ? 'tw' : p.st === 'exp' ? 'tgy' : 'ti'}`}>
                  {p.st === 'fit' ? L('لائق', 'Fit') : p.st === 'cond' ? L('أشبالنا', 'Ashbalna') : p.st === 'exp' ? L('منتهية', 'Expired') : L('حجز مؤكد', 'Booked')}
                </span>,
                <span key="ct" className="mono">{p.st === 'fit' || p.st === 'exp' ? p.ct : '—'}</span>,
                p.st === 'fit' ? <span key="dt" dir="ltr">14/10/2027</span> : p.st === 'exp' ? <span key="dt" dir="ltr">02/09/2026</span> : '—'
              ])
            )}
          </div>
          <div className="sf">
            <span>{L('البيانات بموافقة اللاعبين — نطاق «النتيجة والشهادة فقط»', 'Data under player consent — scope “outcome & certificate only”')}</span>
            <span className="pn">3 / 4</span>
          </div>
        </div>,
        <div className="slide">
          <div className="lbl">{L('طلبات الاطلاع', 'Access requests')}</div>
          <h2 className="hl">{L('كل طلب بنطاق ومدة، وولي الأمر يوافق للقُصّر', 'Every request is scoped and time-bound; guardians approve for minors')}</h2>
          <div className="sb">
            {sTable(
              [L('اللاعب', 'Player'), L('النطاق', 'Scope'), L('المدة', 'Duration'), L('تاريخ الطلب', 'Requested'), L('الحالة', 'Status')],
              clubRoster.slice(0, 5).map((p, i) => {
                const a = [
                  [L('مقبول', 'Approved'), 'tg'],
                  [L('بانتظار ولي الأمر', 'Awaiting guardian'), 'tw'],
                  [L('مقبول', 'Approved'), 'tg'],
                  [L('مرفوض', 'Denied'), 'tb'],
                  [L('منتهي', 'Expired'), 'tgy']
                ][i];
                return [
                  <b key="n">{p.name}</b>,
                  L(cfg.scopes[0][0], cfg.scopes[0][1]),
                  L(cfg.durs[i % 4][0], cfg.durs[i % 4][1]),
                  <span key="dt" dir="ltr">{10 + i}/10/2026</span>,
                  <span key="st" className={`tag ${a[1]}`}>{a[0]}</span>
                ];
              })
            )}
          </div>
          <div className="sf">
            <span>{L('قانون حماية البيانات الشخصية 151/2020', 'Personal Data Protection Law 151/2020')}</span>
            <span className="pn">4 / 4</span>
          </div>
        </div>
      ]
    },

    ash: {
      ic: HeartHandshake,
      tag: ['أشبالنا والمتابعة', 'Ashbalna Track'],
      t: ['تقرير متابعة «أشبالنا»', 'Ashbalna follow-up report'],
      d: ['الحالات المحوّلة حسب المرحلة والسبب — بهوية مُقنّعة.', 'Referred cases by stage and reason — with masked identity.'],
      build: () => [
        <div className="slide dk" style={{ justifyContent: 'center', background: 'var(--brand)' }}>
          {ECG_SVG}
          <div className="cv-org">{L('الإدارة الطبية · ', 'Medical administration · ')}{todayFormatted()}</div>
          <h2 className="cv-title">{L('تقرير متابعة «أشبالنا»', 'Ashbalna Follow-up Report')}</h2>
          <div className="cv-sub">{L('الحالات المحوّلة من الكشف الطبي الرياضي حتى إعادة التقييم', 'Cases referred from the sports medical exam through re-assessment')}</div>
          <div className="cv-meta">{L(cfg.org.owner.ar, cfg.org.owner.en)}</div>
        </div>,
        <div className="slide">
          <div className="lbl">{L('مسار المتابعة — ', 'Follow-up track — ')}{ash.length} {L('حالة', 'cases')}</div>
          <h2 className="hl">{stg[4]} {L('حالات أُعيد تقييمها، و', 'cases re-assessed, and ')}{ash.length - stg[4]} {L('قيد المتابعة النشطة', 'under active follow-up')}</h2>
          <div className="sb">
            <div className="sgrid" style={{ gridTemplateColumns: 'repeat(5,1fr)', gap: '12px', marginBottom: '14px' }}>
              {cfg.stages.map((st, i) => (
                <div key={i} className="sc" style={{ textAlign: 'center', padding: '12px 14px', border: '1px solid var(--line)', ...(i === 4 ? { background: 'rgba(22, 160, 133, 0.1)', borderColor: 'rgba(22, 160, 133, 0.3)' } : {}) }}>
                  <span className="mut" style={{ fontSize: '12px' }}>{L('المرحلة', 'Stage')} {i + 1}</span>
                  <b style={{ display: 'block', fontSize: '13.5px', color: 'var(--brand)', margin: '3px 0' }}>{L(st[0], st[1])}</b>
                  <b style={{ fontSize: '30px', lineHeight: 1.1, color: i === 4 ? 'var(--positive)' : 'var(--error)', fontFeatureSettings: '"tnum"' }}>{stg[i]}</b>
                </div>
              ))}
            </div>
            <div className="sc" style={{ border: '1px solid var(--line)' }}>
              <b style={{ display: 'block', marginBottom: '10px', fontSize: '14px', color: 'var(--brand)' }}>{L('سبب التحويل', 'Referral reason')}</b>
              {sBars(cfg.ref.map((r, i) => [L(r[0], r[1]), rs[i]]).sort((a, b) => b[1] - a[1]), 'r', true)}
            </div>
          </div>
          <div className="sf">
            <span>{L('لا يُستبعد أي لاعب دون مسار متابعة موثّق', 'No player is excluded without a documented follow-up track')}</span>
            <span className="pn">2 / 3</span>
          </div>
        </div>,
        <div className="slide">
          <div className="lbl">{L('سجل الحالات', 'Case register')}</div>
          <h2 className="hl">{L('الهوية مُقنّعة — التفاصيل في ملف الطبيب المعالج فقط', "Identity masked — details only in the treating physician's file")}</h2>
          <div className="sb">
            {sTable(
              [L('مرجع الحالة', 'Case ref.'), L('اللاعب', 'Player'), L('السن', 'Age'), L('اللعبة', 'Sport'), L('سبب التحويل', 'Reason'), L('المرحلة', 'Stage'), L('تاريخ التحويل', 'Referred')],
              ash.slice(0, 12).map((a, i) => [
                <span key="ref" className="mono">ASH-26-{('00' + (31 + i)).slice(-3)}</span>,
                <span key="pl">{`${a.p.name.split(' ')[0]} •••`}</span>,
                a.p.age,
                isRTL ? cfg.sports[a.p.sp] : SP_EN[cfg.sports[a.p.sp]] || cfg.sports[a.p.sp],
                L(cfg.ref[a.r][0], cfg.ref[a.r][1]),
                <span key="st" className={`tag ${a.s === 4 ? 'tg' : 'tw'}`}>{L(cfg.stages[a.s][0], cfg.stages[a.s][1])}</span>,
                <span key="dt" dir="ltr">{a.d}</span>
              ])
            )}
          </div>
          <div className="sf">
            <span>{L('تُعرض 12 حالة من ', 'Showing 12 of ')}{ash.length}</span>
            <span className="pn">3 / 3</span>
          </div>
        </div>
      ]
    },

    fin: {
      ic: TrendingUp,
      tag: ['النموذج المالي', 'Financial Plan'],
      t: ['النموذج المالي ودراسة الجدوى', 'Financial model & feasibility'],
      d: ['رسم الميكنة، نقطة التعادل، وسيناريوهات ثلاث سنوات.', 'Automation fee, break-even and three-year scenarios.'],
      build: () => [
        <div className="slide dk" style={{ justifyContent: 'center', background: 'var(--brand)' }}>
          {ECG_SVG}
          <div className="cv-org">{L('دراسة الجدوى · ', 'Feasibility · ')}{todayFormatted()}</div>
          <h2 className="cv-title">{L('النموذج المالي', 'Financial Model')}</h2>
          <div className="cv-sub">{L('رسم ميكنة موحّد يموّل التشغيل — دون تحميل الرسوم الطبية', 'A single automation fee funds operations — medical fees untouched')}</div>
          <div className="cv-meta">{L(cfg.org.owner.ar, cfg.org.owner.en)}</div>
        </div>,
        <div className="slide">
          <div className="lbl">{L('نموذج التشغيل', 'Operating model')}</div>
          <h2 className="hl">{L('100 جنيه رسم ميكنة لكل كشف — 75 جنيهًا صافيًا للمنظومة', '100 EGP automation fee per exam — 75 EGP net to the platform')}</h2>
          <div className="sb">
            <div className="sgrid" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' }}>
              {statCard('100', L('رسم الميكنة (ج.م)', 'Automation fee (EGP)'))}
              {statCard('75', L('الصافي بعد الدفع الإلكتروني', 'Net after payment fees'), 'gn')}
              {statCard('20,000', L('كشف — نقطة التعادل سنويًا', 'exams — annual break-even'), 'am')}
              {statCard('0', L('تحميل على الرسوم الطبية', 'Added to medical fees'), 'bl')}
            </div>
            <div className="sgrid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
              {icCard('lock', L('استضافة وتشغيل', 'Hosting & operations'), L('استضافة حكومية، دعم فني، ومراقبة على مدار الساعة.', 'Government hosting, support and 24/7 monitoring.'))}
              {icCard('cert', L('توقيع إلكتروني', 'e-Signature'), L('رخص التوقيع والتحقق للأطباء المعتمدين.', 'Signing and verification licences for certifiers.'))}
              {icCard('mobile', L('قنوات المواطن', 'Citizen channels'), L('رسائل OTP وإشعارات ولي الأمر وبوابة الدفع.', 'OTP, guardian notifications and payment gateway.'))}
            </div>
          </div>
          <div className="sf">
            <span>{L('الأرقام تقديرية لأغراض التخطيط', 'Figures are planning estimates')}</span>
            <span className="pn">2 / 3</span>
          </div>
        </div>,
        <div className="slide">
          <div className="lbl">{L('سيناريوهات ثلاث سنوات (مليون ج.م)', 'Three-year scenarios (EGP m)')}</div>
          <h2 className="hl">{L('التعادل في السنة الثانية بالسيناريو الأساسي', 'Break-even in year two under the base case')}</h2>
          <div className="sb">
            {sTable(
              [L('السيناريو', 'Scenario'), L('الحجم السنوي', 'Annual volume'), L('السنة 1', 'Year 1'), L('السنة 2', 'Year 2'), L('السنة 3', 'Year 3')],
              [
                [<b key="s">{L('متحفظ', 'Conservative')}</b>, '12,000', <span key="y1" style={{ color: 'var(--error)' }}>-3.4</span>, <span key="y2" style={{ color: 'var(--error)' }}>-2.6</span>, <span key="y3" style={{ color: 'var(--error)' }}>-0.8</span>],
                [<b key="s">{L('أساسي', 'Base')}</b>, '25,000', <span key="y1" style={{ color: 'var(--error)' }}>-2.6</span>, <span key="y2" style={{ color: 'var(--error)' }}>-0.4</span>, <span key="y3" style={{ color: 'var(--positive)', fontWeight: 800 }}>+3.0</span>],
                [<b key="s">{L('متفائل', 'Optimistic')}</b>, '40,000', <span key="y1" style={{ color: 'var(--error)' }}>-1.5</span>, <span key="y2" style={{ color: 'var(--positive)', fontWeight: 800 }}>+1.9</span>, <span key="y3" style={{ color: 'var(--positive)', fontWeight: 800 }}>+5.6</span>]
              ]
            )}
            <div className="nt" style={{ margin: '18px 0 0', fontSize: '13.5px', borderRadius: '12px' }}>
              {L(
                'النموذج (ب): شركة وطنية تنفّذ وتشغّل وتؤمّن، والمؤسسة العلاجية تملك البيانات والمنظومة والمعايير.',
                'Model B: a national company builds, operates and secures; the Curative Organization owns data, platform and standards.'
              )}
            </div>
          </div>
          <div className="sf">
            <span>{L('الأرقام تراكمية — صافي بعد تكاليف التشغيل', 'Cumulative figures — net of operating costs')}</span>
            <span className="pn">3 / 3</span>
          </div>
        </div>
      ]
    },

    plan: {
      ic: Milestone,
      tag: ['إدارة المشروع والخطة', 'PMO & Roadmap'],
      t: ['خطة التنفيذ والجدول الزمني', 'Implementation plan & timeline'],
      d: ['المراحل الخمس من التأسيس إلى تطبيق «صحة» الشامل وبوابة القرار.', 'Five phases from foundation to the full Seha app, with go/no-go gate.'],
      build: () => {
        const ph = [
          [L('نوفمبر 2026 – يناير 2027', 'Nov 2026 – Jan 2027'), L('التأسيس', 'Foundation'), L('القرار، الفريق، الاستضافة، تصميم الكود الطبي', 'Decision, team, hosting, medical-code design')],
          [L('فبراير – أبريل 2027', 'Feb – Apr 2027'), L('التشغيل التجريبي', 'Pilot'), L('مستشفيان ونادٍ واحد — 1,000 شهادة', 'Two hospitals, one club — 1,000 certificates')],
          [L('مايو – أغسطس 2027', 'May – Aug 2027'), L('التعميم', 'Roll-out'), L('كل المستشفيات المعتمدة والاتحادات', 'All accredited hospitals and federations')],
          [L('سبتمبر 2027 – فبراير 2028', 'Sep 2027 – Feb 2028'), L('حجز الخدمات', 'Service booking'), L('توسيع الحجز لباقي خدمات المؤسسة', 'Extend booking to other services')],
          [L('يناير – يونيو 2028', 'Jan – Jun 2028'), L('تطبيق «صحة»', 'Seha app'), L('ملف المواطن الصحي والتطبيق الشامل', 'Citizen health profile and full app')]
        ];
        return [
          <div className="slide dk" style={{ justifyContent: 'center', background: 'var(--brand)' }}>
            {ECG_SVG}
            <div className="cv-org">{L('مكتب إدارة المشروع · ', 'PMO · ')}{todayFormatted()}</div>
            <h2 className="cv-title">{L('خطة التنفيذ', 'Implementation Plan')}</h2>
            <div className="cv-sub">{L('من قرار التأسيس إلى تطبيق «صحة» الشامل', 'From the founding decision to the full Seha app')}</div>
            <div className="cv-meta">{L(cfg.org.owner.ar, cfg.org.owner.en)}</div>
          </div>,
          <div className="slide">
            <div className="lbl">{L('الجدول الزمني', 'Timeline')}</div>
            <h2 className="hl">{L('خمس مراحل في 20 شهرًا — وبوابة قرار بعد التجريبي', 'Five phases over 20 months — a decision gate after the pilot')}</h2>
            <div className="sb">
              <div className="tl">
                {ph.map((p, i) => (
                  <div key={i} className="ph2" style={{ borderTop: `4px solid ${i === 1 ? 'var(--warning)' : 'var(--primary)'}`, borderRight: '1px solid var(--line)', borderLeft: '1px solid var(--line)', borderBottom: '1px solid var(--line)', borderRadius: '12px' }}>
                    <small style={{ color: 'var(--muted)' }}>{p[0]}</small>
                    <b style={{ color: 'var(--brand)' }}>{i + 1}. {p[1]}</b>
                    <p>{p[2]}</p>
                  </div>
                ))}
              </div>
              <div className="sgrid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '18px' }}>
                <div className="sc hi" style={{ background: 'var(--brand)', color: '#FFFFFF' }}>
                  <b style={{ fontSize: '15px' }}>{L('بوابة القرار بعد التجريبي', 'Go / no-go gate after pilot')}</b>
                  <p className="mut" style={{ marginTop: '6px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {L(
                      '1,000 شهادة صادرة · رضا ≥ 4/5 · إصدار خلال 24 ساعة · صفر شهادة مزوّرة مقبولة',
                      '1,000 certificates · satisfaction ≥ 4/5 · issuance within 24h · zero forged certificates accepted'
                    )}
                  </p>
                </div>
                <div className="sc" style={{ border: '1px solid var(--line)' }}>
                  <b style={{ fontSize: '15px', color: 'var(--brand)' }}>{L('مؤشرات النجاح', 'Success indicators')}</b>
                  <p className="mut" style={{ marginTop: '6px', fontSize: '13px' }}>
                    {L(
                      '99.5% توافر · ساعة متوسط زيارة · 4 ساعات تدريب للمستشفى · النموذج (ب) للتشغيل',
                      '99.5% availability · 1-hour average visit · 4 hours hospital training · Model B operations'
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="sf">
              <span>{L('المرحلة التجريبية هي الأساس لكل القرارات اللاحقة', 'The pilot is the basis for every later decision')}</span>
              <span className="pn">2 / 4</span>
            </div>
          </div>,
          <div className="slide">
            <div className="lbl">{L('قرارات المرحلة صفر', 'Phase-zero decisions')}</div>
            <h2 className="hl">{L('ثمانية قرارات تسبق أول سطر برمجة', 'Eight decisions before the first line of code')}</h2>
            <div className="sb">
              <div className="sgrid" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
                {[
                  [L('الجهة المالكة', 'Owning entity'), L('المؤسسة العلاجية مالكة البيانات والمعايير', 'Curative Organization owns data and standards')],
                  [L('نموذج التشغيل', 'Operating model'), L('النموذج (ب) — شركة وطنية تنفّذ وتشغّل', 'Model B — national company builds & operates')],
                  [L('الكود الطبي', 'Medical code'), L('أربعة مستويات معتمدة من اللجنة الطبية', 'Four levels approved by the medical committee')],
                  [L('الرسوم', 'Fees'), L('رسم ميكنة 100 ج.م — دون المساس بالرسوم الطبية', '100 EGP automation fee — medical fees untouched')],
                  [L('الاستضافة', 'Hosting'), L('حكومية داخل مصر مع نسخ احتياطي', 'Government, inside Egypt, with backups')],
                  [L('التوقيع الإلكتروني', 'e-Signature'), L('مزوّد مرخَّص من ITIDA', 'ITIDA-licensed provider')],
                  [L('حماية البيانات', 'Data protection'), L('مسؤول حماية بيانات وسياسة موافقات', 'DPO and consent policy')],
                  [L('التجريبي', 'Pilot'), L('مستشفيان ونادٍ ولجنة قبول', 'Two hospitals, one club, acceptance committee')]
                ].map((x, i) => (
                  <div key={i}>{numCard(i + 1, x[0], x[1])}</div>
                ))}
              </div>
            </div>
            <div className="sf">
              <span>{L('كل قرار له مالك وموعد في سجل المشروع', 'Each decision has an owner and date in the project register')}</span>
              <span className="pn">3 / 4</span>
            </div>
          </div>,
          <div className="slide dk" style={{ justifyContent: 'center', background: 'var(--brand)' }}>
            {ECG_SVG}
            <h2 className="cv-title" style={{ fontSize: '42px' }}>
              {L('جاهزون للتشغيل التجريبي', 'Ready for the pilot')}
            </h2>
            <div className="cv-sub">
              {L('القرار المطلوب: اعتماد المرحلة صفر والبدء في نوفمبر 2026', 'Decision required: approve phase zero and start in November 2026')}
            </div>
            <div className="cv-meta">{L(cfg.org.author.ar, cfg.org.author.en)} · {L(cfg.org.owner.ar, cfg.org.owner.en)}</div>
          </div>
        ];
      }
    }
  };

  // If a report is selected, view slides
  if (selectedReport && REPORTS[selectedReport]) {
    const r = REPORTS[selectedReport];
    const slides = r.build();
    const IconComponent = r.ic;

    return (
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <div className="rtb" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: '14px',
          padding: '12px 18px',
          marginBottom: '20px',
          boxShadow: 'var(--sh)'
        }}>
          <button
            className="btn ghost sm"
            onClick={() => setSelectedReport(null)}
            style={{ fontWeight: 700, gap: '6px' }}
          >
            {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {L('كل التقارير', 'All reports')}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              background: 'var(--teal-soft)', 
              color: 'var(--primary)' 
            }}>
              <IconComponent size={18} />
            </span>
            <div>
              <b style={{ color: 'var(--brand)', fontSize: '14.5px', display: 'block' }}>
                {L(r.t[0], r.t[1])}
              </b>
              <span className="mut" style={{ fontSize: '11.5px' }}>
                {slides.length} {L('شرائح بصيغة 16:9 قياسية جاهزة للطباعة', 'slides in standard 16:9 format ready for print')}
              </span>
            </div>
          </div>

          <span className="grow"></span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn sec sm"
              style={{ fontWeight: 700 }}
              onClick={() => {
                showToast(L('استخدم «حفظ كـ PDF» من نافذة الطباعة', 'Use “Save as PDF” in the print dialog'));
                window.print();
              }}
            >
              <Download size={15} />
              {L('حفظ PDF', 'Save PDF')}
            </button>
            <button className="btn sm" style={{ fontWeight: 700 }} onClick={() => window.print()}>
              <Printer size={15} />
              {L('طباعة الشرائح', 'Print Slides')}
            </button>
          </div>
        </div>

        {slides.map((sContent, i) => (
          <div key={i} className="slidewrap">
            {sContent}
          </div>
        ))}
      </div>
    );
  }

  // Reports hub view
  return (
    <div>
      {/* Header */}
      <div className="ph" style={{ marginBottom: '24px' }}>
        <div>
          <span className="lab" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px',
            color: 'var(--primary)',
            background: 'var(--teal-soft)',
            padding: '3px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '6px'
          }}>
            <FileText size={13} />
            {L('مركز التقارير والعروض التقديمية', 'Reporting & Executive Decks')}
          </span>
          <h1 style={{ margin: '4px 0 6px', fontSize: '26px', fontWeight: 800, color: 'var(--brand)' }}>
            {L('مركز التقارير والمخرجات التنفيذية', 'Executive Reports & Presentation Center')}
          </h1>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13.5px' }}>
            {L(
              'حزم تقارير مجهزة ومخرجة بدقة بصيغة 16:9 للمجلس والجهات المعنية، قابلة للتصدير والطباعة الورقية فورًا',
              'Presentation-grade 16:9 executive decks tailored for leadership and operating entities, ready for export and high-res print'
            )}
          </p>
        </div>
      </div>

      <div className="g3" style={{ gap: '18px' }}>
        {Object.keys(REPORTS).map((k) => {
          const r = REPORTS[k];
          const slideCount = r.build().length;
          const IconComponent = r.ic;
          return (
            <div
              key={k}
              className="rcard"
              onClick={() => setSelectedReport(k)}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '22px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: 'var(--sh)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'var(--teal-soft)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(8, 127, 140, 0.12)'
                }}>
                  <IconComponent size={24} />
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  background: 'rgba(8, 127, 140, 0.08)',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}>
                  {L(r.tag[0], r.tag[1])}
                </span>
              </div>

              <div>
                <b style={{ fontSize: '15.5px', color: 'var(--brand)', display: 'block', marginBottom: '6px' }}>
                  {L(r.t[0], r.t[1])}
                </b>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.55 }}>
                  {L(r.d[0], r.d[1])}
                </p>
              </div>

              <div style={{ 
                marginTop: 'auto', 
                paddingTop: '14px', 
                borderTop: '1px solid var(--line)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Layers size={14} style={{ color: 'var(--primary)' }} />
                  {slideCount} {L('شرائح تفاعلية', 'interactive slides')}
                </span>

                <span className="btn sec sm" style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, gap: '5px' }}>
                  <Eye size={14} />
                  {L('استعراض وطباعة', 'View & Print')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
