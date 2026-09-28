import type { Metadata } from 'next';
import { getCachedBranding } from '@/lib/server/branding';

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getCachedBranding();
  return {
    title: 'Program Reseller',
    description: `Bergabung jadi reseller ${branding.brandName}! Komisi menarik, produk halal laris manis, support penuh dari kami. Daftar sekarang via WhatsApp.`,
    keywords: [
      `reseller ${branding.brandName.toLowerCase()}`, 'bisnis cemilan rumahan', 'jual cemilan online',
      'reseller snack halal', ...(branding.region ? [`bisnis sampingan ${branding.region.toLowerCase()}`] : []),
    ],
    openGraph: {
      title: `Program Reseller | ${branding.brandName}`,
      description: `Raih penghasilan tambahan dengan menjadi reseller ${branding.brandName}. Komisi menarik, produk halal!`,
      url: `${branding.siteUrl}/reseller`,
    },
    alternates: {
      canonical: `${branding.siteUrl}/reseller`,
    },
  };
}

export default function ResellerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
