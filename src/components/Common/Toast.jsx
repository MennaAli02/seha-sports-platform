import React from 'react';
import { useSeha } from '../../context/SehaContext';
import { CheckCircle2, X } from 'lucide-react';

export const Toast = () => {
  const { toastMessage, showToast } = useSeha();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 start-6 z-50 flex items-center gap-3 bg-[var(--ink)] text-white px-5 py-3 rounded-full shadow-[var(--shadow-lg)] border border-white/10 text-sm font-semibold max-w-md animate-in fade-in slide-in-from-bottom-3 duration-200">
      <CheckCircle2 className="w-4 h-4 text-[var(--primary)] flex-none" />
      <span className="flex-1">{toastMessage}</span>
      <button
        onClick={() => showToast(null)}
        className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        aria-label="Close"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
