import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import InvoicePDF, { type InvoiceData } from '@/lib/pdf/InvoicePDF';
import { HALAL_DATA_URI } from '@/lib/invoice-assets';
import { pdfLogoSrc } from '@/lib/server/pdfLogo';
import { getInvoice, invoiceTokenOk } from '@/lib/services/invoiceService';
import { getCachedBranding } from '@/lib/server/branding';
import { getSettings } from '@/lib/settings-pg';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [saved, branding, settings] = await Promise.all([
      getInvoice(id),
      getCachedBranding(),
      getSettings().catch(() => ({} as Record<string, unknown>)),
    ]);
    const bankNumber = String(settings.storeBankAccountNumber ?? '').trim();
    const bank = bankNumber
      ? {
          name: String(settings.storeBankName ?? '').trim() || 'Bank',
          accountNumber: bankNumber,
          accountHolder: String(settings.storeBankAccountHolder ?? '').trim() || undefined,
        }
      : undefined;

    // 404 (bukan 403) untuk token salah — tidak membocorkan bahwa nomor invoice itu ada.
    if (!saved || !invoiceTokenOk(saved, req.nextUrl.searchParams.get('t'))) {
      return new NextResponse('Invoice tidak ditemukan.', { status: 404 });
    }

    const printedAt = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const data: InvoiceData = { ...saved, printedAt, logo: await pdfLogoSrc(branding), halalLogo: HALAL_DATA_URI, bank };

    const buffer = await renderToBuffer(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.createElement(InvoicePDF, { data, branding }) as any,
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
    console.error('[invoice/serve]', err);
    return new NextResponse('Gagal membuka invoice.', { status: 500 });
  }
}
