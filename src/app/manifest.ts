import type { MetadataRoute } from 'next';
import { getCachedBranding } from '@/lib/server/branding';
import { logoVariant } from '@/lib/branding';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const branding = await getCachedBranding();
  return {
    name: branding.brandName,
    short_name: branding.brandName,
    description: branding.tagline || branding.seoDescription,
    start_url: '/',
    display: 'standalone',
    background_color: branding.themeBackgroundColor,
    theme_color: branding.themeColor,
    orientation: 'portrait',
    icons: [
      {
        src: logoVariant(branding.logoUrl, 192),
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: logoVariant(branding.logoUrl, 512),
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
