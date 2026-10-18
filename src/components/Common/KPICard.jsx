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
        return {
          stripe: 'bg-[#16A085]',
          text: 'text-[#16835F] dark:text-[#20A77A]',
          iconBg: 'bg-[#E4F7F2] dark:bg-[#113B35]',
          iconText: 'text-[#16835F] dark:text-[#20A77A]'
        };
      case 'a':
      case 'amber':
      case 'warning':
        return {
          stripe: 'bg-[#B77912]',
          text: 'text-[#B77912] dark:text-[#E09A20]',
          iconBg: 'bg-[#FEF7E8] dark:bg-[#3D2C10]',
          iconText: 'text-[#B77912] dark:text-[#E09A20]'
        };
      case 'r':
      case 'red':
      case 'error':
        return {
          stripe: 'bg-[#C2414B]',
          text: 'text-[#C2414B] dark:text-[#E55863]',
          iconBg: 'bg-[#FDECEE] dark:bg-[#3D181C]',
          iconText: 'text-[#C2414B] dark:text-[#E55863]'
        };
      case 'n':
      case 'brand':
        return {
          stripe: 'bg-[#123B4A]',
          text: 'text-[#123B4A] dark:text-[#EDF4F7]',
          iconBg: 'bg-[#DDF4F1] dark:bg-[#143542]',
          iconText: 'text-[#123B4A] dark:text-[#7AD3DC]'
        };
      case 'medical':
      case 'primary':
      default:
        return {
          stripe: 'bg-[#087F8C]',
          text: 'text-[#087F8C] dark:text-[#7AD3DC]',
          iconBg: 'bg-[#DDF4F1] dark:bg-[#143542]',
          iconText: 'text-[#087F8C] dark:text-[#7AD3DC]'
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
    <div className={`relative bg-white dark:bg-[#132631] border border-[#DCE5EC] dark:border-[#1D3A4B] rounded-xl p-4 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Accent border stripe on inline-start */}
      <span className={`absolute top-0 start-0 w-1.5 h-full ${colors.stripe}`} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <b className={`text-2xl md:text-3xl font-extrabold tracking-tight leading-none block font-mono ${colors.text}`}>
            {value}
          </b>
          <span className="text-xs font-semibold text-[#64748B] dark:text-[#87A2B2] mt-2 block">
            {label}
          </span>
        </div>
        {icon && (
          <div className={`p-2.5 rounded-lg ${colors.iconBg} ${colors.iconText} flex-none transition-transform duration-200 hover:scale-105 flex items-center justify-center`}>
            {renderIcon()}
          </div>
        )}
      </div>

      {subtext && (
        <div className="mt-3 pt-2 border-t border-[#DCE5EC]/70 dark:border-[#1D3A4B]/70 text-[11px] text-[#64748B] dark:text-[#87A2B2] font-medium flex items-center gap-1">
          {subtext}
        </div>
      )}
    </div>
  );
};
