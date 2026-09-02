import { getSql } from '@/lib/db';

// Bucket harian analytics harus mengikuti hari kalender WIB (Asia/Jakarta) — toko buka & tutup
// menurut jam WIB, bukan UTC. `new Date().toISOString().slice(0,10)` (dipakai sebelumnya di sini)
// memakai hari kalender UTC, yang di server ber-zona-waktu UTC (umum di banyak platform hosting)
// membuat pergantian hari jatuh pukul 07:00 WIB — kunjungan/klik antara 00:00–07:00 WIB setiap
// hari tercatat di bucket hari SEBELUMNYA, bukan hari itu sendiri.
function wibDateKey(d: Date = new Date()): string {
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
}

export const PAGE_KEYS: Record<string, string> = {
  home:      '/',
  products:  '/products',
  reseller:  '/reseller',
  panduan:   '/panduan',
  kontak:    '/kontak',
  checkout:  '/checkout',
};

export const PAGE_LABELS: Record<string, string> = {
  home:      'Beranda',
  products:  'Menu Produk',
  reseller:  'Reseller',
  panduan:   'Panduan',
  kontak:    'Kontak',
  checkout:  'Checkout',
};

export interface AnalyticsStats {
  visitors:         number;
  pageViews:        number;
  mobile:           number;
  desktop:          number;
  pageAgg:          Record<string, number>;
  clickMenuAgg:     Record<string, number>;
  clickCategoryAgg: Record<string, number>;
  clickProductAgg:  Record<string, number>;
  clickAddCartAgg:  Record<string, number>;
  daily:            Array<{ date: string; views: number; visitors: number }>;
}

export function pathToPageKey(path: string): string {
  return path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '_');
}

function sanitizeKey(key: string): string {
  return key.replace(/[.~*/[\]]/g, '_');
}

// Postgres `analytics_events` — satu baris per event (page view / klik), bukan counter
// tergabung seperti dokumen Firestore lama. Tulisan jadi INSERT polos (tidak ada race
// read-modify-write), agregasi dihitung saat baca lewat GROUP BY di `getAnalyticsStats`.
export async function trackPageView(
  path: string,
  device: string,
  sessionId?: string,
): Promise<void> {
  const sql     = getSql();
  const today   = wibDateKey();
  const devKey  = device === 'mobile' ? 'mobile' : 'desktop';
  const pageKey = pathToPageKey(path);

  await sql`
    insert into analytics_events (day, kind, page_key, device, session_id)
    values (${today}, 'pageview', ${pageKey}, ${devKey}, ${sessionId ?? null})
  `;
}

export type ClickType = 'menu' | 'category' | 'product' | 'addcart';

export async function trackClick(type: ClickType, rawKey: string): Promise<void> {
  const key = type === 'menu' ? pathToPageKey(rawKey) : sanitizeKey(rawKey);
  if (!key) return;
  const sql   = getSql();
  const today = wibDateKey();

  await sql`insert into analytics_events (day, kind, click_type, click_key) values (${today}, 'click', ${type}, ${key})`;
}

export async function getAnalyticsStats(numDays: number): Promise<AnalyticsStats> {
  const sql = getSql();
  const days = Array.from({ length: numDays }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return wibDateKey(d);
  });

  const [dailyRows, deviceRows, pageRows, clickRows, [totalVisitors]] = await Promise.all([
    sql<{ day: string; views: number; visitors: number }[]>`
      select day, count(*)::int as views, count(distinct session_id)::int as visitors
      from analytics_events where kind = 'pageview' and day = any(${days}) group by day
    `,
    sql<{ device: string; n: number }[]>`
      select device, count(*)::int as n from analytics_events
      where kind = 'pageview' and day = any(${days}) group by device
    `,
    sql<{ page_key: string; n: number }[]>`
      select page_key, count(*)::int as n from analytics_events
      where kind = 'pageview' and day = any(${days}) group by page_key
    `,
    sql<{ click_type: string; click_key: string; n: number }[]>`
      select click_type, click_key, count(*)::int as n from analytics_events
      where kind = 'click' and day = any(${days}) group by click_type, click_key
    `,
    sql<{ visitors: number }[]>`
      select count(distinct session_id)::int as visitors from analytics_events
      where kind = 'pageview' and day = any(${days}) and session_id is not null
    `,
  ]);

  const dailyMap = new Map(dailyRows.map(r => [r.day, r]));
  const daily: AnalyticsStats['daily'] = days.map(day => {
    const r = dailyMap.get(day);
    return { date: day, views: r?.views ?? 0, visitors: r?.visitors ?? 0 };
  });
  const pageViews = dailyRows.reduce((s, r) => s + r.views, 0);

  let mobile = 0, desktop = 0;
  for (const r of deviceRows) {
    if (r.device === 'mobile') mobile = r.n;
    else if (r.device === 'desktop') desktop = r.n;
  }

  const pageAgg: Record<string, number> = {};
  for (const r of pageRows) pageAgg[r.page_key] = r.n;

  const clickMenuAgg: Record<string, number> = {};
  const clickCategoryAgg: Record<string, number> = {};
  const clickProductAgg: Record<string, number> = {};
  const clickAddCartAgg: Record<string, number> = {};
  const CLICK_AGG: Record<string, Record<string, number>> = {
    menu: clickMenuAgg, category: clickCategoryAgg, product: clickProductAgg, addcart: clickAddCartAgg,
  };
  for (const r of clickRows) {
    const agg = CLICK_AGG[r.click_type];
    if (agg) agg[r.click_key] = r.n;
  }

  return {
    visitors: totalVisitors.visitors, pageViews, mobile, desktop,
    pageAgg, clickMenuAgg, clickCategoryAgg, clickProductAgg, clickAddCartAgg,
    daily,
  };
}
