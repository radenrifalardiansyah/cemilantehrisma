import { getDb, FieldValue } from '@/lib/firebase';

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

export async function trackPageView(
  path: string,
  device: string,
  sessionId?: string,
): Promise<void> {
  const today   = new Date().toISOString().slice(0, 10);
  const devKey  = device === 'mobile' ? 'mobile' : 'desktop';
  const pageKey = pathToPageKey(path);

  const update: Record<string, unknown> = {
    views:                FieldValue.increment(1),
    [devKey]:             FieldValue.increment(1),
    [`pages.${pageKey}`]: FieldValue.increment(1),
  };

  if (sessionId) update['visitors'] = FieldValue.arrayUnion(sessionId);

  await getDb().collection('analytics').doc(today).set(update, { merge: true });
}

export type ClickType = 'menu' | 'category' | 'product' | 'addcart';

const CLICK_FIELD: Record<ClickType, string> = {
  menu:     'clickMenu',
  category: 'clickCategory',
  product:  'clickProduct',
  addcart:  'clickAddCart',
};

export async function trackClick(type: ClickType, rawKey: string): Promise<void> {
  const key = type === 'menu' ? pathToPageKey(rawKey) : sanitizeKey(rawKey);
  if (!key) return;
  const today = new Date().toISOString().slice(0, 10);
  const field = CLICK_FIELD[type];

  await getDb().collection('analytics').doc(today).set({
    [`${field}.${key}`]: FieldValue.increment(1),
  }, { merge: true });
}

export async function getAnalyticsStats(numDays: number): Promise<AnalyticsStats> {
  const days = Array.from({ length: numDays }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });

  const snapshots = await Promise.all(
    days.map(day => getDb().collection('analytics').doc(day).get()),
  );

  let pageViews = 0, mobile = 0, desktop = 0;
  const visitorSet = new Set<string>();
  const pageAgg: Record<string, number> = {};
  const clickMenuAgg: Record<string, number> = {};
  const clickCategoryAgg: Record<string, number> = {};
  const clickProductAgg: Record<string, number> = {};
  const clickAddCartAgg: Record<string, number> = {};
  const daily: AnalyticsStats['daily'] = [];

  const addTo = (agg: Record<string, number>, source: unknown) => {
    for (const [key, count] of Object.entries((source as Record<string, number>) ?? {})) {
      agg[key] = (agg[key] ?? 0) + Number(count);
    }
  };

  for (let i = 0; i < snapshots.length; i++) {
    const snap = snapshots[i];
    if (!snap.exists) {
      daily.push({ date: days[i], views: 0, visitors: 0 });
      continue;
    }
    const data      = snap.data()!;
    const dayViews  = Number(data.views   ?? 0);
    const dayMob    = Number(data.mobile  ?? 0);
    const dayDesk   = Number(data.desktop ?? 0);
    pageViews += dayViews;
    mobile    += dayMob;
    desktop   += dayDesk;

    const visArr = Array.isArray(data.visitors) ? (data.visitors as string[]) : [];
    for (const id of visArr) visitorSet.add(id);

    addTo(pageAgg, data.pages);
    addTo(clickMenuAgg, data.clickMenu);
    addTo(clickCategoryAgg, data.clickCategory);
    addTo(clickProductAgg, data.clickProduct);
    addTo(clickAddCartAgg, data.clickAddCart);

    daily.push({ date: days[i], views: dayViews, visitors: visArr.length });
  }

  return {
    visitors: visitorSet.size, pageViews, mobile, desktop,
    pageAgg, clickMenuAgg, clickCategoryAgg, clickProductAgg, clickAddCartAgg,
    daily,
  };
}
