import { getDb } from '@/lib/firebase';
import { mergeLiveProducts, mergeProduct, rawFromDoc } from '@/lib/liveProducts';
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

// Server-only lookup for the full catalog (static + live Firestore overlay), used
// where a page needs every product rather than one — e.g. the homepage's price range.
export async function getAllMergedProducts(staticList: Product[]): Promise<Product[]> {
  try {
    const snap = await getDb().collection('products').get();
    const fireList = snap.docs.map(d => rawFromDoc(d.id, d.data()));
    return mergeLiveProducts(staticList, fireList);
  } catch (err) {
    console.error('[getAllMergedProducts]', err);
    return staticList;
  }
}
