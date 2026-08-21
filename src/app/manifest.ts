import type { MetadataRoute } from 'next';
import { getCachedBranding } from '@/lib/server/branding';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const branding = await getCachedBranding();
  return {
    name: branding.brandName,
    short_name: branding.brandName,
    description: branding.tagline,
    start_url: '/',
    display: 'standalone',
    background_color: branding.themeBackgroundColor,
    theme_color: branding.themeColor,
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
