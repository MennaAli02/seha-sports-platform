import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { IC } from '../../data/icons';
import { Stethoscope, QrCode, CheckCircle2, HeartPulse, XCircle, Camera, ArrowLeft, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

export const PhysicianScreenView = () => {
  const { isRTL, L } = useLanguage();
  const {
    players,
    hosps,
    cfg,
    navigate,
    showToast,
    logAudit,
    SP_EN
  } = useSeha();

  const [examStep, setExamStep] = useState(1);
  const [dshow, setDshow] = useState(false);
  const [examRes, setExamRes] = useState({});
  const [exKind, setExKind] = useState('fit');
  const [rf, setRf] = useState(false);
  const [referralReason, setReferralReason] = useState(0);

  const h = hosps[0];
  const p = players[0];
  const lv = cfg.levels[p.lv - 1];

  const docDo = (k) => {
    setExKind(k);
    if (k !== 'fit') {
      setRf(true);
      return;
    }
    setExamStep(4);
  };

  const abn = Object.keys(examRes).filter(k => examRes[k] === 0).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('الكشف والفحص الطبي الإكلينيكي', 'Clinical Examination & Medical Clearance')}
          </span>
          <h1>{L('شاشة الطبيب المعاين بوحدة الطب الرياضي', 'Examining Physician Console')}</h1>
          <p className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[var(--muted)] mt-1">
            <span>{isRTL ? h.n : h.nEn || h.n}</span>
            <span className="text-[var(--muted)]/50">·</span>
            <span>{isRTL ? h.dir : h.dirEn || h.dir}</span>
            <span className="text-[var(--muted)]/50">·</span>
            <span className="font-semibold text-[var(--ink)]">
              {L('المستوى الطبي المعتمد: ', 'Medical clearance code: ')}
            </span>
            <span>{L(lv.ar, lv.en)}</span>
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="stp max-w-2xl" style={{ marginBottom: '24px' }}>
        {[
          L('مسح الحجز ومطابقة الهوية', 'Scan & ID Match'),
          L('تسجيل الفحوصات الطبية', 'Record Findings'),
          L('القرار الطبي الإكلينيكي', 'Medical Decision'),
          L('الاعتماد والختم الرقمي', 'Clearance & Issue')
        ].map((s, i) => (
          <div
            key={i}
            className={`s ${examStep > i + 1 ? 'done' : examStep === i + 1 ? 'on' : ''}`}
            onClick={() => {
              if (examStep > i + 1) setExamStep(i + 1);
            }}
            style={{ cursor: examStep > i + 1 ? 'pointer' : 'default' }}
          >
            <div className="dot">{examStep > i + 1 ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Scan & ID Match */}
      {examStep === 1 && (
        <div className="card max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="m-0 text-base">{L('التحقق من تذكرة الحجز ومطابقة هوية الرياضي', 'Booking Verification & Biometric ID Match')}</h3>
          </div>
          <p className="mut text-xs mb-4">
            {L(
              'امسح رمز الاستجابة السريعة (QR) من هاتف المواطن أو اكتب كود الحجز للتأكد من سداد الرسوم ومطابقة الرقم القومي',
              'Scan the digital QR ticket from the citizen app or enter the booking code to verify identity and payment status'
            )}
          </p>

          <label className="f">
            <span>{L('رمز الحجز الإلكتروني', 'Electronic booking ticket code')}</span>
            <input
              id="d_bk"
              dir="ltr"
              className="mono font-bold text-sm max-w-xs"
              defaultValue={p.bk}
            />
          </label>

          <button className="btn sec" onClick={() => setDshow(true)}>
            <QrCode className="w-4 h-4" />
            {L('مسح ومطابقة بيانات الهوية', 'Verify & Match Identity')}
          </button>

          {dshow && (
            <div className="mt-4 pt-4 border-t border-[var(--line)]">
              <div className="nt ok flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[var(--success-dark)] flex-none mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <b className="text-sm text-[var(--ink)] block">{p.name}</b>
                  <span>{p.age} {L('سنة', 'y')} · {isRTL ? cfg.sports[p.sp] : SP_EN[cfg.sports[p.sp]] || cfg.sports[p.sp]} · {L(lv.ar, lv.en)}</span>
                  <div className="mt-1 font-semibold text-[var(--success-dark)]">
                    {L('✓ مطابقة الهوية: ناجحة · الدفع الإلكتروني: مسدد · إقرار ولي الأمر: موقع رسميًا', '✓ ID Match: OK · Payment: Settled · Guardian Declaration: Signed')}
                  </div>
                </div>
              </div>
              <button className="btn mt-3" onClick={() => setExamStep(2)}>
                {L('بدء الفحص الإكلينيكي', 'Proceed to clinical examination')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Record Exams */}
      {examStep === 2 && (
        <div className="card max-w-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="m-0 text-base">
              <span className="d"></span>
              {L(lv.ar, lv.en)}
            </h3>
            <span className="text-xs font-semibold text-[var(--primary-700)] bg-[var(--primary-50)] px-2.5 py-1 rounded-full">
              {lv.ex.length} {L('فحوصات مطلوبة', 'mandatory tests')}
            </span>
          </div>

          <p className="mut text-xs mb-4">
            {L(
              'تسجيل فوري بنقرة واحدة لكل فحص: طبيعي / غير طبيعي — مع إمكانية إرفاق صورة تخطيط القلب أو الإيكو مباشرة',
              'Single-tap recording for each test: Normal or Abnormal — attach ECG strips or Echo captures via camera'
            )}
          </p>

          <div className="space-y-2 mb-4">
            {lv.ex.map((e, i) => {
              const v = examRes[i] == null ? 1 : examRes[i];
              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] flex-wrap"
                >
                  <b className="text-xs text-[var(--ink)] flex-1">{e}</b>
                  <div className="flex items-center gap-2">
                    <button
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        v === 1
                          ? 'bg-[var(--success)] text-white shadow-xs'
                          : 'bg-[var(--card)] text-[var(--muted)] border border-[var(--line)]'
                      }`}
                      onClick={() => setExamRes({ ...examRes, [i]: 1 })}
                    >
                      {L('طبيعي', 'Normal')}
                    </button>
                    <button
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        v === 0
                          ? 'bg-[var(--danger)] text-white shadow-xs'
                          : 'bg-[var(--card)] text-[var(--danger-dark)] border border-[var(--danger)]/30'
                      }`}
                      onClick={() => setExamRes({ ...examRes, [i]: 0 })}
                    >
                      {L('ملاحظة / غير طبيعي', 'Abnormal')}
                    </button>
                    <label className="btn ghost sm p-1.5 cursor-pointer text-[var(--primary)]" title={L('إرفاق صورة أو تخطيط', 'Attach photo/strip')}>
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={() => showToast(L('تم إرفاق صورة الفحص بالسجل الطبي', 'Clinical test image attached'))}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <label className="f">
            <span>{L('ملاحظات إكلينيكية وتوصيات الطبيب (سرية ومشفرة)', 'Clinical notes & confidential recommendations')}</span>
            <textarea placeholder={L('اكتب أي ملاحظات أو قياسات سريرية دقيقة…', 'Enter confidential clinical remarks or measurements…')}></textarea>
          </label>

          <div className="flex items-center gap-2 pt-2">
            <button className="btn ghost" onClick={() => setExamStep(1)}>
              {L('رجوع', 'Back')}
            </button>
            <button className="btn" onClick={() => setExamStep(3)}>
              {L('متابعة إلى القرار الطبي', 'Continue to medical clearance decision')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Medical Decision */}
      {examStep === 3 && (
        <div className="card max-w-2xl">
          <h3 className="mb-2">
            <span className="d"></span>
            {L('القرار الطبي الإكلينيكي للياقة الرياضية', 'Final Clinical Fitness Determination')}
          </h3>

          {abn > 0 ? (
            <div className="nt wr flex items-start gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-[var(--warning-dark)] flex-none mt-0.5" />
              <div className="text-xs">
                <b>{L('تنبيه: تم رصد نتائج غير طبيعية بالفحص', 'Warning: Abnormal clinical findings detected')}</b>
                <p className="mt-0.5">
                  {L('يُوصى بتحويل الرياضي إلى مسار «أشبالنا» للمتابعة الطبية التخصصية وإعادة التقييم دون استبعاد قسري.', 'Athlete should be referred to the Ashbalna track for specialized investigation and care without disqualification.')}
                </p>
              </div>
            </div>
          ) : (
            <p className="mut text-xs mb-4">
              {L('جميع الفحوصات الإكلينيكية ضمن الحدود الطبيعية. اختر القرار المناسب للاعتماد.', 'All clinical tests within normal limits. Choose determination for sign-off.')}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <button
              className="p-4 rounded-xl border-2 border-[var(--success)] bg-[var(--success-bg)] text-[var(--success-dark)] font-bold text-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all cursor-pointer"
              onClick={() => docDo('fit')}
            >
              <CheckCircle2 className="w-7 h-7" />
              <span>{L('لائق طبيًا دون قيود', 'Fit — Unrestricted')}</span>
            </button>

            <button
              className="p-4 rounded-xl border-2 border-[var(--warning)] bg-[var(--warning-bg)] text-[var(--warning-dark)] font-bold text-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all cursor-pointer"
              onClick={() => docDo('cond')}
            >
              <HeartPulse className="w-7 h-7" />
              <span>{L('لائق بشروط (أشبالنا)', 'Conditionally Fit')}</span>
            </button>

            <button
              className="p-4 rounded-xl border-2 border-[var(--danger)] bg-[var(--danger-bg)] text-[var(--danger-dark)] font-bold text-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all cursor-pointer"
              onClick={() => docDo('unfit')}
            >
              <XCircle className="w-7 h-7" />
              <span>{L('غير لائق مؤقتًا', 'Temporarily Unfit')}</span>
            </button>
          </div>

          {rf && (
            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg)] space-y-3 mt-4">
              <label className="f m-0">
                <span>{L('سبب التحويل لمسار أشبالنا (سري — لا يظهر للنادي حفاظًا على الخصوصية)', 'Referral clinical reason (confidential — protected per Law 151/2020)')}</span>
                <select
                  id="d_rf"
                  value={referralReason}
                  onChange={(e) => setReferralReason(Number(e.target.value))}
                >
                  {cfg.ref.map((r, i) => (
                    <option key={i} value={i}>{L(r[0], r[1])}</option>
                  ))}
                </select>
              </label>

              <button
                className="btn w-full justify-center"
                onClick={() => {
                  logAudit(h.dir, `${L('تحويل لمسار أشبالنا — ', 'Ashbalna referral — ')}${p.name}`);
                  setExamStep(4);
                }}
              >
                <HeartPulse className="w-4 h-4" />
                {L('تأكيد التحويل وفتح ملف متابعة في برنامج «أشبالنا»', 'Confirm & open Ashbalna care file')}
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--line)]">
            <button className="btn ghost" onClick={() => setExamStep(2)}>
              {L('رجوع لتعديل الفحوصات', 'Back to tests')}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Approval Complete */}
      {examStep === 4 && (
        <div className="card max-w-xl mx-auto text-center p-8 shadow-md">
          {exKind === 'fit' ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-[var(--success-bg)] text-[var(--success-dark)] flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="justify-center text-lg text-[var(--success-dark)]">
                {L('تم اعتماد النتيجة وإصدار الشهادة الطبية المؤمنة', 'Clinical Clearance Approved — Certificate Issued')}
              </h3>
              <p className="mono text-2xl font-extrabold text-[var(--primary)] my-2">
                SH-26-004652
              </p>
              <p className="mut text-xs max-w-md mx-auto leading-relaxed">
                {L(
                  'تم توقيع الشهادة إلكترونيًا وإرسال إشعار فوري لولي الأمر. أصبحت الشهادة متاحة الآن عبر تطبيق المواطن وسجل التحقق العام.',
                  'Certificate digitally signed and confirmation SMS dispatched to guardian. Available immediately on the citizen app and public registry.'
                )}
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-[var(--warning-bg)] text-[var(--warning-dark)] flex items-center justify-center mx-auto mb-4 shadow-sm">
                <HeartPulse className="w-9 h-9" />
              </div>
              <h3 className="justify-center text-lg text-[var(--warning-dark)]">
                {L('تم فتح ملف رعاية ومتابعة في برنامج «أشبالنا»', 'Ashbalna Specialized Follow-up Care File Activated')}
              </h3>
              <p className="mut text-xs max-w-md mx-auto leading-relaxed my-2">
                {L('المرحلة المسجلة: ', 'Registered stage: ')}
                <b className="text-[var(--ink)]">{L(cfg.stages[0][0], cfg.stages[0][1])}</b>
                <br />
                {L(
                  'يراعي النظام خصوصية الرياضي: يظهر للنادي وصف «لائق بشروط» دون أي تفاصيل تشخيصية مرضية.',
                  'Club sees “Conditionally Fit” only — no diagnostic data disclosed.'
                )}
              </p>
            </>
          )}

          <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-[var(--line)]">
            <button className="btn sec" onClick={() => navigate('hosp')}>
              {L('العودة لبوابة المستشفى', 'Hospital portal')}
            </button>
            <button
              className="btn"
              onClick={() => {
                setExamStep(1);
                setExamRes({});
                setDshow(false);
                setRf(false);
              }}
            >
              {L('بدء كشف طبي لرياضي جديد', 'Examine next athlete')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
