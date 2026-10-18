import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { StatusTag } from '../Common/StatusTag';
import { KPICard } from '../Common/KPICard';
import { 
  Building2, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Users, 
  Phone, 
  MapPin, 
  Briefcase, 
  FileCheck, 
  ShieldCheck, 
  Search,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';

export const ClubRegistrationView = () => {
  const { isRTL, L } = useLanguage();
  const { clubs, setClubs, cfg, showToast, logAudit, GOV_EN } = useSeha();

  const [name, setName] = useState('');
  const [gov, setGov] = useState(cfg.govs[0]);
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('نادي');
  const [mgr, setMgr] = useState('');
  const [licNo, setLicNo] = useState('');
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
    const id = `CL-${101 + clubs.length}`;
    const newClub = {
      id: id,
      n: name.trim(),
      type: type,
      gov: gov,
      ph: phone.trim() || '01012345678',
      mgr: mgr.trim() || '—',
      players: 0,
      st: 'pend'
    };
    setClubs([...clubs, newClub]);
    logAudit(L('مسؤول المنظومة', 'Admin'), `${L('تسجيل جهة جديدة ', 'New entity ')}${id}`);
    showToast(L('تم التسجيل — بانتظار الاعتماد', 'Registered — pending accreditation'));
    setName('');
    setPhone('');
    setMgr('');
    setLicNo('');
    setOk(false);
  };

  const toggleStatus = (i) => {
    const updated = [...clubs];
    updated[i].st = updated[i].st === 'on' ? 'off' : 'on';
    setClubs(updated);
  };

  const removeClub = (i) => {
    const updated = clubs.filter((_, idx) => idx !== i);
    setClubs(updated);
    showToast(L('تم حذف الجهة من السجل', 'Entity removed from registry'));
  };

  const filteredClubs = clubs.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const gName = (isRTL ? c.gov : GOV_EN[c.gov] || c.gov).toLowerCase();
    return c.n.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || gName.includes(q);
  });

  const activeCount = clubs.filter(c => c.st === 'on').length;
  const pendingCount = clubs.filter(c => c.st === 'pend').length;
  const totalAthletes = clubs.reduce((acc, c) => acc + (c.players || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <Building2 size={13} />
            {L('إدارة الكيانات الرياضية', 'Entity Management')}
          </span>
          <h1>{L('تسجيل واعتماد الأندية والأكاديميات الرياضية', 'Club & Sports Academy Accreditation')}</h1>
          <p>
            {L(
              'تسجيل الهيئات الرياضية المعتمدة، ربط مسؤولي السجلات الطبية، وضبط صلاحيات الاطلاع وفق قانون 151/2020',
              'Accredit verified athletic organizations, link medical-records officers, and govern access under Law 151/2020'
            )}
          </p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="g4" style={{ marginBottom: '10px' }}>
        <KPICard
          value={clubs.length}
          label={L('إجمالي الجهات المسجلة', 'Total Registered Entities')}
          type="brand"
          icon={<Building2 size={20} />}
        />
        <KPICard
          value={activeCount}
          label={L('جهات معتمدة ونشطة', 'Active Accredited')}
          type="emerald"
          icon={<CheckCircle2 size={20} />}
        />
        <KPICard
          value={pendingCount}
          label={L('قيد المراجعة والاعتماد', 'Pending Accreditation')}
          type="warning"
          icon={<Clock size={20} />}
        />
        <KPICard
          value={totalAthletes}
          label={L('إجمالي الرياضيين المقيدين', 'Enrolled Athletes')}
          type="medical"
          icon={<Users size={20} />}
        />
      </div>

      <div className="g2 reg" style={{ gap: '20px' }}>
        {/* Form Card */}
        <div className="card" style={{ alignSelf: 'start', padding: '22px 20px', borderRadius: '16px' }}>
          <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand)', fontSize: '16px' }}>
            <span className="d"></span>
            {L('تسجيل نادٍ أو أكاديمية جديدة', 'New Club / Academy Registration')}
          </h3>

          <label className="f">
            <span>{L('الاسم الرسمي للهيئة *', 'Official entity name *')}</span>
            <input
              id="o_n"
              placeholder={L('مثال: نادي المستقبل الرياضي', 'e.g. Al-Mostakbal Sports Club')}
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
              <span>{L('هاتف التواصل الرسمي', 'Official phone')}</span>
              <input
                id="o_p"
                dir="ltr"
                placeholder="01xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>

          <div className="g2" style={{ gap: '12px' }}>
            <label className="f">
              <span>{L('نوع الجهة', 'Entity type')}</span>
              <select id="o_t" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="نادي">{L('نادي رياضي', 'Sports Club')}</option>
                <option value="أكاديمية">{L('أكاديمية رياضية', 'Sports Academy')}</option>
                <option value="مركز شباب">{L('مركز شباب', 'Youth Center')}</option>
                <option value="اتحاد">{L('اتحاد رياضي', 'Sports Federation')}</option>
              </select>
            </label>
            <label className="f">
              <span>{L('رقم الإشهار / الترخيص', 'Licence / registration no.')}</span>
              <input 
                dir="ltr" 
                placeholder="REG-2026-XXXX" 
                value={licNo}
                onChange={(e) => setLicNo(e.target.value)}
              />
            </label>
          </div>

          <label className="f">
            <span>{L('مسؤول السجلات الطبية المعين', 'Medical-records officer')}</span>
            <input
              id="o_m"
              placeholder={L('الاسم الثلاثي أو الرباعي للمسؤول', 'Full name of medical coordinator')}
              value={mgr}
              onChange={(e) => setMgr(e.target.value)}
            />
          </label>

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
                  'أقر بصحة البيانات المقدمة وبالالتزام الكامل بضوابط الخصوصية وقانون حماية البيانات الشخصية رقم 151 لسنة 2020.',
                  'I certify the data accuracy and full compliance with privacy safeguards under Law 151/2020.'
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
            {L('تسجيل وإرسال للاعتماد الرسمي', 'Register & Submit for Accreditation')}
          </button>
        </div>

        {/* Current Registry Card */}
        <div className="card" style={{ padding: '22px 20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand)', fontSize: '16px' }}>
              <span className="d"></span>
              {L('سجل الهيئات والأندية المعتمدة', 'Accredited Entities Registry')}
              <span className="tag ti" style={{ fontWeight: 800 }}>{clubs.length}</span>
            </h3>

            {/* Quick Search */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={15} style={{ position: 'absolute', top: '10px', [isRTL ? 'right' : 'left']: '10px', color: 'var(--muted)' }} />
              <input
                type="text"
                placeholder={L('بحث بالاسم أو الكود…', 'Search name or code…')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '7px 12px',
                  [isRTL ? 'paddingRight' : 'paddingLeft']: '32px',
                  fontSize: '12.5px',
                  borderRadius: '8px'
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="t">
              <thead>
                <tr>
                  <th>{L('الكود', 'Code')}</th>
                  <th>{L('اسم الجهة والمسؤول', 'Entity & Officer')}</th>
                  <th>{L('المحافظة', 'Governorate')}</th>
                  <th>{L('النوع', 'Type')}</th>
                  <th>{L('اللاعبون', 'Players')}</th>
                  <th>{L('حالة الاعتماد', 'Status')}</th>
                  <th style={{ textAlign: 'center' }}>{L('إجراءات', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredClubs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                      {L('لا توجد هيئات مطابقة للبحث', 'No entities matching search criteria')}
                    </td>
                  </tr>
                ) : (
                  filteredClubs.map((r, i) => (
                    <tr key={r.id}>
                      <td className="mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>{r.id}</td>
                      <td>
                        <b style={{ color: 'var(--brand)', fontSize: '13.5px' }}>{r.n}</b>
                        <br />
                        <span className="mut" style={{ fontSize: '11.5px' }}>
                          {L('مسؤول الملفات: ', 'Officer: ')}{r.mgr}
                        </span>
                      </td>
                      <td style={{ fontSize: '12.5px' }}>{isRTL ? r.gov : GOV_EN[r.gov] || r.gov}</td>
                      <td>
                        <span className="tag ti" style={{ fontSize: '11.5px' }}>{r.type}</span>
                      </td>
                      <td className="num" style={{ fontWeight: 800, color: 'var(--brand)' }}>{r.players}</td>
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
                          onClick={() => removeClub(i)}
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
