import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
import { getSessionCustomer } from '@/lib/customerAuth';

export async function GET(req: NextRequest) {
  const session = await getSessionCustomer(req);
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  // `orders` pindah ke Postgres (Tahap 12 migrasi Fase 2 — lihat plan gleaming-wondering-quokka.md).
  const sql = getSql();
  const [{ exists: eligible }] = await sql<{ exists: boolean }[]>`select exists(select 1 from orders where customer_id = ${session.id} and status = 'selesai')`;

  const [row] = await sql<{ rating: number | null; comment: string | null; approved: boolean }[]>`
    select rating, comment, approved from reviews where id = ${session.id}
  `;
  const review = row ? { rating: row.rating ?? 0, comment: row.comment ?? '', approved: row.approved } : null;

  return NextResponse.json({ eligible, review });
}
