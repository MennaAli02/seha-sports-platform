import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useSeha } from '../../../context/SehaContext';
import { StatusTag } from '../../Common/StatusTag';
import { KPICard } from '../../Common/KPICard';
import { QRCodeSVG } from '../../Common/QRCodeSVG';
import { fmtDate } from '../../../data/mockData';
import {
  HeartPulse,
  Activity,
  Calendar,
  Building2,
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  X,
  Stethoscope,
  Sparkles,
  Award
} from 'lucide-react';

export const CitizenMedicalHistoryTab = () => {
  const { isRTL, L } = useLanguage();
  const {
    players,
    selectedPlayerIndex,
    hosps,
    cfg,
    navigate,
    showToast,
    userRole,
    SP_EN,
    GOV_EN
  } = useSeha();

  const p = players[selectedPlayerIndex] || players[0];
  const h = hosps[p.hs] || hosps[0];
  const lv = cfg.levels[p.lv - 1] || cfg.levels[0];

  const [selectedReport, setSelectedReport] = useState(null);
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Athlete clinical medical history records
  const rawHistory = p.medicalHistory || [
    {
      id: `MH-${p.id}-1`,
      date: '15/10/2026',
      dateEn: '15 Oct 2026',
      season: '2026 / 2027',
      level: p.lv || 2,
      levelNameAr: lv.ar,
      levelNameEn: lv.en,
      hospitalAr: isRTL ? h.n : h.nEn || h.n,
      hospitalEn: h.nEn || h.n,
      doctorAr: 'د. طارق محمود المنشاوي · استشاري طب القلب الرياضي',
      doctorEn: 'Dr. Tarek El-Menshawy · Sports Cardiology Consultant',
      status: p.st === 'cond' ? 'cond' : 'fit',
      statusLabelAr: p.st === 'cond' ? 'لائق بشروط' : 'لائق طبيًا للمنافسات',
      statusLabelEn: p.st === 'cond' ? 'Conditionally Fit' : 'Medically Fit for Sports',
      vitals: {
        bp: p.bp || '118/76',
        hr: p.hr || 68,
        bmi: '21.4',
        height: 168,
        weight: 60
      },
      tests: [
        { nameAr: 'الفحص السريري والباطني', nameEn: 'Clinical & Internal Exam', resultAr: 'سليم تمامًا دون علامات إجهاد أو لغط قلبي', resultEn: 'Normal clinical evaluation', normal: true },
        { nameAr: 'تخطيط رسم القلب بالراحة (ECG)', nameEn: 'Resting ECG', resultAr: 'نظم جيبي طبيعي سليم (Sinus Rhythm) - معدل طبيعي', resultEn: 'Normal Sinus Rhythm', normal: true },
        { nameAr: 'الموجات الصوتية للقلب (ECHO)', nameEn: 'Echocardiogram (ECHO)', resultAr: 'كفاءة العضلة 64% والصمامات طبيعية دون تضخم', resultEn: 'Normal EF 64%, no valvular disease', normal: true },
        { nameAr: 'تحليل صورة الدم الكاملة (CBC)', nameEn: 'Complete Blood Count (CBC)', resultAr: 'الهيموجلوبين 14.1 g/dL ومؤشرات الصفائح طبيعية', resultEn: 'Hemoglobin 14.1 g/dL, normal platelets', normal: true }
      ],
      notesAr: 'الرياضي يتمتع بلياقة بدنية وقلبية ممتازة ومؤهل للمشاركة الرياضية دون أي تحفظات طبية.',
      notesEn: 'The athlete displays optimal cardiovascular fitness and is fully cleared for athletic participation.',
      digitalSign: 'SHA256-CERT-SEHA-2026-CONFIRMED'
    },
    {
      id: `MH-${p.id}-2`,
      date: '10/10/2025',
      dateEn: '10 Oct 2025',
      season: '2025 / 2026',
      level: 2,
      levelNameAr: 'المستوى الثاني — الأكاديميات',
      levelNameEn: 'Level 2 — Academies',
      hospitalAr: 'مستشفى النيل بدر',
      hospitalEn: 'Nile Badr Hospital',
      doctorAr: 'د. سحر عبدالمجيد · أخصائي الطب الرياضي',
      doctorEn: 'Dr. Sahar Abdelmageed · Sports Medicine Specialist',
      status: 'fit',
      statusLabelAr: 'لائق طبيًا (مؤرشف)',
      statusLabelEn: 'Medically Fit (Archived)',
      vitals: {
        bp: '115/74',
        hr: 70,
        bmi: '20.8',
        height: 162,
        weight: 55
      },
      tests: [
        { nameAr: 'فحص القلب الإكلينيكي', nameEn: 'Cardiovascular Exam', resultAr: 'طبيعي وسليم', resultEn: 'Normal', normal: true },
        { nameAr: 'رسم القلب الكهربائي ECG', nameEn: 'Resting ECG', resultAr: 'طبيعي وسليم', resultEn: 'Normal', normal: true },
        { nameAr: 'تحاليل الدم الشاملة', nameEn: 'Blood Chemistry', resultAr: 'ضمن المعدلات الطبيعية', resultEn: 'Within normal limits', normal: true }
      ],
      notesAr: 'فحص دوري للموسم السابق — معتمد رسميًا ومؤرشف.',
      notesEn: 'Previous season annual check-up — officially certified and archived.',
      digitalSign: 'SHA256-CERT-SEHA-2025-ARCHIVED'
    }
  ];

  // Filtering
  const filteredHistory = rawHistory.filter((rec) => {
    if (filterLevel !== 'all' && String(rec.level) !== filterLevel) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchHosp = rec.hospitalAr.toLowerCase().includes(q) || rec.hospitalEn.toLowerCase().includes(q);
      const matchDoc = rec.doctorAr.toLowerCase().includes(q) || rec.doctorEn.toLowerCase().includes(q);
      if (!matchHosp && !matchDoc) return false;
    }
    return true;
  });

  return (
    <div className="page-stack">
      {/* Header */}
      <div className="ph">
        <div>
          <span className="lab flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-[var(--primary)]" />
            {L('بوابة المواطن — السجل الطبي والتاريخ الإكلينيكي', 'Citizen Portal — Clinical Medical History')}
          </span>
          <h1>{L('السجل الطبي وتاريخ الفحوصات المعتمدة', 'Medical Record History & Certified Reports')}</h1>
          <p>
            {L(
              'استعراض وتوثيق نتائج الفحوصات الإكلينيكية، رسم القلب، تحاليل الدم، والتقارير الطبية الرسمية الصادرة للرياضي',
              'Review authorized clinical examination reports, resting ECG, echocardiograms, blood work, and physician findings'
            )}
          </p>
        </div>

        <div className="act np">
          <button
            type="button"
            className="btn sec"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4" />
            <span>{L('طباعة ملخص السجل', 'Print Summary')}</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs */}
      <div className="g4">
        <KPICard
          variant="brand"
          value={rawHistory.length}
          label={L('إجمالي الفحوصات المعتمدة', 'Total Certified Exams')}
          icon={FileText}
          subtext={L('سجلات إكلينيكية موثقة', 'Accredited clinical records')}
        />
        <KPICard
          variant="emerald"
          value={1}
          label={L('حالة اللياقة الطبية الحالية', 'Current Fitness Verdict')}
          icon={CheckCircle2}
          subtext={L('لائق طبيًا للمنافسات', 'Medically fit for competition')}
        />
        <KPICard
          variant="primary-700"
          value={p.bp}
          label={L('ضغط الدم الأخير (الراحة)', 'Last Blood Pressure')}
          icon={Activity}
          subtext={L('معدل طبيعي سليم', 'Normal arterial pressure')}
        />
        <KPICard
          variant="teal"
          value={p.lv}
          label={L('المستوى الطبي المعتمد', 'Accredited Medical Level')}
          icon={Award}
          subtext={isRTL ? lv.ar : lv.en}
        />
      </div>

      {/* Filters & Search Row */}
      <div className="card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 inset-inline-start-3 text-[var(--muted)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={L('بحث بالمستشفى أو اسم الطبيب...', 'Search hospital or doctor...')}
              className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl py-1.5 ps-9 pe-3 text-xs text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          {/* Level Filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs text-[var(--muted)] flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>{L('المستوى:', 'Level:')}</span>
            </span>
            <button
              type="button"
              onClick={() => setFilterLevel('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 ${
                filterLevel === 'all'
                  ? 'bg-[var(--primary)] text-white shadow-2xs'
                  : 'bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--ink)] border border-[var(--line)]'
              }`}
            >
              {L('الكل', 'All')}
            </button>
            <button
              type="button"
              onClick={() => setFilterLevel('2')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 ${
                filterLevel === '2'
                  ? 'bg-[var(--primary)] text-white shadow-2xs'
                  : 'bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--ink)] border border-[var(--line)]'
              }`}
            >
              {L('المستوى 2', 'Level 2')}
            </button>
            <button
              type="button"
              onClick={() => setFilterLevel('3')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 ${
                filterLevel === '3'
                  ? 'bg-[var(--primary)] text-white shadow-2xs'
                  : 'bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--ink)] border border-[var(--line)]'
              }`}
            >
              {L('المستوى 3', 'Level 3')}
            </button>
          </div>

        </div>
      </div>

      {/* Medical History Records Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="m-0">
            <span className="d"></span>
            {L('سجل الفحوصات والتقارير الإكلينيكية الصادرة', 'Certified Clinical Examination Records')}
          </h3>
          <span className="mut text-xs">
            {filteredHistory.length} {L('تقارير معتمدة', 'records')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="t">
            <thead>
              <tr>
                <th>{L('كود التقرير', 'Report ID')}</th>
                <th>{L('تاريخ الفحص', 'Exam Date')}</th>
                <th>{L('المستوى والموسم', 'Level & Season')}</th>
                <th>{L('المستشفى والطبيب المعالج', 'Hospital & Physician')}</th>
                <th>{L('الفحوصات المنجزة', 'Tests Performed')}</th>
                <th>{L('القرار الطبي', 'Verdict')}</th>
                <th>{L('إجراءات', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((rec) => (
                <tr key={rec.id}>
                  <td className="mono font-bold text-[var(--primary)] text-xs">{rec.id}</td>
                  <td>
                    <b>{isRTL ? rec.date : rec.dateEn}</b>
                    <span className="mut text-xs block">{rec.season}</span>
                  </td>
                  <td>
                    <div className="font-semibold text-xs text-[var(--ink)]">
                      {isRTL ? rec.levelNameAr : rec.levelNameEn}
                    </div>
                    <span className="tag ti text-[10px] mt-0.5 inline-block">
                      {L(`كود طبي ${rec.level}`, `Medical Code ${rec.level}`)}
                    </span>
                  </td>
                  <td>
                    <div className="font-semibold text-xs text-[var(--ink)]">
                      {isRTL ? rec.hospitalAr : rec.hospitalEn}
                    </div>
                    <span className="text-[11px] text-[var(--muted)] block">
                      {isRTL ? rec.doctorAr : rec.doctorEn}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {rec.tests?.slice(0, 3).map((tst, tIdx) => (
                        <span key={tIdx} className="text-[9.5px] px-1.5 py-0.5 rounded bg-[var(--primary-50)] text-[var(--primary-700)] font-medium">
                          {isRTL ? tst.nameAr : tst.nameEn}
                        </span>
                      ))}
                      {(rec.tests?.length || 0) > 3 && (
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-[var(--line)] text-[var(--muted)] font-medium">
                          +{rec.tests.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <StatusTag status={rec.status} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn sec sm"
                      onClick={() => setSelectedReport(rec)}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{L('عرض التقرير', 'View Report')}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confidentiality & Privacy Notice */}
      <div className="nt ok flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
        <div className="text-xs">
          <b className="block mb-0.5">
            {L('حماية سرية البيانات والملف الطبي — قانون 151 لسنة 2020', 'Medical Confidentiality & Law 151/2020')}
          </b>
          <span>
            {L(
              'التقارير الطبية والتفاصيل الإكلينيكية مشفرة وتخضع لسرية المهنة الطبية. لا يُسمح للأندية أو الجهات الخارجية بالاطلاع على التفاصيل الطبية إلا بتفويض صريح مسبق من صاحب الحساب أو ولي أمره القانوني.',
              'Clinical notes, ECG tracings, and lab diagnostics are strictly confidential. Sporting clubs only see the overall fitness verdict unless explicitly authorized.'
            )}
          </span>
        </div>
      </div>

      {/* Detailed Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-[var(--card)] rounded-2xl p-5 sm:p-6 shadow-2xl border border-[var(--line)] relative max-h-[90vh] overflow-y-auto text-start">
            
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary-50)] text-[var(--primary)] flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--ink)] m-0">
                    {L('تقرير الفحص الطبي الرياضي المعتمد', 'Certified Sports Medical Examination Report')}
                  </h3>
                  <span className="mono text-xs text-[var(--primary)] font-bold">
                    {selectedReport.id} · {selectedReport.season}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-50)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Athlete Demographics Banner inside modal */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] my-3 text-xs">
              <div>
                <span className="mut text-[11px] block">{L('اسم الرياضي:', 'Athlete:')}</span>
                <b className="text-[var(--ink)]">{p.name}</b>
              </div>
              <div>
                <span className="mut text-[11px] block">{L('الرقم القومي:', 'National ID:')}</span>
                <span className="mono font-semibold text-[var(--ink)]">{p.nid}</span>
              </div>
              <div>
                <span className="mut text-[11px] block">{L('اللعبة المقيد بها:', 'Sport:')}</span>
                <b className="text-[var(--ink)]">{isRTL ? cfg.sports[p.sp] : SP_EN[cfg.sports[p.sp]] || cfg.sports[p.sp]}</b>
              </div>
              <div>
                <span className="mut text-[11px] block">{L('تاريخ الفحص:', 'Exam Date:')}</span>
                <b>{isRTL ? selectedReport.date : selectedReport.dateEn}</b>
              </div>
            </div>

            {/* Vitals Summary */}
            <div className="mb-3">
              <h4 className="text-xs font-bold text-[var(--ink)] mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>{L('المؤشرات الحيوية والقياسات البدنية:', 'Vital Signs & Physical Measurements:')}</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg border border-[var(--line)] bg-[var(--card)]">
                  <span className="mut text-[10.5px] block">{L('ضغط الدم (mmHg)', 'Blood Pressure')}</span>
                  <b className="mono text-sm text-[var(--primary-700)] mt-0.5 block">{selectedReport.vitals?.bp}</b>
                </div>
                <div className="p-2 rounded-lg border border-[var(--line)] bg-[var(--card)]">
                  <span className="mut text-[10.5px] block">{L('النبض (bpm)', 'Heart Rate')}</span>
                  <b className="mono text-sm text-[var(--primary-700)] mt-0.5 block">{selectedReport.vitals?.hr}</b>
                </div>
                <div className="p-2 rounded-lg border border-[var(--line)] bg-[var(--card)]">
                  <span className="mut text-[10.5px] block">{L('مؤشر كتلة الجسم BMI', 'BMI')}</span>
                  <b className="mono text-sm text-[var(--primary-700)] mt-0.5 block">{selectedReport.vitals?.bmi}</b>
                </div>
                <div className="p-2 rounded-lg border border-[var(--line)] bg-[var(--card)]">
                  <span className="mut text-[10.5px] block">{L('الطول / الوزن', 'Height / Weight')}</span>
                  <b className="mono text-sm text-[var(--primary-700)] mt-0.5 block">{selectedReport.vitals?.height} cm / {selectedReport.vitals?.weight} kg</b>
                </div>
              </div>
            </div>

            {/* Tests & Clinical Findings Table */}
            <div className="mb-3">
              <h4 className="text-xs font-bold text-[var(--ink)] mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>{L('نتائج الفحوصات الطبية المقررة:', 'Clinical Investigations & Diagnostic Findings:')}</span>
              </h4>
              <table className="t">
                <thead>
                  <tr>
                    <th>{L('الفحص الإكلينيكي', 'Investigation')}</th>
                    <th>{L('النتيجة والتشخيص', 'Clinical Result')}</th>
                    <th>{L('التقييم', 'Status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReport.tests?.map((tst, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold text-xs">{isRTL ? tst.nameAr : tst.nameEn}</td>
                      <td className="text-xs">{isRTL ? tst.resultAr : tst.resultEn}</td>
                      <td>
                        <b className="text-[var(--success)] flex items-center gap-1 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{L('طبيعي وسليم', 'Normal')}</span>
                        </b>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Supervising Doctor & Facility */}
            <div className="p-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs space-y-1 mb-3">
              <div className="flex justify-between items-center">
                <span className="mut">{L('المستشفى / المنشأة المعتمدة:', 'Accredited Medical Center:')}</span>
                <b className="text-[var(--ink)]">{isRTL ? selectedReport.hospitalAr : selectedReport.hospitalEn}</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="mut">{L('الطبيب الاستشاري المسؤول:', 'Lead Consultant Physician:')}</span>
                <b className="text-[var(--primary-700)]">{isRTL ? selectedReport.doctorAr : selectedReport.doctorEn}</b>
              </div>
              <div className="pt-2 border-t border-[var(--line)] text-start">
                <span className="mut block mb-0.5">{L('التوصيات والقرار الطبي النهائي:', 'Final Medical Recommendation:')}</span>
                <b className="text-[var(--success-dark)]">
                  {isRTL ? selectedReport.notesAr : selectedReport.notesEn}
                </b>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-2">
              <div className="mono text-[10px] text-[var(--muted)]">
                {selectedReport.digitalSign}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn sec sm"
                  onClick={() => showToast(L('تم تنزيل نسخة التقرير الطبي PDF', 'Medical report PDF downloaded'))}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{L('تحميل PDF', 'Download')}</span>
                </button>
                <button
                  type="button"
                  className="btn ghost sm"
                  onClick={() => setSelectedReport(null)}
                >
                  {L('إغلاق', 'Close')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
