import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { CertificateDetailView } from './CertificateDetailView';
import { StatusTag } from '../Common/StatusTag';
import { KPICard } from '../Common/KPICard';
import { IC } from '../../data/icons';
import { fmtDate } from '../../data/mockData';
import { Award, ShieldCheck, AlertTriangle, Clock, Search, Filter, FileText, ChevronRight, Check, ChevronDown, X, ChevronLeft } from 'lucide-react';

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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    setPage(1);
  }, [q, f, pageSize]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterMenuOpen(false);
      }
    };
    if (filterMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterMenuOpen]);

  const filterOptions = [
    { key: 'all', ar: 'كل الحالات', en: 'All statuses', dot: 'var(--color-text-secondary)', count: players.length },
    { key: 'fit', ar: 'سارية (لائق)', en: 'Valid (Fit)', dot: 'var(--color-success)', count: stats.fit },
    { key: 'cond', ar: 'أشبالنا (بشروط)', en: 'Ashbalna (Conditional)', dot: 'var(--color-warning)', count: stats.cond },
    { key: 'exp', ar: 'منتهية الصلاحية', en: 'Expired', dot: 'var(--color-error)', count: stats.exp },
    { key: 'book', ar: 'حجوزات بانتظار الكشف', en: 'Awaiting exam', dot: 'var(--color-brand-violet)', count: stats.book }
  ];
  const activeOption = filterOptions.find(o => o.key === f) || filterOptions[0];

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

  const totalRecords = list.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const paginatedList = list.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }
    if (safePage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (safePage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages];
  };

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
      <div className="g4" style={{ marginBottom: '20px' }}>
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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 np">
          <div className="flex items-center gap-2.5 flex-1 max-w-2xl">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[var(--muted)] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
              <input
                id="cq"
                type="text"
                placeholder={L(
                  'بحث سريع: الاسم / الرقم القومي / رقم الشهادة / رقم الحجز…',
                  'Search: name / national ID / certificate no. / booking no.…'
                )}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full ps-10 pe-9 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:border-[var(--color-brand-violet)] focus:ring-2 focus:ring-[var(--color-brand-lavender)] transition-all shadow-xs"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ('')}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-[var(--muted)] hover:text-[var(--ink)] p-0.5 rounded-full hover:bg-[var(--primary-50)] transition-colors cursor-pointer"
                  title={L('مسح البحث', 'Clear search')}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Button for Filtering */}
            <div className="relative flex-none" ref={filterRef}>
              <button
                type="button"
                onClick={() => setFilterMenuOpen(prev => !prev)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                  f !== 'all'
                    ? 'bg-[var(--primary-50)] border-[var(--primary)] text-[var(--primary-700)] shadow-xs'
                    : 'bg-[var(--card)] border-[var(--color-border)] text-[var(--ink)] hover:border-[var(--primary)]'
                }`}
                aria-expanded={filterMenuOpen}
              >
                <Filter className="w-4 h-4 text-[var(--primary)] flex-none" />
                <span className="truncate max-w-[140px] sm:max-w-none">
                  {L(activeOption.ar, activeOption.en)}
                </span>
                {f !== 'all' && (
                  <span className="w-2 h-2 rounded-full bg-[var(--primary)] flex-none" />
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-[var(--muted)] flex-none transition-transform duration-200 ${filterMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter Options Dropdown Menu */}
              {filterMenuOpen && (
                <div
                  className={`absolute z-30 mt-2 w-64 bg-[var(--card)] border border-[var(--line)] rounded-xl shadow-lg p-1.5 start-0`}
                  style={{ minWidth: '220px' }}
                >
                  <div className="px-3 py-2 text-[11px] font-bold text-[var(--muted)] uppercase border-b border-[var(--line)] mb-1 flex items-center justify-between">
                    <span>{L('تصفية حسب حالة الشهادة', 'Filter by Status')}</span>
                    {f !== 'all' && (
                      <button
                        type="button"
                        onClick={() => {
                          setF('all');
                          setFilterMenuOpen(false);
                        }}
                        className="text-[11px] text-[var(--primary)] hover:underline font-normal cursor-pointer"
                      >
                        {L('إعادة تعيين', 'Reset')}
                      </button>
                    )}
                  </div>
                  {filterOptions.map((opt) => {
                    const isSelected = f === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setF(opt.key);
                          setFilterMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-start ${
                          isSelected
                            ? 'bg-[var(--primary-50)] text-[var(--primary-700)]'
                            : 'text-[var(--ink)] hover:bg-[var(--line)]/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-none"
                            style={{ backgroundColor: opt.dot }}
                          />
                          <span className="truncate">{L(opt.ar, opt.en)}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-none">
                          <span className="text-[11px] font-mono opacity-70">({opt.count})</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[var(--primary)]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Records Count Badge */}
          <div className="flex items-center gap-2 flex-none">
            {f !== 'all' && (
              <button
                type="button"
                onClick={() => setF('all')}
                className="text-xs text-[var(--muted)] hover:text-[var(--danger)] cursor-pointer flex items-center gap-1 font-medium transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                {L('إلغاء التصفية', 'Clear filter')}
              </button>
            )}
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--primary-50)] text-[var(--primary-700)] border border-[var(--primary-100)] font-mono">
              {list.length} {L('شهادة مطابقة', 'matching records')}
            </span>
          </div>
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
                {paginatedList.map((p) => {
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

        {/* Pagination Footer */}
        {totalRecords > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-4 border-t border-[var(--line)] np">
            {/* Left / Start: Rows per page selector & range summary */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <span>{L('عدد الصفوف في الصفحة:', 'Rows per page:')}</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="w-auto py-1 px-2.5 text-xs bg-[var(--card)] border border-[var(--color-border)] rounded-lg font-mono font-bold cursor-pointer"
                >
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-[var(--muted)]">
                {L('عرض ', 'Showing ')}
                <b className="font-mono text-[var(--ink)]">{startIndex + 1}</b>
                {L(' إلى ', ' to ')}
                <b className="font-mono text-[var(--ink)]">{endIndex}</b>
                {L(' من أصل ', ' of ')}
                <b className="font-mono text-[var(--ink)]">{totalRecords}</b>
                {L(' سجل', ' records')}
              </div>
            </div>

            {/* Right / End: Pagination controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all ${
                  safePage === 1
                    ? 'opacity-40 cursor-not-allowed border-[var(--line)] text-[var(--muted)]'
                    : 'cursor-pointer hover:bg-[var(--primary-50)] border-[var(--color-border)] text-[var(--ink)]'
                }`}
                title={L('الصفحة السابقة', 'Previous page')}
              >
                {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((num, idx) => {
                  if (num === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-2 text-xs text-[var(--muted)] font-mono">
                        …
                      </span>
                    );
                  }
                  const isCurrent = safePage === num;
                  return (
                    <button
                      key={`page-${num}`}
                      type="button"
                      onClick={() => setPage(num)}
                      className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[var(--primary)] text-white shadow-xs'
                          : 'bg-[var(--card)] border border-[var(--color-border)] text-[var(--ink)] hover:bg-[var(--primary-50)]'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all ${
                  safePage >= totalPages
                    ? 'opacity-40 cursor-not-allowed border-[var(--line)] text-[var(--muted)]'
                    : 'cursor-pointer hover:bg-[var(--primary-50)] border-[var(--color-border)] text-[var(--ink)]'
                }`}
                title={L('الصفحة التالية', 'Next page')}
              >
                {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
