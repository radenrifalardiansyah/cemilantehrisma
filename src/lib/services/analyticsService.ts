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
  visitors:  number;
  pageViews: number;
  mobile:    number;
  desktop:   number;
  pageAgg:   Record<string, number>;
  daily:     Array<{ date: string; views: number; visitors: number }>;
}

export async function trackPageView(
  path: string,
  device: string,
  sessionId?: string,
): Promise<void> {
  const today   = new Date().toISOString().slice(0, 10);
  const devKey  = device === 'mobile' ? 'mobile' : 'desktop';
  const pageKey = path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '_');

  const update: Record<string, unknown> = {
    views:                FieldValue.increment(1),
    [devKey]:             FieldValue.increment(1),
    [`pages.${pageKey}`]: FieldValue.increment(1),
  };

  if (sessionId) update['visitors'] = FieldValue.arrayUnion(sessionId);

  await getDb().collection('analytics').doc(today).set(update, { merge: true });
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
  const daily: AnalyticsStats['daily'] = [];

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

    for (const [key, count] of Object.entries(data.pages ?? {})) {
      pageAgg[key] = (pageAgg[key] ?? 0) + Number(count);
    }

    daily.push({ date: days[i], views: dayViews, visitors: visArr.length });
  }

  return { visitors: visitorSet.size, pageViews, mobile, desktop, pageAgg, daily };
}
