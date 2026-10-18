import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { X, Shield, FileCheck, Building, HeartHandshake } from 'lucide-react';

export const HelpModal = ({ isOpen, onClose }) => {
  const { isRTL, L } = useLanguage();
  const { cfg } = useSeha();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-[var(--card)] rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--line)] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--primary-50)]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--ink)]">
              {isRTL ? 'دليل منظومة «صحة» للرياضيين' : 'Seha SportsMed Platform Guide'}
            </h2>
            <p className="text-xs text-[var(--muted)]">
              {L(cfg.org.decree.ar, cfg.org.decree.en)} · {L(cfg.org.owner.ar, cfg.org.owner.en)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-100)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-[var(--ink)] leading-relaxed">
          {/* Mission */}
          <div className="bg-[var(--primary-50)] p-4 rounded-xl border border-[var(--primary-100)]">
            <b className="text-sm font-bold text-[var(--primary-700)] block mb-1">
              {isRTL ? 'الهدف الاستراتيجي للمنظومة' : 'Platform Mission'}
            </b>
            <p className="text-[var(--muted)]">
              {isRTL
                ? 'توحيد وتأمين إصدار الشهادات الطبية الرياضية لجميع الرياضيين والناشئين في مصر لمنع التزوير وضمان السلامة القلبية قبل الممارسة التنافسية، وفق الكود الطبي المعتمد بقرار 1642 / 2024.'
                : 'Unifying and securing sports medical fitness certificates across Egypt to prevent forgery and safeguard cardiac health prior to competitive activity, per Decree 1642 / 2024.'}
            </p>
          </div>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--card)]">
              <div className="flex items-center gap-2 mb-1.5 text-[var(--primary)] font-bold">
                <FileCheck className="w-4 h-4" />
                <span>{isRTL ? 'الكود الطبي الموحد' : 'Unified Medical Code'}</span>
              </div>
              <p className="text-xs text-[var(--muted)]">
                {isRTL
                  ? '4 مستويات فحص محددة حسب نوع النشاط تبدأ من الممارسة العامة وحتى المنتخبات القومية شاملة رسم قلب وإيكو ومجهود.'
                  : '4 examination levels tailored by sport level: general practice, academies, championships, and national teams.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--card)]">
              <div className="flex items-center gap-2 mb-1.5 text-[var(--success-dark)] font-bold">
                <HeartHandshake className="w-4 h-4" />
                <span>{isRTL ? 'مبادرة «أشبالنا» للمتابعة' : 'Ashbalna Care Track'}</span>
              </div>
              <p className="text-xs text-[var(--muted)]">
                {isRTL
                  ? 'لا يُستبعد أي رياضي؛ أي نتيجة غير طبيعية تُفتح لها حالة رعاية ومتابعة سرية حتى الشفاء وإعادة التقييم.'
                  : 'Zero athlete exclusion; any abnormal finding triggers a confidential multi-stage follow-up track until re-assessment.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--card)]">
              <div className="flex items-center gap-2 mb-1.5 text-[var(--primary-700)] font-bold">
                <Shield className="w-4 h-4" />
                <span>{isRTL ? 'حماية البيانات الشخصية' : 'Data Protection (Law 151/2020)'}</span>
              </div>
              <p className="text-xs text-[var(--muted)]">
                {isRTL
                  ? 'النادي يرى النتيجة فقط (لائق/غير لائق) بموافقة صريحة محددة النطاق والمدة وقابلة للسحب، والتفاصيل الطبية سرية تمامًا.'
                  : 'Entities see outcomes only via scoped, revocable consents. Medical diagnoses remain strictly confidential.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--card)]">
              <div className="flex items-center gap-2 mb-1.5 text-[var(--warning-dark)] font-bold">
                <Building className="w-4 h-4" />
                <span>{isRTL ? 'النموذج المالي المستدام' : 'Sustainable Financial Model'}</span>
              </div>
              <p className="text-xs text-[var(--muted)]">
                {isRTL
                  ? 'رسم ميكنة موحد 100 ج.م يمول الاستضافة والتوقيع والرسائل، دون المساس بالرسوم الطبية المقررة للمستشفيات.'
                  : 'A 100 EGP automation fee covers operations, e-signatures, and hosting without altering hospital clinical fees.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[var(--primary-50)] border-t border-[var(--line)] flex justify-end">
          <button className="btn sm" onClick={onClose}>
            {isRTL ? 'فهمت، إغلاق' : 'Understood, Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
