import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getSql } from '@/lib/db';
import { isPublished, rawFromDoc } from '@/lib/liveProducts';
import { rowToProductData, type ProductRow } from '@/lib/server/productRow';

// Public read of the live product catalog managed from the admin dashboard.
// Merged client-side with the static catalog in @/lib/products (see /products page).
// Products the admin has unpublished are excluded here so they never reach the client.
// Cached server-side for 5 min (matches the homepage's ISR window) so visitor traffic
// doesn't translate 1:1 into database reads — this endpoint alone (reading Firestore
// directly) was the original driver of exhausting the free Firestore quota; product data
// now lives in Postgres (Supabase), which has no comparable daily read cap.
const getCachedProducts = unstable_cache(
  async () => {
    const sql = getSql();
    const rows = await sql<ProductRow[]>`
      select id, name, description, details, category, price, original_price, weight, emoji,
        image_urls, gradient, bg_color, badge, stock_qty, stock, sort_order, published
      from products
    `;
    return rows.map(r => rawFromDoc(r.id, rowToProductData(r))).filter(isPublished);
  },
  ['public-products'],
  { revalidate: 300, tags: ['products'] }
);

export async function GET() {
  try {
    const products = await getCachedProducts();
    return NextResponse.json({ products });
  } catch (err) {
    console.error('[api/products]', err);
    return NextResponse.json({ products: [] });
  }
}
