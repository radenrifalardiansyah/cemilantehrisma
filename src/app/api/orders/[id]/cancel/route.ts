import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
import { getSessionCustomer } from '@/lib/customerAuth';
import { notify } from '@/lib/notifications';
import type { OrderRow } from '@/lib/orders-pg';

type Ctx = { params: Promise<{ id: string }> };

const conflict = (error: string) => NextResponse.json({ error }, { status: 409 });

// Pelanggan membatalkan pesanannya sendiri selama belum dibayar/diproses. Cek + tulis dalam satu
// transaksi dengan row lock supaya admin (upload bukti, lunas, proses, Closing) tidak bisa menyelip.
export async function POST(req: NextRequest, ctx: Ctx) {
  const session = await getSessionCustomer(req);
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const { id } = await ctx.params;
  const sql = getSql();

  try {
    const result = await sql.begin(async (tx) => {
      const [row] = await tx<OrderRow[]>`select * from orders where id = ${id} for update`;
      if (!row) return { res: NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 }) };
      if (row.customer_id !== session.id) return { res: NextResponse.json({ error: 'Pesanan ini bukan milik Anda.' }, { status: 403 }) };
      // Idempoten: sudah dibatalkan (oleh pelanggan, admin, atau cron) dianggap berhasil.
      if (row.status === 'dibatalkan') return { already: true as const };

      // Kolom dari migrasi admin bisa undefined bila belum dijalankan (`select *`).
      const extra = row as unknown as { closing_id?: string | null; stock_cut?: boolean | null; voucher_code?: string | null };
      if (row.status !== 'baru') return { res: conflict('Pesanan sudah selesai dan tidak bisa dibatalkan.') };
      if (row.payment_status !== 'belum_lunas') return { res: conflict('Pesanan sudah dibayar, hubungi admin untuk membatalkan.') };
      if (row.transfer_proof_url) return { res: conflict('Pesanan sudah ada bukti pembayaran, hubungi admin untuk membatalkan.') };
      if (row.fulfillment_status) return { res: conflict('Pesanan sudah diproses admin, hubungi kami untuk membatalkan.') };
      if (extra.closing_id || extra.stock_cut === true) return { res: conflict('Pesanan ini tidak bisa dibatalkan, hubungi admin.') };

      // Kuota voucher dikembalikan sekali (kode dikosongkan), sama dengan pembatalan oleh admin.
      if (extra.voucher_code) {
        await tx`update vouchers set used_count = greatest(used_count - 1, 0), updated_at = now() where code = ${extra.voucher_code}`;
        await tx`update orders set status = 'dibatalkan', voucher_code = null, updated_at = now() where id = ${id}`;
      } else {
        await tx`update orders set status = 'dibatalkan', updated_at = now() where id = ${id}`;
      }
      return { row };
    });

    if ('res' in result) return result.res;
    if ('already' in result) return NextResponse.json({ ok: true });

    try {
      await notify({
        type: 'order_cancelled',
        title: 'Pesanan dibatalkan pelanggan',
        message: `Pesanan ${result.row.invoice_no ?? id} dibatalkan oleh ${session.name || session.phone}.`,
        link: 'orders',
        entityCollection: 'orders', entityId: id,
        actorUsername: session.name || session.phone,
      });
    } catch (err) {
      console.error('[api/orders/[id]/cancel] Failed to write notification', err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/orders/[id]/cancel]', err);
    return NextResponse.json({ error: 'Gagal membatalkan pesanan. Coba lagi.' }, { status: 500 });
  }
}
