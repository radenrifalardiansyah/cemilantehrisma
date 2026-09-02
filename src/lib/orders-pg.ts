import { parseJsonb } from '@/lib/db';

// Baris Postgres `orders` (Supabase, sama dengan cemilantehrisma-admin — Tahap 12 migrasi Fase 2,
// lihat plan gleaming-wondering-quokka.md) -> shape camelCase yang dipakai halaman riwayat
// pesanan/pembayaran, supaya frontend tidak perlu berubah.
export interface OrderRow {
  id: string; invoice_no: string | null; date: string | null;
  customer_name: string; customer_phone: string | null; customer_id: string | null;
  items: unknown; total: string;
  status: string; delivery_method: string | null; address: string | null;
  payment_method: string | null; payment_status: string;
  transfer_bank: string | null; transfer_proof_url: string | null;
  created_at: Date;
}

export function toTimestamp(d: Date | null | undefined) {
  if (!d) return null;
  return { seconds: Math.floor(d.getTime() / 1000), nanoseconds: 0 };
}

export function rowToOrder(r: OrderRow) {
  return {
    id: r.id,
    invoiceNo: r.invoice_no ?? r.id,
    date: r.date ?? '',
    customerName: r.customer_name,
    customerPhone: r.customer_phone ?? '',
    customerId: r.customer_id ?? undefined,
    items: (parseJsonb(r.items) as unknown[]) ?? [],
    total: Number(r.total),
    status: r.status,
    deliveryMethod: r.delivery_method === 'delivery' ? 'delivery' as const : 'pickup' as const,
    address: r.address ?? '',
    paymentMethod: r.payment_method ?? null,
    paymentStatus: r.payment_status,
    transferBank: r.transfer_bank ?? '',
    transferProofUrl: r.transfer_proof_url ?? '',
    createdAt: toTimestamp(r.created_at),
  };
}
