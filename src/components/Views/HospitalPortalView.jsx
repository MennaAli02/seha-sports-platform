import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { StatusTag } from '../Common/StatusTag';
import { KPICard } from '../Common/KPICard';
import { Stethoscope, Calendar, Clock, CheckCircle2, UserCheck, Search, QrCode, FileText, Check, ArrowRight, Printer, Award, Zap, ChevronLeft, ChevronRight, X } from 'lucide-react';

export const HospitalPortalView = () => {
  const { isRTL, L } = useLanguage();
  const {
    hosps,
    players,
    clubs,
    cfg,
    navigate,
    setSelectedCertIndex,
    showToast,
    SP_EN,
    GOV_EN
  } = useSeha();

  const [hospTab, setHospTab] = useState('today'); // today, sched, bulk, issue
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const h = hosps[0];
  const a = players.filter(p => p.hs === 0 && (p.st === 'fit' || p.st === 'cond')).slice(0, 8);
  const b = players.filter(p => p.st === 'book').slice(0, 4);
  const ls = [...a, ...b];

  const filteredLs = query.trim()
    ? ls.filter(p => p.bk.toLowerCase().includes(query.toLowerCase()) || p.name.includes(query) || p.nid.includes(query))
    : ls;

  useEffect(() => {
    setPage(1);
  }, [query, pageSize, hospTab]);

  const totalRecords = filteredLs.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const paginatedLs = filteredLs.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (safePage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (safePage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="page-stack">
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('بوابة وحدات الطب الرياضي والمستشفيات', 'Sports Medicine Units & Hospitals Portal')}
          </span>
          <h1>{isRTL ? h.n : h.nEn || h.n}</h1>
          <p className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[var(--muted)] mt-1">
            <span className="font-semibold text-[var(--ink)]">
              {L('المدير الطبي للوحدة: ', 'Medical unit director: ')}
            </span>
            <span>{isRTL ? h.dir : h.dirEn || h.dir}</span>
            <span className="text-[var(--muted)]/50">·</span>
            <span>
              {L('الطاقة الاستيعابية اليومية: ', 'Daily screening capacity: ')}
              <b className="font-mono text-[var(--ink)]">{h.cap}</b> {L('رياضي/يوم', 'athletes/day')}
            </span>
          </p>
        </div>
        <div className="act np">
          <button className="btn sec" onClick={() => navigate('reports', { report: 'hosp' })}>
            <Printer className="w-4 h-4" /> {L('تقرير تشغيل اليوم', 'Daily operational report')}
          </button>
          <button className="btn" onClick={() => navigate('doctor')}>
            <Stethoscope className="w-4 h-4" /> {L('شاشة الطبيب المعاين', 'Physician examination')}
          </button>
        </div>
      </div>

      {/* 4 KPIs */}
      <div className="g4">
        <KPICard
          variant="brand"
          value={ls.length}
          label={L('إجمالي كشوفات اليوم', "Today's scheduled exams")}
          icon={Calendar}
          subtext={L('كشوفات ومواعيد مسجلة', 'Registered appointment slots')}
        />
        <KPICard
          variant="emerald"
          value={ls.filter(p => p.st !== 'book').length}
          label={L('تم الفحص والاعتماد', 'Completed & cleared')}
          icon={CheckCircle2}
          subtext={L('صدرت شهاداتهم رسميًا', 'Certificates issued')}
        />
        <KPICard
          variant="primary"
          value={ls.filter(p => p.st === 'book').length}
          label={L('بانتظار الحضور والكشف', 'Awaiting arrival')}
          icon={Clock}
          subtext={L('في غرف الانتظار', 'In hospital queue')}
        />
        <KPICard
          variant="warning"
          value={`7 ${L('ساعات', 'hrs')}`}
          label={L('متوسط زمن الإصدار الكامل', 'Avg end-to-end issuance')}
          icon={Clock}
          subtext={L('من الحجز حتى إصدار الشهادة', 'From check-in to certificate')}
        />
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          ['today', L('كشوفات ومواعيد اليوم', "Today's Examination Queue")],
          ['sched', L('جداول التشغيل والطاقة اليومية', 'Daily Capacity & Shifts')],
          ['bulk', L('طلبات الحجز الواردة من الأندية', 'Club Batch Requests')],
          ['issue', L('مسار التدقيق والاعتماد المزدوج', 'Two-Stage Approval & Clearance')]
        ].map(([tKey, tLabel]) => (
          <button
            key={tKey}
            className={hospTab === tKey ? 'on' : ''}
            onClick={() => setHospTab(tKey)}
          >
            {tLabel}
          </button>
        ))}
      </div>

      {/* Tab 1: Today's list */}
      {hospTab === 'today' && (
        <div className="card">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-[var(--space-4)] np">
            <div className="relative flex-1 max-w-md w-full">
              <Search
                className="w-4 h-4 text-[var(--muted)] pointer-events-none absolute top-1/2 -translate-y-1/2 inset-inline-start-3.5 z-[2]"
              />
              <input
                type="text"
                placeholder={L('بحث سريع: رقم الحجز / الاسم / الرقم القومي…', 'Search booking code, athlete name, or national ID…')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input w-full py-2.5 ps-11 pe-9.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-100)] transition-all shadow-xs"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-50)] transition-colors cursor-pointer absolute top-1/2 -translate-y-1/2 inset-inline-end-3 z-[2]"
                  title={L('مسح البحث', 'Clear search')}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button className="btn sec sm shrink-0 self-start sm:self-auto" onClick={() => navigate('doctor')}>
              <QrCode className="w-4 h-4" />
              {L('مسح رمز الحجز الإلكتروني', 'Scan athlete QR ticket')}
            </button>
          </div>

          {totalRecords === 0 ? (
            <div className="text-center py-10 border border-dashed border-[var(--line)] rounded-xl my-4">
              <FileText className="w-10 h-10 text-[var(--muted)] mx-auto mb-2 opacity-50" />
              <b className="text-sm text-[var(--ink)] block">
                {L('لم يتم العثور على رياضيين مطابقين للبحث', 'No matching athlete records found')}
              </b>
              <p className="mut text-xs mt-1">
                {L('جرّب تعديل كلمات البحث للعثور على حجز الرياضي', 'Try adjusting your search terms')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto" style={{ marginBlock: 'var(--space-4)' }}>
              <table className="t">
                <thead>
                  <tr>
                    <th>{L('رمز الحجز', 'Booking')}</th>
                    <th>{L('الرياضي وبيانات القيد', 'Athlete details')}</th>
                    <th>{L('اللعبة الرياضية', 'Sport')}</th>
                    <th>{L('المستوى', 'Level')}</th>
                    <th>{L('موعد الكشف', 'Time slot')}</th>
                    <th>{L('الحالة الحالية', 'Current status')}</th>
                    <th className="text-end">{L('الإجراء الطبي', 'Clinical action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLs.map((p, idx) => {
                    const actualIdx = startIndex + idx;
                    const globalIdx = players.indexOf(p);
                    return (
                      <tr key={p.id}>
                        <td className="mono font-bold text-xs text-[var(--primary)]">{p.bk}</td>
                        <td>
                          <b className="text-xs text-[var(--ink)] block">{p.name}</b>
                          <span className="text-[11px] text-[var(--muted)]">
                            {p.age} {L('سنة', 'y')} · {isRTL ? p.gov : GOV_EN[p.gov] || p.gov}
                          </span>
                        </td>
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
                        <td className="mono text-xs font-semibold" dir="ltr">
                          {9 + Math.floor(actualIdx / 2)}:{actualIdx % 2 ? '30' : '00'} {actualIdx < 6 ? 'ص' : 'م'}
                        </td>
                        <td><StatusTag status={p.st} /></td>
                        <td className="text-end" style={{ whiteSpace: 'nowrap' }}>
                          {p.st === 'book' ? (
                            <button
                              className="btn sm"
                              onClick={() => navigate('doctor')}
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                              {L('بدء الفحص الطبي', 'Start exam')}
                            </button>
                          ) : (
                            <button
                              className="btn sec sm"
                              onClick={() => {
                                setSelectedCertIndex(globalIdx);
                                navigate('cert');
                              }}
                            >
                              <Award className="w-4 h-4" /> {L('عرض الشهادة', 'View cert')}
                            </button>
                          )}
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t border-[var(--line)] np">
              {/* Left / Start: Rows per page selector & range summary */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 w-full sm:w-auto shrink-0">
                <div className="flex items-center gap-2 text-xs text-[var(--muted)] whitespace-nowrap shrink-0">
                  <span className="whitespace-nowrap font-medium">{L('عدد الصفوف في الصفحة:', 'Rows per page:')}</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="w-auto shrink-0 py-1 px-2.5 text-xs bg-[var(--card)] border border-[var(--color-border)] rounded-lg font-mono font-bold cursor-pointer"
                    style={{ width: 'auto' }}
                  >
                    {[5, 10, 20, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-[var(--muted)] whitespace-nowrap shrink-0">
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
              <div className="flex items-center justify-center sm:justify-end gap-1.5 w-full sm:w-auto">
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
                  disabled={safePage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all ${
                    safePage === totalPages
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
      )}

      {/* Tab 2: Schedule & capacity */}
      {hospTab === 'sched' && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="m-0">
              <span className="d"></span>
              {L('جداول الفترات ومعدلات الإشغال اليومية', 'Daily Screening Capacity & Slot Utilization')}
            </h3>
            <span className="text-xs font-semibold text-[var(--primary)]">
              {L('تحديث مباشر', 'Live capacity')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="t">
              <thead>
                <tr>
                  <th>{L('فترة الفحص', 'Shift')}</th>
                  <th>{L('بداية الفترة', 'From')}</th>
                  <th>{L('نهاية الفترة', 'To')}</th>
                  <th>{L('الطاقة الكلية', 'Total capacity')}</th>
                  <th>{L('المحجوز', 'Booked')}</th>
                  <th>{L('الشواغر المتاحة', 'Available')}</th>
                  <th>{L('نسبة الإشغال', 'Utilization')}</th>
                </tr>
              </thead>
              <tbody>
                {cfg.shifts.map((s, i) => {
                  const bVal = Math.floor(s.c * [0.72, 0.55, 0.48, 0.6, 0.42, 0.8][i % 6]);
                  const pct = Math.round((bVal / s.c) * 100);
                  return (
                    <tr key={i}>
                      <td><b className="text-xs text-[var(--ink)]">{s.d}</b></td>
                      <td className="mono text-xs font-semibold" dir="ltr">{s.f}</td>
                      <td className="mono text-xs font-semibold" dir="ltr">{s.t}</td>
                      <td className="num font-bold text-xs">{s.c}</td>
                      <td className="font-mono text-xs">{bVal}</td>
                      <td>
                        <span className="tag tg font-mono">{s.c - bVal} {L('شاغر', 'slots')}</span>
                      </td>
                      <td style={{ minWidth: '150px' }}>
                        <div className="bar m-0">
                          <span className="tr">
                            <span className="fl" style={{ width: `${pct}%` }}></span>
                          </span>
                          <i className="text-xs font-mono">{pct}%</i>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Club requests */}
      {hospTab === 'bulk' && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="m-0">
              <span className="d"></span>
              {L('طلبات الكشف الجماعي المقدمة من الأندية', 'Incoming Team Examination Requests from Clubs')}
            </h3>
            <span className="text-xs font-semibold text-[var(--muted)]">
              {clubs.slice(0, 3).length} {L('طلبات بانتظار الرد', 'pending requests')}
            </span>
          </div>

          <div className="space-y-3">
            {clubs.slice(0, 3).map((c, i) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[var(--line)] bg-[var(--bg)] flex-wrap"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <b className="text-sm text-[var(--ink)]">{c.n}</b>
                    <span className="tag ti font-bold">
                      {[14, 22, 9][i]} {L('رياضيًا', 'athletes')}
                    </span>
                  </div>
                  <span className="mut text-xs block mt-1">
                    {L('الموعد المطلوب: ', 'Requested shift: ')}
                    <b className="text-[var(--primary)]">{cfg.shifts[i]?.d} · {cfg.shifts[i]?.f}</b> · {L('المستوى الطبي: ', 'Medical level: ')} {[2, 3, 2][i]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="btn okbtn sm"
                    onClick={() => showToast(L('تم قبول الطلب وإرسال إشعارات الحجز لجميع أولياء الأمور', 'Accepted — booking confirmations dispatched to guardians'))}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {L('قبول واعتماد', 'Accept')}
                  </button>
                  <button
                    className="btn sec sm"
                    onClick={() => showToast(L('تم اقتراح موعد بديل وإرساله لمسؤول النادي', 'Alternative slot proposed to club administrator'))}
                  >
                    {L('اقتراح موعد بديل', 'Propose slot')}
                  </button>
                  <button
                    className="btn ghost sm text-[var(--danger-dark)] border-[var(--danger)]/30"
                    onClick={() => showToast(L('تم الاعتذار عن الطلب لعدم توفر شواغر', 'Request declined due to capacity'))}
                  >
                    {L('اعتذار', 'Decline')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Approval & issuance */}
      {hospTab === 'issue' && (
        <div className="space-y-4">
          <div className="g4">
            <KPICard
              variant="warning"
              value="6"
              label={L('بانتظار اعتماد المدير الطبي', 'Awaiting director clearance')}
              icon={Clock}
              subtext={L('فحوص مكتملة تحتاج اعتمادًا', 'Completed clinical exams')}
            />
            <KPICard
              variant="emerald"
              value="23"
              label={L('شهادات معتمدة صادرة اليوم', 'Cleared & issued today')}
              icon={CheckCircle2}
              subtext={L('موقعة بختم إلكتروني', 'e-Signed & delivered')}
            />
            <KPICard
              variant="brand"
              value="2,300"
              label={L('رسوم الميكنة المحصلة (ج.م)', 'Automation fees collected (EGP)')}
              icon={FileText}
              subtext={L('دفع إلكتروني فوري', 'Digital e-payment')}
            />
            <KPICard
              variant="primary"
              value="100%"
              label={L('نسبة مطابقة الهوية بالرقم القومي', 'National ID match rate')}
              icon={UserCheck}
              subtext={L('دون أي خطأ في الهوية', 'Zero identity discrepancy')}
            />
          </div>

          <div className="card">
            <h3 className="mb-2">
              <span className="d"></span>
              {L('آلية الاعتماد الطبي المزدوج للشهادات', 'Two-Stage Clinical Clearance & Verification Workflow')}
            </h3>
            <p className="mut text-xs mb-5">
              {L(
                'تضمن المنظومة أعلى معايير الحوكمة والنزاهة عبر الفصل الكامل بين الطبيب الفاحص المباشر والمدير الطبي المعتمد قبل التوقيع الرقمي النهائي',
                'Ensuring maximum institutional integrity by segregating direct examining physicians from the approving medical director before final cryptographic stamping'
              )}
            </p>

            <div className="stp max-w-2xl mx-auto mb-6">
              {[
                L('الفحص الإكلينيكي للمعاين', 'Clinical Exam'),
                L('مراجعة المدير الطبي المعتمد', 'Director Review'),
                L('التوقيع والختم الإلكتروني', 'Cryptographic Stamp'),
                L('إصدار فوري وإشعار ولي الأمر', 'Instant Issuance & SMS')
              ].map((s, i) => (
                <div
                  key={i}
                  className={`s ${i < 2 ? 'done' : i === 2 ? 'on' : ''}`}
                >
                  <div className="dot flex items-center justify-center">{i < 2 ? <Check className="w-3.5 h-3.5" /> : i + 1}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div className="nt mt-6 flex items-start gap-2">
              <Zap className="w-4 h-4 text-[var(--primary)] flex-none mt-0.5" />
              <span className="text-xs">
                {L(
                  'كفاءة تشغيلية كاملة: يدعم النظام الأجهزة اللوحية (Tablets) والحواسيب عبر المتصفح مباشرة دون الحاجة لأي برمجيات معقدة.',
                  'Fully responsive & lightweight: Operates seamlessly on hospital tablets and desktops directly through standard browsers with zero desktop installation.'
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
