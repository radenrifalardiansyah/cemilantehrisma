import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
import { getSessionCustomer } from '@/lib/customerAuth';

interface ReviewBody { rating?: number; comment?: string }

// Hanya customer yang pernah punya pesanan berstatus "selesai" yang boleh memberi
// ulasan — mencegah rating dari orang yang belum pernah benar-benar belanja.
// Ulasan baru selalu masuk sebagai belum disetujui (approved: false); admin app
// yang menyetujuinya langsung di Postgres, lalu memanggil POST /api/revalidate
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

  // `orders` pindah ke Postgres (Tahap 12 migrasi Fase 2 — lihat plan gleaming-wondering-quokka.md).
  const sql = getSql();
  const [{ exists }] = await sql<{ exists: boolean }[]>`select exists(select 1 from orders where customer_id = ${session.id} and status = 'selesai')`;
  if (!exists) {
    return NextResponse.json({ error: 'not_eligible' }, { status: 403 });
  }

  // Satu review per customer (id baris = customer id) — kirim ulang menimpa total (rating/comment/
  // approved/created_at semuanya, bukan cuma field yang berubah), sama seperti `.set({merge:true})`
  // versi Firestore lama yang mengirim SEMUA field tiap kali termasuk createdAt baru.
  await sql`
    insert into reviews (id, customer_id, customer_name, rating, comment, approved, created_at, updated_at)
    values (${session.id}, ${session.id}, ${session.name}, ${rating}, ${comment}, false, now(), now())
    on conflict (id) do update set
      customer_id = excluded.customer_id, customer_name = excluded.customer_name, rating = excluded.rating,
      comment = excluded.comment, approved = excluded.approved, created_at = excluded.created_at, updated_at = excluded.updated_at
  `;

  return NextResponse.json({ ok: true });
}
