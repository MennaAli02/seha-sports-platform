import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { IC } from '../../data/icons';

export const SideNavBar = () => {
  const { isRTL, L } = useLanguage();
  const { currentRoute, navigate, sidebarExpanded } = useSeha();

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
    <nav
      id="side"
      className={`no-print ${sidebarExpanded ? 'expanded' : ''}`}
      aria-label={isRTL ? 'شريط التنقل الجانبي' : 'Sidebar navigation'}
    >
      {sections.map((sec, secIdx) => (
        <React.Fragment key={`sec-${secIdx}`}>
          {secIdx > 0 && <div className="sep" />}
          <div className="side-group-title">
            {L(sec.title[0], sec.title[1])}
          </div>
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
    </nav>
  );
};
