'use client';

import { useEffect, useState } from 'react';

export interface LiveCategory {
  id: string;
  name: string;
  bannerUrl: string;
}

// Live category catalog managed from the admin dashboard, keyed by doc id (slug).
// A product's `category` field stores this same doc id, so lookups here are the
// source of truth for the display name — never render the raw `category` value.
export function useLiveCategories(): LiveCategory[] {
  const [categories, setCategories] = useState<LiveCategory[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.ok ? r.json() : null)
      .then((d: { categories: LiveCategory[] } | null) => {
        if (d) setCategories(d.categories);
      })
      .catch(() => {});
  }, []);

  return categories;
}

export function categoryNameById(categories: LiveCategory[], id: string): string {
  return categories.find(c => c.id === id)?.name ?? id;
}
