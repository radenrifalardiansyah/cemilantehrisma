import { parseJsonb } from '@/lib/db';

// Baris Postgres `products` (Supabase, sama dengan cemilantehrisma-admin) -> shape yang sama
// persis dengan dokumen Firestore lama yang diharapkan `rawFromDoc` di lib/liveProducts.ts —
// supaya seluruh logic overlay/merge di sana tidak perlu berubah sama sekali.
export interface ProductRow {
  id: string; name: string | null; description: string | null; details: unknown;
  category: string | null; price: string | null; original_price: string | null;
  weight: string | null; emoji: string | null; image_urls: unknown;
  gradient: string | null; bg_color: string | null; badge: string | null;
  stock_qty: string; stock: string; sort_order: number | null; published: boolean;
}

export function rowToProductData(row: ProductRow): Record<string, unknown> {
  return {
    name: row.name ?? '',
    description: row.description ?? '',
    details: parseJsonb(row.details) ?? [],
    price: row.price != null ? Number(row.price) : 0,
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    emoji: row.emoji ?? '🛍️',
    imageUrls: parseJsonb(row.image_urls) ?? [],
    category: row.category ?? '',
    badge: row.badge ?? undefined,
    stock: row.stock,
    stockQty: Number(row.stock_qty) || 0,
    gradient: row.gradient ?? 'from-amber-700 to-yellow-500',
    bgColor: row.bg_color ?? '#B45309',
    weight: row.weight ?? '',
    order: row.sort_order ?? undefined,
    published: row.published,
  };
}

export const PRODUCT_SELECT_COLUMNS = `
  id, name, description, details, category, price, original_price, weight, emoji,
  image_urls, gradient, bg_color, badge, stock_qty, stock, sort_order, published
`;
