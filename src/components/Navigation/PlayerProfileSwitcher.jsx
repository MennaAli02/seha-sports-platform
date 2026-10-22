import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { SP_EN, getPlayerName, getGuardianName, getRelationshipLabel } from '../../data/mockData';
import {
  UserCheck,
  ChevronDown,
  Check,
  Plus,
  Users,
  User,
  ShieldCheck,
  HeartPulse,
  X
} from 'lucide-react';

export const PlayerProfileSwitcher = () => {
  const { isRTL, L } = useLanguage();
  const {
    players,
    setPlayers,
    selectedPlayerIndex,
    setSelectedPlayerIndex,
    cfg,
    showToast,
    userRole,
    currentUser,
    navigate
  } = useSeha();

  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const dropdownRef = useRef(null);

  // New dependent form state
  const [newDependent, setNewDependent] = useState({
    name: '',
    relationship: 'ابن',
    age: 12,
    gender: 'M',
    sport: 0,
    nationalId: '314051201048' + Math.floor(10 + Math.random() * 90)
  });

  const currentPlayer = players[selectedPlayerIndex] || players[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (idx) => {
    setSelectedPlayerIndex(idx);
    setIsOpen(false);
    const selected = players[idx];
    if (selected) {
      showToast({
        ar: `تم التبديل إلى ملف: ${getPlayerName(selected, true)} (${getRelationshipLabel(selected, true)})`,
        en: `Switched profile to: ${getPlayerName(selected, false)} (${getRelationshipLabel(selected, false)})`
      });
    }
  };

  const handleAddDependent = (e) => {
    if (e) e.preventDefault();
    if (!newDependent.name.trim()) return;

    const newIndex = players.length;
    const parentGuardian = players[0]?.name || 'أحمد يوسف السيد';

    const createdPlayer = {
      id: 'PL-' + (1000 + newIndex),
      name: newDependent.name.trim(),
      g: newDependent.gender,
      gd: parentGuardian,
      rel: {
        ar: `${newDependent.relationship} (تابع عائلي)`,
        en: `${newDependent.relationship === 'ابنة' ? 'Daughter' : 'Son'} (Dependent)`,
        isPrimary: false
      },
      cl: 0,
      hs: 0,
      iss: { y: 2026, m: 10, d: 20 },
      exp: { y: 2027, m: 10, d: 19 },
      doby: 2026 - Number(newDependent.age),
      dobm: 6,
      dobd: 15,
      st: 'fit',
      sp: Number(newDependent.sport),
      age: Number(newDependent.age),
      lv: 2,
      ct: 'SH-26-00' + (4600 + newIndex),
      bk: 'BK-26-01' + (8300 + newIndex),
      nid: newDependent.nationalId,
      gov: 'القاهرة'
    };

    setPlayers((prev) => [...prev, createdPlayer]);
    setSelectedPlayerIndex(newIndex);
    setShowAddModal(false);
    setIsOpen(false);

    showToast(
      isRTL
        ? `تم ربط ملف التابع بنجاح: ${createdPlayer.name}`
        : `Dependent profile connected successfully: ${createdPlayer.name}`
    );

    // Reset form
    setNewDependent({
      name: '',
      relationship: 'ابن',
      age: 12,
      gender: 'M',
      sport: 0,
      nationalId: '314051201048' + Math.floor(10 + Math.random() * 90)
    });
  };

  // Group players into Primary vs Family Dependents
  // Group players into Primary vs Family Dependents
  const primaryPlayer = players[0];
  const familyDependents = players.filter((p, idx) => idx > 0 && (p.rel || idx < 5));

  const getSportName = (spIdx) => {
    const arName = cfg?.sports?.[spIdx] || '';
    if (!isRTL && SP_EN && SP_EN[arName]) {
      return SP_EN[arName];
    }
    return arName || (isRTL ? 'كرة القدم' : 'Football');
  };

  return (
    <div className="relative" ref={dropdownRef} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Trigger Capsule matching user reference */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-white dark:bg-[#131f33] hover:bg-slate-50 dark:hover:bg-[#1a2b45] border border-[#2B5C8F]/75 hover:border-[#1E427B] dark:border-[#4B80BD] h-9 px-3 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer select-none group"
        title={L('التبديل بين ملفات العائلة والتابعين', 'Switch family athlete profiles')}
      >
        <div className="flex items-center gap-1.5 text-[#1E427B] dark:text-[#7EB0E8] font-bold text-xs shrink-0">
          {userRole === 'guardian' ? (
            <>
              <Users className="w-4 h-4 stroke-[2.2]" />
              <span>{L('تبديل الابن:', 'Switch Son:')}</span>
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4 stroke-[2.2]" />
              <span>{L('اللاعب:', 'Athlete:')}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 min-w-0 max-w-[200px] xs:max-w-[260px] sm:max-w-[320px]">
          <span className="text-xs sm:text-sm font-bold text-[#0D2444] dark:text-white truncate">
            {getPlayerName(currentPlayer, isRTL)}
          </span>
          <span className="text-[11px] font-medium text-[#4A607A] dark:text-[#94B0D0] shrink-0" dir="ltr">
            ({currentPlayer?.age} {L('سنة', 'y')})
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#1E427B] dark:text-[#7EB0E8] group-hover:text-[#0D2444] dark:group-hover:text-white transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 ${
            isRTL ? 'left-0 right-auto' : 'right-0 left-auto'
          } z-50 w-[320px] xs:w-[360px] sm:w-[400px] max-w-[calc(100vw-24px)] rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-xl p-3 text-start animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Menu Header */}
          <div className="p-2 pb-[10px] mb-[10px] border-b border-[var(--line)]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--ink)] min-w-0">
                <Users className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span className="truncate">
                  {userRole === 'guardian'
                    ? L('ملفات الأبناء المرتبطين بحسابك', 'Connected Sons & Family Profiles')
                    : L('الملفات العائلية المرتبطة', 'Connected Family Profiles')}
                </span>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--primary-50)] text-[var(--primary)] font-bold whitespace-nowrap shrink-0 border border-[var(--primary-100)]">
                {players.length} {L('أبناء', 'Profiles')}
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] mt-[10px] leading-snug">
              {userRole === 'guardian'
                ? L(
                    'اختر أحد الأبناء للتبديل إليه واستعراض شهاداته وحجوزاته وسجله الطبي.',
                    'Select a connected son or child to manage appointments, certificates, and medical history.'
                  )
                : L(
                    'اختر الملف الرياضي لإظهار شهاداته وحجوزاته وموافقاته الموثقة.',
                    'Select profile to view verified certificates, bookings, and consents.'
                  )}
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto flex flex-col gap-[10px] pr-0.5">
            {userRole === 'guardian' ? (
              /* GUARDIAN / PARENT VIEW: Clearly shows Parent Account Identity + Connected Sons */
              <div className="flex flex-col gap-[10px]">
                {/* Parent Profile Identity Box */}
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-[var(--primary-50)] to-transparent border border-[var(--primary-100)] flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {isRTL ? (currentUser?.avatarLetter || 'ي') : 'Y'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[var(--ink)] truncate">
                        {getGuardianName(currentUser, isRTL)}
                      </div>
                      <div className="text-[10px] text-[var(--primary-700)] font-semibold flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3 h-3 text-[#16845B]" />
                        <span>{L('حساب ولي الأمر (حساب عائلي)', 'Parent Account (Family Hub)')}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsOpen(false); navigate('citizen-family'); }}
                    className="text-[10.5px] font-bold text-[var(--primary)] hover:underline whitespace-nowrap px-2.5 py-1 rounded-lg bg-white dark:bg-[#1B355A] border border-[var(--line)] shadow-xs"
                  >
                    {L('إدارة العائلة', 'Family Hub')}
                  </button>
                </div>

                {/* Connected Sons & Children Accounts */}
                <div>
                  <div className="text-[10px] font-bold text-[var(--muted)] px-1 mb-[10px] uppercase tracking-wider flex items-center justify-between">
                    <span>{L('الأبناء المسجلون في حسابك', 'Connected Sons / Children')}</span>
                    <span className="text-[10px] font-bold text-[var(--primary)]">
                      {players.length} {L('أبناء', 'Profiles')}
                    </span>
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    {players.map((child, idx) => {
                      const isSelected = selectedPlayerIndex === idx;
                      return (
                        <div
                          key={child.id || idx}
                          onClick={() => handleSelect(idx)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[var(--primary-50)] border-2 border-[var(--primary)] text-[var(--primary-700)] dark:text-white font-bold shadow-xs ring-1 ring-[var(--primary)]/20'
                              : 'hover:bg-[var(--primary-50)]/60 border border-[var(--line)] text-[var(--ink)]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                              isSelected
                                ? 'bg-[var(--primary)] text-white'
                                : 'bg-[#0066CC]/15 text-[#0066CC] dark:text-[#ABC7E8]'
                            }`}>
                              {getPlayerName(child, isRTL).charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold truncate text-[var(--ink)]">
                                  {getPlayerName(child, isRTL)}
                                </span>
                                <span className={`text-[9.5px] px-1.5 py-0.2 rounded font-bold whitespace-nowrap ${
                                  isSelected
                                    ? 'bg-[#16845B]/15 text-[#16845B]'
                                    : 'bg-[var(--line)] text-[var(--muted)]'
                                }`}>
                                  {getRelationshipLabel(child, isRTL)}
                                </span>
                              </div>
                              <div className="text-[11px] text-[var(--muted)] flex items-center gap-1.5 mt-1">
                                <span className="font-semibold text-[var(--ink)]">{getSportName(child?.sp)}</span>
                                <span className="opacity-40">·</span>
                                <span>{child?.age} {L('سنة', 'years')}</span>
                                <span className="opacity-40">·</span>
                                <span className="mono text-[10px]">{child.nid}</span>
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-[#16845B] stroke-[2.5] shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* ATHLETE VIEW: Primary Profile + Dependents */
              <div className="flex flex-col gap-[10px]">
                {primaryPlayer && (
                  <div>
                    <div className="text-[10px] font-bold text-[var(--muted)] px-2 mb-[10px] uppercase tracking-wider">
                      {L('الحساب الرئيسي', 'Primary Profile')}
                    </div>
                    <div
                      onClick={() => handleSelect(0)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                        selectedPlayerIndex === 0
                          ? 'bg-[var(--primary-50)] border-2 border-[var(--primary)] text-[var(--primary-700)] dark:text-white font-bold shadow-xs'
                          : 'hover:bg-[var(--primary-50)]/60 border border-[var(--line)] text-[var(--ink)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {getPlayerName(primaryPlayer, isRTL).charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold truncate text-[var(--ink)]">
                              {getPlayerName(primaryPlayer, isRTL)}
                            </span>
                            <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-[#16845B]/15 text-[#16845B] font-bold whitespace-nowrap">
                              {L('الأساسي', 'Main')}
                            </span>
                          </div>
                          <div className="text-[11px] text-[var(--muted)] flex items-center gap-1.5 mt-1">
                            <span className="font-semibold text-[var(--ink)]">{getSportName(primaryPlayer?.sp)}</span>
                            <span className="opacity-40">·</span>
                            <span>{primaryPlayer?.age} {L('سنة', 'years')}</span>
                          </div>
                        </div>
                      </div>
                      {selectedPlayerIndex === 0 && (
                        <Check className="w-4 h-4 text-[#16845B] stroke-[2.5] shrink-0" />
                      )}
                    </div>
                  </div>
                )}

                {/* Connected Parent Account (Under Guardianship) */}
                <div className="flex flex-col gap-[10px]">
                  <div className="text-[10px] font-bold text-[var(--muted)] px-2 uppercase tracking-wider flex items-center justify-between gap-2">
                    <span className="whitespace-nowrap">{L('حساب ولي الأمر المرتبط', 'Parent Account')}</span>
                    <span className="text-[10px] text-[var(--primary)] font-bold whitespace-nowrap flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#16845B]" />
                      {L('تحت الولاية القانونية', 'Under Guardianship')}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-[var(--primary-50)]/70 to-transparent border border-[var(--primary-100)] flex items-center justify-between select-none">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {isRTL ? 'ي' : 'Y'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[var(--ink)] truncate">
                            {getGuardianName(primaryPlayer, isRTL)}
                          </span>
                          <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 whitespace-nowrap">
                            {L('ولي الأمر (الأب)', 'Guardian (Father)')}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-[var(--muted)] flex flex-wrap items-center gap-1.5 mt-1">
                          <span>{L('الرقم القومي:', 'NID:')}</span>
                          <span className="mono font-semibold text-[var(--ink)]">27501010104829</span>
                          <span className="opacity-40">·</span>
                          <span className="text-emerald-700 font-semibold">{L('ولاية موثقة', 'Verified Custody')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connected Siblings under the same Guardian */}
                {familyDependents.length > 0 && (
                  <div className="flex flex-col gap-[10px]">
                    <div className="text-[10px] font-bold text-[var(--muted)] px-2 uppercase tracking-wider flex items-center justify-between gap-2">
                      <span className="whitespace-nowrap">{L('الأشقاء التابعون لنفس ولي الأمر', 'Connected Siblings')}</span>
                      <span className="text-[10px] text-[var(--muted)] font-semibold whitespace-nowrap">
                        {L('ملفات العائلة', 'Family Profiles')}
                      </span>
                    </div>
                    <div className="flex flex-col gap-[10px]">
                      {familyDependents.map((pl) => {
                        const actualIdx = players.findIndex((p) => p.id === pl.id);
                        const isCurrent = selectedPlayerIndex === actualIdx;
                        return (
                          <div
                            key={pl.id || actualIdx}
                            onClick={() => handleSelect(actualIdx)}
                            className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                              isCurrent
                                ? 'bg-[var(--primary-50)] border-2 border-[var(--primary)] text-[var(--primary-700)] dark:text-white font-bold shadow-xs'
                                : 'hover:bg-[var(--primary-50)]/60 border border-[var(--line)] text-[var(--ink)]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div className="w-8 h-8 rounded-lg bg-[#0066CC]/15 text-[#0066CC] dark:text-[#ABC7E8] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                {getPlayerName(pl, isRTL).charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold truncate text-[var(--ink)]">
                                    {getPlayerName(pl, isRTL)}
                                  </span>
                                  <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-[var(--line)] text-[var(--muted)] whitespace-nowrap">
                                    {pl.g === 'F' ? L('الأخت (رياضية)', 'Sister (Athlete)') : L('الأخ (رياضي)', 'Brother (Athlete)')}
                                  </span>
                                </div>
                                <div className="text-[11px] text-[var(--muted)] flex items-center gap-1.5 mt-1">
                                  <span className="font-semibold text-[var(--ink)]">{getSportName(pl?.sp)}</span>
                                  <span className="opacity-40">·</span>
                                  <span>{pl?.age} {L('سنة', 'years')}</span>
                                </div>
                              </div>
                            </div>
                            {isCurrent && (
                              <Check className="w-4 h-4 text-[#16845B] stroke-[2.5] shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons at bottom */}
          <div className="pt-[10px] mt-[10px] border-t border-[var(--line)] flex flex-col gap-[10px]">
            {userRole === 'guardian' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigate('citizen-family');
                    setIsOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-600)] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{L('فتح إدارة ملفات العائلة', 'Open Family Management')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(true);
                    setIsOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[var(--primary-50)] hover:bg-[var(--primary-100)] text-[var(--primary-700)] dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[var(--primary-100)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{L('إضافة / ربط ملف ابن جديد', 'Connect New Child Profile')}</span>
                </button>
              </>
            ) : (
              <div className="text-center py-1 text-[11px] text-[var(--muted)] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16845B] shrink-0" />
                <span>{L('حساب رياضي قاصر تحت الولاية القانونية لولي الأمر (قانون 151 لسنة 2020)', 'Minor athlete account under verified parental custody (Law 151/2020)')}</span>
              </div>
            )}
          </div>
        </div>

      )}

      {/* Modal to add a new family dependent */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[var(--card)] rounded-2xl p-5 sm:p-6 shadow-2xl border border-[var(--line)] relative text-start">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[var(--primary-50)] flex items-center justify-center text-[var(--primary)] font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--ink)]">
                    {L('إضافة ملف تابع عائلي جديد', 'Add New Family Dependent')}
                  </h3>
                  <p className="text-[11px] text-[var(--muted)]">
                    {L('ربط رياضي تابع بحساب ولي الأمر', 'Connect athlete dependent to guardian account')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-50)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDependent} className="space-y-3 mt-4 text-xs sm:text-sm">
              <div>
                <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                  {L('اسم الابن / التابع بالكامل (رباعي)', 'Dependent Full Name')}
                </label>
                <input
                  type="text"
                  required
                  value={newDependent.name}
                  onChange={(e) => setNewDependent({ ...newDependent, name: e.target.value })}
                  placeholder={isRTL ? 'مثال: يوسف أحمد يوسف السيد' : 'e.g. Youssef Ahmad Youssef'}
                  className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                    {L('صلة القرابة', 'Relationship')}
                  </label>
                  <select
                    value={newDependent.relationship}
                    onChange={(e) =>
                      setNewDependent({
                        ...newDependent,
                        relationship: e.target.value,
                        gender: e.target.value === 'ابنة' ? 'F' : 'M'
                      })
                    }
                    className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-2.5 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
                  >
                    <option value="ابن">{L('ابن', 'Son')}</option>
                    <option value="ابنة">{L('ابنة', 'Daughter')}</option>
                    <option value="أخ">{L('أخ أصغر', 'Brother')}</option>
                    <option value="أخت">{L('أخت صغرى', 'Sister')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                    {L('العمر (بالسنوات)', 'Age')}
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="22"
                    required
                    value={newDependent.age}
                    onChange={(e) => setNewDependent({ ...newDependent, age: e.target.value })}
                    className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                  {L('اللعبة الرياضية المقيد بها', 'Sport / Discipline')}
                </label>
                <select
                  value={newDependent.sport}
                  onChange={(e) => setNewDependent({ ...newDependent, sport: e.target.value })}
                  className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-2.5 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
                >
                  {cfg.sports.map((sp, spIdx) => (
                    <option key={spIdx} value={spIdx}>
                      {sp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--ink)] mb-1">
                  {L('الرقم القومي للتابع (14 رقم)', 'National ID')}
                </label>
                <input
                  type="text"
                  required
                  value={newDependent.nationalId}
                  onChange={(e) => setNewDependent({ ...newDependent, nationalId: e.target.value })}
                  className="w-full bg-[var(--bg)] border border-[var(--line)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--primary)] font-mono"
                />
              </div>

              <div className="pt-3 border-t border-[var(--line)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--muted)] hover:bg-[var(--primary-50)] cursor-pointer"
                >
                  {L('إلغاء', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] hover:bg-[var(--primary-600)] text-white shadow-md cursor-pointer"
                >
                  {L('تأكيد وإضافة التابع', 'Confirm & Connect')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
