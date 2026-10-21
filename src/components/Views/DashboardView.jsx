import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { StatusTag } from '../Common/StatusTag';
import { KPICard } from '../Common/KPICard';
import { Users, Award, ShieldCheck, Activity, Clock, CalendarCheck, HeartPulse, Stethoscope, ArrowUpRight, FileText, Info } from 'lucide-react';

export const DashboardView = () => {
  const { isRTL, L } = useLanguage();
  const { stats, countBy, bands, ash, hosps, clubs, audit, cfg, navigate, GOV_EN, SP_EN } = useSeha();

  const gl = countBy(p => (isRTL ? p.gov : GOV_EN[p.gov] || p.gov), 6);
  const sl = countBy(p => {
    const s = cfg.sports[p.sp] || '';
    return isRTL ? s : SP_EN[s] || s;
  }, 6);

  const stg = [0, 0, 0, 0, 0];
  ash.forEach(a => {
    if (stg[a.s] !== undefined) stg[a.s]++;
  });

  const renderBars = (list, cls) => {
    if (!list || !list.length) return null;
    const mx = list[0][1] || 1;
    return list.map(([name, val]) => {
      const pct = Math.round((val / stats.total) * 100);
      return (
        <div key={name} className="bar">
          <b title={name} className="text-xs sm:text-sm">{name}</b>
          <span className="tr">
            <span
              className={`fl ${cls || ''}`}
              style={{ width: `${Math.max(4, Math.round((val / mx) * 100))}%` }}
            />
          </span>
          <div className="flex items-center justify-end gap-1.5 w-16 text-end">
            <i className="font-mono text-xs">{val}</i>
            <span className="text-[10.5px] text-[var(--muted)]">({pct}%)</span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="page-stack">
      {/* Page Header */}
      <div className="ph">
        <div>
          <span className="lab">
            <Activity className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('لوحة القيادة التشغيلية', 'Command center & operations')}
          </span>
          <h1>{L('لوحة المؤشرات التشغيلية والطبية', 'Sports Healthcare Operations Dashboard')}</h1>
          <p>{L('متابعة الفحوصات الطبية، الشهادات الموثقة، مسار «أشبالنا» للمتابعة، وجهات الخدمة المعتمدة', 'Real-time monitoring of medical exams, verified certificates, Ashbalna follow-up track, and accredited facilities')}</p>
        </div>
        <div className="act np">
          <button
            className="btn sec"
            onClick={() => navigate('reports', { report: 'exec' })}
          >
            <FileText className="w-4 h-4" /> {L('التقرير التنفيذي', 'Executive report')}
          </button>
          <button className="btn sec" onClick={() => navigate('citizen-home')}>
            <Users className="w-4 h-4" /> {L('بوابة المواطن', 'Citizen portal')}
          </button>
          <button className="btn" onClick={() => navigate('cert')}>
            <Award className="w-4 h-4" /> {L('سجل الشهادات', 'Certificates registry')}
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="g6">
        <KPICard
          variant="primary-700"
          value={stats.total}
          label={L('إجمالي المتقدمين', 'Total applicants')}
          icon={Users}
          subtext={L('سجلات مسجلة بالمنظومة', 'Platform registered records')}
        />
        <KPICard
          variant="primary"
          value={stats.issued}
          label={L('شهادة صادرة', 'Certificates issued')}
          icon={Award}
          subtext={L('مكتملة وموقعة إلكترونيًا', 'Completed & e-signed')}
        />
        <KPICard
          variant="success"
          value={stats.fit}
          label={L('لائق — شهادة سارية', 'Fit — valid')}
          icon={ShieldCheck}
          subtext={L('جاهزون للمنافسات', 'Cleared for competition')}
        />
        <KPICard
          variant="warning"
          value={stats.cond}
          label={L('محوّلون إلى «أشبالنا»', 'Ashbalna referrals')}
          icon={HeartPulse}
          subtext={L('لائق بشروط متابعة', 'Conditional with follow-up')}
        />
        <KPICard
          variant="danger"
          value={stats.exp}
          label={L('شهادة تحتاج تجديدًا', 'Due for renewal')}
          icon={Clock}
          subtext={L('تتطلب كشفًا دوريًا', 'Annual renewal required')}
        />
        <KPICard
          variant="primary"
          value={stats.book}
          label={L('حجز مؤكد بانتظار الكشف', 'Booked, awaiting exam')}
          icon={CalendarCheck}
          subtext={L('مواعيد بالمستشفيات', 'Hospital appointments')}
        />
      </div>

      {/* Distribution: Governorate & Sport */}
      <div className="g2">
        <div className="card">
          <h3>
            <span className="d"></span>
            {L('التوزيع الجغرافي حسب المحافظة', 'Applicants by governorate')}
          </h3>
          <div className="mt-3">
            {renderBars(gl)}
          </div>
        </div>
        <div className="card">
          <h3>
            <span className="d"></span>
            {L('التوزيع الرياضي حسب نوع اللعبة', 'Applicants by sport')}
          </h3>
          <div className="mt-3">
            {renderBars(sl)}
          </div>
        </div>
      </div>

      {/* Age Bands & Ashbalna Track */}
      <div className="g2">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3>
              <span className="d"></span>
              {L('الفئات العمرية ومعدل اللياقة الطبية', 'Age bands & fitness clearance rate')}
            </h3>
            <span className="text-xs font-semibold text-[var(--primary-700)] bg-[var(--primary-50)] px-3 py-1 rounded-full border border-[var(--primary-100)]">
              {L('الكود الموحد', 'Unified Code')}
            </span>
          </div>
          <p className="mut" style={{ marginBottom: 0 }}>
            {L('نسب اللياقة المستخرجة بعد الفحص السريري وتخطيط القلب حسب المرحلة العمرية', 'Clearance percentages per clinical exam and ECG categorized by youth and senior bands')}
          </p>
          <div className="g5 mt-4">
            {bands.map((x, i) => (
              <div
                key={i}
                className="text-center bg-[var(--primary-50)] border border-[var(--line)] rounded-2xl p-3.5 transition-transform hover:-translate-y-0.5 shadow-xs"
              >
                <b className="text-2xl font-bold text-[var(--ink)] block font-mono">
                  {x.n}
                </b>
                <span className="mut text-[12px] font-medium block mt-1">
                  {isRTL ? x.lAr : x.lEn}
                </span>
                <div className="text-xs font-extrabold text-[var(--success-dark)] mt-2 inline-flex items-center gap-1 bg-[var(--success-bg)] px-2.5 py-0.5 rounded-full">
                  {x.pct}% {L('لائق', 'fit')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3>
              <span className="d"></span>
              {L('برنامج «أشبالنا» — مسار الرعاية والتقييم', 'Ashbalna follow-up track')}
            </h3>
            <span className="text-xs font-bold text-[var(--warning-dark)] bg-[var(--warning-bg)] px-3 py-1 rounded-full border border-[var(--warning)]/20">
              {ash.length} {L('حالة تحت الرعاية', 'active cases')}
            </span>
          </div>
          <p className="mut" style={{ marginBottom: 0 }}>
            {L('مسار طبي مخصص للحالات ذات الملاحظات الإكلينيكية لإعادة التأهيل دون استبعاد قسري', 'Dedicated medical track for athletes with clinical findings ensuring continuous care and re-evaluation')}
          </p>
          <div className="g5 my-4">
            {cfg.stages.map((st, i) => {
              const isLast = i === 4;
              return (
                <div
                  key={i}
                  className={`text-center rounded-2xl p-3 border transition-all ${
                    isLast
                      ? 'bg-[var(--success-bg)] border-[var(--success)]/30 shadow-xs'
                      : 'bg-[var(--card)] border-[var(--line)]'
                  }`}
                >
                  <span className="mut text-[10.5px] font-bold uppercase tracking-wider block">
                    {L('المرحلة', 'Stage')} {i + 1}
                  </span>
                  <b className="text-[12px] font-bold block text-[var(--ink)] my-1 min-h-[32px] line-clamp-2">
                    {L(st[0], st[1])}
                  </b>
                  <b className={`text-2xl font-extrabold font-mono block ${isLast ? 'text-[var(--success-dark)]' : 'text-[var(--primary)]'}`}>
                    {stg[i]}
                  </b>
                </div>
              );
            })}
          </div>
          <div className="nt flex items-start gap-2">
            <Info className="w-4 h-4 text-[var(--primary)] flex-none mt-0.5" />
            <span>
              {L(
                'النادي يرى النتيجة النهائية فقط («لائق بشروط») حمايةً لخصوصية اللاعب (قانون 151/2020) — ولا يُستبعد أحد دون متابعة ورعاية.',
                'Clubs see final outcome only (conditionally fit) per Data Protection Law 151/2020 — no athlete is excluded without follow-up care.'
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Operating Entities & Recent Activity */}
      <div className="g2">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3>
              <span className="d"></span>
              {L('وحدات الطب الرياضي والمستشفيات المعتمدة', 'Accredited Sports Medicine Facilities')}
            </h3>
            <button
              className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
              onClick={() => navigate('hosps')}
            >
              {L('عرض الكل', 'View all')}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="t">
              <thead>
                <tr>
                  <th>{L('الجهة', 'Entity')}</th>
                  <th>{L('النوع', 'Type')}</th>
                  <th>{L('المحافظة', 'Governorate')}</th>
                  <th>{L('الحالة', 'Status')}</th>
                </tr>
              </thead>
              <tbody>
                {hosps.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <b className="text-[var(--ink)]">{isRTL ? h.n : h.nEn || h.n}</b>
                      <small className="block text-[11px] text-[var(--muted)]">{isRTL ? h.dir : h.dirEn || h.dir}</small>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Stethoscope className="w-3.5 h-3.5 text-[var(--primary)]" />
                        {L('مستشفى معتمد', 'Hospital')}
                      </span>
                    </td>
                    <td>{isRTL ? h.gov : GOV_EN[h.gov] || h.gov}</td>
                    <td><StatusTag type="org" status={h.st} /></td>
                  </tr>
                ))}
                {clubs.slice(0, 3).map((c) => (
                  <tr key={c.id}>
                    <td>
                      <b className="text-[var(--ink)]">{isRTL ? c.n : c.nEn || c.n}</b>
                      <small className="block text-[11px] text-[var(--muted)]">{isRTL ? c.mgr : c.mgrEn || c.mgr}</small>
                    </td>
                    <td><span className="text-xs">{isRTL ? c.type : c.typeEn || c.type}</span></td>
                    <td>{isRTL ? c.gov : GOV_EN[c.gov] || c.gov}</td>
                    <td><StatusTag type="org" status={c.st} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3>
              <span className="d"></span>
              {L('سجل العمليات والأحداث الفورية', 'Recent Operational Audit Trail')}
            </h3>
            <span className="text-[11.5px] font-mono text-[var(--muted)]">
              {audit.length} {L('عملية مسجلة', 'events')}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="t">
              <thead>
                <tr>
                  <th>{L('الوقت', 'Time')}</th>
                  <th>{L('الجهة', 'By')}</th>
                  <th>{L('الحدث والعملية', 'Event details')}</th>
                </tr>
              </thead>
              <tbody>
                {audit.slice(0, 8).map((a, i) => (
                  <tr key={i}>
                    <td className="mono text-xs text-[var(--primary)] font-semibold" dir="ltr">{a[0]}</td>
                    <td>
                      <span className="font-semibold text-xs text-[var(--ink)]">{a[1]}</span>
                    </td>
                    <td className="text-xs text-[var(--ink)]">
                      {isRTL ? a[2] : a[3] || a[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
