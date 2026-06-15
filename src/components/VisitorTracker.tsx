'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function detectBrowser(ua: string): string {
  if (ua.includes('Instagram'))                    return 'Instagram Browser';
  if (ua.includes('FBAN') || ua.includes('FBAV')) return 'Facebook Browser';
  if (ua.includes('TikTok'))                       return 'TikTok Browser';
  if (ua.includes('WhatsApp'))                     return 'WhatsApp Browser';
  if (ua.includes('SamsungBrowser'))               return 'Samsung Browser';
  if (ua.includes('EdgA') || ua.includes('Edg/')) return 'Microsoft Edge';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('CriOS'))                        return 'Chrome (iOS)';
  if (ua.includes('FxiOS'))                        return 'Firefox (iOS)';
  if (ua.includes('Chrome'))                       return 'Chrome';
  if (ua.includes('Safari'))                       return 'Safari';
  if (ua.includes('Firefox'))                      return 'Firefox';
  return 'Browser Lain';
}

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua       = navigator.userAgent;
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
      window.innerWidth < 768;

    // Session ID untuk unique visitor tracking
    let sessionId = sessionStorage.getItem('_sid');
    if (!sessionId) {
      sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('_sid', sessionId);
    }

    // Track page view ke Upstash (setiap navigasi)
    fetch('/api/analytics/pageview', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        path:      pathname,
        device:    isMobile ? 'mobile' : 'desktop',
        sessionId,
      }),
    }).catch(() => {});

    // Notifikasi WhatsApp — hanya 1x per sesi browser
    if (sessionStorage.getItem('_vt')) return;
    sessionStorage.setItem('_vt', '1');

    const device  = isMobile ? '📱 Mobile' : '💻 Desktop';
    const browser = detectBrowser(ua);
    const ref     = document.referrer
      ? new URL(document.referrer).hostname
      : '(langsung)';

    fetch('/api/track', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ device, page: pathname, browser, ref }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
