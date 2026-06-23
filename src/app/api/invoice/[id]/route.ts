import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import InvoicePDF, { type InvoiceData } from '@/lib/pdf/InvoicePDF';
import { LOGO_DATA_URI, HALAL_DATA_URI } from '@/lib/invoice-assets';
import { getDb } from '@/lib/firebase';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = await getDb().collection('invoices').doc(id).get();

    if (!doc.exists) {
      return new NextResponse('Invoice tidak ditemukan.', { status: 404 });
    }

    const saved = doc.data() as Omit<InvoiceData, 'logo' | 'halalLogo'>;
    const data: InvoiceData = { ...saved, logo: LOGO_DATA_URI, halalLogo: HALAL_DATA_URI };

    const buffer = await renderToBuffer(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.createElement(InvoicePDF, { data }) as any
    );

    const safeName = saved.customerName.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '-');
    const filename = `Invoice-${saved.invoiceNo}-${safeName}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control':       'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('[PDF] serve error:', err);
    return new NextResponse('Gagal membuka invoice.', { status: 500 });
  }
}
