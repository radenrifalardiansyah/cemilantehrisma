import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import InvoicePDF, { type InvoiceData } from '@/lib/pdf/InvoicePDF';
import { LOGO_DATA_URI, HALAL_DATA_URI } from '@/lib/invoice-assets';
import { getBucket } from '@/lib/firebase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as InvoiceData;

    const data: InvoiceData = { ...body, logo: LOGO_DATA_URI, halalLogo: HALAL_DATA_URI };

    const buffer = await renderToBuffer(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.createElement(InvoicePDF, { data }) as any
    );

    const safeName  = body.customerName.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '-');
    const filename  = `Invoice-${body.invoiceNo}-${safeName}.pdf`;
    const storagePath = `invoices/${filename}`;

    // Upload ke Firebase Storage dan buat URL publik
    const bucket = getBucket();
    const file   = bucket.file(storagePath);
    await file.save(Buffer.from(buffer), { contentType: 'application/pdf' });
    await file.makePublic();

    const invoiceUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

    return NextResponse.json({ url: invoiceUrl, filename });
  } catch (err) {
    console.error('[PDF] invoice error:', err);
    return NextResponse.json({ error: 'Gagal generate PDF' }, { status: 500 });
  }
}
