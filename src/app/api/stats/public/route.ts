import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getDb } from '@/lib/firebase';

interface OrderDoc { status?: string; items?: { qty?: number }[] }
interface ReviewDoc { approved?: boolean; rating?: number }
interface RecapDoc { totalSold?: number }

// Angka "terjual" & rating yang ditampilkan di beranda — dihitung dari pesanan
// selesai (website & kasir online) plus rekap penjualan mitra/reseller, dan
// ulasan yang sudah disetujui admin, bukan angka tetap lagi. Cache 1 jam
// (lebih longgar dari /api/products) karena statistik ini tidak perlu real-time;
// admin app bisa memanggil POST /api/revalidate dengan tag "stats" untuk
// memperbarui lebih cepat setelah menyetujui ulasan atau menyelesaikan pesanan.
const getCachedStats = unstable_cache(
  async () => {
    const db = getDb();

    // Pesanan website selesai berstatus 'selesai'; pesanan kasir online tidak
    // pernah berubah dari 'done' (lihat admin app), jadi keduanya harus dihitung.
    const ordersSnap = await db.collection('orders').where('status', 'in', ['selesai', 'done']).get();
    const orderSoldCount = ordersSnap.docs.reduce((sum, d) => {
      const items = (d.data() as OrderDoc).items ?? [];
      return sum + items.reduce((s, it) => s + (it.qty ?? 0), 0);
    }, 0);

    // Penjualan mitra/reseller (konsinyasi) direkap terpisah di consignmentRecaps,
    // dengan totalSold sudah berupa jumlah unit terjual per rekap.
    const recapsSnap = await db.collection('consignmentRecaps').get();
    const recapSoldCount = recapsSnap.docs.reduce((sum, d) => sum + ((d.data() as RecapDoc).totalSold ?? 0), 0);

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
