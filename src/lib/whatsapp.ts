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

export const formatResellerMessage = (data: ResellerInfo): string => {
  const platformLine = data.platform.length > 0 ? data.platform.join(', ') : '-';
  const pengalamanLine = data.pengalaman.trim() || '-';
  const paketLine = data.paket || '-';

  return `*PENDAFTARAN RESELLER MIE KREMES TEH RISMA*
_Asli Gurihnya, Mantap Pedasnya!_

*Data Pendaftar*
Nama      : ${data.nama}
No. WA    : ${data.whatsapp}
Kota      : ${data.kota}
Alamat    : ${data.alamat}

*Minat Paket*
Paket     : ${paketLine}
Platform  : ${platformLine}
Pengalaman: ${pengalamanLine}

Saya ingin *secure slot* reseller Mie Kremes Teh Risma. Mohon info lebih lanjut ya Teh, terima kasih!`.trim();
};

export const openResellerWhatsApp = (data: ResellerInfo, whatsappNumber: string): void => {
  const message = formatResellerMessage(data);
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};
