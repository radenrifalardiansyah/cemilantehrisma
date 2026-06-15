import { NextRequest, NextResponse } from 'next/server';

const PAGE_LABELS: Record<string, string> = {
  '/':          'Beranda 🏠',
  '/products':  'Menu Produk 🛒',
  '/reseller':  'Reseller 🤝',
  '/panduan':   'Panduan 📖',
  '/kontak':    'Kontak 📞',
  '/checkout':  'Checkout 💳',
};

function getPageLabel(path: string): string {
  if (PAGE_LABELS[path]) return PAGE_LABELS[path];
  if (path.startsWith('/products/')) return `Detail Produk 📦`;
  return path;
}

export async function POST(req: NextRequest) {
  try {
    const { device, page, browser, ref } = await req.json();

    const apiKey = process.env.CALLMEBOT_API_KEY;
    const phone  = process.env.NOTIFY_PHONE ?? '6281212132014';

    if (!apiKey) return NextResponse.json({ ok: false, reason: 'no_key' });

    const now = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'short',
      day:     '2-digit',
      month:   'short',
      year:    'numeric',
      hour:    '2-digit',
      minute:  '2-digit',
    });

    const refLine = ref && ref !== '(langsung)' ? `\n🔗 Dari: ${ref}` : '';

    const text =
      `🔔 *Pengunjung Baru — Cemilan Teh Risma*\n\n` +
      `${device}\n` +
      `🌐 Browser: ${browser}\n` +
      `📄 Halaman: ${getPageLabel(page)}` +
      refLine +
      `\n⏰ ${now} WIB`;

    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(text)}&apikey=${apiKey}`;

    await fetch(url, { cache: 'no-store' });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
