import React, { useState } from 'react';
import {
  Globe,
  Sun,
  Moon,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  ShieldCheck,
  Info,
  Building2
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { LOGO_SVG } from '../../../data/icons';
import { mockPersonas } from '../../../data/mockPersonas';
import { SuperAdminIllustration } from './SuperAdminIllustration';
import { CitizenIllustration } from './CitizenIllustration';

export const RoleSelectionView = ({
  selectedRole = 'super_admin',
  onSelectRole,
  onConfirmRole
}) => {
  const { language, toggleLanguage, isRTL, L } = useLanguage();
  const { toggleTheme, isDark } = useTheme();

  const [activeStep, setActiveStep] = useState(1);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const roles = [
    {
      id: 'super_admin',
      persona: mockPersonas.super_admin,
      title: L('مسؤول المنظومة الشامل', 'Super Administrator'),
      subBadge: L('كافة الشاشات (11 شاشة)', 'All Screens (Full System)'),
      description: L(
        'صلاحيات كاملة للوصول إلى كافة شاشات ولوحات وبوابات المنظومة وإدارتها.',
        'Full administrative access to all dashboards, clinical registries, and portals.'
      ),
      illustration: SuperAdminIllustration,
      features: [
        L('لوحة المؤشرات', 'Dashboard'),
        L('سجل الشهادات', 'Certificates'),
        L('إدارة المنظومة', 'Administration')
      ]
    },
    {
      id: 'citizen',
      persona: mockPersonas.citizen,
      title: L('المواطن والرياضي', 'Citizen & Athlete'),
      subBadge: L('خدمات المواطن (4 شاشات)', 'Citizen Services (4 Screens)'),
      description: L(
        'خدمات المواطن: الحجز الإلكتروني، الشهادات الطبية، وموافقات الاطلاع.',
        'Dedicated citizen portal: e-Booking, verified certificates, and consents.'
      ),
      illustration: CitizenIllustration,
      features: [
        L('الرئيسية والملف', 'Home & Profile'),
        L('حجز كشف طبي', 'Medical Booking'),
        L('الشهادات والموافقات', 'Certs & Consents')
      ]
    }
  ];

  const handleCardClick = (roleId) => {
    if (onSelectRole) {
      onSelectRole(roleId);
    }
  };

  const handleNextClick = () => {
    if (onConfirmRole) {
      onConfirmRole(selectedRole);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full bg-gradient-to-br from-[#E2EAF2] via-[#F4F6F9] to-[#D5E2EE] dark:from-[#061220] dark:via-[#081729] dark:to-[#0E2442] flex items-center justify-center p-3 sm:p-5 select-none relative overflow-hidden font-arabic">
      
      {/* Ambient background soft glow matching project clinical palette */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4B6F9A]/15 dark:bg-[#5C84B5]/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#003366]/15 dark:bg-[#0066CC]/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* Main Centered Floating Card */}
      <div className="w-full max-w-[690px] max-h-[calc(100vh-32px)] bg-white dark:bg-[#0E2442] rounded-[24px] sm:rounded-[28px] shadow-[0_20px_50px_rgba(0,51,102,0.16)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#DCE4EC] dark:border-[#1E426F] p-4 sm:p-5 relative z-10 transition-all duration-300 flex flex-col justify-between overflow-y-auto my-auto">
        
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#DCE4EC] dark:border-[#1E426F]">
          {/* Logo & Brand text */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group hover:opacity-90 transition-opacity"
            onClick={() => setShowAboutModal(true)}
            title={L('نبذة عن المنظومة', 'About the platform')}
          >
            <div className="shrink-0 scale-95">
              {LOGO_SVG}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-bold text-[#003366] dark:text-[#F2F6FB] tracking-tight">
                  {L('منظومة «صحة» للرياضيين', 'Seha SportsMed Platform')}
                </span>
                <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-[#DFE7F1] dark:bg-[#1B355A] text-[#003366] dark:text-[#ABC7E8] font-bold border border-[#BDD0E4] dark:border-[#274D7E]">
                  {L('قرار 1642', 'Decree 1642')}
                </span>
              </div>
              <p className="text-[10.5px] text-[#4A607A] dark:text-[#94B0D0] hidden xs:block">
                {L('الحجز الإلكتروني والشهادات الطبية الموثقة', 'e-Booking & Verified Medical Certificates')}
              </p>
            </div>
          </div>

          {/* Right Controls: About, Language & Theme */}
          <nav className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowAboutModal(true)}
              title={L('عن المنظومة والقرار', 'About & Decree')}
              className="p-1.5 rounded-lg text-[#4A607A] dark:text-[#94B0D0] hover:text-[#003366] dark:hover:text-[#F2F6FB] hover:bg-[#F0F4F9] dark:hover:bg-[#142F55] transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5 text-[#4B6F9A]" />
              <span className="hidden sm:inline text-[11px] font-semibold">{L('عن المنظومة', 'About')}</span>
            </button>

            <button
              type="button"
              onClick={toggleLanguage}
              title={language === 'en' ? 'التحويل للعربية' : 'Switch to English'}
              className="p-1.5 rounded-lg text-[#4A607A] dark:text-[#94B0D0] hover:text-[#003366] dark:hover:text-[#F2F6FB] hover:bg-[#F0F4F9] dark:hover:bg-[#142F55] transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#4B6F9A]" />
              <span className="text-[10.5px] uppercase font-bold">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? (isRTL ? 'الوضع النهاري' : 'Light Mode') : (isRTL ? 'الوضع الليلي' : 'Dark Mode')}
              className="p-1.5 rounded-lg text-[#4A607A] dark:text-[#94B0D0] hover:text-[#003366] dark:hover:text-[#F2F6FB] hover:bg-[#F0F4F9] dark:hover:bg-[#142F55] transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#4B6F9A]" />}
            </button>
          </nav>
        </header>

        {/* Center Heading & Subtitle */}
        <div className="text-center" style={{ marginTop: '20px' }}>
          <h1 className="text-lg sm:text-xl font-bold text-[#003366] dark:text-[#F2F6FB] tracking-tight">
            {L('اختر نوع الحساب للمتابعة', 'Select Your Platform Role')}
          </h1>
          <p className="text-[11px] sm:text-xs text-[#4A607A] dark:text-[#94B0D0] mt-1 max-w-md mx-auto">
            {L(
              'حدد الدور المطلوب لتخصيص الشاشات واللوحات والخدمات المتاحة لك في المنظومة.',
              'Choose your account type to access tailored services, dashboards, and workflows.'
            )}
          </p>
        </div>

        {/* 2 Role Cards Grid with guaranteed 20px top and bottom margins */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[620px] mx-auto w-full shrink-0"
          style={{ marginTop: '20px', marginBottom: '20px' }}
        >
          {roles.map((item) => {
            const isSelected = selectedRole === item.id;
            const Illustration = item.illustration;

            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                onDoubleClick={handleNextClick}
                className={`group relative rounded-xl p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? 'border-2 border-[#4B6F9A] dark:border-[#5C84B5] bg-gradient-to-b from-[#F0F4F9] to-white dark:from-[#142F55] dark:to-[#0E2442] shadow-[0_10px_24px_rgba(75,111,154,0.18)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.4)] ring-2 ring-[#4B6F9A]/20 dark:ring-[#5C84B5]/30'
                    : 'border border-[#DCE4EC] dark:border-[#1E426F] hover:border-[#4B6F9A]/70 dark:hover:border-[#5C84B5] bg-white dark:bg-[#0E2442] hover:shadow-xs'
                }`}
              >
                {/* Active Selection Checkmark Badge */}
                <div
                  className={`absolute top-2.5 ${isRTL ? 'left-2.5' : 'right-2.5'} w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#4B6F9A] text-white scale-100 shadow-2xs'
                      : 'border-2 border-[#DCE4EC] dark:border-[#274D7E] text-transparent scale-90'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>

                {/* Top Illustration Area (Compact) */}
                <div className="w-full h-18 sm:h-20 flex items-center justify-center p-0.5">
                  <Illustration isSelected={isSelected} />
                </div>

                {/* Role Details */}
                <div className="mt-2 text-center">
                  <h3
                    className={`text-sm sm:text-base font-bold transition-colors ${
                      isSelected
                        ? 'text-[#003366] dark:text-[#F2F6FB]'
                        : 'text-[#003366] dark:text-[#F2F6FB] group-hover:text-[#4B6F9A]'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-[10.5px] text-[#4A607A] dark:text-[#94B0D0] mt-1 leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stepper / Progress Dots */}
        <div className="flex items-center justify-center gap-1.5" style={{ marginBottom: '20px' }}>
          {[1, 2].map((step) => {
            const isActive = activeStep === step;
            return (
              <div
                key={step}
                className={`transition-all duration-200 rounded-full ${
                  isActive
                    ? 'w-4 h-1.5 bg-[#4B6F9A] dark:bg-[#5C84B5]'
                    : 'w-1.5 h-1.5 bg-[#DCE4EC] dark:bg-[#1E426F]'
                }`}
              />
            );
          })}
        </div>

        {/* Next Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2.5 sm:pt-3 border-t border-[#DCE4EC] dark:border-[#1E426F]">
          <div className="text-[11px] text-[#4A607A] dark:text-[#94B0D0] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16845B]" />
            <span>{L('نظام موثق وفق قانون حماية البيانات الشخصية 151 / 2020', 'Secured & compliant with Data Protection Law 151 / 2020')}</span>
          </div>

          <button
            type="button"
            onClick={handleNextClick}
            className="w-full sm:w-auto px-6 py-2 bg-[#4B6F9A] hover:bg-[#3D5E85] active:bg-[#003366] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-[#4B6F9A]/25 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{L('متابعة لتسجيل الدخول', 'Continue to Login')}</span>
            {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* About Platform Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#0E2442] rounded-2xl p-5 sm:p-6 shadow-2xl border border-[#DCE4EC] dark:border-[#1E426F] relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE4EC] dark:border-[#1E426F]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#DFE7F1] dark:bg-[#1B355A] flex items-center justify-center text-[#003366] dark:text-[#ABC7E8]">
                  <Building2 className="w-5 h-5 text-[#4B6F9A]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#003366] dark:text-[#F2F6FB]">
                    {L('منظومة «صحة» للرياضيين', 'Seha SportsMed Platform')}
                  </h3>
                  <p className="text-xs text-[#4A607A] dark:text-[#94B0D0]">
                    {L('قرار وزير الصحة والسكان 1642 / 2024', 'Ministerial Decree 1642 / 2024')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="p-1 rounded-lg text-[#4A607A] hover:text-[#003366] hover:bg-[#F0F4F9] dark:hover:bg-[#142F55] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-[#003366] dark:text-[#F2F6FB] leading-relaxed">
              <p>
                {L(
                  'المنظومة الوطنية الموحدة للحجز الإلكتروني وإصدار الشهادات الطبية الموثقة للرياضيين بجمهورية مصر العربية، تحت إشراف المؤسسة العلاجية والإدارة العامة لنظم المعلومات والتحول الرقمي.',
                  'The unified national platform for digital booking and issuing tamper-proof medical fitness certificates for Egyptian athletes, supervised by the Curative Organization and IT & Digital Transformation Directorate.'
                )}
              </p>

              <div className="p-3 rounded-xl bg-[#F0F4F9] dark:bg-[#142F55] border border-[#DCE4EC] dark:border-[#1E426F] space-y-1.5">
                <div className="font-bold text-[#003366] dark:text-[#ABC7E8]">
                  {L('مستويات الفحص الأربعة المقررة:', 'The 4 Mandated Examination Levels:')}
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-xs text-[#4A607A] dark:text-[#94B0D0]">
                  <li>{L('المستوى الأول: الممارسة العامة واشتراطات السلامة (250 ج.م)', 'Level 1: General Fitness & Safety (250 EGP)')}</li>
                  <li>{L('المستوى الثاني: الأكاديميات ورسم القلب والتحاليل (250 ج.م)', 'Level 2: Academies & ECG (250 EGP)')}</li>
                  <li>{L('المستوى الثالث: بطولات الجمهورية وموجات إيكو القلب (500 ج.م)', 'Level 3: National Championships & Echo (500 EGP)')}</li>
                  <li>{L('المستوى الرابع: المنتخبات القومية ورسم القلب بالمجهود (800 ج.م)', 'Level 4: National Teams & Stress ECG (800 EGP)')}</li>
                </ul>
              </div>

              <div className="text-xs text-[#4A607A] dark:text-[#94B0D0]">
                <b>{L('الإشراف الفني:', 'Technical Supervision:')}</b> {L('م. أشرف طلعت · مدير إدارة نظم المعلومات والتحول الرقمي', 'Eng. Ashraf Talaat · Director of IT & Digital Transformation')}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="px-5 py-2 bg-[#4B6F9A] text-white font-bold text-xs rounded-lg hover:bg-[#3D5E85] transition-colors cursor-pointer"
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
