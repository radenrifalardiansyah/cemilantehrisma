import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';
import {
  normalizePhone, verifyPassword, createSessionCookieValue,
  SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE,
} from '@/lib/customerAuth';

interface LoginBody { phone?: string; password?: string }

export async function POST(req: NextRequest) {
  const body: LoginBody = await req.json().catch(() => ({}));
  const phone = normalizePhone((body.phone ?? '').toString());
  const password = (body.password ?? '').toString();

  if (!phone || !password) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  const doc = await getDb().collection('customers').doc(phone).get();
  const data = doc.data() as { name?: string; passwordHash?: string } | undefined;
  if (!doc.exists || !data?.passwordHash || !verifyPassword(password, data.passwordHash)) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  const name = data.name ?? '';
  const res = NextResponse.json({ ok: true, customer: { id: phone, name, phone } });
  res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(phone), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: '/',
  });
  return res;
}
