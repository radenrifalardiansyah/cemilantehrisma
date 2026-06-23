import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import InvoicePDF, { type InvoiceData } from '@/lib/pdf/InvoicePDF';

async function fetchAsDataUri(url: string, mime: string): Promise<string> {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return `data:${mime};base64,${Buffer.from(buf).toString('base64')}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as InvoiceData;

    const origin = req.nextUrl.origin;
    const [logo, halalLogo] = await Promise.all([
      fetchAsDataUri(`${origin}/logo-tehrisma.jpeg`,       'image/jpeg'),
      fetchAsDataUri(`${origin}/logo-halal-indonesia.png`, 'image/png'),
    ]);

    const data: InvoiceData = { ...body, logo, halalLogo };

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
