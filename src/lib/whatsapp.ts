import { CartItem, CustomerInfo } from '@/types';

// Nomor WhatsApp Cemilan Teh Risma (format internasional: 62 + nomor tanpa 0)
export const WHATSAPP_NUMBER = '6281212132014';

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export const formatWhatsAppMessage = (
  items: CartItem[],
  customer: CustomerInfo,
  totalPrice: number
): string => {
  const orderLines = items
    .map(
      (item, i) =>
        `${i + 1}. ${item.product.name} (${item.product.weight})\n    ${item.quantity} pcs x ${formatCurrency(item.product.price)} = *${formatCurrency(item.product.price * item.quantity)}*`
    )
    .join('\n');

  const metodeLine =
    customer.deliveryMethod === 'delivery'
      ? `Delivery\nAlamat : ${customer.address}`
      : `Ambil Sendiri (Pickup)`;

  const noteLine = customer.note ? `\nCatatan : ${customer.note}` : '';

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return `*PESANAN CEMILAN TEH RISMA*
_Keripik Kimpul - Gurih, Bikin Nagih!_

*Detail Pesanan*
${orderLines}

Jumlah item  : ${itemCount} pcs
*Total bayar : ${formatCurrency(totalPrice)}*

*Data Pemesan*
Nama   : ${customer.name}
No HP  : ${customer.phone}
Metode : ${metodeLine}${noteLine}

Mohon segera dikonfirmasi pesanannya ya Teh, terima kasih! 🙏`.trim();
};

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

Saya ingin *secure slot* reseller Mie Kremes Teh Risma. Mohon info lebih lanjut ya Teh, terima kasih! 🙏`.trim();
};

export const openResellerWhatsApp = (data: ResellerInfo): void => {
  const message = formatResellerMessage(data);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const openWhatsApp = (
  items: CartItem[],
  customer: CustomerInfo,
  totalPrice: number
): void => {
  const message = formatWhatsAppMessage(items, customer, totalPrice);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};
