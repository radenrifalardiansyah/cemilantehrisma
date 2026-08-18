import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';
import { getSessionCustomer } from '@/lib/customerAuth';

interface OrderDoc {
  invoiceNo?: string; date?: string; status?: string; total?: number;
  deliveryMethod?: 'pickup' | 'delivery'; address?: string;
  items?: { name?: string; qty?: number; weight?: string; price?: number }[];
  createdAt?: { toMillis?: () => number };
}

export async function GET(req: NextRequest) {
  const session = await getSessionCustomer(req);
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  try {
    // Sorted in-memory instead of an .orderBy() on Firestore — an equality filter on
    // customerId plus an orderBy on a different field (createdAt) needs a composite
    // index; a single customer's order count is small enough this is cheaper overall.
    const snap = await getDb().collection('orders').where('customerId', '==', session.id).get();

    const withTimestamp = snap.docs.map(d => {
      const data = d.data() as OrderDoc;
      return {
        order: {
          id: d.id,
          invoiceNo: data.invoiceNo ?? d.id,
          date: data.date ?? '',
          status: data.status ?? 'baru',
          total: data.total ?? 0,
          deliveryMethod: data.deliveryMethod === 'delivery' ? 'delivery' as const : 'pickup' as const,
          address: data.address ?? '',
          items: (data.items ?? []).map(it => ({
            name: it.name ?? '', qty: it.qty ?? 1, weight: it.weight ?? '', price: it.price ?? 0,
          })),
        },
        createdAtMs: data.createdAt?.toMillis?.() ?? 0,
      };
    });

    const orders = withTimestamp
      .sort((a, b) => b.createdAtMs - a.createdAtMs)
      .map(w => w.order);

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('[api/orders/mine]', err);
    return NextResponse.json({ error: 'firebase_error', orders: [] }, { status: 500 });
  }
}
