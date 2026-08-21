'use client';

import { useEffect, useState } from 'react';
import { defaultLiveBranding, LiveBranding } from './branding';

// Branding managed from the admin dashboard (Settings > Info Toko / Kontak & Sosial
// Media / Tampilan & Tema). Seeded with the static defaults so components never need
// a loading/null branch, then updated once /api/branding resolves.
export function useLiveBranding(): LiveBranding {
  const [branding, setBranding] = useState<LiveBranding>(defaultLiveBranding);

  useEffect(() => {
    fetch('/api/branding')
      .then(r => r.ok ? r.json() : null)
      .then((d: LiveBranding | null) => { if (d) setBranding(d); })
      .catch(() => {});
  }, []);

  return branding;
}
