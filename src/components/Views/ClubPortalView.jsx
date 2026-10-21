import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { StatusTag } from '../Common/StatusTag';
import { KPICard } from '../Common/KPICard';
import { Shield, Users, Award, Clock, AlertTriangle, UploadCloud, FileText, CheckCircle2, Lock, Info, Printer } from 'lucide-react';

export const ClubPortalView = () => {
  const { isRTL, L } = useLanguage();
  const {
    clubs,
    players,
    hosps,
    cfg,
    navigate,
    setSelectedCertIndex,
    showToast,
    SP_EN,
    GOV_EN
  } = useSeha();

  const [clubTab, setClubTab] = useState('roster'); // roster, bulk, req
  const [gs, setGs] = useState(0);

  const c = clubs[0];
  const rs = players.slice(0, 10);

  return (
    <div className="page-stack">
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('بوابة الأندية والاتحادات الرياضية', 'Sports Clubs & Federations Portal')}
          </span>
          <h1>{isRTL ? c.n : c.nEn || c.n}</h1>
          <p className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[var(--muted)] mt-1">
            <span className="font-semibold text-[var(--ink)]">
              {L('المسؤول الإداري والطبي: ', 'Medical and administrative liaison: ')}
            </span>
            <span>{isRTL ? c.mgr : c.mgrEn || c.mgr}</span>
            <span className="text-[var(--muted)]/50">·</span>
            <span>{isRTL ? c.gov : GOV_EN[c.gov] || c.gov}</span>
            <span className="text-[var(--muted)]/50">·</span>
            <span>{isRTL ? c.type : c.typeEn || c.type}</span>
          </p>
        </div>
        <div className="act np">
          <button className="btn sec" onClick={() => navigate('reports', { report: 'club' })}>
            <Printer className="w-4 h-4" /> {L('تقرير قائمة اللاعبين', 'Roster report')}
          </button>
          <button className="btn" onClick={() => setClubTab('bulk')}>
            <UploadCloud className="w-4 h-4" />
            {L('حجز فحص جماعي', 'Bulk booking')}
          </button>
        </div>
      </div>

      {/* 4 KPIs */}
      <div className="g4">
        <KPICard
          variant="brand"
          value={rs.length}
          label={L('إجمالي الرياضيين المسجلين', 'Registered athletes')}
          icon={Users}
          subtext={L('المقيدون بسجلات النادي', 'Active roster members')}
        />
        <KPICard
          variant="emerald"
          value={rs.filter(p => p.st === 'fit').length}
          label={L('شهادات طبية سارية (لائق)', 'Valid certificates (fit)')}
          icon={Award}
          subtext={L('مؤهلون للمشاركة الرسمية', 'Cleared for official matches')}
        />
        <KPICard
          variant="warning"
          value={rs.filter(p => p.st === 'book' || p.st === 'cond').length}
          label={L('إجراء قائم / متابعة', 'In progress / follow-up')}
          icon={Clock}
          subtext={L('حجوزات أو برنامج أشبالنا', 'Booked or Ashbalna track')}
        />
        <KPICard
          variant="red"
          value={rs.filter(p => p.st === 'exp').length}
          label={L('شهادات تحتاج تجديدًا', 'Renewal exams due')}
          icon={AlertTriangle}
          subtext={L('يلزم كشف دوري للاستمرار', 'Periodic exam required')}
        />
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          ['roster', L('قائمة الرياضيين المعتمدين', 'Athletes Roster')],
          ['bulk', L('الحجز الجماعي للفريق', 'Bulk Team Booking')],
          ['req', L('طلبات تفويض الاطلاع', 'Access Authorization Requests')]
        ].map(([tKey, tLabel]) => (
          <button
            key={tKey}
            className={clubTab === tKey ? 'on' : ''}
            onClick={() => setClubTab(tKey)}
          >
            {tLabel}
          </button>
        ))}
      </div>

      {/* Roster tab */}
      {clubTab === 'roster' && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="m-0">
              <span className="d"></span>
              {L('كشف اللياقة الطبية للاعبي النادي', 'Athletes Medical Clearance Roster')}
            </h3>
            <span className="text-xs font-semibold text-[var(--muted)]">
              {rs.length} {L('رياضي مقيد', 'players')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="t">
              <thead>
                <tr>
                  <th>{L('اللاعب', 'Athlete')}</th>
                  <th>{L('اللعبة الرياضية', 'Sport')}</th>
                  <th>{L('السن', 'Age')}</th>
                  <th>{L('المستوى', 'Level')}</th>
                  <th>{L('حالة الشهادة', 'Certificate status')}</th>
                  <th>{L('رقم الشهادة', 'Certificate no.')}</th>
                  <th className="text-end">{L('الإجراءات', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {rs.map((p) => {
                  const globalIdx = players.indexOf(p);
                  return (
                    <tr key={p.id}>
                      <td>
                        <b className="text-xs text-[var(--ink)] block">{p.name}</b>
                        <span className="text-[11px] text-[var(--muted)]">{p.g === 'M' ? L('ذكر', 'Male') : L('أنثى', 'Female')}</span>
                      </td>
                      <td>
                        <span className="font-semibold text-xs text-[var(--ink)]">
                          {isRTL ? cfg.sports[p.sp] : SP_EN[cfg.sports[p.sp]] || cfg.sports[p.sp]}
                        </span>
                      </td>
                      <td className="font-mono text-xs">{p.age}</td>
                      <td>
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[var(--primary-50)] text-[var(--primary-700)] font-extrabold text-xs">
                          {p.lv}
                        </span>
                      </td>
                      <td><StatusTag status={p.st} /></td>
                      <td className="mono font-bold text-xs text-[var(--primary)]">
                        {p.st === 'fit' || p.st === 'exp' || p.st === 'cond' ? p.ct : '—'}
                      </td>
                      <td className="text-end" style={{ whiteSpace: 'nowrap' }}>
                        {p.st !== 'book' && (
                          <button
                            className="btn sec sm"
                            onClick={() => {
                              setSelectedCertIndex(globalIdx);
                              navigate('cert');
                            }}
                          >
                            <Award className="w-4 h-4" /> {L('الشهادة', 'Certificate')}
                          </button>
                        )}{' '}
                        <button
                          className="btn ghost sm"
                          onClick={() => navigate('consent')}
                        >
                          {L('طلب اطلاع', 'Request access')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="nt flex items-start gap-2" style={{ marginTop: '20px' }}>
            <Lock className="w-4 h-4 text-[var(--primary)] flex-none mt-0.5" />
            <span className="text-xs">
              {L(
                'يراعي النظام خصوصية الرياضيين: يرى النادي نتيجة الصلاحية فقط («لائق» أو «لائق بشروط») بعد موافقة اللاعب أو ولي الأمر — ولا تظهر التفاصيل المرضية الدقيقة إلا للفريق الطبي.',
                'Athlete privacy protected: Clubs see fitness outcome only (Fit or Conditionally Fit) following guardian consent — detailed medical history is accessible strictly to certified medical teams.'
              )}
            </span>
          </div>
        </div>
      )}

      {/* Bulk booking tab */}
      {clubTab === 'bulk' && (
        <div className="card">
          <h3>
            <span className="d"></span>
            {L(
              'حجز مواعيد الفحص الطبي الجماعي للفرق الرياضية',
              'Bulk Medical Examination Booking for Team Rosters'
            )}
          </h3>
          <p className="mut text-xs mb-4">
            {L(
              'قم برفع ملف يضم الأرقام القومية للاعبين واختيار المستشفى المعتمد والفترة المفضلة لحجز كشوفات الفريق دفعة واحدة',
              'Upload a spreadsheet containing athlete national IDs, select the designated hospital facility, and schedule exam slots in batch'
            )}
          </p>

          <div className="g2">
            <label className="border-2 border-dashed border-[var(--line)] hover:border-[var(--primary)] bg-[var(--bg)] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
              <UploadCloud className="w-8 h-8 text-[var(--primary)] mb-2" />
              <b className="text-xs text-[var(--ink)] block">
                {L('رفع كشف اللاعبين (ملف Excel / CSV)', 'Upload athlete list (Excel / CSV)')}
              </b>
              <span className="text-[11px] text-[var(--muted)] block mt-1">
                {L('يتضمن الاسم، الرقم القومي، واللعبة', 'Includes full name, national ID, and sport')}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={() => showToast(L('تم التحقق من 22 رقمًا قوميًا بنجاح', '22 national IDs validated successfully'))}
              />
            </label>

            <div className="flex flex-col justify-between">
              <label className="f">
                <span>{L('المستشفى / وحدة الطب الرياضي المختارة', 'Designated Sports Medicine Hospital')}</span>
                <select>
                  {hosps.filter(h => h.st === 'on').map(h => (
                    <option key={h.id}>{h.n} — ({isRTL ? h.gov : GOV_EN[h.gov] || h.gov})</option>
                  ))}
                </select>
              </label>

              <div>
                <b className="text-xs font-bold text-[var(--ink)] block mb-2">
                  {L('الفترة الزمنية المفضلة للكشف', 'Preferred examination shift')}
                </b>
                <div className="chips">
                  {cfg.shifts.map((s, i) => (
                    <button
                      key={i}
                      className={`chip ${gs === i ? 'on' : ''}`}
                      onClick={() => setGs(i)}
                    >
                      {s.d} · {s.f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="nt flex items-start gap-2" style={{ marginTop: '20px' }}>
            <Info className="w-4 h-4 text-[var(--primary)] flex-none mt-0.5" />
            <span className="text-xs">
              {L(
                'إجراءات الحجز الجماعي: تؤكد وحدة الطب الرياضي الموعد أو تقترح بديلاً خلال 24 ساعة؛ وتصل رسالة نصية (SMS) فورية بالموعد لولي أمر كل لاعب مسجل.',
                'Booking workflow: Hospital unit confirms or reschedules within 24 hours; an automated SMS confirmation with preparation guidelines is sent to each athlete/guardian.'
              )}
            </span>
          </div>

          <button
            className="btn mt-3"
            onClick={() => showToast(L('أُرسل طلب الحجز الجماعي للمستشفى بنجاح', 'Bulk booking request submitted to hospital'))}
          >
            <CheckCircle2 className="w-4 h-4" />
            {L('إرسال طلب الحجز الجماعي واعتماده', 'Submit Bulk Booking Request')}
          </button>
        </div>
      )}

      {/* Access requests tab */}
      {clubTab === 'req' && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="m-0">
              <span className="d"></span>
              {L('سجل طلبات تفويض الاطلاع المرسلة للاعبين', 'Access Requests Sent to Athletes & Guardians')}
            </h3>
            <span className="text-xs text-[var(--muted)]">
              {L('تحديث فوري', 'Live status')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="t">
              <thead>
                <tr>
                  <th>{L('اللاعب', 'Athlete')}</th>
                  <th>{L('نطاق الاطلاع', 'Scope')}</th>
                  <th>{L('مدة الصلاحية', 'Duration')}</th>
                  <th>{L('تاريخ تقديم الطلب', 'Requested date')}</th>
                  <th>{L('حالة الموافقة', 'Approval status')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [L('مقبول — ساري', 'Approved — Active'), 'tg'],
                  [L('بانتظار موافقة ولي الأمر', 'Awaiting guardian'), 'tw'],
                  [L('مقبول — ساري', 'Approved — Active'), 'tg'],
                  [L('مرفوض من ولي الأمر', 'Denied by guardian'), 'tb'],
                  [L('منتهي الصلاحية', 'Expired duration'), 'tgy']
                ].map((arr, i) => (
                  <tr key={i}>
                    <td>
                      <b className="text-xs text-[var(--ink)] block">{rs[i]?.name}</b>
                    </td>
                    <td>{L(cfg.scopes[0][0], cfg.scopes[0][1])}</td>
                    <td>{L(cfg.durs[i % 4][0], cfg.durs[i % 4][1])}</td>
                    <td className="mono text-xs" dir="ltr">{10 + i}/10/2026</td>
                    <td><span className={`tag ${arr[1]}`}>{arr[0]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
