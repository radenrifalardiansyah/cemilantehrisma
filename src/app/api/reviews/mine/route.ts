import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';
import { getSessionCustomer } from '@/lib/customerAuth';

export async function GET(req: NextRequest) {
  const session = await getSessionCustomer(req);
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const db = getDb();

  const ordersSnap = await db.collection('orders').where('customerId', '==', session.id).get();
  const eligible = ordersSnap.docs.some(d => (d.data() as { status?: string }).status === 'selesai');

  const reviewDoc = await db.collection('reviews').doc(session.id).get();
  const data = reviewDoc.data() as { rating?: number; comment?: string; approved?: boolean } | undefined;
  const review = reviewDoc.exists
    ? { rating: data?.rating ?? 0, comment: data?.comment ?? '', approved: data?.approved ?? false }
    : null;

  return NextResponse.json({ eligible, review });
}
