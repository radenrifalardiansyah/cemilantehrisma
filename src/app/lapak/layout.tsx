import type { Metadata } from 'next';
import { getCachedBranding } from '@/lib/server/branding';

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getCachedBranding();
  const description = `Lihat produk dan stok yang tersedia di setiap lapak ${branding.brandName}.`;
  return {
    title: 'Lapak',
    description,
    openGraph: { title: `Lapak | ${branding.brandName}`, description, url: `${branding.siteUrl}/lapak` },
    alternates: { canonical: `${branding.siteUrl}/lapak` },
  };
}

export default function LapakLayout({ children }: { children: React.ReactNode }) {
  return children;
}
