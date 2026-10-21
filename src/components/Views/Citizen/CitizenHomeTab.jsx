import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useSeha } from '../../../context/SehaContext';
import { KPICard } from '../../Common/KPICard';
import { StatusTag } from '../../Common/StatusTag';
import { SectionHeader } from '../../Common/SectionHeader';
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
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Clock,
  Building2,
  User,
  Users,
  FileText,
  AlertCircle,
  Stethoscope,
  Phone,
  MapPin,
  ExternalLink
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
    userRole,
    SP_EN,
    GOV_EN
  } = useSeha();

  const p = players[selectedPlayerIndex] || players[0];
  const h = hosps[p.hs] || hosps[0];
  const c = clubs[p.cl] || clubs[0];
  const lv = cfg.levels[p.lv - 1] || cfg.levels[0];

  const activeConsentsCount = consents.filter(cs => cs.st === 'ok').length;

  return (
    <div className="page-stack">
      
      {/* =========================================================================
          SECTION 1: PROFILE SUMMARY CARD (Strict 12px rhythm, 8px chip gap, inline-end button)
          ========================================================================= */}
      <div className="card card-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[var(--space-4)]">
          
          {/* Identity & Metadata Details */}
          <div className="flex-1 min-w-0">
            {/* Row 1: Breadcrumb Badge Row (12px to title) */}
            <div className="flex flex-wrap items-center gap-[var(--control-gap)] mb-[var(--space-3)]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary-700)] text-xs font-bold border border-[var(--primary-100)]">
                <Home className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                {userRole === 'guardian'
                  ? L('بوابة المواطن — لوحة متابعة الابن الرياضي', 'Citizen Portal — Child Athlete Dashboard')
                  : L('بوابة المواطن — الملف الطبي للرياضي', 'Citizen Portal — Athlete Medical Dashboard')}
              </span>
              <StatusTag status={p.st} />
            </div>

            {/* Row 2: Athlete Name Row (12px to chips) */}
            <div className="flex flex-wrap items-baseline gap-[var(--space-3)] mb-[var(--space-3)]">
              <h1 className="m-0 text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight leading-tight">
                {p.name}
              </h1>
              {p.rel && (
                <span className="text-xs px-3 py-1 rounded-full bg-[var(--primary-100)] text-[var(--primary-700)] font-bold">
                  {isRTL ? p.rel.ar : p.rel.en}
                </span>
              )}
            </div>

            {/* Row 3: Metadata Chips Row (Wraps with 8px control-gap) */}
            <div className="flex flex-wrap items-center gap-[var(--control-gap)] text-xs sm:text-sm text-[var(--muted)]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg)] border border-[var(--line)] font-bold text-[var(--ink)]">
                <Activity className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>{isRTL ? cfg.sports[p.sp] : SP_EN[cfg.sports[p.sp]] || cfg.sports[p.sp]}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg)] border border-[var(--line)] font-semibold text-[var(--ink)]">
                <Award className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>{isRTL ? lv.ar : lv.en}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg)] border border-[var(--line)] font-semibold text-[var(--ink)]">
                <User className="w-3.5 h-3.5 text-[var(--muted)]" />
                <span>{p.age} {L('سنة', 'years')}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg)] border border-[var(--line)] font-mono font-bold text-[var(--ink)]" dir="ltr">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>{p.nid}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg)] border border-[var(--line)] font-semibold text-[var(--ink)]">
                <Building2 className="w-3.5 h-3.5 text-[var(--muted)]" />
                <span>{isRTL ? c.n : c.nEn || c.n}</span>
              </span>

              {p.gd && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--primary-50)] border border-[var(--primary-100)] font-bold text-[var(--primary-700)] dark:text-[#ABC7E8]">
                  <Users className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span>{L('ولي الأمر المسؤول:', 'Guardian:')} {p.gd}</span>
                </span>
              )}
            </div>
          </div>

          {/* Primary Action Button (Aligned to card's inline-end edge, stacks on mobile) */}
          <div className="flex items-center shrink-0 self-start lg:self-center">
            <button
              type="button"
              className="btn h-11 px-5 text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto"
              onClick={() => navigate('citizen-bookings')}
            >
              <Calendar className="w-4.5 h-4.5" />
              <span>{L('حجز فحص طبي جديد', 'Book Examination')}</span>
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================================
          SECTION 2: FOUR SUMMARY KPI CARDS (CSS Grid with var(--card-gap))
          ========================================================================= */}
      <div className="g4">
        <KPICard
          variant="emerald"
          value={1}
          label={L('شهادة طبية سارية (لائق)', 'Valid Certificate (Fit)')}
          icon={Award}
          subtext={`${L('سارية حتى', 'Valid until')} ${fmtDate(p.exp, isRTL ? 'ar' : 'en')}`}
        />
        <KPICard
          variant="brand"
          value={1}
          label={L('حجوزات قائمة مؤكدة', 'Confirmed Bookings')}
          icon={Calendar}
          subtext={`${p.bk} · ${isRTL ? h.n : h.nEn || h.n}`}
        />
        <KPICard
          variant="primary-700"
          value={activeConsentsCount}
          label={L('موافقات اطلاع سارية', 'Active Consents')}
          icon={ShieldCheck}
          subtext={L('قانون حماية البيانات 151/2020', 'Law 151/2020')}
        />
        <KPICard
          variant="teal"
          value={p.lv}
          label={L('الكود الطبي المعتمد', 'Accredited Medical Level')}
          icon={Activity}
          subtext={isRTL ? cfg.parts[p.lv - 1]?.[0] : cfg.parts[p.lv - 1]?.[1]}
        />
      </div>

      {/* =========================================================================
          SECTION 3: CERTIFICATE STATUS BANNER (16px internal grid gaps, CSS separators)
          ========================================================================= */}
      <div className="card card-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[var(--space-4)]">
          <div className="flex items-start gap-[var(--space-4)]">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-[var(--space-2)] mb-1.5">
                <h3 className="m-0 text-base sm:text-lg font-extrabold text-[var(--ink)] leading-snug">
                  {L('اللياقة الطبية سارية ومعتمدة رسميًا لكافة الاتحادات الرياضية', 'Medical clearance is active and certified under Decree 1642')}
                </h3>
                <span className="font-mono text-xs sm:text-sm px-3 py-1 rounded-md bg-[var(--primary-50)] text-[var(--primary-700)] font-bold border border-[var(--primary-100)]">
                  {p.ct}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[var(--muted)]">
                <span>
                  <strong className="text-[var(--ink)] font-semibold">{L('تاريخ الفحص:', 'Exam Date:')}</strong>{' '}
                  {fmtDate(p.iss, isRTL ? 'ar' : 'en')}
                </span>
                <span className="text-[var(--muted)]/40 hidden sm:inline">·</span>
                <span>
                  <strong className="text-[var(--ink)] font-semibold">{L('تاريخ الانتهاء:', 'Expiry:')}</strong>{' '}
                  <span className="font-bold text-[#16845B]">{fmtDate(p.exp, isRTL ? 'ar' : 'en')}</span>
                </span>
                <span className="text-[var(--muted)]/40 hidden sm:inline">·</span>
                <span>
                  <strong className="text-[var(--ink)] font-semibold">{L('المنشأة المعتمدة:', 'Facility:')}</strong>{' '}
                  {isRTL ? h.n : h.nEn || h.n}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[var(--control-gap)] shrink-0 self-start lg:self-center">
            <button
              type="button"
              className="btn sec h-10 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('cert', { certIndex: selectedPlayerIndex })}
            >
              <Award className="w-4 h-4 text-[var(--primary)]" />
              <span>{L('فتح النموذج A4 المعتمد', 'View Official A4')}</span>
            </button>
            <button
              type="button"
              className="btn ghost h-10 px-4 text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
              onClick={() => navigate('citizen-certs')}
            >
              <span>{L('كافة الشهادات', 'All Certificates')}</span>
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: THE THREE PRIMARY MEDICAL SERVICES (SectionHeader + g3)
          ========================================================================= */}
      <div>
        <SectionHeader
          title={L('الخدمات الطبية الأساسية للرياضي', 'Core Athlete Medical Services')}
          subtitle={L('3 خدمات رئيسية معتمدة وموثقة وفق القرار الوزاري رقم 1642', '3 mandated primary services under Ministerial Decree 1642')}
          badge={L('3 خدمات معتمدة', '3 Mandated Services')}
        />

        <div className="g3">
          
          {/* SERVICE 1: Book Medical Examination */}
          <div
            tabIndex={0}
            role="button"
            onClick={() => navigate('citizen-bookings')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('citizen-bookings'); } }}
            className="card card-lg flex flex-col justify-between h-full relative overflow-hidden group cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--primary)] min-h-[260px]"
          >
            {/* Clipped decorative shape below text */}
            <div className="absolute top-0 inset-inline-end-0 w-28 h-28 bg-[var(--primary-50)] rounded-bl-full pointer-events-none z-0 transition-transform group-hover:scale-110" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[var(--primary-50)] text-[var(--primary)] flex items-center justify-center mb-4 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors shadow-2xs">
                <Calendar className="w-7 h-7 stroke-[2.2]" />
              </div>

              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[var(--primary)] uppercase tracking-wider mb-2">
                <span>01</span>
                <span>·</span>
                <span>{L('الخدمة الأولى', 'Service 1')}</span>
              </div>

              <h3 className="text-lg font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                {L('حجز فحص طبي جديد', 'Book Medical Examination')}
              </h3>

              <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">
                {L(
                  'بدء حجز موعد الفحص الطبي الموحد، اختيار المستشفى المعتمد والموعد المناسب، سداد الرسوم إلكترونيًا، والحصول على رمز الحضور الذكي QR.',
                  'Initiate medical exam booking, select accredited hospital & slot, pay unified fees, and obtain instant check-in pass.'
                )}
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-[var(--line)]/70 flex items-center justify-between text-sm font-bold text-[var(--primary-700)] group-hover:text-[var(--primary)]">
              <span>{L('ابدأ الحجز الآن', 'Start Booking')}</span>
              {isRTL ? (
                <ArrowLeft className="w-4.5 h-4.5 group-hover:-translate-x-1.5 transition-transform" />
              ) : (
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform" />
              )}
            </div>
          </div>

          {/* SERVICE 2: Medical Record History */}
          <div
            tabIndex={0}
            role="button"
            onClick={() => navigate('citizen-history')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('citizen-history'); } }}
            className="card card-lg flex flex-col justify-between h-full relative overflow-hidden group cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#16845B] min-h-[260px]"
          >
            <div className="absolute top-0 inset-inline-end-0 w-28 h-28 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-bl-full pointer-events-none z-0 transition-transform group-hover:scale-110" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#16845B] flex items-center justify-center mb-4 group-hover:bg-[#16845B] group-hover:text-white transition-colors shadow-2xs">
                <HeartPulse className="w-7 h-7 stroke-[2.2]" />
              </div>

              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#16845B] uppercase tracking-wider mb-2">
                <span>02</span>
                <span>·</span>
                <span>{L('الخدمة الثانية', 'Service 2')}</span>
              </div>

              <h3 className="text-lg font-bold text-[var(--ink)] mb-2 group-hover:text-[#16845B] transition-colors">
                {L('السجل الطبي وتاريخ الفحوصات', 'Medical Record History')}
              </h3>

              <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">
                {L(
                  'استعراض تاريخ الكشوفات السابقة، رسم القلب، موجات إيكو الصوتية، نتائج صورة الدم، وتقارير المدير الطبي المعتمدة والموقعة رقميًا.',
                  'View previous medical exams, resting ECG, echocardiograms, blood work, and digitally signed medical reports.'
                )}
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-[var(--line)]/70 flex items-center justify-between text-sm font-bold text-[#16845B]">
              <span>{L('استعراض السجل الطبي', 'Open Medical History')}</span>
              {isRTL ? (
                <ArrowLeft className="w-4.5 h-4.5 group-hover:-translate-x-1.5 transition-transform" />
              ) : (
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform" />
              )}
            </div>
          </div>

          {/* SERVICE 3: All Verified Certificates */}
          <div
            tabIndex={0}
            role="button"
            onClick={() => navigate('citizen-certs')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('citizen-certs'); } }}
            className="card card-lg flex flex-col justify-between h-full relative overflow-hidden group cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0066CC] min-h-[260px]"
          >
            <div className="absolute top-0 inset-inline-end-0 w-28 h-28 bg-[#0066CC]/10 rounded-bl-full pointer-events-none z-0 transition-transform group-hover:scale-110" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#0066CC]/15 text-[#0066CC] flex items-center justify-center mb-4 group-hover:bg-[#0066CC] group-hover:text-white transition-colors shadow-2xs">
                <Award className="w-7 h-7 stroke-[2.2]" />
              </div>

              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0066CC] uppercase tracking-wider mb-2">
                <span>03</span>
                <span>·</span>
                <span>{L('الخدمة الثالثة', 'Service 3')}</span>
              </div>

              <h3 className="text-lg font-bold text-[var(--ink)] mb-2 group-hover:text-[#0066CC] transition-colors">
                {L('كافة الشهادات الطبية الموثقة', 'All Verified Certificates')}
              </h3>

              <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">
                {L(
                  'إدارة والتحقق من الشهادات الطبية الرقمية المعتمدة، استعراض الشهادات السارية والمنتهية، تنزيل نسخ PDF الرسمية، وفتح نموذج A4.',
                  'Manage verified digital certificates, review current & past records, download official PDFs, and open A4 verified format.'
                )}
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-[var(--line)]/70 flex items-center justify-between text-sm font-bold text-[#0066CC]">
              <span>{L('عرض كافة الشهادات', 'View All Certificates')}</span>
              {isRTL ? (
                <ArrowLeft className="w-4.5 h-4.5 group-hover:-translate-x-1.5 transition-transform" />
              ) : (
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform" />
              )}
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          SECTION 5: SUPPORTING SERVICES & PRIVACY CONTROLS (Unified Card)
          ========================================================================= */}
      <div className="card">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[var(--space-4)]">
          <div className="flex items-center gap-[var(--space-3)]">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-50)] text-[var(--primary-700)] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[var(--ink)] block">
                {L('خدمات داعمة وإدارة الخصوصية والتحقق', 'Supporting Services & Verification Controls')}
              </span>
              <span className="text-xs text-[var(--muted)] block mt-0.5">
                {L('إدارة تراخيص مشاركة السجلات والتحقق الإلكتروني السريع', 'Manage record access consents and perform real-time verification')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-[var(--control-gap)] w-full lg:w-auto">
            {userRole === 'guardian' && (
              <button
                type="button"
                className="btn sec sm h-10 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer"
                onClick={() => navigate('citizen-family')}
              >
                <Users className="w-4 h-4 text-[var(--primary)]" />
                <span>{L('إدارة ملفات العائلة', 'Family Management')}</span>
              </button>
            )}

            <button
              type="button"
              className="btn sec sm h-10 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('citizen-consents')}
            >
              <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
              <span>{L('موافقات الاطلاع (قانون 151)', 'Data Consents')}</span>
            </button>

            <button
              type="button"
              className="btn sec sm h-10 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('verify')}
            >
              <QrCode className="w-4 h-4 text-amber-600" />
              <span>{L('التحقق العام المباشر', 'Public Verification')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 6: TWO-COLUMN GRID (Timeline & Clinical Vitals, gap: 10px)
          ========================================================================= */}
      <div className="g2 gap-2.5" style={{ gap: '10px' }}>
        
        {/* COLUMN 1: Operational Timeline of Athlete Actions */}
        <div className="card card-lg flex flex-col justify-between">
          <div>
            <SectionHeader
              title={L('سجل العمليات والخط الزمني للفحص', 'Operational Timeline')}
              badge={L('مكتمل ومعتمد', 'Completed & Verified')}
              className="mb-2.5"
              style={{ marginBottom: '10px' }}
            />

            <div className="flex flex-col gap-2.5" style={{ gap: '10px' }}>
              {/* Event 1: Booking */}
              <div className="flex items-start gap-[var(--space-3)] p-3.5 rounded-xl border border-[var(--line)] bg-[var(--bg)]/50 hover:bg-[var(--bg)] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 text-[var(--success)] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-bold text-[var(--ink)]">
                      {L('تأكيد الحجز وسداد الرسوم', 'Booking Confirmed')}
                    </strong>
                    <span className="font-mono text-xs text-[var(--primary-700)] font-bold bg-[var(--primary-50)] px-2 py-0.5 rounded">
                      {p.bk}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--muted)] block mt-1 leading-relaxed">
                    {L('تم الحجز والدفع الإلكتروني الموحد في', 'e-Payment completed at')}{' '}
                    <strong className="text-[var(--ink)] font-semibold">{isRTL ? h.n : h.nEn || h.n}</strong>
                  </span>
                </div>
              </div>

              {/* Event 2: Clinical Exam */}
              <div className="flex items-start gap-[var(--space-3)] p-3.5 rounded-xl border border-[var(--line)] bg-[var(--bg)]/50 hover:bg-[var(--bg)] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 text-[var(--success)] flex items-center justify-center shrink-0 mt-0.5">
                  <HeartPulse className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-bold text-[var(--ink)]">
                      {L('إجراء الكشف الطبي الموحد', 'Clinical Examination Executed')}
                    </strong>
                    <span className="font-mono text-xs text-[var(--muted)] font-semibold">
                      {fmtDate(p.iss, isRTL ? 'ar' : 'en')}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--muted)] block mt-1 leading-relaxed">
                    {L('فحص إكلينيكي شامل، رسم قلب ECG، إيكو، وصورة دم كاملة CBC', 'Clinical exam, ECG, ECHO, and CBC completed successfully')}
                  </span>
                </div>
              </div>

              {/* Event 3: E-Signature Approval */}
              <div className="flex items-start gap-[var(--space-3)] p-3.5 rounded-xl border border-[var(--line)] bg-[var(--bg)]/50 hover:bg-[var(--bg)] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 text-[var(--success)] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-bold text-[var(--ink)]">
                      {L('اعتماد النتيجة والتوقيع الإلكتروني', 'Approval & E-Signature')}
                    </strong>
                    <span className="font-mono text-xs text-[var(--primary)] font-bold bg-[var(--primary-50)] px-2 py-0.5 rounded">
                      {p.tm}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--muted)] block mt-1 leading-relaxed">
                    {L('اعتمدت النتيجة من المدير الطبي بالتوقيع الإلكتروني المرخص', 'Approved by Medical Director with licensed electronic signature')}
                  </span>
                </div>
              </div>

              {/* Event 4: Certificate Issuance */}
              <div className="flex items-start gap-[var(--space-3)] p-3.5 rounded-xl border border-[var(--line)] bg-[var(--bg)]/50 hover:bg-[var(--bg)] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary-100)] text-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-bold text-[var(--ink)]">
                      {L('إصدار الشهادة الرقمية المعتمدة', 'Certificate Issued')}
                    </strong>
                    <span className="font-mono text-xs text-[var(--primary-700)] font-bold bg-[var(--primary-50)] px-2 py-0.5 rounded">
                      {p.ct}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--muted)] block mt-1 leading-relaxed">
                    {L('الشهادة متاحة رقميًا ومربوطة برمز التحقق الذكي QR Code للتحقق الفوري', 'Certificate issued digitally with instant QR verification')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Clinical Vitals & Patient Information */}
        <div className="card card-lg flex flex-col justify-between">
          <div>
            <SectionHeader
              title={L('المؤشرات الحيوية وبيانات الاتصال', 'Clinical Vitals & Contacts')}
              badge={L('سري ومحمي', 'Confidential')}
              className="mb-2.5"
              style={{ marginBottom: '10px' }}
            />

            <div className="flex flex-col gap-2.5" style={{ gap: '10px' }}>
              {/* Vitals Dual-Box using 2-column grid with 10px gap */}
              <div className="grid grid-cols-2 gap-2.5" style={{ gap: '10px' }}>
                <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg)]/50 text-center">
                  <span className="block text-xs font-semibold text-[var(--muted)] mb-1">
                    {L('ضغط الدم الأخير', 'Last Blood Pressure')}
                  </span>
                  <b className="text-2xl font-mono text-[var(--primary-700)] block my-1">
                    {p.bp}
                  </b>
                  <span className="inline-block text-xs text-[var(--success)] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40">
                    {L('طبيعي (120/80)', 'Normal (120/80)')}
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg)]/50 text-center">
                  <span className="block text-xs font-semibold text-[var(--muted)] mb-1">
                    {L('معدل نبضات القلب', 'Resting Heart Rate')}
                  </span>
                  <b className="text-2xl font-mono text-[var(--primary-700)] block my-1">
                    {p.hr} <small className="text-xs font-normal text-[var(--muted)]">bpm</small>
                  </b>
                  <span className="inline-block text-xs text-[var(--success)] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40">
                    {L('نظم جيبي سليم', 'Sinus Rhythm')}
                  </span>
                </div>
              </div>

              {/* Profile & Registered Unit Information */}
              <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg)]/50 flex flex-col gap-2.5 text-xs sm:text-sm" style={{ gap: '10px' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[var(--primary)]" />
                    {p.age < 18 ? L('اسم ولي الأمر:', 'Guardian Name:') : L('جهة العمل / النادي:', 'Club / Affiliate:')}
                  </span>
                  <b className="text-[var(--ink)] font-bold">
                    {p.age < 18 ? p.gd : (isRTL ? c.n : c.nEn || c.n)}
                  </b>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[var(--primary)]" />
                    {L('هاتف التواصل المسجل:', 'Contact Phone:')}
                  </span>
                  <b className="font-mono text-[var(--ink)] font-bold" dir="ltr">
                    01012345678
                  </b>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
                    {L('المحافظة السكنية:', 'Governorate:')}
                  </span>
                  <b className="text-[var(--ink)] font-bold">
                    {isRTL ? p.gov : GOV_EN[p.gov] || p.gov}
                  </b>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                    {L('جهة الفحص المعتمدة:', 'Accredited Unit:')}
                  </span>
                  <b className="text-[var(--ink)] font-bold">
                    {isRTL ? h.n : h.nEn || h.n}
                  </b>
                </div>
              </div>

              {/* Annual Renewal Reminder Callout */}
              <div className="p-4 rounded-xl border border-[var(--primary-100)] bg-[var(--primary-50)] text-xs sm:text-sm text-[var(--primary-700)] flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--space-3)]">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4.5 h-4.5 text-[var(--primary)] shrink-0" />
                  <div>
                    <b className="block font-bold">{L('موعد التجديد السنوي القادم', 'Next Annual Renewal Due')}</b>
                    <span className="text-xs text-[var(--muted)] block mt-0.5">
                      {L('يُوصى بالحجز قبل شهر من تاريخ الانتهاء لضمان استمرار اللياقة', 'Book 1 month before expiry to ensure active clearance')}
                    </span>
                  </div>
                </div>
                <b className="font-mono text-sm font-bold shrink-0 self-end sm:self-center bg-white dark:bg-[#1B355A] px-3 py-1.5 rounded-lg border border-[var(--primary-100)] text-[var(--primary-700)]">
                  {fmtDate(p.exp, isRTL ? 'ar' : 'en')}
                </b>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

