import React from 'react';

export const SehaLogo = ({ size = 34, className = '', withPulse = false }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        fill="none"
        aria-label="Seha SportsMed"
        className="flex-none transition-transform hover:scale-105 duration-200"
      >
        <rect x="2" y="2" width="44" height="44" rx="12" fill="#123B4A" />
        <circle cx="24" cy="24" r="15" stroke="#087F8C" strokeWidth="2.2" />
        <path
          d="M11 24h5.5l2.5-6 5 12 3.5-9 2 3H37"
          stroke="#16A085"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withPulse && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A085] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#087F8C]"></span>
        </span>
      )}
    </div>
  );
};
