import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';

// Public read of category banners managed from the admin dashboard.
// Matched to the static category list in @/lib/products by name (see /products page).
export async function GET() {
  try {
    const db   = getDb();
    const snap = await db.collection('categories').get();
    const categories = snap.docs.map(d => {
      const data = d.data() as { name?: string; bannerUrl?: string };
      return { id: d.id, name: data.name ?? '', bannerUrl: data.bannerUrl ?? '' };
    });
    return NextResponse.json({ categories });
  } catch (err) {
    console.error('[api/categories]', err);
    return NextResponse.json({ categories: [] });
  }
}
