'use client';

import { useEffect, useState } from 'react';

type SoldByProduct = Record<string, number>;

const DEFAULT_STATS: SoldByProduct = {};

// Sama pola cache-nya dengan useReviewStats — satu fetch untuk seluruh katalog,
// dipakai bareng oleh semua ProductCard di halaman yang sama.
const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: { data: SoldByProduct; ts: number } | null = null;
let inFlight: Promise<SoldByProduct> | null = null;

function loadStats(): Promise<SoldByProduct> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return Promise.resolve(cache.data);
  if (inFlight) return inFlight;

  inFlight = fetch('/api/stats/products')
    .then(r => r.ok ? r.json() : null)
    .then((d: { soldByProduct?: SoldByProduct } | null) => {
      const stats = d?.soldByProduct ?? DEFAULT_STATS;
      cache = { data: stats, ts: Date.now() };
      return stats;
    })
    .catch(() => DEFAULT_STATS)
    .finally(() => { inFlight = null; });

  return inFlight;
}

// Jumlah terjual per produk, dihitung dari pesanan selesai di admin — bukan angka
// karangan. Kembalikan 0 untuk produk yang belum punya pesanan selesai.
export function useProductSoldCounts(): SoldByProduct {
  const [stats, setStats] = useState<SoldByProduct>(cache?.data ?? DEFAULT_STATS);

  useEffect(() => {
    let active = true;
    loadStats().then(s => { if (active) setStats(s); });
    return () => { active = false; };
  }, []);

  return stats;
}
