import { NextRequest, NextResponse } from 'next/server';
import { getDb, FieldValue } from '@/lib/firebase';
import { getSessionCustomer } from '@/lib/customerAuth';
import { notify } from '@/lib/notifications';

type Ctx = { params: Promise<{ id: string }> };

interface OrderDoc {
  invoiceNo?: string; status?: string; total?: number; customerId?: string;
  paymentMethod?: 'transfer' | 'qris'; paymentStatus?: 'lunas' | 'belum_lunas';
  transferBank?: string; transferProofUrl?: string;
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const session = await getSessionCustomer(req);
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const { id } = await ctx.params;
  const snap = await getDb().collection('orders').doc(id).get();
  if (!snap.exists) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const order = snap.data() as OrderDoc;
  if (order.customerId !== session.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  return NextResponse.json({
    order: {
      id: snap.id,
      invoiceNo: order.invoiceNo ?? snap.id,
      status: order.status ?? 'baru',
      total: order.total ?? 0,
      paymentMethod: order.paymentMethod ?? null,
      paymentStatus: order.paymentStatus ?? 'belum_lunas',
      transferBank: order.transferBank ?? '',
      transferProofUrl: order.transferProofUrl ?? '',
    },
  });
}

// Customer mengisi metode bayar & bukti transfer setelah upload ke Cloudinary
// (lihat /api/upload-payment-proof) — dipanggil dari halaman /pesanan/[id]/bayar.
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const session = await getSessionCustomer(req);
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const { id } = await ctx.params;
  const ref = getDb().collection('orders').doc(id);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const order = snap.data() as OrderDoc;
  if (order.customerId !== session.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (order.status === 'dibatalkan') return NextResponse.json({ error: 'order_cancelled' }, { status: 400 });

  const body = await req.json() as { paymentMethod?: string; transferBank?: string; transferProofUrl?: string };
  const paymentMethod = body.paymentMethod === 'qris' ? 'qris' : 'transfer';
  const transferProofUrl = (body.transferProofUrl ?? '').toString().trim();
  if (!transferProofUrl) return NextResponse.json({ error: 'Bukti pembayaran wajib diupload.' }, { status: 400 });

  await ref.update({
    paymentMethod,
    transferBank: paymentMethod === 'transfer' ? (body.transferBank ?? '').toString().slice(0, 100) : FieldValue.delete(),
    transferProofUrl,
    paymentStatus: 'belum_lunas',
    updatedAt: FieldValue.serverTimestamp(),
  });

  try {
    await notify({
      type: 'payment_proof',
      title: 'Bukti pembayaran diupload',
      message: `Pesanan ${order.invoiceNo ?? id} sudah upload bukti transfer, menunggu verifikasi.`,
      link: 'orders',
      entityCollection: 'orders', entityId: id,
      actorUsername: session.name || session.phone,
    });
  } catch (err) {
    console.error('[api/orders/[id] PATCH] Failed to write notification', err);
  }

  return NextResponse.json({ ok: true });
}
