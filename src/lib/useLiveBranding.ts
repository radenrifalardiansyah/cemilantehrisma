'use client';

import { createContext, createElement, useContext, type ReactNode } from 'react';
import { defaultLiveBranding, LiveBranding } from './branding';

// Branding managed from the admin dashboard (Settings > Info Toko / Kontak & Sosial
// Media / Tampilan & Tema). RootLayout fetches it server-side (getCachedBranding) and
// hands it down through this context, so the very first render already shows the
// admin's brand — previously the hook seeded state with the static defaults and only
// swapped in /api/branding after hydration, which flashed the fallback brand on load.
const BrandingContext = createContext<LiveBranding | null>(null);

export function BrandingProvider({ value, children }: { value: LiveBranding; children: ReactNode }) {
  return createElement(BrandingContext.Provider, { value }, children);
}

export function useLiveBranding(): LiveBranding {
  return useContext(BrandingContext) ?? defaultLiveBranding();
}
