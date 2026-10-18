import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { IC } from '../../data/icons';
import { ShieldCheck, Search, ShieldAlert, CheckCircle2, XCircle, ArrowUpRight, Lock } from 'lucide-react';

export const PublicVerificationView = () => {
  const { isRTL, L } = useLanguage();
  const { verifyQuery, setVerifyQuery, players, hosps, setSelectedCertIndex, navigate } = useSeha();

  const [vq, setVq] = useState(verifyQuery || 'SH-26-004517');
  const [verifyR, setVerifyR] = useState(() => {
    const code = (verifyQuery || 'SH-26-004517').trim();
    const ok = /^SH-\d\d-\d+$/.test(code);
    return { ok, c: code };
  });

  const doV = (directVal) => {
    const c = (directVal !== undefined ? directVal : vq).trim();
    setVerifyQuery(c);
    const ok = /^SH-\d\d-\d+$/.test(c);
    setVerifyR({ ok, c });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('بوابة الثقة العامة والأمان', 'Public Trust & Verification Portal')}
          </span>
          <h1>{L('التحقق العام المباشر من صحة الشهادات الطبية', 'Instant Public Certificate Verification')}</h1>
          <p>
            {L(
              'تتيح لأي نادٍ، اتحاد رياضي، حكم، أو منظم مسابقات التحقق الفوري من صحة وموثوقية الشهادة الطبية دون الحاجة إلى مكاتبات ورقية',
              'Enables sports clubs, federations, referees, and event organizers to instantly confirm certificate authenticity without manual correspondence'
            )}
          </p>
        </div>
      </div>

      <div className="card max-w-2xl mx-auto text-center p-6 sm:p-8 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-[var(--primary-50)] text-[var(--primary)] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)] mb-1">
          {L('أدخل رقم الشهادة أو امسح الرمز (QR)', 'Enter Certificate Number or Scan QR')}
        </h2>
        <p className="mut text-xs max-w-md mx-auto mb-5">
          {L('الصيغة المعتمدة للشهادات الصادرة تبدأ بـ SH متبوعة برقم العام ثم التسلسل الرقمي المعتمد', 'Official certificate format begins with SH followed by year code and sequence')}
        </p>

        <div className="flex gap-2 justify-center max-w-md mx-auto">
          <input
            id="vq"
            type="text"
            dir="ltr"
            className="mono font-bold text-center text-sm"
            placeholder="SH-26-004517"
            value={vq}
            onChange={(e) => setVq(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doV()}
          />
          <button className="btn px-6 flex-none" onClick={() => doV()}>
            <Search className="w-4 h-4" />
            {L('تحقق الآن', 'Verify now')}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5" style={{ marginTop: '20px', marginBottom: '24px' }}>
          <button
            className="chip text-xs"
            onClick={() => {
              setVq('SH-26-004517');
              doV('SH-26-004517');
            }}
          >
            {L('مثال تجريبي: شهادة سارية وموثقة', 'Sample: valid certificate')}
          </button>
          <button
            className="chip text-xs text-[var(--danger-dark)] border-[var(--danger)]/30"
            onClick={() => {
              setVq('XX-99-0000');
              doV('XX-99-0000');
            }}
          >
            {L('مثال تجريبي: رقم غير صحيح / مزور', 'Sample: forged/invalid')}
          </button>
        </div>

        {verifyR && (
          <div
            className={`text-start rounded-xl p-5 border transition-all ${
              verifyR.ok
                ? 'border-[var(--success)]/40 bg-[var(--success-bg)]'
                : 'border-[var(--danger)]/40 bg-[var(--danger-bg)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {verifyR.ok ? (
                <CheckCircle2 className="w-6 h-6 text-[var(--success-dark)] flex-none" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-[var(--danger-dark)] flex-none" />
              )}
              <h3 className={`m-0 text-base font-bold ${verifyR.ok ? 'text-[var(--success-dark)]' : 'text-[var(--danger-dark)]'}`}>
                {verifyR.ok
                  ? L('شهادة طبية رياضية سارية وموثقة بالسجل الوطني', 'Valid & Authenticated Sports Medical Certificate')
                  : L('الشهادة غير مطابقة — غير موجودة بالسجل الرسمي', 'Certificate Not Found in Official Registry')}
              </h3>
            </div>

            {verifyR.ok ? (
              <>
                <table className="t bg-[var(--card)] rounded-lg overflow-hidden border border-[var(--line)]">
                  <tbody>
                    <tr>
                      <td className="mut font-semibold w-1/3">{L('رقم الشهادة الموحد', 'Certificate no.')}</td>
                      <td className="mono font-bold text-[var(--primary)]">{verifyR.c}</td>
                    </tr>
                    <tr>
                      <td className="mut font-semibold">{L('اسم الرياضي', 'Athlete name')}</td>
                      <td><b>{players[0].name}</b></td>
                    </tr>
                    <tr>
                      <td className="mut font-semibold">{L('حالة اللياقة المعتمدة', 'Clearance status')}</td>
                      <td>
                        <span className="tag tg font-bold">{L('لائق طبيًا للمنافسات', 'Medically Fit')}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="mut font-semibold">{L('صالحة حتى تاريخ', 'Valid until')}</td>
                      <td className="font-mono font-semibold" dir="ltr">14/10/2027</td>
                    </tr>
                    <tr>
                      <td className="mut font-semibold">{L('جهة الفحص والإصدار', 'Issuing facility')}</td>
                      <td className="font-medium">{hosps[0].n}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-[var(--line)] flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <Lock className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>
                      {L(
                        'تُعرض حالة اللياقة والصلاحية فقط حمايةً للخصوصية وسرية الملف الطبي (قانون 151/2020).',
                        'Clearance status only — confidential clinical data protected per Law 151/2020.'
                      )}
                    </span>
                  </div>
                  <button
                    className="btn ghost sm text-xs"
                    onClick={() => {
                      setSelectedCertIndex(0);
                      navigate('cert');
                    }}
                  >
                    {L('عرض تفاصيل الوثيقة (بصلاحية)', 'View full document')}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-3 text-xs text-[var(--danger-dark)] leading-relaxed">
                <p className="font-semibold mb-1">
                  {L(
                    'تنبيه: هذا الرقم لا يطابق أي شهادة صادرة عن منظومة «صحة» الرسمية.',
                    'Warning: This certificate number does not match any official record issued by Seha.'
                  )}
                </p>
                <p className="opacity-80">
                  {L(
                    'أي مستند يحمل هذا الرقم يُعد غير معتمد ولا يعتد به في المسابقات الرياضية الرسمية.',
                    'Any document bearing this number is unauthorized and void for official sports competitions.'
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
