import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { Search, X, User, Award, Calendar, ChevronRight } from 'lucide-react';
import { StatusTag } from '../Common/StatusTag';

export const QuickSearchModal = ({ isOpen, onClose }) => {
  const { t, isRTL, L } = useLanguage();
  const { players, navigate, SP_EN } = useSeha();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const results = q
    ? players.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.nid.includes(q) ||
        p.ct.toLowerCase().includes(q) ||
        p.bk.toLowerCase().includes(q)
      ).slice(0, 8)
    : players.slice(0, 5);

  const handleSelectPlayer = (player) => {
    const idx = players.indexOf(player);
    onClose();
    if (player.st === 'book') {
      navigate('hosp');
    } else {
      navigate('cert', { certIndex: idx });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#0D2644] rounded-2xl shadow-2xl border border-[#DCE5EF] dark:border-[#1D3D63] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#DCE5EF] dark:border-[#1D3D63]">
          <Search className="w-5 h-5 text-[#1B6FC2] flex-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isRTL ? 'بحث بالاسم، الرقم القومي، رقم الشهادة (SH-...) أو رقم الحجز...' : 'Search by name, National ID, cert # or booking #...'}
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#0A2340] dark:text-[#DCEEFB] placeholder-[#64788F] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#64788F] hover:text-[#0A2340] hover:bg-gray-100 dark:hover:bg-[#0F3D6E] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#64788F]">
              {isRTL ? 'لا توجد نتائج مطابقة' : 'No matching results found'}
            </div>
          ) : (
            results.map((p) => {
              const sportName = isRTL ? SP_EN[p.sp] || p.sp : SP_EN[p.sp] || p.sp;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPlayer(p)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#EEF6FD] dark:hover:bg-[#0F3D6E] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#DCEEFB] dark:bg-[#0A2340] text-[#1B6FC2] dark:text-[#8FC3F0] flex items-center justify-center font-bold text-xs flex-none">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <b className="text-sm font-bold text-[#0A2340] dark:text-[#DCEEFB] group-hover:text-[#1B6FC2] transition-colors">
                        {p.name}
                      </b>
                      <div className="text-xs text-[#64788F] dark:text-[#95ACC4] flex items-center gap-2 mt-0.5">
                        <span className="font-mono">{p.nid}</span>
                        <span>•</span>
                        <span>{p.age} {t.year}</span>
                        <span>•</span>
                        <span>{p.st === 'book' ? p.bk : p.ct}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusTag status={p.st} />
                    <ChevronRight className={`w-4 h-4 text-[#64788F] group-hover:text-[#1B6FC2] ${isRTL ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-[#F3F6FA] dark:bg-[#071526] border-t border-[#DCE5EF] dark:border-[#1D3D63] text-[11px] text-[#64788F] flex items-center justify-between">
          <span>{isRTL ? 'اختر للفتح المباشر في السجل' : 'Select to open directly in registry'}</span>
          <span className="font-mono">ESC {isRTL ? 'للإغلاق' : 'to close'}</span>
        </div>
      </div>
    </div>
  );
};
