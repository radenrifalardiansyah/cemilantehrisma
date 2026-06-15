import { NextRequest, NextResponse } from 'next/server';

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL   ?? '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? '';

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

async function redisPipeline(commands: string[][]): Promise<Array<{ result: unknown }>> {
  if (!REDIS_URL || !REDIS_TOKEN) return [];
  try {
    const res = await fetch(`${REDIS_URL}/pipeline`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify(commands),
      cache:   'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const PAGES = ['/', '/products', '/reseller', '/panduan', '/kontak', '/checkout'];

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!REDIS_URL || !REDIS_TOKEN) {
    return NextResponse.json({ error: 'no_redis' }, { status: 500 });
  }

  // Last 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });

  const commands: string[][] = [
    ...days.map(d => ['get',   `analytics:views:${d}`]),
    ...days.map(d => ['scard', `analytics:visitors:${d}`]),
    ...PAGES.map(p => ['get',  `analytics:page:${p}`]),
    ['get', 'analytics:device:mobile'],
    ['get', 'analytics:device:desktop'],
  ];

  const results = await redisPipeline(commands);

  const n = (r: { result: unknown } | undefined) => Number(r?.result) || 0;

  const pageViews = days.reduce((sum, _, i) => sum + n(results[i]), 0);
  const visitors  = days.reduce((sum, _, i) => sum + n(results[30 + i]), 0);
  const mobile    = n(results[60 + PAGES.length]);
  const desktop   = n(results[61 + PAGES.length]);

  const paths = PAGES
    .map((p, i) => ({ path: p, visitors: n(results[60 + i]) }))
    .filter(p => p.visitors > 0)
    .sort((a, b) => b.visitors - a.visitors);

  return NextResponse.json({
    stats:   { visitors, pageViews },
    devices: [
      { type: 'mobile',  count: mobile  },
      { type: 'desktop', count: desktop },
    ],
    paths,
  });
}
