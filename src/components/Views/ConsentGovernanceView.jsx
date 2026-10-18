import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { ShieldCheck, UserCheck, KeyRound, AlertCircle, FileCheck, Trash2 } from 'lucide-react';
import { StatusTag } from '../Common/StatusTag';

export const ConsentGovernanceView = () => {
  const { isRTL, L } = useLanguage();
  const { players, selectedPlayerIndex, clubs, consents, setConsents, cfg, showToast, logAudit } = useSeha();

  const [consentAgreed, setConsentAgreed] = useState(false);

  const handleSend = () => {
    if (consentAgreed) {
      logAudit(L('مواطن', 'Citizen'), L('منح موافقة اطلاع — 30 يومًا', 'Access consent granted — 30 days'));
      showToast(L('تم توقيع الموافقة وإرسالها إلكترونيًا', 'Consent signed and transmitted successfully'));
      setConsentAgreed(false);
    } else {
      showToast(L('الموافقة الصريحة مطلوبة قانونًا قبل المتابعة', 'Explicit consent is legally required before proceeding'));
    }
  };

  const handleRevoke = (i) => {
    const updated = [...consents];
    updated[i].st = 'rej';
    setConsents(updated);
    logAudit(L('مواطن', 'Citizen'), L('سحب موافقة اطلاع', 'Consent revoked'));
    showToast(L('تم سحب الموافقة وإلغاء صلاحية الوصول فورًا', 'Consent revoked and access terminated'));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('حوكمة البيانات والامتثال القانوني', 'Data Governance & Legal Compliance')}
          </span>
          <h1>{L('إدارة موافقات وصلاحيات الاطلاع على البيانات', 'Access Consent Management & Privacy Controls')}</h1>
          <p>
            {L(
              'تطبيقًا لقانون حماية البيانات الشخصية المصري رقم 151 لسنة 2020 — لا يُسمح لأي نادٍ أو جهة بالاطلاع إلا بموافقة صريحة ومحددة زمنيًا وقابلة للسحب في أي وقت',
              'Per Egyptian Personal Data Protection Law 151/2020 — access is strictly governed by explicit, scoped, time-bound, and revocable consent'
            )}
          </p>
        </div>
      </div>

      <div className="g2">
        {/* Left card: Grant new access */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3>
              <span className="d"></span>
              {L('منح تفويض اطلاع جديد', 'Grant new access authorization')}
            </h3>
            <span className="text-xs font-semibold text-[var(--primary-700)] bg-[var(--primary-50)] px-2.5 py-1 rounded-full">
              {L('قانون 151/2020', 'Law 151/2020')}
            </span>
          </div>

          <label className="f">
            <span>{L('الرياضي / صاحب الملف الطبي', 'Athlete / record owner')}</span>
            <select defaultValue={selectedPlayerIndex}>
              {players.slice(0, 10).map((x, i) => (
                <option key={x.id} value={i}>
                  {x.name}{x.age < 18 ? ` — (${L('يتطلب موافقة ولي الأمر', 'guardian consent required')})` : ''}
                </option>
              ))}
            </select>
          </label>

          <label className="f">
            <span>{L('الجهة الطالبة للاطلاع (النادي / الاتحاد / الأكاديمية)', 'Requesting entity (Club / Federation / Academy)')}</span>
            <input defaultValue={clubs[0]?.n || 'نادي المستقبل الرياضي'} />
          </label>

          <div className="g2">
            <label className="f">
              <span>{L('نطاق الاطلاع المصرح به', 'Authorized access scope')}</span>
              <select>
                {cfg.scopes.map((s, idx) => (
                  <option key={idx}>{L(s[0], s[1])}</option>
                ))}
              </select>
            </label>
            <label className="f">
              <span>{L('مدة صلاحية التفويض', 'Consent validity duration')}</span>
              <select>
                {cfg.durs.map((d, idx) => (
                  <option key={idx}>{L(d[0], d[1])}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="bg-[var(--bg)] p-3 rounded-lg border border-[var(--line)] my-3">
            <label className="chk m-0">
              <input
                type="checkbox"
                id="cs_a"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
              />
              <span className="text-xs font-medium text-[var(--ink)] leading-relaxed">
                {L(
                  'أوافق صراحةً وبكامل الأهلية على منح الجهة المذكورة صلاحية الاطلاع على بيانات الشهادة وفق النطاق والمدة المحددين أعلاه، مع علمي بحقي في سحب الموافقة في أي وقت.',
                  'I explicitly consent to granting the requested entity access to certificate data within the stated scope and duration, acknowledging my legal right to revoke this consent at any time.'
                )}
              </span>
            </label>
          </div>

          <button className="btn w-full justify-center py-2.5 mt-2" onClick={handleSend}>
            <FileCheck className="w-4 h-4" />
            {L('توقيع إلكتروني واعتماد التفويض', 'e-Sign & Issue Consent')}
          </button>
        </div>

        {/* Right card: Active consents */}
        <div className="card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3>
                <span className="d"></span>
                {L('سجل التفويضات والموافقات السارية', 'Active Authorizations & Consents')}
              </h3>
              <span className="text-xs font-mono text-[var(--muted)]">
                {consents.length} {L('سجل', 'records')}
              </span>
            </div>

            <table className="t">
              <thead>
                <tr>
                  <th>{L('الجهة المفوضة', 'Authorized entity')}</th>
                  <th>{L('النطاق والمدة', 'Scope & duration')}</th>
                  <th>{L('الحالة', 'Status')}</th>
                  <th className="text-end">{L('الإجراء', 'Action')}</th>
                </tr>
              </thead>
              <tbody>
                {consents.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <b className="text-xs text-[var(--ink)] block">{c.to}</b>
                    </td>
                    <td className="mut text-xs">
                      {L(cfg.scopes[c.sc]?.[0], cfg.scopes[c.sc]?.[1])} · {L(cfg.durs[c.du]?.[0], cfg.durs[c.du]?.[1])}
                    </td>
                    <td>
                      <StatusTag type="consent" status={c.st} />
                    </td>
                    <td className="text-end">
                      {c.st === 'ok' ? (
                        <button
                          className="btn ghost sm text-xs text-[var(--danger-dark)] hover:bg-[var(--danger-bg)] border-[var(--danger)]/30"
                          onClick={() => handleRevoke(i)}
                          title={L('سحب الصلاحية فورًا', 'Revoke consent')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {L('سحب', 'Revoke')}
                        </button>
                      ) : (
                        <span className="text-[11px] text-[var(--muted)] font-medium">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="nt flex items-start gap-2" style={{ marginTop: '20px' }}>
            <ShieldCheck className="w-4 h-4 text-[var(--primary)] flex-none mt-0.5" />
            <span className="text-xs leading-relaxed">
              {L(
                'سجل التدقيق الشامل: يتم تدوين هوية كل من اطلع على أي بيان وتوقيت الاطلاع في سجل غير قابل للتعديل ومتاح للاعب وولي الأمر عبر تطبيق المواطن.',
                'Comprehensive Audit: Every data access event is logged in an immutable audit trail fully visible to the athlete and guardian on the Citizen App.'
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
