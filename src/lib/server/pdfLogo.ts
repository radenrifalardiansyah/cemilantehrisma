import path from 'path';
import fs from 'fs';
import { FALLBACK_LOGO_PATH, logoVariant, type LiveBranding } from '@/lib/branding';

function publicFileDataUri(publicPath: string): string {
  const file = path.join(process.cwd(), 'public', publicPath.replace(/^\/+/, ''));
  const ext = path.extname(file).toLowerCase();
  const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
}

// Logo toko (upload admin) sebagai data URI untuk @react-pdf — diambil dulu di sini supaya
// PDF tetap jadi walau Cloudinary lambat/gagal (fallback ke ikon netral di /public).
export async function pdfLogoSrc(branding: Pick<LiveBranding, 'logoUrl'>): Promise<string> {
  const url = branding.logoUrl;
  if (/^https?:\/\//.test(url)) {
    try {
      const res = await fetch(logoVariant(url, 240), { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const type = res.headers.get('content-type') || 'image/png';
        const buf = Buffer.from(await res.arrayBuffer());
        return `data:${type};base64,${buf.toString('base64')}`;
      }
    } catch (err) {
      console.error('[pdfLogoSrc]', err);
    }
    return publicFileDataUri(FALLBACK_LOGO_PATH);
  }
  return publicFileDataUri(url || FALLBACK_LOGO_PATH);
}
