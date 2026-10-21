import React, { useState, useRef } from 'react';
import {
  Globe,
  Sun,
  Moon,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { LOGO_SVG } from '../../../data/icons';
import { mockPersonas } from '../../../data/mockPersonas';
import { CitizenIllustration } from './CitizenIllustration';
import { GuardianIllustration } from './GuardianIllustration';
import { SuperAdminIllustration } from './SuperAdminIllustration';

export const RoleSelectionView = ({
  selectedRole: propSelectedRole,
  onSelectRole,
  onConfirmRole
}) => {
  const { language, toggleLanguage, isRTL, L } = useLanguage();
  const { toggleTheme, isDark } = useTheme();

  // Try reading last used role from localStorage
  const [selectedRole, setSelectedRole] = useState(() => {
    try {
      const stored = localStorage.getItem('seha_last_role');
      if (stored === 'athlete' || stored === 'guardian' || stored === 'super_admin') {
        return stored;
      }
    } catch (err) {
      // Storage access blocked or unavailable
    }
    return null;
  });

  const cardRefs = useRef({});

  // Roles ordered for RTL reading:
  // In RTL, the first array item renders on the right (Athlete), second in center (Parent), third on left (Admin).
  const roles = [
    {
      id: 'athlete',
      persona: mockPersonas.athlete || mockPersonas.citizen,
      title: L('الرياضي (حساب فردي)', 'Athlete (Individual Account)'),
      subBadge: L('خدمات الرياضي الفردي', 'Individual Athlete Services'),
      illustration: CitizenIllustration,
      features: [
        L('حجز فحص طبي', 'Book Exam'),
        L('السجل الطبي', 'Medical History'),
        L('الشهادات الرقمية', 'Verified Certs')
      ]
    },
    {
      id: 'guardian',
      persona: mockPersonas.guardian,
      title: L('ولي الأمر (حساب عائلي)', 'Parent / Guardian (Family Account)'),
      subBadge: L('إدارة ملفات الأبناء والتابعين', 'Connected Children (Family Hub)'),
      illustration: GuardianIllustration,
      features: [
        L('إدارة ملفات الأبناء', 'Manage Children'),
        L('تبديل الملفات', 'Profile Switching'),
        L('حجز كشوفات العائلة', 'Family Booking')
      ]
    },
    {
      id: 'super_admin',
      persona: mockPersonas.super_admin,
      title: L('مسؤول المنظومة (إدارة عليا)', 'Super Admin (System Governance)'),
      subBadge: L('إدارة المنظومة والحوكمة المركزية', 'Central Governance & Oversight'),
      illustration: SuperAdminIllustration,
      features: [
        L('لوحة العمليات', 'Operations Center'),
        L('اعتماد الجهات', 'Accredit Entities'),
        L('التقارير التنفيذية', 'Executive Decks')
      ]
    }
  ];

  const handleSelect = (roleId) => {
    setSelectedRole(roleId);
    try {
      localStorage.setItem('seha_last_role', roleId);
    } catch (err) {
      // Ignore localStorage errors
    }
    if (onSelectRole) {
      onSelectRole(roleId);
    }
  };

  const handleConfirm = () => {
    if (!selectedRole) return;
    if (onConfirmRole) {
      onConfirmRole(selectedRole);
    }
  };

  // Accessible keyboard navigation for radiogroup (Arrow keys, Space, Enter)
  const handleKeyDown = (e, roleId) => {
    const currentIndex = roles.findIndex((r) => r.id === roleId);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % roles.length;
      const nextRole = roles[nextIndex].id;
      handleSelect(nextRole);
      if (cardRefs.current[nextRole]) {
        cardRefs.current[nextRole].focus();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + roles.length) % roles.length;
      const prevRole = roles[prevIndex].id;
      handleSelect(prevRole);
      if (cardRefs.current[prevRole]) {
        cardRefs.current[prevRole].focus();
      }
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleSelect(roleId);
    }
  };

  // Determine dynamic CTA label reflecting current selection
  const getCtaLabel = () => {
    if (selectedRole === 'athlete') {
      return L('المتابعة كرياضي', 'Continue as Athlete');
    }
    if (selectedRole === 'guardian') {
      return L('المتابعة كولي أمر', 'Continue as Parent / Guardian');
    }
    if (selectedRole === 'super_admin') {
      return L('المتابعة كمسؤول المنظومة', 'Continue as Super Admin');
    }
    return L('اختر نوع الحساب للمتابعة', 'Select an Account Type to Continue');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#E2EAF2] via-[#F4F6F9] to-[#D5E2EE] dark:from-[#061220] dark:via-[#081729] dark:to-[#0E2442] flex items-center justify-center p-3.5 sm:p-5 md:p-6 py-6 sm:py-10 select-none relative font-arabic">
      
      {/* Ambient background soft glow */}
      <div className="absolute top-1/4 inset-inline-start-1/4 w-96 h-96 bg-[#4B6F9A]/15 dark:bg-[#5C84B5]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 inset-inline-end-1/4 w-96 h-96 bg-[#003366]/15 dark:bg-[#0066CC]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Floating Card (Shared Auth Shell: Content-driven height, no dead space) */}
      <div className="w-full max-w-[1040px] bg-white dark:bg-[#0E2442] rounded-[24px] shadow-[0_20px_50px_rgba(0,51,102,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#DCE4EC] dark:border-[#1E426F] p-5 sm:p-7 relative z-10 transition-all duration-200 flex flex-col justify-between my-auto">
        
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pb-4 border-b border-[#DCE4EC] dark:border-[#1E426F] gap-3">
          {/* Logo & Brand text */}
          <div className="flex items-center gap-2.5">
            <div className="shrink-0 scale-95">
              {LOGO_SVG}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold text-[#003366] dark:text-[#F2F6FB] tracking-tight">
                  {L('منظومة «صحة» للرياضيين', 'Seha SportsMed Platform')}
                </span>
              </div>
              <p className="text-xs text-[#4A607A] dark:text-[#94B0D0] hidden xs:block mt-0.5">
                {L('الحجز الإلكتروني والشهادات الطبية الموثقة', 'e-Booking & Verified Medical Certificates')}
              </p>
            </div>
          </div>

          {/* Right Controls: Language & Theme (>= 40px touch targets) */}
          <nav className="flex items-center gap-1 shrink-0" aria-label={L('أدوات التخصيص', 'Preferences')}>
            <button
              type="button"
              onClick={toggleLanguage}
              title={language === 'en' ? 'التحويل للعربية' : 'Switch to English'}
              className="min-w-[40px] min-h-[40px] p-2 rounded-xl text-[#4A607A] dark:text-[#94B0D0] hover:text-[#003366] dark:hover:text-[#F2F6FB] hover:bg-[#F0F4F9] dark:hover:bg-[#142F55] transition-colors text-xs font-bold flex items-center justify-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6F9A]"
              aria-label={language === 'en' ? 'Switch interface to Arabic' : 'التحويل للغة الإنجليزية'}
            >
              <Globe className="w-4 h-4 text-[#4B6F9A]" />
              <span className="text-xs uppercase font-extrabold">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? (isRTL ? 'الوضع النهاري' : 'Light Mode') : (isRTL ? 'الوضع الليلي' : 'Dark Mode')}
              className="min-w-[40px] min-h-[40px] p-2 rounded-xl text-[#4A607A] dark:text-[#94B0D0] hover:text-[#003366] dark:hover:text-[#F2F6FB] hover:bg-[#F0F4F9] dark:hover:bg-[#142F55] transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6F9A]"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#4B6F9A]" />}
            </button>
          </nav>
        </header>

        {/* Center Heading (Clean & Minimal without redundant subtitle) */}
        <div className="text-center my-[10px]">
          <h1 className="mt-[10px] text-xl sm:text-2xl font-extrabold text-[#003366] dark:text-[#F2F6FB] tracking-tight">
            {L('اختر نوع الحساب للمتابعة', 'Select Your Platform Role')}
          </h1>
        </div>

        {/* 3 Accessible Role Cards (Athlete on Right in RTL, Parent in Center, Super Admin on Left) */}
        <div
          role="radiogroup"
          aria-label={L('خيارات نوع الحساب', 'Account type options')}
          className="grid grid-cols-1 md:grid-cols-3 gap-[10px] w-full my-[10px]"
        >
          {roles.map((item) => {
            const isSelected = selectedRole === item.id;
            const Illustration = item.illustration;

            return (
              <div
                key={item.id}
                ref={(el) => (cardRefs.current[item.id] = el)}
                role="radio"
                id={`role-option-${item.id}`}
                aria-checked={isSelected}
                tabIndex={isSelected || (!selectedRole && item.id === 'athlete') ? 0 : -1}
                onClick={() => handleSelect(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                className={`group relative rounded-[20px] p-4.5 sm:p-5 my-[10px] flex flex-col justify-between cursor-pointer transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#4B6F9A] ${
                  isSelected
                    ? 'border-2 border-[#4B6F9A] dark:border-[#5C84B5] bg-[#F0F4F9] dark:bg-[#142F55]/70 shadow-md -translate-y-0.5'
                    : 'border border-[#DCE4EC] dark:border-[#1E426F] hover:border-[#4B6F9A]/70 dark:hover:border-[#5C84B5] bg-white dark:bg-[#0E2442] hover:bg-slate-50/60 dark:hover:bg-[#112744] hover:shadow-xs active:scale-[0.99]'
                }`}
                style={{ marginTop: '10px', marginBottom: '10px' }}
              >
                {/* Selection Indicator on INLINE-START (Top-Right in RTL, Top-Left in LTR) */}
                <div
                  className={`absolute top-4 inset-inline-start-4 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#4B6F9A] text-white scale-100 shadow-2xs'
                      : 'border-2 border-[#CBD5E1] dark:border-[#274D7E] text-transparent scale-90'
                  }`}
                  aria-hidden="true"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                {/* Consistent Illustration Area */}
                <div className="w-full h-24 sm:h-28 flex items-center justify-center p-1 mb-[10px]">
                  <Illustration isSelected={isSelected} />
                </div>

                {/* Role Details */}
                <div className="text-center flex-1 flex flex-col justify-between">
                  <div className="my-[10px]">
                    <h2
                      className={`text-base font-extrabold transition-colors ${
                        isSelected
                          ? 'text-[#003366] dark:text-[#F2F6FB]'
                          : 'text-[#003366] dark:text-[#F2F6FB] group-hover:text-[#4B6F9A]'
                      }`}
                    >
                      {item.title}
                    </h2>
                  </div>

                  {/* Feature Chips (Limited to exactly 3 chips per card, >=12px text, AA contrast) */}
                  <div className="flex flex-wrap justify-center gap-[10px] mt-[10px] pt-[10px] border-t border-[#DCE4EC]/70 dark:border-[#1E426F]/70">
                    {item.features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className={`text-[11.5px] px-2.5 py-1 rounded-full font-bold leading-none ${
                          isSelected
                            ? 'bg-[#4B6F9A]/20 text-[#003366] dark:text-[#ABC7E8]'
                            : 'bg-[#E8EEF5] dark:bg-[#1B355A] text-[#003366] dark:text-[#ABC7E8]'
                        }`}
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Row: Trust Line and Dynamic CTA */}
        <div className="mt-5 pt-4 border-t border-[#DCE4EC] dark:border-[#1E426F] flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Trust line with <bdi> for law number 151 / 2020 */}
          <div className="text-xs text-[#4A607A] dark:text-[#ABC7E8] flex items-center gap-1.5 leading-none">
            <ShieldCheck className="w-4 h-4 text-[#16845B] shrink-0 self-center" />
            <span>
              {L('نظام موثق وفق قانون حماية البيانات الشخصية رقم ', 'Secured under Personal Data Protection Law ')}
              <bdi dir="ltr" className="font-bold font-mono">151 / 2020</bdi>
            </span>
          </div>

          {/* Dynamic Selection-Aware CTA Button */}
          <button
            type="button"
            disabled={!selectedRole}
            onClick={handleConfirm}
            className={`w-full sm:w-auto h-11 px-7 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#4B6F9A] ${
              selectedRole
                ? 'bg-[#003366] hover:bg-[#002244] dark:bg-[#4B6F9A] dark:hover:bg-[#3D5E85] text-white shadow-md shadow-[#003366]/20 hover:shadow-lg active:scale-[0.98]'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            <span>{getCtaLabel()}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>

    </div>
  );
};
