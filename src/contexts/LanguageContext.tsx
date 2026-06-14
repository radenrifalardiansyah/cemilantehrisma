'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, translations, Translation } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'id',
  setLocale: () => {},
  t: translations.id,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('id');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved && ['id', 'en'].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('locale', l);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
