// Batas bayar pesanan portal: 24 jam sejak pesanan dibuat. Pembatalan otomatis oleh cron di admin
// belum dijadwalkan (workflow masih manual), jadi teks pelanggan tidak menjanjikannya. Konstanta ini satu-satunya sumber untuk tampilan pelanggan.
export const PAYMENT_WINDOW_HOURS = 24;
export const PAYMENT_WINDOW_MS = PAYMENT_WINDOW_HOURS * 60 * 60 * 1000;

/** Batas bayar = createdAt + 24 jam. null bila createdAt kosong/tidak valid. */
export function paymentDeadline(createdAt: string | number | Date | null | undefined): Date | null {
  if (createdAt === null || createdAt === undefined || createdAt === '') return null;
  const t = new Date(createdAt).getTime();
  return Number.isNaN(t) ? null : new Date(t + PAYMENT_WINDOW_MS);
}

export function isPaymentExpired(deadline: Date, now: Date = new Date()): boolean {
  return now.getTime() > deadline.getTime();
}

/** Contoh: "19 Nov 2026, 14.30 WIB". */
export function formatDeadlineWib(deadline: Date): string {
  const s = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    hour12: false, timeZone: 'Asia/Jakarta',
  }).format(deadline);
  return `${s} WIB`;
}

/** Pesanan masih menunggu pembayaran (belum lunas, belum ada bukti, belum diproses admin). */
export function isAwaitingPayment(o: {
  status: string; paymentStatus: string; hasProof: boolean; fulfillmentStatus?: string | null;
}): boolean {
  return o.status === 'baru' && o.paymentStatus === 'belum_lunas' && !o.hasProof && !o.fulfillmentStatus;
}
