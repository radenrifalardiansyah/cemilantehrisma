import type { MetadataRoute } from 'next';
import { getCachedBranding } from '@/lib/server/branding';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { siteUrl } = await getCachedBranding();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/checkout',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
