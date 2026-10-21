import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useSeha } from '../../../context/SehaContext';
import {
  Users,
  UserCheck,
  ChevronDown,
  Check,
  ArrowRightLeft,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const ActiveChildBanner = () => {
  const { isRTL, L } = useLanguage();
  const {
    players,
    selectedPlayerIndex,
    setSelectedPlayerIndex,
    cfg,
    navigate,
    userRole,
    showToast,
    SP_EN
  } = useSeha();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Only display for guardian role managing athlete children
  if (userRole !== 'guardian') {
    return null;
  }

  const currentChild = players[selectedPlayerIndex] || players[1] || players[0];
  const familyChildren = players.slice(1);

  const handleSelect = (idx) => {
    setSelectedPlayerIndex(idx);
    setIsOpen(false);
    const target = players[idx];
    const relText = target?.rel?.ar || 'الابن';
    showToast(`تم التبديل إلى ملف: ${target.name} (${relText})`);
  };

  return (
    <div className="card bg-gradient-to-r from-[#DFE7F1] via-[#EEF3F8] to-[#DFE7F1] dark:from-[#142F55] dark:via-[#0E2442] dark:to-[#142F55] border border-[#BDD0E4] dark:border-[#274D7E] p-[var(--card-padding)] shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--space-4)]">
        
        {/* Start: Identity of the currently active child */}
        <div className="flex items-center gap-[var(--space-3)] min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#003366] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
            {currentChild.name.charAt(0)}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-[var(--space-2)] mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#003366] text-white tracking-wide shrink-0">
                {L('الملف النشط حاليًا', 'Active Child Profile')}
              </span>
              <span className="text-xs font-semibold text-[#4A607A] dark:text-[#ABC7E8] truncate">
                {currentChild.rel?.ar || L('الابن', 'Son')}
              </span>
              <span className="hidden xs:inline-flex items-center gap-1 text-xs font-bold text-[#16845B] dark:text-[#34D399]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{L('موثق رسميًا', 'Verified')}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-[var(--space-2)]">
              <b className="text-base font-bold text-[#003366] dark:text-[#F2F6FB] truncate">
                {currentChild.name}
              </b>
              <span className="text-[#4A607A] dark:text-[#94B0D0] text-xs sm:text-sm">
                ({currentChild.age} {L('سنة', 'years')} · {isRTL ? cfg.sports[currentChild.sp] : SP_EN[cfg.sports[currentChild.sp]] || cfg.sports[currentChild.sp]})
              </span>
            </div>
          </div>
        </div>

        {/* End: Quick Child Switcher Dropdown & Family Hub Link */}
        <div className="flex items-center gap-[var(--space-2)] shrink-0 self-start sm:self-center">
          
          {/* Quick Switch Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="h-10 px-3.5 rounded-xl bg-white dark:bg-[#1B355A] hover:bg-slate-50 dark:hover:bg-[#274D7E] text-[#003366] dark:text-[#F2F6FB] font-bold text-xs sm:text-sm border border-[#BDD0E4] dark:border-[#274D7E] shadow-2xs flex items-center gap-2 cursor-pointer transition-all"
              title={L('التبديل بين ملفات الأبناء', 'Switch to another child')}
            >
              <ArrowRightLeft className="w-4 h-4 text-[#4B6F9A]" />
              <span>{L('تبديل الابن', 'Switch Child')}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div
                className="absolute top-full mt-1.5 inset-inline-end-0 z-50 w-72 rounded-xl bg-[var(--card)] border border-[var(--line)] shadow-xl p-2 text-start animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-2 py-1 text-[11px] font-bold text-[var(--muted)] border-b border-[var(--line)] mb-1">
                  {L('اختر الرياضي من بين الأبناء:', 'Select connected child:')}
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {familyChildren.map((ch, idx) => {
                    const actualIdx = idx + 1;
                    const isSelected = selectedPlayerIndex === actualIdx;
                    return (
                      <div
                        key={ch.id || actualIdx}
                        onClick={() => handleSelect(actualIdx)}
                        className={`p-2 rounded-lg cursor-pointer transition-all flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-[var(--primary-50)] text-[var(--primary-700)] font-bold'
                            : 'hover:bg-[var(--primary-50)]/60 text-[var(--ink)]'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate">{ch.name}</div>
                          <div className="text-[10px] text-[var(--muted)] truncate">
                            {ch.rel?.ar || 'ابن'} · {ch.age} {L('سنة', 'y')} · {cfg.sports[ch.sp]}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#16845B] shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Manage Family Link */}
          <button
            type="button"
            onClick={() => navigate('citizen-family')}
            className="px-3 py-1.5 rounded-xl bg-[#4B6F9A] hover:bg-[#3D5E85] text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
            title={L('فتح صفحة إدارة ملفات العائلة', 'Open family management')}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{L('إدارة العائلة', 'Family Hub')}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
