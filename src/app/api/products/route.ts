import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';
import { rawFromDoc } from '@/lib/liveProducts';

// Public read of the live product catalog managed from the admin dashboard.
// Merged client-side with the static catalog in @/lib/products (see /products page).
export async function GET() {
  try {
    const db = getDb();
    const snap = await db.collection('products').get();
    const products = snap.docs.map(d => rawFromDoc(d.id, d.data()));
    return NextResponse.json({ products });
  } catch (err) {
    console.error('[api/products]', err);
    return NextResponse.json({ products: [] });
  }
}
