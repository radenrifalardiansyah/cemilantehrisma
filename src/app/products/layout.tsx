import type { Metadata } from 'next';
import { getCachedBranding } from '@/lib/server/branding';

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getCachedBranding();
  const description = [`Lihat semua produk ${branding.brandName}.`, branding.tagline].filter(Boolean).join(' ');
  return {
    title: 'Semua Produk',
    description,
    keywords: branding.seoKeywords.length ? branding.seoKeywords : undefined,
    openGraph: {
      title: `Semua Produk | ${branding.brandName}`,
      description,
      url: `${branding.siteUrl}/products`,
    },
    alternates: {
      canonical: `${branding.siteUrl}/products`,
    },
  };
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
