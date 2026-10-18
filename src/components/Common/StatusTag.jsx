import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Check, Clock, AlertTriangle, X, ShieldAlert, Award, AlertCircle } from 'lucide-react';

export const StatusTag = ({ type = 'player', status, className = '' }) => {
  const { isRTL } = useLanguage();

  if (type === 'org') {
    if (status === 'on') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E4F7F2] text-[#16835F] border border-[#16835F]/25 shadow-xs ${className}`}>
          <Award className="w-3.5 h-3.5 flex-none" />
          {isRTL ? 'معتمد' : 'Accredited'}
        </span>
      );
    }
    if (status === 'off') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F1F5F9] text-[#64748B] border border-[#64748B]/25 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#64748B]" />
          {isRTL ? 'موقوف' : 'Suspended'}
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF7E8] text-[#B77912] border border-[#B77912]/25 shadow-xs ${className}`}>
        <Clock className="w-3.5 h-3.5 flex-none" />
        {isRTL ? 'قيد الاعتماد' : 'Pending'}
      </span>
    );
  }

  if (type === 'consent') {
    if (status === 'ok') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E4F7F2] text-[#16835F] border border-[#16835F]/25 ${className}`}>
          <Check className="w-3.5 h-3.5 flex-none" />
          {isRTL ? 'ساري' : 'Active'}
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FDECEE] text-[#C2414B] border border-[#C2414B]/25 ${className}`}>
        <X className="w-3.5 h-3.5 flex-none" />
        {isRTL ? 'مرفوض' : 'Denied'}
      </span>
    );
  }

  // Player certificate status
  switch (status) {
    case 'fit':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E4F7F2] text-[#16835F] border border-[#16835F]/25 shadow-xs ${className}`}>
          <Check className="w-3.5 h-3.5 flex-none" />
          {isRTL ? 'لائق — سارية' : 'Fit — valid'}
        </span>
      );
    case 'cond':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF7E8] text-[#B77912] border border-[#B77912]/25 shadow-xs ${className}`}>
          <AlertTriangle className="w-3.5 h-3.5 flex-none" />
          {isRTL ? 'أشبالنا — متابعة' : 'Ashbalna — conditional'}
        </span>
      );
    case 'exp':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F1F5F9] text-[#64748B] border border-[#64748B]/25 ${className}`}>
          <AlertCircle className="w-3.5 h-3.5 flex-none" />
          {isRTL ? 'منتهية' : 'Expired'}
        </span>
      );
    case 'book':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DDF4F1] text-[#087F8C] border border-[#087F8C]/25 shadow-xs ${className}`}>
          <Clock className="w-3.5 h-3.5 flex-none" />
          {isRTL ? 'حجز مؤكد' : 'Booked'}
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#64748B] border border-[#64748B]/20 ${className}`}>
          {status}
        </span>
      );
  }
};
