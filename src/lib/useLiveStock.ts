'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';

type LiveStock = { stock: Product['stock']; stockQty: number };

// Live stock/PO status managed from the admin dashboard, keyed by product id.
// Falls back to each product's static `stock` value until this loads (or if a
// product has no matching Firestore entry).
export function useLiveStock(): Record<string, LiveStock> {
  const [map, setMap] = useState<Record<string, LiveStock>>({});

  useEffect(() => {
    fetch('/api/products/stock')
      .then(r => r.ok ? r.json() : null)
      .then((d: { stock: { id: string; stock: Product['stock']; stockQty: number }[] } | null) => {
        if (!d) return;
        const m: Record<string, LiveStock> = {};
        d.stock.forEach(s => { m[s.id] = { stock: s.stock, stockQty: s.stockQty }; });
        setMap(m);
      })
      .catch(() => {});
  }, []);

  return map;
}

export function withLiveStock(product: Product, live: Record<string, LiveStock>): Product {
  const l = live[product.id];
  return l ? { ...product, stock: l.stock } : product;
}
