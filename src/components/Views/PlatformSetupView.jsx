import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { 
  Stethoscope, 
  ListFilter, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Layers,
  FileCheck
} from 'lucide-react';

export const PlatformSetupView = () => {
  const { isRTL, L } = useLanguage();
  const { cfg, setCfg, audit, resetDemoData, showToast } = useSeha();

  const [setupTab, setSetupTab] = useState('code'); // code, lists, sched, ops, sec
  const [newSport, setNewSport] = useState('');
  const [newGov, setNewGov] = useState('');

  const tabs = [
    { id: 'code', icon: Stethoscope, label: [L('الكود الطبي والرسوم', 'Medical code & fees')] },
    { id: 'lists', icon: ListFilter, label: [L('الألعاب والمحافظات', 'Sports & governorates')] },
    { id: 'sched', icon: Calendar, label: [L('المواعيد والطاقة', 'Shifts & capacity')] },
    { id: 'ops', icon: CreditCard, label: [L('الدفع والموافقات', 'Payments & consents')] },
    { id: 'sec', icon: ShieldCheck, label: [L('الأمان وسجل التدقيق', 'Security & audit')] }
  ];

  return (
    <div>
      {/* Header */}
      <div className="ph" style={{ marginBottom: '20px' }}>
        <div>
          <span className="lab" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px',
            color: 'var(--primary)',
            background: 'var(--teal-soft)',
            padding: '3px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '6px'
          }}>
            <ShieldCheck size={13} />
            {L('الإدارة والحوكمة المركزية', 'Central Governance & Settings')}
          </span>
          <h1 style={{ margin: '4px 0 6px', fontSize: '26px', fontWeight: 800, color: 'var(--brand)' }}>
            {L('إعداد وضبط المنظومة الوطنية', 'National Platform Configuration')}
          </h1>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13.5px' }}>
            {L(
              'تعديل الكود الطبي، جداول الرسوم، قنوات الدفع، وضوابط الامتثال وقانون حماية البيانات 151/2020 فورياً',
              'Configure medical codes, fee structures, payment channels, and compliance controls instantly across all portals'
            )}
          </p>
        </div>
        <div className="act np">
          <button
            className="btn"
            style={{ fontWeight: 800, gap: '6px' }}
            onClick={() => showToast(L('تم حفظ جميع الإعدادات وتطبيقها بنجاح', 'All settings saved and applied successfully'))}
          >
            <Save size={16} />
            {L('حفظ الإعدادات', 'Save Settings')}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '20px', borderRadius: '16px' }}>
        {/* Navigation Tabs */}
        <div className="tabs" style={{ marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
          {tabs.map((t) => {
            const IconComponent = t.icon;
            const isActive = setupTab === t.id;
            return (
              <button
                key={t.id}
                className={isActive ? 'on' : ''}
                onClick={() => setSetupTab(t.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  fontSize: '13px'
                }}
              >
                <IconComponent size={15} />
                {t.label[0]}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Medical Code & Fees */}
        {setupTab === 'code' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand)', fontSize: '16px' }}>
                <span className="d"></span>
                {L('مستويات الكود الطبي المعتمدة ورسوم الفحص', 'Authorized Medical Code Levels & Fees')}
              </h3>
              <span className="mut" style={{ fontSize: '12px' }}>
                {L('معتمدة بقرار اللجنة الطبية العليا', 'Approved by the Higher Medical Board')}
              </span>
            </div>

            <div className="g2" style={{ gap: '16px', marginBottom: '20px' }}>
              {cfg.levels.map((l, i) => (
                <div
                  key={l.id}
                  style={{
                    border: '1px solid var(--line)',
                    borderRadius: '14px',
                    padding: '16px',
                    background: 'var(--primary-50)',
                    boxShadow: '0 1px 3px rgba(18, 59, 74, 0.04)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '6px', 
                        background: 'var(--brand)', 
                        color: 'var(--card)', 
                        fontSize: '11px', 
                        fontWeight: 800, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        L{l.id}
                      </span>
                      <b style={{ fontSize: '14px', color: 'var(--brand)' }}>
                        {L(l.ar, l.en)}
                      </b>
                    </div>
                    <span className="tag ti" style={{ fontWeight: 800, fontSize: '13px' }}>
                      {l.fee} {L('ج.م', 'EGP')}
                    </span>
                  </div>

                  <div className="g2" style={{ gap: '10px' }}>
                    <label className="f" style={{ margin: 0 }}>
                      <span>{L('الاسم الرسمي (عربي)', 'Name (Arabic)')}</span>
                      <input
                        value={l.ar}
                        onChange={(e) => {
                          const updated = JSON.parse(JSON.stringify(cfg));
                          updated.levels[i].ar = e.target.value;
                          setCfg(updated);
                        }}
                      />
                    </label>
                    <label className="f" style={{ margin: 0 }}>
                      <span>{L('الاسم الرسمي (English)', 'Name (English)')}</span>
                      <input
                        dir="ltr"
                        value={l.en}
                        onChange={(e) => {
                          const updated = JSON.parse(JSON.stringify(cfg));
                          updated.levels[i].en = e.target.value;
                          setCfg(updated);
                        }}
                      />
                    </label>
                  </div>

                  <div className="g2" style={{ gap: '10px', marginTop: '10px' }}>
                    <label className="f" style={{ margin: 0 }}>
                      <span>{L('رسم الكشف للمستشفى (ج.م)', 'Exam fee (EGP)')}</span>
                      <input
                        type="number"
                        value={l.fee}
                        onChange={(e) => {
                          const updated = JSON.parse(JSON.stringify(cfg));
                          updated.levels[i].fee = Number(e.target.value);
                          setCfg(updated);
                        }}
                      />
                    </label>
                    <label className="f" style={{ margin: 0 }}>
                      <span>{L('الفحوصات الإلزامية (مفصولة بفاصلة)', 'Required exams (comma-separated)')}</span>
                      <textarea
                        style={{ minHeight: '42px', height: '42px', fontSize: '12px' }}
                        value={l.ex.join('، ')}
                        onChange={(e) => {
                          const updated = JSON.parse(JSON.stringify(cfg));
                          updated.levels[i].ex = e.target.value.split(/[،,]/).map(s => s.trim()).filter(Boolean);
                          setCfg(updated);
                        }}
                      ></textarea>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Global Rules and Fees */}
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: '14px',
              padding: '16px 20px',
              marginTop: '10px'
            }}>
              <h4 style={{ margin: '0 0 12px', color: 'var(--brand)', fontSize: '14px' }}>
                {L('سياسات المنظومة ورسم الميكنة الوطني', 'National Platform Policies & Automation Fees')}
              </h4>
              <div className="g3" style={{ gap: '16px' }}>
                <label className="f" style={{ margin: 0 }}>
                  <span>{L('رسم الميكنة الموحد لكل كشف (ج.م)', 'Automation fee per exam (EGP)')}</span>
                  <input
                    type="number"
                    value={cfg.autoFee}
                    onChange={(e) => setCfg({ ...cfg, autoFee: Number(e.target.value) })}
                  />
                  <small style={{ color: 'var(--muted)', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                    {L('يُحصّل إلكترونيًا لتمويل استضافة وتشغيل المنظومة', 'Collected electronically for hosting & operations')}
                  </small>
                </label>
                <label className="f" style={{ margin: 0 }}>
                  <span>{L('صلاحية الشهادة الطبية (شهر)', 'Certificate validity (months)')}</span>
                  <input
                    type="number"
                    value={cfg.valid}
                    onChange={(e) => setCfg({ ...cfg, valid: Number(e.target.value) })}
                  />
                  <small style={{ color: 'var(--muted)', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                    {L('فترة صلاحية الشهادة الرياضية قبل طلب الفحص الدوري', 'Validity period before periodic renewal exam')}
                  </small>
                </label>
                <label className="f" style={{ margin: 0 }}>
                  <span>{L('الحد الأقصى لإصدار الشهادة (ساعة)', 'Issuance SLA (hours)')}</span>
                  <input type="number" defaultValue={24} />
                  <small style={{ color: 'var(--muted)', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                    {L('المهلة المحددة للمستشفى لإتمام الفحص والاعتماد', 'Target SLA for hospital examination & issuance')}
                  </small>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sports & Governorates */}
        {setupTab === 'lists' && (
          <div className="g2" style={{ gap: '24px' }}>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px' }}>
              <h3 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand)', fontSize: '15px' }}>
                <span className="d"></span>
                {L('الألعاب الرياضية المعتمدة', 'Accredited Sports')}
                <span className="tag ti">{cfg.sports.length}</span>
              </h3>
              <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'var(--muted)' }}>
                {L('تظهر في استمارات حجز الرياضيين وقوائم الأندية', 'Displayed in athlete booking forms and club rosters')}
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px', maxHeight: '280px', overflowY: 'auto' }}>
                {cfg.sports.map((sport, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      background: 'var(--card)', 
                      border: '1px solid var(--line)', 
                      borderRadius: '8px', 
                      padding: '5px 10px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: 'var(--brand)'
                    }}
                  >
                    <span>{sport}</span>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: 0, display: 'flex' }}
                      onClick={() => {
                        const updated = JSON.parse(JSON.stringify(cfg));
                        updated.sports.splice(i, 1);
                        setCfg(updated);
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  placeholder={L('إضافة لعبة رياضية جديدة…', 'Add new sport…')}
                  value={newSport}
                  onChange={(e) => setNewSport(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newSport.trim()) {
                      const updated = JSON.parse(JSON.stringify(cfg));
                      updated.sports.push(newSport.trim());
                      setCfg(updated);
                      setNewSport('');
                    }
                  }}
                />
                <button
                  className="btn sm"
                  style={{ fontWeight: 700 }}
                  onClick={() => {
                    if (newSport.trim()) {
                      const updated = JSON.parse(JSON.stringify(cfg));
                      updated.sports.push(newSport.trim());
                      setCfg(updated);
                      setNewSport('');
                    }
                  }}
                >
                  <Plus size={15} />
                  {L('إضافة', 'Add')}
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px' }}>
              <h3 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand)', fontSize: '15px' }}>
                <span className="d"></span>
                {L('المحافظات والتغطية الجغرافية', 'Governorates & Coverage')}
                <span className="tag ti">{cfg.govs.length}</span>
              </h3>
              <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'var(--muted)' }}>
                {L('المحافظات المتاحة لاختيار المستشفيات والأندية', 'Regions available for hospital & club assignment')}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px', maxHeight: '280px', overflowY: 'auto' }}>
                {cfg.govs.map((gov, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      background: 'var(--card)', 
                      border: '1px solid var(--line)', 
                      borderRadius: '8px', 
                      padding: '5px 10px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: 'var(--brand)'
                    }}
                  >
                    <span>{gov}</span>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: 0, display: 'flex' }}
                      onClick={() => {
                        const updated = JSON.parse(JSON.stringify(cfg));
                        updated.govs.splice(i, 1);
                        setCfg(updated);
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  placeholder={L('إضافة محافظة جديدة…', 'Add new governorate…')}
                  value={newGov}
                  onChange={(e) => setNewGov(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newGov.trim()) {
                      const updated = JSON.parse(JSON.stringify(cfg));
                      updated.govs.push(newGov.trim());
                      setCfg(updated);
                      setNewGov('');
                    }
                  }}
                />
                <button
                  className="btn sm"
                  style={{ fontWeight: 700 }}
                  onClick={() => {
                    if (newGov.trim()) {
                      const updated = JSON.parse(JSON.stringify(cfg));
                      updated.govs.push(newGov.trim());
                      setCfg(updated);
                      setNewGov('');
                    }
                  }}
                >
                  <Plus size={15} />
                  {L('إضافة', 'Add')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Schedule & Capacity */}
        {setupTab === 'sched' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand)', fontSize: '16px' }}>
                <span className="d"></span>
                {L('جدول أيام وساعات الفحص الأسبوعي والطاقة الافتراضية', 'Weekly Shift Schedules & Default Capacities')}
              </h3>
              <button
                className="btn sec sm"
                style={{ fontWeight: 700 }}
                onClick={() => {
                  const updated = JSON.parse(JSON.stringify(cfg));
                  updated.shifts.push({ d: L('الجمعة', 'Friday'), f: '09:00', t: '13:00', c: 20 });
                  setCfg(updated);
                }}
              >
                <Plus size={15} />
                {L('إضافة فترة عمل', 'Add Working Shift')}
              </button>
            </div>

            <table className="t">
              <thead>
                <tr>
                  <th>{L('اليوم', 'Day')}</th>
                  <th>{L('من الساعة', 'Start Time')}</th>
                  <th>{L('إلى الساعة', 'End Time')}</th>
                  <th>{L('الطاقة الافتراضية (كشف)', 'Default Capacity')}</th>
                  <th style={{ width: '60px', textAlign: 'center' }}></th>
                </tr>
              </thead>
              <tbody>
                {cfg.shifts.map((shift, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        style={{ maxWidth: '140px', fontWeight: 700 }}
                        value={shift.d}
                        onChange={(e) => {
                          const updated = JSON.parse(JSON.stringify(cfg));
                          updated.shifts[i].d = e.target.value;
                          setCfg(updated);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        dir="ltr"
                        style={{ maxWidth: '100px' }}
                        value={shift.f}
                        onChange={(e) => {
                          const updated = JSON.parse(JSON.stringify(cfg));
                          updated.shifts[i].f = e.target.value;
                          setCfg(updated);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        dir="ltr"
                        style={{ maxWidth: '100px' }}
                        value={shift.t}
                        onChange={(e) => {
                          const updated = JSON.parse(JSON.stringify(cfg));
                          updated.shifts[i].t = e.target.value;
                          setCfg(updated);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        dir="ltr"
                        style={{ maxWidth: '100px', fontWeight: 800 }}
                        value={shift.c}
                        onChange={(e) => {
                          const updated = JSON.parse(JSON.stringify(cfg));
                          updated.shifts[i].c = Number(e.target.value);
                          setCfg(updated);
                        }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn ghost sm"
                        style={{ color: 'var(--error)', padding: '4px' }}
                        onClick={() => {
                          const updated = JSON.parse(JSON.stringify(cfg));
                          updated.shifts.splice(i, 1);
                          setCfg(updated);
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Payments & Consents */}
        {setupTab === 'ops' && (
          <div className="g3" style={{ gap: '20px' }}>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px' }}>
              <h3 style={{ margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand)', fontSize: '15px' }}>
                <span className="d"></span>
                {L('بوابات الدفع الإلكتروني المعتمدة', 'Payment Gateways')}
              </h3>
              {cfg.pay.map((p, idx) => (
                <label key={idx} className="chk" style={{ marginBottom: '10px' }}>
                  <input type="checkbox" defaultChecked /> 
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{L(p[0], p[1])}</span>
                </label>
              ))}
              <div style={{ marginTop: '16px', fontSize: '11.5px', color: 'var(--muted)', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
                {L('يتم التحصيل عبر شبكة المدفوعات الحكومية المؤمنة', 'Processed via certified government payment infrastructure')}
              </div>
            </div>

            <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px' }}>
              <h3 style={{ margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand)', fontSize: '15px' }}>
                <span className="d"></span>
                {L('نطاقات الاطلاع القانونية', 'Authorized Access Scopes')}
              </h3>
              {cfg.scopes.map((p, idx) => (
                <label key={idx} className="chk" style={{ marginBottom: '10px' }}>
                  <input type="checkbox" defaultChecked /> 
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{L(p[0], p[1])}</span>
                </label>
              ))}
              <h4 style={{ margin: '16px 0 8px', fontSize: '13px', color: 'var(--brand)' }}>
                {L('مدد سريان الموافقة', 'Consent Durations')}
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {cfg.durs.map((p, idx) => (
                  <span key={idx} className="tag tgy" style={{ fontSize: '11.5px' }}>
                    {L(p[0], p[1])}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px' }}>
              <h3 style={{ margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand)', fontSize: '15px' }}>
                <span className="d"></span>
                {L('أسباب التحويل لمسار «أشبالنا»', 'Ashbalna Referral Reasons')}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {cfg.ref.map((p, idx) => (
                  <span key={idx} className="tag tw" style={{ fontSize: '11.5px' }}>
                    {L(p[0], p[1])}
                  </span>
                ))}
              </div>
              <div className="nt ok" style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.6, borderRadius: '10px' }}>
                {L(
                  'قانون 151/2020: كل طلب اطلاع يتطلب موافقة صريحة بنطاق محدد ومدة سريان قابلة للإلغاء في أي وقت، مع توثيق كامل للوصول.',
                  'Law 151/2020: Every access requires explicit, scoped, revocable consent with immutable audit tracking.'
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Security & Audit */}
        {setupTab === 'sec' && (
          <div className="g2" style={{ gap: '20px' }}>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px' }}>
              <h3 style={{ margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand)', fontSize: '15px' }}>
                <span className="d"></span>
                {L('منظومة الضوابط الأمنية والامتثال الحكومي', 'Security Controls & Regulatory Compliance')}
              </h3>
              <table className="t" style={{ marginBottom: '16px' }}>
                <tbody>
                  {[
                    [L('استضافة حكومية سحابية داخل جمهورية مصر العربية', 'Government Cloud Hosting inside Egypt')],
                    [L('تشفير بيانات النقل والتخزين بمستويات TLS 1.3 و AES-256', 'Encryption in transit & at rest (TLS 1.3 / AES-256)')],
                    [L('مصادقة ثنائية وصلاحيات وصول مبنية على الأدوار (RBAC)', '2FA and Role-Based Access Control')],
                    [L('تقليل البيانات في واجهة التحقق العامة لحماية هوية اللاعب', 'Data minimisation on public verification interfaces')],
                    [L('توقيع رقمي موثق ومطابق لاشتراطات ITIDA', 'ITIDA-certified e-signatures for physicians')],
                    [L('سجل تدقيق رقابي غير قابل للتعديل أو الحذف (WORM)', 'Immutable Audit Log (Write Once Read Many)')]
                  ].map((x, idx) => (
                    <tr key={idx}>
                      <td style={{ fontSize: '12.5px', fontWeight: 600 }}>{x[0]}</td>
                      <td style={{ width: '100px', textAlign: 'center' }}>
                        <span className="tag tg" style={{ gap: '4px', fontWeight: 700, fontSize: '11px' }}>
                          <CheckCircle2 size={12} />
                          {L('مفعّل نشط', 'Enabled')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{
                background: 'rgba(194, 65, 75, 0.06)',
                border: '1px solid rgba(194, 65, 75, 0.2)',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <b style={{ color: 'var(--error)', fontSize: '13px', display: 'block' }}>
                    {L('إعادة تعيين البيانات التجريبية', 'Reset Demo Environment Data')}
                  </b>
                  <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                    {L('يعيد المنظومة إلى الحالة الابتدائية مع الحفاظ على الكود الطبي', 'Restores initial mock state while keeping configuration')}
                  </span>
                </div>
                <button
                  className="btn ghost sm"
                  style={{ color: 'var(--error)', borderColor: 'rgba(194, 65, 75, 0.3)', gap: '6px', fontWeight: 700 }}
                  onClick={() => {
                    if (window.confirm(L('هل أنت متأكد من إعادة تعيين جميع بيانات العرض؟', 'Are you sure you want to reset all demo data?'))) {
                      resetDemoData();
                      showToast(L('تمت إعادة تعيين البيانات التجريبية بنجاح', 'Demo data reset successfully'));
                    }
                  }}
                >
                  <RotateCcw size={14} />
                  {L('إعادة تعيين البيانات', 'Reset Demo Data')}
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand)', fontSize: '15px' }}>
                  <span className="d"></span>
                  {L('سجل العمليات والتدقيق الرقابي', 'Live Audit Trail')}
                  <span className="tag ti">{audit.length}</span>
                </h3>
                <span className="mut" style={{ fontSize: '11.5px' }}>
                  {L('حسب اشتراطات الحوكمة', 'Regulatory Governance Compliant')}
                </span>
              </div>

              <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                <table className="t">
                  <thead>
                    <tr>
                      <th style={{ width: '85px' }}>{L('الوقت', 'Time')}</th>
                      <th style={{ width: '130px' }}>{L('الجهة الفاعلة', 'Actor')}</th>
                      <th>{L('العملية المنفذة', 'Action Details')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audit.map((a, idx) => (
                      <tr key={idx}>
                        <td className="mono" dir="ltr" style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{a[0]}</td>
                        <td>
                          <b style={{ color: 'var(--brand)', fontSize: '12px' }}>{a[1]}</b>
                        </td>
                        <td style={{ fontSize: '12px' }}>{isRTL ? a[2] : a[3] || a[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
