import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';
import { getSql } from '@/lib/db';
import { getSessionCustomer } from '@/lib/customerAuth';

export async function GET(req: NextRequest) {
  const session = await getSessionCustomer(req);
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const db = getDb();

  // `orders` pindah ke Postgres (Tahap 12 migrasi Fase 2 — lihat plan gleaming-wondering-quokka.md).
  const sql = getSql();
  const [{ exists: eligible }] = await sql<{ exists: boolean }[]>`select exists(select 1 from orders where customer_id = ${session.id} and status = 'selesai')`;

  const reviewDoc = await db.collection('reviews').doc(session.id).get();
  const data = reviewDoc.data() as { rating?: number; comment?: string; approved?: boolean } | undefined;
  const review = reviewDoc.exists
    ? { rating: data?.rating ?? 0, comment: data?.comment ?? '', approved: data?.approved ?? false }
    : null;

  return NextResponse.json({ eligible, review });
}
