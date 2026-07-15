'use client';

import React, { createContext, useState, useContext, useCallback, useEffect, useMemo } from 'react';
import en from '@/locales/en.json';
import ha from '@/locales/ha.json';
import fr from '@/locales/fr.json';

type Language = 'en' | 'ha' | 'fr';

const translations: Record<Language, Record<string, string>> = { en, ha, fr };

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
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem('arewa_language', lang);
    setLanguageState(lang);
  }, []);
  
  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, setLanguage, t]);

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
