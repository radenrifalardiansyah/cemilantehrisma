import type { MetadataRoute } from 'next';
import { products } from '@/lib/products';
import { getCachedBranding } from '@/lib/server/branding';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = await getCachedBranding();
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...products.map(product => ({
      url: `${siteUrl}/products/${product.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    {
      url: `${siteUrl}/reseller`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/panduan`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/kontak`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
