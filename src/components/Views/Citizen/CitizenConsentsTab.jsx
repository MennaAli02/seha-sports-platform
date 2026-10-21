import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useSeha } from '../../../context/SehaContext';
import { StatusTag } from '../../Common/StatusTag';
import {
  ShieldCheck,
  KeyRound,
  Trash2,
  CheckCircle2,
  Lock,
  History,
  FileCheck,
  Send
} from 'lucide-react';

export const CitizenConsentsTab = () => {
  const { isRTL, L } = useLanguage();
  const {
    players,
    selectedPlayerIndex,
    clubs,
    cfg,
    consents,
    setConsents,
    navigate,
    logAudit,
    showToast
  } = useSeha();

  const p = players[selectedPlayerIndex] || players[0];

  const [targetEntity, setTargetEntity] = useState(clubs[0]?.n || 'نادي المستقبل الرياضي');
  const [selectedScope, setSelectedScope] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [agreedToLaw, setAgreedToLaw] = useState(false);

  // Sample access audit log for citizen transparency
  const [accessAudit] = useState([
    {
      id: 'a-1',
      time: '10:31',
      date: 'اليوم',
      dateEn: 'Today',
      entity: 'نادي المستقبل الرياضي',
      entityEn: 'Al-Mostakbal Sports Club',
      scope: 'النتيجة والشهادة فقط',
      scopeEn: 'Outcome & certificate only',
      status: 'allowed'
    },
    {
      id: 'a-2',
      time: '09:12',
      date: 'أمس',
      dateEn: 'Yesterday',
      entity: 'الاتحاد المصري لكرة القدم',
      entityEn: 'Egyptian Football Association',
      scope: 'النتيجة والشهادة فقط',
      scopeEn: 'Outcome & certificate only',
      status: 'allowed'
    },
    {
      id: 'a-3',
      time: '14:20',
      date: '18/10/2026',
      dateEn: '18 Oct 2026',
      entity: 'أكاديمية النيل للسباحة',
      entityEn: 'Nile Swimming Academy',
      scope: 'مع تفاصيل طبية',
      scopeEn: 'With medical details',
      status: 'blocked'
    }
  ]);

  const handleGrantConsent = (e) => {
    e.preventDefault();
    if (!agreedToLaw) {
      showToast(L('الموافقة الصريحة مطلوبة قانونًا قبل إصدار التفويض', 'Explicit consent is legally required before authorization'));
      return;
    }

    const newConsent = {
      p: p,
      to: targetEntity,
      sc: selectedScope,
      du: selectedDuration,
      st: 'ok'
    };

    setConsents([newConsent, ...consents]);
    logAudit(L('مواطن', 'Citizen'), `${L('منح تفويض اطلاع لصالح: ', 'Granted access consent to: ')}${targetEntity}`);
    showToast(L('تم توقيع التفويض إلكترونيًا ومنح الصلاحية بنجاح', 'Access authorization digitally signed and issued'));
    setAgreedToLaw(false);
  };

  const handleRevokeConsent = (idx, entityName) => {
    const updated = [...consents];
    updated[idx].st = 'rej';
    setConsents(updated);
    logAudit(L('مواطن', 'Citizen'), `${L('سحب تفويض اطلاع من: ', 'Revoked access consent from: ')}${entityName}`);
    showToast(L('تم سحب التفويض فورًا وإنهاء حق الاطلاع', 'Authorization revoked and access terminated'));
  };

  return (
    <div className="page-stack">
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('بوابة المواطن — حوكمة البيانات والخصوصية', 'Citizen Portal — Privacy Governance')}
          </span>
          <h1>{L('إدارة موافقات وتفويضات الاطلاع', 'Medical Data Consents & Privacy Controls')}</h1>
          <p>
            {L(
              'طبقًا لقانون حماية البيانات الشخصية رقم 151 لسنة 2020 — كل تفويض محدد النطاق والمدة، وقابل للسحب الفوري في أي لحظة',
              'Per Personal Data Protection Law 151/2020 — access is strictly governed by explicit, scoped, time-bound, and revocable consent'
            )}
          </p>
        </div>
        <div className="act np">
          <button
            type="button"
            className="btn sec"
            onClick={() => showToast(L('سجل التدقيق محدّث وموثق', 'Audit log is verified'))}
          >
            <History className="w-4 h-4" />
            {L('سجل التدقيق الأمني', 'Security audit log')}
          </button>
        </div>
      </div>

      {/* Law 151 Notice */}
      <div className="nt ok flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
        <div className="text-xs">
          <b className="block mb-0.5">
            {L('مبادئ حماية بيانات الرياضيين (قانون 151 لسنة 2020):', 'Athlete Data Protection Principles (Law 151/2020):')}
          </b>
          <span>
            {L(
              'كل تفويض محدد بنطاق دقيق ومدة محددة. يرى النادي نتيجة اللياقة فقط دون التشخيصات الإكلينيكية، ويمكنك سحب التفويض في أي وقت بضغطة زر واحدة.',
              'Every authorization is strictly scoped and time-bound. Clubs view outcome only; you can revoke access anytime with one click.'
            )}
          </span>
        </div>
      </div>

      {/* Main Grid: Grant New Access & Active Consents */}
      <div className="g2">
        {/* Form: Grant New Authorization */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="m-0">
              <span className="d"></span>
              {L('منح تفويض اطلاع جديد', 'Grant New Access Authorization')}
            </h3>
            <span className="text-xs font-bold text-[var(--primary)] bg-[var(--primary-50)] px-2 py-0.5 rounded">
              {L('قانون 151/2020', 'Law 151/2020')}
            </span>
          </div>

          <form onSubmit={handleGrantConsent} className="space-y-3">
            <label className="f">
              <span>{L('الرياضي / صاحب الملف الطبي', 'Athlete / Record Owner')}</span>
              <input
                type="text"
                value={`${p.name} (${p.age < 18 ? `${L('بموافقة ولي الأمر: ', 'Guardian: ')}${p.gd}` : L('بالغ', 'Adult')})`}
                disabled
                className="bg-[var(--bg)]/50 cursor-not-allowed"
              />
            </label>

            <label className="f">
              <span>{L('الجهة المراد تفويضها (النادي / الاتحاد / الأكاديمية) *', 'Requesting Entity (Club / Federation / Academy) *')}</span>
              <input
                type="text"
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                placeholder={L('اسم النادي أو الاتحاد الرياضي...', 'Club or sports federation name...')}
                required
              />
            </label>

            <div className="g2">
              <label className="f">
                <span>{L('نطاق الاطلاع المصرح به *', 'Access Scope *')}</span>
                <select
                  value={selectedScope}
                  onChange={(e) => setSelectedScope(Number(e.target.value))}
                >
                  {cfg.scopes.map((s, idx) => (
                    <option key={idx} value={idx}>
                      {isRTL ? s[0] : s[1]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="f">
                <span>{L('مدة سريان التفويض *', 'Authorization Duration *')}</span>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(Number(e.target.value))}
                >
                  {cfg.durs.map((d, idx) => (
                    <option key={idx} value={idx}>
                      {isRTL ? d[0] : d[1]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 text-xs my-[10px]">
              <b className="block mb-0.5 text-[var(--ink)]">
                {selectedScope === 0
                  ? L('نطاق الخصوصية العالي (مُوصى به):', 'High-Privacy Scope (Recommended):')
                  : L('نطاق التفاصيل الطبية:', 'Medical Details Scope:')}
              </b>
              <span className="mut leading-relaxed block">
                {selectedScope === 0
                  ? L('يرى النادي حالة الشهادة فقط («لائق» أو «منتهية») دون إظهار أي تشخيص مرضي.', 'The entity sees only clearance status (Fit / Expired) without clinical diagnoses.')
                  : L('يُسمح للمدير الطبي للنادي بالاطلاع على الفحوصات الإكلينيكية المكتملة لدواعي السلامة.', 'Allows team medical director to review clinical tests for athlete safety.')}
              </span>
            </div>

            <label className="chk">
              <input
                type="checkbox"
                checked={agreedToLaw}
                onChange={(e) => setAgreedToLaw(e.target.checked)}
              />
              <span className="text-xs font-semibold text-[var(--primary-700)]">
                {L('أوافق صراحةً على تفويض الجهة المذكورة أعلاه وفق النطاق والمدة المحددين (قانون 151/2020).', 'I explicitly authorize the specified entity within the stated scope and duration (Law 151/2020).')}
              </span>
            </label>

            <button
              type="submit"
              className="btn w-full justify-center"
            >
              <Send className="w-4 h-4" />
              <span>{L('توقيع إلكتروني وإصدار التفويض', 'e-Sign & Issue Authorization')}</span>
            </button>
          </form>
        </div>

        {/* List: Active Consents */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="m-0">
              <span className="d"></span>
              {L('سجل التفويضات والموافقات السارية', 'Active Authorizations & Consents')}
            </h3>
            <span className="mut text-xs">{consents.length} {L('سجلات', 'records')}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="t">
              <thead>
                <tr>
                  <th>{L('الجهة المفوضة', 'Authorized Entity')}</th>
                  <th>{L('النطاق والمدة', 'Scope & Duration')}</th>
                  <th>{L('الحالة', 'Status')}</th>
                  <th>{L('إجراء', 'Action')}</th>
                </tr>
              </thead>
              <tbody>
                {consents.map((c, idx) => {
                  const isActive = c.st === 'ok';
                  return (
                    <tr key={idx}>
                      <td><b>{c.to}</b></td>
                      <td className="text-xs mut">
                        {isRTL ? cfg.scopes[c.sc]?.[0] : cfg.scopes[c.sc]?.[1]}
                        <br />
                        <b>{isRTL ? cfg.durs[c.du]?.[0] : cfg.durs[c.du]?.[1]}</b>
                      </td>
                      <td>
                        <StatusTag type="consent" status={c.st} />
                      </td>
                      <td>
                        {isActive && (
                          <button
                            type="button"
                            className="btn ghost sm text-red-600 hover:text-red-700"
                            onClick={() => handleRevokeConsent(idx, c.to)}
                            title={L('سحب التفويض فورًا', 'Revoke access now')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{L('سحب', 'Revoke')}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="nt text-xs mt-[10px] flex items-center gap-2 mb-0">
            <Lock className="w-4 h-4 text-[var(--primary)] shrink-0" />
            <span>
              {L(
                'عند سحب التفويض، يتم حجب البيانات في اللحظة ذاتها وتظهر الشاشة للجهة المستعلمة بعدم وجود تفويض صالح.',
                'Upon revoking, access is terminated immediately and the entity sees “No Active Consent”.'
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Access Audit Trail (Who Viewed What and When) */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="m-0">
            <span className="d"></span>
            {L('سجل الوصول والتدقيق — من اطلع على بياناتك ومتى؟', 'Access Audit Log — Who Viewed Your Record & When?')}
          </h3>
          <span className="mut text-xs font-mono">
            {L('سجل تدقيق غير قابل للتعديل', 'Immutable Audit Trail')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="t">
            <thead>
              <tr>
                <th>{L('الوقت والتاريخ', 'Timestamp')}</th>
                <th>{L('الجهة التي اطلعت', 'Requesting Entity')}</th>
                <th>{L('نطاق الاطلاع المطلوب', 'Accessed Scope')}</th>
                <th>{L('نتيجة الفحص الأمني', 'Security Verdict')}</th>
              </tr>
            </thead>
            <tbody>
              {accessAudit.map((log) => (
                <tr key={log.id}>
                  <td className="mono text-xs">
                    <span className="font-bold text-[var(--ink)]">{log.time}</span>
                    <span className="mut mx-1">({isRTL ? log.date : log.dateEn})</span>
                  </td>
                  <td>
                    <b>{isRTL ? log.entity : log.entityEn}</b>
                  </td>
                  <td className="text-xs mut">
                    {isRTL ? log.scope : log.scopeEn}
                  </td>
                  <td>
                    {log.status === 'allowed' ? (
                      <span className="tag tg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {L('مصرح به (ساري)', 'Authorized')}
                      </span>
                    ) : (
                      <span className="tag tb">
                        <Lock className="w-3.5 h-3.5" />
                        {L('محجوب (تم الرفض)', 'Blocked')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
