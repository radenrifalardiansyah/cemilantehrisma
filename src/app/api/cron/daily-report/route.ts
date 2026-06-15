import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';

const PAGE_LABELS: Record<string, string> = {
  home: 'Beranda', products: 'Menu Produk', reseller: 'Reseller',
  panduan: 'Panduan', kontak: 'Kontak', checkout: 'Checkout',
};

export async function GET(req: NextRequest) {
  // Vercel otomatis kirim Authorization: Bearer <CRON_SECRET>
  const auth = req.headers.get('authorization') ?? '';
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

  // Ambil data 7 hari terakhir
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });

  const snapshots = await Promise.all(
    days.map(day => getDb().collection('analytics').doc(day).get())
  );

  let totalViews = 0, totalMobile = 0, totalDesktop = 0;
  const visitorSet = new Set<string>();
  const pageAgg: Record<string, number> = {};

  for (let i = 0; i < snapshots.length; i++) {
    const snap = snapshots[i];
    if (!snap.exists) continue;
    const data = snap.data()!;
    totalViews   += Number(data.views   ?? 0);
    totalMobile  += Number(data.mobile  ?? 0);
    totalDesktop += Number(data.desktop ?? 0);
    const visArr = Array.isArray(data.visitors) ? (data.visitors as string[]) : [];
    for (const id of visArr) visitorSet.add(id);
    for (const [key, count] of Object.entries(data.pages ?? {})) {
      pageAgg[key] = (pageAgg[key] ?? 0) + Number(count);
    }
  }

  const topPages = Object.entries(pageAgg)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, count]) => `• ${PAGE_LABELS[key] ?? key}: ${count} pengunjung`)
    .join('\n');

  const date = new Date().toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const msg =
    `📊 *Rekap Cemilan Teh Risma*\n` +
    `📅 ${date}\n\n` +
    `👥 Total Pengunjung: ${visitorSet.size}\n` +
    `📄 Total Halaman Dibuka: ${totalViews}\n` +
    `📱 Mobile: ${totalMobile}  💻 Desktop: ${totalDesktop}\n\n` +
    (topPages ? `🔥 *Halaman Terpopuler:*\n${topPages}\n\n` : '') +
    `_Dikirim otomatis setiap pagi 07.00 WIB_`;

  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(msg)}&apikey=${apiKey}`;
  await fetch(url, { cache: 'no-store' });

  return NextResponse.json({ ok: true, views: totalViews, visitors: visitorSet.size });
}
