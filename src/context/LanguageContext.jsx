import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('seha_app_lang');
      return saved === 'en' ? 'en' : 'ar';
    } catch {
      return 'ar';
    }
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('seha_app_lang', lang);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLanguage = () => {
    const next = language === 'ar' ? 'en' : 'ar';
    setLanguage(next);
  };

  const isRTL = language === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [dir, language]);

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language] || translations.ar,
    isRTL,
    dir,
    L: (ar, en) => (language === 'ar' ? ar : en)
  };

  return (
    <LanguageContext.Provider value={value}>
      <div dir={dir} className={isRTL ? 'font-arabic' : 'font-latin'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'ar',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: translations.ar,
      isRTL: true,
      dir: 'rtl',
      L: (ar, en) => ar
    };
  }
  return context;
};
