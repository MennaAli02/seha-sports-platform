import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useSeha } from '../../context/SehaContext';
import { LOGO_SVG } from '../../data/icons';
import { todayFormatted } from '../../data/mockData';
import { Sun, Moon, Search, HelpCircle, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export const TopNavBar = ({ onOpenSearch, onOpenHelp }) => {
  const { language, toggleLanguage, isRTL, L } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { currentRoute, cfg, sidebarExpanded, toggleSidebar } = useSeha();

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
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="p-2 text-[#64748B] hover:text-[#123B4A] dark:text-[#87A2B2] dark:hover:text-[#EDF4F7] hover:bg-[#DDF4F1]/40 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
        title={sidebarExpanded ? (isRTL ? 'طي القائمة' : 'Collapse sidebar') : (isRTL ? 'توسيع القائمة' : 'Expand sidebar')}
        aria-label="Toggle navigation menu"
      >
        {sidebarExpanded ? (
          <PanelLeftClose className="w-4 h-4" />
        ) : (
          <Menu className="w-4 h-4" />
        )}
      </button>

      {/* Brand Branding */}
      <div className="brand">
        {LOGO_SVG}
        <div>
          <b>{L(cfg.org.ar, cfg.org.en)}</b>
          <small>
            {L(cfg.org.sub.ar, cfg.org.sub.en)} · {L(cfg.org.decree.ar, cfg.org.decree.en)}
          </small>
        </div>
      </div>

      {/* Contextual Breadcrumbs */}
      <div className="crumb">
        <span>{L(cfg.org.owner.ar, cfg.org.owner.en)}</span>
        <span className="opacity-40">/</span>
        <b>{getRouteTitle()}</b>
      </div>

      {/* Search trigger with shortcut pill */}
      <div className="flex items-center gap-2 no-print">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#64748B] hover:text-[#123B4A] dark:text-[#87A2B2] dark:hover:text-[#EDF4F7] bg-[#F4F7FA] dark:bg-[#0E242E] hover:bg-[#DDF4F1]/40 dark:hover:bg-[#143542] rounded-lg border border-[#DCE5EC] dark:border-[#1D3A4B] transition-all cursor-pointer shadow-2xs"
          title={isRTL ? 'بحث سريع (Ctrl + K)' : 'Quick search (Ctrl + K)'}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-medium">{isRTL ? 'بحث...' : 'Search...'}</span>
          <kbd className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.5 bg-white dark:bg-[#132631] border border-[#DCE5EC] dark:border-[#1D3A4B] rounded text-[#64748B] dark:text-[#87A2B2]">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={onOpenHelp}
          className="p-2 text-[#64748B] hover:text-[#123B4A] dark:text-[#87A2B2] dark:hover:text-[#EDF4F7] hover:bg-[#DDF4F1]/40 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          title={isRTL ? 'الدليل والقرارات' : 'Guide & Decree'}
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 text-[#64748B] hover:text-[#123B4A] dark:text-[#87A2B2] dark:hover:text-[#EDF4F7] hover:bg-[#DDF4F1]/40 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          title={isDark ? (isRTL ? 'الوضع النهاري' : 'Light mode') : (isRTL ? 'الوضع الليلي' : 'Dark mode')}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

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
    </header>
  );
};
