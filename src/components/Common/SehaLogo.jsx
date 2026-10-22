import React from 'react';

/**
 * Official Seha SportsMed Platform Logo
 * Supports icon mark or full brand typography, with light/dark adaptive variants
 */
export const SehaLogo = ({
  size = 34,
  className = '',
  withPulse = false,
  full = false,
  variant = 'auto',
  alt = 'Seha SportsMed Platform'
}) => {
  const isWhite = variant === 'white';
  const isDefault = variant === 'default';

  // If variant is auto, render both default and white with Tailwind dark: classes
  if (variant === 'auto') {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{
          width: full ? 'auto' : size,
          height: size
        }}
      >
        <img
          src={full ? '/seha-logo.png' : '/seha-icon.png'}
          alt={alt}
          className={`h-full w-auto object-contain transition-transform duration-200 hover:scale-105 dark:hidden`}
          style={{ maxHeight: size }}
        />
        <img
          src={full ? '/seha-logo-white.png' : '/seha-icon-white.png'}
          alt={alt}
          className={`h-full w-auto object-contain transition-transform duration-200 hover:scale-105 hidden dark:block`}
          style={{ maxHeight: size }}
        />
        {withPulse && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066CC] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#003366]"></span>
          </span>
        )}
      </div>
    );
  }

  const src = full
    ? (isWhite ? '/seha-logo-white.png' : '/seha-logo.png')
    : (isWhite ? '/seha-icon-white.png' : '/seha-icon.png');

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: full ? 'auto' : size,
        height: size
      }}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-auto object-contain transition-transform duration-200 hover:scale-105"
        style={{ maxHeight: size }}
      />
      {withPulse && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066CC] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#003366]"></span>
        </span>
      )}
    </div>
  );
};
