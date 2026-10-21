import React from 'react';

/**
 * Super Admin Command & Governance Illustration
 * Designed to match Seha Sports clinical palette:
 * - #003366 (Deep Navy)
 * - #4B6F9A (Clinical Slate Blue)
 * - #0066CC (Accent Cyan/Blue)
 * - #DFE7F1 (Soft Ice Lavender)
 * - #F4F6F9 (Background Analytical Light)
 */
export const SuperAdminIllustration = ({ isSelected }) => (
  <svg
    viewBox="0 0 280 170"
    className="w-full h-full max-h-[85px] sm:max-h-[95px] transition-transform duration-300 group-hover:scale-105"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Floor soft shadow */}
    <ellipse cx="140" cy="158" rx="105" ry="10" fill="#DFE7F1" fillOpacity="0.8" className="dark:fill-[#1E426F]/40" />

    {/* Platform Desk */}
    <rect x="35" y="128" width="210" height="6" rx="3" fill="#4B6F9A" fillOpacity="0.85" />
    <rect x="45" y="134" width="190" height="3" rx="1.5" fill="#003366" fillOpacity="0.4" />
    {/* Desk legs */}
    <line x1="60" y1="134" x2="60" y2="158" stroke="#4B6F9A" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="220" y1="134" x2="220" y2="158" stroke="#4B6F9A" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="56" y1="158" x2="64" y2="158" stroke="#003366" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="216" y1="158" x2="224" y2="158" stroke="#003366" strokeWidth="3.5" strokeLinecap="round" />

    {/* Secondary Monitor (Left - Analytics & Logs) */}
    <g transform="translate(38, 50)">
      <rect x="22" y="56" width="10" height="22" rx="2" fill="#4B6F9A" />
      <ellipse cx="27" cy="78" rx="14" ry="4" fill="#003366" fillOpacity="0.3" />
      <rect x="0" y="0" width="54" height="58" rx="6" fill="#003366" stroke="#4B6F9A" strokeWidth="2" />
      <rect x="3" y="3" width="48" height="52" rx="4" fill="#0E2442" />
      {/* Mini Bar Chart */}
      <rect x="8" y="36" width="5" height="14" rx="1" fill="#4B6F9A" />
      <rect x="16" y="26" width="5" height="24" rx="1" fill="#0066CC" />
      <rect x="24" y="18" width="5" height="32" rx="1" fill="#DFE7F1" />
      <rect x="32" y="30" width="5" height="20" rx="1" fill="#16845B" />
      {/* Mini ECG trace */}
      <path d="M7 11h8l3-6 4 10 3-4h14" stroke="#0066CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    {/* Main Command Monitor (Center - Platform Governance) */}
    <g transform="translate(95, 20)">
      {/* Stand */}
      <rect x="40" y="86" width="12" height="22" rx="2" fill="#4B6F9A" />
      <ellipse cx="46" cy="108" rx="22" ry="5" fill="#003366" fillOpacity="0.4" />

      {/* Screen Frame */}
      <rect x="0" y="0" width="92" height="88" rx="8" fill="#003366" stroke="#4B6F9A" strokeWidth="2.5" />
      {/* Screen Display */}
      <rect x="4" y="4" width="84" height="80" rx="6" fill="#102542" />

      {/* Top Header bar inside screen */}
      <rect x="8" y="8" width="76" height="12" rx="2" fill="#162E4F" />
      <circle cx="14" cy="14" r="2.5" fill="#DC2626" />
      <circle cx="21" cy="14" r="2.5" fill="#D97706" />
      <circle cx="28" cy="14" r="2.5" fill="#16845B" />
      <rect x="45" y="12" width="34" height="4" rx="2" fill="#4B6F9A" fillOpacity="0.8" />

      {/* Center Shield & Security Emblem */}
      <g transform="translate(30, 26)">
        <path
          d="M16 2L4 7v9c0 7.7 5.1 14.9 12 17 6.9-2.1 12-9.3 12-17V7L16 2z"
          fill="#4B6F9A"
          fillOpacity={isSelected ? "0.95" : "0.75"}
          stroke="#0066CC"
          strokeWidth="1.5"
        />
        {/* Shield Pulse / Checkmark */}
        <path
          d="M10 16l4 4 8-8"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Status metrics below shield */}
      <rect x="10" y="65" width="22" height="12" rx="2.5" fill="#162E4F" />
      <rect x="13" y="69" width="16" height="4" rx="1" fill="#DFE7F1" />
      <rect x="36" y="65" width="22" height="12" rx="2.5" fill="#162E4F" />
      <rect x="39" y="69" width="16" height="4" rx="1" fill="#4B6F9A" />
      <rect x="62" y="65" width="22" height="12" rx="2.5" fill="#162E4F" />
      <rect x="65" y="69" width="16" height="4" rx="1" fill="#0066CC" />
    </g>

    {/* Secondary Monitor / Tablet (Right - System Network & Settings) */}
    <g transform="translate(192, 54)">
      <rect x="18" y="52" width="10" height="22" rx="2" fill="#4B6F9A" />
      <ellipse cx="23" cy="74" rx="14" ry="4" fill="#003366" fillOpacity="0.3" />
      <rect x="0" y="0" width="50" height="54" rx="6" fill="#003366" stroke="#4B6F9A" strokeWidth="2" />
      <rect x="3" y="3" width="44" height="48" rx="4" fill="#0E2442" />

      {/* Network Nodes */}
      <circle cx="15" cy="16" r="4" fill="#4B6F9A" />
      <circle cx="35" cy="22" r="4" fill="#0066CC" />
      <circle cx="25" cy="38" r="4" fill="#16845B" />
      <line x1="15" y1="16" x2="35" y2="22" stroke="#DFE7F1" strokeWidth="1.2" strokeDasharray="2 2" />
      <line x1="35" y1="22" x2="25" y2="38" stroke="#DFE7F1" strokeWidth="1.2" strokeDasharray="2 2" />
      <line x1="15" y1="16" x2="25" y2="38" stroke="#DFE7F1" strokeWidth="1.2" strokeDasharray="2 2" />
    </g>
  </svg>
);
