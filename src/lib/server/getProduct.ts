import { getDb } from '@/lib/firebase';
import { mergeProduct, rawFromDoc } from '@/lib/liveProducts';
import { Product } from '@/types';

// Server-only lookup for a single product, used by /products/[id] (metadata + JSON-LD)
// and the homepage's featured-product JSON-LD. Always overlays live Firestore data
// (admin-managed price/stock/name/images/...) onto the static catalog entry, so SEO
// metadata and structured data stay in sync with the admin panel instead of only
// reflecting whatever was baked in at the last deploy. Falls back to the static entry
// (or undefined) if Firestore has no matching doc.
export async function getMergedProduct(id: string, staticList: Product[]): Promise<Product | undefined> {
  const base = staticList.find(p => p.id === id);
  try {
    const doc = await getDb().collection('products').doc(id).get();
    if (!doc.exists) return base;
    return mergeProduct(base, rawFromDoc(doc.id, doc.data() ?? {}));
  } catch (err) {
    console.error('[getMergedProduct]', err);
    return base;
  }
}
