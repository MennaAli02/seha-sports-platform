import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useSeha } from '../../../context/SehaContext';
import { QRCodeSVG } from '../../Common/QRCodeSVG';
import { StatusTag } from '../../Common/StatusTag';
import { KPICard } from '../../Common/KPICard';
import { fmtDate } from '../../../data/mockData';
import {
  Award,
  ExternalLink,
  Download,
  CheckCircle2,
  Clock,
  Copy,
  Activity,
  FileText,
  Sparkles,
  X
} from 'lucide-react';

export const CitizenCertificatesTab = () => {
  const { isRTL, L } = useLanguage();
  const {
    players,
    selectedPlayerIndex,
    hosps,
    clubs,
    cfg,
    navigate,
    showToast,
    SP_EN,
    GOV_EN
  } = useSeha();

  const p = players[selectedPlayerIndex] || players[0];
  const h = hosps[p.hs] || hosps[0];
  const c = clubs[p.cl] || clubs[0];
  const lv = cfg.levels[p.lv - 1] || cfg.levels[0];

  const [selectedPastCert, setSelectedPastCert] = useState(null);

  const pastCertificates = [
    {
      id: 'pc-1',
      ct: 'SH-25-000912',
      season: '2025 / 2026',
      issued: '15/10/2025',
      expired: '14/10/2026',
      sport: cfg.sports[p.sp] || 'كرة القدم',
      level: 2,
      levelName: 'المستوى الثاني — الأكاديميات',
      levelNameEn: 'Level 2 — Academies',
      hosp: 'مستشفى النيل بدر',
      hospEn: 'Nile Badr Hospital',
      result: 'لائق',
      resultEn: 'Fit',
      st: 'exp'
    },
    {
      id: 'pc-2',
      ct: 'SH-24-003301',
      season: '2024 / 2025',
      issued: '20/10/2024',
      expired: '19/10/2025',
      sport: cfg.sports[p.sp] || 'كرة القدم',
      level: 2,
      levelName: 'المستوى الثاني — الأكاديميات',
      levelNameEn: 'Level 2 — Academies',
      hosp: 'مستشفى هليوبوليس التخصصي',
      hospEn: 'Heliopolis Specialized Hospital',
      result: 'لائق',
      resultEn: 'Fit',
      st: 'exp'
    }
  ];

  const handleCopyCode = (code) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    }
    showToast(L('تم نسخ رقم الشهادة بنجاح', 'Certificate number copied to clipboard'));
  };

  return (
    <div className="page-stack">
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('بوابة المواطن — الشهادات الطبية الرقمية', 'Citizen Portal — Medical Certificates')}
          </span>
          <h1>{L('شهادات اللياقة الطبية للرياضي', 'Athlete Medical Fitness Certificates')}</h1>
          <p>
            {L(
              'شهادات اللياقة الصادرة والموقعة إلكترونيًا والموثقة برمز QR الموحد والمعتمدة رسميًا لدى كافة الاتحادات',
              'Officially issued, digitally e-signed, and QR-verified medical certificates accredited across federations'
            )}
          </p>
        </div>

        <div className="act np">
          <button
            type="button"
            className="btn sec"
            onClick={() => showToast(L('تم تنزيل النسخة المعتمدة بصيغة PDF', 'PDF downloaded successfully'))}
          >
            <Download className="w-4 h-4" />
            {L('تحميل PDF', 'Download PDF')}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate('cert', { certIndex: selectedPlayerIndex })}
          >
            <ExternalLink className="w-4 h-4" />
            {L('فتح النموذج الرسمي الكامل A4', 'Open Full A4 Certificate')}
          </button>
        </div>
      </div>

      {/* 4 KPIs matching other screens */}
      <div className="g4">
        <KPICard
          variant="brand"
          value={3}
          label={L('إجمالي الشهادات الصادرة', 'Total Certificates')}
          icon={Award}
          subtext={L('سجلات الرياضي بالمنظومة', 'Athlete platform records')}
        />
        <KPICard
          variant="emerald"
          value={1}
          label={L('شهادات سارية (لائق)', 'Valid (Fit)')}
          icon={CheckCircle2}
          subtext={L('صالحة حتى 14/10/2027', 'Valid until 14/10/2027')}
        />
        <KPICard
          variant="danger"
          value={2}
          label={L('شهادات منتهية الصلاحية', 'Expired Certificates')}
          icon={Clock}
          subtext={L('مواسم سابقة مؤرشفة', 'Past seasons archive')}
        />
        <KPICard
          variant="teal"
          value={p.lv}
          label={L('الكود الطبي المعتمد', 'Accredited Medical Level')}
          icon={Activity}
          subtext={isRTL ? lv.ar : lv.en}
        />
      </div>

      {/* Primary Certificate Hero Showcase */}
      <div className="card">
        <div className="flex items-center justify-between mb-[10px]">
          <h3>
            <span className="d"></span>
            {L('الشهادة الطبية الرقمية المعتمدة (السارية)', 'Accredited Sports Medical Certificate (Current)')}
          </h3>
          <div className="flex items-center gap-2">
            <span className="mono text-xs font-bold text-[var(--primary)]">{p.ct}</span>
            <StatusTag status={p.st} />
          </div>
        </div>

        {/* Demographics Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] text-xs my-[10px]">
          <div className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40">
            <span className="mut block">{L('اسم الرياضي:', 'Athlete Name:')}</span>
            <b className="text-[var(--ink)] text-sm">{p.name}</b>
          </div>
          <div className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40">
            <span className="mut block">{L('الرقم القومي:', 'National ID:')}</span>
            <b className="mono text-[var(--ink)]">{p.nid}</b>
          </div>
          <div className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40">
            <span className="mut block">{L('اللعبة المقيدة:', 'Sport:')}</span>
            <b className="text-[var(--ink)]">{isRTL ? cfg.sports[p.sp] : SP_EN[cfg.sports[p.sp]] || cfg.sports[p.sp]}</b>
          </div>
          <div className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40">
            <span className="mut block">{L('النادي / الأكاديمية:', 'Club / Academy:')}</span>
            <b className="text-[var(--ink)]">{isRTL ? c.n : c.nEn || c.n}</b>
          </div>
        </div>

        {/* Clinical Exams Table */}
        <table className="t mb-[10px]">
          <thead>
            <tr>
              <th>{L('الفحص الطبي', 'Clinical Examination')}</th>
              <th>{L('النتيجة الإكلينيكية', 'Finding')}</th>
              <th>{L('الحالة', 'Status')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{L('رسم القلب الكهربائي (Resting ECG)', 'Resting ECG')}</td>
              <td>{L('نظم جيبي طبيعي سليم', 'Normal sinus rhythm')}</td>
              <td><b className="text-[var(--success)]">{L('طبيعي', 'Normal')}</b></td>
            </tr>
            <tr>
              <td>{L('الموجات الصوتية على القلب (ECHO)', 'Echocardiography (ECHO)')}</td>
              <td>{L('وظائف الصمامات وعضلة القلب طبيعية', 'Normal valve function and ejection fraction')}</td>
              <td><b className="text-[var(--success)]">{L('طبيعي', 'Normal')}</b></td>
            </tr>
            <tr>
              <td>{L('صورة الدم الكاملة (CBC)', 'Complete Blood Count (CBC)')}</td>
              <td>{L('الهيموجلوبين ومؤشرات الدم بالحدود الطبيعية', 'Hemoglobin and blood parameters within normal range')}</td>
              <td><b className="text-[var(--success)]">{L('طبيعي', 'Normal')}</b></td>
            </tr>
            <tr>
              <td>{L('الكشف الإكلينيكي والباطني', 'Clinical & Internal Examination')}</td>
              <td>{L('ضغط الدم: ', 'BP: ')}{p.bp} · {L('النبض: ', 'HR: ')}{p.hr} bpm</td>
              <td><b className="text-[var(--success)]">{L('طبيعي', 'Normal')}</b></td>
            </tr>
          </tbody>
        </table>

        {/* Result banner & QR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 mt-[10px]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--success-bg)] text-[var(--success-dark)] flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="mut text-[11px] block">{L('القرار الطبي المعتمد:', 'Accredited Decision:')}</span>
              <b className="text-sm sm:text-base text-[var(--success-dark)]">
                {L('لائق طبيًا لممارسة النشاط الرياضي التنافسي دون قيود', 'Fit for competitive sport without restriction')}
              </b>
              <p className="mut text-xs mt-0.5">
                {L('جهة الإصدار: ', 'Issuer: ')}{isRTL ? h.n : h.nEn || h.n} · {L('صالحة حتى: ', 'Valid until: ')}<span className="mono">{fmtDate(p.exp, isRTL ? 'ar' : 'en')}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <QRCodeSVG seed={p.ct} size={76} />
            <div className="flex flex-col gap-[10px]">
              <button
                type="button"
                className="btn sm w-full justify-center"
                onClick={() => navigate('cert', { certIndex: selectedPlayerIndex })}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {L('فتح الشهادة A4', 'Open A4')}
              </button>
              <button
                type="button"
                className="btn sec sm w-full justify-center"
                onClick={() => showToast(L('تم تنزيل PDF', 'PDF downloaded'))}
              >
                <Download className="w-3.5 h-3.5" />
                {L('تحميل PDF', 'Download')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Certificates Archive */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="m-0">
            <span className="d"></span>
            {L('أرشيف وسجل الشهادات السابقة', 'Previous Certificates Archive')}
          </h3>
          <span className="mut text-xs">
            {pastCertificates.length} {L('شهادات سابقة', 'archived records')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="t">
            <thead>
              <tr>
                <th>{L('رقم الشهادة', 'Certificate #')}</th>
                <th>{L('الموسم الرياضي', 'Season')}</th>
                <th>{L('اللعبة والمستوى', 'Sport & Level')}</th>
                <th>{L('المستشفى المصدر', 'Issuing Facility')}</th>
                <th>{L('تاريخ الإصدار', 'Issued')}</th>
                <th>{L('تاريخ الانتهاء', 'Expired')}</th>
                <th>{L('الحالة', 'Status')}</th>
                <th>{L('إجراءات', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {pastCertificates.map((cert) => (
                <tr key={cert.id}>
                  <td className="mono font-bold text-[var(--primary)]">{cert.ct}</td>
                  <td><b>{cert.season}</b></td>
                  <td>
                    <div>{cert.sport}</div>
                    <span className="text-xs mut">{isRTL ? cert.levelName : cert.levelNameEn}</span>
                  </td>
                  <td>{isRTL ? cert.hosp : cert.hospEn}</td>
                  <td className="mono text-xs">{cert.issued}</td>
                  <td className="mono text-xs">{cert.expired}</td>
                  <td>
                    <StatusTag status={cert.st} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn ghost sm"
                      onClick={() => setSelectedPastCert(cert)}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {L('تفاصيل', 'Details')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legal & Regulatory Seal Notice */}
      <div className="nt ok flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
        <div className="text-xs">
          <b className="block mb-0.5">
            {L('حجية الشهادة الموحدة — قرار رئيس مجلس الوزراء 1642 لسنة 2024', 'Legal Standing — Decree 1642/2024')}
          </b>
          <span>
            {L(
              'الشهادة الطبية الرياضية الصادرة من منظومة «صحة» موثقة رقميًا ومعتمدة رسميًا. تكفي شهادة واحدة صالحة للمشاركة في كافة الألعاب الرياضية والاتحادات والأكاديميات الرياضية بمصر، ولا يُطلب إجراء كشوفات مكررة.',
              'Sports certificates issued by Seha are digitally authenticated and legally binding across all Egyptian sporting clubs, youth centers, and federations without redundant exams.'
            )}
          </span>
        </div>
      </div>

      {/* Past Certificate Inspection Modal */}
      {selectedPastCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--card)] w-full max-w-md rounded-2xl p-5 border border-[var(--line)] shadow-[var(--shadow-lg)] relative">
            <button
              onClick={() => setSelectedPastCert(null)}
              className="absolute top-3 inset-inline-end-3 p-1 rounded-full text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-50)]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-[var(--primary)]" />
              <b className="text-sm text-[var(--ink)] m-0">
                {L('تفاصيل الشهادة السابقة (أرشيف)', 'Archived Certificate Record')}
              </b>
            </div>

            <div className="p-3 rounded-lg border border-[var(--line)] bg-[var(--bg)]/50 space-y-1.5 text-xs mb-3">
              <div className="flex justify-between items-center py-0.5 border-b border-[var(--line)]">
                <span className="mut">{L('رقم الشهادة:', 'Certificate #:')}</span>
                <b className="mono font-bold text-[var(--primary)]">{selectedPastCert.ct}</b>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[var(--line)]">
                <span className="mut">{L('الموسم الرياضي:', 'Season:')}</span>
                <b className="text-[var(--ink)]">{selectedPastCert.season}</b>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[var(--line)]">
                <span className="mut">{L('المستشفى المصدر:', 'Facility:')}</span>
                <b className="text-[var(--ink)]">{isRTL ? selectedPastCert.hosp : selectedPastCert.hospEn}</b>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[var(--line)]">
                <span className="mut">{L('فترة الصلاحية:', 'Validity:')}</span>
                <span className="mono">{selectedPastCert.issued} — {selectedPastCert.expired}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="mut">{L('حالة الصلاحية الآن:', 'Current Status:')}</span>
                <span className="tag tgy">{L('منتهية الصلاحية', 'Expired')}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn sec sm"
                onClick={() => showToast(L('تم تنزيل النسخة المؤرشفة', 'Archived copy downloaded'))}
              >
                <Download className="w-3.5 h-3.5" />
                {L('تحميل نسخة PDF', 'Download PDF')}
              </button>
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => setSelectedPastCert(null)}
              >
                {L('إغلاق', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
