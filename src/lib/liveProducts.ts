import type { StaticImageData } from 'next/image';
import { Product } from '@/types';

// Shape returned by GET /api/products (Firestore product docs, admin-managed).
export interface FireProductRaw {
  id: string;
  name: string;
  description: string;
  details: string[];
  price: number;
  originalPrice?: number;
  emoji: string;
  imageUrls: string[];
  category: string;
  badge?: string;
  stock: string;
  stockQty?: number;
  gradient: string;
  bgColor: string;
  weight: string;
  order?: number;
  published?: boolean;
}

const VALID_STOCK = new Set(['ready', 'habis', 'open_po']);
const VALID_BADGE = new Set(['Popular', 'New', 'Best Seller']);

// Converts a raw Firestore product document into the shape returned by GET /api/products.
// Shared by that route and by the server-side single-product lookup used in generateMetadata.
export function rawFromDoc(id: string, data: Record<string, unknown>): FireProductRaw {
  return {
    id,
    name: (data.name as string) ?? '',
    description: (data.description as string) ?? '',
    details: Array.isArray(data.details) ? data.details as string[] : [],
    price: typeof data.price === 'number' ? data.price : 0,
    originalPrice: typeof data.originalPrice === 'number' ? data.originalPrice : undefined,
    emoji: (data.emoji as string) ?? '🛍️',
    imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls as string[] : [],
    category: (data.category as string) ?? '',
    badge: (data.badge as string) || undefined,
    stock: (data.stock as string) ?? 'habis',
    stockQty: typeof data.stockQty === 'number' ? data.stockQty : undefined,
    gradient: (data.gradient as string) ?? 'from-amber-700 to-yellow-500',
    bgColor: (data.bgColor as string) ?? '#B45309',
    weight: (data.weight as string) ?? '',
    order: typeof data.order === 'number' ? data.order : undefined,
    published: data.published as boolean | undefined,
  };
}

// A product with no explicit `published` field (legacy docs written before this flag
// existed) is treated as published, so nothing already live gets hidden retroactively.
export const isPublished = (f: Pick<FireProductRaw, 'published'>): boolean => f.published !== false;

export function fireToProduct(f: FireProductRaw): Product {
  return {
    id: f.id,
    name: f.name,
    description: f.description,
    details: f.details.length ? f.details : [f.description].filter(Boolean),
    price: f.price,
    originalPrice: f.originalPrice,
    emoji: f.emoji,
    images: f.imageUrls,
    category: f.category,
    badge: VALID_BADGE.has(f.badge ?? '') ? (f.badge as Product['badge']) : undefined,
    stock: VALID_STOCK.has(f.stock) ? (f.stock as Product['stock']) : 'habis',
    stockQty: f.stockQty,
    gradient: f.gradient,
    bgColor: f.bgColor,
    weight: f.weight,
  };
}

// Overlays a live Firestore product onto its static catalog counterpart. Firestore is
// the source of truth for anything an admin can edit (price, stock, name, ...); the
// static entry's bundled images are kept as a fallback for legacy/seeded products that
// have no admin-uploaded photos yet.
export function mergeProduct(base: Product | undefined, f: FireProductRaw | undefined): Product | undefined {
  if (!f) return base;
  const live = fireToProduct(f);
  if (!base) return live;
  return { ...base, ...live, images: f.imageUrls.length ? f.imageUrls : base.images };
}

// Merges the static bundled catalog (local optimized images, curated copy) with the
// live Firestore catalog managed from the admin dashboard. Products that only exist in
// Firestore (added via the admin panel after the initial seed) are included as-is.
export function mergeLiveProducts(staticList: Product[], fireList: FireProductRaw[]): Product[] {
  const publishedFire = fireList.filter(isPublished);
  const fireById = new Map(publishedFire.map(f => [f.id, f]));
  // A static product whose Firestore doc was explicitly unpublished is hidden
  // entirely, rather than falling back to the static entry.
  const unpublishedIds = new Set(fireList.filter(f => !isPublished(f)).map(f => f.id));

  // Curated catalog order is preserved for legacy/seeded products; anything the
  // admin adds afterwards (not part of the static catalog) is appended at the end,
  // ordered by the admin's manual `order` field when set.
  const known = staticList
    .filter(base => !unpublishedIds.has(base.id))
    .map(base => mergeProduct(base, fireById.get(base.id)) as Product);

  const knownIds = new Set(staticList.map(p => p.id));
  const extra = publishedFire
    .filter(f => !knownIds.has(f.id))
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    .map(fireToProduct);

  return [...known, ...extra];
}

export function imageSrc(img: StaticImageData | string): string {
  return typeof img === 'string' ? img : img.src;
}
