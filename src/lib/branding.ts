export const BRAND_NAME = 'Cemilan Teh Risma';
export const LEGAL_NAME = 'Warung Teh Risma';
export const TAGLINE = 'Keripik Kimpul & Mie Kremes khas Bogor. Halal, renyah, tanpa pengawet.';

export const SITE_URL = 'https://cemilantehrisma.eleven-digital.id';

export const WHATSAPP_NUMBER = '6281212132014';

export const ADDRESS = {
  streetAddress: 'Jl. Batara Kp. Bubulak No. 54 RT01/RW03, Kel. Ciluar',
  addressLocality: 'Bogor Utara',
  addressRegion: 'Jawa Barat',
  postalCode: '16156',
  addressCountry: 'ID',
};

export const ADDRESS_LINES = ['Jl. Batara Kp. Bubulak No. 54 RT01/RW03', 'Kel. Ciluar, Kec. Bogor Utara 16156'];

export const SOCIAL = {
  instagramHandle: 'keripiktehrisma',
  instagramUrl: 'https://www.instagram.com/keripiktehrisma',
  shopeeUrl: 'https://shopee.co.id/tehrisma.id',
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
  mapsUrl: 'https://maps.app.goo.gl/h1AyYBaTH2tAqS588',
};

export const BUSINESS = {
  name: BRAND_NAME,
  legalName: LEGAL_NAME,
  telephone: `+${WHATSAPP_NUMBER}`,
  address: ADDRESS,
  sameAs: [SOCIAL.instagramUrl, SOCIAL.shopeeUrl, SOCIAL.whatsappUrl],
};

export const THEME_COLOR = '#D97706';
export const THEME_BACKGROUND_COLOR = '#FFFBF5';

export const DEVELOPER = {
  name: 'PT. Eleven Digital Indonesia',
  url: 'https://eleven-digital.id',
  supportedBy: 'PT. RMedia Production',
};

export interface LiveBranding {
  brandName: string;
  legalName: string;
  tagline: string;
  whatsappNumber: string;
  whatsappUrl: string;
  address: string;
  city: string;
  instagramUrl: string;
  instagramHandle: string;
  shopeeUrl: string;
  mapsUrl: string;
  themeColor: string;
  themeBackgroundColor: string;
}

// Static fallback used when the admin hasn't set a field yet (or Firestore is
// unreachable) — see src/lib/server/branding.ts (server) and useLiveBranding.ts (client).
export function defaultLiveBranding(): LiveBranding {
  return {
    brandName: BRAND_NAME,
    legalName: LEGAL_NAME,
    tagline: TAGLINE,
    whatsappNumber: WHATSAPP_NUMBER,
    whatsappUrl: SOCIAL.whatsappUrl,
    address: ADDRESS.streetAddress,
    city: `${ADDRESS.addressLocality}, ${ADDRESS.addressRegion}`,
    instagramUrl: SOCIAL.instagramUrl,
    instagramHandle: SOCIAL.instagramHandle,
    shopeeUrl: SOCIAL.shopeeUrl,
    mapsUrl: SOCIAL.mapsUrl,
    themeColor: THEME_COLOR,
    themeBackgroundColor: THEME_BACKGROUND_COLOR,
  };
}
