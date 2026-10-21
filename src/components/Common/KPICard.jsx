import React from 'react';

export const KPICard = ({ 
  value, 
  label, 
  variant = 'primary', 
  type = null, 
  icon = null, 
  subtext = null, 
  className = '' 
}) => {
  const chosenVariant = type || variant || 'primary';

  const getColors = () => {
    switch (chosenVariant) {
      case 'g':
      case 'green':
      case 'emerald':
      case 'success':
        return {
          stripe: 'bg-[var(--success)]',
          iconBg: 'bg-[var(--success-bg)]',
          iconText: 'text-[var(--success-dark)]'
        };
      case 'a':
      case 'amber':
      case 'warning':
        return {
          stripe: 'bg-[var(--warning)]',
          iconBg: 'bg-[var(--warning-bg)]',
          iconText: 'text-[var(--warning-dark)]'
        };
      case 'r':
      case 'red':
      case 'error':
      case 'danger':
        return {
          stripe: 'bg-[var(--danger)]',
          iconBg: 'bg-[var(--danger-bg)]',
          iconText: 'text-[var(--danger-dark)]'
        };
      case 'n':
      case 'brand':
      case 'primary-700':
        return {
          stripe: 'bg-[var(--primary-700)]',
          iconBg: 'bg-[var(--primary-100)]',
          iconText: 'text-[var(--primary-700)]'
        };
      case 'teal':
        return {
          stripe: 'bg-[var(--teal)]',
          iconBg: 'bg-[var(--teal-bg)]',
          iconText: 'text-[var(--teal-dark)]'
        };
      case 'lavender':
        return {
          stripe: 'bg-[var(--lavender)]',
          iconBg: 'bg-[var(--lavender-bg)]',
          iconText: 'text-[var(--lavender-dark)]'
        };
      case 'medical':
      case 'primary':
      default:
        return {
          stripe: 'bg-[var(--primary)]',
          iconBg: 'bg-[var(--primary-50)]',
          iconText: 'text-[var(--primary-700)]'
        };
    }
  };

  const colors = getColors();

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return icon;
    }
    const IconComponent = icon;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className={`relative bg-[var(--card)] border border-[var(--line)] rounded-[var(--radius-card)] p-[var(--card-padding)] min-h-[110px] h-full min-w-0 shadow-[var(--shadow)] hover:shadow-[var(--shadow-md)] transition-all duration-200 overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Accent border stripe on inline-start, clipped by card's overflow-hidden */}
      <span 
        className={`absolute top-0 bottom-0 w-1.5 h-full ${colors.stripe}`} 
        style={{ insetInlineStart: 0 }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-[var(--space-3)]">
        <div className="min-w-0">
          <b className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none block text-[var(--ink)] truncate tabular-nums">
            {value}
          </b>
          <span className="text-sm font-bold text-[var(--muted)] mt-1.5 block leading-snug">
            {label}
          </span>
        </div>
        {icon && (
          <div className={`p-2.5 rounded-xl ${colors.iconBg} ${colors.iconText} flex-none transition-transform duration-200 hover:scale-105 flex items-center justify-center`}>
            {renderIcon()}
          </div>
        )}
      </div>

      {subtext && (
        <div className="mt-3 pt-2 border-t border-[var(--line)] text-xs text-[var(--muted)] font-medium flex items-center gap-[var(--control-gap)] leading-tight">
          {subtext}
        </div>
      )}
    </div>
  );
};
