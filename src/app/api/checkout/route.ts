import { NextRequest, NextResponse } from 'next/server';
import { getDb, FieldValue } from '@/lib/firebase';

interface CheckoutItem { productId?: string; name: string; weight: string; qty: number; price: number; subtotal: number; }
interface CheckoutBody {
  customerName: string; customerPhone: string;
  deliveryMethod?: 'pickup' | 'delivery'; address?: string; note?: string;
  items: CheckoutItem[]; subtotal: number; total: number;
}

const MAX_ITEMS = 100;

// Merekam pesanan dari checkout website (portal) ke koleksi `orders` yang sama
// dengan yang dipakai admin panel, supaya masuk ke menu Pesanan bertanda source: 'portal'.
// Endpoint publik (tanpa auth) — hanya dipanggil oleh halaman /checkout sendiri.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<CheckoutBody>;
    const customerName  = (body.customerName ?? '').toString().trim();
    const customerPhone = (body.customerPhone ?? '').toString().trim();
    const items          = Array.isArray(body.items) ? body.items : [];
    const total          = Number(body.total) || 0;

    if (!customerName || !customerPhone || items.length === 0 || items.length > MAX_ITEMS || total <= 0) {
      return NextResponse.json({ error: 'Data pesanan tidak lengkap.' }, { status: 400 });
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
      invoiceNo, date, customerName, customerPhone,
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

    return NextResponse.json({ id: ref.id, invoiceNo });
  } catch (err) {
    console.error('[api/checkout]', err);
    return NextResponse.json({ error: 'Gagal menyimpan pesanan.' }, { status: 500 });
  }
}
