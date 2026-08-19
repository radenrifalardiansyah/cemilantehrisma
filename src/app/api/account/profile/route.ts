import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';
import { getSessionCustomer } from '@/lib/customerAuth';

export async function PATCH(req: NextRequest) {
  const session = await getSessionCustomer(req);
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { name?: string } | null;
  const name = body?.name?.trim();
  if (!name || name.length > 60) {
    return NextResponse.json({ error: 'invalid_name' }, { status: 400 });
  }

  try {
    await getDb().collection('storefront_customers').doc(session.id).update({ name });
    return NextResponse.json({ customer: { ...session, name } });
  } catch (err) {
    console.error('[api/account/profile]', err);
    return NextResponse.json({ error: 'firebase_error' }, { status: 500 });
  }
}
