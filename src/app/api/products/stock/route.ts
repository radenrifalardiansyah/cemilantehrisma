import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';

const VALID_STOCK = new Set(['ready', 'habis', 'open_po']);

// Public read of live stock status, managed from the admin dashboard.
// Matched to the static product catalog in @/lib/products by id (see /products page).
export async function GET() {
  try {
    const db   = getDb();
    const snap = await db.collection('products').get();
    const stock = snap.docs.map(d => {
      const data = d.data() as { stock?: string; stockQty?: number };
      return {
        id: d.id,
        stock: VALID_STOCK.has(data.stock ?? '') ? data.stock : 'habis',
        stockQty: typeof data.stockQty === 'number' ? data.stockQty : 0,
      };
    });
    return NextResponse.json({ stock });
  } catch (err) {
    console.error('[api/products/stock]', err);
    return NextResponse.json({ stock: [] });
  }
}
