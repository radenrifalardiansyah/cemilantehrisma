import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getSql } from '@/lib/db';

// Public read of category banners managed from the admin dashboard.
// Matched to the static category list in @/lib/products by name (see /products page).
// Cached the same way as /api/products (see that route for why) — invalidated
// on demand via /api/revalidate instead of waiting out the 5-min TTL.
const getCachedCategories = unstable_cache(
  async () => {
    const sql = getSql();
    const rows = await sql<{ id: string; name: string | null; banner_url: string | null; emoji: string | null; description: string | null }[]>`
      select id, name, banner_url, emoji, description from categories order by sort_order asc
    `;
    return rows.map(r => ({
      id: r.id,
      name: r.name ?? '',
      bannerUrl: r.banner_url ?? '',
      emoji: r.emoji ?? '',
      description: r.description ?? '',
    }));
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
