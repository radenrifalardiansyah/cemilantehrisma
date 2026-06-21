import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import KeripikKimpulPDF from '@/lib/pdf/KeripikKimpulPDF';

const ASSETS = path.join(process.cwd(), 'src', 'assets', 'images');

function toDataUri(filename: string): string {
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  const buffer = fs.readFileSync(path.join(ASSETS, filename));
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

export async function GET() {
  try {
    const logo      = toDataUri('logo-tehrisma.jpeg');
    const imgOri    = toDataUri('Keripik Kimpul 100g Original.png');
    const imgBBQ    = toDataUri('Keripik Kimpul 100g BBQ.png');
    const imgBBQPdas = toDataUri('Keripik Kimpul 100g BBQ Pedas.png');
    const imgJgn    = toDataUri('Keripik Kimpul 100g Jagung.png');
    const imgOri250 = toDataUri('Keripik Kimpul 250g Original.png');
    const halalLogo = toDataUri('logo-halal-indonesia.png');

    const buffer = await renderToBuffer(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.createElement(KeripikKimpulPDF, { logo, imgOri, imgBBQ, imgBBQPdas, imgJgn, imgOri250, halalLogo }) as any
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Proposal Keripik Kimpul - Cemilan Teh Risma.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[PDF] keripik-kimpul error:', err);
    return NextResponse.json({ error: 'Gagal generate PDF' }, { status: 500 });
  }
}
