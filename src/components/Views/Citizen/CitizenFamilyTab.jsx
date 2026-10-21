import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useSeha } from '../../../context/SehaContext';
import { StatusTag } from '../../Common/StatusTag';
import { KPICard } from '../../Common/KPICard';
import { fmtDate } from '../../../data/mockData';
import {
  Users,
  UserPlus,
  Link2,
  CheckCircle2,
  Clock,
  Award,
  Calendar,
  Activity,
  HeartPulse,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UserCheck
} from 'lucide-react';

export const CitizenFamilyTab = () => {
  const { isRTL, L } = useLanguage();
  const {
    players,
    selectedPlayerIndex,
    setSelectedPlayerIndex,
    cfg,
    navigate,
    showToast,
    connectExistingChild,
    registerNewChild,
    SP_EN,
    GOV_EN
  } = useSeha();

  const [showAddModal, setShowAddModal] = useState(false);
  const [modalTab, setModalTab] = useState('connect'); // 'connect' | 'register'

  // Connect existing child form
  const [connectNid, setConnectNid] = useState('');
  const [connectRel, setConnectRel] = useState('ابن');
  const [connectDob, setConnectDob] = useState('2014-05-12');
  const [connectCode, setConnectCode] = useState('');

  // Register new child form
  const [newChildName, setNewChildName] = useState('');
  const [newChildNid, setNewChildNid] = useState('');
  const [newChildGender, setNewChildGender] = useState('M');
  const [newChildRel, setNewChildRel] = useState('ابن');
  const [newChildAge, setNewChildAge] = useState(11);
  const [newChildSport, setNewChildSport] = useState(0);

  // All connected family children: son and daughter
  const familyChildren = players;
  const currentChild = players[selectedPlayerIndex] || familyChildren[0] || players[0];

  const handleSelectChild = (idx) => {
    setSelectedPlayerIndex(idx);
    const selected = players[idx];
    const relText = selected?.rel?.ar || 'اللاعب';
    showToast(`تم تعيين ملف «${selected.name}» (${relText}) كملف نشط للمنظومة`);
  };

  const handleOpenChildService = (idx, route) => {
    setSelectedPlayerIndex(idx);
    navigate(route);
  };

  const handleConnectExistingSubmit = (e) => {
    e.preventDefault();
    const cleanId = connectNid.replace(/\D/g, '');
    if (cleanId.length !== 14) {
      showToast(L('الرقم القومي يجب أن يتكون من 14 رقمًا صحيحًا', 'National ID must be 14 digits'));
      return;
    }

    connectExistingChild({
      nationalId: cleanId,
      relationship: connectRel,
      name: isRTL ? `ابن رياضي (${connectRel})` : `Child (${connectRel})`,
      age: 12
    });

    setShowAddModal(false);
    setConnectNid('');
  };

  const handleRegisterNewSubmit = (e) => {
    e.preventDefault();
    if (!newChildName.trim()) {
      showToast(L('يرجى كتابة اسم الابن بالكامل', 'Please enter child full name'));
      return;
    }
    const cleanId = newChildNid.replace(/\D/g, '');
    if (cleanId.length !== 14) {
      showToast(L('الرقم القومي يجب أن يتكون من 14 رقمًا صحيحًا', 'National ID must be 14 digits'));
      return;
    }

    registerNewChild({
      name: newChildName.trim(),
      nationalId: cleanId,
      gender: newChildGender,
      relationship: newChildRel,
      age: Number(newChildAge),
      sport: Number(newChildSport),
      verificationStatus: 'verified'
    });

    setShowAddModal(false);
    setNewChildName('');
    setNewChildNid('');
  };

  // KPIs
  const verifiedCount = familyChildren.filter(c => c.verificationStatus !== 'pending').length;
  const pendingCount = familyChildren.filter(c => c.verificationStatus === 'pending').length;
  const validCertsCount = familyChildren.filter(c => c.st === 'fit').length;

  return (
    <div className="page-stack">
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('بوابة المواطن — حساب ولي الأمر (إدارة العائلة)', 'Citizen Portal — Guardian Family Hub')}
          </span>
          <h1>{L('إدارة ملفات الأبناء والرياضيين التابعين', 'Family Management & Connected Athlete Profiles')}</h1>
          <p>
            {L(
              'متابعة وإدارة الملفات الطبية المعتمدة لأبنائك، حجز الكشوفات لهم، والتبديل المباشر بين الحسابات الموثقة',
              'Manage certified medical profiles for your children, book examinations, and switch between verified athlete accounts'
            )}
          </p>
        </div>

        <div className="act np">
          <button
            type="button"
            className="btn"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-4 h-4" />
            <span>{L('إضافة / ربط ابن جديد', 'Connect / Add Child')}</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs */}
      <div className="g4">
        <KPICard
          variant="brand"
          value={familyChildren.length}
          label={L('الأبناء الرياضيون المسجلون', 'Connected Children')}
          icon={Users}
          subtext={L('ملفات تابعة لحسابك العائلي', 'Linked to your guardian account')}
        />
        <KPICard
          variant="emerald"
          value={verifiedCount}
          label={L('ملفات موثقة رسميًا', 'Verified Profiles')}
          icon={ShieldCheck}
          subtext={L('تم التحقق من صلة القرابة', 'Guardian custody confirmed')}
        />
        <KPICard
          variant="primary-700"
          value={validCertsCount}
          label={L('شهادات طبية سارية', 'Valid Medical Certs')}
          icon={Award}
          subtext={L('جاهزون للمشاركات الرياضية', 'Cleared for athletic competition')}
        />
        <KPICard
          variant="teal"
          value={pendingCount}
          label={L('بانتظار استكمال التوثيق', 'Pending Verification')}
          icon={Clock}
          subtext={L('مطلوب تأكيد مستند الولاية', 'Pending proof of custody')}
        />
      </div>

      {/* Active Child Spotlight Card */}
      <div className="card bg-gradient-to-r from-[var(--primary-50)] via-[var(--card)] to-[var(--card)] border-2 border-[var(--primary)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0 mt-0.5">
              {currentChild.name.charAt(0)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--primary)] text-white">
                  {L('الملف النشط حاليًا', 'Active Athlete Context')}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--line)] text-[var(--muted)] font-semibold">
                  {currentChild.rel?.ar || L('الابن', 'Child')}
                </span>
                {currentChild.verificationStatus === 'pending' ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {L('قيد التحقق', 'Pending')}
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {L('موثق رسميًا', 'Verified')}
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-bold text-[var(--ink)] mt-1 mb-0.5">
                {currentChild.name}
              </h2>

              <p className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                <span className="font-semibold text-[var(--ink)]">
                  {isRTL ? cfg.sports[currentChild.sp] : SP_EN[cfg.sports[currentChild.sp]] || cfg.sports[currentChild.sp]}
                </span>
                <span>·</span>
                <span>{currentChild.age} {L('سنة', 'years')}</span>
                <span>·</span>
                <span className="mono">{currentChild.nid}</span>
                <span>·</span>
                <span>{L('رقم الشهادة:', 'Cert:')} <b className="mono text-[var(--primary-700)]">{currentChild.ct}</b></span>
              </p>
            </div>
          </div>

          {/* Quick Nav Actions for the Selected Child */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--line)]">
            <button
              type="button"
              className="btn sm"
              onClick={() => navigate('citizen-home')}
              title={L('الانتقال للرئيسية والملف الطبي', 'Go to athlete dashboard')}
            >
              <Activity className="w-4 h-4" />
              <span>{L('الرئيسية والملف', 'Dashboard')}</span>
            </button>

            <button
              type="button"
              className="btn sec sm"
              onClick={() => navigate('citizen-bookings')}
              title={L('حجز فحص طبي جديد لهذا الابن', 'Book medical exam')}
            >
              <Calendar className="w-4 h-4" />
              <span>{L('حجز كشف طبي', 'Book Exam')}</span>
            </button>

            <button
              type="button"
              className="btn sec sm"
              onClick={() => navigate('citizen-history')}
              title={L('استعراض السجل الطبي الكامل', 'View medical history')}
            >
              <HeartPulse className="w-4 h-4" />
              <span>{L('السجل الطبي', 'Medical History')}</span>
            </button>

            <button
              type="button"
              className="btn sec sm"
              onClick={() => navigate('citizen-certs')}
              title={L('عرض الشهادات المعتمدة', 'View certificates')}
            >
              <Award className="w-4 h-4" />
              <span>{L('الشهادات', 'Certificates')}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Grid of All Connected Children */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="m-0">
              <span className="d"></span>
              {L('قائمة الأبناء والرياضيين التابعين في حسابك', 'Connected Family Athlete Profiles')}
            </h3>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {L(
                'اختر أي ابن لتعيينه كملف نشط أو للبدء في إجراءات الفحص الطبي واستخراج الشهادات له.',
                'Select any child to set as active or start booking medical examinations.'
              )}
            </p>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[var(--primary-50)] text-[var(--primary)] border border-[var(--line)]">
            {familyChildren.length} {L('ملفات عائلية', 'Profiles')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
          {familyChildren.map((child, fIdx) => {
            const actualIndex = fIdx;
            const isActive = selectedPlayerIndex === actualIndex;
            const isPending = child.verificationStatus === 'pending';

            return (
              <div
                key={child.id || actualIndex}
                className={`p-4 rounded-2xl border transition-all select-none flex flex-col justify-between ${
                  isActive
                    ? 'border-2 border-[var(--primary)] bg-[var(--primary-50)]/50 shadow-md ring-2 ring-[var(--primary)]/15'
                    : 'border-[var(--line)] bg-[var(--card)] hover:border-[var(--primary)]/60 hover:shadow-xs'
                }`}
              >
                {/* Top Card Row */}
                <div>
                  <div className="flex items-start justify-between gap-2.5 pb-2.5 border-b border-[var(--line)]/60">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                        isActive
                          ? 'bg-[var(--primary)] text-white'
                          : 'bg-[#0066CC]/15 text-[#0066CC] dark:text-[#ABC7E8]'
                      }`}>
                        {child.name.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-[var(--ink)] m-0 leading-tight">
                            {child.name}
                          </h4>
                          {isActive && (
                            <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-[var(--primary)] text-white font-bold">
                              {L('النشط', 'Active')}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[var(--muted)] block mt-0.5">
                          {child.rel?.ar || L('ابن', 'Son')} · {child.age} {L('سنة', 'years')}
                        </span>
                      </div>
                    </div>

                    {/* Verification Status Badge */}
                    <div>
                      {isPending ? (
                        <span className="tag tb text-[10px] font-bold" title={L('مطلوب التحقق من صلة القرابة', 'Custody verification pending')}>
                          <Clock className="w-3 h-3" />
                          <span>{L('قيد التحقق', 'Pending')}</span>
                        </span>
                      ) : (
                        <span className="tag tg text-[10px] font-bold" title={L('تم التحقق والتأكيد رسميًا', 'Formally verified')}>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{L('موثق', 'Verified')}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Demographics Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-3 border-b border-[var(--line)]/60">
                    <div>
                      <span className="mut text-[11px] block">{L('اللعبة المقيد بها:', 'Sport:')}</span>
                      <b className="text-[var(--ink)]">
                        {isRTL ? cfg.sports[child.sp] : SP_EN[cfg.sports[child.sp]] || cfg.sports[child.sp]}
                      </b>
                    </div>
                    <div>
                      <span className="mut text-[11px] block">{L('حالة اللياقة الطبية:', 'Medical Fitness:')}</span>
                      <StatusTag status={child.st} />
                    </div>
                    <div>
                      <span className="mut text-[11px] block">{L('الرقم القومي للتابع:', 'National ID:')}</span>
                      <span className="mono font-semibold text-[var(--ink)] text-[11.5px]">{child.nid}</span>
                    </div>
                    <div>
                      <span className="mut text-[11px] block">{L('الشهادة الطبية المعتمدة:', 'Certificate:')}</span>
                      <span className="mono font-bold text-[var(--primary-700)] text-[11.5px]">{child.ct}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
                  {isActive ? (
                    <div className="flex items-center gap-1.5 text-xs text-[var(--primary-700)] font-bold">
                      <UserCheck className="w-4 h-4 text-[#16845B]" />
                      <span>{L('الملف النشط حاليًا للمنظومة', 'Currently selected context')}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn sm"
                      onClick={() => handleSelectChild(actualIndex)}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{L('تعيين كملف نشط', 'Set as Active')}</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1.5 ms-auto">
                    <button
                      type="button"
                      className="btn sec sm"
                      onClick={() => handleOpenChildService(actualIndex, 'citizen-bookings')}
                      title={L('حجز كشف طبي', 'Book Exam')}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">{L('حجز كشف', 'Book')}</span>
                    </button>
                    <button
                      type="button"
                      className="btn sec sm"
                      onClick={() => handleOpenChildService(actualIndex, 'citizen-history')}
                      title={L('السجل الطبي', 'Medical History')}
                    >
                      <HeartPulse className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">{L('السجل', 'History')}</span>
                    </button>
                    <button
                      type="button"
                      className="btn ghost sm"
                      onClick={() => handleOpenChildService(actualIndex, 'citizen-home')}
                      title={L('فتح الملف الشخصي', 'View Profile')}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Legal & Regulatory Seal Notice */}
      <div className="nt ok flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
        <div className="text-xs">
          <b className="block mb-0.5">
            {L('حوكمة ولاية ولي الأمر الطبية — قانون الطفل وقانون حماية البيانات 151 لسنة 2020', 'Guardian Rights & Data Protection Law 151/2020')}
          </b>
          <span>
            {L(
              'يمتلك ولي الأمر المسجل الحق الحصري في إدارة ومتابعة الفحوصات الطبية ومنح موافقات الاطلاع للأندية للرياضيين القُصّر (دون سن 18 عامًا). تظل السجلات الطبية مشفرة ومحمية وفق أعلى معايير الخصوصية الوطنية.',
              'Registered guardians have full authority over minor athletes (<18 yrs) medical bookings, certifications, and club data consents per Law 151/2020.'
            )}
          </span>
        </div>
      </div>

      {/* Add / Connect Child Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[var(--card)] rounded-2xl p-5 sm:p-6 shadow-2xl border border-[var(--line)] relative text-start">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary-50)] text-[var(--primary)] flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--ink)] m-0">
                    {L('إضافة / ربط ملف رياضي بالأسرة', 'Connect or Add Athlete Child')}
                  </h3>
                  <p className="text-[11px] text-[var(--muted)] m-0">
                    {L('ربط حساب رياضي مسجل مسبقًا أو إنشاء ملف جديد لابنك', 'Link an existing athlete account or register a new child')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-50)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs: Connect Existing vs Register New */}
            <div className="flex items-center gap-1.5 p-1 bg-[var(--bg)] rounded-xl border border-[var(--line)] mt-4">
              <button
                type="button"
                onClick={() => setModalTab('connect')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === 'connect'
                    ? 'bg-[var(--primary)] text-white shadow-xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>{L('ربط حساب ابن مسجل مسبقًا', 'Link Existing Account')}</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('register')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === 'register'
                    ? 'bg-[var(--primary)] text-white shadow-xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{L('تسجيل ابن جديد بالمنظومة', 'Register New Child')}</span>
              </button>
            </div>

            {/* Tab 1: Connect Existing Account */}
            {modalTab === 'connect' ? (
              <form onSubmit={handleConnectExistingSubmit} className="space-y-3 mt-4 text-xs sm:text-sm">
                <div className="nt">
                  {L(
                    'استخدم هذا الخيار إذا كان لدى ابنك رقم قومي مسجل مسبقًا لدى نادٍ أو مركز شباب، أو لديه شهادة سابقة بالمنظومة.',
                    'Use this if your child is already registered with a club, youth center, or has a prior certificate in Seha.'
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                    {L('الرقم القومي للابن (14 رقمًا) *', 'Child National ID (14 digits) *')}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    value={connectNid}
                    onChange={(e) => setConnectNid(e.target.value.replace(/\D/g, ''))}
                    placeholder="31005120104829"
                    className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--ink)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                      {L('صلة القرابة *', 'Relationship *')}
                    </label>
                    <select
                      value={connectRel}
                      onChange={(e) => setConnectRel(e.target.value)}
                      className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-2.5 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
                    >
                      <option value="ابن">{L('ابن', 'Son')}</option>
                      <option value="ابنة">{L('ابنة', 'Daughter')}</option>
                      <option value="أخ">{L('أخ أصغر (تحت الوصاية)', 'Brother (Ward)')}</option>
                      <option value="أخت">{L('أخت صغرى (تحت الوصاية)', 'Sister (Ward)')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                      {L('تاريخ الميلاد المسجل *', 'Date of Birth *')}
                    </label>
                    <input
                      type="date"
                      required
                      value={connectDob}
                      onChange={(e) => setConnectDob(e.target.value)}
                      className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-2.5 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                    {L('رمز التحقق المرسل لهاتف ولي الأمر (اختياري)', 'OTP Verification Code (Optional)')}
                  </label>
                  <input
                    type="text"
                    value={connectCode}
                    onChange={(e) => setConnectCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--ink)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="pt-3 border-t border-[var(--line)] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--muted)] hover:bg-[var(--primary-50)] cursor-pointer"
                  >
                    {L('إلغاء', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="btn sm"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>{L('تأكيد وربط الحساب', 'Verify & Link Account')}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Tab 2: Register New Child */
              <form onSubmit={handleRegisterNewSubmit} className="space-y-3 mt-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                    {L('اسم الابن رباعيًا (كما بشهادة الميلاد) *', 'Child Full Name *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder={isRTL ? 'مثال: يوسف أحمد يوسف السيد' : 'e.g. Youssef Ahmad Youssef'}
                    className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                      {L('الرقم القومي (14 رقمًا) *', 'National ID (14 digits) *')}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={14}
                      value={newChildNid}
                      onChange={(e) => setNewChildNid(e.target.value.replace(/\D/g, ''))}
                      placeholder="31505120104829"
                      className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--ink)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                      {L('النوع *', 'Gender *')}
                    </label>
                    <select
                      value={newChildGender}
                      onChange={(e) => {
                        setNewChildGender(e.target.value);
                        setNewChildRel(e.target.value === 'F' ? 'ابنة' : 'ابن');
                      }}
                      className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-2.5 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
                    >
                      <option value="M">{L('ذكر', 'Male')}</option>
                      <option value="F">{L('أنثى', 'Female')}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                      {L('السن (بالسنوات) *', 'Age (years) *')}
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="21"
                      required
                      value={newChildAge}
                      onChange={(e) => setNewChildAge(e.target.value)}
                      className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                      {L('اللعبة الرياضية *', 'Sport / Discipline *')}
                    </label>
                    <select
                      value={newChildSport}
                      onChange={(e) => setNewChildSport(Number(e.target.value))}
                      className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-2.5 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
                    >
                      {cfg.sports.map((sp, idx) => (
                        <option key={idx} value={idx}>
                          {sp}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--line)] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--muted)] hover:bg-[var(--primary-50)] cursor-pointer"
                  >
                    {L('إلغاء', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="btn sm"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{L('تأكيد وتسجيل الابن', 'Register Child')}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
