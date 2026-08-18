import { NextRequest, NextResponse } from 'next/server';
import { getDb, FieldValue } from '@/lib/firebase';
import { notify } from '@/lib/notifications';
import { getSessionCustomer } from '@/lib/customerAuth';
import { getMergedProduct } from '@/lib/server/getProduct';
import { products as staticProducts } from '@/lib/products';

interface CheckoutItem { productId?: string; name: string; weight: string; qty: number; price: number; subtotal: number; }
interface CheckoutBody {
  customerName: string;
  deliveryMethod?: 'pickup' | 'delivery'; address?: string; note?: string;
  items: CheckoutItem[]; subtotal: number; total: number;
}

const MAX_ITEMS = 100;

// Merekam pesanan dari checkout website (portal) ke koleksi `orders` yang sama
// dengan yang dipakai admin panel, supaya masuk ke menu Pesanan bertanda source: 'portal'.
// Wajib login (lihat /login) — order selalu terikat ke akun customer.
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionCustomer(req);
    if (!session) {
      return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
    }

    const body = await req.json() as Partial<CheckoutBody>;
    const customerName  = (body.customerName ?? '').toString().trim();
    // Nomor HP selalu dari akun yang login, bukan dari input client — supaya
    // pesanan tidak bisa dipalsukan mengatasnamakan nomor orang lain.
    const customerPhone = session.phone;
    const items          = Array.isArray(body.items) ? body.items : [];
    const total          = Number(body.total) || 0;

    if (!customerName || items.length === 0 || items.length > MAX_ITEMS || total <= 0) {
      return NextResponse.json({ error: 'Data pesanan tidak lengkap.' }, { status: 400 });
    }

    // Cek stok live (langsung ke Firestore, bukan lewat cache /api/products) sebelum
    // pesanan disimpan — mencegah order untuk item yang admin sudah tandai habis.
    const stockIssues: { name: string; reason: 'habis' | 'insufficient' | 'unknown'; available?: number }[] = [];
    for (const it of items) {
      const productId = (it.productId ?? '').toString().trim();
      if (!productId) continue;
      const qty = Math.max(1, Math.floor(Number(it.qty)) || 1);
      const live = await getMergedProduct(productId, staticProducts);
      if (!live) {
        stockIssues.push({ name: it.name || productId, reason: 'unknown' });
      } else if (live.stock === 'habis') {
        stockIssues.push({ name: live.name, reason: 'habis' });
      } else if (live.stock === 'ready' && typeof live.stockQty === 'number' && qty > live.stockQty) {
        stockIssues.push({ name: live.name, reason: 'insufficient', available: live.stockQty });
      }
    }
    if (stockIssues.length > 0) {
      return NextResponse.json({ error: 'stock_issue', items: stockIssues }, { status: 409 });
    }

    const cleanItems = items.slice(0, MAX_ITEMS).map(it => ({
      // productId dipakai admin untuk memotong stok gudang saat pesanan ditandai selesai —
      // fallback ke pencarian by-name kalau kosong (mis. item dari sesi lama sebelum field ini ada).
      productId: (it.productId ?? '').toString().trim(),
      name: (it.name ?? '').toString().slice(0, 200),
      weight: (it.weight ?? '').toString().slice(0, 50),
      qty: Math.max(1, Math.floor(Number(it.qty)) || 1),
      price: Number(it.price) || 0,
      subtotal: Number(it.subtotal) || 0,
    }));

    const now   = new Date();
    const pad   = (n: number) => n.toString().padStart(2, '0');
    const rand  = Math.floor(Math.random() * 900 + 100);
    const invoiceNo = `WEB-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}-${rand}`;
    const date  = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const db = getDb();
    const ref = await db.collection('orders').add({
      invoiceNo, date, customerName, customerPhone, customerId: session.id,
      deliveryMethod: body.deliveryMethod === 'delivery' ? 'delivery' : 'pickup',
      address: (body.address ?? '').toString().slice(0, 500),
      note: (body.note ?? '').toString().slice(0, 500),
      items: cleanItems,
      subtotal: Number(body.subtotal) || total,
      total,
      status: 'baru',
      source: 'portal',
      createdAt: FieldValue.serverTimestamp(),
    });

    try {
      await notify({
        type: 'order_new',
        title: 'Pesanan online baru',
        message: `Pesanan ${invoiceNo} senilai Rp${total.toLocaleString('id-ID')} — oleh ${customerName} (Online).`,
        link: 'orders',
        entityCollection: 'orders', entityId: ref.id,
        actorUsername: customerName,
      });
    } catch (err) {
      console.error('[api/checkout] Failed to write notification', err);
    }

    return NextResponse.json({ id: ref.id, invoiceNo });
  } catch (err) {
    console.error('[api/checkout]', err);
    return NextResponse.json({ error: 'Gagal menyimpan pesanan.' }, { status: 500 });
  }
}
