import { getSql } from '@/lib/db';
import { isPublished, mergeLiveProducts, mergeProduct, rawFromDoc } from '@/lib/liveProducts';
import { rowToProductData, type ProductRow } from '@/lib/server/productRow';
import { Product } from '@/types';

// Server-only lookup for a single product, used by /products/[id] (metadata + JSON-LD)
// and the homepage's featured-product JSON-LD, AND by checkout's live stock check. Always
// overlays live Postgres data (admin-managed price/stock/name/images/...) onto the static
// catalog entry, so SEO metadata, structured data, and checkout validation stay in sync
// with the admin panel instead of only reflecting whatever was baked in at the last deploy.
// Falls back to the static entry (or undefined) if Postgres has no matching row. A product
// explicitly unpublished from the admin panel is hidden entirely, even if a static catalog
// entry exists.
export async function getMergedProduct(id: string, staticList: Product[]): Promise<Product | undefined> {
  const base = staticList.find(p => p.id === id);
  try {
    const sql = getSql();
    const [row] = await sql<ProductRow[]>`
      select id, name, description, details, category, price, original_price, weight, emoji,
        image_urls, gradient, bg_color, badge, stock_qty, stock, sort_order, published
      from products where id = ${id}
    `;
    if (!row) return base;
    const raw = rawFromDoc(row.id, rowToProductData(row));
    if (!isPublished(raw)) return undefined;
    return mergeProduct(base, raw);
  } catch (err) {
    console.error('[getMergedProduct]', err);
    return base;
  }
}

// Server-only lookup for the full catalog (static + live Postgres overlay), used
// where a page needs every product rather than one — e.g. the homepage's price range.
export async function getAllMergedProducts(staticList: Product[]): Promise<Product[]> {
  try {
    const sql = getSql();
    const rows = await sql<ProductRow[]>`
      select id, name, description, details, category, price, original_price, weight, emoji,
        image_urls, gradient, bg_color, badge, stock_qty, stock, sort_order, published
      from products
    `;
    const fireList = rows.map(r => rawFromDoc(r.id, rowToProductData(r)));
    return mergeLiveProducts(staticList, fireList);
  } catch (err) {
    console.error('[getAllMergedProducts]', err);
    return staticList;
  }
}
