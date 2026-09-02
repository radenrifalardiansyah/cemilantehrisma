import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getDb } from '@/lib/firebase';
import { getSql, parseJsonb } from '@/lib/db';

interface ReviewDoc { approved?: boolean; rating?: number }

// Angka "terjual" & rating yang ditampilkan di beranda — dihitung dari pesanan
// selesai (website & kasir online) plus rekap penjualan mitra/reseller, dan
// ulasan yang sudah disetujui admin, bukan angka tetap lagi. Cache 1 jam
// (lebih longgar dari /api/products) karena statistik ini tidak perlu real-time;
// admin app bisa memanggil POST /api/revalidate dengan tag "stats" untuk
// memperbarui lebih cepat setelah menyetujui ulasan atau menyelesaikan pesanan.
const getCachedStats = unstable_cache(
  async () => {
    const db = getDb();
    const sql = getSql();

    // `orders` pindah ke Postgres (Tahap 12 migrasi Fase 2 — lihat plan gleaming-wondering-quokka.md).
    // Pesanan website selesai berstatus 'selesai'; pesanan kasir online lama tidak pernah berubah
    // dari 'done' (bug lama di admin app, sudah dinormalisasi saat backfill — 'done' tetap dicek
    // di sini untuk jaga-jaga).
    const orderRows = await sql<{ items: unknown }[]>`select items from orders where status in ('selesai', 'done')`;
    const orderSoldCount = orderRows.reduce((sum, r) => {
      const items = (parseJsonb(r.items) as { qty?: number }[] | null) ?? [];
      return sum + items.reduce((s, it) => s + (it.qty ?? 0), 0);
    }, 0);

    // Penjualan mitra/reseller (konsinyasi) direkap terpisah di consignment_recaps (Postgres,
    // Tahap 13 migrasi Fase 2), dengan total_sold sudah berupa jumlah unit terjual per rekap.
    const [{ sold }] = await sql<{ sold: string | null }[]>`select coalesce(sum(total_sold), 0) as sold from consignment_recaps`;
    const recapSoldCount = Number(sold) || 0;

    const soldCount = orderSoldCount + recapSoldCount;

    const reviewsSnap = await db.collection('reviews').where('approved', '==', true).get();
    const ratings = reviewsSnap.docs
      .map(d => (d.data() as ReviewDoc).rating ?? 0)
      .filter(r => r >= 1 && r <= 5);
    const rating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

    return { soldCount, reviewCount: ratings.length, rating };
  },
  ['public-stats'],
  { revalidate: 3600, tags: ['stats'] }
);

export async function GET() {
  try {
    const stats = await getCachedStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error('[api/stats/public]', err);
    return NextResponse.json({ soldCount: 0, reviewCount: 0, rating: null });
  }
}
