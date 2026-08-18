'use client';

import { useEffect, useState } from 'react';

export interface ReviewStats { soldCount: number; reviewCount: number; rating: number | null }

const DEFAULT_STATS: ReviewStats = { soldCount: 0, reviewCount: 0, rating: null };

// Sama pola cache-nya dengan useLiveProducts — coalesce fetch dari beberapa
// komponen di halaman yang sama, TTL pendek karena cache berat ada di server.
const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: { data: ReviewStats; ts: number } | null = null;
let inFlight: Promise<ReviewStats> | null = null;

function loadStats(): Promise<ReviewStats> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return Promise.resolve(cache.data);
  if (inFlight) return inFlight;

  inFlight = fetch('/api/stats/public')
    .then(r => r.ok ? r.json() : null)
    .then((d: ReviewStats | null) => {
      const stats = d ?? DEFAULT_STATS;
      cache = { data: stats, ts: Date.now() };
      return stats;
    })
    .catch(() => DEFAULT_STATS)
    .finally(() => { inFlight = null; });

  return inFlight;
}

export function useReviewStats(): ReviewStats {
  const [stats, setStats] = useState<ReviewStats>(cache?.data ?? DEFAULT_STATS);

  useEffect(() => {
    let active = true;
    loadStats().then(s => { if (active) setStats(s); });
    return () => { active = false; };
  }, []);

  return stats;
}
