import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';

function isAuthed(req: NextRequest) {
  const auth = req.headers.get('x-admin-auth') ?? '';
  const [user, ...rest] = auth.split(':');
  const pass = rest.join(':');
  const validUser = (process.env.ADMIN_USERNAME ?? '').trim();
  const validPass = (process.env.ADMIN_PASSWORD ?? '').trim();
  if (!!validUser && user === validUser && pass === validPass) return true;
  const cookie = req.cookies.get('admin_auth')?.value ?? '';
  const [cu, ...cr] = cookie.split(':');
  return !!validUser && cu === validUser && cr.join(':') === validPass;
}

const PAGE_KEYS: Record<string, string> = {
  home:      '/',
  products:  '/products',
  reseller:  '/reseller',
  panduan:   '/panduan',
  kontak:    '/kontak',
  checkout:  '/checkout',
};

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    return NextResponse.json({ error: 'no_firebase' }, { status: 500 });
  }

  // Last 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });

  try {
    const snapshots = await Promise.all(
      days.map(day => getDb().collection('analytics').doc(day).get())
    );

    let pageViews = 0;
    let mobile    = 0;
    let desktop   = 0;
    const pageAgg: Record<string, number> = {};
    const visitorSet = new Set<string>();
    const daily: Array<{ date: string; views: number; visitors: number }> = [];

    for (let i = 0; i < snapshots.length; i++) {
      const snap = snapshots[i];
      if (!snap.exists) {
        daily.push({ date: days[i], views: 0, visitors: 0 });
        continue;
      }
      const data = snap.data()!;
      const dayViews    = Number(data.views ?? 0);
      const dayMobile   = Number(data.mobile  ?? 0);
      const dayDesktop  = Number(data.desktop ?? 0);
      pageViews += dayViews;
      mobile    += dayMobile;
      desktop   += dayDesktop;

      const visArr = Array.isArray(data.visitors) ? (data.visitors as string[]) : [];
      for (const id of visArr) visitorSet.add(id);

      for (const [key, count] of Object.entries(data.pages ?? {})) {
        pageAgg[key] = (pageAgg[key] ?? 0) + Number(count);
      }

      daily.push({ date: days[i], views: dayViews, visitors: visArr.length });
    }

    const paths = Object.entries(PAGE_KEYS)
      .map(([key, path]) => ({ path, visitors: pageAgg[key] ?? 0 }))
      .filter(p => p.visitors > 0)
      .sort((a, b) => b.visitors - a.visitors);

    return NextResponse.json({
      stats:   { visitors: visitorSet.size, pageViews },
      devices: [
        { type: 'mobile',  count: mobile  },
        { type: 'desktop', count: desktop },
      ],
      paths,
      daily: daily.slice(0, 7).reverse(),
    });
  } catch (err) {
    console.error('[admin/stats] Firebase error:', err);
    return NextResponse.json({ error: 'firebase_error', stats: null, paths: [], devices: [] });
  }
}
