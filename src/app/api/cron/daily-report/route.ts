import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsStats, PAGE_LABELS } from '@/lib/services/analyticsService';

export async function GET(req: NextRequest) {
  const auth   = req.headers.get('authorization') ?? '';
  const secret = process.env.CRON_SECRET ?? '';
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    return NextResponse.json({ error: 'no_firebase' }, { status: 500 });
  }

  const apiKey = process.env.CALLMEBOT_API_KEY;
  const phone  = process.env.NOTIFY_PHONE ?? '6281212132014';
  if (!apiKey) return NextResponse.json({ error: 'no_callmebot_key' }, { status: 500 });

  const { visitors, pageViews, mobile, desktop, pageAgg } = await getAnalyticsStats(7);

  const topPages = Object.entries(pageAgg)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, count], i) => `${i + 1}. ${PAGE_LABELS[key] ?? key} — ${count}x`)
    .join('\n');

  const date = new Date().toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const msg =
    `*Rekap Cemilan Teh Risma*\n` +
    `_${date}_\n\n` +
    `*Pengunjung:* ${visitors}\n` +
    `*Halaman Dibuka:* ${pageViews}\n` +
    `*Mobile:* ${mobile}  |  *Desktop:* ${desktop}\n` +
    (topPages ? `\n*Terpopuler:*\n${topPages}\n` : '') +
    `\n_Rekap otomatis 23.00 WIB_`;

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(msg)}&apikey=${apiKey}`;
  await fetch(url, { cache: 'no-store' });

  return NextResponse.json({ ok: true, views: pageViews, visitors });
}
