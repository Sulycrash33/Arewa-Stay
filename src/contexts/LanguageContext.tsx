'use client';

import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import en from '@/locales/en.json';
import ha from '@/locales/ha.json';
import fr from '@/locales/fr.json';

type Language = 'en' | 'ha' | 'fr';

const translations = { en, ha, fr };

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('arewa_language') as Language;
    if (savedLanguage && ['en', 'ha', 'fr'].includes(savedLanguage)) {
      document.cookie = `arewa_language=${savedLanguage}; path=/; max-age=31536000; SameSite=Lax`;
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('arewa_language', lang);
    document.cookie = `arewa_language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    setLanguageState(lang);
  };

  const t = useCallback((key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  }, [language]);

  // Keep <html lang> in sync so screen readers announce in the right language.
  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
