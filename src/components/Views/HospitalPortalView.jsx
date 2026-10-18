import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { IC } from '../../data/icons';
import { StatusTag } from '../Common/StatusTag';
import { KPICard } from '../Common/KPICard';
import { Stethoscope, Calendar, Clock, CheckCircle2, UserCheck, Search, QrCode, FileText, Check, ArrowRight } from 'lucide-react';

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

  const h = hosps[0];
  const a = players.filter(p => p.hs === 0 && (p.st === 'fit' || p.st === 'cond')).slice(0, 8);
  const b = players.filter(p => p.st === 'book').slice(0, 4);
  const ls = [...a, ...b];

  const filteredLs = query.trim()
    ? ls.filter(p => p.bk.toLowerCase().includes(query.toLowerCase()) || p.name.includes(query) || p.nid.includes(query))
    : ls;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('بوابة وحدات الطب الرياضي والمستشفيات', 'Sports Medicine Units & Hospitals Portal')}
          </span>
          <h1>{h.n}</h1>
          <p>
            {L('المدير الطبي للوحدة: ', 'Medical unit director: ')}{h.dir} · {L('الطاقة الاستيعابية اليومية: ', 'Daily screening capacity: ')}{h.cap} {L('رياضي/يوم', 'athletes/day')}
          </p>
        </div>
        <div className="act np">
          <button className="btn sec" onClick={() => navigate('reports', { report: 'hosp' })}>
            {IC.print} {L('تقرير تشغيل اليوم', 'Daily operational report')}
          </button>
          <button className="btn" onClick={() => navigate('doctor')}>
            {IC.steth} {L('شاشة الطبيب المعاين', 'Physician examination')}
          </button>
        </div>
      </div>

      {/* 4 KPIs */}
      <div className="g4" style={{ marginBottom: '20px' }}>
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
          <div className="flex items-center justify-between gap-3 mb-4 np flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[var(--muted)] absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
              <input
                type="text"
                placeholder={L('بحث سريع: رقم الحجز / الاسم / الرقم القومي…', 'Search booking code, athlete name, or national ID…')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="ps-9 pe-3 py-2 text-sm"
              />
            </div>
            <button className="btn sec sm" onClick={() => navigate('doctor')}>
              <QrCode className="w-4 h-4" />
              {L('مسح رمز الحجز الإلكتروني', 'Scan athlete QR ticket')}
            </button>
          </div>

          <div className="overflow-x-auto">
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
                {filteredLs.map((p, i) => {
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
                        {9 + Math.floor(i / 2)}:{i % 2 ? '30' : '00'} {i < 6 ? 'ص' : 'م'}
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
                            {IC.cert} {L('عرض الشهادة', 'View cert')}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
                  <div className="dot">{i < 2 ? '✓' : i + 1}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div className="nt mt-6 flex items-start gap-2">
              <span className="text-sm font-bold text-[var(--primary)]">⚡</span>
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
