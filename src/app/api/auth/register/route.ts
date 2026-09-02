import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
import {
  normalizePhone, hashPassword, createSessionCookieValue,
  SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE,
} from '@/lib/customerAuth';

interface RegisterBody { name?: string; phone?: string; password?: string }

export async function POST(req: NextRequest) {
  const body: RegisterBody = await req.json().catch(() => ({}));
  const name = (body.name ?? '').toString().trim().slice(0, 100);
  const phone = normalizePhone((body.phone ?? '').toString());
  const password = (body.password ?? '').toString();

  if (!name || phone.length < 10 || phone.length > 15 || password.length < 6) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  const sql = getSql();
  const [existing] = await sql<{ id: string }[]>`select id from storefront_customers where id = ${phone}`;
  if (existing) {
    return NextResponse.json({ error: 'phone_taken' }, { status: 409 });
  }

  await sql`
    insert into storefront_customers (id, name, phone, password_hash, created_at)
    values (${phone}, ${name}, ${phone}, ${hashPassword(password)}, now())
  `;

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
