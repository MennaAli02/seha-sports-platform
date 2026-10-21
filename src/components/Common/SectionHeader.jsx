import React from 'react';

/**
 * Reusable SectionHeader Component
 * Conforms to the Seha unified spacing system:
 * - Title and badge are vertically centered on the same baseline
 * - Subtitle is 6-8px below the title
 * - Gap between the header and its content is 16px (var(--space-4))
 * - Logical properties throughout (RTL & LTR symmetric)
 */
export const SectionHeader = ({
  title,
  badge = null,
  subtitle = null,
  action = null,
  icon: Icon = null,
  className = ''
}) => {
  return (
    <div className={`section-header-wrap ${className}`}>
      <div className="section-header-top">
        <div className="section-header-title-group">
          <h2 className="section-header-title">
            {Icon ? (
              <Icon className="w-4.5 h-4.5 text-[var(--primary)] shrink-0" />
            ) : (
              <span className="section-header-dot" />
            )}
            <span>{title}</span>
          </h2>
          {badge && <span className="section-header-badge">{badge}</span>}
        </div>
        {action && <div className="section-header-action">{action}</div>}
      </div>
      {subtitle && <p className="section-header-subtitle">{subtitle}</p>}
    </div>
  );
};
