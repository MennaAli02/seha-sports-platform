import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
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
    const relText = selected.rel ? L(selected.rel.ar, selected.rel.en) : L('لاعب', 'Athlete');
    showToast(
      isRTL
        ? `تم التبديل إلى ملف: ${selected.name} (${relText})`
        : `Switched to profile: ${selected.name} (${relText})`
    );
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
  const primaryPlayer = players[0];
  const familyDependents = players.filter((p, idx) => idx > 0 && (p.rel || idx < 5));

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
              <span>{L('الابن النشط:', 'Child:')}</span>
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4 stroke-[2.2]" />
              <span>{L('اللاعب:', 'Athlete:')}</span>
            </>
          )}
        </div>

        <span className="text-xs sm:text-sm font-bold text-[#0D2444] dark:text-white truncate max-w-[140px] xs:max-w-[180px] sm:max-w-[240px]">
          {currentPlayer?.name} ({currentPlayer?.age} {L('سنة', 'y')})
        </span>

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
            isRTL ? 'left-0 sm:right-0 sm:left-auto' : 'right-0 sm:left-0 sm:right-auto'
          } z-50 w-76 sm:w-84 rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-xl p-2.5 text-start animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Menu Header */}
          <div className="p-2 pb-2.5 mb-1.5 border-b border-[var(--line)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--ink)]">
                <Users className="w-4 h-4 text-[var(--primary)]" />
                <span>{L('الملفات العائلية المرتبطة', 'Connected Family Profiles')}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary-50)] text-[var(--primary)] font-bold">
                {1 + familyDependents.length} {L('ملفات', 'Profiles')}
              </span>
            </div>
            <p className="text-[10.5px] text-[var(--muted)] mt-0.5">
              {L(
                'اختر الملف الرياضي لإظهار شهاداته وحجوزاته وموافقاته الموثقة.',
                'Select profile to view verified certificates, bookings, and consents.'
              )}
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1 pr-0.5">
            {/* Primary Profile */}
            {primaryPlayer && (
              <div>
                <div className="text-[10px] font-bold text-[var(--muted)] px-2 py-1 uppercase tracking-wider">
                  {L('الحساب الرئيسي', 'Primary Profile')}
                </div>
                <div
                  onClick={() => handleSelect(0)}
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                    selectedPlayerIndex === 0
                      ? 'bg-[var(--primary-50)] border border-[var(--primary)] text-[var(--primary-700)] dark:text-white font-bold'
                      : 'hover:bg-[var(--primary-50)]/60 text-[var(--ink)]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {primaryPlayer.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold truncate">{primaryPlayer.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#16845B]/15 text-[#16845B] font-bold">
                          {L('الأساسي', 'Main')}
                        </span>
                      </div>
                      <div className="text-[10px] text-[var(--muted)] truncate">
                        {cfg.sports[primaryPlayer.sp] || 'كرة القدم'} · {primaryPlayer.age} {L('سنة', 'years')}
                      </div>
                    </div>
                  </div>
                  {selectedPlayerIndex === 0 && (
                    <Check className="w-4 h-4 text-[#16845B] stroke-[2.5] shrink-0" />
                  )}
                </div>
              </div>
            )}

            {/* Family Dependents */}
            {familyDependents.length > 0 && (
              <div className="pt-1.5">
                <div className="text-[10px] font-bold text-[var(--muted)] px-2 py-1 uppercase tracking-wider flex items-center justify-between">
                  <span>{L('التابعون وأفراد العائلة', 'Family Dependents')}</span>
                  <span className="text-[9.5px] text-[var(--primary)] font-normal">
                    {L('تحت ولاية الحساب', 'Under Guardian')}
                  </span>
                </div>
                {familyDependents.map((pl) => {
                  const actualIdx = players.findIndex((p) => p.id === pl.id);
                  const isCurrent = selectedPlayerIndex === actualIdx;
                  return (
                    <div
                      key={pl.id || actualIdx}
                      onClick={() => handleSelect(actualIdx)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-[var(--primary-50)] border border-[var(--primary)] text-[var(--primary-700)] dark:text-white font-bold'
                          : 'hover:bg-[var(--primary-50)]/60 text-[var(--ink)]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-7 h-7 rounded-lg bg-[#0066CC]/15 text-[#0066CC] dark:text-[#ABC7E8] flex items-center justify-center font-bold text-xs shrink-0">
                          {pl.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold truncate">{pl.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--line)] text-[var(--muted)]">
                              {pl.rel ? L(pl.rel.ar, pl.rel.en) : L('تابع', 'Dependent')}
                            </span>
                          </div>
                          <div className="text-[10px] text-[var(--muted)] truncate">
                            {cfg.sports[pl.sp] || 'رياضة'} · {pl.age} {L('سنة', 'years')}
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
            )}
          </div>

          {/* Action buttons at bottom */}
          <div className="pt-2 mt-1.5 border-t border-[var(--line)] space-y-1.5">
            {userRole === 'guardian' && (
              <button
                type="button"
                onClick={() => {
                  navigate('citizen-family');
                  setIsOpen(false);
                }}
                className="w-full py-1.5 px-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-600)] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{L('فتح إدارة ملفات العائلة', 'Open Family Management')}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setShowAddModal(true);
                setIsOpen(false);
              }}
              className="w-full py-1.5 px-2.5 rounded-xl bg-[var(--primary-50)] hover:bg-[var(--primary-100)] text-[var(--primary-700)] dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{L('إضافة / ربط ملف تابع جديد (فرد عائلة)', 'Connect New Family Dependent')}</span>
            </button>
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
