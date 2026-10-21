import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useSeha } from '../../../context/SehaContext';
import { KPICard } from '../../Common/KPICard';
import { fmtDate } from '../../../data/mockData';
import {
  Award,
  Calendar,
  ShieldCheck,
  Activity,
  Home,
  QrCode,
  CheckCircle2,
  HeartPulse,
  Sparkles
} from 'lucide-react';

export const CitizenHomeTab = () => {
  const { isRTL, L } = useLanguage();
  const {
    players,
    selectedPlayerIndex,
    hosps,
    clubs,
    cfg,
    consents,
    navigate,
    SP_EN,
    GOV_EN
  } = useSeha();

  const p = players[selectedPlayerIndex] || players[0];
  const h = hosps[p.hs] || hosps[0];
  const c = clubs[p.cl] || clubs[0];
  const lv = cfg.levels[p.lv - 1] || cfg.levels[0];

  const activeConsentsCount = consents.filter(cs => cs.st === 'ok').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('بوابة المواطن — الملف الطبي الرياضي', 'Citizen Portal — Athlete Medical Profile')}
          </span>
          <h1>{p.name}</h1>
          <p className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[var(--muted)] mt-1">
            <span className="font-semibold text-[var(--ink)]">
              {isRTL ? cfg.sports[p.sp] : SP_EN[cfg.sports[p.sp]] || cfg.sports[p.sp]}
            </span>
            <span className="text-[var(--muted)]/50">·</span>
            <span>{isRTL ? lv.ar : lv.en}</span>
            <span className="text-[var(--muted)]/50">·</span>
            <span>{p.age} {L('سنة', 'years')}</span>
            <span className="text-[var(--muted)]/50">·</span>
            <span className="font-mono text-[var(--ink)]">{p.nid}</span>
            <span className="text-[var(--muted)]/50">·</span>
            <span>{isRTL ? c.n : c.nEn || c.n}</span>
          </p>
        </div>
        <div className="act np">
          <button className="btn" onClick={() => navigate('citizen-bookings')}>
            <Calendar className="w-4 h-4" /> {L('حجز كشف جديد', 'Book exam')}
          </button>
        </div>
      </div>

      {/* 4 KPIs */}
      <div className="g4" style={{ marginBottom: '10px' }}>
        <KPICard
          variant="emerald"
          value={1}
          label={L('شهادات طبية سارية', 'Valid certificates')}
          icon={Award}
          subtext={L('سارية حتى 14/10/2027', 'Valid until 14/10/2027')}
        />
        <KPICard
          variant="brand"
          value={1}
          label={L('حجوزات قائمة مؤكدة', 'Confirmed bookings')}
          icon={Calendar}
          subtext={L('BK-26-018245 · مستشفى هليوبوليس', 'BK-26-018245 · Heliopolis')}
        />
        <KPICard
          variant="primary-700"
          value={activeConsentsCount}
          label={L('موافقات اطلاع سارية', 'Active consents')}
          icon={ShieldCheck}
          subtext={L('قانون حماية البيانات 151/2020', 'Law 151/2020')}
        />
        <KPICard
          variant="teal"
          value={p.lv}
          label={L('الكود الطبي المعتمد', 'Accredited medical level')}
          icon={Activity}
          subtext={isRTL ? cfg.parts[p.lv - 1]?.[0] : cfg.parts[p.lv - 1]?.[1]}
        />
      </div>

      {/* Quick Actions Navigation Cards */}
      <div className="card">
        <div>
          <h3 className="mb-3">
            <span className="d"></span>
            {L('الخدمات السريعة للمواطن', 'Citizen Quick Services')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div
              onClick={() => navigate('citizen-bookings')}
              className="p-3 rounded-lg border border-[var(--line)] bg-[var(--card)] hover:border-[var(--primary)] hover:bg-[var(--primary-50)]/40 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary-50)] text-[var(--primary)] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <b className="block text-xs sm:text-sm text-[var(--ink)]">
                    {L('حجز فحص طبي جديد', 'Book Medical Exam')}
                  </b>
                  <span className="text-[11px] text-[var(--muted)]">
                    {L('اختيار المستشفى والموعد', 'Hospital & slot selection')}
                  </span>
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate('citizen-certs')}
              className="p-3 rounded-lg border border-[var(--line)] bg-[var(--card)] hover:border-[var(--primary)] hover:bg-[var(--primary-50)]/40 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--success-bg)] text-[var(--success-dark)] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <b className="block text-xs sm:text-sm text-[var(--ink)]">
                    {L('سجل شهاداتي الطبية', 'My Certificates')}
                  </b>
                  <span className="text-[11px] text-[var(--muted)]">
                    {L('الشهادات السارية والسابقة', 'Current & past records')}
                  </span>
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate('citizen-consents')}
              className="p-3 rounded-lg border border-[var(--line)] bg-[var(--card)] hover:border-[var(--primary)] hover:bg-[var(--primary-50)]/40 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary-100)] text-[var(--primary-700)] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <b className="block text-xs sm:text-sm text-[var(--ink)]">
                    {L('إدارة موافقات الاطلاع', 'Access Consents')}
                  </b>
                  <span className="text-[11px] text-[var(--muted)]">
                    {L('تفويض الأندية والاتحادات', 'Manage club authorizations')}
                  </span>
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate('verify')}
              className="p-3 rounded-lg border border-[var(--line)] bg-[var(--card)] hover:border-[var(--primary)] hover:bg-[var(--primary-50)]/40 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <b className="block text-xs sm:text-sm text-[var(--ink)]">
                    {L('التحقق العام المباشر', 'Public Verification')}
                  </b>
                  <span className="text-[11px] text-[var(--muted)]">
                    {L('التحقق برقم الشهادة أو الرمز', 'Verify by cert # or QR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="nt ok text-xs mt-3 flex items-center gap-2 mb-0">
          <Sparkles className="w-4 h-4 flex-none text-[var(--success)]" />
          <span>
            {L(
              'الشهادة معتمدة طبقًا للقرار الوزاري 1642 لسنة 2024 وصالحة لكافة الألعاب والاتحادات المصرية.',
              'The certificate is certified under Decree 1642/2024 and valid across all Egyptian sporting bodies.'
            )}
          </span>
        </div>
      </div>

      {/* Activity Timeline & Clinical Summary */}
      <div className="g2">
        {/* Timeline of Athlete Actions */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="m-0">
              <span className="d"></span>
              {L('سجل العمليات والخط الزمني', 'Operational Timeline')}
            </h3>
            <span className="text-xs font-semibold text-[var(--muted)]">{L('مكتمل', 'Completed')}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2.5 p-2 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 text-xs">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <b>{L('تأكيد الحجز وسداد الرسوم', 'Booking Confirmed')}</b>
                  <span className="mono text-[11px] text-[var(--muted)]">{p.bk}</span>
                </div>
                <span className="text-[11.5px] text-[var(--muted)] block mt-0.5">
                  {L('تم الحجز والدفع الإلكتروني الموحد في', 'e-Payment completed at')} {isRTL ? h.n : h.nEn || h.n}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 text-xs">
              <HeartPulse className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <b>{L('إجراء الكشف الطبي الموحد', 'Clinical Examination Executed')}</b>
                  <span className="text-[11px] text-[var(--muted)]">{fmtDate(p.iss, isRTL ? 'ar' : 'en')}</span>
                </div>
                <span className="text-[11.5px] text-[var(--muted)] block mt-0.5">
                  {L('فحص إكلينيكي، رسم قلب ECG، إيكو، وصورة دم كاملة CBC', 'Clinical exam, ECG, ECHO, and CBC completed')}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 text-xs">
              <ShieldCheck className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <b>{L('اعتماد النتيجة والتوقيع الإلكتروني', 'Approval & E-Signature')}</b>
                  <span className="mono text-[11px] text-[var(--primary)] font-bold">{p.tm}</span>
                </div>
                <span className="text-[11.5px] text-[var(--muted)] block mt-0.5">
                  {L('اعتمدت النتيجة من المدير الطبي بالتوقيع الإلكتروني المرخص', 'Approved by Medical Director with licensed e-signature')}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 text-xs">
              <Award className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <b>{L('إصدار الشهادة الرقمية المعتمدة', 'Certificate Issued')}</b>
                  <span className="mono text-[11px] text-[var(--primary-700)] font-bold">{p.ct}</span>
                </div>
                <span className="text-[11.5px] text-[var(--muted)] block mt-0.5">
                  {L('الشهادة متاحة رقميًا ومربوطة برمز التحقق QR Code', 'Certificate available digitally with QR verification code')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Vitals & Contacts */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="m-0">
              <span className="d"></span>
              {L('المؤشرات الحيوية وبيانات التواصل', 'Clinical Vitals & Contacts')}
            </h3>
            <span className="text-xs font-semibold text-[var(--primary-700)] bg-[var(--primary-50)] px-2.5 py-0.5 rounded-full">
              {L('سري ومحمي', 'Confidential')}
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 text-center">
                <span className="block text-[11px] text-[var(--muted)]">{L('ضغط الدم الأخير', 'Last Blood Pressure')}</span>
                <b className="text-base font-mono text-[var(--primary-700)] mt-0.5 block">{p.bp}</b>
                <span className="text-[10.5px] text-[var(--success)] font-bold">{L('طبيعي', 'Normal')}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 text-center">
                <span className="block text-[11px] text-[var(--muted)]">{L('معدل نبضات القلب', 'Resting Heart Rate')}</span>
                <b className="text-base font-mono text-[var(--primary-700)] mt-0.5 block">{p.hr} <small className="text-xs font-normal">bpm</small></b>
                <span className="text-[10.5px] text-[var(--success)] font-bold">{L('نظم جيبي سليم', 'Sinus Rhythm')}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">{p.age < 18 ? L('اسم ولي الأمر:', 'Guardian Name:') : L('جهة العمل / النادي:', 'Club / Affiliate:')}</span>
                <b className="text-[var(--ink)]">{p.age < 18 ? p.gd : (isRTL ? c.n : c.nEn || c.n)}</b>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">{L('هاتف التواصل المسجل:', 'Contact Phone:')}</span>
                <b className="mono text-[var(--ink)]">01012345678</b>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">{L('المحافظة السكنية:', 'Governorate:')}</span>
                <b className="text-[var(--ink)]">{isRTL ? p.gov : GOV_EN[p.gov] || p.gov}</b>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">{L('جهة الفحص المعتمدة:', 'Accredited Unit:')}</span>
                <b className="text-[var(--ink)]">{isRTL ? h.n : h.nEn || h.n}</b>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--primary-50)] text-xs text-[var(--primary-700)] flex items-center justify-between">
              <div>
                <b>{L('موعد التجديد السنوي القادم', 'Next Annual Renewal Due')}</b>
                <span className="text-[11px] text-[var(--muted)] block">
                  {L('يُوصى بالحجز قبل شهر من تاريخ الانتهاء', 'Book 1 month before expiry')}
                </span>
              </div>
              <b className="font-mono text-xs">{fmtDate(p.exp, isRTL ? 'ar' : 'en')}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
