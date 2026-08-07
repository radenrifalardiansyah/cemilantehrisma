import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getDb } from '@/lib/firebase';
import { isPublished, rawFromDoc } from '@/lib/liveProducts';

// Public read of the live product catalog managed from the admin dashboard.
// Merged client-side with the static catalog in @/lib/products (see /products page).
// Products the admin has unpublished are excluded here so they never reach the client.
// Cached server-side for 5 min (matches the homepage's ISR window) so visitor traffic
// doesn't translate 1:1 into Firestore reads — this endpoint alone was the main driver
// of exhausting the free Firestore quota.
const getCachedProducts = unstable_cache(
  async () => {
    const db = getDb();
    const snap = await db.collection('products').get();
    return snap.docs.map(d => rawFromDoc(d.id, d.data())).filter(isPublished);
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
