import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSeha } from '../../context/SehaContext';
import { Search, X, User, ChevronRight } from 'lucide-react';
import { StatusTag } from '../Common/StatusTag';

export const QuickSearchModal = ({ isOpen, onClose }) => {
  const { t, isRTL } = useLanguage();
  const { players, navigate } = useSeha();
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-[var(--card)] rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--line)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--line)]">
          <Search className="w-5 h-5 text-[var(--primary)] flex-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isRTL ? 'بحث بالاسم، الرقم القومي، رقم الشهادة (SH-...) أو رقم الحجز...' : 'Search by name, National ID, cert # or booking #...'}
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-[var(--ink)] placeholder-[var(--placeholder)] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-50)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--muted)]">
              {isRTL ? 'لا توجد نتائج مطابقة' : 'No matching results found'}
            </div>
          ) : (
            results.map((p) => {
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPlayer(p)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--primary-50)] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--primary-50)] text-[var(--primary)] flex items-center justify-center font-bold text-xs flex-none">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <b className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                        {p.name}
                      </b>
                      <div className="text-xs text-[var(--muted)] flex items-center gap-2 mt-0.5">
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
                    <ChevronRight className={`w-4 h-4 text-[var(--muted)] group-hover:text-[var(--primary)] ${isRTL ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-[var(--primary-50)] border-t border-[var(--line)] text-[11px] text-[var(--muted)] flex items-center justify-between">
          <span>{isRTL ? 'اختر للفتح المباشر في السجل' : 'Select to open directly in registry'}</span>
          <span className="font-mono">ESC {isRTL ? 'للإغلاق' : 'to close'}</span>
        </div>
      </div>
    </div>
  );
};
