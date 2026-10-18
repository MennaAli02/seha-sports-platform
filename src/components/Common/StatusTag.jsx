import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Check, Clock, AlertTriangle, X, Award, AlertCircle } from 'lucide-react';

export const StatusTag = ({ type = 'player', status, className = '' }) => {
  const { isRTL } = useLanguage();

  if (type === 'org') {
    if (status === 'on') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--success-bg)] text-[var(--success-dark)] border border-[var(--success)]/30 ${className}`}>
          <Award className="w-3.5 h-3.5 flex-none" />
          {isRTL ? 'معتمد' : 'Accredited'}
        </span>
      );
    }
    if (status === 'off') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--danger-bg)] text-[var(--danger-dark)] border border-[var(--danger)]/30 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--danger-dark)]" />
          {isRTL ? 'موقوف' : 'Suspended'}
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--warning-bg)] text-[var(--warning-dark)] border border-[var(--warning)]/30 ${className}`}>
        <Clock className="w-3.5 h-3.5 flex-none" />
        {isRTL ? 'قيد الاعتماد' : 'Pending'}
      </span>
    );
  }

  if (type === 'consent') {
    if (status === 'ok') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--success-bg)] text-[var(--success-dark)] border border-[var(--success)]/30 ${className}`}>
          <Check className="w-3.5 h-3.5 flex-none" />
          {isRTL ? 'ساري' : 'Active'}
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--danger-bg)] text-[var(--danger-dark)] border border-[var(--danger)]/30 ${className}`}>
        <X className="w-3.5 h-3.5 flex-none" />
        {isRTL ? 'مرفوض' : 'Denied'}
      </span>
    );
  }

  // Player certificate status
  switch (status) {
    case 'fit':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--success-bg)] text-[var(--success-dark)] border border-[var(--success)]/30 ${className}`}>
          <Check className="w-3.5 h-3.5 flex-none" />
          {isRTL ? 'لائق — سارية' : 'Fit — valid'}
        </span>
      );
    case 'cond':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--warning-bg)] text-[var(--warning-dark)] border border-[var(--warning)]/30 ${className}`}>
          <AlertTriangle className="w-3.5 h-3.5 flex-none" />
          {isRTL ? 'أشبالنا — متابعة' : 'Ashbalna — conditional'}
        </span>
      );
    case 'exp':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--primary-50)] text-[var(--muted)] border border-[var(--line)] ${className}`}>
          <AlertCircle className="w-3.5 h-3.5 flex-none" />
          {isRTL ? 'منتهية' : 'Expired'}
        </span>
      );
    case 'book':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--primary-50)] text-[var(--primary-700)] border border-[var(--primary-100)] ${className}`}>
          <Clock className="w-3.5 h-3.5 flex-none" />
          {isRTL ? 'حجز مؤكد' : 'Booked'}
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-50)] text-[var(--muted)] border border-[var(--line)] ${className}`}>
          {status}
        </span>
      );
  }
};
