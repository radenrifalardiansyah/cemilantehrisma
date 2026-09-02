import { NextRequest, NextResponse } from 'next/server';
import { getDb, FieldValue } from '@/lib/firebase';
import { getSql } from '@/lib/db';
import { getSessionCustomer } from '@/lib/customerAuth';

interface ReviewBody { rating?: number; comment?: string }

// Hanya customer yang pernah punya pesanan berstatus "selesai" yang boleh memberi
// ulasan — mencegah rating dari orang yang belum pernah benar-benar belanja.
// Ulasan baru selalu masuk sebagai belum disetujui (approved: false); admin app
// yang menyetujuinya langsung di Firestore, lalu memanggil POST /api/revalidate
// dengan tag "stats" supaya rating publik di beranda ikut ter-update.
export async function POST(req: NextRequest) {
  const session = await getSessionCustomer(req);
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const body: ReviewBody = await req.json().catch(() => ({}));
  const rating = Math.round(Number(body.rating));
  const comment = (body.comment ?? '').toString().trim().slice(0, 500);

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'invalid_rating' }, { status: 400 });
  }

  const db = getDb();

  // `orders` pindah ke Postgres (Tahap 12 migrasi Fase 2 — lihat plan gleaming-wondering-quokka.md).
  const sql = getSql();
  const [{ exists }] = await sql<{ exists: boolean }[]>`select exists(select 1 from orders where customer_id = ${session.id} and status = 'selesai')`;
  if (!exists) {
    return NextResponse.json({ error: 'not_eligible' }, { status: 403 });
  }

  await db.collection('reviews').doc(session.id).set({
    customerId: session.id,
    customerName: session.name,
    rating,
    comment,
    approved: false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });

  return NextResponse.json({ ok: true });
}
