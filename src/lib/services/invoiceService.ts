import { getSql, parseJsonb } from '@/lib/db';
import { type InvoiceData } from '@/lib/pdf/InvoicePDF';

type StoredInvoice = Omit<InvoiceData, 'logo' | 'halalLogo'> & { createdAt: string };

interface InvoiceRow {
  invoice_no: string; date: string; customer_name: string; customer_phone: string;
  items: unknown; subtotal: string; discount: unknown; total: string;
  source: string | null; payment_status: string | null; created_at: Date;
}

export async function saveInvoice(data: Omit<InvoiceData, 'logo' | 'halalLogo'>): Promise<void> {
  const sql = getSql();
  await sql`
    insert into invoices (invoice_no, date, customer_name, customer_phone, items, subtotal, discount, total, source, payment_status, created_at)
    values (
      ${data.invoiceNo}, ${data.date}, ${data.customerName}, ${data.customerPhone},
      ${JSON.stringify(data.items)}, ${data.subtotal}, ${data.discount ? JSON.stringify(data.discount) : null}, ${data.total},
      ${data.source ?? null}, ${data.paymentStatus ?? null}, now()
    )
    on conflict (invoice_no) do update set
      date = excluded.date, customer_name = excluded.customer_name, customer_phone = excluded.customer_phone,
      items = excluded.items, subtotal = excluded.subtotal, discount = excluded.discount, total = excluded.total,
      source = excluded.source, payment_status = excluded.payment_status
  `;
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
    createdAt: row.created_at.toISOString(),
  };
}
