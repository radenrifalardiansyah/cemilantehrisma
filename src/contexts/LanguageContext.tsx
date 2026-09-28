'use client';

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Locale, translations, Translation } from '@/lib/i18n';
import { useLiveBranding } from '@/lib/useLiveBranding';
import type { LiveBranding } from '@/lib/branding';

// Teks terjemahan memakai token {brand} / {region} / {city} / {hours} supaya tidak ada nama
// toko, kota, atau jam buka yang di-hardcode — nilainya diisi dari Settings admin di sini.
function interpolate<T>(value: T, b: LiveBranding): T {
  const tokens: Record<string, string> = {
    brand: b.brandName,
    region: b.region || b.city || b.brandName,
    city: b.city || b.region,
    hours: b.openHours,
  };
  const fill = (str: string) => str.replace(/\{(brand|region|city|hours)\}/g, (_, k: string) => tokens[k] ?? '');
  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') return fill(v);
    if (typeof v === 'function') {
      const fn = v as (...args: unknown[]) => unknown;
      return (...args: unknown[]) => walk(fn(...args));
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') {
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    }
    return v;
  };
  return walk(value) as T;
}

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
  const branding = useLiveBranding();
  const t = useMemo(() => interpolate(translations[locale], branding), [locale, branding]);

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
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
