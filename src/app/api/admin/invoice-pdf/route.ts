import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import InvoicePDF, { type InvoiceData } from '@/lib/pdf/InvoicePDF';
import { LOGO_DATA_URI, HALAL_DATA_URI } from '@/lib/invoice-assets';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as InvoiceData;

    const data: InvoiceData = { ...body, logo: LOGO_DATA_URI, halalLogo: HALAL_DATA_URI };

    const buffer = await renderToBuffer(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.createElement(InvoicePDF, { data }) as any
    );

    const safeName = body.customerName.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '-');
    const filename = `Invoice-${body.invoiceNo}-${safeName}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control':       'no-store',
      },
    });
  } catch (err) {
    console.error('[PDF] invoice error:', err);
    return NextResponse.json({ error: 'Gagal generate PDF' }, { status: 500 });
  }
}
