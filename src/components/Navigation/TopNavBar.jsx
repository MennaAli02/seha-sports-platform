import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useSeha } from '../../context/SehaContext';
import { LOGO_SVG } from '../../data/icons';
import { todayFormatted } from '../../data/mockData';
import { Sun, Moon, Search, HelpCircle, Menu, PanelLeftClose, Bell } from 'lucide-react';

export const TopNavBar = ({ onOpenSearch, onOpenHelp }) => {
  const { toggleLanguage, isRTL, L } = useLanguage();
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
        className="p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-50)] rounded-xl transition-colors cursor-pointer"
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
          <b style={{ color: 'var(--ink)' }}>{L(cfg.org.ar, cfg.org.en)}</b>
          <small style={{ color: 'var(--muted)' }}>
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

      {/* Action controls */}
      <div className="flex items-center gap-2 no-print">
        {/* Search trigger with shortcut pill */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--ink)] bg-[var(--primary-50)] hover:bg-[var(--primary-100)] rounded-full border border-[var(--line)] transition-all cursor-pointer"
          title={isRTL ? 'بحث سريع (Ctrl + K)' : 'Quick search (Ctrl + K)'}
        >
          <Search className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span className="hidden sm:inline font-medium">{isRTL ? 'بحث...' : 'Search...'}</span>
          <kbd className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.5 bg-[var(--card)] border border-[var(--line)] rounded-full text-[var(--muted)]">
            ⌘K
          </kbd>
        </button>

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
