import { getDb } from '@/lib/firebase';
import { type InvoiceData } from '@/lib/pdf/InvoicePDF';

type StoredInvoice = Omit<InvoiceData, 'logo' | 'halalLogo'> & { createdAt: string };

export async function saveInvoice(data: Omit<InvoiceData, 'logo' | 'halalLogo'>): Promise<void> {
  const record: StoredInvoice = { ...data, createdAt: new Date().toISOString() };
  await getDb().collection('invoices').doc(data.invoiceNo).set(record);
}

export async function getInvoice(id: string): Promise<StoredInvoice | null> {
  const doc = await getDb().collection('invoices').doc(id).get();
  if (!doc.exists) return null;
  return doc.data() as StoredInvoice;
}
