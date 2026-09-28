// Semua identitas toko (nama, logo, kontak, alamat, SEO, dst.) diedit dari admin panel
// (cemilantehrisma-admin > Settings) dan dibaca lewat getCachedBranding() (server) /
// useLiveBranding() (client). File ini sengaja TIDAK berisi data toko apa pun — hanya
// bentuk datanya, fallback netral kalau database tidak bisa dijangkau, dan helper format.

export const DEFAULT_THEME_COLOR = '#D97706';
export const DEFAULT_THEME_BACKGROUND_COLOR = '#FFFBF5';

// File statis netral di /public, dipakai hanya kalau admin belum upload logo.
export const FALLBACK_LOGO_PATH = '/icon-512.png';

// Kredit pengembang website (vendor), bukan identitas toko — sama di semua deployment.
export const DEVELOPER = {
  name: 'PT. Eleven Digital Indonesia',
  url: 'https://elevendigital-id.vercel.app',
  supportedBy: 'PT. RMedia Production',
};

export interface LiveBranding {
  brandName: string;
  legalName: string;
  tagline: string;
  description: string;
  ownerName: string;
  logoUrl: string;
  siteUrl: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  whatsappUrl: string;
  address: string;
  city: string;
  region: string;
  nib: string;
  openHours: string;
  instagramUrl: string;
  instagramHandle: string;
  tiktokUrl: string;
  shopeeUrl: string;
  shopeeName: string;
  mapsUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  googleSiteVerification: string;
  themeColor: string;
  themeBackgroundColor: string;
}

// URL situs kalau admin belum mengisi "URL Website": env eksplisit, lalu domain produksi
// yang otomatis di-set Vercel, lalu localhost untuk dev.
export function envSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:3000';
}

// "0812-1213-2014" / "+62 812..." / "62812..." -> "6281212132014" (format wa.me).
export function normalizeWhatsapp(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('8')) return `62${digits}`;
  return digits;
}

// "6281212132014" -> "0812-1213-2014" untuk ditampilkan.
export function formatWhatsappDisplay(normalized: string): string {
  if (!normalized) return '';
  const local = normalized.startsWith('62') ? `0${normalized.slice(2)}` : normalized;
  return local.replace(/^(\d{4})(\d{4})(\d+)$/, '$1-$2-$3');
}

export function whatsappLink(b: Pick<LiveBranding, 'whatsappNumber'>, text?: string): string {
  const base = `https://wa.me/${b.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

// "Kota Bogor" -> "Bogor", "Kabupaten Bandung" -> "Bandung" — dipakai di copy seperti "khas Bogor".
export function regionFromCity(city: string): string {
  return city
    .split(',')[0]
    .replace(/^(kota|kabupaten|kab\.?)\s+/i, '')
    .trim();
}

// Cloudinary: sisipkan transformasi (mis. kotak 192px untuk ikon PWA). URL lain dikembalikan apa adanya.
export function logoVariant(url: string, size: number): string {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/c_pad,b_white,w_${size},h_${size},f_png/`);
}

export function absoluteUrl(siteUrl: string, pathOrUrl: string): string {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${siteUrl}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export function hostOf(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

// Fallback netral saat database tidak bisa dijangkau atau field belum diisi di admin.
export function defaultLiveBranding(): LiveBranding {
  return {
    brandName: 'Toko Online',
    legalName: '',
    tagline: '',
    description: '',
    ownerName: '',
    logoUrl: FALLBACK_LOGO_PATH,
    siteUrl: envSiteUrl(),
    whatsappNumber: '',
    whatsappDisplay: '',
    whatsappUrl: '',
    address: '',
    city: '',
    region: '',
    nib: '',
    openHours: '',
    instagramUrl: '',
    instagramHandle: '',
    tiktokUrl: '',
    shopeeUrl: '',
    shopeeName: '',
    mapsUrl: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    googleSiteVerification: '',
    themeColor: DEFAULT_THEME_COLOR,
    themeBackgroundColor: DEFAULT_THEME_BACKGROUND_COLOR,
  };
}
