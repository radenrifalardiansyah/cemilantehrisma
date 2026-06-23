import { NextRequest, NextResponse } from 'next/server';
import { type InvoiceData } from '@/lib/pdf/InvoicePDF';
import { getDb } from '@/lib/firebase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as InvoiceData;

    // Simpan data invoice ke Firestore (tanpa logo — di-inject saat serve)
    const { logo: _l, halalLogo: _h, ...invoiceData } = body;
    await getDb().collection('invoices').doc(body.invoiceNo).set({
      ...invoiceData,
      createdAt: new Date().toISOString(),
    });

    const origin     = req.nextUrl.origin;
    const invoiceUrl = `${origin}/api/invoice/${body.invoiceNo}`;

    return NextResponse.json({ url: invoiceUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[PDF] invoice error:', err);
    return NextResponse.json({ error: 'Gagal generate PDF', detail: msg }, { status: 500 });
  }
}
