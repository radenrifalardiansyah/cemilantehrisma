import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
import { getSessionCustomer } from '@/lib/customerAuth';
import { rowToOrder, OrderRow } from '@/lib/orders-pg';

export async function GET(req: NextRequest) {
  const session = await getSessionCustomer(req);
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  try {
    // `orders` pindah ke Postgres (Tahap 12 migrasi Fase 2 — lihat plan gleaming-wondering-quokka.md).
    const sql = getSql();
    const rows = await sql<OrderRow[]>`select * from orders where customer_id = ${session.id} order by created_at desc`;

    const orders = rows.map(row => {
      const o = rowToOrder(row);
      const items = o.items as { name?: string; qty?: number; weight?: string; price?: number }[];
      return {
        id: o.id,
        invoiceNo: o.invoiceNo,
        date: o.date,
        status: o.status,
        total: o.total,
        deliveryMethod: o.deliveryMethod,
        address: o.address,
        items: items.map(it => ({
          name: it.name ?? '', qty: it.qty ?? 1, weight: it.weight ?? '', price: it.price ?? 0,
        })),
        paymentStatus: o.paymentStatus,
        hasProof: !!o.transferProofUrl,
      };
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('[api/orders/mine]', err);
    return NextResponse.json({ error: 'db_error', orders: [] }, { status: 500 });
  }
}
