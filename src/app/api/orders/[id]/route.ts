import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
import { getSessionCustomer } from '@/lib/customerAuth';
import { notify } from '@/lib/notifications';
import { rowToOrder, OrderRow } from '@/lib/orders-pg';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const session = await getSessionCustomer(req);
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const { id } = await ctx.params;
  const sql = getSql();
  const [row] = await sql<OrderRow[]>`select * from orders where id = ${id}`;
  if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (row.customer_id !== session.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const order = rowToOrder(row);
  return NextResponse.json({
    order: {
      id: order.id,
      invoiceNo: order.invoiceNo,
      status: order.status,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      transferBank: order.transferBank,
      transferProofUrl: order.transferProofUrl,
    },
  });
}

// Customer mengisi metode bayar & bukti transfer setelah upload ke Cloudinary
// (lihat /api/upload-payment-proof) — dipanggil dari halaman /pesanan/[id]/bayar.
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const session = await getSessionCustomer(req);
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const { id } = await ctx.params;
  const sql = getSql();
  const [row] = await sql<OrderRow[]>`select * from orders where id = ${id}`;
  if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (row.customer_id !== session.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (row.status === 'dibatalkan') return NextResponse.json({ error: 'order_cancelled' }, { status: 400 });

  const body = await req.json() as { paymentMethod?: string; transferBank?: string; transferProofUrl?: string };
  const paymentMethod = body.paymentMethod === 'qris' ? 'qris' : 'transfer';
  const transferProofUrl = (body.transferProofUrl ?? '').toString().trim();
  if (!transferProofUrl) return NextResponse.json({ error: 'Bukti pembayaran wajib diupload.' }, { status: 400 });

  await sql`
    update orders set
      payment_method = ${paymentMethod},
      transfer_bank = ${paymentMethod === 'transfer' ? (body.transferBank ?? '').toString().slice(0, 100) : null},
      transfer_proof_url = ${transferProofUrl},
      payment_status = 'belum_lunas',
      updated_at = now()
    where id = ${id}
  `;

  try {
    await notify({
      type: 'payment_proof',
      title: 'Bukti pembayaran diupload',
      message: `Pesanan ${row.invoice_no ?? id} sudah upload bukti transfer, menunggu verifikasi.`,
      link: 'orders',
      entityCollection: 'orders', entityId: id,
      actorUsername: session.name || session.phone,
    });
  } catch (err) {
    console.error('[api/orders/[id] PATCH] Failed to write notification', err);
  }

  return NextResponse.json({ ok: true });
}
