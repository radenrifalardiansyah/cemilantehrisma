import { unstable_cache } from 'next/cache';
import { getSettings } from '@/lib/settings-pg';
import { defaultLiveBranding, LiveBranding } from '@/lib/branding';

interface SettingsDoc {
  storeName?: string;
  legalName?: string;
  storeTagline?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  instagramUrl?: string;
  shopeeUrl?: string;
  mapsUrl?: string;
  storefrontThemeColor?: string;
  storefrontThemeBackgroundColor?: string;
}

function instagramHandleFromUrl(url: string, fallback: string): string {
  const m = url.match(/instagram\.com\/([^/?]+)/i);
  return m?.[1] || fallback;
}

// Branding is admin-editable via Settings > Info Toko / Kontak & Sosial Media / Tampilan
// & Tema (Postgres `settings` table, sama seperti payment-info — lihat api/payment-info/
// route.ts). Cache 1 jam, tag 'branding'; admin memicu revalidateStorefront('branding')
// lewat POST /api/revalidate setiap kali Settings disimpan (lihat karyaputra-admin's
// api/settings/route.ts). Fail-open ke default statis kalau Postgres error/kosong — brand
// harus tetap tampil walau database lagi bermasalah (lihat insiden RESOURCE_EXHAUSTED, yang
// waktu itu soal Firestore — kini terlepas dari kuota harian itu sama sekali).
export const getCachedBranding = unstable_cache(
  async (): Promise<LiveBranding> => {
    const fallback = defaultLiveBranding();
    try {
      const s = (await getSettings()) as SettingsDoc;
      const whatsappNumber = s.whatsapp || fallback.whatsappNumber;
      const instagramUrl = s.instagramUrl || fallback.instagramUrl;
      return {
        brandName: s.storeName || fallback.brandName,
        legalName: s.legalName || fallback.legalName,
        tagline: s.storeTagline || fallback.tagline,
        whatsappNumber,
        whatsappUrl: `https://wa.me/${whatsappNumber}`,
        address: s.address || fallback.address,
        city: s.city || fallback.city,
        instagramUrl,
        instagramHandle: instagramHandleFromUrl(instagramUrl, fallback.instagramHandle),
        shopeeUrl: s.shopeeUrl || fallback.shopeeUrl,
        mapsUrl: s.mapsUrl || fallback.mapsUrl,
        themeColor: s.storefrontThemeColor || fallback.themeColor,
        themeBackgroundColor: s.storefrontThemeBackgroundColor || fallback.themeBackgroundColor,
      };
    } catch (err) {
      console.error('[getCachedBranding]', err);
      return fallback;
    }
  },
  ['public-branding'],
  { revalidate: 3600, tags: ['branding'] }
);
