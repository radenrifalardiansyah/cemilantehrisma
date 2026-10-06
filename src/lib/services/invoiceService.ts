import { randomBytes, timingSafeEqual } from 'crypto';
import { getSql, parseJsonb } from '@/lib/db';
import { type InvoiceData } from '@/lib/pdf/InvoicePDF';

type StoredInvoice = Omit<InvoiceData, 'logo' | 'halalLogo'> & { createdAt: string; token?: string };

interface InvoiceRow {
  invoice_no: string; date: string; customer_name: string; customer_phone: string;
  items: unknown; subtotal: string; discount: unknown; total: string;
  source: string | null; payment_status: string | null; token: string | null; created_at: Date;
}

// Link invoice publik memuat token acak (?t=...) — nomor invoice berurutan/mudah ditebak, jadi
// tanpa token siapa pun bisa membuka invoice (nama, HP, isi belanja) pelanggan lain. Invoice lama
// tanpa token tetap terbuka supaya link yang sudah terkirim tidak putus.
//
// Menyimpan invoice baru TIDAK pernah menimpa invoice yang sudah ada (insert-only, kembali null
// kalau nomornya sudah dipakai) — endpoint publik tidak boleh dipakai untuk mengubah isi invoice
// orang lain. Penulisan terautentikasi dari admin panel ada di admin app (/api/pos/invoice).
export async function saveInvoice(data: Omit<InvoiceData, 'logo' | 'halalLogo'>): Promise<string | null> {
  const sql = getSql();
  const token = randomBytes(16).toString('hex');
  const rows = await sql<{ token: string }[]>`
    insert into invoices (invoice_no, date, customer_name, customer_phone, items, subtotal, discount, total, source, payment_status, token, created_at)
    values (
      ${data.invoiceNo}, ${data.date}, ${data.customerName}, ${data.customerPhone},
      ${JSON.stringify(data.items)}, ${data.subtotal}, ${data.discount ? JSON.stringify(data.discount) : null}, ${data.total},
      ${data.source ?? null}, ${data.paymentStatus ?? null}, ${token}, now()
    )
    on conflict (invoice_no) do nothing
    returning token
  `;
  return rows[0]?.token ?? null;
}

// Cocokkan token dari link dengan token invoice (constant-time). Invoice tanpa token (lama) lolos.
export function invoiceTokenOk(saved: { token?: string }, provided: string | null): boolean {
  if (!saved.token) return true;
  if (!provided) return false;
  const a = Buffer.from(saved.token);
  const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function getInvoice(id: string): Promise<StoredInvoice | null> {
  const sql = getSql();
  const [row] = await sql<InvoiceRow[]>`select * from invoices where invoice_no = ${id}`;
  if (!row) return null;
  return {
    invoiceNo: row.invoice_no, date: row.date, customerName: row.customer_name, customerPhone: row.customer_phone,
    items: (parseJsonb(row.items) as InvoiceData['items'] | null) ?? [],
    subtotal: Number(row.subtotal),
    discount: (parseJsonb(row.discount) as InvoiceData['discount'] | null) ?? undefined,
    total: Number(row.total),
    source: (row.source as InvoiceData['source']) ?? undefined,
    paymentStatus: (row.payment_status as InvoiceData['paymentStatus']) ?? undefined,
    token: row.token ?? undefined,
    createdAt: row.created_at.toISOString(),
  };
}
