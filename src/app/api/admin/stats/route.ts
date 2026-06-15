import { NextRequest, NextResponse } from 'next/server';

function isAuthed(req: NextRequest) {
  const auth = req.headers.get('x-admin-auth') ?? '';
  const [user, ...rest] = auth.split(':');
  const pass = rest.join(':');
  const validUser = (process.env.ADMIN_USERNAME ?? '').trim();
  const validPass = (process.env.ADMIN_PASSWORD ?? '').trim();
  // also accept cookie fallback
  if (!!validUser && user === validUser && pass === validPass) return true;
  const cookie = req.cookies.get('admin_auth')?.value ?? '';
  const [cu, ...cr] = cookie.split(':');
  return !!validUser && cu === validUser && cr.join(':') === validPass;
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token     = process.env.VERCEL_TOKEN ?? process.env.ANALYTICS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID ?? 'prj_CzuhuEPKOJJOaxxuMCp1HUHDeDqn';
  const teamId    = process.env.VERCEL_TEAM_ID    ?? 'team_PPsqarVrOJJcNwp8MhSedLMM';

  if (!token) return NextResponse.json({ error: 'no_token' }, { status: 500 });

  const now = Date.now();
  const day = 86_400_000;

  const params = new URLSearchParams({
    projectId,
    teamId,
    environment: 'production',
    filter:      '{}',
    from:        String(now - 30 * day),
    to:          String(now),
  });

  const [statsRes, pathsRes, devicesRes] = await Promise.all([
    fetch(`https://vercel.com/api/web/insights/stats?${params}`,         { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }),
    fetch(`https://vercel.com/api/web/insights/paths?${params}&limit=5`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }),
    fetch(`https://vercel.com/api/web/insights/devices?${params}`,       { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }),
  ]);

  const stats   = statsRes.ok   ? await statsRes.json()   : null;
  const paths   = pathsRes.ok   ? await pathsRes.json()   : null;
  const devices = devicesRes.ok ? await devicesRes.json() : null;

  return NextResponse.json({ stats, paths, devices });
}
