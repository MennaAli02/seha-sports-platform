import React from 'react';
import { useSeha } from '../../context/SehaContext';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, X } from 'lucide-react';

export const Toast = () => {
  const { toastMessage, showToast } = useSeha();
  const { isRTL } = useLanguage();

  if (!toastMessage) return null;

  const displayText = typeof toastMessage === 'object' && toastMessage !== null
    ? (isRTL ? toastMessage.ar : toastMessage.en)
    : toastMessage;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`fixed bottom-6 ${
        isRTL ? 'right-6 left-auto' : 'left-6 right-auto'
      } z-50 flex items-center gap-3 bg-[var(--ink)] text-white px-5 py-3 rounded-2xl shadow-[var(--shadow-lg)] border border-white/10 text-xs sm:text-sm font-semibold max-w-md animate-in fade-in slide-in-from-bottom-3 duration-200 text-start`}
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="flex-1 leading-snug">{displayText}</span>
      <button
        type="button"
        onClick={() => showToast(null)}
        className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer shrink-0"
        aria-label="Close"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

