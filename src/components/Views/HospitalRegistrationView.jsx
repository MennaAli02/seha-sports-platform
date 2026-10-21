import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { StatusTag } from '../Common/StatusTag';
import { KPICard } from '../Common/KPICard';
import { 
  Building2, 
  Stethoscope, 
  Activity, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Search, 
  ShieldCheck,
  Award,
  Layers,
  X
} from 'lucide-react';

export const HospitalRegistrationView = () => {
  const { isRTL, L } = useLanguage();
  const { hosps, setHosps, cfg, showToast, logAudit, GOV_EN } = useSeha();

  const [name, setName] = useState('');
  const [gov, setGov] = useState(cfg.govs[0]);
  const [phone, setPhone] = useState('');
  const [capacity, setCapacity] = useState(30);
  const [director, setDirector] = useState('');
  const [selectedLevels, setSelectedLevels] = useState(['2', '3']);
  const [hasEcg, setHasEcg] = useState(true);
  const [hasCertDoctor, setHasCertDoctor] = useState(true);
  const [ok, setOk] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const addOrg = () => {
    if (!name.trim()) {
      showToast(L('الاسم الرسمي إلزامي', 'Official name is required'));
      return;
    }
    if (!ok) {
      showToast(L('يلزم الإقرار قبل التسجيل', 'Confirmation is required'));
      return;
    }
    const id = `HS-${201 + hosps.length}`;
    const newHosp = {
      id: id,
      n: name.trim(),
      gov: gov,
      ph: phone.trim() || '02-24158899',
      cap: Number(capacity) || 30,
      lv: selectedLevels.map(Number),
      dir: director.trim() || '—',
      st: 'pend'
    };
    setHosps([...hosps, newHosp]);
    logAudit(L('مسؤول المنظومة', 'Admin'), `${L('تسجيل جهة جديدة ', 'New entity ')}${id}`);
    showToast(L('تم التسجيل — بانتظار الاعتماد', 'Registered — pending accreditation'));
    setName('');
    setPhone('');
    setDirector('');
    setOk(false);
  };

  const toggleStatus = (i) => {
    const updated = [...hosps];
    updated[i].st = updated[i].st === 'on' ? 'off' : 'on';
    setHosps(updated);
  };

  const removeHosp = (i) => {
    const updated = hosps.filter((_, idx) => idx !== i);
    setHosps(updated);
    showToast(L('تم حذف المستشفى من السجل', 'Hospital removed from registry'));
  };

  const toggleLevel = (lvlStr) => {
    if (selectedLevels.includes(lvlStr)) {
      if (selectedLevels.length > 1) {
        setSelectedLevels(selectedLevels.filter(x => x !== lvlStr));
      }
    } else {
      setSelectedLevels([...selectedLevels, lvlStr]);
    }
  };

  const filteredHosps = hosps.filter(h => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const gName = (isRTL ? h.gov : GOV_EN[h.gov] || h.gov).toLowerCase();
    return h.n.toLowerCase().includes(q) || h.id.toLowerCase().includes(q) || gName.includes(q);
  });

  const activeCount = hosps.filter(h => h.st === 'on').length;
  const pendingCount = hosps.filter(h => h.st === 'pend').length;
  const totalCapacity = hosps.reduce((acc, h) => acc + (h.cap || 0), 0);

  return (
    <div className="page-stack">
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <Stethoscope size={13} />
            {L('شبكة الرعاية والطب الرياضي', 'Clinical Network & Sports Medicine')}
          </span>
          <h1>{L('اعتماد المستشفيات ووحدات الفحص الطبي الرياضي', 'Hospital & Medical Center Accreditation')}</h1>
          <p>
            {L(
              'تسجيل واعتماد مرافق الفحص، تحديد مستويات الكود الطبي المعتمدة، وضبط الطاقة الاستيعابية اليومية وجداول الأطباء',
              'Accredit clinical facilities, configure authorized examination levels, daily capacities, and certified physician schedules'
            )}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="g4">
        <KPICard
          value={hosps.length}
          label={L('إجمالي المستشفيات والمراكز', 'Total Facilities')}
          type="brand"
          icon={<Building2 size={20} />}
        />
        <KPICard
          value={activeCount}
          label={L('مراكز معتمدة ومفعلة', 'Active Accredited')}
          type="emerald"
          icon={<CheckCircle2 size={20} />}
        />
        <KPICard
          value={totalCapacity}
          label={L('الطاقة الاستيعابية اليومية (كشف)', 'Total Daily Capacity (Exams)')}
          type="medical"
          icon={<Activity size={20} />}
        />
        <KPICard
          value={pendingCount}
          label={L('بانتظار استكمال الاعتماد', 'Pending Verification')}
          type="warning"
          icon={<Clock size={20} />}
        />
      </div>

      <div className="g2 reg" style={{ gap: '20px' }}>
        {/* Form Card */}
        <div className="card" style={{ alignSelf: 'start', padding: '22px 20px', borderRadius: '16px' }}>
          <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand)', fontSize: '16px' }}>
            <span className="d"></span>
            {L('تسجيل مستشفى أو وحدة طب رياضي جديدة', 'New Facility Accreditation')}
          </h3>

          <label className="f">
            <span>{L('الاسم الرسمي للمستشفى / المركز *', 'Official facility name *')}</span>
            <input
              id="o_n"
              placeholder={L('مثال: مستشفى النيل التخصصي للطب الرياضي', 'e.g. Nile Specialized Sports Medicine Hospital')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <div className="g2" style={{ gap: '12px' }}>
            <label className="f">
              <span>{L('المحافظة', 'Governorate')}</span>
              <select id="o_g" value={gov} onChange={(e) => setGov(e.target.value)}>
                {cfg.govs.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </label>
            <label className="f">
              <span>{L('هاتف التواصل والاستعلام', 'Direct contact phone')}</span>
              <input
                id="o_p"
                dir="ltr"
                placeholder="02-xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>

          <div className="g2" style={{ gap: '12px' }}>
            <label className="f">
              <span>{L('الطاقة الاستيعابية اليومية (كشف)', 'Daily capacity')}</span>
              <input
                id="o_c"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
              />
            </label>
            <label className="f">
              <span>{L('المدير الطبي المسؤول', 'Medical director')}</span>
              <input
                id="o_m"
                placeholder={L('د. …', 'Dr. …')}
                value={director}
                onChange={(e) => setDirector(e.target.value)}
              />
            </label>
          </div>

          {/* Interactive Level Checkboxes */}
          <div style={{ marginBottom: '14px' }}>
            <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--brand)', marginBottom: '8px' }}>
              {L('المستويات الطبية المعتمدة للفحص', 'Accredited Medical Levels')}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {cfg.levels.slice(1).map((lvl) => {
                const lvlIdStr = String(lvl.id);
                const isSelected = selectedLevels.includes(lvlIdStr);
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => toggleLevel(lvlIdStr)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--line)',
                      background: isSelected ? 'var(--teal-soft)' : 'var(--card)',
                      color: isSelected ? 'var(--primary)' : 'var(--muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? <CheckCircle2 size={14} style={{ color: 'var(--primary)' }} /> : <span style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid var(--muted)' }} />}
                    {L(lvl.ar, lvl.en)} ({lvl.fee} {L('ج.م', 'EGP')})
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ background: 'var(--primary-50)', border: '1px solid var(--line)', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px' }}>
            <label className="chk" style={{ marginBottom: '8px' }}>
              <input 
                type="checkbox" 
                checked={hasEcg}
                onChange={(e) => setHasEcg(e.target.checked)} 
              />{' '}
              <span style={{ fontSize: '12.5px', color: 'var(--ink)' }}>{L('يتوافر جهاز رسم قلب إلكتروني وجهاز إيكو بالمقر', 'ECG & Echocardiogram devices available on-site')}</span>
            </label>
            <label className="chk" style={{ margin: 0 }}>
              <input 
                type="checkbox" 
                checked={hasCertDoctor}
                onChange={(e) => setHasCertDoctor(e.target.checked)} 
              />{' '}
              <span style={{ fontSize: '12.5px', color: 'var(--ink)' }}>{L('طبيب معتمد يحمل توقيعًا إلكترونيًا مرخصًا من ITIDA', 'Certified physician with ITIDA-licensed e-signature')}</span>
            </label>
          </div>

          <div style={{
            background: 'var(--color-brand-light)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            border: '1px solid var(--color-border)'
          }}>
            <label className="chk" style={{ margin: 0, alignItems: 'flex-start' }}>
              <input
                type="checkbox"
                id="o_ok"
                checked={ok}
                onChange={(e) => setOk(e.target.checked)}
                style={{ marginTop: '3px' }}
              />{' '}
              <span style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--brand)', fontWeight: 600 }}>
                {L(
                  'أقر بصحة البيانات والتزام الكادر الطبي بالبروتوكول الوطني للكشف الطبي الرياضي وقانون حماية البيانات 151/2020.',
                  'I certify data validity and clinical adherence to the National Sports Medicine Protocol and Law 151/2020.'
                )}
              </span>
            </label>
          </div>

          <button
            className="btn"
            style={{ width: '100%', justifyContent: 'center', fontWeight: 800, padding: '10px 16px', fontSize: '14px' }}
            onClick={addOrg}
          >
            <Plus size={18} />
            {L('تسجيل وإرسال للاعتماد', 'Register & Submit for Accreditation')}
          </button>
        </div>

        {/* Current Registry Card */}
        <div className="card" style={{ padding: '22px 20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand)', fontSize: '16px' }}>
              <span className="d"></span>
              {L('سجل المستشفيات والمراكز المعتمدة', 'Accredited Hospitals Registry')}
              <span className="tag ti" style={{ fontWeight: 800 }}>{hosps.length}</span>
            </h3>

            {/* Quick Search */}
            <div style={{ position: 'relative', width: '230px' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  [isRTL ? 'right' : 'left']: '11px',
                  color: 'var(--muted)',
                  pointerEvents: 'none',
                  zIndex: 2
                }}
              />
              <input
                type="text"
                placeholder={L('بحث بالاسم أو الكود…', 'Search name or code…')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px',
                  [isRTL ? 'paddingRight' : 'paddingLeft']: '36px',
                  [isRTL ? 'paddingLeft' : 'paddingRight']: searchQuery ? '30px' : '12px',
                  fontSize: '12.5px',
                  borderRadius: '10px'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    [isRTL ? 'left' : 'right']: '8px',
                    zIndex: 2,
                    background: 'none',
                    border: 'none',
                    padding: '2px',
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={L('مسح البحث', 'Clear search')}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div style={{ overflowX: 'auto', marginTop: '18px', marginBottom: '18px' }}>
            <table className="t">
              <thead>
                <tr>
                  <th>{L('الكود', 'Code')}</th>
                  <th>{L('المستشفى والمدير الطبي', 'Hospital & Director')}</th>
                  <th>{L('المحافظة', 'Governorate')}</th>
                  <th>{L('المستويات المعتمدة', 'Levels')}</th>
                  <th>{L('الطاقة اليومية', 'Capacity')}</th>
                  <th>{L('الحالة', 'Status')}</th>
                  <th style={{ textAlign: 'center' }}>{L('إجراءات', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredHosps.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                      {L('لا توجد مستشفيات مطابقة للبحث', 'No hospitals matching search criteria')}
                    </td>
                  </tr>
                ) : (
                  filteredHosps.map((r, i) => (
                    <tr key={r.id}>
                      <td className="mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>{r.id}</td>
                      <td>
                        <b style={{ color: 'var(--brand)', fontSize: '13.5px' }}>{r.n}</b>
                        <br />
                        <span className="mut" style={{ fontSize: '11.5px' }}>
                          {L('المدير الطبي: ', 'Director: ')}{r.dir}
                        </span>
                      </td>
                      <td style={{ fontSize: '12.5px' }}>{isRTL ? r.gov : GOV_EN[r.gov] || r.gov}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {r.lv.map((lvlNum) => (
                            <span key={lvlNum} className="tag ti" style={{ fontSize: '11px', padding: '2px 6px' }}>
                              L{lvlNum}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="num" style={{ fontWeight: 800, color: 'var(--brand)' }}>{r.cap}</td>
                      <td><StatusTag type="org" status={r.st} /></td>
                      <td style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <button
                          className="btn ghost sm"
                          style={{ padding: '4px 8px', fontSize: '11.5px', gap: '4px' }}
                          onClick={() => toggleStatus(i)}
                          title={L('تبديل حالة الاعتماد', 'Toggle status')}
                        >
                          <RefreshCw size={13} />
                          {L('تبديل', 'Toggle')}
                        </button>{' '}
                        <button
                          className="btn ghost sm"
                          style={{ color: 'var(--error)', padding: '4px 8px' }}
                          onClick={() => removeHosp(i)}
                          title={L('حذف', 'Delete')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
