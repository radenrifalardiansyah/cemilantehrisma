import type { MetadataRoute } from 'next';
import { BRAND_NAME, TAGLINE, THEME_COLOR, THEME_BACKGROUND_COLOR } from '@/lib/branding';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND_NAME,
    short_name: BRAND_NAME,
    description: TAGLINE,
    start_url: '/',
    display: 'standalone',
    background_color: THEME_BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
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
