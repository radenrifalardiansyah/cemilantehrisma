import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/branding';
import { getCachedBranding } from '@/lib/server/branding';

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getCachedBranding();
  return {
    title: 'Semua Produk',
    description: 'Lihat semua produk cemilan Teh Risma: Keripik Kimpul (Original, BBQ Pedas, Jagung) & Mie Kremes (Original, Pedas). Tersedia ukuran 100g, 150g, 250g, dan paket hemat.',
    keywords: [
      'beli keripik kimpul bogor', 'mie kremes online', 'cemilan halal bogor',
      'keripik kimpul harga', 'mie kremes pedas', 'paket cemilan hemat',
      'oleh oleh khas bogor murah',
    ],
    openGraph: {
      title: `Semua Produk | ${branding.brandName}`,
      description: 'Keripik Kimpul & Mie Kremes Bogor. Halal, renyah, tanpa pengawet. Pesan via WhatsApp!',
      url: `${SITE_URL}/products`,
    },
    alternates: {
      canonical: `${SITE_URL}/products`,
    },
  };
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
