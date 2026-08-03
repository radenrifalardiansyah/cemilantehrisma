'use client';

import { useEffect, useState } from 'react';
import { products as staticProducts } from '@/lib/products';
import { Product } from '@/types';
import { FireProductRaw, mergeLiveProducts } from '@/lib/liveProducts';

// Live product catalog: the static bundled catalog merged with whatever is in
// Firestore (admin-edited prices/stock/copy, plus any product added after the
// initial seed). Falls back to the static catalog alone until the fetch resolves.
export function useLiveProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(staticProducts);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.ok ? r.json() : null)
      .then((d: { products: FireProductRaw[] } | null) => {
        if (!d) return;
        setProducts(mergeLiveProducts(staticProducts, d.products));
      })
      .catch(() => {});
  }, []);

  return products;
}
