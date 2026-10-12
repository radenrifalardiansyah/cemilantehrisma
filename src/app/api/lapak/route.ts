import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getSql, parseJsonb } from '@/lib/db';

// Daftar produk & stok per lapak untuk menu "Lapak" (hanya lihat — tidak ada pembelian). Data berasal dari
// database yang sama dengan admin: stok TITIPAN (consign_stall_items) dan produk TOKO di gudang lapak.
// Hanya field publik yang keluar: nama, gambar, kategori, berat, deskripsi, harga jual di lapak, stok.
// Data penitip, skema bagi hasil, dan harga setor TIDAK pernah diikutkan.
// Di-cache 60 dtk (stok berubah sepanjang hari, tapi pembacaan database tetap tidak sebanding jumlah pengunjung).
export interface LapakProduct {
  id: string; kind: 'titipan' | 'toko'; name: string; imageUrl: string; weight: string; description: string;
  category: string; emoji: string; price: number; stock: number; unit: string;
}
export interface LapakStall { id: string; name: string; address: string; logoUrl: string; isStore: boolean; products: LapakProduct[] }

const getCachedLapak = unstable_cache(
  async (): Promise<{ stalls: LapakStall[]; updatedAt: string }> => {
    const sql = getSql();
    const stalls = await sql<{ id: string; name: string; address: string; logo_url: string | null; is_store: boolean }[]>`
      select id, name, address, logo_url, is_store from stalls where is_active and show_in_storefront
      order by is_store desc, created_at asc
    `;
    if (stalls.length === 0) return { stalls: [], updatedAt: new Date().toISOString() };
    const ids = stalls.map(s => s.id);

    // Query dijalankan berurutan (bukan paralel) — pooler Supabase bisa macet kalau terlalu banyak query menumpuk.
    const consign = await sql<{ stall_id: string; product_id: string; name: string; image_url: string | null; weight: string | null; description: string | null; unit: string | null; category: string | null; emoji: string | null; price: string; stock_qty: string }[]>`
      select si.stall_id, p.id as product_id, p.name, p.image_url, p.weight, p.description, p.unit,
             cat.name as category, cat.emoji, coalesce(si.price, p.default_price) as price, si.stock_qty
      from consign_stall_items si
      join consign_products p on p.id = si.product_id
      join consignors c on c.id = p.consignor_id
      left join categories cat on cat.id = p.category
      where si.stall_id in ${sql(ids)} and p.is_active and c.is_active
        and (si.scheme is not null or p.scheme is not null or c.scheme is not null)
      order by p.name
    `;
    const own = await sql<{ stall_id: string; id: string; name: string | null; image_urls: unknown; weight: string | null; description: string | null; emoji: string | null; category: string | null; price: string | null; stock_qty: string }[]>`
      select s.id as stall_id, p.id, p.name, p.image_urls, p.weight, p.description, p.emoji, cat.name as category,
             coalesce(sp.price, p.price) as price, ws.stock_qty
      from stalls s
      join warehouse_stock ws on ws.warehouse_id = s.warehouse_id
      join products p on p.id = ws.product_id
      left join categories cat on cat.id = p.category
      left join stall_product_prices sp on sp.stall_id = s.id and sp.product_id = p.id
      where s.id in ${sql(ids)} and s.show_own_products and ws.stock_qty > 0 and p.published
      order by p.name
    `;

    const byStall = new Map<string, LapakProduct[]>(ids.map(id => [id, []]));
    for (const r of consign) {
      byStall.get(r.stall_id)!.push({
        id: `t-${r.product_id}`, kind: 'titipan', name: r.name, imageUrl: r.image_url ?? '', weight: r.weight ?? '', description: r.description ?? '',
        category: r.category ?? '', emoji: r.emoji ?? '', price: Number(r.price) || 0, stock: Math.max(0, Number(r.stock_qty) || 0), unit: r.unit || 'pcs',
      });
    }
    for (const r of own) {
      const images = parseJsonb<string[]>(r.image_urls as string[] | string | null) ?? [];
      byStall.get(r.stall_id)!.push({
        id: `p-${r.id}`, kind: 'toko', name: r.name ?? '', imageUrl: images[0] ?? '', weight: r.weight ?? '', description: r.description ?? '',
        category: r.category ?? '', emoji: r.emoji ?? '', price: Number(r.price) || 0, stock: Math.max(0, Number(r.stock_qty) || 0), unit: 'pcs',
      });
    }
    return {
      stalls: stalls.map(s => ({ id: s.id, name: s.name, address: s.address, logoUrl: s.logo_url ?? '', isStore: s.is_store, products: byStall.get(s.id)!.sort((a, b) => a.name.localeCompare(b.name, 'id')) })),
      updatedAt: new Date().toISOString(),
    };
  },
  ['public-lapak'],
  { revalidate: 60, tags: ['lapak'] },
);

export async function GET() {
  try {
    return NextResponse.json(await getCachedLapak());
  } catch (err) {
    console.error('[api/lapak]', err);
    return NextResponse.json({ stalls: [], updatedAt: new Date().toISOString() });
  }
}
