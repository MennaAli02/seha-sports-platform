import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { IC, LOGO_SVG } from '../../data/icons';
import { Menu, LogOut } from 'lucide-react';

export const SideNavBar = () => {
  const { isRTL, L } = useLanguage();
  const { currentRoute, navigate, sidebarExpanded, toggleSidebar, cfg, showToast, userRole, currentUser, logout } = useSeha();

  // Close drawer on ESC key on mobile/tablet
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && sidebarExpanded && typeof window !== 'undefined' && window.innerWidth < 1024) {
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarExpanded, toggleSidebar]);

  const handleNavClick = (routeKey) => {
    navigate(routeKey);
    // On mobile/tablet, close drawer after navigation
    if (sidebarExpanded && typeof window !== 'undefined' && window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const handleLogout = () => {
    logout();
    if (sidebarExpanded && typeof window !== 'undefined' && window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const sections = [
    {
      title: ['العمليات الرئيسية', 'Core Operations'],
      routes: [
        { k: 'dash', ic: 'dash', t: ['لوحة المؤشرات', 'Dashboard'] },
        { k: 'consent', ic: 'shield', t: ['موافقات الاطلاع', 'Access consents'] },
        { k: 'cert', ic: 'cert', t: ['سجل الشهادات', 'Certificates'] },
        { k: 'verify', ic: 'scan', t: ['التحقق العام', 'Public verification'] }
      ]
    },
    {
      title: ['المواطن', 'Citizen'],
      routes: [
        { k: 'citizen-home', ic: 'home', t: ['الرئيسية', 'Home'] },
        ...(userRole === 'guardian' ? [{ k: 'citizen-family', ic: 'club', t: ['إدارة العائلة', 'Family Hub'] }] : []),
        { k: 'citizen-bookings', ic: 'cal', t: ['حجز كشف', 'Bookings'] },
        { k: 'citizen-certs', ic: 'cert', t: ['الشهادات', 'Certificates'] },
        { k: 'citizen-history', ic: 'steth', t: ['السجل الطبي', 'Medical History'] },
        { k: 'citizen-consents', ic: 'shield', t: ['الموافقات', 'Consents'] }
      ]
    },
    {
      title: ['البوابات والعيادات', 'Portals & Clinical'],
      routes: [
        { k: 'club', ic: 'club', t: ['بوابة النادي', 'Club portal'] },
        { k: 'hosp', ic: 'hosp', t: ['بوابة المستشفى', 'Hospital portal'] },
        { k: 'doctor', ic: 'steth', t: ['شاشة الطبيب', 'Physician screen'] }
      ]
    },
    {
      title: ['التقارير والإدارة', 'Analytics & Admin'],
      routes: [
        { k: 'reports', ic: 'rep', t: ['التقارير التنفيذية', 'Executive reports'] },
        { k: 'clubs', ic: 'book', t: ['تسجيل الأندية', 'Club registration'] },
        { k: 'hosps', ic: 'hospb', t: ['تسجيل المستشفيات', 'Hospital registration'] },
        { k: 'setup', ic: 'gear', t: ['إعداد المنظومة', 'Configuration'] }
      ]
    }
  ];

  const isCitizenRole = userRole === 'citizen' || userRole === 'athlete' || userRole === 'guardian';

  const visibleSections = isCitizenRole
    ? sections.filter(sec => sec.title[1] === 'Citizen')
    : sections;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarExpanded && (
        <div
          className="sidebar-backdrop lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        id="side"
        className={`no-print ${sidebarExpanded ? 'expanded' : ''}`}
        aria-label={isRTL ? 'شريط التنقل الجانبي' : 'Sidebar navigation'}
      >
        {/* Top Header: Burger / Close Icon with Logo, Title, and Description */}
        <div className="side-top-header">
          <button
            type="button"
            onClick={toggleSidebar}
            className="side-burger-btn"
            title={sidebarExpanded ? (isRTL ? 'طي القائمة' : 'Collapse sidebar') : (isRTL ? 'توسيع القائمة' : 'Expand sidebar')}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5 shrink-0" />
          </button>

          {sidebarExpanded && (
            <div
              onClick={() => handleNavClick(isCitizenRole ? 'citizen-home' : 'dash')}
              className="side-brand cursor-pointer group"
              title={L(cfg.org.ar, cfg.org.en)}
            >
              <div className="side-logo shrink-0">
                {LOGO_SVG}
              </div>
              <div className="side-brand-text min-w-0 flex-1">
                <b className="block leading-tight text-[13px] font-bold text-white">{L(cfg.org.ar, cfg.org.en)}</b>
                <small className="block leading-snug text-[10.5px] text-white/80 mt-0.5">{L(cfg.org.sub.ar, cfg.org.sub.en)}</small>
              </div>
            </div>
          )}
        </div>

        {/* Nav Content */}
        <div className="side-nav-content">
          {visibleSections.map((sec, secIdx) => (
            <React.Fragment key={`sec-${secIdx}`}>
              {secIdx > 0 && <div className="sep" />}
              {sidebarExpanded && (
                <div className="side-group-title">
                  {L(sec.title[0], sec.title[1])}
                </div>
              )}
              {sec.routes.map((r) => {
                const isOn = currentRoute === r.k || (userRole === 'citizen' && r.k === 'citizen-certs' && currentRoute === 'cert');
                const title = L(r.t[0], r.t[1]);
                return (
                  <button
                    key={r.k}
                    className={`ic ${isOn ? 'on' : ''}`}
                    title={title}
                    aria-label={title}
                    onClick={() => handleNavClick(r.k)}
                  >
                    {IC[r.ic]}
                    {sidebarExpanded && (
                      <span className="truncate flex-1 select-none">
                        {title}
                      </span>
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        {/* Bottom Footer: Log out */}
        <div className="side-footer">
          <button
            type="button"
            className="side-logout-btn"
            onClick={handleLogout}
            title={L('تسجيل الخروج', 'Log out')}
            aria-label={L('تسجيل الخروج', 'Log out')}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarExpanded && (
              <span className="truncate flex-1 select-none font-semibold">
                {L('تسجيل الخروج', 'Log out')}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

