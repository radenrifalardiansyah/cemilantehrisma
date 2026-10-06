import { NextRequest, NextResponse } from 'next/server';
import { type InvoiceData } from '@/lib/pdf/InvoicePDF';
import { saveInvoice } from '@/lib/services/invoiceService';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as InvoiceData;
    const { logo: _l, halalLogo: _h, ...invoiceData } = body;

    const token = await saveInvoice(invoiceData);
    // Nomor sudah dipakai: endpoint publik ini tidak boleh menimpa invoice yang ada.
    if (!token) return NextResponse.json({ error: 'Nomor invoice sudah dipakai.' }, { status: 409 });

    const invoiceUrl = `${req.nextUrl.origin}/api/invoice/${body.invoiceNo}?t=${token}`;
    return NextResponse.json({ url: invoiceUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[invoice-pdf]', err);
    return NextResponse.json({ error: 'Gagal menyimpan invoice', detail: msg }, { status: 500 });
  }
}
