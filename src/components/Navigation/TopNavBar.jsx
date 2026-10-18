import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useSeha } from '../../context/SehaContext';
import { todayFormatted } from '../../data/mockData';
import { Sun, Moon, HelpCircle, Menu, Bell } from 'lucide-react';

export const TopNavBar = ({ onOpenSearch, onOpenHelp }) => {
  const { toggleLanguage, isRTL, L } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { currentRoute, toggleSidebar } = useSeha();

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
      case 'mobile': return isRTL ? 'تطبيق المواطن' : 'Citizen app';
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
      {/* Start side: Mobile toggle & Route Title (breadcrumb removed as requested) */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-50)] rounded-xl transition-colors cursor-pointer"
          title={isRTL ? 'القائمة' : 'Menu'}
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <h2 className="text-sm sm:text-base font-bold text-[var(--ink)] tracking-tight">
          {getRouteTitle()}
        </h2>
      </div>

      {/* Action controls */}
      <div className="flex items-center gap-2 no-print">

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
          className="p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-50)] rounded-full transition-colors cursor-pointer"
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

        {/* User profile capsule */}
        <div className="user">
          <div className="av">{isRTL ? 'أ' : 'A'}</div>
          <div style={{ lineHeight: 1.25 }}>
            <b>{L('مسؤول المنظومة', 'Platform admin')}</b>
            <span className="mut" style={{ fontSize: '10.5px' }}>
              {todayFormatted()}
            </span>
          </div>
        </div>

        {/* Language Toggle */}
        <button className="lang" onClick={toggleLanguage} title={isRTL ? 'Switch to English' : 'التحويل للعربية'}>
          {L('EN', 'عربي')}
        </button>
      </div>
    </header>
  );
};
