import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { IC, LOGO_SVG } from '../../data/icons';
import { Menu } from 'lucide-react';

export const SideNavBar = () => {
  const { isRTL, L } = useLanguage();
  const { currentRoute, navigate, sidebarExpanded, toggleSidebar, cfg } = useSeha();

  const sections = [
    {
      title: ['العمليات الرئيسية', 'Core Operations'],
      routes: [
        { k: 'dash', ic: 'dash', t: ['لوحة المؤشرات', 'Dashboard'] },
        { k: 'mobile', ic: 'mobile', t: ['تطبيق المواطن', 'Citizen app'] },
        { k: 'consent', ic: 'shield', t: ['موافقات الاطلاع', 'Access consents'] },
        { k: 'cert', ic: 'cert', t: ['سجل الشهادات', 'Certificates'] },
        { k: 'verify', ic: 'scan', t: ['التحقق العام', 'Public verification'] }
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

  return (
    <aside
      id="side"
      className={`no-print ${sidebarExpanded ? 'expanded' : ''}`}
      aria-label={isRTL ? 'شريط التنقل الجانبي' : 'Sidebar navigation'}
    >
      {/* Top Header: Burger Icon with Logo, Title, and Description */}
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
            onClick={() => navigate('dash')}
            className="side-brand cursor-pointer group"
            title={L(cfg.org.ar, cfg.org.en)}
          >
            <div className="side-logo shrink-0">
              {LOGO_SVG}
            </div>
            <div className="side-brand-text min-w-0 flex-1">
              <b className="truncate block leading-tight">{L(cfg.org.ar, cfg.org.en)}</b>
              <small className="truncate block leading-tight">{L(cfg.org.sub.ar, cfg.org.sub.en)}</small>
            </div>
          </div>
        )}
      </div>

      {/* Nav Content */}
      <div className="side-nav-content">
        {sections.map((sec, secIdx) => (
          <React.Fragment key={`sec-${secIdx}`}>
            {secIdx > 0 && <div className="sep" />}
            {sidebarExpanded && (
              <div className="side-group-title">
                {L(sec.title[0], sec.title[1])}
              </div>
            )}
            {sec.routes.map((r) => {
              const isOn = currentRoute === r.k;
              const title = L(r.t[0], r.t[1]);
              return (
                <button
                  key={r.k}
                  className={`ic ${isOn ? 'on' : ''}`}
                  title={title}
                  aria-label={title}
                  onClick={() => navigate(r.k)}
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
    </aside>
  );
};
