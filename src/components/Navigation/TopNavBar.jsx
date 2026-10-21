import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useSeha } from '../../context/SehaContext';
import { Sun, Moon, HelpCircle, Menu, Bell, Globe } from 'lucide-react';
import { PlayerProfileSwitcher } from './PlayerProfileSwitcher';

export const TopNavBar = ({ onOpenSearch, onOpenHelp }) => {
  const { toggleLanguage, isRTL, L } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { currentRoute, toggleSidebar, currentUser, userRole } = useSeha();

  // Keyboard shortcut Ctrl+K or Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const getRouteTitle = () => {
    switch (currentRoute) {
      case 'dash': return isRTL ? 'لوحة المؤشرات' : 'Dashboard';
      case 'citizen-home': return isRTL ? 'خدمات المواطن — الرئيسية' : 'Citizen — Home';
      case 'citizen-bookings': return isRTL ? 'خدمات المواطن — حجز كشف' : 'Citizen — Bookings';
      case 'citizen-certs': return isRTL ? 'خدمات المواطن — الشهادات' : 'Citizen — Certificates';
      case 'citizen-consents': return isRTL ? 'خدمات المواطن — الموافقات' : 'Citizen — Consents';
      case 'consent': return isRTL ? 'موافقات الاطلاع' : 'Access consents';
      case 'cert': return isRTL ? 'سجل الشهادات' : 'Certificates';
      case 'verify': return isRTL ? 'التحقق العام' : 'Public verification';
      case 'club': return isRTL ? 'بوابة النادي' : 'Club portal';
      case 'hosp': return isRTL ? 'بوابة المستشفى' : 'Hospital portal';
      case 'doctor': return isRTL ? 'شاشة الطبيب' : 'Physician screen';
      case 'reports': return isRTL ? 'التقارير' : 'Reports';
      case 'clubs': return isRTL ? 'تسجيل الأندية' : 'Club registration';
      case 'hosps': return isRTL ? 'تسجيل المستشفيات' : 'Hospital registration';
      case 'setup': return isRTL ? 'إعداد المنظومة' : 'Configuration';
      default: return isRTL ? 'لوحة المؤشرات' : 'Dashboard';
    }
  };

  return (
    <header id="top" className="no-print">
      {/* Start side: Mobile toggle & Route Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-50)] rounded-xl transition-colors cursor-pointer flex-none"
          title={isRTL ? 'القائمة' : 'Menu'}
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <h2 className="text-sm sm:text-base font-bold text-[var(--ink)] tracking-tight truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
          {getRouteTitle()}
        </h2>
      </div>

      {/* Action controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 no-print flex-none">
        {/* Notifications / Help with small red notification dot */}
        <button
          onClick={onOpenHelp}
          className="relative p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-50)] rounded-full transition-colors cursor-pointer"
          title={isRTL ? 'الإشعارات والدليل' : 'Notifications & Guide'}
        >
          <Bell className="w-4 h-4" />
          <span className="notif-dot" />
        </button>

        <button
          onClick={onOpenHelp}
          className="p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-50)] rounded-full transition-colors cursor-pointer hidden sm:flex"
          title={isRTL ? 'الدليل والقرارات' : 'Guide & Decree'}
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-50)] rounded-full transition-colors cursor-pointer"
          title={isDark ? (isRTL ? 'الوضع النهاري' : 'Light mode') : (isRTL ? 'الوضع الليلي' : 'Dark mode')}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Language toggle icon placed to the left */}
        <div className="flex items-center gap-1.5 sm:gap-2" style={{ direction: 'ltr' }}>
          <button
            className="p-2 text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-50)] rounded-full border border-[var(--line)] transition-all cursor-pointer flex items-center justify-center"
            onClick={toggleLanguage}
            title={isRTL ? 'Switch to English' : 'التحويل للعربية'}
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
          </button>

          {/* User profile capsule OR Player/Family Switcher Dropdown */}
          {userRole === 'citizen' || currentRoute.startsWith('citizen-') ? (
            <PlayerProfileSwitcher />
          ) : (
            <div className="user" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
              <div className="av">{currentUser?.avatarLetter || (isRTL ? 'أ' : 'A')}</div>
              <div className="hidden md:flex flex-col text-start">
                <b className="leading-tight text-xs">{currentUser?.name || L('مسؤول المنظومة', 'Platform admin')}</b>
                <span className="text-[10px] text-[var(--muted)] leading-tight">{L(currentUser?.titleAr, currentUser?.titleEn)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
