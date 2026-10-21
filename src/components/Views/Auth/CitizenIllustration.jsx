import React from 'react';

/**
 * Citizen & Athlete Mobile Pass Illustration
 * Matches Seha Sports clinical and athletic palette:
 * - #003366 (Deep Navy)
 * - #4B6F9A (Clinical Slate Blue)
 * - #0066CC (Accent Blue)
 * - #DFE7F1 (Soft Ice Lavender)
 * - #16845B (Verified Clinical Green)
 */
export const CitizenIllustration = ({ isSelected }) => (
  <svg
    viewBox="0 0 280 170"
    className="w-full h-full max-h-[85px] sm:max-h-[95px] transition-transform duration-300 group-hover:scale-105"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Floor soft shadow */}
    <ellipse cx="140" cy="158" rx="100" ry="10" fill="#DFE7F1" fillOpacity="0.8" className="dark:fill-[#1E426F]/40" />

    {/* Athletic Track curved line */}
    <path
      d="M30 148 C70 138, 110 155, 160 145 C210 135, 235 149, 260 143"
      stroke="#DFE7F1"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="4 4"
      className="dark:stroke-[#1E426F]"
    />

    {/* Left Token: Verified Medical Certificate Badge */}
    <g transform="translate(45, 50)">
      <circle cx="20" cy="20" r="20" fill="#003366" stroke="#4B6F9A" strokeWidth="2" />
      <circle cx="20" cy="20" r="15" fill="#16845B" fillOpacity="0.18" />
      {/* Mini Award Ribbon */}
      <path
        d="M20 9l3.2 6.5 7 .9-5 5.1 1.4 7-6.6-3.5-6.6 3.5 1.4-7-5-5.1 7-.9z"
        fill="#16845B"
      />
    </g>

    {/* Right Token: Calendar Appointment Booking */}
    <g transform="translate(195, 48)">
      <rect x="0" y="0" width="44" height="46" rx="8" fill="#FFFFFF" stroke="#4B6F9A" strokeWidth="2" className="dark:fill-[#0E2442]" />
      <path d="M0 13h44" stroke="#003366" strokeWidth="2" />
      <rect x="0" y="0" width="44" height="13" rx="8" fill="#4B6F9A" />
      <line x1="11" y1="-3" x2="11" y2="5" stroke="#003366" strokeWidth="2" strokeLinecap="round" />
      <line x1="33" y1="-3" x2="33" y2="5" stroke="#003366" strokeWidth="2" strokeLinecap="round" />
      {/* Calendar grid dots */}
      <circle cx="13" cy="22" r="2.2" fill="#4B6F9A" />
      <circle cx="22" cy="22" r="2.2" fill="#4B6F9A" />
      <circle cx="31" cy="22" r="2.2" fill="#0066CC" />
      <circle cx="13" cy="33" r="2.2" fill="#16845B" />
      <circle cx="22" cy="33" r="2.2" fill="#4B6F9A" />
      <circle cx="31" cy="33" r="2.2" fill="#DFE7F1" />
    </g>

    {/* Center Modern Smartphone: Citizen Digital Health Pass */}
    <g transform="translate(110, 16)">
      {/* Phone Body */}
      <rect
        x="0"
        y="0"
        width="60"
        height="122"
        rx="13"
        fill="#003366"
        stroke={isSelected ? "#4B6F9A" : "#3D5E85"}
        strokeWidth="2.5"
      />
      {/* Screen area */}
      <rect x="4" y="5" width="52" height="112" rx="9" fill="#F4F6F9" className="dark:fill-[#0E2442]" />

      {/* Speaker / Camera notch */}
      <rect x="21" y="9" width="18" height="3" rx="1.5" fill="#003366" />

      {/* App Header Banner */}
      <rect x="7" y="17" width="46" height="18" rx="4" fill="#4B6F9A" />
      <circle cx="16" cy="26" r="4.5" fill="#FFFFFF" fillOpacity="0.9" />
      <rect x="24" y="22.5" width="24" height="3" rx="1.5" fill="#FFFFFF" />
      <rect x="24" y="27.5" width="16" height="2" rx="1" fill="#DFE7F1" />

      {/* QR Code Pass Card */}
      <g transform="translate(12, 42)">
        <rect x="0" y="0" width="36" height="36" rx="4.5" fill="#FFFFFF" stroke="#DCE4EC" strokeWidth="1" className="dark:fill-[#162E4F]" />
        {/* QR Pattern elements */}
        <rect x="3.5" y="3.5" width="9" height="9" rx="1" fill="#003366" />
        <rect x="5.5" y="5.5" width="5" height="5" fill="#FFFFFF" />
        <rect x="7" y="7" width="2" height="2" fill="#003366" />

        <rect x="23.5" y="3.5" width="9" height="9" rx="1" fill="#003366" />
        <rect x="25.5" y="5.5" width="5" height="5" fill="#FFFFFF" />
        <rect x="27" y="7" width="2" height="2" fill="#003366" />

        <rect x="3.5" y="23.5" width="9" height="9" rx="1" fill="#003366" />
        <rect x="5.5" y="25.5" width="5" height="5" fill="#FFFFFF" />
        <rect x="7" y="27" width="2" height="2" fill="#003366" />

        {/* Center Green Verification Check */}
        <circle cx="18" cy="18" r="5" fill="#16845B" />
        <path d="M16 18l1.5 1.5 3-3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ECG vital signs trace */}
      <path
        d="M9 88h10l2.5-4 3.5 8 2.5-6 2 2h15"
        stroke="#0066CC"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Action pill button at bottom of phone */}
      <rect x="11" y="99" width="38" height="9" rx="4.5" fill="#003366" />
      <rect x="18" y="102" width="24" height="3" rx="1.5" fill="#FFFFFF" />
    </g>
  </svg>
);
