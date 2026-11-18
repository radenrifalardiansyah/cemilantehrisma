// Status pesanan yang tampil ke pelanggan, diturunkan dari `status` + `fulfillment_status`.
export type DisplayStatus =
  | 'menunggu_konfirmasi' | 'diproses' | 'dikirim' | 'siap_diambil' | 'selesai' | 'dibatalkan';

export const DISPLAY_STATUS_LABEL: Record<DisplayStatus, string> = {
  menunggu_konfirmasi: 'Menunggu konfirmasi',
  diproses: 'Diproses',
  dikirim: 'Dikirim',
  siap_diambil: 'Siap diambil',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};

export const DISPLAY_STATUS_COLOR: Record<DisplayStatus, string> = {
  menunggu_konfirmasi: 'bg-blue-50 text-blue-700 border-blue-200',
  diproses: 'bg-amber-50 text-amber-700 border-amber-200',
  dikirim: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  siap_diambil: 'bg-teal-50 text-teal-700 border-teal-200',
  selesai: 'bg-green-50 text-green-700 border-green-200',
  dibatalkan: 'bg-red-50 text-red-700 border-red-200',
};

export function getDisplayStatus(status: string, fulfillmentStatus?: string | null): DisplayStatus {
  if (status === 'dibatalkan') return 'dibatalkan';
  if (status === 'selesai' || status === 'done') return 'selesai';
  if (fulfillmentStatus === 'diproses' || fulfillmentStatus === 'dikirim' || fulfillmentStatus === 'siap_diambil') {
    return fulfillmentStatus;
  }
  return 'menunggu_konfirmasi';
}

// Langkah timeline; langkah ketiga bergantung pada metode (dikirim/siap diambil).
export function getTimelineSteps(
  display: DisplayStatus, deliveryMethod: 'pickup' | 'delivery',
): { key: DisplayStatus; label: string; done: boolean; current: boolean }[] {
  if (display === 'dibatalkan') return [];
  const third: DisplayStatus =
    display === 'dikirim' ? 'dikirim'
    : display === 'siap_diambil' ? 'siap_diambil'
    : deliveryMethod === 'delivery' ? 'dikirim' : 'siap_diambil';
  const keys: DisplayStatus[] = ['menunggu_konfirmasi', 'diproses', third, 'selesai'];
  const idx = keys.indexOf(display);
  return keys.map((key, i) => ({ key, label: DISPLAY_STATUS_LABEL[key], done: i < idx, current: i === idx }));
}
