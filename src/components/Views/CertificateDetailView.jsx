import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { IC } from '../../data/icons';
import { QRCodeSVG } from '../Common/QRCodeSVG';
import { fmtDate } from '../../data/mockData';
import { Award, ArrowLeft, Printer, ShieldCheck, Calendar, Clock, CheckCircle2, HeartPulse, XCircle } from 'lucide-react';

export const CertificateDetailView = () => {
  const { isRTL, L } = useLanguage();
  const {
    players,
    selectedCertIndex,
    setSelectedCertIndex,
    hosps,
    clubs,
    cfg,
    navigate,
    setVerifyQuery,
    GOV_EN,
    SP_EN
  } = useSeha();

  const p = players[selectedCertIndex ?? 0] || players[0];
  const h = hosps[p.hs] || hosps[0];
  const c = clubs[p.cl] || clubs[0];
  const lv = cfg.levels[p.lv - 1] || cfg.levels[0];

  const handleBack = () => {
    setSelectedCertIndex(null);
  };

  const handleVerify = () => {
    setVerifyQuery(p.ct);
    navigate('verify', { verifyQ: p.ct });
  };

  // If player status is 'book'
  if (p.st === 'book') {
    return (
      <div className="space-y-4">
        <div className="ph">
          <div>
            <span className="lab flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#087F8C]" />
              {L('الإصدار الرقمي والاعتماد', 'Digital issuance & clearance')}
            </span>
            <h1>{L('شهادة اللياقة الطبية الرياضية', 'Sports Medical Fitness Certificate')}</h1>
            <p>{p.name} · <span className="mono font-bold text-[#087F8C]">{p.bk}</span></p>
          </div>
          <div className="act np">
            <button className="btn ghost" onClick={handleBack}>
              {IC.back} {L('سجل الشهادات', 'Certificate registry')}
            </button>
          </div>
        </div>

        <div className="card max-w-xl mx-auto text-center p-8 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-[#DDF4F1] dark:bg-[#143542] text-[#087F8C] dark:text-[#7AD3DC] flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="justify-center text-lg text-[#123B4A] dark:text-[#EDF4F7]">
            {L('لم تصدر الشهادة بعد — حجز مؤكد قائم', 'Certificate not yet issued — active confirmed booking')}
          </h3>
          <p className="mut text-sm max-w-md mx-auto mt-2 leading-relaxed">
            {L(
              'يوجد حجز مؤكد ومطابق للهوية بانتظار الكشف الطبي بوحدة الطب الرياضي — تصدر الشهادة المؤمنة إلكترونيًا فور اعتماد النتيجة من الطبيب المعاين.',
              'A confirmed booking is registered awaiting examination at the Sports Medicine Unit. The digitally signed certificate will be issued automatically upon clinical approval.'
            )}
          </p>
          <div className="max-w-md mx-auto my-5 border border-[#DCE5EC] dark:border-[#1D3A4B] rounded-xl overflow-hidden bg-[#F4F7FA] dark:bg-[#0E242E]">
            <table className="t">
              <tbody>
                <tr>
                  <td className="mut font-semibold w-1/3">{L('رقم الحجز', 'Booking code')}</td>
                  <td className="mono font-bold text-[#087F8C]">{p.bk}</td>
                </tr>
                <tr>
                  <td className="mut font-semibold">{L('المستشفى المعين', 'Assigned hospital')}</td>
                  <td className="font-semibold text-[#123B4A] dark:text-[#EDF4F7]">{h.n}</td>
                </tr>
                <tr>
                  <td className="mut font-semibold">{L('مستوى الكشف', 'Exam protocol')}</td>
                  <td className="font-semibold">{L(lv.ar, lv.en)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="btn px-6 py-2.5 shadow-sm" onClick={() => navigate('doctor')}>
            {L('فتح شاشة الطبيب لإجراء الفحص', 'Open physician screen for examination')}
          </button>
        </div>
      </div>
    );
  }

  // Examinations performed calculation
  const ab = p.st === 'cond' ? p.rf : -1;
  const ex = [
    [
      L('التاريخ المرضي للاعب والعائلة', 'Player & family history'),
      ab === 2 ? L('أعراض ربو بالمجهود', 'Exertional asthma symptoms') : L('لا توجد عوامل خطورة', 'No risk factors'),
      ab === 2 ? 1 : 0
    ],
    [
      L('الكشف الإكلينيكي والباطني', 'Clinical & internal exam'),
      `${L('ضغط ', 'BP ')}${p.bp} · ${L('نبض ', 'HR ')}${p.hr}${
        ab === 0
          ? ` · ${L('لغط قلبي انقباضي', 'systolic murmur')}`
          : ab === 1
          ? ` · ${L('ضغط مرتفع بالقياس المتكرر', 'elevated on repeat')}`
          : ab === 3
          ? ` · ${L('ألم بمفصل الركبة', 'knee joint pain')}`
          : ''
      }`,
      ab === 0 || ab === 1 || ab === 3 ? 1 : 0
    ],
    [
      L('رسم القلب الكهربائي (ECG)', 'Resting ECG (12-Lead)'),
      ab === 5 ? L('تغيرات غير نوعية بموجة T', 'Non-specific T-wave changes') : L('نظم جيبي طبيعي', 'Normal sinus rhythm'),
      ab === 5 ? 1 : 0
    ],
    [
      L('صورة الدم الكاملة (CBC)', 'Complete blood count'),
      ab === 4 ? L('هيموجلوبين منخفض — متابعة تغذية', 'Low haemoglobin — nutrition referral') : L('في الحدود الطبيعية', 'Within normal limits'),
      ab === 4 ? 1 : 0
    ]
  ];

  if (p.lv >= 3) {
    ex.push([
      L('الموجات الصوتية على القلب (إيكو)', 'Echocardiography (Echo)'),
      ab === 0 ? L('ارتجاع بسيط بالصمام الميترالي — متابعة', 'Mild mitral regurgitation — follow-up') : L('وظائف وصمامات طبيعية', 'Normal function & valves'),
      ab === 0 ? 1 : 0
    ]);
  }

  if (p.lv >= 4) {
    ex.push([
      L('رسم القلب بالمجهود (Stress ECG)', 'Exercise stress ECG test'),
      L('استجابة طبيعية للمجهود البدني', 'Normal response to maximum exertion'),
      0
    ]);
  }

  const fit = p.st === 'fit';
  const cond = p.st === 'cond';
  const expd = p.st === 'exp';

  const resCls = fit ? 'ok' : cond ? 'wr' : 'gy';
  const resT = fit ? L('لائق طبيًا للمنافسات', 'MEDICALLY FIT') : cond ? L('لائق بشروط متابعة (أشبالنا)', 'CONDITIONALLY FIT') : L('شهادة منتهية الصلاحية', 'CERTIFICATE EXPIRED');
  const resD = fit
    ? L('مصرّح له بممارسة النشاط الرياضي التنافسي دون قيود طبية، وصالحة لأكثر من لعبة وفق الضوابط المعتمدة.', 'Cleared for competitive sports without clinical restriction; valid across authorized sports disciplines per unified code.')
    : cond
    ? L('مسموح بالممارسة الرياضية تحت إشراف ومتابعة طبية ضمن مسار «أشبالنا» حتى موعد إعادة التقييم الدوري.', 'Participation permitted under scheduled clinical follow-up within the Ashbalna track until specified re-evaluation.')
    : L('انتهت صلاحية هذه الشهادة الطبية؛ يلزم الخضوع لكشف طبي دوري جديد لاستئناف الممارسة التنافسية الرسمية.', 'This medical certificate has expired; a new periodic sports examination is required for competition participation.');

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#087F8C]" />
            {L('الإصدار الرقمي والاعتماد الحكومي', 'Digital issuance & government accreditation')}
          </span>
          <h1>{L('وثيقة شهادة اللياقة الطبية الرياضية', 'Sports Medical Fitness Certificate')}</h1>
          <p>{p.name} · <span className="mono font-bold text-[#087F8C]">{p.ct}</span></p>
        </div>
        <div className="act np">
          <button className="btn ghost" onClick={handleBack}>
            {IC.back} {L('سجل الشهادات', 'Certificate registry')}
          </button>
          <button className="btn sec" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
            {L('طباعة الشهادة (A4 / PDF)', 'Print A4 / Save PDF')}
          </button>
          <button className="btn" onClick={handleVerify}>
            <ShieldCheck className="w-4 h-4" />
            {L('التحقق العام المباشر', 'Public verification')}
          </button>
        </div>
      </div>

      {/* Official A4 Certificate Container */}
      <div className={`a4 ${expd ? 'expd' : ''}`}>
        {expd && <div className="wm">{L('منتهية', 'EXPIRED')}</div>}

        {/* Certificate Government Header */}
        <div className="chd">
          <div>
            <b>{L('جمهورية مصر العربية', 'Arab Republic of Egypt')}</b>
            <span>{L('وزارة الصحة والسكان', 'Ministry of Health & Population')}</span>
            <span>{L('المؤسسة العلاجية · وحدة الطب الرياضي', 'Curative Organization · Sports Medicine Unit')}</span>
          </div>
          <div className="clg">
            <svg viewBox="0 0 48 48" width="56" height="56" fill="none" aria-label="Seha" style={{ flex: 'none' }}>
              <rect x="2" y="2" width="44" height="44" rx="12" fill="#123B4A" />
              <circle cx="24" cy="24" r="15" stroke="#087F8C" strokeWidth="2.2" />
              <path d="M11 24h5.5l2.5-6 5 12 3.5-9 2 3H37" stroke="#16A085" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <b>{h.n}</b>
            <span>{L('وحدة الطب الرياضي وفحص الرياضيين', 'Sports Medicine & Athlete Screening Unit')}</span>
            <span>{L('منظومة «صحة» للشهادات المؤمنة', 'Seha Secured Digital Platform')}</span>
          </div>
        </div>

        <h2 className="ctt">{L('شهادة لياقة طبية رياضية موثقة', 'Sports Medical Fitness Certificate')}</h2>
        <p className="cst">{L('وفق الكود الطبي الموحد للرياضيين والمواصفات المعتمدة · ', "Per the unified athletes' medical code · ")}{L(lv.ar, lv.en)}</p>

        {/* Certificate Meta Summary */}
        <div className="cid">
          <div>
            <span>{L('رقم الشهادة الموحد', 'Unified certificate no.')}</span>
            <b className="mono">{p.ct}</b>
          </div>
          <div>
            <span>{L('تاريخ الإصدار والاعتماد', 'Issuance date')}</span>
            <b>{fmtDate(p.iss, isRTL ? 'ar' : 'en')}</b>
          </div>
          <div>
            <span>{L('تاريخ نهاية الصلاحية', 'Valid until')}</span>
            <b className={expd ? 'text-[#C2414B]' : 'text-[#16835F]'}>
              {fmtDate(p.exp, isRTL ? 'ar' : 'en')}
            </b>
          </div>
        </div>

        {/* Player Profile Data & Photo */}
        <div className="cpl">
          <table className="cpt">
            <tbody>
              <tr>
                <td><span>{L('اسم اللاعب رباعي', 'Athlete full name')}</span><b>{p.name}</b></td>
                <td><span>{L('الرقم القومي', 'National ID')}</span><b className="mono" dir="ltr">{p.nid}</b></td>
              </tr>
              <tr>
                <td><span>{L('تاريخ الميلاد والسن', 'Date of birth & age')}</span><b>{fmtDate({ d: p.dobd, m: p.dobm, y: p.doby }, isRTL ? 'ar' : 'en')} ({p.age} {L('سنة', 'y')})</b></td>
                <td><span>{L('النوع', 'Gender')}</span><b>{p.g === 'M' ? L('ذكر', 'Male') : L('أنثى', 'Female')}</b></td>
              </tr>
              <tr>
                <td><span>{L('المحافظة', 'Governorate')}</span><b>{isRTL ? p.gov : GOV_EN[p.gov] || p.gov}</b></td>
                <td><span>{L('اللعبة الرياضية', 'Sport discipline')}</span><b>{isRTL ? cfg.sports[p.sp] : SP_EN[cfg.sports[p.sp]] || cfg.sports[p.sp]}</b></td>
              </tr>
              <tr>
                <td><span>{L('النادي / الأكاديمية المقيد بها', 'Registered club / academy')}</span><b>{c.n}</b></td>
                <td><span>{p.age < 18 ? L('ولي الأمر / جهة الاتصال', 'Guardian / contact') : L('رقم الهاتف للتواصل', 'Contact number')}</span><b>{p.age < 18 ? p.gd : '01012345678'}</b></td>
              </tr>
            </tbody>
          </table>
          <div className="cph">
            <div>
              <span className="font-semibold block text-xs">{L('صورة الرياضي', 'Athlete photo')}</span>
              <span className="text-[10px] text-[#64748B] block mt-1">{L('ملتقطة إلكترونيًا عند الكشف', 'Captured at examination')}</span>
            </div>
          </div>
        </div>

        {/* Examinations Performed Table */}
        <h3 className="csh">{L('نتائج الفحوصات الطبية المنفذة', 'Clinical examinations performed')}</h3>
        <table className="t cex">
          <thead>
            <tr>
              <th>{L('الفحص الطبي', 'Medical examination')}</th>
              <th>{L('النتيجة الإكلينيكية والملاحظات', 'Clinical findings')}</th>
              <th>{L('حالة الفحص', 'Status')}</th>
            </tr>
          </thead>
          <tbody>
            {ex.map((r, i) => (
              <tr key={i}>
                <td className="font-semibold">{r[0]}</td>
                <td className="text-xs">{r[1]}</td>
                <td>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      r[2] ? 'bg-[#FEF7E8] text-[#B77912]' : 'bg-[#E4F7F2] text-[#16835F]'
                    }`}
                  >
                    {r[2] ? (
                      <>
                        <HeartPulse className="w-3 h-3" />
                        {L('يحتاج متابعة', 'Follow-up')}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        {L('طبيعي — لائق', 'Normal')}
                      </>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Final Clinical Outcome Banner */}
        <div className={`cres ${resCls}`}>
          <div>
            <span>{L('القرار الطبي النهائي', 'Final clinical outcome')}</span>
            <b>{resT}</b>
            <p>{resD}</p>
          </div>
          <div className="cmk">
            {fit ? (
              <CheckCircle2 className="w-8 h-8 text-[#16835F]" />
            ) : cond ? (
              <HeartPulse className="w-8 h-8 text-[#B77912]" />
            ) : (
              <XCircle className="w-8 h-8 text-[#64748B]" />
            )}
          </div>
        </div>

        {/* Signatures, Cryptographic Stamp & QR Verification */}
        <div className="csg">
          <div className="cbx">
            <span>{L('الطبيب الفاحص المعاين', 'Examining physician')}</span>
            <b>{['د. كريم عبدالعزيز', 'د. مها الشناوي', 'د. عمرو حجازي', 'د. دينا فؤاد'][p.hs]}</b>
            <small>{L('رقم القيد بنقابة الأطباء: ', 'Syndicate registration: ')}{210000 + p.hs * 1377 + (selectedCertIndex || 0)}</small>
          </div>
          <div className="cbx">
            <span>{L('اعتماد مدير الوحدة', 'Medical unit director')}</span>
            <b>{h.dir}</b>
            <small>{L('مدير وحدة الطب الرياضي · اعتُمدت في ', 'Sports Medicine Director · approved ')}{fmtDate(p.iss, isRTL ? 'ar' : 'en')}، {p.tm}</small>
          </div>
          <div className="cbx esg">
            <span>{L('التوقيع والختم الرقمي المؤمن', 'Cryptographic e-signature')}</span>
            <b className="mono" dir="ltr">{p.fp}</b>
            <small>{L('جهة الاعتماد: سلطة التوقيع الإلكتروني الحكومي المرخصة', 'CA: Egyptian Licensed Trust Service Provider')}</small>
          </div>
          <div className="cbx cqr">
            <QRCodeSVG seed={p.ct} size={90} />
            <b className="mt-1 text-xs">{L('امسح للتحقق الفوري', 'Scan to verify')}</b>
            <small className="mono" dir="ltr">seha.gov.eg/v/{p.ct}</small>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <p className="cft">
          {L(
            'هذه الشهادة وثيقة رسمية صادرة إلكترونيًا من منظومة «صحة» وفق الكود الطبي الرياضي الموحد ولا تحتاج إلى ختم يدوي تقليدي. أي كشط أو تعديل يُبطل التوقيع الإلكتروني فورًا. البيانات المعتمدة قانونًا هي ما يظهر عند مسح رمز الاستجابة السريعة (QR) أو إدخال الرقم في بوابة التحقق العامة.',
            'This certificate is an official digital record issued by Seha per the Unified Sports Medicine Code. Any physical or digital tampering voids the digital signature. Authoritative validity is confirmed via the QR code or public verification portal.'
          )}
        </p>
      </div>
    </div>
  );
};
