import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
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
    const sql = getSql();
    await sql`update storefront_customers set name = ${name}, updated_at = now() where id = ${session.id}`;
    return NextResponse.json({ customer: { ...session, name } });
  } catch (err) {
    console.error('[api/account/profile]', err);
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }
}
