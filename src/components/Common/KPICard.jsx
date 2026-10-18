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
    <div className={`relative bg-[var(--card)] border border-[var(--line)] rounded-xl p-3.5 sm:p-4 min-w-0 shadow-[var(--shadow)] hover:shadow-[var(--shadow-md)] transition-all duration-200 overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Accent border stripe on inline-start */}
      <span className={`absolute top-0 start-0 w-1.5 h-full ${colors.stripe}`} />

      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <b className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none block font-mono text-[var(--ink)] truncate">
            {value}
          </b>
          <span className="text-xs font-semibold text-[var(--muted)] mt-1.5 block leading-snug">
            {label}
          </span>
        </div>
        {icon && (
          <div className={`p-2 rounded-lg ${colors.iconBg} ${colors.iconText} flex-none transition-transform duration-200 hover:scale-105 flex items-center justify-center`}>
            {renderIcon()}
          </div>
        )}
      </div>

      {subtext && (
        <div className="mt-2.5 pt-1.5 border-t border-[var(--line)] text-[11px] sm:text-[11.5px] text-[var(--muted)] font-medium flex items-center gap-1 leading-tight">
          {subtext}
        </div>
      )}
    </div>
  );
};
