import React from 'react';

/**
 * Parent & Guardian Family Account Illustration
 * Matches Seha Sports clinical and family account palette:
 * - #003366 (Deep Navy)
 * - #4B6F9A (Clinical Slate Blue)
 * - #0066CC (Accent Blue)
 * - #DFE7F1 (Soft Ice Lavender)
 * - #16845B (Verified Clinical Green)
 */
export const GuardianIllustration = ({ isSelected }) => (
  <svg
    viewBox="0 0 280 170"
    className="w-full h-full max-h-[85px] sm:max-h-[95px] transition-transform duration-300 group-hover:scale-105"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Floor soft shadow */}
    <ellipse cx="140" cy="158" rx="105" ry="10" fill="#DFE7F1" fillOpacity="0.8" className="dark:fill-[#1E426F]/40" />

    {/* Connecting Family Mesh arc */}
    <path
      d="M40 145 C80 135, 120 150, 160 142 C200 134, 230 146, 255 142"
      stroke="#4B6F9A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="4 4"
      strokeOpacity="0.6"
      className="dark:stroke-[#5C84B5]"
    />

    {/* Left Child Token: Girl Athlete (Gymnastics / Swimming) */}
    <g transform="translate(42, 45)">
      <circle cx="22" cy="22" r="22" fill="#FFFFFF" stroke="#4B6F9A" strokeWidth="2" className="dark:fill-[#0E2442]" />
      <circle cx="22" cy="16" r="7" fill="#0066CC" />
      <path d="M12 34 C12 28, 16 26, 22 26 C28 26, 32 28, 32 34" fill="#0066CC" fillOpacity="0.85" />
      {/* Mini verified green dot */}
      <circle cx="33" cy="11" r="5" fill="#16845B" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M31.5 11l1 1 2-2" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      {/* Age badge */}
      <rect x="7" y="38" width="30" height="11" rx="4" fill="#DFE7F1" className="dark:fill-[#1E426F]" />
      <text x="22" y="46" textAnchor="middle" fill="#003366" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">12 y</text>
    </g>

    {/* Right Child Token: Boy Athlete (Taekwondo / Football) */}
    <g transform="translate(194, 45)">
      <circle cx="22" cy="22" r="22" fill="#FFFFFF" stroke="#4B6F9A" strokeWidth="2" className="dark:fill-[#0E2442]" />
      <circle cx="22" cy="16" r="7" fill="#16845B" />
      <path d="M12 34 C12 28, 16 26, 22 26 C28 26, 32 28, 32 34" fill="#16845B" fillOpacity="0.85" />
      {/* Mini verified badge */}
      <circle cx="33" cy="11" r="5" fill="#0066CC" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M31.5 11l1 1 2-2" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      {/* Age badge */}
      <rect x="7" y="38" width="30" height="11" rx="4" fill="#DFE7F1" className="dark:fill-[#1E426F]" />
      <text x="22" y="46" textAnchor="middle" fill="#003366" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">14 y</text>
    </g>

    {/* Center Token: Parent / Guardian Family Shield & Hub */}
    <g transform="translate(108, 18)">
      {/* Guardian Container Card */}
      <rect
        x="0"
        y="0"
        width="64"
        height="118"
        rx="14"
        fill="#003366"
        stroke={isSelected ? "#4B6F9A" : "#3D5E85"}
        strokeWidth="2.5"
      />
      {/* Card Inner Face */}
      <rect x="4" y="5" width="56" height="108" rx="10" fill="#F4F6F9" className="dark:fill-[#0E2442]" />

      {/* Header Capsule with Guardian Icon */}
      <rect x="7" y="10" width="50" height="26" rx="6" fill="#4B6F9A" />
      <circle cx="20" cy="22" r="6" fill="#FFFFFF" />
      <path d="M13 32 C13 28, 16 26, 20 26 C24 26, 27 28, 27 32" fill="#FFFFFF" fillOpacity="0.9" />
      <circle cx="36" cy="20" r="4" fill="#DFE7F1" />
      <circle cx="45" cy="21" r="3.5" fill="#DFE7F1" />

      {/* Switcher Carousel Indicator inside phone */}
      <g transform="translate(10, 42)">
        <rect x="0" y="0" width="44" height="28" rx="6" fill="#FFFFFF" stroke="#DCE4EC" strokeWidth="1" className="dark:fill-[#162E4F]" />
        {/* Child 1 mini representation */}
        <circle cx="12" cy="14" r="6" fill="#0066CC" fillOpacity="0.2" stroke="#0066CC" strokeWidth="1" />
        <circle cx="12" cy="12" r="2.5" fill="#0066CC" />
        {/* Switching arrows icon */}
        <path d="M20 12 L24 12 M23 10 L25 12 L23 14" stroke="#4B6F9A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 16 L20 16 M21 18 L19 16 L21 14" stroke="#4B6F9A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Child 2 mini representation */}
        <circle cx="32" cy="14" r="6" fill="#16845B" fillOpacity="0.2" stroke="#16845B" strokeWidth="1" />
        <circle cx="32" cy="12" r="2.5" fill="#16845B" />
      </g>

      {/* Family Medical Fitness Status Badge */}
      <g transform="translate(10, 75)">
        <rect x="0" y="0" width="44" height="18" rx="5" fill="#E8F6F0" stroke="#16845B" strokeWidth="1" className="dark:fill-[#0d3324]" />
        <circle cx="9" cy="9" r="4" fill="#16845B" />
        <path d="M7.5 9l1 1 2-2" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <text x="27" y="12" textAnchor="middle" fill="#16845B" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">4 ACTIVE</text>
      </g>

      {/* Bottom Hub pill */}
      <rect x="12" y="98" width="40" height="9" rx="4.5" fill="#003366" />
      <rect x="20" y="101" width="24" height="3" rx="1.5" fill="#FFFFFF" />
    </g>

    {/* Connection beams from Guardian to Left & Right Children */}
    <path d="M108 55 C90 55, 75 58, 64 62" stroke="#0066CC" strokeWidth="1.5" strokeDasharray="3 3" />
    <path d="M172 55 C190 55, 205 58, 216 62" stroke="#16845B" strokeWidth="1.5" strokeDasharray="3 3" />
  </svg>
);
