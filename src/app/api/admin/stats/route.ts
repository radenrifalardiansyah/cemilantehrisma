import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsStats, PAGE_KEYS } from '@/lib/services/analyticsService';

function isAuthed(req: NextRequest) {
  const validUser = (process.env.ADMIN_USERNAME ?? '').trim();
  const validPass = (process.env.ADMIN_PASSWORD ?? '').trim();

  const auth = req.headers.get('x-admin-auth') ?? '';
  const [user, ...rest] = auth.split(':');
  if (validUser && user === validUser && rest.join(':') === validPass) return true;

  const cookie = req.cookies.get('admin_auth')?.value ?? '';
  const [cu, ...cr] = cookie.split(':');
  return validUser ? cu === validUser && cr.join(':') === validPass : false;
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    return NextResponse.json({ error: 'no_firebase' }, { status: 500 });
  }

  try {
    const { visitors, pageViews, mobile, desktop, pageAgg, daily } =
      await getAnalyticsStats(30);

    const paths = Object.entries(PAGE_KEYS)
      .map(([key, path]) => ({ path, visitors: pageAgg[key] ?? 0 }))
      .filter(p => p.visitors > 0)
      .sort((a, b) => b.visitors - a.visitors);

    return NextResponse.json({
      stats:   { visitors, pageViews },
      devices: [{ type: 'mobile', count: mobile }, { type: 'desktop', count: desktop }],
      paths,
      daily:   daily.slice(0, 7).reverse(),
    });
  } catch (err) {
    console.error('[admin/stats] Firebase error:', err);
    return NextResponse.json({ error: 'firebase_error', stats: null, paths: [], devices: [] });
  }
}
