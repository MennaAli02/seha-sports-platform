import React from 'react';
import { useSeha } from '../../context/SehaContext';
import { CheckCircle2, X } from 'lucide-react';

export const Toast = () => {
  const { toastMessage, showToast } = useSeha();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 start-5 z-50 flex items-center gap-2.5 bg-[#0A2340] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-white/10 text-sm font-semibold max-w-md animate-in fade-in slide-in-from-bottom-3 duration-200">
      <CheckCircle2 className="w-4 h-4 text-[#5BA7E6] flex-none" />
      <span className="flex-1">{toastMessage}</span>
      <button
        onClick={() => showToast(null)}
        className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        aria-label="Close"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
