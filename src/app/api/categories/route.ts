import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getDb } from '@/lib/firebase';

// Public read of category banners managed from the admin dashboard.
// Matched to the static category list in @/lib/products by name (see /products page).
// Cached the same way as /api/products (see that route for why) — invalidated
// on demand via /api/revalidate instead of waiting out the 5-min TTL.
const getCachedCategories = unstable_cache(
  async () => {
    const db   = getDb();
    const snap = await db.collection('categories').get();
    return snap.docs.map(d => {
      const data = d.data() as { name?: string; bannerUrl?: string; emoji?: string; description?: string };
      return {
        id: d.id,
        name: data.name ?? '',
        bannerUrl: data.bannerUrl ?? '',
        emoji: data.emoji ?? '',
        description: data.description ?? '',
      };
    });
  },
  ['public-categories'],
  { revalidate: 300, tags: ['categories'] }
);

export async function GET() {
  try {
    const categories = await getCachedCategories();
    return NextResponse.json({ categories });
  } catch (err) {
    console.error('[api/categories]', err);
    return NextResponse.json({ categories: [] });
  }
}
