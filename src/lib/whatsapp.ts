import { LiveBranding, whatsappLink } from '@/lib/branding';

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export interface ResellerInfo {
  nama: string;
  whatsapp: string;
  kota: string;
  alamat: string;
  platform: string[];
  paket: string;
  pengalaman: string;
}

export const formatResellerMessage = (data: ResellerInfo, brandName: string): string => {
  const platformLine = data.platform.length > 0 ? data.platform.join(', ') : '-';
  const pengalamanLine = data.pengalaman.trim() || '-';
  const paketLine = data.paket || '-';

  return `*PENDAFTARAN RESELLER ${brandName.toUpperCase()}*

*Data Pendaftar*
Nama      : ${data.nama}
No. WA    : ${data.whatsapp}
Kota      : ${data.kota}
Alamat    : ${data.alamat}

*Minat Paket*
Paket     : ${paketLine}
Platform  : ${platformLine}
Pengalaman: ${pengalamanLine}

Saya ingin *secure slot* reseller ${brandName}. Mohon info lebih lanjut ya, terima kasih!`.trim();
};

export const openResellerWhatsApp = (data: ResellerInfo, branding: Pick<LiveBranding, 'brandName' | 'whatsappNumber'>): void => {
  const url = whatsappLink(branding, formatResellerMessage(data, branding.brandName));
  window.open(url, '_blank', 'noopener,noreferrer');
};
