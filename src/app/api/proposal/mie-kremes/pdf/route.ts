import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import MieKremesPDF from '@/lib/pdf/MieKremesPDF';

const ASSETS = path.join(process.cwd(), 'src', 'assets', 'images');

function toDataUri(filename: string): string {
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  const buffer = fs.readFileSync(path.join(ASSETS, filename));
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

export async function GET() {
  try {
    const logo     = toDataUri('logo-tehrisma.jpeg');
    const imgOri   = toDataUri('Mie Kremes 150g Original.png');
    const imgPdas  = toDataUri('Mie Kremes 150g Pedas.png');
    const halalLogo = toDataUri('logo-halal-indonesia.png');

    const buffer = await renderToBuffer(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.createElement(MieKremesPDF, { logo, imgOri, imgPdas, halalLogo }) as any
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Proposal Mie Kremes - Cemilan Teh Risma.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[PDF] mie-kremes error:', err);
    return NextResponse.json({ error: 'Gagal generate PDF' }, { status: 500 });
  }
}
