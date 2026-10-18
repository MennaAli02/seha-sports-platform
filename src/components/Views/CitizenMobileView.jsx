import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { IC } from '../../data/icons';
import { QRCodeSVG } from '../Common/QRCodeSVG';
import { todayFormatted } from '../../data/mockData';
import { Smartphone, Calendar, CheckCircle2, Award, ShieldCheck, Download, ChevronRight, Lock, Clock, CreditCard } from 'lucide-react';

export const CitizenMobileView = () => {
  const { isRTL, L } = useLanguage();
  const {
    players,
    selectedPlayerIndex,
    setSelectedPlayerIndex,
    hosps,
    cfg,
    consents,
    navigate,
    showToast,
    logAudit,
    SP_EN,
    GOV_EN
  } = useSeha();

  const [mTab, setMTab] = useState('home'); // home, book, certs, cons
  const [mstep, setMstep] = useState(1);
  const [mNid, setMNid] = useState('');
  const [mPt, setMPt] = useState(1);
  const [mHs, setMHs] = useState(0);
  const [mSlot, setMSlot] = useState(null);
  const [mDone, setMDone] = useState(null);

  const p = players[selectedPlayerIndex] || players[0];
  const h = hosps[p.hs] || hosps[0];

  const mNext1 = () => {
    const v = (mNid || '').replace(/\D/g, '');
    if (v.length !== 14) {
      showToast(L('الرقم القومي يجب أن يتكون من 14 رقمًا صحيحًا', 'National ID must be exactly 14 digits'));
      return;
    }
    setMstep(2);
  };

  const mNext2 = () => {
    setMstep(3);
  };

  const mNext3 = () => {
    if (mSlot === null) {
      showToast(L('يرجى اختيار موعد متاح للكشف الطبي', 'Please select an available appointment slot'));
      return;
    }
    setMstep(4);
  };

  const mPay = () => {
    const assignedLv = [1, 2, 3, 4][mPt] === 1 ? 2 : [1, 2, 3, 4][mPt];
    const bkCode = 'BK-26-' + (10000 + Math.floor(Math.random() * 89999));
    const doneObj = {
      bk: bkCode,
      lv: assignedLv,
      hosp: hosps[mHs]?.n || hosps[0].n,
      slot: cfg.shifts[mSlot] || cfg.shifts[0]
    };
    setMDone(doneObj);
    logAudit(L('مواطن', 'Citizen'), `${L('حجز موعد كشف جديد ', 'New exam booking ')}${bkCode}`);
    showToast(L('تم تأكيد الحجز وسداد الرسوم بنجاح', 'Booking confirmed & fee payment settled'));
  };

  const renderHome = () => (
    <div className="space-y-3">
      {/* Athlete Profile Welcome Card */}
      <div
        className="mcard shadow-md p-4 text-white rounded-2xl relative overflow-hidden"
        style={{
          background: 'var(--gradient)',
          border: 'none'
        }}
      >
        <div className="flex items-center justify-between opacity-80 mb-1 text-[11px] font-semibold">
          <span>{L('بوابة الرياضي وولي الأمر', 'Athlete & Guardian Portal')}</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{todayFormatted()}</span>
        </div>
        <b className="text-base font-extrabold block text-white">{p.name}</b>
        <div className="text-xs text-[var(--primary-100)] mt-1 font-medium flex items-center gap-1.5 flex-wrap">
          <span>{isRTL ? cfg.sports[p.sp] : SP_EN[cfg.sports[p.sp]] || cfg.sports[p.sp]}</span>
          <span>·</span>
          <span>{L(cfg.levels[p.lv - 1]?.ar, cfg.levels[p.lv - 1]?.en)}</span>
          <span>·</span>
          <span>{p.age} {L('سنة', 'y')}</span>
        </div>
      </div>

      {/* Current Certificate Status Capsule */}
      <div className="mcard">
        <div className="flex items-center justify-between">
          <b className="text-xs text-[var(--ink)]">
            {L('حالة الشهادة الطبية الرياضية', 'Medical Certificate Status')}
          </b>
          <span className="mono text-xs font-bold text-[var(--primary)]">
            {p.ct}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2.5">
          <span className="tag tg font-bold">
            {L('سارية حتى 14/10/2027', 'Valid until 14/10/2027')}
          </span>
          <span className="text-[11px] text-[var(--success-dark)] font-bold">
            {L('لائق للمنافسات', 'Fit for sports')}
          </span>
        </div>
        <div className="bar mt-3 mb-1">
          <b className="text-[11px] w-14 text-[var(--muted)]">{L('الصلاحية', 'Validity')}</b>
          <span className="tr">
            <span className="fl bg-[var(--success)]" style={{ width: '92%' }}></span>
          </span>
          <i className="text-[11px] font-mono w-12">11 {L('شهر', 'mo')}</i>
        </div>
      </div>

      {/* Timeline Tracking */}
      <div className="mcard">
        <b className="text-xs text-[var(--ink)] block mb-2">
          {L('آخر الإجراءات الطبية المسجلة', 'Latest Medical Milestones')}
        </b>
        <div className="text-[11.5px] text-[var(--muted)] space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success-dark)] flex-none" />
            <span>{L('تأكيد الحجز وسداد الرسوم', 'Booking confirmed')} — <span className="mono">{p.bk}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success-dark)] flex-none" />
            <span>{L('اكتمال الفحص الطبي', 'Exam completed')} — {h.n}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success-dark)] flex-none" />
            <span>{L('إصدار الشهادة الرقمية المعتمدة', 'Certificate issued')} — <span className="mono">{p.ct}</span></span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          className="btn text-xs py-2.5 justify-center shadow-xs"
          onClick={() => {
            setMDone(null);
            setMstep(1);
            setMTab('book');
          }}
        >
          <Calendar className="w-3.5 h-3.5" />
          {L('حجز كشف جديد', 'Book new exam')}
        </button>
        <button
          className="btn sec text-xs py-2.5 justify-center"
          onClick={() => navigate('cert', { certIndex: selectedPlayerIndex })}
        >
          <Award className="w-3.5 h-3.5" />
          {L('عرض الشهادة', 'View certificate')}
        </button>
      </div>
    </div>
  );

  const renderBook = () => {
    if (mDone) {
      const lv = cfg.levels[mDone.lv - 1] || cfg.levels[1];
      return (
        <div className="mcard text-center p-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--success-bg)] text-[var(--success-dark)] flex items-center justify-center mx-auto mb-2 shadow-sm">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <b className="text-sm text-[var(--ink)] block">{L('تم تأكيد الحجز بنجاح', 'Booking Confirmed')}</b>
          <div className="mono text-lg font-extrabold text-[var(--primary)] my-1">
            {mDone.bk}
          </div>
          <div className="text-xs text-[var(--muted)] leading-relaxed">
            {mDone.hosp}<br />
            {mDone.slot.d} · {mDone.slot.f}
          </div>
          <div className="mt-2 text-xs bg-[var(--bg)] p-2 rounded-lg border border-[var(--line)]">
            {L('رسم الكشف', 'Exam fee')} {lv.fee} + {L('رسم الميكنة', 'automation')} {cfg.autoFee} ={' '}
            <b className="num text-[var(--primary)]">{lv.fee + cfg.autoFee} {L('ج.م', 'EGP')}</b>
          </div>
          <div className="my-3 flex justify-center">
            <QRCodeSVG seed={mDone.bk} size={90} />
          </div>
          <p className="text-[10.5px] text-[var(--muted)]">
            {L('اعرض هذا الرمز لمكتب استقبال المستشفى عند الحضور', 'Show this ticket QR at hospital reception')}
          </p>
          <button
            className="btn sec sm w-full justify-center mt-3"
            onClick={() => {
              setMDone(null);
              setMstep(1);
              setMSlot(null);
            }}
          >
            {L('حجز موعد إضافي', 'Book another slot')}
          </button>
        </div>
      );
    }

    const steps = [L('الهوية', 'Identity'), L('المستوى', 'Level'), L('الموعد', 'Slot'), L('الدفع', 'Payment')];

    return (
      <div className="space-y-3">
        <div className="steps mb-2">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`stp ${mstep > i + 1 ? 'done' : mstep === i + 1 ? 'cur' : ''}`}
              data-n={i + 1}
            >
              {s}
            </div>
          ))}
        </div>

        {mstep === 1 && (
          <div className="mcard">
            <label className="f">
              <span>{L('الرقم القومي للرياضي (14 رقمًا)', 'Athlete National ID (14 digits)')}</span>
              <input
                id="m_nid"
                dir="ltr"
                maxLength={14}
                inputMode="numeric"
                value={mNid}
                onChange={(e) => setMNid(e.target.value)}
                placeholder="30805120104517"
                className="font-mono text-sm"
              />
            </label>
            <label className="f">
              <span>{L('رقم هاتف ولي الأمر للتأكيد', 'Guardian mobile number')}</span>
              <input dir="ltr" defaultValue="01012345678" className="font-mono text-sm" />
            </label>
            <label className="f">
              <span>{L('رمز التحقق السريع (OTP)', 'Verification OTP code')}</span>
              <input dir="ltr" maxLength={6} placeholder="······" defaultValue="829104" style={{ letterSpacing: '4px' }} className="font-mono text-center font-bold text-sm" />
            </label>
            <div className="nt text-[11px] leading-relaxed">
              {L(
                'تُستخرج السن والنوع والمحافظة تلقائيًا من قاعدة بيانات الرقم القومي؛ وتحت سن 18 عامًا يُربط الحساب بولي الأمر وفق الضوابط القانونية.',
                'Age, gender and residence are derived from the national ID. Under 18 accounts are strictly linked to a legal guardian.'
              )}
            </div>
            <button
              className="btn w-full justify-center mt-2"
              onClick={mNext1}
            >
              {L('متابعة لاختيار اللعبة', 'Continue')}
            </button>
          </div>
        )}

        {mstep === 2 && (
          <div className="mcard">
            <label className="f">
              <span>{L('اللعبة الرياضية المراد ممارستها', 'Sport discipline')}</span>
              <select id="m_sp">
                {cfg.sports.map((s, i) => (
                  <option key={i} value={i}>{isRTL ? s : SP_EN[s] || s}</option>
                ))}
              </select>
            </label>
            <label className="f">
              <span>{L('نوع وطبيعة المشاركة الرياضية', 'Participation level')}</span>
              <select
                id="m_pt"
                value={mPt}
                onChange={(e) => setMPt(Number(e.target.value))}
              >
                {cfg.parts.map((part, i) => (
                  <option key={i} value={i}>{L(part[0], part[1])}</option>
                ))}
              </select>
            </label>
            <div className="nt text-[11px] leading-relaxed">
              {L(
                'يتحدد مستوى الكود الطبي وقائمة الفحوصات الإلزامية المطلوبة تلقائيًا بناءً على نوع المشاركة والسن.',
                'Medical clearance level and mandatory clinical exam checklist are automatically determined by age and sport category.'
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                className="btn ghost justify-center text-xs"
                onClick={() => setMstep(1)}
              >
                {L('رجوع', 'Back')}
              </button>
              <button
                className="btn justify-center text-xs"
                onClick={mNext2}
              >
                {L('متابعة للموعد', 'Continue')}
              </button>
            </div>
          </div>
        )}

        {mstep === 3 && (
          <div className="mcard">
            <label className="f">
              <span>{L('وحدة الطب الرياضي / المستشفى المعتمد', 'Accredited sports medicine facility')}</span>
              <select
                id="m_hs"
                value={mHs}
                onChange={(e) => setMHs(Number(e.target.value))}
              >
                {hosps.filter(h => h.st === 'on').map((h, i) => (
                  <option key={i} value={i}>
                    {h.n} — ({isRTL ? h.gov : GOV_EN[h.gov] || h.gov})
                  </option>
                ))}
              </select>
            </label>
            <b className="text-xs text-[var(--ink)] block mb-2">
              {L('المواعيد والفترات المتاحة للحجز', 'Available examination shifts')}
            </b>
            <div className="chips">
              {cfg.shifts.map((s, i) => (
                <button
                  key={i}
                  className={`chip text-xs ${mSlot === i ? 'on' : ''}`}
                  onClick={() => setMSlot(i)}
                >
                  {s.d} · {s.f}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                className="btn ghost justify-center text-xs"
                onClick={() => setMstep(2)}
              >
                {L('رجوع', 'Back')}
              </button>
              <button
                className="btn justify-center text-xs"
                onClick={mNext3}
              >
                {L('متابعة للدفع', 'Continue')}
              </button>
            </div>
          </div>
        )}

        {mstep === 4 && (
          <div className="mcard">
            <b className="text-xs text-[var(--ink)] block mb-2">
              {L('إقرار الصحة والسلامة وقانون البيانات', 'Pre-exam Health & Legal Declaration')}
            </b>
            <div className="space-y-1.5 mb-3 bg-[var(--bg)] p-2.5 rounded-lg border border-[var(--line)]">
              <label className="chk text-[11px] m-0">
                <input type="checkbox" defaultChecked />
                <span>{L('لا يوجد تاريخ لوفيات قلبية مفاجئة بالعائلة', 'No family history of sudden cardiac arrest')}</span>
              </label>
              <label className="chk text-[11px] m-0">
                <input type="checkbox" defaultChecked />
                <span>{L('لم يتعرض اللاعب لإغماء أو دوار حاد بالمجهود', 'No exertional syncope or chest tightness')}</span>
              </label>
              <label className="chk text-[11px] m-0">
                <input type="checkbox" defaultChecked />
                <span>{L('أوافق على معالجة البيانات وفق قانون 151/2020', 'Consent to data processing (Law 151/2020)')}</span>
              </label>
            </div>

            <table className="t mb-3">
              <tbody>
                <tr>
                  <td className="mut text-xs">{L('رسم الكشف الطبي', 'Exam fee')}</td>
                  <td className="num text-xs">250 {L('ج.م', 'EGP')}</td>
                </tr>
                <tr>
                  <td className="mut text-xs">{L('رسم الميكنة والشهادة المؤمنة', 'Digital automation fee')}</td>
                  <td className="num text-xs">{cfg.autoFee} {L('ج.م', 'EGP')}</td>
                </tr>
                <tr className="bg-[var(--primary-50)]">
                  <td className="font-bold text-xs">{L('إجمالي الرسوم المستحقة', 'Total fees')}</td>
                  <td className="num text-xs font-extrabold text-[var(--primary-700)]">{250 + cfg.autoFee} {L('ج.م', 'EGP')}</td>
                </tr>
              </tbody>
            </table>

            <label className="f mb-3">
              <span>{L('وسيلة الدفع الإلكتروني', 'Payment gateway')}</span>
              <select>
                {cfg.pay.map((p, i) => (
                  <option key={i}>{L(p[0], p[1])}</option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                className="btn ghost justify-center text-xs"
                onClick={() => setMstep(3)}
              >
                {L('رجوع', 'Back')}
              </button>
              <button
                className="btn okbtn justify-center text-xs"
                onClick={mPay}
              >
                <CreditCard className="w-3.5 h-3.5" />
                {L('سداد وتأكيد الحجز', 'Pay & Confirm')}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCerts = () => (
    <div className="space-y-3">
      <div className="mcard p-4">
        <b className="text-xs text-[var(--ink)] block mb-2">
          {L('شهادة اللياقة الطبية الرقمية المعتمدة', 'Active Verified Digital Certificate')}
        </b>
        <div className="flex gap-3 items-center mt-2 bg-[var(--bg)] p-3 rounded-xl border border-[var(--line)]">
          <QRCodeSVG seed={p.ct} size={76} />
          <div className="text-xs space-y-1">
            <b className="mono text-xs text-[var(--primary)] block">{p.ct}</b>
            <span className="tag tg font-bold text-[10.5px]">{L('سارية المفعول', 'Valid')}</span>
            <div className="text-[11px] text-[var(--muted)]">
              {L('صالحة حتى: ', 'Expires: ')}<b className="text-[var(--ink)]">14/10/2027</b>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            className="btn sec sm justify-center text-xs"
            onClick={() => navigate('cert', { certIndex: selectedPlayerIndex })}
          >
            {L('فتح الشهادة الرسمية', 'Open full doc')}
          </button>
          <button
            className="btn sec sm justify-center text-xs"
            onClick={() => showToast(L('تم حفظ نسخة PDF من الشهادة على هاتفك', 'Certificate PDF downloaded'))}
          >
            <Download className="w-3.5 h-3.5" />
            {L('تنزيل PDF', 'Download PDF')}
          </button>
        </div>
      </div>

      <div className="mcard">
        <b className="text-xs text-[var(--ink)] block mb-2">
          {L('سجل الشهادات السابقة للرياضي', 'Historical Certificates')}
        </b>
        <div className="text-xs text-[var(--muted)] space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg)]">
            <span className="mono font-semibold">SH-25-000912</span>
            <span className="tag tgy">{L('منتهية', 'Expired')}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg)]">
            <span className="mono font-semibold">SH-24-003301</span>
            <span className="tag tgy">{L('منتهية', 'Expired')}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsents = () => (
    <div className="mcard space-y-3">
      <div>
        <b className="text-xs text-[var(--ink)] block">
          {L('إدارة تفويضات وموافقات الاطلاع', 'Privacy & Access Consents')}
        </b>
        <div className="nt text-[10.5px] leading-relaxed my-2">
          {L(
            'جميع صلاحيات الاطلاع محددة بنطاق وزمن وقابلة للسحب في أي لحظة وفق قانون حماية البيانات 151/2020.',
            'Access permissions are time-bound, strictly scoped, and instantly revocable per Data Protection Law 151/2020.'
          )}
        </div>
      </div>

      <div className="space-y-2">
        {consents.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)]"
          >
            <div className="text-xs">
              <b className="text-[var(--ink)] block">{c.to}</b>
              <span className="mut text-[10.5px]">
                {L(cfg.scopes[c.sc]?.[0], cfg.scopes[c.sc]?.[1])} · {L(cfg.durs[c.du]?.[0], cfg.durs[c.du]?.[1])}
              </span>
            </div>
            {c.st === 'ok' ? (
              <span className="tag tg text-[10.5px] font-bold">{L('ساري', 'Active')}</span>
            ) : (
              <span className="tag tb text-[10.5px] font-bold">{L('مرفوض', 'Denied')}</span>
            )}
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-[var(--line)]">
        <label className="f mb-2">
          <span>{L('منح جهة رياضية جديدة صلاحية الاطلاع', 'Grant new entity access')}</span>
          <input placeholder={L('اكتب اسم النادي / الأكاديمية…', 'Club or academy name…')} className="text-xs" />
        </label>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <select className="text-xs">
            {cfg.scopes.map((s, idx) => (
              <option key={idx}>{L(s[0], s[1])}</option>
            ))}
          </select>
          <select className="text-xs">
            {cfg.durs.map((d, idx) => (
              <option key={d[0]}>{L(d[0], d[1])}</option>
            ))}
          </select>
        </div>
        <button
          className="btn w-full justify-center text-xs py-2"
          onClick={() => showToast(L('تم توقيع الموافقة وحفظها', 'Consent signed and authorized'))}
        >
          {L('توقيع إلكتروني وإرسال التفويض', 'Sign & Issue Consent')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('قناة المواطن الرقمية الموحدة', 'Unified Citizen Mobile Channel')}
          </span>
          <h1>{L('تطبيق المواطن — واجهة الهاتف الذكي', 'Citizen Mobile Experience')}</h1>
          <p>
            {L(
              'محاكاة تفاعلية لتجربة الرياضي وولي الأمر: حجز الكشوفات، سداد الرسوم، استعراض الشهادة، وموافقات الخصوصية',
              'Interactive mobile simulation: appointment booking, fee settlement, digital certificate display, and revocable consent governance'
            )}
          </p>
        </div>
      </div>

      {/* Phone chassis */}
      <div className="flex justify-center py-2 pb-8">
        <div className="phone shadow-2xl">
          <span className="notch"></span>
          <div className="phd">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
              <b>{L('منظومة صحة للرياضيين', 'Seha SportsMed')}</b>
            </div>
            <span className="flex-1"></span>
            <span className="text-[10px] opacity-75 font-mono">
              10:45 AM
            </span>
          </div>

          <div className="pbdy">
            {mTab === 'home' && renderHome()}
            {mTab === 'book' && renderBook()}
            {mTab === 'certs' && renderCerts()}
            {mTab === 'cons' && renderConsents()}
          </div>

          <div className="pnav">
            {[
              ['home', IC.home, L('الرئيسية', 'Home')],
              ['book', IC.cal, L('حجز فحص', 'Book')],
              ['certs', IC.cert, L('شهاداتي', 'Certs')],
              ['cons', IC.shield, L('الموافقات', 'Consents')]
            ].map(([k, icon, lbl]) => (
              <button
                key={k}
                className={mTab === k ? 'on' : ''}
                onClick={() => setMTab(k)}
              >
                {icon}
                <span>{lbl}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
