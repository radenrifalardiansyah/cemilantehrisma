import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getSql, parseJsonb } from '@/lib/db';

interface OrderItemDoc { productId?: string; qty?: number }

// Angka "terjual" per produk yang ditampilkan di kartu & halaman detail produk —
// dihitung dari pesanan selesai (website & kasir online, sama seperti
// /api/stats/public) tapi dikelompokkan per productId. Konsinyasi tidak
// termasuk karena consignmentRecaps tidak punya breakdown per produk, jadi
// angka per-produk di sini bisa lebih kecil dari total agregat di beranda.
// Cache 1 jam, tag "stats" (sudah di-revalidate admin app lewat
// POST /api/revalidate setiap kali pesanan ditandai selesai).
// `orders` pindah ke Postgres (Tahap 12 migrasi Fase 2 — lihat plan gleaming-wondering-quokka.md).
const getCachedProductStats = unstable_cache(
  async () => {
    const sql = getSql();
    const orderRows = await sql<{ items: unknown }[]>`select items from orders where status in ('selesai', 'done')`;

    const soldByProduct: Record<string, number> = {};
    for (const row of orderRows) {
      const items = (parseJsonb(row.items) as OrderItemDoc[] | null) ?? [];
      for (const it of items) {
        const id = (it.productId ?? '').trim();
        if (!id) continue;
        soldByProduct[id] = (soldByProduct[id] ?? 0) + (it.qty ?? 0);
      }
    }

    return soldByProduct;
  },
  ['public-product-stats'],
  { revalidate: 3600, tags: ['stats'] }
);

export async function GET() {
  try {
    const soldByProduct = await getCachedProductStats();
    return NextResponse.json({ soldByProduct });
  } catch (err) {
    console.error('[api/stats/products]', err);
    return NextResponse.json({ soldByProduct: {} });
  }
}
