'use client';

import { useEffect, useState } from 'react';
import { products as staticProducts } from '@/lib/products';
import { Product } from '@/types';
import { FireProductRaw, mergeLiveProducts } from '@/lib/liveProducts';

// Module-level cache shared by every component using this hook, so mounting
// several of them on the same page (e.g. Hero + FeaturedSection) fires a single
// /api/products request instead of one each. TTL mirrors the API route's own
// 5-minute server-side cache — no point re-fetching more often than that.
const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: { data: Product[]; ts: number } | null = null;
let inFlight: Promise<Product[]> | null = null;

function loadLiveProducts(): Promise<Product[]> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return Promise.resolve(cache.data);
  if (inFlight) return inFlight;

  inFlight = fetch('/api/products')
    .then(r => r.ok ? r.json() : null)
    .then((d: { products: FireProductRaw[] } | null) => {
      const merged = d ? mergeLiveProducts(staticProducts, d.products) : staticProducts;
      cache = { data: merged, ts: Date.now() };
      return merged;
    })
    .catch(() => staticProducts)
    .finally(() => { inFlight = null; });

  return inFlight;
}

// Live product catalog: the static bundled catalog merged with whatever is in
// Firestore (admin-edited prices/stock/copy, plus any product added after the
// initial seed). Falls back to the static catalog alone until the fetch resolves.
export function useLiveProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(cache?.data ?? staticProducts);

  useEffect(() => {
    let active = true;
    loadLiveProducts().then(p => { if (active) setProducts(p); });
    return () => { active = false; };
  }, []);

  return products;
}
