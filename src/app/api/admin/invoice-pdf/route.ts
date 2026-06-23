import { NextRequest, NextResponse } from 'next/server';
import { type InvoiceData } from '@/lib/pdf/InvoicePDF';
import { saveInvoice } from '@/lib/services/invoiceService';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as InvoiceData;
    const { logo: _l, halalLogo: _h, ...invoiceData } = body;

    await saveInvoice(invoiceData);

    const invoiceUrl = `${req.nextUrl.origin}/api/invoice/${body.invoiceNo}`;
    return NextResponse.json({ url: invoiceUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[invoice-pdf]', err);
    return NextResponse.json({ error: 'Gagal menyimpan invoice', detail: msg }, { status: 500 });
  }
}
