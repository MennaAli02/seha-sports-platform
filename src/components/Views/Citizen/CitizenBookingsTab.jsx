import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useSeha } from '../../../context/SehaContext';
import { QRCodeSVG } from '../../Common/QRCodeSVG';
import { StatusTag } from '../../Common/StatusTag';
import {
  Calendar,
  CheckCircle2,
  Check,
  CreditCard,
  Building2,
  QrCode,
  Printer,
  ChevronRight,
  ChevronLeft,
  X,
  PlusCircle,
  Activity,
  HeartPulse,
  UserCheck
} from 'lucide-react';

export const CitizenBookingsTab = () => {
  const { isRTL, L } = useLanguage();
  const {
    players,
    selectedPlayerIndex,
    hosps,
    cfg,
    navigate,
    logAudit,
    showToast,
    userRole,
    SP_EN,
    GOV_EN
  } = useSeha();

  const p = players[selectedPlayerIndex] || players[0];

  const [activeSubTab, setActiveSubTab] = useState('wizard'); // 'wizard' | 'list'
  const [step, setStep] = useState(1);
  const [nid, setNid] = useState(p.nid || '31005120104829');
  const [mobile, setMobile] = useState('01012345678');
  const [otp, setOtp] = useState('123456');
  const [selectedSport, setSelectedSport] = useState(p.sp || 0);
  const [selectedPartType, setSelectedPartType] = useState(p.lv ? p.lv - 1 : 2);
  const [selectedHospital, setSelectedHospital] = useState(p.hs || 0);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(0);

  // Sync state when selected child changes
  React.useEffect(() => {
    if (p) {
      setNid(p.nid || '');
      setSelectedSport(p.sp || 0);
      setSelectedPartType(p.lv ? Math.max(0, p.lv - 1) : 1);
    }
  }, [p]);

  // Declarations
  const [decCardiac, setDecCardiac] = useState(true);
  const [decFainting, setDecFainting] = useState(true);
  const [decLawConsent, setDecLawConsent] = useState(true);

  // Completed booking state
  const [completedBooking, setCompletedBooking] = useState(null);

  // QR Modal for existing bookings
  const [selectedQRBooking, setSelectedQRBooking] = useState(null);

  // Derived level and fees
  const calculatedLevel = Math.min(4, Math.max(2, selectedPartType + 1));
  const levelObj = cfg.levels[calculatedLevel - 1] || cfg.levels[1];
  const examFee = levelObj.fee;
  const autoFee = cfg.autoFee || 100;
  const totalFee = examFee + autoFee;

  // Initial bookings list for athlete
  const [myBookings, setMyBookings] = useState([
    {
      id: 'b-1',
      bk: p.bk || 'BK-26-018245',
      date: 'السبت 24 أكتوبر 2026',
      dateEn: 'Saturday, 24 Oct 2026',
      time: '09:00 - 11:00',
      hosp: hosps[p.hs]?.n || 'مستشفى هليوبوليس التخصصي',
      hospEn: hosps[p.hs]?.nEn || 'Heliopolis Specialized Hospital',
      sport: cfg.sports[p.sp] || 'كرة القدم',
      level: p.lv || 3,
      fee: 600,
      st: 'book'
    },
    {
      id: 'b-2',
      bk: 'BK-25-009142',
      date: 'الأحد 15 أكتوبر 2025',
      dateEn: 'Sunday, 15 Oct 2025',
      time: '11:00 - 13:00',
      hosp: 'مستشفى النيل بدر',
      hospEn: 'Nile Badr Hospital',
      sport: cfg.sports[p.sp] || 'كرة القدم',
      level: 2,
      fee: 350,
      st: 'fit'
    }
  ]);

  const handleNextStep1 = () => {
    const cleanNid = nid.replace(/\D/g, '');
    if (cleanNid.length !== 14) {
      showToast(L('الرقم القومي يجب أن يتكون من 14 رقمًا صحيحًا', 'National ID must be exactly 14 digits'));
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    setStep(3);
  };

  const handleNextStep3 = () => {
    if (selectedSlotIndex === null) {
      showToast(L('يرجى اختيار موعد متاح للكشف الطبي', 'Please select an available appointment slot'));
      return;
    }
    setStep(4);
  };

  const handlePayAndConfirm = () => {
    if (!decCardiac || !decFainting || !decLawConsent) {
      showToast(L('يجب الموافقة على كافة الإقرارات الصحية وقانون حماية البيانات', 'All health declarations and data consent must be acknowledged'));
      return;
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 89999);
    const newBkCode = `BK-26-${randomSuffix}`;
    const targetHosp = hosps[selectedHospital] || hosps[0];
    const targetShift = cfg.shifts[selectedSlotIndex] || cfg.shifts[0];

    const newBookingObj = {
      id: `b-${Date.now()}`,
      bk: newBkCode,
      date: `${targetShift.d} القادم`,
      dateEn: `Next ${targetShift.d}`,
      time: `${targetShift.f} - ${targetShift.t}`,
      hosp: targetHosp.n,
      hospEn: targetHosp.nEn || targetHosp.n,
      sport: cfg.sports[selectedSport],
      level: calculatedLevel,
      fee: totalFee,
      st: 'book'
    };

    setCompletedBooking(newBookingObj);
    setMyBookings(prev => [newBookingObj, ...prev]);
    logAudit(L('مواطن', 'Citizen'), `${L('تأكيد حجز كشف جديد برقم ', 'New exam booking confirmed: ')}${newBkCode}`);
    showToast(L('تم تأكيد الحجز وإصدار رمز الحضور بنجاح!', 'Booking confirmed and check-in QR code generated!'));
  };

  const handleResetWizard = () => {
    setCompletedBooking(null);
    setStep(1);
    setActiveSubTab('wizard');
  };

  return (
    <div className="page-stack">
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('بوابة المواطن — حجز الكشوفات الطبية', 'Citizen Portal — Medical Bookings')}
          </span>
          <h1>{L('حجز وإدارة الكشوفات الطبية الرياضية', 'Sports Medical Appointments & Bookings')}</h1>
          <p>
            {L(
              'حجز موعد الكشف الطبي في المستشفيات المعتمدة، وسداد الرسوم الموحدة، وتلقي رمز الدخول الفوري للمستشفى',
              'Reserve medical exam appointments at accredited hospitals, pay unified fees, and obtain instant QR check-in pass'
            )}
          </p>
        </div>

        <div className="act np">
          <button
            type="button"
            className={`btn ${activeSubTab === 'wizard' ? '' : 'sec sm'}`}
            onClick={() => setActiveSubTab('wizard')}
          >
            <PlusCircle className="w-4 h-4" />
            {L('حجز كشف جديد', 'New booking')}
          </button>
          <button
            type="button"
            className={`btn ${activeSubTab === 'list' ? '' : 'sec sm'}`}
            onClick={() => setActiveSubTab('list')}
          >
            <Calendar className="w-4 h-4" />
            {L('حجوزاتي', 'My bookings')} ({myBookings.length})
          </button>
        </div>
      </div>

      {/* SubTab 1: Wizard View */}
      {activeSubTab === 'wizard' && (
        <>
          {completedBooking ? (
            /* Confirmation Screen */
            <div className="card max-w-xl mx-auto text-center p-6 sm:p-7">
              <div className="w-14 h-14 rounded-full bg-[var(--success-bg)] text-[var(--success-dark)] flex items-center justify-center mx-auto mb-2.5">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <b className="text-base sm:text-lg text-[var(--ink)] block">
                {L('تم تأكيد الحجز الطبي بنجاح', 'Booking Confirmed Successfully')}
              </b>
              <div className="mono text-2xl font-bold text-[var(--primary-700)] my-1.5">
                {completedBooking.bk}
              </div>

              <p className="mut text-xs max-w-md mx-auto mb-3">
                {completedBooking.hosp}
                <br />
                {completedBooking.date} · {completedBooking.time}
              </p>

              <div className="text-xs my-2">
                {L('رسم الكشف', 'Exam fee')} {levelObj.fee} + {L('رسم الميكنة', 'automation')} {autoFee} ={' '}
                <b className="num text-[var(--primary-700)] text-sm">{completedBooking.fee} {L('جنيه', 'EGP')}</b>
              </div>

              {/* QR Code Container */}
              <div className="my-3 inline-block">
                <QRCodeSVG seed={completedBooking.bk} size={100} />
              </div>

              <div className="mut text-[11px] mb-4">
                {L('اعرض هذا الرمز عند استقبال وحدة الطب الرياضي بالمستشفى', 'Show this code at hospital reception desk')}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  className="btn sec sm"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4" />
                  {L('طباعة الإيصال', 'Print voucher')}
                </button>
                <button
                  type="button"
                  className="btn sm"
                  onClick={handleResetWizard}
                >
                  <PlusCircle className="w-4 h-4" />
                  {L('حجز جديد', 'New booking')}
                </button>
                <button
                  type="button"
                  className="btn ghost sm"
                  onClick={() => setActiveSubTab('list')}
                >
                  {L('عرض حجوزاتي', 'View my bookings')}
                </button>
              </div>
            </div>
          ) : (
            /* Multi-Step Wizard */
            <div className="card max-w-2xl mx-auto">
              {/* Stepper matching CSS .steps */}
              <div className="steps mb-5">
                {[
                  { n: 1, label: L('الهوية', 'Identity') },
                  { n: 2, label: L('المستوى', 'Level') },
                  { n: 3, label: L('الموعد', 'Slot') },
                  { n: 4, label: L('الدفع', 'Payment') }
                ].map((s) => {
                  const isDone = step > s.n;
                  const isCur = step === s.n;
                  return (
                    <div
                      key={s.n}
                      className={`s ${isDone ? 'done' : isCur ? 'on' : ''}`}
                      onClick={() => {
                        if (isDone) setStep(s.n);
                      }}
                      style={{ cursor: isDone ? 'pointer' : 'default' }}
                    >
                      <div className="dot flex items-center justify-center">
                        {isDone ? <Check className="w-3.5 h-3.5" /> : s.n}
                      </div>
                      <span>{s.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Step 1: Identity & Validation */}
              {step === 1 && (
                <div>
                  <h3>
                    <span className="d"></span>
                    {L('بيانات الهوية والتحقق من الرقم القومي', 'National ID Verification')}
                  </h3>

                  {userRole === 'guardian' && (
                    <div className="nt ok text-xs mb-3 flex items-center justify-between">
                      <div>
                        <span>{L('أنت تحجز الآن موعد الفحص للابن: ', 'Booking exam appointment for child: ')}</span>
                        <b>{p.name}</b> ({p.age} {L('سنة', 'y')} · {cfg.sports[p.sp]})
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('citizen-family')}
                        className="text-[var(--primary)] hover:underline font-bold text-xs"
                      >
                        {L('تبديل الابن', 'Switch')}
                      </button>
                    </div>
                  )}

                  <label className="f">
                    <span>{L('الرقم القومي (14 رقمًا) *', 'National ID (14 digits) *')}</span>
                    <input
                      dir="ltr"
                      type="text"
                      maxLength={14}
                      value={nid}
                      onChange={(e) => setNid(e.target.value.replace(/\D/g, ''))}
                      placeholder="31005120104829"
                      className="mono"
                    />
                  </label>

                  <div className="g2">
                    <label className="f">
                      <span>{L('رقم المحمول للتواصل *', 'Mobile number *')}</span>
                      <input
                        dir="ltr"
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="01012345678"
                      />
                    </label>
                    <label className="f">
                      <span>{L('رمز التحقق OTP *', 'OTP code *')}</span>
                      <input
                        dir="ltr"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="······"
                        style={{ letterSpacing: '4px' }}
                      />
                    </label>
                  </div>

                  <div className="nt">
                    {L(
                      'تُستخرج السن والنوع والمحافظة تلقائيًا من الرقم القومي؛ تحت 18 سنة يُربط الحساب بولي الأمر.',
                      'Age, gender and governorate are derived automatically from the national ID; under 18 the account links to a guardian.'
                    )}
                  </div>

                  <div className="flex justify-end mt-3">
                    <button
                      type="button"
                      className="btn"
                      onClick={handleNextStep1}
                    >
                      <span>{L('متابعة', 'Continue')}</span>
                      {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Sport & Level */}
              {step === 2 && (
                <div>
                  <h3>
                    <span className="d"></span>
                    {L('تحديد اللعبة ونوع المشاركة الرياضية', 'Sport & Participation Level')}
                  </h3>

                  <label className="f">
                    <span>{L('اللعبة *', 'Sport *')}</span>
                    <select
                      value={selectedSport}
                      onChange={(e) => setSelectedSport(Number(e.target.value))}
                    >
                      {cfg.sports.map((sp, idx) => (
                        <option key={idx} value={idx}>
                          {isRTL ? sp : SP_EN[sp] || sp}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="f">
                    <span>{L('نوع المشاركة الرياضية *', 'Participation type *')}</span>
                    <select
                      value={selectedPartType}
                      onChange={(e) => setSelectedPartType(Number(e.target.value))}
                    >
                      {cfg.parts.map((pr, idx) => (
                        <option key={idx} value={idx}>
                          {isRTL ? pr[0] : pr[1]}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="nt">
                    {L(
                      'يتحدد مستوى الكود الطبي وقائمة الفحوصات الإلزامية ورسم الكشف تلقائيًا وفق نوع المشاركة.',
                      'Medical-code level and exam list are determined automatically according to participation type.'
                    )}
                  </div>

                  {/* Level preview box */}
                  <div className="p-3 rounded-lg border border-[var(--line)] bg-[var(--bg)]/50 my-[10px] text-xs">
                    <div className="flex justify-between items-center mb-1.5">
                      <b className="text-[var(--ink)] text-sm">{isRTL ? levelObj.ar : levelObj.en}</b>
                      <span className="font-bold text-[var(--primary-700)] bg-[var(--primary-50)] px-2 py-0.5 rounded">
                        {examFee} {L('ج.م', 'EGP')}
                      </span>
                    </div>
                    <div className="chips">
                      {levelObj.ex.map((test, idx) => (
                        <span key={idx} className="tag ti">
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="g2 mt-4">
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={() => setStep(1)}
                    >
                      {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                      <span>{L('رجوع', 'Back')}</span>
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={handleNextStep2}
                    >
                      <span>{L('متابعة', 'Continue')}</span>
                      {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Hospital & Slot */}
              {step === 3 && (
                <div>
                  <h3>
                    <span className="d"></span>
                    {L('اختيار المستشفى وتحديد الموعد المتاح', 'Hospital & Slot Selection')}
                  </h3>

                  <label className="f">
                    <span>{L('المستشفى المعتمد *', 'Accredited hospital *')}</span>
                    <select
                      value={selectedHospital}
                      onChange={(e) => setSelectedHospital(Number(e.target.value))}
                    >
                      {hosps.map((hosp, idx) => (
                        <option key={hosp.id} value={idx}>
                          {isRTL ? hosp.n : hosp.nEn || hosp.n} — {isRTL ? hosp.gov : GOV_EN[hosp.gov] || hosp.gov}
                        </option>
                      ))}
                    </select>
                  </label>

                  <b style={{ fontSize: '12px', color: 'var(--ink)', display: 'block', margin: '10px 0 6px' }}>
                    {L('المواعيد المتاحة للحجز:', 'Available shifts:')}
                  </b>
                  <div className="chips">
                    {cfg.shifts.map((sh, idx) => {
                      const isSelected = selectedSlotIndex === idx;
                      return (
                        <span
                          key={idx}
                          className={`chip ${isSelected ? 'on' : ''}`}
                          onClick={() => setSelectedSlotIndex(idx)}
                        >
                          {sh.d} {sh.f}
                        </span>
                      );
                    })}
                  </div>

                  <div className="g2 mt-4">
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={() => setStep(2)}
                    >
                      {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                      <span>{L('رجوع', 'Back')}</span>
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={handleNextStep3}
                    >
                      <span>{L('متابعة', 'Continue')}</span>
                      {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Declaration & Payment */}
              {step === 4 && (
                <div>
                  <h3>
                    <span className="d"></span>
                    {L('إقرار ما قبل الكشف وسداد الرسوم', 'Pre-Exam Declaration & Payment')}
                  </h3>

                  <div className="p-3 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 my-[10px] space-y-2">
                    <label className="chk">
                      <input
                        type="checkbox"
                        checked={decCardiac}
                        onChange={(e) => setDecCardiac(e.target.checked)}
                      />
                      <span>{L('لا يوجد تاريخ مرضي قلبي أو توقف مفاجئ للقلب في العائلة.', 'No family history of sudden cardiac arrest or inherited heart conditions.')}</span>
                    </label>

                    <label className="chk">
                      <input
                        type="checkbox"
                        checked={decFainting}
                        onChange={(e) => setDecFainting(e.target.checked)}
                      />
                      <span>{L('لم أتعرض لفقدان وعي أو ألم بالصدر أثناء التدريب أو المجهود البدني.', 'No fainting or chest tightness during athletic training.')}</span>
                    </label>

                    <label className="chk">
                      <input
                        type="checkbox"
                        checked={decLawConsent}
                        onChange={(e) => setDecLawConsent(e.target.checked)}
                      />
                      <span>{L('موافقة معالجة البيانات وإصدار الشهادة إلكترونيًا (قانون 151/2020).', 'Data-processing consent per Law 151/2020.')}</span>
                    </label>
                  </div>

                  {/* Fee Breakdown Table */}
                  <table className="t">
                    <tbody>
                      <tr>
                        <td>{L('رسم الكشف الطبي', 'Medical exam fee')}</td>
                        <td className="num text-end">{examFee}</td>
                      </tr>
                      <tr>
                        <td>{L('رسم الميكنة والشهادة الرقمية', 'Automation fee')}</td>
                        <td className="num text-end">{autoFee}</td>
                      </tr>
                      <tr>
                        <td><b>{L('الإجمالي المستحق', 'Total')}</b></td>
                        <td className="num text-end"><b>{totalFee} {L('ج.م', 'EGP')}</b></td>
                      </tr>
                    </tbody>
                  </table>

                  <label className="f" style={{ marginTop: '10px' }}>
                    <span>{L('وسيلة الدفع *', 'Payment method *')}</span>
                    <select
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(Number(e.target.value))}
                    >
                      {cfg.pay.map((pm, idx) => (
                        <option key={idx} value={idx}>
                          {isRTL ? pm[0] : pm[1]}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="g2 mt-4">
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={() => setStep(3)}
                    >
                      {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                      <span>{L('رجوع', 'Back')}</span>
                    </button>
                    <button
                      type="button"
                      className="btn okbtn"
                      onClick={handlePayAndConfirm}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{L('دفع وتأكيد الحجز', 'Pay & confirm')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* SubTab 2: My Bookings List */}
      {activeSubTab === 'list' && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="m-0">
              <span className="d"></span>
              {L('سجل الحجوزات الطبية القائمة والسابقة', 'Current & Previous Medical Appointments')}
            </h3>
            <span className="mut text-xs">{myBookings.length} {L('حجوزات', 'records')}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="t">
              <thead>
                <tr>
                  <th>{L('رقم الحجز', 'Booking #')}</th>
                  <th>{L('المستشفى المعتمد', 'Hospital')}</th>
                  <th>{L('الموعد', 'Slot')}</th>
                  <th>{L('اللعبة والمستوى', 'Sport & Level')}</th>
                  <th>{L('الرسوم', 'Fee')}</th>
                  <th>{L('الحالة', 'Status')}</th>
                  <th>{L('إجراءات', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {myBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="mono font-bold text-[var(--primary)]">{b.bk}</td>
                    <td><b>{isRTL ? b.hosp : b.hospEn || b.hosp}</b></td>
                    <td className="text-xs">
                      <div>{isRTL ? b.date : b.dateEn || b.date}</div>
                      <div className="text-[var(--muted)] mono">{b.time}</div>
                    </td>
                    <td>
                      <div>{b.sport}</div>
                      <span className="text-xs text-[var(--muted)]">{L(`المستوى ${b.level}`, `Level ${b.level}`)}</span>
                    </td>
                    <td className="mono text-xs">{b.fee} {L('ج.م', 'EGP')}</td>
                    <td>
                      <StatusTag status={b.st} />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn sec sm"
                        onClick={() => setSelectedQRBooking(b)}
                        title={L('عرض رمز QR للاستقبال', 'View QR code')}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>{L('رمز الدخول', 'Pass')}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR Check-in Modal */}
      {selectedQRBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--card)] w-full max-w-sm rounded-2xl p-5 border border-[var(--line)] shadow-[var(--shadow-lg)] text-center relative">
            <button
              onClick={() => setSelectedQRBooking(null)}
              className="absolute top-3 inset-inline-end-3 p-1 rounded-full text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-50)]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-full bg-[var(--primary-50)] text-[var(--primary)] flex items-center justify-center mx-auto mb-2">
              <QrCode className="w-5 h-5" />
            </div>

            <b className="text-sm text-[var(--ink)] block mb-1">
              {L('بطاقة دخول الكشف الطبي', 'Medical Exam Check-in Pass')}
            </b>
            <div className="mono font-bold text-base text-[var(--primary-700)] mb-3">
              {selectedQRBooking.bk}
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-[var(--line)] inline-block mb-3">
              <QRCodeSVG seed={selectedQRBooking.bk} size={110} />
            </div>

            <p className="mut text-xs">
              {isRTL ? selectedQRBooking.hosp : selectedQRBooking.hospEn || selectedQRBooking.hosp}
              <br />
              <b className="text-[var(--ink)]">{isRTL ? selectedQRBooking.date : selectedQRBooking.dateEn} · {selectedQRBooking.time}</b>
            </p>

            <button
              type="button"
              className="btn sm w-full mt-3 justify-center"
              onClick={() => setSelectedQRBooking(null)}
            >
              {L('إغلاق', 'Close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
