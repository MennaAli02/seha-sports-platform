import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { CertificateDetailView } from './CertificateDetailView';
import { StatusTag } from '../Common/StatusTag';
import { KPICard } from '../Common/KPICard';
import { IC } from '../../data/icons';
import { fmtDate } from '../../data/mockData';
import { Award, ShieldCheck, AlertTriangle, Clock, Search, Filter, FileText, ChevronRight, Check } from 'lucide-react';

export const CertificateRegistryView = () => {
  const { isRTL, L } = useLanguage();
  const {
    players,
    selectedCertIndex,
    setSelectedCertIndex,
    stats,
    cfg,
    SP_EN,
    GOV_EN
  } = useSeha();

  const [q, setQ] = useState('');
  const [f, setF] = useState('all');

  // If a certificate is currently selected, render the detail view
  if (selectedCertIndex !== null) {
    return <CertificateDetailView />;
  }

  const query = q.trim().toLowerCase();
  const list = players.filter((p) => {
    const matchesFilter = f === 'all' || p.st === f;
    const matchesQuery =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.nid.includes(query) ||
      p.ct.toLowerCase().includes(query) ||
      p.bk.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('السجل الوطني الموحد', 'National Unified Registry')}
          </span>
          <h1>{L('سجل الشهادات الطبية الرياضية الموثقة', 'Sports Medical Certificate Registry')}</h1>
          <p>
            {L(
              'شهادة لياقة رقمية مؤمنة لكل رياضي — ابحث بالاسم، الرقم القومي، أو رقم الشهادة ثم استعرض الوثيقة أو اطبعها بدقة A4',
              'Secure digital fitness certificate per athlete — search by name, national ID or certificate number, then open or print in high-fidelity A4'
            )}
          </p>
        </div>
        <div className="act np">
          <button className="btn" onClick={() => setSelectedCertIndex(0)}>
            {IC.cert} {L('نموذج الشهادة المعتمدة', 'Sample verified certificate')}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="g4">
        <KPICard
          variant="brand"
          value={stats.issued}
          label={L('إجمالي الشهادات المعتمدة', 'Total issued certificates')}
          icon={Award}
          subtext={L('موقعة بختم إلكتروني موحد', 'e-Signed & timestamped')}
        />
        <KPICard
          variant="emerald"
          value={stats.fit}
          label={L('شهادات سارية — لائق', 'Valid — fit for sports')}
          icon={ShieldCheck}
          subtext={L('متاح للمسابقات الرسمية', 'Cleared for official matches')}
        />
        <KPICard
          variant="warning"
          value={stats.cond}
          label={L('لائق بشروط متابعة (أشبالنا)', 'Conditionally fit (Ashbalna)')}
          icon={AlertTriangle}
          subtext={L('متابعة طبية دورية نشطة', 'Active clinical monitoring')}
        />
        <KPICard
          variant="red"
          value={stats.exp}
          label={L('شهادات منتهية الصلاحية', 'Expired certificates')}
          icon={Clock}
          subtext={L('تحتاج فحص تجديد سنوي', 'Annual renewal exam due')}
        />
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 np">
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--muted)] absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
              <input
                id="cq"
                type="text"
                placeholder={L(
                  'بحث سريع: الاسم / الرقم القومي / رقم الشهادة / رقم الحجز…',
                  'Search: name / national ID / certificate no. / booking no.…'
                )}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="ps-9 pe-3 py-2 text-sm"
              />
            </div>
            <select
              value={f}
              onChange={(e) => setF(e.target.value)}
              className="w-44 text-sm"
            >
              {[
                ['all', L('كل الحالات', 'All statuses')],
                ['fit', L('لائق — سارية', 'Fit — valid')],
                ['cond', L('أشبالنا — بشروط', 'Conditional')],
                ['exp', L('منتهية الصلاحية', 'Expired')],
                ['book', L('حجز — قيد الفحص', 'Pending exam')]
              ].map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--muted)]">
              {list.length} {L('شهادة مطابقة', 'matching records')}
            </span>
          </div>
        </div>

        {/* Filter Quick Chips */}
        <div className="chips mb-4 np">
          {[
            ['all', L('الكل', 'All')],
            ['fit', L('سارية (لائق)', 'Valid (Fit)')],
            ['cond', L('أشبالنا (بشروط)', 'Ashbalna (Conditional)')],
            ['exp', L('منتهية', 'Expired')],
            ['book', L('حجوزات بانتظار الكشف', 'Awaiting exam')]
          ].map(([val, label]) => (
            <button
              key={val}
              className={`chip ${f === val ? 'on' : ''}`}
              onClick={() => setF(val)}
            >
              {label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[var(--line)] rounded-xl my-4">
            <FileText className="w-10 h-10 text-[var(--muted)] mx-auto mb-2 opacity-50" />
            <b className="text-base text-[var(--ink)] block">
              {L('لم يتم العثور على سجلات مطابقة', 'No matching certificate records found')}
            </b>
            <p className="mut text-xs mt-1">
              {L('جرّب تعديل كلمات البحث أو تصفية الحالات للعثور على الرياضي', 'Try adjusting your search terms or filters')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="t">
              <thead>
                <tr>
                  <th>{L('رقم الشهادة', 'Certificate no.')}</th>
                  <th>{L('اللاعب وبيانات القيد', 'Athlete information')}</th>
                  <th>{L('الرقم القومي', 'National ID')}</th>
                  <th>{L('اللعبة', 'Sport')}</th>
                  <th>{L('المستوى', 'Level')}</th>
                  <th>{L('تاريخ الإصدار', 'Issue date')}</th>
                  <th>{L('صالحة حتى', 'Valid until')}</th>
                  <th>{L('حالة اللياقة', 'Fitness status')}</th>
                  <th className="text-end">{L('الإجراء', 'Action')}</th>
                </tr>
              </thead>
              <tbody>
                {list.slice(0, 40).map((p) => {
                  const i = players.indexOf(p);
                  return (
                    <tr key={p.id} className="hover:bg-[var(--primary-50)]/50 transition-colors">
                      <td className="mono font-bold text-xs text-[var(--primary)]">
                        {p.st === 'book' ? '—' : p.ct}
                      </td>
                      <td>
                        <b className="text-sm text-[var(--ink)] block">{p.name}</b>
                        <span className="text-[11px] text-[var(--muted)]">
                          {p.age} {L('سنة', 'y')} · {isRTL ? p.gov : GOV_EN[p.gov] || p.gov}
                        </span>
                      </td>
                      <td className="mono text-xs" dir="ltr">{p.nid}</td>
                      <td>
                        <span className="font-semibold text-xs text-[var(--ink)]">
                          {isRTL ? cfg.sports[p.sp] : SP_EN[cfg.sports[p.sp]] || cfg.sports[p.sp]}
                        </span>
                      </td>
                      <td>
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[var(--primary-50)] text-[var(--primary-700)] font-extrabold text-xs">
                          {p.lv}
                        </span>
                      </td>
                      <td className="text-xs text-[var(--muted)]">
                        {p.st === 'book' ? '—' : fmtDate(p.iss, isRTL ? 'ar' : 'en')}
                      </td>
                      <td className="text-xs text-[var(--muted)]">
                        {p.st === 'book' ? '—' : fmtDate(p.exp, isRTL ? 'ar' : 'en')}
                      </td>
                      <td>
                        <StatusTag status={p.st} />
                      </td>
                      <td className="text-end">
                        <button
                          className="btn sec sm"
                          onClick={() => setSelectedCertIndex(i)}
                          title={L('فتح الوثيقة والطباعة', 'Open certificate & print')}
                        >
                          {IC.cert} {L('عرض الشهادة', 'View cert')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {list.length > 40 && (
          <p className="mut text-xs mt-3 text-center">
            {L(
              'تُعرض أول 40 نتيجة لتسريع التصفح — استخدم حقول البحث بالأعلى للوصول الدقيق',
              'Showing first 40 records — use search above to narrow down'
            )}
          </p>
        )}
      </div>
    </div>
  );
};
